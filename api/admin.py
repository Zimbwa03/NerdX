import os
import json
import logging
import psycopg2
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Tuple
from flask import Blueprint, render_template, request, jsonify
from database.external_db import add_credits, deduct_credits, get_user_registration, make_supabase_request
from services.user_service import UserService
from services.question_service import QuestionService
from services.payment_service import PaymentService
from utils.validators import validators
from utils.vertex_ai_helper import try_vertex_text

logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin', __name__)

def _ensure_broadcast_logs_table(cursor):
    """Ensure the broadcast_logs table exists with expected schema"""
    try:
        # Create table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS broadcast_logs (
                id SERIAL PRIMARY KEY,
                admin_id INTEGER,
                admin_user VARCHAR(255),
                message TEXT NOT NULL,
                message_content TEXT,
                target_group VARCHAR(100),
                target_audience VARCHAR(100),
                target_users INTEGER DEFAULT 0,
                total_recipients INTEGER DEFAULT 0,
                sent_count INTEGER DEFAULT 0,
                successful_sends INTEGER DEFAULT 0,
                failed_count INTEGER DEFAULT 0,
                failed_sends INTEGER DEFAULT 0,
                status VARCHAR(20) DEFAULT 'completed',
                additional_data JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                completed_at TIMESTAMP WITH TIME ZONE
            );
        """)
        
        # Add columns that might not exist (for backward compatibility)
        column_additions = [
            "ALTER TABLE broadcast_logs ADD COLUMN IF NOT EXISTS admin_user VARCHAR(255)",
            "ALTER TABLE broadcast_logs ADD COLUMN IF NOT EXISTS message_content TEXT",
            "ALTER TABLE broadcast_logs ADD COLUMN IF NOT EXISTS target_group VARCHAR(100)",
            "ALTER TABLE broadcast_logs ADD COLUMN IF NOT EXISTS target_audience VARCHAR(100)",
            "ALTER TABLE broadcast_logs ADD COLUMN IF NOT EXISTS total_recipients INTEGER DEFAULT 0",
            "ALTER TABLE broadcast_logs ADD COLUMN IF NOT EXISTS successful_sends INTEGER DEFAULT 0",
            "ALTER TABLE broadcast_logs ADD COLUMN IF NOT EXISTS failed_sends INTEGER DEFAULT 0",
            "ALTER TABLE broadcast_logs ADD COLUMN IF NOT EXISTS additional_data JSONB"
        ]
        
        for alter_stmt in column_additions:
            try:
                cursor.execute(alter_stmt)
            except Exception as e:
                logger.debug(f"Column may already exist: {e}")
        
        # Create index for faster queries
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_broadcast_logs_created_at 
            ON broadcast_logs(created_at DESC);
        """)
        
    except Exception as e:
        logger.error(f"Error ensuring broadcast_logs table: {e}")
        raise

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


def _parse_iso_datetime(value: Any) -> datetime | None:
    """Best-effort ISO datetime parser."""
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(str(value).replace('Z', '+00:00'))
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed
    except Exception:
        return None


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except Exception:
        return default


def _build_teacher_progress(
    profile: Dict[str, Any],
    subjects: List[Dict[str, Any]],
    qualifications: List[Dict[str, Any]],
    completed_lessons: int,
) -> Dict[str, Any]:
    """Compute a progress score for each teacher application lifecycle."""
    profile_basics_ready = all([
        bool(profile.get('full_name')),
        bool(profile.get('email')),
        bool(profile.get('whatsapp')),
        bool(profile.get('bio')),
        bool(profile.get('experience_description')),
    ])
    has_subjects = len(subjects) > 0
    has_qualifications = len(qualifications) > 0
    has_certificates = any(bool(q.get('certificate_url')) for q in qualifications)
    has_media = bool(profile.get('profile_image_url') or profile.get('intro_video_url'))
    has_completed_lesson = completed_lessons > 0

    steps = {
        'application_submitted': True,
        'profile_completed': profile_basics_ready,
        'subjects_added': has_subjects,
        'qualifications_added': has_qualifications,
        'certificates_uploaded': has_certificates,
        'media_uploaded': has_media,
        'first_lesson_completed': has_completed_lesson,
    }
    total_steps = len(steps)
    done_steps = sum(1 for value in steps.values() if value)
    progress_score = round((done_steps / total_steps) * 100) if total_steps else 0

    return {
        'score': progress_score,
        'completed_steps': done_steps,
        'total_steps': total_steps,
        'steps': steps,
    }


def _build_teacher_intelligence_payload(
    search_query: str = '',
    status_filter: str = 'all',
) -> Dict[str, Any]:
    """Aggregate teacher applications, docs, and performance for admin intelligence."""
    now_utc = datetime.now(timezone.utc)
    today_str = now_utc.date().isoformat()
    query = (search_query or '').strip().lower()
    status = (status_filter or 'all').strip().lower()

    profiles = make_supabase_request(
        "GET",
        "teacher_profiles",
        select="id,user_id,full_name,surname,email,whatsapp,bio,experience_description,years_of_experience,profile_image_url,intro_video_url,verification_status,created_at,updated_at",
        use_service_role=True,
    ) or []
    subjects = make_supabase_request(
        "GET",
        "teacher_subjects",
        select="id,teacher_id,subject_name,academic_level,form_levels,curriculum",
        use_service_role=True,
    ) or []
    qualifications = make_supabase_request(
        "GET",
        "teacher_qualifications",
        select="id,teacher_id,title,institution,certificate_url,year,qualification_type",
        use_service_role=True,
    ) or []
    bookings = make_supabase_request(
        "GET",
        "lesson_bookings",
        select="id,teacher_id,student_id,subject,date,start_time,end_time,status,created_at",
        use_service_role=True,
    ) or []
    posts = make_supabase_request(
        "GET",
        "teacher_posts",
        select="id,teacher_id,created_at",
        use_service_role=True,
    ) or []
    reviews = make_supabase_request(
        "GET",
        "teacher_reviews",
        select="id,teacher_id,rating,created_at,student_id",
        use_service_role=True,
    ) or []

    subjects_by_teacher: Dict[str, List[Dict[str, Any]]] = {}
    qualifications_by_teacher: Dict[str, List[Dict[str, Any]]] = {}
    bookings_by_teacher: Dict[str, List[Dict[str, Any]]] = {}
    posts_by_teacher: Dict[str, List[Dict[str, Any]]] = {}
    reviews_by_teacher: Dict[str, List[Dict[str, Any]]] = {}

    for row in subjects:
        teacher_id = str(row.get('teacher_id') or '')
        if teacher_id:
            subjects_by_teacher.setdefault(teacher_id, []).append(row)
    for row in qualifications:
        teacher_id = str(row.get('teacher_id') or '')
        if teacher_id:
            qualifications_by_teacher.setdefault(teacher_id, []).append(row)
    for row in bookings:
        teacher_id = str(row.get('teacher_id') or '')
        if teacher_id:
            bookings_by_teacher.setdefault(teacher_id, []).append(row)
    for row in posts:
        teacher_id = str(row.get('teacher_id') or '')
        if teacher_id:
            posts_by_teacher.setdefault(teacher_id, []).append(row)
    for row in reviews:
        teacher_id = str(row.get('teacher_id') or '')
        if teacher_id:
            reviews_by_teacher.setdefault(teacher_id, []).append(row)

    teachers: List[Dict[str, Any]] = []
    all_students: set[str] = set()

    for profile in profiles:
        teacher_id = str(profile.get('id') or '')
        if not teacher_id:
            continue

        teacher_subjects = subjects_by_teacher.get(teacher_id, [])
        teacher_qualifications = qualifications_by_teacher.get(teacher_id, [])
        teacher_bookings = bookings_by_teacher.get(teacher_id, [])
        teacher_posts = posts_by_teacher.get(teacher_id, [])
        teacher_reviews = reviews_by_teacher.get(teacher_id, [])

        verification_status = str(profile.get('verification_status') or 'pending').lower()
        if verification_status not in {'pending', 'approved', 'rejected'}:
            verification_status = 'pending'

        total_lessons = len(teacher_bookings)
        completed_lessons = 0
        pending_lessons = 0
        upcoming_lessons = 0
        teacher_students: set[str] = set()
        for booking in teacher_bookings:
            booking_status = str(booking.get('status') or '').lower()
            booking_date = str(booking.get('date') or '')
            student_id = str(booking.get('student_id') or '')
            if student_id:
                teacher_students.add(student_id)
                all_students.add(student_id)
            if booking_status == 'completed':
                completed_lessons += 1
            if booking_status == 'pending':
                pending_lessons += 1
            if booking_status in {'pending', 'confirmed'} and booking_date >= today_str:
                upcoming_lessons += 1

        ratings = [_safe_float(review.get('rating')) for review in teacher_reviews if review.get('rating') is not None]
        avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else 0.0
        total_reviews = len(ratings)

        certificates = [q for q in teacher_qualifications if q.get('certificate_url')]
        documents: List[Dict[str, Any]] = []
        if profile.get('profile_image_url'):
            documents.append({
                'id': f'{teacher_id}-profile-image',
                'type': 'profile_image',
                'title': 'Profile Image',
                'url': profile.get('profile_image_url'),
            })
        if profile.get('intro_video_url'):
            documents.append({
                'id': f'{teacher_id}-intro-video',
                'type': 'intro_video',
                'title': 'Intro Video',
                'url': profile.get('intro_video_url'),
            })
        for qualification in teacher_qualifications:
            documents.append({
                'id': qualification.get('id'),
                'type': 'certificate' if qualification.get('certificate_url') else 'qualification',
                'title': qualification.get('title') or 'Qualification',
                'institution': qualification.get('institution') or '',
                'year': qualification.get('year'),
                'qualification_type': qualification.get('qualification_type') or 'Other',
                'url': qualification.get('certificate_url'),
            })

        progress = _build_teacher_progress(
            profile=profile,
            subjects=teacher_subjects,
            qualifications=teacher_qualifications,
            completed_lessons=completed_lessons,
        )

        created_at = str(profile.get('created_at') or '')
        created_dt = _parse_iso_datetime(created_at)
        application_age_days = (now_utc.date() - created_dt.date()).days if created_dt else None
        is_new_application = bool(
            verification_status == 'pending'
            and created_dt is not None
            and application_age_days is not None
            and application_age_days <= 14
        )

        display_name = " ".join(
            part for part in [str(profile.get('full_name') or '').strip(), str(profile.get('surname') or '').strip()] if part
        ).strip() or "Unnamed Teacher"

        teachers.append({
            'id': teacher_id,
            'user_id': profile.get('user_id'),
            'display_name': display_name,
            'full_name': profile.get('full_name') or '',
            'surname': profile.get('surname') or '',
            'email': profile.get('email') or '',
            'whatsapp': profile.get('whatsapp') or '',
            'bio': profile.get('bio') or '',
            'experience_description': profile.get('experience_description') or '',
            'years_of_experience': profile.get('years_of_experience') or 0,
            'verification_status': verification_status,
            'created_at': created_at,
            'updated_at': profile.get('updated_at'),
            'application_age_days': application_age_days,
            'is_new_application': is_new_application,
            'subjects': teacher_subjects,
            'subject_names': sorted({str(subject.get('subject_name') or '').strip() for subject in teacher_subjects if subject.get('subject_name')}),
            'qualifications': teacher_qualifications,
            'documents': documents,
            'metrics': {
                'total_lessons': total_lessons,
                'completed_lessons': completed_lessons,
                'pending_lessons': pending_lessons,
                'upcoming_lessons': upcoming_lessons,
                'total_students': len(teacher_students),
                'posts_count': len(teacher_posts),
                'avg_rating': avg_rating,
                'total_reviews': total_reviews,
                'certificates_count': len(certificates),
                'documents_count': len(documents),
            },
            'progress': progress,
        })

    teachers.sort(key=lambda row: row.get('created_at') or '', reverse=True)

    def _matches_filters(teacher: Dict[str, Any]) -> bool:
        teacher_status = str(teacher.get('verification_status') or 'pending')
        if status not in {'all', ''}:
            if status in {'verified', 'approved'} and teacher_status != 'approved':
                return False
            if status == 'pending' and teacher_status != 'pending':
                return False
            if status == 'rejected' and teacher_status != 'rejected':
                return False
            if status in {'not_verified', 'unverified'} and teacher_status == 'approved':
                return False
            if status == 'new' and not teacher.get('is_new_application'):
                return False

        if query:
            search_fields = [
                str(teacher.get('display_name') or ''),
                str(teacher.get('email') or ''),
                str(teacher.get('whatsapp') or ''),
                " ".join(teacher.get('subject_names') or []),
                teacher_status,
            ]
            joined = " ".join(search_fields).lower()
            if query not in joined:
                return False
        return True

    filtered_teachers = [teacher for teacher in teachers if _matches_filters(teacher)]

    def _status_counts(data: List[Dict[str, Any]]) -> Dict[str, int]:
        counts = {'pending': 0, 'approved': 0, 'rejected': 0}
        for teacher in data:
            teacher_status = str(teacher.get('verification_status') or 'pending')
            if teacher_status in counts:
                counts[teacher_status] += 1
        return counts

    def _activity_summary(data: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not data:
            return {
                'total_lessons_completed': 0,
                'upcoming_lessons': 0,
                'total_students': 0,
                'total_posts': 0,
                'average_teacher_rating': 0.0,
            }
        total_completed = sum(int(teacher['metrics']['completed_lessons']) for teacher in data)
        total_upcoming = sum(int(teacher['metrics']['upcoming_lessons']) for teacher in data)
        total_posts = sum(int(teacher['metrics']['posts_count']) for teacher in data)
        total_students = sum(int(teacher['metrics']['total_students']) for teacher in data)
        rated_teachers = [float(teacher['metrics']['avg_rating']) for teacher in data if float(teacher['metrics']['avg_rating']) > 0]
        avg_rating = round(sum(rated_teachers) / len(rated_teachers), 2) if rated_teachers else 0.0
        return {
            'total_lessons_completed': total_completed,
            'upcoming_lessons': total_upcoming,
            'total_students': total_students,
            'total_posts': total_posts,
            'average_teacher_rating': avg_rating,
        }

    all_status_counts = _status_counts(teachers)
    filtered_status_counts = _status_counts(filtered_teachers)

    performance_graph = sorted(
        filtered_teachers,
        key=lambda teacher: (
            int(teacher['metrics']['completed_lessons']),
            float(teacher['metrics']['avg_rating']),
            int(teacher['metrics']['total_students']),
        ),
        reverse=True,
    )[:8]

    return {
        'generated_at': now_utc.isoformat(),
        'filters': {'query': search_query or '', 'status': status_filter or 'all'},
        'summary': {
            'overall': {
                'total_teachers': len(teachers),
                'new_applications': sum(1 for teacher in teachers if teacher.get('is_new_application')),
                'verified_teachers': all_status_counts['approved'],
                'not_verified_teachers': all_status_counts['pending'] + all_status_counts['rejected'],
                'status_counts': all_status_counts,
                'activity': _activity_summary(teachers),
                'unique_students_platform': len(all_students),
            },
            'in_view': {
                'total_teachers': len(filtered_teachers),
                'new_applications': sum(1 for teacher in filtered_teachers if teacher.get('is_new_application')),
                'verified_teachers': filtered_status_counts['approved'],
                'not_verified_teachers': filtered_status_counts['pending'] + filtered_status_counts['rejected'],
                'status_counts': filtered_status_counts,
                'activity': _activity_summary(filtered_teachers),
            },
        },
        'status_distribution': [
            {'status': 'pending', 'label': 'Pending Review', 'count': filtered_status_counts['pending']},
            {'status': 'approved', 'label': 'Verified', 'count': filtered_status_counts['approved']},
            {'status': 'rejected', 'label': 'Rejected', 'count': filtered_status_counts['rejected']},
        ],
        'performance_graph': [
            {
                'teacher_id': teacher['id'],
                'name': teacher['display_name'],
                'completed_lessons': teacher['metrics']['completed_lessons'],
                'upcoming_lessons': teacher['metrics']['upcoming_lessons'],
                'students': teacher['metrics']['total_students'],
                'posts': teacher['metrics']['posts_count'],
                'rating': teacher['metrics']['avg_rating'],
                'progress_score': teacher['progress']['score'],
            }
            for teacher in performance_graph
        ],
        'teachers': filtered_teachers,
    }


def _build_teacher_ai_fallback_response(question: str, teachers: List[Dict[str, Any]], summary: Dict[str, Any]) -> str:
    """Fallback deterministic response when Vertex AI is unavailable."""
    if not teachers:
        return "No teacher data is available for the selected filters."

    q = (question or '').lower()
    pending_teachers = [teacher for teacher in teachers if teacher.get('verification_status') == 'pending']
    verified_teachers = [teacher for teacher in teachers if teacher.get('verification_status') == 'approved']
    top_by_lessons = sorted(teachers, key=lambda teacher: int(teacher['metrics']['completed_lessons']), reverse=True)[:3]

    lines = ["Vertex AI is currently unavailable, so this is a deterministic summary."]
    if "pending" in q or "application" in q:
        lines.append(f"Pending applications: {len(pending_teachers)}")
        for teacher in pending_teachers[:5]:
            lines.append(
                f"- {teacher['display_name']} (progress {teacher['progress']['score']}%, documents {teacher['metrics']['documents_count']})"
            )
    elif "verified" in q:
        lines.append(f"Verified teachers: {len(verified_teachers)}")
        for teacher in verified_teachers[:5]:
            lines.append(
                f"- {teacher['display_name']} (rating {teacher['metrics']['avg_rating']}, lessons {teacher['metrics']['completed_lessons']})"
            )
    elif "top" in q or "best" in q or "lesson" in q:
        lines.append("Top teachers by completed lessons:")
        for teacher in top_by_lessons:
            lines.append(
                f"- {teacher['display_name']}: {teacher['metrics']['completed_lessons']} completed, {teacher['metrics']['total_students']} students"
            )
    else:
        lines.append(
            f"Teachers in view: {summary.get('total_teachers', len(teachers))}, verified: {summary.get('verified_teachers', 0)}, not verified: {summary.get('not_verified_teachers', 0)}."
        )
        sample_teacher = teachers[0]
        lines.append(
            f"Sample teacher: {sample_teacher['display_name']} ({sample_teacher['verification_status']}), progress {sample_teacher['progress']['score']}%, "
            f"completed lessons {sample_teacher['metrics']['completed_lessons']}, rating {sample_teacher['metrics']['avg_rating']}."
        )

    lines.append("Try again shortly for Vertex AI powered narrative analysis.")
    return "\n".join(lines)


@admin_bp.route('/api/teachers/intelligence')
def get_teacher_intelligence():
    """Admin dataset for teacher applications, documents, verification, and performance."""
    try:
        search_query = request.args.get('q', '')
        status_filter = request.args.get('status', 'all')
        payload = _build_teacher_intelligence_payload(search_query=search_query, status_filter=status_filter)
        return jsonify(payload)
    except Exception as e:
        logger.error(f"Error building teacher intelligence payload: {e}", exc_info=True)
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/api/teachers/<teacher_id>/verify', methods=['POST'])
def update_teacher_verification(teacher_id):
    """Approve or reject a teacher application."""
    try:
        data = request.get_json(silent=True) or {}
        action = data.get('action', '').lower()
        reason = data.get('reason', '').strip()

        if action not in ('approve', 'reject'):
            return jsonify({'success': False, 'error': 'Action must be "approve" or "reject"'}), 400

        new_status = 'approved' if action == 'approve' else 'rejected'

        # Update verification_status in teacher_profiles
        result = make_supabase_request(
            "PATCH",
            "teacher_profiles",
            data={"verification_status": new_status},
            filters={"id": f"eq.{teacher_id}"},
            use_service_role=True,
        )

        if result is None:
            return jsonify({'success': False, 'error': 'Database update failed'}), 500

        label = 'approved' if action == 'approve' else 'rejected'
        logger.info(f"Teacher {teacher_id} {label} by admin. Reason: {reason or 'N/A'}")

        return jsonify({
            'success': True,
            'message': f'Teacher has been {label} successfully.',
            'new_status': new_status,
        })

    except Exception as e:
        logger.error(f"Error updating teacher verification: {e}", exc_info=True)
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/api/teachers/ai-assistant', methods=['POST'])
def teacher_intelligence_ai_assistant():
    """AI assistant for teacher monitoring using Vertex AI."""
    try:
        data = request.get_json(silent=True) or {}
        question = (data.get('query') or '').strip()
        if not question:
            return jsonify({'error': 'Query is required'}), 400

        teacher_id = (data.get('teacher_id') or '').strip()
        status_filter = data.get('status', 'all')
        search_query = data.get('search', '')

        payload = _build_teacher_intelligence_payload(search_query=search_query, status_filter=status_filter)
        teachers = payload.get('teachers', [])

        if teacher_id:
            teachers = [teacher for teacher in teachers if str(teacher.get('id')) == teacher_id]
            if not teachers:
                return jsonify({'error': 'Selected teacher was not found in the current data scope'}), 404

        context_teachers = teachers[:60]
        condensed_teachers = []
        for teacher in context_teachers:
            condensed_teachers.append({
                'id': teacher.get('id'),
                'name': teacher.get('display_name'),
                'verification_status': teacher.get('verification_status'),
                'progress_score': teacher.get('progress', {}).get('score', 0),
                'subjects': teacher.get('subject_names', [])[:8],
                'metrics': teacher.get('metrics', {}),
                'documents': [
                    {
                        'type': doc.get('type'),
                        'title': doc.get('title'),
                        'has_url': bool(doc.get('url')),
                    }
                    for doc in teacher.get('documents', [])[:10]
                ],
            })

        summary = payload.get('summary', {}).get('in_view', {})
        model_prompt = (
            "You are the NerdX Teacher Intelligence AI Agent for admin operations.\n"
            f"Today's date is {datetime.now(timezone.utc).date().isoformat()}.\n"
            "Answer the admin's question using ONLY the JSON data provided.\n"
            "If the data is missing, explicitly say what is missing.\n"
            "Keep the answer concise and operational with:\n"
            "1) Direct answer\n"
            "2) Key supporting evidence\n"
            "3) Recommended next admin action\n\n"
            f"Admin question: {question}\n\n"
            "Teacher dataset JSON:\n"
            f"{json.dumps({'summary': summary, 'teachers': condensed_teachers}, ensure_ascii=True)}"
        )

        ai_answer = try_vertex_text(
            model_prompt,
            model="gemini-2.5-flash",
            logger=logger,
            context="teacher_intelligence_admin_assistant",
        )
        model_used = 'vertex-ai-gemini-2.5-flash'
        if not ai_answer:
            ai_answer = _build_teacher_ai_fallback_response(question, context_teachers, summary)
            model_used = 'fallback-deterministic'

        return jsonify({
            'success': True,
            'answer': ai_answer,
            'model_used': model_used,
            'teacher_count_in_context': len(context_teachers),
            'generated_at': datetime.now(timezone.utc).isoformat(),
        })
    except Exception as e:
        logger.error(f"Error running teacher AI assistant: {e}", exc_info=True)
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
            # Reopen connection for logging
            log_conn = psycopg2.connect(conn_string)
            log_cursor = log_conn.cursor()
            
            # Ensure table exists before logging
            _ensure_broadcast_logs_table(log_cursor)
            log_conn.commit()
            
            # Try direct insert first (more reliable)
            log_cursor.execute("""
                INSERT INTO broadcast_logs 
                (admin_user, message, message_content, target_group, target_audience, 
                 total_recipients, successful_sends, failed_sends, additional_data)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                'admin',  # In production, get from session
                message,
                message,
                target,
                target,
                len(user_ids),
                successful_sends,
                failed_sends,
                json.dumps({
                    'message_length': len(message),
                    'formatted_message_length': len(formatted_message)
                })
            ))
            log_conn.commit()
            log_cursor.close()
            log_conn.close()
            logger.info("Broadcast logged successfully")
        except Exception as log_error:
            logger.error(f"Failed to log broadcast: {log_error}")
            # Ensure connection is closed
            try:
                log_cursor.close()
                log_conn.close()
            except:
                pass
            # Try fallback via Supabase API
            try:
                from database.external_db import make_supabase_request
                broadcast_log = {
                    'admin_user': 'admin',
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
            except Exception as fallback_error:
                logger.error(f"Fallback broadcast logging also failed: {fallback_error}")
        
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
        
        conn_string = os.getenv('DATABASE_URL') or os.getenv('SUPABASE_DATABASE_URL')
        if not conn_string:
            return jsonify({'error': 'Database connection string not configured'}), 500
        
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        
        # Ensure table exists
        _ensure_broadcast_logs_table(cursor)
        conn.commit()
        
        # Get broadcast history - use COALESCE to handle both old and new column names
        cursor.execute("""
            SELECT 
                id, 
                COALESCE(admin_user, 'admin') as admin_user,
                COALESCE(message_content, message) as message_content,
                COALESCE(target_audience, target_group) as target_audience,
                COALESCE(total_recipients, target_users) as total_recipients,
                COALESCE(successful_sends, sent_count) as successful_sends,
                COALESCE(failed_sends, failed_count) as failed_sends,
                created_at
            FROM broadcast_logs 
            ORDER BY created_at DESC 
            LIMIT %s;
        """, (limit,))
        
        broadcasts = cursor.fetchall()
        cursor.close()
        conn.close()
        
        broadcast_history = []
        for broadcast in broadcasts:
            message_text = broadcast[2] or ''
            total_recipients = broadcast[4] or 0
            successful_sends = broadcast[5] or 0
            
            broadcast_history.append({
                'id': broadcast[0],
                'admin_user': broadcast[1] or 'admin',
                'message': message_text[:100] + ('...' if len(message_text) > 100 else ''),
                'target_group': broadcast[3] or 'all',
                'total_recipients': total_recipients,
                'successful_sends': successful_sends,
                'failed_sends': broadcast[6] or 0,
                'created_at': str(broadcast[7]) if broadcast[7] else '',
                'success_rate': round((successful_sends / total_recipients * 100) if total_recipients > 0 else 0, 1)
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
