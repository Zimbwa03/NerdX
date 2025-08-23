import os
import logging
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

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
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///nerdx_quiz.db")
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

# Routes will be imported by main.py to avoid circular imports