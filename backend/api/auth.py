"""
Admin Authentication Routes for NerdX Dashboard
Handles login, registration, and session management
"""
import logging
from flask import Blueprint, render_template, request, jsonify, redirect, url_for, session, flash
from services.admin_auth_service import admin_auth_service
from functools import wraps

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

def login_required(f):
    """Decorator to require admin login"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if user is logged in
        admin_user = admin_auth_service.verify_session()
        if not admin_user:
            # Return JSON 401 for API/AJAX/fetch requests instead of redirecting
            is_api_request = (
                request.is_json
                or request.headers.get('X-Requested-With') == 'XMLHttpRequest'
                or 'application/json' in request.headers.get('Accept', '')
                or '/api/' in request.path
            )
            if is_api_request:
                return jsonify({'error': 'Authentication required'}), 401
            return redirect(url_for('auth.login'))
        
        # Add user info to request context
        request.admin_user = admin_user
        return f(*args, **kwargs)
    return decorated_function

def super_admin_required(f):
    """Decorator to require super admin privileges"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if user is logged in
        admin_user = admin_auth_service.verify_session()
        if not admin_user:
            if request.is_json:
                return jsonify({'error': 'Authentication required'}), 401
            return redirect(url_for('auth.login'))
        
        # Check if user is super admin
        if admin_user.get('role') != 'super_admin':
            if request.is_json:
                return jsonify({'error': 'Super admin privileges required'}), 403
            flash('Access denied. Super admin privileges required.', 'error')
            return redirect(url_for('dashboard.dashboard_home'))
        
        # Add user info to request context
        request.admin_user = admin_user
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/login')
def login():
    """Admin login page"""
    # Check if already logged in
    admin_user = admin_auth_service.verify_session()
    if admin_user:
        return redirect(url_for('dashboard.dashboard_home'))
    
    return render_template('auth/login.html')

@auth_bp.route('/api/login', methods=['POST'])
def api_login():
    """Handle login API request"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Validate input
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400
        
        # Attempt login
        result = admin_auth_service.login(email, password)
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'redirect_url': url_for('dashboard.dashboard_home'),
                'user': result['user']
            })
        else:
            return jsonify(result), 401
            
    except Exception as e:
        logger.error(f"Login API error: {e}")
        return jsonify({'success': False, 'message': 'Login failed due to server error'}), 500

@auth_bp.route('/logout')
def logout():
    """Handle logout"""
    try:
        result = admin_auth_service.logout()
        flash('Logged out successfully', 'success')
    except Exception as e:
        logger.error(f"Logout error: {e}")
        flash('Logout failed', 'error')
    
    return redirect(url_for('auth.login'))

@auth_bp.route('/api/logout', methods=['POST'])
def api_logout():
    """Handle logout API request"""
    try:
        result = admin_auth_service.logout()
        return jsonify(result)
    except Exception as e:
        logger.error(f"Logout API error: {e}")
        return jsonify({'success': False, 'message': 'Logout failed'}), 500

@auth_bp.route('/register')
@super_admin_required
def register():
    """Admin registration page (super admin only)"""
    return render_template('auth/register.html', admin_user=request.admin_user)

@auth_bp.route('/api/register', methods=['POST'])
@super_admin_required
def api_register():
    """Handle admin registration API request (super admin only)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        # Get form data
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        phone_number = data.get('phone_number', '').strip()
        
        # Validate input
        errors = []
        
        if not email:
            errors.append('Email is required')
        elif '@' not in email or '.' not in email:
            errors.append('Please enter a valid email address')
        
        if not password:
            errors.append('Password is required')
        elif len(password) < 8:
            errors.append('Password must be at least 8 characters long')
        
        if password != confirm_password:
            errors.append('Passwords do not match')
        
        if not first_name:
            errors.append('First name is required')
        
        if not last_name:
            errors.append('Last name is required')
        
        if errors:
            return jsonify({'success': False, 'message': '; '.join(errors)}), 400
        
        # Register admin
        result = admin_auth_service.register_admin(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number if phone_number else None,
            created_by_id=request.admin_user['id']
        )
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': f'Admin {first_name} {last_name} registered successfully',
                'admin_id': result['admin_id']
            })
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Register API error: {e}")
        return jsonify({'success': False, 'message': 'Registration failed due to server error'}), 500

@auth_bp.route('/admin-users')
@super_admin_required
def admin_users():
    """Admin users management page (super admin only)"""
    return render_template('auth/admin_users.html', admin_user=request.admin_user)

@auth_bp.route('/api/admin-users')
@super_admin_required
def api_admin_users():
    """Get all admin users (super admin only)"""
    try:
        result = admin_auth_service.get_admin_users(request.admin_user['id'])
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Get admin users API error: {e}")
        return jsonify({'success': False, 'message': 'Failed to fetch admin users'}), 500

@auth_bp.route('/api/admin-users/<int:admin_id>/deactivate', methods=['POST'])
@super_admin_required
def api_deactivate_admin(admin_id):
    """Deactivate admin user (super admin only)"""
    try:
        result = admin_auth_service.deactivate_admin(admin_id, request.admin_user['id'])
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Deactivate admin API error: {e}")
        return jsonify({'success': False, 'message': 'Failed to deactivate admin'}), 500

@auth_bp.route('/api/verify-session')
def api_verify_session():
    """Verify current session"""
    try:
        admin_user = admin_auth_service.verify_session()
        
        if admin_user:
            return jsonify({
                'success': True,
                'authenticated': True,
                'user': admin_user
            })
        else:
            return jsonify({
                'success': True,
                'authenticated': False
            })
            
    except Exception as e:
        logger.error(f"Verify session API error: {e}")
        return jsonify({'success': False, 'message': 'Session verification failed'}), 500
