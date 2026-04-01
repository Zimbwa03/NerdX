import os
from urllib.parse import urljoin
import logging
from config import Config

logger = logging.getLogger(__name__)

# Canonical production web origin (share links, referrals, school portal URLs).
DEFAULT_PUBLIC_ORIGIN = "https://nerdx.co.zw"


def get_public_web_origin() -> str:
    """User-facing web app origin (register, school/teacher links, referrals).
    Prefer WEB_URL / APP_URL; otherwise default to the production domain."""
    for key in ("WEB_URL", "APP_URL"):
        v = (os.environ.get(key) or "").strip().rstrip("/")
        if v:
            return v
    return DEFAULT_PUBLIC_ORIGIN


def get_api_public_base_url() -> str:
    """Base URL where this Flask app serves API + static files (graphs, media)."""
    base_url = getattr(Config, "BASE_URL", None) or os.environ.get("BASE_URL")
    if base_url:
        return str(base_url).strip().rstrip("/")
    for key in ("RENDER_EXTERNAL_URL", "APP_URL", "WEB_URL"):
        v = (os.environ.get(key) or "").strip().rstrip("/")
        if v:
            return v
    return DEFAULT_PUBLIC_ORIGIN


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

        base_url = get_api_public_base_url()

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
        base_url = getattr(Config, 'BASE_URL', None) or get_api_public_base_url()

        if subfolder:
            url = f"{base_url}/static/{subfolder}/{filename}"
        else:
            url = f"{base_url}/static/{filename}"

        return url

    except Exception as e:
        logger.error(f"Error getting static file URL: {e}")
        return filename