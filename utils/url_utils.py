import os
from urllib.parse import urljoin
import logging
from config import Config

logger = logging.getLogger(__name__)

def convert_local_path_to_public_url(local_path: str) -> str:
    """Convert a local file path to a public URL accessible by WhatsApp"""
    try:
        # Ensure the path is relative to the project root
        if local_path.startswith('./'):
            local_path = local_path[2:]
        elif local_path.startswith('/home/runner/workspace/'):
            # Convert absolute Replit path to relative
            local_path = local_path.replace('/home/runner/workspace/', '')
        elif local_path.startswith('/'):
            # Remove leading slash for relative path
            local_path = local_path[1:]

        # Get the base URL from config or use default Replit URL
        base_url = getattr(Config, 'BASE_URL', None)
        if not base_url:
            # Default Replit URL format
            repl_name = os.environ.get('REPL_SLUG', 'your-repl')
            repl_owner = os.environ.get('REPL_OWNER', 'your-username')
            if repl_name and repl_owner:
                base_url = f"https://{repl_name}.{repl_owner}.repl.co"
            else:
                # Fallback to current domain
                base_url = "https://0.0.0.0:5000"

        # Construct the full public URL
        public_url = f"{base_url}/{local_path}"

        logger.info(f"Converted local path '{local_path}' to public URL: {public_url}")
        return public_url

    except Exception as e:
        logger.error(f"Error converting local path to public URL: {e}")
        # Return a fallback URL
        return f"https://example.com/{local_path}"

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