"""
ZIMSEC Project Assistant Service - Conversational AI Version
A ChatGPT-style chatbot where DeepSeek AI acts as a professional teacher
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

# Import requests for DeepSeek API
import requests

# Import Google Gemini AI (fallback only)
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    GENAI_AVAILABLE = False


class ProjectAssistantService:
    """
    Conversational AI Project Assistant - like ChatGPT for ZIMSEC projects
    Students chat naturally with DeepSeek AI acting as a professional teacher
    """
    
    def __init__(self):
        self.whatsapp_service = WhatsAppService()
        
        # Initialize DeepSeek AI as primary provider
        self.deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
        self.deepseek_api_url = 'https://api.deepseek.com/chat/completions'
        self._is_deepseek_configured = bool(self.deepseek_api_key)
        
        # Initialize Gemini AI as fallback
        self.gemini_model = None
        self._is_gemini_configured = False
        try:
            if GENAI_AVAILABLE:
                api_key = os.getenv('GEMINI_API_KEY')
                if api_key and genai:
                    genai.configure(api_key=api_key)
                    self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
                    self._is_gemini_configured = True
        except Exception as e:
            logger.error(f"Error initializing Gemini fallback: {e}")
        
        if self._is_deepseek_configured:
            logger.info("✅ Project Assistant initialized with DeepSeek AI (primary)")
        elif self._is_gemini_configured:
            logger.warning("DeepSeek not available - using Gemini as primary")
        else:
            logger.warning("No AI services available")
    
    # System prompt that makes DeepSeek AI a comprehensive, engaging research assistant
    TEACHER_SYSTEM_PROMPT = """You are NerdX AI — a brilliant, friendly, and enthusiastic research assistant for ZIMSEC School-Based Projects. You're like having a genius best friend who loves helping with projects!

🎯 YOUR PERSONALITY:
• Warm, encouraging, and genuinely excited to help
• Use simple, clear language — no complicated jargon
• Be conversational and fun, like chatting with a smart friend
• Celebrate student progress with enthusiasm!
• Ask thoughtful questions to understand their needs

📝 FORMATTING RULES (VERY IMPORTANT):
• NEVER use asterisks (*) or markdown formatting
• Use emojis sparingly for visual appeal: 📚 💡 ✨ ✅ 🎯 📊
• Use line breaks for readability
• Use numbered lists (1, 2, 3) for steps
• Use bullet points (•) for options or ideas
• Keep paragraphs short and punchy (2-3 sentences max)
• Make text scannable — students should easily find key info

🏆 HOW YOU HELP:
1. PROBLEM IDENTIFICATION
   Help find interesting local problems worth solving. Ask about their community, school, or interests to discover meaningful topics.

2. RESEARCH & INVESTIGATION
   Provide detailed research findings, facts, statistics, case studies, and examples. Do the research FOR them!

3. CREATIVE IDEAS
   Brainstorm innovative solutions. Be creative and practical.

4. DEVELOPMENT
   Help build implementation plans, timelines, and detailed proposals.

5. PRESENTATION
   Assist with organizing findings and creating compelling presentations.

6. EVALUATION
   Help analyze results and write strong recommendations.

💬 EXAMPLE RESPONSE STYLE:

Instead of: "**Stage 1: Problem Identification**"
Write: "📋 Stage 1 — Problem Identification"

Instead of: "* Option A\\n* Option B"
Write: 
"Here are some exciting options:

• Crop Production — maize, vegetables, tobacco
• Animal Husbandry — poultry, cattle, goats  
• Soil Science — conservation methods
• Water Management — irrigation systems"

📌 KEY COMMANDS:
• "generate notes on [topic]" — Create study notes
• "suggest images for [topic]" — Recommend visual aids
• "write [section]" — Write project content
• "research [topic]" — Provide research findings

Remember: You're their project partner! Be helpful, be thorough, and make learning fun. Your responses should look clean and professional on a mobile phone screen."""

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
                menu_text += "I'm powered by DeepSeek AI and I'll help you create an excellent ZIMSEC School-Based Project.\n\n"
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
        """Get intelligent response from DeepSeek AI (primary) with Gemini fallback"""
        try:
            # Build context
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
            
            # Create full prompt
            full_prompt = f"""{self.TEACHER_SYSTEM_PROMPT}

**Student Information:**
- Name: {student_name}
- Project Title: {project_title}
- Subject: {subject}

**Recent Conversation:**
{history_text if history_text else "(First message)"}

**Current Student Message:**
{message_text}

**Your Response (as the teacher):**"""
            
            # Try DeepSeek first (primary)
            if self._is_deepseek_configured:
                try:
                    response = requests.post(
                        self.deepseek_api_url,
                        headers={'Authorization': f'Bearer {self.deepseek_api_key}', 'Content-Type': 'application/json'},
                        json={
                            'model': 'deepseek-chat',
                            'messages': [
                                {'role': 'system', 'content': self.TEACHER_SYSTEM_PROMPT},
                                {'role': 'user', 'content': full_prompt}
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
                            ai_text = self._clean_markdown(ai_text)
                            logger.info(f"✅ DeepSeek AI generated response for {user_id} (length: {len(ai_text)})")
                            return ai_text
                except Exception as deepseek_error:
                    logger.error(f"DeepSeek API error for {user_id}: {deepseek_error}", exc_info=True)
            
            # Try Gemini as fallback
            if self._is_gemini_configured and self.gemini_model:
                try:
                    response = self.gemini_model.generate_content(full_prompt)
                    if response and response.text:
                        ai_text = response.text.strip()
                        ai_text = self._clean_markdown(ai_text)
                        logger.info(f"✅ Gemini AI fallback generated response for {user_id}")
                        return ai_text
                except Exception as gemini_error:
                    logger.error(f"Gemini fallback error for {user_id}: {gemini_error}")
            
            # Return fallback response
            return self._get_fallback_response(message_text, project_data)
            
        except Exception as e:
            logger.error(f"Error getting AI response for {user_id}: {e}", exc_info=True)
            return self._get_fallback_response(message_text, project_data)
    
    def _get_fallback_response(self, message_text: str, project_data: dict) -> str:
        """Comprehensive fallback responses when Gemini AI is unavailable"""
        message_lower = message_text.lower()
        student_name = project_data.get('student_name', 'there')
        project_title = project_data.get('project_title', 'your project')
        
        # Comprehensive keyword-based responses
        if any(word in message_lower for word in ['title', 'write title']):
            return f"📝 Project Title Help\n\nBased on your project about {project_title}, here are some strong title formats:\n\n1. Improving [Problem] in [Location]\n2. Reducing [Issue] at [School/Community]\n3. Developing [Solution] for [Target Group]\n\nExample titles:\n• Improving Waste Management at Harare High School\n• Reducing Water Scarcity in Rural Masvingo\n• Developing a Recycling System for Urban Communities\n\nWhat specific problem are you addressing? I'll help you craft a perfect title!"
        
        elif any(word in message_lower for word in ['research', 'literature', 'existing solutions']):
            return f"📚 Research & Literature Review\n\nFor your project on {project_title}, you should research:\n\nExisting Solutions:\n• Government initiatives in Zimbabwe\n• NGO programs addressing similar issues\n• International case studies\n• Local community projects\n\nWhere to find information:\n• Zimbabwe government websites\n• Academic journals (Google Scholar)\n• WHO/UN reports\n• Local newspaper archives\n• Interviews with community leaders\n\nWhat to include:\n1. Summary of 3-5 existing solutions\n2. Their strengths and weaknesses\n3. How they're relevant to your context\n4. Gaps that your project will fill\n\nWould you like me to provide specific resources for your topic?"
        
        elif any(word in message_lower for word in ['stage 1', 'problem', 'identify']):
            return f"🎯 Stage 1 — Problem Identification\n\nComplete Framework:\n\n1. Problem Statement:\n\"In [Location], [Target Group] experience [Problem] which results in [Impact/Consequences].\"\n\n2. Who is Affected:\n• Primary: Students, community members, families\n• Secondary: Teachers, local businesses, government\n\n3. Evidence:\n• Statistics or observations\n• Personal experiences or surveys\n• Expert opinions or reports\n\n4. Why it Matters:\n• Social impact\n• Economic consequences\n• Health/educational effects\n\nExample for waste management:\n\"At Harare High School, students and staff face inadequate waste disposal systems, resulting in environmental pollution, health hazards, and an unpleasant learning environment.\"\n\nWhat's your problem area? I'll help you write a complete problem statement!"
        
        elif any(word in message_lower for word in ['ideas', 'solutions', 'stage 3']):
            return f"💡 Generating Ideas & Solutions\n\nBrainstorming for {project_title}:\n\nCreative Solution Techniques:\n1. Look at how other countries solve it\n2. Combine existing solutions in new ways\n3. Use technology/apps to improve processes\n4. Create awareness campaigns\n5. Develop training programs\n\nInnovation Checklist:\n✓ Is it practical for Zimbabwe context?\n✓ Is it affordable/sustainable?\n✓ Can it be implemented by students/community?\n✓ Does it address the root cause?\n✓ Is it measurable and scalable?\n\nExample ideas for waste management:\n• Recycling bins with color-coding system\n• Student-led \"Green Squad\" waste monitors\n• Composting program for organic waste\n• Art from recycled materials project\n\nWhat type of solution would you like to develop?"
        
        else:
            return f"Hi {student_name}! 👋\n\nI'm NerdX AI, your project partner for: {project_title}\n\n📝 Writing Help\n• Project titles and problem statements\n• Literature reviews and research summaries\n• Complete content for all 6 stages\n\n🔍 Research Help\n• Finding existing solutions and case studies\n• Providing facts, statistics, and examples\n• Identifying relevant sources\n\n💡 Ideas\n• Generating creative solutions\n• Brainstorming innovations\n• Developing implementation plans\n\nJust tell me what you need!"
    
    def _clean_markdown(self, text: str) -> str:
        """Remove markdown formatting for clean mobile display"""
        import re
        
        # Remove bold asterisks: **text** or __text__
        text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
        text = re.sub(r'__([^_]+)__', r'\1', text)
        
        # Remove italic asterisks: *text* or _text_
        text = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'\1', text)
        text = re.sub(r'(?<!_)_([^_]+)_(?!_)', r'\1', text)
        
        # Replace markdown bullets with clean bullets
        text = re.sub(r'^\s*[-*]\s+', '• ', text, flags=re.MULTILINE)
        
        # Clean up extra whitespace
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        return text.strip()
    
    def _clean_whatsapp_formatting(self, text: str) -> str:
        """Clean response for WhatsApp display"""
        return self._clean_markdown(text)
    
    def save_and_exit(self, user_id: str):
        """Save project and exit to main menu"""
        try:
            project_data = self._get_project_data(user_id)
            
            if project_data:
                # Save to database
                success = self._save_project_to_database(user_id, project_data)
                
                if success:
                    student_name = project_data.get('student_name', 'there')
                    message = f"✅ Project Saved!\n\n"
                    message += f"All your progress has been saved, {student_name}.\n\n"
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

    def generate_project_document(self, user_id: str, project_id: int) -> dict:
        """Generate a complete ZIMSEC project document as PDF using DeepSeek AI"""
        try:
            import requests
            from utils.project_pdf_generator import ProjectDocumentGenerator
            
            # Get project details from database
            project = self.get_project_details(user_id, project_id)
            if not project:
                raise ValueError("Project not found")
            
            project_data = project.get('project_data', {})
            if isinstance(project_data, str):
                import json
                project_data = json.loads(project_data)
            
            # Get conversation history to build project content
            conversation_history = project_data.get('conversation_history', [])
            project_title = project.get('project_title', 'Untitled Project')
            subject = project.get('subject', 'Not specified')
            
            # Use DeepSeek to generate comprehensive project content
            enhanced_data = self._generate_project_content_with_ai(
                project_title, subject, conversation_history, project_data
            )
            
            # Merge AI-generated content into project data
            project_data.update(enhanced_data)
            
            # Prepare full project data for PDF generator
            full_project_data = {
                'id': project_id,
                'project_title': project_title,
                'subject': subject,
                'project_data': project_data
            }
            
            # Generate PDF
            pdf_generator = ProjectDocumentGenerator()
            pdf_path = pdf_generator.generate_project_document(full_project_data, user_id)
            
            logger.info(f"✅ Generated project PDF for {user_id}: {pdf_path}")
            
            return {
                'success': True,
                'pdf_path': pdf_path,
                'filename': f"ZIMSEC_Project_{project_id}.pdf"
            }
            
        except Exception as e:
            logger.error(f"Error generating project document for {user_id}: {e}", exc_info=True)
            raise
    
    def _generate_project_content_with_ai(self, title: str, subject: str, 
                                           conversation_history: list, 
                                           existing_data: dict) -> dict:
        """Use DeepSeek AI to generate comprehensive project content"""
        
        # Build context from conversation history
        conversation_text = ""
        for msg in conversation_history[-20:]:  # Last 20 messages
            role = "Student" if msg.get('role') == 'user' else "NerdX AI"
            conversation_text += f"{role}: {msg.get('content', '')}\n\n"
        
        prompt = f"""Based on this ZIMSEC School-Based Project conversation, generate comprehensive project document content.

PROJECT TITLE: {title}
SUBJECT: {subject}

CONVERSATION HISTORY:
{conversation_text if conversation_text else "No conversation history available."}

Generate content for each section. Be detailed and professional. Return ONLY valid JSON:

{{
    "problem_definition": "Detailed problem statement explaining the issue this project addresses...",
    "investigation": "Investigation of the current system, its limitations and stakeholder analysis...",
    "requirements": ["Requirement 1", "Requirement 2", "Requirement 3"],
    "objectives": ["Objective 1", "Objective 2", "Objective 3"],
    "alternatives": "Analysis of alternative methods and solutions considered...",
    "input_design": "Description of inputs required for the solution...",
    "output_design": "Description of expected outputs and deliverables...",
    "test_plan": "Comprehensive testing strategy and test cases...",
    "implementation": "How the project was implemented, tools and methods used...",
    "testing": "Testing process, results and findings...",
    "user_documentation": "User manual and instructions...",
    "technical_documentation": "Technical specifications and developer notes...",
    "evaluation": "Evaluation of project success against objectives...",
    "conclusion": "Summary of outcomes, lessons learned and recommendations..."
}}"""

        # Try DeepSeek first
        if self.deepseek_api_key:
            try:
                response = requests.post(
                    "https://api.deepseek.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.deepseek_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "deepseek-chat",
                        "messages": [
                            {"role": "system", "content": "You are a ZIMSEC project document writer. Generate professional, detailed content for school-based projects."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.7,
                        "max_tokens": 4000
                    },
                    timeout=60
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                    if content:
                        import json
                        # Clean JSON
                        content = content.strip()
                        if content.startswith("```json"):
                            content = content[7:]
                        if content.startswith("```"):
                            content = content[3:]
                        if content.endswith("```"):
                            content = content[:-3]
                        
                        logger.info("✅ Generated project content using DeepSeek AI")
                        return json.loads(content.strip())
                        
            except Exception as e:
                logger.error(f"DeepSeek project content generation failed: {e}")
        
        # Fallback content if AI fails
        logger.warning("Using fallback project content")
        return {
            "problem_definition": f"This project addresses a significant issue in the field of {subject}. The problem identified affects the community and requires an innovative solution.",
            "investigation": "An investigation was conducted to understand the current situation, including interviews with stakeholders and analysis of existing systems.",
            "requirements": [
                "The solution must be practical and affordable",
                "It should be sustainable and environmentally friendly",
                "It must meet the needs of the target users"
            ],
            "objectives": [
                "To develop an effective solution to the identified problem",
                "To implement and test the solution",
                "To evaluate the impact and make recommendations"
            ],
            "alternatives": "Several alternative approaches were considered before selecting the final solution based on feasibility, cost, and effectiveness.",
            "input_design": "The inputs required include user data, resources, and materials necessary for implementation.",
            "output_design": "The expected outputs include a working solution, documentation, and measurable improvements.",
            "test_plan": "Testing will involve functionality tests, user acceptance testing, and evaluation against objectives.",
            "implementation": "The project was implemented using appropriate tools, technologies, and methods suitable for the context.",
            "testing": "Comprehensive testing was conducted to ensure the solution works as intended and meets all requirements.",
            "user_documentation": "This document serves as a guide for users on how to operate and maintain the solution.",
            "technical_documentation": "Technical specifications and maintenance procedures are documented for future reference.",
            "evaluation": "The project was evaluated against the original objectives, demonstrating significant achievement of goals.",
            "conclusion": "This project successfully addressed the identified problem and provides a sustainable solution with recommendations for future improvements."
        }

