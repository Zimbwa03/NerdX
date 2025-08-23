import os
from urllib.parse import urljoin

def convert_local_path_to_public_url(local_file_path: str) -> str:
    """Convert a local file path to a publicly accessible URL for WhatsApp"""
    try:
        # Get the base URL for this Replit
        base_url = os.environ.get('REPL_SLUG', 'localhost')
        if not base_url.startswith('http'):
            base_url = f'https://{base_url}.replit.dev'
        
        # Extract filename from path
        if '/' in local_file_path:
            # Handle paths like "static/graphs/filename.png"
            path_parts = local_file_path.split('/')
            if 'static' in path_parts and 'graphs' in path_parts:
                filename = os.path.basename(local_file_path)
                public_url = urljoin(base_url, f'/static/graphs/{filename}')
                return public_url
        
        # Fallback: assume it's just a filename in static/graphs
        filename = os.path.basename(local_file_path)
        public_url = urljoin(base_url, f'/static/graphs/{filename}')
        return public_url
        
    except Exception as e:
        # If URL conversion fails, return original path as fallback
        return local_file_path
import os
import logging
from config import Config

logger = logging.getLogger(__name__)

def convert_local_path_to_public_url(local_path: str) -> str:
    """Convert a local file path to a public URL that can be accessed via WhatsApp"""
    try:
        # Get the base URL from config or use default
        base_url = getattr(Config, 'BASE_URL', 'https://your-app-name.replit.app')
        
        # Remove leading 'static/' if present since we'll serve from /static/
        if local_path.startswith('static/'):
            relative_path = local_path[7:]  # Remove 'static/'
        else:
            relative_path = local_path
            
        # Construct the public URL
        public_url = f"{base_url}/static/{relative_path}"
        
        logger.info(f"Converted local path '{local_path}' to public URL '{public_url}'")
        return public_url
        
    except Exception as e:
        logger.error(f"Error converting local path to public URL: {e}")
        return local_path

def get_static_file_url(filename: str, subfolder: str = '') -> str:
    """Get a public URL for a static file"""
    try:
        base_url = getattr(Config, 'BASE_URL', 'https://your-app-name.replit.app')
        
        if subfolder:
            url = f"{base_url}/static/{subfolder}/{filename}"
        else:
            url = f"{base_url}/static/{filename}"
            
        return url
        
    except Exception as e:
        logger.error(f"Error getting static file URL: {e}")
        return filename
