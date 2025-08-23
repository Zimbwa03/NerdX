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