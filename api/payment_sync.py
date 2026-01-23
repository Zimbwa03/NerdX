"""
Payment Sync Endpoint
====================
Manual endpoint to sync and approve pending Paynow payments
This fixes the issue where webhooks fail but payments are actually successful
"""

import logging
from flask import Blueprint, request, jsonify
from services.payment_service import PaymentService
from services.paynow_service import PaynowService
from database.external_db import make_supabase_request

logger = logging.getLogger(__name__)

payment_sync_bp = Blueprint('payment_sync', __name__)

@payment_sync_bp.route('/api/payment/sync/<reference_code>', methods=['POST'])
def sync_payment(reference_code):
    """
    Manually sync and approve a Paynow payment
    
    This endpoint:
    1. Checks the payment status with Paynow
    2. If paid, automatically approves and adds credits
    3. Returns the updated status
    
    Can also force approve if payment was confirmed successful but stuck in pending
    """
    try:
        payment_service = PaymentService()
        paynow_service = PaynowService()
        
        # Get request data
        request_data = request.json if request.is_json else {}
        force_approve = request_data.get('force_approve', False)
        
        logger.info(f"🔄 Manual payment sync requested for: {reference_code} (force_approve={force_approve})")
        
        # Get payment from database
        payment_result = make_supabase_request(
            "GET",
            "payment_transactions",
            filters={"reference_code": f"eq.{reference_code}"},
            use_service_role=True
        )
        
        if not payment_result or len(payment_result) == 0:
            return jsonify({
                'success': False,
                'message': 'Payment not found'
            }), 404
        
        payment = payment_result[0]
        current_status = payment.get('status', 'pending')
        
        # If already approved, return current status
        if current_status in ['approved', 'paid', 'completed']:
            return jsonify({
                'success': True,
                'message': 'Payment already approved',
                'status': current_status,
                'reference_code': reference_code
            }), 200
        
        # Check if we have poll_url to query Paynow
        poll_url = payment.get('poll_url')
        paynow_reference = payment.get('paynow_reference')
        
        if poll_url and paynow_service.is_available():
            # Check status with Paynow
            paynow_status = paynow_service.check_payment_status(poll_url)
            
            if paynow_status['success'] and paynow_status.get('paid'):
                # Payment is confirmed - approve it
                approval_result = payment_service.approve_paynow_payment(reference_code)
                
                if approval_result['success']:
                    logger.info(f"✅ Payment {reference_code} approved via manual sync")
                    return jsonify({
                        'success': True,
                        'message': 'Payment confirmed and credits added!',
                        'status': 'approved',
                        'reference_code': reference_code,
                        'credits_added': approval_result.get('credits_added', 0)
                    }), 200
                else:
                    return jsonify({
                        'success': False,
                        'message': f"Payment confirmed but approval failed: {approval_result.get('message', 'Unknown error')}",
                        'status': 'paid',
                        'reference_code': reference_code
                    }), 500
            else:
                # Payment not yet paid according to Paynow
                return jsonify({
                    'success': True,
                    'message': 'Payment status checked',
                    'status': paynow_status.get('status', 'pending'),
                    'paid': False,
                    'reference_code': reference_code
                }), 200
        elif paynow_reference:
            # We have Paynow reference but no poll_url
            # If force_approve is true, approve directly (user confirmed payment was successful)
            if force_approve:
                logger.info(f"🔧 Force approving payment {reference_code} (user confirmed payment successful)")
                approval_result = payment_service.approve_paynow_payment(reference_code)
                
                if approval_result['success']:
                    logger.info(f"✅ Payment {reference_code} force-approved successfully")
                    return jsonify({
                        'success': True,
                        'message': 'Payment approved and credits added!',
                        'status': 'approved',
                        'reference_code': reference_code,
                        'credits_added': approval_result.get('credits_added', 0),
                        'user_id': approval_result.get('user_id')
                    }), 200
                else:
                    logger.error(f"❌ Force approval failed for {reference_code}: {approval_result.get('message')}")
                    return jsonify({
                        'success': False,
                        'message': f"Approval failed: {approval_result.get('message', 'Unknown error')}",
                        'reference_code': reference_code
                    }), 500
            else:
                # Suggest using force_approve if payment was confirmed successful
                return jsonify({
                    'success': False,
                    'message': 'Cannot check Paynow status without poll_url. If payment was successful, use force_approve=true',
                    'status': current_status,
                    'reference_code': reference_code,
                    'paynow_reference': paynow_reference,
                    'hint': 'Send POST with {"force_approve": true} if payment was confirmed successful'
                }), 400
        else:
            return jsonify({
                'success': False,
                'message': 'Payment has no Paynow reference or poll URL',
                'status': current_status,
                'reference_code': reference_code
            }), 400
            
    except Exception as e:
        logger.error(f"Error syncing payment {reference_code}: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'message': f'Error syncing payment: {str(e)}'
        }), 500

@payment_sync_bp.route('/api/payment/sync-all-pending', methods=['POST'])
def sync_all_pending():
    """
    Sync all pending Paynow payments
    Admin/Internal use only
    """
    try:
        payment_service = PaymentService()
        paynow_service = PaynowService()
        
        # Get all pending Paynow payments
        pending_payments = make_supabase_request(
            'GET',
            'payment_transactions',
            select='id,reference_code,paynow_reference,poll_url,status,created_at',
            filters={
                'status': 'eq.pending',
                'payment_method': 'eq.paynow_ecocash'
            },
            limit=50,
            use_service_role=True
        )
        
        if not pending_payments:
            return jsonify({
                'success': True,
                'message': 'No pending payments found',
                'synced': 0,
                'approved': 0
            }), 200
        
        synced_count = 0
        approved_count = 0
        errors = []
        
        for payment in pending_payments:
            reference_code = payment.get('reference_code')
            poll_url = payment.get('poll_url')
            
            try:
                if poll_url and paynow_service.is_available():
                    # Check status with Paynow
                    paynow_status = paynow_service.check_payment_status(poll_url)
                    
                    if paynow_status['success'] and paynow_status.get('paid'):
                        # Approve the payment
                        approval_result = payment_service.approve_paynow_payment(reference_code)
                        if approval_result['success']:
                            approved_count += 1
                        else:
                            errors.append(f"{reference_code}: {approval_result.get('message', 'Approval failed')}")
                    synced_count += 1
            except Exception as e:
                errors.append(f"{reference_code}: {str(e)}")
        
        return jsonify({
            'success': True,
            'message': f'Synced {synced_count} payment(s)',
            'synced': synced_count,
            'approved': approved_count,
            'errors': errors if errors else None
        }), 200
        
    except Exception as e:
        logger.error(f"Error syncing all pending payments: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500
