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
        """Send a text message to a WhatsApp user"""
        try:
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
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
            if response.status_code == 200:
                logger.info(f"Message sent successfully to {to}")
                return True
            else:
                logger.error(f"Failed to send message: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp message: {e}")
            return False
    
    def send_interactive_message(self, to: str, message: str, buttons: List[Dict]) -> bool:
        """Send buttons in groups of 3, with additional messages for remaining buttons"""
        try:
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
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
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
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
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
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
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
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
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
            url = f"{self.base_url}/{self.phone_number_id}/messages"
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'messaging_product': 'whatsapp',
                'to': to,
                'type': 'image',
                'image': {
                    'link': image_url,
                    'caption': caption
                }
            }
            
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
            if response.status_code == 200:
                logger.info(f"Image sent successfully to {to}")
                return True
            else:
                logger.error(f"Failed to send image: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending WhatsApp image: {e}")
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
