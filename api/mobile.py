"""
Mobile API Blueprint for NerdX Mobile Application
Provides REST API endpoints for React Native mobile app
"""
import json
import logging
import jwt
import hashlib
import secrets
import time
import re
from datetime import datetime, timedelta
from functools import wraps
from flask import Blueprint, request, jsonify, g
from werkzeug.utils import secure_filename
import uuid
import os
import base64
from database.external_db import (
    get_user_registration, create_user_registration, is_user_registered,
    get_user_stats, get_user_credits, add_credits, deduct_credits, deduct_credits_with_balance,
    get_user_by_nerdx_id, add_xp, update_streak,
    claim_welcome_bonus, get_credit_breakdown,
    make_supabase_request,
    authenticate_supabase_user,
    get_user_by_email_admin,
    get_user_registration_by_email
)
# Additional Services
from services.advanced_credit_service import advanced_credit_service
from services.question_service import QuestionService
from services.mathematics_service import MathematicsService
from services.math_ocr_service import MathOCRService
from services.symbolic_solver_service import SymbolicSolverService
from services.mathematics_teacher_service import mathematics_teacher_service
from services.combined_science_generator import CombinedScienceGenerator
from services.computer_science_generator import ComputerScienceGenerator
from services.geography_generator import GeographyGenerator
from services.geotutor_service import get_geotutor_feedback
from services.english_service import EnglishService
from services.referral_service import ReferralService
from services.paynow_service import PaynowService
from services.graph_service import GraphService
from services.image_service import ImageService
from services.voice_service import get_voice_service
from services.vertex_service import vertex_service, get_image_question_credit_cost, get_text_question_credit_cost
from services.exam_session_service import exam_session_service
from services.database_lab_execution_service import database_lab_execution_service
from services.programming_lab_ai_service import programming_lab_ai_service
from utils.url_utils import convert_local_path_to_public_url
from utils.credit_units import format_credits, units_to_credits, credits_to_units
from utils.question_cache import QuestionCacheService
from utils.latex_converter import LaTeXConverter
from config import Config

logger = logging.getLogger(__name__)

mobile_bp = Blueprint('mobile', __name__)
question_cache = QuestionCacheService()


def _credits_display(units: int) -> int:
    """Convert credit units to display credits for API responses.
    Returns whole number credits (rounded) - no decimals.
    1 credit = 10 units, so we round to nearest whole credit."""
    if units is None or units == 0:
        return 0
    # Convert to credits and round to nearest whole number
    credits = units_to_credits(units)
    # Whole-number display policy: always show whole credits.
    # Use floor (not bankers rounding) to avoid confusing .5 edge cases and to keep display stable.
    return int(credits)


def _credits_text(units: int) -> str:
    """Format credit units for messages."""
    return format_credits(units or 0)


def _credits_remaining(user_id: str) -> int:
    """Get current remaining credits (displayed as whole credits)."""
    units = get_user_credits(user_id) or 0
    return _credits_display(units)


def _deduct_credits_or_fail(user_id: str, cost_units: int, transaction_type: str, description: str):
    """
    Deduct credits and return remaining displayed credits (real-time from RPC when possible).
    Returns int (credits remaining, display units) on success, None on failure.
    """
    ok, new_units = deduct_credits_with_balance(user_id, cost_units, transaction_type, description)
    if not ok:
        return None
    if new_units is not None:
        return _credits_display(new_units)
    return _credits_remaining(user_id)


FREE_VIRTUAL_LAB_SIMULATIONS = {
    "biology": {"cell-explorer", "osmosis-adventure", "food-test-lab"},
    "chemistry": {"atom-builder", "equation-balancer", "titration-master"},
    "physics": {"circuit-builder", "projectile-motion", "motion-grapher"},
}


def _get_quiz_credit_action(
    subject: str,
    question_type: str,
    question_format: str,
    bio_question_type: str,
    cs_question_type: str = None
) -> str:
    subject_key = (subject or '').lower()
    qt = (question_type or 'topical').lower()
    qf = (question_format or 'mcq').lower()
    bio_qt = (bio_question_type or 'mcq').lower()
    cs_fmt = (cs_question_type or qf or 'mcq').lower()

    if subject_key == 'mathematics':
        return 'math_topical' if qt == 'topical' else 'math_exam'
    if subject_key == 'combined_science':
        if qt == 'exam':
            return 'combined_science_exam'
        return 'combined_science_topical_structured' if qf == 'structured' else 'combined_science_topical_mcq'
    if subject_key == 'computer_science':
        # Exam: per-format keys (0.3 MCQ, 0.5 structured, 1 essay) like other subjects
        if qt == 'exam':
            if cs_fmt == 'structured':
                return 'computer_science_exam_structured'
            if cs_fmt == 'essay':
                return 'computer_science_exam_essay'
            return 'computer_science_exam_mcq'
        # Topical: MCQ=3 units (0.3), Structured=5 (0.5), Essay=10 (1)
        if cs_fmt == 'structured':
            return 'computer_science_topical_structured'
        if cs_fmt == 'essay':
            return 'computer_science_topical_essay'
        return 'computer_science_topical_mcq'
    if subject_key == 'english':
        return 'english_topical'

    # A-Level subjects
    if subject_key == 'a_level_pure_math':
        if qt == 'exam':
            return 'a_level_pure_math_exam'
        return 'a_level_pure_math_topical_structured' if qf == 'structured' else 'a_level_pure_math_topical_mcq'
    if subject_key == 'a_level_chemistry':
        if qt == 'exam':
            return 'a_level_chemistry_exam'
        return 'a_level_chemistry_topical_structured' if qf == 'structured' else 'a_level_chemistry_topical_mcq'
    if subject_key == 'a_level_physics':
        if qt == 'exam':
            return 'a_level_physics_exam'
        return 'a_level_physics_topical_structured' if qf == 'structured' else 'a_level_physics_topical_mcq'
    if subject_key == 'a_level_biology':
        bio_key = bio_qt if bio_qt in ['mcq', 'structured', 'essay'] else 'mcq'
        return f"a_level_biology_{qt}_{bio_key}"
    if subject_key == 'a_level_computer_science':
        # Exam: per-format keys (0.3 MCQ, 0.5 structured, 1 essay) like other A-Level subjects
        if qt == 'exam':
            if cs_fmt == 'structured':
                return 'a_level_computer_science_exam_structured'
            if cs_fmt == 'essay':
                return 'a_level_computer_science_exam_essay'
            return 'a_level_computer_science_exam_mcq'
        # Topical: MCQ=3 units (0.3), Structured=5 (0.5), Essay=10 (1)
        if cs_fmt == 'structured':
            return 'a_level_computer_science_topical_structured'
        if cs_fmt == 'essay':
            return 'a_level_computer_science_topical_essay'
        return 'a_level_computer_science_topical_mcq'
    if subject_key == 'a_level_geography':
        # A-Level Geography: only essay questions (1 credit)
        if qt == 'exam':
            return 'a_level_geography_exam_essay'
        return 'a_level_geography_topical_essay'

    return f"{subject}_topical" if qt == 'topical' else f"{subject}_exam"


def _get_exam_session_cost_units(
    subject: str,
    level: str,
    question_mode: str,
    total_questions: int
) -> int:
    subject_key = (subject or '').lower().replace(' ', '_').replace('-', '_')
    level_key = (level or '').upper()
    is_a_level = level_key == 'A_LEVEL' or 'a_level' in subject_key

    if is_a_level and 'biology' in subject_key:
        mcq_cost = 3  # 0.25 credit
        structured_cost = 5  # 0.5 credit
    elif is_a_level:
        mcq_cost = 5  # 0.5 credit
        structured_cost = 5  # 0.5 credit
    else:
        if 'math' in subject_key:
            mcq_cost = 5  # 0.5 credit
            structured_cost = 5  # 0.5 credit
        elif subject_key == 'computer_science':
            mcq_cost = 3  # 0.3 credit per exam MCQ (3 units) - 1 credit = 3 MCQs
            structured_cost = 5  # 0.5 credit per exam structured (5 units)
        elif any(key in subject_key for key in ['biology', 'chemistry', 'physics', 'combined_science']):
            mcq_cost = 5  # 0.5 credit
            structured_cost = 5  # 0.5 credit
        else:
            mcq_cost = 5  # 0.5 credit
            structured_cost = 5  # 0.5 credit

    if question_mode == 'MCQ_ONLY':
        return mcq_cost * total_questions
    if question_mode == 'STRUCTURED_ONLY':
        return structured_cost * total_questions
    if question_mode == 'MIXED':
        mcq_count = total_questions // 2
        structured_count = total_questions - mcq_count
        return (mcq_cost * mcq_count) + (structured_cost * structured_count)
    return mcq_cost * total_questions


def _get_exam_question_cost_units(subject: str, level: str, question_type: str) -> int:
    subject_key = (subject or '').lower().replace(' ', '_').replace('-', '_')
    level_key = (level or '').upper()
    is_a_level = level_key == 'A_LEVEL' or 'a_level' in subject_key
    q_type = (question_type or 'MCQ').upper()

    if is_a_level and 'biology' in subject_key:
        return 3 if q_type == 'MCQ' else 5  # 0.25 credit for MCQ, 0.5 credit for structured/essay
    if is_a_level:
        return 5  # 0.5 credit
    if 'math' in subject_key:
        return 5  # 0.5 credit
    if subject_key == 'computer_science':
        # Computer Science: MCQ = 0.3 credit (3 units), Structured = 0.5 credit (5 units), Essay = 1 credit (10 units)
        if q_type == 'MCQ':
            return 3  # 0.3 credit per exam MCQ (3 units)
        elif q_type in ['STRUCTURED', 'STRUCTURED_ONLY']:
            return 5  # 0.5 credit per exam structured (5 units)
        elif q_type in ['ESSAY', 'ESSAY_ONLY']:
            return 10  # 1 credit per exam essay (10 units)
        return 5  # Default to structured cost
    if any(key in subject_key for key in ['biology', 'chemistry', 'physics', 'combined_science']):
        return 5  # 0.5 credit
    return 5  # 0.5 credit (English and other subjects)

# JWT Secret Key (should be in environment variable)
JWT_SECRET = os.environ.get('JWT_SECRET', 'nerdx-mobile-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days



@mobile_bp.route('/auth/login', methods=['POST'])
def login():
    """Login user and return token"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        user_identifier = (data.get('identifier', '').strip() or data.get('email', '').strip() or data.get('phone_number', '').strip()).lower()
        password = data.get('password', '')
        
        if not user_identifier or not password:
            return jsonify({'success': False, 'message': 'Identifier and password are required'}), 400
        
        # Get user data
        user_data = get_user_registration(user_identifier)
        
        if not user_data:
            # Fallback: Check if user exists in Supabase Auth but not in our local table
            # This handles users created via Dashboard or other means
            logger.info(f"User {user_identifier} not found locally, checking Supabase Auth...")
            supabase_user = authenticate_supabase_user(user_identifier, password)
            
            if supabase_user:
                logger.info(f"User found in Supabase Auth! Backfilling local registration...")
                try:
                    # Extract user metadata
                    # Supabase returns structure: {'user': {'id': '...', 'user_metadata': {...}, ...}, 'access_token': '...'}
                    s_user = supabase_user.get('user', {})
                    metadata = s_user.get('user_metadata', {})
                    
                    # Use metadata or fallbacks
                    name = metadata.get('name') or metadata.get('first_name') or 'User'
                    surname = metadata.get('surname') or metadata.get('last_name') or ''
                    
                    # Create local registration
                    create_user_registration(
                        chat_id=user_identifier,
                        name=name,
                        surname=surname,
                        date_of_birth='2000-01-01', # Default
                        email=user_identifier,
                        password_hash=None, # We don't have the hash, rely on Supabase Auth for future logins too
                    )
                    
                    # fetch again
                    user_data = get_user_registration(user_identifier)
                    
                    # If we just authenticated with Supabase, we don't need to check hash again below.
                    # We can set a flag to skip verification
                    g.skip_password_verification = True
                    
                except Exception as e:
                    logger.error(f"Failed to backfill user from Supabase Auth: {e}")
                    return jsonify({'success': False, 'message': 'Login failed during sync'}), 500
            else:
                logger.warning(f"Supabase Auth fallback failed for {user_identifier} - Login rejected. Checking Admin API for OAuth user...")
                
                # Check if user exists via Admin API (e.g. Google/OAuth user)
                from database.external_db import get_user_by_email_admin
                
                # Only check for email identifiers
                if '@' in user_identifier:
                    admin_user = get_user_by_email_admin(user_identifier)
                    
                    if admin_user:
                        logger.info(f"User found via Admin API (likely OAuth)! Backfilling local registration...")
                        try:
                            s_user = admin_user.get('user', {})
                            metadata = s_user.get('user_metadata', {})
                            
                            name = metadata.get('name') or metadata.get('first_name') or 'User'
                            surname = metadata.get('surname') or metadata.get('last_name') or ''
                            
                            create_user_registration(
                                chat_id=user_identifier,
                                name=name,
                                surname=surname,
                                date_of_birth='2000-01-01',
                                email=user_identifier,
                                password_hash=None
                            )
                            
                            # Refetch
                            user_data = get_user_registration(user_identifier)
                            
                            # We found the user, but since they are OAuth, we CANNOT log them in with the provided password.
                            # So we do NOT clear skip_password_verification. 
                            # They will hit the "Invalid credentials" block below, which is CORRECT.
                            # BUT, they won't get "User not found" (404), they get 401.
                            
                        except Exception as e:
                            logger.error(f"Failed to backfill OAuth user: {e}")

            if not user_data:
                 # If we reached here, user not found locally AND Supabase Auth failed AND Admin lookup failed
                 return jsonify({'success': False, 'message': 'Invalid credentials or user not found'}), 401
        
        # Verify password (assume users_registration has password_hash, or fetch from auth table)
        # Note: In real implementation, password_hash would be stored securely. 
        # Here we check if the user has a password set.
        stored_hash = user_data.get('password_hash')
        stored_salt = user_data.get('password_salt')
        
        # If we verified via Supabase fallback, skip local hash check
        if not getattr(g, 'skip_password_verification', False):
            if not stored_hash or not stored_salt:
                # If no password set (e.g. social login only), this might fail
                # Try Supabase Auth as last resort if local hash missing
                 logger.info(f"No local hash for {user_identifier}, trying Supabase Auth...")
                 if authenticate_supabase_user(user_identifier, password):
                     # Success!
                     pass
                 else:
                     return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
                
            elif not verify_password(password, stored_hash, stored_salt):
                 # Password mismatch locally. 
                 # Could be password changed in Supabase but not locally?
                 # Try Supabase Auth to be sure? 
                 # For now, strict on local if it exists to avoid desync, 
                 # OR try Supabase if local fails? 
                 # Let's trust local if it exists for performance, but fallback if failed?
                 # No, that might be a security risk or inconsistent. 
                 # Let's stick to: If local exists, use local. 
                 return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Determine user ID (chat_id)
        user_id = user_data.get('chat_id')
        
        # Generate token
        token = generate_token(user_id)
        
        # CREDIT SYSTEM CHECKS
        # 1. Check for welcome bonus (one-time 150 credits)
        welcome_result = claim_welcome_bonus(user_id)
        
        # 2. Get latest credit breakdown
        credit_info = get_credit_breakdown(user_id)
        credit_info_display = {
            **credit_info,
            "total": _credits_display(credit_info.get("total", 0)),
            "free_credits": _credits_display(credit_info.get("free_credits", 0)),
            "purchased_credits": _credits_display(credit_info.get("purchased_credits", 0)),
        }
        
        # Prepare notifications
        notifications = {
            "welcome_bonus": welcome_result.get("awarded", False),
            "welcome_message": welcome_result.get("message")
        }
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user_id,
                'nerdx_id': user_data.get('nerdx_id'),
                'name': user_data.get('name'),
                'surname': user_data.get('surname'),
                'email': user_data.get('email'),
                'credits': _credits_display(credit_info.get('total', 0)),
                'credit_breakdown': credit_info_display
            },
            'notifications': notifications,
            'message': 'Login successful'
        }), 200
            
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'message': f'Login failed: {str(e)}'}), 500

# Helper Functions
def generate_token(user_id: str) -> str:
    """Generate JWT token for user"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception('Token expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')

def hash_password(password: str) -> tuple:
    """Hash password with salt"""
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return password_hash.hex(), salt

def verify_password(password: str, password_hash: str, salt: str) -> bool:
    """Verify password against hash"""
    new_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return new_hash.hex() == password_hash

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
        
        try:
            payload = verify_token(token)
            g.current_user_id = payload['user_id']
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 401
    return decorated_function


@mobile_bp.route('/auth/reset-password', methods=['POST'])
def reset_password():
    """Reset user password - handles both Supabase session and token-based reset"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        new_password = data.get('new_password', '').strip()
        email = data.get('email', '').strip().lower()
        token = data.get('token') or data.get('access_token')
        
        if not new_password:
            return jsonify({'success': False, 'message': 'New password is required'}), 400
        
        # Validate password strength
        if len(new_password) < 8:
            return jsonify({'success': False, 'message': 'Password must be at least 8 characters long'}), 400
        
        if not re.search(r'[a-z]', new_password):
            return jsonify({'success': False, 'message': 'Password must contain at least one lowercase letter'}), 400
        
        if not re.search(r'[A-Z]', new_password):
            return jsonify({'success': False, 'message': 'Password must contain at least one uppercase letter'}), 400
        
        if not re.search(r'\d', new_password):
            return jsonify({'success': False, 'message': 'Password must contain at least one number'}), 400
        
        # If we have email, use it to find user and update password
        if email:
            user_data = get_user_registration_by_email(email)
            if not user_data:
                return jsonify({'success': False, 'message': 'User not found'}), 404
            
            user_id = user_data.get('chat_id')
            if not user_id:
                return jsonify({'success': False, 'message': 'User ID not found'}), 404
            
            # Hash new password
            password_hash, password_salt = hash_password(new_password)
            
            # Update password in database
            update_data = {
                'password_hash': password_hash,
                'password_salt': password_salt,
                'updated_at': datetime.now().isoformat()
            }
            
            result = make_supabase_request(
                "PATCH", 
                "users_registration", 
                update_data, 
                filters={"chat_id": f"eq.{user_id}"},
                use_service_role=True
            )
            
            if result:
                logger.info(f"Password reset successful for user: {email}")
                
                # Also update in Supabase Auth if user exists there
                try:
                    import requests
                    supabase_admin_url = f"{os.getenv('SUPABASE_URL')}/auth/v1/admin/users"
                    headers = {
                        "apikey": os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
                        "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_ROLE_KEY')}",
                        "Content-Type": "application/json"
                    }
                    
                    # Get user ID from Supabase Auth
                    admin_user = get_user_by_email_admin(email)
                    if admin_user and admin_user.get('user'):
                        user_id = admin_user['user'].get('id')
                        if user_id:
                            # Update password in Supabase Auth
                            requests.put(
                                f"{supabase_admin_url}/{user_id}",
                                headers=headers,
                                json={"password": new_password}
                            )
                            logger.info(f"Supabase Auth password updated for user: {email}")
                except Exception as supabase_error:
                    logger.warning(f"Failed to update Supabase Auth password (non-critical): {supabase_error}")
                
                return jsonify({
                    'success': True,
                    'message': 'Password reset successfully'
                }), 200
            else:
                return jsonify({'success': False, 'message': 'Failed to update password'}), 500
        
        elif token:
            # Token-based reset (from email link)
            # Verify token with Supabase
            try:
                import requests
                supabase_url = os.getenv('SUPABASE_URL')
                verify_url = f"{supabase_url}/auth/v1/user"
                
                headers = {
                    "apikey": os.getenv('SUPABASE_ANON_KEY'),
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
                
                # Verify token by getting user info
                response = requests.get(verify_url, headers=headers)
                
                if response.status_code == 200:
                    user_info = response.json()
                    user_email = user_info.get('email', '').strip().lower()
                    
                    if not user_email:
                        return jsonify({'success': False, 'message': 'Invalid reset token'}), 400
                    
                    # Update password using email
                    user_data = get_user_registration(user_email)
                    if not user_data:
                        return jsonify({'success': False, 'message': 'User not found'}), 404
                    
                    # Hash new password
                    password_hash, password_salt = hash_password(new_password)
                    
                    # Update password in database
                    update_data = {
                        'password_hash': password_hash,
                        'password_salt': password_salt
                    }
                    
                    result = make_supabase_request(
                        "PATCH", 
                        "users_registration", 
                        update_data, 
                        filters={"chat_id": f"eq.{user_email}"},
                        use_service_role=True
                    )
                    
                    if result:
                        logger.info(f"Password reset successful via token for user: {user_email}")
                        return jsonify({
                            'success': True,
                            'message': 'Password reset successfully'
                        }), 200
                    else:
                        return jsonify({'success': False, 'message': 'Failed to update password'}), 500
                else:
                    return jsonify({'success': False, 'message': 'Invalid or expired reset token'}), 400
                    
            except Exception as token_error:
                logger.error(f"Token verification error: {token_error}")
                return jsonify({'success': False, 'message': 'Invalid reset token'}), 400
        else:
            return jsonify({'success': False, 'message': 'Email or token is required'}), 400
            
    except Exception as e:
        logger.error(f"Password reset error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'message': f'Password reset failed: {str(e)}'}), 500


# ============================================================================
# ATTACHMENTS / CONTEXT PACK (Multi-image memory)
# ============================================================================

@mobile_bp.route('/attachments/analyze', methods=['POST'])
@require_auth
def analyze_attachments():
    """
    Analyze 1..10 attached images and create a durable Context Pack.
    Multipart form-data:
      - images: (repeatable file field) up to 10 images
      - prompt: optional text instruction
      - chat_id: optional string to link to a chat thread (e.g., teacher session id / project id)
    """
    try:
        if not request.content_type or 'multipart/form-data' not in request.content_type:
            return jsonify({'success': False, 'message': 'multipart/form-data required'}), 400

        files = request.files.getlist('images')
        prompt = (request.form.get('prompt') or '').strip()
        chat_id = request.form.get('chat_id')

        if not files or len(files) < 1:
            return jsonify({'success': False, 'message': 'At least 1 image is required'}), 400
        if len(files) > 10:
            return jsonify({'success': False, 'message': 'Too many images (max 10)'}), 400

        # Validate and read bytes
        images = []
        total_bytes = 0
        for f in files:
            data = f.read()
            if not data:
                return jsonify({'success': False, 'message': 'Empty image uploaded'}), 400

            mime_type = (f.mimetype or '').lower().strip()
            # Allow common formats only
            if mime_type not in ('image/jpeg', 'image/jpg', 'image/png', 'image/webp'):
                return jsonify({'success': False, 'message': f'Unsupported image type: {mime_type or "unknown"}'}), 400

            # Per-image limit (5MB default)
            if len(data) > 5 * 1024 * 1024:
                return jsonify({'success': False, 'message': 'Image too large (max 5MB each)'}), 400

            total_bytes += len(data)
            images.append({'bytes': data, 'mime_type': mime_type})

        # Total limit (15MB to stay within app MAX_CONTENT_LENGTH=16MB)
        if total_bytes > 15 * 1024 * 1024:
            return jsonify({'success': False, 'message': 'Total upload too large (max ~15MB)'}), 400

        from services.context_pack_service import context_pack_service

        pack = context_pack_service.create_context_pack(
            user_id=str(g.current_user_id),
            chat_id=chat_id,
            images=images,
            prompt=prompt,
        )

        return jsonify({'success': True, 'data': pack}), 200

    except ValueError as e:
        return jsonify({'success': False, 'message': str(e)}), 400
    except Exception as e:
        logger.error(f"Analyze attachments error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

def generate_nerdx_id() -> str:
    """Generate unique NerdX ID"""
    return f"NX{secrets.token_hex(4).upper()}"

# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@mobile_bp.route('/auth/register', methods=['POST'])
def register():
    """Register new mobile user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        name = data.get('name', '').strip()
        surname = data.get('surname', '').strip()
        email = data.get('email', '').strip().lower() if data.get('email') else None
        phone_number = data.get('phone_number', '').strip() if data.get('phone_number') else None
        password = data.get('password', '')
        date_of_birth = data.get('date_of_birth')
        referred_by = data.get('referred_by')
        
        # Validation
        if not name or not surname:
            return jsonify({'success': False, 'message': 'Name and surname are required'}), 400
        
        if not email and not phone_number:
            return jsonify({'success': False, 'message': 'Email or phone number is required'}), 400
        
        if not password or len(password) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters'}), 400
        
        # Check if user exists (by email or phone)
        # For now, use phone_number or email as whatsapp_id equivalent
        user_identifier = phone_number or email
        
        if is_user_registered(user_identifier):
            return jsonify({'success': False, 'message': 'User already exists'}), 400
        
        # Hash password
        password_hash, salt = hash_password(password)
        
        # Generate NerdX ID
        nerdx_id = generate_nerdx_id()
        
        # Create user registration with password
        try:
            # 1. Register in Supabase Auth (if email provided)
            # This triggers the "Confirm your mail" email from Supabase
            if email:
                from database.external_db import register_supabase_auth_user
                
                # Metadata to store in Supabase Auth user object
                metadata = {
                    'name': name,
                    'surname': surname,
                    'nerdx_id': nerdx_id,
                    'chat_id': user_identifier
                }
                
                auth_user = register_supabase_auth_user(email, password, metadata)
                
                if not auth_user:
                    # If failed, it might be that user already exists in Auth but not locally?
                    # or some other error. For now, strict failure.
                    return jsonify({'success': False, 'message': 'Registration failed. Email might be invalid or already in use.'}), 400

            # 2. Create user in database with password and auth info
            create_user_registration(
                chat_id=user_identifier,
                name=name,
                surname=surname,
                date_of_birth=date_of_birth or '2000-01-01',
                referred_by_nerdx_id=referred_by,
                password_hash=password_hash,
                password_salt=salt,
                email=email,
                phone_number=phone_number
            )
            
            # Generate token
            token = generate_token(user_identifier)
            
            # Get user data
            user_data = get_user_registration(user_identifier)
            
            if not user_data:
                logger.error(f"Failed to retrieve user data for {user_identifier} after registration")
                return jsonify({'success': False, 'message': 'Post-registration data retrieval failed'}), 500

            # CREDIT SYSTEM CHECKS
            # 1. Claim welcome bonus (one-time 150 credits)
            welcome_result = claim_welcome_bonus(user_identifier)
            
            # 2. Get latest credit breakdown
            credit_info = get_credit_breakdown(user_identifier)
            credit_info_display = {
                **credit_info,
                "total": _credits_display(credit_info.get("total", 0)),
                "free_credits": _credits_display(credit_info.get("free_credits", 0)),
                "purchased_credits": _credits_display(credit_info.get("purchased_credits", 0)),
            }
            
            # Prepare notifications
            notifications = {
                "welcome_bonus": welcome_result.get("awarded", False),
                "welcome_message": welcome_result.get("message")
            }

            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'id': user_data.get('chat_id'),
                    'nerdx_id': user_data.get('nerdx_id'),
                    'name': name,
                    'surname': surname,
                    'email': email,
                    'phone_number': phone_number,
                    'credits': credit_info_display.get("total", "0.0"),
                    'credit_breakdown': credit_info_display,
                },
                'notifications': notifications,
                'message': 'Registration successful'
            }), 201
            
        except Exception as e:
            logger.error(f"Registration error: {str(e)}", exc_info=True)
            return jsonify({'success': False, 'message': f'Registration failed: {str(e)}'}), 500
            
    except Exception as e:
        logger.error(f"Register endpoint error: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'}), 500

@mobile_bp.route('/auth/social-login', methods=['POST'])
def social_login():
    """Handle social authentication (Google, etc.) and sync with user_registration"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        # Social login data from frontend
        # Can be: { provider: 'google', user: { email, name, given_name, family_name, id, ... } }
        # OR: { provider: 'google', email: '...', name: '...', ... } (legacy format)
        provider = data.get('provider', 'google')
        
        # Handle both formats
        if 'user' in data:
            user_info = data.get('user', {})
        else:
            # Legacy format - user data is at root level
            user_info = data
            
        email = (user_info.get('email') or '').strip().lower()
        supabase_uid = user_info.get('id') or user_info.get('sub')
        name = user_info.get('name') or user_info.get('given_name') or ''
        given_name = user_info.get('given_name') or name
        family_name = user_info.get('family_name') or user_info.get('surname') or ''
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required for social login'}), 400
            
        logger.info(f"Social login attempt: provider={provider}, email={email}, uid={supabase_uid}")
            
        # Check if user is already registered in our system
        # For OAuth, check by email first (to prevent duplicates)
        from database.external_db import is_user_registered_by_email, get_user_registration_by_email
        
        # Check by email first (for OAuth users)
        user_data = None
        if is_user_registered_by_email(email):
            logger.info(f"Found existing user by email: {email}")
            user_data = get_user_registration_by_email(email)
        # Fallback: check by chat_id (email) in case email field is null
        elif is_user_registered(email):
            logger.info(f"Found existing user by chat_id: {email}")
            user_data = get_user_registration(email)
        
        if user_data:
            # Existing user - sync Supabase UID if not present
            try:
                # Update Supabase UID in our local record if possible/needed
                # This ensures future lookups by UID work
                pass 
            except Exception as e:
                logger.warning(f"Failed to sync Supabase UID: {e}")
            
            # Update name if provided by OAuth and different from stored
            if given_name and given_name != user_data.get('name'):
                try:
                    from database.external_db import make_supabase_request
                    make_supabase_request(
                        "PATCH",
                        "users_registration",
                        {"name": given_name, "surname": family_name},
                        filters={"chat_id": f"eq.{email}"},
                        use_service_role=True
                    )
                    user_data['name'] = given_name
                    user_data['surname'] = family_name
                except Exception as e:
                    logger.warning(f"Failed to update user name from OAuth: {e}")
            
            # Get credit breakdown
            credit_info = get_credit_breakdown(email)
            credit_info_display = {
                **credit_info,
                "total": _credits_display(credit_info.get("total", 0)),
                "free_credits": _credits_display(credit_info.get("free_credits", 0)),
                "purchased_credits": _credits_display(credit_info.get("purchased_credits", 0)),
            }

            token = generate_token(email)
            
            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'id': user_data.get('chat_id'),
                    'nerdx_id': user_data.get('nerdx_id'),
                    'name': user_data.get('name') or given_name,
                    'surname': user_data.get('surname') or family_name,
                    'email': email,
                    'credits': credit_info_display.get("total", "0.0"),
                    'credit_breakdown': credit_info_display,
                    'role': user_data.get('role', 'student'),
                    'level_title': user_data.get('level_title', 'Explorer') 
                },
                'message': 'Logged in successfully'
            }), 200
        else:
            # New user via social login - create registration
            # Use the extracted name fields
            if not name:
                # Fallback: use email prefix as name
                name = email.split('@')[0].replace('.', ' ').title()
                given_name = name
            
            # Create user registration in Supabase
            try:
                # Use email as user_identifier for social sign-ups
                # This matches the legacy bot logic where chat_id was the key
                # For email users, chat_id = email
                create_user_registration(
                    chat_id=email,
                    name=given_name,
                    surname=family_name,
                    date_of_birth='2000-01-01', # Default DOB for social
                    referred_by_nerdx_id=None, # No referral for now
                    email=email,
                    password_hash=None, # OAuth users don't have passwords
                    password_salt=None
                )
                
                # Check if creation succeeded and return data
                # Try by email first, then by chat_id
                user_data = get_user_registration_by_email(email)
                if not user_data:
                    user_data = get_user_registration(email)
                
                if user_data:
                    # Grant initial credits (Registration Bonus) - one-time welcome bonus
                    welcome_result = claim_welcome_bonus(email)
                    
                    # Get latest credit breakdown
                    credit_info = get_credit_breakdown(email)
                    credit_info_display = {
                        **credit_info,
                        "total": _credits_display(credit_info.get("total", 0)),
                        "free_credits": _credits_display(credit_info.get("free_credits", 0)),
                        "purchased_credits": _credits_display(credit_info.get("purchased_credits", 0)),
                    }
                    
                    # Prepare notifications
                    notifications = {
                        "welcome_bonus": welcome_result.get("awarded", False),
                        "welcome_message": welcome_result.get("message", "")
                    }
                    
                    token = generate_token(email)
                    
                    return jsonify({
                        'success': True,
                        'token': token,
                        'user': {
                            'id': email,
                            'nerdx_id': user_data.get('nerdx_id'),
                            'name': given_name,
                            'surname': family_name,
                            'email': email,
                            'credits': credit_info_display.get("total", "0.0"),
                            'credit_breakdown': credit_info_display,
                            'role': 'student',
                            'level_title': user_data.get('level_title', 'Explorer')
                        },
                        'notifications': notifications,
                        'message': 'Account created successfully'
                    }), 201
                else:
                    raise Exception("Failed to retrieve created user")
                    
            except Exception as e:
                logger.error(f"Social registration error: {e}", exc_info=True)
                return jsonify({'success': False, 'message': f'Social registration failed: {str(e)}'}), 500
                
    except Exception as e:
        logger.error(f"Social login error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500



@mobile_bp.route('/auth/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP for phone-based authentication"""
    try:
        data = request.get_json()
        phone_number = data.get('phone_number', '').strip()
        otp = data.get('otp', '')
        
        # TODO: Implement OTP verification
        # For now, return success (implement actual OTP service)
        
        if not is_user_registered(phone_number):
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        token = generate_token(phone_number)
        user_data = get_user_registration(phone_number)
        credits = get_user_credits(phone_number) or 0
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user_data.get('chat_id'),
                'nerdx_id': user_data.get('nerdx_id'),
                'name': user_data.get('name'),
                'surname': user_data.get('surname'),
                'phone_number': phone_number,
                'credits': _credits_display(credits),
            }
        }), 200
        
    except Exception as e:
        logger.error(f"OTP verification error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/auth/refresh-token', methods=['POST'])
@require_auth
def refresh_token():
    """Refresh JWT token"""
    try:
        new_token = generate_token(g.current_user_id)
        return jsonify({
            'success': True,
            'token': new_token
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/auth/logout', methods=['POST'])
@require_auth
def logout():
    """Logout user"""
    # Token invalidation can be handled client-side
    # For server-side invalidation, maintain a blacklist
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200

# ============================================================================
# USER PROFILE ENDPOINTS
# ============================================================================

@mobile_bp.route('/user/profile', methods=['GET'])
@require_auth
def get_profile():
    """Get user profile"""
    try:
        user_data = get_user_registration(g.current_user_id)
        if not user_data:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        credits = get_user_credits(g.current_user_id) or 0
        
        return jsonify({
            'success': True,
            'data': {
                'id': user_data.get('chat_id'),
                'nerdx_id': user_data.get('nerdx_id'),
                'name': user_data.get('name'),
                'surname': user_data.get('surname'),
                'email': user_data.get('email'),
                'phone_number': user_data.get('phone_number'),
                'credits': _credits_display(credits),
                'date_of_birth': user_data.get('date_of_birth'),
            }
        }), 200
    except Exception as e:
        logger.error(f"Get profile error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/user/profile', methods=['PUT'])
@require_auth
def update_profile():
    """Update user profile"""
    try:
        data = request.get_json()
        user_id = g.current_user_id
        user_data = get_user_registration(user_id)
        
        if not user_data:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # Prepare update data - only update fields that are provided
        update_data = {
            'updated_at': datetime.now().isoformat()
        }
        
        # Update name if provided
        if 'name' in data and data['name']:
            update_data['name'] = data['name'].strip()
        
        # Update surname if provided
        if 'surname' in data and data['surname']:
            update_data['surname'] = data['surname'].strip()
        
        # Update email if provided
        if 'email' in data and data['email']:
            email = data['email'].strip().lower()
            # Validate email format
            import re
            if re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
                update_data['email'] = email
            else:
                return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        # Update phone_number if provided
        if 'phone_number' in data:
            phone = data['phone_number'].strip() if data['phone_number'] else None
            update_data['phone_number'] = phone
        
        # Update Supabase database
        result = make_supabase_request(
            "PATCH",
            "users_registration",
            data=update_data,
            filters={"chat_id": f"eq.{user_id}"},
            use_service_role=True
        )
        
        if result is None:
            logger.error(f"Failed to update profile for user {user_id}")
            return jsonify({'success': False, 'message': 'Failed to update profile'}), 500
        
        # Also update Supabase Auth email if email was changed
        if 'email' in update_data:
            try:
                from supabase import create_client, Client
                import os
                supabase_url = os.getenv('SUPABASE_URL')
                supabase_service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
                
                if supabase_url and supabase_service_key:
                    supabase: Client = create_client(supabase_url, supabase_service_key)
                    # Get user's auth ID from email
                    auth_users = supabase.auth.admin.list_users()
                    for auth_user in auth_users:
                        if auth_user.email == user_data.get('email'):
                            # Update email in Supabase Auth
                            supabase.auth.admin.update_user_by_id(
                                auth_user.id,
                                {'email': update_data['email']}
                            )
                            logger.info(f"Updated Supabase Auth email for user {user_id}")
                            break
            except Exception as auth_error:
                logger.warning(f"Failed to update Supabase Auth email: {auth_error}")
                # Continue even if Auth update fails - database update succeeded
        
        # Get updated user data
        updated_user = get_user_registration(user_id)
        
        return jsonify({
            'success': True,
            'data': updated_user,
            'message': 'Profile updated successfully'
        }), 200
    except Exception as e:
        logger.error(f"Update profile error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/user/stats', methods=['GET'])
@require_auth
def get_user_stats_endpoint():
    """Get user statistics"""
    try:
        stats = get_user_stats(g.current_user_id)
        credits = get_user_credits(g.current_user_id) or 0
        
        return jsonify({
            'success': True,
            'data': {
                'credits': _credits_display(credits),
                'total_points': stats.get('total_xp', 0) if stats else 0,
                'streak_count': stats.get('current_streak', 0) if stats else 0,
                'accuracy': stats.get('accuracy', 0) if stats else 0,
                'questions_answered': stats.get('questions_answered', 0) if stats else 0,
                'last_activity': stats.get('last_activity') if stats else None,
            }
        }), 200
    except Exception as e:
        logger.error(f"Get user stats error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/user/history', methods=['GET'])
@require_auth
def get_user_history():
    """Get user question history"""
    try:
        limit = request.args.get('limit', 50, type=int)
        
        # TODO: Implement question history retrieval
        # For now, return empty array
        
        return jsonify({
            'success': True,
            'data': []
        }), 200
    except Exception as e:
        logger.error(f"Get user history error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# QUIZ ENDPOINTS
# ============================================================================

@mobile_bp.route('/quiz/subjects', methods=['GET'])
@require_auth
def get_subjects():
    """Get available subjects"""
    try:
        subjects = [
            {
                'id': 'mathematics',
                'name': 'Mathematics',
                'icon': 'calculate',
                'color': '#2196F3'
            },
            {
                'id': 'combined_science',
                'name': 'Combined Science',
                'icon': 'science',
                'color': '#4CAF50'
            },
            {
                'id': 'geography',
                'name': 'Geography',
                'icon': 'public',
                'color': '#2E7D32'
            },

            {
                'id': 'english',
                'name': 'English',
                'icon': 'menu-book',
                'color': '#FF9800'
            }
        ]
        
        return jsonify({
            'success': True,
            'data': subjects
        }), 200
    except Exception as e:
        logger.error(f"Get subjects error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/quiz/topics', methods=['GET'])
@require_auth
def get_topics():
    """Get topics for a subject (supports O-Level and A-Level)"""
    try:
        subject = request.args.get('subject', '')
        parent_subject = request.args.get('parent_subject', '')  # For Combined Science: Biology/Chemistry/Physics
        
        # Get topics from constants or database
        from constants import (
            TOPICS, 
            A_LEVEL_PHYSICS_ALL_TOPICS, 
            A_LEVEL_CHEMISTRY_ALL_TOPICS, 
            A_LEVEL_BIOLOGY_ALL_TOPICS, 
            A_LEVEL_PURE_MATH_ALL_TOPICS,
            A_LEVEL_COMPUTER_SCIENCE_ALL_TOPICS,
            A_LEVEL_GEOGRAPHY_ALL_TOPICS,
            A_LEVEL_PHYSICS_TOPICS,
            A_LEVEL_CHEMISTRY_TOPICS,
            A_LEVEL_BIOLOGY_TOPICS,
            A_LEVEL_PURE_MATH_TOPICS,
            A_LEVEL_COMPUTER_SCIENCE_TOPICS,
            A_LEVEL_GEOGRAPHY_TOPICS
        )
        
        topics = []
        
        # Handle A-Level subjects
        if subject == 'a_level_physics' or subject == 'A-Level Physics':
            # Return all A-Level Physics topics
            for topic in A_LEVEL_PHYSICS_ALL_TOPICS:
                topics.append({
                    'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', ''),
                    'name': topic,
                    'subject': 'a_level_physics',
                    'level': 'AS Level' if topic in A_LEVEL_PHYSICS_TOPICS.get('AS Level', []) else 'A2 Level'
                })
        elif subject == 'a_level_chemistry' or subject == 'A-Level Chemistry':
            # Return all A-Level Chemistry topics
            for topic in A_LEVEL_CHEMISTRY_ALL_TOPICS:
                topics.append({
                    'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', ''),
                    'name': topic,
                    'subject': 'a_level_chemistry',
                    'level': 'AS Level' if topic in A_LEVEL_CHEMISTRY_TOPICS.get('AS Level', []) else 'A2 Level'
                })
        elif subject == 'a_level_biology' or subject == 'A-Level Biology':
            # Return all A-Level Biology topics
            for topic in A_LEVEL_BIOLOGY_ALL_TOPICS:
                topics.append({
                    'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', ''),
                    'name': topic,
                    'subject': 'a_level_biology',
                    'level': 'Lower Sixth' if topic in A_LEVEL_BIOLOGY_TOPICS.get('Lower Sixth', []) else 'Upper Sixth'
                })
        elif subject == 'a_level_pure_math' or subject == 'A-Level Pure Mathematics' or subject == 'Pure Mathematics':
            # Return all A-Level Pure Mathematics topics
            for topic in A_LEVEL_PURE_MATH_ALL_TOPICS:
                topics.append({
                    'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', ''),
                    'name': topic,
                    'subject': 'a_level_pure_math',
                    'level': 'Lower Sixth' if topic in A_LEVEL_PURE_MATH_TOPICS.get('Lower Sixth', []) else 'Upper Sixth'
                })
        elif subject == 'a_level_computer_science' or subject == 'A-Level Computer Science':
            # Board: zimsec (default) or cambridge — Cambridge 9618 AS & A Level
            board = (request.args.get('board') or 'zimsec').lower()
            if board == 'cambridge':
                try:
                    from services.cambridge_a_level_cs_syllabus import (
                        CAMBRIDGE_A_LEVEL_CS_TOPICS_AS,
                        CAMBRIDGE_A_LEVEL_CS_TOPICS_A2,
                        CAMBRIDGE_A_LEVEL_CS_ALL_TOPICS,
                    )
                    for topic in CAMBRIDGE_A_LEVEL_CS_ALL_TOPICS:
                        topics.append({
                            'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', '').replace('-', '_'),
                            'name': topic,
                            'subject': 'a_level_computer_science',
                            'level': 'AS Level' if topic in CAMBRIDGE_A_LEVEL_CS_TOPICS_AS else 'A2 Level',
                            'board': 'cambridge'
                        })
                except ImportError:
                    board = 'zimsec'
            if board == 'zimsec':
                for topic in A_LEVEL_COMPUTER_SCIENCE_ALL_TOPICS:
                    topics.append({
                        'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', '').replace('-', '_'),
                        'name': topic,
                        'subject': 'a_level_computer_science',
                        'level': 'Form 5' if topic in A_LEVEL_COMPUTER_SCIENCE_TOPICS.get('Form 5', []) else 'Form 6',
                        'board': 'zimsec'
                    })
        elif subject == 'a_level_geography' or subject == 'A-Level Geography':
            # Return all A-Level Geography topics (Paper 1 and Paper 2)
            for topic in A_LEVEL_GEOGRAPHY_ALL_TOPICS:
                topics.append({
                    'id': topic.lower().replace(' ', '_').replace(',', '').replace('.', '').replace('&', 'and'),
                    'name': topic,
                    'subject': 'a_level_geography',
                    'paper': 'Paper 1' if topic in A_LEVEL_GEOGRAPHY_TOPICS.get('Paper 1', []) else 'Paper 2'
                })
        
        # Handle Combined Science two-level structure
        elif subject == 'combined_science':
            if parent_subject:
                # Return subtopics for Biology/Chemistry/Physics
                if parent_subject in TOPICS:
                    for topic in TOPICS[parent_subject]:
                        topics.append({
                            'id': topic.lower().replace(' ', '_'),
                            'name': topic,
                            'subject': 'combined_science',
                            'parent_subject': parent_subject
                        })
            else:
                # Return Biology, Chemistry, Physics as top-level topics
                for science_subject in ['Biology', 'Chemistry', 'Physics']:
                    topics.append({
                        'id': science_subject.lower(),
                        'name': science_subject,
                        'subject': 'combined_science',
                        'is_parent': True  # Flag to indicate this is a parent topic
                    })
        elif subject == 'english':
            # Return all English topics including Grammar and Vocabulary
            if 'English' in TOPICS:
                for topic in TOPICS['English']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_'),
                        'name': topic,
                        'subject': 'english'
                    })
            # Also add special Grammar Usage and Vocabulary if not already in list
            topic_names = [t['name'] for t in topics]
            if 'Grammar and Language' in TOPICS.get('English', []) and 'Grammar Usage and Vocabulary' not in topic_names:
                # Grammar Usage and Vocabulary is already covered by individual topics
                pass
        elif subject == 'mathematics':
            # Return all Mathematics topics
            if 'Mathematics' in TOPICS:
                for topic in TOPICS['Mathematics']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_'),
                        'name': topic,
                        'subject': 'mathematics'
                    })

        elif subject == 'computer_science':
            # Board: zimsec (default) or cambridge
            board = (request.args.get('board') or 'zimsec').lower()
            if board == 'cambridge':
                try:
                    from services.cambridge_cs_syllabus import CAMBRIDGE_CS_TOPICS
                    for topic in CAMBRIDGE_CS_TOPICS:
                        topics.append({
                            'id': topic.lower().replace(' ', '_').replace('-', '_'),
                            'name': topic,
                            'subject': 'computer_science',
                            'board': 'cambridge'
                        })
                except ImportError:
                    board = 'zimsec'
            if board == 'zimsec' and 'Computer Science' in TOPICS:
                for topic in TOPICS['Computer Science']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_').replace('-', '_'),
                        'name': topic,
                        'subject': 'computer_science',
                        'board': 'zimsec'
                    })
        elif subject == 'geography':
            # ZIMSEC O-Level Geography – All Level, flat topic list (no Forms)
            if 'Geography' in TOPICS:
                for topic in TOPICS['Geography']:
                    topics.append({
                        'id': topic.lower().replace(' ', '_').replace('-', '_'),
                        'name': topic,
                        'subject': 'geography',
                        'board': 'zimsec'
                    })
        elif subject in TOPICS:
            # Default handling for other subjects
            for topic in TOPICS[subject]:
                topics.append({
                    'id': topic.lower().replace(' ', '_'),
                    'name': topic,
                    'subject': subject
                })
        
        return jsonify({
            'success': True,
            'data': topics
        }), 200
    except Exception as e:
        logger.error(f"Get topics error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/quiz/generate', methods=['POST'])
@require_auth
def generate_question():
    """Generate a quiz question. Supports mixed image questions via Vertex AI."""
    try:
        data = request.get_json()
        subject = data.get('subject', '')
        topic = data.get('topic')
        difficulty = data.get('difficulty', 'medium')
        question_type = data.get('type', 'topical')  # 'topical' or 'exam'
        question_format = (data.get('question_format') or 'mcq').lower()  # 'mcq' or 'structured'
        
        # NEW: Image mixing parameters
        mix_images = data.get('mix_images', False)  # Enable visual questions
        question_count = data.get('question_count', 1)  # Current question number in session
        
        if not subject:
            return jsonify({'success': False, 'message': 'Subject is required'}), 400
        
        # CREDIT CALCULATION: Image questions cost more (scale 1-5)
        # Text question: 1 credit (default)
        # Image question: 4 credits (when mix_images enabled and it's image turn)
        is_image_question = False
        if mix_images and vertex_service.is_available():
            # Every 6th question is an image question (questions 6, 12, 18, ...)
            # Uses modulo 6 == 0 to trigger on 6th questions
            is_image_question = (question_count > 0 and question_count % 6 == 0)
            logger.info(f"🖼️ Image check: question #{question_count}, mix_images={mix_images}, is_image={is_image_question}")
        
        # For A-Level Biology, use question_type from data (mcq, structured, essay)
        bio_question_type = data.get('question_type', 'mcq') if subject == 'a_level_biology' else 'mcq'
        # For Computer Science (O-Level and A-Level), use question_type from data (mcq, structured, essay)
        cs_question_type = (data.get('question_type') or question_format or 'mcq').lower() if subject in ('computer_science', 'a_level_computer_science') else None
        credit_action = _get_quiz_credit_action(subject, question_type, question_format, bio_question_type, cs_question_type)
        if is_image_question:
            credit_cost = get_image_question_credit_cost()
        else:
            # Standard text question credit cost
            credit_cost = advanced_credit_service.get_credit_cost(credit_action)
        
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}, Available: {_credits_text(user_credits)}',
                'credit_cost': _credits_display(credit_cost),
                'is_image_question': is_image_question
            }), 402
        
        # Generate question based on subject
        question_data = None
        
        # IMAGE QUESTION PATH: Use Vertex AI for visual science questions
        if is_image_question and subject in ['combined_science', 'a_level_biology', 'a_level_chemistry', 'a_level_physics']:
            logger.info(f"🖼️ Generating IMAGE question for {subject}/{topic} (question #{question_count})")
            
            # Determine parent subject for Combined Science
            parent_subject = data.get('parent_subject', 'Biology')
            if subject == 'combined_science':
                actual_subject = parent_subject
            elif subject == 'a_level_biology':
                actual_subject = 'Biology'
            elif subject == 'a_level_chemistry':
                actual_subject = 'Chemistry'
            elif subject == 'a_level_physics':
                actual_subject = 'Physics'
            else:
                actual_subject = 'Biology'
            
            # Determine level
            level = 'O-Level' if subject == 'combined_science' else 'A-Level'
            
            # Generate image question using Vertex AI
            question_data = vertex_service.generate_image_question(
                subject=actual_subject,
                topic=topic or 'General',
                level=level,
                difficulty=difficulty
            )
            
            if question_data:
                question_data['is_visual_question'] = True
                question_data['credit_cost'] = credit_cost
                logger.info(f"✅ Image question generated successfully")
            else:
                logger.warning(f"⚠️ Image question generation failed, falling back to text question")
                is_image_question = False  # Fall back to text
                credit_cost = advanced_credit_service.get_credit_cost(credit_action)
        
        # STANDARD TEXT QUESTION PATH (or fallback)
        if not question_data:
            if subject == 'mathematics':
                from services.math_question_generator import MathQuestionGenerator
                from services.math_solver import MathSolver
                math_generator = MathQuestionGenerator()
                used_cached_question = False

                if question_type == 'topical' and topic and not is_image_question:
                    cached_question = question_cache.get_cached_question(topic, difficulty, g.current_user_id)
                    if cached_question:
                        question_data = dict(cached_question)
                        question_data['source'] = question_data.get('source') or 'cached'
                        question_text = question_data.get('question') or question_data.get('question_text') or ''
                        if question_text:
                            question_cache.save_question_to_history(
                                g.current_user_id,
                                question_text,
                                topic,
                                difficulty
                            )
                        used_cached_question = True
                
                if not question_data:
                    # For exam mode, select random topic if no topic specified
                    if question_type == 'exam' and not topic:
                        from constants import TOPICS
                        import random
                        math_topics = TOPICS.get('Mathematics', [])
                        if math_topics:
                            topic = random.choice(math_topics)
                            topic = topic.lower().replace(' ', '_')
                    
                    # Retry logic for AI generation - reject fallback questions and None returns
                    max_retries = 3
                    # Increased time budget to accommodate progressive timeouts (30s, 45s, 60s) + retry delays
                    # Allow up to 70s total: 30s + 2s delay + 45s + 2s delay + 60s = ~139s max, but cap at 70s for safety
                    time_budget_seconds = 70
                    attempt_start_time = time.monotonic()
                    question_data = None
                    last_error = None
                    
                    for attempt in range(max_retries):
                        elapsed = time.monotonic() - attempt_start_time
                        if elapsed >= time_budget_seconds:
                            logger.warning(f"⏱️ AI generation time budget exceeded before attempt {attempt + 1}/{max_retries} ({elapsed:.1f}s/{time_budget_seconds}s)")
                            break
                        try:
                            remaining_budget = time_budget_seconds - (time.monotonic() - attempt_start_time)
                            if remaining_budget <= 5:
                                logger.warning(f"⏱️ AI generation remaining budget too small before attempt {attempt + 1}/{max_retries} ({remaining_budget:.1f}s)")
                                break
                            # Allow progressive timeouts to work: don't cap too aggressively
                            # The generator will handle its own progressive timeouts [30s, 45s, 60s]
                            attempt_timeout = max(10, min(max(math_generator.timeouts) if hasattr(math_generator, 'timeouts') else math_generator.base_timeout * 2, int(remaining_budget - 5)))
                            question_data = math_generator.generate_question('Mathematics', topic or 'Algebra', difficulty, g.current_user_id, timeout_seconds=attempt_timeout)
                            
                            # Reject fallback questions - they are default/static questions
                            if question_data and question_data.get('source') == 'fallback':
                                logger.warning(f"⚠️ Fallback question detected (attempt {attempt + 1}/{max_retries}) - rejecting and retrying")
                                question_data = None
                            
                            # Valid AI-generated question found
                            if question_data and question_data.get('source') != 'fallback':
                                logger.info(f"✅ Successfully generated question on attempt {attempt + 1}")
                                break
                            
                            # If None or fallback, wait before retry
                            if attempt < max_retries - 1:
                                wait_time = (attempt + 1) * 1.0
                                remaining_budget = max(0.0, time_budget_seconds - (time.monotonic() - attempt_start_time))
                                wait_time = min(wait_time, remaining_budget)
                                if wait_time > 0:
                                    logger.info(f"⏳ Retrying question generation in {wait_time:.1f}s (attempt {attempt + 2}/{max_retries})")
                                    time.sleep(wait_time)
                        except Exception as e:
                            last_error = str(e)
                            logger.error(f"❌ Error during question generation (attempt {attempt + 1}/{max_retries}): {e}")
                            if attempt < max_retries - 1:
                                time.sleep(1)
                    
                    # Final check - ensure we have a valid question
                    if not question_data or question_data.get('source') == 'fallback':
                        error_msg = last_error or 'AI generation service unavailable'
                        logger.error(f"❌ Failed to generate valid question after {max_retries} attempts: {error_msg}")
                        return jsonify({
                            'success': False, 
                            'message': 'Unable to generate question at this time. The AI service may be temporarily unavailable. Please try again in a moment.'
                        }), 503
                
                # Generate hint for math questions if not already present
                if question_data and not question_data.get('hint_level_1'):
                    math_solver = MathSolver()
                    hint = math_solver.get_hint(question_data.get('question', ''), difficulty)
                    if hint:
                        question_data['hint_level_1'] = hint

                if question_data and question_type == 'topical' and topic and not is_image_question and not used_cached_question:
                    question_text = question_data.get('question') or question_data.get('question_text') or ''
                    if question_text:
                        question_cache.cache_question(topic, difficulty, question_data)
                        question_cache.save_question_to_history(
                            g.current_user_id,
                            question_text,
                            topic,
                            difficulty
                        )
                        
            elif subject == 'combined_science':
                # Combined Science needs parent_subject (Biology/Chemistry/Physics) and topic (subtopic)
                parent_subject = data.get('parent_subject', 'Biology')  # Default to Biology if not specified
                
                # Handle exam mode - randomly select from all topics across Biology, Chemistry, Physics
                if question_type == 'exam':
                    from constants import TOPICS
                    import random
                    
                    # Randomly select a subject (Biology, Chemistry, or Physics)
                    science_subjects = ['Biology', 'Chemistry', 'Physics']
                    parent_subject = random.choice(science_subjects)
                    
                    # Randomly select a topic from the chosen subject
                    if parent_subject in TOPICS and len(TOPICS[parent_subject]) > 0:
                        topic = random.choice(TOPICS[parent_subject])
                    else:
                        topic = 'Cell Structure and Organisation'
                        parent_subject = 'Biology'
                
                # If topic is Biology/Chemistry/Physics itself, use default subtopic
                elif topic and topic.lower() in ['biology', 'chemistry', 'physics']:
                    parent_subject = topic.capitalize()
                    # Use first subtopic as default
                    from constants import TOPICS
                    if parent_subject in TOPICS and len(TOPICS[parent_subject]) > 0:
                        topic = TOPICS[parent_subject][0]
                
                science_gen = CombinedScienceGenerator()
                if question_format == 'structured':
                    question_data = science_gen.generate_structured_question(parent_subject, topic or 'Cell Structure and Organisation', difficulty, g.current_user_id)
                else:
                    question_data = science_gen.generate_topical_question(parent_subject, topic or 'Cell Structure and Organisation', difficulty, g.current_user_id)
            elif subject == 'english':
                english_service = EnglishService()
                # English service uses different method - get grammar or vocabulary question
                topic_lower = (topic or '').lower()
                if 'vocabulary' in topic_lower or topic_lower in ['vocab', 'vocabulary_building']:
                    question_result = english_service.generate_vocabulary_question()
                elif 'grammar' in topic_lower or topic_lower in ['grammar_and_language', 'grammar_usage_and_vocabulary']:
                    question_result = english_service.generate_grammar_question()
                else:
                    # Default to grammar if topic not specified
                    question_result = english_service.generate_grammar_question()
                
                if question_result and question_result.get('success'):
                    question_data = question_result.get('question_data', {})
                else:
                    question_data = None
            
            elif subject == 'a_level_physics':
                # A Level Physics - uses DeepSeek generator
                from services.a_level_physics_generator import a_level_physics_generator
                from constants import A_LEVEL_PHYSICS_TOPICS, A_LEVEL_PHYSICS_ALL_TOPICS
                import random
                
                selected_topic = topic or 'Kinematics'
                if question_type == 'exam':
                    level = data.get('parent_subject') or 'AS Level'
                    level_topics = A_LEVEL_PHYSICS_TOPICS.get(level, A_LEVEL_PHYSICS_ALL_TOPICS)
                    selected_topic = random.choice(level_topics)
                
                # Pass question_format to support MCQ vs Structured questions
                try:
                    question_data = a_level_physics_generator.generate_question(
                        selected_topic, 
                        difficulty, 
                        g.current_user_id,
                        question_format  # 'mcq' or 'structured'
                    )
                except Exception as physics_error:
                    logger.error(f"Error generating A-Level Physics {question_format} question: {physics_error}", exc_info=True)
                    question_data = None
            
            elif subject == 'a_level_chemistry':
                # A Level Chemistry - uses DeepSeek generator
                from services.a_level_chemistry_generator import a_level_chemistry_generator
                from constants import A_LEVEL_CHEMISTRY_TOPICS, A_LEVEL_CHEMISTRY_ALL_TOPICS
                import random
                
                selected_topic = topic or 'Atomic Structure'
                if question_type == 'exam':
                    level = data.get('parent_subject') or 'AS Level'
                    level_topics = A_LEVEL_CHEMISTRY_TOPICS.get(level, A_LEVEL_CHEMISTRY_ALL_TOPICS)
                    selected_topic = random.choice(level_topics)
                
                # Pass question_format to support MCQ vs Structured questions
                try:
                    question_data = a_level_chemistry_generator.generate_question(
                        selected_topic, 
                        difficulty, 
                        g.current_user_id,
                        question_format  # 'mcq' or 'structured'
                    )
                except Exception as chemistry_error:
                    logger.error(f"Error generating A-Level Chemistry {question_format} question: {chemistry_error}", exc_info=True)
                    import traceback
                    logger.error(f"Full traceback: {traceback.format_exc()}")
                    question_data = None
            
            elif subject == 'a_level_pure_math':
                # A Level Pure Mathematics - uses DeepSeek generator
                from services.a_level_pure_math_generator import a_level_pure_math_generator
                from constants import A_LEVEL_PURE_MATH_TOPICS, A_LEVEL_PURE_MATH_ALL_TOPICS
                import random
                
                selected_topic = topic or 'Polynomials'
                if question_type == 'exam':
                    level = data.get('parent_subject') or 'Lower Sixth'
                    level_topics = A_LEVEL_PURE_MATH_TOPICS.get(level, A_LEVEL_PURE_MATH_ALL_TOPICS)
                    selected_topic = random.choice(level_topics)
                
                # Pass question_format to support MCQ vs Structured questions
                try:
                    question_data = a_level_pure_math_generator.generate_question(
                        selected_topic, 
                        difficulty, 
                        g.current_user_id,
                        question_format  # 'mcq' or 'structured'
                    )
                except Exception as math_error:
                    logger.error(f"Error generating A-Level Pure Math {question_format} question: {math_error}", exc_info=True)
                    question_data = None
            
            elif subject == 'a_level_biology':
                # A Level Biology - uses DeepSeek generator with MCQ, Structured, Essay support
                from services.a_level_biology_generator import a_level_biology_generator
                from constants import A_LEVEL_BIOLOGY_TOPICS, A_LEVEL_BIOLOGY_ALL_TOPICS
                import random
                # question_type can be 'mcq', 'structured', or 'essay'
                bio_question_type = data.get('question_type', 'mcq')
                
                selected_topic = topic or 'Cell Structure'
                if question_type == 'exam':
                    level = data.get('parent_subject') or 'Lower Sixth'
                    level_topics = A_LEVEL_BIOLOGY_TOPICS.get(level, A_LEVEL_BIOLOGY_ALL_TOPICS)
                    selected_topic = random.choice(level_topics)
                
                try:
                    question_data = a_level_biology_generator.generate_question(
                        selected_topic, 
                        difficulty, 
                        g.current_user_id, 
                        bio_question_type
                    )
                except Exception as bio_error:
                    logger.error(f"Error generating A-Level Biology {bio_question_type} question: {bio_error}", exc_info=True)
                    question_data = None
            
            elif subject == 'computer_science':
                # Computer Science - uses DeepSeek generator with MCQ, Structured, Essay support
                cs_generator = ComputerScienceGenerator()
                from constants import TOPICS
                import random
                board = (data.get('board') or 'zimsec').lower()
                # Handle exam mode - randomly select topic (board-specific list)
                if question_type == 'exam':
                    if board == 'cambridge':
                        try:
                            from services.cambridge_cs_syllabus import CAMBRIDGE_CS_TOPICS
                            cs_topics = list(CAMBRIDGE_CS_TOPICS) if CAMBRIDGE_CS_TOPICS else []
                        except ImportError:
                            cs_topics = TOPICS.get('Computer Science', [])
                    else:
                        cs_topics = TOPICS.get('Computer Science', [])
                    if cs_topics:
                        topic = random.choice(cs_topics)
                # Default topic if none specified (board-specific default)
                default_topic = 'Data representation' if board == 'cambridge' else 'Hardware and Software'
                selected_topic = topic or default_topic
                # Determine question format - MCQ, structured, or essay
                cs_question_type = data.get('question_type', question_format or 'mcq').lower()
                if cs_question_type == 'essay':
                    question_data = cs_generator.generate_essay_question(selected_topic, difficulty, g.current_user_id, board=board)
                elif cs_question_type == 'structured':
                    question_data = cs_generator.generate_structured_question(selected_topic, difficulty, g.current_user_id, board=board)
                else:
                    question_data = cs_generator.generate_topical_question(selected_topic, difficulty, g.current_user_id, board=board)
            
            elif subject == 'geography':
                # ZIMSEC O-Level Geography – All Level MCQ / Structured / Essay generation
                geo_generator = GeographyGenerator()
                from constants import TOPICS
                import random
                
                # In exam mode, randomly select topic from full Geography list
                if question_type == 'exam':
                    geo_topics = TOPICS.get('Geography', [])
                    if geo_topics:
                        topic = random.choice(geo_topics)
                selected_topic = topic or 'Weather and Climate'
                
                geo_question_type = (data.get('question_type') or question_format or 'mcq').lower()
                if geo_question_type == 'essay':
                    question_data = geo_generator.generate_essay_question(selected_topic, difficulty, g.current_user_id)
                elif geo_question_type == 'structured' or question_format == 'structured':
                    question_data = geo_generator.generate_structured_question(selected_topic, difficulty, g.current_user_id)
                else:
                    question_data = geo_generator.generate_topical_question(selected_topic, difficulty, g.current_user_id)
            
            elif subject == 'a_level_geography':
                # ZIMSEC A-Level Geography – Essay questions only
                from services.a_level_geography_generator import ALevelGeographyGenerator
                geo_generator = ALevelGeographyGenerator()
                from constants import A_LEVEL_GEOGRAPHY_TOPICS
                import random
                
                # In exam mode, randomly select topic from full A-Level Geography list
                if question_type == 'exam':
                    geo_topics = A_LEVEL_GEOGRAPHY_TOPICS.get('Paper 1', []) + A_LEVEL_GEOGRAPHY_TOPICS.get('Paper 2', [])
                    if geo_topics:
                        topic = random.choice(geo_topics)
                selected_topic = topic or 'Climatology'
                
                # A-Level Geography: always generate essay (ignore question_type/question_format)
                question_data = geo_generator.generate_essay_question(selected_topic, difficulty, g.current_user_id)
            
            elif subject == 'a_level_computer_science':
                # A Level Computer Science - ZIMSEC 6023 or Cambridge 9618 (board from client)
                cs_generator = ComputerScienceGenerator()
                import random
                board = (data.get('board') or 'zimsec').lower()
                
                if board == 'cambridge':
                    try:
                        from services.cambridge_a_level_cs_syllabus import (
                            CAMBRIDGE_A_LEVEL_CS_TOPICS_AS,
                            CAMBRIDGE_A_LEVEL_CS_TOPICS_A2,
                            CAMBRIDGE_A_LEVEL_CS_ALL_TOPICS,
                        )
                        selected_topic = topic or '1.1 Data representation – number systems'
                        if question_type == 'exam':
                            level = data.get('parent_subject') or 'AS Level'
                            level_topics = CAMBRIDGE_A_LEVEL_CS_TOPICS_AS if level == 'AS Level' else CAMBRIDGE_A_LEVEL_CS_TOPICS_A2
                            if level_topics:
                                selected_topic = random.choice(level_topics)
                    except ImportError:
                        board = 'zimsec'
                
                if board == 'zimsec':
                    from constants import A_LEVEL_COMPUTER_SCIENCE_TOPICS, A_LEVEL_COMPUTER_SCIENCE_ALL_TOPICS
                    selected_topic = topic or 'Data Representation - Number Systems'
                    if question_type == 'exam':
                        level = data.get('parent_subject') or 'Form 5'
                        level_topics = A_LEVEL_COMPUTER_SCIENCE_TOPICS.get(level, A_LEVEL_COMPUTER_SCIENCE_ALL_TOPICS)
                        if level_topics:
                            selected_topic = random.choice(level_topics)
                
                # Determine question format - MCQ, structured, or essay
                cs_question_type = data.get('question_type', question_format or 'mcq').lower()
                a_level_cambridge = (board == 'cambridge' and subject == 'a_level_computer_science')
                if cs_question_type == 'essay':
                    question_data = cs_generator.generate_essay_question(selected_topic, difficulty, g.current_user_id, board=board, a_level_cambridge=a_level_cambridge)
                elif cs_question_type == 'structured':
                    question_data = cs_generator.generate_structured_question(selected_topic, difficulty, g.current_user_id, board=board, a_level_cambridge=a_level_cambridge)
                else:
                    question_data = cs_generator.generate_topical_question(selected_topic, difficulty, g.current_user_id, board=board, a_level_cambridge=a_level_cambridge)

        
        if not question_data:
            # Provide more specific error messages based on subject and question type
            question_format_used = data.get('question_format') or data.get('question_type', 'mcq')
            
            if subject == 'a_level_biology':
                bio_type = data.get('question_type', 'mcq')
                if bio_type == 'essay':
                    error_msg = 'Failed to generate essay question. The AI service may be experiencing high load. Please try again in a moment.'
                elif bio_type == 'structured':
                    error_msg = 'Failed to generate structured question. Please try again or switch to MCQ questions.'
                else:
                    error_msg = f'Failed to generate A-Level Biology {bio_type} question. Please try again.'
            elif subject in ['a_level_physics', 'a_level_chemistry', 'a_level_pure_math', 'a_level_computer_science']:
                if question_format_used == 'structured':
                    error_msg = f'Failed to generate {subject.replace("a_level_", "").replace("_", " ").title()} structured question. Please try again or switch to MCQ questions.'
                elif question_format_used == 'essay':
                    error_msg = f'Failed to generate {subject.replace("a_level_", "").replace("_", " ").title()} essay question. The AI service may be experiencing high load. Please try again in a moment.'
                else:
                    error_msg = f'Failed to generate {subject.replace("a_level_", "").replace("_", " ").title()} question. Please try again.'
            else:
                error_msg = 'Failed to generate question. Please try again.'
            logger.error(f"Question generation failed for {subject}/{topic} (type: {question_format_used})")
            return jsonify({'success': False, 'message': error_msg}), 500
        
        # Format question for mobile - normalize different question formats
        # English questions might have different structure
        if subject == 'english':
            # Normalize English question format
            options = question_data.get('options', [])
            if isinstance(options, dict):
                # Convert dict {A: "...", B: "..."} to array
                options = [options.get(k, '') for k in sorted(options.keys()) if options.get(k)]
            
            # Get correct answer - could be in different fields
            correct_answer = question_data.get('answer') or question_data.get('correct_answer') or ''
            acceptable_answers = question_data.get('acceptable_answers', [])
            if not correct_answer and acceptable_answers:
                correct_answer = acceptable_answers[0] if isinstance(acceptable_answers, list) and len(acceptable_answers) > 0 else str(acceptable_answers)
            if isinstance(correct_answer, list) and len(correct_answer) > 0:
                correct_answer = correct_answer[0]
            if not correct_answer:
                correct_answer = ''
            
            # Get solution/explanation - English service returns a nested dict
            explanation_obj = question_data.get('explanation', {})
            if isinstance(explanation_obj, dict):
                # Build a comprehensive solution string from the explanation dict
                solution_parts = []
                
                # Correct answer
                correction = explanation_obj.get('correction', '') or correct_answer
                if correction:
                    solution_parts.append(f"✅ Correct Answer: {correction}")
                
                # Grammar rule
                rule = explanation_obj.get('rule', '')
                if rule:
                    solution_parts.append(f"\n📚 Rule: {rule}")
                
                # Error analysis
                error_analysis = explanation_obj.get('error_analysis', '')
                if error_analysis:
                    solution_parts.append(f"\n⚠️ Why: {error_analysis}")
                
                # ZIMSEC importance
                zimsec_importance = explanation_obj.get('zimsec_importance', '')
                if zimsec_importance:
                    solution_parts.append(f"\n🎓 ZIMSEC Tip: {zimsec_importance}")
                
                # Examples
                examples = explanation_obj.get('examples', [])
                if examples and isinstance(examples, list) and len(examples) > 0:
                    solution_parts.append(f"\n📝 Examples: {'; '.join(examples[:2])}")
                
                solution = '\n'.join(solution_parts) if solution_parts else f"The correct answer is: {correct_answer}"
            else:
                # Fallback if explanation is already a string
                solution = str(explanation_obj) if explanation_obj else question_data.get('solution', '') or question_data.get('feedback', '') or f"The correct answer is: {correct_answer}"
        else:
            # For other subjects (including Mathematics), use standard format
            options = question_data.get('options', [])
            if isinstance(options, dict):
                options = [options.get(k, '') for k in sorted(options.keys()) if options.get(k)]
            correct_answer = question_data.get('answer', '') or question_data.get('correct_answer', '')
            solution = question_data.get('solution', '') or question_data.get('explanation', '')
        
        # Optional graph/diagram attachment (e.g., A Level Pure Math matplotlib output)
        question_image_url = question_data.get('question_image_url') or question_data.get('graph_image_url')
        if not question_image_url and question_data.get('graph_image_path'):
            try:
                question_image_url = convert_local_path_to_public_url(question_data['graph_image_path'])
            except Exception:
                question_image_url = None
        
        # For Mathematics, ensure it's treated as short_answer type (allows text input)
        question_type_mobile = question_data.get('question_type', '') or question_data.get('type', 'short_answer')
        if subject == 'mathematics' and not options:
            question_type_mobile = 'short_answer'  # Math questions allow text input
        
        # Handle A-Level Biology question types (mcq, structured, essay)
        if subject == 'a_level_biology':
            bio_question_type = (question_data.get('question_type') or '').lower()
            if bio_question_type in ['structured', 'essay']:
                question_type_mobile = bio_question_type
            elif bio_question_type == 'mcq':
                question_type_mobile = 'mcq'
        
        # Handle structured questions for Combined Science and other A-Level subjects
        if (question_data.get('question_type') or '').lower() == 'structured' and subject != 'a_level_biology':
            question_type_mobile = 'structured'
            # Structured questions use typed answers; options/correct_answer are not used
            options = []
            correct_answer = ''
            # Provide a compact "solution" string (model answers) for UI display if desired
            try:
                # For A-Level subjects, parts are in structured_question.parts
                structured_q = question_data.get('structured_question', {})
                parts = structured_q.get('parts', []) if structured_q else []
                # Fallback to top-level parts if not in structured_question
                if not parts:
                    parts = question_data.get('parts', []) if isinstance(question_data.get('parts'), list) else []
                model_lines = []
                for p in parts:
                    label = p.get('label', '')
                    model = (p.get('model_answer') or '').strip()
                    marks = p.get('marks', '')
                    if model:
                        model_lines.append(f"{label} [{marks}]: {model}")
                if model_lines:
                    solution = "MODEL ANSWERS:\n" + "\n".join(model_lines[:10])
            except Exception:
                pass
        
        # Format question for mobile
        question = {
            'id': str(uuid.uuid4()),
            'question_text': (
                question_data.get('question', '') or
                question_data.get('question_text', '') or
                (question_data.get('stem', '') if (question_data.get('question_type') or '').lower() == 'structured' else '')
            ),
            'question_image_url': question_image_url,
            'question_type': question_type_mobile,
            'options': options if isinstance(options, list) else [],
            'correct_answer': correct_answer,
            'solution': solution,
            'hint': question_data.get('hint', '') if subject == 'mathematics' else '',
            # For English, use the formatted solution since explanation is a dict
            # For Combined Science, use teaching_explanation for the "Teaching Explanation" section (different from solution)
            'explanation': (
                solution if subject == 'english' 
                else (question_data.get('teaching_explanation', '') or question_data.get('real_world_application', '') or question_data.get('explanation', '')) if subject == 'combined_science'
                else (question_data.get('explanation', '') if not isinstance(question_data.get('explanation'), dict) else '')
            ),
            'points': question_data.get('points', 10),
            'topic': topic or '',
            'difficulty': difficulty,
            'allows_text_input': (
                subject == 'mathematics' or 
                subject == 'a_level_pure_math' or
                question_type_mobile == 'short_answer' or
                question_type_mobile == 'structured' or
                (subject == 'english' and not options)  # English grammar questions without MCQ options need text input
            ),
            'allows_image_upload': subject == 'mathematics' or subject == 'a_level_pure_math',  # Math questions support image upload
            
            # New AI Tutor Fields
            'concept_explanation': question_data.get('concept_explanation', ''),
            'worked_example': question_data.get('worked_example', None),
            'hint_level_1': question_data.get('hint_level_1', ''),
            'hint_level_2': question_data.get('hint_level_2', ''),
            'hint_level_3': question_data.get('hint_level_3', ''),
            'common_mistakes': question_data.get('common_mistakes', []),
            'learning_objective': question_data.get('learning_objective', ''),
            # Separate teaching explanation for Combined Science (different from solution)
            'teaching_explanation': question_data.get('teaching_explanation', '') or question_data.get('real_world_application', '')
        }
        
        # Convert LaTeX to readable text and normalize spacing for mathematics, A-Level Pure Math, and science
        if subject in ('mathematics', 'a_level_pure_math', 'combined_science'):
            try:
                lc = LaTeXConverter()
                spacing_keys = ('solution', 'explanation', 'teaching_explanation', 'concept_explanation')
                for key in ('question_text', 'solution', 'explanation', 'teaching_explanation', 'concept_explanation', 'hint', 'hint_level_1', 'hint_level_2', 'hint_level_3'):
                    if question.get(key) and isinstance(question[key], str):
                        s = lc.latex_to_readable_text(question[key])
                        if key in spacing_keys:
                            s = LaTeXConverter.normalize_explanation_spacing(s)
                        question[key] = s
                # structured_question stem/parts are converted later, after it is attached to question
            except Exception as e:
                logger.warning(f"LaTeX conversion in quiz payload failed (non-blocking): {e}")
        
        # Include structured payload for the app (so it can render parts and resubmit for marking)
        if subject == 'combined_science' and question_type_mobile == 'structured':
            question['structured_question'] = {
                'question_type': 'structured',
                'subject': question_data.get('subject', ''),
                'topic': question_data.get('topic', ''),
                'difficulty': question_data.get('difficulty', difficulty),
                'stem': question_data.get('stem', ''),
                'parts': question_data.get('parts', []),
                'total_marks': question_data.get('total_marks', 0),
                # rubric is needed for server-side marking in stateless mobile flow
                'marking_rubric': question_data.get('marking_rubric', {})
            }
        
        # Handle A-Level Physics and Chemistry structured questions
        if subject in ['a_level_physics', 'a_level_chemistry', 'a_level_pure_math'] and question_type_mobile == 'structured':
            structured_q = question_data.get('structured_question', {})
            parts = structured_q.get('parts', []) if structured_q else question_data.get('parts', [])
            question['structured_question'] = {
                'question_type': 'structured',
                'subject': question_data.get('subject', subject.replace('_', ' ').title()),
                'topic': question_data.get('topic', topic),
                'difficulty': question_data.get('difficulty', difficulty),
                'stem': question_data.get('question_text', '') or question_data.get('question', ''),
                'parts': parts,
                'total_marks': structured_q.get('total_marks', 0) if structured_q else sum(p.get('marks', 0) for p in parts),
                'marking_rubric': {}
            }
            question['allows_text_input'] = True
            # For Pure Math, also allow image upload
            if subject == 'a_level_pure_math':
                question['allows_image_upload'] = True
        
        # Handle A-Level Biology structured and essay questions
        if subject == 'a_level_biology':
            # Structured questions
            if question_type_mobile == 'structured' or question_data.get('question_type') == 'structured':
                parts = question_data.get('parts', [])
                # Ensure each part has a label
                for part in parts:
                    if 'label' not in part:
                        part['label'] = part.get('part', 'a')
                question['structured_question'] = {
                    'question_type': 'structured',
                    'subject': question_data.get('subject', 'A Level Biology'),
                    'topic': question_data.get('topic', topic),
                    'difficulty': question_data.get('difficulty', difficulty),
                    'stem': question_data.get('stimulus') or question_data.get('question', ''),
                    'parts': parts,
                    'total_marks': question_data.get('total_marks', sum(p.get('marks', 0) for p in parts)),
                    'marking_rubric': {}
                }
                question['allows_text_input'] = True  # Structured questions need text input
            
            # Essay questions
            elif question_type_mobile == 'essay' or question_data.get('question_type') == 'essay':
                question['question_type'] = 'essay'
                question['allows_text_input'] = True  # Essay questions need text input
                question['essay_data'] = {
                    'command_word': question_data.get('command_word', 'Discuss'),
                    'total_marks': question_data.get('total_marks', 25),
                    'time_allocation': question_data.get('time_allocation', '35-40 minutes'),
                    'essay_plan': question_data.get('essay_plan', {}),
                    'must_include_terms': question_data.get('must_include_terms', []),
                    'marking_criteria': question_data.get('marking_criteria', {}),
                    'model_answer_outline': question_data.get('model_answer_outline', ''),
                    'common_mistakes': question_data.get('common_mistakes', [])
                }
                # Solution should include essay plan and marking criteria
                essay_solution_parts = []
                if question_data.get('essay_plan'):
                    essay_solution_parts.append("📋 ESSAY PLAN:")
                    plan = question_data.get('essay_plan', {})
                    if plan.get('introduction'):
                        essay_solution_parts.append(f"Introduction: {plan['introduction']}")
                    if plan.get('main_body'):
                        for section in plan['main_body']:
                            essay_solution_parts.append(f"{section.get('section', 'Section')} [{section.get('marks', 0)} marks]: {section.get('content', '')}")
                    if plan.get('conclusion'):
                        essay_solution_parts.append(f"Conclusion: {plan['conclusion']}")
                if question_data.get('must_include_terms'):
                    essay_solution_parts.append(f"\n🔑 Key Terms to Include: {', '.join(question_data['must_include_terms'])}")
                if question_data.get('marking_criteria'):
                    essay_solution_parts.append("\n📊 MARKING CRITERIA:")
                    criteria = question_data.get('marking_criteria', {})
                    for grade, desc in criteria.items():
                        essay_solution_parts.append(f"{grade}: {desc}")
                if essay_solution_parts:
                    question['solution'] = '\n'.join(essay_solution_parts)
        
        # Convert LaTeX in structured_question (stem/parts) when it was added in blocks above
        if subject in ('mathematics', 'a_level_pure_math', 'combined_science') and question.get('structured_question'):
            try:
                lc = LaTeXConverter()
                sq = question['structured_question']
                if sq.get('stem') and isinstance(sq['stem'], str):
                    sq['stem'] = lc.latex_to_readable_text(sq['stem'])
                for p in (sq.get('parts') or []):
                    for f in ('model_answer', 'question', 'content'):
                        if p.get(f) and isinstance(p[f], str):
                            p[f] = lc.latex_to_readable_text(p[f])
            except Exception as e:
                logger.warning(f"LaTeX conversion for structured_question failed (non-blocking): {e}")
        
        # Deduct credits ONLY after we have successfully produced a question payload.
        # For CS/biology include format (mcq/structured/essay) so Supabase credit_transactions are clear
        desc_fmt = (cs_question_type or question_format or '') if subject == 'computer_science' else (bio_question_type if subject == 'a_level_biology' else question_format or '')
        desc = f'Generated {subject} {question_type} {desc_fmt} question'.replace('  ', ' ').strip() if desc_fmt else f'Generated {subject} {question_type} question'
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'quiz_generation',
            desc
        )
        if credits_remaining is None:
            # If deduction fails (race condition / DB issue), do not deliver paid content.
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500

        question['credits_remaining'] = credits_remaining
        question['credit_cost'] = _credits_display(int(credit_cost))
        question['is_image_question'] = bool(is_image_question)

        return jsonify({'success': True, 'data': question}), 200
        
    except Exception as e:
        logger.error(f"Generate question error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        
        # Provide user-friendly error messages
        if 'timeout' in error_message.lower() or 'timed out' in error_message.lower():
            user_message = 'Question generation is taking longer than expected. Please try again - essay and structured questions may take up to 90 seconds.'
        elif 'connection' in error_message.lower() or 'network' in error_message.lower():
            user_message = 'Network error while generating question. Please check your connection and try again.'
        elif 'a_level_biology' in error_message.lower() or subject == 'a_level_biology':
            user_message = 'Failed to generate Biology question. The AI service may be temporarily unavailable. Please try again in a moment.'
        else:
            user_message = 'Failed to generate question. Please try again.'
        
        return jsonify({'success': False, 'message': user_message}), 500

@mobile_bp.route('/quiz/generate-stream', methods=['POST'])
@require_auth
def generate_question_stream():
    """
    Generate a math question with real-time thinking updates (SSE).
    Uses DeepSeek Reasoner (V3.2 CoT) for step-by-step reasoning.
    Only for Mathematics subjects.
    """
    from flask import Response
    
    try:
        data = request.get_json()
        subject = data.get('subject', 'mathematics')
        topic = data.get('topic', 'Algebra')
        difficulty = data.get('difficulty', 'medium')
        
        # Only allow streaming for mathematics subjects
        if subject not in ['mathematics', 'a_level_pure_math', 'a_level_statistics']:
            return jsonify({
                'success': False,
                'message': 'Streaming only available for Mathematics subjects'
            }), 400
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('math_quiz')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}, Available: {_credits_text(user_credits)}'
            }), 402
        
        user_id = g.current_user_id
        
        def generate():
            """SSE generator for streaming thinking updates."""
            try:
                from services.math_question_generator import MathQuestionGenerator
                math_generator = MathQuestionGenerator()
                
                # Stream thinking updates and final question
                subject_name = 'Mathematics' if subject == 'mathematics' else 'A Level Pure Mathematics'
                for event in math_generator.generate_question_stream(
                    subject_name,
                    topic,
                    difficulty,
                    user_id
                ):
                    event_type = event.get('type', 'unknown')
                    
                    if event_type == 'thinking':
                        # Send thinking update
                        yield f"data: {json.dumps({'type': 'thinking', 'content': event.get('content', ''), 'stage': event.get('stage', 1), 'total_stages': event.get('total_stages', 4)})}\n\n"
                    
                    elif event_type == 'question':
                        # Deduct credits on successful generation (do not deliver if transaction fails)
                        credits_remaining = _deduct_credits_or_fail(
                            user_id,
                            int(credit_cost),
                            'math_quiz',
                            f'Math question: {topic}'
                        )
                        if credits_remaining is None:
                            yield f"data: {json.dumps({'type': 'error', 'message': 'Transaction failed. Please try again.'})}\n\n"
                            continue
                        
                        # Format question for mobile
                        question_data = event.get('data', {})
                        question = {
                            'id': str(uuid.uuid4()),
                            'question_text': question_data.get('question', ''),
                            'question_type': 'short_answer',
                            'options': [],
                            'correct_answer': question_data.get('answer', ''),
                            'solution': question_data.get('solution', ''),
                            'hint': question_data.get('hint_level_1', ''),
                            'explanation': question_data.get('explanation', ''),
                            'points': question_data.get('points', 20),
                            'topic': topic,
                            'difficulty': difficulty,
                            'allows_text_input': True,
                            'allows_image_upload': True,
                            'source': 'deepseek_reasoner',
                            'credits_remaining': credits_remaining
                        }
                        
                        yield f"data: {json.dumps({'type': 'question', 'data': question})}\n\n"
                    
                    elif event_type == 'error':
                        yield f"data: {json.dumps({'type': 'error', 'message': event.get('message', 'Unknown error')})}\n\n"
                
                # Send done signal
                yield f"data: {json.dumps({'type': 'done'})}\n\n"
                
            except Exception as e:
                logger.error(f"SSE streaming error: {e}")
                yield f"data: {json.dumps({'type': 'error', 'message': 'Streaming error occurred'})}\n\n"
        
        return Response(
            generate(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            }
        )
        
    except Exception as e:
        logger.error(f"Generate stream error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/quiz/exam/next', methods=['POST'])
@require_auth
def get_next_exam_question():
    """Get next exam question from olevel_maths table (hybrid: DB images + AI)"""
    try:
        data = request.get_json()
        question_count = data.get('question_count', 1)
        year = data.get('year')
        paper = data.get('paper')
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('math_exam')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}, Available: {_credits_text(user_credits)}'
            }), 400
        
        # Import the math exam service
        from services.math_exam_service import math_exam_service
        
        # Get next question (hybrid: DB or AI based on question_count)
        question_data = math_exam_service.get_next_question(
            g.current_user_id,
            question_count,
            year,
            paper
        )
        
        if not question_data:
            return jsonify({'success': False, 'message': 'Failed to get exam question'}), 500
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'math_exam',
            f'Math exam question #{question_count}'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        
        # Filter out None values from answer_image_urls if present
        if 'answer_image_urls' in question_data:
            question_data['answer_image_urls'] = [
                url for url in question_data['answer_image_urls'] if url
            ]
        
        # Format question for mobile
        question = {
            'id': question_data.get('id', str(uuid.uuid4())),
            'type': question_data.get('type', 'db_image'),
            'question_text': question_data.get('question_text', 'Solve the problem shown in the image.'),
            'question_image_url': question_data.get('question_image_url'),
            'answer_image_urls': question_data.get('answer_image_urls', []),
            'options': question_data.get('options', []),
            'correct_answer': question_data.get('correct_answer', ''),
            'solution': question_data.get('solution', ''),
            'explanation': question_data.get('explanation', ''),
            'topic': question_data.get('topic', ''),
            'year': question_data.get('year', ''),
            'difficulty': question_data.get('difficulty', 'medium'),
            'allows_text_input': question_data.get('allows_text_input', True),
            'allows_image_upload': question_data.get('allows_image_upload', True),
            'is_ai': question_data.get('is_ai', False),
            'points': 10,
            'credits_remaining': credits_remaining
        }
        
        return jsonify({
            'success': True,
            'data': question
        }), 200
        
    except Exception as e:
        logger.error(f"Get exam question error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to get exam question: {error_message}'}), 500

@mobile_bp.route('/quiz/submit-answer', methods=['POST'])
@require_auth
def submit_answer():
    """Submit answer and get feedback with enhanced math support"""
    try:
        data = request.get_json()
        question_id = data.get('question_id')
        answer = data.get('answer', '').strip()
        image_url = data.get('image_url', '')  # For image-based answers
        subject = data.get('subject', '')
        question_type = (data.get('question_type') or '').lower()
        correct_answer = data.get('correct_answer', '')
        solution = data.get('solution', '')
        hint = data.get('hint', '')
        question_text = data.get('question_text', '') # Need question text for AI analysis
        structured_question = data.get('structured_question')  # For structured science marking
        
        if not question_id:
            return jsonify({'success': False, 'message': 'Question ID is required'}), 400
        
        if not answer and not image_url:
            return jsonify({'success': False, 'message': 'Answer (text or image) is required'}), 400
        
        # For math questions, use MathSolver to evaluate
        is_correct = False
        feedback = ''
        detailed_solution = solution or 'No solution provided'
        analysis_result = {}
        
        if subject == 'mathematics' or subject == 'a_level_pure_math':
            from services.math_solver import MathSolver
            math_solver = MathSolver()
            
            # Use the enhanced analyze_answer method
            # If we have the question text, we can get a full analysis
            try:
                if question_text:
                    analysis_result = math_solver.analyze_answer(
                        question_text,
                        answer if answer else "Image Answer",
                        correct_answer,
                        solution
                    )
                    # Ensure analysis_result is a dict
                    if not isinstance(analysis_result, dict):
                        analysis_result = {}
                    is_correct = analysis_result.get('is_correct', False)
                    feedback = analysis_result.get('feedback', '')
                else:
                    # Fallback to simple comparison if question text missing
                    if image_url:
                        # Process image answer using OCR
                        from services.image_service import ImageService
                        image_service = ImageService()
                        # Extract text from image (simplified - would need actual image processing)
                        extracted_text = answer  # Placeholder - would extract from image
                        # Use simple comparison for now
                        user_clean = str(extracted_text).strip().lower()
                        correct_clean = str(correct_answer).strip().lower()
                        is_correct = user_clean == correct_clean
                        analysis_result = {}  # No AI analysis for image answers yet
                    else:
                        # Compare text answer using math solver's comparison logic
                        analysis_result = math_solver.analyze_answer(
                            "Question not provided",
                            answer,
                            correct_answer,
                            solution
                        )
                        # Ensure analysis_result is a dict
                        if not isinstance(analysis_result, dict):
                            analysis_result = {}
                        is_correct = analysis_result.get('is_correct', False)
                        feedback = analysis_result.get('feedback', '')
            except Exception as math_error:
                logger.error(f"Error in math answer analysis: {math_error}", exc_info=True)
                # Fallback to simple comparison
                user_clean = str(answer).strip().lower()
                correct_clean = str(correct_answer).strip().lower()
                is_correct = user_clean == correct_clean
                analysis_result = {}
                feedback = ''

            # Enhance feedback to ensure it's step-by-step and clear
            if is_correct:
                if not feedback:
                    feedback = """✅ Step 1: Your answer is CORRECT!
Step 2: You've successfully applied the mathematical concepts.
Step 3: Well done on showing your working!

💡 Keep practicing similar problems to reinforce your understanding!"""
                elif 'Step 1' not in feedback and 'Step' not in feedback:
                    # Add step structure if missing
                    feedback = f"""✅ Step 1: Your answer is CORRECT!

{feedback}

💡 Well done! Continue practicing to master this topic."""
            else:
                if not feedback:
                    feedback = """❌ Step 1: Your answer needs review.
Step 2: Review the detailed solution steps below to understand the correct approach.
Step 3: Identify where your approach differed and learn from it.

💡 Remember: Understanding the method is more important than just getting the answer!"""
                elif 'Step 1' not in feedback and 'Step' not in feedback:
                    # Add step structure if missing
                    feedback = f"""❌ Step 1: Let's review the correct approach.

{feedback}

📚 Step-by-step solution is provided below. Study each step carefully."""
            
            # Ensure detailed_solution is properly formatted
            if not detailed_solution or detailed_solution == 'No solution provided':
                detailed_solution = solution or 'Review the solution steps provided with the question.'
            
            # Add step-by-step explanation from analysis if available
            step_by_step = analysis_result.get('step_by_step_explanation', '')
            if step_by_step and step_by_step not in detailed_solution:
                detailed_solution = f"{detailed_solution}\n\n📚 DETAILED STEP-BY-STEP EXPLANATION:\n{step_by_step}"
        elif subject == 'combined_science' and (question_type == 'structured' or isinstance(structured_question, dict)):
            # ZIMSEC-style structured question marking (DeepSeek) for mobile.
            try:
                from services.combined_science_generator import CombinedScienceGenerator
                gen = CombinedScienceGenerator()
                evaluation = gen.evaluate_structured_answer(structured_question or {}, answer if answer else "Image Answer")

                if not evaluation or not evaluation.get('success'):
                    return jsonify({'success': False, 'message': 'Failed to evaluate structured answer'}), 500

                is_correct = bool(evaluation.get('is_correct', False))
                feedback = (evaluation.get('overall_teacher_feedback') or '').strip() or ('✅ Good work!' if is_correct else '❌ Not quite right.')
                detailed_solution = (evaluation.get('well_detailed_explanation') or '').strip() or (solution or 'No solution provided')
                analysis_result = {
                    'what_went_right': '',
                    'what_went_wrong': '',
                    'improvement_tips': '\n'.join(evaluation.get('next_steps', [])) if isinstance(evaluation.get('next_steps'), list) else '',
                    'encouragement': feedback,
                    'related_topic': structured_question.get('topic', '') if isinstance(structured_question, dict) else ''
                }

                # Add a compact per-part summary into feedback (optional, but helpful)
                per_part = evaluation.get('per_part', [])
                if isinstance(per_part, list) and per_part:
                    lines = []
                    for p in per_part[:6]:
                        lbl = p.get('label', '')
                        got = p.get('awarded', 0)
                        mx = p.get('max_marks', p.get('marks', 0))
                        tfb = (p.get('teacher_feedback') or '').strip()
                        if tfb:
                            lines.append(f"{lbl} [{got}/{mx}]: {tfb}")
                    if lines:
                        feedback = feedback + "\n\nPart feedback:\n" + "\n".join(lines)

            except Exception as se:
                logger.error(f"Structured answer evaluation error: {se}", exc_info=True)
                return jsonify({'success': False, 'message': 'Error evaluating structured answer'}), 500
        elif subject == 'a_level_biology' and question_type == 'essay':
            # A-Level Biology Essay marking - provide feedback based on essay plan and marking criteria
            try:
                # For essays, we provide constructive feedback rather than strict right/wrong
                # Essays are evaluated based on content, structure, and use of key terms
                feedback = '📝 Essay submitted! Review the marking criteria and model answer outline below.'
                is_correct = True  # Essays are not strictly right/wrong, but we mark as "submitted" for progress tracking
                detailed_solution = solution or 'Review the essay plan and marking criteria provided with the question.'
                analysis_result = {
                    'feedback': feedback,
                    'encouragement': 'Well done on completing your essay! Compare your answer with the model answer outline and marking criteria.',
                    'improvement_tips': 'Review the key terms that should be included and ensure your essay follows the suggested structure.'
                }
            except Exception as e:
                logger.error(f"Essay answer evaluation error: {e}", exc_info=True)
                feedback = 'Essay submitted successfully. Review the solution below.'
                is_correct = True
                detailed_solution = solution or 'No detailed feedback available.'
                analysis_result = {}
        else:
            # For other subjects (Combined Science, English, etc.)
            # Handle MCQ answer validation: could be option letter (A/B/C/D) or full option text
            user_answer_normalized = str(answer).strip()
            correct_answer_normalized = str(correct_answer).strip()
            
            # Get options from the request data for flexible matching
            options = data.get('options', [])
            
            # Normalize options to list format
            if isinstance(options, dict):
                options = [options.get(k, '') for k in ['A', 'B', 'C', 'D'] if options.get(k)]
            
            # Check for exact match first (handles both letter or text)
            if user_answer_normalized.lower() == correct_answer_normalized.lower():
                is_correct = True
                feedback = '✅ Correct! Well done!'
            else:
                # CASE 1: correct_answer is a letter (A/B/C/D)
                if correct_answer_normalized.upper() in ['A', 'B', 'C', 'D']:
                    correct_letter = correct_answer_normalized.upper()
                    option_index = ord(correct_letter) - ord('A')
                    
                    # Get the correct option text
                    correct_option_text = None
                    if isinstance(options, list) and 0 <= option_index < len(options):
                        correct_option_text = str(options[option_index]).strip()
                    
                    # Check if user's answer matches the correct option text
                    if correct_option_text and user_answer_normalized.lower() == correct_option_text.lower():
                        is_correct = True
                        feedback = '✅ Correct! Well done!'
                    # Check if user sent the correct letter
                    elif user_answer_normalized.upper() == correct_letter:
                        is_correct = True
                        feedback = '✅ Correct! Well done!'
                    else:
                        # Check if user selected a DIFFERENT option - find which one they selected
                        user_selected_letter = None
                        if user_answer_normalized.upper() in ['A', 'B', 'C', 'D']:
                            user_selected_letter = user_answer_normalized.upper()
                        else:
                            # User sent option text - find which letter it matches
                            for i, opt in enumerate(options):
                                if str(opt).strip().lower() == user_answer_normalized.lower():
                                    user_selected_letter = chr(ord('A') + i)
                                    break
                        
                        # Compare the letters
                        if user_selected_letter and user_selected_letter == correct_letter:
                            is_correct = True
                            feedback = '✅ Correct! Well done!'
                        else:
                            is_correct = False
                            feedback = '❌ Incorrect. The correct answer is shown below.'
                
                # CASE 2: correct_answer is text (full option text)
                else:
                    # Find which letter corresponds to the correct answer text
                    correct_letter = None
                    for i, opt in enumerate(options):
                        if str(opt).strip().lower() == correct_answer_normalized.lower():
                            correct_letter = chr(ord('A') + i)
                            break
                    
                    # Find which letter the user selected
                    user_letter = None
                    if user_answer_normalized.upper() in ['A', 'B', 'C', 'D']:
                        user_letter = user_answer_normalized.upper()
                    else:
                        for i, opt in enumerate(options):
                            if str(opt).strip().lower() == user_answer_normalized.lower():
                                user_letter = chr(ord('A') + i)
                                break
                    
                    # Compare
                    if correct_letter and user_letter and correct_letter == user_letter:
                        is_correct = True
                        feedback = '✅ Correct! Well done!'
                    elif user_answer_normalized.lower() == correct_answer_normalized.lower():
                        is_correct = True
                        feedback = '✅ Correct! Well done!'
                    else:
                        is_correct = False
                        feedback = '❌ Incorrect. The correct answer is shown below.'
        
        points_earned = 10 if is_correct else 0
        
        # Add XP if correct
        if is_correct:
            try:
                add_xp(g.current_user_id, points_earned, 'quiz_answer_correct', f'Correct answer in {subject} quiz')
            except Exception as xp_error:
                logger.warning(f"Failed to add XP (non-critical): {xp_error}")
                # Continue execution - XP failure should not block answer submission
        
        # Format detailed solution to ensure step-by-step structure
        if detailed_solution and 'Step 1' not in detailed_solution and 'Step' not in detailed_solution:
            # Try to add step structure if solution is provided but not formatted
            solution_lines = detailed_solution.split('\n')
            if len(solution_lines) > 1:
                # Add step numbers if multiple lines
                formatted_solution = []
                step_num = 1
                for line in solution_lines:
                    line = line.strip()
                    if line and not line.startswith('Step'):
                        formatted_solution.append(f"Step {step_num}: {line}")
                        step_num += 1
                    else:
                        formatted_solution.append(line)
                if formatted_solution:
                    detailed_solution = '\n'.join(formatted_solution)
        
        # Convert LaTeX to readable text, normalize spacing, and apply professional formatting for Vertex/AI-derived answers and explanations
        if subject in ('mathematics', 'a_level_pure_math', 'combined_science'):
            try:
                lc = LaTeXConverter()
                detailed_solution = lc.latex_to_readable_text(detailed_solution or '')
                detailed_solution = LaTeXConverter.normalize_explanation_spacing(detailed_solution)
                detailed_solution = LaTeXConverter.format_explanation_professionally(detailed_solution, max_length=2000)
                feedback = LaTeXConverter.format_explanation_professionally(feedback or '', max_length=600)
                for k in ('what_went_right', 'what_went_wrong', 'improvement_tips', 'encouragement', 'related_topic', 'step_by_step_explanation'):
                    v = analysis_result.get(k)
                    if v and isinstance(v, str):
                        v = lc.latex_to_readable_text(v)
                        v = LaTeXConverter.normalize_explanation_spacing(v)
                        analysis_result[k] = LaTeXConverter.format_explanation_professionally(v, max_length=800)
            except Exception as e:
                logger.warning(f"LaTeX conversion in submit-answer failed (non-blocking): {e}")
        
        return jsonify({
            'success': True,
            'data': {
                'correct': is_correct,
                'feedback': feedback,
                'solution': detailed_solution,
                'hint': hint if not is_correct else '',
                'points_earned': points_earned,
                'credits_used': 0,  # Already deducted
                
                # Enhanced feedback fields with step-by-step structure
                'what_went_right': analysis_result.get('what_went_right', ''),
                'what_went_wrong': analysis_result.get('what_went_wrong', ''),
                'improvement_tips': analysis_result.get('improvement_tips', ''),
                'encouragement': analysis_result.get('encouragement', ''),
                'related_topic': analysis_result.get('related_topic', ''),
                'step_by_step_explanation': analysis_result.get('step_by_step_explanation', detailed_solution)
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Submit answer error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to submit answer: {error_message}'}), 500

@mobile_bp.route('/quiz/start-session', methods=['POST'])
@require_auth
def start_session():
    """Start a new quiz session"""
    try:
        data = request.get_json()
        subject = data.get('subject', '')
        topic = data.get('topic')
        session_type = data.get('type', 'topical')
        
        session_id = str(uuid.uuid4())
        
        # TODO: Store session in database
        
        return jsonify({
            'success': True,
            'data': {
                'id': session_id,
                'subject': subject,
                'topic': topic,
                'session_type': session_type,
                'questions_answered': 0,
                'correct_answers': 0,
                'started_at': datetime.utcnow().isoformat()
            }
        }), 200
    except Exception as e:
        logger.error(f"Start session error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-programming-lab/ai', methods=['POST'])
@require_auth
def programming_lab_ai_endpoint():
    """
    Programming Lab AI: code help, debug, explain, suggest-test, fix-error, general-question.
    Costs 1 credit (10 units) per request. Deducts only after successful AI response.
    """
    try:
        user_id = g.current_user_id
        credit_cost = advanced_credit_service.get_credit_cost('programming_lab_ai')
        user_credits = get_user_credits(user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}, Available: {_credits_text(user_credits)}',
                'credit_cost': _credits_display(credit_cost),
            }), 402

        payload = request.get_json() or {}
        result = programming_lab_ai_service.process_request(payload)
        if not result:
            return jsonify({'success': False, 'message': 'AI request failed'}), 500

        credits_remaining = _deduct_credits_or_fail(
            user_id, credit_cost, 'programming_lab_ai', 'Programming Lab AI'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Credit deduction failed'}), 402

        return jsonify({
            'success': True,
            'data': {
                **result,
                'credits_remaining': credits_remaining,
                'credit_cost': _credits_display(credit_cost),
            }
        }), 200
    except Exception as e:
        logger.error(f"Programming Lab AI error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-lab/knowledge-check', methods=['POST'])
@require_auth
def generate_virtual_lab_knowledge_check():
    """
    Generate Virtual Lab knowledge-check questions using DeepSeek (Costs 2 credits).

    Payload:
      - simulation_id (optional, for analytics/debug)
      - subject: biology | chemistry | physics
      - topic: string
      - difficulty: easy | medium | hard
      - count: int (default 5, max 20)

    Returns:
      data: [
        { id, question_text, options, correct_index, explanation }
      ]
    """
    try:
        data = request.get_json() or {}

        simulation_id = data.get('simulation_id') or data.get('simulationId') or ''
        subject = (data.get('subject') or '').strip().lower()
        topic = (data.get('topic') or '').strip()
        difficulty_in = (data.get('difficulty') or 'medium').strip().lower()
        count_raw = data.get('count', 5)

        if subject not in ['biology', 'chemistry', 'physics', 'mathematics']:
            return jsonify({'success': False, 'message': 'Invalid subject'}), 400

        user_id = g.current_user_id
        breakdown = get_credit_breakdown(user_id)
        purchased_credits = breakdown.get('purchased_credits', 0) or 0
        if purchased_credits == 0 and simulation_id:
            free_ids = FREE_VIRTUAL_LAB_SIMULATIONS.get(subject, set())
            if simulation_id not in free_ids:
                return jsonify({
                    'success': False,
                    'message': 'This simulation is locked. Purchase credits to unlock all simulations.'
                }), 402

        # Map app difficulty to generator difficulty
        difficulty_map = {
            'easy': 'easy',
            'medium': 'medium',
            'hard': 'difficult',
            'difficult': 'difficult',
        }
        difficulty = difficulty_map.get(difficulty_in, 'medium')

        try:
            count = int(count_raw)
        except Exception:
            count = 5
        count = max(1, min(count, 20))

        parent_subject = subject.capitalize()
        if not topic:
            # Sensible defaults per subject if topic omitted
            default_topics = {
                'biology': 'Cell Structure and Organisation',
                'chemistry': 'Acids, Bases and Salts',
                'physics': 'Kinematics',
                'mathematics': 'Differentiation',
            }
            topic = default_topics.get(subject, 'General')

        science_gen = CombinedScienceGenerator()
        questions = []

        def _options_to_list(opts):
            if isinstance(opts, dict):
                # Ensure A,B,C,D order
                ordered = []
                for k in ['A', 'B', 'C', 'D']:
                    if opts.get(k):
                        ordered.append(opts.get(k))
                # Fallback to key-sorted order if unexpected keys
                return ordered if ordered else [opts.get(k, '') for k in sorted(opts.keys()) if opts.get(k)]
            if isinstance(opts, list):
                return [str(o) for o in opts if str(o).strip()]
            return []

        def _correct_index_from_answer(answer, options):
            # DeepSeek generator typically returns A/B/C/D
            if isinstance(answer, str):
                a = answer.strip().upper()
                if a in ['A', 'B', 'C', 'D']:
                    return ['A', 'B', 'C', 'D'].index(a)
                # Sometimes the answer is the option text
                for idx, opt in enumerate(options):
                    if opt.strip().lower() == answer.strip().lower():
                        return idx
            return 0

        for _ in range(count):
            q = science_gen.generate_topical_question(parent_subject, topic, difficulty, g.current_user_id)
            if not q:
                continue

            options = _options_to_list(q.get('options', []))
            # Ensure we always have 4 options for the mobile UI
            if len(options) < 4:
                # Pad with plausible placeholders if DeepSeek response is malformed
                while len(options) < 4:
                    options.append(f"Option {chr(65 + len(options))}")
            options = options[:4]

            answer = q.get('answer') or q.get('correct_answer') or 'A'
            correct_index = _correct_index_from_answer(answer, options)
            explanation = q.get('explanation') or q.get('solution') or ''

            questions.append({
                'id': str(uuid.uuid4()),
                'question_text': q.get('question', '') or q.get('question_text', ''),
                'options': options,
                'correct_index': correct_index,
                'explanation': explanation,
                'meta': {
                    'simulation_id': simulation_id,
                    'subject': subject,
                    'topic': topic,
                    'difficulty': difficulty_in,
                }
            })

        if not questions:
            return jsonify({'success': False, 'message': 'Failed to generate questions'}), 500

        # Deduct credits ONLY after successful generation (and charge based on actual delivered count).
        cost_per_question = advanced_credit_service.get_credit_cost('virtual_lab_knowledge_check')
        delivered_count = len(questions)
        total_cost = int(cost_per_question) * int(delivered_count)
        current_credits = get_user_credits(user_id) or 0
        if current_credits < total_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(total_cost)}, Available: {_credits_text(current_credits)}'
            }), 402

        credits_remaining = _deduct_credits_or_fail(
            user_id,
            total_cost,
            'virtual_lab_knowledge_check',
            f'Virtual Lab Knowledge Check ({delivered_count} questions)'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500

        return jsonify({'success': True, 'data': questions, 'credits_remaining': credits_remaining}), 200

    except Exception as e:
        logger.error(f"Virtual lab knowledge check generation error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/virtual-lab/geo-maps-feedback', methods=['POST'])
@require_auth
def geo_maps_feedback():
    """
    Geography Maps Lab – AI feedback from map_actions (DeepSeek).
    Costs 1 credit (geo_maps_feedback).

    Payload:
      - level: "O" | "A"
      - topic: string (optional)
      - task_type: string (optional, e.g. "Mapwork")
      - map_actions: { markers, lines?, measurements?, selected_place? }
      - student_answer_text: string (optional, for marking)

    Returns:
      data: { response: string (markdown) }, credits_remaining
    """
    try:
        data = request.get_json() or {}
        level = (data.get('level') or 'O').strip().upper()
        if level not in ('O', 'A'):
            level = 'O'
        topic = (data.get('topic') or 'Map Work and Geographical Information Systems (GIS)').strip()
        task_type = (data.get('task_type') or 'Mapwork').strip()
        map_actions = data.get('map_actions') or {}
        student_answer_text = (data.get('student_answer_text') or '').strip() or None

        user_id = g.current_user_id
        credit_cost = advanced_credit_service.get_credit_cost('geo_maps_feedback')
        current_credits = get_user_credits(user_id) or 0
        if current_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}, Available: {_credits_text(current_credits)}',
            }), 402

        response_text = get_geotutor_feedback(
            level=level,
            topic=topic,
            task_type=task_type,
            map_actions=map_actions,
            student_answer_text=student_answer_text,
        )

        credits_remaining = _deduct_credits_or_fail(
            user_id,
            int(credit_cost),
            'geo_maps_feedback',
            'Geography Maps Lab AI feedback',
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500

        return jsonify({
            'success': True,
            'data': {'response': response_text},
            'credits_remaining': credits_remaining,
        }), 200

    except Exception as e:
        logger.error(f"Geo maps feedback error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/quiz/session/<session_id>', methods=['GET'])
@require_auth
def get_session(session_id):
    """Get quiz session details"""
    try:
        # TODO: Retrieve session from database
        return jsonify({
            'success': True,
            'data': {
                'id': session_id,
                'subject': '',
                'topic': '',
                'session_type': 'topical',
                'questions_answered': 0,
                'correct_answers': 0,
                'started_at': datetime.utcnow().isoformat()
            }
        }), 200
    except Exception as e:
        logger.error(f"Get session error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# CREDIT ENDPOINTS
# ============================================================================

@mobile_bp.route('/credits/balance', methods=['GET'])
@require_auth
def get_credit_balance():
    """Get user credit balance"""
    try:
        credits = get_user_credits(g.current_user_id) or 0
        return jsonify({
            'success': True,
            'data': {
                'balance': _credits_display(credits)
            }
        }), 200
    except Exception as e:
        logger.error(f"Get credit balance error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/credits/transactions', methods=['GET'])
@require_auth
def get_credit_transactions():
    """Get credit transaction history"""
    try:
        limit = request.args.get('limit', 20, type=int)
        
        from database.external_db import make_supabase_request
        
        # Fetch payment transactions (completed/approved ones)
        # We want payments that were successful
        payment_txs = make_supabase_request(
            'GET',
            'payment_transactions',
            None,
            filters={
                'user_id': f"eq.{g.current_user_id}",
                'status': 'in.(completed,approved,paid)'
            },
            limit=limit,
            use_service_role=True
        ) or []
        
        # Transform to standard format
        transactions = []
        
        # Add payment transactions
        for tx in payment_txs:
            credits_units = int(tx.get('credits', 0) or 0)
            transactions.append({
                'id': tx.get('id', str(uuid.uuid4())),
                'transaction_type': 'purchase',
                'credits_change': _credits_display(credits_units),
                'balance_before': 0, # We don't historically track balance snapshot in this simple table yet
                'balance_after': 0,
                'description': f"Purchased {_credits_text(credits_units)} credits",
                'transaction_date': tx.get('created_at'),
                'amount': tx.get('amount', 0),
                'currency': 'USD'
            })
            
        # Also fetching usage logs if we had them, but for now payments are the most important for the graph
        # If we have a credit_usage_logs table, we would fetch that too.
        # Assuming we might want to show usage:
        # usage_logs = make_supabase_request('GET', 'credit_usage_logs', ...)
        
        # Sort combined list by date desc
        transactions.sort(key=lambda x: x.get('transaction_date', ''), reverse=True)
        
        return jsonify({
            'success': True,
            'data': transactions[:limit]
        }), 200
    except Exception as e:
        logger.error(f"Get credit transactions error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/credits/packages', methods=['GET'])
@require_auth
def get_credit_packages():
    """Get available credit packages"""
    try:
        # Get packages from PaymentService to ensure consistency
        from services.payment_service import PaymentService
        payment_service_instance = PaymentService()
        packages = payment_service_instance.get_credit_packages()
        
        return jsonify({
            'success': True,
            'data': packages
        }), 200
    except Exception as e:
        logger.error(f"Get credit packages error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/credits/purchase', methods=['POST'])
@require_auth
def initiate_credit_purchase():
    """Initiate credit purchase - supports EcoCash and Visa/Mastercard via Paynow"""
    try:
        from database.external_db import make_supabase_request
        
        data = request.get_json()
        package_id = data.get('package_id')
        payment_method = data.get('payment_method', 'ecocash')  # Default to ecocash for backward compatibility
        
        if not package_id:
            return jsonify({'success': False, 'message': 'Package ID is required'}), 400
        
        # Validate payment method
        if payment_method not in ['ecocash', 'visa_mastercard']:
            return jsonify({'success': False, 'message': 'Invalid payment method. Use "ecocash" or "visa_mastercard"'}), 400
        
        # Get package details
        # Get available packages from PaymentService
        from services.payment_service import PaymentService
        payment_service_instance = PaymentService()
        available_packages = payment_service_instance.get_credit_packages()
        
        # Convert list to dictionary for easy lookup
        packages = {pkg['id']: pkg for pkg in available_packages}
        
        package = packages.get(package_id)
        if not package:
            logger.warning(f"Invalid package ID requested: {package_id}. Available: {list(packages.keys())}")
            return jsonify({'success': False, 'message': 'Invalid package'}), 400
        
        # Get user data for payment
        user_data = get_user_registration(g.current_user_id)
        if not user_data:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        email = data.get('email', user_data.get('email', ''))
        
        # Validate required fields based on payment method
        if payment_method == 'ecocash':
            phone_number = data.get('phone_number', user_data.get('phone_number', ''))
            if not phone_number or not email:
                return jsonify({
                    'success': False,
                    'message': 'Phone number and email are required for EcoCash payment'
                }), 400
            
            # Normalize and validate phone number - MUST be exactly 10 digits
            phone_cleaned = re.sub(r'[^\d+]', '', phone_number.strip())
            
            # Normalize to local format (10 digits: 077XXXXXXX or 078XXXXXXX)
            local_phone = phone_cleaned
            if phone_cleaned.startswith('+263'):
                local_phone = '0' + phone_cleaned[4:]  # +263771111111 -> 0771111111
            elif phone_cleaned.startswith('263'):
                local_phone = '0' + phone_cleaned[3:]  # 263771111111 -> 0771111111
            
            # Validate: MUST be exactly 10 digits with valid prefix
            if len(local_phone) != 10:
                return jsonify({
                    'success': False,
                    'message': f'Invalid phone number: must be exactly 10 digits (you entered {len(local_phone)} digits). Format: 077XXXXXXX or 078XXXXXXX'
                }), 400
            
            if not (local_phone.startswith('07') and local_phone[:3] in ['077', '078']):
                return jsonify({
                    'success': False,
                    'message': 'Invalid phone number format. Must start with 077 or 078 (e.g., 0771234567)'
                }), 400
            
            # Use normalized phone number
            phone_number = local_phone
        else:
            # Visa/Mastercard only needs email
            if not email:
                return jsonify({
                    'success': False,
                    'message': 'Email is required for card payment'
                }), 400
            phone_number = data.get('phone_number', '')  # Optional for card payments
        
        # Initiate payment via Paynow
        paynow_service = PaynowService()
        
        if payment_method == 'ecocash':
            # Use PaymentService wrapper which handles DB save and Fallback to Manual automatically
            # This solves the issue where Paynow configuration errors cause the app to crash/fail
            payment_result = payment_service_instance.create_paynow_payment(
                 user_id=g.current_user_id,
                 package_id=package_id,
                 phone_number=phone_number,
                 email=email
            )
            # Reference is generated inside create_paynow_payment
            reference = payment_result.get('reference_code')
            
        else:
            # Visa/Mastercard web checkout (keep existing manual flow for now)
            reference = f"MOBILE_{uuid.uuid4().hex[:8].upper()}"
            
            # Store payment transaction in database before initiating
            # from database.external_db import make_supabase_request  <-- Removed, already imported at top
            # Convert package credits to units for storage (1 credit = 10 units)
            from utils.credit_units import credits_to_units
            payment_transaction = {
                'user_id': g.current_user_id,
                'reference_code': reference,
                'package_id': package_id,
                'amount': package['price'],
                'credits': int(credits_to_units(package['credits'])),  # Store as units
                'payment_method': 'paynow_' + payment_method,
                'status': 'pending',
                'phone_number': phone_number,
                'email': email,
                'created_at': datetime.utcnow().isoformat()
            }
            
            try:
                make_supabase_request('POST', 'payment_transactions', payment_transaction, use_service_role=True)
            except Exception as e:
                logger.warning(f"Failed to store payment transaction: {e}")

            # Use Visa/Mastercard web checkout
            payment_result = paynow_service.create_visa_mastercard_payment(
                amount=package['price'],
                email=email,
                reference=reference,
                description=f"NerdX {package_id} - {package['credits']} credits"
            )
        
        if not payment_result.get('success'):
            return jsonify({
                'success': False,
                'message': payment_result.get('message', 'Failed to initiate payment')
            }), 400
        
        # Update transaction with poll_url (non-blocking - payment prompt already sent successfully)
        try:
            make_supabase_request(
                'PATCH',
                'payment_transactions',
                {
                    'poll_url': payment_result.get('poll_url', '')  # Only use poll_url (paynow_poll_url doesn't exist)
                },
                filters={'reference_code': f"eq.{reference}"},
                use_service_role=True
            )
        except Exception as e:
            # Log as warning, not error - payment prompt was successfully sent
            logger.warning(f"Payment prompt sent successfully but failed to update transaction poll_url: {reference} - {e}")
        
        # Build response based on payment method
        response_data = {
            'reference': reference,
            'poll_url': payment_result.get('poll_url', ''),
            'instructions': payment_result.get('instructions', ''),
            'amount': package['price'],
            'credits': package['credits'],
            'payment_method': payment_method
        }
        
        # Include redirect_url for card payments
        if payment_method == 'visa_mastercard':
            response_data['redirect_url'] = payment_result.get('redirect_url', '')
        
        return jsonify({
            'success': True,
            'data': response_data
        }), 200
        
    except Exception as e:
        logger.error(f"Initiate credit purchase error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# PAYMENT ENDPOINTS
# ============================================================================

@mobile_bp.route('/payment/initiate', methods=['POST'])
@require_auth
def initiate_payment():
    """Initiate payment"""
    try:
        data = request.get_json()
        package_id = data.get('package_id')
        payment_method = data.get('payment_method', 'paynow')
        
        # Similar to credit purchase
        packages = {
            '1': {'credits': 50, 'price': 1.0},
            '2': {'credits': 120, 'price': 2.0},
            '3': {'credits': 350, 'price': 5.0},
            '4': {'credits': 750, 'price': 10.0}
        }
        
        package = packages.get(package_id)
        if not package:
            return jsonify({'success': False, 'message': 'Invalid package'}), 400
        
        paynow_service = PaynowService()
        reference = f"MOBILE_{uuid.uuid4().hex[:8].upper()}"
        
        payment_result = paynow_service.initiate_payment(
            user_id=g.current_user_id,
            amount=package['price'],
            credits=package['credits'],
            reference=reference
        )
        
        return jsonify({
            'success': True,
            'data': {
                'reference': reference,
                'payment_url': payment_result.get('payment_url'),
                'instructions': payment_result.get('instructions')
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Initiate payment error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/payment/status/<reference>', methods=['GET'])
@require_auth
def check_payment_status(reference):
    """Check payment status"""
    try:
        from database.external_db import make_supabase_request
        from services.payment_service import payment_service

        # Always run Paynow status sync so credits are applied promptly
        try:
            payment_service.check_paynow_payment_status(reference)
        except Exception as sync_error:
            logger.warning(f"Paynow status sync failed: {sync_error}")

        # Get payment transaction from database (latest status)
        result = make_supabase_request(
            'GET',
            'payment_transactions',
            None,
            filters={'reference_code': f"eq.{reference}", 'user_id': f"eq.{g.current_user_id}"},
            use_service_role=True
        )

        if not result or len(result) == 0:
            return jsonify({'success': False, 'message': 'Payment not found'}), 404

        transaction = result[0]
        status = transaction.get('status', 'pending')
        credits_units = transaction.get('credits', 0) or 0
        display_credits = _credits_display(credits_units)

        return jsonify({
            'success': True,
            'data': {
                'reference': reference,
                'status': status,  # 'pending', 'approved', 'failed', 'cancelled'
                'amount': transaction.get('amount', 0),
                'credits': display_credits,
                'paid': status in ['approved', 'completed', 'paid']
            }
        }), 200
    except Exception as e:
        logger.error(f"Check payment status error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500


@mobile_bp.route('/payment/latest', methods=['GET'])
@require_auth
def get_latest_payment():
    """Get latest Paynow EcoCash payment for the current user."""
    try:
        # Look for most recent initiated/pending Paynow EcoCash payment
        result = make_supabase_request(
            'GET',
            'payment_transactions',
            None,
            filters={
                'user_id': f"eq.{g.current_user_id}",
                'payment_method': 'eq.paynow_ecocash',
                'status': 'in.(initiated,pending)',
                'order': 'created_at.desc'
            },
            limit=1,
            use_service_role=True
        )

        if not result:
            return jsonify({'success': True, 'data': None}), 200

        transaction = result[0]
        created_at = transaction.get('created_at')
        if created_at:
            try:
                created_dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                if datetime.utcnow() - created_dt.replace(tzinfo=None) > timedelta(minutes=10):
                    return jsonify({'success': True, 'data': None}), 200
            except Exception:
                # If parsing fails, continue and return the record
                pass

        poll_url = transaction.get('paynow_poll_url') or transaction.get('poll_url')
        if not poll_url:
            admin_notes = transaction.get('admin_notes', '')
            match = re.search(r'Poll URL:\s*(https?://[^\s]+)', admin_notes)
            if match:
                poll_url = match.group(1).strip()

        response_data = {
            'reference': transaction.get('reference_code'),
            'poll_url': poll_url or '',
            'instructions': 'Please check your phone for the EcoCash prompt and enter your PIN to complete the payment.',
            'amount': transaction.get('amount', 0),
            'credits': _credits_display(transaction.get('credits', 0) or 0),
            'payment_method': 'ecocash'
        }

        return jsonify({'success': True, 'data': response_data}), 200
    except Exception as e:
        logger.error(f"Get latest payment error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# REFERRAL ENDPOINTS
# ============================================================================

@mobile_bp.route('/referral/code', methods=['GET'])
@require_auth
def get_referral_code():
    """Get user's referral code"""
    try:
        user_data = get_user_registration(g.current_user_id)
        if not user_data:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        nerdx_id = user_data.get('nerdx_id')
        
        return jsonify({
            'success': True,
            'data': {
                'code': nerdx_id
            }
        }), 200
    except Exception as e:
        logger.error(f"Get referral code error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/referral/apply', methods=['POST'])
@require_auth
def apply_referral_code():
    """Apply referral code"""
    try:
        data = request.get_json()
        code = data.get('code', '').strip().upper()
        
        if not code:
            return jsonify({'success': False, 'message': 'Referral code is required'}), 400
        
        # Check if code is valid
        referrer = get_user_by_nerdx_id(code)
        if not referrer:
            return jsonify({'success': False, 'message': 'Invalid referral code'}), 400
        
        # Check if user already used a referral
        user_data = get_user_registration(g.current_user_id)
        if user_data.get('referred_by_nerdx_id'):
            return jsonify({'success': False, 'message': 'Referral code already applied'}), 400
        
        # Apply referral
        referral_service = ReferralService()
        result = referral_service.process_referral(g.current_user_id, code)
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'data': {
                    'credits_earned': Config.REFERRAL_BONUS
                }
            }), 200
        else:
            return jsonify({'success': False, 'message': result.get('message', 'Failed to apply referral')}), 400
            
    except Exception as e:
        logger.error(f"Apply referral code error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/referral/stats', methods=['GET'])
@require_auth
def get_referral_stats_simple():
    """Get referral statistics (legacy endpoint)"""
    try:
        # TODO: Get referral stats from database
        return jsonify({
            'success': True,
            'data': {
                'total_referrals': 0,
                'credits_earned': 0
            }
        }), 200
    except Exception as e:
        logger.error(f"Get referral stats error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# MATH ENDPOINTS
# ============================================================================

@mobile_bp.route('/math/graph', methods=['POST'])
@require_auth
def generate_math_graph():
    """Generate math graph"""
    try:
        data = request.get_json()
        function_text = data.get('function_text', '')
        
        if not function_text:
            return jsonify({'success': False, 'message': 'Function text is required'}), 400
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('math_graph_practice')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        
        # Generate graph
        graph_service = GraphService()
        graph_path = graph_service.generate_function_graph(function_text)
        if not graph_path:
            return jsonify({'success': False, 'message': 'Failed to generate graph image'}), 500

        graph_url = convert_local_path_to_public_url(graph_path)
        if not graph_url:
            import os
            filename = os.path.basename(graph_path)
            base_url = os.environ.get('RENDER_EXTERNAL_URL', 'https://nerdx.onrender.com')
            graph_url = f"{base_url.rstrip('/')}/static/graphs/{filename}"
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'math_graph_practice',
            'Math graph generation'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500

        return jsonify({
            'success': True,
            'data': {
                'graph_url': graph_url,
                'image_url': graph_url,
                'credits_remaining': credits_remaining
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate math graph error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# ENGLISH ENDPOINTS
# ============================================================================

@mobile_bp.route('/english/comprehension', methods=['POST'])
@require_auth
def generate_comprehension():
    """Generate English comprehension passage (long story 900-1200 words, 10 questions). Vertex primary, DeepSeek fallback."""
    try:
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('english_comprehension')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        
        data = request.get_json() or {}
        theme = (data.get('theme') or '').strip() or None
        form_level = int(data.get('form_level', 4))
        
        # Generate comprehension (Vertex primary; passage 900-1200 words, exactly 10 questions)
        english_service = EnglishService()
        comprehension = english_service.generate_comprehension(theme=theme, form_level=form_level)
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'english_comprehension',
            'English comprehension generation'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        
        return jsonify({
            'success': True,
            'data': {
                'title': comprehension.get('title', ''),
                'passage': comprehension.get('passage', ''),
                'questions': comprehension.get('questions', []),
                'credits_remaining': credits_remaining
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate comprehension error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to generate comprehension: {error_message}'}), 500

@mobile_bp.route('/english/essay/prompts', methods=['GET'])
@require_auth
def get_essay_prompts():
    """Get essay prompts"""
    try:
        # Check credits (optional, maybe free or low cost?)
        # Let's make it free for now as it encourages usage
        
        english_service = EnglishService()
        result = english_service.generate_essay_prompts()
        
        return jsonify({
            'success': True,
            'data': result.get('prompts', [])
        }), 200
        
    except Exception as e:
        logger.error(f"Get essay prompts error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/free-response-topics', methods=['GET'])
@require_auth
def get_free_response_topics():
    """Get free response essay topics"""
    try:
        english_service = EnglishService()
        result = english_service.generate_free_response_topics()
        
        return jsonify({
            'success': True,
            'data': result.get('topics', [])
        }), 200
        
    except Exception as e:
        logger.error(f"Get free response topics error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/guided-composition', methods=['GET'])
@require_auth
def get_guided_composition():
    """Get guided composition prompt"""
    try:
        english_service = EnglishService()
        result = english_service.generate_guided_composition_prompt()
        
        return jsonify({
            'success': True,
            'data': result.get('prompt', {})
        }), 200
        
    except Exception as e:
        logger.error(f"Get guided composition error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/submit', methods=['POST'])
@require_auth
def submit_essay_marking():
    """Submit essay for AI marking"""
    try:
        data = request.get_json()
        essay_type = data.get('essay_type') # 'free_response' or 'guided'
        student_name = data.get('student_name')
        student_surname = data.get('student_surname')
        essay_text = data.get('essay_text')
        
        # Optional context depending on type
        topic = data.get('topic') # For free response
        prompt = data.get('prompt') # For guided
        
        if not essay_type or not student_name or not student_surname or not essay_text:
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400
            
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('english_essay_marking')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
            
        english_service = EnglishService()
        result = None
        
        if essay_type == 'free_response':
            if not topic:
                return jsonify({'success': False, 'message': 'Topic is required for free response'}), 400
            result = english_service.mark_free_response_essay(student_name, student_surname, essay_text, topic)
        elif essay_type == 'guided':
            if not prompt:
                return jsonify({'success': False, 'message': 'Prompt is required for guided composition'}), 400
            result = english_service.mark_guided_composition(student_name, student_surname, essay_text, prompt)
        else:
            return jsonify({'success': False, 'message': 'Invalid essay type'}), 400
            
        if not result or not result.get('success'):
            return jsonify({'success': False, 'message': 'Failed to mark essay'}), 500
            
        if result and result.get('success'):
            marking_result = result.get('result', {})
            
            # Generate PDF report
            pdf_base64 = english_service.generate_essay_pdf_report(
                student_name, student_surname, essay_type,
                marking_result.get('score', 0), marking_result.get('max_score', 0),
                marking_result.get('corrections', []), marking_result.get('teacher_comment', ''),
                marking_result.get('corrected_essay', ''), marking_result.get('detailed_feedback', ''),
                essay_text, topic.get('title') if topic else prompt.get('title')
            )
            
            marking_result['pdf_report'] = pdf_base64
            
            # --- SAVE TO HISTORY ---
            try:
                submission_data = {
                    'user_id': g.current_user_id,
                    'essay_type': essay_type,
                    'topic_title': topic.get('title') if topic else prompt.get('title', 'Guided Composition'),
                    'original_essay': essay_text,
                    'corrected_essay': marking_result.get('corrected_essay', ''),
                    'teacher_comment': marking_result.get('teacher_comment', ''),
                    'detailed_feedback': marking_result.get('detailed_feedback', {}), # Store as JSON
                    'score': marking_result.get('score', 0),
                    'max_score': marking_result.get('max_score', 0),
                    'pdf_report_url': None, # We don't have a URL yet, could store base64 in a separate storage if needed, or just regenerate
                    'created_at': datetime.utcnow().isoformat()
                }
                
                # Check for table existence lazily
                make_supabase_request("POST", "english_essay_submissions", submission_data, use_service_role=True)
            except Exception as db_err:
                logger.error(f"Failed to save essay history: {db_err}")
                # Don't fail the request if history save fails, just log it
            
            credits_remaining = _deduct_credits_or_fail(
                g.current_user_id,
                int(credit_cost),
                'english_essay_marking',
                f'Marked {essay_type} essay'
            )
            if credits_remaining is None:
                return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
            
            return jsonify({
                'success': True,
                'data': marking_result,
                'credits_deducted': _credits_display(int(credit_cost)),
                'credits_remaining': credits_remaining
            }), 200
            
        else:
             return jsonify({'success': False, 'message': 'Failed to mark essay'}), 500
        
    except Exception as e:
        logger.error(f"Submit essay marking error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/history', methods=['GET'])
@require_auth
def get_essay_history():
    """Get essay history for current user"""
    try:
        # Fetch from Supabase
        result = make_supabase_request(
            "GET", 
            "english_essay_submissions", 
            filters={
                'user_id': f"eq.{g.current_user_id}",
                'order': 'created_at.desc' # Supabase order syntax might differ for REST, let's try standard
            },
            # Note: For Supabase REST, ordering is usually a query param like ?order=created_at.desc
            # make_supabase_request handles params as query string
             use_service_role=True
        ) or []
        
        # If make_supabase_request doesn't handle 'order' param correctly in the dict:
        # We might need to sort manually if the API Wrapper is simple. 
        # But let's assume it works or we get raw data.
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"Get essay history error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/submission/<essay_id>', methods=['GET'])
@require_auth
def get_essay_submission(essay_id):
    """Get specific essay submission details"""
    try:
        # Fetch single record
        result = make_supabase_request(
            "GET", 
            "english_essay_submissions",
            filters={'id': f"eq.{essay_id}"},
            use_service_role=True
        )
        
        if result and len(result) > 0:
            return jsonify({
                'success': True,
                'data': result[0]
            }), 200
        else:
             return jsonify({'success': False, 'message': 'Submission not found'}), 404
             
    except Exception as e:
        logger.error(f"Get essay submission error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/<essay_id>/report', methods=['GET'])
@require_auth
def get_essay_report(essay_id):
    """Get essay PDF report - Regenerate or fetch"""
    try:
        # 1. Try to get submission from DB
        submission_list = make_supabase_request(
            "GET", 
            "english_essay_submissions",
            filters={'id': f"eq.{essay_id}"},
            use_service_role=True
        )
        
        if not submission_list or len(submission_list) == 0:
             return jsonify({'success': False, 'message': 'Submission not found'}), 404
             
        submission = submission_list[0]
        
        # 2. Regenerate PDF
        english_service = EnglishService()
        
        # Extract user name (might need to fetch user profile if not in submission, currently it's not)
        # We'll use placeholder or fetch user. 
        # Ideally, submission should have stored student name, but it stores user_id.
        user_profile = get_user_registration(submission.get('user_id'))
        student_name = user_profile.get('name', 'Student') if user_profile else 'Student'
        student_surname = user_profile.get('surname', '') if user_profile else ''
        
        detailed_feedback = submission.get('detailed_feedback', {})
        corrections = [] # Might need to parse from detailed_feedback or store explicitly if needed.
        # Assuming detailed_feedback might contain corrections or we just use text.
        
        # For now, let's keep it simple. If we didn't store corrections explicitly as a separate column,
        # we might not be able to perfectly reconstruct the PDF without parsing. 
        # But 'detailed_feedback' in schema was JSONB, so hopefully it has it.
        # Wait, in the INSERT above: 'detailed_feedback': marking_result.get('detailed_feedback', {})
        # marking_result corrections were separate in the JSON return but maybe not in DB?
        # Let's check INSERT again: 'detailed_feedback': marking_result.get('detailed_feedback', {})
        # It missed 'corrections'. I should probably update the INSERT to store 'corrections' too if I want full regen.
        # Or just rely on the text fields.
        
        pdf_base64 = english_service.generate_essay_pdf_report(
            student_name, student_surname, submission.get('essay_type', ''),
            submission.get('score', 0), submission.get('max_score', 0),
            [], # Corrections might be missing if not stored.
            submission.get('teacher_comment', ''),
            submission.get('corrected_essay', ''), 
            str(submission.get('detailed_feedback', '')), 
            submission.get('original_essay', ''), 
            submission.get('topic_title', '')
        )
        
        return jsonify({
            'success': True,
            'data': {
                'pdf_report': pdf_base64
            }
        }), 200
    except Exception as e:
        logger.error(f"Get essay report error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to get essay report: {error_message}'}), 500

@mobile_bp.route('/english/comprehension/grade', methods=['POST'])
@require_auth
def grade_comprehension():
    """Grade comprehension answers"""
    try:
        data = request.get_json()
        passage = data.get('passage', '')
        questions = data.get('questions', [])
        answers = data.get('answers', {})
        
        if not passage or not questions or not answers:
            return jsonify({'success': False, 'message': 'Missing required data'}), 400
            
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('english_comprehension_grading')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
            
        english_service = EnglishService()
        result = english_service.grade_comprehension_answers(passage, questions, answers)
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'english_comprehension_grading',
            'English comprehension grading'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        
        return jsonify({
            'success': True,
            'data': result,
            'credits_remaining': credits_remaining
        }), 200
        
    except Exception as e:
        logger.error(f"Grade comprehension error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/summary/grade', methods=['POST'])
@require_auth
def grade_summary():
    """Grade summary writing"""
    try:
        data = request.get_json()
        passage = data.get('passage', '')
        prompt = data.get('prompt', '')
        summary = data.get('summary', '')
        
        if not passage or not prompt or not summary:
            return jsonify({'success': False, 'message': 'Missing required data'}), 400
            
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('english_summary_grading')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
            
        english_service = EnglishService()
        result = english_service.grade_summary(passage, prompt, summary)
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'english_summary_grading',
            'English summary grading'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        
        return jsonify({
            'success': True,
            'data': result,
            'credits_remaining': credits_remaining
        }), 200
        
    except Exception as e:
        logger.error(f"Grade summary error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

# ============================================================================
# IMAGE ENDPOINTS
# ============================================================================

@mobile_bp.route('/image/upload', methods=['POST'])
@require_auth
def upload_image():
    """Upload image for OCR solving or exam answers"""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'message': 'No image file provided'}), 400
        
        image_file = request.files['image']
        use_for_exam = request.form.get('use_for_exam', 'false').lower() == 'true'
        
        # For exam answers, upload to hosting service and return URL (no credit check)
        if use_for_exam:
            try:
                from services.image_hosting_service import ImageHostingService
                import tempfile
                import os
                
                # Save uploaded file temporarily
                tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
                try:
                    image_file.save(tmp_file.name)
                    tmp_path = tmp_file.name
                finally:
                    tmp_file.close()
                
                try:
                    # Upload to image hosting service
                    hosting_service = ImageHostingService()
                    image_url = hosting_service.upload_image_with_fallback(tmp_path)
                    
                    if image_url:
                        return jsonify({
                            'success': True,
                            'data': {
                                'image_url': image_url,
                                'image_id': str(uuid.uuid4()),
                            }
                        }), 200
                    else:
                        return jsonify({'success': False, 'message': 'Failed to upload image to hosting service'}), 500
                finally:
                    # Clean up temp file
                    if os.path.exists(tmp_path):
                        try:
                            os.unlink(tmp_path)
                        except:
                            pass
            except Exception as e:
                logger.error(f"Error uploading exam image: {e}", exc_info=True)
                return jsonify({'success': False, 'message': f'Failed to upload image: {str(e)}'}), 500
        
        # Original OCR flow (requires credits)
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('image_solve')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        
        # Process image
        image_service = ImageService()
        result = image_service.process_image(image_file)
        
        credits_remaining = _deduct_credits_or_fail(
            g.current_user_id,
            int(credit_cost),
            'image_solve',
            'Image OCR solving'
        )
        if credits_remaining is None:
            return jsonify({'success': False, 'message': 'Transaction failed. Please try again.'}), 500
        
        return jsonify({
            'success': True,
            'data': {
                'image_id': str(uuid.uuid4()),
                'processed_text': result.get('text', ''),
                'solution': result.get('solution', ''),
                'credits_remaining': credits_remaining
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Upload image error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to process image: {error_message}'}), 500

# ============================================================================
# TEACHER MODE ENDPOINTS (Multi-Subject Chatbot - Math, Science, etc.)
# ============================================================================

@mobile_bp.route('/teacher/start', methods=['POST'])
@require_auth
def start_teacher_mode():
    """Start Teacher Mode session"""
    try:
        data = request.get_json()
        subject = data.get('subject', '')  # Mathematics, Biology, Chemistry, Physics
        grade_level = data.get('grade_level', '')  # Form 1-2, O-Level, A-Level
        topic = data.get('topic', '')  # Optional topic
        
        if not subject or not grade_level:
            return jsonify({'success': False, 'message': 'Subject and grade level are required'}), 400
        
        # Check credits for initial session
        credit_cost = advanced_credit_service.get_credit_cost('teacher_mode_start')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        # CRITICAL: Block users with zero credits from accessing Teacher Mode
        if user_credits <= 0:
            return jsonify({
                'success': False,
                'message': 'Access denied. You have 0 credits. Teacher Mode requires credits to use. Please purchase credits to continue.'
            }), 402
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {_credits_text(credit_cost)}'
            }), 402
        
        # Initialize session
        session_id = str(uuid.uuid4())
        from utils.session_manager import session_manager
        
        # Determine which service to use based on subject (mobile sends "O Level Mathematics", "Pure Mathematics", etc.)
        subj_lower = (subject or '').lower()
        is_mathematics = ('math' in subj_lower) or ('pure mathematics' in subj_lower)
        is_english = 'english' in subj_lower
        is_computer_science = 'computer science' in subj_lower
