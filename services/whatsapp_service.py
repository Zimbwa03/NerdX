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
        """Send an interactive message with buttons"""
        try:
            url = f"{self.base_url}/{self.phone_number_id}/messages"
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Content-Type': 'application/json'
            }
            
            interactive_buttons = []
            for i, button in enumerate(buttons[:3]):  # WhatsApp supports max 3 buttons
                interactive_buttons.append({
                    "type": "reply",
                    "reply": {
                        "id": button.get('id', f"btn_{i}"),
                        "title": button.get('title', '')[:20]  # Max 20 characters
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
