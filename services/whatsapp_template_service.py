"""
WhatsApp Template Service - Handles approved message templates with variable substitution
Complies with WhatsApp Business Policy requirements
"""
import logging
import time
from typing import Dict, List, Optional, Any
from services.whatsapp_service import WhatsAppService

logger = logging.getLogger(__name__)

class WhatsAppTemplateService:
    """Service for sending WhatsApp Business API approved message templates"""
    
    def __init__(self, whatsapp_service: WhatsAppService):
        self.whatsapp_service = whatsapp_service
        self.template_cache = {}
        self.template_usage_stats = {}
        
        # Approved template definitions (these must match what's submitted to Meta)
        self.approved_templates = {
            'nerdx_welcome_consent': {
                'name': 'nerdx_welcome_consent',
                'category': 'UTILITY',
                'language': 'en',
                'body': """🎓 Welcome to NerdX ZIMSEC Study Bot!

Your AI-powered companion for Form {{1}} {{2}} studies.

⚖️ CONSENT REQUIRED
To comply with WhatsApp Business Policy, we need your permission to:
• Send educational content and quiz questions
• Track your learning progress
• Send study reminders

✅ Reply YES to start learning
❌ Reply NO to decline

Business: Neuronet AI Solutions Pvt Ltd
Reg: 51491A0272025 | Zimbabwe""",
                'variables': ['form_level', 'subject_name']
            },
            
            'nerdx_quiz_mcq': {
                'name': 'nerdx_quiz_mcq',
                'category': 'UTILITY',
                'language': 'en',
                'body': """📚 {{1}} - {{2}}
Question {{3}} of {{4}}

{{5}}

A) {{6}}
B) {{7}}
C) {{8}}
D) {{9}}

⏱️ Select your answer
💡 Cost: {{10}} credits

NerdX | Powered by Neuronet AI""",
                'variables': ['subject', 'topic', 'question_num', 'total_questions', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'credit_cost']
            },
            
            'nerdx_answer_correct': {
                'name': 'nerdx_answer_correct',
                'category': 'UTILITY',
                'language': 'en',
                'body': """✅ *Correct Answer!*

{{1}}

📊 Your Progress:
• Streak: {{2}} in a row
• Total Score: {{3}} points
• Accuracy: {{4}}%

🎯 {{5}}

Reply CONTINUE for next question
Reply MENU to return home

NerdX ZIMSEC Study Bot""",
                'variables': ['explanation', 'streak', 'total_score', 'accuracy', 'encouragement']
            },
            
            'nerdx_answer_incorrect': {
                'name': 'nerdx_answer_incorrect',
                'category': 'UTILITY',
                'language': 'en',
                'body': """❌ *Incorrect*

The correct answer is: {{1}}

💡 Explanation:
{{2}}

📊 Progress:
• Score: {{3}} points
• Accuracy: {{4}}%

Don't give up! Learning from mistakes helps you grow. 💪

Reply CONTINUE for next question
Reply MENU to return home

NerdX Study Companion""",
                'variables': ['correct_answer', 'explanation', 'score', 'accuracy']
            },
            
            'nerdx_registration_complete': {
                'name': 'nerdx_registration_complete',
                'category': 'UTILITY',
                'language': 'en',
                'body': """🎉 *Registration Successful!*

Welcome {{1}}! Your NerdX ID: {{2}}

📚 FREE CREDITS: {{3}} credits
📊 Starting Level: Form {{4}}

*What you can do:*
✓ Practice ZIMSEC questions
✓ Track your progress
✓ Earn achievements
✓ Get detailed explanations

Reply MENU to start learning!

Neuronet AI Solutions | Zimbabwe
Reg: 51491A0272025""",
                'variables': ['student_name', 'nerdx_id', 'starting_credits', 'form_level']
            },
            
            'nerdx_study_reminder': {
                'name': 'nerdx_study_reminder',
                'category': 'UTILITY',
                'language': 'en',
                'body': """📖 Hi {{1}}! Time for your daily practice

📊 Yesterday's Progress:
• {{2}} questions completed
• {{3}}% accuracy
• {{4}} credits remaining

🎯 Today's Goal:
Continue {{5}} - {{6}}

Reply STUDY to continue learning
Reply CHANGE to switch subject

"Small daily progress leads to big results" 🌟

NerdX ZIMSEC Study Bot
Zimbabwe's #1 Study Companion""",
                'variables': ['student_name', 'yesterday_questions', 'yesterday_accuracy', 'remaining_credits', 'subject', 'topic']
            },
            
            'nerdx_achievement': {
                'name': 'nerdx_achievement',
                'category': 'UTILITY',
                'language': 'en',
                'body': """🏆 *ACHIEVEMENT UNLOCKED!*

{{1}}

Congratulations {{2}}!

📈 Your Stats:
• Total Questions: {{3}}
• Accuracy: {{4}}%
• Study Streak: {{5}} days
• Rank: {{6}}

🎁 Bonus: {{7}} credits earned!

Keep up the excellent work! You're making amazing progress in your ZIMSEC journey.

NerdX | Neuronet AI Solutions""",
                'variables': ['achievement_name', 'student_name', 'total_questions', 'accuracy', 'study_streak', 'rank', 'bonus_credits']
            },
            
            'nerdx_credit_warning': {
                'name': 'nerdx_credit_warning',
                'category': 'UTILITY',
                'language': 'en',
                'body': """⚠️ *Low Credits Alert*

Hi {{1}}, you have {{2}} credits left.

💳 Top-Up Options:
• 50 credits - $1 USD
• 120 credits - $2 USD
• 350 credits - $5 USD

💰 Payment via EcoCash or OneMoney

🎁 Refer friends to earn FREE credits!

Reply TOPUP to add credits
Reply REFER to get your referral link

NerdX Study Bot | Zimbabwe
Contact: info@neuronet.co.zw""",
                'variables': ['student_name', 'remaining_credits']
            },
            
            'nerdx_session_complete': {
                'name': 'nerdx_session_complete',
                'category': 'UTILITY',
                'language': 'en',
                'body': """✅ *Study Session Complete!*

Excellent work {{1}}! 🌟

📊 Session Summary:
• Questions Answered: {{2}}
• Correct: {{3}} ({{4}}%)
• Credits Used: {{5}}
• Time: {{6}} minutes

🎯 Mastery Level:
{{7}}: {{8}}%

{{9}}

Reply RETRY to practice again
Reply MENU for main menu
Reply STATS for detailed progress

NerdX ZIMSEC | Neuronet AI Solutions
Building Zimbabwe's Future Leaders""",
                'variables': ['student_name', 'total_questions', 'correct_answers', 'accuracy', 'credits_used', 'duration', 'subject_topic', 'mastery_percentage', 'feedback']
            },
            
            'nerdx_support': {
                'name': 'nerdx_support',
                'category': 'UTILITY',
                'language': 'en',
                'body': """📞 *NerdX Support Information*

Company: Neuronet AI Solutions Pvt Ltd
Registration: 51491A0272025

📍 Address:
9 Munino Mufakose
Harare, Zimbabwe

📧 Email: info@neuronet.co.zw
📱 Phone: +263 5494594
🌐 Web: neuronet.co.zw

⏰ Support Hours:
Monday-Friday: 8 AM - 6 PM CAT
Saturday: 9 AM - 2 PM CAT

💬 Common Issues:
Reply CREDITS for payment help
Reply TECHNICAL for tech support
Reply ACCOUNT for account issues

Response time: Within 24 hours

We're here to help your learning journey!""",
                'variables': []
            },
            
            # Alias for unsubscribe confirmation (plan name)
            'nerdx_unsubscribe_confirmation': {
                'name': 'nerdx_unsubscribe_confirmation',
                'category': 'UTILITY',
                'language': 'en',
                'body': "✋ You have been unsubscribed from NerdX notifications. You can reply START to subscribe again.",
                'variables': []
            },
            
            'nerdx_unsubscribe': {
                'name': 'nerdx_unsubscribe',
                'category': 'UTILITY',
                'language': 'en',
                'body': """✋ *Unsubscribe Confirmed*

{{1}}, you've been successfully unsubscribed from NerdX Study Bot.

Your data:
• Account preserved for 12 months
• Progress saved
• Credits retained

To resubscribe anytime:
Reply SUBSCRIBE or send any message

📧 Feedback: info@neuronet.co.zw
We value your feedback to improve our service.

Thank you for using NerdX!

Neuronet AI Solutions Pvt Ltd
Zimbabwe | Reg: 51491A0272025""",
                'variables': ['student_name']
            },
            
            'nerdx_privacy_policy': {
                'name': 'nerdx_privacy_policy',
                'category': 'UTILITY',
                'language': 'en',
                'body': """🔒 *NerdX Privacy Policy*

Your privacy is important to us.

📋 What we collect:
• Name and phone number
• Learning progress and quiz responses
• Subject preferences
• Credit usage data

🛡️ Data Protection:
• Encrypted secure storage
• No third-party sharing
• Zimbabwe Data Protection compliant
• 12-month retention policy

✅ Your Rights:
• Access your data
• Request deletion
• Opt-out anytime
• Data portability

📄 Full policy: neuronet.co.zw/privacy

Questions? info@neuronet.co.zw

Neuronet AI Solutions Pvt Ltd
Reg: 51491A0272025 | Zimbabwe""",
                'variables': []
            },
            
            'nerdx_error_retry': {
                'name': 'nerdx_error_retry',
                'category': 'UTILITY',
                'language': 'en',
                'body': """⚠️ *Technical Error*

We encountered an issue processing your request.

Error Code: {{1}}
Time: {{2}}

Please try:
1. Reply RETRY to try again
2. Reply MENU to return home
3. Reply SUPPORT for assistance

If issue persists:
📧 info@neuronet.co.zw
📱 +263 5494594

We apologize for the inconvenience and are working to resolve this quickly.

NerdX Support Team
Neuronet AI Solutions | Zimbabwe""",
                'variables': ['error_code', 'timestamp']
            },

            # Low credits notification (plan: nerdx_low_credits)
            'nerdx_low_credits': {
                'name': 'nerdx_low_credits',
                'category': 'UTILITY',
                'language': 'en',
                'body': "You have {{1}} credits left. Get more to continue learning.\n\nBuy credits: {{2}}",
                'variables': ['credits', 'buy_url']
            },

            # Payment lifecycle
            'nerdx_payment_pending': {
                'name': 'nerdx_payment_pending',
                'category': 'UTILITY',
                'language': 'en',
                'body': "Payment received for review. Ref: {{1}}, Amount: {{2}}. We’ll notify you when approved.",
                'variables': ['reference', 'amount']
            },
            'nerdx_payment_approved': {
                'name': 'nerdx_payment_approved',
                'category': 'UTILITY',
                'language': 'en',
                'body': "Payment approved. Ref: {{1}}. {{2}} credits added. Thank you!",
                'variables': ['reference', 'credits']
            },
            'nerdx_payment_rejected': {
                'name': 'nerdx_payment_rejected',
                'category': 'UTILITY',
                'language': 'en',
                'body': "We couldn’t verify your payment (Ref: {{1}}). Please resubmit proof or contact support.",
                'variables': ['reference']
            },

            # Referral templates
            'nerdx_referral_invite': {
                'name': 'nerdx_referral_invite',
                'category': 'MARKETING',
                'language': 'en',
                'body': "Study with NerdX and earn bonus credits. Share your code {{1}} with a friend. They get welcome credits; you earn {{2}} when they register. Reply STOP to opt out.",
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
                'body': "Ready to continue {{1}}? New practice sets are available. Reply MENU to start. Reply STOP to opt out.",
                'variables': ['subject']
            },

            # Registration confirmation (alias to existing)
            'nerdx_registration_confirmation': {
                'name': 'nerdx_registration_confirmation',
                'category': 'UTILITY',
                'language': 'en',
                'body': "Hi {{1}}, your NerdX account is set up. NerdX ID: {{2}}. Welcome credits: {{3}}. Reply MENU to see options.",
                'variables': ['name', 'nerdx_id', 'credits']
            },

            # Resubscribe confirmation
            'nerdx_resubscribe_confirmation': {
                'name': 'nerdx_resubscribe_confirmation',
                'category': 'UTILITY',
                'language': 'en',
                'body': "You are now subscribed to NerdX study updates. You can reply STOP to unsubscribe anytime.",
                'variables': []
            },
            
            'nerdx_referral_success': {
                'name': 'nerdx_referral_success',
                'category': 'UTILITY',
                'language': 'en',
                'body': """🎁 *Referral Bonus Unlocked!*

Great news {{1}}!

{{2}} just joined using your referral code!

💰 Rewards:
• You earned: {{3}} credits
• {{2}} received: {{4}} credits

📊 Referral Stats:
• Total Referrals: {{5}}
• Total Earned: {{6}} credits

Your Referral Code: {{7}}

Share your code:
"Join NerdX with my code {{7}} and get {{4}} FREE credits!"

Keep sharing and earning! 🚀

NerdX | Neuronet AI Solutions""",
                'variables': ['referrer_name', 'new_user_name', 'referrer_credits', 'new_user_credits', 'total_referrals', 'total_earned', 'referral_code']
            },
            
            'nerdx_payment_confirmed': {
                'name': 'nerdx_payment_confirmed',
                'category': 'UTILITY',
                'language': 'en',
                'body': """✅ *Payment Received!*

Thank you {{1}}!

💳 Transaction Details:
• Amount: ${{2}} USD
• Credits Added: {{3}}
• Payment Method: {{4}}
• Transaction ID: {{5}}
• Date: {{6}}

💰 New Balance: {{7}} credits

Receipt sent to your number.

🎓 Ready to continue learning?
Reply STUDY to start

Questions about your payment?
📧 info@neuronet.co.zw
📱 +263 5494594

NerdX | Neuronet AI Solutions
Reg: 51491A0272025 | Zimbabwe""",
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

# Global instance
whatsapp_template_service = None

def get_template_service(whatsapp_service: WhatsAppService = None) -> WhatsAppTemplateService:
    """Get or create global template service instance"""
    global whatsapp_template_service
    if whatsapp_template_service is None and whatsapp_service:
        whatsapp_template_service = WhatsAppTemplateService(whatsapp_service)
    return whatsapp_template_service
