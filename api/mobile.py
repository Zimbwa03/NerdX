"""
Mobile API Blueprint for NerdX Mobile Application
Provides REST API endpoints for React Native mobile app
"""
import logging
import jwt
import hashlib
import secrets
from datetime import datetime, timedelta
from functools import wraps
from flask import Blueprint, request, jsonify, g
from database.external_db import (
    get_user_registration, create_user_registration, is_user_registered,
    get_user_stats, get_user_credits, add_credits, deduct_credits,
    get_user_by_nerdx_id, add_xp, update_streak
)
from services.advanced_credit_service import advanced_credit_service
from services.question_service import QuestionService
from services.mathematics_service import MathematicsService
from services.combined_science_generator import CombinedScienceGenerator
from services.english_service import EnglishService
from services.referral_service import ReferralService
from services.paynow_service import PaynowService
from services.graph_service import GraphService
from services.image_service import ImageService
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
            
            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'id': user_data.get('chat_id'),
                    'nerdx_id': nerdx_id,
                    'name': name,
                    'surname': surname,
                    'email': email,
                    'phone_number': phone_number,
                    'credits': Config.REGISTRATION_BONUS,
                },
                'message': 'Registration successful'
            }), 201
            
        except Exception as e:
            logger.error(f"Registration error: {e}")
            return jsonify({'success': False, 'message': 'Registration failed'}), 500
            
    except Exception as e:
        logger.error(f"Register endpoint error: {e}")
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
        
        # Get topics from constants or database
        from constants import TOPICS
        
        topics = []
        if subject in TOPICS:
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
        logger.error(f"Get topics error: {e}")
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
            math_service = MathematicsService()
            question_data = math_service.generate_topical_question(topic or 'Algebra', difficulty)
        elif subject == 'combined_science':
            science_gen = CombinedScienceGenerator()
            question_data = science_gen.generate_question(topic, difficulty)
        elif subject == 'english':
            english_service = EnglishService()
            question_data = english_service.generate_topical_question(topic or 'Grammar', difficulty)
        
        if not question_data:
            return jsonify({'success': False, 'message': 'Failed to generate question'}), 500
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost)
        
        # Format question for mobile
        question = {
            'id': str(uuid.uuid4()),
            'question_text': question_data.get('question', ''),
            'question_type': question_data.get('type', 'short_answer'),
            'options': question_data.get('options'),
            'correct_answer': question_data.get('answer', ''),
            'solution': question_data.get('solution', ''),
            'points': question_data.get('points', 10),
            'topic': topic or '',
            'difficulty': difficulty
        }
        
        return jsonify({
            'success': True,
            'data': question
        }), 200
        
    except Exception as e:
        logger.error(f"Generate question error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/quiz/submit-answer', methods=['POST'])
@require_auth
def submit_answer():
    """Submit answer and get feedback"""
    try:
        data = request.get_json()
        question_id = data.get('question_id')
        answer = data.get('answer', '').strip()
        
        if not question_id or not answer:
            return jsonify({'success': False, 'message': 'Question ID and answer are required'}), 400
        
        # TODO: Retrieve question and verify answer
        # For now, return mock feedback
        
        # Check if answer is correct (simplified)
        is_correct = True  # Implement actual checking
        
        points_earned = 10 if is_correct else 0
        
        # Add XP if correct
        if is_correct:
            add_xp(g.current_user_id, points_earned)
        
        return jsonify({
            'success': True,
            'data': {
                'correct': is_correct,
                'feedback': 'Correct!' if is_correct else 'Incorrect. Try again!',
                'solution': 'Solution explanation here',
                'points_earned': points_earned,
                'credits_used': 0  # Already deducted
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Submit answer error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

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
        
        # Initiate payment via Paynow
        paynow_service = PaynowService()
        reference = f"MOBILE_{uuid.uuid4().hex[:8].upper()}"
        
        # Create payment
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
                'amount': package['price']
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
        # TODO: Check payment status from database
        # For now, return pending
        
        return jsonify({
            'success': True,
            'data': {
                'reference': reference,
                'status': 'pending',  # 'pending', 'completed', 'failed'
                'amount': 0,
                'credits': 0
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
        deduct_credits(g.current_user_id, credit_cost)
        
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
        deduct_credits(g.current_user_id, credit_cost)
        
        return jsonify({
            'success': True,
            'data': {
                'passage': comprehension.get('passage', ''),
                'questions': comprehension.get('questions', [])
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate comprehension error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/english/essay', methods=['POST'])
@require_auth
def submit_essay():
    """Submit essay for marking"""
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        essay_text = data.get('essay_text', '')
        
        if not prompt or not essay_text:
            return jsonify({'success': False, 'message': 'Prompt and essay text are required'}), 400
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('english_essay_writing')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Mark essay
        english_service = EnglishService()
        result = english_service.mark_essay(prompt, essay_text)
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost)
        
        essay_id = str(uuid.uuid4())
        
        return jsonify({
            'success': True,
            'data': {
                'essay_id': essay_id,
                'score': result.get('score', 0),
                'feedback': result.get('feedback', ''),
                'report_url': result.get('report_url', '')
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Submit essay error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

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
        logger.error(f"Get essay report error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

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
        deduct_credits(g.current_user_id, credit_cost)
        
        return jsonify({
            'success': True,
            'data': {
                'image_id': str(uuid.uuid4()),
                'processed_text': result.get('text', ''),
                'solution': result.get('solution', '')
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Upload image error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# TEACHER MODE ENDPOINTS (Combined Science Chatbot)
# ============================================================================

@mobile_bp.route('/teacher/start', methods=['POST'])
@require_auth
def start_teacher_mode():
    """Start Teacher Mode session"""
    try:
        data = request.get_json()
        subject = data.get('subject', '')  # Biology, Chemistry, Physics
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
        
        # Start teacher mode session
        from services.combined_science_teacher_service import CombinedScienceTeacherService
        teacher_service = CombinedScienceTeacherService()
        
        # Initialize session
        session_id = str(uuid.uuid4())
        from utils.session_manager import session_manager
        session_manager.set_data(g.current_user_id, 'science_teacher', {
            'active': True,
            'session_id': session_id,
            'subject': subject,
            'grade_level': grade_level,
            'topic': topic,
            'conversation_history': [],
            'started_at': datetime.utcnow().isoformat()
        })
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost)
        
        # Get initial message from teacher
        initial_message = f"👨‍🏫 Welcome to Teacher Mode!\n\nI'm your {subject} teacher. How can I help you learn today?"
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
        logger.error(f"Start teacher mode error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

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
        
        # Check if user wants to exit
        exit_commands = ['exit', 'quit', 'back', 'main menu', 'leave']
        if message.lower() in exit_commands:
            from utils.session_manager import session_manager
            session_manager.clear_session(g.current_user_id, 'science_teacher')
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
        
        # Get session data
        from utils.session_manager import session_manager
        session_data = session_manager.get_data(g.current_user_id, 'science_teacher')
        
        if not session_data or not session_data.get('active'):
            return jsonify({'success': False, 'message': 'No active teacher session'}), 400
        
        # Get AI response using the service's handle_conversation method
        from services.combined_science_teacher_service import CombinedScienceTeacherService
        teacher_service = CombinedScienceTeacherService()
        
        # Use the service's handle_conversation which handles credits and AI response
        # We need to get the response directly, so we'll call the internal method
        session_data = session_manager.get_data(g.current_user_id, 'science_teacher')
        if not session_data or not session_data.get('active'):
            return jsonify({'success': False, 'message': 'No active teacher session'}), 400
        
        # Get AI response using internal method
        conversation_history = session_data.get('conversation_history', [])
        conversation_history.append({'role': 'user', 'content': message})
        
        # Get response from Gemini
        response_text = teacher_service._get_gemini_teaching_response(
            g.current_user_id, message, session_data
        )
        
        conversation_history.append({'role': 'assistant', 'content': response_text})
        
        # Update session
        session_data['conversation_history'] = conversation_history[-20:]  # Keep last 20
        session_manager.set_data(g.current_user_id, 'science_teacher', session_data)
        
        # Credits already deducted by check_and_deduct_credits in handle_conversation logic
        # But we need to deduct here since we're bypassing handle_conversation
        deduct_credits(g.current_user_id, credit_cost)
        
        # Clean formatting
        clean_response = teacher_service._clean_whatsapp_formatting(response_text)
        
        return jsonify({
            'success': True,
            'data': {
                'response': clean_response,
                'session_id': session_id
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Send teacher message error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

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
        deduct_credits(g.current_user_id, credit_cost)
        
        return jsonify({
            'success': True,
            'data': {
                'notes': notes_data,
                'pdf_url': ''  # TODO: Generate actual PDF
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate teacher notes error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# PROJECT ASSISTANT ENDPOINTS
# ============================================================================

@mobile_bp.route('/project/start', methods=['POST'])
@require_auth
def start_project_assistant():
    """Start Project Assistant session"""
    try:
        data = request.get_json()
        project_title = data.get('project_title', '')
        subject = data.get('subject', '')
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('project_assistant_start')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Start project session
        from services.project_assistant_service import ProjectAssistantService
        project_service = ProjectAssistantService()
        
        session_id = str(uuid.uuid4())
        from utils.session_manager import session_manager
        session_manager.set_data(g.current_user_id, 'project_assistant', {
            'active': True,
            'session_id': session_id,
            'project_title': project_title,
            'subject': subject,
            'conversation_history': [],
            'started_at': datetime.utcnow().isoformat()
        })
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost)
        
        initial_message = "🎓 Welcome to Project Assistant!\n\nI'm here to help you with your ZIMSEC School-Based Project. What would you like to work on today?"
        
        return jsonify({
            'success': True,
            'data': {
                'session_id': session_id,
                'project_title': project_title,
                'subject': subject,
                'initial_message': initial_message
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Start project assistant error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/project/message', methods=['POST'])
@require_auth
def send_project_message():
    """Send message to Project Assistant chatbot"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        session_id = data.get('session_id', '')
        
        if not message:
            return jsonify({'success': False, 'message': 'Message is required'}), 400
        
        # Check if user wants to exit
        exit_commands = ['exit', 'quit', 'back', 'main menu']
        if message.lower() in exit_commands:
            from utils.session_manager import session_manager
            session_manager.clear_session(g.current_user_id, 'project_assistant')
            return jsonify({
                'success': True,
                'data': {
                    'response': '👋 Project Assistant session ended. Good luck with your project!',
                    'session_ended': True
                }
            }), 200
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('project_assistant_followup')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        # Get session data
        from utils.session_manager import session_manager
        session_data = session_manager.get_data(g.current_user_id, 'project_assistant')
        
        if not session_data or not session_data.get('active'):
            return jsonify({'success': False, 'message': 'No active project session'}), 400
        
        # Get AI response
        from services.project_assistant_service import ProjectAssistantService
        project_service = ProjectAssistantService()
        
        # Get AI response using project service
        conversation_history = session_data.get('conversation_history', [])
        conversation_history.append({'role': 'user', 'content': message})
        
        # Use the service's internal method to get AI response
        # The project service uses _get_ai_response with different signature
        # Let's call handle_project_message which processes the message
        project_data = {
            'project_title': session_data.get('project_title', ''),
            'subject': session_data.get('subject', ''),
            'conversation_history': conversation_history
        }
        
        # Get user data for project assistant
        user_data = get_user_registration(g.current_user_id)
        
        # Get AI response - method expects (user_id, message_text, project_data)
        project_data_dict = {
            'student_name': user_data.get('name', 'Student') if user_data else 'Student',
            'project_title': session_data.get('project_title', ''),
            'subject': session_data.get('subject', ''),
            'conversation_history': conversation_history
        }
        ai_response = project_service._get_ai_response(
            g.current_user_id,
            message,
            project_data_dict
        )
        
        conversation_history.append({'role': 'assistant', 'content': ai_response})
        
        # Update session
        session_data['conversation_history'] = conversation_history
        session_manager.set_data(g.current_user_id, 'project_assistant', session_data)
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost)
        
        return jsonify({
            'success': True,
            'data': {
                'response': ai_response,
                'session_id': session_id
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Send project message error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

# ============================================================================
# GRAPH PRACTICE ENDPOINTS
# ============================================================================

@mobile_bp.route('/math/graph/generate', methods=['POST'])
@require_auth
def generate_graph():
    """Generate math graph practice"""
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
        
        # Generate a question about the graph
        question = f"Analyze the graph of {equation}. What are the key features of this graph?"
        solution = f"The graph of {equation} shows [analysis based on graph type]. Key features include..."
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost)
        
        return jsonify({
            'success': True,
            'data': {
                'graph_url': graph_result.get('image_url', ''),
                'equation': equation,
                'question': question,
                'solution': solution
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate graph error: {e}")
        return jsonify({'success': False, 'message': 'Server error'}), 500

