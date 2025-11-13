"""
Combined Science Handler
Routes WhatsApp messages for Combined Science feature (Teacher & Practice modes)
"""

import logging
from typing import Optional
from utils.session_manager import session_manager
from services.combined_science_teacher_service import combined_science_teacher_service

logger = logging.getLogger(__name__)


class CombinedScienceHandler:
    """Handles routing for Combined Science feature"""
    
    def __init__(self):
        self.teacher_service = combined_science_teacher_service
    
    def handle_message(self, user_id: str, message_text: str) -> bool:
        """
        Handle incoming messages for Combined Science
        
        Returns:
            True if message was handled, False otherwise
        """
        try:
            # Check if user is in teacher mode
            session_data = session_manager.get_data(user_id, 'science_teacher')
            
            if not session_data or not session_data.get('active'):
                return False
            
            awaiting = session_data.get('awaiting')
            
            # Handle different conversation stages
            if awaiting == 'topic_selection':
                # User typed a custom topic
                self.teacher_service.start_teaching_session(user_id, message_text)
                return True
            
            elif awaiting == 'conversation':
                # User is in active teaching conversation
                self.teacher_service.handle_conversation(user_id, message_text)
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error handling Combined Science message for {user_id}: {e}")
            return False
    
    def handle_button_callback(self, user_id: str, callback_data: str) -> bool:
        """
        Handle button callbacks for Combined Science
        
        Returns:
            True if callback was handled, False otherwise
        """
        try:
            # Main menu callbacks
            if callback_data == "combined_science":
                self.teacher_service.show_main_menu(user_id)
                return True
            
            elif callback_data == "science_teacher_mode":
                self.teacher_service.start_teacher_mode(user_id)
                return True
            
            elif callback_data == "science_practice_mode":
                # Redirect to existing Combined Science quiz functionality
                from api.webhook import handle_combined_science_menu
                handle_combined_science_menu(user_id)
                return True
            
            # Subject selection callbacks
            elif callback_data == "science_subject_biology":
                self.teacher_service.select_subject(user_id, "Biology")
                return True
            
            elif callback_data == "science_subject_chemistry":
                self.teacher_service.select_subject(user_id, "Chemistry")
                return True
            
            elif callback_data == "science_subject_physics":
                self.teacher_service.select_subject(user_id, "Physics")
                return True
            
            # Grade level callbacks
            elif callback_data == "science_grade_form12":
                self.teacher_service.select_grade_level(user_id, "Form 1-2")
                return True
            
            elif callback_data == "science_grade_olevel":
                self.teacher_service.select_grade_level(user_id, "O-Level")
                return True
            
            elif callback_data == "science_grade_alevel":
                self.teacher_service.select_grade_level(user_id, "A-Level")
                return True
            
            # Topic selection callbacks
            elif callback_data == "science_random_topic":
                self.teacher_service.handle_random_topic(user_id)
                return True
            
            elif callback_data == "science_suggest_topics":
                self.teacher_service.suggest_topics(user_id)
                return True
            
            # Note generation callback
            elif callback_data == "science_generate_notes":
                self.teacher_service.generate_notes(user_id)
                return True
            
            # Exit/back callbacks
            elif callback_data == "science_exit":
                self.teacher_service.exit_teacher_mode(user_id)
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error handling Combined Science callback for {user_id}: {e}")
            return False


# Global instance
combined_science_handler = CombinedScienceHandler()
