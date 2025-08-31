"""
PAYNOW USD ECOCASH INTEGRATION SERVICE
====================================
Comprehensive Paynow payment service for Zimbabwe USD EcoCash transactions
Handles payment initiation, status checking, and webhook processing
"""

import os
import logging
from typing import Dict, Optional, Tuple
from paynow import Paynow
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

class PaynowService:
    """
    Complete Paynow integration service for USD EcoCash payments
    Features:
    - USD EcoCash transaction support
    - Real-time payment status updates
    - Webhook handling for payment confirmations
    - Test mode support with simulation numbers
    """
    
    def __init__(self):
        """Initialize Paynow service with credentials"""
        # Get Paynow credentials from environment
        self.integration_id = os.environ.get('PAYNOW_INTEGRATION_ID')
        self.integration_key = os.environ.get('PAYNOW_INTEGRATION_KEY')
        
        # URLs for webhook and return handling
        self.result_url = os.environ.get('PAYNOW_RESULT_URL', 'https://your-domain.com/webhook/paynow/result')
        self.return_url = os.environ.get('PAYNOW_RETURN_URL', 'https://your-domain.com/payment/return')
        
        # Test mode configuration
        self.test_mode = os.environ.get('PAYNOW_TEST_MODE', 'true').lower() == 'true'
        
        # Initialize Paynow client
        if self.integration_id and self.integration_key:
            self.paynow_client = Paynow(
                self.integration_id,
                self.integration_key,
                self.result_url,
                self.return_url
            )
            logger.info("✅ Paynow service initialized successfully")
        else:
            self.paynow_client = None
            logger.warning("⚠️ Paynow credentials not configured - using fallback mode")
    
    def is_available(self) -> bool:
        """Check if Paynow service is properly configured"""
        return self.paynow_client is not None
    
    def create_usd_ecocash_payment(self, 
                                   amount: float,
                                   phone_number: str, 
                                   email: str,
                                   reference: str,
                                   description: str = "NerdX Credit Purchase") -> Dict:
        """
        Create USD EcoCash payment transaction
        
        Args:
            amount: Payment amount in USD
            phone_number: Customer EcoCash number (e.g., 0771234567)
            email: Customer email address (required for mobile payments)
            reference: Unique payment reference
            description: Payment description
            
        Returns:
            Dict with payment status and transaction details
        """
        try:
            if not self.is_available():
                return {
                    'success': False,
                    'error': 'Paynow service not available',
                    'message': 'Payment service temporarily unavailable'
                }
            
            # Validate phone number format
            if not self._is_valid_phone_number(phone_number):
                return {
                    'success': False,
                    'error': 'Invalid phone number',
                    'message': 'Please provide a valid EcoCash number (e.g., 0771234567)'
                }
            
            # Create payment object
            payment = self.paynow_client.create_payment(reference, email)
            payment.add(description, amount)
            
            logger.info(f"💰 Creating Paynow payment: {reference} - ${amount:.2f} to {phone_number}")
            
            # Send mobile payment request
            response = self.paynow_client.send_mobile(payment, phone_number, 'ecocash')
            
            if response.success:
                logger.info(f"✅ Paynow payment initiated successfully: {response.poll_url}")
                
                return {
                    'success': True,
                    'poll_url': response.poll_url,
                    'redirect_url': response.redirect_url,
                    'hash': response.hash,
                    'reference': reference,
                    'amount': amount,
                    'phone_number': phone_number,
                    'status': 'INITIATED',
                    'instructions': self._get_payment_instructions(phone_number, amount, self.test_mode)
                }
            else:
                logger.error(f"❌ Paynow payment failed: {response.error}")
                return {
                    'success': False,
                    'error': response.error,
                    'message': 'Failed to initiate payment. Please try again.'
                }
                
        except Exception as e:
            logger.error(f"🚨 Paynow payment creation error: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Payment system error. Please contact support.'
            }
    
    def check_payment_status(self, poll_url: str) -> Dict:
        """
        Check payment status using poll URL
        
        Args:
            poll_url: Payment poll URL from Paynow
            
        Returns:
            Dict with current payment status
        """
        try:
            if not self.is_available():
                return {
                    'success': False,
                    'status': 'UNKNOWN',
                    'message': 'Payment service unavailable'
                }
            
            status = self.paynow_client.check_transaction_status(poll_url)
            
            logger.info(f"📊 Payment status check: {status.status}")
            
            return {
                'success': True,
                'status': status.status,
                'paid': status.paid,
                'amount': status.amount,
                'reference': status.reference,
                'paynow_reference': status.paynow_reference,
                'poll_url': poll_url,
                'hash': status.hash
            }
            
        except Exception as e:
            logger.error(f"🚨 Status check error: {e}")
            return {
                'success': False,
                'status': 'ERROR',
                'message': str(e)
            }
    
    def process_webhook(self, webhook_data: Dict) -> Dict:
        """
        Process Paynow webhook notification
        
        Args:
            webhook_data: Webhook payload from Paynow
            
        Returns:
            Dict with processed webhook information
        """
        try:
            # Extract key fields from webhook
            reference = webhook_data.get('reference', '')
            paynow_reference = webhook_data.get('paynowreference', '')
            amount = float(webhook_data.get('amount', 0))
            status = webhook_data.get('status', 'UNKNOWN')
            hash_value = webhook_data.get('hash', '')
            
            logger.info(f"🔔 Paynow webhook received: {reference} - {status}")
            
            # Validate webhook hash for security
            is_valid = self._validate_webhook_hash(webhook_data, hash_value)
            
            if not is_valid:
                logger.warning(f"⚠️ Invalid webhook hash for {reference}")
                return {
                    'success': False,
                    'error': 'Invalid webhook signature',
                    'valid': False
                }
            
            return {
                'success': True,
                'valid': True,
                'reference': reference,
                'paynow_reference': paynow_reference,
                'amount': amount,
                'status': status,
                'paid': status.upper() == 'PAID',
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"🚨 Webhook processing error: {e}")
            return {
                'success': False,
                'error': str(e),
                'valid': False
            }
    
    def get_test_phone_numbers(self) -> Dict:
        """Get test phone numbers for development"""
        return {
            'success': '0771111111',
            'delayed_success': '0772222222', 
            'user_cancelled': '0773333333',
            'insufficient_balance': '0774444444'
        }
    
    def _is_valid_phone_number(self, phone_number: str) -> bool:
        """Validate Zimbabwe phone number format"""
        # Remove any whitespace and standardize format
        phone = phone_number.replace(' ', '').replace('-', '')
        
        # Check if it's a valid Zimbabwe mobile number
        # EcoCash numbers: 077, 078 (Econet)
        valid_prefixes = ['077', '078']
        
        if len(phone) == 10 and phone.startswith('07'):
            prefix = phone[:3]
            return prefix in valid_prefixes
        
        return False
    
    def _get_payment_instructions(self, phone_number: str, amount: float, test_mode: bool) -> str:
        """Generate payment instructions for customer"""
        if test_mode:
            return f"""
📱 TEST MODE PAYMENT INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Amount: ${amount:.2f} USD
📞 EcoCash Number: {phone_number}

🧪 Test Numbers Available:
• 0771111111 - Instant Success
• 0772222222 - Delayed Success (30s)
• 0773333333 - User Cancelled
• 0774444444 - Insufficient Balance

⚡ You should receive a USSD prompt on your phone.
📲 Enter your EcoCash PIN to complete payment.
"""
        else:
            return f"""
📱 USD ECOCASH PAYMENT INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Amount: ${amount:.2f} USD
📞 EcoCash Number: {phone_number}

📋 STEPS TO COMPLETE PAYMENT:
1️⃣ Check your phone for USSD prompt (*151*2*7#)
2️⃣ Enter your EcoCash PIN when prompted
3️⃣ Confirm the payment amount
4️⃣ Wait for payment confirmation

⏰ Payment will be confirmed within 30 seconds.
💡 Ensure you have sufficient USD balance in your EcoCash wallet.
"""
    
    def _validate_webhook_hash(self, data: Dict, received_hash: str) -> bool:
        """Validate webhook hash for security"""
        try:
            if not self.integration_key:
                return False
            
            # Build hash string from webhook data
            hash_fields = []
            for key in sorted(data.keys()):
                if key != 'hash':  # Exclude hash field itself
                    hash_fields.append(f"{data[key]}")
            
            hash_string = ''.join(hash_fields) + self.integration_key
            
            # Calculate expected hash (simplified - actual implementation may vary)
            import hashlib
            expected_hash = hashlib.sha512(hash_string.encode()).hexdigest().upper()
            
            return received_hash.upper() == expected_hash
            
        except Exception as e:
            logger.error(f"Hash validation error: {e}")
            return False

# Global Paynow service instance
paynow_service = PaynowService()