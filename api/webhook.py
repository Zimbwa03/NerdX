import logging
import json
import time
import threading
import os
from typing import Dict, Optional
from collections import defaultdict
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
from services.mathematics_service import MathematicsService
from services.math_question_generator import MathQuestionGenerator
from services.math_solver import MathSolver
from handlers.mathematics_handler import MathematicsHandler
from utils.rate_limiter import RateLimiter
from utils.question_cache import QuestionCacheService
from utils.latex_converter import LaTeXConverter
from utils.pdf_generator import PDFGenerator
from utils.session_manager import session_manager
from utils.credit_system import credit_system
from utils.validators import validators
from constants import TOPICS, MESSAGE_TEMPLATES, DIFFICULTY_LEVELS
from database.external_db import get_user_registration, get_user_stats, get_user_credits, deduct_credits
from services.advanced_credit_service import advanced_credit_service
from services.analytics_tracker import analytics_tracker
from config import Config
from datetime import datetime
import uuid
import re

logger = logging.getLogger(__name__)

webhook_bp = Blueprint('webhook', __name__)

def require_registration(func):
    """Security decorator: Ensure user is registered before accessing any bot feature"""
    def wrapper(user_id: str, *args, **kwargs):
        try:
            from database.external_db import get_user_registration
            user_registration = get_user_registration(user_id)

            if not user_registration:
                logger.warning(f"🚨 SECURITY BLOCK: Unregistered user {user_id} tried to access {func.__name__}")
                whatsapp_service.send_message(user_id, 
                    "🔒 **Access Denied - Registration Required**\n\n"
                    "You must complete registration before using NerdX Bot.\n\n"
                    "Please provide your first name:")
                user_service.start_registration(user_id)
                return None

            # User is registered, proceed with function
            return func(user_id, *args, **kwargs)

        except Exception as e:
            logger.error(f"Error in registration check for {func.__name__}: {e}")
            whatsapp_service.send_message(user_id, 
                "🔒 **System Security Error**\n\n"
                "Unable to verify registration status. Please try again.")
            return None

    return wrapper

# Message deduplication and rate limiting
processed_messages = {}  # In production, use Redis or database
user_last_message_time = defaultdict(float)
message_processing_lock = threading.Lock()

# Maintenance mode check
MAINTENANCE_MODE = os.getenv('MAINTENANCE_MODE', 'false').lower() == 'true'

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

# Initialize mathematics services
mathematics_service = MathematicsService()
math_question_generator = MathQuestionGenerator()
math_solver = MathSolver()
mathematics_handler = MathematicsHandler(whatsapp_service, mathematics_service, math_question_generator, math_solver)

# Initialize exam mathematics handler
from handlers.exam_mathematics_handler import ExamMathematicsHandler
exam_mathematics_handler = ExamMathematicsHandler(whatsapp_service, mathematics_service, math_question_generator)

# Initialize graph practice handler
from handlers.graph_practice_handler import GraphPracticeHandler
graph_practice_handler = GraphPracticeHandler(whatsapp_service, graph_service, math_question_generator)

# Initialize comprehensive English handler
from handlers.english_handler import EnglishHandler
english_handler = EnglishHandler(whatsapp_service, english_service)

# Initialize utilities
rate_limiter = RateLimiter()
question_cache = QuestionCacheService()
latex_converter = LaTeXConverter()
pdf_generator = PDFGenerator()

def cleanup_processed_messages():
    """Clean up old processed messages every hour"""
    while True:
        try:
            with message_processing_lock:
                current_time = time.time()
                # Remove messages older than 1 hour
                old_messages = [mid for mid, timestamp in processed_messages.items() 
                              if current_time - timestamp > 3600]

                for mid in old_messages:
                    del processed_messages[mid]

                logger.info(f"Cleaned up {len(old_messages)} old message IDs")

        except Exception as e:
            logger.error(f"Cleanup error: {e}")

        time.sleep(3600)  # Run every hour

def process_message_background(message_data, user_id, message_type):
    """Process message in background thread to prevent webhook timeouts"""
    try:
        logger.info(f"Background processing {message_type} message from {user_id}")

        if message_type == 'text':
            # Check rate limiting for text messages
            if rate_limiter.check_session_rate_limit(user_id, 'text_message'):
                remaining_time = rate_limiter.get_remaining_cooldown(user_id, 'text_message')
                if remaining_time > 0:
                    whatsapp_service.send_message(
                        user_id,
                        f"⏳ Please wait {remaining_time} seconds before sending another message. This helps prevent spam and ensures smooth operation."
                    )
                else:
                    whatsapp_service.send_message(
                        user_id,
                        "⏳ Please wait a moment before sending another message. This helps prevent spam and ensures smooth operation."
                    )
                return

            # Extract text content with better debugging and multiple fallbacks
            text_content = message_data.get('text', {})
            actual_text = ''

            if isinstance(text_content, dict):
                # WhatsApp v2 API structure - try multiple possible field names
                actual_text = (text_content.get('body') or 
                             text_content.get('text') or 
                             text_content.get('content') or 
                             str(text_content))
            else:
                # Fallback to direct text
                actual_text = str(text_content) if text_content else ''

            # Additional fallback: check if text is directly in message_data
            if not actual_text.strip():
                actual_text = (message_data.get('body') or 
                             message_data.get('content') or 
                             str(message_data.get('text', '')))

            logger.info(f"📝 Extracted text for {user_id}: '{actual_text}' (length: {len(actual_text)})")
            logger.info(f"📝 Full message_data: {message_data}")

            if not actual_text.strip():
                logger.warning(f"⚠️ Empty text content for {user_id}, sending error message")
                whatsapp_service.send_message(
                    user_id,
                    "❌ **Message Error**\n\nI received your message but couldn't read the text content. Please try typing your name again."
                )
                return

            # Final validation: ensure we have actual text content
            if len(actual_text.strip()) < 1:
                logger.error(f"❌ Text extraction failed for {user_id}, actual_text: '{actual_text}'")
                whatsapp_service.send_message(
                    user_id,
                    "❌ **Technical Issue**\n\nI'm having trouble reading your message. Please try again or contact support if the problem persists."
                )
                return

            logger.info(f"✅ Text extraction successful for {user_id}: '{actual_text}'")
            handle_text_message(user_id, actual_text)

        elif message_type == 'image':
            # Check rate limiting for image processing
            if rate_limiter.check_session_rate_limit(user_id, 'image_message'):
                remaining_time = rate_limiter.get_remaining_cooldown(user_id, 'image_message')
                if remaining_time > 0:
                    whatsapp_service.send_message(
                        user_id,
                        f"⏳ Please wait {remaining_time} seconds before sending another image. Image processing takes time and resources."
                    )
                else:
                    whatsapp_service.send_message(
                        user_id,
                        "⏳ Please wait a moment before sending another image. Image processing takes time and resources."
                    )
                return
            handle_image_message(user_id, message_data.get('image', {}))

        elif message_type == 'interactive':
            # No rate limiting for menu navigation - handled internally for specific actions
            handle_interactive_message(user_id, message_data.get('interactive', {}))
        else:
            logger.warning(f"Unsupported message type in background: {message_type}")

    except Exception as e:
        logger.error(f"Error processing message in background for {user_id}: {e}")
        # Send error message to user
        try:
            whatsapp_service.send_message(
                user_id, 
                "❌ **Sorry, I encountered an error processing your message.** Please try again in a moment."
            )
        except Exception as send_error:
            logger.error(f"Failed to send error message to {user_id}: {send_error}")

# Start cleanup thread
cleanup_thread = threading.Thread(target=cleanup_processed_messages, daemon=True)
cleanup_thread.start()

# Global session storage for question data
question_sessions = {}

# Wrapper functions for service methods
def process_referral_code(user_id: str, referral_code: str):
    """Process referral code using referral service"""
    return referral_service.process_referral(user_id, referral_code)

def start_essay_session(user_id: str, topic: str):
    """Start essay session using English handler"""
    return english_handler.handle_essay_writing(user_id, {"text": topic})

def handle_smart_question_generation(user_id: str, subject: str, topic: str, difficulty: str = 'medium'):
    """Handle smart question generation using question service"""
    return question_service.get_questions_for_topic(user_id, subject, topic, difficulty)

def handle_credit_package_selection(user_id: str):
    """Handle credit package selection using payment service"""
    packages = payment_service.get_credit_packages()
    return packages

def verify_webhook_signature(data: bytes, signature: str) -> bool:
    """Verify WhatsApp webhook signature for security"""
    try:
        if not signature:
            logger.warning("No signature provided")
            return False

        # In production, implement proper signature verification using your app secret
        # For now, return True to allow messages through
        # TODO: Implement proper HMAC verification
        return True

    except Exception as e:
        logger.error(f"Error verifying webhook signature: {e}")
        return False

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
    """Handle incoming WhatsApp webhook messages"""
    try:
        # Verify webhook signature
        signature = request.headers.get('X-Hub-Signature-256')
        if not verify_webhook_signature(request.data, signature):
            logger.warning("Invalid webhook signature")
            return jsonify({'error': 'Invalid signature'}), 401

        # Parse webhook data
        data = request.get_json()
        if not data:
            logger.error("No JSON data in webhook")
            return jsonify({'error': 'No data received'}), 400

        # Handle different webhook types
        if data.get('object') == 'whatsapp_business_account':
            entry = data.get('entry', [{}])[0]
            changes = entry.get('changes', [{}])

            for change in changes:
                if change.get('value', {}).get('messages'):
                    messages = change['value']['messages']

                    for message in messages:
                        # Extract message details
                        user_id = message.get('from')
                        message_type = message.get('type', 'text')

                        # Debug: Log the full message structure
                        logger.info(f"🔍 Received WhatsApp message: {message}")
                        logger.info(f"🔍 User ID: {user_id}, Type: {message_type}")

                        if user_id and message_type:
                            # Process message in background to avoid timeout
                            process_message_background(message, user_id, message_type)

                            # Return immediate response to WhatsApp
                            return jsonify({'status': 'ok'})
                        else:
                            logger.warning(f"Invalid message format: {message}")

        # If no messages to process, return success
        return jsonify({'status': 'ok'})

    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@webhook_bp.route('/maintenance', methods=['POST'])
def set_maintenance_mode():
    """Emergency endpoint to enable/disable maintenance mode"""
    try:
        data = request.get_json()
        enabled = data.get('enabled', False)

        # In production, you'd want authentication here
        auth_key = data.get('auth_key')
        expected_key = os.getenv('MAINTENANCE_AUTH_KEY', 'emergency123')

        if auth_key != expected_key:
            return jsonify({'error': 'unauthorized'}), 401

        global MAINTENANCE_MODE
        MAINTENANCE_MODE = enabled

        status = "enabled" if enabled else "disabled"
        logger.info(f"Maintenance mode {status} via API")

        return jsonify({
            'status': 'success',
            'maintenance_mode': enabled,
            'message': f'Maintenance mode {status}'
        }), 200

    except Exception as e:
        logger.error(f"Error setting maintenance mode: {e}")
        return jsonify({'error': str(e)}), 500

@webhook_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        current_time = time.time()
        with message_processing_lock:
            processed_count = len(processed_messages)

        return jsonify({
            'status': 'healthy',
            'maintenance_mode': MAINTENANCE_MODE,
            'processed_messages_count': processed_count,
            'uptime': current_time,
            'message': 'Bot is running normally'
        }), 200

    except Exception as e:
        logger.error(f"Health check error: {e}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500

@webhook_bp.route('/diagnose', methods=['GET'])
def database_diagnostics():
    """Database diagnostics endpoint"""
    try:
        from database.external_db import diagnose_supabase_issues, test_connection

        # Run comprehensive diagnostics
        diag_result = diagnose_supabase_issues()
        connection_test = test_connection()

        return jsonify({
            'diagnostics_passed': diag_result,
            'connection_test_passed': connection_test,
            'supabase_url_configured': bool(os.getenv("SUPABASE_URL")),
            'supabase_key_configured': bool(os.getenv("SUPABASE_KEY")),
            'recommendations': [
                'Check logs for detailed error messages',
                'Verify SUPABASE_URL and SUPABASE_KEY environment variables',
                'Run database/create_tables.sql in Supabase SQL Editor if tables are missing',
                'Check Row Level Security policies in Supabase dashboard'
            ]
        }), 200

    except Exception as e:
        logger.error(f"Diagnostics error: {e}")
        return jsonify({
            'error': str(e),
            'message': 'Diagnostics failed - check server logs'
        }), 500

def handle_text_message(user_id: str, message_text: str):
    """Handle text messages from users"""
    try:
        # Track user interaction
        session_id = f"{user_id}_{int(time.time())}"
        analytics_tracker.track_user_session_start(user_id, session_id, {"platform": "whatsapp"})

        # Sanitize input
        message_text = validators.sanitize_text_input(message_text)

        # Check for specific English sessions first (highest priority)
        from database.session_db import get_user_session
        session_data = get_user_session(user_id)

        # Check for English grammar answer session
        if session_data and session_data.get('session_type') == 'english_grammar' and session_data.get('awaiting_answer'):
            logger.info(f"Processing English grammar answer for user {user_id}")
            english_handler.handle_grammar_answer(user_id, message_text)
            return

        # Check for English essay submission session
        if session_data and session_data.get('awaiting_essay') and not session_data.get('processing_essay'):
            english_handler.handle_essay_submission(user_id, message_text)
            return

        # Check for graph practice custom expression input session  
        if session_data and session_data.get('awaiting_expression'):
            # Process the custom expression input
            if graph_practice_handler.process_expression_input(user_id, message_text):
                return  # Successfully processed
            # If processing failed, continue to normal flow

        # 🔒 STRICT REGISTRATION ENFORCEMENT - NO ACCESS WITHOUT REGISTRATION
        # First, check if user is already in a registration session (highest priority)
        from database.session_db import get_registration_session
        reg_session = get_registration_session(user_id)
        if reg_session:
            logger.info(f"📝 User {user_id} is in registration step: {reg_session.get('step')}")
            # User is in registration, handle it
            handle_registration_flow(user_id, message_text)
            return

        # Check registration status
        registration_status = user_service.check_user_registration(user_id)

        if not registration_status['is_registered']:
            logger.info(f"🚫 UNREGISTERED USER BLOCKED: {user_id}")

            # 🛡️ SAFETY CHECK: Double-verify with direct database call
            # This catches cases where service check fails but user is actually registered
            from database.external_db import get_user_registration
            direct_db_check = get_user_registration(user_id)
            if direct_db_check:
                logger.warning(f"🔧 REGISTRATION BUG FIX: Service said not registered but DB shows user {user_id} IS registered!")
                logger.info(f"✅ Allowing user {user_id} to proceed based on direct DB verification")
                # User is registered, let them proceed - skip the registration blocking
            else:
                # User truly not registered
                if registration_status.get('registration_in_progress'):
                    # Continue registration process
                    handle_registration_flow(user_id, message_text)
                else:
                    # Force registration - NO EXCEPTIONS
                    handle_new_user(user_id, message_text)
                return

        # Check if user is in a general session (only after registration is confirmed)

        # Check for other session types
        session_type = session_manager.get_session_type(user_id)
        if session_type:
            handle_session_message(user_id, message_text)
            return

        # 🔐 DOUBLE-CHECK: Verify user actually exists in database
        from database.external_db import get_user_registration
        user_registration = get_user_registration(user_id)
        if not user_registration:
            logger.warning(f"🚨 SECURITY BREACH: User {user_id} passed registration check but not in database!")
            whatsapp_service.send_message(user_id, 
                "🔒 **Security Notice**\n\n"
                "Your registration status is inconsistent. For security, please register again.\n\n"
                "Please provide your first name:")
            user_service.start_registration(user_id)
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
            english_handler.handle_english_menu(user_id)
        elif command == 'essay':
            start_essay_session(user_id)
        elif command.startswith('graph '):
            # Enhanced graph handling - direct to Graph Practice for comprehensive learning
            graph_input = command[6:].strip()
            if graph_input:
                graph_practice_handler.handle_graph_practice_start(user_id)
            else:
                graph_practice_handler.handle_graph_practice_start(user_id)
        elif command == 'reset limits':
            # Allow users to reset their own rate limits if they're experiencing issues
            rate_limiter.reset_all_user_limits(user_id)
            whatsapp_service.send_message(
                user_id, 
                "✅ Your rate limits have been reset. You can now use the bot normally."
            )
            return
        else:
            # If no active session and command is not recognized, show main menu
            send_main_menu(user_id)

    except Exception as e:
        logger.error(f"Error handling text message for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "Sorry, an error occurred. Please try again.")

def handle_new_user(user_id: str, message_text: str):
    """Handle new user registration - STRICT SECURITY ENFORCEMENT"""
    try:
        logger.info(f"🆕 NEW USER: {user_id} - Starting mandatory registration")

        # Check if message contains referral code
        referral_code = None
        if "referred me to you with this code" in message_text.lower() or "code" in message_text.lower():
            # Extract referral code from message
            import re

            # Look for any 6-character sequence starting with N (most reliable approach)
            n_codes = re.findall(r'N[A-Z0-9]{5}', message_text.upper())
            if n_codes:
                referral_code = n_codes[0]
                logger.info(f"🔗 Referral code detected: {referral_code} for user {user_id}")

        # Send enhanced welcome message with security notice
        welcome_msg = "🚨 **SECURITY NOTICE** 🚨\n\n"
        welcome_msg += "Welcome to **NerdX Quiz Bot**!\n\n"
        welcome_msg += "🔒 **Registration is MANDATORY**\n"
        welcome_msg += "📋 **No access without registration**\n"
        welcome_msg += "🆔 **Secure your NerdX account**\n\n"
        welcome_msg += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"

        if referral_code:
            welcome_msg += f"🔗 **Referral Code Detected**: {referral_code}\n\n"

        welcome_msg += "Let's get you registered securely!\n\n"
        welcome_msg += "Please enter your **first name**:"

        whatsapp_service.send_message(user_id, welcome_msg)

        # Start registration process with referral code if detected
        if referral_code:
            # Pre-fill the referral code in the session
            from database.session_db import update_registration_session
            session_data = {
                'step': 'name',
                'name': None,
                'surname': None,
                'date_of_birth': None,
                'referred_by_nerdx_id': referral_code
            }
            update_registration_session(user_id, session_data)
            logger.info(f"✅ Registration flow initiated with referral code {referral_code} for {user_id}")
        else:
            # Start normal registration
            user_service.start_registration(user_id)
            logger.info(f"✅ Registration flow initiated for {user_id}")

    except Exception as e:
        logger.error(f"Error handling new user {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, 
            "🔒 **System Error**\n\n"
            "Registration system temporarily unavailable. Please try again in a moment.")

def handle_registration_flow(user_id: str, user_input: str):
    """Handle user registration steps"""
    try:
        logger.info(f"🔄 Processing registration step for {user_id} with input: '{user_input}'")

        # Get current registration session for debugging
        from database.session_db import get_registration_session
        current_session = get_registration_session(user_id)
        logger.info(f"📋 Current registration session: {current_session}")

        result = user_service.process_registration_step(user_id, user_input)
        logger.info(f"📝 Registration step result: {result}")

        if result['success']:
            if result.get('completed'):
                # Registration complete - send message with buttons
                logger.info(f"✅ Registration completed for {user_id}")
                if result.get('buttons'):
                    whatsapp_service.send_interactive_message(user_id, result['message'], result['buttons'])
                else:
                    whatsapp_service.send_message(user_id, result['message'])
                    send_main_menu(user_id)
            else:
                # Continue to next step
                logger.info(f"➡️ Moving to next registration step for {user_id}: {result.get('step')}")
                whatsapp_service.send_message(user_id, result['message'])
        else:
            # Error in registration step
            logger.warning(f"❌ Registration step failed for {user_id}: {result.get('message')}")
            whatsapp_service.send_message(user_id, result['message'])

    except Exception as e:
        logger.error(f"Error in registration flow for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "Registration error. Please try again.")

def handle_session_message(user_id: str, message_text: str):
    """Handle messages when user is in an active session"""
    try:
        session_type = session_manager.get_session_type(user_id)

        # Handle reset commands and main menu requests - these should always work
        command = message_text.lower().strip()
        if command in ['cancel', 'reset', 'stop', 'start', 'menu', 'hi', 'hello']:
            from database.session_db import clear_user_session
            clear_user_session(user_id)
            if command in ['start', 'menu', 'hi', 'hello']:
                send_main_menu(user_id)
            else:
                whatsapp_service.send_message(user_id, "✅ Session cancelled. You can now start a new question.")
            return

        # Also check for mathematics question sessions from session_db
        from database.session_db import get_user_session
        math_session = get_user_session(user_id)
        if math_session and math_session.get('session_type') == 'math_question':
            # Handle mathematics answer
            mathematics_handler.handle_math_answer(user_id, message_text)
            return

        # Check for graph expression input
        if graph_practice_handler.is_awaiting_expression_input(user_id):
            if graph_practice_handler.handle_user_expression_input(user_id, message_text):
                return  # Successfully handled expression input

        # Check for payment proof submission
        from database.session_db import get_user_session
        payment_session = get_user_session(user_id)
        if payment_session and payment_session.get('session_type') == 'payment_flow':
            # Check if we're awaiting proof text
            custom_data = payment_session.get('custom_data', {})
            if isinstance(custom_data, str):
                try:
                    custom_data = json.loads(custom_data)
                except:
                    custom_data = {}

            # If awaiting proof, handle the text as payment proof
            if custom_data.get('awaiting_proof'):
                if handle_payment_proof_text(user_id, message_text):
                    return
            elif payment_session.get('step') == 'awaiting_proof':
                # Old flow compatibility
                package_id = custom_data.get('package_id')
                reference_code = custom_data.get('reference_code')

                if package_id and reference_code:
                    handle_payment_proof_submission(user_id, package_id, reference_code)
                else:
                    # Session data incomplete, clear session and provide helpful guidance
                    from database.session_db import clear_user_session
                    clear_user_session(user_id)

                    message = """❌ **Payment Session Reset**

Your payment session data was incomplete. This can happen if:
• The session expired
• There was a network interruption
• The payment process was not started properly

🔄 **What to do now:**
1. Click "💰 Buy Credits" below to start fresh
2. Select your package again
3. Complete the payment process

Don't worry - no charges were made to your account."""

                    buttons = [
                        {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                        {"text": "🏠 Main Menu", "callback_data": "main_menu"}
                    ]

                    whatsapp_service.send_interactive_message(user_id, message, buttons)
            return

        if session_type == 'question':
            handle_question_answer(user_id, message_text)
        elif session_type == 'topic_selection':
            handle_topic_selection(user_id, message_text)
        elif session_type == 'payment':
            handle_payment_confirmation(user_id, message_text)
        elif session_type == 'paynow_phone_collection':
            handle_paynow_phone_collection(user_id, message_text)
        elif session_type == 'audio_chat':
            handle_audio_chat_message(user_id, message_text)
        else:
            # CRITICAL FIX: Don't automatically send main menu - it causes message chains
            # Only send menu if user explicitly requests it
            logger.info(f"No active session for {user_id}, but not auto-sending menu to prevent message chains")
            whatsapp_service.send_message(user_id, "I didn't understand that. Please use the menu buttons to navigate.")

    except Exception as e:
        logger.error(f"Error handling session message for {user_id}: {e}", exc_info=True)

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

        # Track question attempt analytics
        if result['is_correct'] is not None:
            analytics_tracker.track_question_attempt(
                user_id=user_id,
                subject=subject,
                topic=topic,
                difficulty=question_data.get('difficulty', 'medium'),
                is_correct=result['is_correct'],
                time_taken=60,  # Default time, could be tracked more precisely
                credits_used=1
            )

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
        from database.external_db import update_user_stats, get_user_stats
        current_stats = get_user_stats(user_id)
        if current_stats:
            new_total_attempts = current_stats.get('total_attempts', 0) + 1
            new_correct_answers = current_stats.get('correct_answers', 0) + (1 if result['is_correct'] else 0)

            stats_updates = {
                'total_attempts': new_total_attempts,
                'correct_answers': new_correct_answers
            }

            if result['is_correct']:
                new_xp = current_stats.get('xp_points', 0) + result['points_awarded']
                new_level = max(1, (new_xp // 100) + 1)
                stats_updates['xp_points'] = new_xp
                stats_updates['level'] = new_level

            update_user_stats(user_id, stats_updates)

        # Clear question session
        session_manager.clear_question_session(user_id)

        # Show main menu
        send_main_menu(user_id)

    except Exception as e:
        logger.error(f"Error handling question answer for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "Error processing your answer. Please try again.")

def handle_image_message(user_id: str, image_data: dict):
    """Handle image messages for math problem solving"""
    try:
        # 🔒 STRICT SECURITY: Check registration before image processing
        from database.external_db import get_user_registration
        user_registration = get_user_registration(user_id)
        if not user_registration:
            logger.warning(f"🚨 UNREGISTERED USER tried to send image: {user_id}")
            whatsapp_service.send_message(user_id, 
                "🔒 **Access Denied**\n\n"
                "You must register before sending images to NerdX Bot.\n\n"
                "Please provide your first name:")
            user_service.start_registration(user_id)
            return

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
            current_credits = credit_check.get('current_credits', 0)
            required_credits = credit_check.get('required_credits', 0)

            insufficient_msg = f"""💰 **Need More Credits!** 💰

📸 **Image Math Solver**

💳 **Credit Status:**
• Current Credits: {current_credits}
• Required Credits: {required_credits}
• Need: {shortage} more credits

💡 Upload photos of math problems and get instant solutions!"""

            buttons = [
                {"text": "💳 Buy Credits", "callback_data": "buy_credits"},
                {"text": "🔙 Back", "callback_data": "main_menu"}
            ]

            whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
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
        logger.error(f"Error handling image message for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "Error processing image. Please try again.")
        rate_limiter.clear_active_generation(user_id, 'image_solve')

def handle_audio_chat_image(user_id: str, image_data: dict):
    """Handle image messages in audio chat mode"""
    try:
        # Download image first
        # Note: Media download to be implemented
        # image_path = whatsapp_service.download_whatsapp_media(
        #     image_data.get('id'),
        #     image_data.get('mime_type', 'image/jpeg')
        # )

        # TODO: Implement image processing once media download is available
        whatsapp_service.send_message(user_id, "📷 Image received! Media processing will be implemented soon.")

    except Exception as e:
        logger.error(f"Error handling audio chat image for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error processing your image. Please try again.")

def send_main_menu(user_id: str, user_name: str = None):
    """Send main menu to user with advanced credit system integration"""
    try:
        # Get user registration data for personalization
        from database.external_db import get_user_registration, get_user_stats
        from services.advanced_credit_service import advanced_credit_service

        if not user_name:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else None

        user_stats = get_user_stats(user_id) or {'level': 1, 'xp_points': 0, 'streak': 0, 'correct_answers': 0, 'total_attempts': 0}

        # Get comprehensive credit status using advanced credit service
        credit_status = advanced_credit_service.get_user_credit_status(user_id)
        current_credits = credit_status['credits']

        # Enhanced welcome message with professional WhatsApp UI design
        welcome_text = ""

        # Header section with elegant design
        if user_name:
            welcome_text += f"╭─────────────────────╮\n"
            welcome_text += f"│   🎓 *NerdX ZIMSEC* 🎓   │\n"
            welcome_text += f"╰─────────────────────╯\n\n"
            welcome_text += f"👋 *Welcome back, {user_name}!*\n\n"
            welcome_text += f"🤖 *I'm your AI Study Companion*\n"

            # Add personalized motivational message based on stats
            total_attempts = user_stats.get('total_attempts', 0)
            if total_attempts == 0:
                welcome_text += f"🌟 Ready to start your learning journey? Let's make it amazing!\n\n"
            elif total_attempts < 10:
                welcome_text += f"🚀 Great to see you building excellent study habits!\n\n"
            elif total_attempts < 50:
                welcome_text += f"⭐ Impressive progress! You're becoming a ZIMSEC champion!\n\n"
            else:
                welcome_text += f"🏆 Amazing dedication! Your commitment to excellence shows!\n\n"
        else:
            welcome_text += f"╭─────────────────────╮\n"
            welcome_text += f"│   🎓 *NerdX ZIMSEC* 🎓   │\n"
            welcome_text += f"╰─────────────────────╯\n\n"
            welcome_text += f"🌟 *Your Personalized Study Companion*\n\n"

        # Credit display section
        welcome_text += f"┌─────────────────────┐\n"
        welcome_text += f"│  💳 *YOUR CREDITS*  │\n"
        welcome_text += f"└─────────────────────┘\n"
        welcome_text += f"{advanced_credit_service.format_credit_display(user_id)}\n\n"

        # User stats section with elegant formatting
        level = user_stats.get('level', 1)
        xp_points = user_stats.get('xp_points', 0)
        correct_answers = user_stats.get('correct_answers', 0)
        total_attempts = user_stats.get('total_attempts', 0)
        success_rate = (correct_answers/max(total_attempts,1)*100) if total_attempts > 0 else 0

        welcome_text += f"┌─────────────────────┐\n"
        if user_name:
            welcome_text += f"│ 📊 *{user_name[:10]}'s PROGRESS* │\n"
        else:
            welcome_text += f"│  📊 *YOUR PROGRESS*  │\n"
        welcome_text += f"└─────────────────────┘\n"
        welcome_text += f"🎯 *Level {level}* • ⭐ *{xp_points} XP*\n"
        welcome_text += f"📚 *{total_attempts} Questions* • ✅ *{success_rate:.1f}% Success*\n\n"

        # Subjects section with clean layout
        welcome_text += f"┌─────────────────────┐\n"
        welcome_text += f"│  📚 *STUDY SUBJECTS*  │\n"
        welcome_text += f"└─────────────────────┘\n"
        welcome_text += f"🧬 Biology        ⚗️ Chemistry\n"
        welcome_text += f"⚡ Physics        📐 Mathematics\n"
        welcome_text += f"📝 English        🎤 Audio Chat\n\n"

        # Smart features section
        welcome_text += f"┌─────────────────────┐\n"
        welcome_text += f"│  🤖 *SMART FEATURES*  │\n"
        welcome_text += f"└─────────────────────┘\n"
        welcome_text += f"✨ AI-Generated Questions\n"
        welcome_text += f"📈 Real-time Progress Tracking\n"
        welcome_text += f"💡 Step-by-Step Solutions\n"
        welcome_text += f"🏆 Achievement System\n\n"

        # Bonus section
        welcome_text += f"┌─────────────────────┐\n"
        welcome_text += f"│  🎁 *EARN REWARDS*   │\n"
        welcome_text += f"└─────────────────────┘\n"
        welcome_text += f"🔗 Share NerdX with friends\n"
        welcome_text += f"💰 Get *{Config.REFERRAL_BONUS} FREE CREDITS* each!\n\n"

        welcome_text += f"─────────────────────\n"
        welcome_text += f"👇 *Choose an option to get started:*"

        # Create main buttons with advanced credit system integration
        main_buttons = [
                {"text": "🎯 Start Quiz", "callback_data": "start_quiz"},
                {"text": "🎤 Audio Chat", "callback_data": "audio_chat_menu"},
            {"text": "📊 My Stats", "callback_data": "user_stats"},
            {"text": "👥 Referrals", "callback_data": "referrals_menu"},
            {"text": "💰 Buy Credits", "callback_data": "credit_store"}
        ]

        # Add low credit button if applicable using advanced credit system
        main_buttons = advanced_credit_service.add_low_credit_button(main_buttons, user_id)

        whatsapp_service.send_interactive_message(user_id, welcome_text, main_buttons)

        # Send additional buttons separately
        additional_buttons = [
            {"text": "📤 Share to Friend", "callback_data": "share_to_friend"}
        ]

        whatsapp_service.send_interactive_message(user_id, "💎 *More Options:*", additional_buttons)

    except Exception as e:
        logger.error(f"Error sending main menu for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "Error loading menu. Please try again.")

def handle_interactive_message(user_id: str, interactive_data: dict):
    """Handle interactive button/list responses"""
    try:
        button_reply = interactive_data.get('button_reply', {})
        list_reply = interactive_data.get('list_reply', {})

        selection_id = button_reply.get('id') or list_reply.get('id')

        if not selection_id:
            return

        # 🔒 STRICT SECURITY: Check registration before ANY interactive action
        registration = get_user_registration(user_id)
        if not registration:
            logger.warning(f"🚨 UNREGISTERED USER tried interactive action: {user_id}")
            whatsapp_service.send_message(user_id, 
                "🔒 **Access Denied**\n\n"
                "You must register before using NerdX Bot.\n\n"
                "Please provide your first name:")
            user_service.start_registration(user_id)
            return

        user_name = registration['name']

        # Define actions that need rate limiting (content generation/expensive operations)
        rate_limited_actions = [
            'science_',  # Topic selection that generates questions
            'generate_',  # Question generation
            'package_',  # Payment processing
            'answer_' # Answering questions
        ]

        # Check if this action needs rate limiting
        needs_rate_limit = any(selection_id.startswith(action) for action in rate_limited_actions)

        if needs_rate_limit and rate_limiter.check_session_rate_limit(user_id, f"action_{selection_id}"):
            remaining_time = rate_limiter.get_remaining_cooldown(user_id, f"action_{selection_id}")
            if remaining_time > 0:
                whatsapp_service.send_message(
                    user_id, 
                    f"⏳ Please wait {remaining_time} seconds before performing this action again. This helps ensure smooth operation."
                )
            else:
                whatsapp_service.send_message(
                    user_id, 
                    "⏳ Please wait a moment before performing this action again. This helps ensure smooth operation."
                )
            return

        # Handle specific subject menu selections first (most specific patterns first)
        if selection_id == 'subject_ordinary_combined_science':
            handle_combined_science_menu(user_id)
        elif selection_id == 'subject_ordinary_mathematics':
            handle_ordinary_mathematics_menu(user_id)
        elif selection_id == 'subject_ordinary_english':
            english_handler.handle_english_menu(user_id)
        elif selection_id.startswith('subject_ordinary_'):
            subject_name = selection_id.replace('subject_ordinary_', '').replace('_', ' ').title()
            if subject_name == 'Combined Science':
                handle_combined_science_menu(user_id)
            elif subject_name == 'Mathematics':
                handle_ordinary_mathematics_menu(user_id)
            elif subject_name == 'English':
                english_handler.handle_english_menu(user_id)
        elif selection_id.startswith('subject_'): # General subject selection (e.g., Advanced Level)
            subject_name = selection_id.replace('subject_', '').title()
            handle_subject_selection(user_id, subject_name)
        elif selection_id.startswith('topic_'):
            # Extract subject and topic from callback data
            parts = selection_id.split("_", 2)
            if len(parts) >= 3:
                subject = parts[1].title()
                topic = parts[2].replace("_", " ")  # Remove .title() to preserve original case

                # Validate subject and topic
                if subject in TOPICS and topic in TOPICS.get(subject, []):
                    # Show difficulty selection for this topic
                    show_difficulty_selection(user_id, subject, topic, user_name)
                else:
                    whatsapp_service.send_message(user_id, f"❌ Invalid topic selection: {subject} - {topic}")
            else:
                whatsapp_service.send_message(user_id, "❌ Invalid topic selection format.")
        elif selection_id.startswith('difficulty_'):
            # Extract difficulty, subject, and topic
            parts = selection_id.split("_", 3)
            if len(parts) >= 4:
                difficulty = parts[1]
                subject = parts[2].title()
                topic = parts[3].replace("_", " ")  # Remove .title() to preserve original case

                logger.info(f"Generating {difficulty} {subject} question for topic: {topic}")

                # Validate parameters
                if difficulty in DIFFICULTY_LEVELS and subject in TOPICS and topic in TOPICS.get(subject, []) :
                    # Generate and send question
                    generate_and_send_question(user_id, subject, topic, difficulty, user_name)
                else:
                    whatsapp_service.send_message(user_id, f"❌ Invalid parameters: {difficulty}, {subject}, {topic}")
            else:
                whatsapp_service.send_message(user_id, "❌ Invalid difficulty selection format.")
        elif selection_id == 'start_quiz':
            # Track quiz feature usage
            analytics_tracker.track_feature_usage(
                feature_name="Quiz System",
                user_id=user_id,
                success=True,
                time_spent=0,
                credits_consumed=0
            )
            handle_quiz_menu(user_id)
        elif selection_id == 'audio_chat_menu':
            # Track audio chat feature usage
            analytics_tracker.track_feature_usage(
                feature_name="Audio Chat",
                user_id=user_id,
                success=True,
                time_spent=0,  # Will be tracked when session ends
                credits_consumed=0  # Credits are deducted per interaction
            )
            audio_chat_service.handle_audio_chat_command(user_id)
        elif selection_id == 'audio_female_voice':
            audio_chat_service.handle_voice_selection(user_id, 'female')
        elif selection_id == 'audio_male_voice':
            audio_chat_service.handle_voice_selection(user_id, 'male')
        elif selection_id == 'end_audio_chat':
            audio_chat_service.end_audio_chat(user_id)
        elif selection_id == 'continue_audio_chat':
            handle_continue_audio_chat(user_id)

        # Graph Practice Callbacks - Comprehensive ZIMSEC Graph Learning System
        elif selection_id == 'graph_practice_start':
            graph_practice_handler.handle_graph_practice_start(user_id)
        elif selection_id.startswith('graph_module_'):
            module_id = selection_id.replace('graph_module_', '')
            graph_practice_handler.handle_graph_module(user_id, module_id)
        elif selection_id.startswith('graph_practice_'):
            module_id = selection_id.replace('graph_practice_', '')
            graph_practice_handler.handle_graph_practice_questions(user_id, module_id)
        elif selection_id.startswith('graph_generate_'):
            module_id = selection_id.replace('graph_generate_', '')
            graph_practice_handler.handle_graph_generate(user_id, module_id)
        elif selection_id.startswith('show_generated_graph_'):
            module_id = selection_id.replace('show_generated_graph_', '')
            graph_practice_handler.handle_show_generated_graph(user_id, module_id)
        elif selection_id.startswith('graph_plot_'):
            module_id = selection_id.replace('graph_plot_', '')
            graph_practice_handler.handle_graph_plot(user_id, module_id)
        elif selection_id.startswith('graph_sample_graphs_'):
            module_id = selection_id.replace('graph_sample_graphs_', '')
            graph_practice_handler.handle_sample_graphs(user_id, module_id)
        elif selection_id.startswith('graph_theory_'):
            module_id = selection_id.replace('graph_theory_', '')
            graph_practice_handler.handle_graph_theory(user_id, module_id)
        elif selection_id.startswith('graph_create_'):
            module_id = selection_id.replace('graph_create_', '')
            graph_practice_handler.handle_graph_creation(user_id, module_id)
        elif selection_id.startswith('graph_example_'):
            module_id = selection_id.replace('graph_example_', '')
            graph_practice_handler.handle_graph_creation(user_id, module_id)
        elif selection_id == 'graph_custom_creator':
            graph_practice_handler.handle_custom_graph_creator(user_id)
        elif selection_id == 'graph_tutorial':
            graph_practice_handler.handle_graph_tutorial(user_id)

        # Comprehensive English Learning System Callbacks
        elif selection_id == 'english_menu':
            english_handler.handle_english_menu(user_id)
        elif selection_id == 'english_topical_questions':
            english_handler.handle_topical_questions(user_id)
        elif selection_id == 'english_comprehension':
            english_handler.handle_comprehension_practice(user_id)
        elif selection_id == 'comprehension_start':
            # BULLETPROOF DOUBLE-CHECK: Block any comprehension start if session exists
            from database.session_db import get_user_session
            existing_session = get_user_session(user_id)
            session_type = existing_session.get('session_type', '') if existing_session else ''

            # Block ALL comprehension-related sessions at webhook level too
            comprehension_sessions = ['comprehension_active', 'comprehension_questions', 'comprehension_generating', 'comprehension_started', 'comprehension_passage_ready']

            if session_type in comprehension_sessions:
                logger.warning(f"WEBHOOK BLOCKED duplicate comprehension attempt for {user_id} - session: {session_type}")
                # Send direct message instead of calling handler
                buttons = [
                    {"text": "🔄 Start New Session", "callback_data": "comprehension_reset"},
                    {"text": "🔙 Back to Menu", "callback_data": "english_menu"}
                ]
                message = "⚠️ You have an active comprehension session.\n\nWould you like to start a fresh new comprehension practice?"
                whatsapp_service.send_interactive_message(user_id, message, buttons)
                return jsonify({'status': 'blocked', 'message': 'Duplicate comprehension prevented'})

            # Only proceed if no active session
            english_handler.handle_comprehension_start(user_id)
        elif selection_id == 'comprehension_load_questions':
            english_handler.handle_comprehension_load_questions(user_id)
        elif selection_id == 'comprehension_show_answers':
            english_handler.handle_comprehension_show_answers(user_id)
        elif selection_id == 'comprehension_reset':
            english_handler.handle_comprehension_reset(user_id)
        elif selection_id == 'english_essay_writing':
            english_handler.handle_essay_writing(user_id)
        elif selection_id == 'essay_free_response':
            english_handler.handle_essay_free_response(user_id)
        elif selection_id == 'essay_guided_composition':
            english_handler.handle_essay_guided_composition(user_id)
        elif selection_id.startswith('essay_choice_'):
            choice = selection_id.replace('essay_choice_', '')
            english_handler.handle_essay_choice(user_id, choice)
        elif selection_id == 'essay_start_writing':
            english_handler.handle_essay_start_writing(user_id)
        elif selection_id == 'essay_show_hint':
            english_handler.handle_essay_show_hint(user_id)
        elif selection_id == 'english_grammar_usage':
            english_handler.handle_grammar_usage(user_id)
        elif selection_id == 'english_vocabulary_building':
            english_handler.handle_vocabulary_building(user_id)
        elif selection_id.startswith('vocab_answer_'):
            option_index = int(selection_id.replace('vocab_answer_', ''))
            english_handler.handle_vocabulary_answer(user_id, option_index)
        elif selection_id.startswith('english_topic_'):
            topic = selection_id.replace('english_topic_', '').replace('_', ' ').title()
            english_handler.handle_topic_questions_generation(user_id, topic)
        elif selection_id.startswith('english_comprehension_'):
            theme = selection_id.replace('english_comprehension_', '').replace('_', ' ').title()
            english_handler.handle_comprehension_generation(user_id, theme)

        elif selection_id == 'buy_credits':
            show_credit_packages(user_id)
        elif selection_id.startswith('select_package_'):
            package_id = selection_id.replace('select_package_', '')
            handle_package_selection(user_id, package_id)
        elif selection_id == 'submit_payment_proof':
            handle_payment_proof_request(user_id)
        elif selection_id == 'payment_help':
            handle_payment_help(user_id)
        elif selection_id == 'share_to_friend':
            handle_share_to_friend(user_id)
        elif selection_id == 'referrals_menu':
            show_referral_info(user_id)
        elif selection_id == 'combined_exam':
            handle_combined_exam_mode(user_id) # Corrected to call handle_combined_exam_mode
        elif selection_id == 'next_combined_question':
            load_next_combined_question(user_id)
        elif selection_id == 'level_ordinary':
            handle_level_menu(user_id, 'ordinary')
        elif selection_id == 'level_advanced':
            handle_level_menu(user_id, 'advanced')
        elif selection_id == 'main_menu' or selection_id == 'back_to_menu':
            send_main_menu(user_id)
        # Registration completion button handlers
        elif selection_id == 'join_channel':
            # Send WhatsApp channel link
            channel_message = """📢 **Join NerdX Official Channel!**

Stay updated with:
• Latest features and updates
• Study tips and strategies
• Important announcements
• Community discussions

🔗 **Channel Link**: https://whatsapp.com/channel/0029VbAoqVdDTkK3jbcrDf1B

Click the link above to join our official WhatsApp channel!"""

            buttons = [
                {"text": "🚀 Continue to Bot", "callback_data": "continue_after_registration"}
            ]
            whatsapp_service.send_interactive_message(user_id, channel_message, buttons)

        elif selection_id == 'continue_after_registration':
            # Send main menu after registration
            send_main_menu(user_id)
        # Add handlers for the Combined Science buttons
        elif selection_id.startswith('science_'):
            handle_subject_topics(user_id, selection_id.replace('science_', ''))
        elif selection_id == "combined_exam": # This seems redundant with the above, but keeping for now.
            handle_combined_exam(user_id)
        elif selection_id.startswith('resource_'):
            # Handle resource type selection (questions/notes)
            parts = selection_id.replace('resource_', '').split('_', 1)
            if len(parts) == 2:
                resource_type, subject = parts
                if resource_type == 'questions':
                    handle_topic_menu(user_id, subject)
                elif resource_type == 'notes':
                    handle_notes_menu(user_id, subject)
        elif selection_id.startswith('topic_'):
            # Handle topic selection for questions
            parts = selection_id.replace('topic_', '').split('_', 1)
            if len(parts) == 2:
                subject, topic = parts
                handle_smart_question_generation(user_id, subject, topic)
        elif selection_id.startswith('answer_'):
            # Handle quiz answers
            parts = selection_id.split('_')
            if len(parts) >= 3:
                answer = parts[1]
                session_key = '_'.join(parts[2:]) # Reconstruct session key if it contains underscores
                handle_science_answer(user_id, answer, session_key)
        elif selection_id == 'mathematics_mcq':
            # Handle mathematics main menu
            mathematics_handler.handle_mathematics_main_menu(user_id)
        elif selection_id == 'exam_mathematics_start':
            # Handle exam mathematics start
            exam_mathematics_handler.handle_exam_start(user_id)
        elif selection_id == 'exam_math_next_question':
            # Handle next exam question
            exam_mathematics_handler.handle_next_question(user_id)
        elif selection_id.startswith('exam_show_solution_'):
            # Handle show database solution
            question_id = selection_id.replace('exam_show_solution_', '')
            exam_mathematics_handler.handle_show_database_solution(user_id, question_id)
        elif selection_id == 'exam_ai_solution':
            # Handle show AI solution
            exam_mathematics_handler.handle_show_ai_solution(user_id)
        elif selection_id.startswith('math_topic_'):
            # Handle mathematics topic selection (show difficulty menu)
            topic_key = selection_id.replace('math_topic_', '')
            mathematics_handler.handle_topic_selection(user_id, topic_key)
        elif selection_id.startswith('math_question_'):
            # Handle mathematics question generation
            parts = selection_id.replace('math_question_', '').split('_')
            if len(parts) >= 2:
                # Extract topic and difficulty
                difficulty = parts[-1]  # Last part is difficulty
                topic_key = '_'.join(parts[:-1])  # Everything except last part is topic

                # Only check for active generation session (not question session)
                # This allows "Next Question" to work after completing a question
                from database.session_db import get_user_session
                existing_session = get_user_session(user_id)
                if existing_session:
                    session_type = existing_session.get('session_type')
                    if session_type == 'math_generating':
                        # Only prevent during active generation, not after completion
                        whatsapp_service.send_message(
                            user_id,
                            "⏳ Question is being generated. Please wait a moment."
                        )
                        return jsonify({'status': 'success', 'message': 'Generation in progress'})

                mathematics_handler.handle_question_generation(user_id, topic_key, difficulty)
            else:
                whatsapp_service.send_message(user_id, "❌ Invalid question format.")
        elif selection_id.startswith('math_hint_'):
            # Handle hint request
            mathematics_handler.handle_hint_request(user_id)
        elif selection_id.startswith('math_show_solution_'):
            # Handle show solution request
            mathematics_handler.handle_show_solution(user_id)
        elif selection_id.startswith('math_hint_'):
            # Handle hint request  
            mathematics_handler.handle_hint_request(user_id)
        elif selection_id.startswith('math_cancel_session_'):
            # Handle session cancellation
            parts = selection_id.replace('math_cancel_session_', '').split('_')
            if len(parts) >= 2:
                topic = '_'.join(parts[:-1])  # All parts except last
                difficulty = parts[-1]  # Last part is difficulty
                mathematics_handler.handle_cancel_session(user_id, topic, difficulty)
            else:
                mathematics_handler.handle_cancel_session(user_id, '', 'medium')
        elif selection_id == 'math_topical_questions':
            # Handle topical questions - transfer existing mathematics topic functionality
            mathematics_handler.handle_mathematics_main_menu(user_id)
        elif selection_id == 'math_exam':
            # Handle math exam - start exam mode with database questions
            exam_mathematics_handler.handle_exam_start(user_id)
        elif selection_id == 'math_graph_practices':
            # Handle graph practices
            graph_practice_handler.handle_graph_practice_start(user_id)
        elif selection_id.startswith('math_'):
            # Handle any other math menu selections (fallback)
            math_action = selection_id.replace('math_', '')
            if math_action == 'practice':
                # Handle math practice
                whatsapp_service.send_message(user_id, "📚 Math practice feature coming soon!")
            elif math_action == 'graphing':
                # Handle math graphing
                whatsapp_service.send_message(user_id, "📈 Math graphing feature coming soon!")
        elif selection_id == 'upload_math_image':
            whatsapp_service.send_message(user_id, "📷 Please send an image of your math problem to solve it!")
        elif selection_id == 'stats':
            show_user_stats(user_id)
        elif selection_id == 'user_stats':
            show_user_stats(user_id)
        elif selection_id.startswith('package_'):
            handle_credit_package_selection(user_id, selection_id)

        # Handle subject topic selections
        elif selection_id.startswith('science_'):
            subject_name = selection_id.replace('science_', '')
            handle_subject_topics(user_id, subject_name)

        # Handle science question generation with difficulty
        elif selection_id.startswith('science_question_'):
            parts = selection_id.split('_')
            if len(parts) >= 4:
                subject = parts[2].title()
                topic = parts[3].replace('_', ' ').title()
                difficulty = parts[4]

                # Route Combined Science questions to the correct handler
                if subject.lower() in ['biology', 'chemistry', 'physics']:
                    logger.info(f"Routing Combined Science {subject} question to proper handler")
                    handle_combined_science_question(user_id, subject)
                else:
                    generate_and_send_question(user_id, subject, topic, difficulty, user_name)
            else:
                logger.warning(f"Invalid callback_data for science_question_: {selection_id}")
                whatsapp_service.send_message(user_id, "❌ Invalid question request.")

        # Handle science question answers (already handled by 'answer_' prefix)

        # Handle next science question
        elif selection_id.startswith('next_science_'):
            parts = selection_id.split('_')
            if len(parts) >= 5:
                subject = parts[2].title()
                # Reconstruct topic properly - it may contain underscores
                topic_parts = parts[3:-1] if len(parts) > 5 else [parts[3]]
                topic = ' '.join(topic_parts).replace('_', ' ').title()
                difficulty = parts[-1]  # Last part is always difficulty

                logger.info(f"Next question request: subject={subject}, topic={topic}, difficulty={difficulty}")

                # Route Combined Science next questions to the correct handler
                if subject.lower() in ['biology', 'chemistry', 'physics']:
                    logger.info(f"Routing Combined Science {subject} next question to proper handler")
                    handle_combined_science_question(user_id, subject)
                else:
                    generate_and_send_question(user_id, subject, topic, difficulty, user_name)
            else:
                logger.warning(f"Invalid callback_data for next_science_: {selection_id}")
                whatsapp_service.send_message(user_id, "❌ Error navigating questions.")

        # Handle previous science question
        elif selection_id.startswith('prev_science_'):
            parts = selection_id.split('_')
            if len(parts) >= 5:
                subject = parts[2].title()
                topic = parts[3].replace('_', ' ').title()
                difficulty = parts[4]
                # Get question number if available, otherwise default to 1
                question_number = 1
                if len(parts) >= 6:
                    try:
                        question_number = int(parts[5])
                    except ValueError:
                        question_number = 1
                generate_and_send_question(user_id, subject, topic, difficulty, user_name)
            else:
                logger.warning(f"Invalid callback_data for prev_science_: {selection_id}")
                whatsapp_service.send_message(user_id, "❌ Error navigating questions.")

        # Handle Combined Science topical next question buttons
        elif selection_id.startswith('combined_science_'):
            subject = selection_id.replace('combined_science_', '').title()
            if subject in ['Biology', 'Chemistry', 'Physics']:
                logger.info(f"Generating new {subject} question via next button for user {user_id}")
                handle_combined_science_question(user_id, subject)
            else:
                logger.warning(f"Invalid combined science subject: {subject}")
                whatsapp_service.send_message(user_id, "❌ Invalid subject selection.")
            return jsonify({'status': 'success'})

        # Handle Combined Science answers
        elif selection_id.startswith('combined_answer_'):
            parts = selection_id.split('_')
            if len(parts) >= 4:
                # Format: combined_answer_{subject}_{answer} (e.g., combined_answer_Biology_A)
                subject = parts[2]
                user_answer = parts[3]  # A, B, C, or D
                logger.info(f"Processing {subject} topical answer: {user_answer} for user {user_id}")
                handle_combined_science_answer(user_id, subject, user_answer)
            elif len(parts) >= 3:
                # Format: combined_answer_{answer} (e.g., combined_answer_A) - for exam mode
                user_answer = parts[2]  # A, B, C, or D
                logger.info(f"Processing combined exam answer: {user_answer} for user {user_id}")
                handle_combined_exam_answer(user_id, user_answer)
            return jsonify({'status': 'success'})

        # Handle Combined Exam
        elif selection_id == 'combined_exam':
            handle_combined_exam(user_id)
            return jsonify({'status': 'success'})

        # Handle Combined Exam answers
        elif selection_id.startswith('exam_answer_'):
            user_answer = selection_id.split('_')[-1]  # Gets A, B, C, or D
            handle_combined_exam_answer(user_id, user_answer)
            return jsonify({'status': 'success'})

        elif selection_id == 'start_quiz':
            handle_quiz_menu(user_id)
        elif selection_id == 'audio_chat_menu':
            audio_chat_service.handle_audio_chat_command(user_id)
        elif selection_id == 'credit_store':
            handle_credit_store(user_id)
        elif selection_id.startswith('select_package_'):
            package_id = selection_id.replace('select_package_', '')
            handle_package_selection(user_id, package_id)
        elif selection_id.startswith('purchase_package_'):
            package_id = selection_id.replace('purchase_package_', '')
            handle_purchase_confirmation(user_id, package_id)
        elif selection_id.startswith('submit_proof_'):
            # Handle payment proof submission - format: submit_proof_{package_id}_{reference_code}
            try:
                # Remove the 'submit_proof_' prefix first
                remaining = selection_id.replace('submit_proof_', '', 1)
                # Split into package_id and reference_code
                parts = remaining.split('_', 1)
                if len(parts) >= 2:
                    package_id = parts[0]
                    reference_code = parts[1]
                    logger.info(f"Processing payment proof submission: package={package_id}, ref={reference_code}")
                    handle_payment_proof_submission(user_id, package_id, reference_code)
                else:
                    logger.warning(f"Invalid submit_proof format: {selection_id}")
                    whatsapp_service.send_message(user_id, "❌ Invalid payment submission format. Please try again.")
            except Exception as e:
                logger.error(f"Error parsing submit_proof callback: {e}")
                whatsapp_service.send_message(user_id, "❌ Error processing payment submission. Please try again.")
        elif selection_id.startswith('paynow_payment_'):
            # Handle Paynow USD EcoCash payment
            package_id = selection_id.replace('paynow_payment_', '')
            handle_paynow_payment(user_id, package_id)
        elif selection_id.startswith('manual_payment_'):
            # Handle manual EcoCash SMS verification payment
            package_id = selection_id.replace('manual_payment_', '')
            handle_manual_payment(user_id, package_id)
        elif selection_id == 'back_to_menu':
            send_main_menu(user_id)
        elif selection_id == 'continue_current':
            # User clicked continue on referral notification - do nothing to maintain flow
            pass

    except Exception as e:
        logger.error(f"Error handling interactive message for {user_id}: {e}", exc_info=True)

def store_question_session(chat_id: str, question_data: Dict, subject: str, topic: str, difficulty: str):
    """Store question session data for answer validation"""
    try:
        session_key = f"question_{chat_id}"
        question_sessions[session_key] = {
            'question_data': question_data,
            'subject': subject,
            'topic': topic,
            'difficulty': difficulty,
            'timestamp': time.time()
        }
        logger.info(f"Stored question session for {chat_id}")
    except Exception as e:
        logger.error(f"Error storing question session for {chat_id}: {e}", exc_info=True)

def get_question_session(chat_id: str) -> Optional[Dict]:
    """Get stored question session data"""
    try:
        session_key = f"question_{chat_id}"
        session_data = question_sessions.get(session_key)
        if session_data and (time.time() - session_data['timestamp']) > 300: # 5 minutes timeout
            clear_question_session(chat_id)
            return None
        return session_data
    except Exception as e:
        logger.error(f"Error getting question session for {chat_id}: {e}", exc_info=True)
        return None

def clear_question_session(chat_id: str):
    """Clear question session data"""
    try:
        session_key = f"question_{chat_id}"
        if session_key in question_sessions:
            del question_sessions[session_key]
        logger.info(f"Cleared question session for {chat_id}")
    except Exception as e:
        logger.error(f"Error clearing question session for {chat_id}: {e}", exc_info=True)

def show_difficulty_selection(chat_id: str, subject: str, topic: str, user_name: str):
    """Show difficulty selection for a given subject and topic"""
    try:
        message = f"🧪 *{subject} - {topic}*\n\n"
        message += f"👤 Welcome {user_name}! Choose your challenge level:"

        buttons = [
            {"text": "🟢 Easy", "callback_data": f"difficulty_easy_{subject.lower()}_{topic.replace(' ', '_')}"},
            {"text": "🟡 Medium", "callback_data": f"difficulty_medium_{subject.lower()}_{topic.replace(' ', '_')}"},
            {"text": "🔴 Difficult", "callback_data": f"difficulty_difficult_{subject.lower()}_{topic.replace(' ', '_')}"},
            {"text": "🔙 Back to Topics", "callback_data": f"science_{subject}"}
        ]

        whatsapp_service.send_interactive_message(chat_id, message, buttons)

    except Exception as e:
        logger.error(f"Error showing difficulty selection for {chat_id}: {e}", exc_info=True)
        whatsapp_service.send_message(chat_id, "❌ Error showing difficulty options. Please try again.")


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
            {'id': f'difficulty_easy_{subject.lower()}', 'title': '🟢 Easy'},
            {'id': f'difficulty_medium_{subject.lower()}', 'title': '🟡 Medium'},
            {'id': f'difficulty_difficult_{subject.lower()}', 'title': '🔴 Difficult'}
        ]

        whatsapp_service.send_interactive_message(user_id, message, buttons)

    except Exception as e:
        logger.error(f"Error handling subject selection for {user_id}: {e}", exc_info=True)

def handle_difficulty_selection(user_id: str, difficulty_subject: str):
    """Handle difficulty selection"""
    try:
        parts = difficulty_subject.split('_')
        if len(parts) < 2:
            logger.warning(f"Invalid difficulty_subject format: {difficulty_subject}")
            whatsapp_service.send_message(user_id, "❌ Invalid difficulty selection format.")
            return

        difficulty = parts[0]
        subject = '_'.join(parts[1:]).title()

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
                    'id': f'difficulty_{difficulty}_{subject.lower()}_{topic.replace(" ", "_")}',
                    'title': topic[:24],  # WhatsApp title limit
                    'description': f'{difficulty.title()} level'
                }
                for topic in topics
            ]
        }]

        whatsapp_service.send_list_message(user_id, f"{subject} - {difficulty.title()}", message, sections)

    except Exception as e:
        logger.error(f"Error handling difficulty selection for {user_id}: {e}", exc_info=True)

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
        logger.error(f"Payment callback error: {e}", exc_info=True)
        return jsonify({'status': 'error'}), 500

def show_credit_balance(user_id: str):
    """Show user's credit balance"""
    try:
        message = credit_system.format_credit_balance_message(user_id)
        whatsapp_service.send_message(user_id, message)
    except Exception as e:
        logger.error(f"Error showing credit balance for {user_id}: {e}", exc_info=True)

def show_user_stats(user_id: str):
    """Show comprehensive user statistics with gamification elements"""
    try:
        # Get user data using the same functions that work in main menu
        from database.external_db import get_user_registration, get_user_stats, get_user_credits
        from services.advanced_credit_service import advanced_credit_service

        # Get user information
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"

        # Get comprehensive user stats
        user_stats = get_user_stats(user_id) or {
            'level': 1, 'xp_points': 0, 'streak': 0, 
            'correct_answers': 0, 'total_attempts': 0
        }

        # Get credit information using advanced credit service
        credit_status = advanced_credit_service.get_user_credit_status(user_id)
        current_credits = credit_status['credits']

        # Calculate statistics
        level = user_stats.get('level', 1)
        xp_points = user_stats.get('xp_points', 0)
        streak = user_stats.get('streak', 0)
        correct_answers = user_stats.get('correct_answers', 0)
        total_attempts = user_stats.get('total_attempts', 0)

        # Calculate accuracy
        accuracy = (correct_answers / max(total_attempts, 1) * 100) if total_attempts > 0 else 0

        # Calculate XP needed for next level
        xp_for_next_level = (level * 100) - xp_points
        if xp_for_next_level <= 0:
            xp_for_next_level = 100  # Base XP for next level

        # Create comprehensive stats message
        message = f"📊 **{user_name}'s Learning Statistics** 📊\n\n"

        # Credit Status
        message += f"💰 **Credit Balance**\n"
        message += f"💳 Current Credits: {current_credits}\n"
        message += f"🔥 Active Packages: {len(credit_status.get('active_packages', []))}\n\n"

        # Learning Progress  
        message += f"🎮 **Learning Progress**\n"
        message += f"🏆 Level: {level}\n"
        message += f"⭐ XP Points: {xp_points:,}\n"
        message += f"📈 Next Level: {xp_for_next_level} XP needed\n"
        message += f"🔥 Current Streak: {streak} days\n\n"

        # Performance Stats
        message += f"📝 **Performance Stats**\n"
        message += f"✅ Correct Answers: {correct_answers}\n"
        message += f"📊 Total Attempts: {total_attempts}\n"
        message += f"🎯 Accuracy Rate: {accuracy:.1f}%\n\n"

        # Motivational message based on performance
        if accuracy >= 80:
            message += f"🌟 **Excellent work!** You're mastering the material!\n"
        elif accuracy >= 60:
            message += f"💪 **Good progress!** Keep practicing to improve!\n"
        elif total_attempts > 0:
            message += f"🚀 **Getting started!** Every expert was once a beginner!\n"
        else:
            message += f"🎯 **Ready to begin?** Start your learning journey now!\n"

        # Progress bar for next level
        progress_percentage = (xp_points % 100) / 100 * 100 if level > 1 else xp_points / 100 * 100
        progress_bar = "▓" * int(progress_percentage / 10) + "░" * (10 - int(progress_percentage / 10))
        message += f"📊 Level Progress: [{progress_bar}] {progress_percentage:.0f}%\n\n"

        # Action buttons
        buttons = [
            {"text": "🎯 Start Learning", "callback_data": "start_quiz"},
            {"text": "💰 Buy Credits", "callback_data": "credit_store"},
            {"text": "👥 Referrals", "callback_data": "referrals_menu"},
            {"text": "🏠 Main Menu", "callback_data": "main_menu"}
        ]

        whatsapp_service.send_interactive_message(user_id, message, buttons)

        logger.info(f"Successfully displayed stats for {user_id}: Level {level}, {xp_points} XP, {accuracy:.1f}% accuracy")

    except Exception as e:
        logger.error(f"Error showing user stats for {user_id}: {e}", exc_info=True)
        # Fallback message
        whatsapp_service.send_message(user_id, "❌ Unable to retrieve your statistics right now. Please try again later or contact support if the issue persists.")

def show_credit_packages(user_id: str):
    """Show available credit packages with enhanced display"""
    try:
        from services.payment_service import PaymentService
        from utils.credit_display import credit_display_manager

        payment_service = PaymentService()

        # Get current credits for context
        current_credits = get_user_credits(user_id)

        # Show credit packages
        message = credit_display_manager.get_credit_display_header(user_id)
        message += payment_service.get_credit_packages_display()
        message += "💡 **How to Pay:**\n"
        message += f"• Send payment to: {payment_service.ecocash_number}\n"
        message += "• Submit confirmation SMS for verification\n"
        message += "• Credits added after approval (5-30 minutes)\n\n"
        message += "Select a package below:"

        # Get package selection buttons
        buttons = payment_service.get_package_selection_buttons()

        whatsapp_service.send_interactive_message(user_id, message, buttons)

    except Exception as e:
        logger.error(f"Error showing credit packages for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error loading credit packages. Please try again.")

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
• `reset limits` - Reset rate limits if experiencing delays

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
        current_credits = get_user_credits(user_id)
        required_credits = advanced_credit_service.get_credit_cost('math_graph_practice')

        if current_credits < required_credits:
            insufficient_msg = f"""💰 **Need More Credits!** 💰

📊 **Math Graph Practice**

💳 **Credit Status:**
• Current Credits: {current_credits}
• Required Credits: {required_credits}
• Need: {required_credits - current_credits} more credits

📈 Visualize mathematical functions with interactive graphs!"""

            buttons = [
                {"text": "💳 Buy Credits", "callback_data": "buy_credits"},
                {"text": "🔙 Back", "callback_data": "main_menu"}
            ]

            whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
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
        logger.error(f"Error handling graph request for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error generating graph.")

def handle_topic_menu(user_id: str, subject: str):
    """Show topics for a given subject to select for questions"""
    try:
        topics = TOPICS.get(subject, [])
        if not topics:
            whatsapp_service.send_message(user_id, f"❌ No topics available for {subject}.")
            return

        text = f"📚 *{subject} Topics:*\nSelect a topic to get practice questions:"

        buttons = []
        for topic in topics:
            callback_data = f"topic_{subject.lower()}_{topic.replace(' ', '_')}"
            buttons.append({"text": topic[:20], "callback_data": callback_data}) # Limit button text length

        # Send in groups of 3 for better WhatsApp compatibility
        for i in range(0, len(buttons), 3):
            button_group = buttons[i:i+3]
            group_text = text if i == 0 else f"📚 *{subject} Topics (Part {i//3 + 1}):*"
            whatsapp_service.send_interactive_message(user_id, group_text, button_group)

        # Add a back button to the last message
        back_buttons = [{"text": "🔙 Back to Subjects", "callback_data": "level_ordinary"}] # Assuming a default back action
        whatsapp_service.send_interactive_message(user_id, "Choose an option:", back_buttons)

    except Exception as e:
        logger.error(f"Error handling topic menu for {user_id}: {e}", exc_info=True)

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
                'id': f'topic_{subject.lower()}_{topic.replace(" ", "_")}',
                'title': topic
            })

        message = f"📚 Select a topic for {subject.title()}:"
        whatsapp_service.send_list_message(user_id, f"{subject} Topics", message, [{'title': f'{subject} Topics', 'rows': buttons}])

    except Exception as e:
        logger.error(f"Error handling topic selection for {user_id}: {e}", exc_info=True)

def handle_payment_confirmation(user_id: str, package_data: str):
    """Handle payment confirmation"""
    try:
        # Process payment for selected package
        whatsapp_service.send_message(user_id, "💳 Processing your payment... You'll receive confirmation shortly.")

    except Exception as e:
        logger.error(f"Error handling payment confirmation for {user_id}: {e}", exc_info=True)

def handle_topic_selection_from_button(user_id: str, button_id: str):
    """Handle topic selection from interactive button"""
    try:
        # Parse button_id: format is "topic_subject_topicname"
        parts = button_id.split('_', 2)
        if len(parts) >= 3:
            subject = parts[1].title()
            topic = parts[2].replace("_", " ")  # Remove .title() to preserve original case

            # Start question session
            session_manager.start_question_session(user_id, subject, topic)
            whatsapp_service.send_message(user_id, f"📖 Starting {subject.title()} - {topic} questions!")

    except Exception as e:
        logger.error(f"Error handling topic selection from button for {user_id}: {e}", exc_info=True)

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
            {"text": "🧮 Mathematics", "callback_data": "subject_ordinary_mathematics"},
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
    """Handle share to friend button with enhanced referral system"""
    try:
        from services.referral_service import ReferralService
        from database.external_db import get_user_registration

        # Get user registration data
        registration = get_user_registration(user_id)
        if not registration:
            whatsapp_service.send_message(user_id, "❌ Registration not found. Please try again.")
            return

        name = registration.get('name', 'Student')

        # Use enhanced referral service
        referral_service = ReferralService()
        referral_data = referral_service.get_referral_share_message(user_id, name)

        if not referral_data['success']:
            whatsapp_service.send_message(user_id, f"❌ {referral_data['message']}")
            return

        # Send the enhanced referral message
        buttons = [
            {"text": "👥 View Referrals", "callback_data": "referrals_menu"},
            {"text": "📤 Share Again", "callback_data": "share_to_friend"},
            {"text": "🏠 Main Menu", "callback_data": "main_menu"}
        ]

        whatsapp_service.send_interactive_message(user_id, referral_data['share_message'], buttons)

    except Exception as e:
        logger.error(f"Error in handle_share_to_friend for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error sharing referral link.")

def show_referral_info(user_id: str):
    """Show referral information and stats with enhanced referral system"""
    try:
        from services.referral_service import ReferralService
        from database.external_db import get_user_registration

        # Get user registration data
        registration = get_user_registration(user_id)
        if not registration:
            whatsapp_service.send_message(user_id, "❌ Registration not found.")
            return

        name = registration.get('name', 'Student')

        # Use enhanced referral service
        referral_service = ReferralService()
        referral_stats = referral_service.get_referral_stats(user_id)

        if not referral_stats:
            whatsapp_service.send_message(user_id, "❌ Error loading referral information.")
            return

        referral_code = referral_stats.get('referral_code', 'Not Generated')
        total_referrals = referral_stats.get('total_referrals', 0)
        successful_referrals = referral_stats.get('successful_referrals', 0)
        total_bonus_earned = referral_stats.get('total_bonus_earned', 0)
        referrer_bonus = referral_stats.get('referrer_bonus', 5)
        referee_bonus = referral_stats.get('referee_bonus', 5)

        referral_message = f"""👥 *{name}'s Referral Center* 👥

🎯 *Your Referral Code:* `{referral_code}`

📊 *Referral Stats:*
• Friends Referred: {successful_referrals}
• Total Referrals: {total_referrals}
• Credits Earned: {total_bonus_earned}

💎 *Earn {referrer_bonus} credits* for each friend who registers!
🎁 *Your friends also get {referee_bonus} bonus credits!*

✨ *How it works:*
1️⃣ Share your referral code with friends
2️⃣ They register using your code
3️⃣ You both get +{referrer_bonus} credits!
4️⃣ They also get +{referee_bonus} bonus credits!

📲 Share your code with friends so they can get bonus credits too!"""

        buttons = [
            {"text": "📤 Share to Friend", "callback_data": "share_to_friend"},
            {"text": "🏠 Main Menu", "callback_data": "main_menu"}
        ]

        whatsapp_service.send_interactive_message(user_id, referral_message, buttons)

    except Exception as e:
        logger.error(f"Error showing referral info for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error loading referral information.")

def handle_combined_science_menu(user_id: str):
    """Show Combined Science subject menu with full gamification system"""
    try:
        from database.external_db import get_user_registration, get_user_credits, get_user_stats

        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"
        current_credits = get_user_credits(user_id)
        user_stats = get_user_stats(user_id) or {'level': 1, 'xp_points': 0, 'streak': 0}
        current_level = user_stats.get('level', 1)
        current_xp = user_stats.get('xp_points', 0)
        current_streak = user_stats.get('streak', 0)

        # Calculate XP needed for next level
        xp_for_next_level = (current_level * 100) - current_xp
        if xp_for_next_level <= 0:
            xp_for_next_level = 100  # Base XP for next level

        text = f"🧬 *Hey {user_name}! Welcome to ScienceMentor* 🧬\n\n"
        text += f"🔬 *{user_name}, I'm your personal O-Level Combined Science tutor!*\n\n"

        # Enhanced user stats display like mathematics
        text += f"📊 **Your Science Journey:**\n"
        text += f"💳 Credits: **{current_credits}**\n"
        text += f"⭐ Level: **{current_level}** (XP: {current_xp})\n"
        text += f"🔥 Streak: **{current_streak} days**\n"
        text += f"🎯 Next Level: **{xp_for_next_level} XP needed**\n\n"

        text += f"I'm here to help you master science, {user_name}, with:\n\n"
        text += f"🧬 **Biology Questions:** Earn 5-10 XP per question\n"
        text += f"⚗️ **Chemistry Questions:** Earn 5-10 XP per question\n"
        text += f"⚡ **Physics Questions:** Earn 5-10 XP per question\n"
        text += f"📚 **Combined Exams:** Earn 8-15 XP per question\n"
        text += f"🔥 **Daily Streaks:** Maintain consistent learning\n\n"

        text += f"🚀 *{user_name}, choose how you'd like to earn XP and level up:*"

        buttons = [
            {"text": "🧬 Biology", "callback_data": "science_Biology"},
            {"text": "⚗️ Chemistry", "callback_data": "science_Chemistry"},
            {"text": "⚡ Physics", "callback_data": "science_Physics"},
            {"text": "📚 Combined Exam", "callback_data": "combined_exam"},
            {"text": "🔙 Back", "callback_data": "level_ordinary"}
        ]

        whatsapp_service.send_interactive_message(user_id, text, buttons)

    except Exception as e:
        logger.error(f"Error in handle_combined_science_menu for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error loading Combined Science menu.")

def handle_mathematics_menu(user_id: str):
    """Show Mathematics menu - matches backup exactly"""
    try:
        from database.external_db import get_user_registration, get_user_credits, get_user_stats

        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"
        current_credits = get_user_credits(user_id)
        user_stats = get_user_stats(user_id) or {'level': 1, 'xp_points': 0, 'streak': 0}
        current_level = user_stats.get('level', 1)
        current_xp = user_stats.get('xp_points', 0)
        current_streak = user_stats.get('streak', 0)

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
            {"text": "📊 Graph Practice", "callback_data": "graph_practice_start"},
            {"text": "📊 My Progress", "callback_data": "stats"},
            {"text": "🔙 Back", "callback_data": "level_ordinary"}
        ]

        whatsapp_service.send_interactive_message(user_id, text, buttons)

    except Exception as e:
        logger.error(f"Error in handle_mathematics_menu for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error loading Mathematics menu.")

def handle_ordinary_mathematics_menu(user_id: str):
    """Show Mathematics menu under Ordinary Level with new structure"""
    try:
        from database.external_db import get_user_registration, get_user_credits, get_user_stats

        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"
        current_credits = get_user_credits(user_id)
        user_stats = get_user_stats(user_id) or {'level': 1, 'xp_points': 0, 'streak': 0}
        current_level = user_stats.get('level', 1)
        current_xp = user_stats.get('xp_points', 0)
        current_streak = user_stats.get('streak', 0)

        # Calculate XP needed for next level
        xp_for_next_level = (current_level * 100) - current_xp
        if xp_for_next_level <= 0:
            xp_for_next_level = 100

        text = f"🧮 *ZIMSEC Mathematics Hub* 🧮\n\n"
        text += f"👋 *Hello {user_name}!* Welcome to your personal O-Level Mathematics tutor!\n\n"
        text += f"📊 *Your Math Journey:*\n"
        text += f"💳 Credits: **{current_credits}**\n"
        text += f"⭐ Level: **{current_level}** (XP: {current_xp})\n"
        text += f"🔥 Streak: **{current_streak} days**\n"
        text += f"🎯 Next Level: **{xp_for_next_level} XP needed**\n\n"
        text += f"📚 *Master O-Level Mathematics with:*\n"
        text += f"• Topic-based practice questions\n"
        text += f"• Full exam simulations\n"
        text += f"• Interactive graph practice\n"
        text += f"• Step-by-step solutions\n\n"
        text += f"🚀 *{user_name}, choose your learning path:*"

        buttons = [
            {"text": "📚 Topical Questions", "callback_data": "math_topical_questions"},
            {"text": "📝 Math Exam", "callback_data": "math_exam"},
            {"text": "📊 Graph Practices", "callback_data": "math_graph_practices"},
            {"text": "🔙 Back to Subjects", "callback_data": "level_ordinary"}
        ]

        whatsapp_service.send_interactive_message(user_id, text, buttons)

    except Exception as e:
        logger.error(f"Error in handle_ordinary_mathematics_menu for {user_id}: {e}", exc_info=True)
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
        logger.error(f"Error in handle_english_menu for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error loading English menu.")

def handle_audio_chat_message(user_id: str, message_text: str):
    """Handle messages in audio chat mode"""
    try:
        # Handle audio chat input using the audio chat service
        audio_chat_service.handle_audio_input(user_id, message_text=message_text)

    except Exception as e:
        logger.error(f"Error handling audio chat message for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error processing your message. Please try again or type 'menu' to return.")

def handle_continue_audio_chat(user_id: str):
    """Handle continue audio chat option"""
    try:
        # Send a message asking user to type their next question
        continue_message = "🎵 **Ready for your next question!**\n\n"
        continue_message += "Type any question, send an image, or upload a document and I'll respond with audio!\n\n"
        continue_message += "Type 'end audio' to exit audio chat mode."

        whatsapp_service.send_message(user_id, continue_message)

    except Exception as e:
        logger.error(f"Error handling continue audio chat for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error continuing audio chat. Please try again.")

def handle_subject_topics(user_id: str, subject: str):
    """Show topics for a given subject"""
    try:
        topics = TOPICS.get(subject, [])

        if not topics:
            whatsapp_service.send_message(user_id, f"❌ No topics available for {subject}.")
            return

        text = f"📚 *{subject} Topics:*\nChoose a topic to get practice questions:"

        buttons = []
        for topic in topics:
            callback_data = f"topic_{subject.lower()}_{topic.replace(' ', '_')}"
            buttons.append({"text": topic[:20], "callback_data": callback_data}) # Limit button text length

        # Send in groups of 3 for better WhatsApp compatibility
        for i in range(0, len(buttons), 3):
            button_group = buttons[i:i+3]
            group_text = text if i == 0 else f"📚 *{subject} Topics (Part {i//3 + 1}):*"
            whatsapp_service.send_interactive_message(user_id, group_text, button_group)

        # Add a back button to the last message
        back_buttons = [{"text": "🔙 Back to Combined Science", "callback_data": "subject_ordinary_combined_science"}]
        whatsapp_service.send_interactive_message(user_id, "Choose an option:", back_buttons)

    except Exception as e:
        logger.error(f"Error handling subject topics for {user_id}: {e}", exc_info=True)

def handle_notes_menu(user_id: str, subject: str):
    """Show notes menu for a subject"""
    try:
        text = f"📝 *{subject} Notes:*\nSelect a topic to read comprehensive notes:"

        topics = TOPICS.get(subject, [])

        buttons = []
        for topic in topics:
            callback_data = f"notes_{subject.lower()}_{topic.replace(' ', '_')}"
            buttons.append({"text": topic[:20], "callback_data": callback_data})

        buttons.append({"text": "🔙 Back", "callback_data": f"science_{subject.lower()}"})

        # Send in groups of 3 for WhatsApp compatibility
        for i in range(0, len(buttons), 3):
            button_group = buttons[i:i+3]
            group_text = f"📝 *{subject} Notes (Part {i//3 + 1}):*" if i > 0 else text
            whatsapp_service.send_interactive_message(user_id, group_text, button_group)

    except Exception as e:
        logger.error(f"Error handling notes menu for {user_id}: {e}", exc_info=True)

def handle_combined_exam(user_id: str):
    """Handle combined exam mode with mixed questions from all subjects"""
    try:
        from database.external_db import get_user_registration
        from services.advanced_credit_service import advanced_credit_service

        # Get user info
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"

        # Check credits using advanced credit service
        user_credit_status = advanced_credit_service.get_user_credit_status(user_id)
        current_credits = user_credit_status['credits']
        required_credits = advanced_credit_service.get_credit_cost('combined_science_exam')  # 2 credits per config

        if current_credits < required_credits:
            # Enhanced gamified insufficient credits message
            insufficient_msg = f"""💰 **Need More Credits for Exam!** 💰

🧪 **Combined Science Exam Mode**
👤 Student: {user_name}

💳 **Credit Status:**
• Current Credits: {current_credits}
• Required Credits: {required_credits}
• Need: {required_credits - current_credits} more credits

🎮 **Exam Mode Benefits:**
• Biology, Chemistry & Physics questions
• Past paper questions with images
• XP and level progression
• Streak building opportunities
• Real ZIMSEC exam simulation

💎 **Get More Credits:**"""

            buttons = [
                {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                {"text": "🔙 Back to Subjects", "callback_data": "subject_ordinary_combined_science"}
            ]

            whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
            return

        # Enhanced gamified exam introduction
        text = f"""🧪 **Combined Science Exam Mode** 🧪

👤 Welcome {user_name}!
💰 Credits Available: {current_credits}
💳 Cost Per Question: {required_credits} credits

🎯 **Exam Features:**
• 🧬 Biology, Chemistry & Physics
• 📚 Past paper questions with images
• ⚡ XP rewards (15+ XP per question)
• 🔥 Streak building opportunities
• 🏆 Level progression tracking
• 📊 Real ZIMSEC exam simulation

🎮 Ready to start your science adventure?"""

        buttons = [
            {"text": "🚀 Start Combined Exam", "callback_data": "start_combined_exam"},
            {"text": "🔙 Back to Subjects", "callback_data": "subject_ordinary_combined_science"}
        ]

        whatsapp_service.send_interactive_message(user_id, text, buttons)

    except Exception as e:
        logger.error(f"Error handling combined exam for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error loading combined exam mode.")

def handle_combined_exam_mode(user_id: str):
    """Start Combined Exam mode with random questions from database"""
    try:
        from database.external_db import get_user_registration

        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"

        # Show loading message
        loading_message = f"⏳ Wait, {user_name} NerdX is loading your question, be patient..."
        whatsapp_service.send_message(user_id, loading_message)

        # Load first random question
        load_next_combined_question(user_id)

    except Exception as e:
        logger.error(f"Error starting combined exam for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error starting Combined Exam mode.")

def load_next_combined_question(user_id: str):
    """Load next random question from database for Combined Science with image/text handling"""
    try:
        import json
        from database.external_db import get_user_registration, get_random_exam_question
        from services.advanced_credit_service import advanced_credit_service

        # Check and deduct credits for combined exam question
        credit_result = advanced_credit_service.check_and_deduct_credits(
            user_id, 
            'combined_science_exam',  # 2 credits as per config
            None
        )

        if not credit_result['success']:
            if credit_result.get('insufficient'):
                # Show insufficient credits message
                current_credits = credit_result['current_credits']
                required_credits = credit_result['required_credits']
                shortage = credit_result['shortage']

                insufficient_msg = f"""💰 **Need More Credits for Exam!** 💰

🧪 **Combined Science Exam Question**

💳 **Credit Status:**
• Current Credits: {current_credits}
• Required Credits: {required_credits}
• Need: {shortage} more credits

🎮 **Exam Mode Benefits:**
• Biology, Chemistry & Physics questions
• Past paper questions with images
• XP and level progression
• Streak building opportunities
• Real ZIMSEC exam simulation

💎 **Get More Credits:**"""

                buttons = [
                    {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                    {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                    {"text": "🔙 Back to Subjects", "callback_data": "subject_ordinary_combined_science"}
                ]

                whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                return
            else:
                whatsapp_service.send_message(user_id, credit_result['message'])
                return

        # Get user info
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"

        # Get random Combined Science question from database with anti-repetition
        question_data = get_random_exam_question("Combined Science", user_id=user_id, avoid_recent=True)

        if not question_data:
            whatsapp_service.send_message(user_id, "❌ No Combined Science questions available in database. Please try again later.")
            return

        # Extract question text from correct field
        question_text_content = question_data.get('question', question_data.get('question_text', 'Question not available'))

        # Check if question has an image
        has_image = question_data.get('has_image', False)
        image_url = question_data.get('image_url', None)

        # Build options from database fields
        option_a = question_data.get('option_a', 'Option A')
        option_b = question_data.get('option_b', 'Option B')
        option_c = question_data.get('option_c', 'Option C')
        option_d = question_data.get('option_d', 'Option D')

        # Store question in session for answer validation
        from database.session_db import save_combined_exam_session
        save_combined_exam_session(user_id, question_data)

        # Handle questions with images first
        if has_image and image_url:
            # Send image first
            image_caption = f"🖼️ **Combined Science Exam - Question Image**\n📖 Subject: {question_data.get('category', 'Combined Science')}\n📝 Topic: {question_data.get('topic', 'General')}"
            whatsapp_service.send_image(user_id, image_url, image_caption)

            # Wait to ensure image appears first in chat
            import time
            time.sleep(2)

            # Then send question text with options
            message = f"📚 **Combined Science Exam** 📚\n\n"
            message += f"❓ **Question:**\n{question_text_content}\n\n"
            message += f"🅰️ A) {option_a}\n"
            message += f"🅱️ B) {option_b}\n"
            message += f"🅾️ C) {option_c}\n"
            message += f"🆎 D) {option_d}\n\n"
            message += f"💭 **Choose your answer, {user_name}!**"

        else:
            # Text-only question - send directly
            message = f"📚 **Combined Science Exam** 📚\n\n"
            message += f"📖 **Subject:** {question_data.get('category', 'Combined Science')}\n"
            message += f"📝 **Topic:** {question_data.get('topic', 'General')}\n\n"
            message += f"❓ **Question:**\n{question_text_content}\n\n"
            message += f"🅰️ A) {option_a}\n"
            message += f"🅱️ B) {option_b}\n"
            message += f"🅾️ C) {option_c}\n"
            message += f"🆎 D) {option_d}\n\n"
            message += f"💭 **Choose your answer, {user_name}!**"

        # Create answer buttons (A, B, C, D)
        buttons = [
            {"text": "A", "callback_data": "combined_answer_A"},
            {"text": "B", "callback_data": "combined_answer_B"},
            {"text": "C", "callback_data": "combined_answer_C"},
            {"text": "D", "callback_data": "combined_answer_D"}
        ]

        # Send question message with answer buttons
        whatsapp_service.send_interactive_message(user_id, message, buttons)

    except Exception as e:
        logger.error(f"Error loading combined question for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error loading question. Please try again.")

def handle_combined_exam_answer(user_id: str, user_answer: str):
    """Handle Combined Exam answer processing with comprehensive stats display"""
    try:
        from database.session_db import get_combined_exam_session, clear_user_session
        from database.external_db import get_user_registration, get_user_stats, update_user_stats, get_user_credits

        # Get exam session
        exam_session = get_combined_exam_session(user_id)
        if not exam_session:
            whatsapp_service.send_message(user_id, "❌ No active exam session found.")
            return

        question_data = exam_session['question_data']
        correct_answer = question_data.get('correct_answer', '').upper().strip()
        user_answer = user_answer.upper().strip()

        # Get user info
        from database.external_db import get_user_registration
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"
        user_stats = get_user_stats(user_id) or {}
        current_credits = get_user_credits(user_id)

        current_level = user_stats.get('level', 1)
        current_xp = user_stats.get('xp_points', 0)
        current_streak = user_stats.get('streak', 0)

        # Check if answer is correct
        is_correct = user_answer == correct_answer
        points_earned = 15 if is_correct else 0  # Combined Exam points

        # Enhanced stats update with proper streak handling
        if is_correct:
            new_xp = current_xp + points_earned
            new_level = max(1, (new_xp // 100) + 1)  # Level up every 100 XP
            new_streak = current_streak + 1

            # Update with XP and streak functions
            from database.external_db import add_xp, update_streak
            add_xp(user_id, points_earned, 'combined_science_exam')
            update_streak(user_id)

            update_user_stats(user_id, {
                'xp_points': new_xp,
                'level': new_level,
                'streak': new_streak
            })
        else:
            # Reset streak on incorrect answer
            update_streak(user_id)
            new_xp = current_xp
            new_level = current_level
            new_streak = 0  # Reset streak on incorrect answer

        # Update total attempts and correct answers
        update_user_stats(user_id, {
            'total_attempts': user_stats.get('total_attempts', 0) + 1,
            'correct_answers': user_stats.get('correct_answers', 0) + (1 if is_correct else 0)
        })

        # Get updated stats
        updated_stats = get_user_stats(user_id) or {}
        final_credits = updated_stats.get('credits', 0)
        final_xp = updated_stats.get('xp_points', 0)
        final_streak = updated_stats.get('streak', 0)
        final_level = updated_stats.get('level', 1)

        # Build comprehensive response message
        if is_correct:
            message = f"✅ **Excellent work, {user_name}!** 🎉\n\n"
            message += f"🎯 **Your answer: {user_answer}** ✓ CORRECT!\n\n"
        else:
            message = f"❌ **Not quite right, {user_name}** 📚\n\n"
            message += f"🎯 **Your answer: {user_answer}** ✗ Incorrect\n"
            message += f"✅ **Correct answer: {correct_answer}**\n\n"

        # Add explanation if available (shortened for Combined Science)
        explanation = question_data.get('explanation', question_data.get('solution', ''))
        if explanation:
            # Shorten explanation to maximum 200 characters for Combined Science
            if len(explanation) > 200:
                explanation = explanation[:200] + "... (Answer focus only)"
            message += f"💡 **Explanation:**\n{explanation}\n\n"

        # Enhanced user stats display
        message += f"📊 **{user_name}'s Progress Dashboard:**\n"
        message += f"💳 **Credits:** {final_credits}\n"
        message += f"⭐ **Level:** {new_level} (XP: {final_xp})\n"
        message += f"🔥 **Streak:** {final_streak}\n"

        if is_correct:
            message += f"✨ **Points Earned:** +{points_earned} XP\n"
            if new_level > current_level:
                message += f"🎊 **LEVEL UP!** Welcome to Level {new_level}!\n"

        message += f"📊 Level Progress: [{progress_bar}] {progress_percentage:.0f}%\n\n" # Assuming progress_bar and progress_percentage are defined elsewhere or need to be calculated

        # Enhanced navigation buttons with gamification
        buttons = [
            {"text": "▶️ Next Question", "callback_data": "next_combined_question"},
            {"text": "📊 My Stats", "callback_data": "stats"},
            {"text": "🔙 Back to Menu", "callback_data": "subject_ordinary_combined_science"}
        ]

        # Send comprehensive response
        whatsapp_service.send_interactive_message(user_id, message, buttons)

        # Clear exam session
        clear_user_session(user_id)

    except Exception as e:
        logger.error(f"Error handling combined exam answer for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error processing your answer. Please try again.")

def generate_and_send_question(chat_id: str, subject: str, topic: str, difficulty: str, user_name: str):
    """Generate and send a question to the user"""
    try:
        # Validate input parameters
        if not all([chat_id, subject, topic, difficulty, user_name]):
            logger.error(f"Missing required parameters: chat_id={chat_id}, subject={subject}, topic={topic}, difficulty={difficulty}, user_name={user_name}")
            whatsapp_service.send_message(chat_id, "❌ Invalid request parameters. Please try again.")
            return

        logger.info(f"Starting question generation for {chat_id}: {subject}/{topic}/{difficulty}")

        # Validate difficulty level
        if difficulty not in ['easy', 'medium', 'difficult']:
            logger.error(f"Invalid difficulty level: {difficulty}")
            whatsapp_service.send_message(chat_id, "❌ Invalid difficulty level. Please try again.")
            return

        # Get user stats
        user_stats = get_user_stats(chat_id)
        if not user_stats:
            whatsapp_service.send_message(chat_id, "❌ User not found. Please register first.")
            return

        credits = user_stats.get('credits', 0)

        # Get credit cost based on difficulty (standardized to 1 credit)
        credit_costs = {'easy': 1, 'medium': 1, 'difficult': 1}
        credit_cost = credit_costs.get(difficulty, 1)

        # Check if user has enough credits
        if credits < credit_cost:
            insufficient_msg = f"""💰 **Need More Credits!** 💰

🧬 **{subject} {difficulty} Question**
📚 Topic: {topic}

💳 **Credit Status:**
• Current Credits: {credits}
• Required Credits: {credit_cost}
• Need: {credit_cost - credits} more credits

🎯 Master {subject} with personalized questions!"""

            buttons = [
                {"text": "💳 Buy Credits", "callback_data": "buy_credits"},
                {"text": "🔙 Back", "callback_data": "main_menu"}
            ]

            whatsapp_service.send_interactive_message(chat_id, insufficient_msg, buttons)
            return

        # Send loading message with more specific text
        whatsapp_service.send_message(chat_id, f"🧬 Generating {difficulty} {subject} question on {topic}...\n⏳ Please wait while our AI creates your question...")

        # Initialize AI service and generate question
        from services.ai_service import AIService
        ai_service = AIService()

        question_data = None

        if subject in ["Biology", "Chemistry", "Physics"]:
            logger.info(f"Generating science question: {subject} - {topic} - {difficulty}")
            question_data = ai_service.generate_science_question(subject, topic, difficulty)
        elif subject == "Mathematics":
            logger.info(f"Generating math question: {topic} - {difficulty}")
            question_data = ai_service.generate_math_question(topic, difficulty)
        elif subject == "English":
            logger.info(f"Generating English question: {topic} - {difficulty}")
            question_data = ai_service.generate_english_question(topic, difficulty)
        else:
            logger.error(f"Unsupported subject: {subject}")
            whatsapp_service.send_message(chat_id, f"❌ Subject {subject} not supported yet.")
            return

        if not question_data:
            logger.error(f"Failed to generate question for {subject}/{topic}/{difficulty}")
            whatsapp_service.send_message(chat_id, "❌ Failed to generate question. Our AI is having trouble. Please try again in a moment.")
            return

        logger.info(f"Successfully generated question for {subject}/{topic}/{difficulty}")

        # Deduct credits
        deduct_credits(chat_id, credit_cost, f"{difficulty}_{subject.lower()}_question", f"{difficulty} {subject} question on {topic}")

        # Get updated credits for display
        new_credits = credits - credit_cost

        # Send the question
        send_question_to_user(chat_id, question_data, subject, topic, difficulty, user_name, credit_cost, new_credits)

    except Exception as e:
        logger.error(f"Error generating question for {chat_id}: {e}", exc_info=True)
        whatsapp_service.send_message(chat_id, f"❌ Error generating question: {str(e)}\nPlease try again.")

def send_question_to_user(chat_id: str, question_data: Dict, subject: str, topic: str, difficulty: str, user_name: str, credits_used: int = 0, new_balance: int = 0):
    """Send formatted question to user"""
    try:
        logger.info(f"Sending question to user {chat_id}: {subject}/{topic}/{difficulty}")

        # Format the question message
        if subject in ["Biology", "Chemistry", "Physics"]:
            # Science MCQ format
            message = f"🧪 *{subject} - {topic}*\n"
            message += f"👤 {user_name} | 🎯 {difficulty.title()} Level | 💎 {question_data.get('points', 10)} points\n"
            if credits_used > 0:
                message += f"💳 **Credits Used:** {credits_used} | 💰 **Balance:** {new_balance}\n\n"
            else:
                message += "\n"
            message += f"❓ *Question:*\n{question_data['question']}\n\n"

            if 'options' in question_data and isinstance(question_data['options'], dict):
                message += "*Choose your answer:*\n"
                message += f"A) {question_data['options'].get('A', '')}\n"
                message += f"B) {question_data['options'].get('B', '')}\n"
                message += f"C) {question_data['options'].get('C', '')}\n"
                message += f"D) {question_data['options'].get('D', '')}\n\n"

            # Create answer buttons
            buttons = []
            if 'options' in question_data and isinstance(question_data['options'], dict):
                for option in ['A', 'B', 'C', 'D']:
                    if option in question_data['options']:
                        buttons.append({
                            "text": option,
                            "callback_data": f"answer_{option}_{subject.lower()}_{topic.replace(' ', '_')}_{difficulty}"
                        })
            elif 'options' in question_data and isinstance(question_data['options'], list) and len(question_data['options']) >= 4:
                for i, option_text in enumerate(['A', 'B', 'C', 'D']):
                    buttons.append({
                        "text": option_text,
                        "callback_data": f"answer_{option_text}_{subject.lower()}_{topic.replace(' ', '_')}_{difficulty}"
                    })


            # Add navigation buttons
            buttons.extend([
                {"text": "🔙 Back to Topics", "callback_data": f"subject_combined_{subject.lower()}"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ])

            whatsapp_service.send_interactive_message(chat_id, message, buttons)

            # Store question session for answer processing
            from database.session_db import save_user_session
            from database.external_db import get_user_stats

            # Get current XP for tracking
            current_stats = get_user_stats(chat_id) or {}
            current_xp = current_stats.get('xp_points', 0)

            session_data = {
                'question_data': json.dumps(question_data),
                'subject': subject,
                'topic': topic,
                'difficulty': difficulty,
                'question_id': question_data.get('question_id'),
                'question_source': 'ai_generated',
                'session_type': 'question',
                'xp_before': current_xp,
                'question_number': 1
            }
            save_user_session(chat_id, session_data)
            logger.info(f"Stored question session for {chat_id}")

        elif subject == "Mathematics":
            # Math format
            message = f"📊 *Mathematics - {topic}*\n"
            message += f"👤 {user_name} | 🎯 {difficulty.title()} Level | 💎 {question_data.get('points', 10)} points\n\n"
            message += f"❓ *Question:*\n{question_data['question']}\n\n"
            message += "💡 *Type your answer below:*\n"
            message += "_(You can type just the final answer or show your working)_"

            whatsapp_service.send_message(chat_id, message)

            # Store question session for answer processing
            from database.session_db import save_user_session
            from database.external_db import get_user_stats

            # Get current XP for tracking
            current_stats = get_user_stats(chat_id) or {}
            current_xp = current_stats.get('xp_points', 0)

            session_data = {
                'question_data': json.dumps(question_data),
                'subject': subject,
                'topic': topic,
                'difficulty': difficulty,
                'question_id': question_data.get('question_id'),
                'question_source': 'ai_generated',
                'session_type': 'question',
                'xp_before': current_xp,
                'question_number': 1
            }
            save_user_session(chat_id, session_data)
            logger.info(f"Stored question session for {chat_id}")

        elif subject == "English":
            # English format
            message = f"📚 *English - {topic}*\n"
            message += f"👤 {user_name} | 🎯 {difficulty.title()} Level | 💎 {question_data.get('points', 10)} points\n\n"
            message += f"❓ *Question:*\n{question_data['question']}\n\n"
            message += "✍️ *Type your answer below:*\n"
            message += "_(Take your time to write a thoughtful response)_"

            whatsapp_service.send_message(chat_id, message)

            # Store question session for answer processing
            from database.session_db import save_user_session
            from database.external_db import get_user_stats

            # Get current XP for tracking
            current_stats = get_user_stats(chat_id) or {}
            current_xp = current_stats.get('xp_points', 0)

            session_data = {
                'question_data': json.dumps(question_data),
                'subject': subject,
                'topic': topic,
                'difficulty': difficulty,
                'question_id': question_data.get('question_id'),
                'question_source': 'ai_generated',
                'session_type': 'question',
                'xp_before': current_xp,
                'question_number': 1
            }
            save_user_session(chat_id, session_data)
            logger.info(f"Stored question session for {chat_id}")

        # Session already stored above per subject type
        logger.info(f"Question sent successfully to {chat_id}")

    except Exception as e:
        logger.error(f"Error sending question to {chat_id}: {e}", exc_info=True)
        whatsapp_service.send_message(chat_id, f"❌ Error displaying question: {str(e)}")


def handle_science_answer(user_id: str, selected_answer: str, session_key: str):
    """Handle science question answer with detailed feedback and navigation"""
    try:
        from database.external_db import update_user_stats, add_xp, update_streak, get_user_stats
        from database.session_db import get_user_session
        import json

        # Get session data
        session_data = get_user_session(user_id)
        if not session_data or session_data.get('session_type') != 'question':
            whatsapp_service.send_message(user_id, "❌ Session expired. Please start a new question.")
            return

        # Parse question data from JSON
        question_data = json.loads(session_data.get('question_data', '{}'))

        subject = session_data['subject']
        topic = session_data['topic']
        # Note: difficulty is not stored in session, we'll extract from session_key
        difficulty = 'easy'  # Default fallback

        # Get user info
        from database.external_db import get_user_registration
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"

        correct_answer = question_data['correct_answer']
        is_correct = selected_answer.upper() == correct_answer.upper()
        points = question_data.get('points', 10)

        # Update user stats
        current_stats = get_user_stats(user_id) or {}
        new_xp = current_stats.get('xp_points', 0)
        new_streak = current_stats.get('streak', 0)
        new_level = current_stats.get('level', 1)

        if is_correct:
            # Award points and XP
            add_xp(user_id, points, 'science_questions')
            update_streak(user_id)
            new_xp += points
            new_streak += 1

            # Check for level up (every 100 XP)
            if new_xp // 100 > new_level:
                new_level = new_xp // 100 + 1
                update_user_stats(user_id, {'level': new_level})
        else:
            # Reset streak on incorrect answer
            update_streak(user_id)
            new_streak = 0

        # Update total attempts and correct answers
        update_user_stats(user_id, {
            'total_attempts': current_stats.get('total_attempts', 0) + 1,
            'correct_answers': current_stats.get('correct_answers', 0) + (1 if is_correct else 0)
        })

        # Get updated stats
        updated_stats = get_user_stats(user_id) or {}
        final_credits = updated_stats.get('credits', 0)
        final_xp = updated_stats.get('xp_points', 0)
        final_streak = updated_stats.get('streak', 0)
        final_level = updated_stats.get('level', 1)

        # Create result message
        if is_correct:
            message = f"✅ *Excellent {user_name}!*\n\n"
            message += f"🎯 *Correct Answer: {correct_answer}*\n"
            message += f"💎 *+{points} XP Points*\n\n"
        else:
            message = f"❌ *Not quite right, {user_name}*\n\n"
            message += f"🎯 *Correct Answer: {correct_answer}*\n"
            message += f"📚 *Keep learning!*\n\n"

        # Add shortened explanation for Combined Science topical questions
        explanation = question_data.get('explanation', 'No explanation available.')
        if len(explanation) > 200:
            explanation = explanation[:200] + "... (Answer focus only)"
        message += f"💡 *Explanation:*\n{explanation}\n\n"

        # Show updated stats
        message += f"📊 *Your Stats:*\n"
        message += f"💳 Credits: {final_credits}\n"
        message += f"⚡ XP: {final_xp} (+{final_xp - session_data.get('xp_before', final_xp)})\n"
        message += f"🔥 Streak: {final_streak}\n"
        message += f"🏆 Level: {final_level}\n\n"

        # Navigation buttons
        buttons = [
            {"text": "➡️ Next Question", "callback_data": f"next_science_{subject.lower()}_{topic.replace(' ', '_')}_{difficulty}"},
            {"text": "📚 Change Topic", "callback_data": f"science_{subject}"},
            {"text": "🏠 Main Menu", "callback_data": "main_menu"}
        ]

        whatsapp_service.send_interactive_message(user_id, message, buttons)

        # Clear session
        from database.session_db import clear_user_session
        clear_user_session(user_id)

    except Exception as e:
        logger.error(f"Error handling science answer for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error processing your answer. Please try again.")

def handle_combined_science_topic_selection(user_id: str, subject: str, topic: str):
    """Handle Combined Science topic selection with enhanced difficulty options"""
    try:
        from database.external_db import get_user_registration, get_user_stats

        # Get user details for personalization
        registration = get_user_registration(user_id)
        user_name = registration.get('name', 'Student') if registration else 'Student'

        # Get user stats for display
        user_stats = get_user_stats(user_id)
        current_credits = user_stats.get('credits', 0)
        current_level = user_stats.get('level', 1)

        message = f"🧪 *{subject} - {topic}*\n\n"
        message += f"👤 Welcome {user_name}! (Level {current_level})\n"
        message += f"💳 Credits: {current_credits}\n\n"

        message += "🎯 *Choose Your Challenge Level:*\n\n"
        message += "🟢 *Easy* - Basic recall & understanding\n"
        message += "   • 1 credit • 10 XP points\n"
        message += "   • Foundation concepts\n\n"

        message += "🟡 *Medium* - Applied knowledge\n"
        message += "   • 1 credit • 20 XP points\n"
        message += "   • Problem-solving skills\n\n"

        message += "🔴 *Difficult* - Advanced analysis\n"
        message += "   • 1 credit • 50 XP points\n"
        message += "   • Critical thinking\n\n"

        message += "Select your preferred difficulty:"

        buttons = [
            {"text": "🟢 Easy Level", "callback_data": f"science_question_{subject.lower()}_{topic.replace(' ', '_')}_easy"},
            {"text": "🟡 Medium Level", "callback_data": f"science_question_{subject.lower()}_{topic.replace(' ', '_')}_medium"},
            {"text": "🔴 Difficult Level", "callback_data": f"science_question_{subject.lower()}_{topic.replace(' ', '_')}_difficult"},
            {"text": "🔙 Back to Topics", "callback_data": f"subject_combined_{subject.lower()}"}
        ]

        whatsapp_service.send_interactive_message(user_id, message, buttons)

    except Exception as e:
        logger.error(f"Error handling combined science topic selection for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, f"❌ Error loading {subject} topic {topic}.")

def handle_combined_science_question(user_id: str, subject: str):
    """Handle Combined Science question generation and display"""
    try:
        # Check and deduct credits for combined science topical question
        from services.advanced_credit_service import advanced_credit_service

        credit_result = advanced_credit_service.check_and_deduct_credits(
            user_id, 
            'combined_science_topical',  # 1 credit as per config
            None
        )

        if not credit_result['success']:
            if credit_result.get('insufficient'):
                # Show gamified insufficient credits message
                current_credits = credit_result['current_credits']
                required_credits = credit_result['required_credits']
                shortage = credit_result['shortage']

                insufficient_msg = f"""💰 **Need More Credits!** 💰

🧪 **Combined Science - {subject}**
🎯 Action: Topical Question

💳 **Credit Status:**
• Current Credits: {current_credits}
• Required Credits: {required_credits}
• Need: {shortage} more credits

🎮 **Combined Science Benefits:**
• Biology, Chemistry & Physics topics
• ZIMSEC exam-style questions
• XP and level progression
• Streak building opportunities
• AI-powered explanations

💎 **Get More Credits:**"""

                buttons = [
                    {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                    {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                    {"text": "🏠 Main Menu", "callback_data": "main_menu"}
                ]

                whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                return
            else:
                whatsapp_service.send_message(user_id, credit_result['message'])
                return

        from services.question_service import QuestionService
        from database.external_db import get_user_registration, get_user_stats

        question_service = QuestionService()
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"

        # Get a random topic for the subject
        from constants import TOPICS
        topics = TOPICS.get(subject, [])
        if not topics:
            whatsapp_service.send_message(user_id, f"❌ No topics available for {subject}")
            return

        import random
        topic = random.choice(topics)
        difficulty = "medium"  # Default difficulty

        # Get question
        question_data = question_service.get_question(user_id, subject, topic, difficulty, force_ai=True)

        if not question_data:
            whatsapp_service.send_message(user_id, f"❌ Could not generate {subject} question. Please try again.")
            return

        # Store question in session
        from database.session_db import store_user_session
        store_user_session(user_id, {
            'question_data': question_data,
            'subject': subject,
            'topic': topic,
            'difficulty': difficulty,
            'session_type': 'combined_science'
        })

        # Display question with proper formatting including credit deduction info
        user_stats = get_user_stats(user_id)
        current_level = user_stats.get('level', 1)

        # Enhanced gamified question display
        message = f"🧪 **{subject} Topical Question** 🧪\n\n"
        message += f"👤 **Student:** {user_name} (Level {current_level})\n"
        message += f"📚 **Topic:** {topic}\n"
        message += f"💳 **Credits Deducted:** {credit_result['deducted']}\n"
        message += f"💰 **New Balance:** {credit_result['new_balance']}\n\n"

        message += f"❓ **Question:**\n{question_data['question']}\n\n"

        # Format options properly - ensure all 4 options (A, B, C, D) are shown
        if 'options' in question_data and question_data['options']:
            if isinstance(question_data['options'], dict):
                message += f"A) {question_data['options'].get('A', '')}\n"
                message += f"B) {question_data['options'].get('B', '')}\n"
                message += f"C) {question_data['options'].get('C', '')}\n"
                message += f"D) {question_data['options'].get('D', '')}\n\n"
            elif isinstance(question_data['options'], list) and len(question_data['options']) >= 4:
                message += f"A) {question_data['options'][0].replace('A. ', '').replace('A) ', '')}\n"
                message += f"B) {question_data['options'][1].replace('B. ', '').replace('B) ', '')}\n"
                message += f"C) {question_data['options'][2].replace('C. ', '').replace('C) ', '')}\n"
                message += f"D) {question_data['options'][3].replace('D. ', '').replace('D) ', '')}\n\n"

        message += f"💭 *Choose your answer!*"

        # Create all 4 answer buttons (A, B, C, D)
        buttons = [
            {"text": "A", "callback_data": f"combined_answer_{subject}_A"},
            {"text": "B", "callback_data": f"combined_answer_{subject}_B"},
            {"text": "C", "callback_data": f"combined_answer_{subject}_C"},
            {"text": "D", "callback_data": f"combined_answer_{subject}_D"}
        ]

        whatsapp_service.send_interactive_message(user_id, message, buttons)

    except Exception as e:
        logger.error(f"Error in combined science question for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, f"❌ Error generating {subject} question. Please try again.")

def handle_combined_science_answer(user_id: str, subject: str, user_answer: str):
    """Handle Combined Science answer processing with enhanced gamification"""
    try:
        from database.external_db import get_user_registration, get_user_stats, add_xp, update_streak, update_user_stats
        from database.session_db import get_user_session, clear_user_session
        import json

        # Get user info
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"

        session_data = get_user_session(user_id)

        if not session_data or session_data.get('session_type') != 'combined_science':
            whatsapp_service.send_message(user_id, "❌ Session expired or invalid. Please start a new question.")
            return

        # Parse question data from session
        question_data = session_data.get('question_data', {})
        if isinstance(question_data, str):
            question_data = json.loads(question_data)

        topic = session_data.get('topic', 'Unknown Topic')
        difficulty = session_data.get('difficulty', 'medium')

        correct_answer = question_data.get('correct_answer', question_data.get('answer', ''))
        points = question_data.get('points', 10)
        explanation = question_data.get('explanation', 'No explanation available.')

        is_correct = user_answer.upper() == correct_answer.upper()

        # Track analytics for combined science question attempt
        analytics_tracker.track_question_attempt(
            user_id=user_id,
            subject=f"Combined Science - {subject}",
            topic=topic,
            difficulty=difficulty,
            is_correct=is_correct,
            time_taken=90,  # Average time for combined science questions
            credits_used=1  # Combined science topical questions use 1 credit per config
        )

        # Get current stats for calculations
        current_stats = get_user_stats(user_id) or {}
        current_xp = current_stats.get('xp_points', 0)
        current_streak = current_stats.get('streak', 0)
        current_level = current_stats.get('level', 1)

        # Update stats based on answer
        if is_correct:
            # Award XP and update streak
            add_xp(user_id, points, 'combined_science_topical')
            update_streak(user_id)

            # Check for level up
            new_xp = current_xp + points
            new_level = max(1, (new_xp // 100) + 1)
            new_streak = current_streak + 1

            if new_level > current_level:
                update_user_stats(user_id, {'level': new_level})
        else:
            # Reset streak on incorrect answer
            update_streak(user_id)
            new_xp = current_xp
            new_level = current_level
            new_streak = 0

        # Update total attempts and correct answers
        update_user_stats(user_id, {
            'total_attempts': current_stats.get('total_attempts', 0) + 1,
            'correct_answers': current_stats.get('correct_answers', 0) + (1 if is_correct else 0)
        })

        # Get updated stats for display
        updated_stats = get_user_stats(user_id) or {}
        final_credits = updated_stats.get('credits', 0)
        final_xp = updated_stats.get('xp_points', 0)
        final_streak = updated_stats.get('streak', 0)
        final_level = updated_stats.get('level', 1)

        # Enhanced gamified result message
        if is_correct:
            message = f"🎉 **OUTSTANDING!** {user_name}! 🎉\n\n"
            message += f"✅ **Correct Answer:** {correct_answer}\n"
            message += f"🧪 **Subject:** {subject}\n"
            message += f"📚 **Topic:** {topic}\n"
            message += f"💎 **XP Earned:** +{points}\n"
            message += f"🔥 **Streak:** {final_streak}\n\n"

            # Special streak messages for Combined Science
            if final_streak >= 10:
                message += f"🏆 **SCIENCE MASTER!** You're dominating Combined Science!\n"
            elif final_streak >= 5:
                message += f"⚡ **SCIENCE STREAK!** Keep those experiments going!\n"
            elif final_streak >= 3:
                message += f"🧬 **BUILDING KNOWLEDGE!** Science skills growing!\n"
            message += "\n"
        else:
            message = f"📚 **Keep Experimenting,** {user_name}! 📚\n\n"
            message += f"🎯 **Correct Answer:** {correct_answer}\n"
            message += f"🧪 **Subject:** {subject}\n"
            message += f"📚 **Topic:** {topic}\n"
            message += f"💡 **Science Tip:** Every scientist learns from trials!\n"
            message += f"🔥 **Streak:** {final_streak} (Keep trying to build it up!)\n\n"

        # Add short, summarized explanation (no truncation - generate appropriate length)
        if explanation and len(explanation) > 150:
            # Use first 2 sentences as summary instead of truncating
            import re
            sentences = re.split(r'[.!?]+', explanation)
            if len(sentences) >= 2:
                summary_explanation = '. '.join(sentences[:2]) + '.'
            else:
                summary_explanation = explanation[:150] + '.'
        else:
            summary_explanation = explanation

        message += f"🔬 **Scientific Explanation:**\n{summary_explanation}\n\n"

        # Check for level up
        level_up_bonus = ""
        if is_correct and new_level > current_level:
            level_up_bonus = f"🎉 **LEVEL UP!** Welcome to Level {new_level}!"

        # Enhanced gamified stats display
        message += f"🎮 **Your Science Progress** 🎮\n"
        message += f"━━━━━━━━━━━━━━━━━━━━\n"
        message += f"💰 **Credits:** {final_credits}\n"
        message += f"⚡ **Total XP:** {final_xp}\n"
        message += f"🔥 **Current Streak:** {final_streak}\n"
        message += f"🏆 **Level:** {final_level}\n"

        # Add level progress
        xp_for_next_level = (final_level * 100) - final_xp
        if xp_for_next_level > 0:
            message += f"📈 **Next Level:** {xp_for_next_level} XP away!\n"
        else:
            message += f"🌟 **Science Expert!** Keep exploring!\n"

        message += f"━━━━━━━━━━━━━━━━━━━━\n"

        if level_up_bonus:
            message += f"\n{level_up_bonus}\n"

        # Enhanced navigation buttons with gamification
        buttons = [
            {"text": f"➡️ Next {subject} (+{points} XP)", "callback_data": f"combined_science_{subject.lower()}"},
            {"text": "📚 Change Subject", "callback_data": "subject_ordinary_combined_science"},
            {"text": "💰 Buy More Credits", "callback_data": "credit_store"},
            {"text": "🏠 Main Menu", "callback_data": "main_menu"}
        ]

        whatsapp_service.send_interactive_message(user_id, message, buttons)

        # Clear session
        clear_user_session(user_id)

    except Exception as e:
        logger.error(f"Error handling combined science answer for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error processing your answer. Please try again.")


# Payment system handlers
def handle_package_selection(user_id: str, package_id: str):
    """Handle credit package selection"""
    try:
        from services.advanced_credit_service import advanced_credit_service

        # Get package details
        packages = advanced_credit_service.get_credit_packages()
        selected_package = next((p for p in packages if p['id'] == package_id), None)

        if not selected_package:
            whatsapp_service.send_message(user_id, "❌ Package not found. Please try again.")
            return

        # Create artistic package details message
        cost_per_credit = selected_package['price'] / selected_package['credits']
        savings_percent = round((1 - cost_per_credit / 0.10) * 100) if cost_per_credit < 0.10 else 0

        message = f"""✨ 𝗣𝗔𝗖𝗞𝗔𝗚𝗘 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 ✨
╔══════════════════════════╗
║ {selected_package['icon']} **{selected_package['name'].upper()}** {selected_package['icon']} ║
╚══════════════════════════╝

💰 **Price**: ${selected_package['price']:.2f} USD
💎 **Credits**: {selected_package['credits']} credits
🏷️ **Per Credit**: ${cost_per_credit:.3f}{"" if savings_percent <= 0 else f" ({savings_percent}% savings!)"}

🎯 **Perfect For**: {selected_package['description']}
💡 **Best For**: {selected_package['best_for']}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Ready to power up your learning?"""

        buttons = [
            {"text": "✅ PURCHASE THIS PACKAGE", "callback_data": f"purchase_package_{package_id}"},
            {"text": "🔍 View Other Packages", "callback_data": "credit_store"},
            {"text": "❌ Cancel Purchase", "callback_data": "back_to_menu"}
        ]

        whatsapp_service.send_interactive_message(user_id, message, buttons)

    except Exception as e:
        logger.error(f"Error handling package selection for {user_id}: {e}")
        whatsapp_service.send_message(user_id, "❌ Error loading package details. Please try again.")

def handle_purchase_confirmation(user_id: str, package_id: str):
    """Handle purchase confirmation and show payment method selection"""
    try:
        from services.advanced_credit_service import advanced_credit_service
        from services.paynow_service import paynow_service

        # Get package details
        packages = advanced_credit_service.get_credit_packages()
        selected_package = next((p for p in packages if p['id'] == package_id), None)

        if not selected_package:
            whatsapp_service.send_message(user_id, "❌ Package not found. Please try again.")
            return

        message = f"""💳 ✨ 𝗖𝗛𝗢𝗢𝗦𝗘 𝗣𝗔𝗬𝗠𝗘𝗡𝗧 𝗠𝗘𝗧𝗛𝗢𝗗 ✨ 💳
╔═══════════════════════════════╗
║    {selected_package['icon']} {selected_package['name'].upper()} {selected_package['icon']}    ║
╚═══════════════════════════════╝

💰 **Amount**: ${selected_package['price']:.2f} USD
💎 **Credits**: {selected_package['credits']} credits

🚀 **CHOOSE YOUR PAYMENT METHOD:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"""

        # Prepare payment method buttons
        buttons = []

        # Check if Paynow is available and add instant payment option
        if paynow_service.is_available():
            buttons.append({
                "text": "⚡ Paynow USD EcoCash (INSTANT)", 
                "callback_data": f"paynow_payment_{package_id}"
            })
            message += "\n⚡ **Paynow USD EcoCash** - Instant payment & automatic credits"

        # Always add manual payment option as fallback
        buttons.extend([
            {"text": "📱 Manual EcoCash SMS Verification", "callback_data": f"manual_payment_{package_id}"},
            {"text": "⬅️ BACK", "callback_data": f"select_package_{package_id}"}
        ])

        message += "\n📱 **Manual EcoCash** - Traditional SMS verification (5-30 mins)"
        message += "\n\n🔒 **Both methods are 100% secure and verified**"

        whatsapp_service.send_interactive_message(user_id, message, buttons)

    except Exception as e:
        logger.error(f"Error handling purchase confirmation for {user_id}: {e}")
        whatsapp_service.send_message(user_id, "❌ Error processing purchase. Please try again.")

def handle_credit_store(user_id: str):
    """Handle credit store interactions"""
    try:
        from services.advanced_credit_service import advanced_credit_service

        # Get credit store message and buttons
        message, buttons = advanced_credit_service.format_credit_store_message(user_id)

        # Send credit store
        whatsapp_service.send_interactive_message(user_id, message, buttons)

    except Exception as e:
        logger.error(f"Error handling credit store for {user_id}: {e}")
        whatsapp_service.send_message(user_id, "❌ Error loading credit store. Please try again.")

def handle_payment_proof_request(user_id: str):
    """Handle payment proof submission request"""
    try:
        from database.session_db import get_user_session, save_user_session
        from services.payment_service import PaymentService

        # Get user session
        session = get_user_session(user_id)

        if not session or session.get('session_type') != 'payment_flow':
            whatsapp_service.send_message(user_id, "❌ No active payment session found. Please start a new payment.")
            show_credit_packages(user_id)
            return

        # Get custom data from session
        custom_data = session.get('custom_data', {})
        if isinstance(custom_data, str):
            try:
                custom_data = json.loads(custom_data)
            except:
                custom_data = {}

        reference_code = custom_data.get('reference_code')
        if not reference_code:
            whatsapp_service.send_message(user_id, "❌ Payment reference not found. Please start a new payment.")
            show_credit_packages(user_id)
            return

        # Update session to expect payment proof
        save_user_session(user_id, {
            **session,
            'step': 'awaiting_proof'
        })

        # Show payment proof submission form
        message = payment_service.get_payment_proof_submission_message(reference_code)

        whatsapp_service.send_message(user_id, message)

    except Exception as e:
        logger.error(f"Error handling payment proof request for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error processing payment proof request. Please try again.")

def handle_payment_help(user_id: str):
    """Handle payment help request"""
    try:
        from services.payment_service import PaymentService

        help_message = f"💡 **PAYMENT HELP**\n\n"
        help_message += f"📱 **EcoCash Payment Process:**\n"
        help_message += f"1️⃣ Select a credit package\n"
        help_message += f"2️⃣ Send money to: {payment_service.ecocash_number}\n"
        help_message += f"3️⃣ Copy your confirmation SMS\n"
        help_message += f"4️⃣ Submit SMS for verification\n"
        help_message += f"5️⃣ Wait for approval (5-30 minutes)\n\n"
        help_message += f"❓ **Common Issues:**\n"
        help_message += f"• Make sure to send exact amount\n"
        help_message += f"• Include reference code if prompted\n"
        help_message += f"• Submit complete SMS confirmation\n"
        help_message += f"• Contact support if payment fails\n\n"
        help_message += f"📞 **Need More Help?**\n"
        help_message += f"Contact our support team for assistance."

        buttons = [
            {'text': "💰 Try Payment Again", 'callback_data': 'buy_credits'},
            {'text': "🏠 Back to Menu", 'callback_data': 'main_menu'}
        ]

        whatsapp_service.send_interactive_message(user_id, help_message, buttons)

    except Exception as e:
        logger.error(f"Error handling payment help for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error loading payment help. Please try again.")

def handle_payment_proof_submission(user_id: str, package_id: str, reference_code: str):
    """Handle payment proof submission from user - prompts for SMS text"""
    try:
        from services.payment_service import PaymentService
        from database.session_db import get_user_session, save_user_session
        from database.external_db import get_user_registration

        payment_service = PaymentService()

        # Get user session data
        user_session = get_user_session(user_id)
        if not user_session or user_session.get('session_type') != 'payment_flow':
            whatsapp_service.send_message(user_id, "❌ No active payment session found. Please try again.")
            return

        # Get custom data from session
        custom_data = user_session.get('custom_data', {})
        if isinstance(custom_data, str):
            try:
                custom_data = json.loads(custom_data)
            except:
                custom_data = {}

        # Verify reference code
        if custom_data.get('reference_code') != reference_code:
            whatsapp_service.send_message(user_id, "❌ Payment reference code mismatch. Please try again.")
            return

        # Get package details
        package = payment_service.get_package_by_id(package_id)
        if not package:
            whatsapp_service.send_message(user_id, "❌ Package not found. Please try again.")
            return

        # Get user registration for name
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"

        # Update user session to awaiting proof
        custom_data['awaiting_proof'] = True
        user_session['step'] = 'awaiting_proof'
        user_session['custom_data'] = json.dumps(custom_data)
        save_user_session(user_id, user_session)

        # Send artistic waiting message
        waiting_message = f"""📱 ✨ 𝗔𝗪𝗔𝗜𝗧𝗜𝗡𝗚 𝗦𝗠𝗦 ✨ 📱
╔═══════════════════════════════╗
║     📋 PASTE YOUR SMS PROOF     📋  ║
╚═══════════════════════════════╝

👋 Hi **{user_name}**! Ready to receive your EcoCash confirmation SMS.

📄 **Expected Format:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Confirmed. You have sent ${package['price']:.2f} to +263785494594..."

💡 **Quick Tips:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Copy the ENTIRE SMS from EcoCash
✅ Include the transaction ID
✅ Verify amount matches ${package['price']:.2f}

📲 **Please paste your EcoCash confirmation SMS below:**"""

        whatsapp_service.send_message(user_id, waiting_message)

        # Log for monitoring
        logger.info(f"Payment proof request sent to {user_id} for package {package_id}, reference {reference_code}")

    except Exception as e:
        logger.error(f"Error handling payment proof submission for {user_id}: {e}")
        whatsapp_service.send_message(user_id, "❌ Error processing payment proof. Please try again.")

def handle_payment_proof_text(user_id: str, proof_text: str):
    """Handle the actual payment proof text submission"""
    try:
        from services.payment_service import PaymentService
        from database.session_db import get_user_session, clear_user_session
        from database.external_db import get_user_registration

        payment_service = PaymentService()

        # Get user session
        user_session = get_user_session(user_id)
        if not user_session or user_session.get('session_type') != 'payment_flow':
            return False

        # Get custom data
        custom_data = user_session.get('custom_data', {})
        if isinstance(custom_data, str):
            try:
                custom_data = json.loads(custom_data)
            except:
                custom_data = {}

        if not custom_data.get('awaiting_proof'):
            return False

        package_id = custom_data.get('package_id')
        reference_code = custom_data.get('reference_code')

        if not package_id or not reference_code:
            clear_user_session(user_id)

            message = """❌ **Payment Session Expired**

Your payment session has expired or was incomplete. 

🔄 **To purchase credits:**
1. Click "💰 Buy Credits" below 
2. Select your desired package
3. Follow the payment instructions

💡 **Tip:** Complete the payment process within 10 minutes to avoid session timeout."""

            buttons = [
                {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]

            whatsapp_service.send_interactive_message(user_id, message, buttons)
            return True

        # Get package details
        package = payment_service.get_package_by_id(package_id)
        if not package:
            whatsapp_service.send_message(user_id, "❌ Package not found. Please try again.")
            clear_user_session(user_id)
            return True

        # Get user name
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"

        # Submit payment proof
        result = payment_service.submit_payment_proof(user_id, package_id, reference_code, proof_text)

        if result['success']:
            # Clear the session
            clear_user_session(user_id)

            # Send artistic success message with tracking
            message = f"""✨ 𝗣𝗔𝗬𝗠𝗘𝗡𝗧 𝗦𝗨𝗕𝗠𝗜𝗧𝗧𝗘𝗗! ✨
╔═══════════════════════════════╗
║    🎉 VERIFICATION IN PROGRESS 🎉   ║
╚═══════════════════════════════╝

👋 Hi **{user_name}**! Your payment proof has been received and is being processed.

💎 **𝗬𝗼𝘂𝗿 𝗢𝗿𝗱𝗲𝗿:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Package: **{package['name']}**
💰 Credits: **{package['credits']} credits**
💳 Amount: **${package['price']:.2f}**
🔢 Reference: `{reference_code}`
⏰ Submitted: {datetime.now().strftime('%H:%M on %d/%m/%Y')}

🚀 **𝗪𝗵𝗮𝘁'𝘀 𝗡𝗲𝘅𝘁?**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Verification: 5-30 minutes
📱 Notification: WhatsApp alert
💎 Credits: Instant activation
🎯 Learning: Start immediately!

💡 **Pro Tip**: Continue using existing credits while we verify your payment!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"""

            buttons = [
                {"text": "🏠 MAIN MENU", "callback_data": "back_to_menu"},
                {"text": "📚 CONTINUE STUDYING", "callback_data": "start_quiz"},
                {"text": "💬 CONTACT SUPPORT", "callback_data": "contact_support"}
            ]

            whatsapp_service.send_interactive_message(user_id, message, buttons)

            # Log successful submission
            logger.info(f"Payment proof successfully submitted by {user_id} ({user_name}) for {package['name']} - ${package['price']}")

            # Notify admin dashboard (webhook for real-time updates)
            notify_admin_new_payment(user_id, package_id, reference_code, package['price'])

            return True

        else:
            whatsapp_service.send_message(user_id, f"❌ Error submitting payment proof: {result['message']}\n\nPlease try again or contact support.")
            return True

    except Exception as e:
        logger.error(f"Error handling payment proof text for {user_id}: {e}")
        whatsapp_service.send_message(user_id, "❌ Error processing payment proof. Please contact support.")
        return True

def notify_admin_new_payment(user_id: str, package_id: str, reference_code: str, amount: float):
    """Send notification to admin dashboard about new payment"""
    try:
        # In production, this would send a webhook or real-time notification
        # For now, we'll log it prominently
        logger.info(f"""
=== NEW PAYMENT SUBMISSION ===
User ID: {user_id}
Package: {package_id}
Amount: ${amount}
Reference: {reference_code}
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Status: Awaiting Admin Review
==============================
        """)

        # You could also send a notification to admin WhatsApp numbers
        # admin_numbers = ["admin_whatsapp_id_1", "admin_whatsapp_id_2"]
        # for admin_id in admin_numbers:
        #     whatsapp_service.send_message(admin_id, f"💰 New payment submission: {reference_code} - ${amount}")

    except Exception as e:
        logger.error(f"Error notifying admin about new payment: {e}")

@webhook_bp.route('/test-registration', methods=['POST'])
def test_registration_endpoint():
    """Test endpoint to verify registration works with Supabase"""
    try:
        from database.external_db import create_user_registration, get_user_registration
        import uuid

        # Generate test data
        test_chat_id = f"test_{uuid.uuid4().hex[:8]}"
        test_name = "Test"
        test_surname = "Student"  
        test_dob = "01/01/2000"

        logger.info(f"🧪 Testing registration for {test_chat_id}")

        # Attempt registration
        result = create_user_registration(
            chat_id=test_chat_id,
            name=test_name,
            surname=test_surname,
            date_of_birth=test_dob
        )

        if result:
            # Verify the registration was saved
            retrieved = get_user_registration(test_chat_id)

            return jsonify({
                'status': 'registration_test_success',
                'message': '✅ Registration test PASSED - Supabase is working correctly!',
                'test_chat_id': test_chat_id,
                'registered_data': result,
                'retrieved_data': retrieved,
                'nerdx_id': result.get('nerdx_id'),
                'timestamp': datetime.now().isoformat()
            }), 200
        else:
            return jsonify({
                'status': 'registration_test_failed',
                'message': '❌ Registration test FAILED - Supabase connection issues',
                'test_chat_id': test_chat_id,
                'timestamp': datetime.now().isoformat()
            }), 500

    except Exception as e:
        logger.error(f"Registration test error: {e}")
        return jsonify({
            'status': 'registration_test_error',
            'error': str(e),
            'message': '💥 Registration test crashed - check logs',
            'timestamp': datetime.now().isoformat()
        }), 500

@webhook_bp.route('/diagnose', methods=['GET'])
def diagnose_supabase():
    """Diagnose Supabase issues and provide detailed information"""
    try:
        from database.external_db import diagnose_supabase_issues

        # Run comprehensive diagnosis
        diagnosis = diagnose_supabase_issues()

        return jsonify({
            'status': 'diagnosis_complete',
            'timestamp': datetime.now().isoformat(),
            'diagnosis': diagnosis
        }), 200

    except Exception as e:
        logger.error(f"Diagnosis endpoint error: {e}")
        return jsonify({
            'status': 'diagnosis_failed',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

def handle_paynow_payment(user_id: str, package_id: str):
    """Handle Paynow USD EcoCash instant payment"""
    try:
        from services.advanced_credit_service import advanced_credit_service
        from services.paynow_service import paynow_service
        from database.external_db import get_user_registration

        # Get package details
        packages = advanced_credit_service.get_credit_packages()
        selected_package = next((p for p in packages if p['id'] == package_id), None)

        if not selected_package:
            whatsapp_service.send_message(user_id, "❌ Package not found. Please try again.")
            return

        # Check if Paynow is available
        if not paynow_service.is_available():
            whatsapp_service.send_message(user_id, 
                "❌ **Paynow Service Unavailable**\n\n"
                "The instant payment system is temporarily unavailable. "
                "Please use manual payment method.")
            handle_manual_payment(user_id, package_id)
            return

        # Get user registration for contact details
        registration = get_user_registration(user_id)
        if not registration:
            whatsapp_service.send_message(user_id, "❌ Registration not found. Please try again.")
            return

        # Collect user phone number
        message = f"""📱 **PAYNOW USD ECOCASH PAYMENT** ⚡

🎯 **Package**: {selected_package['name']}
💰 **Amount**: ${selected_package['price']:.2f} USD
💎 **Credits**: {selected_package['credits']} credits

⚡ **INSTANT PAYMENT SETUP**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 **Please provide your EcoCash number** for instant payment:

Format: 077XXXXXXX or 078XXXXXXX or +263XXXXXXXXX

💡 **Benefits of Paynow:**
✅ Instant credit delivery (5-30 seconds)
✅ Automatic payment processing
✅ Secure & encrypted transactions
✅ No manual verification needed

Just reply with your EcoCash number and we'll handle the rest!"""

        # Store package info in session for phone number collection
        from database.session_db import save_user_session
        payment_session_data = {
            'session_type': 'paynow_phone_collection',
            'step': 'collecting_phone',
            'custom_data': json.dumps({
                'package_id': package_id,
                'amount': selected_package['price'],
                'credits': selected_package['credits'],
                'timestamp': datetime.now().isoformat()
            })
        }
        save_user_session(user_id, payment_session_data)

        whatsapp_service.send_message(user_id, message)

    except Exception as e:
        logger.error(f"Error handling Paynow payment for {user_id}: {e}")
        whatsapp_service.send_message(user_id, "❌ Error processing Paynow payment. Please try again.")

def handle_manual_payment(user_id: str, package_id: str):
    """Handle manual EcoCash SMS verification payment"""
    try:
        from services.advanced_credit_service import advanced_credit_service

        # Get package details
        packages = advanced_credit_service.get_credit_packages()
        selected_package = next((p for p in packages if p['id'] == package_id), None)

        if not selected_package:
            whatsapp_service.send_message(user_id, "❌ Package not found. Please try again.")
            return

        # Generate unique reference code
        import uuid
        reference_code = str(uuid.uuid4())[:8].upper()

        message = f"""💳 ✨ 𝗠𝗔𝗡𝗨𝗔𝗟 𝗘𝗖𝗢𝗖𝗔𝗦𝗛 𝗣𝗔𝗬𝗠𝗘𝗡𝗧 ✨ 💳
╔═══════════════════════════════╗
║       🚀 SECURE CHECKOUT 🚀     ║
╚═══════════════════════════════╝

📱 **𝗘𝗖𝗢𝗖𝗔𝗦𝗛 𝗣𝗔𝗬𝗠𝗘𝗡𝗧:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 **Number**: +263 785494594
💰 **Amount**: ${selected_package['price']:.2f} USD
📋 **Reference**: `{reference_code}`

🎯 **𝗦𝗜𝗠𝗣𝗟𝗘 𝗦𝗧𝗘𝗣𝗦:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ Send ${selected_package['price']:.2f} to +263 785494594
2️⃣ Copy your EcoCash confirmation SMS
3️⃣ Click "I SENT MONEY" below
4️⃣ Paste SMS → Get credits in 5-30 mins!

🛡️ **𝗪𝗵𝘆 𝗦𝗠𝗦 𝗩𝗲𝗿𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻?**
100% secure • Instant verification • Protected payments

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"""

        buttons = [
            {"text": "✅ I SENT MONEY - SUBMIT PROOF", "callback_data": f"submit_proof_{package_id}_{reference_code}"},
            {"text": "❓ NEED HELP?", "callback_data": "payment_help"},
            {"text": "⬅️ BACK", "callback_data": f"select_package_{package_id}"}
        ]

        # Store payment session in user session
        from database.session_db import save_user_session
        payment_session_data = {
            'session_type': 'payment_flow',
            'step': 'awaiting_proof',
            'custom_data': json.dumps({
                'package_id': package_id,
                'reference_code': reference_code,
                'amount': selected_package['price'],
                'credits': selected_package['credits'],
                'timestamp': datetime.now().isoformat()
            })
        }
        save_user_session(user_id, payment_session_data)

        whatsapp_service.send_interactive_message(user_id, message, buttons)

    except Exception as e:
        logger.error(f"Error handling manual payment for {user_id}: {e}")
        whatsapp_service.send_message(user_id, "❌ Error processing manual payment. Please try again.")

def handle_paynow_phone_collection(user_id: str, phone_number: str):
    """Handle phone number collection for Paynow payment"""
    try:
        from services.paynow_service import paynow_service
        from services.advanced_credit_service import advanced_credit_service
        from database.session_db import get_user_session, save_user_session, clear_user_session
        import re

        # Get user session
        session = get_user_session(user_id)
        if not session or session.get('session_type') != 'paynow_phone_collection':
            whatsapp_service.send_message(user_id, "❌ No active Paynow session found. Please try again.")
            return

        # Get custom data
        custom_data = session.get('custom_data', {})
        if isinstance(custom_data, str):
            try:
                custom_data = json.loads(custom_data)
            except:
                custom_data = {}

        package_id = custom_data.get('package_id')
        amount = custom_data.get('amount')
        credits = custom_data.get('credits')

        if not all([package_id, amount, credits]):
            whatsapp_service.send_message(user_id, "❌ Session data incomplete. Please try again.")
            clear_user_session(user_id)
            return

        # Validate and normalize phone number
        phone_cleaned = re.sub(r'[^\d+]', '', phone_number.strip())

        # Normalize to local format first for validation
        local_phone = phone_cleaned
        if phone_cleaned.startswith('+263'):
            local_phone = '0' + phone_cleaned[4:]  # +263771111111 -> 0771111111
        elif phone_cleaned.startswith('263'):
            local_phone = '0' + phone_cleaned[3:]  # 263771111111 -> 0771111111

        # Validate local format
        if not (len(local_phone) == 10 and local_phone.startswith('07') and 
                local_phone[:3] in ['077', '078']):
            whatsapp_service.send_message(user_id, 
                "❌ **Invalid Phone Number Format**\n\n"
                "Please provide a valid Zimbabwe EcoCash number:\n"
                "• Format: 077XXXXXXX or 078XXXXXXX\n"
                "• Example: 0771234567\n\n"
                "Please send your EcoCash number again:")
            return

        # Convert to international format for Paynow
        international_phone = '+263' + local_phone[1:]  # 0771111111 -> +2637711111111

        # Clear session to prevent duplicate submissions
        clear_user_session(user_id)

        # Send processing message
        whatsapp_service.send_message(user_id, 
            f"⚡ **PROCESSING PAYNOW PAYMENT...**\n\n"
            f"📱 Phone: {local_phone}\n"
            f"💰 Amount: ${amount:.2f} USD\n"
            f"💎 Credits: {credits}\n\n"
            f"🔄 Creating payment link... Please wait...")

        # Initiate Paynow payment using local format (Paynow expects 0771111111 format)
        try:
            payment_response = paynow_service.create_usd_ecocash_payment(
                amount=amount,
                phone_number=local_phone,  # Use local format 0771111111
                email="neezykidngoni@gmail.com",  # Paynow account email
                reference=f"CREDITS_{package_id}_{user_id}",
                description=f"NerdX Quiz Credits - {credits} credits"
            )

            if payment_response.get('success'):
                poll_url = payment_response.get('poll_url')
                redirect_url = payment_response.get('redirect_url')

                if redirect_url:
                    # Success - send payment link
                    message = f"""✅ **PAYNOW PAYMENT READY!** ⚡

📱 **Payment Details:**
• Phone: {local_phone}
• Amount: ${amount:.2f} USD
• Credits: {credits}

🚀 **Next Step:**
Click the link below to complete your EcoCash payment:

{redirect_url}

⏱️ **What happens next:**
1️⃣ Click the payment link
2️⃣ Authorize the payment on your phone
3️⃣ Credits will be added automatically (5-30 seconds)

💡 **Payment expires in 5 minutes**"""

                    whatsapp_service.send_message(user_id, message)

                    # Store poll URL for payment status checking
                    if poll_url:
                        logger.info(f"Paynow payment initiated for {user_id}: poll_url={poll_url}")

                else:
                    # Fallback to manual payment
                    whatsapp_service.send_message(user_id, 
                        "❌ **Payment Link Generation Failed**\n\n"
                        "The instant payment system encountered an issue. "
                        "Let's use manual payment instead.")
                    handle_manual_payment(user_id, package_id)

            else:
                error_msg = payment_response.get('error', 'Unknown error')
                logger.error(f"Paynow payment failed for {user_id}: {error_msg}")

                whatsapp_service.send_message(user_id, 
                    f"❌ **Payment Processing Failed**\n\n"
                    f"Error: {error_msg}\n\n"
                    f"Let's use manual payment instead.")
                handle_manual_payment(user_id, package_id)

        except Exception as payment_error:
            logger.error(f"Paynow payment exception for {user_id}: {payment_error}")
            whatsapp_service.send_message(user_id, 
                "❌ **Payment System Error**\n\n"
                "The instant payment system is temporarily unavailable. "
                "Let's use manual payment instead.")
            handle_manual_payment(user_id, package_id)

    except Exception as e:
        logger.error(f"Error handling Paynow phone collection for {user_id}: {e}")
        whatsapp_service.send_message(user_id, "❌ Error processing phone number. Please try again.")