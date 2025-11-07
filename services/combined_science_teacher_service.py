"""
Combined Science Teacher Service - Professional AI Teacher
A conversational AI teacher for Biology, Chemistry, and Physics with personalized PDF note generation
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


class CombinedScienceTeacherService:
    """
    Professional AI Science Teacher for Biology, Chemistry, and Physics
    Provides personalized instruction and generates comprehensive PDF notes
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
                    # Use gemini-2.0-flash-exp for intelligent teaching
                    self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
                    self._is_gemini_configured = True
                    logger.info("✅ Combined Science Teacher initialized with Gemini AI (gemini-2.0-flash-exp)")
                else:
                    logger.warning("GEMINI_API_KEY not found - AI teaching unavailable")
            else:
                logger.warning("Google Generative AI not available")
        except Exception as e:
            logger.error(f"Error initializing Gemini: {e}")
    
    # Professional teacher system prompt from user
    TEACHER_SYSTEM_PROMPT = """You are a professional Combined Science teacher who provides personalized instruction and structured notes in Biology, Chemistry, and Physics. Your goal is to teach students clearly and create high-quality personalized PDF notes for each topic.

### Teaching Objective
Provide clear, personalized teaching sessions — explaining any Combined Science topic with real understanding, relevance, and structure. There are NO quizzes or practice questions here. Your only tasks are:
1. Teach clearly and interactively through chat.
2. Automatically generate high-quality, personalized notes in PDF format upon request or after the session.

### Teaching Approach
- Begin by greeting the student and asking for:
  - Their subject choice (Biology, Chemistry, or Physics)
  - Their grade level or learning stage (e.g., Form 2, O-Level, A-Level)
  - Their topic of interest, or offer to select a random topic if they are unsure.

- Use conversational explanations — friendly, patient, and professional.
- Provide examples, analogies, and real-life applications to make the lesson memorable.
- Summarize key ideas at the end of each section.
- Adapt explanations to the student's level — use simpler terms for lower grades and deeper detail for advanced learners.

### Personalized Notes (PDF)
Whenever the student requests "Generate notes" or "Save this lesson as notes," create VERY DETAILED, comprehensive notes for the topic in JSON format with this structure:

{
  "title": "Topic title here",
  "subject": "Biology/Chemistry/Physics",
  "grade_level": "Form 2/O-Level/A-Level",
  "learning_objectives": [
    "Detailed objective 1 with context",
    "Detailed objective 2 with context",
    "Detailed objective 3 with context",
    "Detailed objective 4 with context"
  ],
  "key_concepts": {
    "concept1": "Comprehensive definition with detailed explanation and examples",
    "concept2": "Comprehensive definition with detailed explanation and examples",
    "concept3": "Comprehensive definition with detailed explanation and examples",
    "concept4": "Comprehensive definition with detailed explanation and examples",
    "concept5": "Comprehensive definition with detailed explanation and examples"
  },
  "detailed_explanation": "VERY COMPREHENSIVE, LONG, step-by-step explanation of the topic. Include:
  - Introduction with background context (2-3 paragraphs)
  - Detailed breakdown of each component (multiple paragraphs per component)
  - Step-by-step processes with explanations (be thorough)
  - Multiple examples with full explanations
  - Diagrams described in words
  - Common misconceptions addressed
  - Connections to related topics
  - At least 500-800 words of detailed, well-structured content covering everything about the topic",
  "real_world_applications": [
    "Detailed application 1 with full explanation of how it works in real life",
    "Detailed application 2 with full explanation of how it works in real life",
    "Detailed application 3 with full explanation of how it works in real life",
    "Detailed application 4 with full explanation of how it works in real life"
  ],
  "summary": "Comprehensive summary of all key takeaways (3-4 paragraphs)",
  "revision_schedule": {
    "day_3": "Detailed review plan for day 3 with specific topics to revisit",
    "day_7": "Detailed practice plan for day 7 with specific exercises and concepts"
  },
  "references": [
    "ZIMSEC Syllabus - Specific section",
    "Relevant textbook chapters",
    "Scientific sources"
  ]
}

CRITICAL: Make the notes VERY DETAILED with LONG, WELL-STRUCTURED TEXT. The "detailed_explanation" field should be comprehensive (500-800 words minimum), covering EVERYTHING about the topic in depth. Break down information thoroughly with multiple paragraphs. Students should be able to learn the entire topic from these notes alone.

When a student says "generate notes", "save notes", "create notes", or similar, respond ONLY with valid JSON in the above format, nothing else.

Current conversation context will be provided with each message."""

    def show_main_menu(self, user_id: str):
        """Display the Combined Science main menu with Teacher/Practice options"""
        try:
            menu_text = "🔬 *Combined Science*\n"
            menu_text += "─────────────────────\n\n"
            menu_text += "Choose your learning mode:\n\n"
            menu_text += "👨‍🏫 *Teacher Mode*\n"
            menu_text += "Get personalized lessons from an AI teacher in Biology, Chemistry, or Physics. "
            menu_text += "The teacher will explain topics clearly and generate comprehensive PDF notes for you.\n\n"
            menu_text += "📝 *Practice Mode*\n"
            menu_text += "Test your knowledge with practice questions and quizzes."
            
            buttons = [
                {"text": "👨‍🏫 Teacher Mode", "callback_data": "science_teacher_mode"},
                {"text": "📝 Practice Mode", "callback_data": "science_practice_mode"},
                {"text": "🔙 Main Menu", "callback_data": "main_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, menu_text, buttons)
            
        except Exception as e:
            logger.error(f"Error showing Combined Science menu for {user_id}: {e}")
            self.whatsapp_service.send_message(
                user_id,
                "Sorry, I encountered an error. Please try again."
            )
    
    def start_teacher_mode(self, user_id: str):
        """Start teacher mode - ask for subject and topic selection"""
        try:
            # Initialize new teaching session
            session_manager.set_data(user_id, 'science_teacher', {
                'active': True,
                'awaiting': 'subject_selection',
                'conversation_history': [],
                'started_at': datetime.now().isoformat()
            })
            
            message = "👨‍🏫 *Welcome to Teacher Mode!*\n\n"
            message += "I'm your professional Combined Science teacher, ready to help you learn!\n\n"
            message += "Which subject would you like to study today?"
            
            buttons = [
                {"text": "🧬 Biology", "callback_data": "science_subject_biology"},
                {"text": "⚗️ Chemistry", "callback_data": "science_subject_chemistry"},
                {"text": "⚛️ Physics", "callback_data": "science_subject_physics"},
                {"text": "🔙 Back", "callback_data": "combined_science"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
        except Exception as e:
            logger.error(f"Error starting teacher mode for {user_id}: {e}")
            self.whatsapp_service.send_message(
                user_id,
                "Sorry, I encountered an error. Please try again."
            )
    
    def select_subject(self, user_id: str, subject: str):
        """Handle subject selection and ask for grade level"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            session_data['subject'] = subject
            session_data['awaiting'] = 'grade_level'
            session_manager.set_data(user_id, 'science_teacher', session_data)
            
            subject_emoji = {
                'Biology': '🧬',
                'Chemistry': '⚗️',
                'Physics': '⚛️'
            }
            
            message = f"{subject_emoji.get(subject, '🔬')} *{subject} Selected!*\n\n"
            message += "What is your grade level or learning stage?"
            
            buttons = [
                {"text": "📘 Form 1-2", "callback_data": "science_grade_form12"},
                {"text": "📗 Form 3-4 (O-Level)", "callback_data": "science_grade_olevel"},
                {"text": "📕 A-Level", "callback_data": "science_grade_alevel"},
                {"text": "🔙 Back", "callback_data": "science_teacher_mode"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
        except Exception as e:
            logger.error(f"Error selecting subject for {user_id}: {e}")
    
    def select_grade_level(self, user_id: str, grade_level: str):
        """Handle grade level selection and ask for topic"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            session_data['grade_level'] = grade_level
            session_data['awaiting'] = 'topic_selection'
            session_manager.set_data(user_id, 'science_teacher', session_data)
            
            subject = session_data.get('subject', 'Science')
            
            message = f"📚 *{grade_level} {subject}*\n\n"
            message += "Great! Now, what topic would you like to learn about?\n\n"
            message += "You can:\n"
            message += "• Type a specific topic (e.g., 'Photosynthesis', 'Acids and Bases', 'Motion')\n"
            message += "• Ask me to pick a random topic\n"
            message += "• Ask me to suggest topics for your level"
            
            buttons = [
                {"text": "🎲 Random Topic", "callback_data": "science_random_topic"},
                {"text": "💡 Suggest Topics", "callback_data": "science_suggest_topics"},
                {"text": "🔙 Back", "callback_data": "science_teacher_mode"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
        except Exception as e:
            logger.error(f"Error selecting grade level for {user_id}: {e}")
    
    def handle_random_topic(self, user_id: str):
        """Pick a random topic based on subject and grade level"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            
            # Use Gemini to pick a random topic
            if self._is_gemini_configured:
                prompt = f"Pick one random important topic for {grade_level} {subject} that ZIMSEC students should learn. Respond with ONLY the topic name, nothing else."
                
                try:
                    response = self.gemini_model.generate_content(prompt)
                    topic = response.text.strip()
                    
                    # Start teaching this topic
                    self.start_teaching_session(user_id, topic)
                    
                except Exception as e:
                    logger.error(f"Gemini error picking random topic: {e}")
                    # Fallback topics
                    fallback_topics = {
                        'Biology': ['Cell Structure', 'Photosynthesis', 'Digestion', 'Respiration'],
                        'Chemistry': ['Atomic Structure', 'Chemical Bonding', 'Acids and Bases', 'Periodic Table'],
                        'Physics': ['Forces and Motion', 'Energy', 'Electricity', 'Waves']
                    }
                    import random
                    topic = random.choice(fallback_topics.get(subject, ['General Science']))
                    self.start_teaching_session(user_id, topic)
            else:
                self.whatsapp_service.send_message(
                    user_id,
                    "AI teacher is unavailable. Please type a topic you'd like to learn."
                )
        
        except Exception as e:
            logger.error(f"Error handling random topic for {user_id}: {e}")
    
    def suggest_topics(self, user_id: str):
        """Suggest relevant topics based on subject and grade level"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            
            if self._is_gemini_configured:
                prompt = f"List 5 important topics for {grade_level} {subject} that ZIMSEC students should learn. Format as a simple numbered list."
                
                try:
                    response = self.gemini_model.generate_content(prompt)
                    suggestions = response.text.strip()
                    
                    message = f"📚 *Suggested {subject} Topics for {grade_level}:*\n\n"
                    message += suggestions
                    message += "\n\n💬 Type any topic name to start learning!"
                    
                    self.whatsapp_service.send_message(user_id, message)
                    
                except Exception as e:
                    logger.error(f"Gemini error suggesting topics: {e}")
                    self._send_fallback_topic_suggestions(user_id, subject, grade_level)
            else:
                self._send_fallback_topic_suggestions(user_id, subject, grade_level)
        
        except Exception as e:
            logger.error(f"Error suggesting topics for {user_id}: {e}")
    
    def _send_fallback_topic_suggestions(self, user_id: str, subject: str, grade_level: str):
        """Send fallback topic suggestions when AI is unavailable"""
        topic_suggestions = {
            'Biology': [
                '1. Cell Structure and Function',
                '2. Photosynthesis and Respiration',
                '3. Human Digestive System',
                '4. Genetics and Inheritance',
                '5. Evolution and Natural Selection'
            ],
            'Chemistry': [
                '1. Atomic Structure and Bonding',
                '2. Periodic Table and Elements',
                '3. Acids, Bases, and Salts',
                '4. Chemical Reactions and Equations',
                '5. Organic Chemistry Basics'
            ],
            'Physics': [
                '1. Forces and Motion',
                '2. Energy and Work',
                '3. Electricity and Circuits',
                '4. Waves and Sound',
                '5. Light and Optics'
            ]
        }
        
        suggestions = topic_suggestions.get(subject, ['General Science Topics'])
        message = f"📚 *Suggested {subject} Topics for {grade_level}:*\n\n"
        message += '\n'.join(suggestions)
        message += "\n\n💬 Type any topic name to start learning!"
        
        self.whatsapp_service.send_message(user_id, message)
    
    def start_teaching_session(self, user_id: str, topic: str):
        """Start teaching a specific topic"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            session_data['topic'] = topic
            session_data['awaiting'] = 'conversation'
            session_data['conversation_history'] = []
            session_manager.set_data(user_id, 'science_teacher', session_data)
            
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            
            # Get initial teaching from Gemini
            if self._is_gemini_configured:
                initial_message = f"Start teaching {topic} to a {grade_level} student studying {subject}. Begin with a warm greeting and introduction to the topic."
                
                response_text = self._get_gemini_teaching_response(user_id, initial_message, session_data)
                # Clean formatting for WhatsApp (convert ** to *)
                response_text = self._clean_whatsapp_formatting(response_text)
                
                # Add helpful instructions
                message = f"📖 *Topic: {topic}*\n\n{response_text}\n\n"
                message += "─────────────────────\n"
                message += "💬 Ask me questions or type *'generate notes'* when ready for PDF notes!\n"
                message += "📤 Type *'exit'* to leave Teacher Mode"
                
                self.whatsapp_service.send_message(user_id, message)
            else:
                self._send_fallback_teaching(user_id, topic, subject, grade_level)
        
        except Exception as e:
            logger.error(f"Error starting teaching session for {user_id}: {e}")
    
    def handle_conversation(self, user_id: str, message_text: str):
        """Handle ongoing teaching conversation"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            
            # Check if user wants to exit/leave Teacher Mode (exact matches or specific phrases only)
            message_lower = message_text.lower().strip()
            exit_commands = [
                'exit', 'leave', 'stop', 'quit', 'back', 
                'main menu', 'go back', 'return', 'exit teacher mode',
                'leave teacher mode', 'go to main menu', 'back to menu'
            ]
            if message_lower in exit_commands:
                self.exit_teacher_mode(user_id)
                return
            
            # Check if user wants to generate notes
            if any(keyword in message_text.lower() for keyword in ['generate notes', 'save notes', 'create notes', 'make notes', 'notes pdf']):
                self.generate_notes(user_id)
                return
            
            # Add user message to history
            conversation_history = session_data.get('conversation_history', [])
            conversation_history.append({
                'role': 'user',
                'content': message_text
            })
            
            # Get AI response
            if self._is_gemini_configured:
                response_text = self._get_gemini_teaching_response(user_id, message_text, session_data)
                
                # Add AI response to history
                conversation_history.append({
                    'role': 'assistant',
                    'content': response_text
                })
                
                # Keep last 20 messages
                session_data['conversation_history'] = conversation_history[-20:]
                session_manager.set_data(user_id, 'science_teacher', session_data)
                
                # Clean formatting for WhatsApp (convert ** to *)
                clean_response = self._clean_whatsapp_formatting(response_text)
                self.whatsapp_service.send_message(user_id, clean_response)
            else:
                self._send_fallback_response(user_id, message_text, session_data)
        
        except Exception as e:
            logger.error(f"Error handling conversation for {user_id}: {e}")
            self.whatsapp_service.send_message(
                user_id,
                "Sorry, I encountered an error. Please try again."
            )
    
    def _clean_whatsapp_formatting(self, text: str) -> str:
        """Clean formatting for WhatsApp - convert double asterisks to single for bold"""
        import re
        # Replace **text** with *text* (WhatsApp bold format)
        # Use a regex to avoid replacing single asterisks
        cleaned = re.sub(r'\*\*([^\*]+?)\*\*', r'*\1*', text)
        return cleaned
    
    def _get_gemini_teaching_response(self, user_id: str, message_text: str, session_data: dict) -> str:
        """Get teaching response from Gemini AI"""
        try:
            # Build context
            subject = session_data.get('subject', 'Science')
            grade_level = session_data.get('grade_level', 'O-Level')
            topic = session_data.get('topic', 'General Science')
            conversation_history = session_data.get('conversation_history', [])
            
            # Build conversation context
            context = f"Subject: {subject}\nGrade Level: {grade_level}\nTopic: {topic}\n\n"
            
            # Add recent conversation history
            if conversation_history:
                context += "Recent conversation:\n"
                for msg in conversation_history[-10:]:
                    role = "Student" if msg['role'] == 'user' else "You"
                    context += f"{role}: {msg['content']}\n"
            
            # Create full prompt
            full_prompt = f"{self.TEACHER_SYSTEM_PROMPT}\n\n{context}\n\nStudent's message: {message_text}\n\nYour response:"
            
            response = self.gemini_model.generate_content(full_prompt)
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Error getting Gemini teaching response: {e}")
            return self._get_fallback_teaching_response(message_text, session_data)
    
    def _get_fallback_teaching_response(self, message_text: str, session_data: dict) -> str:
        """Fallback response when AI is unavailable"""
        topic = session_data.get('topic', 'this topic')
        return f"I'm having trouble connecting to my AI teacher. However, I can tell you that {topic} is an important concept in science. Please try asking your question again, or type 'generate notes' to create study materials."
    
    def _send_fallback_teaching(self, user_id: str, topic: str, subject: str, grade_level: str):
        """Send fallback teaching content when AI is unavailable"""
        message = f"📖 *Topic: {topic}*\n\n"
        message += f"Welcome to {subject} at {grade_level}!\n\n"
        message += f"Today we'll be learning about {topic}. This is an important concept that you'll need to understand.\n\n"
        message += "Unfortunately, my AI teacher is currently unavailable, but you can still:\n"
        message += "• Ask me questions about the topic\n"
        message += "• Request 'generate notes' to create study materials\n"
        message += "• Practice your understanding\n\n"
        message += "How can I help you with this topic?"
        
        self.whatsapp_service.send_message(user_id, message)
    
    def _send_fallback_response(self, user_id: str, message_text: str, session_data: dict):
        """Send fallback response when AI teaching is unavailable"""
        response = self._get_fallback_teaching_response(message_text, session_data)
        self.whatsapp_service.send_message(user_id, response)
    
    def generate_notes(self, user_id: str):
        """Generate PDF notes for the current teaching session"""
        try:
            session_data = session_manager.get_data(user_id, 'science_teacher') or {}
            topic = session_data.get('topic')
            
            if not topic:
                self.whatsapp_service.send_message(
                    user_id,
                    "Please select a topic first before generating notes."
                )
                return
            
            self.whatsapp_service.send_message(
                user_id,
                "📝 Generating your personalized notes... This will take a moment."
            )
            
            # Request notes from Gemini in JSON format
            if self._is_gemini_configured:
                subject = session_data.get('subject', 'Science')
                grade_level = session_data.get('grade_level', 'O-Level')
                conversation_history = session_data.get('conversation_history', [])
                
                # Build context from conversation
                conversation_context = ""
                if conversation_history:
                    conversation_context = "\n\nContext from our lesson:\n"
                    for msg in conversation_history:
                        role = "Student" if msg['role'] == 'user' else "Teacher"
                        conversation_context += f"{role}: {msg['content'][:200]}\n"
                
                prompt = f"{self.TEACHER_SYSTEM_PROMPT}\n\nSubject: {subject}\nGrade Level: {grade_level}\nTopic: {topic}{conversation_context}\n\nStudent request: Generate notes\n\nProvide comprehensive personalized notes in valid JSON format."
                
                try:
                    response = self.gemini_model.generate_content(prompt)
                    notes_data = self._parse_notes_response(response.text)
                    
                    if notes_data:
                        # Generate PDF using the notes generator
                        from utils.science_notes_pdf_generator import ScienceNotesPDFGenerator
                        pdf_generator = ScienceNotesPDFGenerator()
                        pdf_path = pdf_generator.generate_notes_pdf(notes_data, user_id)
                        
                        # Send PDF via WhatsApp
                        caption = f"📚 Your {subject} notes on {topic}\n\nGenerated by your AI Teacher"
                        self.whatsapp_service.send_document(user_id, pdf_path, caption)
                        
                        # Cleanup PDF after sending
                        import time
                        time.sleep(2)
                        if os.path.exists(pdf_path):
                            os.remove(pdf_path)
                        
                        self.whatsapp_service.send_message(
                            user_id,
                            "✅ Your personalized notes have been sent!\n\nWould you like to continue learning or start a new topic?"
                        )
                    else:
                        raise ValueError("Failed to parse notes data")
                
                except Exception as e:
                    logger.error(f"Error generating notes with AI: {e}")
                    self._send_fallback_notes(user_id, topic, subject, grade_level)
            else:
                self._send_fallback_notes(user_id, topic, subject, grade_level)
        
        except Exception as e:
            logger.error(f"Error generating notes for {user_id}: {e}")
            self.whatsapp_service.send_message(
                user_id,
                "Sorry, I encountered an error generating your notes. Please try again."
            )
    
    def _parse_notes_response(self, response_text: str) -> Optional[Dict]:
        """Parse JSON notes from Gemini response"""
        try:
            # Try to extract JSON from response
            if '{' in response_text and '}' in response_text:
                # Find JSON object
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                json_str = response_text[start_idx:end_idx]
                
                notes_data = json.loads(json_str)
                return notes_data
            else:
                return None
        except Exception as e:
            logger.error(f"Error parsing notes JSON: {e}")
            return None
    
    def _send_fallback_notes(self, user_id: str, topic: str, subject: str, grade_level: str):
        """Send fallback notes when AI generation fails"""
        # Create basic notes structure
        notes_data = {
            "title": topic,
            "subject": subject,
            "grade_level": grade_level,
            "learning_objectives": [
                f"Understand the basic concepts of {topic}",
                f"Identify key components and processes in {topic}",
                f"Apply knowledge of {topic} to real-world scenarios"
            ],
            "key_concepts": {
                "Introduction": f"{topic} is an important concept in {subject}."
            },
            "detailed_explanation": f"This topic covers the fundamental principles of {topic}. Students should focus on understanding the core concepts and how they apply to different situations.",
            "real_world_applications": [
                f"{topic} is used in everyday life and scientific applications."
            ],
            "summary": f"Key points about {topic} that students should remember for their {grade_level} studies.",
            "revision_schedule": {
                "day_3": "Review main concepts and definitions",
                "day_7": "Practice application problems"
            },
            "references": ["ZIMSEC Syllabus", "Combined Science Textbook"]
        }
        
        try:
            from utils.science_notes_pdf_generator import ScienceNotesPDFGenerator
            pdf_generator = ScienceNotesPDFGenerator()
            pdf_path = pdf_generator.generate_notes_pdf(notes_data, user_id)
            
            caption = f"📚 Basic notes on {topic}\n\nGenerated by Combined Science Teacher"
            self.whatsapp_service.send_document(user_id, pdf_path, caption)
            
            import time
            time.sleep(2)
            if os.path.exists(pdf_path):
                os.remove(pdf_path)
            
        except Exception as e:
            logger.error(f"Error sending fallback notes: {e}")
            self.whatsapp_service.send_message(
                user_id,
                f"📚 *Study Notes on {topic}*\n\nI've prepared basic notes on this topic, but I'm having trouble sending the PDF. Please try requesting notes again in a few moments."
            )
    
    def exit_teacher_mode(self, user_id: str):
        """Exit teacher mode and return to main menu"""
        try:
            # Clear the science teacher session
            session_manager.clear_session(user_id)
            
            self.whatsapp_service.send_message(
                user_id,
                "👋 Thank you for learning with me! See you next time."
            )
            
            # Return to main menu
            from handlers.main_menu_handler import show_main_menu
            show_main_menu(user_id)
            
        except Exception as e:
            logger.error(f"Error exiting teacher mode for {user_id}: {e}")


# Global instance
combined_science_teacher_service = CombinedScienceTeacherService()
