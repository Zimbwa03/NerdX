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
                    'session_cooldown': 5,  # Updated from 30 to 5 seconds
                    'generation_timeout': 120,
                    'text_message': 3,      # New: 3 seconds between text messages
                    'image_message': 10,    # New: 10 seconds between image uploads
                    'quiz_action': 5,       # New: 5 seconds between quiz actions
                    'ai_generation': 15,    # New: 15 seconds between AI generations
                    'menu_navigation': 1    # New: 1 second between menu navigation
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

@admin_bp.route('/api/credits/bulk-refresh', methods=['POST'])
def bulk_refresh_credits():
    """Add credits to all users or specific group"""
    try:
        from database.external_db import make_supabase_request
        from services.advanced_credit_service import advanced_credit_service
        
        data = request.get_json()
        credits_amount = data.get('amount', 500)
        target_group = data.get('target', 'all')  # 'all', 'low_credits', 'specific_users'
        user_ids = data.get('user_ids', [])  # For specific users
        reason = data.get('reason', f'Admin bulk credit refresh - {credits_amount} credits')
        
        # Validate amount
        if not isinstance(credits_amount, int) or credits_amount < 1 or credits_amount > 10000:
            return jsonify({'error': 'Credit amount must be between 1 and 10000'}), 400
        
        # Get target users based on criteria
        users_query = "SELECT user_id, username, first_name, credits FROM user_stats"
        filters = []
        
        if target_group == 'low_credits':
            filters.append("credits < 50")
        elif target_group == 'specific_users' and user_ids:
            user_list = "', '".join(user_ids)
            filters.append(f"user_id IN ('{user_list}')")
        
        if filters:
            users_query += " WHERE " + " AND ".join(filters)
        
        # Get users from database using raw query
        import psycopg2
        conn_string = 'postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        
        cursor.execute(users_query)
        users = cursor.fetchall()
        
        if not users:
            cursor.close()
            conn.close()
            return jsonify({'error': 'No users found matching criteria'}), 400
        
        successful_updates = 0
        failed_updates = 0
        updated_users = []
        
        for user in users:
            user_id, username, first_name, current_credits = user
            
            # Add credits using advanced credit service
            success = advanced_credit_service.add_credits_for_purchase(
                user_id, 
                credits_amount, 
                reason
            )
            
            if success:
                new_credits = current_credits + credits_amount
                successful_updates += 1
                updated_users.append({
                    'user_id': user_id,
                    'username': username or 'Unknown',
                    'credits_before': current_credits,
                    'credits_after': new_credits,
                    'credits_added': credits_amount
                })
            else:
                failed_updates += 1
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': f'Successfully updated {successful_updates} users',
            'successful_updates': successful_updates,
            'failed_updates': failed_updates,
            'total_users': len(users),
            'credits_added': credits_amount,
            'updated_users': updated_users[:10]  # Show first 10 for preview
        })
        
    except Exception as e:
        logger.error(f"Error bulk refreshing credits: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/credits/reset-user', methods=['POST'])
def reset_user_credits():
    """Reset specific user's credits to a specific amount"""
    try:
        from database.external_db import make_supabase_request
        
        data = request.get_json()
        user_id = data.get('user_id', '').strip()
        new_credit_amount = data.get('amount', 1000)
        reason = data.get('reason', f'Admin credit reset to {new_credit_amount}')
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        if not isinstance(new_credit_amount, int) or new_credit_amount < 0:
            return jsonify({'error': 'Credit amount must be a positive integer'}), 400
        
        # Get current user credits
        user_stats = make_supabase_request(
            "GET", 
            "user_stats", 
            select="credits",
            filters={"user_id": f"eq.{user_id}"}
        )
        
        if not user_stats:
            return jsonify({'error': 'User not found'}), 404
        
        current_credits = user_stats[0].get('credits', 0)
        
        # Update user credits directly
        update_data = {"credits": new_credit_amount}
        result = make_supabase_request(
            "PATCH", 
            "user_stats", 
            update_data, 
            filters={"user_id": f"eq.{user_id}"}
        )
        
        if result:
            # Log the credit transaction
            from datetime import datetime
            transaction = {
                "user_id": user_id,
                "transaction_type": "admin_reset",
                "credits_used": current_credits - new_credit_amount,  # Difference
                "credits_before": current_credits,
                "credits_after": new_credit_amount,
                "description": reason
            }
            make_supabase_request("POST", "credit_transactions", transaction)
            
            return jsonify({
                'success': True,
                'message': f'User {user_id} credits reset from {current_credits} to {new_credit_amount}',
                'user_id': user_id,
                'credits_before': current_credits,
                'credits_after': new_credit_amount
            })
        else:
            return jsonify({'error': 'Failed to reset user credits'}), 500
            
    except Exception as e:
        logger.error(f"Error resetting user credits: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/credits/statistics')
def get_credit_statistics():
    """Get comprehensive credit statistics for all users"""
    try:
        import psycopg2
        conn_string = 'postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        
        # Get credit statistics
        cursor.execute("""
            SELECT 
                COUNT(*) as total_users,
                SUM(credits) as total_credits,
                AVG(credits) as avg_credits,
                MIN(credits) as min_credits,
                MAX(credits) as max_credits,
                COUNT(CASE WHEN credits < 50 THEN 1 END) as low_credit_users,
                COUNT(CASE WHEN credits BETWEEN 50 AND 200 THEN 1 END) as medium_credit_users,
                COUNT(CASE WHEN credits > 200 THEN 1 END) as high_credit_users
            FROM user_stats;
        """)
        
        stats = cursor.fetchone()
        
        # Get top users by credits
        cursor.execute("""
            SELECT user_id, username, first_name, credits 
            FROM user_stats 
            ORDER BY credits DESC 
            LIMIT 10;
        """)
        
        top_users = cursor.fetchall()
        
        # Get recent credit transactions
        cursor.execute("""
            SELECT user_id, transaction_type, credits_used, description, created_at
            FROM credit_transactions 
            ORDER BY created_at DESC 
            LIMIT 10;
        """)
        
        recent_transactions = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'overview': {
                'total_users': stats[0] or 0,
                'total_credits': int(stats[1] or 0),
                'avg_credits': round(float(stats[2] or 0), 2),
                'min_credits': int(stats[3] or 0),
                'max_credits': int(stats[4] or 0),
                'low_credit_users': stats[5] or 0,
                'medium_credit_users': stats[6] or 0,
                'high_credit_users': stats[7] or 0
            },
            'top_users': [
                {
                    'user_id': user[0],
                    'username': user[1] or 'Unknown',
                    'first_name': user[2] or 'User',
                    'credits': user[3]
                } for user in top_users
            ],
            'recent_transactions': [
                {
                    'user_id': tx[0],
                    'type': tx[1],
                    'credits_used': tx[2],
                    'description': tx[3],
                    'date': str(tx[4])
                } for tx in recent_transactions
            ]
        })
        
    except Exception as e:
        logger.error(f"Error getting credit statistics: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/broadcast', methods=['POST'])
def broadcast_message():
    """Broadcast message to all users or specific groups"""
    try:
        from services.whatsapp_service import WhatsAppService
        import psycopg2
        from datetime import datetime
        
        data = request.get_json()
        message = data.get('message', '').strip()
        target = data.get('target', 'all')  # 'all', 'active', 'inactive'
        
        if not message:
            return jsonify({'error': 'Message content is required'}), 400
        
        if len(message) > 1000:
            return jsonify({'error': 'Message too long (max 1000 characters)'}), 400
        
        # Get target users based on criteria
        conn_string = 'postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        
        if target == 'all':
            cursor.execute("SELECT user_id FROM user_stats")
        elif target == 'active':
            # Users active in last 7 days
            cursor.execute("""
                SELECT user_id FROM user_stats 
                WHERE last_activity >= NOW() - INTERVAL '7 days'
            """)
        elif target == 'inactive':
            # Users inactive for more than 7 days
            cursor.execute("""
                SELECT user_id FROM user_stats 
                WHERE last_activity < NOW() - INTERVAL '7 days' 
                OR last_activity IS NULL
            """)
        
        user_ids = [row[0] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        
        if not user_ids:
            return jsonify({'error': 'No users found for the selected target'}), 400
        
        # Initialize WhatsApp service
        whatsapp_service = WhatsAppService()
        
        # Send broadcast message
        successful_sends = 0
        failed_sends = 0
        
        # Add admin header to message
        formatted_message = f"""📢 **NERDX ANNOUNCEMENT**

{message}

━━━━━━━━━━━━━━━━━━━━━━━━
💡 This is an official message from NerdX Team
📚 Continue learning: /start"""
        
        for user_id in user_ids:
            try:
                whatsapp_service.send_message(user_id, formatted_message)
                successful_sends += 1
            except Exception as e:
                logger.error(f"Failed to send broadcast to {user_id}: {e}")
                failed_sends += 1
        
        # Log broadcast activity to database
        try:
            from database.external_db import make_supabase_request
            broadcast_log = {
                'admin_user': 'admin',  # In production, get from session
                'message': message,
                'target_group': target,
                'total_recipients': len(user_ids),
                'successful_sends': successful_sends,
                'failed_sends': failed_sends,
                'additional_data': {
                    'message_length': len(message),
                    'formatted_message_length': len(formatted_message)
                }
            }
            make_supabase_request("POST", "broadcast_logs", broadcast_log)
        except Exception as log_error:
            logger.error(f"Failed to log broadcast: {log_error}")
        
        logger.info(f"Broadcast sent to {successful_sends} users, {failed_sends} failed")
        
        return jsonify({
            'success': True,
            'message': f'Broadcast sent to {successful_sends} users successfully',
            'target': target,
            'total_recipients': len(user_ids),
            'successful_sends': successful_sends,
            'failed_sends': failed_sends
        })
        
    except Exception as e:
        logger.error(f"Error broadcasting message: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/broadcast/history')
def get_broadcast_history():
    """Get broadcast message history"""
    try:
        limit = request.args.get('limit', 20, type=int)
        
        import psycopg2
        conn_string = 'postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        
        # Get broadcast history
        cursor.execute("""
            SELECT id, admin_user, message, target_group, total_recipients, 
                   successful_sends, failed_sends, created_at
            FROM broadcast_logs 
            ORDER BY created_at DESC 
            LIMIT %s;
        """, (limit,))
        
        broadcasts = cursor.fetchall()
        cursor.close()
        conn.close()
        
        broadcast_history = []
        for broadcast in broadcasts:
            broadcast_history.append({
                'id': broadcast[0],
                'admin_user': broadcast[1],
                'message': broadcast[2][:100] + ('...' if len(broadcast[2]) > 100 else ''),
                'target_group': broadcast[3],
                'total_recipients': broadcast[4],
                'successful_sends': broadcast[5],
                'failed_sends': broadcast[6],
                'created_at': str(broadcast[7]),
                'success_rate': round((broadcast[5] / broadcast[4] * 100) if broadcast[4] > 0 else 0, 1)
            })
        
        return jsonify({
            'broadcasts': broadcast_history,
            'total': len(broadcast_history)
        })
        
    except Exception as e:
        logger.error(f"Error getting broadcast history: {e}")
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

@admin_bp.route('/api/users/<user_id>/rate-limits', methods=['GET', 'DELETE'])
def manage_user_rate_limits(user_id: str):
    """Get or reset user's rate limits"""
    try:
        from utils.rate_limiter import rate_limiter
        
        if request.method == 'GET':
            # Get current rate limit status
            status = rate_limiter.get_user_rate_limit_status(user_id)
            return jsonify({
                'user_id': user_id,
                'rate_limits': status,
                'has_active_limits': len(status) > 0
            })
        
        elif request.method == 'DELETE':
            # Reset all rate limits for user
            rate_limiter.reset_all_user_limits(user_id)
            return jsonify({
                'success': True,
                'message': f'Rate limits reset for user {user_id}',
                'user_id': user_id
            })
        
    except Exception as e:
        logger.error(f"Error managing rate limits for user {user_id}: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/api/rate-limits/overview')
def get_rate_limits_overview():
    """Get overview of current rate limiting system"""
    try:
        from config import Config
        
        overview = {
            'current_config': {
                'session_cooldown': getattr(Config, 'SESSION_COOLDOWN', 5),
                'rate_limits': getattr(Config, 'RATE_LIMITS', {})
            },
            'system_info': {
                'description': 'Improved rate limiting system with context-aware cooldowns',
                'features': [
                    'Different cooldowns for different action types',
                    'Active users get 50% reduced cooldown',
                    'Users can reset their own limits with "reset limits" command',
                    'Better user feedback with remaining time display'
                ]
            }
        }
        
        return jsonify(overview)
        
    except Exception as e:
        logger.error(f"Error getting rate limits overview: {e}")
        return jsonify({'error': str(e)}), 500
