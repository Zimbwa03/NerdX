import logging
import json
import time
import threading
import os
import hmac
import hashlib
import base64
import urllib.parse
from typing import Dict, Optional
from collections import defaultdict
from flask import Blueprint, request, jsonify
from services.whatsapp_service import WhatsAppService
from services.whatsapp_template_service import get_template_service
from services.content_variation_engine import content_variation_engine
from services.quality_monitor import quality_monitor
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
from utils.menu_router import menu_router
from constants import TOPICS, MESSAGE_TEMPLATES, DIFFICULTY_LEVELS
from database.external_db import get_user_registration, get_user_stats, get_user_credits, deduct_credits
from utils.credit_units import format_credits
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
                    "🔒 *Access Denied - Registration Required*\n\n"
                    "You must complete registration before using NerdX Bot.\n\n"
                    "Please provide your first name:")
                user_service.start_registration(user_id)
                return None

            # User is registered, proceed with function
            return func(user_id, *args, *kwargs)

        except Exception as e:
            logger.error(f"Error in registration check for {func.__name__}: {e}")
            whatsapp_service.send_message(user_id, 
                "🔒 *System Security Error*\n\n"
                "Unable to verify registration status. Please try again.")
            return None

    return wrapper

# Message deduplication and rate limiting
processed_messages = {}  # In production, use Redis or database
user_last_message_time = defaultdict(float)
message_processing_lock = threading.Lock()

def is_duplicate_message(message_id: Optional[str]) -> bool:
    """Check and record duplicate message IDs to prevent reprocessing."""
    if not message_id:
        return False
    with message_processing_lock:
        if message_id in processed_messages:
            return True
        processed_messages[message_id] = time.time()
    return False

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

# Initialize Project Assistant handler
from handlers.project_assistant_handler import ProjectAssistantHandler
project_assistant_handler = ProjectAssistantHandler()

# Initialize Combined Science handler
from handlers.combined_science_handler import combined_science_handler

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
                    "❌ *Message Error*\n\nI received your message but couldn't read the text content. Please try typing your name again."
                )
                return

            # Final validation: ensure we have actual text content
            if len(actual_text.strip()) < 1:
                logger.error(f"❌ Text extraction failed for {user_id}, actual_text: '{actual_text}'")
                whatsapp_service.send_message(
                    user_id,
                    "❌ *Technical Issue*\n\nI'm having trouble reading your message. Please try again or contact support if the problem persists."
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
                "❌ *Sorry, I encountered an error processing your message.* Please try again in a moment."
            )
        except Exception as send_error:
            logger.error(f"Failed to send error message to {user_id}: {send_error}")

# Start cleanup thread
cleanup_thread = threading.Thread(target=cleanup_processed_messages, daemon=True)
cleanup_thread.start()

# Global session storage for question data
question_sessions = {}

# Session types where free-text input should not be hijacked by menu routing
MENU_ROUTING_BLOCKLIST = {
    'question',
    'math_question',
    'science_structured_question',
    'english_grammar',
    'english_vocabulary',
    'english_grammar_meta',
    'english_vocabulary_meta',
    'comprehension_questions',
    'comprehension_passage_ready',
    'essay_free_response',
    'essay_guided_composition',
    'essay_writing',
    'english_essay',
    'audio_chat',
    'project_assistant',
    'paynow_phone_collection',
    'payment_flow',
    'payment'
}

def try_route_menu_selection(user_id: str, message_text: str, session_type: Optional[str] = None) -> bool:
    """Route text replies to stored menu selections (Twilio text-only menus)."""
    allow_numbers = True
    latest_menu_source = menu_router.get_menu_source(user_id)
    if session_type and session_type in MENU_ROUTING_BLOCKLIST:
        # Avoid hijacking numeric/free-form answers during active learning sessions,
        # unless the latest menu shown was the main menu.
        if latest_menu_source != "main_menu":
            allow_numbers = False

    selection_id = menu_router.resolve_selection(user_id, message_text, allow_numbers=allow_numbers)
    if not selection_id:
        return False

    # If the user selected a main menu option while a session is active, exit the session first.
    if session_type and session_type in MENU_ROUTING_BLOCKLIST:
        if latest_menu_source == "main_menu":
            session_manager.clear_session(user_id)

    handle_interactive_message(user_id, {'button_reply': {'id': selection_id}})
    return True

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

def verify_webhook_signature(data: bytes, signature: str, url: str = None, form_data: dict = None) -> bool:
    """Verify Twilio webhook signature for security"""
    try:
        if not signature:
            logger.warning("No signature provided")
            return False

        # Get the Twilio auth token from environment
        auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        if not auth_token:
            logger.error("TWILIO_AUTH_TOKEN not configured")
            return False

        # Twilio signature validation requires the full URL (with query string) and sorted POST parameters
        if form_data:
            # Sort parameters alphabetically by key and concatenate as key+value pairs
            sorted_params = sorted(form_data.items())
            param_string = ''.join(f"{key}{value}" for key, value in sorted_params)
            # Use the full URL including query parameters
            signature_string = url + param_string
        else:
            # For JSON requests, use the URL and request body
            signature_string = url + data.decode('utf-8') if url else data.decode('utf-8')

        # Calculate expected signature using HMAC SHA1
        expected_signature = hmac.new(
            auth_token.encode('utf-8'),
            signature_string.encode('utf-8'),
            hashlib.sha1
        ).digest()
        expected_signature_base64 = base64.b64encode(expected_signature).decode('utf-8')

        # Compare signatures (case-insensitive)
        if hmac.compare_digest(expected_signature_base64.lower(), signature.lower()):
            logger.info("Webhook signature verified successfully")
            return True
        else:
            logger.warning(f"Invalid webhook signature. Expected: {expected_signature_base64[:10]}..., Got: {signature[:10]}...")
            return False

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
    """Handle incoming WhatsApp webhook messages from Twilio"""
    try:
        # Verify Twilio webhook signature
        signature = request.headers.get('X-Twilio-Signature')
        require_signature = os.getenv('TWILIO_REQUIRE_SIGNATURE', 'true').lower() == 'true'
        
        # Get the full URL for signature validation
        full_url = request.url
        
        # Check if request is form-encoded (Twilio sends form data)
        if request.content_type and 'application/x-www-form-urlencoded' in request.content_type:
            form_data = dict(request.form)
            if require_signature and not signature:
                logger.warning("Missing Twilio signature header")
                return jsonify({'error': 'Missing signature'}), 401
            # Verify signature with form data
            if signature and not verify_webhook_signature(b'', signature, full_url, form_data):
                logger.warning("Invalid webhook signature")
                return jsonify({'error': 'Invalid signature'}), 401
        else:
            # For JSON requests, verify with request body
            request_data = request.get_data()
            if require_signature and not signature:
                logger.warning("Missing Twilio signature header (non-form request)")
                return jsonify({'error': 'Missing signature'}), 401
            if signature and not verify_webhook_signature(request_data, signature, full_url):
                logger.warning("Invalid webhook signature")
                return jsonify({'error': 'Invalid signature'}), 401

        # Parse webhook data - Twilio sends form data, not JSON
        if request.content_type and 'application/x-www-form-urlencoded' in request.content_type:
            form_data = dict(request.form)
            # Convert Twilio form data to a more usable format
            message_data = {
                'MessageSid': form_data.get('MessageSid'),
                'AccountSid': form_data.get('AccountSid'),
                'From': form_data.get('From'),
                'To': form_data.get('To'),
                'Body': form_data.get('Body'),
                'NumMedia': form_data.get('NumMedia', '0'),
            }
            
            # Handle Twilio webhook format (text or media)
            num_media_raw = message_data.get('NumMedia', '0') or '0'
            try:
                num_media = int(num_media_raw)
            except ValueError:
                num_media = 0

            if message_data.get('From') and (message_data.get('Body') or num_media > 0):
                # This is a Twilio WhatsApp message
                from_number = message_data.get('From', '')
                # Remove 'whatsapp:' prefix if present
                user_id = from_number.replace('whatsapp:', '') if from_number.startswith('whatsapp:') else from_number
                message_body = message_data.get('Body', '')
                message_sid = message_data.get('MessageSid')
                media_url = form_data.get('MediaUrl0')
                media_content_type = form_data.get('MediaContentType0', '')

                logger.info(f"📱 Received Twilio WhatsApp message from {user_id}: {message_body[:50]}...")
                logger.info(f"📱 Message SID: {message_sid}")

                if is_duplicate_message(message_sid):
                    logger.info(f"Duplicate message ignored (SID: {message_sid})")
                    return '<Response></Response>', 200, {'Content-Type': 'text/xml'}

                is_image = bool(num_media > 0 and media_url and media_content_type.startswith('image/'))
                if num_media > 0 and not is_image and not message_body:
                    # Unsupported media type with no text; respond gracefully.
                    threading.Thread(
                        target=whatsapp_service.send_message,
                        args=(
                            user_id,
                            'Thanks for your file. At the moment I can only process images (JPG/PNG). Please send a clear image or type your question.'
                        ),
                        daemon=True
                    ).start()
                    return '<Response></Response>', 200, {'Content-Type': 'text/xml'}

                # Convert Twilio format to internal message format
                if is_image:
                    internal_message = {
                        'from': user_id,
                        'type': 'image',
                        'image': {
                            'url': media_url,
                            'mime_type': media_content_type
                        },
                        'id': message_sid,
                        'timestamp': str(int(time.time()))
                    }
                else:
                    internal_message = {
                        'from': user_id,
                        'type': 'text',
                        'text': {'body': message_body},
                        'id': message_sid,
                        'timestamp': str(int(time.time()))
                    }

                if user_id:
                    # Process message in background to avoid timeout
                    message_type = 'image' if is_image else 'text'
                    threading.Thread(
                        target=process_message_background,
                        args=(internal_message, user_id, message_type),
                        daemon=True
                    ).start()
                    # Return TwiML response (Twilio expects XML)
                    return '<Response></Response>', 200, {'Content-Type': 'text/xml'}
                else:
                    logger.warning(f"Invalid Twilio message format: {message_data}")
                    return '<Response></Response>', 200, {'Content-Type': 'text/xml'}
            else:
                logger.warning(f"Twilio webhook missing required fields: {message_data}")
                return '<Response></Response>', 200, {'Content-Type': 'text/xml'}
        else:
            # Only Twilio webhooks are supported (form data)
            logger.warning("Webhook received non-Twilio format (expected form data)")
            return jsonify({'error': 'Only Twilio webhooks are supported'}), 400

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
        try:
            from services.vertex_service import vertex_service
            vertex_ai_available = vertex_service.is_available()
        except Exception:
            vertex_ai_available = False

        return jsonify({
            'status': 'healthy',
            'maintenance_mode': MAINTENANCE_MODE,
            'processed_messages_count': processed_count,
            'vertex_ai_available': vertex_ai_available,
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
        # Track user interaction for enterprise scale monitoring
        session_id = f"{user_id}_{int(time.time())}"
        analytics_tracker.track_user_session_start(user_id, session_id, {"platform": "whatsapp"})
        
        # Track engagement for scale protection
        try:
            from services.engagement_monitor import engagement_monitor
            engagement_monitor.track_message_received(user_id, message_text)
        except ImportError:
            pass

        # Sanitize input
        message_text = validators.sanitize_text_input(message_text)

        # Check for specific English sessions first (highest priority)
        from database.session_db import get_user_session
        session_data = get_user_session(user_id)

        normalized_message = message_text.strip().lower()

        # Check for account linking session (high priority - before other sessions)
        if session_data and session_data.get('session_type') in ['awaiting_mobile_account_check', 'awaiting_full_name', 'awaiting_email_verification']:
            logger.info(f"Processing account linking for user {user_id}, session_type: {session_data.get('session_type')}")
            handle_account_linking(user_id, message_text)
            return

        # Check for English grammar answer session
        if session_data and session_data.get('session_type') == 'english_grammar' and session_data.get('awaiting_answer'):
            if normalized_message in {'hint', 'hint please', 'hint?', 'hint!'}:
                logger.info(f"Providing grammar hint for user {user_id}")
                english_handler.handle_grammar_hint(user_id)
                return

            logger.info(f"Processing English grammar answer for user {user_id}")
            english_handler.handle_grammar_answer(user_id, message_text)
            return

        # Check for English vocabulary answer session
        if session_data and session_data.get('session_type') == 'english_vocabulary' and session_data.get('awaiting_answer'):
            if normalized_message in {'hint', 'hint please', 'hint?', 'hint!'}:
                logger.info(f"Providing vocabulary hint for user {user_id}")
                english_handler.handle_vocabulary_hint(user_id)
                return

            logger.info(f"Processing English vocabulary answer for user {user_id}")
            english_handler.handle_vocabulary_answer(user_id, message_text)
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
                    # Check if user just completed registration (grace period for DB sync)
                    # If they send MENU, HELP, or any command right after registration, be helpful
                    normalized_message = message_text.lower().strip()
                    if normalized_message in ['menu', 'help', 'hi', 'hello', 'continue']:
                        # User might have just registered - send helpful message with menu
                        whatsapp_service.send_message(user_id, 
                            "🎉 *Welcome!*\n\n"
                            "It looks like you're trying to access the menu.\n\n"
                            "If you just completed registration, please wait a moment for your account to be activated, then type *MENU* again.\n\n"
                            "If you haven't registered yet, please provide your first name to begin:")
                        user_service.start_registration(user_id)
                    else:
                        # Force registration - NO EXCEPTIONS
                        handle_new_user(user_id, message_text)
                return

        # Check if user is in a general session (only after registration is confirmed)

        # 🎯 Handle common commands that should work immediately after registration
        normalized_message = message_text.lower().strip()
        if normalized_message in ['menu', 'help', 'hi', 'hello', 'continue']:
            logger.info(f"📋 User {user_id} requested menu/help - sending main menu")
            send_main_menu(user_id)
            return

        # Check for other session types
        session_type = session_manager.get_session_type(user_id)
        if session_type:
            if try_route_menu_selection(user_id, message_text, session_type):
                return
            handle_session_message(user_id, message_text)
            return

        # 🔐 DOUBLE-CHECK: Verify user actually exists in database
        from database.external_db import get_user_registration
        user_registration = get_user_registration(user_id)
        if not user_registration:
            logger.warning(f"🚨 SECURITY BREACH: User {user_id} passed registration check but not in database!")
            whatsapp_service.send_message(user_id, 
                "🔒 *Security Notice*\n\n"
                "Your registration status is inconsistent. For security, please register again.\n\n"
                "Please provide your first name:")
            user_service.start_registration(user_id)
            return

        # Route menu selections for text-only menus (no session active)
        if try_route_menu_selection(user_id, message_text):
            return
        fallback_selection = resolve_main_menu_fallback(user_id, message_text)
        if fallback_selection:
            handle_interactive_message(user_id, {'button_reply': {'id': fallback_selection}})
            return

        # Handle registered user commands
        command = message_text.lower().strip()

        if command in ['hi', 'hello', 'menu']:
            # Option B: Command bundling (1 credit = 2 commands)
            handle_command_with_tracking(user_id, 'menu_navigation', send_main_menu)
        elif command in ['start quiz', 'quiz', 'quiz me']:
            handle_quiz_menu(user_id)
        elif command == 'credits':
            # Option B: Command bundling
            handle_command_with_tracking(user_id, 'check_balance', show_credit_balance)
        elif command == 'stats':
            # Option B: Command bundling
            handle_command_with_tracking(user_id, 'settings_access', show_user_stats)
        elif command == 'help':
            # Option B: Command bundling
            handle_command_with_tracking(user_id, 'help_command', send_help_message)
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
        elif command in ['support', 'help me', 'contact']:
            send_support_info(user_id)
            return
        elif command in ['privacy', 'privacy policy', 'data']:
            send_privacy_policy(user_id)
            return
        elif command in ['stop', 'unsubscribe', 'opt out', 'quit']:
            handle_unsubscribe_request(user_id)
            return
        elif command in ['start', 'subscribe', 'resubscribe', 'yes']:
            from database.external_db import get_user_registration
            registration = get_user_registration(user_id)
            is_active = registration.get('is_active', True) if registration else True
            if not is_active:
                try:
                    from database.external_db import set_user_subscription
                    set_user_subscription(user_id, True)
                except Exception as _:
                    pass
                # Send confirmation template if available
                try:
                    whatsapp_service.send_template_message(user_id, 'nerdx_resubscribe_confirmation', {})
                except Exception:
                    whatsapp_service.send_message(user_id, "You are now subscribed to NerdX study updates. Reply STOP to unsubscribe anytime.")
                send_main_menu(user_id)
            return
        elif command in ['register', 'registration', 'sign up', 'signup']:
            # Force restart registration for stuck users
            logger.info(f"🔄 User {user_id} requested registration restart")
            from database.session_db import clear_registration_session
            clear_registration_session(user_id)
            handle_new_user(user_id, message_text)
            return
        else:
            # If no active session and command is not recognized, show main menu
            send_main_menu(user_id)

    except Exception as e:
        logger.error(f"Error handling text message for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "Sorry, an error occurred. Please try again.")

def handle_new_user(user_id: str, message_text: str):
    """Handle new user with proper WhatsApp Business Policy consent flow"""
    try:
        logger.info(f"🆕 NEW USER: {user_id} - Requesting consent first (WhatsApp Policy Compliant)")

        # Check if user is responding to consent request
        if message_text.lower().strip() in ['yes', 'y', 'agree', 'accept', 'ok', 'consent']:
            logger.info(f"✅ User {user_id} provided consent, proceeding to registration")
            
            # Retrieve stored referral code from temporary session (if any)
            from database.session_db import get_user_session
            temp_session = get_user_session(user_id)
            original_message = temp_session.get('initial_message', message_text) if temp_session else message_text
            
            start_registration_flow(user_id, original_message)
            return
        elif message_text.lower().strip() in ['no', 'n', 'decline', 'refuse', 'stop', 'unsubscribe']:
            handle_opt_out(user_id)
            return

        # 🎯 AUTO-EXTRACT REFERRAL CODE from first message
        import re
        referral_code = None
        n_codes = re.findall(r'N[A-Z0-9]{5}', message_text.upper())
        if n_codes:
            referral_code = n_codes[0]
            logger.info(f"🔗 AUTO-DETECTED REFERRAL CODE: {referral_code} from first message of {user_id}")

        # Store initial message temporarily to preserve referral code
        from database.session_db import save_user_session
        save_user_session(user_id, {
            'session_type': 'awaiting_consent',
            'initial_message': message_text,
            'detected_referral_code': referral_code
        })

        # First-time interaction - Request explicit consent (WhatsApp Policy Requirement)
        consent_message = """*Welcome to NerdX Quiz Bot!*

*ZIMSEC Study Companion*
- Biology, Chemistry, Physics, and Math
- AI-guided practice and progress tracking

*Consent required*
Reply YES to allow NerdX to:
- Send educational quizzes and study materials
- Store your learning progress
- Send service notifications

*Business*: Neuronet AI Solutions Pvt Ltd (Reg 51491A0272025)
Phone: +263 5494594 | Email: info@neuronet.co.zw | Web: neuronet.co.zw

Reply *YES* to continue
Reply *NO* to decline

Need help? Reply *SUPPORT*
Stop messages: Reply *STOP*"""

        if referral_code:
            consent_message += f"\n\n🎁 *Bonus:* Referral code {referral_code} detected!"

        whatsapp_service.send_message(user_id, consent_message)
        logger.info(f"📋 Consent request sent to {user_id}{' with referral code ' + referral_code if referral_code else ''}")

    except Exception as e:
        logger.error(f"Error handling new user {user_id}: {e}")
        whatsapp_service.send_message(user_id, "❌ Sorry, there was an error. Please try again or reply 'SUPPORT' for help.")


def start_registration_flow(user_id: str, message_text: str):
    """Start registration flow after consent is obtained"""
    try:
        # Check if message contains referral code (enhanced detection)
        referral_code = None
        import re
        
        # Multiple patterns to detect referral codes
        referral_patterns = [
            "referred me to you with this code",
            "referral code",
            "my friend.*code",
            "code.*friend",
            "using.*code",
            "with code"
        ]
        
        has_referral_context = any(pattern in message_text.lower() for pattern in referral_patterns)
        
        # Look for NerdX ID pattern (N + 5 alphanumeric characters)
        n_codes = re.findall(r'N[A-Z0-9]{5}', message_text.upper())
        
        if n_codes:
            referral_code = n_codes[0]
            logger.info(f"🔗 Referral code detected: {referral_code} for user {user_id}")
        elif has_referral_context:
            logger.info(f"🔗 Referral context detected but no valid code found in: {message_text}")
            # Still proceed with registration but ask for code later

        # Ask if user has mobile app account first
        welcome_msg = "✅ *Thank you for your consent!*\n\n"
        welcome_msg += "🔗 *Do you already have a NerdX mobile app account?*\n\n"
        welcome_msg += "If you've signed in to the mobile app (via Google or email), you can link your WhatsApp to that account.\n\n"
        welcome_msg += "• Reply *YES* if you have a mobile app account\n"
        welcome_msg += "• Reply *NO* to create a new WhatsApp account\n\n"
        
        if referral_code:
            welcome_msg += f"🎁 *Referral Code Detected*: {referral_code}\n\n"

        whatsapp_service.send_message(user_id, welcome_msg)

        # Store session to track account linking flow
        from database.session_db import save_user_session
        save_user_session(user_id, {
            'session_type': 'awaiting_mobile_account_check',
            'referral_code': referral_code,
            'initial_message': message_text
        })
        logger.info(f"✅ Asked user {user_id} about mobile app account")

    except Exception as e:
        logger.error(f"Error starting registration for {user_id}: {e}")


def handle_account_linking(user_id: str, user_input: str):
    """Handle account linking flow for users with mobile app accounts"""
    try:
        from database.session_db import get_user_session, save_user_session, clear_user_session
        from database.external_db import get_user_registration
        
        # First check if user is already registered (maybe they just linked)
        existing_user = get_user_registration(user_id)
        if existing_user:
            logger.info(f"User {user_id} is already registered, clearing linking session")
            clear_user_session(user_id)
            whatsapp_service.send_message(user_id,
                "✅ *You're already registered!*\n\n"
                "Your account is active. Type *MENU* to get started.")
            send_main_menu(user_id)
            return
        
        session = get_user_session(user_id)
        if not session:
            logger.warning(f"No session found for account linking, restarting flow for {user_id}")
            start_registration_flow(user_id, "")
            return
        
        session_type = session.get('session_type', '')
        
        # Step 1: Check if user has mobile app account
        if session_type == 'awaiting_mobile_account_check':
            user_input_lower = user_input.lower().strip()
            if user_input_lower in ['yes', 'y', 'have', 'yes i have', 'i have']:
                # User has mobile app account - ask for name
                whatsapp_service.send_message(user_id, 
                    "📱 *Great! Let's link your accounts*\n\n"
                    "Please enter your *full name* exactly as you used in the mobile app:\n"
                    "(First name and surname together, e.g., 'John Doe')")
                
                save_user_session(user_id, {
                    'session_type': 'awaiting_full_name',
                    'referral_code': session.get('referral_code')
                })
                logger.info(f"User {user_id} confirmed mobile app account, waiting for full name")
            elif user_input_lower in ['no', 'n', 'dont', "don't", 'new account']:
                # User doesn't have mobile app account - proceed with normal registration
                referral_code = session.get('referral_code')
                start_normal_registration(user_id, referral_code)
            else:
                # Unclear response - ask again
                whatsapp_service.send_message(user_id,
                    "Please reply *YES* if you have a mobile app account, or *NO* to create a new WhatsApp account.")
            return
        
        # Step 2: Get full name and search for account
        if session_type == 'awaiting_full_name':
            # Parse full name (assume format: "FirstName Surname" or "FirstName MiddleName Surname")
            name_parts = user_input.strip().split()
            
            if len(name_parts) < 2:
                whatsapp_service.send_message(user_id,
                    "Please enter your full name with both first name and surname:\n"
                    "Example: 'John Doe' or 'Mary Jane Smith'")
                return
            
            # Use first part as name, last part as surname
            # If more than 2 parts, join middle names with first name
            name = name_parts[0]
            surname = name_parts[-1]
            
            if len(name_parts) > 2:
                # Middle names - join with first name
                name = ' '.join(name_parts[:-1])
            
            logger.info(f"Searching for account with name='{name}', surname='{surname}' for user {user_id}")
            
            # Search for matching account
            result = user_service.link_mobile_account(user_id, name, surname)
            
            if result.get('success'):
                # Account linked successfully
                whatsapp_service.send_message(user_id, result['message'])
                # Clear session
                from database.session_db import clear_user_session
                clear_user_session(user_id)
                # Send main menu
                send_main_menu(user_id)
            elif result.get('requires_email'):
                # Multiple matches - need email verification
                save_user_session(user_id, {
                    'session_type': 'awaiting_email_verification',
                    'name': name,
                    'surname': surname,
                    'referral_code': session.get('referral_code')
                })
                whatsapp_service.send_message(user_id, result['message'])
            else:
                # No match found or error
                whatsapp_service.send_message(user_id, result['message'])
                # Offer to start normal registration
                whatsapp_service.send_message(user_id,
                    "\nWould you like to create a new WhatsApp account? Reply *REGISTER* to continue.")
            return
        
        # Step 3: Email verification for multiple matches
        if session_type == 'awaiting_email_verification':
            email = user_input.strip()
            name = session.get('name')
            surname = session.get('surname')
            
            if not email or '@' not in email:
                whatsapp_service.send_message(user_id,
                    "Please enter a valid email address:")
                return
            
            logger.info(f"Verifying email '{email}' for name='{name}', surname='{surname}' for user {user_id}")
            
            # Try linking with email
            result = user_service.link_mobile_account(user_id, name, surname, email)
            
            if result.get('success'):
                # Account linked successfully
                whatsapp_service.send_message(user_id, result['message'])
                # Clear session
                from database.session_db import clear_user_session
                clear_user_session(user_id)
                # Send main menu
                send_main_menu(user_id)
            else:
                whatsapp_service.send_message(user_id, result['message'])
                # Offer to start normal registration
                whatsapp_service.send_message(user_id,
                    "\nWould you like to create a new WhatsApp account? Reply *REGISTER* to continue.")
            return
            
    except Exception as e:
        logger.error(f"Error handling account linking for {user_id}: {e}")
        whatsapp_service.send_message(user_id,
            "❌ An error occurred while linking your account. Please try again or reply *REGISTER* to create a new account.")


def start_normal_registration(user_id: str, referral_code: str = None):
    """Start normal WhatsApp registration flow"""
    try:
        welcome_msg = "🎯 *Let's create your secure NerdX account*\n\n"
        
        if referral_code:
            welcome_msg += f"🔗 *Referral Code Detected*: {referral_code}\n\n"
        
        welcome_msg += "Please enter your *first name*:"
        
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
        logger.error(f"Error starting normal registration for {user_id}: {e}")


def handle_opt_out(user_id: str):
    """Handle user opt-out/unsubscribe requests (WhatsApp Policy Compliance)"""
    try:
        logger.info(f"❌ User {user_id} declined consent or requested opt-out")
        
        opt_out_message = """*You are opted out*

We will not send further messages from NerdX.

To rejoin anytime, send *START* or *HI*.

*Business Contact*
Neuronet AI Solutions Pvt Ltd
Phone: +263 5494594 | Email: info@neuronet.co.zw | Web: neuronet.co.zw

Thank you for considering NerdX."""

        whatsapp_service.send_message(user_id, opt_out_message)
        
        # TODO: Store opt-out status in database for compliance tracking
        # This ensures we don't message them again unless they explicitly restart
        
        logger.info(f"✅ Opt-out handled successfully for {user_id}")
        
    except Exception as e:
        logger.error(f"Error handling opt-out for {user_id}: {e}")


def send_support_info(user_id: str):
    """Send business support information (WhatsApp Policy Compliance)"""
    try:
        support_message = """*NerdX Support (Neuronet AI Solutions)*

Neuronet AI Solutions Pvt Ltd (Reg 51491A0272025)
Address: 9 Munino Mufakose, Harare
Phone: +263 5494594 | Email: info@neuronet.co.zw
Web: neuronet.co.zw
Hours: 8 AM - 6 PM CAT (reply within 24h)

We can help with:
- Account and registration
- Payments and credits
- Quiz/content issues
- Technical problems

Quick commands:
- *menu* or *start* (restart)
- *stats* (account info)
- *privacy* (policy)
- *stop* (opt out)

How can we help?"""

        whatsapp_service.send_message(user_id, support_message)
        logger.info(f"📞 Support information sent to {user_id}")
        
    except Exception as e:
        logger.error(f"Error sending support info to {user_id}: {e}")


def send_privacy_policy(user_id: str):
    """Send privacy policy information (WhatsApp Policy Compliance)"""
    try:
        privacy_message = """*NerdX Privacy Summary*

Data controller: Neuronet AI Solutions Pvt Ltd (Reg 51491A0272025)
Contact: info@neuronet.co.zw | +263 5494594 | neuronet.co.zw

We collect:
- Name and WhatsApp number
- Learning progress and quiz results
- Usage statistics
- Payment records (if you buy credits)

We use your data to deliver learning services only.
We do not sell your data.

Your choices:
- Delete data: reply *DELETE DATA*
- Opt out: reply *STOP*
- Privacy questions: reply *SUPPORT*

Full policy: neuronet.co.zw/privacy
Last updated: December 2024

Reply *MENU* to continue."""

        whatsapp_service.send_message(user_id, privacy_message)
        logger.info(f"🛡️ Privacy policy sent to {user_id}")
        
    except Exception as e:
        logger.error(f"Error sending privacy policy to {user_id}: {e}")


def handle_unsubscribe_request(user_id: str):
    """Handle unsubscribe requests from existing users (WhatsApp Policy Compliance)"""
    try:
        logger.info(f"🛑 User {user_id} requested to unsubscribe")
        # Update subscription status (best-effort)
        try:
            from database.external_db import set_user_subscription
            set_user_subscription(user_id, False)
        except Exception as _:
            pass

        # Send confirmation template if available
        try:
            # Name is optional here; template handles missing variable gracefully if not provided
            whatsapp_service.send_template_message(user_id, 'nerdx_unsubscribe_confirmation', {})
        except Exception:
            whatsapp_service.send_message(user_id, "You have been unsubscribed from NerdX notifications. Reply START to subscribe again.")
        
        logger.info(f"✅ Unsubscribe processed for {user_id}")
        
    except Exception as e:
        logger.error(f"Error processing unsubscribe for {user_id}: {e}")


def handle_registration_flow(user_id: str, user_input: str):
    """Handle user registration steps with enhanced error handling"""
    try:
        logger.info(f"🔄 Processing registration step for {user_id} with input: '{user_input}'")

        # Get current registration session for debugging
        from database.session_db import get_registration_session
        current_session = get_registration_session(user_id)
        logger.info(f"📋 Current registration session: {current_session}")

        if not current_session:
            logger.error(f"❌ No registration session found for {user_id}, restarting registration")
            # Restart registration if session is lost
            user_service.start_registration(user_id)
            whatsapp_service.send_message(user_id, "Registration session expired. Let's start over.\n\nPlease enter your first name:")
            return

        result = user_service.process_registration_step(user_id, user_input)
        logger.info(f"📝 Registration step result: {result}")

        if result['success']:
            if result.get('completed'):
                # Registration complete - send message with buttons
                logger.info(f"✅ Registration completed for {user_id}")

                # Clear any temporary session state (e.g., awaiting consent)
                from database.session_db import clear_user_session
                clear_user_session(user_id)
                
                # Small delay to ensure database is fully updated
                import time
                time.sleep(0.5)
                
                # Send completion message
                if result.get('buttons'):
                    success = whatsapp_service.send_interactive_message(user_id, result['message'], result['buttons'])
                    if not success:
                        # Fallback to plain message if interactive fails
                        whatsapp_service.send_message(user_id, result['message'])
                        # Add instruction message
                        whatsapp_service.send_message(user_id, 
                            "💡 *Tip:* Type *MENU* to see all options or *HELP* for commands.")
                        send_main_menu(user_id)
                    else:
                        # Successfully sent interactive message - now automatically send main menu
                        # Give user a moment to read the completion message, then show menu
                        time.sleep(2)  # 2 second delay for user to read completion message
                        logger.info(f"📋 Auto-sending main menu to {user_id} after registration")
                        send_main_menu(user_id)
                else:
                    whatsapp_service.send_message(user_id, result['message'])
                    # Add instruction message
                    whatsapp_service.send_message(user_id, 
                        "💡 *Tip:* Type *MENU* to see all options or *HELP* for commands.")
                    send_main_menu(user_id)
            else:
                # Continue to next step
                logger.info(f"➡️ Moving to next registration step for {user_id}: {result.get('step')}")
                success = whatsapp_service.send_message(user_id, result['message'])
                if not success:
                    logger.error(f"❌ Failed to send registration message to {user_id}")
                    # Try again with simpler message
                    whatsapp_service.send_message(user_id, "Please continue with registration.")
        else:
            # Error in registration step
            logger.warning(f"❌ Registration step failed for {user_id}: {result.get('message')}")
            success = whatsapp_service.send_message(user_id, result['message'])
            if not success:
                logger.error(f"❌ Failed to send error message to {user_id}")

    except Exception as e:
        logger.error(f"Error in registration flow for {user_id}: {e}", exc_info=True)
        # Try to send error message
        try:
            whatsapp_service.send_message(user_id, "Registration error. Please type 'REGISTER' to try again.")
        except:
            logger.error(f"❌ Could not even send error message to {user_id}")

def handle_session_message(user_id: str, message_text: str):
    """Handle messages when user is in an active session"""
    try:
        session_type = session_manager.get_session_type(user_id)

        # Handle reset commands and main menu requests - these should always work
        command = message_text.lower().strip()
        if command in ['cancel', 'reset', 'stop', 'menu', 'hi', 'hello']:
            from database.session_db import clear_user_session
            clear_user_session(user_id)
            if command in ['menu', 'hi', 'hello']:
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

                    message = """❌ *Payment Session Reset*

Your payment session data was incomplete. This can happen if:
• The session expired
• There was a network interruption
• The payment process was not started properly

🔄 *What to do now:*
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

        if session_type == 'science_structured_question':
            handle_science_structured_answer(user_id, message_text)
        elif session_type == 'question':
            handle_question_answer(user_id, message_text)
        elif session_type == 'topic_selection':
            handle_topic_selection(user_id, message_text)
        elif session_type == 'payment':
            handle_payment_confirmation(user_id, message_text)
        elif session_type == 'paynow_phone_collection':
            handle_paynow_phone_collection(user_id, message_text)
        elif session_type == 'audio_chat':
            handle_audio_chat_message(user_id, message_text)
        elif session_type == 'project_assistant':
            project_assistant_handler.handle_project_message(user_id, message_text)
        elif combined_science_handler.handle_message(user_id, message_text):
            # Combined Science handler processed the message
            pass
        else:
            # CRITICAL FIX: Don't automatically send main menu - it causes message chains
            # Only send menu if user explicitly requests it
            logger.info(f"No active session for {user_id}, but not auto-sending menu to prevent message chains")
            whatsapp_service.send_message(user_id, "I didn't understand that. Please use the menu options to navigate.")

    except Exception as e:
        logger.error(f"Error handling session message for {user_id}: {e}", exc_info=True)


def handle_science_structured_answer(user_id: str, student_answer: str):
    """Handle typed answers for structured Biology/Chemistry/Physics questions."""
    try:
        from database.session_db import get_user_session, clear_user_session
        session = get_user_session(user_id)
        if not session or session.get('session_type') != 'science_structured_question':
            whatsapp_service.send_message(user_id, "❌ No active structured question found. Please choose a topic to start.")
            return

        structured_question = session.get('question_data') or {}
        subject = session.get('subject') or structured_question.get('subject') or 'Science'
        topic = session.get('topic') or structured_question.get('topic') or ''
        difficulty = session.get('difficulty') or structured_question.get('difficulty') or 'medium'

        # Evaluate with AI through CombinedScienceGenerator
        from services.combined_science_generator import CombinedScienceGenerator
        gen = CombinedScienceGenerator()
        evaluation = gen.evaluate_structured_answer(structured_question, student_answer, platform='whatsapp')

        if not evaluation or not evaluation.get('success'):
            whatsapp_service.send_message(
                user_id,
                "❌ Sorry, I couldn't evaluate your answer right now. Please try again in a moment."
            )
            return

        total = evaluation.get('total_marks', structured_question.get('total_marks', 0))
        awarded = evaluation.get('marks_awarded', 0)
        percentage = evaluation.get('percentage', 0.0)
        is_correct = evaluation.get('is_correct', False)

        header = f"🧪 *{subject} - {topic}* ({difficulty.title()})\n"
        header += f"📝 *Structured Question Marking*\n\n"
        header += f"📌 *Score:* {awarded}/{total} ({percentage}%)\n"
        header += f"{'✅' if is_correct else '❌'} *Result:* {'Good pass' if is_correct else 'Needs improvement'}\n\n"

        # Build per-part feedback (keep WhatsApp message length sane)
        per_part_lines = []
        per_parts = evaluation.get('per_part', [])
        if isinstance(per_parts, list) and per_parts:
            per_part_lines.append("*Part-by-part feedback:*")
            for p in per_parts[:6]:
                label = p.get('label', '')
                max_marks = p.get('max_marks', '')
                got = p.get('awarded', '')
                tfb = (p.get('teacher_feedback') or '').strip()
                if tfb:
                    per_part_lines.append(f"- {label} [{got}/{max_marks}]: {tfb}")
                else:
                    per_part_lines.append(f"- {label} [{got}/{max_marks}]")
            per_part_lines.append("")

        overall = (evaluation.get('overall_teacher_feedback') or '').strip()
        explanation = (evaluation.get('well_detailed_explanation') or '').strip()

        message = header
        if per_part_lines:
            message += "\n".join(per_part_lines) + "\n"
        if overall:
            message += f"*Teacher Feedback:*\n{overall}\n\n"
        if explanation:
            message += f"*Well Detailed Explanation:*\n{explanation}\n"

        # Navigation
        buttons = [
            {"text": "▶️ Next Question", "callback_data": f"difficulty_{difficulty}_{subject.lower()}_{topic.replace(' ', '_')}_structured"},
            {"text": "🔙 Back to Topics", "callback_data": f"science_{subject}"},
            {"text": "🏠 Main Menu", "callback_data": "main_menu"}
        ]
        whatsapp_service.send_interactive_message(user_id, message[:1024], buttons)

        # Clear session after marking to avoid confusion
        clear_user_session(user_id)

    except Exception as e:
        logger.error(f"Error handling structured science answer for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "❌ Error marking your answer. Please try again.")

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
                "🔒 *Access Denied*\n\n"
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

            insufficient_msg = f"""💰 *Need More Credits!* 💰

📸 *Image Math Solver*

💳 *Credit Status:*
• Current Credits: {format_credits(current_credits)}
• Required Credits: {format_credits(required_credits)}
• Need: {format_credits(shortage)} more credits

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
            response = f"📸 *Image Math Solution*\n\n"
            response += f"*Problem:* {solution.get('problem_identified', 'Unknown')}\n\n"
            response += f"*Solution:*\n{solution.get('solution_steps', 'No steps available')}\n\n"
            response += f"*Answer:* {solution.get('final_answer', 'No answer')}\n\n"

            if solution.get('notes'):
                response += f"*Notes:* {solution['notes']}\n"

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

def build_main_menu_buttons(user_id: str):
    """Build the main menu buttons with low-credit options included."""
    from services.advanced_credit_service import advanced_credit_service

    main_buttons = [
        {"text": "🎯 Start Quiz", "callback_data": "start_quiz"},
        # {"text": "🎤 Audio Chat", "callback_data": "audio_chat_menu"},  # Hidden but code preserved
        {"text": "🎓 Project Assistant", "callback_data": "project_assistant_menu"},
        {"text": "📊 My Stats", "callback_data": "user_stats"},
        {"text": "👥 Referrals", "callback_data": "referrals_menu"},
        {"text": "💰 Buy Credits", "callback_data": "credit_store"}
    ]

    # Add low credit button if applicable using advanced credit system
    main_buttons = advanced_credit_service.add_low_credit_button(main_buttons, user_id)

    # Add additional buttons (avoiding duplicates)
    # Only add Share to Friend since Buy Credits and My Stats already exist above
    main_buttons.append({
        "text": "📤 Share to Friend",
        "callback_data": "share_to_friend"
    })

    return main_buttons


def resolve_main_menu_fallback(user_id: str, message_text: str) -> str:
    """Resolve menu replies when in-memory menu routing is unavailable."""
    if not message_text:
        return ""

    buttons = build_main_menu_buttons(user_id)
    number = menu_router._extract_number(message_text)
    if number:
        index = int(number) - 1
        if 0 <= index < len(buttons):
            return buttons[index].get("callback_data", "")

    normalized_input = menu_router._normalize_text(message_text)
    if not normalized_input:
        return ""

    for button in buttons:
        text = button.get("text") or button.get("title") or ""
        normalized_text = menu_router._normalize_text(text)
        if normalized_text == normalized_input:
            return button.get("callback_data", "")

    for button in buttons:
        text = button.get("text") or button.get("title") or ""
        normalized_text = menu_router._normalize_text(text)
        if normalized_input in normalized_text or normalized_text in normalized_input:
            return button.get("callback_data", "")

    return ""


def send_main_menu(user_id: str, user_name: str = None):
    """Send main menu to user with advanced credit system integration"""
    try:
        # Get user registration data for personalization
        from database.external_db import get_user_registration, get_user_stats, claim_welcome_bonus
        from services.advanced_credit_service import advanced_credit_service

        registration = get_user_registration(user_id)
        try:
            claim_welcome_bonus(user_id)
        except Exception as bonus_error:
            logger.warning(f"Welcome bonus check failed for {user_id}: {bonus_error}")
        if not user_name:
            user_name = registration['name'] if registration else None

        user_stats = get_user_stats(user_id) or {'level': 1, 'xp_points': 0, 'streak': 0, 'correct_answers': 0, 'total_attempts': 0}

        # Get credits directly from users_registration table (primary source)
        current_credits = registration.get('credits', 0) if registration else 0

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
        welcome_text += f"🔬 Combined Science  📐 Mathematics\n"
        welcome_text += f"📝 English           🎓 Project Help\n\n"

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
        main_buttons = build_main_menu_buttons(user_id)

        sent = whatsapp_service.send_interactive_message(user_id, welcome_text, main_buttons)
        if not sent:
            logger.warning(f"Primary menu send failed for {user_id}, attempting grouped fallback")
            sent = whatsapp_service.send_grouped_buttons(user_id, welcome_text, main_buttons)

        if not sent:
            logger.warning(f"Grouped menu send failed for {user_id}, attempting plain-text fallback")
            option_texts = [button.get('text') or button.get('title', 'Option') for button in main_buttons]
            menu_router.store_menu(user_id, main_buttons, source="menu_fallback")
            fallback_message = whatsapp_service._format_options_message(
                welcome_text,
                option_texts,
                "Reply with the option number or name."
            )
            sent = whatsapp_service.send_message(user_id, fallback_message)

        # Persist main menu as the latest menu so numeric replies can be routed safely
        if sent:
            menu_router.store_menu(user_id, main_buttons, source="main_menu")

    except Exception as e:
        logger.error(f"Error sending main menu for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, "Error loading menu. Please try again.")

def handle_command_with_tracking(user_id: str, action: str, command_function):
    """
    Handle commands with Option B bundling: 1 credit = 2 commands
    Tracks command usage and only deducts credit when bundle is complete
    """
    try:
        from services.command_credit_tracker import command_credit_tracker
        from services.advanced_credit_service import advanced_credit_service
        from utils.credit_units import format_credits
        
        # Check if credit should be deducted
        tracker_result = command_credit_tracker.should_deduct_credit(user_id, action)
        
        if not tracker_result.get('should_deduct', True):
            # Command in bundle - don't deduct yet, just execute
            commands_used = tracker_result.get('commands_used', 0)
            commands_remaining = tracker_result.get('commands_remaining', 0)
            
            # Execute the command function
            command_function(user_id)
            
            # Send bundle status message
            bundle_msg = f"📦 *Command Bundle Status*\n\n"
            bundle_msg += f"✅ Command {commands_used} of 2 used\n"
            bundle_msg += f"💳 No credit deducted yet\n"
            bundle_msg += f"📊 {commands_remaining} command(s) remaining in bundle\n\n"
            bundle_msg += f"💡 *Tip:* Use {commands_remaining} more command to complete the bundle (1 credit for 2 commands)"
            
            whatsapp_service.send_message(user_id, bundle_msg)
            return
        
        # Bundle complete or not a command - check and deduct credits (WhatsApp uses Option B)
        credit_result = advanced_credit_service.check_and_deduct_credits(user_id, action, platform='whatsapp')
        
        if credit_result.get('success'):
            # Credits deducted successfully - execute command
            command_function(user_id)
            
            # Show bundle completion message if applicable
            if tracker_result.get('bundle_complete'):
                bundle_msg = f"✅ *Bundle Complete!*\n\n"
                bundle_msg += f"💳 1 credit deducted for 2 commands\n"
                bundle_msg += f"💰 New balance: {format_credits(credit_result.get('new_balance', 0))}\n\n"
                bundle_msg += f"🎯 *New bundle started* - Next 2 commands = 1 credit"
                whatsapp_service.send_message(user_id, bundle_msg)
        else:
            # Insufficient credits
            insufficient_msg = credit_result.get('message', 'Insufficient credits')
            whatsapp_service.send_message(user_id, f"❌ {insufficient_msg}\n\n💡 *Get more credits:* Use 'buy credits' command")
            
    except Exception as e:
        logger.error(f"Error in handle_command_with_tracking for {user_id}, action {action}: {e}", exc_info=True)
        # Fallback: execute command without tracking (graceful degradation)
        try:
            command_function(user_id)
        except Exception as fallback_error:
            logger.error(f"Fallback command execution also failed: {fallback_error}")
            whatsapp_service.send_message(user_id, "❌ Error processing command. Please try again.")

def handle_interactive_message(user_id: str, interactive_data: dict):
    """Handle interactive button/list responses - supports both button and list interactions"""
    try:
        button_reply = interactive_data.get('button_reply', {})
        list_reply = interactive_data.get('list_reply', {})

        selection_id = button_reply.get('id') or list_reply.get('id')
        
        # Normalize selection_id: strip numeric suffixes added for uniqueness in list messages
        # e.g., "user_stats_1" -> "user_stats"
        if selection_id and '_' in selection_id:
            parts = selection_id.rsplit('_', 1)
            if len(parts) == 2 and parts[1].isdigit():
                selection_id = parts[0]
        
        # Log interaction type for monitoring
        if button_reply:
            logger.info(f"Button interaction from {user_id}: {selection_id}")
        elif list_reply:
            logger.info(f"List selection from {user_id}: {selection_id}")

        if not selection_id:
            return

        # 🔒 STRICT SECURITY: Check registration before ANY interactive action
        registration = get_user_registration(user_id)
        if not registration:
            logger.warning(f"🚨 UNREGISTERED USER tried interactive action: {user_id}")
            whatsapp_service.send_message(user_id, 
                "🔒 *Access Denied*\n\n"
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
            combined_science_handler.handle_button_callback(user_id, "combined_science")
        elif selection_id == 'subject_ordinary_mathematics':
            handle_ordinary_mathematics_menu(user_id)
        elif selection_id == 'subject_ordinary_english':
            english_handler.handle_english_menu(user_id)
        # Handle Combined Science subject topic selections
        elif selection_id == 'science_Biology':
            handle_combined_science_topic_menu(user_id, 'Biology')
        elif selection_id == 'science_Chemistry':
            handle_combined_science_topic_menu(user_id, 'Chemistry')
        elif selection_id == 'science_Physics':
            handle_combined_science_topic_menu(user_id, 'Physics')
        elif selection_id.startswith('subject_ordinary_'):
            subject_name = selection_id.replace('subject_ordinary_', '').replace('_', ' ').title()
            if subject_name == 'Combined Science':
                combined_science_handler.handle_button_callback(user_id, "combined_science")
            elif subject_name == 'Mathematics':
                handle_ordinary_mathematics_menu(user_id)
            elif subject_name == 'English':
                english_handler.handle_english_menu(user_id)
        elif selection_id.startswith('subject_'): # General subject selection (e.g., Advanced Level)
            subject_name = selection_id.replace('subject_', '').title()
            handle_subject_selection(user_id, subject_name)
        elif selection_id.startswith('topic_page_'):
            # Handle pagination navigation: topic_page_Biology_2
            parts = selection_id.split("_")
            if len(parts) >= 4:
                subject = parts[2]  # Biology, Chemistry, Physics
                page = int(parts[3])
                handle_combined_science_topic_menu(user_id, subject, page)
        elif selection_id.startswith('topic_'):
            # Extract subject and topic from callback data
            parts = selection_id.split("_", 2)
            if len(parts) >= 3:
                subject = parts[1].title()
                topic = parts[2].replace("_", " ")  # Remove .title() to preserve original case

                # Validate subject and topic
                if subject in TOPICS and topic in TOPICS.get(subject, []):
                    # For pure sciences, ask question format first (Structured vs MCQ)
                    if subject in ["Biology", "Chemistry", "Physics"]:
                        show_science_question_type_selection(user_id, subject, topic, user_name)
                    else:
                        # Show difficulty selection for this topic
                        show_difficulty_selection(user_id, subject, topic, user_name)
                else:
                    whatsapp_service.send_message(user_id, f"❌ Invalid topic selection: {subject} - {topic}")
            else:
                whatsapp_service.send_message(user_id, "❌ Invalid topic selection format.")
        elif selection_id.startswith('qtype_'):
            # Format: qtype_structured_subject_topic OR qtype_mcq_subject_topic
            parts = selection_id.split("_", 3)
            if len(parts) >= 4:
                qtype = parts[1].lower()
                subject = parts[2].title()
                topic = parts[3].replace("_", " ")

                if subject in TOPICS and topic in TOPICS.get(subject, []) and qtype in ["structured", "mcq"]:
                    # Show difficulty options, carrying question type in callback data (5th segment)
                    message = f"🧪 *{subject} - {topic}*\n\nChoose difficulty for *{qtype.upper()}* questions:"
                    buttons = [
                        {"text": "🟢 Easy", "callback_data": f"difficulty_easy_{subject.lower()}_{topic.replace(' ', '_')}_{qtype}"},
                        {"text": "🟡 Medium", "callback_data": f"difficulty_medium_{subject.lower()}_{topic.replace(' ', '_')}_{qtype}"},
                        {"text": "🔴 Difficult", "callback_data": f"difficulty_difficult_{subject.lower()}_{topic.replace(' ', '_')}_{qtype}"},
                        {"text": "🔙 Back", "callback_data": f"topic_{subject}_{topic.replace(' ', '_')}"}
                    ]
                    whatsapp_service.send_interactive_message(user_id, message, buttons)
                else:
                    whatsapp_service.send_message(user_id, "❌ Invalid question format selection.")
            else:
                whatsapp_service.send_message(user_id, "❌ Invalid question format selection.")
        elif selection_id.startswith('difficulty_'):
            # Extract difficulty, subject, and topic
            parts = selection_id.split("_")
            # difficulty_<level>_<subject>_<topic>[_<qtype>]
            if len(parts) >= 4:
                difficulty = parts[1]
                subject = parts[2].title()
                # topic might contain underscores; qtype (if present) is last token
                qtype = 'mcq'
                if len(parts) >= 5 and parts[-1] in ['mcq', 'structured']:
                    qtype = parts[-1]
                    topic_raw = "_".join(parts[3:-1])
                else:
                    topic_raw = "_".join(parts[3:])
                topic = topic_raw.replace("_", " ")  # Remove .title() to preserve original case

                logger.info(f"Generating {difficulty} {subject} question for topic: {topic} (type={qtype})")

                # Validate parameters
                if difficulty in DIFFICULTY_LEVELS and subject in TOPICS and topic in TOPICS.get(subject, []) :
                    # Generate and send question
                    generate_and_send_question(user_id, subject, topic, difficulty, user_name, question_type=qtype)
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
        elif selection_id == 'project_assistant_menu':
            # Track project assistant feature usage
            analytics_tracker.track_feature_usage(
                feature_name="Project Assistant",
                user_id=user_id,
                success=True,
                time_spent=0,
                credits_consumed=0
            )
            project_assistant_handler.handle_project_menu(user_id)
        elif selection_id == 'project_new':
            project_assistant_handler.handle_start_new_project(user_id)
        elif selection_id == 'project_continue':
            project_assistant_handler.handle_continue_project(user_id)
        elif selection_id == 'project_save_exit':
            project_assistant_handler.handle_save_and_exit(user_id)
        
        # Combined Science Callbacks
        elif combined_science_handler.handle_button_callback(user_id, selection_id):
            # Handler returns True if it processed the callback
            pass
        
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
            # Option B: Command bundling (button clicks also count as commands)
            handle_command_with_tracking(user_id, 'menu_navigation', send_main_menu)
        elif selection_id == 'user_stats':
            # Option B: Command bundling
            handle_command_with_tracking(user_id, 'settings_access', show_user_stats)
        elif selection_id == 'clear_session' or selection_id == 'reset_session':
            # Allow users to manually clear stuck sessions
            from database.session_db import clear_user_session
            clear_user_session(user_id)
            logger.info(f"User {user_id} manually cleared their session")
            whatsapp_service.send_message(user_id, "✅ Session cleared! You can now start a new question.")
            send_main_menu(user_id)
        # Registration completion button handlers
        elif selection_id == 'join_channel':
            # Send WhatsApp channel link
            channel_message = """📢 *Join NerdX Official Channel!*

Stay updated with:
• Latest features and updates
• Study tips and strategies
• Important announcements
• Community discussions

🔗 *Channel Link*: https://whatsapp.com/channel/0029VbAoqVdDTkK3jbcrDf1B

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
            logger.info(f"🔄 Calling handle_show_database_solution with user_id={user_id}, question_id={question_id}")
            logger.info(f"🔄 exam_mathematics_handler exists: {exam_mathematics_handler is not None}")
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

                # Check for active generation session with timeout mechanism
                from database.session_db import get_user_session, clear_user_session
                from datetime import datetime, timedelta
                existing_session = get_user_session(user_id)
                if existing_session:
                    session_type = existing_session.get('session_type')
                    if session_type == 'math_generating':
                        # Check if session is older than 2 minutes (stuck session)
                        session_created = existing_session.get('created_at')
                        if session_created:
                            try:
                                from datetime import datetime
                                if isinstance(session_created, str):
                                    created_time = datetime.fromisoformat(session_created.replace('Z', '+00:00'))
                                else:
                                    created_time = session_created
                                
                                # If session is older than 2 minutes, clear it (stuck session)
                                if datetime.now() - created_time.replace(tzinfo=None) > timedelta(minutes=2):
                                    logger.warning(f"Clearing stuck math_generating session for {user_id} (older than 2 minutes)")
                                    clear_user_session(user_id)
                                else:
                                    # Session is recent, still generating
                                    whatsapp_service.send_message(
                                        user_id,
                                        "⏳ Question is being generated. Please wait a moment."
                                    )
                                    return jsonify({'status': 'success', 'message': 'Generation in progress'})
                            except Exception as time_error:
                                logger.warning(f"Error checking session time, clearing session: {time_error}")
                                clear_user_session(user_id)
                        else:
                            # No timestamp, clear session
                            logger.warning(f"Clearing math_generating session without timestamp for {user_id}")
                            clear_user_session(user_id)

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
            # Option B: Command bundling
            handle_command_with_tracking(user_id, 'settings_access', show_user_stats)
        elif selection_id == 'user_stats':
            # Option B: Command bundling
            handle_command_with_tracking(user_id, 'settings_access', show_user_stats)
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
                topic = parts[3].replace('_', ' ')
                difficulty = parts[4]

                # Route Combined Science questions to the correct handler
                if subject.lower() in ['biology', 'chemistry', 'physics']:
                    logger.info(f"Routing Combined Science {subject} question to proper handler")
                    handle_combined_science_question(user_id, subject, topic, difficulty)
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
                topic_raw = ' '.join(topic_parts).replace('_', ' ')
                difficulty = parts[-1]  # Last part is always difficulty

                # Find the exact topic match from TOPICS to preserve original capitalization
                topic = topic_raw
                if subject in TOPICS:
                    for original_topic in TOPICS[subject]:
                        if original_topic.lower() == topic_raw.lower():
                            topic = original_topic
                            break

                logger.info(f"Next question request: subject={subject}, topic='{topic}', difficulty={difficulty}")

                # Route Combined Science next questions to the correct handler
                if subject.lower() in ['biology', 'chemistry', 'physics']:
                    logger.info(f"Routing Combined Science {subject} next question for topic '{topic}' to proper handler")
                    handle_combined_science_question(user_id, subject, topic, difficulty)
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

        # Combined Science topical next questions are now handled by 'next_science_' above

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
            # Option B: Command bundling
            handle_command_with_tracking(user_id, 'menu_navigation', send_main_menu)
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


def show_science_question_type_selection(chat_id: str, subject: str, topic: str, user_name: str):
    """Show question type selection (Structured vs MCQ) for pure science topics."""
    try:
        message = f"🧪 *{subject} - {topic}*\n\n"
        message += f"👤 Welcome {user_name}!\n\nChoose question format:"
        buttons = [
            {"text": "📝 Structured", "callback_data": f"qtype_structured_{subject.lower()}_{topic.replace(' ', '_')}"},
            {"text": "✅ Multiple Choice (MCQ)", "callback_data": f"qtype_mcq_{subject.lower()}_{topic.replace(' ', '_')}"},
            {"text": "🔙 Back to Topics", "callback_data": f"science_{subject}"}
        ]
        whatsapp_service.send_interactive_message(chat_id, message, buttons)
    except Exception as e:
        logger.error(f"Error showing science question type selection for {chat_id}: {e}", exc_info=True)
        whatsapp_service.send_message(chat_id, "❌ Error showing question format options. Please try again.")


def handle_subject_selection(user_id: str, subject: str):
    """Handle subject selection"""
    try:
        if subject not in TOPICS:
            whatsapp_service.send_message(user_id, "Invalid subject selection.")
            send_main_menu(user_id)
            return

        # Send difficulty selection
        message = f"📚 You selected *{subject}*\n\nChoose difficulty level:"

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
        message = f"📚 *{subject}* - {difficulty.title()}\n\nChoose a topic:"

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
        message = f"📊 *{user_name}'s Learning Statistics* 📊\n\n"

        # Credit Status
        message += f"💰 *Credit Balance*\n"
        message += f"💳 Current Credits: {format_credits(current_credits)}\n"
        message += f"🔥 Active Packages: {len(credit_status.get('active_packages', []))}\n\n"

        # Learning Progress  
        message += f"🎮 *Learning Progress*\n"
        message += f"🏆 Level: {level}\n"
        message += f"⭐ XP Points: {xp_points:,}\n"
        message += f"📈 Next Level: {xp_for_next_level} XP needed\n"
        message += f"🔥 Current Streak: {streak} days\n\n"

        # Performance Stats
        message += f"📝 *Performance Stats*\n"
        message += f"✅ Correct Answers: {correct_answers}\n"
        message += f"📊 Total Attempts: {total_attempts}\n"
        message += f"🎯 Accuracy Rate: {accuracy:.1f}%\n\n"

        # Motivational message based on performance
        if accuracy >= 80:
            message += f"🌟 *Excellent work!* You're mastering the material!\n"
        elif accuracy >= 60:
            message += f"💪 *Good progress!* Keep practicing to improve!\n"
        elif total_attempts > 0:
            message += f"🚀 *Getting started!* Every expert was once a beginner!\n"
        else:
            message += f"🎯 *Ready to begin?* Start your learning journey now!\n"

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
        message += "💡 *How to Pay:*\n"
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
🎓 *NerdX Quiz Bot Help*

*Commands:*
• `menu` - Show main menu
• `credits` - Check credit balance
• `stats` - View your statistics
• `help` - Show this help message
• `buy credits` - Purchase credits
• `reset limits` - Reset rate limits if experiencing delays

*Features:*
📚 Study ZIMSEC subjects (Biology, Chemistry, Physics, Math, English)
🤖 AI-generated questions
📸 Solve math problems from images
📊 Track your progress
🎯 Earn points and maintain streaks

*Credit Costs (WhatsApp - Option B - Student-Friendly):*
• Commands: 1 credit = 2 commands (bundled to save credits!)
• AI Questions: 1 credit per question (affordable learning)
• Complex Features: 2 credits (essays, comprehension, A-Level, audio, images)

Need more help? Contact support!
"""
    whatsapp_service.send_message(user_id, help_text)

def handle_graph_request(user_id: str, function_text: str):
    """Handle graph generation requests"""
    try:
        # Check credits
        current_credits = get_user_credits(user_id)
        required_credits = advanced_credit_service.get_credit_cost('math_graph_practice', platform='whatsapp')

        if current_credits < required_credits:
            insufficient_msg = f"""💰 *Need More Credits!* 💰

📊 *Math Graph Practice*

💳 *Credit Status:*
• Current Credits: {format_credits(current_credits)}
• Required Credits: {format_credits(required_credits)}
• Need: {format_credits(required_credits - current_credits)} more credits

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
            deduct_credits(user_id, required_credits, "math_graph_practice", "Math graph generation")

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
        # CRITICAL FIX: Use single message instead of multiple message chains  
        # Add back button to the buttons list
        buttons.append({"text": "🔙 Back to Subjects", "callback_data": "level_ordinary"})
        
        # Send as single message to prevent message chains
        whatsapp_service.send_interactive_message(user_id, text, buttons)

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

        referral_message = f"""👥 *{name}'s Referral Center* 👥

🎯 *Your Referral Code:* `{referral_code}`

📊 *Referral Stats:*
• Friends Referred: {successful_referrals}
• Total Referrals: {total_referrals}
• Credits Earned: {total_bonus_earned}

💎 *Earn {referrer_bonus} credits* for each friend who registers!

✨ *How it works:*
1️⃣ Share your referral link with friends
2️⃣ They click the link and register (get 150 welcome credits)
3️⃣ You get +{referrer_bonus} credits automatically!

📲 Share your referral link to earn more credits!"""

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
        # Get credits from users_registration table (primary source)
        current_credits = registration.get('credits', 0) if registration else 0
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
        text += f"📊 *Your Science Journey:*\n"
        text += f"💳 Credits: *{current_credits}*\n"
        text += f"⭐ Level: *{current_level}* (XP: {current_xp})\n"
        text += f"🔥 Streak: *{current_streak} days*\n"
        text += f"🎯 Next Level: *{xp_for_next_level} XP needed*\n\n"

        text += f"I'm here to help you master science, {user_name}, with:\n\n"
        text += f"🧬 *Biology Questions:* Earn 5-10 XP per question\n"
        text += f"⚗️ *Chemistry Questions:* Earn 5-10 XP per question\n"
        text += f"⚡ *Physics Questions:* Earn 5-10 XP per question\n"
        text += f"📚 *Combined Exams:* Earn 8-15 XP per question\n"
        text += f"🔥 *Daily Streaks:* Maintain consistent learning\n\n"

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
        text += f"📊 *Your Math Journey:*\n"
        text += f"💳 Credits: *{current_credits}*\n"
        text += f"⭐ Level: *{current_level}* (XP: {current_xp})\n"
        text += f"🔥 Streak: *{current_streak} days*\n"
        text += f"🎯 Next Level: *{xp_for_next_level} XP needed*\n\n"

        text += f"I'm here to help you master math, {user_name}, with:\n\n"
        text += f"📚 *Practice Questions:* Earn 5-10 XP per question\n"
        text += f"📷 *Image Math Solver:* Earn 30 XP per solution\n"
        text += f"📈 *Graph Generation:* Earn 25 XP per graph\n"
        text += f"🔥 *Daily Streaks:* Maintain consistent learning\n\n"

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
        text += f"💳 Credits: *{current_credits}*\n"
        text += f"⭐ Level: *{current_level}* (XP: {current_xp})\n"
        text += f"🔥 Streak: *{current_streak} days*\n"
        text += f"🎯 Next Level: *{xp_for_next_level} XP needed*\n\n"
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
        text += f"📚 *Comprehension:* Reading skills & text analysis\n"
        text += f"✍️ *Essay Writing:* All essay types with AI feedback\n"
        text += f"📝 *Grammar:* Rules, exercises & practice\n"
        text += f"🎤 *Audio Lessons:* Listen and learn effectively\n\n"
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
        continue_message = "🎵 *Ready for your next question!*\n\n"
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
        # CRITICAL FIX: Use single message instead of multiple message chains  
        # Add back button to the buttons list
        buttons.append({"text": "🔙 Back to Combined Science", "callback_data": "subject_ordinary_combined_science"})
        
        # Send as single message to prevent message chains
        whatsapp_service.send_interactive_message(user_id, text, buttons)

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
        required_credits = advanced_credit_service.get_credit_cost('combined_science_exam', platform='whatsapp')

        if current_credits < required_credits:
            # Enhanced gamified insufficient credits message
            insufficient_msg = f"""💰 *Need More Credits for Exam!* 💰

🧪 *Combined Science Exam Mode*
👤 Student: {user_name}

💳 *Credit Status:*
• Current Credits: {format_credits(current_credits)}
• Required Credits: {format_credits(required_credits)}
• Need: {format_credits(required_credits - current_credits)} more credits

🎮 *Exam Mode Benefits:*
• Biology, Chemistry & Physics questions
• Past paper questions with images
• XP and level progression
• Streak building opportunities
• Real ZIMSEC exam simulation

💎 *Get More Credits:*"""

            buttons = [
                {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                {"text": "🔙 Back to Subjects", "callback_data": "subject_ordinary_combined_science"}
            ]

            whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
            return

        # Enhanced gamified exam introduction
        text = f"""🧪 *Combined Science Exam Mode* 🧪

👤 Welcome {user_name}!
💰 Credits Available: {format_credits(current_credits)}
💳 Cost Per Question: {format_credits(required_credits)} credits

🎯 *Exam Features:*
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

        # Check and deduct credits for combined exam question (WhatsApp uses Option B)
        credit_result = advanced_credit_service.check_and_deduct_credits(
            user_id,
            'combined_science_exam',
            None,
            platform='whatsapp'
        )

        if not credit_result['success']:
            if credit_result.get('insufficient'):
                # Show insufficient credits message
                current_credits = credit_result['current_credits']
                required_credits = credit_result['required_credits']
                shortage = credit_result['shortage']

                insufficient_msg = f"""💰 *Need More Credits for Exam!* 💰

🧪 *Combined Science Exam Question*

💳 *Credit Status:*
• Current Credits: {format_credits(current_credits)}
• Required Credits: {format_credits(required_credits)}
• Need: {format_credits(shortage)} more credits

🎮 *Exam Mode Benefits:*
• Biology, Chemistry & Physics questions
• Past paper questions with images
• XP and level progression
• Streak building opportunities
• Real ZIMSEC exam simulation

💎 *Get More Credits:*"""

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
            image_caption = f"🖼️ *Combined Science Exam - Question Image*\n📖 Subject: {question_data.get('category', 'Combined Science')}\n📝 Topic: {question_data.get('topic', 'General')}"
            whatsapp_service.send_image(user_id, image_url, image_caption)

            # Wait to ensure image appears first in chat
            import time
            time.sleep(2)

            # Then send question text with options
            message = f"📚 *Combined Science Exam* 📚\n\n"
            message += f"❓ *Question:*\n{question_text_content}\n\n"
            message += f"🅰️ A) {option_a}\n"
            message += f"🅱️ B) {option_b}\n"
            message += f"🅾️ C) {option_c}\n"
            message += f"🆎 D) {option_d}\n\n"
            message += f"💭 *Choose your answer, {user_name}!*"

        else:
            # Text-only question - send directly
            message = f"📚 *Combined Science Exam* 📚\n\n"
            message += f"📖 *Subject:* {question_data.get('category', 'Combined Science')}\n"
            message += f"📝 *Topic:* {question_data.get('topic', 'General')}\n\n"
            message += f"❓ *Question:*\n{question_text_content}\n\n"
            message += f"🅰️ A) {option_a}\n"
            message += f"🅱️ B) {option_b}\n"
            message += f"🅾️ C) {option_c}\n"
            message += f"🆎 D) {option_d}\n\n"
            message += f"💭 *Choose your answer, {user_name}!*"

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
        from database.external_db import get_user_registration, get_user_stats, update_user_stats, get_user_credits, add_xp, update_streak

        # Get exam session
        exam_session = get_combined_exam_session(user_id)
        if not exam_session:
            whatsapp_service.send_message(user_id, "❌ No active exam session found.")
            return

        question_data = exam_session['question_data']
        correct_answer = question_data.get('correct_answer', '').upper().strip()
        user_answer = user_answer.upper().strip()

        # Get user info
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
            message = f"✅ *Excellent work, {user_name}!* 🎉\n\n"
            message += f"🎯 *Your answer: {user_answer}* ✓ CORRECT!\n\n"
        else:
            message = f"❌ *Not quite right, {user_name}* 📚\n\n"
            message += f"🎯 *Your answer: {user_answer}* ✗ Incorrect\n"
            message += f"✅ *Correct answer: {correct_answer}*\n\n"

        # Add explanation if available (shortened for Combined Science)
        explanation = question_data.get('explanation', question_data.get('solution', ''))
        if explanation:
            # Shorten explanation to maximum 200 characters for Combined Science
            if len(explanation) > 200:
                explanation = explanation[:200] + "... (Answer focus only)"
            message += f"💡 *Explanation:*\n{explanation}\n\n"

        # Enhanced user stats display
        message += f"📊 *{user_name}'s Progress Dashboard:*\n"
        message += f"💳 *Credits:* {final_credits}\n"
        message += f"⭐ *Level:* {final_level} (XP: {final_xp})\n"
        message += f"🔥 *Streak:* {final_streak}\n"

        if is_correct:
            message += f"✨ *Points Earned:* +{points_earned} XP\n"
            if final_level > current_level:
                message += f"🎊 *LEVEL UP!* Welcome to Level {final_level}!\n"

        # Calculate progress toward next level using the XP->level formula
        try:
            current_threshold = 100 * ((max(final_level, 1) - 1) ** 2)
            next_threshold = 100 * (max(final_level, 1) ** 2)
            total_needed = max(1, next_threshold - current_threshold)
            progressed = max(0, final_xp - current_threshold)
            progress_percentage = max(0.0, min(100.0, (progressed / total_needed) * 100.0))
        except Exception:
            # Fallback to simple modulo-based progress
            progress_percentage = (final_xp % 100) / 100 * 100

        filled_blocks = int(progress_percentage / 10)
        progress_bar = "▓" * filled_blocks + "░" * (10 - filled_blocks)

        message += f"📊 Level Progress: [{progress_bar}] {progress_percentage:.0f}%\n\n"

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

def generate_and_send_question(chat_id: str, subject: str, topic: str, difficulty: str, user_name: str, question_type: str = 'mcq'):
    """Generate and send a question to the user"""
    try:
        # Validate input parameters
        if not all([chat_id, subject, topic, difficulty, user_name]):
            logger.error(f"Missing required parameters: chat_id={chat_id}, subject={subject}, topic={topic}, difficulty={difficulty}, user_name={user_name}")
            whatsapp_service.send_message(chat_id, "❌ Invalid request parameters. Please try again.")
            return

        logger.info(f"Starting question generation for {chat_id}: {subject}/{topic}/{difficulty} (type={question_type})")

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

        # Get credit cost based on subject/type
        if subject in ["Biology", "Chemistry", "Physics"]:
            action_key = 'combined_science_topical_structured' if (question_type or '').lower() == 'structured' else 'combined_science_topical_mcq'
        elif subject == "Mathematics":
            action_key = 'math_topical'
        elif subject == "English":
            action_key = 'english_topical'
        else:
            action_key = 'combined_science_topical'

        credit_cost = advanced_credit_service.get_credit_cost(action_key, platform='whatsapp')

        # Check if user has enough credits
        if credits < credit_cost:
            insufficient_msg = f"""💰 *Need More Credits!* 💰

🧬 *{subject} {difficulty} Question*
📚 Topic: {topic}

💳 *Credit Status:*
• Current Credits: {format_credits(credits)}
• Required Credits: {format_credits(credit_cost)}
• Need: {format_credits(credit_cost - credits)} more credits

🎯 Master {subject} with personalized questions!"""

            buttons = [
                {"text": "💳 Buy Credits", "callback_data": "buy_credits"},
                {"text": "🔙 Back", "callback_data": "main_menu"}
            ]

            whatsapp_service.send_interactive_message(chat_id, insufficient_msg, buttons)
            return

        # Send loading message with more specific text
        whatsapp_service.send_message(chat_id, f"🧬 Generating {difficulty} {subject} question on {topic}...\n⏳ Please wait while our AI creates your question...")

        question_data = None

        if subject in ["Biology", "Chemistry", "Physics"]:
            if (question_type or 'mcq').lower() == 'structured':
                logger.info(f"Generating structured science question: {subject} - {topic} - {difficulty}")
                from services.combined_science_generator import CombinedScienceGenerator
                science_gen = CombinedScienceGenerator()
                question_data = science_gen.generate_structured_question(subject, topic, difficulty, chat_id, platform='whatsapp')
            else:
                logger.info(f"Generating MCQ science question: {subject} - {topic} - {difficulty}")
                from services.ai_service import AIService
                ai_service = AIService()
                question_data = ai_service.generate_science_question(subject, topic, difficulty, platform='whatsapp')
        elif subject == "Mathematics":
            logger.info(f"Generating math question: {topic} - {difficulty}")
            from services.ai_service import AIService
            ai_service = AIService()
            question_data = ai_service.generate_math_question(topic, difficulty, platform='whatsapp')
        elif subject == "English":
            logger.info(f"Generating English question: {topic} - {difficulty}")
            from services.ai_service import AIService
            ai_service = AIService()
            question_data = ai_service.generate_english_question(topic, difficulty, platform='whatsapp')
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
            # Structured science questions are typed answers and marked by DeepSeek
            if (question_data.get('question_type') or '').lower() == 'structured':
                return _send_structured_science_question_to_user(chat_id, question_data, subject, topic, difficulty, user_name, credits_used, new_balance)

            # Science MCQ format
            message = f"🧪 *{subject} - {topic}*\n"
            message += f"👤 {user_name} | 🎯 {difficulty.title()} Level | 💎 {question_data.get('points', 10)} points\n"
            if credits_used > 0:
                message += f"💳 *Credits Used:* {format_credits(credits_used)} | 💰 *Balance:* {format_credits(new_balance)}\n\n"
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


def _send_structured_science_question_to_user(chat_id: str, question_data: Dict, subject: str, topic: str, difficulty: str, user_name: str, credits_used: int, new_balance: int):
    """Send a structured science question and store a session for typed answer marking."""
    try:
        stem = (question_data.get('stem') or '').strip()
        parts = question_data.get('parts') or []
        total_marks = question_data.get('total_marks', '')

        message = f"🧪 *{subject} - {topic}*\n"
        message += f"👤 {user_name} | 🎯 {difficulty.title()} | 📝 *Structured* | 💯 {total_marks} marks\n"
        message += f"💳 *Credits Used:* {format_credits(credits_used)} | 💰 *Balance:* {format_credits(new_balance)}\n\n"

        if stem:
            message += f"*Stem/Instructions:*\n{stem}\n\n"

        message += "*Question (answer all parts):*\n"
        for p in parts[:10]:
            label = p.get('label', '')
            q = (p.get('question') or '').strip()
            marks = p.get('marks', 1)
            message += f"{label} {q} [{marks}]\n"

        message += "\n✍️ *Reply with your answers labelled*, for example:\n"
        message += "a(i) ...\na(ii) ...\n(b) ...\n\n"
        message += "_I will mark it (ZIMSEC-style) and give professional teacher feedback + a well detailed explanation._"

        whatsapp_service.send_message(chat_id, message[:4096])

        from database.session_db import save_user_session
        session_data = {
            'question_data': question_data,  # store as dict (not double-encoded)
            'subject': subject,
            'topic': topic,
            'difficulty': difficulty,
            'question_source': question_data.get('source', 'ai_generated_olevel'),
            'session_type': 'science_structured_question'
        }
        save_user_session(chat_id, session_data)
        logger.info(f"Stored science_structured_question session for {chat_id}")
        return True

    except Exception as e:
        logger.error(f"Error sending structured science question to {chat_id}: {e}", exc_info=True)
        whatsapp_service.send_message(chat_id, "❌ Error sending structured question. Please try again.")
        return False


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

def handle_combined_science_topic_menu(user_id: str, subject: str, page: int = 1):
    """Show paginated topic selection menu for specific Combined Science subject"""
    try:
        from database.external_db import get_user_registration, get_user_stats, get_user_credits
        
        # Get user details
        registration = get_user_registration(user_id)
        user_name = registration.get('name', 'Student') if registration else 'Student'
        current_credits = get_user_credits(user_id)
        user_stats = get_user_stats(user_id) or {'level': 1, 'xp_points': 0, 'streak': 0}
        current_level = user_stats.get('level', 1)
        
        # Get subject icon
        subject_icons = {
            'Biology': '🧬',
            'Chemistry': '⚗️', 
            'Physics': '⚡'
        }
        icon = subject_icons.get(subject, '🔬')
        
        # Get topics for the subject
        all_topics = TOPICS.get(subject, [])
        if not all_topics:
            whatsapp_service.send_message(user_id, f"❌ No topics available for {subject}.")
            return
        
        # Implement pagination for topics (10 per page to respect WhatsApp limit)
        page_size = 10
        total_pages = (len(all_topics) + page_size - 1) // page_size
        start_idx = (page - 1) * page_size
        end_idx = min(start_idx + page_size, len(all_topics))
        page_topics = all_topics[start_idx:end_idx]
        
        # Create header message with pagination info
        text = f"{icon} *{subject} Topics Menu* {icon}\n\n"
        text += f"👤 Hey {user_name}! Ready to master {subject}?\n\n"
        text += f"📊 *Your Progress:*\n"
        text += f"💳 Credits: *{current_credits}*\n"
        text += f"⭐ Level: *{current_level}*\n\n"
        
        if total_pages > 1:
            text += f"📄 *Page {page} of {total_pages}* ({len(page_topics)} topics)\n\n"
        
        text += f"🎯 *{subject} Learning Benefits:*\n"
        text += f"• Knowledge-focused ZIMSEC questions\n"
        text += f"• Diverse questions per topic (no repeats!)\n"
        text += f"• Theory + application mix\n"
        text += f"• 5-10 XP per correct answer\n\n"
        text += f"📚 *Select a {subject} topic to practice:*"
        
        # Create buttons for current page topics
        buttons = []
        for topic in page_topics:
            callback_data = f"topic_{subject}_{topic.replace(' ', '_')}"
            buttons.append({
                "text": f"📖 {topic}",
                "callback_data": callback_data
            })
        
        # Add pagination buttons if needed
        if total_pages > 1:
            if page > 1:
                buttons.append({
                    "text": f"⬅️ Previous ({page-1}/{total_pages})",
                    "callback_data": f"topic_page_{subject}_{page-1}"
                })
            if page < total_pages:
                buttons.append({
                    "text": f"Next ({page+1}/{total_pages}) ➡️",
                    "callback_data": f"topic_page_{subject}_{page+1}"
                })
        
        # Add back button
        buttons.append({
            "text": "🔙 Back to Subjects", 
            "callback_data": "subject_ordinary_combined_science"
        })
        
        # Send as list message (now supports pagination)
        whatsapp_service.send_interactive_message(user_id, text, buttons)
        
        logger.info(f"✅ Displayed {subject} topics menu page {page}/{total_pages} for user {user_id}")
        
    except Exception as e:
        logger.error(f"Error handling {subject} topics menu for {user_id}: {e}", exc_info=True)
        whatsapp_service.send_message(user_id, f"❌ Error loading {subject} topics. Please try again.")

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
        message += "   • 1 credit • 15 XP points\n"
        message += "   • Problem-solving skills\n\n"

        message += "🔴 *Difficult* - Advanced analysis\n"
        message += "   • 1 credit • 20 XP points\n"
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

def handle_combined_science_question(user_id: str, subject: str, topic: str, difficulty: str):
    """Handle Combined Science question retrieval from DB by subject/topic with AI fallback"""
    try:
        # Get correct credit amount from users_registration table
        from database.external_db import get_user_credits, deduct_credits
        
        current_credits = get_user_credits(user_id)
        required_credits = advanced_credit_service.get_credit_cost('combined_science_topical_mcq', platform='whatsapp')
        
        # Check if user has enough credits
        if current_credits < required_credits:
            insufficient_msg = f"""💰 *Need More Credits!* 💰

🧪 *Combined Science - {subject}*
🎯 Action: Topical Question

💳 *Credit Status:*
• Current Credits: {format_credits(current_credits)}
• Required Credits: {format_credits(required_credits)}
• Need: {format_credits(required_credits - current_credits)} more credits

🎮 *Combined Science Benefits:*
• Biology, Chemistry & Physics topics
• ZIMSEC exam-style questions
• XP and level progression
• Streak building opportunities
• AI-powered explanations

💎 *Get More Credits:*"""

            buttons = [
                {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]

            whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
            return

        from services.question_service import QuestionService
        from database.external_db import get_user_registration, get_user_stats

        question_service = QuestionService()
        registration = get_user_registration(user_id)
        user_name = registration['name'] if registration else "Student"

        # Get professional O-Level question: DB-first, then professional AI generation
        logger.info(f"🎓 Getting professional O-Level {subject} question for {topic} ({difficulty})")
        question_data = question_service.get_question(user_id, subject, topic, difficulty, force_ai=False)

        if not question_data:
            # Send user-friendly error message
            whatsapp_service.send_message(
                user_id, 
                f"❌ Sorry {user_name}, I couldn't generate a {subject} question for {topic} right now.\n\n"
                f"💡 Try:\n"
                f"• Another topic from the menu\n"
                f"• Try again in a moment\n"
                f"• Contact support if this continues"
            )
            return

        # Store question in session
        from database.session_db import save_user_session, add_question_to_history
        save_user_session(user_id, {
            'question_data': question_data,
            'subject': subject,
            'topic': topic,
            'difficulty': difficulty,
            'session_type': 'combined_science'
        })

        # Track question history to avoid repeats and enable random selection
        import hashlib
        question_hash = hashlib.md5(question_data['question'].encode()).hexdigest()
        add_question_to_history(user_id, question_hash, topic, difficulty)

        # Deduct credits after successful question generation
        deduct_success = deduct_credits(user_id, required_credits, 'combined_science_topical_mcq', f'{subject} topical question - {topic}')
        
        if not deduct_success:
            whatsapp_service.send_message(user_id, "❌ Error processing credits. Please try again.")
            return
            
        # Get updated credits after deduction
        new_credits = get_user_credits(user_id)
        
        # Display question with proper formatting including credit deduction info
        user_stats = get_user_stats(user_id)
        current_level = user_stats.get('level', 1) if user_stats else 1

        # O-Level student-friendly question display
        subject_icons = {'Biology': '🧬', 'Chemistry': '⚗️', 'Physics': '⚡'}
        icon = subject_icons.get(subject, '🔬')
        
        message = f"{icon} *{subject} - {topic}* {icon}\n\n"
        message += f"Hi {user_name}! Here's your O-Level question:\n\n"
        message += f"📚 **{topic}** ({difficulty.title()} Level)\n\n"

        message += f"{question_data['question']}\n\n"

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
        # Get final credits from users_registration table (primary source)
        updated_registration = get_user_registration(user_id)
        final_credits = updated_registration.get('credits', 0) if updated_registration else 0
        final_xp = updated_stats.get('xp_points', 0)
        final_streak = updated_stats.get('streak', 0)
        final_level = updated_stats.get('level', 1)

        # Enhanced gamified result message
        if is_correct:
            message = f"🎉 *OUTSTANDING!* {user_name}! 🎉\n\n"
            message += f"✅ *Correct Answer:* {correct_answer}\n"
            message += f"🧪 *Subject:* {subject}\n"
            message += f"📚 *Topic:* {topic}\n"
            message += f"💎 *XP Earned:* +{points}\n"
            message += f"🔥 *Streak:* {final_streak}\n\n"

            # Special streak messages for Combined Science
            if final_streak >= 10:
                message += f"🏆 *SCIENCE MASTER!* You're dominating Combined Science!\n"
            elif final_streak >= 5:
                message += f"⚡ *SCIENCE STREAK!* Keep those experiments going!\n"
            elif final_streak >= 3:
                message += f"🧬 *BUILDING KNOWLEDGE!* Science skills growing!\n"
            message += "\n"
        else:
            message = f"📚 *Keep Experimenting,* {user_name}! 📚\n\n"
            message += f"🎯 *Correct Answer:* {correct_answer}\n"
            message += f"🧪 *Subject:* {subject}\n"
            message += f"📚 *Topic:* {topic}\n"
            message += f"💡 *Science Tip:* Every scientist learns from trials!\n"
            message += f"🔥 *Streak:* {final_streak} (Keep trying to build it up!)\n\n"

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

        message += f"🔬 *Scientific Explanation:*\n{summary_explanation}\n\n"

        # Check for level up
        level_up_bonus = ""
        if is_correct and new_level > current_level:
            level_up_bonus = f"🎉 *LEVEL UP!* Welcome to Level {new_level}!"

        # Enhanced gamified stats display
        message += f"🎮 *Your Science Progress* 🎮\n"
        message += f"━━━━━━━━━━━━━━━━━━━━\n"
        message += f"💰 *Credits:* {final_credits}\n"
        message += f"⚡ *Total XP:* {final_xp}\n"
        message += f"🔥 *Current Streak:* {final_streak}\n"
        message += f"🏆 *Level:* {final_level}\n"

        # Add level progress
        xp_for_next_level = (final_level * 100) - final_xp
        if xp_for_next_level > 0:
            message += f"📈 *Next Level:* {xp_for_next_level} XP away!\n"
        else:
            message += f"🌟 *Science Expert!* Keep exploring!\n"

        message += f"━━━━━━━━━━━━━━━━━━━━\n"

        if level_up_bonus:
            message += f"\n{level_up_bonus}\n"

        # Enhanced navigation buttons with gamification - Include topic and difficulty for next question
        topic_safe = topic.replace(' ', '_')  # Make topic safe for callback data
        buttons = [
            {"text": f"➡️ Next {subject} (+{points} XP)", "callback_data": f"next_science_{subject.lower()}_{topic_safe}_{difficulty}"},
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
║ {selected_package['icon']} *{selected_package['name'].upper()}* {selected_package['icon']} ║
╚══════════════════════════╝

💰 *Price*: ${selected_package['price']:.2f} USD
💎 *Credits*: {selected_package['credits']} credits
🏷️ *Per Credit*: ${cost_per_credit:.3f}{"" if savings_percent <= 0 else f" ({savings_percent}% savings!)"}

🎯 *Perfect For*: {selected_package['description']}
💡 *Best For*: {selected_package['best_for']}

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

💰 *Amount*: ${selected_package['price']:.2f} USD
💎 *Credits*: {selected_package['credits']} credits

🚀 *CHOOSE YOUR PAYMENT METHOD:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"""

        # Prepare payment method buttons
        buttons = []

        # Check if Paynow is available and add instant payment option
        if paynow_service.is_available():
            buttons.append({
                "text": "⚡ Paynow USD EcoCash (INSTANT)", 
                "callback_data": f"paynow_payment_{package_id}"
            })
            message += "\n⚡ *Paynow USD EcoCash* - Instant payment & automatic credits"

        # Always add manual payment option as fallback
        buttons.extend([
            {"text": "📱 Manual EcoCash SMS Verification", "callback_data": f"manual_payment_{package_id}"},
            {"text": "⬅️ BACK", "callback_data": f"select_package_{package_id}"}
        ])

        message += "\n📱 *Manual EcoCash* - Traditional SMS verification (5-30 mins)"
        message += "\n\n🔒 *Both methods are 100% secure and verified*"

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

        help_message = f"💡 *PAYMENT HELP*\n\n"
        help_message += f"📱 *EcoCash Payment Process:*\n"
        help_message += f"1️⃣ Select a credit package\n"
        help_message += f"2️⃣ Send money to: {payment_service.ecocash_number}\n"
        help_message += f"3️⃣ Copy your confirmation SMS\n"
        help_message += f"4️⃣ Submit SMS for verification\n"
        help_message += f"5️⃣ Wait for approval (5-30 minutes)\n\n"
        help_message += f"❓ *Common Issues:*\n"
        help_message += f"• Make sure to send exact amount\n"
        help_message += f"• Include reference code if prompted\n"
        help_message += f"• Submit complete SMS confirmation\n"
        help_message += f"• Contact support if payment fails\n\n"
        help_message += f"📞 *Need More Help?*\n"
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

👋 Hi *{user_name}*! Ready to receive your EcoCash confirmation SMS.

📄 *Expected Format:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Confirmed. You have sent ${package['price']:.2f} to +263785494594..."

💡 *Quick Tips:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Copy the ENTIRE SMS from EcoCash
✅ Include the transaction ID
✅ Verify amount matches ${package['price']:.2f}

📲 *Please paste your EcoCash confirmation SMS below:*"""

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

            message = """❌ *Payment Session Expired*

Your payment session has expired or was incomplete. 

🔄 *To purchase credits:*
1. Click "💰 Buy Credits" below 
2. Select your desired package
3. Follow the payment instructions

💡 *Tip:* Complete the payment process within 10 minutes to avoid session timeout."""

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

👋 Hi *{user_name}*! Your payment proof has been received and is being processed.

💎 *𝗬𝗼𝘂𝗿 𝗢𝗿𝗱𝗲𝗿:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Package: *{package['name']}*
💰 Credits: *{package['credits']} credits*
💳 Amount: *${package['price']:.2f}*
🔢 Reference: `{reference_code}`
⏰ Submitted: {datetime.now().strftime('%H:%M on %d/%m/%Y')}

🚀 *𝗪𝗵𝗮𝘁'𝘀 𝗡𝗲𝘅𝘁?*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Verification: 5-30 minutes
📱 Notification: WhatsApp alert
💎 Credits: Instant activation
🎯 Learning: Start immediately!

💡 *Pro Tip*: Continue using existing credits while we verify your payment!

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
                "❌ *Paynow Service Unavailable*\n\n"
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
        message = f"""📱 *PAYNOW USD ECOCASH PAYMENT* ⚡

🎯 *Package*: {selected_package['name']}
💰 *Amount*: ${selected_package['price']:.2f} USD
💎 *Credits*: {selected_package['credits']} credits

⚡ *INSTANT PAYMENT SETUP*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 *Please provide your EcoCash number* for instant payment:

Format: 077XXXXXXX or 078XXXXXXX or +263XXXXXXXXX

💡 *Benefits of Paynow:*
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

📱 *𝗘𝗖𝗢𝗖𝗔𝗦𝗛 𝗣𝗔𝗬𝗠𝗘𝗡𝗧:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 *Number*: +263 785494594
💰 *Amount*: ${selected_package['price']:.2f} USD
📋 *Reference*: `{reference_code}`

🎯 *𝗦𝗜𝗠𝗣𝗟𝗘 𝗦𝗧𝗘𝗣𝗦:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ Send ${selected_package['price']:.2f} to +263 785494594
2️⃣ Copy your EcoCash confirmation SMS
3️⃣ Click "I SENT MONEY" below
4️⃣ Paste SMS → Get credits in 5-30 mins!

🛡️ *𝗪𝗵𝘆 𝗦𝗠𝗦 𝗩𝗲𝗿𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻?*
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

        # Validate local format - MUST be exactly 10 digits
        # Check length first (must be exactly 10 digits)
        if len(local_phone) != 10:
            whatsapp_service.send_message(user_id, 
                "❌ *Invalid Phone Number Format*\n\n"
                "Please provide a valid Zimbabwe EcoCash number:\n"
                "• Format: 077XXXXXXX or 078XXXXXXX (10 digits total)\n"
                "• Example: 0771234567\n"
                f"• Your number has {len(local_phone)} digits (must be exactly 10)\n\n"
                "Please send your EcoCash number again:")
            return
        
        # Check prefix and format (must start with 07 and have valid prefix)
        if not (local_phone.startswith('07') and local_phone[:3] in ['077', '078']):
            whatsapp_service.send_message(user_id, 
                "❌ *Invalid Phone Number Format*\n\n"
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
            f"⚡ *PROCESSING PAYNOW PAYMENT...*\n\n"
            f"📱 Phone: {local_phone}\n"
            f"💰 Amount: ${amount:.2f} USD\n"
            f"💎 Credits: {credits}\n\n"
            f"🔄 Creating payment link... Please wait...")

        # Initiate Paynow payment using PaymentService for consistent reference codes
        try:
            from services.payment_service import payment_service
            
            # Use PaymentService to create payment (ensures consistent reference codes)
            payment_creation = payment_service.create_paynow_payment(
                user_id=user_id,
                package_id=package_id,
                phone_number=local_phone,
                email="neezykidngoni@gmail.com"  # Paynow account email
            )
            
            # #region agent log
            import json
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"webhook.py:5300","message":"Checking payment_creation result","data":{"success":payment_creation.get('success'),"has_error":'error' in payment_creation,"error":payment_creation.get('error'),"message":payment_creation.get('message')},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
            if not payment_creation.get('success'):
                # #region agent log
                try:
                    with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"webhook.py:5305","message":"Payment creation FAILED - about to raise exception","data":{"error":payment_creation.get('error'),"message":payment_creation.get('message')},"timestamp":int(__import__('time').time()*1000)})+'\n')
                except: pass
                # #endregion
                raise Exception(payment_creation.get('message', 'Payment creation failed'))
            
            payment_response = payment_creation
            redirect_url = payment_creation.get('poll_url')
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"webhook.py:5310","message":"Payment creation SUCCESS - checking redirect_url","data":{"has_redirect_url":bool(redirect_url),"redirect_url":str(redirect_url) if redirect_url else None},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion

            if redirect_url:
                # Success - send payment link with message from payment service
                message_text = payment_creation.get('message', '')
                # #region agent log
                try:
                    with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"webhook.py:5312","message":"BEFORE sending success message to user","data":{"has_message_text":bool(message_text),"message_length":len(message_text) if message_text else 0},"timestamp":int(__import__('time').time()*1000)})+'\n')
                except: pass
                # #endregion
                if message_text:
                    try:
                        whatsapp_service.send_message(user_id, message_text)
                        # #region agent log
                        try:
                            with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"webhook.py:5316","message":"AFTER sending success message - SUCCESS","data":{},"timestamp":int(__import__('time').time()*1000)})+'\n')
                        except: pass
                        # #endregion
                    except Exception as send_error:
                        # #region agent log
                        try:
                            with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"G","location":"webhook.py:5320","message":"FAILED to send message to user","data":{"exception_type":type(send_error).__name__,"exception_message":str(send_error)},"timestamp":int(__import__('time').time()*1000)})+'\n')
                        except: pass
                        # #endregion
                        raise
                else:
                    # Fallback message if payment service didn't return one
                    message = f"""✅ *PAYNOW PAYMENT READY!* ⚡

📱 *Payment Details:*
• Phone: {local_phone}
• Amount: ${amount:.2f} USD
• Credits: {credits}

🚀 *Next Step:*
Click the link below to complete your EcoCash payment:

{redirect_url}

⏱️ *What happens next:*
1️⃣ Click the payment link
2️⃣ Authorize the payment on your phone
3️⃣ Credits will be added automatically (5-30 seconds)

💡 *Payment expires in 5 minutes*"""
                    whatsapp_service.send_message(user_id, message)
                
                logger.info(f"Paynow payment initiated for {user_id}: poll_url={redirect_url}")
            else:
                # Fallback to manual payment
                whatsapp_service.send_message(user_id, 
                    "❌ *Payment Link Generation Failed*\n\n"
                    "The instant payment system encountered an issue. "
                    "Let's use manual payment instead.")
                handle_manual_payment(user_id, package_id)

        except Exception as payment_error:
            logger.error(f"Paynow payment exception for {user_id}: {payment_error}", exc_info=True)
            error_message = str(payment_error)
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"webhook.py:5345","message":"EXCEPTION caught in payment flow","data":{"exception_type":type(payment_error).__name__,"error_message":error_message},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
            
            # Provide more specific error message
            if "Invalid phone number" in error_message:
                # #region agent log
                try:
                    with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"webhook.py:5350","message":"Sending Invalid Phone Number error to user","data":{},"timestamp":int(__import__('time').time()*1000)})+'\n')
                except: pass
                # #endregion
                whatsapp_service.send_message(user_id, 
                    "❌ *Invalid Phone Number*\n\n"
                    "The phone number format is incorrect. Please try again with a valid EcoCash number:\n"
                    "• Format: 077XXXXXXX or 078XXXXXXX\n"
                    "• Example: 0771234567")
            elif "not available" in error_message.lower():
                whatsapp_service.send_message(user_id, 
                    "❌ *Payment Service Unavailable*\n\n"
                    "The instant payment system is temporarily unavailable. "
                    "Let's use manual payment instead.")
                handle_manual_payment(user_id, package_id)
            else:
                # #region agent log
                try:
                    with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"webhook.py:5362","message":"Sending generic Payment System Error to user","data":{"error_message":error_message},"timestamp":int(__import__('time').time()*1000)})+'\n')
                except: pass
                # #endregion
                try:
                    whatsapp_service.send_message(user_id, 
                        f"❌ *Payment System Error*\n\n"
                        f"Error: {error_message}\n\n"
                        "The instant payment system encountered an issue. "
                        "Let's use manual payment instead.")
                    # #region agent log
                    try:
                        with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"G","location":"webhook.py:5370","message":"Error message sent to user successfully","data":{},"timestamp":int(__import__('time').time()*1000)})+'\n')
                    except: pass
                    # #endregion
                except Exception as send_err:
                    # #region agent log
                    try:
                        with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"G","location":"webhook.py:5375","message":"FAILED to send error message to user","data":{"exception_type":type(send_err).__name__,"exception_message":str(send_err)},"timestamp":int(__import__('time').time()*1000)})+'\n')
                    except: pass
                    # #endregion
                    logger.error(f"Failed to send error message to user: {send_err}")
                handle_manual_payment(user_id, package_id)

    except Exception as e:
        logger.error(f"Error handling Paynow phone collection for {user_id}: {e}")
        whatsapp_service.send_message(user_id, "❌ Error processing phone number. Please try again.")
