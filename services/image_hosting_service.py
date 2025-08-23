
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
            
            if public_url:
                return public_url
            
            # Fallback to local URL conversion
            logger.warning("ImgBB upload failed, falling back to local URL conversion")
            from utils.url_utils import convert_local_path_to_public_url
            return convert_local_path_to_public_url(file_path)
            
        except Exception as e:
            logger.error(f"Error in upload_image_with_fallback: {e}")
            return None
    
    def is_configured(self) -> bool:
        """Check if ImgBB is properly configured"""
        return bool(self.api_key)
