"""
ZIMSEC Project Assistant Service - Conversational AI Version
A ChatGPT-style chatbot where Gemini AI acts as a professional teacher
guiding students through their ZIMSEC School-Based Projects
"""

import logging
import json
import os
from datetime import datetime
from typing import Dict, Optional, List
from utils.session_manager import session_manager
from services.whatsapp_service import WhatsAppService
from database.external_db import make_supabase_request

logger = logging.getLogger(__name__)

# Import Google Gemini AI
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    GENAI_AVAILABLE = False


class ProjectAssistantService:
    """
    Conversational AI Project Assistant - like ChatGPT for ZIMSEC projects
    Students chat naturally with Gemini AI acting as a professional teacher
    """
    
    def __init__(self):
        self.whatsapp_service = WhatsAppService()
        
        # Initialize Gemini AI
        self.gemini_model = None
        self._is_gemini_configured = False
        try:
            if GENAI_AVAILABLE:
                api_key = os.getenv('GEMINI_API_KEY')
                if api_key and genai:
                    genai.configure(api_key=api_key)
                    # Use gemini-2.0-flash-exp for intelligent conversations
                    self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
                    self._is_gemini_configured = True
                    logger.info("✅ Project Assistant initialized with Gemini AI (gemini-2.0-flash-exp) for conversational tutoring")
                else:
                    logger.warning("GEMINI_API_KEY not found - AI tutoring unavailable")
            else:
                logger.warning("Google Generative AI not available")
        except Exception as e:
            logger.error(f"Error initializing Gemini: {e}")
    
    # System prompt that makes Gemini AI act as a professional ZIMSEC teacher
    TEACHER_SYSTEM_PROMPT = """You are a professional, experienced ZIMSEC teacher helping a student with their School-Based Project (SBP).

Your role is to:
1. **Guide, don't do the work** - Use the Socratic method (ask questions to help students think critically)
2. **Be encouraging and supportive** - Students need confidence and motivation
3. **Keep responses concise** - WhatsApp messages should be 2-3 paragraphs maximum
4. **Focus on ZIMSEC standards** - These projects are graded by ZIMSEC examiners
5. **Encourage original thinking** - Don't write the project for them
6. **Be professional but friendly** - Like a caring teacher, not a cold robot

ZIMSEC School-Based Project stages (for reference):
- Stage 1: Problem Identification
- Stage 2: Investigation of Related Ideas (Research)
- Stage 3: Generation of New Ideas
- Stage 4: Development of the Best Idea
- Stage 5: Presentation of Results
- Stage 6: Evaluation and Recommendations

Important guidelines:
- When a student asks you to write something for them, guide them instead with questions
- Help them think through their ideas
- Provide structure and frameworks
- Suggest where to find information
- Give feedback on their ideas
- Keep language simple and clear (remember they're students)

Current conversation context will be provided with each message."""

    def show_main_menu(self, user_id: str):
        """Display the Project Assistant main menu"""
        try:
            # Check if user has an active project
            project_data = self._get_project_data(user_id)
            
            menu_text = "🎓 *ZIMSEC Project Assistant*\n"
            menu_text += "─────────────────────\n\n"
            
            if project_data and project_data.get('active'):
                # User has an active project
                project_title = project_data.get('project_title', 'Untitled Project')
                subject = project_data.get('subject', 'Not specified')
                student_name = project_data.get('student_name', 'Student')
                
                menu_text += f"Welcome back, *{student_name}*! 👋\n\n"
                menu_text += f"📋 *Current Project:* {project_title}\n"
                menu_text += f"📚 *Subject:* {subject}\n\n"
                menu_text += "I'm your AI teacher - chat with me about your project anytime!\n\n"
                menu_text += "💬 Just send me a message and I'll help you."
                
                buttons = [
                    {"text": "💬 Continue Chatting", "callback_data": "project_continue"},
                    {"text": "💾 Save & Exit", "callback_data": "project_save_exit"},
                    {"text": "🆕 New Project", "callback_data": "project_new"},
                    {"text": "🔙 Main Menu", "callback_data": "main_menu"}
                ]
            else:
                # No active project
                menu_text += "Welcome to your AI Project Teacher! 🤖\n\n"
                menu_text += "I'm powered by Google Gemini AI and I'll help you create an excellent ZIMSEC School-Based Project.\n\n"
                menu_text += "💡 *How it works:*\n"
                menu_text += "• Chat with me naturally (like ChatGPT)\n"
                menu_text += "• Ask me anything about your project\n"
                menu_text += "• I'll guide you through all 6 stages\n"
                menu_text += "• Your progress is saved automatically\n\n"
                menu_text += "Ready to start?"
                
                buttons = [
                    {"text": "🚀 Start New Project", "callback_data": "project_new"},
                    {"text": "🔙 Main Menu", "callback_data": "main_menu"}
                ]
            
            self.whatsapp_service.send_interactive_message(user_id, menu_text, buttons)
            
        except Exception as e:
            logger.error(f"Error showing project menu for {user_id}: {e}", exc_info=True)
            raise
    
    def start_new_project(self, user_id: str):
        """Start a new project conversation"""
        try:
            # Clear any existing project data
            session_manager.clear_session(user_id)
            
            # Initialize new project
            project_data = {
                'active': True,
                'mode': 'project_assistant',
                'created_at': datetime.now().isoformat(),
                'conversation_history': [],
                'awaiting': 'student_name'
            }
            self._save_project_data(user_id, project_data)
            
            # Set session mode
            session_manager.set_session_data(user_id, {
                'mode': 'project_assistant',
                'active': True,
                'awaiting': 'student_name'
            })
            
            message = "🎓 *Welcome! I'm your AI Project Teacher*\n\n"
            message += "I'll help you create an excellent ZIMSEC School-Based Project.\n\n"
            message += "Let's start by getting to know you.\n\n"
            message += "📝 *What is your name?*"
            
            self.whatsapp_service.send_message(user_id, message)
            
        except Exception as e:
            logger.error(f"Error starting new project for {user_id}: {e}", exc_info=True)
            raise
    
    def continue_project(self, user_id: str):
        """Continue an existing project conversation"""
        try:
            # Load from session first, then database
            project_data = self._get_project_data(user_id)
            
            if not project_data:
                # Try loading from database
                project_data = self._load_project_from_database(user_id)
                if project_data:
                    self._save_project_data(user_id, project_data)
            
            if not project_data or not project_data.get('active'):
                self.whatsapp_service.send_message(
                    user_id,
                    "❌ No active project found. Please start a new project."
                )
                self.show_main_menu(user_id)
                return
            
            # Reactivate session
            session_manager.set_session_data(user_id, {
                'mode': 'project_assistant',
                'active': True
            })
            
            student_name = project_data.get('student_name', 'there')
            project_title = project_data.get('project_title', 'your project')
            subject = project_data.get('subject', 'Not specified')
            
            message = f"👋 Welcome back, *{student_name}*!\n\n"
            message += f"📋 *Project:* {project_title}\n"
            message += f"📚 *Subject:* {subject}\n\n"
            message += "I'm ready to help! What would you like to work on today?\n\n"
            message += "💬 Just chat with me naturally - ask questions, share ideas, or request guidance."
            
            # Add menu buttons
            buttons = [
                {"text": "💾 Save & Exit", "callback_data": "project_save_exit"},
                {"text": "🔙 Main Menu", "callback_data": "main_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
        except Exception as e:
            logger.error(f"Error continuing project for {user_id}: {e}", exc_info=True)
            raise
    
    def handle_user_input(self, user_id: str, message_text: str):
        """Handle user messages - main conversational AI logic"""
        try:
            session_data = session_manager.get_session_data(user_id)
            project_data = self._get_project_data(user_id) or {}
            
            if not session_data or session_data.get('mode') != 'project_assistant':
                return
            
            awaiting = session_data.get('awaiting')
            
            # Handle initial setup questions (name, subject)
            if awaiting == 'student_name':
                self._handle_student_name(user_id, message_text)
                return
            elif awaiting == 'subject':
                self._handle_subject(user_id, message_text)
                return
            elif awaiting == 'project_title':
                self._handle_project_title(user_id, message_text)
                return
            
            # Main conversational AI - chat about anything related to project
            self._handle_conversation(user_id, message_text, project_data)
            
        except Exception as e:
            logger.error(f"Error handling project input for {user_id}: {e}", exc_info=True)
            self.whatsapp_service.send_message(
                user_id,
                "❌ Sorry, I encountered an error. Please try again or type 'help'."
            )
    
    def _handle_student_name(self, user_id: str, name: str):
        """Collect student name"""
        project_data = self._get_project_data(user_id) or {}
        project_data['student_name'] = name.strip()
        self._save_project_data(user_id, project_data)
        
        session_manager.set_session_data(user_id, {
            'mode': 'project_assistant',
            'awaiting': 'subject',
            'active': True
        })
        
        message = f"Nice to meet you, *{name}*! 😊\n\n"
        message += "📚 Which subject is this School-Based Project for?\n\n"
        message += "Examples: Geography, Home Economics, Design & Technology, Agriculture, Business Studies, etc."
        
        self.whatsapp_service.send_message(user_id, message)
    
    def _handle_subject(self, user_id: str, subject: str):
        """Collect subject"""
        project_data = self._get_project_data(user_id) or {}
        project_data['subject'] = subject.strip()
        self._save_project_data(user_id, project_data)
        
        session_manager.set_session_data(user_id, {
            'mode': 'project_assistant',
            'awaiting': 'project_title',
            'active': True
        })
        
        student_name = project_data.get('student_name', 'there')
        
        message = f"Great, *{student_name}*! ✨\n\n"
        message += f"📚 Subject: *{subject}*\n\n"
        message += "Now, give your project a title. What problem or topic will you focus on?\n\n"
        message += "💡 Example: \"Improving Waste Management in My School\" or \"Reducing Water Scarcity in Rural Areas\"\n\n"
        message += "Don't worry - we can refine this later!"
        
        self.whatsapp_service.send_message(user_id, message)
    
    def _handle_project_title(self, user_id: str, title: str):
        """Collect project title and start AI conversation"""
        project_data = self._get_project_data(user_id) or {}
        project_data['project_title'] = title.strip()
        project_data['conversation_history'] = []
        self._save_project_data(user_id, project_data)
        
        # Save to database for persistence
        self._save_project_to_database(user_id, project_data)
        
        session_manager.set_session_data(user_id, {
            'mode': 'project_assistant',
            'awaiting': None,  # No specific awaiting - free conversation starts
            'active': True
        })
        
        student_name = project_data.get('student_name', 'there')
        subject = project_data.get('subject', 'your subject')
        
        message = f"Perfect, *{student_name}*! 🎯\n\n"
        message += f"📋 *Project:* {title}\n"
        message += f"📚 *Subject:* {subject}\n\n"
        message += "─────────────────────\n\n"
        message += "Your project is now set up! I'm here to help you through all 6 stages of your ZIMSEC project.\n\n"
        message += "💬 *How to use me:*\n"
        message += "• Ask me questions about your project\n"
        message += "• Share your ideas and I'll give feedback\n"
        message += "• Request guidance on what to do next\n"
        message += "• Get help with research, planning, or writing\n\n"
        message += "🚀 *Let's begin!* What would you like to work on first?"
        
        # Add helpful buttons
        buttons = [
            {"text": "💾 Save & Exit", "callback_data": "project_save_exit"},
            {"text": "🔙 Main Menu", "callback_data": "main_menu"}
        ]
        
        self.whatsapp_service.send_interactive_message(user_id, message, buttons)
    
    def _handle_conversation(self, user_id: str, message_text: str, project_data: dict):
        """Main conversational AI logic - chat with Gemini AI"""
        try:
            # Add user message to conversation history
            conversation_history = project_data.get('conversation_history', [])
            conversation_history.append({
                'role': 'user',
                'content': message_text,
                'timestamp': datetime.now().isoformat()
            })
            
            # Generate AI response
            ai_response = self._get_ai_response(user_id, message_text, project_data)
            
            # Add AI response to conversation history
            conversation_history.append({
                'role': 'assistant',
                'content': ai_response,
                'timestamp': datetime.now().isoformat()
            })
            
            # Keep last 50 messages to avoid memory issues
            if len(conversation_history) > 50:
                conversation_history = conversation_history[-50:]
            
            # Save updated conversation
            project_data['conversation_history'] = conversation_history
            project_data['last_updated'] = datetime.now().isoformat()
            self._save_project_data(user_id, project_data)
            
            # Auto-save to database every 5 messages
            if len(conversation_history) % 10 == 0:
                self._save_project_to_database(user_id, project_data)
                logger.info(f"Auto-saved project to database for {user_id}")
            
            # Send AI response to user
            self.whatsapp_service.send_message(user_id, ai_response)
            
        except Exception as e:
            logger.error(f"Error in conversation for {user_id}: {e}", exc_info=True)
            # Fallback response
            fallback_msg = "I'm here to help! Could you rephrase that or ask a specific question about your project?"
            self.whatsapp_service.send_message(user_id, fallback_msg)
    
    def _get_ai_response(self, user_id: str, message_text: str, project_data: dict) -> str:
        """Get intelligent response from Gemini AI"""
        try:
            if not self._is_gemini_configured or not self.gemini_model:
                # Fallback if Gemini not available
                return self._get_fallback_response(message_text, project_data)
            
            # Build context for Gemini
            student_name = project_data.get('student_name', 'Student')
            project_title = project_data.get('project_title', 'Untitled Project')
            subject = project_data.get('subject', 'Not specified')
            conversation_history = project_data.get('conversation_history', [])
            
            # Build conversation context (last 10 messages for context)
            recent_history = conversation_history[-10:] if len(conversation_history) > 10 else conversation_history
            history_text = ""
            for msg in recent_history:
                role = "Student" if msg['role'] == 'user' else "Teacher"
                history_text += f"{role}: {msg['content']}\n\n"
            
            # Create full prompt for Gemini
            full_prompt = f"""{self.TEACHER_SYSTEM_PROMPT}

**Student Information:**
- Name: {student_name}
- Project Title: {project_title}
- Subject: {subject}

**Recent Conversation:**
{history_text if history_text else "(First message)"}

**Current Student Message:**
{message_text}

**Your Response (as the teacher):**
Remember to:
1. Guide with questions, don't do the work
2. Be encouraging and supportive
3. Keep it concise (2-3 paragraphs max for WhatsApp)
4. Focus on ZIMSEC standards
5. Use simple, clear language"""
            
            # Generate response from Gemini
            response = self.gemini_model.generate_content(full_prompt)
            
            if response and response.text:
                ai_text = response.text.strip()
                logger.info(f"✅ Gemini AI generated response for {user_id} (length: {len(ai_text)})")
                return ai_text
            else:
                logger.warning(f"Gemini returned empty response for {user_id}")
                return self._get_fallback_response(message_text, project_data)
                
        except Exception as e:
            logger.error(f"Error getting Gemini response for {user_id}: {e}", exc_info=True)
            return self._get_fallback_response(message_text, project_data)
    
    def _get_fallback_response(self, message_text: str, project_data: dict) -> str:
        """Simple fallback responses when Gemini AI is unavailable"""
        message_lower = message_text.lower()
        student_name = project_data.get('student_name', 'there')
        
        # Simple keyword-based responses
        if any(word in message_lower for word in ['help', 'what', 'how', 'stuck']):
            return f"Hi *{student_name}*! 📚\n\nI'm here to help with your ZIMSEC project. Try asking:\n\n• \"What should I do next?\"\n• \"Help me understand Stage 1\"\n• \"How do I research?\"\n• \"Review my idea\"\n\nWhat specific aspect would you like help with?"
        
        elif any(word in message_lower for word in ['stage 1', 'problem', 'identify']):
            return f"*Stage 1: Problem Identification* 🎯\n\nYou need to:\n1. Identify a real problem\n2. Explain who it affects\n3. Describe the impact\n\nThink about:\n• What problem have you noticed?\n• Who is affected?\n• Why does it matter?\n\nWhat problem interests you?"
        
        elif any(word in message_lower for word in ['research', 'stage 2', 'investigate']):
            return f"*Stage 2: Investigation* 🔍\n\nFor research, you should:\n1. Find existing solutions\n2. Study what others have done\n3. Collect data about the problem\n\nWhere will you look for information? (Books, internet, surveys, interviews?)"
        
        else:
            return f"That's interesting, *{student_name}*! 💡\n\nCould you tell me more? I'm here to guide you through your project.\n\nTry to be specific - what aspect of your project do you need help with?"
    
    def save_and_exit(self, user_id: str):
        """Save project and exit to main menu"""
        try:
            project_data = self._get_project_data(user_id)
            
            if project_data:
                # Save to database
                success = self._save_project_to_database(user_id, project_data)
                
                if success:
                    student_name = project_data.get('student_name', 'there')
                    message = f"✅ *Project Saved!*\n\n"
                    message += f"All your progress has been saved, *{student_name}*.\n\n"
                    message += "You can continue anytime by clicking \"Continue Project\".\n\n"
                    message += "Keep up the great work! 🌟"
                else:
                    message = "⚠️ Project saved to session but database save failed. Your data is temporarily stored."
            else:
                message = "No active project to save."
            
            # Clear session
            session_manager.clear_session(user_id)
            
            self.whatsapp_service.send_message(user_id, message)
            
            # Show main menu
            from handlers.main_menu_handler import MainMenuHandler
            MainMenuHandler().show_main_menu(user_id)
            
        except Exception as e:
            logger.error(f"Error saving and exiting for {user_id}: {e}", exc_info=True)
            self.whatsapp_service.send_message(user_id, "❌ Error saving project. Please try again.")
    
    # ==================== Data Management ====================
    
    def _get_project_data(self, user_id: str) -> Optional[Dict]:
        """Get project data from session"""
        try:
            session_data = session_manager.get_session_data(user_id)
            if session_data and session_data.get('mode') == 'project_assistant':
                return session_data
            return None
        except Exception as e:
            logger.error(f"Error getting project data for {user_id}: {e}")
            return None
    
    def _save_project_data(self, user_id: str, project_data: dict):
        """Save project data to session"""
        try:
            project_data['mode'] = 'project_assistant'
            project_data['active'] = True
            session_manager.set_session_data(user_id, project_data)
        except Exception as e:
            logger.error(f"Error saving project data for {user_id}: {e}")
    
    def _save_project_to_database(self, user_id: str, project_data: dict) -> bool:
        """Save project to Supabase database for persistence"""
        try:
            # Prepare data for database
            db_data = {
                'user_id': user_id,
                'project_title': project_data.get('project_title', 'Untitled'),
                'subject': project_data.get('subject', 'Not specified'),
                'current_stage': 1,  # Can be tracked later
                'project_data': project_data,  # Store entire project as JSONB
                'updated_at': datetime.now().isoformat(),
                'completed': False
            }
            
            # Check if project already exists
            existing = make_supabase_request("GET", "user_projects", filters={
                "user_id": f"eq.{user_id}",
                "completed": "eq.false"
            })
            
            if existing and len(existing) > 0:
                # Update existing project
                project_id = existing[0]['id']
                success = make_supabase_request("PATCH", "user_projects", data=db_data, filters={"id": f"eq.{project_id}"})
                logger.info(f"Updated project {project_id} in database for {user_id}")
            else:
                # Insert new project
                db_data['created_at'] = datetime.now().isoformat()
                success = make_supabase_request("POST", "user_projects", data=db_data)
                logger.info(f"Inserted new project in database for {user_id}")
            
            return bool(success)
            
        except Exception as e:
            logger.error(f"Error saving project to database for {user_id}: {e}", exc_info=True)
            return False
    
    def _load_project_from_database(self, user_id: str) -> Optional[Dict]:
        """Load project from Supabase database"""
        try:
            projects = make_supabase_request("GET", "user_projects", filters={
                "user_id": f"eq.{user_id}",
                "completed": "eq.false"
            })
            
            if projects and len(projects) > 0:
                # Get most recent project
                project = projects[0]
                project_data = project.get('project_data', {})
                logger.info(f"Loaded project from database for {user_id}")
                return project_data
            
            return None
            
        except Exception as e:
            logger.error(f"Error loading project from database for {user_id}: {e}", exc_info=True)
            return None
