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
from database.external_db import (
    get_user_registration, create_user_registration, is_user_registered,
    get_user_stats, get_user_credits, add_credits, deduct_credits,
    get_user_by_nerdx_id, add_xp, update_streak
)
from services.advanced_credit_service import advanced_credit_service
from services.question_service import QuestionService
from services.mathematics_service import MathematicsService
from services.mathematics_teacher_service import mathematics_teacher_service
from services.combined_science_generator import CombinedScienceGenerator
from services.english_service import EnglishService
from services.referral_service import ReferralService
from services.paynow_service import PaynowService
from services.graph_service import GraphService
from services.graph_service import GraphService
from services.image_service import ImageService
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
            correct_answer = question_data.get('answer') or question_data.get('correct_answer') or question_data.get('acceptable_answers', [{}])[0]
            if isinstance(correct_answer, list) and len(correct_answer) > 0:
                correct_answer = correct_answer[0]
            if not correct_answer:
                correct_answer = ''
            
            # Get solution/explanation
            solution = question_data.get('solution') or question_data.get('explanation') or question_data.get('feedback', '')
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
        
        # Format question for mobile
        question = {
            'id': str(uuid.uuid4()),
            'question_text': question_data.get('question', '') or question_data.get('question_text', ''),
            'question_type': question_type_mobile,
            'options': options if isinstance(options, list) else [],
            'correct_answer': correct_answer,
            'solution': solution,
            'hint': question_data.get('hint', '') if subject == 'mathematics' else '',
            'explanation': question_data.get('explanation', ''),
            'points': question_data.get('points', 10),
            'topic': topic or '',
            'difficulty': difficulty,
            'allows_text_input': (
                subject == 'mathematics' or 
                question_type_mobile == 'short_answer' or
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
            'learning_objective': question_data.get('learning_objective', '')
        }
        
        return jsonify({
            'success': True,
            'data': question
        }), 200
        
    except Exception as e:
        logger.error(f"Generate question error: {e}", exc_info=True)
        error_message = str(e) if str(e) else 'Server error'
        return jsonify({'success': False, 'message': f'Failed to generate question: {error_message}'}), 500

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
        correct_answer = data.get('correct_answer', '')
        solution = data.get('solution', '')
        hint = data.get('hint', '')
        question_text = data.get('question_text', '') # Need question text for AI analysis
        
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
        else:
            # For other subjects, simple string comparison
            if answer.lower().strip() == str(correct_answer).lower().strip():
                is_correct = True
                feedback = '✅ Correct!'
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
        deduct_credits(g.current_user_id, credit_cost, 'teacher_mode_start', f'Started Teacher Mode: {subject}')
        
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
        deduct_credits(g.current_user_id, credit_cost, 'teacher_mode_followup', 'Teacher Mode conversation')
        
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

# ============================================================================
# PROJECT ASSISTANT ENDPOINTS (Database-Backed)
# ============================================================================

@mobile_bp.route('/project/create', methods=['POST'])
@require_auth
def create_project():
    """Create a new project"""
    try:
        data = request.get_json()
        title = data.get('title', '')
        subject = data.get('subject', '')
        student_name = data.get('student_name', '')
        student_surname = data.get('student_surname', '')
        school = data.get('school', '')
        form_level = data.get('form', '')
        
        if not title or not subject:
            return jsonify({'success': False, 'message': 'Title and subject are required'}), 400
        
        from services.project_service import ProjectService
        project_service = ProjectService()
        
        # Create project details dictionary
        project_details = {
            'student_name': student_name,
            'student_surname': student_surname,
            'school': school,
            'form': form_level,
            'created_at': datetime.utcnow().isoformat()
        }
        
        project = project_service.create_project(g.current_user_id, title, subject, project_details)
        
        if not project:
            return jsonify({'success': False, 'message': 'Failed to create project'}), 500
        
        return jsonify({
            'success': True,
            'data': {
                'id': project.get('id'),
                'title': project.get('project_title'),
                'subject': project.get('subject'),
                'current_stage': project.get('current_stage')
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Create project error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/project/list', methods=['GET'])
@require_auth
def list_projects():
    """Get all projects for the current user"""
    try:
        from services.project_service import ProjectService
        project_service = ProjectService()
        
        projects = project_service.get_student_projects(g.current_user_id)
        
        project_list = [{
            'id': p.get('id'),
            'title': p.get('project_title'),
            'subject': p.get('subject'),
            'current_stage': p.get('current_stage'),
            'completed': p.get('completed'),
            'updated_at': p.get('updated_at')
        } for p in projects]
        
        return jsonify({
            'success': True,
            'data': {'projects': project_list}
        }), 200
        
    except Exception as e:
        logger.error(f"List projects error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/project/<int:project_id>', methods=['GET'])
@require_auth
def get_project(project_id):
    """Get project details"""
    try:
        from services.project_service import ProjectService
        project_service = ProjectService()
        
        project = project_service.get_project(project_id)
        
        if not project:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        
        # Verify ownership
        if project.get('user_id') != g.current_user_id:
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403
        
        return jsonify({
            'success': True,
            'data': {
                'id': project.get('id'),
                'title': project.get('project_title'),
                'subject': project.get('subject'),
                'current_stage': project.get('current_stage'),
                'project_data': project.get('project_data'),
                'completed': project.get('completed'),
                'created_at': project.get('created_at'),
                'updated_at': project.get('updated_at')
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Get project error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/project/<int:project_id>/chat', methods=['POST'])
@require_auth
def chat_with_project(project_id):
    """Chat with the project assistant for a specific project"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'success': False, 'message': 'Message is required'}), 400
        
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('project_assistant_followup')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        from services.project_service import ProjectService
        project_service = ProjectService()
        
        # Verify project exists and belongs to user
        project = project_service.get_project(project_id)
        if not project or project.get('user_id') != g.current_user_id:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        
        # Chat with agent
        response = project_service.chat_with_agent(project_id, message)
        
        if 'error' in response:
            return jsonify({'success': False, 'message': response['error']}), 500
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'project_assistant_followup', 'Project Assistant chat')
        
        return jsonify({
            'success': True,
            'data': {
                'response': response.get('response'),
                'project_id': project_id
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Project chat error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/project/<int:project_id>/history', methods=['GET'])
@require_auth
def get_project_history(project_id):
    """Get chat history for a project"""
    try:
        from services.project_service import ProjectService
        from database.external_db import get_project_chat_history
        
        project_service = ProjectService()
        
        # Verify project exists and belongs to user
        project = project_service.get_project(project_id)
        if not project or project.get('user_id') != g.current_user_id:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        
        history = get_project_chat_history(project_id)
        
        return jsonify({
            'success': True,
            'data': {'history': history}
        }), 200
        
    except Exception as e:
        logger.error(f"Get project history error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/project/<int:project_id>/document', methods=['GET'])
@require_auth
def generate_project_document(project_id):
    """Generate the final project document"""
    try:
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('project_assistant_start')  # Same as start cost
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        from services.project_service import ProjectService
        project_service = ProjectService()
        
        # Verify project exists and belongs to user
        project = project_service.get_project(project_id)
        if not project or project.get('user_id') != g.current_user_id:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        
        # Generate document
        document_path = project_service.generate_document(project_id)
        
        if not document_path:
            return jsonify({'success': False, 'message': 'Failed to generate document'}), 500
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'project_document_generation', 'Generated project document')
        
        return jsonify({
            'success': True,
            'data': {
                'document_url': document_path,
                'message': 'Document generated successfully'
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate document error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/project/<int:project_id>/document/word', methods=['GET'])
@require_auth
def generate_project_word_document(project_id):
    """Generate editable Word document"""
    try:
        # Check credits
        credit_cost = advanced_credit_service.get_credit_cost('project_assistant_start')
        user_credits = get_user_credits(g.current_user_id) or 0
        
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}'
            }), 400
        
        from services.project_service import ProjectService
        project_service = ProjectService()
        
        # Verify project exists and belongs to user
        project = project_service.get_project(project_id)
        if not project or project.get('user_id') != g.current_user_id:
            return jsonify({'success': False, 'message': 'Project not found'}), 404
        
        # Generate Word document
        document_path = project_service.generate_word_document(project_id)
        
        if not document_path:
            return jsonify({'success': False, 'message': 'Failed to generate Word document'}), 500
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'project_word_generation', 'Generated Word document')
        
        return jsonify({
            'success': True,
            'data': {
                'document_url': document_path,
                'format': 'docx',
                'message': 'Word document generated successfully'
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Generate Word document error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/project/templates', methods=['GET'])
@require_auth
def get_project_templates():
    """Get available project templates"""
    try:
        from utils.project_templates import list_templates
        
        templates = list_templates()
        
        return jsonify({
            'success': True,
            'data': {'templates': templates}
        }), 200
        
    except Exception as e:
        logger.error(f"Get templates error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@mobile_bp.route('/project/template/<template_key>', methods=['GET'])
@require_auth
def get_project_template(template_key):
    """Get specific template details"""
    try:
        from utils.project_templates import get_template
        
        template = get_template(template_key)
        
        if not template:
            return jsonify({'success': False, 'message': 'Template not found'}), 404
        
        return jsonify({
            'success': True,
            'data': template
        }), 200
        
    except Exception as e:
        logger.error(f"Get template error: {e}", exc_info=True)
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
# ENGLISH ESSAY WRITING ENDPOINTS (ZIMSEC STANDARD)
# ============================================================================

@mobile_bp.route('/api/mobile/english/essay/free-response-topics', methods=['GET'])
@require_auth
def get_free_response_topics():
    """Get 7 free response essay topics for ZIMSEC Paper 1 Section A"""
    try:
        english_service = EnglishService()
        result = english_service.generate_free_response_topics()
        
        if not result or not result.get('success'):
            return jsonify({
                'success': False,
                'message': 'Failed to generate free response topics'
            }), 500
        
        return jsonify({
            'success': True,
            'data': result.get('topics', [])
        }), 200
        
    except Exception as e:
        logger.error(f"Get free response topics error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/api/mobile/english/essay/guided-composition', methods=['GET'])
@require_auth
def get_guided_composition():
    """Get guided composition prompt for ZIMSEC Paper 1 Section B"""
    try:
        english_service = EnglishService()
        result = english_service.generate_guided_composition_prompt()
        
        if not result or not result.get('success'):
            return jsonify({
                'success': False,
                'message': 'Failed to generate guided composition'
            }), 500
        
        return jsonify({
            'success': True,
            'data': result.get('prompt', {})
        }), 200
        
    except Exception as e:
        logger.error(f"Get guided composition error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

@mobile_bp.route('/api/mobile/english/essay/submit', methods=['POST'])
@require_auth
def submit_essay():
    """Submit essay for ZIMSEC-standard marking"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        essay_type = data.get('essay_type')  # 'free_response' or 'guided'
        student_name = data.get('student_name', '').strip()
        student_surname = data.get('student_surname', '').strip()
        essay_text = data.get('essay_text', '').strip()
        topic = data.get('topic', {})  # For free response
        prompt = data.get('prompt', {})  # For guided composition
        
        # Validation
        if not essay_type or essay_type not in ['free_response', 'guided']:
            return jsonify({'success': False, 'message': 'Invalid essay type'}), 400
        
        if not student_name or not student_surname:
            return jsonify({'success': False, 'message': 'Student name and surname are required'}), 400
        
        if not essay_text or len(essay_text) < 100:
            return jsonify({'success': False, 'message': 'Essay must be at least 100 characters'}), 400
        
        # Check credits (3 credits for essay marking)
        credit_cost = 3
        user_credits = get_user_credits(g.current_user_id) or 0
        if user_credits < credit_cost:
            return jsonify({
                'success': False,
                'message': f'Insufficient credits. Required: {credit_cost}, Available: {user_credits}'
            }), 400
        
        # Mark essay using appropriate method
        english_service = EnglishService()
        marking_result = None
        
        if essay_type == 'free_response':
            if not topic or not topic.get('title'):
                return jsonify({'success': False, 'message': 'Topic is required for free response'}), 400
            
            marking_result = english_service.mark_free_response_essay(
                student_name,
                student_surname,
                essay_text,
                topic
            )
        else:  # guided
            if not prompt or not prompt.get('title'):
                return jsonify({'success': False, 'message': 'Prompt is required for guided composition'}), 400
            
            marking_result = english_service.mark_guided_composition(
                student_name,
                student_surname,
                essay_text,
                prompt
            )
        
        if not marking_result or not marking_result.get('success'):
            return jsonify({
                'success': False,
                'message': 'Failed to mark essay'
            }), 500
        
        result_data = marking_result.get('result', {})
        
        # Generate PDF report
        pdf_base64 = english_service.generate_essay_pdf_report(
            student_name,
            student_surname,
            essay_type,
            result_data.get('score', 0),
            result_data.get('max_score', 30 if essay_type == 'free_response' else 20),
            result_data.get('corrections', []),
            result_data.get('teacher_comment', ''),
            result_data.get('corrected_essay', ''),
            result_data.get('detailed_feedback', ''),
            essay_text,
            topic.get('title', '') if essay_type == 'free_response' else prompt.get('title', '')
        )
        
        # Deduct credits
        deduct_credits(g.current_user_id, credit_cost, 'english_essay_marking', f'Marked {essay_type} essay')
        
        return jsonify({
            'success': True,
            'data': {
                'essay_type': essay_type,
                'score': result_data.get('score', 0),
                'max_score': result_data.get('max_score', 30 if essay_type == 'free_response' else 20),
                'breakdown': result_data.get('breakdown', {}),
                'corrections': result_data.get('corrections', []),
                'teacher_comment': result_data.get('teacher_comment', ''),
                'corrected_essay': result_data.get('corrected_essay', ''),
                'detailed_feedback': result_data.get('detailed_feedback', ''),
                'pdf_report': pdf_base64  # Base64-encoded PDF
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Submit essay error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500

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
                
            # Handle updated interactions if needed
            # Handle deleted interactions if needed
            
        return jsonify({
            'success': True,
            'message': 'Sync successful'
        }), 200
        
    except Exception as e:
        logger.error(f"Sync push error: {e}", exc_info=True)
        return jsonify({'success': False, 'message': 'Server error'}), 500
