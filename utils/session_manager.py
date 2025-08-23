import json
import logging
from typing import Dict, Optional, Any
from database.session_db import (
    save_user_session, get_user_session, clear_user_session,
    get_registration_session, update_registration_session, clear_registration_session
)

logger = logging.getLogger(__name__)

class SessionManager:
    """Manage user sessions and state"""
    
    def __init__(self):
        pass
    
    def save_question_session(self, user_id: str, question_data: Dict, subject: str, topic: str) -> bool:
        """Save current question session for user"""
        try:
            session_data = {
                'question_data': json.dumps(question_data),
                'subject': subject,
                'topic': topic,
                'question_id': question_data.get('question_id'),
                'question_source': question_data.get('source', 'unknown'),
                'session_type': 'question'
            }
            
            return save_user_session(user_id, session_data)
            
        except Exception as e:
            logger.error(f"Error saving question session: {e}")
            return False
    
    def get_question_session(self, user_id: str) -> Optional[Dict]:
        """Get current question session for user"""
        try:
            session = get_user_session(user_id)
            if session and session.get('session_type') == 'question':
                question_data = json.loads(session.get('question_data', '{}'))
                return {
                    'question_data': question_data,
                    'subject': session.get('subject'),
                    'topic': session.get('topic'),
                    'question_id': session.get('question_id'),
                    'question_source': session.get('question_source')
                }
            return None
            
        except Exception as e:
            logger.error(f"Error getting question session: {e}")
            return None
    
    def clear_question_session(self, user_id: str) -> bool:
        """Clear current question session"""
        try:
            return clear_user_session(user_id)
        except Exception as e:
            logger.error(f"Error clearing question session: {e}")
            return False
    
    def start_question_session(self, user_id: str, subject: str, topic: str) -> bool:
        """Start a new question session for user"""
        try:
            # Clear any existing session first
            self.clear_question_session(user_id)
            
            # Create new session placeholder
            session_data = {
                'subject': subject,
                'topic': topic,
                'session_type': 'question_waiting',
                'question_data': '{}',
                'question_id': None,
                'question_source': 'pending'
            }
            
            return save_user_session(user_id, session_data)
            
        except Exception as e:
            logger.error(f"Error starting question session: {e}")
            return False
    
    def save_topic_selection_session(self, user_id: str, subject: str, difficulty: str) -> bool:
        """Save topic selection session"""
        try:
            session_data = {
                'subject': subject,
                'difficulty': difficulty,
                'session_type': 'topic_selection'
            }
            
            return save_user_session(user_id, session_data)
            
        except Exception as e:
            logger.error(f"Error saving topic selection session: {e}")
            return False
    
    def get_topic_selection_session(self, user_id: str) -> Optional[Dict]:
        """Get topic selection session"""
        try:
            session = get_user_session(user_id)
            if session and session.get('session_type') == 'topic_selection':
                return {
                    'subject': session.get('subject'),
                    'difficulty': session.get('difficulty')
                }
            return None
            
        except Exception as e:
            logger.error(f"Error getting topic selection session: {e}")
            return None
    
    def save_payment_session(self, user_id: str, package_info: Dict) -> bool:
        """Save payment session"""
        try:
            session_data = {
                'package_info': json.dumps(package_info),
                'session_type': 'payment'
            }
            
            return save_user_session(user_id, session_data)
            
        except Exception as e:
            logger.error(f"Error saving payment session: {e}")
            return False
    
    def get_payment_session(self, user_id: str) -> Optional[Dict]:
        """Get payment session"""
        try:
            session = get_user_session(user_id)
            if session and session.get('session_type') == 'payment':
                package_info = json.loads(session.get('package_info', '{}'))
                return {
                    'package_info': package_info
                }
            return None
            
        except Exception as e:
            logger.error(f"Error getting payment session: {e}")
            return None
    
    def get_registration_state(self, user_id: str) -> Optional[Dict]:
        """Get registration session state"""
        try:
            return get_registration_session(user_id)
        except Exception as e:
            logger.error(f"Error getting registration state: {e}")
            return None
    
    def update_registration_state(self, user_id: str, data: Dict) -> bool:
        """Update registration session state"""
        try:
            return update_registration_session(user_id, data)
        except Exception as e:
            logger.error(f"Error updating registration state: {e}")
            return False
    
    def clear_registration_state(self, user_id: str) -> bool:
        """Clear registration session"""
        try:
            return clear_registration_session(user_id)
        except Exception as e:
            logger.error(f"Error clearing registration state: {e}")
            return False
    
    def save_image_processing_session(self, user_id: str, image_data: Dict) -> bool:
        """Save image processing session"""
        try:
            session_data = {
                'image_data': json.dumps(image_data),
                'session_type': 'image_processing'
            }
            
            return save_user_session(user_id, session_data)
            
        except Exception as e:
            logger.error(f"Error saving image processing session: {e}")
            return False
    
    def get_image_processing_session(self, user_id: str) -> Optional[Dict]:
        """Get image processing session"""
        try:
            session = get_user_session(user_id)
            if session and session.get('session_type') == 'image_processing':
                image_data = json.loads(session.get('image_data', '{}'))
                return {
                    'image_data': image_data
                }
            return None
            
        except Exception as e:
            logger.error(f"Error getting image processing session: {e}")
            return None
    
    def get_session_type(self, user_id: str) -> Optional[str]:
        """Get current session type for user"""
        try:
            session = get_user_session(user_id)
            return session.get('session_type') if session else None
        except Exception as e:
            logger.error(f"Error getting session type: {e}")
            return None
    
    def has_active_session(self, user_id: str) -> bool:
        """Check if user has any active session"""
        try:
            session = get_user_session(user_id)
            return session is not None
        except Exception as e:
            logger.error(f"Error checking active session: {e}")
            return False
    
    def set_session_data(self, user_id: str, data: Dict) -> bool:
        """Set session data for user"""
        try:
            # Convert data to session format
            session_data = {
                'session_type': data.get('mode', 'general'),
                'session_data': json.dumps(data)
            }
            
            return save_user_session(user_id, session_data)
            
        except Exception as e:
            logger.error(f"Error setting session data: {e}")
            return False
    
    def get_session_data(self, user_id: str) -> Optional[Dict]:
        """Get session data for user"""
        try:
            session = get_user_session(user_id)
            if session:
                session_data = json.loads(session.get('session_data', '{}'))
                return session_data
            return None
            
        except Exception as e:
            logger.error(f"Error getting session data: {e}")
            return None
    
    def save_audio_chat_session(self, user_id: str, mode: str, voice_type: str = 'female') -> bool:
        """Save audio chat session"""
        try:
            session_data = {
                'mode': mode,
                'voice_type': voice_type,
                'step': 'ready',
                'session_type': 'audio_chat'
            }
            
            return save_user_session(user_id, {
                'session_type': 'audio_chat',
                'session_data': json.dumps(session_data)
            })
            
        except Exception as e:
            logger.error(f"Error saving audio chat session: {e}")
            return False
    
    def get_audio_chat_session(self, user_id: str) -> Optional[Dict]:
        """Get audio chat session"""
        try:
            session = get_user_session(user_id)
            if session and session.get('session_type') == 'audio_chat':
                session_data = json.loads(session.get('session_data', '{}'))
                return session_data
            return None
            
        except Exception as e:
            logger.error(f"Error getting audio chat session: {e}")
            return None

    def clear_audio_chat_session(self, user_id: str) -> bool:
        """Clear audio chat session for user"""
        try:
            clear_user_session(user_id)
            logger.info(f"Cleared audio chat session for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error clearing audio chat session: {e}")
            return False

# Global session manager instance
session_manager = SessionManager()
