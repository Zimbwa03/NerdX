import os
import json
import logging
import requests
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class WhatsAppService:
    """Service for handling WhatsApp Business API operations"""
    
    def __init__(self):
        self.access_token = os.getenv('WHATSAPP_ACCESS_TOKEN')
        self.phone_number_id = os.getenv('WHATSAPP_PHONE_NUMBER_ID')
        self.verify_token = os.getenv('WHATSAPP_VERIFY_TOKEN')
        self.base_url = "https://graph.facebook.com/v17.0"
        
        if not all([self.access_token, self.phone_number_id, self.verify_token]):
            raise ValueError("Missing required WhatsApp configuration")
    
    def send_message(self, to: str, message: str) -> bool:
        """Send a text message to a WhatsApp user with enhanced error handling"""
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
                return True
            else:
                logger.error(f"Failed to send message: {response.status_code} - {response.text}")
                return False
                
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
            else:
                # Default to OGG for unknown extensions (WhatsApp compatible)
                content_type = 'audio/ogg'
                filename = 'audio.ogg'
            
            logger.info(f"Uploading as {content_type} with filename {filename}")
            
            with open(audio_file_path, 'rb') as audio_file:
                files = {
                    'file': (filename, audio_file, content_type),
                    'type': (None, 'audio'),
                    'messaging_product': (None, 'whatsapp')
                }
                
                upload_response = requests.post(upload_url, headers=headers, files=files, timeout=45)
                
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
            
            response = requests.post(send_url, headers=headers, json=data, timeout=30)
            
            logger.info(f"Send response status: {response.status_code}")
            logger.info(f"Send response: {response.text}")
            
            if response.status_code == 200:
                logger.info(f"Audio message sent successfully to {to}")
                return True
            else:
                logger.error(f"Failed to send audio message: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp audio message: {e}")
            return False
    
    def send_interactive_message(self, to: str, message: str, buttons: List[Dict]) -> bool:
        """Send buttons in groups of 3, with additional messages for remaining buttons"""
        try:
            # Validate and truncate message length (WhatsApp limit: 1-1024 characters)
            if not message or len(message.strip()) == 0:
                logger.error("Message body cannot be empty for interactive message")
                return False
            
            if len(message) > 1024:
                logger.warning(f"Message too long ({len(message)} chars), truncating to 1024 characters")
                message = message[:1021] + "..."
            
            # If 4 or more buttons, send them in groups of 3
            if len(buttons) >= 4:
                return self.send_grouped_buttons(to, message, buttons)
            
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
                return True
            else:
                logger.error(f"Failed to send interactive message: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp interactive message: {e}")
            return False

    def send_grouped_buttons(self, to: str, message: str, buttons: List[Dict]) -> bool:
        """Send buttons in groups of 3 like existing menu format"""
        try:
            # Validate message length
            if not message or len(message.strip()) == 0:
                logger.error("Message body cannot be empty for grouped buttons")
                return False
            
            if len(message) > 1024:
                logger.warning(f"Message too long ({len(message)} chars), truncating to 1024 characters")
                message = message[:1021] + "..."
            
            # First send message with first 3 buttons
            first_group = buttons[:3]
            if not self.send_single_button_group(to, message, first_group):
                return False
            
            # Send remaining buttons in groups of 3
            remaining_buttons = buttons[3:]
            while remaining_buttons:
                current_group = remaining_buttons[:3]
                remaining_buttons = remaining_buttons[3:]
                
                # Send continuation message with current group
                continuation_message = "📋 *More Options:*"
                if not self.send_single_button_group(to, continuation_message, current_group):
                    return False
            
            logger.info(f"Grouped buttons sent successfully to {to}")
            return True
                
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
            import time
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
                    import time
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
