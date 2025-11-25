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
from database.external_db import make_supabase_request, get_user_credits, deduct_credits
from services.advanced_credit_service import advanced_credit_service

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
    
    # System prompt that makes Gemini AI a comprehensive research assistant
    TEACHER_SYSTEM_PROMPT = """You are a comprehensive AI research assistant for ZIMSEC School-Based Projects (SBP). You provide COMPLETE, DETAILED assistance including research, writing, and guidance.

Your role is to:
1. **Provide complete answers** - When students ask for research, provide thorough, detailed information with facts, statistics, and examples
2. **Do the research for them** - Provide comprehensive research findings, existing solutions, case studies, and relevant data
3. **Write content when asked** - Help students by writing project titles, problem statements, literature reviews, and analysis when requested
4. **Generate study notes** - When asked, create detailed, well-organized notes they can include in their project documentation
5. **Suggest relevant images** - When appropriate, describe visual aids, diagrams, charts, or images that would enhance their project
6. **Give specific examples** - Provide real-world examples, case studies, and practical applications
7. **Be comprehensive** - Give detailed, well-structured responses with bullet points, numbered lists, and clear organization
8. **Provide sources** - Mention relevant sources, studies, or organizations they can reference
9. **Be encouraging and supportive** - Students need confidence and motivation
10. **Be highly interactive** - Ask clarifying questions, probe deeper, and engage actively with the student

ZIMSEC School-Based Project stages:
- Stage 1: Problem Identification - Help identify problems, write problem statements and project titles
- Stage 2: Investigation of Related Ideas - Provide research on existing solutions, data, and literature
- Stage 3: Generation of New Ideas - Brainstorm creative solutions and innovations
- Stage 4: Development of the Best Idea - Help develop detailed implementation plans
- Stage 5: Presentation of Results - Assist with creating presentations and visual aids
- Stage 6: Evaluation and Recommendations - Help evaluate outcomes and write recommendations

How to help students:
- **When asked to write**: Write it for them! Provide complete, well-written content ready to copy into their project
- **When asked for research**: Provide comprehensive research with details, facts, examples, and data
- **When asked for ideas**: Generate multiple creative, practical ideas with explanations
- **When asked for help**: Provide step-by-step guidance with specific examples
- **When asked for notes**: Create detailed study notes formatted for inclusion in their project
- **When discussing topics**: Suggest relevant visual aids (charts, diagrams, images) and describe what they should show
- **Keep responses detailed but readable** - Use formatting, bullet points, and clear structure
- **Be practical** - Focus on ZIMSEC-appropriate content that will score well
- **Be conversational** - Chat naturally, ask follow-up questions, show interest

Commands students can use:
- "generate notes on [topic]" - Create detailed study notes
- "suggest images for [topic]" - Recommend visual aids and describe what they should show
- "write [section]" - Write complete project content
- "research [topic]" - Provide comprehensive research findings

Remember: Your goal is to help students complete excellent projects by being their active, engaged research partner who provides all the information, research, content, and visual suggestions they need!

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
                menu_text += "Welcome to your AI Research Assistant! 🤖\n\n"
                menu_text += "I'm powered by Google Gemini AI and I'll help you create an excellent ZIMSEC School-Based Project.\n\n"
                menu_text += "💡 *I can help you with:*\n"
                menu_text += "• Research on any topic\n"
                menu_text += "• Writing project titles, statements & content\n"
                menu_text += "• Finding existing solutions and case studies\n"
                menu_text += "• Generating ideas and recommendations\n"
                menu_text += "• Complete guidance through all 6 stages\n\n"
                menu_text += "Ready to start? I'll do the research and writing for you!"
                
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
            
            # Get user name from database
            from database.external_db import get_user_registration
            user_data = get_user_registration(user_id)
            student_name = f"{user_data.get('name', 'Student')}" if user_data else "Student"
            
            # Initialize new project with user name from database
            project_data = {
                'active': True,
                'mode': 'project_assistant',
                'created_at': datetime.now().isoformat(),
                'conversation_history': [],
                'student_name': student_name,  # Save name from database
                'awaiting': 'subject'  # Skip name collection, go to subject
            }
            self._save_project_data(user_id, project_data)
            
            # Set session mode
            session_manager.set_session_data(user_id, {
                'mode': 'project_assistant',
                'active': True,
                'awaiting': 'subject'
            })
            
            message = f"🎓 *Welcome, {student_name}! I'm your AI Research Assistant*\n\n"
            message += "I'll help you complete an excellent ZIMSEC School-Based Project by doing research, writing content, and providing complete guidance.\n\n"
            message += "📚 *Which subject is this School-Based Project for?*\n\n"
            message += "Examples: Geography, Home Economics, Design & Technology, Agriculture, Business Studies, etc."
            
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
            message += "I'm ready to help! What would you like me to do today?\n\n"
            message += "💬 I can: do research, write content, provide ideas, or help with any stage of your project."
            
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
        message += "Your project is now set up! I'm your comprehensive research assistant.\n\n"
        message += "💬 *What I can do for you:*\n"
        message += "• Research any topic and provide detailed findings\n"
        message += "• Write project titles, problem statements, and content\n"
        message += "• Find existing solutions and case studies\n"
        message += "• Generate creative ideas and solutions\n"
        message += "• Provide complete literature reviews\n"
        message += "• Help with all 6 ZIMSEC project stages\n\n"
        message += "🚀 *Let's begin!* What do you need help with? Just ask and I'll provide complete answers!"
        
        # Add helpful buttons
        buttons = [
            {"text": "💾 Save & Exit", "callback_data": "project_save_exit"},
            {"text": "🔙 Main Menu", "callback_data": "main_menu"}
        ]
        
        self.whatsapp_service.send_interactive_message(user_id, message, buttons)
    
    def _handle_conversation(self, user_id: str, message_text: str, project_data: dict):
        """Main conversational AI logic - chat with Gemini AI"""
        try:
            # Hybrid Model: Determine if this is a new session or continuation
            conversation_history = project_data.get('conversation_history', [])
            is_new_session = len(conversation_history) == 0
            
            # Check and deduct credits
            if is_new_session:
                # Starting new project session - costs 3 credits
                credit_result = advanced_credit_service.check_and_deduct_credits(
                    user_id, 'project_assistant_start'
                )
            else:
                # Follow-up question - costs 1 credit
                credit_result = advanced_credit_service.check_and_deduct_credits(
                    user_id, 'project_assistant_followup'
                )
            
            # Handle insufficient credits
            if not credit_result.get('success'):
                project_title = project_data.get('project_title', 'your project')
                insufficient_msg = f"""💰 *Need More Credits!* 💰

📚 *Project Assistant*
📝 Project: {project_title}

💳 *Credit Status:*
{credit_result.get('message', 'Insufficient credits')}

🎯 *Project Assistant Benefits:*
• Comprehensive research assistance
• Complete project writing support
• Generate study notes & content
• Suggest relevant images & visuals
• ZIMSEC School-Based Project guidance
• Interactive AI tutoring

💎 *Get More Credits:*"""
                
                buttons = [
                    {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                    {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                    {"text": "🏠 Main Menu", "callback_data": "main_menu"}
                ]
                
                self.whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                return
            
            # Add user message to conversation history
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
            
            # Clean formatting for WhatsApp (convert ** to *)
            clean_response = self._clean_whatsapp_formatting(ai_response)
            
            # Get current credits and show credit status
            current_credits = get_user_credits(user_id)
            credits_used = 3 if is_new_session else 1
            clean_response += f"\n\n💳 *Credits:* {current_credits} (Used: {credits_used})"
            
            # Send AI response to user
            self.whatsapp_service.send_message(user_id, clean_response)
            
        except Exception as e:
            logger.error(f"Error in conversation for {user_id}: {e}", exc_info=True)
            # Fallback response
            fallback_msg = "I'm here to help! Could you rephrase that or ask a specific question about your project?"
            self.whatsapp_service.send_message(user_id, fallback_msg)
    
    def _get_ai_response(self, user_id: str, message_text: str, project_data: dict) -> str:
        """Get intelligent response from Gemini AI"""
        try:
            if not self._is_gemini_configured or not self.gemini_model:
                logger.warning(f"Gemini AI not configured for {user_id}, using fallback")
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
1. DO THE WORK for them - provide complete, ready-to-use content
2. Be comprehensive and detailed - give them everything they need
3. Be encouraging and supportive - build their confidence
4. Be interactive - ask follow-up questions to probe deeper
5. Suggest visual aids when appropriate (diagrams, charts, images)
6. Keep it readable for WhatsApp - use formatting, bullet points, clear structure
7. Focus on ZIMSEC standards and scoring criteria
8. Use simple, clear language"""
            
            # Generate response from Gemini
            try:
                response = self.gemini_model.generate_content(full_prompt)
                
                if response and response.text:
                    ai_text = response.text.strip()
                    logger.info(f"✅ Gemini AI generated response for {user_id} (length: {len(ai_text)})")
                    return ai_text
                else:
                    logger.warning(f"Gemini returned empty response for {user_id}")
                    return self._get_fallback_response(message_text, project_data)
            except Exception as gemini_error:
                logger.error(f"Gemini API error for {user_id}: {gemini_error}", exc_info=True)
                # Try fallback with DeepSeek if available
                return self._try_deepseek_fallback(user_id, message_text, project_data, full_prompt)
                
        except Exception as e:
            logger.error(f"Error getting AI response for {user_id}: {e}", exc_info=True)
            return self._get_fallback_response(message_text, project_data)
    
    def _clean_whatsapp_formatting(self, text: str) -> str:
        """Clean formatting for WhatsApp - convert double asterisks to single for bold"""
        import re
        # Replace **text** with *text* (WhatsApp bold format)
        # Use a regex to avoid replacing single asterisks
        cleaned = re.sub(r'\*\*([^\*]+?)\*\*', r'*\1*', text)
        return cleaned
    
    def _try_deepseek_fallback(self, user_id: str, message_text: str, project_data: dict, prompt: str) -> str:
        """Try DeepSeek AI as fallback when Gemini fails"""
        try:
            import os
            import requests
            deepseek_key = os.getenv('DEEPSEEK_API_KEY')
            if not deepseek_key:
                logger.warning("DeepSeek API key not available for fallback")
                return self._get_fallback_response(message_text, project_data)
            
            # Call DeepSeek API
            response = requests.post(
                'https://api.deepseek.com/chat/completions',
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {deepseek_key}'
                },
                json={
                    'model': 'deepseek-chat',
                    'messages': [
                        {'role': 'system', 'content': self.TEACHER_SYSTEM_PROMPT},
                        {'role': 'user', 'content': prompt}
                    ],
                    'temperature': 0.7,
                    'max_tokens': 2000
                },
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    ai_text = data['choices'][0]['message']['content'].strip()
                    logger.info(f"✅ DeepSeek AI fallback generated response for {user_id}")
                    return ai_text
            
            logger.warning("DeepSeek fallback failed, using basic fallback")
            return self._get_fallback_response(message_text, project_data)
        except Exception as e:
            logger.error(f"DeepSeek fallback error: {e}")
            return self._get_fallback_response(message_text, project_data)
    
    def _get_fallback_response(self, message_text: str, project_data: dict) -> str:
        """Comprehensive fallback responses when Gemini AI is unavailable"""
        message_lower = message_text.lower()
        student_name = project_data.get('student_name', 'there')
        project_title = project_data.get('project_title', 'your project')
        
        # Comprehensive keyword-based responses
        if any(word in message_lower for word in ['title', 'write title']):
            return f"*Project Title Help* 📝\n\nBased on your project about _{project_title}_, here are some strong title formats:\n\n1. \"Improving [Problem] in [Location]\"\n2. \"Reducing [Issue] at [School/Community]\"\n3. \"Developing [Solution] for [Target Group]\"\n\nExample titles:\n• \"Improving Waste Management at Harare High School\"\n• \"Reducing Water Scarcity in Rural Masvingo\"\n• \"Developing a Recycling System for Urban Communities\"\n\nWhat specific problem are you addressing? I'll help you craft a perfect title!"
        
        elif any(word in message_lower for word in ['research', 'literature', 'existing solutions']):
            return f"*Research & Literature Review* 📚\n\nFor your project on _{project_title}_, you should research:\n\n**Existing Solutions:**\n• Government initiatives in Zimbabwe\n• NGO programs addressing similar issues\n• International case studies from other countries\n• Local community projects\n\n**Where to find information:**\n• Zimbabwe government websites\n• Academic journals (Google Scholar)\n• WHO/UN reports for health/development topics\n• Local newspaper archives\n• Interviews with community leaders\n\n**What to include:**\n1. Summary of 3-5 existing solutions\n2. Their strengths and weaknesses\n3. How they're relevant to your context\n4. Gaps that your project will fill\n\nWould you like me to provide specific resources for your topic?"
        
        elif any(word in message_lower for word in ['stage 1', 'problem', 'identify']):
            return f"*Stage 1: Problem Identification* 🎯\n\n**Complete Framework:**\n\n1. **Problem Statement:**\n\"In [Location], [Target Group] experience [Problem] which results in [Impact/Consequences].\"\n\n2. **Who is Affected:**\n• Primary: Students, community members, families\n• Secondary: Teachers, local businesses, government\n\n3. **Evidence:**\n• Statistics or observations\n• Personal experiences or surveys\n• Expert opinions or reports\n\n4. **Why it Matters:**\n• Social impact\n• Economic consequences\n• Health/educational effects\n\n**Example for waste management:**\n\"At Harare High School, students and staff face inadequate waste disposal systems, resulting in environmental pollution, health hazards, and an unpleasant learning environment. This affects 1,200 students daily and contributes to local disease outbreaks.\"\n\nWhat's your problem area? I'll help you write a complete problem statement!"
        
        elif any(word in message_lower for word in ['ideas', 'solutions', 'stage 3']):
            return f"*Generating Ideas & Solutions* 💡\n\n**Brainstorming for {project_title}:**\n\n**Creative Solution Techniques:**\n1. Look at how other countries solve it\n2. Combine existing solutions in new ways\n3. Use technology/apps to improve processes\n4. Create awareness campaigns\n5. Develop training programs\n\n**Innovation Checklist:**\n✓ Is it practical for Zimbabwe context?\n✓ Is it affordable/sustainable?\n✓ Can it be implemented by students/community?\n✓ Does it address the root cause?\n✓ Is it measurable and scalable?\n\n**Example ideas for waste management:**\n• Recycling bins with color-coding system\n• Student-led \"Green Squad\" waste monitors\n• Composting program for organic waste\n• Art from recycled materials project\n• Partnership with local recycling companies\n\nWhat type of solution would you like to develop? I can help you refine it!"
        
        else:
            return f"Hi *{student_name}*! 👋\n\nI'm here to provide complete research and writing assistance for your project: _{project_title}_.\n\n**I can help you with:**\n\n📝 *Writing:*\n• Project titles and problem statements\n• Literature reviews and research summaries\n• Complete content for all 6 stages\n\n🔍 *Research:*\n• Finding existing solutions and case studies\n• Providing facts, statistics, and examples\n• Identifying relevant sources and references\n\n💡 *Ideas:*\n• Generating creative solutions\n• Brainstorming innovations\n• Developing implementation plans\n\nJust tell me what you need, and I'll provide detailed, complete answers!"
    
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

    # ==================== Mobile App Support ====================

    def create_project_mobile(self, user_id: str, data: Dict) -> Dict:
        """Create a new project from mobile app"""
        try:
            # Validate required fields
            required = ['title', 'subject', 'student_name']
            if not all(k in data for k in required):
                raise ValueError("Missing required fields")

            project_data = {
                'project_title': data['title'],
                'subject': data['subject'],
                'student_name': data['student_name'],
                'student_surname': data.get('student_surname', ''),
                'school': data.get('school', ''),
                'form': data.get('form', ''),
                'active': True,
                'mode': 'project_assistant',
                'created_at': datetime.now().isoformat(),
                'conversation_history': [],
                'last_updated': datetime.now().isoformat()
            }

            # Save to database
            if self._save_project_to_database(user_id, project_data):
                # Get the created project to return its ID
                projects = make_supabase_request("GET", "user_projects", filters={
                    "user_id": f"eq.{user_id}",
                    "project_title": f"eq.{project_data['project_title']}",
                    "completed": "eq.false"
                })
                if projects:
                    return projects[0]
            
            raise Exception("Failed to save project")

        except Exception as e:
            logger.error(f"Error creating mobile project for {user_id}: {e}")
            raise

    def get_user_projects(self, user_id: str) -> List[Dict]:
        """Get all active projects for a user"""
        try:
            projects = make_supabase_request("GET", "user_projects", filters={
                "user_id": f"eq.{user_id}",
                "completed": "eq.false"
            })
            
            # Parse project_data for each project
            results = []
            if projects:
                for p in projects:
                    # Ensure project_data is a dict
                    p_data = p.get('project_data', {})
                    if isinstance(p_data, str):
                        try:
                            p_data = json.loads(p_data)
                        except:
                            p_data = {}
                    
                    results.append({
                        'id': p['id'],
                        'title': p.get('project_title'),
                        'subject': p.get('subject'),
                        'current_stage': p.get('current_stage', 1),
                        'updated_at': p.get('updated_at'),
                        'completed': p.get('completed')
                    })
            
            return results
        except Exception as e:
            logger.error(f"Error listing projects for {user_id}: {e}")
            return []

    def get_project_details(self, user_id: str, project_id: int) -> Optional[Dict]:
        """Get detailed project info"""
        try:
            projects = make_supabase_request("GET", "user_projects", filters={
                "id": f"eq.{project_id}",
                "user_id": f"eq.{user_id}"
            })
            
            if projects and len(projects) > 0:
                project = projects[0]
                # Ensure project_data is parsed
                if isinstance(project.get('project_data'), str):
                    try:
                        project['project_data'] = json.loads(project['project_data'])
                    except:
                        pass
                return project
            return None
        except Exception as e:
            logger.error(f"Error getting project details {project_id}: {e}")
            return None

    def process_mobile_message(self, user_id: str, project_id: int, message: str) -> Dict:
        """Process a chat message from mobile app"""
        try:
            # 1. Get project
            project = self.get_project_details(user_id, project_id)
            if not project:
                raise ValueError("Project not found")

            project_data = project.get('project_data', {})
            
            # 2. Check credits (1 credit per message)
            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id, 'project_assistant_followup'
            )
            
            if not credit_result.get('success'):
                raise ValueError(credit_result.get('message', 'Insufficient credits'))

            # 3. Update history
            conversation_history = project_data.get('conversation_history', [])
            conversation_history.append({
                'role': 'user',
                'content': message,
                'timestamp': datetime.now().isoformat()
            })

            # 4. Get AI Response
            ai_response = self._get_ai_response(user_id, message, project_data)

            # 5. Add AI response to history
            conversation_history.append({
                'role': 'assistant',
                'content': ai_response,
                'timestamp': datetime.now().isoformat()
            })

            # Keep history manageable
            if len(conversation_history) > 50:
                conversation_history = conversation_history[-50:]

            # 6. Save updates
            project_data['conversation_history'] = conversation_history
            project_data['last_updated'] = datetime.now().isoformat()
            
            # Update database
            self._save_project_to_database(user_id, project_data)

            return {
                'response': ai_response,
                'project_id': project_id,
                'credits_remaining': get_user_credits(user_id)
            }

        except Exception as e:
            logger.error(f"Error processing mobile message: {e}")
            raise

    def get_chat_history(self, user_id: str, project_id: int) -> List[Dict]:
        """Get chat history for a project"""
        try:
            project = self.get_project_details(user_id, project_id)
            if project and project.get('project_data'):
                return project['project_data'].get('conversation_history', [])
            return []
        except Exception as e:
            logger.error(f"Error getting chat history: {e}")
            return []

    def generate_project_document(self, user_id: str, project_id: int) -> str:
        """Generate a final document for the project"""
        # Placeholder for document generation logic
        # In a real implementation, this would generate a PDF or Word doc
        return "https://example.com/project_document.pdf"
