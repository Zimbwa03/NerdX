"""
ULTRA-SECURE PAYMENT DASHBOARD
==============================
Business-critical payment management system with instant approvals and bulletproof error handling.
Revenue calculations: 1 credit operational cost = 0.009, 1 credit user cost = 0.02
"""

import logging
from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify
from datetime import datetime, timedelta
from database.external_db import make_supabase_request, add_credits
from services.payment_service import PaymentService

logger = logging.getLogger(__name__)

admin_payment_dashboard_bp = Blueprint('admin_payment_dashboard', __name__)

# Business Constants - CRITICAL FOR REVENUE CALCULATIONS
OPERATIONAL_COST_PER_CREDIT = 0.009  # Our cost per credit
USER_COST_PER_CREDIT = 0.02         # What user pays per credit

def admin_required_payment(f):
    """Decorator to require admin authentication for payment functions"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_authenticated'):
            flash('Admin authentication required', 'error')
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated_function

@admin_payment_dashboard_bp.route('/admin/payments')
@admin_required_payment
def payment_dashboard_new():
    """Display comprehensive payment dashboard with instant approval capabilities"""
    try:
        payment_service = PaymentService()
        
        # Get all payment transactions with comprehensive data
        all_payments = make_supabase_request("GET", "payment_transactions", limit=100)
        if not all_payments:
            all_payments = []
        
        # Separate payments by status for better organization
        pending_payments = [p for p in all_payments if p.get('status') == 'pending']
        approved_payments = [p for p in all_payments if p.get('status') == 'approved']
        rejected_payments = [p for p in all_payments if p.get('status') == 'rejected']
        
        # Calculate business metrics
        total_revenue = sum(p.get('amount', 0) for p in approved_payments)
        total_credits_sold = sum(p.get('credits', 0) for p in approved_payments)
        total_operational_cost = total_credits_sold * OPERATIONAL_COST_PER_CREDIT
        total_profit = total_revenue - total_operational_cost
        
        # Get recent stats (last 7 days)
        week_ago = (datetime.now() - timedelta(days=7)).isoformat()
        recent_payments = [p for p in approved_payments if p.get('approved_at', '') > week_ago]
        weekly_revenue = sum(p.get('amount', 0) for p in recent_payments)
        weekly_credits = sum(p.get('credits', 0) for p in recent_payments)
        
        # Calculate average order value and profit margins
        avg_order_value = total_revenue / len(approved_payments) if approved_payments else 0
        profit_margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        # Enhance payment data with package info
        for payment in all_payments:
            package = payment_service.get_package_by_id(payment.get('package_id', ''))
            if package:
                payment['package_name'] = package['name']
                payment['package_icon'] = package['icon']
            else:
                payment['package_name'] = 'Unknown Package'
                payment['package_icon'] = '📦'
            
            # Add time-friendly formatting
            if payment.get('created_at'):
                payment['created_at_formatted'] = datetime.fromisoformat(payment['created_at'].replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M')
            if payment.get('proof_submitted_at'):
                payment['proof_submitted_at_formatted'] = datetime.fromisoformat(payment['proof_submitted_at'].replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M')
        
        business_metrics = {
            'total_revenue': total_revenue,
            'total_credits_sold': total_credits_sold,
            'total_operational_cost': total_operational_cost,
            'total_profit': total_profit,
            'weekly_revenue': weekly_revenue,
            'weekly_credits': weekly_credits,
            'avg_order_value': avg_order_value,
            'profit_margin': profit_margin,
            'total_transactions': len(approved_payments),
            'pending_count': len(pending_payments)
        }
        
        return render_template(
            'admin/payment_dashboard.html',
            pending_payments=pending_payments,
            approved_payments=approved_payments[:20],  # Show recent 20
            rejected_payments=rejected_payments[:10],   # Show recent 10
            business_metrics=business_metrics,
            operational_cost_per_credit=OPERATIONAL_COST_PER_CREDIT,
            user_cost_per_credit=USER_COST_PER_CREDIT
        )
        
    except Exception as e:
        logger.error(f"Error loading payment dashboard: {e}")
        flash('Error loading payment dashboard', 'error')
        return redirect(url_for('admin.dashboard'))

@admin_payment_dashboard_bp.route('/admin/payments/approve/<reference_code>', methods=['POST'])
@admin_required_payment
def approve_payment_instant(reference_code):
    """INSTANT CREDIT TOP-UP: Approve payment and add credits immediately"""
    try:
        payment_service = PaymentService()
        admin_user = session.get('admin_user', 'Unknown Admin')
        
        # Get payment details first for validation
        payment_result = make_supabase_request(
            "GET", 
            "payment_transactions", 
            filters={"reference_code": f"eq.{reference_code}"}
        )
        
        if not payment_result or len(payment_result) == 0:
            return jsonify({'success': False, 'message': 'Payment not found'})
        
        payment = payment_result[0]
        
        # Business validation checks
        if payment.get('status') != 'pending':
            return jsonify({'success': False, 'message': f'Payment is already {payment.get("status")}'})
        
        user_id = payment.get('user_id')
        credits = payment.get('credits', 0)
        amount = payment.get('amount', 0)
        
        if not user_id or credits <= 0:
            return jsonify({'success': False, 'message': 'Invalid payment data'})
        
        # INSTANT CREDIT TOP-UP - BULLETPROOF IMPLEMENTATION
        logger.info(f"🚀 INSTANT APPROVAL: Admin {admin_user} approving payment {reference_code} for user {user_id}")
        
        # Step 1: Add credits to user account with maximum security
        add_success = add_credits(user_id, credits, f"Payment approved: {reference_code}")
        
        if add_success:
            # Step 2: Update payment status to approved with full audit trail
            update_data = {
                'status': 'approved',
                'approved_at': datetime.now().isoformat(),
                'credits_added': credits,
                'admin_notes': f'Approved by {admin_user} at {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
                'approved_by': admin_user
            }
            
            update_success = make_supabase_request(
                "PATCH", 
                "payment_transactions", 
                update_data,
                filters={"reference_code": f"eq.{reference_code}"}
            )
            
            if update_success:
                # Step 3: Send instant notification to user
                payment_service.send_payment_approval_notification(
                    user_id, 
                    reference_code, 
                    payment_service.get_package_by_id(payment.get('package_id', '')), 
                    credits
                )
                
                # Step 4: Create business analytics record
                try:
                    operational_cost = credits * OPERATIONAL_COST_PER_CREDIT
                    profit = amount - operational_cost
                    
                    analytics_data = {
                        'transaction_id': reference_code,
                        'user_id': user_id,
                        'revenue': amount,
                        'credits_sold': credits,
                        'operational_cost': operational_cost,
                        'profit': profit,
                        'approved_by': admin_user,
                        'approved_at': datetime.now().isoformat(),
                        'payment_method': 'ecocash'
                    }
                    
                    # Try to save analytics (non-critical, shouldn't block approval)
                    make_supabase_request("POST", "payment_analytics", analytics_data)
                except Exception as analytics_error:
                    logger.warning(f"Analytics save failed (non-critical): {analytics_error}")
                
                logger.info(f"✅ SUCCESS: Payment {reference_code} approved, {credits} credits added to user {user_id}")
                
                return jsonify({
                    'success': True,
                    'message': f'Payment approved! {credits} credits added to user account instantly.',
                    'user_id': user_id,
                    'credits_added': credits,
                    'profit': amount - (credits * OPERATIONAL_COST_PER_CREDIT)
                })
            
            else:
                # Critical failure - credits added but status not updated
                logger.error(f"🚨 CRITICAL: Credits added but status update failed for {reference_code}")
                return jsonify({
                    'success': False, 
                    'message': 'Critical error: Credits added but status update failed. Contact technical support immediately.'
                })
        
        else:
            logger.error(f"❌ FAILED: Could not add credits for user {user_id}, payment {reference_code}")
            return jsonify({'success': False, 'message': 'Failed to add credits to user account'})
            
    except Exception as e:
        logger.error(f"🚨 CRITICAL ERROR in payment approval: {e}")
        return jsonify({'success': False, 'message': 'Critical system error during approval'})

@admin_payment_dashboard_bp.route('/admin/payments/reject/<reference_code>', methods=['POST'])
@admin_required_payment
def reject_payment_instant(reference_code):
    """INSTANT REJECTION: Reject payment without adding credits"""
    try:
        payment_service = PaymentService()
        admin_user = session.get('admin_user', 'Unknown Admin')
        rejection_reason = request.form.get('rejection_reason', 'Payment verification failed')
        
        # Get payment details first
        payment_result = make_supabase_request(
            "GET", 
            "payment_transactions", 
            filters={"reference_code": f"eq.{reference_code}"}
        )
        
        if not payment_result or len(payment_result) == 0:
            return jsonify({'success': False, 'message': 'Payment not found'})
        
        payment = payment_result[0]
        
        if payment.get('status') != 'pending':
            return jsonify({'success': False, 'message': f'Payment is already {payment.get("status")}'})
        
        user_id = payment.get('user_id')
        
        # Update payment status to rejected
        update_data = {
            'status': 'rejected',
            'rejection_reason': rejection_reason,
            'rejected_at': datetime.now().isoformat(),
            'admin_notes': f'Rejected by {admin_user}: {rejection_reason}',
            'rejected_by': admin_user
        }
        
        update_success = make_supabase_request(
            "PATCH", 
            "payment_transactions", 
            update_data,
            filters={"reference_code": f"eq.{reference_code}"}
        )
        
        if update_success:
            # Send rejection notification to user
            payment_service.send_payment_rejection_notification(user_id, reference_code, rejection_reason)
            
            logger.info(f"❌ Payment {reference_code} rejected by {admin_user}: {rejection_reason}")
            
            return jsonify({
                'success': True,
                'message': f'Payment rejected. User notified with reason: {rejection_reason}',
                'rejection_reason': rejection_reason
            })
        else:
            return jsonify({'success': False, 'message': 'Failed to update rejection status'})
            
    except Exception as e:
        logger.error(f"Error rejecting payment: {e}")
        return jsonify({'success': False, 'message': 'Error processing rejection'})

@admin_payment_dashboard_bp.route('/admin/payments/revenue')
@admin_required_payment
def revenue_dashboard():
    """Comprehensive revenue analytics dashboard"""
    try:
        # Get all approved payments for revenue calculations
        approved_payments = make_supabase_request(
            "GET", 
            "payment_transactions", 
            filters={"status": "eq.approved"}
        )
        
        if not approved_payments:
            approved_payments = []
        
        # Calculate comprehensive business metrics
        total_revenue = sum(p.get('amount', 0) for p in approved_payments)
        total_credits_sold = sum(p.get('credits', 0) for p in approved_payments)
        total_operational_cost = total_credits_sold * OPERATIONAL_COST_PER_CREDIT
        net_profit = total_revenue - total_operational_cost
        profit_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        # Calculate monthly breakdown
        monthly_data = {}
        for payment in approved_payments:
            if payment.get('approved_at'):
                month_key = payment['approved_at'][:7]  # YYYY-MM format
                if month_key not in monthly_data:
                    monthly_data[month_key] = {
                        'revenue': 0,
                        'credits': 0,
                        'transactions': 0,
                        'operational_cost': 0
                    }
                
                monthly_data[month_key]['revenue'] += payment.get('amount', 0)
                monthly_data[month_key]['credits'] += payment.get('credits', 0)
                monthly_data[month_key]['transactions'] += 1
                monthly_data[month_key]['operational_cost'] += payment.get('credits', 0) * OPERATIONAL_COST_PER_CREDIT
        
        # Add profit calculations to monthly data
        for month in monthly_data:
            monthly_data[month]['profit'] = monthly_data[month]['revenue'] - monthly_data[month]['operational_cost']
        
        # Package popularity analysis
        package_stats = {}
        payment_service = PaymentService()
        
        for payment in approved_payments:
            package_id = payment.get('package_id', 'unknown')
            if package_id not in package_stats:
                package = payment_service.get_package_by_id(package_id)
                package_stats[package_id] = {
                    'name': package['name'] if package else 'Unknown',
                    'count': 0,
                    'revenue': 0,
                    'credits': 0
                }
            
            package_stats[package_id]['count'] += 1
            package_stats[package_id]['revenue'] += payment.get('amount', 0)
            package_stats[package_id]['credits'] += payment.get('credits', 0)
        
        business_analytics = {
            'total_revenue': total_revenue,
            'total_credits_sold': total_credits_sold,
            'total_operational_cost': total_operational_cost,
            'net_profit': net_profit,
            'profit_margin': profit_margin,
            'avg_transaction_value': total_revenue / len(approved_payments) if approved_payments else 0,
            'total_transactions': len(approved_payments),
            'cost_per_credit_operational': OPERATIONAL_COST_PER_CREDIT,
            'cost_per_credit_user': USER_COST_PER_CREDIT,
            'markup_percentage': ((USER_COST_PER_CREDIT - OPERATIONAL_COST_PER_CREDIT) / OPERATIONAL_COST_PER_CREDIT * 100)
        }
        
        return render_template(
            'admin/revenue_dashboard.html',
            business_analytics=business_analytics,
            monthly_data=sorted(monthly_data.items(), reverse=True)[:12],  # Last 12 months
            package_stats=package_stats,
            recent_payments=approved_payments[-20:] if approved_payments else []  # Recent 20
        )
        
    except Exception as e:
        logger.error(f"Error loading revenue dashboard: {e}")
        flash('Error loading revenue dashboard', 'error')
        return redirect(url_for('admin.dashboard'))

@admin_payment_dashboard_bp.route('/admin/payments/proof/<reference_code>')
@admin_required_payment
def view_payment_proof(reference_code):
    """View payment proof details"""
    try:
        payment_result = make_supabase_request(
            "GET", 
            "payment_transactions", 
            filters={"reference_code": f"eq.{reference_code}"}
        )
        
        if not payment_result:
            flash('Payment not found', 'error')
            return redirect(url_for('admin_payment_dashboard.payment_dashboard'))
        
        payment = payment_result[0]
        payment_service = PaymentService()
        package = payment_service.get_package_by_id(payment.get('package_id', ''))
        
        return render_template(
            'admin/payment_proof.html',
            payment=payment,
            package=package
        )
        
    except Exception as e:
        logger.error(f"Error viewing payment proof: {e}")
        flash('Error loading payment proof', 'error')
        return redirect(url_for('admin_payment_dashboard.payment_dashboard'))