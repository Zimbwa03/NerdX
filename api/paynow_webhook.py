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

@paynow_webhook_bp.route('/webhook/paynow/result', methods=['POST'])
def paynow_webhook():
    """
    Handle Paynow webhook notifications
    
    This endpoint receives real-time payment status updates from Paynow
    and automatically processes successful payments by adding credits
    """
    try:
        # Get webhook data from Paynow
        webhook_data = request.form.to_dict()
        
        if not webhook_data:
            logger.warning("Empty webhook data received from Paynow")
            return jsonify({'status': 'error', 'message': 'No data received'}), 400
        
        logger.info(f"🔔 Paynow webhook received: {webhook_data.get('reference', 'unknown')}")
        
        # Process webhook through payment service
        result = payment_service.process_paynow_webhook(webhook_data)
        
        if result['success']:
            if result.get('approved'):
                logger.info(f"✅ Payment automatically approved: {result['reference_code']}")
            else:
                logger.info(f"📊 Payment status updated: {result.get('status', 'unknown')}")
            
            # Always return success to Paynow (prevent retries)
            return jsonify({
                'status': 'success',
                'message': 'Webhook processed successfully'
            }), 200
        else:
            logger.error(f"❌ Webhook processing failed: {result.get('message', 'Unknown error')}")
            # Still return success to prevent Paynow retries
            return jsonify({
                'status': 'received',
                'message': 'Webhook received but could not be processed'
            }), 200
            
    except Exception as e:
        logger.error(f"🚨 Paynow webhook error: {e}")
        # Return success to prevent Paynow retries
        return jsonify({
            'status': 'error', 
            'message': 'Webhook processing error'
        }), 200

@paynow_webhook_bp.route('/webhook/paynow/return', methods=['GET'])
def paynow_return():
    """
    Handle Paynow return URL (customer redirect after payment)
    
    This is where customers are redirected after completing payment on Paynow
    """
    try:
        # Get return parameters
        reference = request.args.get('reference', '')
        status = request.args.get('status', 'unknown')
        
        logger.info(f"🔄 Paynow return: {reference} - {status}")
        
        if reference:
            # Check payment status
            payment_status = payment_service.check_paynow_payment_status(reference)
            
            if payment_status['success'] and payment_status.get('paid'):
                return f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Payment Successful - NerdX</title>
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
                        h1 {{ color: #28a745; }}
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
                        <p><strong>Your payment has been confirmed and credits have been added to your NerdX account.</strong></p>
                        <div class="reference">Reference: {reference}</div>
                        <p>You can now return to WhatsApp to continue your learning journey!</p>
                        <p>💬 <em>Message our bot on WhatsApp to start using your credits.</em></p>
                    </div>
                </body>
                </html>
                """
            else:
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