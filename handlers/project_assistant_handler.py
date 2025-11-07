"""
ZIMSEC Project Assistant Handler - Conversational AI Version
Simple handler for ChatGPT-style conversational project assistant
"""

import logging
from services.project_assistant_service import ProjectAssistantService
from services.whatsapp_service import WhatsAppService

logger = logging.getLogger(__name__)
whatsapp_service = WhatsAppService()
project_service = ProjectAssistantService()


class ProjectAssistantHandler:
    """Handler for conversational AI project assistant"""
    
    def handle_project_menu(self, user_id: str):
        """Show the main project assistant menu"""
        try:
            project_service.show_main_menu(user_id)
        except Exception as e:
            logger.error(f"Error in project menu for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error loading Project Assistant. Please try again.")
    
    def handle_start_new_project(self, user_id: str):
        """Start a new project conversation"""
        try:
            project_service.start_new_project(user_id)
        except Exception as e:
            logger.error(f"Error starting new project for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error starting project. Please try again.")
    
    def handle_continue_project(self, user_id: str):
        """Continue existing project conversation"""
        try:
            project_service.continue_project(user_id)
        except Exception as e:
            logger.error(f"Error continuing project for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error loading project. Please try again.")
    
    def handle_project_message(self, user_id: str, message_text: str):
        """Handle conversational messages from user"""
        try:
            project_service.handle_user_input(user_id, message_text)
        except Exception as e:
            logger.error(f"Error handling project message for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error processing your message. Please try again.")
    
    def handle_save_and_exit(self, user_id: str):
        """Save project and return to main menu"""
        try:
            project_service.save_and_exit(user_id)
        except Exception as e:
            logger.error(f"Error saving and exiting for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error saving project. Please try again.")
