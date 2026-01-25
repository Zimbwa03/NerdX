"""
PAYNOW USD ECOCASH INTEGRATION SERVICE
====================================
Comprehensive Paynow payment service for Zimbabwe USD EcoCash transactions
Handles payment initiation, status checking, and webhook processing
"""

import os
import logging
from typing import Dict, Optional, Tuple
from urllib.parse import parse_qsl
from paynow import Paynow
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

# Debug log path - works on both local Windows and Render Linux
DEBUG_LOG_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.cursor', 'debug.log')

class PaynowService:
    """
    Complete Paynow integration service for USD EcoCash payments
    Features:
    - USD EcoCash transaction support
    - Real-time payment status updates
    - Webhook handling for payment confirmations
    - Test mode support with simulation numbers
    """
    
    MERCHANT_EMAIL = "neezykidngoni@gmail.com"

    def __init__(self):
        """Initialize Paynow service with credentials"""
        # Get Paynow credentials from environment
        self.integration_id = os.environ.get('PAYNOW_INTEGRATION_ID')
        self.integration_key = os.environ.get('PAYNOW_INTEGRATION_KEY')
        
        # URLs for Paynow result and return handling
        # result_url: Paynow server-to-server notification
        # return_url: user redirect after payment
        env_result_url = os.environ.get('PAYNOW_RESULT_URL')
        env_return_url = os.environ.get('PAYNOW_RETURN_URL')
        if env_result_url and env_return_url:
            self.result_url = env_result_url
            self.return_url = env_return_url
        else:
            base_url = os.environ.get('BASE_URL', 'https://nerdx.onrender.com')
            self.result_url = f'{base_url}/webhook/paynow/result'
            self.return_url = f'{base_url}/webhook/paynow/return'
        
        logger.info(f"✅ Paynow URLs configured:")
        logger.info(f"   Result URL (auto-notification): {self.result_url}")
        logger.info(f"   Return URL (user redirect): {self.return_url}")
        
        # Test mode configuration
        self.test_mode = os.environ.get('PAYNOW_TEST_MODE', 'true').lower() == 'true'
        if self.test_mode:
            logger.info(f"🧪 PAYNOW TEST MODE ACTIVE - Using Merchant Email: {self.MERCHANT_EMAIL}")
        
        # Initialize Paynow client
        # #region agent log
        import json
        try:
            with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"A","location":"paynow_service.py:59","message":"Paynow service initialization check","data":{"has_integration_id":bool(self.integration_id),"has_integration_key":bool(self.integration_key),"integration_id_length":len(self.integration_id) if self.integration_id else 0},"timestamp":int(__import__('time').time()*1000)})+'\n')
        except: pass
        # #endregion
        if self.integration_id and self.integration_key:
            # Paynow SDK expects (integration_id, integration_key, return_url, result_url)
            self.paynow_client = Paynow(
                self.integration_id,
                self.integration_key,
                self.return_url,
                self.result_url
            )
            logger.info("✅ Paynow service initialized successfully")
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"A","location":"paynow_service.py:68","message":"Paynow client created successfully","data":{"test_mode":self.test_mode},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
        else:
            self.paynow_client = None
            logger.warning("⚠️ Paynow credentials not configured - using fallback mode")
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"A","location":"paynow_service.py:72","message":"Paynow client NOT created - missing credentials","data":{},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
    
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
        # #region agent log
        import json
        try:
            with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"A","location":"paynow_service.py:95","message":"create_usd_ecocash_payment ENTRY","data":{"phone_number":phone_number,"amount":amount,"reference":reference,"email":email},"timestamp":int(__import__('time').time()*1000)})+'\n')
        except: pass
        # #endregion
        try:
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"A","location":"paynow_service.py:102","message":"Checking Paynow availability","data":{"is_available":self.is_available(),"has_client":self.paynow_client is not None,"integration_id_set":self.integration_id is not None,"integration_key_set":self.integration_key is not None},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
            if not self.is_available():
                # #region agent log
                try:
                    with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"A","location":"paynow_service.py:107","message":"Paynow service NOT available - EXIT","data":{},"timestamp":int(__import__('time').time()*1000)})+'\n')
                except: pass
                # #endregion
                return {
                    'success': False,
                    'error': 'Paynow service not available',
                    'message': 'Payment service temporarily unavailable'
                }
            
            # Validate phone number format
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"B","location":"paynow_service.py:113","message":"BEFORE phone validation","data":{"phone_number":phone_number,"phone_length":len(phone_number)},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
            is_valid = self._is_valid_phone_number(phone_number)
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"B","location":"paynow_service.py:116","message":"AFTER phone validation","data":{"is_valid":is_valid,"phone_number":phone_number},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
            if not is_valid:
                logger.error(f"❌ Invalid phone number format: {phone_number}")
                # #region agent log
                try:
                    with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"B","location":"paynow_service.py:120","message":"Phone validation FAILED - EXIT","data":{"phone_number":phone_number},"timestamp":int(__import__('time').time()*1000)})+'\n')
                except: pass
                # #endregion
                return {
                    'success': False,
                    'error': 'Invalid phone number',
                    'message': 'Please provide a valid EcoCash number (e.g., 0771234567)'
                }
            
            # Determine Auth Email (Merchant Email during Test Mode)
            auth_email = email
            if self.test_mode:
                auth_email = self.MERCHANT_EMAIL
                logger.info(f"🧪 TEST MODE: Overriding user email {email} with merchant email {auth_email}")
            
            # Create payment object according to documentation
            payment = self.paynow_client.create_payment(reference, auth_email)
            payment.add(description, amount)
            
            logger.info(f"💰 Creating Paynow payment: {reference} - ${amount:.2f} USD")
            logger.info(f"📱 Phone number: {phone_number}")
            logger.info(f"📧 Auth email: {auth_email}")
            logger.info(f"🔑 Integration ID: {self.integration_id}")
            
            # Send mobile payment request (documentation: send_mobile(payment, phone, method))
            # This should trigger Paynow to send a USSD prompt to the user's phone
            logger.info(f"📲 Sending mobile payment request to Paynow API for {phone_number}...")
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"paynow_service.py:130","message":"BEFORE send_mobile API call","data":{"phone_number":phone_number,"amount":amount,"reference":reference,"test_mode":self.test_mode},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
            try:
                response = self.paynow_client.send_mobile(payment, phone_number, 'ecocash')
                # #region agent log
                try:
                    with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                        response_data = {"success":response.success if hasattr(response,'success') else None,"has_error":hasattr(response,'error'),"has_poll_url":hasattr(response,'poll_url'),"has_instructions":hasattr(response,'instructions')}
                        if hasattr(response,'error'): response_data["error"] = str(response.error)
                        if hasattr(response,'poll_url'): response_data["poll_url"] = str(response.poll_url)
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"paynow_service.py:133","message":"AFTER send_mobile API call - SUCCESS","data":response_data,"timestamp":int(__import__('time').time()*1000)})+'\n')
                except: pass
                # #endregion
            except Exception as api_exception:
                # #region agent log
                try:
                    with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"D","location":"paynow_service.py:136","message":"send_mobile API call EXCEPTION","data":{"exception_type":type(api_exception).__name__,"exception_message":str(api_exception)},"timestamp":int(__import__('time').time()*1000)})+'\n')
                except: pass
                # #endregion
                raise
            logger.info(f"📲 Paynow API response received")
            
            # Debug response details
            logger.info(f"🔍 Paynow response debug: success={response.success}")
            
            if hasattr(response, 'error'):
                error_value = response.error
                logger.warning(f"🔍 Response has error attribute: {error_value} (type: {type(error_value)})")
            
            if hasattr(response, 'instructions'):
                logger.info(f"📋 Paynow provided instructions: {response.instructions}")
            
            if response.success:
                poll_url = getattr(response, 'poll_url', '')
                logger.info(f"✅ Paynow payment initiated successfully!")
                logger.info(f"🔗 Poll URL: {poll_url}")
                logger.info(f"📱 USSD prompt should be sent to {phone_number} by Paynow")
                logger.info(f"⏰ User should check their phone for payment prompt now")
                # #region agent log
                try:
                    with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"paynow_service.py:150","message":"Response.success=TRUE - Payment initiated","data":{"phone_number":phone_number,"poll_url":str(poll_url),"test_mode":self.test_mode},"timestamp":int(__import__('time').time()*1000)})+'\n')
                except: pass
                # #endregion
                
                # For mobile payments, generate proper instructions
                # Paynow sends USSD prompt automatically, but we provide clear instructions
                
                # Generate proper payment instructions
                instructions = self._get_payment_instructions(phone_number, amount, self.test_mode)
                
                result = {
                    'success': True,
                    'poll_url': str(poll_url),
                    'redirect_url': str(poll_url),  # Use poll_url as redirect for mobile
                    'hash': str(getattr(response, 'hash', '')),
                    'reference': str(reference),
                    'amount': amount,
                    'phone_number': str(phone_number),
                    'status': 'INITIATED',
                    'instructions': str(instructions)
                }
                # #region agent log
                try:
                    with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"paynow_service.py:166","message":"RETURNING success result","data":{"has_poll_url":bool(result.get('poll_url')),"phone_number":result.get('phone_number')},"timestamp":int(__import__('time').time()*1000)})+'\n')
                except: pass
                # #endregion
                return result
            else:
                # Get error detail - handle case where error might be a type instead of string
                raw_error = getattr(response, 'error', None)
                if raw_error is None:
                    error_detail = 'Unknown error'
                elif isinstance(raw_error, str):
                    error_detail = raw_error
                elif isinstance(raw_error, type):
                    # Bug in paynow lib: error is a type, try to get from response data
                    error_detail = getattr(response, 'data', {}).get('error', 'Payment failed - please try again')
                else:
                    error_detail = str(raw_error)
                
                # #region agent log
                try:
                    with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"paynow_service.py:175","message":"Response.success=FALSE - Payment failed","data":{"error_detail":error_detail,"raw_error":str(raw_error) if raw_error else None},"timestamp":int(__import__('time').time()*1000)})+'\n')
                except: pass
                # #endregion
                
                if "ACTIVE 'ecocash' payment method" in error_detail:
                    logger.critical("🚨 PAYNOW CONFIG ERROR: EcoCash is not enabled for this Integration ID!")
                    logger.critical("👉 ACTION REQUIRED: Go to Paynow Dashboard > Integration > Edit and check 'EcoCash'")
                
                logger.error(f"❌ Paynow payment failed: {error_detail}")
                return {
                    'success': False,
                    'error': error_detail,
                    'message': f'Failed to initiate payment: {error_detail}'
                }
                
        except Exception as e:
            logger.error(f"🚨 Paynow payment creation error: {e}")
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"D","location":"paynow_service.py:195","message":"EXCEPTION in create_usd_ecocash_payment","data":{"exception_type":type(e).__name__,"exception_message":str(e)},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
            return {
                'success': False,
                'error': str(e),
                'message': 'Payment system error. Please contact support.'
            }
    
    def create_visa_mastercard_payment(self, 
                                       amount: float,
                                       email: str,
                                       reference: str,
                                       description: str = "NerdX Credit Purchase") -> Dict:
        """
        Create Visa/Mastercard payment via Paynow web checkout
        
        Uses send() method which returns a redirect URL to Paynow's hosted payment page
        where users can enter their card details securely.
        
        Args:
            amount: Payment amount in USD
            email: Customer email address (required)
            reference: Unique payment reference
            description: Payment description
            
        Returns:
            Dict with payment status and redirect URL for card entry
        """
        try:
            if not self.is_available():
                return {
                    'success': False,
                    'error': 'Paynow service not available',
                    'message': 'Payment service temporarily unavailable'
                }
            
            # Validate email
            if not email or '@' not in email:
                return {
                    'success': False,
                    'error': 'Invalid email',
                    'message': 'Please provide a valid email address'
                }
            
            # Determine Auth Email (Merchant Email during Test Mode)
            auth_email = email
            if self.test_mode:
                auth_email = self.MERCHANT_EMAIL
                logger.info(f"🧪 TEST MODE: Overriding user email {email} with merchant email {auth_email}")
            
            # Create payment object
            payment = self.paynow_client.create_payment(reference, auth_email)
            payment.add(description, amount)
            
            logger.info(f"💳 Creating Visa/Mastercard payment: {reference} - ${amount:.2f} for {email} (Auth: {auth_email})")
            
            # Use send() for web checkout (not send_mobile)
            # This returns a redirect URL to Paynow's hosted payment page
            response = self.paynow_client.send(payment)
            
            # Debug response
            logger.info(f"🔍 Paynow card payment response: success={response.success}")
            
            if response.success:
                # Get redirect URL for card payment page
                redirect_url = getattr(response, 'redirect_url', '')
                poll_url = getattr(response, 'poll_url', '')
                
                logger.info(f"✅ Visa/Mastercard payment initiated: {redirect_url}")
                
                return {
                    'success': True,
                    'payment_method': 'visa_mastercard',
                    'poll_url': str(poll_url),
                    'redirect_url': str(redirect_url),
                    'hash': str(getattr(response, 'hash', '')),
                    'reference': str(reference),
                    'amount': amount,
                    'status': 'INITIATED',
                    'instructions': f'Please complete your payment on the Paynow secure payment page. You will be redirected to enter your card details.'
                }
            else:
                # Get error detail - handle case where error might be a type instead of string
                raw_error = getattr(response, 'error', None)
                if raw_error is None:
                    error_detail = 'Unknown error'
                elif isinstance(raw_error, str):
                    error_detail = raw_error
                elif isinstance(raw_error, type):
                    error_detail = getattr(response, 'data', {}).get('error', 'Card payment failed - please try again')
                else:
                    error_detail = str(raw_error)
                    
                logger.error(f"❌ Visa/Mastercard payment failed: {error_detail}")
                return {
                    'success': False,
                    'error': error_detail,
                    'message': f'Failed to initiate card payment: {error_detail}'
                }
                
        except Exception as e:
            logger.error(f"🚨 Visa/Mastercard payment creation error: {e}")
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
        # #region agent log
        import json
        try:
            with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"paynow_service.py:406","message":"check_payment_status ENTRY","data":{"poll_url":poll_url},"timestamp":int(__import__('time').time()*1000)})+'\n')
        except: pass
        # #endregion
        try:
            if not self.is_available():
                return {
                    'success': False,
                    'status': 'UNKNOWN',
                    'message': 'Payment service unavailable'
                }
            
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"paynow_service.py:424","message":"BEFORE calling check_transaction_status","data":{"poll_url":poll_url},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
            
            status = self.paynow_client.check_transaction_status(poll_url)
            
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    status_data = {"status":status.status if hasattr(status,'status') else None,"paid":status.paid if hasattr(status,'paid') else None}
                    if hasattr(status,'amount'): status_data["amount"] = status.amount
                    if hasattr(status,'reference'): status_data["reference"] = status.reference
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"paynow_service.py:430","message":"AFTER calling check_transaction_status","data":status_data,"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
            
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
            # #region agent log
            try:
                with open(r'c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\.cursor\debug.log', 'a', encoding='utf-8') as f:
                    f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"paynow_service.py:445","message":"EXCEPTION in check_payment_status","data":{"exception_type":type(e).__name__,"exception_message":str(e)},"timestamp":int(__import__('time').time()*1000)})+'\n')
            except: pass
            # #endregion
            return {
                'success': False,
                'status': 'ERROR',
                'message': str(e)
            }
    
    def process_webhook(self, webhook_data: Dict, raw_payload: Optional[str] = None) -> Dict:
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
            is_valid = self._validate_webhook_hash(webhook_data, hash_value, raw_payload)
            
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
        """Validate Zimbabwe phone number format - MUST be exactly 10 digits"""
        # Remove any whitespace and standardize format
        phone = phone_number.replace(' ', '').replace('-', '')
        
        # Check if it's a valid Zimbabwe mobile number
        # EcoCash numbers: 077, 078 (Econet)
        # MUST be exactly 10 digits
        valid_prefixes = ['077', '078']
        
        # First check: must be exactly 10 digits
        if len(phone) != 10:
            logger.warning(f"Invalid phone number length: {len(phone)} digits (expected 10) - {phone}")
            return False
        
        # Second check: must start with 07
        if not phone.startswith('07'):
            logger.warning(f"Invalid phone number format: must start with 07 - {phone}")
            return False
        
        # Third check: must have valid prefix (077 or 078)
        prefix = phone[:3]
        if prefix not in valid_prefixes:
            logger.warning(f"Invalid phone number prefix: {prefix} (expected 077 or 078) - {phone}")
            return False
        
        # All validations passed
        return True
    
    def _get_payment_instructions(self, phone_number: str, amount: float, test_mode: bool) -> str:
        """Generate payment instructions for customer"""
        if test_mode:
            return f"""⚡ **CHECK YOUR PHONE NOW!** ⚡

📱 A USSD payment prompt has been sent to:
   {phone_number}

💰 **Amount**: ${amount:.2f} USD

📲 **WHAT TO DO:**
1️⃣ Look for a USSD popup on your phone screen
2️⃣ Enter your EcoCash PIN when prompted
3️⃣ Confirm the payment amount
4️⃣ Wait for confirmation (5-30 seconds)

🧪 **TEST MODE ACTIVE**
Test numbers for simulation:
• 0771111111 - ✅ Instant Success
• 0772222222 - ⏱️ Delayed Success (30s)
• 0773333333 - ❌ User Cancelled
• 0774444444 - 🚫 No Funds

💡 If you don't see the prompt, check your phone's USSD settings or try again."""
        else:
            return f"""⚡ **CHECK YOUR PHONE NOW!** ⚡

📱 A USSD payment prompt has been sent to:
   {phone_number}

💰 **Amount**: ${amount:.2f} USD

📲 **WHAT TO DO:**
1️⃣ Look for a USSD popup on your phone screen
2️⃣ Enter your EcoCash PIN when prompted
3️⃣ Confirm the payment amount
4️⃣ Wait for automatic confirmation (5-30 seconds)

⏰ Payment will be confirmed automatically once you complete it on your phone.

💡 **IMPORTANT:**
• Ensure you have sufficient USD balance in your EcoCash wallet
• The USSD prompt may appear as a popup or notification
• If you don't see it, check your phone's USSD settings
• Payment expires in 5 minutes if not completed"""
    
    def _validate_webhook_hash(self, data: Dict, received_hash: str, raw_payload: Optional[str] = None) -> bool:
        """Validate webhook hash for security"""
        try:
            if not self.integration_key:
                logger.warning("No integration key configured - cannot validate webhook hash")
                return False

            allow_invalid = os.environ.get('PAYNOW_ALLOW_INVALID_HASH', 'false').lower() == 'true'

            import hashlib

            def _sha512_upper(value: str) -> str:
                return hashlib.sha512(value.encode('utf-8')).hexdigest().upper()

            # Prefer raw payload to preserve field order and URL decoding
            if raw_payload:
                payload = raw_payload.lstrip('?')
                pairs = parse_qsl(payload, keep_blank_values=True)

                values_only = ''.join([value for key, value in pairs if key.lower() != 'hash'])
                expected_hash = _sha512_upper(values_only + self.integration_key)

                if received_hash and received_hash.upper() == expected_hash:
                    logger.info('Webhook hash validation successful (values-only)')
                    return True

                # Fallback to key+value concatenation (some docs/examples use this form)
                kv_concat = ''.join([f"{key}{value}" for key, value in pairs if key.lower() != 'hash'])
                expected_kv_hash = _sha512_upper(kv_concat + self.integration_key)

                if received_hash and received_hash.upper() == expected_kv_hash:
                    logger.warning('Webhook hash matched key+value mode; verify Paynow hash mode in use')
                    return True

                if allow_invalid:
                    logger.warning('PAYNOW_ALLOW_INVALID_HASH=true - accepting invalid webhook hash')
                    return True

                logger.warning('Webhook hash validation failed')
                logger.warning(f"  Received: {received_hash}")
                logger.warning(f"  Expected (values-only): {expected_hash}")
                logger.warning(f"  Expected (key+value): {expected_kv_hash}")
                return False

            # Fallback when raw payload is unavailable: use insertion order from dict
            values_only = ''.join([str(value) for key, value in data.items() if key.lower() != 'hash'])
            expected_hash = _sha512_upper(values_only + self.integration_key)

            if received_hash and received_hash.upper() == expected_hash:
                logger.info('Webhook hash validation successful (dict-order fallback)')
                return True

            if allow_invalid:
                logger.warning('PAYNOW_ALLOW_INVALID_HASH=true - accepting invalid webhook hash (dict fallback)')
                return True

            logger.warning('Webhook hash validation failed (dict fallback)')
            logger.warning(f"  Received: {received_hash}")
            logger.warning(f"  Expected: {expected_hash}")
            return False

        except Exception as e:
            logger.error(f"Hash validation error: {e}")
            if os.environ.get('PAYNOW_ALLOW_INVALID_HASH', 'false').lower() == 'true':
                logger.warning('PAYNOW_ALLOW_INVALID_HASH=true - accepting webhook despite error')
                return True
            return False

# Global Paynow service instance
paynow_service = PaynowService()
