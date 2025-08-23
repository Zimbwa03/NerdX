import logging
from flask import request, jsonify, send_from_directory
from app import app
from api.webhook import webhook_bp
from api.dashboard import dashboard_bp
from api.admin import admin_bp

logger = logging.getLogger(__name__)

# Register API blueprints
app.register_blueprint(webhook_bp, url_prefix='/webhook')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

# Add route to serve graph images for WhatsApp access
@app.route('/static/graphs/<filename>')
def serve_graph_image(filename):
    """Serve graph images for WhatsApp access"""
    return send_from_directory('static/graphs', filename)

@app.route('/')
def index():
    """Main landing page"""
    return """
    <h1>NerdX ZIMSEC Quiz Bot</h1>
    <p>WhatsApp Education Bot for ZIMSEC Students</p>
    <ul>
        <li><a href="/api/dashboard">Dashboard</a></li>
        <li><a href="/api/admin">Admin Panel</a></li>
    </ul>
    """

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'nerdx-quiz-bot',
        'version': '1.0.0'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({'error': 'Internal server error'}), 500

# Configure logging for production
if not app.debug:
    import logging
    from logging.handlers import RotatingFileHandler
    
    file_handler = RotatingFileHandler('logs/nerdx.log', maxBytes=10240000, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    
    app.logger.setLevel(logging.INFO)
    app.logger.info('NerdX Quiz Bot startup')
