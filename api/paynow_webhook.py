"""
PAYNOW WEBHOOK HANDLER
====================
Handles Paynow payment webhook notifications for real-time payment confirmations
"""

import logging
from flask import Blueprint, request, jsonify
from services.payment_service import payment_service

logger = logging.getLogger(__name__)

# Create Paynow webhook blueprint
paynow_webhook_bp = Blueprint('paynow_webhook', __name__)

@paynow_webhook_bp.route('/webhook/paynow/result', methods=['POST', 'GET'])
def paynow_webhook():
    """
    Handle Paynow result URL notifications
    
    NOTE: According to Paynow documentation, the result_url is called by Paynow
    to notify of payment status changes. This acts as the webhook endpoint.
    
    Paynow sends payment status updates to this URL automatically.
    """
    try:
        # Paynow can send GET or POST - handle both
        if request.method == 'POST':
            webhook_data = request.form.to_dict()
        else:
            webhook_data = request.args.to_dict()
        
        if not webhook_data:
            logger.warning("Empty result data received from Paynow")
            return jsonify({'status': 'error', 'message': 'No data received'}), 400
        
        reference = webhook_data.get('reference', 'unknown')
        status = webhook_data.get('status', 'unknown')
        
        logger.info(f"🔔 Paynow result URL called: reference={reference}, status={status}")
        logger.info(f"📋 Full data: {webhook_data}")
        
        # Process result through payment service
        result = payment_service.process_paynow_webhook(webhook_data)
        
        if result['success']:
            if result.get('approved'):
                logger.info(f"✅ Payment automatically approved via result URL: {result['reference_code']}")
            else:
                logger.info(f"📊 Payment status updated via result URL: {result.get('status', 'unknown')}")
            
            # Always return success to Paynow (prevent retries)
            # Paynow expects a simple response
            return "OK", 200
        else:
            logger.error(f"❌ Result URL processing failed: {result.get('message', 'Unknown error')}")
            # Still return success to prevent Paynow retries
            return "OK", 200
            
    except Exception as e:
        logger.error(f"🚨 Paynow result URL error: {e}", exc_info=True)
        # Return success to prevent Paynow retries
        return "OK", 200

@paynow_webhook_bp.route('/webhook/paynow/return', methods=['GET', 'POST'])
def paynow_return():
    """
    Handle Paynow return URL (customer redirect after payment)
    
    This is where customers are redirected after completing payment on Paynow
    """
    try:
        # Paynow can send GET or POST for return URL
        if request.method == 'POST':
            reference = request.form.get('reference', '')
            status = request.form.get('status', 'unknown')
        else:
            reference = request.args.get('reference', '')
            status = request.args.get('status', 'unknown')
        
        logger.info(f"🔄 Paynow return URL called: reference={reference}, status={status}")
        logger.info(f"📋 Request method: {request.method}, Form data: {dict(request.form) if request.method == 'POST' else dict(request.args)}")
        
        if reference:
            # Paynow sends payment status in the return URL
            # Check all possible status values that indicate success
            status_upper = status.upper() if status else ''
            
            # IMPORTANT: Paynow uses return URL to notify of payment status
            # If status indicates payment was successful, approve immediately
            if status_upper in ['PAID', 'SUCCESS', 'SUCCESSFUL', 'OK', 'COMPLETED']:
                logger.info(f"✅ Payment confirmed via return URL: {reference} - Status: {status}")
                
                # Try to approve the payment immediately
                approval_result = payment_service.approve_paynow_payment(reference)
                
                if approval_result['success']:
                    logger.info(f"✅ Payment {reference} approved via return URL - {approval_result.get('credits_added', 0)} credits added")
                    
                    # Show success page with credits info
                    credits_added = approval_result.get('credits_added', 0)
                    return f"""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Payment Successful - NerdX</title>
                        <meta http-equiv="refresh" content="5;url=https://wa.me/2635494594">
                        <style>
                            body {{ 
                                font-family: Arial, sans-serif; 
                                text-align: center; 
                                padding: 50px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                            }}
                            .success-box {{ 
                                background: white; 
                                color: #333; 
                                padding: 40px; 
                                border-radius: 15px; 
                                max-width: 500px; 
                                margin: 0 auto;
                                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                            }}
                            h1 {{ color: #28a745; font-size: 32px; }}
                            .credits {{ 
                                background: #d4edda; 
                                color: #155724; 
                                padding: 15px; 
                                border-radius: 8px; 
                                margin: 20px 0;
                                font-size: 18px;
                                font-weight: bold;
                            }}
                            .reference {{ 
                                background: #f8f9fa; 
                                padding: 10px; 
                                border-radius: 5px; 
                                margin: 20px 0;
                                font-family: monospace;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class="success-box">
                            <h1>🎉 Payment Successful!</h1>
                            <p><strong>Your payment has been confirmed!</strong></p>
                            <div class="credits">💎 {credits_added} Credits Added to Your Account</div>
                            <div class="reference">Reference: {reference}</div>
                            <p>✅ Credits are now available in your NerdX account.</p>
                            <p>You can now return to WhatsApp to continue your learning journey!</p>
                            <p>💬 <em>Redirecting to WhatsApp in 5 seconds...</em></p>
                        </div>
                    </body>
                    </html>
                    """
                else:
                    logger.error(f"❌ Failed to approve payment {reference} via return URL: {approval_result.get('message')}")
                    # Still show success page but mention manual review
                    return f"""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Payment Received - NerdX</title>
                        <style>
                            body {{ 
                                font-family: Arial, sans-serif; 
                                text-align: center; 
                                padding: 50px;
                                background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                                color: #333;
                            }}
                            .info-box {{ 
                                background: white; 
                                padding: 40px; 
                                border-radius: 15px; 
                                max-width: 500px; 
                                margin: 0 auto;
                                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                            }}
                            h1 {{ color: #ffc107; }}
                        </style>
                    </head>
                    <body>
                        <div class="info-box">
                            <h1>⏳ Payment Processing</h1>
                            <p><strong>Your payment has been received and is being processed.</strong></p>
                            <div class="reference">Reference: {reference}</div>
                            <p>Credits will be added to your account shortly. Please check WhatsApp for confirmation.</p>
                            <p>💬 <em>Return to WhatsApp to check your balance.</em></p>
                        </div>
                    </body>
                    </html>
                    """
            
            # If status is not clearly successful, check with Paynow API using poll_url
            # This is a fallback to verify payment status
            logger.info(f"🔍 Status '{status}' not clearly successful, checking with Paynow API...")
            payment_status = payment_service.check_paynow_payment_status(reference)
            
            if payment_status['success'] and payment_status.get('paid'):
                # Payment confirmed via API check - approve it
                logger.info(f"✅ Payment {reference} confirmed via API check - approving...")
                approval_result = payment_service.approve_paynow_payment(reference)
                
                if approval_result['success']:
                    credits_added = approval_result.get('credits_added', 0)
                    return f"""
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Payment Successful - NerdX</title>
                        <meta http-equiv="refresh" content="5;url=https://wa.me/2635494594">
                        <style>
                            body {{ 
                                font-family: Arial, sans-serif; 
                                text-align: center; 
                                padding: 50px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                            }}
                            .success-box {{ 
                                background: white; 
                                color: #333; 
                                padding: 40px; 
                                border-radius: 15px; 
                                max-width: 500px; 
                                margin: 0 auto;
                                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                            }}
                            h1 {{ color: #28a745; font-size: 32px; }}
                            .credits {{ 
                                background: #d4edda; 
                                color: #155724; 
                                padding: 15px; 
                                border-radius: 8px; 
                                margin: 20px 0;
                                font-size: 18px;
                                font-weight: bold;
                            }}
                            .reference {{ 
                                background: #f8f9fa; 
                                padding: 10px; 
                                border-radius: 5px; 
                                margin: 20px 0;
                                font-family: monospace;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class="success-box">
                            <h1>🎉 Payment Successful!</h1>
                            <p><strong>Your payment has been confirmed!</strong></p>
                            <div class="credits">💎 {credits_added} Credits Added to Your Account</div>
                            <div class="reference">Reference: {reference}</div>
                            <p>✅ Credits are now available in your NerdX account.</p>
                            <p>You can now return to WhatsApp to continue your learning journey!</p>
                            <p>💬 <em>Redirecting to WhatsApp in 5 seconds...</em></p>
                        </div>
                    </body>
                    </html>
                    """
            
            # Payment status unclear or not yet paid
            logger.info(f"⏳ Payment {reference} status: {payment_status.get('status', 'unknown')} - not yet confirmed")
            return f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Processing - NerdX</title>
                <style>
                    body {{ 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 50px;
                        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                        color: #333;
                    }}
                    .processing-box {{ 
                        background: white; 
                        padding: 40px; 
                        border-radius: 15px; 
                        max-width: 500px; 
                        margin: 0 auto;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    }}
                    h1 {{ color: #ffc107; }}
                    .reference {{ 
                        background: #f8f9fa; 
                        padding: 10px; 
                        border-radius: 5px; 
                        margin: 20px 0;
                        font-family: monospace;
                    }}
                </style>
            </head>
            <body>
                <div class="processing-box">
                    <h1>⏳ Payment Processing</h1>
                    <p><strong>Your payment is being processed. This may take a few minutes.</strong></p>
                    <div class="reference">Reference: {reference}</div>
                    <p>Status: {status}</p>
                    <p>We'll notify you on WhatsApp once your credits are added!</p>
                    <p>💬 <em>Check back with our bot in a few minutes.</em></p>
                </div>
            </body>
            </html>
            """
        else:
            return f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Status - NerdX</title>
                <style>
                    body {{ 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 50px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }}
                    .info-box {{ 
                        background: white; 
                        color: #333; 
                        padding: 40px; 
                        border-radius: 15px; 
                        max-width: 500px; 
                        margin: 0 auto;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    }}
                </style>
            </head>
            <body>
                <div class="info-box">
                    <h1>🏠 Welcome to NerdX Payments</h1>
                    <p>Return to WhatsApp to continue with your payment or start learning!</p>
                    <p>💬 <em>Message our bot to get started.</em></p>
                </div>
            </body>
            </html>
            """
            
    except Exception as e:
        logger.error(f"🚨 Paynow return handler error: {e}")
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Error - NerdX</title>
            <style>
                body {{ 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 50px;
                    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
                    color: #333;
                }}
                .error-box {{ 
                    background: white; 
                    padding: 40px; 
                    border-radius: 15px; 
                    max-width: 500px; 
                    margin: 0 auto;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }}
                h1 {{ color: #dc3545; }}
            </style>
        </head>
        <body>
            <div class="error-box">
                <h1>⚠️ Error</h1>
                <p>There was an error processing your request. Please contact support or try again.</p>
                <p>💬 <em>Message our WhatsApp bot for assistance.</em></p>
            </div>
        </body>
        </html>
        """

@paynow_webhook_bp.route('/webhook/paynow/status/<reference_code>', methods=['GET'])
def check_paynow_status(reference_code):
    """
    Manual status check endpoint for Paynow payments
    
    Args:
        reference_code: Payment reference code
        
    Returns:
        JSON with payment status
    """
    try:
        logger.info(f"📊 Manual Paynow status check: {reference_code}")
        
        result = payment_service.check_paynow_payment_status(reference_code)
        
        return jsonify({
            'success': result['success'],
            'reference_code': reference_code,
            'status': result.get('status', 'unknown'),
            'paid': result.get('paid', False),
            'amount': result.get('amount', 0),
            'credits': result.get('credits', 0),
            'message': result.get('message', 'Status check completed')
        }), 200
        
    except Exception as e:
        logger.error(f"🚨 Status check error: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Status check failed'
        }), 500