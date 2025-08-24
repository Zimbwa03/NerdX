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
        total_revenue = sum(p.get('amount_paid', 0) for p in payments_data) if payments_data else 0
        
        # Get recent user registrations for growth trend
        week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        new_users_week = make_supabase_request(
            "GET", "users_registration", 
            select="created_at",
            filters={"created_at": f"gte.{week_ago}T00:00:00"}
        )
        new_registrations_week = len(new_users_week) if new_users_week else 0
        
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
        
        # Get pending payments
        pending_payments = make_supabase_request(
            "GET", "pending_payments", 
            select="*",
            filters={"status": "eq.pending"}
        )
        
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
        # Get daily active users for the last 30 days
        daily_active_users = []
        for i in range(30):
            date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
            next_date = (datetime.now() - timedelta(days=i-1)).strftime('%Y-%m-%d')
            
            active_users = make_supabase_request(
                "GET", "user_stats",
                select="user_id",
                filters={
                    "last_activity": f"gte.{date}T00:00:00",
                    "last_activity": f"lt.{next_date}T00:00:00"
                }
            )
            
            daily_active_users.append({
                'date': date,
                'users': len(active_users) if active_users else 0
            })
        
        # Get credit transactions for activity metrics
        today = datetime.now().strftime('%Y-%m-%d')
        week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
        month_ago = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        
        today_activity = make_supabase_request(
            "GET", "credit_transactions",
            select="id",
            filters={"created_at": f"gte.{today}T00:00:00"}
        )
        
        week_activity = make_supabase_request(
            "GET", "credit_transactions",
            select="id", 
            filters={"created_at": f"gte.{week_ago}T00:00:00"}
        )
        
        month_activity = make_supabase_request(
            "GET", "credit_transactions",
            select="id",
            filters={"created_at": f"gte.{month_ago}T00:00:00"}
        )
        
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
        # Get pending payments with user details
        pending_payments = make_supabase_request(
            "GET", "pending_payments", 
            select="*",
            filters={"status": "eq.pending"}
        )
        
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
        
        # Complete the payment using existing function
        success = complete_payment(transaction_ref, data.get('amount_paid', 0))
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Payment approved and credits added successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to approve payment'
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
        
        # Update payment status to rejected
        update_data = {
            'status': 'rejected',
            'rejection_reason': reason,
            'updated_at': datetime.now().isoformat()
        }
        
        success = make_supabase_request(
            "PATCH", "pending_payments", 
            update_data, 
            filters={"transaction_reference": f"eq.{transaction_ref}"}
        )
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Payment rejected successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Failed to reject payment'
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
