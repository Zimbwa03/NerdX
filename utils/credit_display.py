import logging
from typing import Dict, List, Optional
from database.external_db import get_user_credits, get_user_registration

logger = logging.getLogger(__name__)

class CreditDisplayManager:
    """Manage credit display and low credit alerts across the system"""
    
    def __init__(self):
        self.low_credit_threshold = 20
    
    def get_credit_display_header(self, user_id: str) -> str:
        """Get standardized credit display header for all menus"""
        try:
            current_credits = get_user_credits(user_id)
            registration = get_user_registration(user_id)
            user_name = registration.get('name', 'Student') if registration else 'Student'
            
            header = f"💳 **Your Credits: {current_credits}**\n\n"
            
            if current_credits <= self.low_credit_threshold:
                header += "⚠️ **Low Credits Warning!** Consider purchasing more credits.\n\n"
            
            return header
            
        except Exception as e:
            logger.error(f"Error getting credit display header: {e}")
            return "💳 **Your Credits: --**\n\n"
    
    def should_show_buy_credits_button(self, user_id: str) -> bool:
        """Check if 'Buy More Credits' button should be shown"""
        try:
            current_credits = get_user_credits(user_id)
            return current_credits <= self.low_credit_threshold
        except Exception as e:
            logger.error(f"Error checking low credits: {e}")
            return False
    
    def add_buy_credits_button_if_needed(self, user_id: str, buttons: List[Dict]) -> List[Dict]:
        """Add 'Buy More Credits' button to button list if user has low credits"""
        try:
            if self.should_show_buy_credits_button(user_id):
                # Add Buy More Credits button at the end
                buy_credits_button = {
                    "text": "💰 Buy More Credits", 
                    "callback_data": "buy_credits"
                }
                buttons.append(buy_credits_button)
            
            return buttons
            
        except Exception as e:
            logger.error(f"Error adding buy credits button: {e}")
            return buttons
    
    def get_pre_transaction_validation_message(self, user_id: str, service_name: str, cost: int) -> Dict:
        """Generate pre-transaction validation message"""
        try:
            current_credits = get_user_credits(user_id)
            remaining_after = current_credits - cost
            
            if current_credits >= cost:
                message = f"🔍 **Service Request**: {service_name}\n"
                message += f"💰 **Cost**: {cost} credits\n"
                message += f"💳 **Your Balance**: {current_credits} credits\n"
                message += f"📊 **Remaining After**: {remaining_after} credits\n\n"
                
                return {
                    'sufficient': True,
                    'message': message,
                    'current_credits': current_credits,
                    'cost': cost,
                    'remaining': remaining_after
                }
            else:
                shortage = cost - current_credits
                message = f"⚠️ **Insufficient Credits**\n\n"
                message += f"💳 **Your Balance**: {current_credits} credits\n"
                message += f"💰 **Required**: {cost} credits\n"
                message += f"📈 **Need**: {shortage} more credits\n\n"
                message += f"🛒 **Quick Options:**\n"
                
                return {
                    'sufficient': False,
                    'message': message,
                    'current_credits': current_credits,
                    'cost': cost,
                    'shortage': shortage
                }
                
        except Exception as e:
            logger.error(f"Error generating pre-transaction validation: {e}")
            return {
                'sufficient': False,
                'message': "⚠️ Error checking credits. Please try again.",
                'error': str(e)
            }
    
    def get_transaction_success_message(self, user_id: str, service_name: str, cost: int) -> str:
        """Generate transaction success message"""
        try:
            current_credits = get_user_credits(user_id)
            
            message = f"✅ **Transaction Completed**\n\n"
            message += f"📚 **Service**: {service_name}\n"
            message += f"💰 **Cost**: {cost} credits\n"
            message += f"💳 **New Balance**: {current_credits} credits\n\n"
            
            if current_credits <= self.low_credit_threshold:
                message += f"💰 Consider buying more credits to continue learning!\n\n"
            
            return message
            
        except Exception as e:
            logger.error(f"Error generating transaction success message: {e}")
            return "✅ Transaction completed!"
    
    def get_insufficient_credits_buttons(self) -> List[Dict]:
        """Get buttons for insufficient credits scenario"""
        return [
            {"text": "💰 Buy Credits Now", "callback_data": "buy_credits"},
            {"text": "👥 Refer Friends (+5 credits each)", "callback_data": "referral_program"},
            {"text": "📞 Contact Support", "callback_data": "contact_support"},
            {"text": "⬅️ Back to Menu", "callback_data": "main_menu"}
        ]
    
    def get_pre_transaction_buttons(self, action_callback: str) -> List[Dict]:
        """Get buttons for pre-transaction validation"""
        return [
            {"text": f"✅ Proceed", "callback_data": action_callback},
            {"text": "❌ Cancel", "callback_data": "main_menu"},
            {"text": "💰 Buy More Credits", "callback_data": "buy_credits"}
        ]

# Global instance
credit_display_manager = CreditDisplayManager()