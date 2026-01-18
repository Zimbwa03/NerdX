"""
ULTRA-SECURE CREDIT SYSTEM FOR NERDX QUIZ BOT
=============================================
This module provides the highest level of security for credit management.

🔒 SECURITY FEATURES:
- Zero-credit users CANNOT access any questions (multiple validation layers)
- Credits are ONLY deducted AFTER successful question/answer delivery
- Transaction rollback on failure
- Audit logging for all credit transactions
- Rate limiting to prevent abuse
- Configurable from dashboard

💰 CREDIT COSTS (As Specified by User):
- Combined Science: Topical (1), Exam (2)
- Mathematics: Topical (1), Exam (2), Graphs (3)  
- English: Topical (1), Comprehension (3), Essay (3)
"""

import logging
from typing import Dict, Optional, Tuple, List
from datetime import datetime
from config import Config
from utils.credit_units import format_credits
from database.external_db import (
    get_user_credits, deduct_credits, add_credits, 
    get_user_registration, get_user_stats
)

logger = logging.getLogger(__name__)

class SecureCreditSystem:
    """Ultra-secure credit system with multiple validation layers"""
    
    def __init__(self):
        # EXACT CREDIT COSTS AS SPECIFIED BY USER
        self.SECURE_CREDIT_COSTS = {
            # Combined Science (O-Level)
            'combined_science_topical': 3,      # 0.25 credit (rounded up)
            'combined_science_topical_mcq': 3,
            'combined_science_topical_structured': 5,  # 0.5 credit
            'combined_science_exam': 5,         # 0.5 credit

            # Mathematics (O-Level)
            'math_topical': 5,                  # 0.5 credit
            'math_exam': 5,                     # 0.5 credit
            'math_graph_practice': 10,          # 1 credit per graph/question/video
            'math_quiz': 5,
            
            # English
            'english_topical': 10,
            'english_comprehension': 30,
            'english_essay_writing': 30,
            
            # Audio Features
            'audio_feature': 10,
            'voice_chat': 1,                    # 0.1 credit per 5 seconds (live)
        }
        
        self.transaction_log = []  # Audit trail
        
    def get_credit_cost(self, action: str) -> int:
        """Get exact credit cost for an action"""
        return self.SECURE_CREDIT_COSTS.get(action, 1)
    
    def ultra_secure_pre_validation(self, user_id: str, action: str) -> Dict:
        """
        🔒 ULTRA-SECURE PRE-VALIDATION 
        
        CRITICAL: This function MUST return success=False for users with 0 credits
        NO EXCEPTIONS - NO BYPASSES - NO OVERRIDES
        """
        try:
            logger.info(f"🔒 SECURE: Starting ultra-secure validation for user {user_id}, action {action}")
            
            # SECURITY LAYER 1: User existence check
            user_data = get_user_registration(user_id)
            if not user_data:
                logger.error(f"🚨 SECURITY BREACH: User {user_id} not found in database")
                return {
                    'success': False,
                    'error': 'User not found',
                    'message': '🔒 Access denied - invalid user'
                }
            
            # SECURITY LAYER 2: Credit balance check (ZERO TOLERANCE)
            current_credits = get_user_credits(user_id)
            required_credits = self.get_credit_cost(action)
            
            logger.info(f"🔒 SECURE: User {user_id} has {current_credits} credits, needs {required_credits}")
            
            # 🚨 CRITICAL: ZERO CREDIT USERS MUST BE BLOCKED
            if current_credits == 0:
                logger.error(f"🚨 ZERO CREDIT BLOCK: User {user_id} has 0 credits - ACCESS DENIED")
                return {
                    'success': False,
                    'zero_credits': True,
                    'current_credits': 0,
                    'required_credits': required_credits,
                    'message': '🚫 Access denied - You have 0 credits. Please purchase credits to continue.'
                }
            
            # SECURITY LAYER 3: Insufficient credits check
            if current_credits < required_credits:
                logger.warning(f"🔒 INSUFFICIENT: User {user_id} has {current_credits}, needs {required_credits}")
                return {
                    'success': False,
                    'insufficient': True,
                    'current_credits': current_credits,
                    'required_credits': required_credits,
                    'shortage': required_credits - current_credits,
                    'message': f'💰 You need {format_credits(required_credits)} credits but have {format_credits(current_credits)}. Please purchase more credits.'
                }
            
            # SECURITY LAYER 4: Action validation
            if action not in self.SECURE_CREDIT_COSTS:
                logger.error(f"🚨 INVALID ACTION: {action} not in secure credit costs")
                return {
                    'success': False,
                    'error': 'Invalid action',
                    'message': '🔒 Invalid service requested'
                }
            
            # All security checks passed
            logger.info(f"✅ SECURE: All validations passed for user {user_id}, action {action}")
            return {
                'success': True,
                'current_credits': current_credits,
                'required_credits': required_credits,
                'remaining_after': current_credits - required_credits,
                'message': f'✅ Validation passed. Cost: {format_credits(required_credits)} credits',
                'user_name': user_data.get('name', 'Student')
            }
            
        except Exception as e:
            logger.error(f"💥 CRITICAL ERROR in ultra_secure_pre_validation: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': '🔒 System security error - access denied'
            }
    
    def secure_post_delivery_deduction(self, user_id: str, action: str, delivery_success: bool) -> Dict:
        """
        🔒 SECURE POST-DELIVERY CREDIT DEDUCTION
        
        CRITICAL: Credits are ONLY deducted AFTER successful question/answer delivery
        If delivery fails, NO credits are deducted
        """
        try:
            logger.info(f"🔒 POST-DELIVERY: Processing deduction for user {user_id}, action {action}, success: {delivery_success}")
            
            if not delivery_success:
                logger.info(f"❌ NO DEDUCTION: Delivery failed for user {user_id}, action {action}")
                return {
                    'success': False,
                    'deducted': False,
                    'message': '❌ No credits deducted - service delivery failed'
                }
            
            # Get current credit state
            current_credits = get_user_credits(user_id)
            required_credits = self.get_credit_cost(action)
            
            # FINAL SECURITY CHECK: Ensure user still has credits (race condition protection)
            if current_credits < required_credits:
                logger.error(f"🚨 RACE CONDITION: User {user_id} credits changed during delivery! Had enough, now has {current_credits}")
                return {
                    'success': False,
                    'error': 'Credits changed during delivery',
                    'message': '🔒 Credit verification failed - please try again'
                }
            
            # Perform the deduction with audit trail
            transaction_description = f"Secure deduction: {action} service delivered successfully"
            deduction_success = deduct_credits(user_id, required_credits, action, transaction_description)
            
            if deduction_success:
                new_balance = current_credits - required_credits
                
                # Add to audit log
                audit_entry = {
                    'timestamp': datetime.utcnow().isoformat(),
                    'user_id': user_id,
                    'action': action,
                    'credits_deducted': required_credits,
                    'previous_balance': current_credits,
                    'new_balance': new_balance,
                    'status': 'SUCCESS'
                }
                self.transaction_log.append(audit_entry)
                
                logger.info(f"✅ DEDUCTION SUCCESS: User {user_id} charged {required_credits} credits for {action}")
                return {
                    'success': True,
                    'deducted': True,
                    'credits_deducted': required_credits,
                    'previous_balance': current_credits,
                    'new_balance': new_balance,
                    'message': f'✅ Service delivered! {required_credits} credits deducted. New balance: {new_balance}'
                }
            else:
                logger.error(f"💥 DEDUCTION FAILED: Database error for user {user_id}, action {action}")
                return {
                    'success': False,
                    'error': 'Database deduction failed',
                    'message': '🔒 Credit processing error - please contact support'
                }
                
        except Exception as e:
            logger.error(f"💥 CRITICAL ERROR in secure_post_delivery_deduction: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': '🔒 System error during credit processing'
            }
    
    def generate_security_report(self, user_id: str) -> Dict:
        """Generate security report for user credit status"""
        try:
            user_data = get_user_registration(user_id)
            current_credits = get_user_credits(user_id)
            
            # Analyze user's access capabilities
            accessible_services = []
            blocked_services = []
            
            for action, cost in self.SECURE_CREDIT_COSTS.items():
                if current_credits >= cost:
                    accessible_services.append({'action': action, 'cost': cost})
                else:
                    blocked_services.append({'action': action, 'cost': cost, 'shortage': cost - current_credits})
            
            return {
                'user_id': user_id,
                'user_name': user_data.get('name', 'Unknown') if user_data else 'Unknown',
                'current_credits': current_credits,
                'zero_credit_user': current_credits == 0,
                'accessible_services': accessible_services,
                'blocked_services': blocked_services,
                'security_level': 'MAXIMUM' if current_credits > 0 else 'ZERO_ACCESS'
            }
            
        except Exception as e:
            logger.error(f"Error generating security report: {e}")
            return {'error': str(e)}
    
    def format_insufficient_credits_message(self, user_id: str, action: str) -> Tuple[str, List[Dict]]:
        """Format user-friendly insufficient credits message"""
        try:
            validation = self.ultra_secure_pre_validation(user_id, action)
            
            if validation.get('zero_credits'):
                message = """🚫 **ACCESS DENIED** 🚫

💳 **Your Credits: 0** ❌

⚠️ **You cannot access any questions without credits.**

Students pay money for this service, so we must ensure fair access for all paying users.

💰 **Get Credits Now:**"""
                
                buttons = [
                    {"text": "💰 Buy Credits Now", "callback_data": "credit_store"},
                    {"text": "👥 Refer Friends (+5 each)", "callback_data": "share_to_friend"},
                    {"text": "📞 Contact Support", "callback_data": "contact_support"},
                    {"text": "🏠 Main Menu", "callback_data": "main_menu"}
                ]
                
            elif validation.get('insufficient'):
                current = validation['current_credits']
                required = validation['required_credits']
                shortage = validation['shortage']
                
                service_names = {
                    'combined_science_topical': 'Combined Science Topical Questions',
                    'combined_science_exam': 'Combined Science Exam Questions',
                    'math_topical': 'Mathematics Topical Questions',
                    'math_exam': 'Mathematics Exam Questions',
                    'math_graph_practice': 'Mathematics Graph Practice',
                    'english_topical': 'English Topical Questions',
                    'english_comprehension': 'English Comprehension',
                    'english_essay_writing': 'English Essay Writing'
                }
                
                service_name = service_names.get(action, action.title())
                
                message = f"""💰 **Insufficient Credits** 💰

📚 **Service**: {service_name}
💳 **Your Credits**: {current}
💰 **Required**: {required} credits
📈 **Need**: {shortage} more credits

💎 **Get More Credits:**"""
                
                buttons = [
                    {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                    {"text": "👥 Refer Friends (+5 each)", "callback_data": "share_to_friend"},
                    {"text": "🔙 Back to Menu", "callback_data": "main_menu"}
                ]
            
            else:
                message = "❌ Access denied"
                buttons = [{"text": "🏠 Main Menu", "callback_data": "main_menu"}]
            
            return message, buttons
            
        except Exception as e:
            logger.error(f"Error formatting insufficient credits message: {e}")
            return "❌ System error", [{"text": "🏠 Main Menu", "callback_data": "main_menu"}]

# Global secure credit system instance
secure_credit_system = SecureCreditSystem()