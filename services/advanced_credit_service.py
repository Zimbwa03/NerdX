import logging
from typing import Dict, Optional, List, Tuple
from datetime import datetime
from config import Config
from database.external_db import (
    get_user_credits, deduct_credits, add_credits, 
    get_user_registration, add_xp, update_streak, get_user_stats
)
from services.whatsapp_service import WhatsAppService
from services.payment_service import PaymentService

logger = logging.getLogger(__name__)

class AdvancedCreditService:
    """Advanced Credit System with interactive features and smart user experience"""
    
    def __init__(self):
        self.whatsapp_service = WhatsAppService()
        self.payment_service = PaymentService()
        self.credit_costs = Config.CREDIT_COSTS
        self.registration_bonus = Config.REGISTRATION_BONUS
        self.referral_bonus = Config.REFERRAL_BONUS
        self.low_credit_threshold = Config.LOW_CREDIT_THRESHOLD
    
    def get_user_credit_status(self, user_id: str) -> Dict:
        """Get comprehensive credit status for user"""
        try:
            current_credits = get_user_credits(user_id)
            user_data = get_user_registration(user_id)
            
            return {
                'credits': current_credits,
                'is_low': current_credits <= self.low_credit_threshold,
                'user_name': user_data.get('name', 'Student') if user_data else 'Student',
                'can_afford_basic': current_credits >= 1,
                'can_afford_premium': current_credits >= 10,
                'low_credit_warning': current_credits <= 5
            }
        except Exception as e:
            logger.error(f"Error getting credit status for {user_id}: {e}")
            return {'credits': 0, 'error': str(e)}
    
    def format_credit_display(self, user_id: str) -> str:
        """Format credit display for menus and interactions"""
        try:
            status = self.get_user_credit_status(user_id)
            credits = status['credits']
            
            if credits == 0:
                return "💳 **Your Credits: 0** ❌"
            elif credits <= 5:
                return f"💳 **Your Credits: {credits}** ⚠️ (Very Low!)"
            elif credits <= self.low_credit_threshold:
                return f"💳 **Your Credits: {credits}** ⚠️ (Low)"
            else:
                return f"💳 **Your Credits: {credits}** ✅"
                
        except Exception as e:
            logger.error(f"Error formatting credit display: {e}")
            return "💳 **Your Credits: Error**"
    
    def check_and_deduct_credits(self, user_id: str, action: str, difficulty: Optional[str] = None) -> Dict:
        """Check if user has sufficient credits and deduct them"""
        try:
            current_credits = get_user_credits(user_id)
            required_credits = self.get_credit_cost(action, difficulty)
            
            if current_credits >= required_credits:
                # Deduct credits
                if deduct_credits(user_id, required_credits):
                    new_balance = current_credits - required_credits
                    return {
                        'success': True,
                        'deducted': required_credits,
                        'new_balance': new_balance,
                        'message': f"✅ Credits deducted: {required_credits}. New balance: {new_balance}"
                    }
                else:
                    return {
                        'success': False,
                        'error': 'Failed to deduct credits',
                        'message': '❌ Error processing transaction'
                    }
            else:
                return {
                    'success': False,
                    'insufficient': True,
                    'current_credits': current_credits,
                    'required_credits': required_credits,
                    'shortage': required_credits - current_credits,
                    'message': f"❌ Insufficient credits. You need {required_credits} but have {current_credits}"
                }
                
        except Exception as e:
            logger.error(f"Error in check_and_deduct_credits: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': '❌ System error occurred'
            }
    
    def get_credit_cost(self, action: str, difficulty: Optional[str] = None) -> int:
        """Get credit cost for a specific action"""
        try:
            # Map actions to credit costs
            action_mapping = {
                # Combined Science
                'combined_science_topical': 'combined_science_topical',
                'combined_science_exam': 'combined_science_exam',
                
                # Mathematics
                'math_topical': 'math_topical',
                'math_exam': 'math_exam',
                'math_graph_practice': 'math_graph_practice',
                'graph_practice': 'math_graph_practice',
                
                # English
                'english_topical': 'english_topical',
                'english_comprehension': 'english_comprehension',
                'english_essay_writing': 'english_essay_writing',
                
                # Audio Features
                'audio_feature': 'audio_feature',
                'voice_chat': 'voice_chat',
                
                # Legacy mappings
                'math': 'math_topical',
                'science': 'combined_science_topical',
                'english': 'english_topical',
                'image_solve': 'image_solve',
                'graph_generation': 'math_graph_practice'
            }
            
            mapped_action = action_mapping.get(action, action)
            cost = self.credit_costs.get(mapped_action, 5)  # Default 5 credits
            
            # Apply difficulty multiplier if specified
            if difficulty:
                difficulty_multipliers = {
                    'easy': 1,
                    'medium': 1.5,
                    'difficult': 2
                }
                cost = int(cost * difficulty_multipliers.get(difficulty.lower(), 1))
            
            return cost
            
        except Exception as e:
            logger.error(f"Error getting credit cost: {e}")
            return 5
    
    def award_registration_credits(self, user_id: str) -> bool:
        """Award registration bonus credits to new user"""
        try:
            if add_credits(user_id, self.registration_bonus, "Registration bonus"):
                logger.info(f"Awarded {self.registration_bonus} credits to new user {user_id}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error awarding registration credits: {e}")
            return False
    
    def award_referral_credits(self, referrer_id: str, new_user_name: str) -> bool:
        """Award referral credits and send notification"""
        try:
            if add_credits(referrer_id, self.referral_bonus, f"Referral bonus for {new_user_name}"):
                # Send referral notification
                self.send_referral_notification(referrer_id, new_user_name)
                logger.info(f"Awarded {self.referral_bonus} referral credits to {referrer_id}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error awarding referral credits: {e}")
            return False
    
    def send_referral_notification(self, referrer_id: str, new_user_name: str) -> None:
        """Send referral notification without disrupting user flow"""
        try:
            current_credits = get_user_credits(referrer_id)
            new_balance = current_credits + self.referral_bonus
            
            message = f"""🎉 **GREAT NEWS!**

Hey there! 👋

✨ **{new_user_name}** just registered using your referral link!

🎁 **Your Reward:**
+{self.referral_bonus} Credits Added! 💳
💳 **New Balance**: {new_balance} credits

🔥 Keep sharing to earn more credits!

✅ Continue"""
            
            # Send with continue button to not disrupt flow
            buttons = [{"text": "✅ Continue", "callback_data": "continue_current"}]
            self.whatsapp_service.send_interactive_message(referrer_id, message, buttons)
            
        except Exception as e:
            logger.error(f"Error sending referral notification: {e}")
    
    def create_pre_transaction_validation(self, user_id: str, action: str, difficulty: Optional[str] = None) -> Dict:
        """Create pre-transaction validation message"""
        try:
            status = self.get_user_credit_status(user_id)
            current_credits = status['credits']
            required_credits = self.get_credit_cost(action, difficulty)
            
            action_names = {
                'combined_science_topical': 'Combined Science Topical Questions',
                'combined_science_exam': 'Combined Science Exam',
                'math_topical': 'Mathematics Topical Questions',
                'math_exam': 'Mathematics Exam',
                'math_graph_practice': 'Mathematics Graph Practice',
                'english_topical': 'English Topical Questions',
                'english_comprehension': 'English Comprehension',
                'english_essay_writing': 'English Essay Writing',
                'audio_feature': 'Audio Feature',
                'voice_chat': 'Voice Chat'
            }
            
            action_name = action_names.get(action, action.title())
            
            if current_credits >= required_credits:
                remaining_after = current_credits - required_credits
                
                message = f"""🔍 **Service Request**: {action_name}
💰 **Cost**: {required_credits} credits
💳 **Your Balance**: {current_credits} credits
📊 **Remaining After**: {remaining_after} credits

✅ Proceed with {action_name}
❌ Cancel
💰 Buy More Credits"""
                
                buttons = [
                    {"text": f"✅ Proceed ({required_credits} credits)", "callback_data": f"proceed_{action}"},
                    {"text": "❌ Cancel", "callback_data": "cancel_transaction"},
                    {"text": "💰 Buy More Credits", "callback_data": "buy_credits"}
                ]
                
                return {
                    'can_proceed': True,
                    'message': message,
                    'buttons': buttons,
                    'required_credits': required_credits,
                    'remaining_after': remaining_after
                }
            else:
                shortage = required_credits - current_credits
                
                message = f"""⚠️ **Insufficient Credits**

💳 **Your Balance**: {current_credits} credits
💰 **Required**: {required_credits} credits
📈 **Need**: {shortage} more credits

🛒 **Quick Options:**
💰 Buy Credits Now
👥 Refer Friends (+{self.referral_bonus} credits each)
📞 Contact Support
⬅️ Back to Menu"""
                
                buttons = [
                    {"text": "💰 Buy Credits Now", "callback_data": "buy_credits"},
                    {"text": f"👥 Refer Friends (+{self.referral_bonus} credits)", "callback_data": "refer_friends"},
                    {"text": "📞 Contact Support", "callback_data": "contact_support"},
                    {"text": "⬅️ Back to Menu", "callback_data": "back_to_menu"}
                ]
                
                return {
                    'can_proceed': False,
                    'message': message,
                    'buttons': buttons,
                    'shortage': shortage
                }
                
        except Exception as e:
            logger.error(f"Error creating pre-transaction validation: {e}")
            return {
                'can_proceed': False,
                'message': '❌ System error occurred',
                'buttons': [{"text": "⬅️ Back to Menu", "callback_data": "back_to_menu"}]
            }
    
    def add_low_credit_button(self, buttons: List[Dict], user_id: str) -> List[Dict]:
        """Add low credit button to any button list if user has low credits"""
        try:
            status = self.get_user_credit_status(user_id)
            
            if status['is_low']:
                # Add buy credits button at the end
                buttons.append({"text": "💰 Buy More Credits", "callback_data": "buy_credits"})
            
            return buttons
            
        except Exception as e:
            logger.error(f"Error adding low credit button: {e}")
            return buttons
    
    def process_successful_transaction(self, user_id: str, action: str, difficulty: Optional[str] = None) -> str:
        """Process successful transaction and return completion message"""
        try:
            status = self.get_user_credit_status(user_id)
            current_credits = status['credits']
            
            action_names = {
                'combined_science_topical': 'Combined Science Topical Questions',
                'combined_science_exam': 'Combined Science Exam',
                'math_topical': 'Mathematics Topical Questions',
                'math_exam': 'Mathematics Exam',
                'math_graph_practice': 'Mathematics Graph Practice',
                'english_topical': 'English Topical Questions',
                'english_comprehension': 'English Comprehension',
                'english_essay_writing': 'English Essay Writing',
                'audio_feature': 'Audio Feature',
                'voice_chat': 'Voice Chat'
            }
            
            action_name = action_names.get(action, action.title())
            required_credits = self.get_credit_cost(action, difficulty)
            
            message = f"""✅ **Transaction Completed**

📚 **Service**: {action_name}
💰 **Cost**: {required_credits} credits
💳 **New Balance**: {current_credits} credits

🎯 **Ready to learn!**"""
            
            # Add low credit warning if applicable
            if status['is_low']:
                message += f"\n\n⚠️ **Low Credit Warning**: You have {current_credits} credits remaining. Consider buying more soon!"
            
            return message
            
        except Exception as e:
            logger.error(f"Error processing successful transaction: {e}")
            return "✅ Transaction completed successfully!"
    
    def award_achievement_credits(self, user_id: str, action: str, correct: bool = False, streak: int = 0) -> int:
        """Award bonus credits for achievements and update XP/streak"""
        try:
            bonus_credits = 0
            
            # Base bonus for correct answers
            if correct:
                bonus_credits += 2
                
                # Streak bonus
                if streak >= 10:
                    bonus_credits += 5
                elif streak >= 5:
                    bonus_credits += 3
                elif streak >= 3:
                    bonus_credits += 1
            
            # Special action bonuses
            if action == 'daily_login':
                bonus_credits += 5
            elif action == 'weekly_challenge':
                bonus_credits += 10
            elif action == 'perfect_score':
                bonus_credits += 15
            
            # Award credits if any
            if bonus_credits > 0:
                if add_credits(user_id, bonus_credits, f"Achievement bonus: {action}"):
                    logger.info(f"Awarded {bonus_credits} achievement credits to {user_id}")
            
            # Update XP and streak
            if correct:
                xp_gained = 10 + (streak * 2)  # Base 10 XP + streak bonus
                add_xp(user_id, xp_gained)
                update_streak(user_id, True)  # Increment streak
            
            return bonus_credits
            
        except Exception as e:
            logger.error(f"Error awarding achievement credits: {e}")
            return 0
    
    def get_credit_packages(self) -> List[Dict]:
        """Get available credit packages for purchase"""
        try:
            return self.payment_service.calculate_credit_packages()
        except Exception as e:
            logger.error(f"Error getting credit packages: {e}")
            return []
    
    def format_credit_store_message(self, user_id: str) -> Tuple[str, List[Dict]]:
        """Format credit store message with packages"""
        try:
            status = self.get_user_credit_status(user_id)
            current_credits = status['credits']
            packages = self.get_credit_packages()
            
            message = f"""💰 **CREDIT STORE**

💳 **Your Balance**: {current_credits} credits

🛒 **SELECT YOUR PACKAGE:**"""
            
            buttons = []
            for package in packages:
                button_text = f"{package['icon']} {package['name']} - ${package['price']:.2f}"
                callback_data = f"select_package_{package['id']}"
                buttons.append({"text": button_text, "callback_data": callback_data})
            
            # Add back button
            buttons.append({"text": "⬅️ Back to Menu", "callback_data": "back_to_menu"})
            
            return message, buttons
            
        except Exception as e:
            logger.error(f"Error formatting credit store: {e}")
            return "❌ Error loading credit store", [{"text": "⬅️ Back", "callback_data": "back_to_menu"}]

    def add_credits_for_purchase(self, user_id: str, amount: int, reason: str) -> bool:
        """Add credits for a purchase transaction"""
        try:
            if add_credits(user_id, amount, reason):
                logger.info(f"Added {amount} credits to user {user_id} for {reason}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error adding credits for purchase: {e}")
            return False

# Global advanced credit service instance
advanced_credit_service = AdvancedCreditService()
