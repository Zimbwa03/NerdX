import json
import logging
import uuid
from datetime import datetime, timedelta
from typing import Dict, Optional, List
from database.external_db import (
    is_user_registered, get_user_registration, create_user_registration,
    get_or_create_user_stats, update_user_stats, add_credits, get_user_credits,
    add_xp, update_streak, get_user_stats, add_referral_credits, get_user_by_nerdx_id
)
from database.session_db import (
    get_registration_session, update_registration_session,
    complete_registration_session, clear_registration_session
)
from services.advanced_credit_service import advanced_credit_service
from config import Config

logger = logging.getLogger(__name__)

class UserService:
    """Service for managing user operations"""

    def __init__(self):
        pass

    def check_user_registration(self, whatsapp_id: str) -> Dict:
        """Check if user is registered and return status"""
        try:
            logger.info(f"🔍 DEBUGGING: Checking registration for user {whatsapp_id}")
            is_registered = is_user_registered(whatsapp_id)
            logger.info(f"🔍 DEBUGGING: is_user_registered returned: {is_registered}")

            if is_registered:
                user_data = get_user_registration(whatsapp_id)
                logger.info(f"🔍 DEBUGGING: get_user_registration returned: {user_data is not None}")
                return {
                    'is_registered': True,
                    'user': user_data,
                    'message': 'User is registered'
                }
            else:
                logger.info(f"🔍 DEBUGGING: User {whatsapp_id} not registered, checking registration session")
                # Check if registration is in progress
                session = get_registration_session(whatsapp_id)
                if session:
                    logger.info(f"🔍 DEBUGGING: Registration in progress for {whatsapp_id}")
                    return {
                        'is_registered': False,
                        'registration_in_progress': True,
                        'current_step': session.get('step'),
                        'message': 'Registration in progress'
                    }
                else:
                    logger.info(f"🔍 DEBUGGING: No registration session for {whatsapp_id}")
                    return {
                        'is_registered': False,
                        'registration_in_progress': False,
                        'message': 'User not registered'
                    }

        except Exception as e:
            logger.error(f"Error checking user registration for {whatsapp_id}: {e}")
            return {
                'is_registered': False,
                'error': str(e),
                'message': 'Error checking registration'
            }

    def start_registration(self, whatsapp_id: str) -> Dict:
        """Start the user registration process"""
        try:
            logger.info(f"🚀 Starting registration for user {whatsapp_id}")

            # Check if already registered
            if is_user_registered(whatsapp_id):
                logger.info(f"❌ User {whatsapp_id} is already registered")
                return {
                    'success': False,
                    'message': 'User already registered'
                }

            # Initialize registration session
            session_data = {
                'step': 'name',
                'name': None,
                'surname': None,
                'date_of_birth': None,
                'referred_by_nerdx_id': None
            }

            logger.info(f"📝 Creating registration session for {whatsapp_id}: {session_data}")
            update_result = update_registration_session(whatsapp_id, session_data)
            logger.info(f"📝 Registration session update result: {update_result}")

            # Verify session was created
            from database.session_db import get_registration_session
            created_session = get_registration_session(whatsapp_id)
            logger.info(f"📝 Created session verification: {created_session}")

            return {
                'success': True,
                'step': 'name',
                'message': 'Registration started. Please enter your first name:'
            }

        except Exception as e:
            logger.error(f"Error starting registration: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Error starting registration'
            }

    def process_registration_step(self, whatsapp_id: str, user_input: str) -> Dict:
        """Process a step in the registration flow"""
        try:
            session = get_registration_session(whatsapp_id)
            if not session:
                return {
                    'success': False,
                    'message': 'No registration session found. Please start registration again.'
                }

            current_step = session.get('step')

            if current_step == 'name':
                return self._process_name_step(whatsapp_id, user_input, session)
            elif current_step == 'surname':
                return self._process_surname_step(whatsapp_id, user_input, session)
            elif current_step == 'date_of_birth':
                return self._process_dob_step(whatsapp_id, user_input, session)
            elif current_step == 'referral_code':
                return self._process_referral_step(whatsapp_id, user_input, session)
            else:
                return {
                    'success': False,
                    'message': 'Invalid registration step'
                }

        except Exception as e:
            logger.error(f"Error processing registration step: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Error processing registration'
            }

    def _process_name_step(self, whatsapp_id: str, name: str, session: Dict) -> Dict:
        """Process name input step"""
        logger.info(f"🔍 Processing name step for {whatsapp_id} with input: '{name}'")
        logger.info(f"🔍 Current session: {session}")

        if not name or len(name.strip()) < 2:
            logger.warning(f"❌ Name validation failed for {whatsapp_id}: '{name}' (length: {len(name.strip()) if name else 0})")
            return {
                'success': False,
                'step': 'name',
                'message': 'Please enter a valid first name (at least 2 characters):'
            }

        logger.info(f"✅ Name validation passed for {whatsapp_id}: '{name}'")

        session['name'] = name.strip().title()
        session['step'] = 'surname'
        logger.info(f"📝 Updating session for {whatsapp_id}: {session}")

        update_result = update_registration_session(whatsapp_id, session)
        logger.info(f"📝 Session update result: {update_result}")

        return {
            'success': True,
            'step': 'surname',
            'message': 'Great! Now please enter your surname:'
        }

    def _process_surname_step(self, whatsapp_id: str, surname: str, session: Dict) -> Dict:
        """Process surname input step"""
        if not surname or len(surname.strip()) < 2:
            return {
                'success': False,
                'step': 'surname',
                'message': 'Please enter a valid surname (at least 2 characters):'
            }

        session['surname'] = surname.strip().title()
        session['step'] = 'date_of_birth'
        update_registration_session(whatsapp_id, session)

        return {
            'success': True,
            'step': 'date_of_birth',
            'message': 'Please enter your date of birth (format: DD/MM/YYYY):'
        }

    def _process_dob_step(self, whatsapp_id: str, dob: str, session: Dict) -> Dict:
        """Process date of birth input step with flexible year format"""
        try:
            dob_clean = dob.strip()
            date_obj = None
            
            # Try multiple date formats to be user-friendly
            date_formats = [
                '%d/%m/%Y',    # 25/08/2002
                '%d/%m/%y',    # 25/08/02
                '%d-%m-%Y',    # 25-08-2002
                '%d-%m-%y',    # 25-08-02
                '%d.%m.%Y',    # 25.08.2002
                '%d.%m.%y'     # 25.08.02
            ]
            
            for date_format in date_formats:
                try:
                    date_obj = datetime.strptime(dob_clean, date_format)
                    break
                except ValueError:
                    continue
            
            if not date_obj:
                return {
                    'success': False,
                    'step': 'date_of_birth',
                    'message': 'Invalid date format. Please use DD/MM/YYYY or DD/MM/YY (e.g., 25/08/2002 or 25/08/02):'
                }

            # Check if user is at least 10 years old
            min_age = datetime.now() - timedelta(days=365 * 10)
            if date_obj > min_age:
                return {
                    'success': False,
                    'step': 'date_of_birth',
                    'message': 'You must be at least 10 years old to register. Please enter a valid date:'
                }

            # Check if date is not in the future
            if date_obj > datetime.now():
                return {
                    'success': False,
                    'step': 'date_of_birth',
                    'message': 'Date cannot be in the future. Please enter a valid date:'
                }

            # Convert to standard DD/MM/YYYY format for database storage
            # This ensures compatibility with the existing date conversion logic
            session['date_of_birth'] = date_obj.strftime('%d/%m/%Y')

            # Check if referral code was already detected during initial message
            if session.get('referred_by_nerdx_id'):
                # Skip referral step and complete registration
                return self._complete_registration(whatsapp_id, session, session['referred_by_nerdx_id'])
            else:
                # Continue to referral step
                session['step'] = 'referral_code'
                update_registration_session(whatsapp_id, session)

                return {
                    'success': True,
                    'step': 'referral_code',
                    'message': 'Do you have a referral code? Enter it now, or type "SKIP" to continue without one:'
                }

        except Exception as e:
            logger.error(f"Error processing date of birth for {whatsapp_id}: {e}")
            return {
                'success': False,
                'step': 'date_of_birth',
                'message': 'Invalid date format. Please use DD/MM/YYYY or DD/MM/YY (e.g., 25/08/2002 or 25/08/02):'
            }

    def _process_referral_step(self, whatsapp_id: str, referral_input: str, session: Dict) -> Dict:
        """Process referral code input step using existing nerdx_id format"""
        try:
            referral_code = referral_input.strip().upper()

            if referral_code == 'SKIP':
                # Complete registration without referral
                return self._complete_registration(whatsapp_id, session, None)

            # Validate referral code format (existing nerdx_id format: N + 5 characters)
            if len(referral_code) != 6 or not referral_code.startswith('N') or not referral_code[1:].isalnum():
                return {
                    'success': False,
                    'step': 'referral_code',
                    'message': 'Invalid referral code format. It should be 6 characters starting with "N" (e.g., NABC12). Enter it again or type "SKIP":'
                }

            # Check if referral code exists using existing system
            from database.external_db import get_user_by_nerdx_id
            referrer_user = get_user_by_nerdx_id(referral_code)

            if not referrer_user:
                return {
                    'success': False,
                    'step': 'referral_code',
                    'message': 'Referral code not found. Please check and try again, or type "SKIP":'
                }

            # Prevent self-referral (shouldn't happen but safety check)
            if referrer_user.get('chat_id') == whatsapp_id:
                return {
                    'success': False,
                    'step': 'referral_code',
                    'message': 'You cannot refer yourself. Please enter a different code or type "SKIP":'
                }

            # Complete registration with referral
            return self._complete_registration(whatsapp_id, session, referral_code)

        except Exception as e:
            logger.error(f"Error processing referral step: {e}")
            return {
                'success': False,
                'step': 'referral_code',
                'message': 'Error processing referral code. Please try again or type "SKIP":'
            }

    def _complete_registration(self, whatsapp_id: str, session: Dict, referral_code: Optional[str]) -> Dict:
        """Complete the user registration"""
        try:
            # Use existing create_user_registration function which already generates nerdx_id
            registration_result = create_user_registration(
                chat_id=whatsapp_id,
                name=session['name'],
                surname=session['surname'],
                date_of_birth=session['date_of_birth'],
                referred_by_nerdx_id=referral_code  # Use existing parameter name
            )

            success = registration_result is not None
            nerdx_id = registration_result.get('nerdx_id') if registration_result else None

            if success:
                # Credits are already allocated in create_user_registration function
                # No need for additional credit allocation here
                logger.info(f"✅ Registration completed for {whatsapp_id} with NerdX ID: {nerdx_id}")

                # Handle referral if applicable using existing system
                if referral_code:
                    # Use existing add_referral_credits function
                    from database.external_db import add_referral_credits
                    success = add_referral_credits(referral_code, whatsapp_id)

                    if success:
                        logger.info(f"✅ Referral credits awarded to referrer for code {referral_code}")
                        logger.info(f"Successfully processed referral: {referral_code} -> {whatsapp_id}")

                # Clear registration session
                clear_registration_session(whatsapp_id)

                # Get final credit balance
                final_credits = get_user_credits(whatsapp_id)

                # Create stylish registration completion message
                message = "🎉 **🎓 REGISTRATION COMPLETE! 🎓**\n\n"
                message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                message += f"✨ **Welcome to NerdX, {session['name']} {session['surname']}!**\n\n"
                message += f"🆔 **Your NerdX ID**: `{nerdx_id}`\n"
                message += f"📅 **Date of Birth**: {session['date_of_birth']}\n"
                message += f"📱 **WhatsApp**: {whatsapp_id}\n\n"
                message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                from config import Config
                from utils.credit_units import format_credits
                welcome_bonus_display = format_credits(Config.REGISTRATION_BONUS)
                message += f"💎 **Welcome Bonus**: +{welcome_bonus_display} Credits\n"
                message += f"💳 **Total Credits**: {format_credits(final_credits)} credits\n\n"

                if referral_code:
                    message += f"🎁 **Referral Bonus Applied!**\n"
                    message += f"🔗 **Referral Code**: {referral_code}\n\n"

                message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                message += "🚀 **Ready to start your learning journey!**\n\n"
                message += "📋 **What's Next?**\n"
                message += "• Tap *🚀 Continue to Menu* below or type *MENU* to see all options\n"
                message += "• Type *HELP* to view commands and support info\n"
                message += "• Type *CREDITS* to check your balance or *BUY CREDITS* to top up\n"
                message += "• Type *STATS* to view your progress\n\n"
                message += "💡 *The main menu will appear automatically in a moment. If it doesn't, type* *MENU*.\n\n"
                message += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

                # Create buttons for the completion message
                buttons = [
                    {
                        "text": "🚀 Continue to Menu",
                        "callback_data": "continue_after_registration"
                    },
                    {
                        "text": "📢 Join Channel",
                        "callback_data": "join_channel"
                    }
                ]

                return {
                    'success': True,
                    'completed': True,
                    'user_data': registration_result,
                    'message': message,
                    'buttons': buttons,
                    'credits_awarded': final_credits
                }
            else:
                logger.error(f"❌ REGISTRATION FAILED for {whatsapp_id} - Supabase database error")
                return {
                    'success': False,
                    'message': '❌ **Registration Failed**\n\nWe\'re experiencing database connectivity issues. Please try again in a few minutes.\n\nIf this problem persists, please contact our support team.'
                }

        except Exception as e:
            logger.error(f"Error completing registration: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Error completing registration'
            }

    # Note: NerdX ID generation is now handled by external_db.create_user_registration()

    def get_user_stats_summary(self, whatsapp_id: str) -> Dict:
        """Get comprehensive user statistics"""
        try:
            user_stats = get_user_stats(whatsapp_id)
            user_credits = get_user_credits(whatsapp_id)

            if not user_stats:
                return {
                    'success': False,
                    'message': 'User statistics not found'
                }

            return {
                'success': True,
                'stats': {
                    'credits': user_credits,
                    'total_points': user_stats.get('total_points', 0),
                    'streak_count': user_stats.get('streak_count', 0),
                    'questions_answered': user_stats.get('questions_answered', 0),
                    'correct_answers': user_stats.get('correct_answers', 0),
                    'accuracy': self._calculate_accuracy(
                        user_stats.get('correct_answers', 0),
                        user_stats.get('questions_answered', 0)
                    ),
                    'last_activity': user_stats.get('last_activity'),
                    'level': self._calculate_user_level(user_stats.get('total_points', 0))
                }
            }

        except Exception as e:
            logger.error(f"Error getting user stats: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Error retrieving user statistics'
            }

    def _calculate_accuracy(self, correct: int, total: int) -> float:
        """Calculate accuracy percentage"""
        if total == 0:
            return 0.0
        return round((correct / total) * 100, 1)

    def _calculate_user_level(self, total_points: int) -> Dict:
        """Calculate user level based on points"""
        levels = [
            (0, "Beginner", 100),
            (100, "Novice", 300),
            (300, "Learner", 600),
            (600, "Student", 1000),
            (1000, "Scholar", 1500),
            (1500, "Expert", 2500),
            (2500, "Master", 5000),
            (5000, "Genius", float('inf'))
        ]

        for min_points, level_name, next_threshold in levels:
            if total_points >= min_points and total_points < next_threshold:
                progress = 0 if next_threshold == float('inf') else ((total_points - min_points) / (next_threshold - min_points)) * 100
                return {
                    'name': level_name,
                    'current_points': total_points,
                    'next_threshold': next_threshold if next_threshold != float('inf') else None,
                    'progress_percent': round(progress, 1)
                }

        return {
            'name': 'Genius',
            'current_points': total_points,
            'next_threshold': None,
            'progress_percent': 100.0
        }

    def link_mobile_account(self, whatsapp_id: str, name: str, surname: str, email: Optional[str] = None) -> Dict:
        """Link WhatsApp account to existing mobile app account by name and surname"""
        try:
            from database.external_db import search_users_by_name, link_whatsapp_to_account, get_user_registration
            
            # Search for users with matching name and surname
            matching_users = search_users_by_name(name, surname)
            
            if not matching_users or len(matching_users) == 0:
                return {
                    'success': False,
                    'message': f'No account found with name "{name} {surname}".\n\nIf you haven\'t registered on the mobile app yet, you can:\n• Type *REGISTER* to create a new WhatsApp account\n• Or download the NerdX mobile app first and then link your account here.'
                }
            
            # If multiple matches, require email verification
            if len(matching_users) > 1:
                if not email:
                    return {
                        'success': False,
                        'requires_email': True,
                        'message': f'Multiple accounts found with name "{name} {surname}".\n\nPlease enter your email address to verify your account:',
                        'matching_count': len(matching_users)
                    }
                else:
                    # Verify email matches one of the users
                    email_lower = email.strip().lower()
                    matched_user = None
                    for user in matching_users:
                        if user.get('email', '').lower() == email_lower:
                            matched_user = user
                            break
                    
                    if not matched_user:
                        return {
                            'success': False,
                            'message': f'Email does not match any account with name "{name} {surname}".\n\nPlease check your email and try again, or type *REGISTER* to create a new account.'
                        }
                    
                    # Link the matched account
                    matched_user_id = matched_user.get('id')
                    if link_whatsapp_to_account(matched_user_id, whatsapp_id):
                        return {
                            'success': True,
                            'message': f'✅ *Account Linked Successfully!*\n\nYour WhatsApp account is now linked to your mobile app account.\n\n🆔 *NerdX ID*: {matched_user.get("nerdx_id", "N/A")}\n📧 *Email*: {email}\n\nYou can now use all NerdX features on WhatsApp! Type *MENU* to get started.',
                            'user_data': matched_user
                        }
                    else:
                        return {
                            'success': False,
                            'message': 'Failed to link account. Please try again or contact support.'
                        }
            
            # Single match - link directly
            matched_user = matching_users[0]
            matched_user_id = matched_user.get('id')
            
            # Check if this WhatsApp number is already linked to a different account
            existing_user = get_user_registration(whatsapp_id)
            if existing_user and existing_user.get('id') != matched_user_id:
                return {
                    'success': False,
                    'message': 'This WhatsApp number is already linked to another account. Please contact support if you need to change this.'
                }
            
            # Link the account
            if link_whatsapp_to_account(matched_user_id, whatsapp_id):
                user_email = matched_user.get('email', 'Not provided')
                return {
                    'success': True,
                    'message': f'✅ *Account Linked Successfully!*\n\nYour WhatsApp account is now linked to your mobile app account.\n\n🆔 *NerdX ID*: {matched_user.get("nerdx_id", "N/A")}\n📧 *Email*: {user_email}\n\nYou can now use all NerdX features on WhatsApp! Type *MENU* to get started.',
                    'user_data': matched_user
                }
            else:
                return {
                    'success': False,
                    'message': 'Failed to link account. Please try again or contact support.'
                }
                
        except Exception as e:
            logger.error(f"Error linking mobile account: {e}")
            return {
                'success': False,
                'message': 'An error occurred while linking your account. Please try again later.'
            }

    def update_user_activity(self, whatsapp_id: str, activity_type: str, metadata: Optional[Dict] = None):
        """Update user activity and maintain streak"""
        try:
            # Update last activity
            from database.external_db import update_user_last_activity
            update_user_last_activity(whatsapp_id)

            # Update streak if it's a question activity
            if activity_type in ['question_answered', 'question_correct']:
                update_streak(whatsapp_id)

            # Log activity
            from models import ActivityLog
            from app import db

            log_entry = ActivityLog(
                user_id=whatsapp_id,
                activity_type=activity_type,
                description=f"User performed {activity_type}",
                additional_data=json.dumps(metadata) if metadata else None
            )

            db.session.add(log_entry)
            db.session.commit()

        except Exception as e:
            logger.error(f"Error updating user activity: {e}")
