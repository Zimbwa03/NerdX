import logging
from flask import Blueprint, render_template, jsonify, request
from database.external_db import test_connection, get_user_stats
from services.user_service import UserService
from services.question_service import QuestionService
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
    """Analytics page"""
    try:
        return render_template('analytics.html')
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        return f"Analytics error: {e}", 500

@dashboard_bp.route('/api/stats')
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        # Database connection test
        db_status = test_connection()
        
        # Sample statistics (in production, these would come from real database queries)
        stats = {
            'total_users': 0,
            'active_users_today': 0,
            'total_questions_answered': 0,
            'total_credits_purchased': 0,
            'database_status': 'connected' if db_status else 'disconnected',
            'subjects': {
                'Mathematics': {'users': 0, 'questions': 0},
                'Biology': {'users': 0, 'questions': 0},
                'Chemistry': {'users': 0, 'questions': 0},
                'Physics': {'users': 0, 'questions': 0},
                'English': {'users': 0, 'questions': 0}
            }
        }
        
        return jsonify(stats)
        
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/users')
def get_users():
    """Get users list"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        
        # In production, implement proper user querying with pagination
        users = []
        
        return jsonify({
            'users': users,
            'total': 0,
            'page': page,
            'pages': 0
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
    """Get payment analytics"""
    try:
        # In production, implement proper payment analytics
        payments = {
            'total_revenue': 0,
            'total_transactions': 0,
            'successful_payments': 0,
            'failed_payments': 0,
            'pending_payments': 0,
            'recent_transactions': []
        }
        
        return jsonify(payments)
        
    except Exception as e:
        logger.error(f"Error getting payment analytics: {e}")
        return jsonify({'error': str(e)}), 500

@dashboard_bp.route('/api/activity')
def get_activity():
    """Get user activity analytics"""
    try:
        # In production, implement proper activity tracking
        activity = {
            'daily_active_users': [],
            'question_activity': {
                'today': 0,
                'this_week': 0,
                'this_month': 0
            },
            'subject_popularity': {
                'Mathematics': 0,
                'Biology': 0,
                'Chemistry': 0,
                'Physics': 0,
                'English': 0
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
