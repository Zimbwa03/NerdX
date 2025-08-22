import os
import json
import logging
import requests
import base64
from typing import Dict, Optional
from config import Config

logger = logging.getLogger(__name__)

class ImageService:
    """Service for handling image processing and math problem solving"""
    
    def __init__(self):
        self.deepseek_api_key = Config.DEEPSEEK_API_KEY
        
        if not self.deepseek_api_key:
            raise ValueError("DEEPSEEK_API_KEY is required for image processing")
    
    def solve_math_image(self, image_url: str) -> Optional[Dict]:
        """Solve mathematical problems from images using DeepSeek Vision API"""
        try:
            # Download image and convert to base64
            image_data = self._download_image(image_url)
            if not image_data:
                return None
            
            base64_image = base64.b64encode(image_data).decode('utf-8')
            
            prompt = """
You are an expert mathematics tutor. Analyze this image containing a mathematical problem and provide a complete solution.

Please:
1. Identify and transcribe the mathematical problem from the image
2. Solve the problem step by step with clear explanations
3. Provide the final answer
4. If the image is unclear or doesn't contain a math problem, explain what you see

Format your response as JSON:
{
    "problem_identified": "The mathematical problem as seen in the image",
    "solution_steps": "Step 1: ...\nStep 2: ...\nStep 3: ...",
    "final_answer": "The final numerical or algebraic answer",
    "confidence": "high/medium/low based on image clarity",
    "notes": "Any additional observations or clarifications"
}
"""

            headers = {
                'Authorization': f'Bearer {self.deepseek_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'deepseek-chat',
                'messages': [
                    {
                        'role': 'user',
                        'content': [
                            {
                                'type': 'text',
                                'text': prompt
                            },
                            {
                                'type': 'image_url',
                                'image_url': {
                                    'url': f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                'max_tokens': 2000,
                'temperature': 0.1
            }
            
            response = requests.post(
                'https://api.deepseek.com/chat/completions',
                headers=headers,
                json=data,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                # Extract JSON from response
                try:
                    json_start = content.find('{')
                    json_end = content.rfind('}') + 1
                    json_str = content[json_start:json_end]
                    
                    solution_data = json.loads(json_str)
                    
                    # Validate required fields
                    if all(key in solution_data for key in ['problem_identified', 'solution_steps', 'final_answer']):
                        logger.info("Successfully solved math image problem")
                        return solution_data
                    else:
                        logger.warning("Incomplete solution data from AI")
                        return None
                        
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse AI response JSON: {e}")
                    # Return raw content as fallback
                    return {
                        'problem_identified': 'Problem analysis available',
                        'solution_steps': content,
                        'final_answer': 'See solution steps',
                        'confidence': 'medium',
                        'notes': 'Raw AI response due to parsing error'
                    }
            else:
                logger.error(f"DeepSeek Vision API error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Error solving math image: {e}")
            return None
    
    def _download_image(self, image_url: str) -> Optional[bytes]:
        """Download image from URL"""
        try:
            response = requests.get(image_url, timeout=30)
            
            if response.status_code == 200:
                # Validate it's an image
                content_type = response.headers.get('content-type', '')
                if content_type.startswith('image/'):
                    return response.content
                else:
                    logger.error(f"Invalid content type: {content_type}")
                    return None
            else:
                logger.error(f"Failed to download image: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error downloading image: {e}")
            return None
    
    def validate_image_format(self, image_url: str) -> bool:
        """Validate that the URL points to a supported image format"""
        try:
            # Check URL extension
            supported_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
            url_lower = image_url.lower()
            
            for ext in supported_extensions:
                if url_lower.endswith(ext):
                    return True
            
            # Check content type by making a HEAD request
            response = requests.head(image_url, timeout=10)
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                return content_type.startswith('image/')
            
            return False
            
        except Exception as e:
            logger.error(f"Error validating image format: {e}")
            return False
    
    def get_image_metadata(self, image_url: str) -> Optional[Dict]:
        """Get metadata about an image"""
        try:
            response = requests.head(image_url, timeout=10)
            
            if response.status_code == 200:
                return {
                    'content_type': response.headers.get('content-type'),
                    'content_length': response.headers.get('content-length'),
                    'last_modified': response.headers.get('last-modified'),
                    'url': image_url
                }
            else:
                return None
                
        except Exception as e:
            logger.error(f"Error getting image metadata: {e}")
            return None
    
    def process_whatsapp_image(self, whatsapp_image_data: Dict) -> Optional[Dict]:
        """Process image received via WhatsApp"""
        try:
            # Extract image URL from WhatsApp data
            image_url = whatsapp_image_data.get('url')
            image_id = whatsapp_image_data.get('id')
            
            if not image_url and image_id:
                # Need to get image URL from WhatsApp API using image ID
                from services.whatsapp_service import WhatsAppService
                whatsapp = WhatsAppService()
                image_url = self._get_whatsapp_image_url(image_id, whatsapp)
            
            if not image_url:
                return {
                    'success': False,
                    'message': 'Could not retrieve image URL'
                }
            
            # Validate image
            if not self.validate_image_format(image_url):
                return {
                    'success': False,
                    'message': 'Unsupported image format. Please send JPG, PNG, or other common image formats.'
                }
            
            # Solve the math problem
            solution = self.solve_math_image(image_url)
            
            if solution:
                return {
                    'success': True,
                    'solution': solution,
                    'message': 'Image processed successfully'
                }
            else:
                return {
                    'success': False,
                    'message': 'Could not solve the math problem in the image. Please ensure the image is clear and contains a mathematical problem.'
                }
                
        except Exception as e:
            logger.error(f"Error processing WhatsApp image: {e}")
            return {
                'success': False,
                'message': 'Error processing image. Please try again.'
            }
    
    def _get_whatsapp_image_url(self, image_id: str, whatsapp_service) -> Optional[str]:
        """Get image URL from WhatsApp API using image ID"""
        try:
            url = f"https://graph.facebook.com/v17.0/{image_id}"
            headers = {
                'Authorization': f'Bearer {whatsapp_service.access_token}'
            }
            
            response = requests.get(url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                return data.get('url')
            else:
                logger.error(f"Failed to get WhatsApp image URL: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting WhatsApp image URL: {e}")
            return None
