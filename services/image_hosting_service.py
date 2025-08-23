
import os
import logging
from typing import Optional
from config import Config

logger = logging.getLogger(__name__)

class ImageHostingService:
    """Service for hosting images on ImgBB to get public URLs"""
    
    def __init__(self):
        self.api_key = Config.IMGBB_API_KEY
        
        if not self.api_key:
            logger.warning("IMGBB_API_KEY not configured - image hosting will be limited")
    
    def upload_image(self, file_path: str) -> Optional[str]:
        """Upload image to ImgBB and return public URL"""
        try:
            if not self.api_key:
                logger.error("ImgBB API key not configured")
                return None
            
            if not os.path.exists(file_path):
                logger.error(f"Image file does not exist: {file_path}")
                return None
            
            from imgbbpy import SyncClient
            
            client = SyncClient(self.api_key)
            
            # Upload the image
            uploaded_image = client.upload(file=file_path)
            
            if uploaded_image and uploaded_image.url:
                logger.info(f"Successfully uploaded image to ImgBB: {uploaded_image.url}")
                return uploaded_image.url
            else:
                logger.error("Failed to upload image to ImgBB")
                return None
                
        except ImportError:
            logger.error("imgbbpy library not installed. Please install with: pip install imgbbpy")
            return None
        except Exception as e:
            logger.error(f"Error uploading image to ImgBB: {e}")
            return None
    
    def upload_image_with_fallback(self, file_path: str) -> Optional[str]:
        """Upload image with fallback to local URL conversion"""
        try:
            # First try ImgBB
            public_url = self.upload_image(file_path)
            
            if public_url and self.verify_image_url(public_url):
                return public_url
            
            # Fallback to local URL conversion
            logger.warning("ImgBB upload failed or verification failed, falling back to local URL conversion")
            from utils.url_utils import convert_local_path_to_public_url
            fallback_url = convert_local_path_to_public_url(file_path)
            
            if fallback_url and self.verify_image_url(fallback_url):
                return fallback_url
            
            logger.error("Both ImgBB and fallback URL failed verification")
            return None
            
        except Exception as e:
            logger.error(f"Error in upload_image_with_fallback: {e}")
            return None
    
    def verify_image_url(self, url: str) -> bool:
        """Verify that the URL returns a valid image"""
        try:
            import requests
            
            response = requests.get(url, timeout=10, stream=True)
            if response.status_code != 200:
                logger.error(f"Image URL returned status {response.status_code}")
                return False
            
            content_type = response.headers.get('content-type', '').lower()
            if not content_type.startswith('image/'):
                logger.error(f"URL doesn't return image content-type: {content_type}")
                return False
            
            # Check if we can read at least some image data
            content_length = response.headers.get('content-length')
            if content_length and int(content_length) < 100:
                logger.error(f"Image seems too small: {content_length} bytes")
                return False
            
            logger.info(f"Image URL verification successful: {url}")
            return True
            
        except Exception as e:
            logger.error(f"Error verifying image URL {url}: {e}")
            return False
    
    def is_configured(self) -> bool:
        """Check if ImgBB is properly configured"""
        return bool(self.api_key)
