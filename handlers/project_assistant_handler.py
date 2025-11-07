"""
ZIMSEC Project Assistant Handler
Guides students through the 6 stages of ZIMSEC School-Based Projects (SBP)
"""

import logging
from services.project_assistant_service import ProjectAssistantService
from services.whatsapp_service import WhatsAppService

logger = logging.getLogger(__name__)
whatsapp_service = WhatsAppService()
project_service = ProjectAssistantService()


class ProjectAssistantHandler:
    """Handler for ZIMSEC Project Assistant feature"""
    
    def handle_project_menu(self, user_id: str):
        """Show the main project assistant menu"""
        try:
            project_service.show_main_menu(user_id)
        except Exception as e:
            logger.error(f"Error in project menu for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error loading Project Assistant. Please try again.")
    
    def handle_start_new_project(self, user_id: str):
        """Start a new ZIMSEC project"""
        try:
            project_service.start_new_project(user_id)
        except Exception as e:
            logger.error(f"Error starting new project for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error starting project. Please try again.")
    
    def handle_continue_project(self, user_id: str):
        """Continue an existing project"""
        try:
            project_service.continue_project(user_id)
        except Exception as e:
            logger.error(f"Error continuing project for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error loading project. Please try again.")
    
    def handle_project_message(self, user_id: str, message_text: str):
        """Handle user messages in project assistant mode"""
        try:
            project_service.handle_user_input(user_id, message_text)
        except Exception as e:
            logger.error(f"Error handling project message for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error processing your message. Please try again.")
    
    def handle_confirm_action(self, user_id: str, action_id: str):
        """Handle confirmation of credit-deducting actions"""
        try:
            project_service.execute_confirmed_action(user_id, action_id)
        except Exception as e:
            logger.error(f"Error confirming action for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error executing action. Please try again.")
    
    def handle_cancel_action(self, user_id: str):
        """Handle cancellation of credit-deducting actions"""
        try:
            project_service.cancel_pending_action(user_id)
        except Exception as e:
            logger.error(f"Error canceling action for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error. Please try again.")
    
    def handle_advance_stage(self, user_id: str, stage_num: int):
        """Handle advancing to next stage"""
        try:
            project_service.advance_to_stage(user_id, stage_num)
        except Exception as e:
            logger.error(f"Error advancing to stage {stage_num} for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error advancing stage. Please try again.")
    
    def handle_review_stage(self, user_id: str, stage_num: int):
        """Handle reviewing a completed stage"""
        try:
            project_service.review_stage(user_id, stage_num)
        except Exception as e:
            logger.error(f"Error reviewing stage {stage_num} for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error reviewing stage. Please try again.")
    
    def handle_save_and_exit(self, user_id: str):
        """Handle saving project and exiting"""
        try:
            project_service.save_and_exit(user_id)
        except Exception as e:
            logger.error(f"Error saving and exiting for {user_id}: {e}", exc_info=True)
            whatsapp_service.send_message(user_id, "❌ Error saving project. Please try again.")
