"""
WhatsApp Template Service - Handles approved message templates with variable substitution
Complies with WhatsApp Business Policy requirements
"""
import logging
import re
import time
from typing import Dict, List, Optional, Any
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from services.whatsapp_service import WhatsAppService

logger = logging.getLogger(__name__)

class WhatsAppTemplateService:
    """Service for sending WhatsApp Business API approved message templates"""
    
    def __init__(self, whatsapp_service: 'WhatsAppService'):
        self.whatsapp_service = whatsapp_service
        self.template_cache = {}
        self.template_usage_stats = {}
        
        # Approved template definitions (these must match what's submitted to Meta)
        self.approved_templates = {
            'nerdx_welcome_consent': {
                'name': 'nerdx_welcome_consent',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Welcome to NerdX ZIMSEC Study Bot. This WhatsApp bot works with the NerdX mobile app for Form {{1}} {{2}} studies. Consent required: reply YES to start or NO to decline. We will send educational content, track progress, and send study reminders. Reply STOP to unsubscribe or HELP for support. Business: Neuronet AI Solutions Pvt Ltd (Zimbabwe).""",
                'variables': ['form_level', 'subject_name']
            },
            
            'nerdx_quiz_mcq': {
                'name': 'nerdx_quiz_mcq',
                'category': 'UTILITY',
                'language': 'en',
                'body': """NerdX Quiz: {{1}} - {{2}}. Question {{3}} of {{4}}. {{5}} A) {{6}} B) {{7}} C) {{8}} D) {{9}} Reply with A, B, C, or D. Cost: {{10}} credits.""",
                'variables': ['subject', 'topic', 'question_num', 'total_questions', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'credit_cost']
            },
            
            'nerdx_answer_correct': {
                'name': 'nerdx_answer_correct',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Correct. {{1}} Progress: Streak {{2}}, Score {{3}}, Accuracy {{4}} percent. {{5}} Reply CONTINUE for next question or MENU to return home.""",
                'variables': ['explanation', 'streak', 'total_score', 'accuracy', 'encouragement']
            },
            
            'nerdx_answer_incorrect': {
                'name': 'nerdx_answer_incorrect',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Incorrect. The correct answer is {{1}}. Explanation: {{2}} Progress: Score {{3}}, Accuracy {{4}} percent. Reply CONTINUE for next question or MENU to return home.""",
                'variables': ['correct_answer', 'explanation', 'score', 'accuracy']
            },
            
            'nerdx_registration_complete': {
                'name': 'nerdx_registration_complete',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Registration successful. Welcome {{1}}. Your NerdX ID is {{2}}. Free credits: {{3}}. Starting level: Form {{4}}. Reply MENU to start learning.""",
                'variables': ['student_name', 'nerdx_id', 'starting_credits', 'form_level']
            },
            
            'nerdx_study_reminder': {
                'name': 'nerdx_study_reminder',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Daily practice reminder. Hi {{1}}. Yesterday: {{2}} questions, {{3}} percent accuracy, {{4}} credits remaining. Continue {{5}} - {{6}}. Reply STUDY to continue or CHANGE to switch subject. Reply STOP to unsubscribe.""",
                'variables': ['student_name', 'yesterday_questions', 'yesterday_accuracy', 'remaining_credits', 'subject', 'topic']
            },
            
            'nerdx_achievement': {
                'name': 'nerdx_achievement',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Achievement unlocked: {{1}}. Congratulations {{2}}. Stats: Total questions {{3}}, Accuracy {{4}} percent, Study streak {{5}} days, Rank {{6}}. Bonus: {{7}} credits earned. Reply MENU to continue.""",
                'variables': ['achievement_name', 'student_name', 'total_questions', 'accuracy', 'study_streak', 'rank', 'bonus_credits']
            },
            
            'nerdx_credit_warning': {
                'name': 'nerdx_credit_warning',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Low credits alert. Hi {{1}}, you have {{2}} credits left. Reply TOPUP for payment options or REFER for your referral link. Reply STOP to unsubscribe.""",
                'variables': ['student_name', 'remaining_credits']
            },
            
            'nerdx_session_complete': {
                'name': 'nerdx_session_complete',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Study session complete. Well done {{1}}. Summary: Questions {{2}}, Correct {{3}} ({{4}} percent), Credits used {{5}}, Time {{6}} minutes. Mastery: {{7}} {{8}} percent. {{9}} Reply RETRY, MENU, or STATS.""",
                'variables': ['student_name', 'total_questions', 'correct_answers', 'accuracy', 'credits_used', 'duration', 'subject_topic', 'mastery_percentage', 'feedback']
            },
            
            'nerdx_support': {
                'name': 'nerdx_support',
                'category': 'UTILITY',
                'language': 'en',
                'body': """NerdX Support. Company: Neuronet AI Solutions Pvt Ltd (Reg 51491A0272025). Address: 9 Munino Mufakose, Harare, Zimbabwe. Email: info@neuronet.co.zw. Phone: +263 5494594. Hours: Mon-Fri 8 AM-6 PM CAT, Sat 9 AM-2 PM CAT. Reply CREDITS for payment help, TECHNICAL for tech support, ACCOUNT for account issues, or MENU for options. Reply STOP to unsubscribe.""",
                'variables': []
            },
            
            # Alias for unsubscribe confirmation (plan name)
            'nerdx_unsubscribe_confirmation': {
                'name': 'nerdx_unsubscribe_confirmation',
                'category': 'UTILITY',
                'language': 'en',
                'body': "You have been unsubscribed from NerdX notifications. Reply START to subscribe again.",
                'variables': []
            },
            
            'nerdx_unsubscribe': {
                'name': 'nerdx_unsubscribe',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Unsubscribe confirmed. {{1}}, you are unsubscribed from NerdX Study Bot. Your progress and credits are saved. Reply SUBSCRIBE or send any message to resubscribe. Feedback: info@neuronet.co.zw. Thank you for using NerdX.""",
                'variables': ['student_name']
            },
            
            'nerdx_privacy_policy': {
                'name': 'nerdx_privacy_policy',
                'category': 'UTILITY',
                'language': 'en',
                'body': """NerdX privacy: We collect name and phone number, learning progress, subject preferences, and credit usage to provide the service. Data is stored securely and not sold. You can request access or deletion and opt out anytime. Full policy: neuronet.co.zw/privacy. Questions: info@neuronet.co.zw.""",
                'variables': []
            },
            
            'nerdx_error_retry': {
                'name': 'nerdx_error_retry',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Technical error. Error code {{1}} at {{2}}. Reply RETRY to try again, MENU for home, or SUPPORT for help. Support: info@neuronet.co.zw, +263 5494594.""",
                'variables': ['error_code', 'timestamp']
            },

            # Low credits notification (plan: nerdx_low_credits)
            'nerdx_low_credits': {
                'name': 'nerdx_low_credits',
                'category': 'UTILITY',
                'language': 'en',
                'body': "You have {{1}} credits left. Get more to continue learning. Buy credits: {{2}}.",
                'variables': ['credits', 'buy_url']
            },

            # Payment lifecycle
            'nerdx_payment_pending': {
                'name': 'nerdx_payment_pending',
                'category': 'UTILITY',
                'language': 'en',
                'body': "Payment received for review. Ref {{1}}, Amount {{2}}. We will notify you when approved.",
                'variables': ['reference', 'amount']
            },
            'nerdx_payment_approved': {
                'name': 'nerdx_payment_approved',
                'category': 'UTILITY',
                'language': 'en',
                'body': "Payment approved. Ref {{1}}. {{2}} credits added. Thank you.",
                'variables': ['reference', 'credits']
            },
            'nerdx_payment_rejected': {
                'name': 'nerdx_payment_rejected',
                'category': 'UTILITY',
                'language': 'en',
                'body': "We could not verify your payment (Ref {{1}}). Please resubmit proof or contact support.",
                'variables': ['reference']
            },

            # Referral templates
            'nerdx_referral_invite': {
                'name': 'nerdx_referral_invite',
                'category': 'MARKETING',
                'language': 'en',
                'body': "Study with NerdX and earn bonus credits. Share your code {{1}} with a friend. They get welcome credits; you earn {{2}} when they register. Reply STOP to unsubscribe.",
                'variables': ['referral_code', 'bonus']
            },
            'nerdx_referral_reward': {
                'name': 'nerdx_referral_reward',
                'category': 'UTILITY',
                'language': 'en',
                'body': "You earned {{1}} bonus credits for referring {{2}}. Keep sharing your code: {{3}}.",
                'variables': ['bonus', 'name', 'code']
            },

            # Maintenance
            'nerdx_maintenance': {
                'name': 'nerdx_maintenance',
                'category': 'UTILITY',
                'language': 'en',
                'body': "NerdX is undergoing maintenance. Service resumes at {{1}}. Thanks for your patience.",
                'variables': ['resume_time']
            },

            # Re-engagement reminder (Marketing)
            'nerdx_reengage_study_reminder': {
                'name': 'nerdx_reengage_study_reminder',
                'category': 'MARKETING',
                'language': 'en',
                'body': "Ready to continue {{1}}? New practice sets are available. Reply MENU to start. Reply STOP to unsubscribe.",
                'variables': ['subject']
            },

            # Registration confirmation (alias to existing)
            'nerdx_registration_confirmation': {
                'name': 'nerdx_registration_confirmation',
                'category': 'UTILITY',
                'language': 'en',
                'body': "Hi {{1}}, your NerdX account is set up. Your NerdX ID is {{2}}. Welcome credits: {{3}}. Reply MENU to see options.",
                'variables': ['name', 'nerdx_id', 'credits']
            },

            # Resubscribe confirmation
            'nerdx_resubscribe_confirmation': {
                'name': 'nerdx_resubscribe_confirmation',
                'category': 'UTILITY',
                'language': 'en',
                'body': "You are now subscribed to NerdX study updates. Reply STOP to unsubscribe anytime.",
                'variables': []
            },
            
            'nerdx_referral_success': {
                'name': 'nerdx_referral_success',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Referral bonus unlocked. Great news {{1}}. {{2}} joined using your referral code. You earned {{3}} credits; {{2}} received {{4}} credits. Total referrals {{5}}, total earned {{6}} credits. Your referral code: {{7}}. Reply MENU to continue.""",
                'variables': ['referrer_name', 'new_user_name', 'referrer_credits', 'new_user_credits', 'total_referrals', 'total_earned', 'referral_code']
            },
            
            'nerdx_payment_confirmed': {
                'name': 'nerdx_payment_confirmed',
                'category': 'UTILITY',
                'language': 'en',
                'body': """Payment received. Thank you {{1}}. Amount {{2}} USD, Credits added {{3}}, Payment method {{4}}, Transaction ID {{5}}, Date {{6}}. New balance {{7}} credits. Reply STUDY to continue or MENU for options. Support: info@neuronet.co.zw, +263 5494594.""",
                'variables': ['student_name', 'amount', 'credits_added', 'payment_method', 'transaction_id', 'date', 'new_balance']
            }
        }
    
    def send_template_message(self, to: str, template_name: str, variables: Dict[str, Any] = None) -> bool:
        """Send a WhatsApp Business API template message with variable substitution"""
        try:
            if template_name not in self.approved_templates:
                logger.error(f"Template {template_name} not found in approved templates")
                return False
            
            template = self.approved_templates[template_name]
            variables = variables or {}
            
            # Substitute variables in template body
            message_body = self._substitute_variables(template['body'], template['variables'], variables)
            
            # Track template usage
            self._track_template_usage(template_name)
            
            # Send using existing WhatsApp service
            return self.whatsapp_service.send_message(to, message_body)
            
        except Exception as e:
            logger.error(f"Error sending template message {template_name} to {to}: {e}")
            return False
    
    def _substitute_variables(self, template_body: str, expected_variables: List[str], provided_variables: Dict[str, Any]) -> str:
        """Substitute variables in template body using {{1}}, {{2}} format"""
        try:
            result = template_body
            for i, var_name in enumerate(expected_variables, 1):
                placeholder = f"{{{{{i}}}}}"
                value = provided_variables.get(var_name, f"[{var_name}]")
                result = result.replace(placeholder, str(value))
            
            return result
            
        except Exception as e:
            logger.error(f"Error substituting variables in template: {e}")
            return template_body
    
    def _track_template_usage(self, template_name: str):
        """Track template usage for analytics and compliance monitoring"""
        try:
            current_time = time.time()
            
            if template_name not in self.template_usage_stats:
                self.template_usage_stats[template_name] = {
                    'total_uses': 0,
                    'last_used': 0,
                    'daily_uses': 0,
                    'last_reset': current_time
                }
            
            stats = self.template_usage_stats[template_name]
            stats['total_uses'] += 1
            stats['last_used'] = current_time
            
            # Reset daily counter if it's a new day
            if current_time - stats['last_reset'] > 86400:  # 24 hours
                stats['daily_uses'] = 1
                stats['last_reset'] = current_time
            else:
                stats['daily_uses'] += 1
                
        except Exception as e:
            logger.error(f"Error tracking template usage: {e}")
    
    def get_template_usage_stats(self) -> Dict[str, Dict]:
        """Get usage statistics for all templates"""
        return self.template_usage_stats.copy()
    
    def validate_template_variables(self, template_name: str, variables: Dict[str, Any]) -> bool:
        """Validate that all required variables are provided for a template"""
        try:
            if template_name not in self.approved_templates:
                return False
            
            template = self.approved_templates[template_name]
            required_vars = set(template['variables'])
            provided_vars = set(variables.keys())
            
            missing_vars = required_vars - provided_vars
            if missing_vars:
                logger.warning(f"Missing variables for template {template_name}: {missing_vars}")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Error validating template variables: {e}")
            return False
    
    def get_available_templates(self) -> List[str]:
        """Get list of all available approved templates"""
        return list(self.approved_templates.keys())
    
    def is_template_approved(self, template_name: str) -> bool:
        """Check if a template is in the approved list"""
        return template_name in self.approved_templates

    def get_template_compliance_issues(self) -> Dict[str, List[str]]:
        """Check templates for common compliance risks and formatting pitfalls."""
        issues: Dict[str, List[str]] = {}
        for template_name, template in self.approved_templates.items():
            body = template.get('body', '')
            category = template.get('category', '').upper()
            body_stripped = body.strip()
            template_issues: List[str] = []

            # Placeholders must not be at the beginning or end
            if body_stripped.startswith('{{'):
                template_issues.append('Body starts with a variable placeholder')
            if body_stripped.endswith('}}'):
                template_issues.append('Body ends with a variable placeholder')

            # Avoid emojis or non-ASCII characters in templates
            if any(ord(ch) > 127 for ch in body):
                template_issues.append('Body contains non-ASCII characters')

            # Marketing templates should include opt-out language
            if category == 'MARKETING':
                if not re.search(r'\bSTOP\b', body, flags=re.IGNORECASE):
                    template_issues.append('Marketing template missing STOP opt-out')

            # Authentication templates should mention a code
            if category == 'AUTHENTICATION':
                if not re.search(r'\bcode\b', body, flags=re.IGNORECASE):
                    template_issues.append('Authentication template missing code reference')

            if template_issues:
                issues[template_name] = template_issues

        return issues

    def templates_are_compliant(self) -> bool:
        """Return True when no compliance issues are detected."""
        return len(self.get_template_compliance_issues()) == 0

# Global instance
whatsapp_template_service = None

def get_template_service(whatsapp_service: 'WhatsAppService' = None) -> WhatsAppTemplateService:
    """Get or create global template service instance"""
    global whatsapp_template_service
    if whatsapp_template_service is None and whatsapp_service:
        whatsapp_template_service = WhatsAppTemplateService(whatsapp_service)
    return whatsapp_template_service



