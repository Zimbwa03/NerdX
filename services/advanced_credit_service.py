import logging
from typing import Dict, Optional, List, Tuple
from datetime import datetime
from config import Config
from utils.credit_units import format_credits
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
            user_data = get_user_registration(user_id)
            # Use credits from users_registration table as primary source (units)
            current_credits = user_data.get('credits', 0) if user_data else 0
            
            return {
                'credits': current_credits,
                'is_low': current_credits <= self.low_credit_threshold,
                'user_name': user_data.get('name', 'Student') if user_data else 'Student',
                'can_afford_basic': current_credits >= 1 * Config.CREDIT_UNITS_PER_CREDIT,
                'can_afford_premium': current_credits >= 10 * Config.CREDIT_UNITS_PER_CREDIT,
                'low_credit_warning': current_credits <= 5 * Config.CREDIT_UNITS_PER_CREDIT
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
                return "Credits: 0"
            elif credits <= 5 * Config.CREDIT_UNITS_PER_CREDIT:
                return f"Credits: {format_credits(credits)} (Very Low!)"
            elif credits <= self.low_credit_threshold:
                return f"Credits: {format_credits(credits)} (Low)"
            else:
                return f"Credits: {format_credits(credits)}"
                
        except Exception as e:
            logger.error(f"Error formatting credit display: {e}")
            return "Credits: Error"
    
    def get_credit_cost_for_action(self, action: str, difficulty: Optional[str] = None) -> int:
        """Get credit cost for a specific action"""
        return self.get_credit_cost(action, difficulty)
    
    def refund_credits(self, user_id: str, amount: int, reason: str = "Refund"):
        """Refund credits to user account"""
        try:
            add_credits(user_id, amount, "refund", reason)
            return True
        except Exception as e:
            logger.error(f"Error refunding credits to {user_id}: {e}")
            return False

    def check_and_deduct_credits(self, user_id: str, action: str, difficulty: Optional[str] = None, platform: str = 'mobile') -> Dict:
        """
        Check if user has sufficient credits and deduct them
        
        Args:
            user_id: User ID
            action: Action key
            difficulty: Optional difficulty level
            platform: 'whatsapp' for WhatsApp bot (uses Option B), 'mobile' for mobile app (uses database)
        """
        try:
            # WhatsApp bot uses Option B with command bundling
            if platform == 'whatsapp':
                # Import command tracker for Option B implementation
                from services.command_credit_tracker import command_credit_tracker
                
                # Check if this is a command action (bundled: 1 credit = 2 commands)
                tracker_result = command_credit_tracker.should_deduct_credit(user_id, action)
                
                if not tracker_result.get('should_deduct', True):
                    # Command in bundle - don't deduct yet
                    commands_used = tracker_result.get('commands_used', 0)
                    commands_remaining = tracker_result.get('commands_remaining', 0)
                    
                    return {
                        'success': True,
                        'deducted': 0,
                        'is_bundled_command': True,
                        'commands_used': commands_used,
                        'commands_remaining': commands_remaining,
                        'message': f"✅ Command {commands_used} of 2 - No credit deducted yet. {commands_remaining} remaining in bundle."
                    }
            
            # Either not a command, or bundle complete, or mobile app - proceed with normal deduction
            current_credits = get_user_credits(user_id)
            required_credits = self.get_credit_cost(action, difficulty, platform=platform)
            
            # For commands when bundle is complete, use 1 credit (10 units)
            if tracker_result.get('is_command') and tracker_result.get('bundle_complete'):
                required_credits = 10  # 1 credit for 2 commands
            
            # Logic: verify locally first to save an RPC call if obviously insufficient
            if current_credits >= required_credits:
                # Deduct credits with proper transaction details
                transaction_type = f"{action}_usage"
                description = f"Used {action} feature"
                
                # Special description for bundled commands
                if tracker_result.get('is_command') and tracker_result.get('bundle_complete'):
                    description = f"Used 2 commands (bundle: {action})"
                
                # Use updated external_db.deduct_credits (atomic RPC preferred)
                if deduct_credits(user_id, required_credits, transaction_type, description):
                    # We fetch the new balance again or trust the change?
                    # Ideally deduct_credits returns the new balance but currently returns bool
                    # For UI responsiveness, we calculate locally. Sync happens via DB next fetch.
                    new_balance = current_credits - required_credits
                    
                    message = f"Credits deducted: {format_credits(required_credits)}. New balance: {format_credits(new_balance)}"
                    if tracker_result.get('is_command') and tracker_result.get('bundle_complete'):
                        message = f"✅ Bundle complete! 1 credit deducted for 2 commands. Balance: {format_credits(new_balance)}"
                    
                    return {
                        'success': True,
                        'deducted': required_credits,
                        'new_balance': new_balance,
                        'is_bundled_command': tracker_result.get('is_command', False),
                        'bundle_complete': tracker_result.get('bundle_complete', False),
                        'message': message
                    }
                else:
                    return {
                        'success': False,
                        'error': 'Failed to deduct credits',
                        'message': 'Error processing transaction'
                    }
            else:
                shortage = required_credits - current_credits
                return {
                    'success': False,
                    'insufficient': True,
                    'current_credits': current_credits,
                    'required_credits': required_credits,
                    'shortage': shortage,
                    'message': f"Insufficient credits. You need {format_credits(required_credits)} but have {format_credits(current_credits)}"
                }
                
        except Exception as e:
            logger.error(f"Error in check_and_deduct_credits: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': '❌ System error occurred'
            }
    
    def get_credit_cost(self, action: str, difficulty: Optional[str] = None, platform: str = 'mobile') -> int:
        """
        Get credit cost for a specific action
        
        Args:
            action: Action key (e.g., 'math_topical', 'combined_science_exam')
            difficulty: Optional difficulty level
            platform: 'whatsapp' for WhatsApp bot (uses Option B), 'mobile' for mobile app (uses database)
        
        Returns:
            Credit cost in units (10 units = 1 credit)
        """
        try:
            # WhatsApp bot uses Option B costs from config.py (not database)
            if platform == 'whatsapp':
                # Use Option B costs from config.py
                from config import Config
                option_b_cost = Config.CREDIT_COSTS.get(action)
                if option_b_cost is not None:
                    logger.debug(f"WhatsApp Option B cost for '{action}': {option_b_cost} units")
                    return option_b_cost
                # Fallback to mapped action if direct lookup fails
                action_mapping = self._get_action_mapping()
                mapped_action = action_mapping.get(action, action)
                option_b_cost = Config.CREDIT_COSTS.get(mapped_action)
                if option_b_cost is not None:
                    logger.debug(f"WhatsApp Option B cost for '{action}' (mapped to '{mapped_action}'): {option_b_cost} units")
                    return option_b_cost
                # Final fallback
                logger.warning(f"WhatsApp: No Option B cost found for '{action}', using fallback: 10 units")
                return 10  # Default 1 credit for WhatsApp
            
            # Mobile app uses database (original behavior - UNCHANGED)
            # Import here to avoid circular imports
            from database.credit_costs_db import credit_cost_service
            
            # Map actions to standardized keys
            action_mapping = self._get_action_mapping()
            
            # Get the mapped action key
            mapped_action = action_mapping.get(action, action)
            
            # Get cost from database service (falls back to config if database unavailable)
            cost = credit_cost_service.get_credit_cost(mapped_action)
            
            logger.debug(f"Mobile app credit cost for '{action}' (mapped to '{mapped_action}') with difficulty '{difficulty}': {cost}")
            return cost
            
        except Exception as e:
            logger.error(f"Error getting credit cost for '{action}': {e}")
            # Fallback to config values if database service fails
            fallback_cost = self.credit_costs.get(action, 5)
            logger.warning(f"Using fallback cost for '{action}': {fallback_cost}")
            return fallback_cost
    
    def _get_action_mapping(self) -> dict:
        """Get action key mapping dictionary"""
        return {
            # Combined Science
            'combined_science_topical': 'combined_science_topical',
            'combined_science_topical_mcq': 'combined_science_topical_mcq',
            'combined_science_topical_structured': 'combined_science_topical_structured',
            'combined_science_exam': 'combined_science_exam',

            # Computer Science (O-Level) – MCQ 0.3, Structured 0.5, Essay 1
            'computer_science_topical_mcq': 'computer_science_topical_mcq',
            'computer_science_topical_structured': 'computer_science_topical_structured',
            'computer_science_topical_essay': 'computer_science_topical_essay',
            'computer_science_exam_mcq': 'computer_science_exam_mcq',
            'computer_science_exam_structured': 'computer_science_exam_structured',
            'computer_science_exam_essay': 'computer_science_exam_essay',

            # Mathematics
            'math_topical': 'math_topical',
            'math_exam': 'math_exam',
            'math_quiz': 'math_quiz',
            'math_graph_practice': 'math_graph_practice',
            'graph_practice': 'math_graph_practice',
            
            # English
            'english_topical': 'english_topical',
            'english_comprehension': 'english_comprehension',
            'english_essay_writing': 'english_essay_writing',
            'english_essay_marking': 'english_essay_marking',
            'english_comprehension_grading': 'english_comprehension_grading',
            'english_summary_grading': 'english_summary_grading',
            
            # Audio Features
            'audio_feature': 'audio_feature',
            'voice_chat': 'voice_chat',

            # Flashcards
            'flashcard_single': 'flashcard_single',
            
            # Legacy mappings - map to new standardized keys
            'math': 'math_topical',
            'science': 'combined_science_topical',
            'english': 'english_topical',
            'image_solve': 'image_solve',
            'graph_generation': 'math_graph_practice',

            # A-Level mappings
            'a_level_pure_math_topical': 'a_level_pure_math_topical',
            'a_level_pure_math_topical_mcq': 'a_level_pure_math_topical_mcq',
            'a_level_pure_math_topical_structured': 'a_level_pure_math_topical_structured',
            'a_level_pure_math_exam': 'a_level_pure_math_exam',
            'a_level_chemistry_topical': 'a_level_chemistry_topical',
            'a_level_chemistry_topical_mcq': 'a_level_chemistry_topical_mcq',
            'a_level_chemistry_topical_structured': 'a_level_chemistry_topical_structured',
            'a_level_chemistry_exam': 'a_level_chemistry_exam',
            'a_level_physics_topical': 'a_level_physics_topical',
            'a_level_physics_topical_mcq': 'a_level_physics_topical_mcq',
            'a_level_physics_topical_structured': 'a_level_physics_topical_structured',
            'a_level_physics_exam': 'a_level_physics_exam',
            'a_level_biology_topical_mcq': 'a_level_biology_topical_mcq',
            'a_level_biology_topical_structured': 'a_level_biology_topical_structured',
            'a_level_biology_topical_essay': 'a_level_biology_topical_essay',
            'a_level_biology_exam_mcq': 'a_level_biology_exam_mcq',
            'a_level_biology_exam_structured': 'a_level_biology_exam_structured',
            'a_level_biology_exam_essay': 'a_level_biology_exam_essay',

            # Project assistant
            'project_assistant_start': 'project_assistant_start',
            'project_assistant_followup': 'project_assistant_followup',
            'project_assistant_batch': 'project_assistant_batch',
            'project_web_search': 'project_web_search',
            'project_deep_research': 'project_deep_research',
            'project_transcribe': 'project_transcribe',
            'project_image_generation': 'project_image_generation',

            # Virtual lab
            'virtual_lab_knowledge_check': 'virtual_lab_knowledge_check',
            'programming_lab_ai': 'programming_lab_ai',
        }
    
    def award_registration_credits(self, user_id: str) -> bool:
        """Award registration bonus credits to new user"""
        try:
            if add_credits(user_id, self.registration_bonus, "Registration bonus"):
                logger.info(f"Awarded {self.registration_bonus} units to new user {user_id}")
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
            
            message = f"""**GREAT NEWS!**

Hey there!

**{new_user_name}** just registered using your referral link!

**Your Reward:**
+{format_credits(self.referral_bonus)} Credits Added!
New Balance: {format_credits(new_balance)} credits

Keep sharing to earn more credits!

Continue"""
            
            # Send with continue button to not disrupt flow
            buttons = [{"text": "Continue", "callback_data": "continue_current"}]
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
                
                message = f"""**Insufficient Credits**

Your Balance: {current_credits} credits
Required: {required_credits} credits
Need: {shortage} more credits

**Quick Options:**
Buy Credits Now
Refer Friends (+{self.referral_bonus} credits each)
Contact Support
Back to Menu"""
                
                buttons = [
                    {"text": "Buy Credits Now", "callback_data": "buy_credits"},
                    {"text": f"Refer Friends (+{self.referral_bonus} credits)", "callback_data": "refer_friends"},
                    {"text": "Contact Support", "callback_data": "contact_support"},
                    {"text": "Back to Menu", "callback_data": "back_to_menu"}
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
            
            message = f"""**Transaction Completed**

**Service**: {action_name}
**Cost**: {required_credits} credits
**New Balance**: {current_credits} credits

**Ready to learn!**"""
            
            # Add low credit warning if applicable
            if status['is_low']:
                message += f"\n\n**Low Credit Warning**: You have {current_credits} credits remaining. Consider buying more soon!"
            
            return message
            
        except Exception as e:
            logger.error(f"Error processing successful transaction: {e}")
            return "Transaction completed successfully!"
    
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
                add_xp(user_id, xp_gained, action, f'Achievement bonus: {action}')
                update_streak(user_id)  # Increment streak
            
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
        """Format credit store message with artistic design and optimized button text"""
        try:
            status = self.get_user_credit_status(user_id)
            current_credits = status['credits']
            packages = self.get_credit_packages()
            
            # Clean header
            message = f"""**CREDIT STORE**

**PREMIUM PLANS**

**Your Balance:** {current_credits} credits

**Choose Your Power:**"""
            
            buttons = []
            for package in packages:
                # Fallback for missing icon field
                icon = package.get('icon', '')
                name = package.get('name', 'Package')
                price = package.get('price', 0)
                credits = package.get('credits', 0)
                package_id = package.get('id', 'unknown')
                
                # Compact button text to prevent truncation
                button_text = f"{credits}cr • ${price:.2f}"
                callback_data = f"select_package_{package_id}"
                buttons.append({"text": button_text, "callback_data": callback_data})
            
            # Add back button
            buttons.append({"text": "Back to Menu", "callback_data": "back_to_menu"})
            
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
