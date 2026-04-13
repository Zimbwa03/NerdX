import os
import logging
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # python-dotenv not installed, continue without it
    pass

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
# Enable werkzeug request logging even when debug=False
logging.getLogger('werkzeug').setLevel(logging.INFO)
logger = logging.getLogger(__name__)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "nerdx-secret-key-fallback")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Performance optimizations for high concurrency
app.config.update(
    SEND_FILE_MAX_AGE_DEFAULT=300,  # Cache static files
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16MB max upload
    JSON_SORT_KEYS=False,  # Faster JSON serialization
    JSONIFY_PRETTYPRINT_REGULAR=False,  # Faster JSON responses
    TEMPLATES_AUTO_RELOAD=True  # Always reload templates from disk
)

# Configure the database with better connection handling
database_url = os.environ.get("DATABASE_URL", "sqlite:///nerdx_quiz.db")

# Remove pgbouncer parameter if present (incompatible with psycopg2)
if database_url and "postgresql" in database_url:
    # Handle various pgbouncer parameter formats
    if "pgbouncer=true" in database_url:
        database_url = database_url.replace("?pgbouncer=true", "").replace("&pgbouncer=true", "")
    if "pgbouncer=1" in database_url:
        database_url = database_url.replace("?pgbouncer=1", "").replace("&pgbouncer=1", "")
    if "pgbouncer" in database_url:
        # Remove any remaining pgbouncer parameters
        import re
        database_url = re.sub(r'[?&]pgbouncer=[^&]*', '', database_url)
        # Clean up double ? or & characters
        database_url = re.sub(r'\?+', '?', database_url)
        database_url = re.sub(r'&+', '&', database_url)
        database_url = database_url.rstrip('?&')
    
    logging.info(f"Database URL configured: {database_url[:50]}...")

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
    "pool_timeout": 20,
    "max_overflow": 0,
    "connect_args": {
        "connect_timeout": 10,
        "sslmode": "prefer"  # Handle SSL connections more gracefully
    } if os.environ.get("DATABASE_URL", "").startswith("postgresql") else {}
}

# Initialize the app with the extension
db.init_app(app)

# LAZY INITIALIZATION: Defer heavy initialization to allow fast port binding
# This prevents Render timeout during deployment
logging.info("⚡ Fast startup mode - initialization deferred")

# Configure CORS
CORS(app, origins=['*'])

# Log all incoming requests for debugging
@app.after_request
def log_request(response):
    logger.info(f"{request.method} {request.path} -> {response.status_code}")
    return response

# Route to serve static files (graphs, images, etc.)
@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    try:
        return send_from_directory('static', filename)
    except Exception as e:
        logger.error(f"Error serving static file {filename}: {e}")
        return jsonify({'error': 'File not found'}), 404

# Specific route for graph files
@app.route('/static/graphs/<filename>')
def serve_graph(filename):
    """Serve graph image files"""
    try:
        return send_from_directory('static/graphs', filename)
    except Exception as e:
        logger.error(f"Error serving graph file {filename}: {e}")
        return jsonify({'error': 'Graph file not found'}), 404

# Health check endpoint for Render monitoring
@app.route('/health')
def health_check():
    """Health check endpoint for Render monitoring - responds immediately"""
    try:
        # Basic health check - respond immediately without heavy checks
        health_status = {
            'status': 'healthy',
            'timestamp': __import__('datetime').datetime.now().isoformat(),
            'version': '2.0.0',
            'mode': 'fast_startup'
        }
        
        return jsonify(health_status), 200
        
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': __import__('datetime').datetime.now().isoformat()
        }), 500

# Routes will be imported by main.py to avoid circular imports