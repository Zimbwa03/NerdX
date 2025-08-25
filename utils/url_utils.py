import os
from urllib.parse import urljoin
import logging
from config import Config

logger = logging.getLogger(__name__)

def convert_local_path_to_public_url(local_path: str) -> str:
    """Convert a local file path to a public URL accessible by WhatsApp for Render deployment"""
    try:
        # Ensure the path is relative to the project root
        if local_path.startswith('./'):
            local_path = local_path[2:]
        elif local_path.startswith('/app/'):
            # Convert absolute Render path to relative
            local_path = local_path.replace('/app/', '')
        elif local_path.startswith('/'):
            # Remove leading slash for relative path
            local_path = local_path[1:]

        # Get the base URL from config or environment for Render
        base_url = getattr(Config, 'BASE_URL', None)
        if not base_url:
            # Try to get the Render URL from environment variables
            render_url = os.environ.get('RENDER_EXTERNAL_URL')
            if render_url:
                base_url = render_url.rstrip('/')
            else:
                # Try alternative environment variables
                app_url = os.environ.get('APP_URL') or os.environ.get('WEB_URL')
                if app_url:
                    base_url = app_url.rstrip('/')
                else:
                    # Fallback: assume standard naming convention
                    app_name = os.environ.get('RENDER_SERVICE_NAME', 'nerdx')
                    base_url = f"https://{app_name}.onrender.com"

        # Construct the full public URL
        public_url = f"{base_url}/{local_path}"

        logger.info(f"Converted local path '{local_path}' to public URL: {public_url}")
        return public_url

    except Exception as e:
        logger.error(f"Error converting local path to public URL: {e}")
        # Return None to force ImgBB upload instead of invalid fallback
        return None

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