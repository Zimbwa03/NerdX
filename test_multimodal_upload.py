
import os
import json
import base64
import logging
from unittest.mock import MagicMock, patch

# Setup logging
logging.basicConfig(level=logging.INFO)

# Mock everything we don't present to rely on actual environment variables
# We need to test if the service calls the interaction service correctly

def test_teacher_multimodal():
    print("\n--- Testing Teacher Multimodal ---")
    try:
        from services.combined_science_teacher_service import CombinedScienceTeacherService
        service = CombinedScienceTeacherService()
        
        if not service._is_interactions_configured:
            print("Interactions API not configured/available.")
            return

        # Mock session manager
        with patch('services.combined_science_teacher_service.session_manager') as mock_session:
            mock_session.get_data.return_value = {
                'subject': 'Biology',
                'grade_level': 'O-Level',
                'topic': 'Cells',
                'conversation_history': []
            }
            
            # Dummy image data (1x1 pixel transparent gif)
            dummy_image = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            
            attachments = [
                {
                    "type": "image",
                    "data": dummy_image,
                    "mime_type": "image/png"
                }
            ]
            
            print("Sending image attachment...")
            result = service.process_multimodal_message(
                user_id="test_user",
                message="What is this?",
                attachments=attachments
            )
            
            print(f"Result: {json.dumps(result, indent=2)}")
            
            if result.get('success'):
                print("SUCCESS: Image processed successfully")
            else:
                print("FAILURE: Image processing failed")
                
    except Exception as e:
        print(f"EXCEPTION: {e}")

def test_project_multimodal():
    print("\n--- Testing Project Assistant Multimodal ---")
    try:
        from services.project_assistant_service import ProjectAssistantService
        service = ProjectAssistantService()

        if not service._is_interactions_configured:
             print("Interactions API not configured/available.")
             return
             
        # Mock get_project_details
        service.get_project_details = MagicMock(return_value={
            'project_title': 'Test Project', 
            'subject': 'Science',
            'project_data': {}
        })
        
        # Mock save_project_to_database
        service._save_project_to_database = MagicMock(return_value=True)
        
        dummy_image = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        attachments = [
            {
                "type": "image",
                "data": dummy_image,
                "mime_type": "image/png"
            }
        ]
        
        print("Sending image attachment...")
        result = service.process_multimodal_message(
            user_id="test_user",
            project_id=123,
            message="Analyze this",
            attachments=attachments
        )
        
        print(f"Result: {json.dumps(result, indent=2)}")
        
        if result.get('success'):
            print("SUCCESS: Image processed successfully")
        else:
            print("FAILURE: Image processing failed")

    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    test_teacher_multimodal()
    test_project_multimodal()
