"""
Mobile API Blueprint for NerdX Mobile Application
Provides REST API endpoints for React Native mobile app
"""
import logging
import jwt
import hashlib
import secrets
import time
from datetime import datetime, timedelta
from functools import wraps
from flask import Blueprint, request, jsonify, g
from werkzeug.utils import secure_filename
import uuid
import os
from database.external_db import (
    get_user_registration, create_user_registration, is_user_registered,
    get_user_stats, get_user_credits, add_credits, deduct_credits,
    get_user_by_nerdx_id, add_xp, update_streak
)
from services.advanced_credit_service import advanced_credit_service
from services.question_service import QuestionService
from services.mathematics_service import MathematicsService
from services.math_ocr_service import MathOCRService
from services.symbolic_solver_service import SymbolicSolverService
from services.mathematics_teacher_service import mathematics_teacher_service
from services.combined_science_generator import CombinedScienceGenerator
from services.english_service import EnglishService
from services.referral_service import ReferralService
from services.paynow_service import PaynowService
from services.graph_service import GraphService
from services.graph_service import GraphService
from services.image_service import ImageService
from services.voice_service import get_voice_service
from utils.url_utils import convert_local_path_to_public_url
from config import Config
import os
import uuid

logger = logging.getLogger(__name__)

mobile_bp = Blueprint('mobile', __name__)

# JWT Secret Key (should be in environment variable)
JWT_SECRET = os.environ.get('JWT_SECRET', 'nerdx-mobile-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

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
            # Create user in database first
            create_user_registration(
                user_identifier,
                name,
                surname,
                date_of_birth or '2000-01-01',  # Default date if not provided
                referred_by
            )
            
            # Update user with password and contact info using Supabase
            from database.external_db import make_supabase_request
            import os
            
            update_data = {}
            if password_hash:
                update_data['password_hash'] = password_hash
            if salt:
                update_data['password_salt'] = salt
            if email:
                update_data['email'] = email
            if phone_number:
                update_data['phone_number'] = phone_number
            
            # Update user record with password and contact info
            if update_data:
                # Use PATCH to update existing record
                supabase_url = os.getenv('SUPABASE_URL')
                supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
                
                if supabase_url and supabase_key:
                    import requests
                    update_url = f"{supabase_url}/rest/v1/users_registration"
                    headers = {
                        'apikey': supabase_key,
                        'Authorization': f'Bearer {supabase_key}',
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    }
                    
                    # Update by chat_id
                    params = {'chat_id': f'eq.{user_identifier}'}
                    response = requests.patch(update_url, json=update_data, headers=headers, params=params)
                    if response.status_code not in [200, 204]:
                        logger.warning(f"Failed to update password: {response.status_code} - {response.text}")
            
            # Generate token
            token = generate_token(user_identifier)
            
            # Get user data
            user_data = get_user_registration(user_identifier)
            
            if not user_data:
                logger.error(f"Failed to retrieve user data for {user_identifier} after registration")
                return jsonify({'success': False, 'message': 'Post-registration data retrieval failed'}), 500

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
                    'credits': Config.REGISTRATION_BONUS,
                },
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
    """Handle social authentication (Google, etc.)"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        # Social login data from frontend (Supabase user object)
        provider = data.get('provider', 'google')
        user_info = data.get('user', {})
        email = user_info.get('email', '').lower()
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required for social login'}), 400
            
        # Check if user is already registered in our system
        if is_user_registered(email):
            # Existing user - generate token and return user data
            user_data = get_user_registration(email)
            credits = get_user_credits(email) or 0
            token = generate_token(email)
            
            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'id': user_data.get('chat_id'),
                    'nerdx_id': user_data.get('nerdx_id'),
                    'name': user_data.get('name'),
                    'surname': user_data.get('surname'),
                    'email': email,
                    'credits': credits,
                },
                'message': 'Logged in with Google'
            }), 200
        else:
            # New user via social login - create registration
            name = user_info.get('given_name') or user_info.get('name', 'User')
            surname = user_info.get('family_name') or 'Social'
            
            # Create user registration in Supabase
            try:
                # Use email as user_identifier for social sign-ups
                create_user_registration(
                    email,
                    name,
                    surname,
                    '2000-01-01', # Default DOB for social
                    None # No referral for now
                )
                
                user_data = get_user_registration(email)
                token = generate_token(email)
                
                return jsonify({
                    'success': True,
                    'token': token,
                    'user': {
                        'id': email,
                        'nerdx_id': user_data.get('nerdx_id'),
                        'name': name,
                        'surname': surname,
                        'email': email,
                        'credits': 75, # Welcome bonus
                    },
                    'message': 'Account created via Google'
                }), 201
            except Exception as e:
                logger.error(f"Social registration error: {e}", exc_info=True)
                return jsonify({'success': False, 'message': f'Social registration failed: {str(e)}'}), 500
                
    except Exception as e:
        logger.error(f"Social login error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/auth/login', methods=['POST'])
def login():
    """Login mobile user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower() if data.get('email') else None
        phone_number = data.get('phone_number', '').strip() if data.get('phone_number') else None
        password = data.get('password', '')
        
        if not password:
            return jsonify({'success': False, 'message': 'Password is required'}), 400
        
        if not email and not phone_number:
            return jsonify({'success': False, 'message': 'Email or phone number is required'}), 400
        
        user_identifier = phone_number or email
        
        # Check if user exists
        if not is_user_registered(user_identifier):
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Get user data including password hash
        user_data = get_user_registration(user_identifier)
        if not user_data:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Verify password
        stored_hash = user_data.get('password_hash')
        stored_salt = user_data.get('password_salt')
        
        if not stored_hash or not stored_salt:
            # User exists but no password set (legacy WhatsApp user)
            return jsonify({'success': False, 'message': 'Please set a password in your profile'}), 401
        
        # Verify password
        if not verify_password(password, stored_hash, stored_salt):
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
        
        # Generate token
        token = generate_token(user_identifier)
        
        # Get user data
        user_data = get_user_registration(user_identifier)
        credits = get_user_credits(user_identifier) or 0
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user_data.get('chat_id'),
                'nerdx_id': user_data.get('nerdx_id'),
                'name': user_data.get('name'),
                'surname': user_data.get('surname'),
                'email': email,
                'phone_number': phone_number,
                'credits': credits,
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Login endpoint error: {e}")
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
                'credits': credits,
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
                'credits': credits,
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
        user_data = get_user_registration(g.current_user_id)
        
        if not user_data:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # TODO: Implement profile update
        # Update fields that are provided
        
        return jsonify({
            'success': True,
            'data': user_data,
            'message': 'Profile updated successfully'
        }), 200
    except Exception as e:
        logger.error(f"Update profile error: {e}")
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
                'credits': credits,
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
    """Get topics for a subject"""
    try:
        subject = request.args.get('subject', '')
        parent_subject = request.args.get('parent_subject', '')  # For Combined Science: Biology/Chemistry/Physics
        
        # Get topics from constants or database
        from constants import TOPICS
        
        topics = []
        
        # Handle Combined Science two-level structure
        if subject == 'combined_science':
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
    """Generate a quiz question"""
    try:
        data = request.get_json()
        subject = data.get('subject', '')
        topic = data.get('topic')
        difficulty = data.get('difficulty', 'medium')
        question_type = data.get('type', 'topical')  # 'topical' or 'exam'
        question_format = (data.get('question_format') or 'mcq').lower()  # 'mcq' or 'structured'
        
        if not subject:
            return jsonify({'success': False, 'message': 'Subject is required'}), 400
        
        # Check credits
        credit_action = f"{subject}_topical" if question_type == 'topical' else f"{subject}_exam"
        credit_cost = advanced_credit_service.get_credit_cost(credit_action)
        
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}, Available: {user_credits}'
            }), 400
        
        # Generate question based on subject
        question_data = None
        
        if subject == 'mathematics':
            from services.math_question_generator import MathQuestionGenerator
            from services.math_solver import MathSolver
            math_generator = MathQuestionGenerator()
            
            # For exam mode, select random topic if no topic specified
            if question_type == 'exam' and not topic:
                from constants import TOPICS
                import random
                math_topics = TOPICS.get('Mathematics', [])
                if math_topics:
                    topic = random.choice(math_topics)
                    topic = topic.lower().replace(' ', '_')
            
            question_data = math_generator.generate_question('Mathematics', topic or 'Algebra', difficulty, g.current_user_id)
            
            # Generate hint for math questions if not already present
            if question_data and not question_data.get('hint_level_1'):
                math_solver = MathSolver()
                hint = math_solver.get_hint(question_data.get('question', ''), difficulty)
                if hint:
                    question_data['hint_level_1'] = hint
                    
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
            
            question_data = a_level_physics_generator.generate_question(selected_topic, difficulty, g.current_user_id)
        
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
            
            question_data = a_level_chemistry_generator.generate_question(selected_topic, difficulty, g.current_user_id)
        
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
            
            question_data = a_level_pure_math_generator.generate_question(selected_topic, difficulty, g.current_user_id)
        
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
            
            question_data = a_level_biology_generator.generate_question(
                selected_topic, 
                difficulty, 
                g.current_user_id, 
                bio_question_type
            )

        
        if not question_data:
            return jsonify({'success': False, 'message': 'Failed to generate question'}), 500
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'quiz_generation', f'Generated {subject} {question_type} question')
        
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
        
        # For Mathematics, ensure it's treated as short_answer type (allows text input)
        question_type_mobile = question_data.get('question_type', '') or question_data.get('type', 'short_answer')
        if subject == 'mathematics' and not options:
            question_type_mobile = 'short_answer'  # Math questions allow text input
        if subject == 'combined_science' and (question_data.get('question_type') or '').lower() == 'structured':
            question_type_mobile = 'structured'
            # Structured science uses typed answers; options/correct_answer are not used
            options = []
            correct_answer = ''
            # Provide a compact "solution" string (model answers) for UI display if desired
            try:
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
        
        # Handle A Level Biology structured and essay questions
        if subject == 'a_level_biology' and (question_data.get('question_type') or '').lower() in ['structured', 'essay']:
            question_type_mobile = 'structured'
            options = []
            correct_answer = ''
            # A Level Biology uses 'part' instead of 'label' and 'expected_answer' instead of 'model_answer'
            # Normalize the parts array for mobile app compatibility
            try:
                raw_parts = question_data.get('parts', []) if isinstance(question_data.get('parts'), list) else []
                normalized_parts = []
                model_lines = []
                for p in raw_parts:
                    # Normalize part format: 'part' -> 'label', 'expected_answer' -> 'model_answer'
                    label = p.get('label') or p.get('part', '')
                    if isinstance(label, str) and not label.startswith('('):
                        label = f"({label})"  # Format as (a), (b), etc.
                    normalized_part = {
                        'label': label,
                        'question': p.get('question', ''),
                        'marks': p.get('marks', 0),
                        'model_answer': p.get('expected_answer') or p.get('model_answer', ''),
                        'command_word': p.get('command_word', '')
                    }
                    normalized_parts.append(normalized_part)
                    # Build solution from expected answers
                    if normalized_part['model_answer']:
                        model_lines.append(f"{label} [{p.get('marks', '')}]: {normalized_part['model_answer']}")
                
                # Store normalized parts for later use
                question_data['_normalized_parts'] = normalized_parts
                
                if model_lines:
                    solution = "MODEL ANSWERS:\n" + "\n".join(model_lines[:10])
                
                # Add teaching points if available
                teaching_points = question_data.get('teaching_points', '')
                if teaching_points:
                    solution += f"\n\n📚 Key Learning Points:\n{teaching_points}"
            except Exception as e:
                logger.warning(f"Error normalizing A Level Biology parts: {e}")
        
        # Format question for mobile
        question = {
            'id': str(uuid.uuid4()),
            'question_text': (
                question_data.get('question', '') or
                question_data.get('question_text', '') or
                (question_data.get('stem', '') if (question_data.get('question_type') or '').lower() == 'structured' else '')
            ),
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
                question_type_mobile == 'short_answer' or
                question_type_mobile == 'structured' or
                (subject == 'english' and not options)  # English grammar questions without MCQ options need text input
            ),
            'allows_image_upload': subject == 'mathematics',  # Math questions support image upload
            
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
        
        # Include structured payload for A Level Biology structured/essay questions
        if subject == 'a_level_biology' and question_type_mobile == 'structured':
            # Use normalized parts if available, otherwise use original parts
            parts_to_use = question_data.get('_normalized_parts') or question_data.get('parts', [])
            question['structured_question'] = {
                'question_type': question_data.get('question_type', 'structured'),
                'subject': 'A Level Biology',
                'topic': question_data.get('topic', ''),
                'difficulty': question_data.get('difficulty', difficulty),
                'stem': question_data.get('question', ''),  # A Level Biology uses 'question' for stem
                'parts': parts_to_use,
                'total_marks': question_data.get('total_marks', 12),
                'teaching_points': question_data.get('teaching_points', '')
            }
        
        return jsonify({
            'success': True,
            'data': question
        }), 200
        
    except Exception as e:
        logger.error(f"Generate question error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to generate question: {error_message}'}), 500

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
        credit_cost = advanced_credit_service.get_credit_cost('mathematics_exam')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}, Available: {user_credits}'
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
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'math_exam', f'Math exam question #{question_count}')
        
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
            'points': 10
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
        
        if subject == 'mathematics':
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

            if is_correct:
                if not feedback:
                    feedback = '✅ Excellent! Your answer is correct!'
            else:
                if not feedback:
                    feedback = '❌ Not quite right. Review the solution below to understand the correct approach.'
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
        
        return jsonify({
            'success': True,
            'data': {
                'correct': is_correct,
                'feedback': feedback,
                'solution': detailed_solution,
                'hint': hint if not is_correct else '',
                'points_earned': points_earned,
                'credits_used': 0,  # Already deducted
                
                # Enhanced feedback fields
                'what_went_right': analysis_result.get('what_went_right', ''),
                'what_went_wrong': analysis_result.get('what_went_wrong', ''),
                'improvement_tips': analysis_result.get('improvement_tips', ''),
                'encouragement': analysis_result.get('encouragement', ''),
                'related_topic': analysis_result.get('related_topic', '')
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


@mobile_bp.route('/virtual-lab/knowledge-check', methods=['POST'])
@require_auth
def generate_virtual_lab_knowledge_check():
    """
    Generate Virtual Lab knowledge-check questions using DeepSeek (no credit deduction).

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

        if subject not in ['biology', 'chemistry', 'physics']:
            return jsonify({'success': False, 'message': 'Invalid subject'}), 400

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
            topic = 'Cell Structure and Organisation' if subject == 'biology' else (
                'Acids, Bases and Salts' if subject == 'chemistry' else 'Kinematics'
            )

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

        return jsonify({'success': True, 'data': questions}), 200

    except Exception as e:
        logger.error(f"Virtual lab knowledge check generation error: {e}", exc_info=True)
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
                'balance': credits
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
        # TODO: Retrieve transactions from database
        return jsonify({
            'success': True,
            'data': []
        }), 200
    except Exception as e:
        logger.error(f"Get credit transactions error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/credits/packages', methods=['GET'])
@require_auth
def get_credit_packages():
    """Get available credit packages"""
    try:
        packages = [
            {
                'id': '1',
                'name': 'Pocket',
                'credits': 50,
                'price': 1.0,
                'currency': 'USD',
                'description': 'Perfect for trying out NerdX'
            },
            {
                'id': '2',
                'name': 'Mini',
                'credits': 120,
                'price': 2.0,
                'currency': 'USD',
                'description': 'Great for regular practice'
            },
            {
                'id': '3',
                'name': 'Quick',
                'credits': 350,
                'price': 5.0,
                'currency': 'USD',
                'description': 'Best value for serious learners'
            },
            {
                'id': '4',
                'name': 'Boost',
                'credits': 750,
                'price': 10.0,
                'currency': 'USD',
                'description': 'Maximum credits for power users'
            }
        ]
        
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
    """Initiate credit purchase"""
    try:
        data = request.get_json()
        package_id = data.get('package_id')
        
        if not package_id:
            return jsonify({'success': False, 'message': 'Package ID is required'}), 400
        
        # Get package details
        packages = {
            '1': {'credits': 50, 'price': 1.0},
            '2': {'credits': 120, 'price': 2.0},
            '3': {'credits': 350, 'price': 5.0},
            '4': {'credits': 750, 'price': 10.0}
        }
        
        package = packages.get(package_id)
        if not package:
            return jsonify({'success': False, 'message': 'Invalid package'}), 400
        
        # Get user data for payment
        user_data = get_user_registration(g.current_user_id)
        if not user_data:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        phone_number = data.get('phone_number', user_data.get('phone_number', ''))
        email = data.get('email', user_data.get('email', ''))
        
        if not phone_number or not email:
            return jsonify({
                'success': False,
                'message': 'Phone number and email are required for Paynow payment'
            }), 400
        
        # Initiate payment via Paynow
        paynow_service = PaynowService()
        reference = f"MOBILE_{uuid.uuid4().hex[:8].upper()}"
        
        # Store payment transaction in database before initiating
        from database.external_db import make_supabase_request
        payment_transaction = {
            'user_id': g.current_user_id,
            'reference_code': reference,
            'package_id': package_id,
            'amount': package['price'],
            'credits': package['credits'],
            'payment_method': 'paynow',
            'status': 'pending',
            'phone_number': phone_number,
            'email': email,
            'created_at': datetime.utcnow().isoformat()
        }
        
        try:
            make_supabase_request('POST', 'payment_transactions', payment_transaction, use_service_role=True)
        except Exception as e:
            logger.warning(f"Failed to store payment transaction: {e}")
        
        # Create Paynow payment
        payment_result = paynow_service.create_usd_ecocash_payment(
            amount=package['price'],
            phone_number=phone_number,
            email=email,
            reference=reference,
            description=f"NerdX {package_id} - {package['credits']} credits"
        )
        
        if not payment_result.get('success'):
            return jsonify({
                'success': False,
                'message': payment_result.get('message', 'Failed to initiate payment')
            }), 400
        
        # Update transaction with poll_url
        try:
            make_supabase_request(
                'PATCH',
                'payment_transactions',
                {'poll_url': payment_result.get('poll_url', '')},
                filters={'reference_code': f"eq.{reference}"},
                use_service_role=True
            )
        except Exception as e:
            logger.warning(f"Failed to update payment transaction: {e}")
        
        return jsonify({
            'success': True,
            'data': {
                'reference': reference,
                'poll_url': payment_result.get('poll_url', ''),
                'instructions': payment_result.get('instructions', 'Check your phone for USSD prompt'),
                'amount': package['price'],
                'credits': package['credits']
            }
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
        
        # Get payment transaction from database
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
        poll_url = transaction.get('poll_url', '')
        
        # If payment is still pending and we have poll_url, check with Paynow
        if status == 'pending' and poll_url:
            paynow_service = PaynowService()
            if paynow_service.is_available():
                try:
                    paynow_status = paynow_service.check_payment_status(poll_url)
                    if paynow_status.get('success') and paynow_status.get('paid'):
                        # Payment confirmed - webhook should handle this, but update status
                        status = 'completed'
                except Exception as e:
                    logger.warning(f"Failed to check Paynow status: {e}")
        
        return jsonify({
            'success': True,
            'data': {
                'reference': reference,
                'status': status,  # 'pending', 'completed', 'failed', 'cancelled'
                'amount': transaction.get('amount', 0),
                'credits': transaction.get('credits', 0),
                'paid': status == 'completed' or status == 'approved'
            }
        }), 200
    except Exception as e:
        logger.error(f"Check payment status error: {e}")
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
def get_referral_stats():
    """Get referral statistics"""
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
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Generate graph
        graph_service = GraphService()
        graph_result = graph_service.generate_graph(function_text)
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'math_graph_practice', 'Math graph generation')
        
        return jsonify({
            'success': True,
            'data': {
                'graph_url': graph_result.get('graph_url', ''),
                'image_url': graph_result.get('image_url', '')
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
    """Generate English comprehension passage"""
    try:
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('english_comprehension')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Generate comprehension
        english_service = EnglishService()
        comprehension = english_service.generate_comprehension()
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'english_comprehension', 'English comprehension generation')
        
        return jsonify({
            'success': True,
            'data': {
                'passage': comprehension.get('passage', ''),
                'questions': comprehension.get('questions', [])
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
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
            
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
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'english_essay_marking', f'Marked {essay_type} essay')
        
        return jsonify({
            'success': True,
            'data': marking_result
        }), 200
        
    except Exception as e:
        logger.error(f"Submit essay marking error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/english/essay/<essay_id>/report', methods=['GET'])
@require_auth
def get_essay_report(essay_id):
    """Get essay PDF report"""
    try:
        # TODO: Retrieve essay report from database/storage
        return jsonify({
            'success': True,
            'data': {
                'report_url': ''
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
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
            
        english_service = EnglishService()
        result = english_service.grade_comprehension_answers(passage, questions, answers)
        
        deduct_credits(g.current_user_id, credit_cost, 'english_comprehension_grading', 'English comprehension grading')
        
        return jsonify({
            'success': True,
            'data': result
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
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
            
        english_service = EnglishService()
        result = english_service.grade_summary(passage, prompt, summary)
        
        deduct_credits(g.current_user_id, credit_cost, 'english_summary_grading', 'English summary grading')
        
        return jsonify({
            'success': True,
            'data': result
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
    """Upload image for OCR solving"""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'message': 'No image file provided'}), 400
        
        image_file = request.files['image']
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('image_solve')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Process image
        image_service = ImageService()
        result = image_service.process_image(image_file)
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'image_solve', 'Image OCR solving')
        
        return jsonify({
            'success': True,
            'data': {
                'image_id': str(uuid.uuid4()),
                'processed_text': result.get('text', ''),
                'solution': result.get('solution', '')
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
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Initialize session
        session_id = str(uuid.uuid4())
        from utils.session_manager import session_manager
        
        # Determine which service to use based on subject
        is_mathematics = subject.lower() == 'mathematics' or subject.lower() == 'math'
        session_key = 'math_teacher' if is_mathematics else 'science_teacher'
        
        session_manager.set_data(g.current_user_id, session_key, {
            'active': True,
            'session_id': session_id,
            'subject': subject,
            'grade_level': grade_level,
            'topic': topic,
            'conversation_history': [],
            'started_at': datetime.utcnow().isoformat()
        })
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'teacher_mode_start', f'Started Teacher Mode: {subject}')
        
        # Get appropriate initial message based on subject
        if is_mathematics:
            subject_emoji = '📐'
            initial_message = f"{subject_emoji} Welcome to Mathematics Teacher Mode!\n\nI'm your AI Mathematics tutor. I use proven teaching methods including:\n\n• **Socratic Method** - Guiding you through questions\n• **Worked Examples** - Step-by-step solutions\n• **Progressive Difficulty** - Building from basics\n• **Real-World Applications** - Making math meaningful\n\nHow can I help you learn today?"
            if topic:
                initial_message += f"\n\n📖 We'll be focusing on: **{topic}**"
        else:
            # Science subjects (Biology, Chemistry, Physics)
            subject_emoji = '🧬' if subject.lower() == 'biology' else ('⚗️' if subject.lower() == 'chemistry' else '⚛️')
            initial_message = f"{subject_emoji} Welcome to Teacher Mode!\n\nI'm your {subject} teacher. How can I help you learn today?"
            if topic:
                initial_message += f"\n\nWe'll be focusing on: {topic}"
        
        return jsonify({
            'success': True,
            'data': {
                'session_id': session_id,
                'subject': subject,
                'grade_level': grade_level,
                'topic': topic,
                'initial_message': initial_message
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Start teacher mode error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to start teacher mode: {error_message}'}), 500

@mobile_bp.route('/teacher/message', methods=['POST'])
@require_auth
def send_teacher_message():
    """Send message to Teacher Mode chatbot"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        session_id = data.get('session_id', '')
        
        if not message:
            return jsonify({'success': False, 'message': 'Message is required'}), 400
        
        from utils.session_manager import session_manager
        
        # Try to find active session (Math or Science)
        math_session = session_manager.get_data(g.current_user_id, 'math_teacher')
        science_session = session_manager.get_data(g.current_user_id, 'science_teacher')
        
        # Determine which session is active
        is_mathematics = math_session and math_session.get('active')
        session_key = 'math_teacher' if is_mathematics else 'science_teacher'
        session_data = math_session if is_mathematics else science_session
        
        # Check if user wants to exit
        exit_commands = ['exit', 'quit', 'back', 'main menu', 'leave']
        if message.lower() in exit_commands:
            session_manager.clear_session(g.current_user_id, session_key)
            return jsonify({
                'success': True,
                'data': {
                    'response': '👋 Teacher Mode ended. You can start a new session anytime!',
                    'session_ended': True
                }
            }), 200
        
        # Check credits for follow-up
        credit_cost = advanced_credit_service.get_credit_cost('teacher_mode_followup')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        if not session_data or not session_data.get('active'):
            return jsonify({'success': False, 'message': 'No active teacher session'}), 400
        
        # Get AI response based on subject
        conversation_history = session_data.get('conversation_history', [])
        conversation_history.append({'role': 'user', 'content': message})
        
        if is_mathematics:
            # Use Mathematics Teacher Service
            from services.mathematics_teacher_service import MathematicsTeacherService
            teacher_service = MathematicsTeacherService()
            response_text = teacher_service._get_teaching_response(g.current_user_id, message, session_data)
        else:
            # Use Combined Science Teacher Service
            from services.combined_science_teacher_service import CombinedScienceTeacherService
            teacher_service = CombinedScienceTeacherService()
            response_text = teacher_service._get_gemini_teaching_response(
                g.current_user_id, message, session_data
            )
        
        conversation_history.append({'role': 'assistant', 'content': response_text})
        
        # Update session
        session_data['conversation_history'] = conversation_history[-20:]  # Keep last 20
        session_manager.set_data(g.current_user_id, session_key, session_data)
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'teacher_mode_followup', 'Teacher Mode conversation')
        
        # Clean formatting (both services should have this method)
        if hasattr(teacher_service, '_clean_whatsapp_formatting'):
            clean_response = teacher_service._clean_whatsapp_formatting(response_text)
        else:
            clean_response = response_text
        
        return jsonify({
            'success': True,
            'data': {
                'response': clean_response,
                'session_id': session_id
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Send teacher message error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'AI service error: {error_message}'}), 500


@mobile_bp.route('/teacher/generate-notes', methods=['POST'])
@require_auth
def generate_teacher_notes():
    """Generate PDF notes from Teacher Mode session"""
    try:
        data = request.get_json()
        session_id = data.get('session_id', '')
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('teacher_mode_pdf')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Get session data
        from utils.session_manager import session_manager
        session_data = session_manager.get_data(g.current_user_id, 'science_teacher')
        
        if not session_data:
            return jsonify({'success': False, 'message': 'No active session'}), 400
        
        # Generate notes using the service's generate_notes method
        from services.combined_science_teacher_service import CombinedScienceTeacherService
        teacher_service = CombinedScienceTeacherService()
        
        # Call the generate_notes method which handles PDF generation
        # For mobile, we'll get the notes data directly
        conversation_history = session_data.get('conversation_history', [])
        subject = session_data.get('subject', '')
        topic = session_data.get('topic', '')
        
        # Generate notes JSON using Gemini
        notes_prompt = f"Generate comprehensive notes in JSON format for {topic} in {subject}. Use the conversation history as context."
        notes_response = teacher_service._get_gemini_teaching_response(
            g.current_user_id, notes_prompt, session_data
        )
        
        # Try to parse JSON from response
        import json as json_lib
        try:
            # Extract JSON from response if it's wrapped in markdown
            if '```json' in notes_response:
                json_start = notes_response.find('```json') + 7
                json_end = notes_response.find('```', json_start)
                notes_json = notes_response[json_start:json_end].strip()
                notes_data = json_lib.loads(notes_json)
            else:
                notes_data = json_lib.loads(notes_response)
        except:
            # If JSON parsing fails, return text response
            notes_data = {'content': notes_response}
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'teacher_mode_pdf', 'Generated Teacher Mode PDF notes')
        
        # Generate PDF
        from utils.science_notes_pdf_generator import ScienceNotesPDFGenerator
        pdf_generator = ScienceNotesPDFGenerator()
        pdf_path = pdf_generator.generate_notes_pdf(notes_data, g.current_user_id)
        
        # Convert to public URL
        try:
            # Try to use helper if available
            from api.mobile import convert_local_path_to_public_url
            pdf_url = convert_local_path_to_public_url(pdf_path)
        except ImportError:
            # Manual fallback
            import os
            import shutil
            
            filename = os.path.basename(pdf_path)
            base_url = os.environ.get('RENDER_EXTERNAL_URL', 'https://nerdx.onrender.com')
            
            # Move to static/notes
            static_dir = os.path.join(os.getcwd(), 'static', 'notes')
            os.makedirs(static_dir, exist_ok=True)
            new_path = os.path.join(static_dir, filename)
            
            if os.path.exists(pdf_path):
                shutil.move(pdf_path, new_path)
                pdf_url = f"{base_url.rstrip('/')}/static/notes/{filename}"
            else:
                pdf_url = ""

        return jsonify({
            'success': True,
            'data': {
                'notes': notes_data,
                'pdf_url': pdf_url
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate teacher notes error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to generate notes: {error_message}'}), 500


@mobile_bp.route('/teacher/multimodal', methods=['POST'])
@require_auth
def teacher_multimodal_message():
    """Send message with multimodal attachments to Teacher Mode"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        attachments = data.get('attachments', [])
        
        if not message and not attachments:
            return jsonify({'success': False, 'message': 'Message or attachments required'}), 400
        
        from services.combined_science_teacher_service import CombinedScienceTeacherService
        teacher_service = CombinedScienceTeacherService()
        
        result = teacher_service.process_multimodal_message(
            g.current_user_id, message, attachments
        )
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'data': {
                    'response': result.get('response'),
                    'credits_remaining': result.get('credits_remaining')
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to process message')
            }), 400
            
    except Exception as e:
        logger.error(f"Teacher multimodal message error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/analyze-image', methods=['POST'])
@require_auth
def teacher_analyze_image():
    """Analyze a science image (diagrams, lab results, etc.)"""
    try:
        data = request.get_json()
        image_data = data.get('image')  # Base64-encoded
        mime_type = data.get('mime_type', 'image/png')
        prompt = data.get('prompt')
        
        if not image_data:
            return jsonify({'success': False, 'message': 'Image data is required'}), 400
        
        from services.combined_science_teacher_service import CombinedScienceTeacherService
        teacher_service = CombinedScienceTeacherService()
        
        result = teacher_service.analyze_science_image(
            g.current_user_id, image_data, mime_type, prompt
        )
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'data': {
                    'analysis': result.get('text')
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to analyze image')
            }), 400
            
    except Exception as e:
        logger.error(f"Teacher analyze image error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/analyze-document', methods=['POST'])
@require_auth
def teacher_analyze_document():
    """Analyze a study document (textbook pages, past papers)"""
    try:
        data = request.get_json()
        document_data = data.get('document')  # Base64-encoded
        mime_type = data.get('mime_type', 'application/pdf')
        prompt = data.get('prompt')
        
        if not document_data:
            return jsonify({'success': False, 'message': 'Document data is required'}), 400
        
        from services.combined_science_teacher_service import CombinedScienceTeacherService
        teacher_service = CombinedScienceTeacherService()
        
        result = teacher_service.analyze_study_document(
            g.current_user_id, document_data, mime_type, prompt
        )
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'data': {
                    'analysis': result.get('text')
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to analyze document')
            }), 400
            
    except Exception as e:
        logger.error(f"Teacher analyze document error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/search', methods=['POST'])
@require_auth
def teacher_web_search():
    """Search web for science topics with Google grounding"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'success': False, 'message': 'Search query is required'}), 400
        
        from services.combined_science_teacher_service import CombinedScienceTeacherService
        teacher_service = CombinedScienceTeacherService()
        
        result = teacher_service.search_science_topic(g.current_user_id, query)
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'data': {
                    'response': result.get('text')
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to search')
            }), 400
            
    except Exception as e:
        logger.error(f"Teacher web search error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/teacher/deep-research', methods=['POST'])
@require_auth
def teacher_deep_research():
    """Perform Deep Research for a science topic using Gemini Deep Research agent"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'success': False, 'message': 'Research query is required'}), 400
        
        # Check credits for deep research (more expensive than regular search)
        credit_cost = advanced_credit_service.get_credit_cost('teacher_mode_followup')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Get session data for context
        from utils.session_manager import session_manager
        session_data = session_manager.get_data(g.current_user_id, 'science_teacher') or {}
        subject = session_data.get('subject', 'Science')
        grade_level = session_data.get('grade_level', 'O-Level')
        
        # Try to use Gemini Deep Research agent
        try:
            from services.gemini_interactions_service import get_gemini_interactions_service
            interactions_service = get_gemini_interactions_service()
            
            if interactions_service and interactions_service.is_available():
                # Enhanced query with educational context
                enhanced_query = f"""For a ZIMSEC {grade_level} {subject} student:

{query}

Provide comprehensive, educational research with accurate scientific information. 
Focus on content relevant to the Zimbabwe curriculum and O-Level/A-Level science examinations.
Include key concepts, definitions, examples, and exam tips."""

                # Use grounded search for Deep Research (synchronous)
                result = interactions_service.search_with_grounding(enhanced_query)
                
                if result.get('success') and result.get('text'):
                    # Deduct credits
                    deduct_credits(g.current_user_id, credit_cost, 'teacher_deep_research', f'Deep Research: {query[:50]}')
                    
                    logger.info(f"🔬 Deep Research completed for {g.current_user_id}")
                    
                    return jsonify({
                        'success': True,
                        'data': {
                            'response': result.get('text'),
                            'status': 'completed'
                        }
                    }), 200
        except Exception as interactions_error:
            logger.warning(f"Deep Research via Interactions API failed, using fallback: {interactions_error}")
        
        # Fallback: Use regular web search with enhanced prompt
        from services.combined_science_teacher_service import CombinedScienceTeacherService
        teacher_service = CombinedScienceTeacherService()
        
        result = teacher_service.search_science_topic(g.current_user_id, query)
        
        if result.get('success'):
            # Deduct credits
            deduct_credits(g.current_user_id, credit_cost, 'teacher_deep_research', f'Deep Research (fallback): {query[:50]}')
            
            return jsonify({
                'success': True,
                'data': {
                    'response': result.get('text'),
                    'status': 'completed'
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to perform deep research')
            }), 400
            
    except Exception as e:
        logger.error(f"Teacher deep research error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

# ============================================================================
# PROJECT ASSISTANT ENDPOINTS (Database-Backed)
# ============================================================================

@mobile_bp.route('/project/<int:project_id>/research', methods=['POST'])
@require_auth
def start_project_research(project_id):
    """Start Deep Research for a project topic"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'success': False, 'message': 'Research query is required'}), 400
        
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()
        
        result = service.start_deep_research(g.current_user_id, project_id, query)
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'data': {
                    'interaction_id': result.get('interaction_id'),
                    'status': result.get('status', 'in_progress'),
                    'message': result.get('message', 'Deep Research started')
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to start research')
            }), 400
            
    except Exception as e:
        logger.error(f"Start project research error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>/research/status/<interaction_id>', methods=['GET'])
@require_auth
def check_project_research_status(project_id, interaction_id):
    """Check the status of a Deep Research task"""
    try:
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()
        
        result = service.check_research_status(g.current_user_id, project_id, interaction_id)
        
        return jsonify({
            'success': result.get('success', False),
            'data': {
                'status': result.get('status', 'unknown'),
                'result': result.get('result'),
                'message': result.get('message', '')
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Check research status error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>/analyze-document', methods=['POST'])
@require_auth
def analyze_project_document(project_id):
    """Analyze a PDF or document for a project"""
    try:
        data = request.get_json()
        document_data = data.get('document')  # Base64-encoded document
        mime_type = data.get('mime_type', 'application/pdf')
        prompt = data.get('prompt')  # Optional custom prompt
        
        if not document_data:
            return jsonify({'success': False, 'message': 'Document data is required'}), 400
        
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()
        
        result = service.analyze_document_for_project(
            g.current_user_id, project_id, document_data, mime_type, prompt
        )
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'data': {
                    'analysis': result.get('text'),
                    'interaction_id': result.get('interaction_id')
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to analyze document')
            }), 400
            
    except Exception as e:
        logger.error(f"Analyze project document error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>/multimodal-chat', methods=['POST'])
@require_auth
def project_multimodal_chat(project_id):
    """Send message with multimodal attachments (images, audio, video, documents)"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        attachments = data.get('attachments', [])
        
        if not message and not attachments:
            return jsonify({'success': False, 'message': 'Message or attachments required'}), 400
        
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()
        
        result = service.process_multimodal_message(
            g.current_user_id, project_id, message, attachments
        )
        
        if result.get('success') or result.get('response'):
            return jsonify({
                'success': True,
                'data': {
                    'response': result.get('response'),
                    'project_id': project_id,
                    'credits_remaining': result.get('credits_remaining')
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to process message')
            }), 400
            
    except Exception as e:
        logger.error(f"Project multimodal chat error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/project/<int:project_id>/web-search', methods=['POST'])
@require_auth
def project_web_search(project_id):
    """Search web with Google grounding for factual project research"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'success': False, 'message': 'Search query is required'}), 400
        
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()
        
        result = service.search_with_grounding(g.current_user_id, project_id, query)
        
        if result.get('success'):
            return jsonify({
                'success': True,
                'data': {
                    'response': result.get('text'),
                    'interaction_id': result.get('interaction_id')
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to search')
            }), 400
            
    except Exception as e:
        logger.error(f"Project web search error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


# ============================================================================
# GRAPH PRACTICE ENDPOINTS
# ============================================================================



@mobile_bp.route('/math/graph/generate', methods=['POST'])
@require_auth
def generate_graph():
    """Generate math graph practice with AI-generated questions"""
    try:
        data = request.get_json()
        graph_type = data.get('graph_type', '')  # linear, quadratic, etc.
        equation = data.get('equation', '')
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('math_graph_practice')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Generate graph
        from services.graph_service import GraphService
        from services.math_question_generator import MathQuestionGenerator
        graph_service = GraphService()
        question_generator = MathQuestionGenerator()
        
        # Generate a graph question based on graph type
        if not equation:
            # Generate a random equation based on graph type
            equations_by_type = {
                'linear': ['y = 2x + 3', 'y = -x + 4', 'y = 0.5x - 2'],
                'quadratic': ['y = x^2', 'y = -2x^2 + 4x - 1', 'y = 0.5x^2 - 3x + 2'],
                'exponential': ['y = 2^x', 'y = e^x', 'y = 3^x'],
                'trigonometric': ['y = sin(x)', 'y = 2cos(x)', 'y = tan(x/2)']
            }
            import random
            equation = random.choice(equations_by_type.get(graph_type, ['y = x']))
        
        # Create graph using graph service
        user_data = get_user_registration(g.current_user_id)
        user_name = user_data.get('name', 'Student') if user_data else 'Student'
        
        graph_result = graph_service.create_graph(
            g.current_user_id,
            equation,
            f'{graph_type.title()} Graph Practice',
            user_name
        )
        
        if not graph_result or not graph_result.get('image_path'):
            return jsonify({
                'success': False,
                'message': 'Failed to generate graph image'
            }), 500
        
        # Convert image path to public URL
        image_path = graph_result.get('image_path')
        graph_url = convert_local_path_to_public_url(image_path)
        
        # If URL conversion failed, try to construct it manually
        if not graph_url:
            # Extract filename from path
            import os
            filename = os.path.basename(image_path)
            base_url = os.environ.get('RENDER_EXTERNAL_URL', 'https://nerdx.onrender.com')
            graph_url = f"{base_url.rstrip('/')}/static/graphs/{filename}"
        
        # Generate AI question about the graph using DeepSeek
        try:
            topic_name = f"Graph - {graph_type.title()}"
            question_data = question_generator.generate_question(
                'Mathematics',
                topic_name,
                'medium',
                g.current_user_id
            )
            question = question_data.get('question', f"Analyze the graph of {equation}. What are the key features of this graph?")
            solution = question_data.get('solution', f"The graph of {equation} shows key features including intercepts, slope, and behavior.")
        except Exception as ai_error:
            logger.warning(f"AI question generation failed, using fallback: {ai_error}")
            # Fallback to basic question
            question = f"Analyze the graph of {equation}. What are the key features of this graph?"
            solution = f"The graph of {equation} shows [analysis based on graph type]. Key features include intercepts, slope, and behavior."
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'math_graph_practice', f'Generated {graph_type} graph')
        
        return jsonify({
            'success': True,
            'data': {
                'graph_url': graph_url,
                'equation': equation,
                'question': question,
                'solution': solution
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate graph error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to generate graph: {error_message}'}), 500

@mobile_bp.route('/math/graph/custom', methods=['POST'])
@require_auth
def generate_custom_graph():
    """Generate graph from custom equation input"""
    try:
        data = request.get_json()
        equation = data.get('equation', '').strip()
        
        if not equation:
            return jsonify({
                'success': False,
                'message': 'Equation is required'
            }), 400
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('math_graph_practice')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Create graph using graph service
        from services.graph_service import GraphService
        graph_service = GraphService()
        
        user_data = get_user_registration(g.current_user_id)
        user_name = user_data.get('name', 'Student') if user_data else 'Student'
        
        graph_result = graph_service.create_graph(
            g.current_user_id,
            equation,
            'Custom Graph',
            user_name
        )
        
        if not graph_result or not graph_result.get('image_path'):
            return jsonify({
                'success': False,
                'message': 'Failed to generate graph. Please check your equation syntax.'
            }), 500
        
        # Convert image path to public URL
        image_path = graph_result.get('image_path')
        graph_url = convert_local_path_to_public_url(image_path)
        
        if not graph_url:
            import os
            filename = os.path.basename(image_path)
            base_url = os.environ.get('RENDER_EXTERNAL_URL', 'https://nerdx.onrender.com')
            graph_url = f"{base_url.rstrip('/')}/static/graphs/{filename}"
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'math_graph_practice', f'Generated custom graph: {equation}')
        
        return jsonify({
            'success': True,
            'data': {
                'graph_url': graph_url,
                'equation': equation,
                'question': f"Graph of {equation}",
                'solution': f"This is the graph of {equation}. Analyze its key features."
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate custom graph error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to generate graph: {error_message}'}), 500

@mobile_bp.route('/math/graph/upload', methods=['POST'])
@require_auth
def solve_graph_from_image():
    """Solve graph problem from uploaded image"""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'message': 'No image file provided'}), 400
        
        image_file = request.files['image']
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('image_solve')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Process image using ImageService (which can handle graph problems)
        image_service = ImageService()
        result = image_service.process_image(image_file)
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'image_solve', 'Graph solving from image')
        
        return jsonify({
            'success': True,
            'data': {
                'processed_text': result.get('text', ''),
                'solution': result.get('solution', ''),
                'analysis': result.get('analysis', '')
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Solve graph from image error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to process image: {error_message}'}), 500

@mobile_bp.route('/math/graph/linear-programming', methods=['POST'])
@require_auth
def generate_linear_programming_graph():
    """Generate linear programming graph with constraints"""
    try:
        data = request.get_json()
        constraints = data.get('constraints', [])  # List of constraint strings like ["2x + 3y <= 12", "x + y <= 8"]
        objective = data.get('objective', '')  # Optional objective function
        
        if not constraints or len(constraints) < 2:
            return jsonify({
                'success': False,
                'message': 'At least 2 constraints are required for linear programming'
            }), 400
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('math_graph_practice')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Generate linear programming graph
        from services.graph_service import GraphService
        graph_service = GraphService()
        
        user_data = get_user_registration(g.current_user_id)
        user_name = user_data.get('name', 'Student') if user_data else 'Student'
        
        graph_result = graph_service.generate_linear_programming_graph(
            constraints,
            objective,
            user_name
        )
        
        if not graph_result or not graph_result.get('image_path'):
            return jsonify({
                'success': False,
                'message': 'Failed to generate linear programming graph'
            }), 500
        
        # Convert image path to public URL
        image_path = graph_result.get('image_path')
        graph_url = convert_local_path_to_public_url(image_path)
        
        if not graph_url:
            import os
            filename = os.path.basename(image_path)
            base_url = os.environ.get('RENDER_EXTERNAL_URL', 'https://nerdx.onrender.com')
            graph_url = f"{base_url.rstrip('/')}/static/graphs/{filename}"
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'math_graph_practice', 'Generated linear programming graph')
        
        return jsonify({
            'success': True,
            'data': {
                'graph_url': graph_url,
                'constraints': constraints,
                'objective': objective,
                'corner_points': graph_result.get('corner_points', []),
                'question': f"Analyze the feasible region for the constraints: {', '.join(constraints)}",
                'solution': f"The feasible region R is shown in green. Corner points: {graph_result.get('corner_points', [])}"
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate linear programming graph error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to generate graph: {error_message}'}), 500



# ============================================================================
# SCIENCE NOTES ENDPOINTS
# ============================================================================

@mobile_bp.route('/api/mobile/science/notes/topics', methods=['GET'])
@require_auth
def get_science_notes_topics():
    """Get all available topics for a science subject"""
    try:
        subject = request.args.get('subject', '')
        
        if not subject or subject not in ['Biology', 'Chemistry', 'Physics']:
            return jsonify({
                'success': False,
                'message': 'Invalid subject. Must be Biology, Chemistry, or Physics'
            }), 400
        
        from services.science_notes_service import ScienceNotesService
        notes_service = ScienceNotesService()
        
        topics = notes_service.get_all_topics(subject)
        
        return jsonify({
            'success': True,
            'data': {
                'subject': subject,
                'topics': topics
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Get science notes topics error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/api/mobile/science/notes/<subject>/<topic>', methods=['GET'])
@require_auth
def get_science_topic_notes(subject, topic):
    """Get detailed notes for a specific topic"""
    try:
        if subject not in ['Biology', 'Chemistry', 'Physics']:
            return jsonify({
                'success': False,
                'message': 'Invalid subject'
            }), 400
        
        from services.science_notes_service import ScienceNotesService
        notes_service = ScienceNotesService()
        
        notes = notes_service.get_topic_notes(subject, topic)
        
        if not notes:
            return jsonify({
                'success': False,
                'message': f'Notes not yet available for {subject} - {topic}'
            }), 404
        
        return jsonify({
            'success': True,
            'data': notes
        }), 200
        
    except Exception as e:
        logger.error(f"Get topic notes error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# DEEP KNOWLEDGE TRACING (DKT) ENDPOINTS
# ============================================================================

@mobile_bp.route('/dkt/log-interaction', methods=['POST'])
@require_auth
def log_interaction():
    """
    Log student interaction for DKT training
    Called after EVERY question attempt
    """
    try:
        data = request.get_json()
        
        # Required fields
        subject = data.get('subject', '')
        topic = data.get('topic', '')
        skill_id = data.get('skill_id', '')
        question_id = data.get('question_id', '')
        correct = data.get('correct', False)
        
        # Optional fields
        confidence = data.get('confidence')  # 'low', 'medium', 'high'
        time_spent = data.get('time_spent')  # seconds
        hints_used = data.get('hints_used', 0)
        session_id = data.get('session_id')
        device_id = data.get('device_id')
        
        if not all([subject, skill_id, question_id]):
            return jsonify({
                'success': False,
                'message': 'subject, skill_id, and question_id are required'
            }), 400
        
        from services.deep_knowledge_tracing import dkt_service
        
        interaction_id = dkt_service.log_interaction(
            user_id=g.current_user_id,
            subject=subject,
            topic=topic,
            skill_id=skill_id,
            question_id=question_id,
            correct=correct,
            confidence=confidence,
            time_spent=time_spent,
            hints_used=hints_used,
            session_id=session_id,
            device_id=device_id
        )
        
        if interaction_id == -1:
            return jsonify({
                'success': False,
                'message': 'Failed to log interaction'
            }), 500
        
        # Return updated mastery for this skill
        mastery = dkt_service.predict_mastery(g.current_user_id, skill_id)
        
        return jsonify({
            'success': True,
            'data': {
                'interaction_id': interaction_id,
                'skill_mastery': mastery,
                'message': 'Interaction logged successfully'
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Log interaction error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/dkt/knowledge-map', methods=['GET'])
@require_auth
def get_knowledge_map():
    """
    Get visual knowledge map showing mastery across all skills
    Used for dashboard visualization
    """
    try:
        subject = request.args.get('subject')  # Optional filter
        
        from services.deep_knowledge_tracing import dkt_service
        
        knowledge_map = dkt_service.get_knowledge_map(
            user_id=g.current_user_id,
            subject=subject
        )
        
        return jsonify({
            'success': True,
            'data': knowledge_map
        }), 200
        
    except Exception as e:
        logger.error(f"Get knowledge map error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/dkt/mastery/<skill_id>', methods=['GET'])
@require_auth
def get_skill_mastery(skill_id):
    """
    Get current mastery probability for a specific skill
    """
    try:
        from services.deep_knowledge_tracing import dkt_service
        
        mastery = dkt_service.predict_mastery(g.current_user_id, skill_id)
        
        # Get interaction history for this skill
        history = dkt_service.get_interaction_history(
            user_id=g.current_user_id,
            skill_id=skill_id,
            limit=20
        )
        
        return jsonify({
            'success': True,
            'data': {
                'skill_id': skill_id,
                'mastery_probability': mastery,
                'status': dkt_service._get_mastery_status(mastery),
                'total_interactions': len(history),
                'recent_history': history[:5]  # Last 5 interactions
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Get skill mastery error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/dkt/recommend-next', methods=['POST'])
@require_auth
def recommend_next_question():
    """
    Get personalized question recommendation based on DKT predictions
    Returns optimal skill and difficulty to practice next
    """
    try:
        data = request.get_json()
        subject = data.get('subject', '')
        topic = data.get('topic')  # Optional
        
        if not subject:
            return jsonify({
                'success': False,
                'message': 'subject is required'
            }), 400
        
        from services.deep_knowledge_tracing import dkt_service
        
        recommendation = dkt_service.get_next_question_recommendation(
            user_id=g.current_user_id,
            subject=subject,
            topic=topic
        )
        
        return jsonify({
            'success': True,
            'data': recommendation
        }), 200
        
    except Exception as e:
        logger.error(f"Recommend next question error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/dkt/interaction-history', methods=['GET'])
@require_auth
def get_interaction_history():
    """
    Get student's interaction history for review
    """
    try:
        skill_id = request.args.get('skill_id')
        limit = request.args.get('limit', 100, type=int)
        
        from services.deep_knowledge_tracing import dkt_service
        
        history = dkt_service.get_interaction_history(
            user_id=g.current_user_id,
            skill_id=skill_id,
            limit=limit
        )
        
        return jsonify({
            'success': True,
            'data': {
                'total': len(history),
                'interactions': history
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Get interaction history error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


# -----------------------------------------------------------------------------
# OFFLINE SYNC ENDPOINTS
# -----------------------------------------------------------------------------

@mobile_bp.route('/sync/pull', methods=['GET'])
@require_auth
def sync_pull():
    """
    Pull changes from server to mobile app
    Used by WatermelonDB sync engine
    """
    try:
        last_pulled_at = request.args.get('last_pulled_at', type=int)
        schema_version = request.args.get('schema_version', type=int)
        migration = request.args.get('migration')
        
        # In a real implementation, we would query tables for changes since last_pulled_at
        # For now, we return empty changes as we are primarily syncing UP (push)
        
        return jsonify({
            'success': True,
            'data': {
                'changes': {
                    'users': {'created': [], 'updated': [], 'deleted': []},
                    'questions': {'created': [], 'updated': [], 'deleted': []},
                    'interactions': {'created': [], 'updated': [], 'deleted': []},
                },
                'timestamp': int(time.time() * 1000)
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Sync pull error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/sync/push', methods=['POST'])
@require_auth
def sync_push():
    """
    Push changes from mobile app to server
    Used by WatermelonDB sync engine
    """
    try:
        data = request.get_json()
        changes = data.get('changes', {})
        last_pulled_at = data.get('last_pulled_at')
        
        from services.deep_knowledge_tracing import dkt_service
        
        # Process pushed interactions
        if 'interactions' in changes:
            interactions = changes['interactions']
            
            # Handle created interactions (offline logs)
            for created in interactions.get('created', []):
                dkt_service.log_interaction(
                    user_id=g.current_user_id,
                    subject=created.get('subject'),
                    topic=created.get('skill_id'), # Mapping skill_id to topic for now
                    skill_id=created.get('skill_id'),
                    question_id=created.get('question_id'),
                    correct=created.get('correct'),
                    confidence=created.get('confidence'),
                    time_spent=created.get('time_spent'),
                    hints_used=created.get('hints_used'),
                    session_id=created.get('session_id'),
                    device_id='offline_sync'
                )
        
        # Process pushed projects
        if 'projects' in changes:
            projects = changes['projects']
            from services.project_assistant_service import ProjectAssistantService
            project_service = ProjectAssistantService()
            
            # Handle created projects
            for created in projects.get('created', []):
                # We need to adapt the data to match what create_project_mobile expects
                # or just save it directly.
                # Since the mobile app generates the ID, we might want to store it as a reference
                # or just let the server generate a new one and eventually sync back.
                # For simplicity in this phase, we'll create a new project.
                try:
                    project_data = {
                        'title': created.get('title'),
                        'subject': created.get('subject'),
                        'student_name': created.get('student_name'),
                        'student_surname': created.get('student_surname'),
                        'school': created.get('school'),
                        'form': created.get('form'),
                    }
                    project_service.create_project_mobile(g.current_user_id, project_data)
                except Exception as e:
                    logger.error(f"Failed to sync created project: {e}")

            # Handle updated projects
            for updated in projects.get('updated', []):
                # Implement update logic if needed
                pass

        return jsonify({
            'success': True,
            'message': 'Sync successful'
        }), 200
        
    except Exception as e:
        logger.error(f"Sync push error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


# -----------------------------------------------------------------------------
# SRS (SPACED REPETITION) ENDPOINTS
# -----------------------------------------------------------------------------

@mobile_bp.route('/dkt/daily-review', methods=['GET'])
@require_auth
def get_daily_review():
    """
    Get list of skills due for review today
    """
    try:
        from services.deep_knowledge_tracing import dkt_service
        
        reviews = dkt_service.generate_daily_review_queue(g.current_user_id)
        
        return jsonify({
            'success': True,
            'count': len(reviews),
            'reviews': reviews
        }), 200
        
    except Exception as e:
        logger.error(f"Get daily review error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/dkt/review-complete', methods=['POST'])
@require_auth
def complete_review():
    """
    Submit a review interaction and mark as completed in queue
    """
    try:
        data = request.get_json()
        skill_id = data.get('skill_id')
        correct = data.get('correct')
        
        if not skill_id:
            return jsonify({'success': False, 'message': 'Missing skill_id'}), 400
            
        from services.deep_knowledge_tracing import dkt_service
        from database.external_db import get_db_connection
        
        # 1. Log interaction (updates SRS state)
        interaction_id = dkt_service.log_interaction(
            user_id=g.current_user_id,
            subject=data.get('subject', 'general'),
            topic=data.get('topic', 'general'),
            skill_id=skill_id,
            question_id=data.get('question_id'),
            correct=correct,
            confidence=data.get('confidence'),
            time_spent=data.get('time_spent'),
            hints_used=data.get('hints_used', 0),
            session_id=data.get('session_id', 'review_session')
        )
        
        # 2. Mark as completed in daily_review_queue
        db = get_db_connection()
        today = datetime.now().date()
        
        with db.cursor() as cur:
            cur.execute("""
                UPDATE daily_review_queue
                SET completed = TRUE, completed_at = NOW()
                WHERE user_id = %s AND skill_id = %s AND review_date = %s
            """, (g.current_user_id, skill_id, today))
            db.commit()
            
        return jsonify({
            'success': True,
            'interaction_id': interaction_id,
            'message': 'Review completed'
        }), 200
        
    except Exception as e:
        logger.error(f"Complete review error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500


# -----------------------------------------------------------------------------
# PROJECT ASSISTANT ENDPOINTS
# -----------------------------------------------------------------------------

@mobile_bp.route('/project/create', methods=['POST'])
@require_auth
def create_project():
    """Create a new project"""
    try:
        data = request.get_json()
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()
        
        project = service.create_project_mobile(g.current_user_id, data)
        
        return jsonify({
            'success': True,
            'data': project
        }), 200
    except ValueError as e:
        return jsonify({'success': False, 'message': str(e)}), 400
    except Exception as e:
        logger.error(f"Create project error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/project/list', methods=['GET'])
@require_auth
def list_projects():
    """List user's projects"""
    try:
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()
        
        projects = service.get_user_projects(g.current_user_id)
        
        return jsonify({
            'success': True,
            'data': {'projects': projects}
        }), 200
    except Exception as e:
        logger.error(f"List projects error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/project/<int:project_id>', methods=['GET'])
@require_auth
def get_project(project_id):
    """Get project details"""
    try:
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()
        
        project = service.get_project_details(g.current_user_id, project_id)
        
        if not project:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
            
        return jsonify({
            'success': True,
            'data': project
        }), 200
    except Exception as e:
        logger.error(f"Get project error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/project/<int:project_id>/chat', methods=['POST'])
@require_auth
def project_chat(project_id):
    """Send message to project assistant"""
    try:
        data = request.get_json()
        message = data.get('message')
        
        if not message:
            return jsonify({'success': False, 'message': 'Message required'}), 400
            
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()
        
        response = service.process_mobile_message(g.current_user_id, project_id, message)
        
        return jsonify({
            'success': True,
            'data': response
        }), 200
    except ValueError as e:
        return jsonify({'success': False, 'message': str(e)}), 400
    except Exception as e:
        logger.error(f"Project chat error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/project/<int:project_id>/history', methods=['GET'])
@require_auth
def project_history(project_id):
    """Get chat history"""
    try:
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()
        
        history = service.get_chat_history(g.current_user_id, project_id)
        
        return jsonify({
            'success': True,
            'data': {'history': history}
        }), 200
    except Exception as e:
        logger.error(f"Project history error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/project/<int:project_id>', methods=['DELETE'])
@require_auth
def delete_project(project_id):
    """Delete a project"""
    try:
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()
        
        success = service.delete_project(g.current_user_id, project_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Project deleted successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Project not found or could not be deleted'
            }), 404
    except Exception as e:
        logger.error(f"Delete project error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/project/<int:project_id>/document', methods=['GET'])
@require_auth
def project_document(project_id):
    """Generate and download project document as PDF"""
    try:
        from services.project_assistant_service import ProjectAssistantService
        from flask import send_file
        import os
        
        service = ProjectAssistantService()
        
        # Generate PDF document
        result = service.generate_project_document(g.current_user_id, project_id)
        
        if result.get('success') and result.get('pdf_path'):
            pdf_path = result['pdf_path']
            filename = result.get('filename', f'project_{project_id}.pdf')
            
            # Check if file exists
            if os.path.exists(pdf_path):
                # Return the PDF file for download
                return send_file(
                    pdf_path,
                    mimetype='application/pdf',
                    as_attachment=True,
                    download_name=filename
                )
            else:
                logger.error(f"PDF file not found: {pdf_path}")
                return jsonify({'success': False, 'message': 'PDF file not found'}), 500
        else:
            return jsonify({'success': False, 'message': 'Failed to generate document'}), 500
            
    except Exception as e:
        logger.error(f"Project document error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500



# ============================================================================
# SYMPY SYMBOLIC SOLVER ENDPOINTS (Free Alternative to Wolfram Alpha)
# ============================================================================


@mobile_bp.route('/math/solve', methods=['POST'])
@require_auth
def solve_equation():
    """Solve equation with step-by-step solution using SymPy"""
    try:
        data = request.get_json()
        # Accept both 'problem' (from frontend) and 'equation' (original)
        equation = data.get('problem', data.get('equation', '')).strip()
        variable = data.get('variable', 'x').strip()
        
        if not equation:
            return jsonify({'success': False, 'message': 'Equation is required'}), 400
        
        from services.symbolic_solver_service import symbolic_solver
        result = symbolic_solver.solve_equation_with_steps(equation, variable)
        
        return jsonify({
            'success': result.get('success', True),
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"Solve equation error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500


@mobile_bp.route('/math/voice-to-text', methods=['POST'])
@require_auth
def voice_to_math():
    """
    Convert voice recording to formatted mathematical text
    Uses open-source Whisper for transcription + custom math parser
    """
    try:
        # Check if audio file is in request
        if 'audio' not in request.files:
            return jsonify({
                'success': False,
                'message': 'Audio file is required'
            }), 400
        
        audio_file = request.files['audio']
        
        if not audio_file.filename:
            return jsonify({
                'success': False,
                'message': 'Invalid audio file'
            }), 400
        
        # Read audio data
        audio_data = audio_file.read()
        filename = secure_filename(audio_file.filename)
        
        # Process with voice math service
        from services.voice_math_service import voice_math_service
        result = voice_math_service.process_voice_input(audio_data, filename)
        
        if result['success']:
            return jsonify({
                'success': True,
                'data': {
                    'text': result['text'],
                    'original_transcription': result['original_transcription']
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error', 'Failed to process voice input')
            }), 500
            
    except Exception as e:
        logger.error(f"Voice to math error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/math/differentiate', methods=['POST'])
@require_auth
def differentiate():
    """Differentiate function with step-by-step explanation using SymPy"""
    try:
        data = request.get_json()
        function = data.get('function', '').strip()
        variable = data.get('variable', 'x').strip()
        
        if not function:
            return jsonify({'success': False, 'message': 'Function is required'}), 400
        
        from services.symbolic_solver_service import symbolic_solver
        result = symbolic_solver.differentiate_with_steps(function, variable)
        
        return jsonify({
            'success': result.get('success', True),
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"Differentiate error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/math/integrate', methods=['POST'])
@require_auth
def integrate():
    """Integrate function with step-by-step explanation using SymPy"""
    try:
        data = request.get_json()
        function = data.get('function', '').strip()
        variable = data.get('variable', 'x').strip()
        lower_limit = data.get('lower_limit')
        upper_limit = data.get('upper_limit')
        
        if not function:
            return jsonify({'success': False, 'message': 'Function is required'}), 400
        
        from services.symbolic_solver_service import symbolic_solver
        result = symbolic_solver.integrate_with_steps(function, variable, lower_limit, upper_limit)
        
        return jsonify({
            'success': result.get('success', True),
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"Integrate error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/math/simplify', methods=['POST'])
@require_auth
def simplify():
    """Simplify algebraic expression with steps using SymPy"""
    try:
        data = request.get_json()
        expression = data.get('expression', '').strip()
        
        if not expression:
            return jsonify({'success': False, 'message': 'Expression is required'}), 400
        
        from services.symbolic_solver_service import symbolic_solver
        result = symbolic_solver.simplify_expression(expression)
        
        return jsonify({
            'success': result.get('success', True),
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"Simplify error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

# ============================================================================
# PIX2TEXT OCR ENDPOINTS (Free Alternative to Mathpix)
# ============================================================================

@mobile_bp.route('/ocr/scan-equation', methods=['POST'])
@require_auth
def scan_equation():
    """Scan mathematical equation from image using Pix2Text OCR"""
    try:
        # Get image from request (base64 or file upload)
        if 'image' in request.files:
            # File upload
            image_file = request.files['image']
            
            # Save temporarily
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp:
                image_file.save(tmp.name)
                temp_path = tmp.name
            
            from services.math_ocr_service import math_ocr_service
            result = math_ocr_service.scan_equation(temp_path)
            
            # Clean up temp file
            os.unlink(temp_path)
            
        elif request.json and 'image_url' in request.json:
            # Download from URL
            image_url = request.json.get('image_url')
            
            # Download image
            import requests
            import tempfile
            response = requests.get(image_url)
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp:
                tmp.write(response.content)
                temp_path = tmp.name
            
            from services.math_ocr_service import math_ocr_service
            result = math_ocr_service.scan_equation(temp_path)
            
            os.unlink(temp_path)
            
        else:
            return jsonify({'success': False, 'message': 'Image file or image_url required'}), 400
        
        return jsonify({
            'success': result.get('success', True),
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"OCR scan equation error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/ocr/scan-page', methods=['POST'])
@require_auth
def scan_green_book_page():
    """Scan full Green Book past paper page with layout analysis"""
    try:
        if 'image' in request.files:
            image_file = request.files['image']
            
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp:
                image_file.save(tmp.name)
                temp_path = tmp.name
            
            from services.math_ocr_service import math_ocr_service
            result = math_ocr_service.scan_full_page(temp_path, detect_layout=True)
            
            os.unlink(temp_path)
            
        elif request.json and 'image_url' in request.json:
            image_url = request.json.get('image_url')
            
            import requests
            import tempfile
            response = requests.get(image_url)
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp:
                tmp.write(response.content)
                temp_path = tmp.name
            
            from services.math_ocr_service import math_ocr_service
            result = math_ocr_service.scan_full_page(temp_path, detect_layout=True)
            
            os.unlink(temp_path)
            
        else:
            return jsonify({'success': False, 'message': 'Image file or image_url required'}), 400
        
        return jsonify({
            'success': result.get('success', True),
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"OCR scan page error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/ocr/verify', methods=['GET'])
@require_auth
def verify_ocr_installation():
    """Verify Pix2Text OCR is installed and working"""
    try:
        from services.math_ocr_service import math_ocr_service
        result = math_ocr_service.verify_installation()
        
        return jsonify({
            'success': result.get('installed', False),
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"OCR verification error: {e}", exc_info=True)
        return jsonify({
            'success': False, 
            'message': str(e),
            'data': {
                'installed': False,
                'error': str(e)
            }
        }), 500

# ============================================================================
# VECTOR SEARCH ENDPOINTS (Free Alternative to Pinecone)
# ============================================================================

@mobile_bp.route('/vector/index-question', methods=['POST'])
@require_auth
def index_question():
    """Index a question into vector database for similarity search"""
    try:
        data = request.get_json()
        
        question_data = {
            'id': data.get('id', str(uuid.uuid4())),
            'question_text': data.get('question_text', ''),
            'topic': data.get('topic', ''),
            'difficulty': data.get('difficulty', 'medium'),
            'year': data.get('year', 2023),
            'paper': data.get('paper', 1),
            'question_number': data.get('question_number', 1),
            'latex_equation': data.get('latex_equation', ''),
            'solution': data.get('solution', ''),
            'source': data.get('source', 'ZIMSEC')
        }
        
        from services.vector_search_service import get_vector_search_service
        service = get_vector_search_service()
        
        success = service.index_question(question_data)
        
        return jsonify({
            'success': success,
            'message': 'Question indexed successfully' if success else 'Failed to index question',
            'question_id': question_data['id']
        }), 200
        
    except Exception as e:
        logger.error(f"Index question error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/vector/search-similar', methods=['POST'])
@require_auth
def search_similar_questions():
    """Find similar questions using vector similarity search"""
    try:
        data = request.get_json()
        
        query_text = data.get('query_text', '')
        top_k = data.get('top_k', 5)
        filters = data.get('filters', {})
        
        if not query_text:
            return jsonify({'success': False, 'message': 'query_text is required'}), 400
        
        from services.vector_search_service import get_vector_search_service
        service = get_vector_search_service()
        
        similar_questions = service.find_similar_questions(query_text, top_k, filters)
        
        return jsonify({
            'success': True,
            'data': {
                'query': query_text,
                'results': similar_questions,
                'count': len(similar_questions)
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Search similar questions error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/vector/stats', methods=['GET'])
@require_auth
def get_vector_stats():
    """Get vector database statistics"""
    try:
        from services.vector_search_service import get_vector_search_service
        service = get_vector_search_service()
        
        stats = service.get_collection_stats()
        
        return jsonify({
            'success': True,
            'data': stats
        }), 200
        
    except Exception as e:
        logger.error(f"Get vector stats error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/vector/verify', methods=['GET'])
@require_auth
def verify_vector_installation():
    """Verify Milvus and sentence-transformers installation"""
    try:
        from services.vector_search_service import get_vector_search_service
        service = get_vector_search_service()
        
        result = service.verify_installation()
        
        return jsonify({
            'success': result.get('installed', False),
            'data': result
        }), 200
        
    except Exception as e:
        logger.error(f"Vector verification error: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'message': str(e),
            'data': {
                'installed': False,
                'error': str(e)
            }
        }), 500

# -----------------------------------------------------------------------------
# Manim Animation Endpoints (Phase 4)
# -----------------------------------------------------------------------------

@mobile_bp.route('/math/animate/verify', methods=['GET'])
def verify_animation_service():
    """Check if Manim and dependencies are installed"""
    try:
        from services.manim_service import get_manim_service
        service = get_manim_service()
        deps = service.check_dependencies()
        
        return jsonify({
            'status': 'success',
            'dependencies': deps,
            'ready_for_math': deps['latex'],
            'ready_for_basic': deps['ffmpeg']
        }), 200
    except ImportError:
        return jsonify({
            'status': 'error',
            'message': 'Manim service not found or dependencies missing'
        }), 500
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@mobile_bp.route('/math/animate/quadratic', methods=['POST'])
def animate_quadratic():
    """Generate animation for quadratic function"""
    try:
        data = request.get_json()
        a = float(data.get('a', 1))
        b = float(data.get('b', 0))
        c = float(data.get('c', 0))
        quality = data.get('quality', 'l')  # Default to low for speed
        
        from services.manim_service import get_manim_service
        service = get_manim_service()
        
        result = service.render_quadratic(a, b, c, quality)
        
        if result['success']:
            video_path = f"/static/{result['video_path'].replace(os.sep, '/')}"
            return jsonify({
                'success': True,
                'data': {
                    'video_path': video_path,
                    'render_id': result['render_id']
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error'),
                'logs': result.get('logs')
            }), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/math/animate/linear', methods=['POST'])
def animate_linear():
    """Generate animation for linear function"""
    try:
        data = request.get_json()
        m = float(data.get('m', 1))
        c = float(data.get('c', 0))
        quality = data.get('quality', 'l')
        
        from services.manim_service import get_manim_service
        service = get_manim_service()
        
        result = service.render_linear(m, c, quality)
        
        if result['success']:
            video_path = f"/static/{result['video_path'].replace(os.sep, '/')}"
            return jsonify({
                'success': True,
                'data': {
                    'video_path': video_path,
                    'render_id': result['render_id']
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('error'),
                'logs': result.get('logs')
            }), 500
            
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# -----------------------------------------------------------------------------
# Math OCR Endpoints
# -----------------------------------------------------------------------------

@mobile_bp.route('/math/scan', methods=['POST'])
def scan_math_problem():
    """Scan math problem from image"""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'message': 'No image provided'}), 400
            
        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'success': False, 'message': 'No selected file'}), 400
            
        from services.math_ocr_service import math_ocr_service
        
        # Save temp file
        filename = secure_filename(image_file.filename)
        # Use a temp directory
        temp_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        
        temp_path = os.path.join(temp_dir, f"scan_{uuid.uuid4().hex}_{filename}")
        image_file.save(temp_path)
        
        # Scan
        result = math_ocr_service.scan_equation(temp_path)
        
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        if result['success']:
            return jsonify({
                'success': True,
                'data': result
            }), 200
        else:
            return jsonify({'success': False, 'message': result.get('error')}), 500
            
    except Exception as e:
        logger.error(f"Scan math problem error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

# -----------------------------------------------------------------------------
# Voice Feature Endpoints (Phase 5)
# -----------------------------------------------------------------------------

@mobile_bp.route('/voice/transcribe', methods=['POST'])
@require_auth
def transcribe_audio():
    """Transcribe uploaded audio file"""
    try:
        if 'audio' not in request.files:
            return jsonify({'status': 'error', 'message': 'No audio file provided'}), 400
            
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'status': 'error', 'message': 'No selected file'}), 400
            
        from services.voice_service import get_voice_service
        service = get_voice_service()
        
        # Save temp file
        filename = secure_filename(audio_file.filename)
        temp_path = os.path.join(service.media_dir, f"temp_{uuid.uuid4().hex}_{filename}")
        audio_file.save(temp_path)
        
        # Transcribe
        result = service.transcribe_audio(temp_path)
        
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        if 'error' in result:
            return jsonify({'status': 'error', 'message': result['error']}), 500
            
        return jsonify({
            'status': 'success',
            'text': result['text'],
            'language': result['language']
        }), 200
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@mobile_bp.route('/voice/speak', methods=['POST'])
@require_auth
def text_to_speech():
    """Convert text to speech"""
    try:
        data = request.get_json()
        text = data.get('text')
        voice = data.get('voice', 'en-US-AriaNeural')
        
        if not text:
            return jsonify({'status': 'error', 'message': 'No text provided'}), 400
            
        from services.voice_service import get_voice_service
        service = get_voice_service()
        
        # Run async TTS in sync Flask
        import asyncio
        result = asyncio.run(service.text_to_speech(text, voice))
        
        if result['success']:
            return jsonify({
                'status': 'success',
                'audio_url': f"/static/{result['audio_path']}"
            }), 200
        else:
            return jsonify({'status': 'error', 'message': result.get('error')}), 500
            
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============================================================================
# FLASHCARD GENERATION ENDPOINTS (AI-Powered Study Cards)
# ============================================================================

@mobile_bp.route('/flashcards/generate', methods=['POST'])
def generate_flashcards():
    """
    Generate AI-powered flashcards for a science topic.
    
    Request body:
        subject: string - 'Biology', 'Chemistry', or 'Physics'
        topic: string - Topic name
        count: int - Number of flashcards to generate (max 100 per batch)
        notes_content: string - Optional notes content to base flashcards on
    
    Returns:
        flashcards: Array of flashcard objects
    """
    try:
        data = request.get_json()
        
        subject = data.get('subject', '')
        topic = data.get('topic', '')
        count = min(int(data.get('count', 20)), 100)  # Cap at 100
        notes_content = data.get('notes_content', '')
        
        if not subject or not topic:
            return jsonify({
                'success': False,
                'message': 'Subject and topic are required'
            }), 400
        
        # Validate subject
        if subject not in ['Biology', 'Chemistry', 'Physics', 'Mathematics']:
            return jsonify({
                'success': False,
                'message': 'Invalid subject. Must be Biology, Chemistry, Physics, or Mathematics'
            }), 400
        
        from services.flashcard_service import flashcard_service
        
        flashcards = flashcard_service.generate_flashcards(
            subject=subject,
            topic=topic,
            notes_content=notes_content,
            count=count
        )
        
        logger.info(f"✅ Generated {len(flashcards)} flashcards for {topic} ({subject})")
        
        return jsonify({
            'success': True,
            'data': {
                'flashcards': flashcards,
                'count': len(flashcards),
                'subject': subject,
                'topic': topic
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate flashcards error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Failed to generate flashcards'}), 500


@mobile_bp.route('/flashcards/generate-single', methods=['POST'])
def generate_single_flashcard():
    """
    Generate a single flashcard (for streaming mode with >100 cards).
    
    Request body:
        subject: string - 'Biology', 'Chemistry', or 'Physics'
        topic: string - Topic name
        index: int - Card number in sequence (0-indexed)
        notes_content: string - Notes content
        previous_questions: array - List of previous questions to avoid
    
    Returns:
        flashcard: Single flashcard object
    """
    try:
        data = request.get_json()
        
        subject = data.get('subject', '')
        topic = data.get('topic', '')
        index = int(data.get('index', 0))
        notes_content = data.get('notes_content', '')
        previous_questions = data.get('previous_questions', [])
        
        if not subject or not topic:
            return jsonify({
                'success': False,
                'message': 'Subject and topic are required'
            }), 400
        
        from services.flashcard_service import flashcard_service
        
        flashcard = flashcard_service.generate_single_flashcard(
            subject=subject,
            topic=topic,
            notes_content=notes_content,
            index=index,
            previous_questions=previous_questions
        )
        
        if flashcard:
            return jsonify({
                'success': True,
                'data': {
                    'flashcard': flashcard,
                    'index': index
                }
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to generate flashcard'
            }), 500
        
    except Exception as e:
        logger.error(f"Generate single flashcard error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Failed to generate flashcard'}), 500

@mobile_bp.route('/math/notes/generate', methods=['POST'])
def generate_math_notes():
    """Generate professional math notes using DeepSeek AI"""
    try:
        data = request.get_json()
        topic = data.get('topic', '')
        grade_level = data.get('grade_level', 'O-Level')
        
        if not topic:
            return jsonify({'success': False, 'message': 'Topic is required'}), 400
            
        from services.math_notes_service import math_notes_service
        notes = math_notes_service.generate_topic_notes(topic, grade_level)
        
        if notes:
            return jsonify({'success': True, 'data': notes}), 200
        else:
            return jsonify({'success': False, 'message': 'Failed to generate math notes'}), 500
            
    except Exception as e:
        logger.error(f"Generate math notes error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@mobile_bp.route('/math/notes/topics', methods=['GET'])
def get_math_topics():
    """Get list of available math topics"""
    # Fallback/Default topics if none provided by a database
    from constants import MATHEMATICS_TOPICS
    return jsonify({
        'success': True, 
        'data': {
            'topics': list(MATHEMATICS_TOPICS.keys()) if isinstance(MATHEMATICS_TOPICS, dict) else MATHEMATICS_TOPICS
        }
    }), 200
