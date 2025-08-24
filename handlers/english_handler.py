import os
import json
import logging
from typing import Dict, List, Optional
from database.external_db import get_user_registration, get_user_credits, deduct_credits
from database.session_db import save_user_session, get_user_session, clear_user_session
from services.whatsapp_service import WhatsAppService
from services.english_service import EnglishService

logger = logging.getLogger(__name__)

class EnglishHandler:
    """Comprehensive ZIMSEC English Handler for all English learning modules"""
    
    def __init__(self, whatsapp_service: WhatsAppService, english_service: EnglishService):
        self.whatsapp_service = whatsapp_service
        self.english_service = english_service
        
        # English modules aligned with ZIMSEC curriculum
        self.english_modules = {
            "topical_questions": {
                "title": "📚 Topical Questions",
                "description": "Practice questions by English topics and skills",
                "credit_cost": 2,
                "topics": [
                    "Formal Letter Writing", "Informal Letter Writing", "Report Writing",
                    "Article Writing", "Speech Writing", "Summary Writing",
                    "Comprehension Skills", "Grammar and Usage", "Vocabulary Building",
                    "Poetry Analysis", "Prose Analysis", "Drama Techniques"
                ]
            },
            "comprehension": {
                "title": "📖 Comprehension Practice", 
                "description": "Reading comprehension with Zimbabwean cultural context",
                "credit_cost": 3,
                "themes": [
                    "Traditional Zimbabwean Culture", "Urban and Rural Life",
                    "Environmental Conservation", "Education and Youth",
                    "Family and Community", "Heritage and Identity",
                    "Technology and Modern Life", "Sports and Recreation"
                ]
            },
            "essay_writing": {
                "title": "✍️ Essay Writing",
                "description": "Section A (Free Choice) and Section B (Guided Composition)",
                "credit_cost": 4,
                "section_a_types": ["narrative", "descriptive", "argumentative", "discursive"],
                "section_b_types": ["letter", "report", "article", "speech", "memo"]
            },
            "language_exercises": {
                "title": "🔤 Language Exercises",
                "description": "Grammar, vocabulary, and language skills practice",
                "credit_cost": 2,
                "topics": [
                    "Parts of Speech", "Verb Tenses", "Subject-Verb Agreement",
                    "Punctuation", "Sentence Structure", "Active and Passive Voice",
                    "Direct and Indirect Speech", "Vocabulary in Context"
                ]
            }
        }
        
        logger.info("ZIMSEC English Handler initialized with comprehensive modules")

    def handle_english_menu(self, user_id: str):
        """Display main English learning menu"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            credits = get_user_credits(user_id)
            
            message = f"""📚 ZIMSEC English Language Centre

👋 Welcome {user_name}!

🎯 Master O-Level English with authentic Zimbabwean context:

📚 **Topical Questions** (2 credits)
Practice specific English skills and topics

📖 **Comprehension Practice** (3 credits) 
Reading passages with cultural context

✍️ **Essay Writing** (4 credits)
Section A & B with AI-powered marking

🔤 **Language Exercises** (2 credits)
Grammar, vocabulary, and language skills

💰 Your Credits: {credits}

Choose your learning path:"""

            buttons = []
            for module_id, module_info in self.english_modules.items():
                buttons.append({
                    "text": module_info["title"],
                    "callback_data": f"english_{module_id}"
                })
            
            buttons.append({"text": "🏠 Main Menu", "callback_data": "main_menu"})
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
            # Save session
            english_session = {
                'session_type': 'english_learning',
                'user_name': user_name,
                'current_module': None
            }
            save_user_session(user_id, english_session)
            
            logger.info(f"English menu displayed for user {user_id}")

        except Exception as e:
            logger.error(f"Error displaying English menu for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading English menu. Please try again.")

    def handle_topical_questions(self, user_id: str):
        """Handle topical questions module"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            credits = get_user_credits(user_id)
            
            module_info = self.english_modules["topical_questions"]
            
            if credits < module_info["credit_cost"]:
                self._send_insufficient_credits_message(user_id, user_name, credits, module_info["credit_cost"])
                return
            
            message = f"""📚 ZIMSEC Topical Questions

👤 Student: {user_name}
💰 Your Credits: {credits}

📝 Choose your topic:"""

            buttons = [
                {"text": "📝 Grammar and Usage", "callback_data": "english_grammar_usage"},
                {"text": "📚 Vocabulary Building", "callback_data": "english_vocabulary_building"},
                {"text": "📚 More Topics", "callback_data": "english_more_topics"},
                {"text": "🔙 Back to English", "callback_data": "english_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error in topical questions for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading topics. Please try again.")

    def handle_comprehension_practice(self, user_id: str):
        """Handle comprehension practice module - new interactive flow"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            credits = get_user_credits(user_id)
            
            module_info = self.english_modules["comprehension"]
            
            if credits < module_info["credit_cost"]:
                self._send_insufficient_credits_message(user_id, user_name, credits, module_info["credit_cost"])
                return
            
            message = f"""📖 **ZIMSEC Comprehension Practice**

Hi {user_name}! 🎓

**How it works:**
• You'll get a long, engaging passage to read
• Then answer 10 comprehension questions
• Get instant feedback with detailed answers
• Track your progress with XP, streaks & levels!

**Cost:** {module_info["credit_cost"]} credits per session
**Questions:** 10 questions following ZIMSEC format
**Topics:** Random Zimbabwean contexts

Ready to boost your reading skills? 🚀"""

            buttons = [
                {"text": "🚀 Continue", "callback_data": "comprehension_start"},
                {"text": "🔙 Back", "callback_data": "english_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error in comprehension practice for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading comprehension. Please try again.")

    def handle_comprehension_start(self, user_id: str):
        """Start new comprehension session with BULLETPROOF duplicate prevention"""
        try:
            from database.session_db import save_user_session, get_user_session, clear_user_session
            from datetime import datetime
            import time
            
            # BULLETPROOF CHECK #1: Check for ANY existing comprehension session
            existing_session = get_user_session(user_id)
            session_type = existing_session.get('session_type', '') if existing_session else ''
            
            # Block ALL comprehension-related sessions - no exceptions!
            comprehension_sessions = ['comprehension_active', 'comprehension_questions', 'comprehension_generating', 'comprehension_started', 'comprehension_passage_ready']
            
            if session_type in comprehension_sessions:
                logger.warning(f"BLOCKED duplicate comprehension attempt for {user_id} - session: {session_type}")
                # Show reset option immediately - no more generating messages
                buttons = [
                    {"text": "🔄 Start New Session", "callback_data": "comprehension_reset"},
                    {"text": "🔙 Back to Menu", "callback_data": "english_menu"}
                ]
                message = "⚠️ You have an active comprehension session.\n\nWould you like to start a fresh new comprehension practice?"
                self.whatsapp_service.send_interactive_message(user_id, message, buttons)
                return
            
            # BULLETPROOF LOCK #1: Immediately save generating lock to prevent race conditions
            lock_session = {
                'session_type': 'comprehension_generating',
                'user_name': 'Student',
                'started_at': str(datetime.now()),
                'locked': True
            }
            save_user_session(user_id, lock_session)
            
            # BULLETPROOF CHECK #2: Double-check after lock to ensure no race condition
            verification_session = get_user_session(user_id)
            if not verification_session or verification_session.get('session_type') != 'comprehension_generating':
                logger.error(f"Session lock failed for {user_id} - aborting")
                return
            
            # Get user data
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            form_level = registration.get('form_level', 4) if registration else 4
            
            # Deduct credits
            if not deduct_credits(user_id, 3, "english_comprehension", "Comprehension Practice"):
                clear_user_session(user_id)  # Clear generating lock on failure
                self.whatsapp_service.send_message(user_id, "❌ Insufficient credits. Please buy more credits.")
                return
            
            # Update session with proper user name
            session_data = {
                'session_type': 'comprehension_active',
                'user_name': user_name,
                'started_at': str(datetime.now())
            }
            save_user_session(user_id, session_data)
            
            # Send professional loading message
            self.whatsapp_service.send_message(
                user_id,
                f"⏳ Please wait {user_name}...\n\n📚 NerdX is creating your personalized comprehension practice."
            )
            
            # Continue without delays to prevent worker timeout
            
            # Generate random comprehension passage
            themes = ["Zimbabwean Culture", "African Wildlife", "Technology & Society", "Education", "Sports", "Environment", "History", "Science Discovery"]
            import random
            random_theme = random.choice(themes)
            
            try:
                passage_data = self.english_service.generate_long_comprehension_passage(random_theme, form_level)
                
                if not passage_data:
                    logger.warning(f"No passage data returned for theme: {random_theme}")
                    # Use fallback comprehension directly from service
                    passage_data = self.english_service._get_fallback_long_comprehension(random_theme)
                    
            except Exception as e:
                logger.error(f"Error generating comprehension passage: {e}")
                # Use fallback comprehension when API fails
                passage_data = self.english_service._get_fallback_long_comprehension(random_theme)
            
            if not passage_data:
                clear_user_session(user_id)
                self.whatsapp_service.send_message(user_id, "❌ Error generating comprehension. Please try again.")
                return
            
            # Send passage and questions with professional smooth format
            self._send_professional_comprehension_flow(user_id, user_name, passage_data)
            
            logger.info(f"Professional comprehension delivered for {user_id}: {random_theme}")
            
        except Exception as e:
            logger.error(f"Error starting comprehension for {user_id}: {e}")
            from database.session_db import clear_user_session
            clear_user_session(user_id)
            self.whatsapp_service.send_message(user_id, "❌ Error generating comprehension. Please try again.")

    def _send_enhanced_comprehension_passage(self, user_id: str, user_name: str, passage_data: Dict):
        """Send enhanced comprehension passage with interactive question flow"""
        try:
            passage = passage_data.get('passage', {})
            questions = passage_data.get('questions', [])
            
            if not passage or not questions:
                logger.error("Invalid passage data structure")
                return
            
            # Send the long passage first as separate message with length check
            passage_text = passage.get('text', 'Passage content not available')
            passage_title = passage.get('title', 'Comprehension Passage')
            word_count = passage.get('word_count', len(passage_text.split()))
            reading_time = max(2, len(passage_text.split()) // 200)
            
            # Check if message is too long for WhatsApp (4096 char limit)
            full_message = f"""📖 **{passage_title}**

{passage_text}

---
📊 **Word Count:** {word_count} words
⏱️ **Reading Time:** ~{reading_time} minutes

*Read the passage carefully and answer ALL questions that follow.*"""
            
            if len(full_message) > 4000:  # WhatsApp limit with safety margin
                # Send title and intro first
                title_message = f"📖 **{passage_title}**\n\n📊 **Word Count:** {word_count} words\n⏱️ **Reading Time:** ~{reading_time} minutes\n\n*Read carefully - passage follows:*"
                self.whatsapp_service.send_message(user_id, title_message)
                
                # Split passage text into chunks
                chunks = self._split_text(passage_text, 3000)  # Leave room for formatting
                for i, chunk in enumerate(chunks):
                    chunk_message = f"**Part {i+1}:**\n\n{chunk}"
                    if i == len(chunks) - 1:  # Last chunk
                        chunk_message += "\n\n---\n*Now answer ALL questions that follow.*"
                    self.whatsapp_service.send_message(user_id, chunk_message)
            else:
                # Send as single message if within limit
                try:
                    self.whatsapp_service.send_message(user_id, full_message)
                except Exception as e:
                    logger.error(f"Error sending passage message: {e}")
                    # Send fallback shorter message
                    fallback_message = f"📖 **{passage_title}**\n\n{passage_text[:2000]}...\n\n*Passage continues - please read carefully and answer the questions below.*"
                    self.whatsapp_service.send_message(user_id, fallback_message)
            
            # Format and send 10 questions with Show Answer button
            questions_message = f"""📝 **COMPREHENSION QUESTIONS**

Hi {user_name}! Answer these 10 questions based on the passage above:

"""
            
            for i, q in enumerate(questions[:10], 1):  # Ensure only 10 questions
                question_type = q.get('question_type', '').title()
                marks = q.get('marks', 1)
                questions_message += f"**{i}.** {q.get('question', f'Question {i} not available')} [{marks} mark{'s' if marks != 1 else ''}]\n\n"
            
            questions_message += "✅ *Answer these questions based on your understanding of the passage*"
            
            # Save questions in session for answer display
            from database.session_db import save_user_session
            import json
            session_data = {
                'session_type': 'comprehension_questions',
                'questions_data': json.dumps(questions[:10]),
                'user_name': user_name,
                'passage_title': passage.get('title', 'Comprehension')
            }
            save_user_session(user_id, session_data)
            
            buttons = [
                {"text": "📋 Show Answers", "callback_data": "comprehension_show_answers"},
                {"text": "🔙 Back", "callback_data": "english_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, questions_message, buttons)
            
        except Exception as e:
            logger.error(f"Error sending enhanced comprehension passage: {e}")
            
    def handle_comprehension_show_answers(self, user_id: str):
        """Show all comprehension answers with stats"""
        try:
            from database.session_db import get_user_session, clear_user_session
            from database.external_db import get_user_stats
            
            session_data = get_user_session(user_id)
            if not session_data or session_data.get('session_type') != 'comprehension_questions':
                self.whatsapp_service.send_message(user_id, "❌ No active comprehension session found.")
                return
                
            # Parse questions data
            import json
            questions_data_str = session_data.get('questions_data', '[]')
            questions = json.loads(questions_data_str) if questions_data_str else []
            user_name = session_data.get('user_name', 'Student')
            passage_title = session_data.get('passage_title', 'Comprehension')
            
            # Format answers message
            answers_message = f"""✅ **COMPREHENSION ANSWERS**
            
**{passage_title}** - Answer Key for {user_name}

"""
            
            total_marks = 0
            for i, q in enumerate(questions, 1):
                marks = q.get('marks', 1)
                total_marks += marks
                answers_message += f"**{i}.** {q.get('question', f'Question {i}')}\n"
                answers_message += f"**Answer:** {q.get('correct_answer', 'Answer not available')}\n"
                if q.get('explanation'):
                    answers_message += f"*Explanation:* {q.get('explanation')}\n"
                answers_message += f"*Marks: {marks}*\n\n"
            
            answers_message += f"📊 **Total Marks Available:** {total_marks}\n\n"
            
            self.whatsapp_service.send_message(user_id, answers_message)
            
            # Get user stats and send completion message
            stats = get_user_stats(user_id) or {}
            credits = stats.get('credits', 0)
            xp = stats.get('xp_points', 0)
            streak = stats.get('streak', 0)
            level = stats.get('level', 1)
            
            stats_message = f"""🎉 **Comprehension Complete!**

👤 **{user_name}'s Progress:**
💰 Credits: {credits}
⭐ XP Points: {xp}
🔥 Streak: {streak} days
🎯 Level: {level}

Great job on completing your comprehension practice! 📚✨"""

            buttons = [
                {"text": "🚀 Another Comprehension", "callback_data": "comprehension_start"},
                {"text": "🔙 Back", "callback_data": "english_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, stats_message, buttons)
            
            # Clear session
            clear_user_session(user_id)
            
        except Exception as e:
            logger.error(f"Error showing comprehension answers for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error showing answers. Please try again.")
    
    def _split_text(self, text: str, max_length: int = 3000) -> list:
        """Split long text into chunks that fit WhatsApp message limits"""
        if len(text) <= max_length:
            return [text]
        
        chunks = []
        paragraphs = text.split('\n\n')
        current_chunk = ""
        
        for paragraph in paragraphs:
            # If adding this paragraph would exceed limit, start new chunk
            if len(current_chunk) + len(paragraph) + 2 > max_length:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                    current_chunk = paragraph
                else:
                    # Single paragraph is too long, split by sentences
                    sentences = paragraph.split('. ')
                    temp_chunk = ""
                    for sentence in sentences:
                        if len(temp_chunk) + len(sentence) + 2 > max_length:
                            if temp_chunk:
                                chunks.append(temp_chunk.strip() + ".")
                                temp_chunk = sentence
                            else:
                                # Single sentence too long, hard split
                                chunks.append(sentence[:max_length])
                                temp_chunk = sentence[max_length:]
                        else:
                            temp_chunk += sentence + ". "
                    current_chunk = temp_chunk.strip()
            else:
                current_chunk += "\n\n" + paragraph if current_chunk else paragraph
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks

    def _send_professional_comprehension_flow(self, user_id: str, user_name: str, passage_data: Dict):
        """Send comprehension with professional smooth flow - one message at a time"""
        try:
            import time
            
            passage = passage_data.get('passage', {})
            questions = passage_data.get('questions', [])
            
            if not passage or not questions:
                logger.error("Invalid passage data structure")
                return
            
            # Step 1: Send passage with professional formatting
            passage_text = passage.get('text', 'Passage content not available')
            passage_title = passage.get('title', 'Comprehension Passage')
            word_count = len(passage_text.split())
            reading_time = max(2, word_count // 200)
            
            # Send title first
            title_message = f"📖 **{passage_title}**\n\n📊 Words: {word_count} | ⏱️ Time: ~{reading_time} min\n\n*Please read carefully:*"
            self.whatsapp_service.send_message(user_id, title_message)
            
            # Send passage in manageable chunks
            if len(passage_text) > 3500:
                chunks = self._split_text(passage_text, 3200)
                for i, chunk in enumerate(chunks):
                    chunk_message = f"**Part {i+1}:**\n\n{chunk}"
                    self.whatsapp_service.send_message(user_id, chunk_message)
            else:
                self.whatsapp_service.send_message(user_id, passage_text)
            
            # Step 2: Send completion message with Continue button
            ready_message = f"✅ **Passage Complete**\n\nNow answer the 10 questions below, {user_name}!"
            
            continue_buttons = [
                {"text": "📝 Load Questions", "callback_data": "comprehension_load_questions"},
                {"text": "🔙 Back to Menu", "callback_data": "english_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, ready_message, continue_buttons)
            
            # Save passage data to session for question loading
            from database.session_db import save_user_session
            import json
            session_data = {
                'session_type': 'comprehension_passage_ready',
                'passage_data': json.dumps(passage_data),
                'user_name': user_name,
                'passage_title': passage.get('title', 'Comprehension Passage')
            }
            save_user_session(user_id, session_data)
            
            logger.info(f"Passage ready for {user_id}, waiting for user to load questions")
            
        except Exception as e:
            logger.error(f"Error in professional comprehension flow: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error displaying comprehension. Please try again.")

    def handle_comprehension_load_questions(self, user_id: str):
        """Load and display questions after user clicks Continue"""
        try:
            from database.session_db import save_user_session, get_user_session
            import json
            
            # Get session data
            session = get_user_session(user_id)
            if not session or session.get('session_type') != 'comprehension_passage_ready':
                self.whatsapp_service.send_message(user_id, "❌ No passage found. Please start a new comprehension.")
                return
            
            # Get passage data
            passage_data = json.loads(session.get('passage_data', '{}'))
            user_name = session.get('user_name', 'Student')
            passage_title = session.get('passage_title', 'Comprehension Passage')
            
            questions = passage_data.get('questions', [])
            
            # Step 3: Debug and send questions with error handling
            logger.info(f"Questions data for {user_id}: {len(questions)} questions available")
            
            if not questions or len(questions) < 5:
                logger.error(f"Insufficient questions for {user_id}: {len(questions)} questions")
                self.whatsapp_service.send_message(user_id, "❌ Error loading questions. Please try again.")
                return
            
            # Ensure we have at least 10 questions, pad if needed
            while len(questions) < 10:
                questions.append({
                    'question': f'Additional question {len(questions) + 1} - What is your understanding of the main theme in this passage?',
                    'answer': 'Based on your reading comprehension.',
                    'marks': 2
                })
            
            # Split questions into two messages (5 questions each)
            questions_part1 = questions[:5]
            questions_part2 = questions[5:10]
            
            # Send first 5 questions with error handling
            try:
                questions_message_1 = f"📝 **QUESTIONS 1-5**\n\n"
                for i, q in enumerate(questions_part1, 1):
                    marks = q.get('marks', 1)
                    question_text = q.get('question', f'Question {i} not available')
                    questions_message_1 += f"**{i}.** {question_text} [{marks} mark{'s' if marks != 1 else ''}]\n\n"
                
                if len(questions_message_1) > 4000:
                    # Split if too long
                    self.whatsapp_service.send_message(user_id, "📝 **QUESTIONS 1-5**")
                    for i, q in enumerate(questions_part1, 1):
                        marks = q.get('marks', 1)
                        question_text = q.get('question', f'Question {i} not available')
                        single_question = f"**{i}.** {question_text} [{marks} mark{'s' if marks != 1 else ''}]"
                        self.whatsapp_service.send_message(user_id, single_question)
                else:
                    success = self.whatsapp_service.send_message(user_id, questions_message_1)
                    if not success:
                        logger.error(f"Failed to send questions 1-5 to {user_id}")
                        
            except Exception as e:
                logger.error(f"Error sending questions 1-5 to {user_id}: {e}")
            
            # Send last 5 questions with error handling
            try:
                questions_message_2 = f"📝 **QUESTIONS 6-10**\n\n"
                for i, q in enumerate(questions_part2, 6):
                    marks = q.get('marks', 1)
                    question_text = q.get('question', f'Question {i} not available')
                    questions_message_2 += f"**{i}.** {question_text} [{marks} mark{'s' if marks != 1 else ''}]\n\n"
                
                questions_message_2 += "✅ *Answer all questions based on the passage above*"
                
                if len(questions_message_2) > 4000:
                    # Split if too long
                    self.whatsapp_service.send_message(user_id, "📝 **QUESTIONS 6-10**")
                    for i, q in enumerate(questions_part2, 6):
                        marks = q.get('marks', 1)
                        question_text = q.get('question', f'Question {i} not available')
                        single_question = f"**{i}.** {question_text} [{marks} mark{'s' if marks != 1 else ''}]"
                        self.whatsapp_service.send_message(user_id, single_question)
                    self.whatsapp_service.send_message(user_id, "✅ *Answer all questions based on the passage above*")
                else:
                    success = self.whatsapp_service.send_message(user_id, questions_message_2)
                    if not success:
                        logger.error(f"Failed to send questions 6-10 to {user_id}")
                        
            except Exception as e:
                logger.error(f"Error sending questions 6-10 to {user_id}: {e}")
            
            # Step 4: Save session and send answer button
            session_data = {
                'session_type': 'comprehension_questions',
                'questions_data': json.dumps(questions[:10]),
                'user_name': user_name,
                'passage_title': passage_title
            }
            save_user_session(user_id, session_data)
            
            # Send button for answers
            buttons = [
                {"text": "📋 Show Answers", "callback_data": "comprehension_show_answers"},
                {"text": "🔙 Back", "callback_data": "english_menu"}
            ]
            
            button_message = f"📌 **Ready to check your answers, {user_name}?**"
            self.whatsapp_service.send_interactive_message(user_id, button_message, buttons)
            
            logger.info(f"Questions loaded successfully for {user_id}")
            
        except Exception as e:
            logger.error(f"Error loading questions for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading questions. Please try again.")

    def handle_comprehension_reset(self, user_id: str):
        """Reset active comprehension session and start fresh with strong duplicate prevention"""
        try:
            from database.session_db import clear_user_session
            import time
            
            # Force clear any existing session
            clear_user_session(user_id)
            
            # Small delay to ensure session is cleared before starting new one
            time.sleep(0.5)
            
            # Start a new comprehension session
            self.handle_comprehension_start(user_id)
            
            logger.info(f"Comprehension session reset for {user_id}")
            
        except Exception as e:
            logger.error(f"Error resetting comprehension for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error resetting session. Please try again.")

    def handle_essay_writing(self, user_id: str):
        """Handle ZIMSEC Essay Writing - New Implementation"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            credits = get_user_credits(user_id)
            
            if credits < 3:  # Standard essay writing cost
                self.whatsapp_service.send_message(user_id, f"❌ Insufficient credits! You need 3 credits but have {credits}. Purchase more credits to continue.")
                return
            
            message = f"""✍️ **ZIMSEC O Level English Essay Writing**

👤 Student: {user_name}
💰 Cost: 3 credits per essay
📄 Format: Official ZIMSEC Paper 1 Section A

**Choose your writing mode:**"""

            buttons = [
                {"text": "📝 Free Response", "callback_data": "essay_free_response"},
                {"text": "🎯 Guided Composition", "callback_data": "essay_guided_composition"},
                {"text": "🔙 Back to English", "callback_data": "english_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error in essay writing for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading essay options. Please try again.")

    def handle_essay_free_response(self, user_id: str):
        """Handle Free Response Mode - Generate 4 ZIMSEC prompts (A, B, C, D)"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            # Generate 4 ZIMSEC-style prompts
            prompts = self._generate_zimsec_essay_prompts()
            
            message = f"""📝 **SECTION A (30 marks)**

Write a composition (300–600 words) on ONE of the following topics. Choose ONLY ONE.

**(A)** {prompts['A']}

**(B)** {prompts['B']} 

**(C)** {prompts['C']}

**(D)** {prompts['D']}"""

            buttons = [
                {"text": "A", "callback_data": "essay_choice_A"},
                {"text": "B", "callback_data": "essay_choice_B"},
                {"text": "C", "callback_data": "essay_choice_C"},
                {"text": "D", "callback_data": "essay_choice_D"},
                {"text": "🔙 Back", "callback_data": "english_essay_writing"}
            ]
            
            # Save prompts to session for later use
            from database.session_db import save_user_session
            import json
            session_data = {
                'session_type': 'essay_free_response',
                'prompts': json.dumps(prompts),
                'user_name': user_name
            }
            save_user_session(user_id, session_data)
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error in essay free response for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading essay prompts. Please try again.")

    def handle_essay_guided_composition(self, user_id: str):
        """Handle Guided Composition Mode - Generate 1 ZIMSEC prompt with guidance"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            # Generate 1 ZIMSEC-style prompt
            prompt_data = self._generate_single_zimsec_prompt()
            
            message = f"""📝 **SECTION A (30 marks)**

Write a composition (300–600 words) on the following topic:

**{prompt_data['prompt']}**

*Essay Type: {prompt_data['type'].title()}*"""

            buttons = [
                {"text": "📝 Start Writing", "callback_data": "essay_start_writing"},
                {"text": "💡 Hint", "callback_data": "essay_show_hint"},
                {"text": "🔙 Back", "callback_data": "english_essay_writing"}
            ]
            
            # Save prompt to session for later use
            from database.session_db import save_user_session
            import json
            session_data = {
                'session_type': 'essay_guided_composition',
                'prompt_data': json.dumps(prompt_data),
                'user_name': user_name
            }
            save_user_session(user_id, session_data)
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error in essay guided composition for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading guided composition. Please try again.")

    def handle_essay_choice(self, user_id: str, choice: str):
        """Handle essay choice selection (A, B, C, D)"""
        try:
            from database.session_db import get_user_session
            import json
            
            session = get_user_session(user_id)
            if not session or session.get('session_type') != 'essay_free_response':
                self.whatsapp_service.send_message(user_id, "❌ No active essay session found.")
                return
            
            prompts = json.loads(session.get('prompts', '{}'))
            user_name = session.get('user_name', 'Student')
            selected_prompt = prompts.get(choice, 'Prompt not found')
            
            message = f"""📝 **You selected option {choice}:**

{selected_prompt}

Now write your composition between **300–600 words** in the box below. After you submit, NerdX will mark your work for you.

Please type your essay:"""

            self.whatsapp_service.send_message(user_id, message)
            
            # Update session to await essay submission
            from database.session_db import save_user_session
            session_data = {
                'session_type': 'essay_writing',
                'selected_choice': choice,
                'selected_prompt': selected_prompt,
                'user_name': user_name,
                'awaiting_essay': True
            }
            save_user_session(user_id, session_data)
            
        except Exception as e:
            logger.error(f"Error in essay choice for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error processing choice. Please try again.")

    def handle_essay_start_writing(self, user_id: str):
        """Handle start writing for guided composition"""
        try:
            from database.session_db import get_user_session, save_user_session
            import json
            
            session = get_user_session(user_id)
            if not session or session.get('session_type') != 'essay_guided_composition':
                self.whatsapp_service.send_message(user_id, "❌ No active guided composition session found.")
                return
            
            prompt_data = json.loads(session.get('prompt_data', '{}'))
            user_name = session.get('user_name', 'Student')
            
            message = f"""📝 **Your Essay Topic:**

{prompt_data.get('prompt', 'No prompt found')}

Please start writing your composition (300–600 words) based on the question provided. Follow the format in the ZIMSEC paper.

Type your essay below:"""

            self.whatsapp_service.send_message(user_id, message)
            
            # Update session to await essay submission
            session_data = {
                'session_type': 'essay_writing',
                'prompt_data': json.dumps(prompt_data),
                'user_name': user_name,
                'awaiting_essay': True
            }
            save_user_session(user_id, session_data)
            
        except Exception as e:
            logger.error(f"Error starting essay writing for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error starting essay. Please try again.")

    def handle_essay_show_hint(self, user_id: str):
        """Show writing hints based on essay type"""
        try:
            from database.session_db import get_user_session
            import json
            
            session = get_user_session(user_id)
            if not session or session.get('session_type') != 'essay_guided_composition':
                self.whatsapp_service.send_message(user_id, "❌ No active guided composition session found.")
                return
            
            prompt_data = json.loads(session.get('prompt_data', '{}'))
            essay_type = prompt_data.get('type', 'narrative').lower()
            
            hints = self._get_essay_writing_hints(essay_type)
            
            message = f"""💡 **Writing Guide for {essay_type.title()} Essay:**

{hints}"""

            buttons = [
                {"text": "📝 Continue Writing", "callback_data": "essay_start_writing"},
                {"text": "🔙 Back", "callback_data": "essay_guided_composition"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
        except Exception as e:
            logger.error(f"Error showing essay hints for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading hints. Please try again.")

    def _generate_zimsec_essay_prompts(self):
        """Generate 4 ZIMSEC-style essay prompts (A, B, C, D)"""
        import random
        
        # ZIMSEC-style prompts covering different essay types
        narrative_prompts = [
            "Write a story that begins with: 'The day I thought would never end finally came to a close...'",
            "Describe an experience where you had to make a difficult choice that changed your life.",
            "Write about a time when you discovered something unexpected about yourself or someone close to you.",
            "Tell the story of a journey that taught you an important lesson about life."
        ]
        
        descriptive_prompts = [
            "Describe a place in Zimbabwe that holds special significance to you and explain why it is important.",
            "Write a detailed account of a traditional ceremony or celebration in your community.",
            "Describe the effects of technology on modern Zimbabwean society.",
            "Write about the challenges facing young people in Zimbabwe today and suggest possible solutions."
        ]
        
        letter_prompts = [
            "Write a letter to your local councillor suggesting ways to improve facilities in your area.",
            "Write a letter to a friend who lives abroad, describing recent changes in Zimbabwe.",
            "Write a letter to the editor of a newspaper expressing your views on environmental conservation.",
            "Write a letter to your former primary school teacher, telling them about your experiences in secondary school."
        ]
        
        article_prompts = [
            "Write an article for your school magazine about the importance of preserving Zimbabwean culture.",
            "Write an article discussing the benefits and challenges of online learning.",
            "Write an article about a successful young entrepreneur in Zimbabwe who inspires you.",
            "Write an article on the role of sports in promoting national unity in Zimbabwe."
        ]
        
        speech_prompts = [
            "Write a speech to be delivered at your school's speech day on the topic: 'Education is the key to success'.",
            "Prepare a speech for your community on the importance of caring for the elderly.",
            "Write a speech to motivate your fellow students to work hard despite challenges.",
            "Prepare a speech on environmental conservation to be delivered at a youth conference."
        ]
        
        all_prompts = narrative_prompts + descriptive_prompts + letter_prompts + article_prompts + speech_prompts
        selected_prompts = random.sample(all_prompts, 4)
        
        return {
            'A': selected_prompts[0],
            'B': selected_prompts[1], 
            'C': selected_prompts[2],
            'D': selected_prompts[3]
        }

    def _generate_single_zimsec_prompt(self):
        """Generate a single ZIMSEC-style prompt with type information"""
        import random
        
        prompt_types = [
            {'type': 'narrative', 'prompts': [
                "Write a story that begins with: 'The day I thought would never end finally came to a close...'",
                "Describe an experience where you had to make a difficult choice that changed your life.",
                "Write about a time when you discovered something unexpected about yourself or someone close to you."
            ]},
            {'type': 'letter', 'prompts': [
                "Write a letter to your local councillor suggesting ways to improve facilities in your area.",
                "Write a letter to a friend who lives abroad, describing recent changes in Zimbabwe.",
                "Write a letter to the editor of a newspaper expressing your views on environmental conservation."
            ]},
            {'type': 'article', 'prompts': [
                "Write an article for your school magazine about the importance of preserving Zimbabwean culture.",
                "Write an article discussing the benefits and challenges of online learning.",
                "Write an article about a successful young entrepreneur in Zimbabwe who inspires you."
            ]},
            {'type': 'speech', 'prompts': [
                "Write a speech to be delivered at your school's speech day on the topic: 'Education is the key to success'.",
                "Prepare a speech for your community on the importance of caring for the elderly.",
                "Write a speech to motivate your fellow students to work hard despite challenges."
            ]},
            {'type': 'report', 'prompts': [
                "Write a report on the state of library facilities in your school and suggest improvements.",
                "Prepare a report on the impact of social media on teenagers in Zimbabwe.",
                "Write a report on environmental challenges in your community and recommend solutions."
            ]}
        ]
        
        selected_type = random.choice(prompt_types)
        selected_prompt = random.choice(selected_type['prompts'])
        
        return {
            'type': selected_type['type'],
            'prompt': selected_prompt
        }

    def _get_essay_writing_hints(self, essay_type):
        """Get structured writing hints for different essay types"""
        hints = {
            'letter': """📮 **Letter Format:**
• Sender's address (top right)
• Date
• Recipient's address (left side)  
• Salutation (Dear Sir/Madam, Dear...)
• Body paragraphs with clear points
• Appropriate closing (Yours faithfully/sincerely)
• Signature and printed name""",
            
            'report': """📊 **Report Structure:**
• Title (clear and specific)
• Introduction (purpose and scope)
• Findings/Main body (organized sections)
• Conclusion with recommendations
• Use formal, objective language
• Include headings and subheadings""",
            
            'speech': """🎤 **Speech Format:**
• Greeting and acknowledgments
• Introduction (capture attention)
• Main body (3-4 key points)
• Conclusion (call to action/memorable ending)
• Use engaging, persuasive language
• Include rhetorical questions""",
            
            'article': """📰 **Article Structure:**
• Catchy headline
• Introduction (hook the reader)
• Main points in logical order
• Supporting evidence/examples
• Conclusion that reinforces main message
• Use clear, engaging language""",
            
            'narrative': """📖 **Narrative Structure:**
• Introduction (set scene, introduce characters)
• Build-up (develop tension/conflict)
• Climax (turning point/main event)
• Resolution/Conclusion
• Use descriptive language and dialogue
• Show, don't just tell"""
        }
        
        return hints.get(essay_type, "Focus on clear structure, good grammar, and staying within 300-600 words.")

    def handle_essay_submission(self, user_id: str, essay_text: str):
        """Handle essay submission and generate PDF marking report"""
        try:
            from database.session_db import get_user_session, clear_user_session
            from database.external_db import deduct_credits
            import json
            
            session = get_user_session(user_id)
            if not session or not session.get('awaiting_essay'):
                self.whatsapp_service.send_message(user_id, "❌ No active essay session found. Please start a new essay.")
                return
            
            user_name = session.get('user_name', 'Student')
            
            # Check word count
            word_count = len(essay_text.split())
            if word_count < 50:
                self.whatsapp_service.send_message(user_id, f"❌ Essay too short! You wrote {word_count} words. Please write at least 50 words for proper evaluation.")
                return
            
            # Deduct credits before processing
            if not deduct_credits(user_id, 3, "english_essay", "Essay writing and marking"):
                self.whatsapp_service.send_message(user_id, "❌ Error processing credits. Please try again.")
                return
            
            # Send processing message
            self.whatsapp_service.send_message(user_id, "📝 Processing your essay...\n⏳ Generating marking report (this may take a moment)...")
            
            # Generate marking using AI and create PDF
            marking_result = self._generate_essay_marking_with_pdf(essay_text, user_name, user_id)
            
            if marking_result:
                # Send the PDF document directly to WhatsApp
                pdf_sent = self.whatsapp_service.send_document(
                    user_id, 
                    marking_result['pdf_path'], 
                    "📄 Your ZIMSEC Essay Marking Report", 
                    f"ZIMSEC_Essay_Report_{user_name}.pdf"
                )
                
                if pdf_sent:
                    # Send comprehensive feedback summary
                    feedback_message = f"""✅ **Essay Marked Successfully!**

📊 **Your Score:** {marking_result['score']}/30
📝 **Word Count:** {word_count} words  
📈 **Grade:** {marking_result['grade']}

**📝 Teacher Feedback:**
{marking_result['summary_feedback']}

**🔍 Key Corrections:**
{marking_result.get('corrections_text', 'No major corrections needed.')}

📄 **Your detailed PDF report has been sent above** - you can download it directly from WhatsApp!

🎯 Keep practicing to improve your writing skills!"""
                else:
                    # Fallback if PDF sending fails
                    feedback_message = f"""✅ **Essay Marked Successfully!**

📊 **Your Score:** {marking_result['score']}/30
📝 **Word Count:** {word_count} words  
📈 **Grade:** {marking_result['grade']}

**📝 Teacher Feedback:**
{marking_result['summary_feedback']}

**🔍 Key Corrections:**
{marking_result.get('corrections_text', 'No major corrections needed.')}

📄 **Download Your PDF Report:** {marking_result['pdf_url']}

🎯 Keep practicing to improve your writing skills!"""

                buttons = [
                    {"text": "✍️ Write Another Essay", "callback_data": "english_essay_writing"},
                    {"text": "📚 Back to English", "callback_data": "english_menu"}
                ]
                
                self.whatsapp_service.send_interactive_message(user_id, feedback_message, buttons)
            else:
                self.whatsapp_service.send_message(user_id, "❌ Error processing essay. Please try again later.")
            
            # Clear session
            clear_user_session(user_id)
            
        except Exception as e:
            logger.error(f"Error handling essay submission for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error processing essay. Please try again.")

    def _generate_essay_marking_with_pdf(self, essay_text: str, user_name: str, user_id: str):
        """Generate essay marking using Gemini AI and create PDF report"""
        try:
            import json
            import os
            from datetime import datetime
            from reportlab.lib.pagesizes import A4
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.colors import red, black
            
            # Use Gemini AI to mark the essay
            marking_prompt = f"""
You are a ZIMSEC O Level English teacher marking a composition. Please evaluate this essay and provide:

1. A mark out of 30 (following ZIMSEC marking criteria)
2. Brief supportive feedback (2-3 sentences, encouraging tone)
3. Top 5 specific corrections needed with explanations
4. An improved version of the essay (first 200 words)
5. A grade (A, B, C, D, E based on the mark)

Essay to mark:
{essay_text}

Please respond in this JSON format:
{{
    "score": 17,
    "grade": "C",
    "summary_feedback": "Well attempted essay with good ideas. Your structure is clear but work on vocabulary variety. Keep practicing to improve further!",
    "corrections": [
        "Fix spelling: 'recieve' should be 'receive'",
        "Grammar: 'I was went' should be 'I went'",
        "Vocabulary: Use 'magnificent' instead of 'very good'",
        "Punctuation: Add comma after 'However'",
        "Structure: Start new paragraph for new idea"
    ],
    "improved_version": "The corrected opening of your essay..."
}}

Remember: Be encouraging and supportive - these are O Level students learning.
"""

            # Get marking from Gemini
            marking_response = self.english_service.generate_essay_marking(marking_prompt)
            
            if not marking_response:
                return None
            
            marking_data = json.loads(marking_response)
            
            # Create PDF report
            timestamp = int(datetime.now().timestamp())
            pdf_filename = f"essay_marked_{user_id}_{timestamp}.pdf"
            pdf_path = os.path.join("static", "pdfs", pdf_filename)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
            
            # Create PDF
            doc = SimpleDocTemplate(pdf_path, pagesize=A4, topMargin=50, bottomMargin=50, leftMargin=50, rightMargin=50)
            styles = getSampleStyleSheet()
            story = []
            
            # Custom styles
            title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], textColor=red, spaceAfter=20, alignment=1)
            section_style = ParagraphStyle('SectionHeader', parent=styles['Heading2'], spaceAfter=12, spaceBefore=12)
            
            # Header
            story.append(Paragraph("ZIMSEC English Essay Marking Report", title_style))
            story.append(Paragraph(f"<b>Student:</b> {user_name}", styles['Normal']))
            story.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%d/%m/%Y')}", styles['Normal']))
            story.append(Paragraph(f"<font color='red'><b>Mark: {marking_data.get('score', 15)}/30</b></font>", styles['Normal']))
            story.append(Paragraph(f"<font color='red'><b>Grade: {marking_data.get('grade', 'C')}</b></font>", styles['Normal']))
            story.append(Paragraph(f"<font color='red'><i>{self._get_teacher_remark(marking_data.get('score', 15))}</i></font>", styles['Normal']))
            story.append(Spacer(1, 30))
            
            # Original Essay
            story.append(Paragraph("Original Essay", section_style))
            story.append(Paragraph(essay_text, styles['Normal']))
            story.append(Spacer(1, 20))
            
            # Teacher Feedback
            story.append(Paragraph("Teacher Feedback", section_style))
            story.append(Paragraph(marking_data.get('summary_feedback', 'Good effort!'), styles['Normal']))
            story.append(Spacer(1, 20))
            
            # Corrections
            story.append(Paragraph("Key Corrections Needed", section_style))
            corrections = marking_data.get('corrections', [])
            for i, correction in enumerate(corrections, 1):
                story.append(Paragraph(f"<font color='red'>{i}. {correction}</font>", styles['Normal']))
            story.append(Spacer(1, 20))
            
            # Improved Version
            if marking_data.get('improved_version'):
                story.append(Paragraph("Improved Version (Sample)", section_style))
                story.append(Paragraph(marking_data['improved_version'], styles['Normal']))
            
            doc.build(story)
            
            # Format corrections for chat display
            corrections_text = ""
            if corrections:
                corrections_text = "\n".join([f"• {correction}" for correction in corrections[:3]])  # Show first 3 in chat
            
            # Create download URL
            pdf_url = f"https://{os.environ.get('REPL_SLUG')}.{os.environ.get('REPL_OWNER')}.repl.co/download/pdf/{pdf_filename}"
            
            return {
                'score': marking_data.get('score', 15),
                'grade': marking_data.get('grade', 'C'),
                'summary_feedback': marking_data.get('summary_feedback', 'Good effort! Keep practicing.'),
                'corrections_text': corrections_text or "No major corrections needed.",
                'pdf_url': pdf_url,
                'pdf_path': pdf_path
            }
            
        except Exception as e:
            logger.error(f"Error generating essay marking with PDF: {e}")
            return None

    def _get_teacher_remark(self, score):
        """Get teacher remark based on score"""
        if score >= 25:
            return "Excellent"
        elif score >= 20:
            return "Very Good"
        elif score >= 15:
            return "Good"
        elif score >= 10:
            return "Fair"
        else:
            return "Needs Improvement"

    def _apply_corrections_to_text(self, text, corrections):
        """Apply corrections to text with red underlines"""
        corrected_text = text
        for correction in corrections:
            error = correction.get('error', '')
            fix = correction.get('correction', '')
            if error and fix:
                corrected_text = corrected_text.replace(error, f"<u><font color='red'>{error}</font></u> <font color='red'>[{fix}]</font>")
        return corrected_text

    def handle_grammar_usage(self, user_id: str):
        """Handle Grammar and Usage - one question at a time"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            credits = get_user_credits(user_id)
            
            if credits < 2:
                self.whatsapp_service.send_message(user_id, f"❌ Insufficient credits! You need 2 credits but have {credits}. Purchase more credits to continue.")
                return
            
            # Deduct credits
            if not deduct_credits(user_id, 2, "english_grammar", "Grammar and Usage question"):
                self.whatsapp_service.send_message(user_id, "❌ Error processing credits. Please try again.")
                return
            
            # Send loading message
            self.whatsapp_service.send_message(user_id, "🧠 Generating Grammar question...\n⏳ Please wait...")
            
            # Generate one grammar question
            question_data = self.english_service.generate_grammar_question()
            
            if not question_data:
                self.whatsapp_service.send_message(user_id, "❌ Error generating question. Please try again.")
                return
            
            # Save question in session
            from database.session_db import save_user_session
            import json
            session_data = {
                'session_type': 'english_grammar',
                'question_data': json.dumps(question_data),  # Convert dict to JSON string
                'awaiting_answer': True,
                'user_name': user_name
            }
            save_user_session(user_id, session_data)
            
            # Send question
            message = f"""📝 Grammar and Usage Question

{question_data['question']}

💡 Instructions: {question_data.get('instructions', 'Please provide your answer.')}

Type your answer below:"""
            
            self.whatsapp_service.send_message(user_id, message)
            
        except Exception as e:
            logger.error(f"Error in grammar usage for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error generating grammar question. Please try again.")

    def handle_vocabulary_building(self, user_id: str):
        """Handle Vocabulary Building - MCQ format"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            credits = get_user_credits(user_id)
            
            if credits < 2:
                self.whatsapp_service.send_message(user_id, f"❌ Insufficient credits! You need 2 credits but have {credits}. Purchase more credits to continue.")
                return
            
            # Deduct credits
            if not deduct_credits(user_id, 2, "english_vocabulary", "Vocabulary Building question"):
                self.whatsapp_service.send_message(user_id, "❌ Error processing credits. Please try again.")
                return
            
            # Send loading message
            self.whatsapp_service.send_message(user_id, "🧠 Generating Vocabulary question...\n⏳ Please wait...")
            
            # Generate one vocabulary MCQ
            question_data = self.english_service.generate_vocabulary_mcq()
            
            if not question_data:
                self.whatsapp_service.send_message(user_id, "❌ Error generating question. Please try again.")
                return
            
            # Save question in session
            from database.session_db import save_user_session
            import json
            session_data = {
                'session_type': 'english_vocabulary',
                'question_data': json.dumps(question_data),  # Convert dict to JSON string
                'user_name': user_name
            }
            save_user_session(user_id, session_data)
            
            # Send MCQ question with option buttons
            message = f"""📚 Vocabulary Building Question

{question_data['question']}"""
            
            # Create option buttons
            buttons = []
            options = question_data.get('options', [])
            for i, option in enumerate(options):
                buttons.append({
                    "text": f"{chr(65+i)}. {option}",
                    "callback_data": f"vocab_answer_{i}"
                })
            
            buttons.append({"text": "🔙 Back to Topics", "callback_data": "english_topical_questions"})
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
        except Exception as e:
            logger.error(f"Error in vocabulary building for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error generating vocabulary question. Please try again.")

    def handle_grammar_answer(self, user_id: str, user_answer: str):
        """Handle grammar answer submission"""
        try:
            from database.session_db import get_user_session, clear_user_session
            from database.external_db import get_user_stats, get_user_credits
            
            session_data = get_user_session(user_id)
            if not session_data or session_data.get('session_type') != 'english_grammar':
                self.whatsapp_service.send_message(user_id, "❌ No active grammar session found.")
                return
            
            # Parse question_data from JSON string
            import json
            question_data_str = session_data.get('question_data', '{}')
            question_data = json.loads(question_data_str) if question_data_str else {}
            user_name = session_data.get('user_name', 'Student')
            
            # Get user stats
            stats = get_user_stats(user_id) or {}
            credits = get_user_credits(user_id)
            
            # Show answer and stats
            message = f"""✅ Answer Submitted!

📝 **Your Answer:** {user_answer}

🎯 **Correct Answer:** {question_data.get('answer', 'N/A')}

📚 **Explanation:** {question_data.get('explanation', 'Well done!')}

📊 **Your Stats:**
💳 Credits: {credits}
⚡ XP: {stats.get('xp_points', 0)}
🔥 Streak: {stats.get('streak', 0)}
🏆 Level: {stats.get('level', 1)}"""
            
            buttons = [
                {"text": "➡️ Next Question", "callback_data": "english_grammar_usage"},
                {"text": "🔙 Back to Topics", "callback_data": "english_topical_questions"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
            # Clear session
            clear_user_session(user_id)
            
        except Exception as e:
            logger.error(f"Error handling grammar answer for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error processing answer. Please try again.")

    def handle_vocabulary_answer(self, user_id: str, selected_option: int):
        """Handle vocabulary MCQ answer"""
        try:
            from database.session_db import get_user_session, clear_user_session
            from database.external_db import get_user_stats, get_user_credits
            
            session_data = get_user_session(user_id)
            if not session_data or session_data.get('session_type') != 'english_vocabulary':
                self.whatsapp_service.send_message(user_id, "❌ No active vocabulary session found.")
                return
            
            # Parse question_data from JSON string
            import json
            question_data_str = session_data.get('question_data', '{}')
            question_data = json.loads(question_data_str) if question_data_str else {}
            user_name = session_data.get('user_name', 'Student')
            
            correct_answer = question_data.get('correct_answer', 0)
            options = question_data.get('options', [])
            
            # Check if answer is correct
            is_correct = selected_option == correct_answer
            
            # Get user stats  
            stats = get_user_stats(user_id) or {}
            credits = get_user_credits(user_id)
            
            # Show result
            if is_correct:
                result_emoji = "✅"
                result_text = "Correct!"
            else:
                result_emoji = "❌"
                result_text = "Incorrect"
            
            message = f"""{result_emoji} **{result_text}**

📚 **Question:** {question_data.get('question', '')}

🎯 **Correct Answer:** {options[correct_answer] if correct_answer < len(options) else 'N/A'}

💡 **Explanation:** {question_data.get('explanation', 'Keep learning!')}

📊 **Your Stats:**
💳 Credits: {credits}
⚡ XP: {stats.get('xp_points', 0)}
🔥 Streak: {stats.get('streak', 0)}
🏆 Level: {stats.get('level', 1)}"""
            
            buttons = [
                {"text": "➡️ Next Question", "callback_data": "english_vocabulary_building"},
                {"text": "🔙 Back to Topics", "callback_data": "english_topical_questions"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
            # Clear session
            clear_user_session(user_id)
            
        except Exception as e:
            logger.error(f"Error handling vocabulary answer for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error processing answer. Please try again.")

    def handle_comprehension_generation(self, user_id: str, theme: str):
        """Generate and send comprehension passage"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            form_level = registration.get('form_level', 3) if registration else 3
            
            # Deduct credits
            if not deduct_credits(user_id, 3, "english_comprehension", f"Comprehension: {theme}"):
                self.whatsapp_service.send_message(user_id, "❌ Error processing credits. Please try again.")
                return
            
            # Send loading message
            self.whatsapp_service.send_message(
                user_id,
                f"📖 Creating authentic Zimbabwean comprehension passage about {theme}...\n⏳ Please wait while our AI crafts your passage..."
            )
            
            # Generate comprehension passage
            passage_data = self.english_service.generate_comprehension_passage(theme, form_level, african_context=True)
            
            if not passage_data:
                self.whatsapp_service.send_message(user_id, "❌ Error generating comprehension passage. Please try again.")
                return
            
            # Send passage to user
            self._send_comprehension_passage(user_id, user_name, passage_data)
            
            logger.info(f"Comprehension passage generated for {user_id}: {theme}")

        except Exception as e:
            logger.error(f"Error generating comprehension for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error generating comprehension. Please try again.")

    def handle_essay_prompt_generation(self, user_id: str, section: str, essay_type: str):
        """Generate essay prompt and prepare for submission"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            form_level = registration.get('form_level', 3) if registration else 3
            
            # Deduct credits
            if not deduct_credits(user_id, 4, "english_essay", f"Essay prompt: {section} {essay_type}"):
                self.whatsapp_service.send_message(user_id, "❌ Error processing credits. Please try again.")
                return
            
            # Send loading message
            self.whatsapp_service.send_message(
                user_id,
                f"✍️ Creating authentic ZIMSEC Section {section} {essay_type} prompt...\n⏳ Please wait..."
            )
            
            # Generate essay prompt
            prompt_data = self.english_service.generate_essay_prompt(section, essay_type, form_level)
            
            if not prompt_data:
                self.whatsapp_service.send_message(user_id, "❌ Error generating essay prompt. Please try again.")
                return
            
            # Send prompt to user and prepare for essay submission
            self._send_essay_prompt(user_id, user_name, prompt_data)
            
            logger.info(f"Essay prompt generated for {user_id}: {section} {essay_type}")

        except Exception as e:
            logger.error(f"Error generating essay prompt for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error generating essay prompt. Please try again.")


    def _send_topical_questions(self, user_id: str, user_name: str, topic: str, questions: List[Dict]):
        """Send topical questions to user"""
        try:
            message = f"""📚 ZIMSEC English - {topic}

👤 Student: {user_name}
🎯 Questions Generated: {len(questions)}
💰 Credits Used: 2

"""
            
            for i, question in enumerate(questions, 1):
                marks = question.get('marks', 1)
                difficulty = question.get('difficulty', 'medium')
                
                message += f"**Question {i}** ({marks} mark{'s' if marks > 1 else ''}) - {difficulty.title()}\n"
                message += f"{question.get('question_text', '')}\n\n"
                message += f"**Answer:** {question.get('correct_answer', '')}\n\n"
                message += "---\n\n"
            
            message += "🎯 **Ready for more practice?**"
            
            buttons = [
                {"text": "📚 More Questions", "callback_data": "english_topical_questions"},
                {"text": "📖 Try Comprehension", "callback_data": "english_comprehension"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error sending topical questions: {e}")

    def _send_comprehension_passage(self, user_id: str, user_name: str, passage_data: Dict):
        """Send comprehension passage and questions to user"""
        try:
            passage = passage_data.get('passage', {})
            questions = passage_data.get('questions', [])
            
            # Send passage first
            passage_message = f"""📖 ZIMSEC Comprehension Practice

👤 Student: {user_name}
📚 Title: {passage.get('title', 'Reading Passage')}
🌍 Setting: {passage.get('setting', 'Zimbabwe')}
⏱️ Time: 15 minutes
📊 Total Marks: {passage_data.get('total_marks', 15)}

**{passage.get('title', 'Reading Passage')}**

{passage.get('text', '')}

**Instructions:** Read the passage carefully and answer ALL questions.
"""
            
            self.whatsapp_service.send_message(user_id, passage_message)
            
            # Send questions
            questions_message = "**COMPREHENSION QUESTIONS**\n\n"
            
            for question in questions:
                q_num = question.get('question_number', 1)
                marks = question.get('marks', 1)
                q_text = question.get('question_text', '')
                answer = question.get('correct_answer', '')
                
                questions_message += f"**{q_num}.** {q_text} ({marks} mark{'s' if marks > 1 else ''})\n"
                questions_message += f"**Answer:** {answer}\n\n"
            
            questions_message += "🎯 **Great job practicing comprehension!**"
            
            buttons = [
                {"text": "📖 Another Passage", "callback_data": "english_comprehension"},
                {"text": "✍️ Try Essay Writing", "callback_data": "english_essay_writing"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, questions_message, buttons)

        except Exception as e:
            logger.error(f"Error sending comprehension passage: {e}")

    def _send_essay_prompt(self, user_id: str, user_name: str, prompt_data: Dict):
        """Send essay prompt and prepare for submission"""
        try:
            section = prompt_data.get('section', 'A')
            max_marks = prompt_data.get('max_marks', 30)
            word_count = prompt_data.get('word_count', '400-600 words')
            time_allocation = prompt_data.get('time_allocation', '45 minutes')
            
            message = f"""✍️ ZIMSEC English Essay - Section {section}

👤 Student: {user_name}
📝 Maximum Marks: {max_marks}
⏱️ Time: {time_allocation}
📄 Word Count: {word_count}

**ESSAY PROMPT:**
{prompt_data.get('prompt_text', '')}

**INSTRUCTIONS:**
• Write your essay in response to the prompt above
• Follow the word count guidelines
• Structure your essay clearly with introduction, body, and conclusion
• Use appropriate language and style
• Include Zimbabwean context where relevant

**TYPE YOUR ESSAY BELOW:**
_(Send your complete essay as your next message)_"""

            self.whatsapp_service.send_message(user_id, message)
            
            # Update session to await essay
            session_data = get_user_session(user_id) or {}
            session_data.update({
                'awaiting_essay': True,
                'essay_prompt': prompt_data,
                'session_type': 'english_essay'
            })
            save_user_session(user_id, session_data)

        except Exception as e:
            logger.error(f"Error sending essay prompt: {e}")

    def _send_essay_feedback(self, user_id: str, user_name: str, marking_result: Dict, prompt_data: Dict):
        """Send detailed essay feedback"""
        try:
            marks = marking_result.get('marks', {})
            total_marks = marks.get('total', 0)
            max_marks = prompt_data.get('max_marks', 30)
            grade = marking_result.get('grade', 'C')
            percentage = marking_result.get('percentage', 60)
            
            feedback = marking_result.get('feedback', {})
            
            feedback_message = f"""✅ ZIMSEC Essay Marked!

👤 Student: {user_name}
📊 **Your Results:**
• Total Score: {total_marks}/{max_marks} ({percentage}%)
• Grade: {grade}

📈 **Breakdown:**
• Content & Ideas: {marks.get('content', 0)}/10
• Language & Expression: {marks.get('language', 0)}/10  
• Structure & Organization: {marks.get('structure', 0)}/10

🌟 **Strengths:**
{chr(10).join(['• ' + strength for strength in feedback.get('strengths', [])])}

📝 **Areas for Improvement:**
{chr(10).join(['• ' + area for area in marking_result.get('areas_for_improvement', [])])}

💬 **Teacher Comment:**
{marking_result.get('teacher_comment', 'Keep practicing!')}

📋 **Detailed Feedback:**
{feedback.get('overall_comment', 'Well done on your essay attempt!')}

🚀 **Next Steps:**
{chr(10).join(['• ' + step for step in marking_result.get('next_steps', ['Keep practicing', 'Read more to improve vocabulary'])])}"""

            buttons = [
                {"text": "✍️ Write Another Essay", "callback_data": "english_essay_writing"},
                {"text": "📖 Try Comprehension", "callback_data": "english_comprehension"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, feedback_message, buttons)

        except Exception as e:
            logger.error(f"Error sending essay feedback: {e}")

    def _send_insufficient_credits_message(self, user_id: str, user_name: str, credits: int, required: int):
        """Send insufficient credits message"""
        message = f"""💰 Insufficient Credits

👤 Student: {user_name}
💰 Current Credits: {credits}
🎯 Required: {required} credits

🔄 Please purchase more credits to continue learning English."""

        buttons = [
            {"text": "💰 Buy Credits", "callback_data": "buy_credits"},
            {"text": "🏠 Main Menu", "callback_data": "main_menu"}
        ]

        self.whatsapp_service.send_interactive_message(user_id, message, buttons)