import json
import logging
from flask import Blueprint, request, jsonify
from services.whatsapp_service import WhatsAppService
from services.user_service import UserService
from services.question_service import QuestionService
from services.payment_service import PaymentService
from services.image_service import ImageService
from services.graph_service import GraphService
from services.english_service import EnglishService
from services.referral_service import ReferralService
from services.audio_chat_service import AudioChatService
from utils.rate_limiter import RateLimiter
from utils.question_cache import QuestionCacheService  
from utils.latex_converter import LaTeXConverter
from utils.pdf_generator import PDFGenerator
from utils.session_manager import session_manager
from utils.credit_system import credit_system
from utils.validators import validators
from constants import TOPICS, MESSAGE_TEMPLATES

logger = logging.getLogger(__name__)

webhook_bp = Blueprint('webhook', __name__)

# Initialize services
whatsapp_service = WhatsAppService()
user_service = UserService()
question_service = QuestionService()
payment_service = PaymentService()
image_service = ImageService()
graph_service = GraphService()
english_service = EnglishService()
referral_service = ReferralService()
audio_chat_service = AudioChatService()

# Initialize utilities
rate_limiter = RateLimiter()
question_cache = QuestionCacheService()
latex_converter = LaTeXConverter()
pdf_generator = PDFGenerator()

@webhook_bp.route('/whatsapp', methods=['GET'])
def verify_webhook():
    """Verify WhatsApp webhook"""
    try:
        mode = request.args.get('hub.mode')
        token = request.args.get('hub.verify_token')
        challenge = request.args.get('hub.challenge')
        
        result = whatsapp_service.verify_webhook(mode or '', token or '', challenge or '')
        
        if result:
            return result
        else:
            return 'Verification failed', 403
            
    except Exception as e:
        logger.error(f"Webhook verification error: {e}")
        return 'Error', 500

@webhook_bp.route('/whatsapp', methods=['POST'])
def handle_webhook():
    """Handle incoming WhatsApp messages"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'status': 'no_data'}), 400
        
        # Parse message
        message = whatsapp_service.parse_webhook_message(data)
        
        if not message:
            return jsonify({'status': 'no_message'}), 200
        
        user_id = message['from']
        message_text = message['text']
        message_type = message['type']
        
        # Validate WhatsApp ID
        if not validators.validate_whatsapp_id(user_id):
            logger.warning(f"Invalid WhatsApp ID: {user_id}")
            return jsonify({'status': 'invalid_user_id'}), 400
        
        # Handle different message types
        if message_type == 'text':
            # Check rate limiting for text messages only
            if rate_limiter.check_session_rate_limit(user_id, 'text_message'):
                whatsapp_service.send_message(
                    user_id, 
                    f"⏳ Please wait before sending another message. You're being rate limited to prevent spam."
                )
                return jsonify({'status': 'rate_limited'}), 200
            handle_text_message(user_id, message_text)
        elif message_type == 'image':
            # Check rate limiting for image processing
            if rate_limiter.check_session_rate_limit(user_id, 'image_message'):
                whatsapp_service.send_message(
                    user_id, 
                    f"⏳ Please wait before sending another image. Processing takes time."
                )
                return jsonify({'status': 'rate_limited'}), 200
            handle_image_message(user_id, message['image'])
        elif message_type == 'interactive':
            # No rate limiting for menu navigation - handled internally for specific actions
            handle_interactive_message(user_id, message['interactive'])
        
        return jsonify({'status': 'success'}), 200
        
    except Exception as e:
        logger.error(f"Webhook handling error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

def handle_text_message(user_id: str, message_text: str):
    """Handle text messages from users"""
    try:
        # Sanitize input
        message_text = validators.sanitize_text_input(message_text)
        
        # Check if user is registered
        registration_status = user_service.check_user_registration(user_id)
        
        if not registration_status['is_registered']:
            if registration_status.get('registration_in_progress'):
                # Continue registration process
                handle_registration_flow(user_id, message_text)
            else:
                # Start registration
                handle_new_user(user_id, message_text)
            return
        
        # Handle registered user commands
        command = message_text.lower().strip()
        
        if command in ['hi', 'hello', 'start', 'menu']:
            send_main_menu(user_id)
        elif command == 'credits':
            show_credit_balance(user_id)
        elif command == 'stats':
            show_user_stats(user_id)
        elif command == 'help':
            send_help_message(user_id)
        elif command == 'buy credits':
            show_credit_packages(user_id)
        elif command == 'referral':
            show_referral_info(user_id)
        elif command.startswith('refer '):
            process_referral_code(user_id, command.replace('refer ', '').strip())
        elif command in ['audio chat', 'audio', 'chat']:
            audio_chat_service.handle_audio_chat_command(user_id)
        elif command == 'english':
            show_english_menu(user_id)
        elif command == 'essay':
            start_essay_session(user_id)
        elif command.startswith('graph '):
            handle_graph_request(user_id, command[6:])
        else:
            # Check if user is in a session
            handle_session_message(user_id, message_text)
        
    except Exception as e:
        logger.error(f"Error handling text message: {e}")
        whatsapp_service.send_message(user_id, "Sorry, an error occurred. Please try again.")

def handle_new_user(user_id: str, message_text: str):
    """Handle new user registration"""
    try:
        # Send welcome message and start registration
        welcome_msg = MESSAGE_TEMPLATES['welcome']
        welcome_msg += "\n\nLet's get you registered!\n\nPlease enter your first name:"
        
        whatsapp_service.send_message(user_id, welcome_msg)
        
        # Start registration process
        user_service.start_registration(user_id)
        
    except Exception as e:
        logger.error(f"Error handling new user: {e}")

def handle_registration_flow(user_id: str, user_input: str):
    """Handle user registration steps"""
    try:
        result = user_service.process_registration_step(user_id, user_input)
        
        if result['success']:
            if result.get('completed'):
                # Registration complete
                whatsapp_service.send_message(user_id, result['message'])
                send_main_menu(user_id)
            else:
                # Continue to next step
                whatsapp_service.send_message(user_id, result['message'])
        else:
            # Error in registration step
            whatsapp_service.send_message(user_id, result['message'])
            
    except Exception as e:
        logger.error(f"Error in registration flow: {e}")
        whatsapp_service.send_message(user_id, "Registration error. Please try again.")

def handle_session_message(user_id: str, message_text: str):
    """Handle messages when user is in an active session"""
    try:
        session_type = session_manager.get_session_type(user_id)
        
        if session_type == 'question':
            handle_question_answer(user_id, message_text)
        elif session_type == 'topic_selection':
            handle_topic_selection(user_id, message_text)
        elif session_type == 'payment':
            handle_payment_confirmation(user_id, message_text)
        elif session_type == 'audio_chat':
            handle_audio_chat_message(user_id, message_text)
        else:
            # No active session, show main menu
            send_main_menu(user_id)
            
    except Exception as e:
        logger.error(f"Error handling session message: {e}")

def handle_question_answer(user_id: str, answer: str):
    """Handle user's answer to a question"""
    try:
        # Get current question session
        question_session = session_manager.get_question_session(user_id)
        
        if not question_session:
            whatsapp_service.send_message(user_id, "No active question found. Use the menu to start a new question.")
            send_main_menu(user_id)
            return
        
        question_data = question_session['question_data']
        subject = question_session['subject']
        topic = question_session['topic']
        
        # Validate answer
        result = question_service.validate_answer(question_data, answer)
        
        if result['is_correct'] is None:
            # Essay question - cannot auto-grade
            whatsapp_service.send_message(user_id, result['feedback'])
        elif result['is_correct']:
            # Correct answer
            points = result['points_awarded']
            whatsapp_service.send_message(
                user_id, 
                f"✅ Correct! You earned {points} points.\n\n{result['explanation']}"
            )
            
            # Award bonus credits for correct answers
            bonus = credit_system.calculate_bonus_credits('question_correct', True)
            if bonus > 0:
                credit_system.award_bonus_credits(user_id, bonus, 'correct_answer_bonus')
                whatsapp_service.send_message(user_id, f"🎁 Bonus: +{bonus} credits for correct answer!")
        else:
            # Incorrect answer
            whatsapp_service.send_message(
                user_id,
                f"❌ Incorrect. The correct answer is: {result['correct_answer']}\n\n{result['explanation']}"
            )
        
        # Update user stats
        from database.external_db import update_user_stats
        update_user_stats(
            user_id, subject, topic, question_data.get('difficulty', 'medium'),
            result['is_correct'] or False, result['points_awarded']
        )
        
        # Clear question session
        session_manager.clear_question_session(user_id)
        
        # Show main menu
        send_main_menu(user_id)
        
    except Exception as e:
        logger.error(f"Error handling question answer: {e}")
        whatsapp_service.send_message(user_id, "Error processing your answer. Please try again.")

def handle_image_message(user_id: str, image_data: dict):
    """Handle image messages for math problem solving"""
    try:
        # Check if user is in audio chat mode
        session_data = session_manager.get_session_data(user_id)
        if session_data and session_data.get('mode') == 'audio_chat':
            # Handle image in audio chat mode
            handle_audio_chat_image(user_id, image_data)
            return
        
        # Check if user has sufficient credits
        credit_check = credit_system.check_sufficient_credits(user_id, 'image_solve')
        
        if not credit_check['sufficient']:
            shortage = credit_check['shortage']
            whatsapp_service.send_message(
                user_id,
                f"❌ Insufficient credits. You need {shortage} more credits for image solving."
            )
            show_credit_packages(user_id)
            return
        
        # Check rate limiting for image processing
        if rate_limiter.check_active_generation(user_id, 'image_solve'):
            whatsapp_service.send_message(
                user_id,
                "🔄 Image processing already in progress. Please wait..."
            )
            return
        
        whatsapp_service.send_message(user_id, "🔍 Processing your image... This may take a moment.")
        
        # Process the image
        result = image_service.process_whatsapp_image(image_data)
        
        if result and result.get('success'):
            # Deduct credits
            credit_system.deduct_credits_for_action(user_id, 'image_solve')
            
            solution = result.get('solution', {})
            response = f"📸 **Image Math Solution**\n\n"
            response += f"**Problem:** {solution.get('problem_identified', 'Unknown')}\n\n"
            response += f"**Solution:**\n{solution.get('solution_steps', 'No steps available')}\n\n"
            response += f"**Answer:** {solution.get('final_answer', 'No answer')}\n\n"
            
            if solution.get('notes'):
                response += f"**Notes:** {solution['notes']}\n"
            
            response += f"💰 Cost: {credit_system.get_credit_cost('image_solve')} credits"
            
            whatsapp_service.send_message(user_id, response)
        else:
            message = result.get('message', 'Error processing image') if result else 'Error processing image'
            whatsapp_service.send_message(user_id, message)
        
        # Clear active generation
        rate_limiter.clear_active_generation(user_id, 'image_solve')
        
    except Exception as e:
        logger.error(f"Error handling image message: {e}")
        whatsapp_service.send_message(user_id, "Error processing image. Please try again.")
        rate_limiter.clear_active_generation(user_id, 'image_solve')

def handle_audio_chat_image(user_id: str, image_data: dict):
    """Handle image messages in audio chat mode"""
    try:
        # Download image first
        image_path = whatsapp_service.download_whatsapp_media(
            image_data.get('id'), 
            image_data.get('mime_type', 'image/jpeg')
        )
        
        if image_path:
            # Process through audio chat service
            audio_chat_service.handle_audio_input(user_id, file_path=image_path, file_type='image')
        else:
            whatsapp_service.send_message(user_id, "❌ Could not download image. Please try again.")
            
    except Exception as e:
        logger.error(f"Error handling audio chat image: {e}")
        whatsapp_service.send_message(user_id, "❌ Error processing your image. Please try again.")

def send_main_menu(user_id: str, user_name: str = None):
    """Send main menu to user - matches backup structure exactly"""
    try:
        # Get user registration data for personalization
        from database.external_db import get_user_registration, get_user_credits, get_or_create_user_stats
        
        if not user_name:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else None

        user_stats = get_or_create_user_stats(user_id)
        current_credits = get_user_credits(user_id)

        # Professional welcome message with clear structure and spacing
        welcome_text = ""
        
        # Personalized greeting section
        if user_name:
            welcome_text += f"🎓 *Welcome back, {user_name}!* 🎓\n"
            welcome_text += f"═══════════════════\n\n"
            welcome_text += f"*Hi {user_name}, I'm NerdX - Your Personal ZIMSEC Tutor*\n\n"
            
            # Add personalized motivational message based on stats
            total_attempts = user_stats.get('total_attempts', 0)
            if total_attempts == 0:
                welcome_text += f"🌟 *Ready to start your learning journey? Let's make it amazing!*\n\n"
            elif total_attempts < 10:
                welcome_text += f"🚀 *Great to see you building excellent study habits!*\n\n"
            elif total_attempts < 50:
                welcome_text += f"⭐ *Impressive progress! You're becoming a ZIMSEC champion!*\n\n"
            else:
                welcome_text += f"🏆 *Amazing dedication! Your commitment to excellence shows!*\n\n"
        else:
            welcome_text += "🎓 *NerdX ZIMSEC Learning Bot* 🎓\n"
            welcome_text += "═══════════════════\n\n"
            welcome_text += "🌟 *Your Personalized ZIMSEC Study Companion*\n\n"

        # Features section with clear structure
        welcome_text += "✨ *AVAILABLE SUBJECTS*\n"
        welcome_text += "━━━━━━━━━━━━━━━━━\n"
        welcome_text += "🧬 *Biology*     ⚗️ *Chemistry*\n"
        welcome_text += "⚡ *Physics*     📰 *Mathematics*\n"
        welcome_text += "📝 *English*     🎤 *Audio Chat*\n\n"
        
        welcome_text += "🤖 *SMART FEATURES*\n"
        welcome_text += "━━━━━━━━━━━━━━━━━\n"
        welcome_text += "• AI-Generated Questions\n"
        welcome_text += "• Progress Tracking\n"
        welcome_text += "• Step-by-Step Solutions\n"
        welcome_text += "• Achievement System\n\n"
        
        # User stats section with clear formatting
        level = user_stats.get('level', 1)
        xp_points = user_stats.get('xp_points', 0)
        correct_answers = user_stats.get('correct_answers', 0)
        total_attempts = user_stats.get('total_attempts', 0)
        success_rate = (correct_answers/max(total_attempts,1)*100) if total_attempts > 0 else 0
        
        if user_name:
            welcome_text += f"📊 *{user_name}'s ACADEMIC PROFILE*\n"
        else:
            welcome_text += "📊 *YOUR ACADEMIC PROFILE*\n"
        welcome_text += "━━━━━━━━━━━━━━━━━━━━━\n"
        welcome_text += f"🎯 *Level:* {level}          ⭐ *XP:* {xp_points}\n"
        welcome_text += f"💳 *Credits:* {current_credits}       📚 *Questions:* {total_attempts}\n"
        welcome_text += f"✅ *Success Rate:* {success_rate:.1f}%\n\n"
        
        # Call to action section
        welcome_text += "🎁 *BONUS OPPORTUNITY*\n"
        welcome_text += "━━━━━━━━━━━━━━━━━\n"
        welcome_text += "*Share NerdX with friends*\n"
        welcome_text += "*Get 50 FREE CREDITS each!*\n\n"
        
        welcome_text += "👇 *Choose an option below to get started:*"

        # Send first 3 main buttons
        if current_credits < 20:  # Low credits - emphasize buying
            main_buttons = [
                {"text": "🎯 Start Quiz", "callback_data": "start_quiz"},
                {"text": "💎 Buy Credits", "callback_data": "buy_credits"},
                {"text": "🎤 Audio Chat", "callback_data": "audio_chat_menu"}
            ]
        else:  # Normal credit level
            main_buttons = [
                {"text": "🎯 Start Quiz", "callback_data": "start_quiz"},
                {"text": "🎤 Audio Chat", "callback_data": "audio_chat_menu"},
                {"text": "💎 Buy Credits", "callback_data": "buy_credits"}
            ]

        whatsapp_service.send_interactive_message(user_id, welcome_text, main_buttons)
        
        # Send additional buttons separately
        additional_buttons = [
            {"text": "📤 Share to Friend", "callback_data": "share_to_friend"},
            {"text": "👥 Referrals", "callback_data": "referrals_menu"}
        ]
        
        whatsapp_service.send_interactive_message(user_id, "💎 *More Options:*", additional_buttons)
        
    except Exception as e:
        logger.error(f"Error sending main menu: {e}")
        whatsapp_service.send_message(user_id, "Error loading menu. Please try again.")

def handle_interactive_message(user_id: str, interactive_data: dict):
    """Handle interactive button/list responses"""
    try:
        button_reply = interactive_data.get('button_reply', {})
        list_reply = interactive_data.get('list_reply', {})
        
        selection_id = button_reply.get('id') or list_reply.get('id')
        
        if not selection_id:
            return
        
        # Define actions that need rate limiting (content generation/expensive operations)
        rate_limited_actions = [
            'science_',  # Topic selection that generates questions
            'generate_',  # Question generation
            'package_',  # Payment processing
        ]
        
        # Check if this action needs rate limiting
        needs_rate_limit = any(selection_id.startswith(action) for action in rate_limited_actions)
        
        if needs_rate_limit and rate_limiter.check_session_rate_limit(user_id, f"action_{selection_id}"):
            whatsapp_service.send_message(user_id, "⏳ Please wait before performing this action again.")
            return
        
        if selection_id.startswith('subject_'):
            subject = selection_id.replace('subject_', '').title()
            handle_subject_selection(user_id, subject)
        elif selection_id.startswith('topic_'):
            topic = selection_id.replace('topic_', '')
            handle_topic_selection_from_button(user_id, topic)
        elif selection_id.startswith('difficulty_'):
            difficulty = selection_id.replace('difficulty_', '')
            handle_difficulty_selection(user_id, difficulty)
        elif selection_id == 'start_quiz':
            handle_quiz_menu(user_id)
        elif selection_id == 'audio_chat_menu':
            audio_chat_service.handle_audio_chat_command(user_id)
        elif selection_id == 'audio_female_voice':
            audio_chat_service.handle_voice_selection(user_id, 'female')
        elif selection_id == 'audio_male_voice':
            audio_chat_service.handle_voice_selection(user_id, 'male')
        elif selection_id == 'buy_credits':
            show_credit_packages(user_id)
        elif selection_id == 'share_to_friend':
            handle_share_to_friend(user_id)
        elif selection_id == 'referrals_menu':
            show_referral_info(user_id)
        elif selection_id == 'level_ordinary':
            handle_level_menu(user_id, 'ordinary')
        elif selection_id == 'level_advanced':
            handle_level_menu(user_id, 'advanced')
        elif selection_id == 'main_menu' or selection_id == 'back_to_menu':
            send_main_menu(user_id)
        elif selection_id.startswith('subject_ordinary_'):
            subject = selection_id.replace('subject_ordinary_', '').replace('_', ' ').title()
            if subject == 'Combined Science':
                handle_combined_science_menu(user_id)
            elif subject == 'Mathematics':
                handle_mathematics_menu(user_id)
            elif subject == 'English':
                handle_english_menu(user_id)
        elif selection_id == 'subject_ordinary_combined_science':
            handle_combined_science_menu(user_id)
        elif selection_id == 'subject_ordinary_mathematics':
            handle_mathematics_menu(user_id)
        elif selection_id == 'subject_ordinary_english':
            handle_english_menu(user_id)
        # Add handlers for the Combined Science buttons
        elif selection_id.startswith('science_'):
            subject = selection_id.replace('science_', '')
            # Handle Combined Science topic selection
            try:
                from modules.combined_science_handlers import handle_topic_selection
                handle_topic_selection(user_id, whatsapp_service, subject)
            except ImportError:
                # Fallback if module doesn't exist
                whatsapp_service.send_message(user_id, f"🧬 {subject} questions coming soon!")
        elif selection_id == 'combined_exam':
            # Handle combined exam
            whatsapp_service.send_message(user_id, "🌟 Combined Exam feature coming soon!")
        elif selection_id.startswith('math_'):
            # Handle math menu selections
            math_action = selection_id.replace('math_', '')
            if math_action == 'practice':
                # Handle math practice
                whatsapp_service.send_message(user_id, "📚 Math practice feature coming soon!")
            elif math_action == 'graphing':
                # Handle math graphing
                whatsapp_service.send_message(user_id, "📈 Math graphing feature coming soon!")
        elif selection_id.startswith('english_'):
            # Handle english menu selections
            english_action = selection_id.replace('english_', '')
            whatsapp_service.send_message(user_id, f"📝 {english_action.title()} feature coming soon!")
        elif selection_id == 'upload_math_image':
            whatsapp_service.send_message(user_id, "📷 Please send an image of your math problem to solve it!")
        elif selection_id == 'stats':
            show_user_stats(user_id)
        elif selection_id.startswith('package_'):
            handle_credit_package_selection(user_id, selection_id)
        
    except Exception as e:
        logger.error(f"Error handling interactive message: {e}")

def handle_subject_selection(user_id: str, subject: str):
    """Handle subject selection"""
    try:
        if subject not in TOPICS:
            whatsapp_service.send_message(user_id, "Invalid subject selection.")
            send_main_menu(user_id)
            return
        
        # Send difficulty selection
        message = f"📚 You selected **{subject}**\n\nChoose difficulty level:"
        
        buttons = [
            {'id': f'difficulty_easy_{subject}', 'title': '🟢 Easy'},
            {'id': f'difficulty_medium_{subject}', 'title': '🟡 Medium'},
            {'id': f'difficulty_difficult_{subject}', 'title': '🔴 Difficult'}
        ]
        
        whatsapp_service.send_interactive_message(user_id, message, buttons)
        
    except Exception as e:
        logger.error(f"Error handling subject selection: {e}")

def handle_difficulty_selection(user_id: str, difficulty_subject: str):
    """Handle difficulty selection"""
    try:
        parts = difficulty_subject.split('_')
        if len(parts) < 2:
            return
        
        difficulty = parts[0]
        subject = '_'.join(parts[1:])
        
        # Send topic selection
        message = f"📚 **{subject}** - {difficulty.title()}\n\nChoose a topic:"
        
        topics = TOPICS.get(subject, [])
        if not topics:
            whatsapp_service.send_message(user_id, "No topics available for this subject.")
            send_main_menu(user_id)
            return
        
        # Create topic list
        sections = [{
            'title': f'{subject} Topics',
            'rows': [
                {
                    'id': f'generate_{subject}_{topic}_{difficulty}',
                    'title': topic[:24],  # WhatsApp title limit
                    'description': f'{difficulty.title()} level'
                }
                for topic in topics
            ]
        }]
        
        whatsapp_service.send_list_message(user_id, f"{subject} - {difficulty.title()}", message, sections)
        
    except Exception as e:
        logger.error(f"Error handling difficulty selection: {e}")

@webhook_bp.route('/payment/callback', methods=['POST'])
def payment_callback():
    """Handle payment callbacks"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'status': 'no_data'}), 400
        
        # Process payment callback
        success = payment_service.process_payment_callback(data)
        
        if success:
            # Notify user of successful payment
            user_id = data.get('user_id')
            if user_id:
                whatsapp_service.send_message(
                    user_id,
                    "✅ Payment successful! Credits have been added to your account."
                )
            
            return jsonify({'status': 'success'}), 200
        else:
            return jsonify({'status': 'failed'}), 400
        
    except Exception as e:
        logger.error(f"Payment callback error: {e}")
        return jsonify({'status': 'error'}), 500

def show_credit_balance(user_id: str):
    """Show user's credit balance"""
    try:
        message = credit_system.format_credit_balance_message(user_id)
        whatsapp_service.send_message(user_id, message)
    except Exception as e:
        logger.error(f"Error showing credit balance: {e}")

def show_user_stats(user_id: str):
    """Show user statistics"""
    try:
        stats = user_service.get_user_stats_summary(user_id)
        
        if stats['success']:
            data = stats['stats']
            message = f"📊 **Your Statistics**\n\n"
            message += f"💳 Credits: {data['credits']}\n"
            message += f"🏆 Total Points: {data['total_points']}\n"
            message += f"🔥 Current Streak: {data['streak_count']} days\n"
            message += f"📝 Questions Answered: {data['questions_answered']}\n"
            message += f"✅ Accuracy: {data['accuracy']}%\n"
            message += f"🎯 Level: {data['level']['name']}\n"
            
            if data['level']['next_threshold']:
                progress = data['level']['progress_percent']
                message += f"📈 Progress: {progress}%"
            
            whatsapp_service.send_message(user_id, message)
        else:
            whatsapp_service.send_message(user_id, "Unable to retrieve statistics.")
    except Exception as e:
        logger.error(f"Error showing user stats: {e}")

def show_credit_packages(user_id: str):
    """Show available credit packages"""
    try:
        packages = credit_system.get_credit_packages()
        
        message = "💰 **Credit Packages**\n\n"
        for pkg in packages:
            message += f"💎 {pkg['credits']} credits - ${pkg['amount']}\n"
            message += f"   {pkg['description']}\n"
            if pkg.get('savings'):
                message += f"   💚 Save {pkg['savings']}!\n"
            message += "\n"
        
        message += "Select a package to purchase:"
        
        # Create package buttons
        buttons = []
        for i, pkg in enumerate(packages[:3]):  # Limit to 3 for buttons
            buttons.append({
                'id': f'package_{i}',
                'title': f'{pkg["credits"]} - ${pkg["amount"]}'
            })
        
        whatsapp_service.send_interactive_message(user_id, message, buttons)
        
    except Exception as e:
        logger.error(f"Error showing credit packages: {e}")

def send_help_message(user_id: str):
    """Send help message"""
    help_text = """
🎓 **NerdX Quiz Bot Help**

**Commands:**
• `menu` - Show main menu
• `credits` - Check credit balance  
• `stats` - View your statistics
• `help` - Show this help message
• `buy credits` - Purchase credits

**Features:**
📚 Study ZIMSEC subjects (Biology, Chemistry, Physics, Math, English)
🤖 AI-generated questions
📸 Solve math problems from images
📊 Track your progress
🎯 Earn points and maintain streaks

**Credit Costs:**
• Easy questions: 5-10 credits
• Medium questions: 10-20 credits  
• Hard questions: 15-50 credits
• Image solving: 15 credits

Need more help? Contact support!
"""
    whatsapp_service.send_message(user_id, help_text)

def handle_graph_request(user_id: str, function_text: str):
    """Handle graph generation requests"""
    try:
        # Check credits
        if not credit_system.can_use_feature(user_id, "graph"):
            whatsapp_service.send_message(user_id, "❌ Insufficient credits for graph generation.")
            return
        
        # Generate graph using graph service
        result = graph_service.generate_function_graph(function_text)
        
        if result and result.get('success'):
            # Deduct credits
            credit_system.deduct_credits(user_id, "graph")
            
            # Send graph image
            image_path = result.get('image_path', '')
            whatsapp_service.send_image(user_id, image_path, f"Graph for: {function_text}")
        else:
            whatsapp_service.send_message(user_id, "❌ Could not generate graph. Please check your function syntax.")
            
    except Exception as e:
        logger.error(f"Error handling graph request: {e}")
        whatsapp_service.send_message(user_id, "❌ Error generating graph.")

def handle_topic_selection(user_id: str, subject: str):
    """Handle topic selection for a subject"""
    try:
        topics = TOPICS.get(subject, [])
        if not topics:
            whatsapp_service.send_message(user_id, "❌ No topics available for this subject.")
            return
        
        buttons = []
        for topic in topics:
            buttons.append({
                'id': f'topic_{subject}_{topic}',
                'title': topic
            })
        
        message = f"📚 Select a topic for {subject.title()}:"
        whatsapp_service.send_interactive_message(user_id, message, buttons)
        
    except Exception as e:
        logger.error(f"Error handling topic selection: {e}")

def handle_payment_confirmation(user_id: str, package_data: str):
    """Handle payment confirmation"""
    try:
        # Process payment for selected package
        whatsapp_service.send_message(user_id, "💳 Processing your payment... You'll receive confirmation shortly.")
        
    except Exception as e:
        logger.error(f"Error handling payment confirmation: {e}")

def handle_topic_selection_from_button(user_id: str, button_id: str):
    """Handle topic selection from interactive button"""
    try:
        # Parse button_id: format is "topic_subject_topicname"
        parts = button_id.split('_', 2)
        if len(parts) >= 3:
            subject = parts[1]
            topic = parts[2]
            
            # Start question session
            session_manager.start_question_session(user_id, subject, topic)
            whatsapp_service.send_message(user_id, f"📖 Starting {subject.title()} - {topic} questions!")
        
    except Exception as e:
        logger.error(f"Error handling topic selection from button: {e}")

def handle_quiz_menu(user_id: str):
    """Show the education level selection menu - matches backup exactly"""
    text = "🎓 *Choose your education level:*"

    buttons = [
        {"text": "📚 Ordinary Level", "callback_data": "level_ordinary"},
        {"text": "🎯 Advanced Level", "callback_data": "level_advanced"},
        {"text": "🔙 Back to Menu", "callback_data": "main_menu"}
    ]

    whatsapp_service.send_interactive_message(user_id, text, buttons)

def handle_level_menu(user_id: str, level: str):
    """Show subject selection menu for education level - matches backup exactly"""
    if level == "ordinary":
        text = "📚 *Ordinary Level Subjects:*\nSelect a subject:"
        buttons = [
            {"text": "🧬 Combined Science", "callback_data": "subject_ordinary_combined_science"},
            {"text": "📐 Mathematics", "callback_data": "subject_ordinary_mathematics"},
            {"text": "📝 English", "callback_data": "subject_ordinary_english"},
            {"text": "🔙 Back", "callback_data": "start_quiz"}
        ]
    elif level == "advanced":
        text = "🎯 *Advanced Level Subjects:*\nSelect a subject:"
        buttons = [
            {"text": "📐 Mathematics", "callback_data": "subject_advanced_mathematics"},
            {"text": "⚗️ Chemistry", "callback_data": "subject_advanced_chemistry"},
            {"text": "⚡ Physics", "callback_data": "subject_advanced_physics"},
            {"text": "🧬 Biology", "callback_data": "subject_advanced_biology"},
            {"text": "🔙 Back", "callback_data": "start_quiz"}
        ]
    else:
        whatsapp_service.send_message(user_id, "❌ Invalid education level.")
        return
        
    whatsapp_service.send_interactive_message(user_id, text, buttons)

def handle_share_to_friend(user_id: str):
    """Handle share to friend button - matches backup exactly"""
    try:
        from database.external_db import get_user_registration
        
        registration = get_user_registration(user_id)
        if not registration:
            whatsapp_service.send_message(user_id, "❌ Registration not found. Please try again.")
            return
            
        nerdx_id = registration.get('nerdx_id', 'N00000')
        name = registration.get('name', 'Student')
        
        share_message = f"📤 *Share NerdX with Friends!*\n\n"
        share_message += f"Hey {name}! 👋\n\n"
        share_message += f"💎 Earn *50 FREE CREDITS* for every friend who registers using your ID!\n\n"
        share_message += f"🎯 *Your Referral ID:* `{nerdx_id}`\n\n"
        share_message += f"📲 *Share this message:*\n\n"
        share_message += f"---\n"
        share_message += f"🎓 Join NerdX - The #1 ZIMSEC Quiz Bot!\n\n"
        share_message += f"🧬 Study Biology, Chemistry & Physics\n"
        share_message += f"🤖 AI-powered questions\n"
        share_message += f"📊 Track your progress\n\n"
        share_message += f"💎 Register with ID: {nerdx_id} and get bonus credits!\n\n"
        share_message += f"Start here: https://wa.me/+263784257773?text=Hello%20NerdX%20ID:%20{nerdx_id}\n"
        share_message += f"---"
        
        buttons = [
            {"text": "👥 View Referrals", "callback_data": "referrals_menu"},
            {"text": "🏠 Main Menu", "callback_data": "main_menu"}
        ]
        
        whatsapp_service.send_interactive_message(user_id, share_message, buttons)
        
    except Exception as e:
        logger.error(f"Error in handle_share_to_friend: {e}")
        whatsapp_service.send_message(user_id, "❌ Error sharing referral link.")

def show_referral_info(user_id: str):
    """Show referral information and stats - matches backup exactly"""
    try:
        from database.external_db import get_user_registration, get_referral_stats
        
        registration = get_user_registration(user_id)
        if not registration:
            whatsapp_service.send_message(user_id, "❌ Registration not found.")
            return
            
        nerdx_id = registration.get('nerdx_id', 'N00000')
        name = registration.get('name', 'Student')
        
        # Get referral stats using nerdx_id (not chat_id)
        referral_stats = get_referral_stats(nerdx_id)
        total_referrals = referral_stats.get('total_referrals', 0)
        total_earned = referral_stats.get('total_credits_earned', 0)
        
        referral_message = f"👥 *{name}'s Referral Center* 👥\n\n"
        referral_message += f"🎯 *Your Referral ID:* `{nerdx_id}`\n\n"
        referral_message += f"📊 *Referral Stats:*\n"
        referral_message += f"• Friends Referred: {total_referrals}\n"
        referral_message += f"• Credits Earned: {total_earned}\n\n"
        referral_message += f"💎 *Earn 50 credits* for each friend who registers!\n\n"
        referral_message += f"📲 Share your ID with friends so they can get bonus credits too!"
        
        buttons = [
            {"text": "📤 Share to Friend", "callback_data": "share_to_friend"},
            {"text": "🏠 Main Menu", "callback_data": "main_menu"}
        ]
        
        whatsapp_service.send_interactive_message(user_id, referral_message, buttons)
        
    except Exception as e:
        logger.error(f"Error showing referral info: {e}")
        whatsapp_service.send_message(user_id, "❌ Error loading referral information.")

def handle_combined_science_menu(user_id: str):
    """Show Combined Science subject menu - matches backup exactly"""
    try:
        from database.external_db import get_user_registration, get_user_credits
        
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"
        credits = get_user_credits(user_id)
        
        text = "🧬 *Combined Science Subjects:*\nSelect a science subject:"

        buttons = [
            {"text": "🧬 Biology", "callback_data": "science_Biology"},
            {"text": "⚗️ Chemistry", "callback_data": "science_Chemistry"},
            {"text": "⚡ Physics", "callback_data": "science_Physics"},
            {"text": "🌟 Combined Exam", "callback_data": "combined_exam"},
            {"text": "🔙 Back", "callback_data": "level_ordinary"}
        ]
        
        whatsapp_service.send_interactive_message(user_id, text, buttons)
        
    except Exception as e:
        logger.error(f"Error in handle_combined_science_menu: {e}")
        whatsapp_service.send_message(user_id, "❌ Error loading Combined Science menu.")

def handle_mathematics_menu(user_id: str):
    """Show Mathematics menu - matches backup exactly"""
    try:
        from database.external_db import get_user_registration, get_user_credits, get_user_stats
        
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"
        current_credits = get_user_credits(user_id)
        user_stats = get_user_stats(user_id) or {'level': 1, 'xp_points': 0, 'streak_days': 0}
        current_level = user_stats.get('level', 1)
        current_xp = user_stats.get('xp_points', 0)
        current_streak = user_stats.get('streak_days', 0)
        
        # Calculate XP needed for next level
        xp_for_next_level = (current_level * 100) - current_xp
        if xp_for_next_level <= 0:
            xp_for_next_level = 100  # Base XP for next level
        
        text = f"📐 *Hey {user_name}! Welcome to MathMentor* 📐\n\n"
        text += f"🎓 *{user_name}, I'm your personal O-Level Mathematics tutor!*\n\n"
        
        # Enhanced user stats display
        text += f"📊 **Your Math Journey:**\n"
        text += f"💳 Credits: **{current_credits}**\n"
        text += f"⭐ Level: **{current_level}** (XP: {current_xp})\n"
        text += f"🔥 Streak: **{current_streak} days**\n"
        text += f"🎯 Next Level: **{xp_for_next_level} XP needed**\n\n"
        
        text += f"I'm here to help you master math, {user_name}, with:\n\n"
        text += f"📚 **Practice Questions:** Earn 5-10 XP per question\n"
        text += f"📷 **Image Math Solver:** Earn 30 XP per solution\n"
        text += f"📈 **Graph Generation:** Earn 25 XP per graph\n"
        text += f"📊 **Sample Graphs:** Earn 15 XP for learning\n"
        text += f"🔥 **Daily Streaks:** Maintain consistent learning\n\n"
        
        text += f"🚀 *{user_name}, choose how you'd like to earn XP and level up:*"

        buttons = [
            {"text": "📚 Practice Questions", "callback_data": "math_practice"},
            {"text": "📷 Image Math Solver", "callback_data": "upload_math_image"},
            {"text": "📈 Graph Practice", "callback_data": "math_graphing"},
            {"text": "📊 My Progress", "callback_data": "stats"},
            {"text": "🔙 Back", "callback_data": "level_ordinary"}
        ]
        
        whatsapp_service.send_interactive_message(user_id, text, buttons)
        
    except Exception as e:
        logger.error(f"Error in handle_mathematics_menu: {e}")
        whatsapp_service.send_message(user_id, "❌ Error loading Mathematics menu.")

def handle_english_menu(user_id: str):
    """Show English menu - matches backup exactly"""
    try:
        from database.external_db import get_user_registration, get_user_credits
        
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"
        current_credits = get_user_credits(user_id)
        
        text = f"📝 *Welcome to NerdX English Excellence Program* 📝\n\n"
        text += f"👋 *Hello {user_name}!* I'm your personal English Language tutor for ZIMSEC O-Level!\n\n"
        text += f"💳 *Your Credits:* {current_credits}\n\n"
        text += f"🎯 *What I can help you master:*\n"
        text += f"📚 **Comprehension:** Reading skills & text analysis\n"
        text += f"✍️ **Essay Writing:** All essay types with AI feedback\n"
        text += f"📝 **Grammar:** Rules, exercises & practice\n"
        text += f"🎤 **Audio Lessons:** Listen and learn effectively\n\n"
        text += f"⭐ *Earn XP and level up* with every practice session!\n\n"
        text += f"🚀 *{user_name}, choose your English learning path:*"

        buttons = [
            {"text": "📚 Comprehension Practice", "callback_data": "english_comprehension"},
            {"text": "✍️ Essay Writing", "callback_data": "english_essay_writing"},
            {"text": "📝 Grammar & Language", "callback_data": "english_grammar"},
            {"text": "🎤 Audio English Lessons", "callback_data": "english_audio_lessons"},
            {"text": "🔙 Back to Subjects", "callback_data": "level_ordinary"}
        ]
        
        whatsapp_service.send_interactive_message(user_id, text, buttons)
        
    except Exception as e:
        logger.error(f"Error in handle_english_menu: {e}")
        whatsapp_service.send_message(user_id, "❌ Error loading English menu.")

def handle_audio_chat_message(user_id: str, message_text: str):
    """Handle messages in audio chat mode"""
    try:
        # Handle audio chat input using the audio chat service
        audio_chat_service.handle_audio_input(user_id, message_text=message_text)
        
    except Exception as e:
        logger.error(f"Error handling audio chat message: {e}")
        whatsapp_service.send_message(user_id, "❌ Error processing your message. Please try again or type 'menu' to return.")

def handle_credit_package_selection(user_id: str, package_id: str):
    """Handle credit package selection"""
    try:
        packages = payment_service.calculate_credit_packages()
        selected_package = None
        
        for pkg in packages:
            if package_id == str(pkg['credits']):
                selected_package = pkg
                break
        
        if selected_package:
            # Initiate payment process
            whatsapp_service.send_message(
                user_id, 
                f"💰 Selected: {selected_package['description']}\n"
                f"Amount: ${selected_package['amount']}\n\n"
                "Please reply with your EcoCash number to proceed."
            )
        
    except Exception as e:
        logger.error(f"Error handling credit package selection: {e}")
