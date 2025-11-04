import os
import json
import logging
import requests
import time
from typing import Dict, List, Optional, Any
from services.message_throttle import message_throttle
from services.whatsapp_template_service import get_template_service
from services.content_variation_engine import content_variation_engine
from services.quality_monitor import quality_monitor

logger = logging.getLogger(__name__)

class WhatsAppService:
    """Service for handling WhatsApp Business API operations"""
    
    def __init__(self):
        self.access_token = os.getenv('WHATSAPP_ACCESS_TOKEN')
        self.phone_number_id = os.getenv('WHATSAPP_PHONE_NUMBER_ID')
        self.verify_token = os.getenv('WHATSAPP_VERIFY_TOKEN')
        self.base_url = "https://graph.facebook.com/v17.0"
        
        # Make WhatsApp configuration optional for development/migration
        self._is_configured = all([self.access_token, self.phone_number_id, self.verify_token])
        if not self._is_configured:
            logger.warning("WhatsApp configuration not complete - WhatsApp features will be disabled")
        
        # Enterprise scale protection
        self.daily_message_count = 0
        self.spam_protection_active = True
        self.max_daily_messages = 50000  # Conservative limit for scaling
        self.engagement_tracker = {}
        
        # Initialize template service
        self.template_service = get_template_service(self)
        
        # Quality monitoring
        self.quality_monitor = quality_monitor
    
    def send_message(self, to: str, message: str) -> bool:
        """Send a text message to a WhatsApp user with enhanced error handling and throttling"""
        if not self._is_configured:
            logger.warning("WhatsApp not configured - message not sent")
            return False
            
        try:
            # Check quality monitoring before sending (but allow critical messages)
            if self.quality_monitor.should_throttle_messaging():
                # Allow critical messages like consent requests and registration flows
                critical_keywords = ['consent', 'welcome', 'registration', 'first name', 'surname', 'date of birth', 'referral code', 'invalid date format', 'please use', 'enter a valid', 'thank you for your consent']
                is_critical = any(keyword in message.lower() for keyword in critical_keywords)
                
                if not is_critical:
                    logger.warning(f"Message to {to} blocked by quality monitor - throttling active")
                    return False
                else:
                    logger.info(f"Allowing critical message to {to} despite quality throttling")
            
            # CRITICAL: Check throttle to prevent message chains (but allow critical messages)
            if not message_throttle.can_send_message(to):
                # Allow critical messages like consent requests and registration flows
                critical_keywords = ['consent', 'welcome', 'registration', 'first name', 'surname', 'date of birth', 'referral code', 'thank you for your consent', 'invalid date format', 'please use', 'enter a valid']
                is_critical = any(keyword in message.lower() for keyword in critical_keywords)
                
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
                    logger.info(f"Allowing critical registration message to {to} despite throttle")
            
            # Acquire lock to prevent concurrent sends
            if not message_throttle.acquire_lock(to):
                logger.warning(f"Message to {to} blocked - concurrent send in progress")
                return False
            
            try:
                # Check message length and truncate if needed
                if len(message) > 4096:
                    logger.warning(f"Message too long ({len(message)} chars), truncating")
                    message = message[:4090] + "..."
                
                url = f"{self.base_url}/{self.phone_number_id}/messages"
                headers = {
                    'Authorization': f'Bearer {self.access_token}',
                    'Content-Type': 'application/json'
                }
                
                data = {
                    'messaging_product': 'whatsapp',
                    'to': to,
                    'type': 'text',
                    'text': {'body': message}
                }
                
                response = requests.post(url, headers=headers, json=data, timeout=15)  # Further reduced timeout
                
                if response.status_code == 200:
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
        """Send audio message via WhatsApp"""
        if not self._is_configured:
            logger.warning("WhatsApp not configured - audio message not sent")
            return False
            
        try:
            import requests
            import os
            
            # Validate file exists and has content
            if not os.path.exists(audio_file_path):
                logger.error(f"Audio file does not exist: {audio_file_path}")
                return False
                
            file_size = os.path.getsize(audio_file_path)
            if file_size == 0:
                logger.error(f"Audio file is empty: {audio_file_path}")
                return False
                
            logger.info(f"Uploading audio file: {audio_file_path} (size: {file_size} bytes)")
            
            # First upload the audio file
            upload_url = f"{self.base_url}/{self.phone_number_id}/media"
            
            headers = {
                'Authorization': f'Bearer {self.access_token}'
            }
            
            # Determine file format based on extension
            file_extension = audio_file_path.lower().split('.')[-1]
            
            if file_extension == 'wav':
                content_type = 'audio/wav'
                filename = 'audio.wav'
            elif file_extension == 'mp3':
                content_type = 'audio/mpeg'
                filename = 'audio.mp3'
            elif file_extension == 'ogg':
                content_type = 'audio/ogg'
                filename = 'audio.ogg'
            elif file_extension == 'm4a':
                content_type = 'audio/mp4'
                filename = 'audio.m4a'
            elif file_extension == 'aac':
                content_type = 'audio/aac'
                filename = 'audio.aac'
            else:
                # Default to M4A for unknown extensions (better WhatsApp compatibility)
                content_type = 'audio/mp4'
                filename = 'audio.m4a'
            
            logger.info(f"Uploading as {content_type} with filename {filename}")
            
            with open(audio_file_path, 'rb') as audio_file:
                files = {
                    'file': (filename, audio_file, content_type),
                    'type': (None, 'audio'),
                    'messaging_product': (None, 'whatsapp')
                }
                
                # Try upload with retry logic and shorter timeouts to prevent worker timeouts
                max_retries = 3
                upload_response = None
                for attempt in range(max_retries):
                    try:
                        # Use shorter timeout to prevent worker timeouts
                        timeout = 20 if attempt == 0 else 15  # Shorter on retries
                        logger.info(f"Upload attempt {attempt + 1}/{max_retries} with {timeout}s timeout")
                        upload_response = requests.post(upload_url, headers=headers, files=files, timeout=timeout)
                        break  # Success, exit retry loop
                    except requests.exceptions.Timeout as e:
                        logger.warning(f"Upload attempt {attempt + 1} timed out after {timeout}s: {e}")
                        if attempt == max_retries - 1:  # Last attempt
                            logger.error(f"All {max_retries} upload attempts failed due to timeout")
                            return False
                        # Wait briefly before retry
                        time.sleep(1)
                    except requests.exceptions.RequestException as e:
                        logger.error(f"Upload attempt {attempt + 1} failed with request error: {e}")
                        if attempt == max_retries - 1:  # Last attempt
                            return False
                        time.sleep(1)
                
                if upload_response is None:
                    logger.error("Upload failed - no response received")
                    return False
                
                logger.info(f"Upload response status: {upload_response.status_code}")
                
                if upload_response.status_code != 200:
                    logger.error(f"Failed to upload audio: {upload_response.status_code} - {upload_response.text}")
                    return False
                
                upload_data = upload_response.json()
                media_id = upload_data.get('id')
                
                logger.info(f"Upload response: {upload_data}")
                
                if not media_id:
                    logger.error("No media ID returned from upload")
                    return False
                    
                logger.info(f"Audio uploaded successfully with media ID: {media_id}")
            
            # Now send the audio message
            send_url = f"{self.base_url}/{self.phone_number_id}/messages"
            
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'messaging_product': 'whatsapp',
                'to': to,
                'type': 'audio',
                'audio': {
                    'id': media_id
                }
            }
            
            logger.info(f"Sending audio message with data: {data}")
            
            # Send message with retry logic for better reliability
            max_retries = 2
            response = None
            for attempt in range(max_retries):
                try:
                    response = requests.post(send_url, headers=headers, json=data, timeout=15)
                    break  # Success, exit retry loop
                except requests.exceptions.Timeout as e:
                    logger.warning(f"Send attempt {attempt + 1} timed out: {e}")
                    if attempt == max_retries - 1:  # Last attempt
                        logger.error(f"All {max_retries} send attempts failed due to timeout")
                        return False
                    time.sleep(0.5)
                except requests.exceptions.RequestException as e:
                    logger.error(f"Send attempt {attempt + 1} failed: {e}")
                    if attempt == max_retries - 1:  # Last attempt
                        return False
                    time.sleep(0.5)
            
            if response is None:
                logger.error("Send failed - no response received")
                return False
            
            logger.info(f"Send response status: {response.status_code}")
            logger.info(f"Send response: {response.text}")
            
            if response.status_code == 200:
                response_data = response.json()
                message_id = response_data.get('messages', [{}])[0].get('id', 'unknown')
                logger.info(f"Audio message sent successfully to {to}. Message ID: {message_id}")
                logger.info(f"Full response: {response_data}")
                return True
            else:
                logger.error(f"Failed to send audio message: {response.status_code} - {response.text}")
                logger.error(f"Request data was: {data}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp audio message: {e}")
            return False
    
    def send_interactive_message(self, to: str, message: str, buttons: List[Dict]) -> bool:
        """Send buttons as interactive message - use List Message for 4+ options for WhatsApp compliance"""
        try:
            # CRITICAL: Menu/navigation messages are critical - allow them to bypass throttle
            is_menu_message = any(keyword in message.lower() for keyword in [
                'topics menu', 'select a topic', 'choose an option', 'menu', 
                'topics', 'subjects', 'select', 'choose', 'navigation'
            ])
            
            # Apply throttling to prevent message chains (but allow menu messages)
            if not is_menu_message:
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
                logger.info(f"Allowing menu message to {to} - bypassing throttle")
            
            # Acquire lock to prevent concurrent sends (menu messages can still acquire lock)
            if not message_throttle.acquire_lock(to):
                if is_menu_message:
                    # Menu messages are critical - wait briefly and retry
                    logger.info(f"Menu message lock wait for {to}, retrying...")
                    time.sleep(0.5)
                    if not message_throttle.acquire_lock(to):
                        logger.warning(f"Menu message to {to} blocked - lock still held")
                        return False
                else:
                    logger.warning(f"Interactive message to {to} blocked - concurrent send")
                    return False
            
            try:
                # Validate and truncate message length (WhatsApp limit: 1-1024 characters)
                if not message or len(message.strip()) == 0:
                    logger.error("Message body cannot be empty for interactive message")
                    return False
                
                if len(message) > 1024:
                    logger.warning(f"Message too long ({len(message)} chars), truncating to 1024 characters")
                    message = message[:1021] + "..."
                
                # CRITICAL FIX: Use List Messages for 4+ buttons - WhatsApp Best Practice
                if len(buttons) >= 4:
                    logger.info(f"Using List Message for {len(buttons)} buttons - WhatsApp compliant")
                    result = self.send_list_message_from_buttons(to, message, buttons)
                    # Record message sent if successful
                    if result:
                        message_throttle.record_message_sent(to)
                    return result
                
                # Otherwise use regular interactive buttons (max 3)
                url = f"{self.base_url}/{self.phone_number_id}/messages"
                headers = {
                    'Authorization': f'Bearer {self.access_token}',
                    'Content-Type': 'application/json'
                }
                
                interactive_buttons = []
                for i, button in enumerate(buttons[:3]):  # WhatsApp supports max 3 buttons
                    # Support both formats: {"text": "...", "callback_data": "..."} and {"id": "...", "title": "..."}
                    button_id = button.get('callback_data') or button.get('id', f"btn_{i}")
                    button_title = button.get('text') or button.get('title', '')
                    
                    interactive_buttons.append({
                        "type": "reply",
                        "reply": {
                            "id": button_id,
                            "title": button_title[:20]  # Max 20 characters
                        }
                    })
                
                data = {
                    'messaging_product': 'whatsapp',
                    'to': to,
                    'type': 'interactive',
                    'interactive': {
                        'type': 'button',
                        'body': {'text': message},
                        'action': {'buttons': interactive_buttons}
                    }
                }
                
                response = requests.post(url, headers=headers, json=data, timeout=15)
                
                if response.status_code == 200:
                    logger.info(f"Interactive message sent successfully to {to}")
                    # Record successful send
                    message_throttle.record_message_sent(to)
                    return True
                else:
                    logger.error(f"Failed to send interactive message: {response.status_code} - {response.text}")
                    return False
            finally:
                # Always release lock
                message_throttle.release_lock(to)
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp interactive message: {e}")
            return False

    def send_grouped_buttons(self, to: str, message: str, buttons: List[Dict]) -> bool:
        """CRITICAL FIX: Send buttons in groups with proper throttling to prevent spam detection"""
        try:
            # Validate message length
            if not message or len(message.strip()) == 0:
                logger.error("Message body cannot be empty for grouped buttons")
                return False
            
            if len(message) > 1024:
                logger.warning(f"Message too long ({len(message)} chars), truncating to 1024 characters")
                message = message[:1021] + "..."
            
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
            
            # Acquire lock (menu messages can retry)
            if not message_throttle.acquire_lock(to):
                if is_menu_message:
                    # Menu messages are critical - wait briefly and retry
                    logger.info(f"Menu grouped buttons lock wait for {to}, retrying...")
                    time.sleep(0.5)
                    if not message_throttle.acquire_lock(to):
                        logger.warning(f"Menu grouped buttons to {to} blocked - lock still held")
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
        """Send a single group of up to 3 buttons"""
        try:
            # Validate message length
            if not message or len(message.strip()) == 0:
                logger.error("Message body cannot be empty for button group")
                return False
            
            if len(message) > 1024:
                logger.warning(f"Message too long ({len(message)} chars), truncating to 1024 characters")
                message = message[:1021] + "..."
            
            url = f"{self.base_url}/{self.phone_number_id}/messages"
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            interactive_buttons = []
            for button in buttons[:3]:  # Max 3 buttons per message
                button_id = button.get('callback_data') or button.get('id', '')
                button_title = button.get('text') or button.get('title', '')
                
                interactive_buttons.append({
                    "type": "reply",
                    "reply": {
                        "id": button_id,
                        "title": button_title[:20]  # Max 20 characters
                    }
                })
            
            data = {
                'messaging_product': 'whatsapp',
                'to': to,
                'type': 'interactive',
                'interactive': {
                    'type': 'button',
                    'body': {'text': message},
                    'action': {'buttons': interactive_buttons}
                }
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=15)
            
            if response.status_code == 200:
                return True
            else:
                logger.error(f"Failed to send button group: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending button group: {e}")
            return False

    def send_mcq_list_message(self, to: str, message: str, buttons: List[Dict]) -> bool:
        """Send MCQ question as list message to support 4 options (A, B, C, D)"""
        try:
            url = f"{self.base_url}/{self.phone_number_id}/messages"
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            # Create list rows for each option
            rows = []
            for button in buttons:
                button_id = button.get('callback_data') or button.get('id', '')
                button_title = button.get('text') or button.get('title', '')
                
                rows.append({
                    "id": button_id,
                    "title": button_title[:24],  # Max 24 characters for list items
                    "description": ""
                })
            
            data = {
                'messaging_product': 'whatsapp',
                'to': to,
                'type': 'interactive',
                'interactive': {
                    'type': 'list',
                    'body': {'text': message},
                    'action': {
                        'button': 'Choose Answer',
                        'sections': [{
                            'title': 'Answer Options',
                            'rows': rows
                        }]
                    }
                }
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=15)
            
            if response.status_code == 200:
                logger.info(f"MCQ list message sent successfully to {to}")
                return True
            else:
                logger.error(f"Failed to send MCQ list message: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending MCQ list message: {e}")
            return False
    
    def send_list_message(self, to: str, header: str, body: str, sections: List[Dict]) -> bool:
        """Send a list message with multiple options"""
        try:
            url = f"{self.base_url}/{self.phone_number_id}/messages"
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'messaging_product': 'whatsapp',
                'to': to,
                'type': 'interactive',
                'interactive': {
                    'type': 'list',
                    'header': {'type': 'text', 'text': header},
                    'body': {'text': body},
                    'action': {
                        'button': 'Select Option',
                        'sections': sections
                    }
                }
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=15)
            
            if response.status_code == 200:
                logger.info(f"List message sent successfully to {to}")
                return True
            else:
                logger.error(f"Failed to send list message: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp list message: {e}")
            return False
    
    def send_list_message_from_buttons(self, to: str, message: str, buttons: List[Dict]) -> bool:
        """Convert button list to WhatsApp List Message - CRITICAL: Max 10 rows per WhatsApp limit"""
        try:
            # CRITICAL FIX: WhatsApp allows max 10 rows per list message
            # If we have >10 buttons, use grouped buttons instead
            if len(buttons) > 10:
                logger.info(f"Too many buttons ({len(buttons)}) for list message (max 10), using grouped buttons")
                return self.send_grouped_buttons(to, message, buttons)
            
            url = f"{self.base_url}/{self.phone_number_id}/messages"
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            # Convert buttons to list rows (max 10)
            rows = []
            seen_ids = set()  # Track IDs to ensure uniqueness
            for i, button in enumerate(buttons[:10]):  # WhatsApp max 10 rows per list
                button_id = button.get('callback_data') or button.get('id', f'option_{i}')
                button_title = button.get('text') or button.get('title', f'Option {i+1}')
                
                # Ensure unique ID by appending index if duplicate detected
                base_id = button_id
                unique_id = base_id
                counter = 0
                while unique_id in seen_ids:
                    counter += 1
                    unique_id = f"{base_id}_{counter}"
                
                seen_ids.add(unique_id)
                
                # Clean button title for list display
                clean_title = button_title.replace('🔙 ', '↩️ ').replace('🏠 ', '🏠 ')
                
                rows.append({
                    "id": unique_id,  # Use unique ID
                    "title": clean_title[:24],  # Max 24 characters for list items
                    "description": f"Select {clean_title[:20]}" if len(clean_title) > 12 else ""
                })
            
            data = {
                'messaging_product': 'whatsapp',
                'to': to,
                'type': 'interactive',
                'interactive': {
                    'type': 'list',
                    'body': {'text': message},
                    'action': {
                        'button': 'Select Option',
                        'sections': [{
                            'title': 'Choose an Option',
                            'rows': rows
                        }]
                    }
                }
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=15)
            
            if response.status_code == 200:
                logger.info(f"List message sent successfully to {to} with {len(rows)} options")
                return True
            else:
                logger.error(f"Failed to send list message: {response.status_code} - {response.text}")
                # Fallback to grouped buttons if list message fails
                logger.warning(f"Falling back to grouped buttons for {to}")
                return self.send_grouped_buttons(to, message, buttons)
                
        except Exception as e:
            logger.error(f"Error sending list message from buttons: {e}")
            # Fallback to grouped buttons
            return self.send_grouped_buttons(to, message, buttons)
    
    def send_image(self, to: str, image_url: str, caption: str = "") -> bool:
        """Send an image message"""
        try:
            # Validate image URL format
            if not image_url or not image_url.startswith(('http://', 'https://')):
                logger.error(f"Invalid image URL format: {image_url}")
                return False
            
            url = f"{self.base_url}/{self.phone_number_id}/messages"
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            # Ensure caption is not too long (WhatsApp limit)
            if len(caption) > 1024:
                caption = caption[:1021] + "..."
            
            data = {
                'messaging_product': 'whatsapp',
                'to': to,
                'type': 'image',
                'image': {
                    'link': image_url
                }
            }
            
            # Only add caption if it's not empty
            if caption.strip():
                data['image']['caption'] = caption
            
            logger.info(f"Sending image to {to} with URL: {image_url}")
            response = requests.post(url, headers=headers, json=data, timeout=45)
            
            if response.status_code == 200:
                response_data = response.json()
                logger.info(f"Image sent successfully to {to}. Message ID: {response_data.get('messages', [{}])[0].get('id', 'unknown')}")
                return True
            else:
                logger.error(f"Failed to send image: {response.status_code} - {response.text}")
                # Log the exact request data for debugging
                logger.error(f"Request data was: {data}")
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
        """Verify webhook for WhatsApp"""
        if mode == "subscribe" and token == self.verify_token:
            logger.info("Webhook verified successfully")
            return challenge
        else:
            logger.warning("Webhook verification failed")
            return None
    
    def parse_webhook_message(self, data: Dict) -> Optional[Dict]:
        """Parse incoming webhook message"""
        try:
            if 'entry' not in data:
                return None
            
            for entry in data['entry']:
                if 'changes' not in entry:
                    continue
                    
                for change in entry['changes']:
                    if change.get('field') != 'messages':
                        continue
                    
                    value = change.get('value', {})
                    messages = value.get('messages', [])
                    
                    for message in messages:
                        return {
                            'from': message.get('from'),
                            'id': message.get('id'),
                            'timestamp': message.get('timestamp'),
                            'type': message.get('type'),
                            'text': message.get('text', {}).get('body', ''),
                            'interactive': message.get('interactive', {}),
                            'image': message.get('image', {}),
                            'document': message.get('document', {})
                        }
            
            return None
            
        except Exception as e:
            logger.error(f"Error parsing webhook message: {e}")
            return None
    
    def send_document(self, to: str, file_path: str, caption: str = "", filename: str = None) -> bool:
        """Send a document (PDF, etc.) via WhatsApp"""
        try:
            import os
            import requests
            
            # Check if file exists
            if not os.path.exists(file_path):
                logger.error(f"Document file does not exist: {file_path}")
                return False
            
            # Determine file type and MIME type
            file_extension = os.path.splitext(file_path)[1].lower()
            mime_types = {
                '.pdf': 'application/pdf',
                '.doc': 'application/msword',
                '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                '.txt': 'text/plain'
            }
            
            mime_type = mime_types.get(file_extension, 'application/octet-stream')
            display_filename = filename or os.path.basename(file_path)
            
            # First upload the document
            upload_url = f"{self.base_url}/{self.phone_number_id}/media"
            
            headers = {
                'Authorization': f'Bearer {self.access_token}'
            }
            
            # Add retry logic for file uploads
            max_retries = 3
            retry_count = 0
            media_id = None
            
            while retry_count < max_retries and media_id is None:
                try:
                    with open(file_path, 'rb') as doc_file:
                        files = {
                            'file': (display_filename, doc_file, mime_type),
                            'type': (None, 'document'),
                            'messaging_product': (None, 'whatsapp')
                        }
                        
                        logger.info(f"Uploading document (attempt {retry_count + 1}/{max_retries})...")
                        upload_response = requests.post(upload_url, headers=headers, files=files, timeout=30)
                        
                        if upload_response.status_code == 200:
                            media_id = upload_response.json().get('id')
                            if media_id:
                                logger.info(f"Document uploaded successfully: {media_id}")
                                break
                            else:
                                logger.error("No media ID returned from document upload")
                        else:
                            logger.error(f"Upload failed (attempt {retry_count + 1}): {upload_response.status_code} - {upload_response.text}")
                            
                except requests.exceptions.Timeout:
                    logger.error(f"Upload timeout (attempt {retry_count + 1})")
                except Exception as e:
                    logger.error(f"Upload error (attempt {retry_count + 1}): {str(e)}")
                
                retry_count += 1
                if retry_count < max_retries:
                    logger.info(f"Retrying upload in 2 seconds...")
                    time.sleep(2)
            
            if not media_id:
                logger.error("Failed to upload document after all retries")
                return False
            
            # Now send the document message
            send_url = f"{self.base_url}/{self.phone_number_id}/messages"
            
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            document_data = {
                'id': media_id,
                'filename': display_filename
            }
            
            if caption:
                document_data['caption'] = caption[:1024]  # WhatsApp caption limit
            
            data = {
                'messaging_product': 'whatsapp',
                'to': to,
                'type': 'document',
                'document': document_data
            }
            
            response = requests.post(send_url, headers=headers, json=data, timeout=30)
            
            if response.status_code == 200:
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
        """Send document with shorter timeout to avoid worker timeout"""
        try:
            logger.info(f"Attempting quick document upload to {to}")
            
            if not os.path.exists(file_path):
                logger.error(f"Document file does not exist: {file_path}")
                return False
            
            # Determine file type and MIME type
            file_extension = os.path.splitext(file_path)[1].lower()
            mime_types = {
                '.pdf': 'application/pdf',
                '.doc': 'application/msword',
                '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                '.txt': 'text/plain'
            }
            
            mime_type = mime_types.get(file_extension, 'application/octet-stream')
            display_filename = filename or os.path.basename(file_path)
            
            # Upload with shorter timeout
            upload_url = f"{self.base_url}/{self.phone_number_id}/media"
            
            headers = {
                'Authorization': f'Bearer {self.access_token}'
            }
            
            with open(file_path, 'rb') as doc_file:
                files = {
                    'file': (display_filename, doc_file, mime_type),
                    'type': (None, 'document'),
                    'messaging_product': (None, 'whatsapp')
                }
                
                # Use shorter timeout to avoid worker timeout
                upload_response = requests.post(upload_url, headers=headers, files=files, timeout=25)
                
                if upload_response.status_code != 200:
                    logger.error(f"Quick upload failed: {upload_response.status_code}")
                    return False
                
                media_id = upload_response.json().get('id')
                
                if not media_id:
                    logger.error("No media ID returned from quick upload")
                    return False
            
            # Send the document message
            send_url = f"{self.base_url}/{self.phone_number_id}/messages"
            
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            document_data = {
                'id': media_id,
                'filename': display_filename
            }
            
            if caption:
                document_data['caption'] = caption[:1024]
            
            data = {
                'messaging_product': 'whatsapp',
                'to': to,
                'type': 'document',
                'document': document_data
            }
            
            response = requests.post(send_url, headers=headers, json=data, timeout=15)
            
            if response.status_code == 200:
                logger.info(f"Quick document sent successfully to {to}")
                return True
            else:
                logger.error(f"Failed to send quick document: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error in quick document send: {str(e)}")
            return False
