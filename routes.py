import logging
import os
from flask import request, jsonify, send_from_directory, abort
from app import app
from api.webhook import webhook_bp
from api.dashboard import dashboard_bp
from api.admin import admin_bp
from api.auth import auth_bp
from api.credit_management import credit_management_bp
from api.payment_admin import payment_admin_bp
# from api.admin_payment_dashboard import admin_payment_dashboard_bp  # Disabled per user request
from api.paynow_webhook import paynow_webhook_bp
from api.payment_sync import payment_sync_bp
from api.mobile import mobile_bp
from api.schools import schools_bp

logger = logging.getLogger(__name__)

# Register API blueprints
app.register_blueprint(webhook_bp, url_prefix='/webhook')
app.register_blueprint(dashboard_bp, url_prefix='/admin')
app.register_blueprint(schools_bp, url_prefix='/admin')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(auth_bp, url_prefix='/admin')
app.register_blueprint(credit_management_bp, url_prefix='')
# app.register_blueprint(payment_admin_bp, url_prefix='/api/admin/payments')  # Temporarily disabled due to conflict
# app.register_blueprint(admin_payment_dashboard_bp, url_prefix='')  # Disabled per user request
app.register_blueprint(paynow_webhook_bp, url_prefix='')
app.register_blueprint(payment_sync_bp, url_prefix='')
app.register_blueprint(mobile_bp, url_prefix='/api/mobile')

# Add route to serve graph images for WhatsApp access
@app.route('/static/graphs/<filename>')
def serve_graph_image(filename):
    """Serve graph images for WhatsApp access"""
    return send_from_directory('static/graphs', filename)

# Serve Manim animation videos (static/media/videos/manim_templates/...)
@app.route('/static/media/<path:filename>')
def serve_media(filename):
    """Serve Manim and other static media (videos, etc.) for student frontend"""
    return send_from_directory('static/media', filename)

# Add route to serve PDF files for essay reports
@app.route('/download/pdf/<filename>')
def serve_pdf_file(filename):
    """Serve PDF essay marking reports for download"""
    try:
        return send_from_directory('static/pdfs', filename, as_attachment=True, 
                                 download_name=f"ZIMSEC_Essay_Report_{filename}")
    except FileNotFoundError:
        return jsonify({'error': 'PDF file not found'}), 404

# User app (React SPA) - serve from NerdXWeb/dist when built
USER_APP_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'NerdXWeb', 'dist')


def _serve_user_app(path=''):
    """Serve the React user app - index.html for SPA routes, static files for assets."""
    if not os.path.isdir(USER_APP_DIR) or not os.path.exists(os.path.join(USER_APP_DIR, 'index.html')):
        from flask import redirect
        return redirect('/admin/login')
    # Serve static assets (js, css, images) if they exist
    if path:
        file_path = os.path.join(USER_APP_DIR, path)
        if os.path.isfile(file_path):
            return send_from_directory(USER_APP_DIR, path)
    return send_from_directory(USER_APP_DIR, 'index.html')


@app.route('/assets/<path:filename>')
def serve_user_app_assets(filename):
    """Serve React app static assets (JS, CSS, etc.)"""
    if not os.path.isdir(USER_APP_DIR):
        abort(404)
    return send_from_directory(os.path.join(USER_APP_DIR, 'assets'), filename)


@app.route('/logo.png')
def serve_user_app_logo():
    """Serve React app logo"""
    if not os.path.isdir(USER_APP_DIR):
        abort(404)
    return send_from_directory(USER_APP_DIR, 'logo.png')


@app.route('/images/<path:filename>')
def serve_user_app_images(filename):
    """Serve React app images (dashboard cards, etc.)"""
    if not os.path.isdir(USER_APP_DIR):
        abort(404)
    return send_from_directory(os.path.join(USER_APP_DIR, 'images'), filename)


@app.route('/')
def index():
    """Serve user-facing NerdX web app (React SPA)"""
    return _serve_user_app('')


@app.route('/register')
@app.route('/forgot-password')
@app.route('/reset-password')
@app.route('/verify-email')
@app.route('/app')
@app.route('/app/<path:subpath>')
@app.route('/auth/<path:subpath>')
def serve_user_app_routes(subpath=None):
    """Serve React SPA for client-side routes"""
    return _serve_user_app('')

# Health check endpoint is defined in app.py

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
    import os
    from logging.handlers import RotatingFileHandler
    
    # Create logs directory if it doesn't exist
    logs_dir = 'logs'
    
    try:
        # Try to create logs directory and use file logging
        if not os.path.exists(logs_dir):
            os.makedirs(logs_dir, exist_ok=True)
        
        file_handler = RotatingFileHandler('logs/nerdx.log', maxBytes=10240000, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        
    except (OSError, PermissionError) as e:
        # If file logging fails (common in deployment environments), use console logging
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        console_handler.setLevel(logging.INFO)
        app.logger.addHandler(console_handler)
        print(f"File logging failed, using console logging: {e}")
    
    app.logger.setLevel(logging.INFO)
    app.logger.info('NerdX Quiz Bot startup')
