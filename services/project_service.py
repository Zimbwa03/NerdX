import logging
import json
import os
from typing import Dict, List, Optional
from datetime import datetime

import google.generativeai as genai
from config import Config
from database.external_db import (
    create_user_project,
    get_user_projects,
    get_project_by_id,
    update_project_stage,
    save_project_chat_message,
    get_project_chat_history
)

logger = logging.getLogger(__name__)

class ProjectService:
    def __init__(self):
        self.api_key = Config.GEMINI_API_KEY
        self.model_name = 'gemini-2.0-flash-exp' # Using the fast model for chat
        self._configure_genai()

    def _configure_genai(self):
        if self.api_key:
            genai.configure(api_key=self.api_key)
        else:
            logger.warning("GEMINI_API_KEY not found. AI features will be disabled.")

    def create_project(self, user_id: str, title: str, subject: str, details: Dict = None) -> Optional[Dict]:
        """Create a new project for a student"""
        return create_user_project(user_id, title, subject, details)

    def get_student_projects(self, user_id: str) -> List[Dict]:
        """Get all projects for a student"""
        return get_user_projects(user_id)

    def get_project(self, project_id: int) -> Optional[Dict]:
        """Get specific project details"""
        return get_project_by_id(project_id)

    def chat_with_agent(self, project_id: int, user_message: str) -> Dict:
        """
        Chat with the Project Assistant Agent.
        Maintains context of the project and previous chat history.
        """
        project = self.get_project(project_id)
        if not project:
            return {"error": "Project not found"}

        # Save user message
        save_project_chat_message(project_id, "user", user_message)

        # Retrieve history
        history = get_project_chat_history(project_id, limit=20)
        
        # Construct context
        context_prompt = self._build_system_prompt(project)
        
        # Generate AI response
        try:
            model = genai.GenerativeModel(self.model_name)
            chat = model.start_chat(history=[]) # We'll manually feed history if needed, or just use prompt context
            
            # For simple stateless REST, we often just send the whole context + history in the prompt 
            # or use the chat object if we were keeping it alive. 
            # Here we'll construct a rich prompt.
            
            full_prompt = f"{context_prompt}\n\nChat History:\n"
            for msg in history:
                role = "Student" if msg['role'] == 'user' else "Assistant"
                full_prompt += f"{role}: {msg['content']}\n"
            
            full_prompt += f"Student: {user_message}\nAssistant:"

            response = model.generate_content(full_prompt)
            ai_reply = response.text.strip()

            # Save AI response
            save_project_chat_message(project_id, "assistant", ai_reply)

            return {
                "response": ai_reply,
                "project_id": project_id
            }

        except Exception as e:
            logger.error(f"Error in project chat: {e}")
            return {"error": "Failed to generate response"}

    def _build_system_prompt(self, project: Dict) -> str:
        """Build the system prompt with project context"""
        title = project.get('project_title', 'Untitled')
        subject = project.get('subject', 'General')
        stage = project.get('current_stage', 'Selection')
        data = project.get('project_data', {})

        prompt = f"""
You are the NerdX Project Assistant, an expert AI mentor for ZIMSEC O-Level and A-Level students.
Your goal is to guide the student through their {subject} project, titled "{title}".

Current Project Stage: {stage}
Project Data so far: {json.dumps(data, indent=2)}

Guidelines:
1.  **Professional & Encouraging**: Be helpful, professional, but easy to understand.
2.  **ZIMSEC Standards**: Adhere to ZIMSEC project requirements (structure, depth, documentation).
3.  **Step-by-Step**: Don't do the work FOR them. Guide them. Ask leading questions.
4.  **Data Collection**: If the student provides new information for the project (e.g., a hypothesis, a design diagram description), acknowledge it and suggest they save it (or implicitly note it).
5.  **Structure**:
    -   **Selection**: Help them refine the topic.
    -   **Investigation**: Guide research, questionnaires, interviews.
    -   **Design**: Discuss system flow, diagrams, requirements.
    -   **Implementation**: Help with coding logic (if CS) or fabrication (if Agriculture/Science).
    -   **Documentation**: Help write the chapters.

6.  **Image Suggestions**: When relevant, suggest images that would enhance their project. Use this format:
    [IMAGE: search_term] - For example: [IMAGE: solar panel diagram] or [IMAGE: zimbabwe agriculture]
    Students can search for these on free image sites like Unsplash, Pexels, or Pixabay.

7.  **Examples of when to suggest images**:
    - Diagrams (flowcharts, system diagrams, circuit diagrams)
    - Real-world examples (equipment, locations, processes)
    - Data visualization suggestions (graphs, charts)
    - Cover page images

Help the student move to the next step. If they ask to write a section, provide a draft but encourage them to edit it.
"""
        return prompt

    def update_section(self, project_id: int, section_name: str, content: str) -> bool:
        """Update a specific section of the project data"""
        # This allows the chat to "save" parts of the project
        # e.g. "Save this as my Introduction"
        return update_project_stage(project_id, "In Progress", {section_name: content}) is not None

    def generate_document(self, project_id: int) -> str:
        """
        Generate the final project document (PDF).
        Returns the path/URL to the generated file.
        """
        project = self.get_project(project_id)
        if not project:
            logger.error(f"Project {project_id} not found")
            return ""
        
        try:
            from utils.project_pdf_generator import ProjectDocumentGenerator
            
            pdf_generator = ProjectDocumentGenerator()
            document_url = pdf_generator.generate_project_document(
                project_data=project,
                user_id=project.get('user_id', 'unknown')
            )
            
            logger.info(f"✅ Generated project document for project {project_id}")
            return document_url
            
        except Exception as e:
            logger.error(f"Error generating project document: {e}")
            return ""
    
    def generate_word_document(self, project_id: int) -> str:
        """
        Generate editable Word document (DOCX).
        Returns the path/URL to the generated file.
        """
        project = self.get_project(project_id)
        if not project:
            logger.error(f"Project {project_id} not found")
            return ""
        
        try:
            from utils.project_docx_generator import ProjectDocxGenerator
            
            docx_generator = ProjectDocxGenerator()
            document_url = docx_generator.generate_project_docx(
                project_data=project,
                user_id=project.get('user_id', 'unknown')
            )
            
            logger.info(f"✅ Generated Word document for project {project_id}")
            return document_url
            
        except Exception as e:
            logger.error(f"Error generating Word document: {e}")
            return ""
