#!/usr/bin/env python3
"""
Payment Admin Dashboard for NerdX Bot
Handles payment approvals, rejections, and management
"""

from flask import Blueprint, render_template, request, jsonify, redirect, url_for, flash
from flask_login import login_required, current_user
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import json

# Import required services
from services.payment_service import PaymentService
from services.admin_auth_service import AdminAuthService
from database.external_db import make_supabase_request

logger = logging.getLogger(__name__)

payment_admin_bp = Blueprint('payment_admin', __name__, url_prefix='/admin/payments')

class PaymentAdminDashboard:
    """Admin dashboard for managing payments"""
    
    def __init__(self):
        self.payment_service = PaymentService()
        self.auth_service = AdminAuthService()
    
    def get_pending_payments(self) -> List[Dict]:
        """Get all pending payment transactions"""
        try:
            result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={"status": "eq.pending"},
                order_by="created_at.desc"
            )
            
            if result:
                # Enrich payment data with user and package information
                enriched_payments = []
                for payment in result:
                    # Get user details
                    user_info = self._get_user_info(payment.get('user_id'))
                    # Get package details
                    package_info = self.payment_service.get_package_by_id(payment.get('package_id', ''))
                    
                    enriched_payment = {
                        **payment,
                        'user_name': user_info.get('name', 'Unknown') if user_info else 'Unknown',
                        'user_surname': user_info.get('surname', '') if user_info else '',
                        'package_name': package_info.get('name', 'Unknown Package') if package_info else 'Unknown Package',
                        'formatted_amount': f"${payment.get('amount', 0):.2f}",
                        'formatted_created_at': self._format_datetime(payment.get('created_at')),
                        'time_ago': self._get_time_ago(payment.get('created_at'))
                    }
                    enriched_payments.append(enriched_payment)
                
                return enriched_payments
            else:
                logger.warning("No pending payments found or error occurred")
                return []
                
        except Exception as e:
            logger.error(f"Error getting pending payments: {e}")
            return []
    
    def get_approved_payments(self, days: int = 30) -> List[Dict]:
        """Get approved payments from the last N days"""
        try:
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={
                    "status": "eq.approved",
                    "approved_at": f"gte.{start_date.isoformat()}"
                },
                order_by="approved_at.desc"
            )
            
            if result:
                enriched_payments = []
                for payment in result:
                    user_info = self._get_user_info(payment.get('user_id'))
                    package_info = self.payment_service.get_package_by_id(payment.get('package_id', ''))
                    
                    enriched_payment = {
                        **payment,
                        'user_name': user_info.get('name', 'Unknown') if user_info else 'Unknown',
                        'user_surname': user_info.get('surname', '') if user_info else '',
                        'package_name': package_info.get('name', 'Unknown Package') if package_info else 'Unknown Package',
                        'formatted_amount': f"${payment.get('amount', 0):.2f}",
                        'formatted_approved_at': self._format_datetime(payment.get('approved_at')),
                        'time_ago': self._get_time_ago(payment.get('approved_at'))
                    }
                    enriched_payments.append(enriched_payment)
                
                return enriched_payments
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error getting approved payments: {e}")
            return []
    
    def get_rejected_payments(self, days: int = 30) -> List[Dict]:
        """Get rejected payments from the last N days"""
        try:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={
                    "status": "eq.rejected",
                    "rejected_at": f"gte.{start_date.isoformat()}"
                },
                order_by="rejected_at.desc"
            )
            
            if result:
                enriched_payments = []
                for payment in result:
                    user_info = self._get_user_info(payment.get('user_id'))
                    package_info = self.payment_service.get_package_by_id(payment.get('package_id', ''))
                    
                    enriched_payment = {
                        **payment,
                        'user_name': user_info.get('name', 'Unknown') if user_info else 'Unknown',
                        'user_surname': user_info.get('surname', '') if user_info else '',
                        'package_name': package_info.get('name', 'Unknown Package') if package_info else 'Unknown Package',
                        'formatted_amount': f"${payment.get('amount', 0):.2f}",
                        'formatted_rejected_at': self._format_datetime(payment.get('rejected_at')),
                        'time_ago': self._get_time_ago(payment.get('rejected_at'))
                    }
                    enriched_payments.append(enriched_payment)
                
                return enriched_payments
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error getting rejected payments: {e}")
            return []
    
    def get_payment_statistics(self) -> Dict:
        """Get payment statistics for dashboard"""
        try:
            # Get total pending payments
            pending_result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={"status": "eq.pending"}
            )
            pending_count = len(pending_result) if pending_result else 0
            
            # Get total approved payments (last 30 days)
            approved_result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={"status": "eq.approved"}
            )
            approved_count = len(approved_result) if approved_result else 0
            
            # Calculate total revenue (last 30 days)
            end_date = datetime.now()
            start_date = end_date - timedelta(days=30)
            
            revenue_result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={
                    "status": "eq.approved",
                    "approved_at": f"gte.{start_date.isoformat()}"
                }
            )
            
            total_revenue = 0
            total_credits_sold = 0
            if revenue_result:
                for payment in revenue_result:
                    total_revenue += float(payment.get('amount', 0))
                    total_credits_sold += int(payment.get('credits', 0))
            
            return {
                'pending_count': pending_count,
                'approved_count': approved_count,
                'total_revenue': f"${total_revenue:.2f}",
                'total_credits_sold': total_credits_sold,
                'average_order_value': f"${(total_revenue / approved_count):.2f}" if approved_count > 0 else "$0.00"
            }
            
        except Exception as e:
            logger.error(f"Error getting payment statistics: {e}")
            return {
                'pending_count': 0,
                'approved_count': 0,
                'total_revenue': "$0.00",
                'total_credits_sold': 0,
                'average_order_value': "$0.00"
            }
    
    def approve_payment(self, reference_code: str, admin_notes: str = "") -> Dict:
        """Approve a pending payment"""
        try:
            # Get payment details
            payment_result = make_supabase_request(
                "GET", 
                "payment_transactions", 
                filters={"reference_code": f"eq.{reference_code}"}
            )
            
            if not payment_result or len(payment_result) == 0:
                return {'success': False, 'message': 'Payment not found'}
            
            payment = payment_result[0]
            user_id = payment['user_id']
            credits = payment['credits']
            package_id = payment['package_id']
            
            # Add credits to user account
            from services.advanced_credit_service import advanced_credit_service
            add_success = advanced_credit_service.add_credits_for_purchase(
                user_id, 
                credits, 
                f"Credit purchase approved: {reference_code}"
            )
            
            if add_success:
                # Update payment status
                update_data = {
                    'status': 'approved',
                    'approved_at': datetime.now().isoformat(),
                    'credits_added': credits,
                    'admin_notes': admin_notes
                }
                
                update_result = make_supabase_request(
                    "PATCH", 
                    "payment_transactions", 
                    update_data,
                    filters={"reference_code": f"eq.{reference_code}"}
                )
                
                if update_result:
                    # Send approval notification to user
                    self._send_approval_notification(user_id, reference_code, credits)
                    
                    logger.info(f"Payment {reference_code} approved successfully for user {user_id}")
                    return {
                        'success': True, 
                        'message': f'Payment approved successfully. {credits} credits added to user account.',
                        'user_id': user_id,
                        'credits': credits
                    }
                else:
                    return {'success': False, 'message': 'Failed to update payment status'}
            else:
                return {'success': False, 'message': 'Failed to add credits to user account'}
                
        except Exception as e:
            logger.error(f"Error approving payment {reference_code}: {e}")
            return {'success': False, 'message': f'Error approving payment: {str(e)}'}
    
    def reject_payment(self, reference_code: str, admin_notes: str = "") -> Dict:
        """Reject a pending payment"""
        try:
            # Update payment status to rejected
            update_data = {
                'status': 'rejected',
                'rejected_at': datetime.now().isoformat(),
                'admin_notes': admin_notes
            }
            
            update_result = make_supabase_request(
                "PATCH", 
                "payment_transactions", 
                update_data,
                filters={"reference_code": f"eq.{reference_code}"}
            )
            
            if update_result:
                # Get payment details for notification
                payment_result = make_supabase_request(
                    "GET", 
                    "payment_transactions", 
                    filters={"reference_code": f"eq.{reference_code}"}
                )
                
                if payment_result and len(payment_result) > 0:
                    payment = payment_result[0]
                    user_id = payment['user_id']
                    # Send rejection notification to user
                    self._send_rejection_notification(user_id, reference_code, admin_notes)
                
                logger.info(f"Payment {reference_code} rejected successfully")
                return {
                    'success': True, 
                    'message': 'Payment rejected successfully. User will be notified.'
                }
            else:
                return {'success': False, 'message': 'Failed to update payment status'}
                
        except Exception as e:
            logger.error(f"Error rejecting payment {reference_code}: {e}")
            return {'success': False, 'message': f'Error rejecting payment: {str(e)}'}
    
    def _get_user_info(self, user_id: str) -> Optional[Dict]:
        """Get user information from users_registration table"""
        try:
            result = make_supabase_request(
                "GET", 
                "users_registration", 
                filters={"chat_id": f"eq.{user_id}"}
            )
            
            if result and len(result) > 0:
                return result[0]
            return None
            
        except Exception as e:
            logger.error(f"Error getting user info for {user_id}: {e}")
            return None
    
    def _format_datetime(self, datetime_str: str) -> str:
        """Format datetime string for display"""
        try:
            if datetime_str:
                dt = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
                return dt.strftime("%Y-%m-%d %H:%M:%S")
            return "Unknown"
        except Exception:
            return "Unknown"
    
    def _get_time_ago(self, datetime_str: str) -> str:
        """Get human-readable time ago string"""
        try:
            if datetime_str:
                dt = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
                now = datetime.now(dt.tzinfo)
                diff = now - dt
                
                if diff.days > 0:
                    return f"{diff.days} day(s) ago"
                elif diff.seconds > 3600:
                    hours = diff.seconds // 3600
                    return f"{hours} hour(s) ago"
                elif diff.seconds > 60:
                    minutes = diff.seconds // 60
                    return f"{minutes} minute(s) ago"
                else:
                    return "Just now"
            return "Unknown"
        except Exception:
            return "Unknown"
    
    def _send_approval_notification(self, user_id: str, reference_code: str, credits: int):
        """Send payment approval notification to user"""
        try:
            # This would integrate with your WhatsApp service
            # For now, just log the notification
            logger.info(f"Payment approval notification sent to user {user_id}: "
                       f"Payment {reference_code} approved, {credits} credits added")
        except Exception as e:
            logger.error(f"Error sending approval notification: {e}")
    
    def _send_rejection_notification(self, user_id: str, reference_code: str, admin_notes: str):
        """Send payment rejection notification to user"""
        try:
            # This would integrate with your WhatsApp service
            # For now, just log the notification
            logger.info(f"Payment rejection notification sent to user {user_id}: "
                       f"Payment {reference_code} rejected. Notes: {admin_notes}")
        except Exception as e:
            logger.error(f"Error sending rejection notification: {e}")

# Create dashboard instance
payment_dashboard = PaymentAdminDashboard()

# Route handlers
@payment_admin_bp.route('/')
@login_required
def payment_dashboard_view():
    """Main payment dashboard view"""
    try:
        stats = payment_dashboard.get_payment_statistics()
        pending_payments = payment_dashboard.get_pending_payments()
        
        return render_template('admin/payment_dashboard.html', 
                             stats=stats, 
                             pending_payments=pending_payments)
    except Exception as e:
        logger.error(f"Error loading payment dashboard: {e}")
        flash('Error loading payment dashboard', 'error')
        return redirect(url_for('admin.dashboard'))

@payment_admin_bp.route('/pending')
@login_required
def pending_payments():
    """View pending payments"""
    try:
        pending_payments = payment_dashboard.get_pending_payments()
        return render_template('admin/pending_payments.html', 
                             payments=pending_payments)
    except Exception as e:
        logger.error(f"Error loading pending payments: {e}")
        flash('Error loading pending payments', 'error')
        return redirect(url_for('payment_admin.payment_dashboard_view'))

@payment_admin_bp.route('/approved')
@login_required
def approved_payments():
    """View approved payments"""
    try:
        approved_payments = payment_dashboard.get_approved_payments()
        return render_template('admin/approved_payments.html', 
                             payments=approved_payments)
    except Exception as e:
        logger.error(f"Error loading approved payments: {e}")
        flash('Error loading approved payments', 'error')
        return redirect(url_for('payment_admin.payment_dashboard_view'))

@payment_admin_bp.route('/rejected')
@login_required
def rejected_payments():
    """View rejected payments"""
    try:
        rejected_payments = payment_dashboard.get_rejected_payments()
        return render_template('admin/rejected_payments.html', 
                             payments=rejected_payments)
    except Exception as e:
        logger.error(f"Error loading rejected payments: {e}")
        flash('Error loading rejected payments', 'error')
        return redirect(url_for('payment_admin.payment_dashboard_view'))

@payment_admin_bp.route('/approve/<reference_code>', methods=['POST'])
@login_required
def approve_payment_route(reference_code: str):
    """Approve a payment via API"""
    try:
        admin_notes = request.form.get('admin_notes', '')
        result = payment_dashboard.approve_payment(reference_code, admin_notes)
        
        if result['success']:
            flash(f'Payment {reference_code} approved successfully!', 'success')
        else:
            flash(f'Failed to approve payment: {result["message"]}', 'error')
            
        return redirect(url_for('payment_admin.pending_payments'))
        
    except Exception as e:
        logger.error(f"Error approving payment {reference_code}: {e}")
        flash('Error approving payment', 'error')
        return redirect(url_for('payment_admin.pending_payments'))

@payment_admin_bp.route('/reject/<reference_code>', methods=['POST'])
@login_required
def reject_payment_route(reference_code: str):
    """Reject a payment via API"""
    try:
        admin_notes = request.form.get('admin_notes', '')
        result = payment_dashboard.reject_payment(reference_code, admin_notes)
        
        if result['success']:
            flash(f'Payment {reference_code} rejected successfully!', 'success')
        else:
            flash(f'Failed to reject payment: {result["message"]}', 'error')
            
        return redirect(url_for('payment_admin.pending_payments'))
        
    except Exception as e:
        logger.error(f"Error rejecting payment {reference_code}: {e}")
        flash('Error rejecting payment', 'error')
        return redirect(url_for('payment_admin.pending_payments'))

@payment_admin_bp.route('/api/stats')
@login_required
def payment_stats_api():
    """API endpoint for payment statistics"""
    try:
        stats = payment_dashboard.get_payment_statistics()
        return jsonify(stats)
    except Exception as e:
        logger.error(f"Error getting payment stats: {e}")
        return jsonify({'error': 'Failed to get payment statistics'}), 500

@payment_admin_bp.route('/api/pending')
@login_required
def pending_payments_api():
    """API endpoint for pending payments"""
    try:
        payments = payment_dashboard.get_pending_payments()
        return jsonify(payments)
    except Exception as e:
        logger.error(f"Error getting pending payments: {e}")
        return jsonify({'error': 'Failed to get pending payments'}), 500

@payment_admin_bp.route('/api/approved')
@login_required
def approved_payments_api():
    """API endpoint for approved payments"""
    try:
        payments = payment_dashboard.get_approved_payments()
        return jsonify(payments)
    except Exception as e:
        logger.error(f"Error getting approved payments: {e}")
        return jsonify({'error': 'Failed to get approved payments'}), 500

@payment_admin_bp.route('/api/rejected')
@login_required
def rejected_payments_api():
    """API endpoint for rejected payments"""
    try:
        payments = payment_dashboard.get_rejected_payments()
        return jsonify(payments)
    except Exception as e:
        logger.error(f"Error getting rejected payments: {e}")
        return jsonify({'error': 'Failed to get rejected payments'}), 500
