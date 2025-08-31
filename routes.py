import logging
from flask import request, jsonify, send_from_directory
from app import app
from api.webhook import webhook_bp
from api.dashboard import dashboard_bp
from api.admin import admin_bp
from api.auth import auth_bp
from api.credit_management import credit_management_bp
from api.payment_admin import payment_admin_bp
from api.admin_payment_dashboard import admin_payment_dashboard_bp
from api.paynow_webhook import paynow_webhook_bp

logger = logging.getLogger(__name__)

# Register API blueprints
app.register_blueprint(webhook_bp, url_prefix='/webhook')
app.register_blueprint(dashboard_bp, url_prefix='')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(auth_bp, url_prefix='')
app.register_blueprint(credit_management_bp, url_prefix='')
# app.register_blueprint(payment_admin_bp, url_prefix='/api/admin/payments')  # Temporarily disabled due to conflict
app.register_blueprint(admin_payment_dashboard_bp, url_prefix='')
app.register_blueprint(paynow_webhook_bp, url_prefix='')

# Add route to serve graph images for WhatsApp access
@app.route('/static/graphs/<filename>')
def serve_graph_image(filename):
    """Serve graph images for WhatsApp access"""
    return send_from_directory('static/graphs', filename)

# Add route to serve PDF files for essay reports
@app.route('/download/pdf/<filename>')
def serve_pdf_file(filename):
    """Serve PDF essay marking reports for download"""
    try:
        return send_from_directory('static/pdfs', filename, as_attachment=True, 
                                 download_name=f"ZIMSEC_Essay_Report_{filename}")
    except FileNotFoundError:
        return jsonify({'error': 'PDF file not found'}), 404

@app.route('/')
def index():
    """Redirect to login or dashboard based on authentication"""
    from flask import redirect, url_for
    from services.admin_auth_service import admin_auth_service
    
    # Check if user is authenticated
    admin_user = admin_auth_service.verify_session()
    if admin_user:
        return redirect('/dashboard')
    else:
        return redirect('/login')

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
