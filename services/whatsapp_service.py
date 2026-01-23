import os
import json
import logging
import requests
import time
import re
from typing import Dict, List, Optional, Any
from services.message_throttle import message_throttle
from services.whatsapp_template_service import get_template_service
from services.content_variation_engine import content_variation_engine
from services.quality_monitor import quality_monitor
from utils.menu_router import menu_router

logger = logging.getLogger(__name__)

class WhatsAppService:
    """Service for handling WhatsApp Business API operations"""
    
    def __init__(self):
        # Twilio WhatsApp configuration (PRIMARY AND ONLY PROVIDER)
        self.twilio_account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.twilio_auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.twilio_phone_number = os.getenv('TWILIO_PHONE_NUMBER')
        
        # Twilio is required - no fallback
        self._is_configured = all([self.twilio_account_sid, self.twilio_auth_token, self.twilio_phone_number])
        if not self._is_configured:
            logger.error("Twilio WhatsApp configuration not complete - WhatsApp features will be disabled")
            logger.error("Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER")
        else:
            logger.info("✅ Using Twilio for WhatsApp messaging (PRIMARY PROVIDER)")
        
        # Enterprise scale protection
        self.daily_message_count = 0
        self.spam_protection_active = True
        self.max_daily_messages = 50000  # Conservative limit for scaling
        self.engagement_tracker = {}
        
        # Initialize template service
        self.template_service = get_template_service(self)
        
        # Quality monitoring
        self.quality_monitor = quality_monitor

    def _format_options_message(self, message: str, options: List[str], prompt: str) -> str:
        """Format a clean, professional menu message for text-only WhatsApp."""
        base = (message or "").strip()
        lines = []
        if base:
            lines.append(base)

        if options:
            if lines:
                lines.append("")
            lines.append("*Options*")
            lines.append("------------------------------")
            for i, option_text in enumerate(options, 1):
                lines.append(f"{i}. {option_text}")
            lines.append("------------------------------")

        if prompt:
            lines.append(prompt)

        return "\n".join(lines).strip()

    def _format_mcq_message(self, message: str, options: List[str], prompt: str) -> str:
        """Format MCQ messages with A/B/C/D style options."""
        base = (message or "").strip()
        lines = []
        if base:
            lines.append(base)

        if options:
            if lines:
                lines.append("")
            lines.append("*Options*")
            lines.append("------------------------------")
            option_labels = ['A', 'B', 'C', 'D', 'E', 'F']
            for i, option_text in enumerate(options):
                label = option_labels[i] if i < len(option_labels) else str(i + 1)
                lines.append(f"{label}. {option_text}")
            lines.append("------------------------------")

        if prompt:
            lines.append(prompt)

        return "\n".join(lines).strip()
    
    def _is_critical_user_response(self, message: str) -> bool:
        """
        Determine if a message is a critical user-initiated response that should bypass throttling.
        This includes ALL legitimate educational interactions, quiz responses, menu selections,
        and user-requested content.
        
        Critical messages are responses to user actions and should NEVER be blocked.
        
        IMPORTANT: Uses specific phrase matching to avoid false positives from generic words.
        """
        message_lower = message.lower()
        normalized_message = message_lower.strip()
        
        # Command messages always bypass throttling
        if normalized_message.startswith('_') or normalized_message.startswith('/'):
            return True
        
        # Check for specific critical phrases (more precise matching)
        critical_phrases = [
            # === REGISTRATION & ONBOARDING ===
            'consent', 'welcome to nerdx', 'registration', 'first name', 'surname', 
            'date of birth', 'referral code', 'invalid date', 'enter a valid',
            'thank you for your consent', 'registration step', 'confirm registration',
            'nerdx id', 'provide your first name', 'provide your surname',
            
            # === PAYMENT & CREDITS ===
            'paynow', 'payment method', 'ecocash', 'buy credits', 'select a package',
            'instant payment', 'payment link', 'complete payment', 'payment ready', 
            'payment details', 'purchase', 'transaction confirmed', 'receipt',
            '+100 credits', '-2 credits', 'credit balance',
            
            # === QUIZ & QUESTIONS ===
            '✅ correct', '❌ incorrect', 'well done', 'great job', 'try again',
            'the answer is', 'answer:', 'solution:', 'explanation:',
            'next question', 'here is your question', 'here\'s your question',
            'question 1', 'question 2', 'question 3', 'question 4', 'question 5',
            'difficulty:', 'your score:', 'streak:', 'xp points', 'points earned',
            
            # === SUBJECT SELECTION ===
            'choose a subject', 'select a subject', 'choose subject', 'select subject',
            'choose mathematics', 'select mathematics', 'mathematics questions',
            'biology', 'chemistry', 'physics', 'english',
            'combined science', 'o-level', 'zimsec', 'syllabus',
            
            # === DIFFICULTY & OPTIONS ===
            'select difficulty', 'choose difficulty', 'difficulty level',
            'easy questions', 'medium questions', 'hard questions',
            'practice mode', 'exam mode', 'timed mode',
            
            # === USER REQUESTS (high-value interactions) ===
            'hint', '💡', 'show answer', 'explain this', 'solution please',
            'help me', 'how to solve', 'what is the', 'why is',
            
            # === MENU & NAVIGATION ===
            'main menu', 'back to menu', 'choose an option', 'select an option',
            'available topics', 'available features', 'dashboard',
            
            # === PROJECT ASSISTANT ===
            'project assistant', 'school-based project', 'research guidance',
            'investigation stage', 'socratic method', 'guidance for',
            'image generation', 'generate image', 'create document',
            'document created', 'word document', 'pdf document',
            
            # === COMPREHENSION ===
            'comprehension passage', 'read the passage', 'reading comprehension',
            'literature extract', 'text analysis',
            
            # === GRAPH PRACTICE ===
            'type your expression', 'plot your graph', 'plot the graph',
            'graph generated', 'equation:', 'function:', 'coordinate',
            
            # === EXAM MODE ===
            'exam started', 'exam mode', 'timed test', 'timer:',
            'past paper', 'specimen paper', 'question 1 of',
            
            # === FEEDBACK & RESULTS ===
            'your results', 'your performance', 'your statistics', 
            'your progress', 'leaderboard', 'your rank', 'achievements',
            
            # === ERROR MESSAGES ===
            'error occurred', 'sorry,', 'apologize', 
            'something went wrong', 'please retry', 'please try',
            
            # === INTERACTIVE RESPONSES (emojis are always critical) ===
            '✅', '❌', '🎯', '📚', '💯', '🔥', '💡', '🎉',
            
            # === INTERACTIVE BUTTONS & CONFIRMATIONS ===
            '✅ yes', '❌ no', 'yes, continue', 'no, skip',
            'confirm your', 'cancel this', 'proceed to', 'go back'
        ]
        
        # Check for any critical phrase match
        for phrase in critical_phrases:
            if phrase in message_lower:
                return True
        
        # Check for specific single-word critical indicators (contextual)
        # These are only critical in specific contexts, not standalone
        contextual_patterns = [
            ('answer:', True),  # "answer: X" is always critical
            ('question:', True),  # "question: X" is always critical
            ('score:', True),  # "score: X" is always critical
            ('hint:', True),  # "hint: X" is always critical
        ]
        
        for pattern, is_critical in contextual_patterns:
            if pattern in message_lower:
                return is_critical
        
        return False

    def _normalize_whatsapp_formatting(self, message: str) -> str:
        """Normalize outgoing WhatsApp formatting and spacing."""
        if not message:
            return message

        # Normalize line endings
        message = message.replace("\r\n", "\n").replace("\r", "\n")

        # Convert markdown-style **bold** to WhatsApp *bold*
        message = re.sub(r"\*\*(.+?)\*\*", r"*\1*", message, flags=re.S)

        # Trim trailing whitespace on each line
        message = "\n".join(line.rstrip() for line in message.split("\n"))

        # Collapse excessive blank lines (max two)
        message = re.sub(r"\n{3,}", "\n\n", message)

        # Add a blank line after the first heading line if needed
        lines = message.split("\n")
        if len(lines) > 1:
            first = lines[0].strip()
            second = lines[1].strip()
            if first and "*" in first and second:
                lines.insert(1, "")
                message = "\n".join(lines)

        return message.strip()
    
    def send_message(self, to: str, message: str) -> bool:
        """Send a text message to a WhatsApp user with enhanced error handling and throttling"""
        if not self._is_configured:
            logger.warning("WhatsApp not configured - message not sent")
            return False
            
        try:
            # Normalize formatting for WhatsApp
            message = self._normalize_whatsapp_formatting(message)

            # Check if this is a critical user-initiated response
            is_critical = self._is_critical_user_response(message)

            # Check quality monitoring before sending (but allow critical messages)
            if self.quality_monitor.should_throttle_messaging():
                if not is_critical:
                    logger.warning(f"Message to {to} blocked by quality monitor - throttling active")
                    return False
                else:
                    logger.info(f"Allowing critical user response to {to} despite quality throttling")
            
            # CRITICAL: Check throttle to prevent message chains (but allow critical messages)
            if not message_throttle.can_send_message(to):
                if not is_critical:
                    delay = message_throttle.throttle_delay(to)
                    if delay > 0:
                        logger.info(f"Throttling message to {to}, waiting {delay:.2f}s")
                        time.sleep(delay)
                        # Recheck after delay
                        if not message_throttle.can_send_message(to):
                            logger.warning(f"Message to {to} blocked by throttle - too many messages")
                            return False
                else:
                    logger.info(f"Allowing critical user response to {to} despite throttle")
            
            # Acquire lock to prevent concurrent sends
            if not message_throttle.acquire_lock(to):
                logger.warning(f"Message to {to} blocked - concurrent send in progress")
                return False
            
            try:
                # Check message length and truncate if needed (Twilio limit: 1600 chars per segment)
                if len(message) > 1600:
                    logger.warning(f"Message too long ({len(message)} chars), truncating")
                    message = message[:1590] + "..."
                
                # Send via Twilio WhatsApp API (PRIMARY AND ONLY PROVIDER)
                from_number = self.twilio_phone_number
                # Ensure 'to' number has whatsapp: prefix if not already present
                to_number = to if to.startswith('whatsapp:') else f'whatsapp:{to}'
                
                url = f"https://api.twilio.com/2010-04-01/Accounts/{self.twilio_account_sid}/Messages.json"
                auth = (self.twilio_account_sid, self.twilio_auth_token)
                
                data = {
                    'From': f'whatsapp:{from_number}',
                    'To': to_number,
                    'Body': message
                }
                
                response = requests.post(url, auth=auth, data=data, timeout=15)
                
                if response.status_code == 200 or response.status_code == 201:
                    logger.info(f"Message sent successfully to {to}")
                    # Record successful send
                    message_throttle.record_message_sent(to)
                    
                    # Track with quality monitor
                    self.quality_monitor.track_message_sent(to)
                    
                    # Enterprise scale monitoring
                    self.daily_message_count += 1
                    self._track_user_engagement(to, 'message_sent')
                    
                    # Track with engagement monitor
                    try:
                        from services.engagement_monitor import engagement_monitor
                        engagement_monitor.track_message_sent(to, message, 'text')
                    except ImportError:
                        pass  # Engagement monitor not available
                    
                    # Scale protection: warn when approaching limits
                    if self.daily_message_count % 1000 == 0:
                        logger.info(f"Daily message count: {self.daily_message_count}/{self.max_daily_messages}")
                    
                    if self.daily_message_count >= self.max_daily_messages:
                        logger.critical(f"SCALE PROTECTION: Daily message limit reached ({self.max_daily_messages})")
                        self.spam_protection_active = True
                    
                    return True
                else:
                    logger.error(f"Failed to send message: {response.status_code} - {response.text}")
                    return False
            finally:
                # Always release lock
                message_throttle.release_lock(to)
                
        except requests.exceptions.Timeout:
            logger.error(f"WhatsApp API timeout for {to}")
            return False
        except requests.exceptions.ConnectionError:
            logger.error(f"Connection error to WhatsApp API for {to}")
            return False
        except Exception as e:
            logger.error(f"Error sending WhatsApp message: {e}")
            return False

    def send_audio_message(self, to: str, audio_file_path: str) -> bool:
        """Send audio message via Twilio WhatsApp API"""
        if not self._is_configured:
            logger.warning("Twilio WhatsApp not configured - audio message not sent")
            return False
            
        try:
            import requests
            import os
            from services.image_hosting_service import ImageHostingService
            
            # Validate file exists and has content
            if not os.path.exists(audio_file_path):
                logger.error(f"Audio file does not exist: {audio_file_path}")
                return False
                
            file_size = os.path.getsize(audio_file_path)
            if file_size == 0:
                logger.error(f"Audio file is empty: {audio_file_path}")
                return False
                
            logger.info(f"Uploading audio file: {audio_file_path} (size: {file_size} bytes)")
            
            # Upload audio to a hosting service to get a public URL (Twilio requires public URL)
            hosting_service = ImageHostingService()
            audio_url = hosting_service.upload_audio_with_fallback(audio_file_path)
            
            if not audio_url:
                logger.error(f"Failed to get public URL for audio file: {audio_file_path}")
                return False
            
            logger.info(f"Audio uploaded to public URL: {audio_url}")
            
            # Send via Twilio WhatsApp API
            from_number = self.twilio_phone_number
            to_number = to if to.startswith('whatsapp:') else f'whatsapp:{to}'
            
            url = f"https://api.twilio.com/2010-04-01/Accounts/{self.twilio_account_sid}/Messages.json"
            auth = (self.twilio_account_sid, self.twilio_auth_token)
            
            data = {
                'From': f'whatsapp:{from_number}',
                'To': to_number,
                'MediaUrl': audio_url
            }
            
            response = requests.post(url, auth=auth, data=data, timeout=30)
            
            if response.status_code == 200 or response.status_code == 201:
                logger.info(f"Audio message sent successfully to {to}")
                return True
            else:
                logger.error(f"Failed to send audio message: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp audio message: {e}")
            return False
    
    def send_interactive_message(self, to: str, message: str, buttons: List[Dict]) -> bool:
        """Send a text-only menu (Twilio WhatsApp does not support buttons)."""
        try:
            # Normalize formatting for WhatsApp menus
            message = self._normalize_whatsapp_formatting(message)

            # Check if this is a critical user-initiated response
            is_critical = self._is_critical_user_response(message)
            
            # Apply throttling to prevent message chains (but allow critical messages)
            if not is_critical:
                if not message_throttle.can_send_message(to):
                    delay = message_throttle.throttle_delay(to)
                    if delay > 0:
                        logger.info(f"Throttling interactive message to {to}, waiting {delay:.2f}s")
                        time.sleep(delay)
                        # Recheck after delay
                        if not message_throttle.can_send_message(to):
                            logger.warning(f"Interactive message to {to} blocked by throttle")
                            return False
            else:
                logger.info(f"Allowing critical interactive message to {to} - bypassing throttle")
            
            # Acquire lock to prevent concurrent sends (critical messages get priority)
            if not message_throttle.acquire_lock(to):
                if is_critical:
                    # Critical messages get retry attempts
                    logger.info(f"Critical message lock wait for {to}, retrying...")
                    
                    # Try 2 times with delays for interactive messages
                    for attempt in range(2):
                        wait_time = 1.0 + (attempt * 0.5)  # 1.0s, 1.5s
                        time.sleep(wait_time)
                        
                        if message_throttle.acquire_lock(to):
                            logger.info(f"Critical interactive lock acquired on attempt {attempt + 2} for {to}")
                            break
                    else:
                        # Force release for critical messages
                        logger.warning(f"Critical message forcing lock release for {to}")
                        message_throttle.force_release_lock(to)
                        
                        if not message_throttle.acquire_lock(to):
                            logger.error(f"Critical message to {to} blocked - could not acquire lock even after force release")
                            return False
                else:
                    logger.warning(f"Interactive message to {to} blocked - concurrent send")
                    return False
            
            try:
                # Validate and truncate message length for text-only menus
                if not message or len(message.strip()) == 0:
                    logger.error("Message body cannot be empty for interactive message")
                    return False

                if len(message) > 1200:
                    logger.warning(f"Message too long ({len(message)} chars), truncating to 1200 characters")
                    message = message[:1197] + "..."

                # Store menu options for text-based selection routing
                menu_router.store_menu(to, buttons, source="interactive")

                # Convert to a professional text menu with numbered options
                option_texts = []
                for i, button in enumerate(buttons, 1):
                    button_text = button.get('text') or button.get('title', f'Option {i}')
                    option_texts.append(button_text)

                full_message = self._format_options_message(
                    message,
                    option_texts,
                    "Reply with the option number or name."
                )
                
                # Send as regular text message via Twilio
                result = self.send_message(to, full_message)
                if result:
                    message_throttle.record_message_sent(to)
                return result
            finally:
                # Always release lock
                message_throttle.release_lock(to)
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp interactive message: {e}")
            return False

    def send_grouped_buttons(self, to: str, message: str, buttons: List[Dict]) -> bool:
        """CRITICAL FIX: Send buttons in groups with proper throttling to prevent spam detection"""
        try:
            # Normalize formatting for WhatsApp menus
            message = self._normalize_whatsapp_formatting(message)

            # Validate message length
            if not message or len(message.strip()) == 0:
                logger.error("Message body cannot be empty for grouped buttons")
                return False
            
            if len(message) > 1200:
                logger.warning(f"Message too long ({len(message)} chars), truncating to 1200 characters")
                message = message[:1197] + "..."

            # Store menu options for text-based selection routing
            menu_router.store_menu(to, buttons, source="grouped")
            
            # CRITICAL: Menu/navigation messages are critical - allow them to bypass throttle
            is_menu_message = any(keyword in message.lower() for keyword in [
                'topics menu', 'select a topic', 'choose an option', 'menu', 
                'topics', 'subjects', 'select', 'choose', 'navigation', 'more options'
            ])
            
            # Apply throttling before sending first group (but allow menu messages)
            if not is_menu_message:
                if not message_throttle.can_send_message(to):
                    logger.warning(f"Grouped buttons blocked by throttle for {to}")
                    return False
            else:
                logger.info(f"Allowing menu grouped buttons to {to} despite throttle")
            
            # Acquire lock (menu messages can retry and force release if needed)
            if not message_throttle.acquire_lock(to):
                if is_menu_message:
                    # Menu messages are critical - try multiple times with increasing delays
                    logger.info(f"Menu grouped buttons lock wait for {to}, retrying...")
                    
                    # Try 3 times with increasing delays
                    for attempt in range(3):
                        wait_time = 1.0 + (attempt * 0.5)  # 1.0s, 1.5s, 2.0s
                        time.sleep(wait_time)
                        
                        if message_throttle.acquire_lock(to):
                            logger.info(f"Menu lock acquired on attempt {attempt + 2} for {to}")
                            break
                    else:
                        # All retries failed - force release the lock for menu messages
                        logger.warning(f"Menu grouped buttons forcing lock release for {to}")
                        message_throttle.force_release_lock(to)
                        
                        # Try one final time
                        if not message_throttle.acquire_lock(to):
                            logger.error(f"Menu grouped buttons to {to} blocked - could not acquire lock even after force release")
                            return False
                else:
                    logger.warning(f"Grouped buttons blocked - concurrent send for {to}")
                    return False
            
            try:
                # First send message with first 3 buttons
                first_group = buttons[:3]
                if not self.send_single_button_group(to, message, first_group):
                    return False
                
                # Record the message
                message_throttle.record_message_sent(to)
                
                # Send remaining buttons in groups of 3 with PROPER DELAYS
                remaining_buttons = buttons[3:]
                while remaining_buttons:
                    current_group = remaining_buttons[:3]
                    remaining_buttons = remaining_buttons[3:]
                    
                    # CRITICAL: Wait minimum delay between grouped messages
                    time.sleep(message_throttle.min_delay_between_messages)
                    
                    # Check throttle before sending next group
                    if not message_throttle.can_send_message(to):
                        logger.warning(f"Stopping grouped buttons - rate limit reached for {to}")
                        break
                    
                    # Send continuation message with current group
                    continuation_message = "📋 *More Options:*"
                    if not self.send_single_button_group(to, continuation_message, current_group):
                        return False
                    
                    message_throttle.record_message_sent(to)
                
                logger.info(f"Grouped buttons sent successfully to {to}")
                return True
            finally:
                # Always release lock
                message_throttle.release_lock(to)
                
        except Exception as e:
            logger.error(f"Error sending grouped buttons: {e}")
            return False

    def send_single_button_group(self, to: str, message: str, buttons: List[Dict]) -> bool:
        """Send a single group of buttons as text options (Twilio doesn't support interactive buttons)"""
        try:
            # Normalize formatting for WhatsApp menus
            message = self._normalize_whatsapp_formatting(message)

            # Validate message length
            if not message or len(message.strip()) == 0:
                logger.error("Message body cannot be empty for button group")
                return False
            
            # Store menu options for text-based selection routing
            menu_router.store_menu(to, buttons, source="button_group")

            # Convert buttons to a professional text menu
            option_texts = []
            for i, button in enumerate(buttons, 1):
                button_text = button.get('text') or button.get('title', f'Option {i}')
                option_texts.append(button_text)

            full_message = self._format_options_message(
                message,
                option_texts,
                "Reply with the option number or name."
            )

            # Send as regular text message via Twilio
            return self.send_message(to, full_message)
                
        except Exception as e:
            logger.error(f"Error sending button group: {e}")
            return False

    def send_mcq_list_message(self, to: str, message: str, buttons: List[Dict]) -> bool:
        """Send MCQ question as text message with options (Twilio doesn't support list messages)"""
        try:
            # Normalize formatting for WhatsApp
            message = self._normalize_whatsapp_formatting(message)

            # Store menu options for text-based selection routing
            menu_router.store_menu(to, buttons, source="mcq")

            # Convert to text format with A, B, C, D options
            option_texts = []
            for i, button in enumerate(buttons):
                button_text = button.get('text') or button.get('title', f'Option {i+1}')
                option_texts.append(button_text)

            full_message = self._format_mcq_message(
                message,
                option_texts,
                "Reply with A, B, C, or D."
            )

            # Send as regular text message via Twilio
            return self.send_message(to, full_message)
                
        except Exception as e:
            logger.error(f"Error sending MCQ message: {e}")
            return False
    
    def send_list_message(self, to: str, header: str, body: str, sections: List[Dict]) -> bool:
        '''Send a list message as text with options (Twilio doesn't support list messages)'''
        try:
            # Normalize formatting for WhatsApp
            header = self._normalize_whatsapp_formatting(header)
            body = self._normalize_whatsapp_formatting(body)

            # Convert sections to text format with clear headings
            full_message = f"*{header}*\n\n{body}\n\n"

            option_num = 1
            menu_options = []
            for section in sections:
                section_title = section.get('title', 'Options')
                rows = section.get('rows', [])

                if rows:
                    full_message += f"*{section_title}:*\n"
                    for row in rows:
                        row_title = row.get('title', f'Option {option_num}')
                        row_desc = row.get('description', '')
                        display_text = f"{row_title} - {row_desc}" if row_desc else row_title

                        full_message += f"{option_num}. {display_text}\n"
                        menu_options.append({
                            'text': display_text,
                            'callback_data': row.get('id') or row.get('callback_data') or row_title
                        })
                        option_num += 1

            # Store menu options for text-based selection routing
            menu_router.store_menu(to, menu_options, source="list")

            full_message += "\nReply with the option number or name."

            # Send as regular text message via Twilio
            return self.send_message(to, full_message)

        except Exception as e:
            logger.error(f"Error sending list message: {e}")
            return False

    def send_list_message_from_buttons(self, to: str, message: str, buttons: List[Dict]) -> bool:
        '''Convert button list to text message with numbered options (Twilio doesn't support list messages)'''
        try:
            # Normalize formatting for WhatsApp
            message = self._normalize_whatsapp_formatting(message)

            # Store menu options for text-based selection routing
            menu_router.store_menu(to, buttons, source="button_list")

            # Convert buttons to a professional text menu
            option_texts = []
            for i, button in enumerate(buttons, 1):
                button_text = button.get('text') or button.get('title', f'Option {i}')
                option_texts.append(button_text)

            full_message = self._format_options_message(
                message,
                option_texts,
                "Reply with the option number or name."
            )

            # Send as regular text message via Twilio
            return self.send_message(to, full_message)

        except Exception as e:
            logger.error(f"Error sending list message from buttons: {e}")
            return False

    def send_image(self, to: str, image_url: str, caption: str = "") -> bool:
        """Send an image message via Twilio WhatsApp API"""
        try:
            # Validate image URL format
            if not image_url or not image_url.startswith(('http://', 'https://')):
                logger.error(f"Invalid image URL format: {image_url}")
                return False
            
            # Ensure caption is not too long (Twilio limit: 1600 chars)
            caption = self._normalize_whatsapp_formatting(caption)
            if len(caption) > 1600:
                caption = caption[:1590] + "..."
            
            # Send via Twilio WhatsApp API
            from_number = self.twilio_phone_number
            to_number = to if to.startswith('whatsapp:') else f'whatsapp:{to}'
            
            url = f"https://api.twilio.com/2010-04-01/Accounts/{self.twilio_account_sid}/Messages.json"
            auth = (self.twilio_account_sid, self.twilio_auth_token)
            
            data = {
                'From': f'whatsapp:{from_number}',
                'To': to_number,
                'MediaUrl': image_url
            }
            
            # Add body text if caption provided
            if caption.strip():
                data['Body'] = caption
            
            logger.info(f"Sending image to {to} with URL: {image_url}")
            response = requests.post(url, auth=auth, data=data, timeout=45)
            
            if response.status_code == 200 or response.status_code == 201:
                logger.info(f"Image sent successfully to {to}")
                return True
            else:
                logger.error(f"Failed to send image: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp image: {e}")
            return False

    def send_image_file(self, to: str, file_path: str, caption: str = "") -> bool:
        """Send an image from a local file path using ImgBB hosting"""
        try:
            import os
            import requests
            from services.image_hosting_service import ImageHostingService
            
            # Check if file exists
            if not os.path.exists(file_path):
                logger.error(f"Image file does not exist: {file_path}")
                return False
            
            # Use ImgBB to host the image
            hosting_service = ImageHostingService()
            public_url = hosting_service.upload_image_with_fallback(file_path)
            
            if not public_url:
                logger.error(f"Failed to get public URL for {file_path}")
                # Send text-only caption as fallback if image hosting fails
                if caption:
                    caption = self._normalize_whatsapp_formatting(caption)
                    fallback_msg = f"📊 Graph Generation Complete!\n\n{caption}\n\n❌ Image hosting temporarily unavailable. Please check back later or contact support."
                    return self.send_message(to, fallback_msg)
                return False
            
            logger.info(f"Got public URL for {file_path}: {public_url}")
            
            # Test if the URL is accessible with a GET request (not just HEAD)
            try:
                test_response = requests.get(public_url, timeout=15, stream=True)
                if test_response.status_code == 200:
                    logger.info(f"Public URL is accessible: {test_response.status_code}")
                    # Verify it's actually an image
                    content_type = test_response.headers.get('content-type', '')
                    if not content_type.startswith('image/'):
                        logger.warning(f"URL doesn't return image content-type: {content_type}")
                else:
                    logger.warning(f"Public URL not accessible: {test_response.status_code}")
                    return False
            except Exception as url_test_error:
                logger.error(f"Could not verify URL accessibility: {url_test_error}")
                return False
            
            # Wait a moment to ensure URL is fully propagated
            time.sleep(2)
            
            # Try sending the image with retry logic
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    result = self.send_image(to, public_url, caption)
                    if result:
                        logger.info(f"Successfully sent image file {file_path} to {to} on attempt {attempt + 1}")
                        return True
                    else:
                        logger.warning(f"Failed to send image on attempt {attempt + 1}")
                        if attempt < max_retries - 1:
                            time.sleep(3)  # Wait before retry
                except Exception as send_error:
                    logger.error(f"Error on send attempt {attempt + 1}: {send_error}")
                    if attempt < max_retries - 1:
                        time.sleep(3)
            
            logger.error(f"Failed to send image file {file_path} to {to} after {max_retries} attempts")
            return False
                
        except Exception as e:
            logger.error(f"Error sending image file {file_path}: {e}")
            return False
    
    def verify_webhook(self, mode: str, token: str, challenge: str) -> Optional[str]:
        """Verify webhook for Twilio WhatsApp (not needed - Twilio uses signature verification)"""
        # Twilio doesn't use this verification method
        logger.info("Twilio webhook verification handled by signature validation")
        return None
    
    def parse_webhook_message(self, data: Dict) -> Optional[Dict]:
        """Parse incoming Twilio webhook message (handled in webhook.py)"""
        # Twilio webhook parsing is handled in api/webhook.py
        logger.debug("Twilio webhook parsing handled in webhook.py")
        return None
    
    def send_document(self, to: str, file_path: str, caption: str = "", filename: str = None) -> bool:
        """Send a document (PDF, etc.) via Twilio WhatsApp API"""
        try:
            import os
            from services.image_hosting_service import ImageHostingService
            
            # Check if file exists
            if not os.path.exists(file_path):
                logger.error(f"Document file does not exist: {file_path}")
                return False
            
            logger.info(f"Uploading document: {file_path}")
            
            # Upload document to a hosting service to get a public URL (Twilio requires public URL)
            hosting_service = ImageHostingService()
            document_url = hosting_service.upload_document_with_fallback(file_path)
            
            if not document_url:
                logger.error(f"Failed to get public URL for document: {file_path}")
                # Fallback: send caption as text if document upload fails
                if caption:
                    caption = self._normalize_whatsapp_formatting(caption)
                    return self.send_message(to, f"📄 Document: {filename or os.path.basename(file_path)}\n\n{caption}")
                return False
            
            logger.info(f"Document uploaded to public URL: {document_url}")
            
            # Ensure caption is not too long
            caption = self._normalize_whatsapp_formatting(caption)
            if len(caption) > 1600:
                caption = caption[:1590] + "..."
            
            # Send via Twilio WhatsApp API
            from_number = self.twilio_phone_number
            to_number = to if to.startswith('whatsapp:') else f'whatsapp:{to}'
            
            url = f"https://api.twilio.com/2010-04-01/Accounts/{self.twilio_account_sid}/Messages.json"
            auth = (self.twilio_account_sid, self.twilio_auth_token)
            
            data = {
                'From': f'whatsapp:{from_number}',
                'To': to_number,
                'MediaUrl': document_url
            }
            
            # Add body text if caption provided
            if caption.strip():
                data['Body'] = caption
            
            response = requests.post(url, auth=auth, data=data, timeout=30)
            
            if response.status_code == 200 or response.status_code == 201:
                logger.info(f"Document sent successfully to {to}")
                return True
            else:
                logger.error(f"Failed to send document: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp document: {e}")
            return False
    
    def send_template_message(self, to: str, template_name: str, variables: Dict[str, Any] = None) -> bool:
        """Send a WhatsApp Business API approved template message"""
        try:
            if not self.template_service:
                logger.error("Template service not initialized")
                return False
            
            # Check if template is approved
            if not self.template_service.is_template_approved(template_name):
                logger.error(f"Template {template_name} is not approved")
                return False
            
            # Validate variables
            if not self.template_service.validate_template_variables(template_name, variables or {}):
                logger.error(f"Invalid variables for template {template_name}")
                return False
            
            # Send template message
            return self.template_service.send_template_message(to, template_name, variables)
            
        except Exception as e:
            logger.error(f"Error sending template message {template_name} to {to}: {e}")
            return False
    
    def send_quiz_question(self, to: str, subject: str, topic: str, question_num: int, 
                          total_questions: int, question_text: str, options: List[str], 
                          credit_cost: int) -> bool:
        """Send a quiz question using approved template with content variation"""
        try:
            # Generate varied question intro
            intro = content_variation_engine.generate_question_intro(to, subject)
            
            # Prepare template variables
            variables = {
                'subject': subject,
                'topic': topic,
                'question_num': question_num,
                'total_questions': total_questions,
                'question_text': f"{intro}\n\n{question_text}",
                'option_a': options[0] if len(options) > 0 else "Option A",
                'option_b': options[1] if len(options) > 1 else "Option B", 
                'option_c': options[2] if len(options) > 2 else "Option C",
                'option_d': options[3] if len(options) > 3 else "Option D",
                'credit_cost': credit_cost
            }
            
            return self.send_template_message(to, 'nerdx_quiz_mcq', variables)
            
        except Exception as e:
            logger.error(f"Error sending quiz question to {to}: {e}")
            return False
    
    def send_correct_answer_feedback(self, to: str, explanation: str, streak: int, 
                                   total_score: int, accuracy: float, subject: str = None) -> bool:
        """Send correct answer feedback with variation"""
        try:
            # Generate varied feedback
            encouragement = content_variation_engine.generate_correct_feedback(to, subject)
            
            # Vary explanation to prevent repetition
            varied_explanation = content_variation_engine.generate_explanation_variation(to, explanation, subject)
            
            variables = {
                'explanation': varied_explanation,
                'streak': streak,
                'total_score': total_score,
                'accuracy': f"{accuracy:.1f}",
                'encouragement': encouragement
            }
            
            return self.send_template_message(to, 'nerdx_answer_correct', variables)
            
        except Exception as e:
            logger.error(f"Error sending correct answer feedback to {to}: {e}")
            return False
    
    def send_incorrect_answer_feedback(self, to: str, correct_answer: str, explanation: str, 
                                     score: int, accuracy: float, subject: str = None) -> bool:
        """Send incorrect answer feedback with variation"""
        try:
            # Generate varied encouragement
            encouragement = content_variation_engine.generate_incorrect_encouragement(to, subject)
            
            # Vary explanation
            varied_explanation = content_variation_engine.generate_explanation_variation(to, explanation, subject)
            
            variables = {
                'correct_answer': correct_answer,
                'explanation': varied_explanation,
                'score': score,
                'accuracy': f"{accuracy:.1f}"
            }
            
            return self.send_template_message(to, 'nerdx_answer_incorrect', variables)
            
        except Exception as e:
            logger.error(f"Error sending incorrect answer feedback to {to}: {e}")
            return False
    
    def send_registration_confirmation(self, to: str, student_name: str, nerdx_id: str, 
                                     starting_credits: int, form_level: int) -> bool:
        """Send registration confirmation using template"""
        try:
            variables = {
                'student_name': student_name,
                'nerdx_id': nerdx_id,
                'starting_credits': starting_credits,
                'form_level': form_level
            }
            
            return self.send_template_message(to, 'nerdx_registration_complete', variables)
            
        except Exception as e:
            logger.error(f"Error sending registration confirmation to {to}: {e}")
            return False
    
    def send_achievement_notification(self, to: str, student_name: str, achievement_name: str, 
                                    subject: str, total_questions: int, accuracy: float, 
                                    study_streak: int, rank: str, bonus_credits: int) -> bool:
        """Send achievement notification with variation"""
        try:
            # Generate varied achievement message
            achievement_message = content_variation_engine.generate_achievement_message(to, subject, achievement_name)
            
            variables = {
                'achievement_name': achievement_message,
                'student_name': student_name,
                'total_questions': total_questions,
                'accuracy': f"{accuracy:.1f}",
                'study_streak': study_streak,
                'rank': rank,
                'bonus_credits': bonus_credits
            }
            
            return self.send_template_message(to, 'nerdx_achievement', variables)
            
        except Exception as e:
            logger.error(f"Error sending achievement notification to {to}: {e}")
            return False
    
    def send_session_complete(self, to: str, student_name: str, total_questions: int, 
                            correct_answers: int, accuracy: float, credits_used: int, 
                            duration: int, subject_topic: str, mastery_percentage: float, 
                            subject: str = None) -> bool:
        """Send session complete notification with variation"""
        try:
            # Generate varied session ending
            feedback = content_variation_engine.generate_session_ending(to, subject)
            
            variables = {
                'student_name': student_name,
                'total_questions': total_questions,
                'correct_answers': correct_answers,
                'accuracy': f"{accuracy:.1f}",
                'credits_used': credits_used,
                'duration': duration,
                'subject_topic': subject_topic,
                'mastery_percentage': f"{mastery_percentage:.1f}",
                'feedback': feedback
            }
            
            return self.send_template_message(to, 'nerdx_session_complete', variables)
            
        except Exception as e:
            logger.error(f"Error sending session complete to {to}: {e}")
            return False
    
    def send_support_info(self, to: str) -> bool:
        """Send support information using template"""
        try:
            return self.send_template_message(to, 'nerdx_support', {})
        except Exception as e:
            logger.error(f"Error sending support info to {to}: {e}")
            return False
    
    def send_privacy_policy(self, to: str) -> bool:
        """Send privacy policy using template"""
        try:
            return self.send_template_message(to, 'nerdx_privacy_policy', {})
        except Exception as e:
            logger.error(f"Error sending privacy policy to {to}: {e}")
            return False
    
    def send_unsubscribe_confirmation(self, to: str, student_name: str) -> bool:
        """Send unsubscribe confirmation using template"""
        try:
            variables = {'student_name': student_name}
            return self.send_template_message(to, 'nerdx_unsubscribe', variables)
        except Exception as e:
            logger.error(f"Error sending unsubscribe confirmation to {to}: {e}")
            return False
    
    def send_error_message(self, to: str, error_code: str) -> bool:
        """Send error message using template"""
        try:
            variables = {
                'error_code': error_code,
                'timestamp': time.strftime("%Y-%m-%d %H:%M:%S")
            }
            return self.send_template_message(to, 'nerdx_error_retry', variables)
        except Exception as e:
            logger.error(f"Error sending error message to {to}: {e}")
            return False
    
    def get_quality_report(self) -> Dict[str, Any]:
        """Get current quality monitoring report"""
        try:
            return self.quality_monitor.get_quality_report()
        except Exception as e:
            logger.error(f"Error getting quality report: {e}")
            return {}
    
    def _track_user_engagement(self, user_id: str, action: str):
        """Track user engagement for enterprise scale monitoring"""
        try:
            if user_id not in self.engagement_tracker:
                self.engagement_tracker[user_id] = {
                    'messages_sent': 0,
                    'last_interaction': time.time(),
                    'engagement_score': 0.5
                }
            
            self.engagement_tracker[user_id]['messages_sent'] += 1
            self.engagement_tracker[user_id]['last_interaction'] = time.time()
            
        except Exception as e:
            logger.error(f"Error tracking engagement for {user_id}: {e}")

    def send_document_quick(self, to: str, file_path: str, caption: str = None, filename: str = None) -> bool:
        """Send document with shorter timeout to avoid worker timeout (Twilio version)"""
        try:
            logger.info(f"Attempting quick document upload to {to}")
            
            # Use the regular send_document method (Twilio handles timeouts well)
            return self.send_document(to, file_path, caption or "", filename)
                
        except Exception as e:
            logger.error(f"Error in quick document send: {str(e)}")
            return False
