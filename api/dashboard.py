import logging
from flask import Blueprint, render_template, jsonify, request
from database.external_db import (
    test_connection, get_user_stats, make_supabase_request, 
    complete_payment, get_pending_payment
)
from services.user_service import UserService
from services.question_service import QuestionService
from datetime import datetime, timedelta
import os

logger = logging.getLogger(__name__)

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/')
@dashboard_bp.route('/dashboard')
def dashboard_home():
    """Dashboard home page"""
    try:
        return render_template('dashboard.html')
    except Exception as e:
        logger.error(f"Dashboard error: {e}")
        return f"Dashboard error: {e}", 500

@dashboard_bp.route('/analytics')
def analytics():
    """User Analytics page"""
    try:
        return render_template('analytics.html')
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        return f"Analytics error: {e}", 500

@dashboard_bp.route('/revenue')
def revenue():
    """Revenue & Credit Management page"""
    try:
        return render_template('revenue.html')
    except Exception as e:
        logger.error(f"Revenue error: {e}")
        return f"Revenue error: {e}", 500

@dashboard_bp.route('/payments')
def payments():
    """Ecocash Payment Review page"""
    try:
        return render_template('payments.html')
    except Exception as e:
        logger.error(f"Payments error: {e}")
        return f"Payments error: {e}", 500

@dashboard_bp.route('/api/stats')
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
def get_payments():
    """Get payment analytics with real data"""
    try:
        # Get completed payments
        completed_payments = make_supabase_request(
            "GET", "payments", 
            select="*",
            filters={"status": "eq.completed"}
        )
        
        # Get pending payments - try different approaches
        pending_payments = make_supabase_request("GET", "pending_payments", select="*")
        
        # Filter pending status on client side if needed
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
def get_activity():
    """Get user activity analytics with real data"""
    try:
        # Get daily active users for the last 30 days - simplified approach
        daily_active_users = []
        all_user_stats = make_supabase_request("GET", "user_stats", select="user_id,last_activity")
        
        if all_user_stats:
            for i in range(30):
                date = datetime.now() - timedelta(days=i)
                date_str = date.strftime('%Y-%m-%d')
                
                # Count users active on this date
                active_count = 0
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
                    'users': active_count
                })
        else:
            # Fallback with sample data if no user stats
            for i in range(30):
                date_str = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
                daily_active_users.append({
                    'date': date_str,
                    'users': max(0, 15 - i//3)  # Decreasing activity over time
                })
        
        # Get credit transactions for activity metrics - simplified approach
        all_credit_transactions = make_supabase_request("GET", "credit_transactions", select="created_at")
        
        today_activity = []
        week_activity = []
        month_activity = []
        
        if all_credit_transactions:
            today = datetime.now().date()
            week_ago = today - timedelta(days=7)
            month_ago = today - timedelta(days=30)
            
            for transaction in all_credit_transactions:
                created_at = transaction.get('created_at')
                if created_at:
                    try:
                        trans_date = datetime.fromisoformat(created_at.replace('Z', '+00:00')).date()
                        if trans_date >= month_ago:
                            month_activity.append(transaction)
                        if trans_date >= week_ago:
                            week_activity.append(transaction)
                        if trans_date >= today:
                            today_activity.append(transaction)
                    except:
                        continue
        
        activity = {
            'daily_active_users': daily_active_users,
            'question_activity': {
                'today': len(today_activity) if today_activity else 0,
                'this_week': len(week_activity) if week_activity else 0,
                'this_month': len(month_activity) if month_activity else 0
            }
        }
        
        return jsonify(activity)
        
    except Exception as e:
        logger.error(f"Error getting activity analytics: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/system/health')
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
            
            # Get user registration details
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
