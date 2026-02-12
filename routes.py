import logging
import os
from pathlib import Path
from flask import request, jsonify, send_from_directory, abort, Response
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

# User app (React SPA) - serve from NerdXWeb/dist when built.
# `routes.py` lives at the repo root in this project, so `Path(__file__).parent` is the app root.
USER_APP_DIR = str((Path(__file__).resolve().parent / 'NerdXWeb' / 'dist'))

# Log student app availability at startup (helps debug deployment)
_index_path = os.path.join(USER_APP_DIR, 'index.html')
if os.path.isfile(_index_path):
    logger.info(f"NerdXWeb (student app) ready at {USER_APP_DIR}")
else:
    logger.warning(f"NerdXWeb (student app) NOT FOUND at {USER_APP_DIR} - root (/) will redirect to admin. Students should use /app path.")


def _serve_user_app(path=''):
    """Serve the React user app - index.html for SPA routes, static files for assets."""
    if not os.path.isdir(USER_APP_DIR) or not os.path.exists(os.path.join(USER_APP_DIR, 'index.html')):
        logger.warning(f"Student app not available at {USER_APP_DIR} - serving student fallback landing")
        return Response(
            """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NerdX Student Web</title>
  <style>
    :root { color-scheme: light; }
    body {
      margin: 0;
      font-family: "Segoe UI", Arial, sans-serif;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: #f8fafc;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
    }
    .card {
      width: 100%;
      max-width: 640px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 14px;
      padding: 24px;
      backdrop-filter: blur(4px);
    }
    h1 { margin: 0 0 12px; font-size: 1.7rem; }
    p { margin: 0 0 14px; line-height: 1.5; color: #e2e8f0; }
    .actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px; }
    a {
      text-decoration: none;
      background: #22c55e;
      color: #06240f;
      font-weight: 700;
      padding: 10px 14px;
      border-radius: 10px;
      display: inline-block;
    }
    a.secondary { background: #e2e8f0; color: #0f172a; }
  </style>
</head>
<body>
  <main class="card">
    <h1>NerdX Student Web</h1>
    <p>This domain is configured for the Student web app landing page.</p>
    <p>The full frontend bundle is still initializing on this deployment. You can continue with student access below.</p>
    <div class="actions">
      <a href="/">Refresh Landing</a>
      <a class="secondary" href="/login">Student Login</a>
      <a class="secondary" href="/register">Create Student Account</a>
    </div>
  </main>
</body>
</html>
            """,
            status=200,
            mimetype='text/html'
        )
    if path:
        file_path = os.path.join(USER_APP_DIR, path)
        if os.path.isfile(file_path):
            return send_from_directory(USER_APP_DIR, path)
    resp = send_from_directory(USER_APP_DIR, 'index.html')
    resp.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp


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


@app.route('/login')
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
