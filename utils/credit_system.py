import logging
from typing import Dict, Optional, List
from config import Config
from database.external_db import get_user_credits, deduct_credits, add_credits

logger = logging.getLogger(__name__)

class CreditSystem:
    """Credit system management utilities"""
    
    def __init__(self):
        self.credit_costs = Config.CREDIT_COSTS
    
    def check_sufficient_credits(self, user_id: str, action: str, difficulty: Optional[str] = None) -> Dict:
        """Check if user has sufficient credits for an action"""
        try:
            current_credits = get_user_credits(user_id)
            required_credits = self.get_credit_cost(action, difficulty)
            
            if current_credits >= required_credits:
                return {
                    'sufficient': True,
                    'current_credits': current_credits,
                    'required_credits': required_credits,
                    'remaining_after': current_credits - required_credits
                }
            else:
                return {
                    'sufficient': False,
                    'current_credits': current_credits,
                    'required_credits': required_credits,
                    'shortage': required_credits - current_credits
                }
                
        except Exception as e:
            logger.error(f"Error checking credits: {e}")
            return {
                'sufficient': False,
                'error': str(e)
            }
    
    def get_credit_cost(self, action: str, difficulty: Optional[str] = None) -> int:
        """Get credit cost for a specific action"""
        try:
            if difficulty:
                cost_key = f"{action}_{difficulty}"
                if cost_key in self.credit_costs:
                    return self.credit_costs[cost_key]
            
            # Fallback to action without difficulty
            if action in self.credit_costs:
                return self.credit_costs[action]
            
            # Default cost
            return 5
            
        except Exception as e:
            logger.error(f"Error getting credit cost: {e}")
            return 5
    
    def deduct_credits_for_action(self, user_id: str, action: str, difficulty: Optional[str] = None) -> bool:
        """Deduct credits for a specific action"""
        try:
            required_credits = self.get_credit_cost(action, difficulty)
            return deduct_credits(user_id, required_credits)
            
        except Exception as e:
            logger.error(f"Error deducting credits: {e}")
            return False
    
    def format_credit_cost_message(self, action: str, difficulty: Optional[str] = None) -> str:
        """Format credit cost message for user"""
        try:
            cost = self.get_credit_cost(action, difficulty)
            
            action_names = {
                'math': 'Mathematics Question',
                'science': 'Science Question',
                'english': 'English Question',
                'image_solve': 'Image Math Solving',
                'graph_generation': 'Graph Generation'
            }
            
            action_name = action_names.get(action, action.title())
            
            if difficulty:
                return f"💰 {action_name} ({difficulty.title()}): {cost} credits"
            else:
                return f"💰 {action_name}: {cost} credits"
                
        except Exception as e:
            logger.error(f"Error formatting credit message: {e}")
            return f"💰 Action: {self.get_credit_cost(action, difficulty)} credits"
    
    def get_credit_packages(self) -> List[Dict]:
        """Get available credit packages for purchase"""
        from services.payment_service import PaymentService
        payment_service = PaymentService()
        return payment_service.calculate_credit_packages()
    
    def can_use_feature(self, user_id: str, feature: str) -> bool:
        """Check if user can use a feature (has sufficient credits)"""
        try:
            credit_check = self.check_sufficient_credits(user_id, feature)
            return credit_check.get('sufficient', False)
        except Exception as e:
            logger.error(f"Error checking feature access: {e}")
            return False
    
    def deduct_credits(self, user_id: str, feature: str, difficulty: Optional[str] = None) -> bool:
        """Deduct credits for using a feature"""
        return self.deduct_credits_for_action(user_id, feature, difficulty)
    
    def calculate_bonus_credits(self, action: str, correct: bool = False, streak: int = 0) -> int:
        """Calculate bonus credits for user achievements"""
        try:
            bonus = 0
            
            # Bonus for correct answers
            if correct:
                bonus += 2
                
                # Streak bonus
                if streak >= 5:
                    bonus += 3
                elif streak >= 3:
                    bonus += 1
            
            # Special action bonuses
            if action == 'daily_login':
                bonus += 5
            elif action == 'weekly_challenge':
                bonus += 10
            elif action == 'referral_signup':
                bonus += 25
            
            return bonus
            
        except Exception as e:
            logger.error(f"Error calculating bonus credits: {e}")
            return 0
    
    def award_bonus_credits(self, user_id: str, amount: int, reason: str) -> bool:
        """Award bonus credits to user"""
        try:
            return add_credits(user_id, amount, reason)
        except Exception as e:
            logger.error(f"Error awarding bonus credits: {e}")
            return False
    
    def get_credit_history(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get user's credit transaction history"""
        try:
            # This would require a credit_transactions table
            # For now, return empty list
            # TODO: Implement credit transaction logging
            return []
            
        except Exception as e:
            logger.error(f"Error getting credit history: {e}")
            return []
    
    def validate_credit_amount(self, amount: int) -> bool:
        """Validate credit amount"""
        return isinstance(amount, int) and amount > 0 and amount <= 10000
    
    def format_credit_balance_message(self, user_id: str) -> str:
        """Format credit balance message"""
        try:
            credits = get_user_credits(user_id)
            
            if credits == 0:
                return "💳 You have 0 credits. Purchase more to continue learning!"
            elif credits < 10:
                return f"💳 You have {credits} credits remaining. Consider purchasing more soon."
            else:
                return f"💳 You have {credits} credits"
                
        except Exception as e:
            logger.error(f"Error formatting credit balance: {e}")
            return "💳 Unable to check credit balance"

# Global credit system instance
credit_system = CreditSystem()
