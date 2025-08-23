from flask import Flask, request, jsonify, send_from_directory
from api.webhook import webhook_bp
from api.admin import admin_bp
from api.dashboard import dashboard_bp
import logging
import os
from database.session_db import init_session_db
from database.external_db import test_supabase_connection

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Initialize database
init_session_db()

# Test Supabase connection
test_supabase_connection()

# Register blueprints
app.register_blueprint(webhook_bp, url_prefix='/')
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(dashboard_bp, url_prefix='/dashboard')

@app.route('/')
def home():
    return jsonify({
        'status': 'running',
        'message': 'NerdX Quiz Bot API is running',
        'version': '1.0.0'
    })

@app.route('/static/<path:filename>')
def serve_static_files(filename):
    """Serve static files including generated graphs"""
    try:
        return send_from_directory('static', filename)
    except Exception as e:
        logging.error(f"Error serving static file {filename}: {e}")
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    logging.info("NerdX Quiz Bot startup")
    app.run(host='0.0.0.0', port=5000, debug=True)