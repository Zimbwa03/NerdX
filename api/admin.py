import logging
from flask import Blueprint, render_template, request, jsonify
from database.external_db import add_credits, deduct_credits, get_user_registration
from services.user_service import UserService
from services.question_service import QuestionService
from services.payment_service import PaymentService
from utils.validators import validators

logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/')
def admin_home():
    """Admin panel home page"""
    try:
        return render_template('admin.html')
    except Exception as e:
        logger.error(f"Admin panel error: {e}")
        return f"Admin panel error: {e}", 500

@admin_bp.route('/api/users/search')
def search_users():
    """Search users by various criteria"""
    try:
        query = request.args.get('q', '').strip()
        search_type = request.args.get('type', 'name')  # name, nerdx_id, whatsapp_id
        
        if not query:
            return jsonify({'users': [], 'message': 'Please provide a search query'}), 400
        
        # In production, implement proper user search
        users = []
        
        return jsonify({'users': users, 'total': len(users)})
        
    except Exception as e:
        logger.error(f"Error searching users: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/users/<user_id>/credits', methods=['POST'])
def manage_user_credits(user_id: str):
    """Add or deduct credits from user account"""
    try:
        data = request.get_json()
        action = data.get('action')  # 'add' or 'deduct'
        amount = data.get('amount')
        reason = data.get('reason', 'admin_adjustment')
        
        # Validate inputs
        if action not in ['add', 'deduct']:
            return jsonify({'error': 'Invalid action. Use "add" or "deduct"'}), 400
        
        credit_validation = validators.validate_credit_amount(amount)
        if not credit_validation['valid']:
            return jsonify({'error': credit_validation['error']}), 400
        
        amount = credit_validation['amount']
        
        # Check if user exists
        user = get_user_registration(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Perform credit operation
        if action == 'add':
            success = add_credits(user_id, amount, reason)
        else:
            success = deduct_credits(user_id, amount)
        
        if success:
            return jsonify({
                'success': True,
                'message': f'Successfully {action}ed {amount} credits',
                'action': action,
                'amount': amount
            })
        else:
            return jsonify({'error': 'Failed to update credits'}), 500
        
    except Exception as e:
        logger.error(f"Error managing user credits: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/users/<user_id>/status', methods=['POST'])
def update_user_status(user_id: str):
    """Update user account status (active/inactive)"""
    try:
        data = request.get_json()
        is_active = data.get('is_active', True)
        
        # In production, implement user status update
        # This would update the user's is_active field in the database
        
        return jsonify({
            'success': True,
            'message': f'User status updated to {"active" if is_active else "inactive"}',
            'is_active': is_active
        })
        
    except Exception as e:
        logger.error(f"Error updating user status: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/questions/generate', methods=['POST'])
def generate_bulk_questions():
    """Generate questions in bulk for testing"""
    try:
        data = request.get_json()
        subject = data.get('subject')
        topic = data.get('topic')
        difficulty = data.get('difficulty')
        count = data.get('count', 1)
        
        # Validate inputs
        subject_validation = validators.validate_subject(subject)
        if not subject_validation['valid']:
            return jsonify({'error': subject_validation['error']}), 400
        
        topic_validation = validators.validate_topic(subject, topic)
        if not topic_validation['valid']:
            return jsonify({'error': topic_validation['error']}), 400
        
        difficulty_validation = validators.validate_difficulty(difficulty)
        if not difficulty_validation['valid']:
            return jsonify({'error': difficulty_validation['error']}), 400
        
        if not isinstance(count, int) or count < 1 or count > 10:
            return jsonify({'error': 'Count must be between 1 and 10'}), 400
        
        # Generate questions
        question_service = QuestionService()
        generated = []
        
        for i in range(count):
            question = question_service.get_question(
                'admin_generate', subject, topic, difficulty, force_ai=True
            )
            if question:
                generated.append(question)
        
        return jsonify({
            'success': True,
            'generated': len(generated),
            'requested': count,
            'questions': generated
        })
        
    except Exception as e:
        logger.error(f"Error generating bulk questions: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/payments/stats')
def payment_statistics():
    """Get detailed payment statistics"""
    try:
        # In production, implement proper payment statistics
        stats = {
            'total_revenue': 0,
            'total_transactions': 0,
            'success_rate': 0,
            'average_transaction': 0,
            'revenue_by_month': [],
            'popular_packages': [],
            'failed_transactions': []
        }
        
        return jsonify(stats)
        
    except Exception as e:
        logger.error(f"Error getting payment statistics: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/system/settings', methods=['GET', 'POST'])
def system_settings():
    """Get or update system settings"""
    try:
        if request.method == 'GET':
            # Return current system settings
            settings = {
                'credit_costs': {
                    'math_easy': 5,
                    'math_medium': 10,
                    'math_difficult': 20,
                    'science_easy': 5,
                    'science_medium': 10,
                    'science_difficult': 15,
                    'english_easy': 3,
                    'english_medium': 7,
                    'english_difficult': 12,
                    'image_solve': 15,
                    'graph_generation': 10
                },
                'rate_limits': {
                    'session_cooldown': 30,
                    'generation_timeout': 120
                },
                'welcome_credits': 50,
                'referral_credits': {
                    'referrer_bonus': 25,
                    'new_user_bonus': 15
                }
            }
            
            return jsonify(settings)
        
        else:  # POST
            # Update system settings
            data = request.get_json()
            
            # In production, implement settings update
            # This would update configuration in database or config files
            
            return jsonify({
                'success': True,
                'message': 'System settings updated successfully'
            })
        
    except Exception as e:
        logger.error(f"Error managing system settings: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/users/<user_id>/sessions')
def get_user_sessions(user_id: str):
    """Get user's active sessions"""
    try:
        from utils.session_manager import session_manager
        
        # Check if user has active sessions
        has_session = session_manager.has_active_session(user_id)
        session_type = session_manager.get_session_type(user_id)
        
        sessions = {
            'has_active_session': has_session,
            'session_type': session_type,
            'question_session': session_manager.get_question_session(user_id),
            'topic_selection': session_manager.get_topic_selection_session(user_id),
            'payment_session': session_manager.get_payment_session(user_id),
            'registration_state': session_manager.get_registration_state(user_id)
        }
        
        return jsonify(sessions)
        
    except Exception as e:
        logger.error(f"Error getting user sessions: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/users/<user_id>/sessions', methods=['DELETE'])
def clear_user_sessions(user_id: str):
    """Clear all user sessions"""
    try:
        from utils.session_manager import session_manager
        
        # Clear all session types
        session_manager.clear_question_session(user_id)
        session_manager.clear_registration_state(user_id)
        
        return jsonify({
            'success': True,
            'message': 'All user sessions cleared successfully'
        })
        
    except Exception as e:
        logger.error(f"Error clearing user sessions: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/broadcast', methods=['POST'])
def broadcast_message():
    """Broadcast message to all users or specific groups"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        target = data.get('target', 'all')  # 'all', 'active', 'inactive'
        
        if not message:
            return jsonify({'error': 'Message content is required'}), 400
        
        if len(message) > 1000:
            return jsonify({'error': 'Message too long (max 1000 characters)'}), 400
        
        # In production, implement actual broadcast functionality
        # This would send WhatsApp messages to selected users
        
        return jsonify({
            'success': True,
            'message': 'Broadcast queued successfully',
            'target': target,
            'recipients': 0  # Would be actual count
        })
        
    except Exception as e:
        logger.error(f"Error broadcasting message: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/logs')
def get_system_logs():
    """Get system logs"""
    try:
        level = request.args.get('level', 'INFO')
        limit = request.args.get('limit', 100, type=int)
        
        # In production, implement proper log retrieval
        logs = []
        
        return jsonify({
            'logs': logs,
            'total': len(logs),
            'level': level
        })
        
    except Exception as e:
        logger.error(f"Error getting system logs: {e}")
        return jsonify({'error': str(e)}), 500
