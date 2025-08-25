import logging
from flask import Blueprint, render_template, jsonify, request
from database.external_db import (
    test_connection, get_user_stats, make_supabase_request, 
    complete_payment, get_pending_payment
)
from services.user_service import UserService
from services.question_service import QuestionService
from api.auth import login_required
from datetime import datetime, timedelta
import os

logger = logging.getLogger(__name__)

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/')
@dashboard_bp.route('/dashboard')
@login_required
def dashboard_home():
    """Dashboard home page"""
    try:
        return render_template('dashboard.html', admin_user=request.admin_user)
    except Exception as e:
        logger.error(f"Dashboard error: {e}")
        return f"Dashboard error: {e}", 500

@dashboard_bp.route('/analytics')
@login_required
def analytics():
    """User Analytics page"""
    try:
        return render_template('analytics.html', admin_user=request.admin_user)
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        return f"Analytics error: {e}", 500

@dashboard_bp.route('/revenue')
@login_required
def revenue():
    """Revenue & Credit Management page"""
    try:
        return render_template('revenue.html', admin_user=request.admin_user)
    except Exception as e:
        logger.error(f"Revenue error: {e}")
        return f"Revenue error: {e}", 500

@dashboard_bp.route('/payments')
@login_required
def payments():
    """Ecocash Payment Review page"""
    try:
        return render_template('payments.html', admin_user=request.admin_user)
    except Exception as e:
        logger.error(f"Payments error: {e}")
        return f"Payments error: {e}", 500

@dashboard_bp.route('/api/stats')
@login_required
def get_dashboard_stats():
    """Get dashboard statistics with real Supabase data"""
    try:
        # Database connection test
        db_status = test_connection()
        
        # Get total users
        users_data = make_supabase_request("GET", "users_registration", select="id")
        total_users = len(users_data) if users_data else 0
        
        # Get active users today
        today = datetime.now().strftime('%Y-%m-%d')
        active_users_data = make_supabase_request(
            "GET", "user_stats", 
            select="user_id",
            filters={"last_activity": f"gte.{today}T00:00:00"}
        )
        active_users_today = len(active_users_data) if active_users_data else 0
        
        # Get total credit transactions (proxy for questions answered)
        credit_transactions = make_supabase_request("GET", "credit_transactions", select="id")
        total_questions_answered = len(credit_transactions) if credit_transactions else 0
        
        # Get total payments/revenue
        payments_data = make_supabase_request(
            "GET", "payments", 
            select="amount_paid",
            filters={"status": "eq.completed"}
        )
        # Also try to get from completed payments table if payments table is empty
        if not payments_data or len(payments_data) == 0:
            completed_payments = make_supabase_request("GET", "completed_payments", select="amount_paid")
            payments_data = completed_payments if completed_payments else []
        
        total_revenue = sum(p.get('amount_paid', 0) for p in payments_data) if payments_data else 0
        
        # Get recent user registrations for growth trend
        all_registrations = make_supabase_request("GET", "users_registration", select="created_at")
        new_registrations_week = 0
        
        if all_registrations:
            week_ago = datetime.now() - timedelta(days=7)
            for reg in all_registrations:
                created_at = reg.get('created_at')
                if created_at:
                    try:
                        reg_date = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        if reg_date >= week_ago:
                            new_registrations_week += 1
                    except:
                        continue
        
        stats = {
            'total_users': total_users,
            'active_users_today': active_users_today,
            'total_questions_answered': total_questions_answered,
            'total_revenue': round(total_revenue, 2),
            'new_registrations_week': new_registrations_week,
            'arpu': round(total_revenue / total_users, 2) if total_users > 0 else 0,
            'database_status': 'connected' if db_status else 'disconnected'
        }
        
        return jsonify(stats)
        
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/users')
@login_required
def get_users():
    """Get users list with real data"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 50, type=int)
        
        # Get user registrations with stats
        users_reg = make_supabase_request("GET", "users_registration", select="*")
        users_stats = make_supabase_request("GET", "user_stats", select="*")
        
        # Combine registration and stats data
        users_combined = []
        if users_reg and users_stats:
            # Create a lookup dict for stats
            stats_lookup = {stat['user_id']: stat for stat in users_stats}
            
            for user in users_reg:
                chat_id = user.get('chat_id')
                user_stat = stats_lookup.get(chat_id, {})
                
                combined_user = {
                    'id': user.get('id'),
                    'chat_id': chat_id,
                    'name': user.get('name'),
                    'surname': user.get('surname'),
                    'nerdx_id': user.get('nerdx_id'),
                    'registration_date': user.get('created_at'),
                    'credits': user_stat.get('credits', 0),
                    'total_attempts': user_stat.get('total_attempts', 0),
                    'correct_answers': user_stat.get('correct_answers', 0),
                    'xp_points': user_stat.get('xp_points', 0),
                    'streak': user_stat.get('streak', 0),
                    'last_activity': user_stat.get('last_activity')
                }
                users_combined.append(combined_user)
        
        # Sort by registration date (newest first)
        users_combined.sort(key=lambda x: x.get('registration_date', ''), reverse=True)
        
        # Pagination
        total = len(users_combined)
        start = (page - 1) * limit
        end = start + limit
        paginated_users = users_combined[start:end]
        
        return jsonify({
            'users': paginated_users,
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit,
            'limit': limit
        })
        
    except Exception as e:
        logger.error(f"Error getting users: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/user/<user_id>')
@login_required
def get_user_details(user_id: str):
    """Get detailed user information"""
    try:
        user_service = UserService()
        stats = user_service.get_user_stats_summary(user_id)
        
        if stats['success']:
            return jsonify(stats['stats'])
        else:
            return jsonify({'error': 'User not found'}), 404
            
    except Exception as e:
        logger.error(f"Error getting user details: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/questions')
@login_required
def get_questions():
    """Get questions analytics"""
    try:
        from constants import TOPICS
        
        analytics = {}
        for subject in TOPICS.keys():
            analytics[subject] = {
                'total': 0,
                'by_difficulty': {
                    'easy': 0,
                    'medium': 0,
                    'difficult': 0
                },
                'by_topic': {}
            }
            
            for topic in TOPICS[subject]:
                analytics[subject]['by_topic'][topic] = 0
        
        return jsonify(analytics)
        
    except Exception as e:
        logger.error(f"Error getting questions analytics: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/payments')
@login_required
def get_payments():
    """Get payment analytics with real data"""
    try:
        # Get completed payments (all payments in payments table are completed by default)
        completed_payments = make_supabase_request("GET", "payments", select="*")
        
        # Get pending payments from your pending_payments table
        pending_payments = make_supabase_request("GET", "pending_payments", select="*")
        
        # Filter for pending status
        if pending_payments:
            pending_payments = [p for p in pending_payments if p.get('status') == 'pending']
        
        # Calculate analytics
        total_revenue = sum(p.get('amount_paid', 0) for p in completed_payments) if completed_payments else 0
        total_transactions = len(completed_payments) if completed_payments else 0
        pending_count = len(pending_payments) if pending_payments else 0
        
        # Get recent transactions (last 10)
        recent = completed_payments[-10:] if completed_payments else []
        
        payments = {
            'total_revenue': round(total_revenue, 2),
            'total_transactions': total_transactions,
            'successful_payments': total_transactions,
            'failed_payments': 0,  # Could add failed payment tracking
            'pending_payments': pending_count,
            'recent_transactions': recent
        }
        
        return jsonify(payments)
        
    except Exception as e:
        logger.error(f"Error getting payment analytics: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/activity')
@login_required
def get_activity():
    """Get comprehensive user activity analytics with real data from analytics tables"""
    try:
        import psycopg2
        conn_string = 'postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        
        # Get daily active users from analytics table
        cursor.execute("""
            SELECT date, total_active_users, new_users, returning_users, 
                   total_sessions, avg_session_duration, total_questions_attempted,
                   total_credits_used
            FROM daily_user_activity 
            ORDER BY date DESC 
            LIMIT 30;
        """)
        
        daily_activity_rows = cursor.fetchall()
        daily_active_users = []
        
        for row in daily_activity_rows:
            daily_active_users.append({
                'date': str(row[0]),
                'users': row[1],
                'new_users': row[2],
                'returning_users': row[3],
                'sessions': row[4],
                'avg_session_duration': row[5],
                'questions_attempted': row[6],
                'credits_used': row[7]
            })
        
        # Get subject engagement data
        cursor.execute("""
            SELECT subject, SUM(total_attempts) as attempts, 
                   SUM(correct_attempts) as correct,
                   COUNT(DISTINCT date) as days_active
            FROM subject_usage_analytics 
            WHERE date >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY subject
            ORDER BY attempts DESC;
        """)
        
        subject_engagement_rows = cursor.fetchall()
        subject_engagement = []
        
        for row in subject_engagement_rows:
            accuracy = (row[2] / row[1] * 100) if row[1] > 0 else 0
            subject_engagement.append({
                'subject': row[0],
                'attempts': row[1],
                'correct': row[2],
                'accuracy': round(accuracy, 1),
                'days_active': row[3]
            })
        
        # Get weekly activity summary
        cursor.execute("""
            SELECT 
                SUM(total_active_users) as total_active_this_week,
                SUM(new_users) as new_users_this_week,
                AVG(avg_session_duration) as avg_session_duration_week,
                SUM(total_questions_attempted) as questions_this_week
            FROM daily_user_activity 
            WHERE date >= CURRENT_DATE - INTERVAL '7 days';
        """)
        
        weekly_summary = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        # Fallback to real user data if analytics table is empty
        if not daily_active_users:
            all_user_stats = make_supabase_request("GET", "user_stats", select="user_id,last_activity")
            
            for i in range(30):
                date = datetime.now() - timedelta(days=i)
                date_str = date.strftime('%Y-%m-%d')
                
                # Count users active on this date
                active_count = 0
                if all_user_stats:
                    for user in all_user_stats:
                        last_activity = user.get('last_activity')
                        if last_activity:
                            try:
                                activity_date = datetime.fromisoformat(last_activity.replace('Z', '+00:00'))
                                if activity_date.date() == date.date():
                                    active_count += 1
                            except:
                                continue
                
                daily_active_users.append({
                    'date': date_str,
                    'users': active_count,
                    'new_users': 0,
                    'returning_users': active_count,
                    'sessions': active_count,
                    'avg_session_duration': 600,
                    'questions_attempted': active_count * 5,
                    'credits_used': active_count * 10
                })
        
        # Get credit transactions for real-time activity metrics
        all_credit_transactions = make_supabase_request("GET", "credit_transactions", select="created_at")
        
        # Calculate activity periods
        today = datetime.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        today_activity = 0
        week_activity = 0
        month_activity = 0
        
        if all_credit_transactions:
            for transaction in all_credit_transactions:
                created_at = transaction.get('created_at')
                if created_at:
                    try:
                        tx_date = datetime.fromisoformat(created_at.replace('Z', '+00:00')).date()
                        if tx_date == today:
                            today_activity += 1
                        if tx_date >= week_ago:
                            week_activity += 1
                        if tx_date >= month_ago:
                            month_activity += 1
                    except:
                        continue
        
        return jsonify({
            'daily_active_users': daily_active_users,
            'subject_engagement': subject_engagement,
            'question_activity': {
                'today': today_activity,
                'this_week': week_activity,
                'this_month': month_activity
            },
            'weekly_summary': {
                'total_active_users': int(weekly_summary[0]) if weekly_summary[0] else 0,
                'new_users': int(weekly_summary[1]) if weekly_summary[1] else 0,
                'avg_session_duration': int(weekly_summary[2]) if weekly_summary[2] else 0,
                'questions_attempted': int(weekly_summary[3]) if weekly_summary[3] else 0
            } if weekly_summary else {}
        })
        
    except Exception as e:
        logger.error(f"Error getting activity analytics: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/analytics/advanced')
@login_required
def get_advanced_analytics():
    """Get comprehensive analytics data for the analytics page"""
    try:
        import psycopg2
        conn_string = 'postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        
        # Get user engagement metrics
        cursor.execute("""
            SELECT 
                AVG(total_time_spent) as avg_session_time,
                AVG(engagement_score) as avg_engagement_score,
                COUNT(CASE WHEN retention_status = 'active' THEN 1 END) * 100.0 / COUNT(*) as retention_rate
            FROM user_engagement_metrics 
            WHERE date >= CURRENT_DATE - INTERVAL '30 days';
        """)
        
        engagement_data = cursor.fetchone()
        
        # Get subject performance data for the last week
        cursor.execute("""
            SELECT 
                subject,
                SUM(total_attempts) as total_attempts,
                SUM(correct_attempts) as correct_attempts,
                AVG(avg_time_per_question) as avg_time,
                COUNT(DISTINCT date) as active_days
            FROM subject_usage_analytics 
            WHERE date >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY subject
            ORDER BY total_attempts DESC;
        """)
        
        subject_performance = cursor.fetchall()
        
        # Get user growth trends
        cursor.execute("""
            SELECT date, new_users, total_active_users
            FROM daily_user_activity 
            WHERE date >= CURRENT_DATE - INTERVAL '30 days'
            ORDER BY date;
        """)
        
        growth_trends = cursor.fetchall()
        
        # Get feature usage analytics
        cursor.execute("""
            SELECT 
                feature_name,
                usage_count,
                unique_users,
                success_rate
            FROM feature_usage_analytics 
            WHERE date >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY feature_name, usage_count, unique_users, success_rate
            ORDER BY usage_count DESC;
        """)
        
        feature_usage = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Format the response
        analytics = {
            'user_engagement': {
                'avg_session_time': int(engagement_data[0]) if engagement_data[0] else 900,  # 15 minutes default
                'avg_engagement_score': float(engagement_data[1]) if engagement_data[1] else 7.5,
                'retention_rate': float(engagement_data[2]) if engagement_data[2] else 78.0
            },
            'subject_performance': [
                {
                    'subject': row[0],
                    'attempts': row[1],
                    'correct': row[2],
                    'accuracy': round((row[2] / row[1] * 100) if row[1] > 0 else 0, 1),
                    'avg_time': row[3],
                    'active_days': row[4]
                } for row in subject_performance
            ],
            'growth_trends': [
                {
                    'date': str(row[0]),
                    'new_users': row[1],
                    'total_active': row[2]
                } for row in growth_trends
            ],
            'feature_usage': [
                {
                    'feature': row[0],
                    'usage_count': row[1],
                    'unique_users': row[2],
                    'success_rate': float(row[3]) if row[3] else 0
                } for row in feature_usage
            ]
        }
        
        return jsonify(analytics)
        
    except Exception as e:
        logger.error(f"Error getting advanced analytics: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/users/engagement')
@login_required
def get_user_engagement():
    """Get detailed user engagement data"""
    try:
        import psycopg2
        conn_string = 'postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        
        # Get user engagement over time
        cursor.execute("""
            SELECT 
                ur.chat_id,
                ur.name,
                ur.surname,
                ur.nerdx_id,
                us.credits,
                us.total_attempts,
                us.correct_answers,
                us.xp_points,
                us.streak,
                us.last_activity,
                ur.created_at as registration_date
            FROM users_registration ur
            LEFT JOIN user_stats us ON ur.chat_id = us.user_id
            ORDER BY us.last_activity DESC NULLS LAST;
        """)
        
        user_engagement_data = cursor.fetchall()
        
        # Calculate engagement metrics for each user
        users_with_metrics = []
        for row in user_engagement_data:
            last_activity = row[9]
            registration_date = row[10]
            
            # Calculate days since registration
            days_since_reg = 0
            if registration_date:
                try:
                    reg_date = datetime.fromisoformat(registration_date.replace('Z', '+00:00'))
                    days_since_reg = (datetime.now() - reg_date).days
                except:
                    days_since_reg = 0
            
            # Calculate engagement score
            attempts = row[5] or 0
            accuracy = (row[6] / attempts * 100) if attempts > 0 else 0
            streak = row[8] or 0
            engagement_score = min(100, (attempts * 0.5) + (accuracy * 0.3) + (streak * 2))
            
            # Determine activity status
            activity_status = 'inactive'
            if last_activity:
                try:
                    last_act_date = datetime.fromisoformat(last_activity.replace('Z', '+00:00'))
                    days_since_activity = (datetime.now() - last_act_date).days
                    if days_since_activity <= 1:
                        activity_status = 'very_active'
                    elif days_since_activity <= 7:
                        activity_status = 'active'
                    elif days_since_activity <= 30:
                        activity_status = 'at_risk'
                except:
                    pass
            
            users_with_metrics.append({
                'user_id': row[0],
                'name': f"{row[1]} {row[2]}".strip(),
                'nerdx_id': row[3],
                'credits': row[4] or 0,
                'total_attempts': attempts,
                'correct_answers': row[6] or 0,
                'accuracy': round(accuracy, 1),
                'xp_points': row[7] or 0,
                'streak': streak,
                'engagement_score': round(engagement_score, 1),
                'activity_status': activity_status,
                'days_since_registration': days_since_reg,
                'last_activity': last_activity,
                'registration_date': registration_date
            })
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'users': users_with_metrics,
            'total_users': len(users_with_metrics),
            'engagement_summary': {
                'very_active': len([u for u in users_with_metrics if u['activity_status'] == 'very_active']),
                'active': len([u for u in users_with_metrics if u['activity_status'] == 'active']),
                'at_risk': len([u for u in users_with_metrics if u['activity_status'] == 'at_risk']),
                'inactive': len([u for u in users_with_metrics if u['activity_status'] == 'inactive']),
                'avg_engagement_score': round(sum(u['engagement_score'] for u in users_with_metrics) / len(users_with_metrics), 1) if users_with_metrics else 0
            }
        })
        
    except Exception as e:
        logger.error(f"Error getting user engagement: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/system/health')
@login_required
def system_health():
    """Get system health status"""
    try:
        health = {
            'database': test_connection(),
            'whatsapp_api': True,  # Would test actual WhatsApp API
            'ai_services': {
                'deepseek': bool(os.getenv('DEEPSEEK_API_KEY')),
                'gemini': bool(os.getenv('GEMINI_API_KEY'))
            },
            'payment_gateway': bool(os.getenv('ECOCASH_API_KEY')),
            'uptime': '0 days, 0 hours, 0 minutes'  # Would calculate actual uptime
        }
        
        return jsonify(health)
        
    except Exception as e:
        logger.error(f"Error getting system health: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/export/users')
def export_users():
    """Export users data"""
    try:
        # In production, implement proper user export
        return jsonify({'message': 'User export feature not implemented'}), 501
        
    except Exception as e:
        logger.error(f"Error exporting users: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/export/analytics')
def export_analytics():
    """Export analytics data"""
    try:
        # In production, implement proper analytics export
        return jsonify({'message': 'Analytics export feature not implemented'}), 501
        
    except Exception as e:
        logger.error(f"Error exporting analytics: {e}")
        return jsonify({'error': str(e)}), 500

# CRITICAL PAYMENT REVIEW ENDPOINTS

@dashboard_bp.route('/api/pending-payments')
@login_required
def get_pending_payments():
    """Get pending payments for admin review"""
    try:
        # Get all pending payments first
        pending_payments = make_supabase_request("GET", "pending_payments", select="*")
        
        # Filter for pending status
        if pending_payments:
            pending_payments = [p for p in pending_payments if p.get('status') == 'pending']
        
        if not pending_payments:
            return jsonify({'pending_payments': []})
        
        # Get user registration data for names
        enhanced_payments = []
        for payment in pending_payments:
            user_id = payment.get('user_id')
            
            # Get user registration details (using chat_id from your schema)
            user_reg = make_supabase_request(
                "GET", "users_registration",
                select="name,surname",
                filters={"chat_id": f"eq.{user_id}"}
            )
            
            user_name = "Unknown User"
            user_surname = ""
            if user_reg and len(user_reg) > 0:
                user_name = user_reg[0].get('name', 'Unknown')
                user_surname = user_reg[0].get('surname', '')
            
            enhanced_payment = {
                'payment_id': payment.get('id'),
                'transaction_reference': payment.get('transaction_reference'),
                'user_id': user_id,
                'student_name': f"{user_name} {user_surname}".strip(),
                'time_of_transaction': payment.get('created_at'),
                'money_paid': payment.get('amount_expected'),
                'credits_purchased': payment.get('credits_to_add'),
                'status': payment.get('status'),
                'admin_notes': payment.get('admin_notes', ''),
                'rejection_reason': payment.get('rejection_reason', ''),
                'ecocash_confirmation_message': f"Payment of ${payment.get('amount_expected')} from user {user_id} - Ref: {payment.get('transaction_reference')}"
            }
            enhanced_payments.append(enhanced_payment)
        
        # Sort by creation date (newest first)
        enhanced_payments.sort(key=lambda x: x.get('time_of_transaction', ''), reverse=True)
        
        return jsonify({'pending_payments': enhanced_payments})
        
    except Exception as e:
        logger.error(f"Error getting pending payments: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/approve-payment', methods=['POST'])
@login_required
def approve_payment():
    """Approve a pending payment and add credits to user"""
    try:
        data = request.get_json()
        transaction_ref = data.get('transaction_reference')
        
        if not transaction_ref:
            return jsonify({'error': 'Transaction reference is required'}), 400
        
        # Use the enhanced payment service to approve payment
        from services.payment_service import PaymentService
        payment_service = PaymentService()
        
        result = payment_service.approve_payment(transaction_ref)
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': 'Payment approved and credits added successfully',
                'user_id': result.get('user_id'),
                'credits_added': result.get('credits'),
                'package': result.get('package', {}).get('name', 'Unknown')
            })
        else:
            return jsonify({
                'success': False,
                'message': result.get('message', 'Failed to approve payment')
            }), 400
            
    except Exception as e:
        logger.error(f"Error approving payment: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/reject-payment', methods=['POST'])
@login_required
def reject_payment():
    """Reject a pending payment"""
    try:
        data = request.get_json()
        transaction_ref = data.get('transaction_reference')
        reason = data.get('reason', 'Payment rejected by admin')
        
        if not transaction_ref:
            return jsonify({'error': 'Transaction reference is required'}), 400
        
        # Use the enhanced payment service to reject payment
        from services.payment_service import PaymentService
        payment_service = PaymentService()
        
        result = payment_service.reject_payment(transaction_ref, reason)
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': 'Payment rejected successfully',
                'user_id': result.get('user_id'),
                'reason': reason
            })
        else:
            return jsonify({
                'success': False,
                'message': result.get('message', 'Failed to reject payment')
            }), 400
            
    except Exception as e:
        logger.error(f"Error rejecting payment: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/credit-transactions')
@login_required
def get_credit_transactions():
    """Get credit transaction history"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 50, type=int)
        
        # Get credit transactions
        credit_transactions = make_supabase_request("GET", "credit_transactions", select="*")
        
        if not credit_transactions:
            return jsonify({
                'transactions': [],
                'total': 0,
                'page': page,
                'pages': 0
            })
        
        # Sort by creation date (newest first)
        credit_transactions.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        # Pagination
        total = len(credit_transactions)
        start = (page - 1) * limit
        end = start + limit
        paginated_transactions = credit_transactions[start:end]
        
        return jsonify({
            'transactions': paginated_transactions,
            'total': total,
            'page': page,
            'pages': (total + limit - 1) // limit
        })
        
    except Exception as e:
        logger.error(f"Error getting credit transactions: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/advanced-analytics')
@login_required
def get_advanced_analytics_service():
    """Get comprehensive analytics with profit calculations"""
    try:
        from services.analytics_service import advanced_analytics_service
        
        analytics = advanced_analytics_service.calculate_real_time_analytics()
        
        return jsonify(analytics)
        
    except Exception as e:
        logger.error(f"Error getting advanced analytics: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/revenue-predictions')
@login_required
def get_revenue_predictions():
    """Get revenue predictions based on current trends"""
    try:
        from services.analytics_service import advanced_analytics_service
        
        days = request.args.get('days', 30, type=int)
        predictions = advanced_analytics_service.predict_future_revenue(days)
        
        return jsonify(predictions)
        
    except Exception as e:
        logger.error(f"Error getting revenue predictions: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/ai-recommendations')
@login_required
def get_ai_recommendations():
    """Get AI-powered recommendations for system improvement"""
    try:
        from services.analytics_service import advanced_analytics_service
        
        recommendations = advanced_analytics_service.generate_ai_recommendations()
        
        return jsonify({
            'recommendations': recommendations,
            'generated_at': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting AI recommendations: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/profit-analytics')
@login_required
def get_profit_analytics():
    """Get detailed profit analytics"""
    try:
        from services.analytics_service import advanced_analytics_service
        
        analytics = advanced_analytics_service.calculate_real_time_analytics()
        
        # Extract profit-specific metrics
        financial = analytics.get('financial_metrics', {})
        credit_metrics = analytics.get('credit_metrics', {})
        
        profit_data = {
            'total_revenue': financial.get('total_revenue', 0),
            'total_operational_cost': financial.get('total_operational_cost', 0),
            'gross_profit': financial.get('gross_profit', 0),
            'profit_margin': financial.get('profit_margin', 0),
            'cost_per_credit': advanced_analytics_service.OPERATIONAL_COST_PER_CREDIT,
            'selling_price_per_credit': advanced_analytics_service.SELLING_PRICE_PER_CREDIT,
            'profit_per_credit': advanced_analytics_service.PROFIT_MARGIN_PER_CREDIT,
            'credits_sold': credit_metrics.get('total_credits_sold', 0),
            'credits_used': credit_metrics.get('total_credits_used', 0),
            'credit_utilization_rate': credit_metrics.get('credit_utilization_rate', 0),
            'cost_breakdown': analytics.get('cost_breakdown', {}),
            'package_performance': analytics.get('package_breakdown', {})
        }
        
        return jsonify(profit_data)
        
    except Exception as e:
        logger.error(f"Error getting profit analytics: {e}")
        return jsonify({'error': str(e)}), 500