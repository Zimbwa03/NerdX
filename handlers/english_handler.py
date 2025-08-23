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
        """Handle essay writing module"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            credits = get_user_credits(user_id)
            
            module_info = self.english_modules["essay_writing"]
            
            if credits < module_info["credit_cost"]:
                self._send_insufficient_credits_message(user_id, user_name, credits, module_info["credit_cost"])
                return
            
            message = f"""✍️ ZIMSEC Essay Writing

👤 Student: {user_name}
💰 Cost: {module_info["credit_cost"]} credits

📝 Choose your section:"""

            buttons = [
                {"text": "📝 Section A: Free Choice (30 marks)", "callback_data": "english_essay_section_a"},
                {"text": "📋 Section B: Guided Writing (20 marks)", "callback_data": "english_essay_section_b"},
                {"text": "🔙 Back to English", "callback_data": "english_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error in essay writing for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading essay options. Please try again.")

    def handle_essay_section_a(self, user_id: str):
        """Handle Section A essay selection"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            message = f"""📝 Section A: Free Choice Essays (30 marks)

👤 Student: {user_name}

Choose your essay type:"""

            section_a_types = self.english_modules["essay_writing"]["section_a_types"]
            buttons = []
            
            for essay_type in section_a_types:
                buttons.append({
                    "text": f"{essay_type.title()} Essay",
                    "callback_data": f"english_essay_a_{essay_type}"
                })
            
            buttons.append({"text": "🔙 Back to Essays", "callback_data": "english_essay_writing"})
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error in essay section A for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading Section A options.")

    def handle_essay_section_b(self, user_id: str):
        """Handle Section B guided composition selection"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            message = f"""📋 Section B: Guided Composition (20 marks)

👤 Student: {user_name}

Choose your format:"""

            section_b_types = self.english_modules["essay_writing"]["section_b_types"]
            buttons = []
            
            for format_type in section_b_types:
                buttons.append({
                    "text": f"{format_type.title()} Writing",
                    "callback_data": f"english_essay_b_{format_type}"
                })
            
            buttons.append({"text": "🔙 Back to Essays", "callback_data": "english_essay_writing"})
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error in essay section B for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading Section B options.")

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

    def handle_essay_submission(self, user_id: str, essay_text: str):
        """Handle essay submission and marking"""
        try:
            session_data = get_user_session(user_id)
            
            if not session_data or not session_data.get('awaiting_essay'):
                self.whatsapp_service.send_message(user_id, "❌ No essay prompt found. Please start a new essay.")
                return
            
            prompt_data = session_data.get('essay_prompt')
            if not prompt_data:
                self.whatsapp_service.send_message(user_id, "❌ Essay prompt data missing. Please start a new essay.")
                return
            
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            form_level = registration.get('form_level', 3) if registration else 3
            
            # Send marking message
            self.whatsapp_service.send_message(
                user_id,
                "🔍 Marking your essay using AI technology...\n⏳ This may take a moment for thorough analysis..."
            )
            
            # Mark essay using Gemini
            marking_result = self.english_service.mark_essay(
                essay_text, 
                prompt_data.get('prompt_text', ''),
                form_level,
                prompt_data.get('section', 'A')
            )
            
            if not marking_result:
                self.whatsapp_service.send_message(user_id, "❌ Error marking essay. Please try again.")
                return
            
            # Send detailed feedback
            self._send_essay_feedback(user_id, user_name, marking_result, prompt_data)
            
            # Clear session
            session_data.pop('awaiting_essay', None)
            session_data.pop('essay_prompt', None)
            save_user_session(user_id, session_data)
            
            logger.info(f"Essay marked for {user_id}: {marking_result.get('marks', {}).get('total', 0)} marks")

        except Exception as e:
            logger.error(f"Error handling essay submission for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error processing your essay. Please try again.")

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