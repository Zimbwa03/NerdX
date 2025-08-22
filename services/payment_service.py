import os
import json
import logging
import requests
import uuid
from datetime import datetime
from typing import Dict, Optional, List
from config import Config

logger = logging.getLogger(__name__)

class PaymentService:
    """Service for handling payment processing with EcoCash"""
    
    def __init__(self):
        self.ecocash_api_key = os.getenv('ECOCASH_API_KEY')
        self.merchant_code = os.getenv('ECOCASH_MERCHANT_CODE')
        self.base_url = "https://api.ecocash.co.zw/v1"
        
        if not self.ecocash_api_key:
            logger.warning("EcoCash API key not configured - payment features will be limited")
    
    def create_payment_request(self, user_id: str, amount: float, credits: int, phone_number: str) -> Optional[Dict]:
        """Create a payment request for credit purchase"""
        try:
            if not self.ecocash_api_key:
                logger.error("EcoCash API not configured")
                return None
            
            reference = f"NERDX_{uuid.uuid4().hex[:8].upper()}"
            
            headers = {
                'Authorization': f'Bearer {self.ecocash_api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'merchant_code': self.merchant_code,
                'reference': reference,
                'amount': amount,
                'currency': 'USD',
                'phone_number': phone_number,
                'description': f"NerdX Credits Purchase - {credits} credits",
                'callback_url': f"{os.getenv('BASE_URL', 'https://your-app.com')}/api/payment/callback"
            }
            
            response = requests.post(
                f"{self.base_url}/payments",
                headers=headers,
                json=data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"Payment request created: {reference}")
                
                # Store pending payment in database
                from database.external_db import create_pending_payment
                create_pending_payment(
                    user_id=user_id,
                    amount=amount,
                    credits=credits,
                    reference=reference,
                    external_reference=result.get('transaction_id')
                )
                
                return {
                    'reference': reference,
                    'transaction_id': result.get('transaction_id'),
                    'status': 'pending',
                    'amount': amount,
                    'credits': credits
                }
            else:
                logger.error(f"Payment request failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Error creating payment request: {e}")
            return None
    
    def check_payment_status(self, reference: str) -> Optional[Dict]:
        """Check the status of a payment"""
        try:
            if not self.ecocash_api_key:
                return None
            
            headers = {
                'Authorization': f'Bearer {self.ecocash_api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f"{self.base_url}/payments/{reference}",
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'reference': reference,
                    'status': result.get('status'),
                    'amount': result.get('amount'),
                    'transaction_id': result.get('transaction_id')
                }
            else:
                logger.error(f"Payment status check failed: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error checking payment status: {e}")
            return None
    
    def process_payment_callback(self, callback_data: Dict) -> bool:
        """Process payment callback from EcoCash"""
        try:
            reference = callback_data.get('reference')
            status = callback_data.get('status')
            transaction_id = callback_data.get('transaction_id')
            
            if not reference:
                logger.error("Payment callback missing reference")
                return False
            
            # Get pending payment from database
            from database.external_db import get_pending_payment, complete_payment, add_credits
            
            payment = get_pending_payment(reference)
            if not payment:
                logger.error(f"No pending payment found for reference: {reference}")
                return False
            
            if status == 'completed':
                # Complete the payment and add credits
                success = complete_payment(reference, transaction_id or '')
                if success:
                    add_credits(payment['user_id'], payment['credits'])
                    logger.info(f"Payment completed and credits added: {reference}")
                    return True
                else:
                    logger.error(f"Failed to complete payment: {reference}")
                    return False
            elif status == 'failed':
                # Mark payment as failed
                complete_payment(reference, transaction_id or '', status='failed')
                logger.info(f"Payment marked as failed: {reference}")
                return True
            else:
                logger.info(f"Payment status updated: {reference} -> {status}")
                return True
                
        except Exception as e:
            logger.error(f"Error processing payment callback: {e}")
            return False
    
    def calculate_credit_packages(self) -> List[Dict]:
        """Get available credit packages"""
        return [
            {
                'credits': 100,
                'amount': 2.00,
                'currency': 'USD',
                'description': 'Starter Pack - 100 credits'
            },
            {
                'credits': 250,
                'amount': 4.50,
                'currency': 'USD',
                'description': 'Popular Pack - 250 credits',
                'savings': '10%'
            },
            {
                'credits': 500,
                'amount': 8.00,
                'currency': 'USD',
                'description': 'Value Pack - 500 credits',
                'savings': '20%'
            },
            {
                'credits': 1000,
                'amount': 15.00,
                'currency': 'USD',
                'description': 'Power Pack - 1000 credits',
                'savings': '25%'
            }
        ]
    
    def validate_phone_number(self, phone_number: str) -> bool:
        """Validate Zimbabwean phone number format"""
        import re
        
        # Remove spaces and special characters
        clean_number = re.sub(r'[^\d+]', '', phone_number)
        
        # Check for valid Zimbabwean formats
        patterns = [
            r'^(\+263|263|0)(77|78|73|71)\d{7}$',  # Mobile numbers
            r'^(\+263|263|0)(86|87)\d{7}$'         # EcoCash numbers
        ]
        
        for pattern in patterns:
            if re.match(pattern, clean_number):
                return True
        
        return False
    
    def format_phone_number(self, phone_number: str) -> str:
        """Format phone number for EcoCash API"""
        import re
        
        # Remove spaces and special characters
        clean_number = re.sub(r'[^\d+]', '', phone_number)
        
        # Convert to international format
        if clean_number.startswith('0'):
            return f"+263{clean_number[1:]}"
        elif clean_number.startswith('263'):
            return f"+{clean_number}"
        elif clean_number.startswith('+263'):
            return clean_number
        else:
            return f"+263{clean_number}"
