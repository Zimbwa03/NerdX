import os
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
            # Get system settings from database
            import psycopg2
            import json
            
            conn_string = os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DATABASE_URL')
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            
            # Get all settings from database
            cursor.execute("SELECT setting_key, setting_value, setting_type FROM system_settings")
            db_settings = cursor.fetchall()
            
            # Default settings
            default_settings = {
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
                    'session_cooldown': 5,
                    'generation_timeout': 120,
                    'text_message': 3,
                    'image_message': 10,
                    'quiz_action': 5,
                    'ai_generation': 15,
                    'menu_navigation': 1
                },
                'welcome_credits': 50,
                'referral_credits': {
                    'referrer_bonus': 25,
                    'new_user_bonus': 15
                }
            }
            
            # Apply database settings over defaults
            for setting_key, setting_value, setting_type in db_settings:
                if setting_type == 'json':
                    try:
                        value = json.loads(setting_value)
                    except:
                        value = setting_value
                elif setting_type == 'number':
                    try:
                        value = float(setting_value)
                        if value.is_integer():
                            value = int(value)
                    except:
                        value = setting_value
                elif setting_type == 'boolean':
                    value = setting_value.lower() in ('true', '1', 'yes')
                else:
                    value = setting_value
                
                # Set nested settings
                if '.' in setting_key:
                    keys = setting_key.split('.')
                    current = default_settings
                    for key in keys[:-1]:
                        if key not in current:
                            current[key] = {}
                        current = current[key]
                    current[keys[-1]] = value
                else:
                    default_settings[setting_key] = value
            
            cursor.close()
            conn.close()
            
            return jsonify(default_settings)
        
        else:  # POST
            # Update system settings
            data = request.get_json()
            
            import psycopg2
            import json
            from datetime import datetime
            
            conn_string = os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DATABASE_URL')
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            
            # Get current admin user ID (simplified - in production, get from session)
            admin_user_id = 1  # Placeholder - should come from authenticated session
            
            updated_count = 0
            
            # Process and update settings
            def update_setting(key, value, setting_type='text', category='general'):
                nonlocal updated_count
                try:
                    if setting_type == 'json':
                        value_str = json.dumps(value)
                    else:
                        value_str = str(value)
                    
                    cursor.execute("""
                        INSERT INTO system_settings 
                        (setting_key, setting_value, setting_type, category, updated_by, updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (setting_key) 
                        DO UPDATE SET 
                            setting_value = EXCLUDED.setting_value,
                            setting_type = EXCLUDED.setting_type,
                            category = EXCLUDED.category,
                            updated_by = EXCLUDED.updated_by,
                            updated_at = EXCLUDED.updated_at
                    """, (key, value_str, setting_type, category, admin_user_id, datetime.now()))
                    updated_count += 1
                except Exception as e:
                    logger.error(f"Error updating setting {key}: {e}")
            
            # Update nested settings
            for section, section_data in data.items():
                if isinstance(section_data, dict):
                    for setting_key, setting_value in section_data.items():
                        full_key = f"{section}.{setting_key}"
                        setting_type = 'number' if isinstance(setting_value, (int, float)) else 'text'
                        update_setting(full_key, setting_value, setting_type, section)
                else:
                    setting_type = 'number' if isinstance(section_data, (int, float)) else 'text'
                    update_setting(section, section_data, setting_type)
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return jsonify({
                'success': True,
                'message': f'System settings updated successfully. {updated_count} settings saved.',
                'updated_count': updated_count
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
        conn_string = os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DATABASE_URL')
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
        conn_string = os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DATABASE_URL')
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        
        # Get credit statistics from Supabase users_registration table
        from database.external_db import make_supabase_request
        
        # Get all users to calculate statistics
        users_data = make_supabase_request("GET", "users_registration", {})
        
        if not users_data:
            cursor.close()
            conn.close()
            return jsonify({
                'overview': {
                    'total_users': 0,
                    'total_credits': 0,
                    'avg_credits': 0,
                    'min_credits': 0,
                    'max_credits': 0,
                    'low_credit_users': 0,
                    'medium_credit_users': 0,
                    'high_credit_users': 0
                },
                'top_users': [],
                'recent_transactions': []
            })
        
        # Calculate statistics - handle null credits properly
        total_users = len(users_data)
        # Convert all credits to integers, replacing None with 0
        credits_list = []
        for user in users_data:
            credits = user.get('credits')
            if credits is None:
                credits_list.append(0)
            else:
                credits_list.append(int(credits))
        
        total_credits = sum(credits_list)
        avg_credits = total_credits / total_users if total_users > 0 else 0
        min_credits = min(credits_list) if credits_list else 0
        max_credits = max(credits_list) if credits_list else 0
        low_credit_users = sum(1 for c in credits_list if c < 50)
        medium_credit_users = sum(1 for c in credits_list if 50 <= c <= 200)
        high_credit_users = sum(1 for c in credits_list if c > 200)
        
        # Create stats tuple to match original format
        stats = (total_users, total_credits, avg_credits, min_credits, max_credits, 
                low_credit_users, medium_credit_users, high_credit_users)
        
        # Get top users by credits from Supabase - handle null credits properly
        top_users_data = sorted(users_data, key=lambda u: u.get('credits') or 0, reverse=True)[:10]
        top_users = []
        for user in top_users_data:
            top_users.append((
                user.get('chat_id', ''),
                f"{user.get('name', '')} {user.get('surname', '')}".strip(),
                user.get('name', ''),
                user.get('credits') or 0  # Handle null credits
            ))
        
        # Get recent credit transactions from Supabase
        try:
            transactions_data = make_supabase_request(
                "GET", 
                "credit_transactions",
                {}
            )
            # Sort by created_at in memory since we can't use order_by parameter
            if transactions_data:
                transactions_data = sorted(transactions_data, 
                                         key=lambda x: x.get('created_at', ''), 
                                         reverse=True)[:10]
            recent_transactions = []
            if transactions_data:
                for tx in transactions_data:
                    recent_transactions.append((
                        tx.get('user_id', ''),
                        tx.get('transaction_type', ''),
                        tx.get('credits_used', 0),
                        tx.get('description', ''),
                        tx.get('created_at', '')
                    ))
        except Exception as tx_error:
            logger.warning(f"Could not fetch credit transactions: {tx_error}")
            recent_transactions = []
        
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
        conn_string = os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DATABASE_URL')
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
        conn_string = os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DATABASE_URL')
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        
        # Get broadcast history
        cursor.execute("""
            SELECT id, admin_user_id, message_content, target_audience, total_recipients, 
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
