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
    JSONIFY_PRETTYPRINT_REGULAR=False  # Faster JSON responses
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

with app.app_context():
    try:
        # Import models to ensure tables are created
        import models
        db.create_all()
        logging.info("Database tables created successfully")
    except Exception as e:
        logging.error(f"Database initialization error: {e}")
        # Continue startup even if database fails - will retry on first request
        pass
    
    # Initialize Supabase database tables
    try:
        from database.external_db import init_database
        supabase_init_result = init_database()
        if supabase_init_result:
            logging.info("✅ Supabase database initialized successfully")
        else:
            logging.error("❌ Supabase database initialization failed")
    except Exception as e:
        logging.error(f"Supabase initialization error: {e}")
        # Continue startup - Supabase errors will be handled in endpoints

# Configure CORS
CORS(app, origins=['*'])

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
    """Health check endpoint for Render monitoring"""
    try:
        # Basic health check
        health_status = {
            'status': 'healthy',
            'timestamp': __import__('datetime').datetime.now().isoformat(),
            'version': '2.0.0',
            'services': {
                'database': 'unknown',
                'whatsapp': 'unknown',
                'imgbb': 'unknown'
            }
        }
        
        # Check database connection
        try:
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            health_status['services']['database'] = 'healthy'
        except Exception as e:
            health_status['services']['database'] = f'unhealthy: {str(e)}'
        
        # Check WhatsApp configuration
        whatsapp_token = os.environ.get('WHATSAPP_ACCESS_TOKEN')
        if whatsapp_token:
            health_status['services']['whatsapp'] = 'configured'
        else:
            health_status['services']['whatsapp'] = 'not configured'
        
        # Check IMGBB configuration
        imgbb_key = os.environ.get('IMGBB_API_KEY')
        if imgbb_key:
            health_status['services']['imgbb'] = 'configured'
        else:
            health_status['services']['imgbb'] = 'not configured'
        
        # Check Supabase configuration
        supabase_url = os.environ.get('SUPABASE_URL')
        supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
        if supabase_url and supabase_key:
            health_status['services']['supabase'] = 'configured'
        else:
            health_status['services']['supabase'] = 'not configured'
        
        return jsonify(health_status), 200
        
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': __import__('datetime').datetime.now().isoformat()
        }), 500

# Routes will be imported by main.py to avoid circular imports