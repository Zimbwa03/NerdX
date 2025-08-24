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

logger = logging.getLogger(__name__)

class UserService:
    """Service for managing user operations"""
    
    def __init__(self):
        pass
    
    def check_user_registration(self, whatsapp_id: str) -> Dict:
        """Check if user is registered and return status"""
        try:
            is_registered = is_user_registered(whatsapp_id)
            
            if is_registered:
                user_data = get_user_registration(whatsapp_id)
                return {
                    'is_registered': True,
                    'user': user_data,
                    'message': 'User is registered'
                }
            else:
                # Check if registration is in progress
                session = get_registration_session(whatsapp_id)
                if session:
                    return {
                        'is_registered': False,
                        'registration_in_progress': True,
                        'current_step': session.get('step'),
                        'message': 'Registration in progress'
                    }
                else:
                    return {
                        'is_registered': False,
                        'registration_in_progress': False,
                        'message': 'User not registered'
                    }
                    
        except Exception as e:
            logger.error(f"Error checking user registration: {e}")
            return {
                'is_registered': False,
                'error': str(e),
                'message': 'Error checking registration'
            }
    
    def start_registration(self, whatsapp_id: str) -> Dict:
        """Start the user registration process"""
        try:
            # Check if already registered
            if is_user_registered(whatsapp_id):
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
            
            update_registration_session(whatsapp_id, session_data)
            
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
        if not name or len(name.strip()) < 2:
            return {
                'success': False,
                'step': 'name',
                'message': 'Please enter a valid first name (at least 2 characters):'
            }
        
        session['name'] = name.strip().title()
        session['step'] = 'surname'
        update_registration_session(whatsapp_id, session)
        
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
        """Process date of birth input step"""
        try:
            # Validate date format
            date_obj = datetime.strptime(dob.strip(), '%d/%m/%Y')
            
            # Check if user is at least 10 years old
            min_age = datetime.now() - timedelta(days=365 * 10)
            if date_obj > min_age:
                return {
                    'success': False,
                    'step': 'date_of_birth',
                    'message': 'You must be at least 10 years old to register. Please enter a valid date (DD/MM/YYYY):'
                }
            
            # Check if date is not in the future
            if date_obj > datetime.now():
                return {
                    'success': False,
                    'step': 'date_of_birth',
                    'message': 'Date cannot be in the future. Please enter a valid date (DD/MM/YYYY):'
                }
            
            session['date_of_birth'] = dob.strip()
            session['step'] = 'referral_code'
            update_registration_session(whatsapp_id, session)
            
            return {
                'success': True,
                'step': 'referral_code',
                'message': 'Do you have a referral code? Enter it now, or type "SKIP" to continue without one:'
            }
            
        except ValueError:
            return {
                'success': False,
                'step': 'date_of_birth',
                'message': 'Invalid date format. Please use DD/MM/YYYY (e.g., 15/03/2005):'
            }
    
    def _process_referral_step(self, whatsapp_id: str, referral_input: str, session: Dict) -> Dict:
        """Process referral code input step"""
        try:
            referral_code = referral_input.strip().upper()
            
            if referral_code == 'SKIP':
                # Complete registration without referral
                return self._complete_registration(whatsapp_id, session, None)
            
            # Validate referral code format (assuming NERDX#### format)
            if not referral_code.startswith('NERDX') or len(referral_code) != 9:
                return {
                    'success': False,
                    'step': 'referral_code',
                    'message': 'Invalid referral code format. It should be like NERDX1234. Enter it again or type "SKIP":'
                }
            
            # Check if referral code exists
            referrer = get_user_by_nerdx_id(referral_code)
            if not referrer:
                return {
                    'success': False,
                    'step': 'referral_code',
                    'message': 'Referral code not found. Please check and try again, or type "SKIP":'
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
            # Generate unique NerdX ID
            nerdx_id = self._generate_nerdx_id()
            
            # Create user registration
            user_data = {
                'whatsapp_id': whatsapp_id,
                'nerdx_id': nerdx_id,
                'name': session['name'],
                'surname': session['surname'],
                'date_of_birth': session['date_of_birth'],
                'referred_by': referral_code
            }
            
            success = create_user_registration(user_data)
            
            if success:
                # Add welcome credits (updated to 75 credits)
                add_credits(whatsapp_id, 75, 'registration_bonus')
                
                # Add referral credits if applicable
                if referral_code:
                    # Give referrer 5 credits
                    add_referral_credits(referral_code, whatsapp_id)
                    # Give referee (new user) 5 additional credits
                    add_credits(whatsapp_id, 5, 'referral_bonus', 'Referral bonus for using referral code')
                
                # Clear registration session
                clear_registration_session(whatsapp_id)
                
                message = f"🎉 Registration complete!\n\n"
                message += f"Welcome {session['name']} {session['surname']}!\n"
                message += f"Your NerdX ID: {nerdx_id}\n\n"
                message += f"✨ You've received 75 welcome credits!\n"
                
                if referral_code:
                    message += f"🎁 Thanks for using referral code {referral_code}!\n"
                    message += f"✨ You've received an additional 5 referral bonus credits!\n"
                    message += f"💳 Total Credits: 80 (75 welcome + 5 referral bonus)\n"
                    message += f"Your referrer also received 5 bonus credits!\n"
                
                message += f"\nYou can now start using NerdX Quiz Bot!"
                
                return {
                    'success': True,
                    'completed': True,
                    'user_data': user_data,
                    'message': message
                }
            else:
                return {
                    'success': False,
                    'message': 'Registration failed. Please try again later.'
                }
                
        except Exception as e:
            logger.error(f"Error completing registration: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Error completing registration'
            }
    
    def _generate_nerdx_id(self) -> str:
        """Generate a unique NerdX ID"""
        while True:
            # Generate 4 random digits
            import random
            digits = ''.join([str(random.randint(0, 9)) for _ in range(4)])
            nerdx_id = f"NERDX{digits}"
            
            # Check if it already exists
            existing_user = get_user_by_nerdx_id(nerdx_id)
            if not existing_user:
                return nerdx_id
    
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
