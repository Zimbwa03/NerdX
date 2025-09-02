import os
import json
import logging
import time
from typing import Dict, List, Optional
from database.external_db import get_user_registration, get_user_credits, get_user_stats, update_user_stats
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
                "credit_cost": 1,
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
                "credit_cost": 3,
                "section_a_types": ["narrative", "descriptive", "argumentative", "discursive"],
                "section_b_types": ["letter", "report", "article", "speech", "memo"]
            },
        }

        logger.info("ZIMSEC English Handler initialized with comprehensive modules")

    def handle_english_menu(self, user_id: str):
        """Display main English learning menu with full gamification system"""
        try:
            from services.advanced_credit_service import advanced_credit_service

            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            current_credits = get_user_credits(user_id)
            user_stats = get_user_stats(user_id) or {'level': 1, 'xp_points': 0, 'streak': 0}
            current_level = user_stats.get('level', 1)
            current_xp = user_stats.get('xp_points', 0)
            current_streak = user_stats.get('streak', 0)

            # Calculate XP needed for next level
            xp_for_next_level = (current_level * 100) - current_xp
            if xp_for_next_level <= 0:
                xp_for_next_level = 100  # Base XP for next level

            message = f"""📚 *Hey {user_name}! Welcome to EnglishMentor* 📚

✍️ *{user_name}, I'm your personal O-Level English tutor!*

📊 **Your English Journey:**
💳 Credits: **{current_credits}**
⭐ Level: **{current_level}** (XP: {current_xp})
🔥 Streak: **{current_streak} days**
🎯 Next Level: **{xp_for_next_level} XP needed**

I'm here to help you master English, {user_name}, with:

📚 **Topical Questions:** Earn 5-10 XP per question
📖 **Comprehension Practice:** Earn 15-20 XP per session
✍️ **Essay Writing:** Earn 25-30 XP per essay
🔥 **Daily Streaks:** Maintain consistent learning

🚀 *{user_name}, choose how you'd like to earn XP and level up:*"""

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

            # 🔒 ULTRA-SECURE CREDIT VALIDATION (NO DEDUCTION YET!)
            from services.secure_credit_system import secure_credit_system
            validation = secure_credit_system.ultra_secure_pre_validation(user_id, 'english_topical')

            if not validation['success']:
                logger.warning(f"🚨 SECURE BLOCK: User {user_id} denied access to English topical - {validation.get('message')}")
                message, buttons = secure_credit_system.format_insufficient_credits_message(user_id, 'english_topical')
                self.whatsapp_service.send_interactive_message(user_id, message, buttons)
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

            # 🔒 ULTRA-SECURE CREDIT VALIDATION (NO DEDUCTION YET!)
            from services.secure_credit_system import secure_credit_system
            validation = secure_credit_system.ultra_secure_pre_validation(user_id, 'english_comprehension')

            if not validation['success']:
                logger.warning(f"🚨 SECURE BLOCK: User {user_id} denied access to English comprehension - {validation.get('message')}")
                message, buttons = secure_credit_system.format_insufficient_credits_message(user_id, 'english_comprehension')
                self.whatsapp_service.send_interactive_message(user_id, message, buttons)
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
            from services.advanced_credit_service import advanced_credit_service
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

            # Check and deduct credits using advanced credit service
            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id,
                'english_comprehension',  # 3 credits as per config
                None
            )

            if not credit_result['success']:
                if credit_result.get('insufficient'):
                    # Show insufficient credits message
                    current_credits = credit_result['current_credits']
                    required_credits = credit_result['required_credits']
                    shortage = credit_result['shortage']

                    insufficient_msg = f"""💰 **Need More Credits!** 💰

📖 **English Comprehension Practice**

💳 **Credit Status:**
• Current Credits: {current_credits}
• Required Credits: {required_credits}
• Need: {shortage} more credits

💎 **Get More Credits:**"""

                    buttons = [
                        {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                        {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                        {"text": "🔙 Back to English", "callback_data": "english_menu"}
                    ]

                    self.whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                    clear_user_session(user_id)  # Clear generating lock on failure
                    return
                else:
                    clear_user_session(user_id)  # Clear generating lock on failure
                    self.whatsapp_service.send_message(user_id, "❌ Credit processing error. Please try again.")
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
                question_type = (q.get('question_type') or '').title()
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
        """Show all comprehension answers with stats and XP tracking"""
        try:
            from database.session_db import get_user_session, clear_user_session
            from database.external_db import get_user_stats, add_xp, update_streak, update_user_stats

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

            # Award XP for completion and update stats
            current_stats = get_user_stats(user_id) or {}
            current_xp = current_stats.get('xp_points', 0)
            current_level = current_stats.get('level', 1)
            current_streak = current_stats.get('streak', 0)

            # Award 20 XP for completing comprehension
            points_earned = 20
            add_xp(user_id, points_earned, 'english_comprehension')
            update_streak(user_id)

            # Check for level up
            new_xp = current_xp + points_earned
            new_level = max(1, (new_xp // 100) + 1)
            new_streak = current_streak + 1

            # Update total attempts and comprehension completions
            update_user_stats(user_id, {
                'total_attempts': current_stats.get('total_attempts', 0) + 1,
                'comprehension_completed': current_stats.get('comprehension_completed', 0) + 1,
                'xp_points': new_xp,
                'level': new_level,
                'streak': new_streak
            })

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

            # Get updated stats and send gamified completion message
            updated_stats = get_user_stats(user_id) or {}
            final_credits = updated_stats.get('credits', 0)
            final_xp = updated_stats.get('xp_points', 0)
            final_streak = updated_stats.get('streak', 0)
            final_level = updated_stats.get('level', 1)

            level_up_bonus = ""
            if new_level > current_level:
                level_up_bonus = f"\n🎉 *LEVEL UP!* Level {current_level} → Level {new_level}!"

            stats_message = f"""🎉 Comprehension Complete! 🎉

👤 {user_name}'s English Progress:
💰 Credits: {final_credits}
✨ XP Earned: +{points_earned} XP
⭐ Total XP: {final_xp}
🔥 Streak: {final_streak} days
🎯 Level: {final_level}

{level_up_bonus}

📚 Great job on completing your comprehension practice! ✨
🚀 Keep reading to build your English skills!"""

            buttons = [
                {"text": "🚀 Another Comprehension", "callback_data": "comprehension_start"},
                {"text": "✍️ Try Essay Writing", "callback_data": "english_essay_writing"},
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
        """Send optimized comprehension flow - text with questions loading button"""
        try:
            passage = passage_data.get('passage', {})
            questions = passage_data.get('questions', [])

            if not passage or not questions:
                logger.error("Invalid passage data structure")
                return

            # Get passage details
            passage_text = passage.get('text', 'Passage content not available')
            passage_title = passage.get('title', 'Comprehension Passage')
            word_count = len(passage_text.split())
            reading_time = max(2, word_count // 200)

            # Create comprehensive message with passage and continue button
            # Format passage for optimal display
            complete_message = f"""📖 **{passage_title}**

📊 Words: {word_count} | ⏱️ Reading time: ~{reading_time} min

**Read the passage carefully:**

{passage_text}

---

✅ **Passage Complete!** Now you'll answer 10 comprehension questions based on this passage, {user_name}.

📝 Ready to continue?"""

            # Check message length for WhatsApp limits
            if len(complete_message) > 4000:
                # Split into two messages: title + passage, then questions button
                title_passage_message = f"""📖 **{passage_title}**

📊 Words: {word_count} | ⏱️ Reading time: ~{reading_time} min

**Read the passage carefully:**

{passage_text}"""

                self.whatsapp_service.send_message(user_id, title_passage_message)

                # Send completion message with questions button
                ready_message = f"✅ **Passage Complete!**\n\nNow you'll answer 10 comprehension questions based on this passage, {user_name}.\n\n📝 Ready to continue?"

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

            logger.info(f"Optimized passage ready for {user_id}, waiting for user to load questions")

        except Exception as e:
            logger.error(f"Error in optimized comprehension flow: {e}")
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

            # CRITICAL FIX: Send questions in ONE consolidated message to prevent message chains
            try:
                # Try to fit all questions in one message first
                all_questions_message = f"📝 **COMPREHENSION QUESTIONS**\n\n"

                for i, q in enumerate(questions[:10], 1):
                    marks = q.get('marks', 1)
                    question_text = q.get('question', f'Question {i} not available')
                    all_questions_message += f"**{i}.** {question_text} [{marks} mark{'s' if marks != 1 else ''}]\n\n"

                all_questions_message += "✅ *Answer all questions based on the passage above*"

                # Check message length
                if len(all_questions_message) > 3500:  # Leave room for WhatsApp formatting
                    # If too long, send in TWO messages maximum with delay
                    questions_message_1 = f"📝 **QUESTIONS 1-5**\n\n"
                    for i, q in enumerate(questions_part1, 1):
                        marks = q.get('marks', 1)
                        question_text = q.get('question', f'Question {i} not available')
                        questions_message_1 += f"**{i}.** {question_text} [{marks} mark{'s' if marks != 1 else ''}]\n\n"

                    # Send first part
                    self.whatsapp_service.send_message(user_id, questions_message_1)

                    # Add delay to prevent rapid message sending
                    time.sleep(1)

                        # Send second part
                    questions_message_2 = f"📝 **QUESTIONS 6-10**\n\n"
                    for i, q in enumerate(questions_part2, 6):
                        marks = q.get('marks', 1)
                        question_text = q.get('question', f'Question {i} not available')
                        questions_message_2 += f"**{i}.** {question_text} [{marks} mark{'s' if marks != 1 else ''}]\n\n"

                    questions_message_2 += "✅ *Answer all questions based on the passage above*"
                    self.whatsapp_service.send_message(user_id, questions_message_2)
                else:
                    # Send all questions in one message
                    self.whatsapp_service.send_message(user_id, all_questions_message)

                logger.info(f"Questions sent successfully to {user_id}")

            except Exception as e:
                logger.error(f"Error sending questions to {user_id}: {e}")
                self.whatsapp_service.send_message(user_id, "❌ Error displaying questions. Please try again.")
                return

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
        """Reset active comprehension session - user must manually start new session"""
        try:
            from database.session_db import clear_user_session
            import time

            # Force clear any existing session
            clear_user_session(user_id)

            # Small delay to ensure session is cleared
            time.sleep(0.5)

            # DON'T automatically start new session - let user control this
            # Send confirmation and option to start new session
            buttons = [
                {"text": "📚 Start New Comprehension", "callback_data": "comprehension_start"},
                {"text": "🔙 Back to English Menu", "callback_data": "english_menu"}
            ]

            message = "✅ Your comprehension session has been reset.\n\nWould you like to start a new comprehension practice?"
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

            logger.info(f"Comprehension session reset for {user_id} - awaiting user action")

        except Exception as e:
            logger.error(f"Error resetting comprehension for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error resetting session. Please try again.")

    def handle_essay_writing(self, user_id: str):
        """Handle ZIMSEC Essay Writing - New Implementation"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            credits = get_user_credits(user_id)

            message = f"""✍️ **ZIMSEC O Level English Essay Writing**

👤 Student: {user_name}
💰 Cost: 3 credits per essay (charged after submission)
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

            message = f"""📝 **ZIMSEC English Language Paper 1**

**Section A (30 Marks)**

This section requires candidates to write a composition between 350 and 450 words on one of the following topics:

**1.** {prompts['A']}

**2.** {prompts['B']}

**3.** {prompts['C']}

**4.** {prompts['D']}

**Choose ONE topic only and write 350-450 words.**"""

            buttons = [
                {"text": "1", "callback_data": "essay_choice_A"},
                {"text": "2", "callback_data": "essay_choice_B"},
                {"text": "3", "callback_data": "essay_choice_C"},
                {"text": "4", "callback_data": "essay_choice_D"},
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

*Essay Type: {(prompt_data.get('type') or 'Essay').title()}*"""

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
            if not session or 'prompt_data' not in session:
                self.whatsapp_service.send_message(user_id, "❌ No active essay session found.")
                return

            prompt_data = json.loads(session.get('prompt_data', '{}'))

            # Get essay type from different possible fields
            essay_type = (prompt_data.get('format_type') or
                         prompt_data.get('type') or
                         prompt_data.get('essay_type', 'narrative')).lower()

            section = prompt_data.get('section', 'A')

            hints = self._get_essay_writing_hints(essay_type)

            # Add section-specific guidance
            section_guidance = ""
            if section == 'B':
                section_guidance = f"""
📋 **Section B - Guided Composition Tips:**
• Follow the exact format requested ({essay_type})
• Include ALL the required points mentioned
• Address the specific audience mentioned
• Use appropriate formal/informal tone
• Word count: 250-350 words
• Time: 35 minutes
• Marks: 20 (Content: 7, Language: 7, Format: 6)

"""
            else:
                section_guidance = f"""
✍️ **Section A - Free Choice Tips:**
• Express your creativity and personal ideas
• Use rich descriptive language
• Word count: 400-600 words
• Time: 45 minutes
• Marks: 30 (Content: 10, Language: 10, Structure: 10)

"""

            message = f"""💡 **Writing Guide for {(essay_type or 'Essay').title()}:**

{section_guidance}{hints}

💫 **Final Tips:**
• Plan your essay before writing
• Check grammar and spelling
• Stay within word count limits
• Review your work before submitting"""

            buttons = [
                {"text": "📝 Continue Writing", "callback_data": "essay_start_writing"},
                {"text": "🔙 Back", "callback_data": "essay_guided_composition"}
            ]

            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error showing essay hints for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading hints. Please try again.")

    def _generate_zimsec_essay_prompts(self):
        """Generate 4 authentic ZIMSEC Section A essay prompts"""
        import random

        # Authentic ZIMSEC Section A question types
        zimsec_section_a_questions = [
            # Type 1: Descriptive
            "Describe your favourite sport.",
            "Describe a place in Zimbabwe that you will never forget.",
            "Describe a traditional ceremony in your community.",
            "Describe the effects of social media on young people.",

            # Type 2: Narrative with given statements
            'Write a story that includes one of the following statements:\n"The whole community was at peace again."\n"The mother wept bitterly when she was shown her daughter\'s video that was circulating on social media."',
            'Write a story that includes one of the following statements:\n"It was the best decision I ever made."\n"The teacher could not believe what she was seeing."',
            'Write a story that includes one of the following statements:\n"Justice was finally served."\n"The villagers gathered to witness the historic moment."',
            'Write a story that includes one of the following statements:\n"The secret was finally revealed."\n"Nobody expected such a dramatic turn of events."',

            # Type 3: Argumentative/Discussion
            '"Teachers play a bigger role than parents in building up a child." Discuss.',
            '"Education is the key to success." Discuss.',
            '"Social media has done more harm than good to society." Discuss.',
            '"Money is the root of all evil." What are your views?',

            # Type 4: Problem-solving
            "What can be done to reduce food shortage in your local area?",
            "What can be done to reduce unemployment among the youth in Zimbabwe?",
            "How can drug abuse be reduced in schools?",
            "What measures can be taken to improve road safety in Zimbabwe?",

            # Type 5: Opinion/Views
            '"Academic and professional qualifications are the only guarantee for survival in today\'s world." What are your views?',
            '"Hard work is more important than talent." What are your views?',
            '"Technology has made life easier." What are your views?',
            '"Honesty is always the best policy." What are your views?',

            # Type 6: Newspaper headline stories
            'Write a story based on the newspaper headline: "STOLEN CHILD FOUND ALIVE."',
            'Write a story based on the newspaper headline: "STUDENT BECOMES MILLIONAIRE."',
            'Write a story based on the newspaper headline: "VILLAGE WINS LOTTERY."',
            'Write a story based on the newspaper headline: "TEACHER SAVES DROWNING CHILD."',

            # Type 7: Single word topics
            "Teamwork.",
            "Friendship.",
            "Courage.",
            "Honesty.",
            "Success.",
            "Leadership.",
            "Determination.",
            "Forgiveness."
        ]

        # Select 4 random questions ensuring variety
        selected_prompts = random.sample(zimsec_section_a_questions, 4)

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
            'letter': """📮 **Letter Writing Guide:**

**FORMAL LETTER:**
• Your address (top right corner)
• Date (below your address)
• Recipient's address (left side)
• Dear Sir/Madam or Dear Mr/Mrs [Name]
• Introduction paragraph (state purpose)
• Body paragraphs (main points)
• Conclusion paragraph (summary/action)
• Yours faithfully (if Dear Sir/Madam)
• Yours sincerely (if named person)
• Your signature and printed name

**INFORMAL LETTER:**
• Your address (top right)
• Date
• Dear [Friend's name]
• Friendly opening
• Main content in paragraphs
• Personal closing remarks
• Love/Best wishes/Yours truly
• Your name""",

            'report': """📊 **Report Writing Guide:**

**STRUCTURE:**
• **TITLE:** Clear and specific (e.g., "Report on Youth Employment")
• **TO:** Person/Organization receiving report
• **FROM:** Your name and position
• **DATE:** When report was written
• **INTRODUCTION:** Purpose and background
• **FINDINGS/MAIN BODY:**
  - Use headings and subheadings
  - Present information logically
  - Include specific points requested
• **RECOMMENDATIONS:** Practical suggestions
• **CONCLUSION:** Summary of key points

**LANGUAGE:** Formal, objective, factual""",

            'speech': """🎤 **Speech Writing Guide:**

**STRUCTURE:**
• **OPENING:** Greet audience, introduce yourself
• **INTRODUCTION:** Hook/attention grabber, state your topic
• **MAIN BODY:** 3-4 key points with examples
• **CONCLUSION:** Summarize main points, call to action
• **CLOSING:** Thank audience

**TECHNIQUES:**
• Use rhetorical questions
• Include personal experiences
• Add relevant quotes or statistics
• Repeat key phrases for emphasis
• Address audience directly ("you", "we")

**DELIVERY NOTES:** Write as if speaking aloud""",

            'article': """📰 **Article Writing Guide:**

**STRUCTURE:**
• **HEADLINE:** Catchy and informative
• **INTRODUCTION:** Hook the reader, introduce topic
• **MAIN BODY:**
  - Develop points logically
  - Use subheadings if needed
  - Include examples and evidence
• **CONCLUSION:** Reinforce main message

**STYLE:**
• Write for your target audience
• Use engaging, clear language
• Include facts and opinions
• Make it informative and interesting
• Use present tense mostly""",

            'narrative': """📖 **Narrative Writing Guide:**

**STORY STRUCTURE:**
• **SETTING:** Time, place, atmosphere
• **CHARACTERS:** Well-developed, realistic
• **PLOT:** Beginning → Middle → End
• **CONFLICT:** Problem/challenge to resolve
• **CLIMAX:** Most exciting/important moment
• **RESOLUTION:** How everything ends

**TECHNIQUES:**
• Use descriptive language
• Include dialogue to bring characters to life
• Show emotions and actions
• Use past tense consistently
• Create vivid imagery with sensory details""",

            'memo': """📋 **Memo Writing Guide:**

**FORMAT:**
• **TO:** Recipient's name and title
• **FROM:** Your name and title
• **DATE:** Current date
• **SUBJECT:** Clear, specific topic

**STRUCTURE:**
• **PURPOSE:** Why you're writing
• **BACKGROUND:** Context/situation
• **DISCUSSION:** Main points and details
• **ACTION:** What needs to be done
• **CLOSING:** Next steps or contact info

**STYLE:** Professional, concise, direct"""
        }

        return hints.get(essay_type, "Focus on clear structure, good grammar, and staying within the required word count.")

    def handle_essay_submission(self, user_id: str, essay_text: str):
        """Handle essay submission and generate PDF marking report"""
        try:
            from database.session_db import get_user_session, clear_user_session, save_user_session
            from database.external_db import deduct_credits
            import json
            import time

            session = get_user_session(user_id)
            if not session or not session.get('awaiting_essay'):
                self.whatsapp_service.send_message(user_id, "❌ No active essay session found. Please start a new essay.")
                return

            # Prevent duplicate submissions by checking if already processing
            if session.get('processing_essay'):
                logger.warning(f"Essay already being processed for {user_id}")
                return

            # Mark as processing to prevent duplicates
            session['processing_essay'] = True
            session['awaiting_essay'] = False
            save_user_session(user_id, session)

            user_name = session.get('user_name', 'Student')

            # Check word count
            word_count = len(essay_text.split())
            if word_count < 50:
                self.whatsapp_service.send_message(user_id, f"❌ Essay too short! You wrote {word_count} words. Please write at least 50 words for proper evaluation.")
                return

            # Check and deduct credits using advanced credit service
            from services.advanced_credit_service import advanced_credit_service

            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id,
                'english_essay_writing',  # 3 credits as per config
                None
            )

            if not credit_result['success']:
                if credit_result.get('insufficient'):
                    current_credits = credit_result['current_credits']
                    required_credits = credit_result['required_credits']
                    shortage = credit_result['shortage']

                    insufficient_msg = f"""💰 **Need More Credits for Essay!** 💰

✍️ **English Essay Writing & Marking**

💳 **Credit Status:**
• Current Credits: {current_credits}
• Required Credits: {required_credits}
• Need: {shortage} more credits

💎 **Get More Credits:**"""

                    buttons = [
                        {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                        {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                        {"text": "🔙 Back to English", "callback_data": "english_menu"}
                    ]

                    self.whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                    return
                else:
                    self.whatsapp_service.send_message(user_id, "❌ Credit processing error. Please try again.")
                return

            # Send processing message
            self.whatsapp_service.send_message(user_id, "📝 Processing your essay...\n⏳ Generating marking report (this may take a moment)...")

            # Generate marking using AI and create PDF
            marking_result = self._generate_essay_marking_with_pdf(essay_text, user_name, user_id)

            if marking_result and marking_result.get('score'):
                # Send processing message
                self.whatsapp_service.send_message(user_id, "📄 Creating and sending your detailed PDF report with red corrections...\n⏳ Please wait, this may take a moment...")

                # Try to send PDF first with extended retry logic
                pdf_sent = False
                try:
                    # Use the regular method with longer timeout for important PDF delivery
                    pdf_sent = self.whatsapp_service.send_document(
                        user_id,
                        marking_result['pdf_path'],
                        "📄 Your ZIMSEC Essay Marking Report with Red Corrections",
                        f"ZIMSEC_Essay_Report_{user_name}.pdf"
                    )
                except Exception as e:
                    logger.error(f"PDF upload failed: {e}")
                    # Try one more time with the quick method as backup
                    try:
                        pdf_sent = self.whatsapp_service.send_document_quick(
                            user_id,
                            marking_result['pdf_path'],
                            "📄 Your ZIMSEC Essay Marking Report",
                            f"ZIMSEC_Essay_Report_{user_name}.pdf"
                        )
                    except Exception as e2:
                        logger.error(f"Backup PDF upload also failed: {e2}")

                # Add XP tracking for essay completion and update stats
                current_stats = get_user_stats(user_id) or {}
                current_xp = current_stats.get('xp_points', 0)
                current_level = current_stats.get('level', 1)
                current_streak = current_stats.get('streak', 0)

                # Award 30 XP for completing essay
                from database.external_db import add_xp, update_streak
                points_earned = 30
                add_xp(user_id, points_earned, 'english_essay_writing')
                update_streak(user_id)

                # Check for level up
                new_xp = current_xp + points_earned
                new_level = max(1, (new_xp // 100) + 1)
                new_streak = current_streak + 1

                # Update total attempts and essay completions
                update_user_stats(user_id, {
                    'total_attempts': current_stats.get('total_attempts', 0) + 1,
                    'essays_completed': current_stats.get('essays_completed', 0) + 1,
                    'xp_points': new_xp,
                    'level': new_level,
                    'streak': new_streak
                })

                # Get updated stats for final display
                updated_stats = get_user_stats(user_id) or {}
                final_credits = updated_stats.get('credits', 0)
                final_xp = updated_stats.get('xp_points', 0)
                final_streak = updated_stats.get('streak', 0)
                final_level = updated_stats.get('level', 1)

                level_up_bonus = ""
                if new_level > current_level:
                    level_up_bonus = f"\n🎉 *LEVEL UP!* Level {current_level} → Level {new_level}!"

                # Send feedback message AFTER PDF is sent
                if pdf_sent:
                    feedback_message = f"""✅ Essay Marked Successfully! ✅

📊 Your Results:
• Score: {marking_result['score']}/30
• Word Count: {word_count} words
• Grade: {marking_result['grade']}

📚 Your English Progress:
• Credits: {final_credits}
• XP Earned: +{points_earned} XP
• Total XP: {final_xp}
• Streak: {final_streak} days
• Level: {final_level}

{level_up_bonus}

📝 Teacher Feedback:
{marking_result['summary_feedback']}

🔍 Key Corrections:
{marking_result.get('corrections_text', 'No major corrections needed.')}

📄 Your detailed PDF report with red corrections has been sent above ⬆️

🎯 The PDF shows your original essay with all errors marked in red with corrections!"""
                else:
                    # Enhanced fallback with direct text feedback and XP tracking
                    corrections_list = marking_result.get('specific_errors', [])
                    corrections_display = ""
                    if corrections_list:
                        corrections_display = "\n".join([f"• {error.get('wrong', '')} → {error.get('correct', '')} ({error.get('type', 'error')})" for error in corrections_list[:5]])
                    else:
                        corrections_display = "No major corrections needed."

                    feedback_message = f"""✅ Essay Marked Successfully! ✅

📊 Your Results:
• Score: {marking_result['score']}/30
• Word Count: {word_count} words
• Grade: {marking_result['grade']}

📚 Your English Progress:
• Credits: {final_credits}
• XP Earned: +{points_earned} XP
• Total XP: {final_xp}
• Streak: {final_streak} days
• Level: {final_level}

{level_up_bonus}

📝 Teacher Feedback:
{marking_result['summary_feedback']}

🔍 Key Corrections Found:
{corrections_display}

⚠️ PDF Upload Issue - We're having trouble sending your detailed report right now. Your essay has been marked and scored above.

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
            # Clear session on error too
            clear_user_session(user_id)
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

            # Use Gemini AI to mark the essay professionally with improved marking criteria
            word_count = len(essay_text.split())

            marking_prompt = f"""
You are an experienced ZIMSEC O Level English Language teacher with 15+ years of marking compositions. Analyze this student's essay thoroughly and professionally.

ESSAY DETAILS:
- Word Count: {word_count} words
- Expected Length: 300-600 words
- Student Level: O Level (15-17 years old)

ENHANCED MARKING CRITERIA (Total: 30 marks):

**Content & Ideas (10 marks):**
- 9-10: Excellent ideas, highly relevant, creative and original
- 7-8: Good ideas, mostly relevant, shows understanding
- 5-6: Adequate ideas, generally relevant to topic
- 3-4: Limited ideas, some irrelevance
- 1-2: Poor ideas, largely irrelevant

**Language & Expression (10 marks):**
- 9-10: Excellent vocabulary, varied sentence structures, natural flow
- 7-8: Good vocabulary, some variety in sentences
- 5-6: Adequate vocabulary, simple but clear sentences
- 3-4: Limited vocabulary, repetitive sentence patterns
- 1-2: Poor vocabulary, unclear expression

**Accuracy (10 marks):**
- 9-10: Very few errors in grammar, spelling, punctuation
- 7-8: Some errors but don't impede understanding
- 5-6: Several errors but meaning is generally clear
- 3-4: Many errors that sometimes affect meaning
- 1-2: Frequent errors that significantly affect understanding

MARKING INSTRUCTIONS:
1. Count actual errors (grammar, spelling, punctuation)
2. Assess content quality and relevance
3. Evaluate language use and expression
4. Be lenient but fair - consider this is a learning student
5. Give constructive feedback that encourages improvement
6. For every 3-4 significant errors, deduct 2-3 marks from baseline
7. Award higher marks for good effort and understanding

Essay to evaluate:
{essay_text}

Respond in this JSON format:
{{
    "score": [Calculate based on actual analysis - be fair and realistic],
    "grade": "[A/B/C/D/E/U based on score]",
    "summary_feedback": "Detailed, encouraging feedback that acknowledges strengths and areas for improvement",
    "specific_errors": [
        {{"wrong": "error found", "correct": "correction", "type": "error type"}},
        {{"wrong": "another error", "correct": "correction", "type": "error type"}}
    ],
    "corrections_explanation": [
        "Specific advice for improvement",
        "Grammar rules to remember",
        "Writing techniques to practice"
    ],
    "improved_version": "Brief example of how a section could be improved"
}}

IMPORTANT: 
- Count actual errors and base marking on real assessment
- Be encouraging but honest about the grade
- Consider word count in your assessment
- Give marks that reflect the actual quality of the work
- Students with many errors should get lower marks (10-15/30) 
- Students with few errors and good content should get higher marks (20-25/30)
- Exceptional work deserves 25-30 marks
"""

            # Get marking from Gemini with better error handling
            marking_response = self.english_service.generate_essay_marking(marking_prompt)

            if not marking_response or not marking_response.strip():
                logger.error("No response from Gemini AI - using enhanced fallback")
                # Create enhanced fallback marking data
                word_count = len(essay_text.split())
                estimated_score = min(25, max(10, (word_count // 20) + 10))  # Rough score based on length

                marking_data = {
                    'score': estimated_score,
                    'grade': self._get_grade_from_score(estimated_score),
                    'summary_feedback': f'Your essay shows good effort and understanding of the topic. You have written approximately {word_count} words which demonstrates engagement with the task. Continue practicing to improve your grammar, vocabulary, and essay structure. Focus on clear paragraphs and varied sentence structures.',
                    'specific_errors': [
                        {"wrong": "repetitive words", "correct": "varied vocabulary", "type": "vocabulary"},
                        {"wrong": "simple sentences", "correct": "complex sentences", "type": "sentence structure"},
                        {"wrong": "unclear transitions", "correct": "smooth transitions", "type": "organization"}
                    ],
                    'corrections_explanation': [
                        "Use varied vocabulary to make your writing more engaging",
                        "Combine simple sentences into complex ones for better flow",
                        "Add transition words between paragraphs",
                        "Check spelling and punctuation carefully",
                        "Ensure your conclusion summarizes your main points"
                    ],
                    'improved_version': 'Focus on the specific feedback areas above to enhance your writing skills.'
                }
            else:
                logger.info(f"Gemini response received: {marking_response[:200]}...")

                try:
                    # Clean the response text
                    clean_response = marking_response.strip()
                    if clean_response.startswith('```json'):
                        clean_response = clean_response[7:]
                    if clean_response.endswith('```'):
                        clean_response = clean_response[:-3]
                    clean_response = clean_response.strip()

                    marking_data = json.loads(clean_response)
                    logger.info(f"Successfully parsed JSON: {list(marking_data.keys())}")

                    # Validate required fields
                    if not marking_data.get('score') or not marking_data.get('summary_feedback'):
                        logger.warning("Missing required fields in marking data, using fallback")
                        raise ValueError("Missing required marking fields")

                except (json.JSONDecodeError, ValueError) as e:
                    logger.error(f"Failed to parse JSON: {e}")
                    logger.error(f"Raw response: {marking_response[:500]}...")

                    # Create enhanced fallback data
                    word_count = len(essay_text.split())
                    estimated_score = min(25, max(10, (word_count // 20) + 10))

                    marking_data = {
                        'score': estimated_score,
                        'grade': self._get_grade_from_score(estimated_score),
                        'summary_feedback': f'Your essay demonstrates understanding of the topic with approximately {word_count} words. There are areas for improvement in grammar, vocabulary, and structure. Continue practicing to develop your writing skills further.',
                        'specific_errors': [
                            {"wrong": "basic errors", "correct": "improved accuracy", "type": "general"},
                            {"wrong": "simple structure", "correct": "complex structure", "type": "organization"}
                        ],
                        'corrections_explanation': [
                            "Focus on grammar accuracy and punctuation",
                            "Use more varied vocabulary throughout",
                            "Improve paragraph organization and flow",
                            "Practice proofreading before submission"
                        ],
                        'improved_version': 'Continue working on the areas mentioned above to improve your writing.'
                    }

            # Create PDF report
            try:
                timestamp = int(datetime.now().timestamp())

                # Ensure the static/pdfs directory exists
                try:
                    os.makedirs('static/pdfs', exist_ok=True)
                except (OSError, PermissionError) as e:
                    logger.error(f"Error creating pdfs directory: {e}")
                    # Fall back to current directory if static/pdfs creation fails
                    pdf_path = f"essay_marked_{user_id}_{timestamp}.pdf"
                else:
                    pdf_path = f"static/pdfs/essay_marked_{user_id}_{timestamp}.pdf"

                logger.info(f"Creating PDF at: {pdf_path}")

                # Create advanced PDF with watermark
                from reportlab.lib.colors import blue, grey, lightgrey
                from reportlab.lib.units import inch
                from reportlab.platypus import Table, TableStyle

                doc = SimpleDocTemplate(pdf_path, pagesize=A4, topMargin=60, bottomMargin=60, leftMargin=50, rightMargin=50)
                styles = getSampleStyleSheet()
                story = []

                # Enhanced custom styles
                title_style = ParagraphStyle('CustomTitle',
                    parent=styles['Heading1'],
                    textColor=red,
                    spaceAfter=20,
                    alignment=1,
                    fontSize=18,
                    fontName='Helvetica-Bold')

                header_style = ParagraphStyle('HeaderStyle',
                    parent=styles['Normal'],
                    fontSize=12,
                    textColor=blue,
                    fontName='Helvetica-Bold',
                    spaceAfter=8)

                section_style = ParagraphStyle('SectionHeader',
                    parent=styles['Heading2'],
                    spaceAfter=12,
                    spaceBefore=20,
                    textColor=blue,
                    fontSize=14,
                    fontName='Helvetica-Bold')

                watermark_style = ParagraphStyle('Watermark',
                    parent=styles['Normal'],
                    fontSize=8,
                    textColor=lightgrey,
                    alignment=2)  # Right align

                # NerdX watermark at top header
                nerdx_header = Paragraph(
                    '<font color="#888888" size="12"><i>Generated by NerdX Educational Platform</i></font>',
                    watermark_style
                )
                story.append(nerdx_header)
                story.append(Spacer(1, 15))

                # Header with ZIMSEC branding
                story.append(Paragraph("ZIMSEC ENGLISH ESSAY MARKING REPORT", title_style))
                story.append(Spacer(1, 10))

                # Student info table
                student_data = [
                    ['Student:', user_name],
                    ['Date:', datetime.now().strftime('%d/%m/%Y')],
                    ['Subject:', 'English Language Paper 1']
                ]

                student_table = Table(student_data, colWidths=[1.5*inch, 3*inch])
                student_table.setStyle(TableStyle([
                    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 0), (-1, -1), 11),
                    ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                    ('TEXTCOLOR', (0, 0), (0, -1), blue),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 0),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                    ('TOPPADDING', (0, 0), (-1, -1), 2),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
                ]))
                story.append(student_table)
                story.append(Spacer(1, 20))

                # Score display with enhanced styling
                score_style = ParagraphStyle('ScoreStyle',
                    parent=styles['Normal'],
                    fontSize=16,
                    textColor=red,
                    fontName='Helvetica-Bold',
                    alignment=1,
                    spaceAfter=10)

                story.append(Paragraph(f"<font color='red' size='16'><b><i>{marking_data.get('score', 15)}/30</i></b></font>", score_style))
                story.append(Paragraph(f"<font color='red' size='12'><i>{self._get_teacher_remark(marking_data.get('score', 15))}</i></font>", score_style))
                story.append(Spacer(1, 30))

                # Original Essay with Corrections section
                story.append(Paragraph("ORIGINAL ESSAY WITH CORRECTIONS", section_style))
                story.append(Spacer(1, 10))

                # Create corrected essay text with inline corrections
                corrected_essay = self._create_corrected_essay_text(essay_text, marking_data)

                # Split into paragraphs for better formatting
                essay_paragraphs = corrected_essay.split('\n')
                for paragraph in essay_paragraphs:
                    if paragraph.strip():
                        # Create paragraph with proper line spacing
                        essay_para_style = ParagraphStyle(
                            'EssayStyle',
                            parent=styles['Normal'],
                            fontSize=11,
                            leading=16,
                            spaceAfter=8,
                            leftIndent=20,
                            rightIndent=20
                        )
                        story.append(Paragraph(paragraph.strip(), essay_para_style))

                story.append(Spacer(1, 20))

                # Detailed Teacher Feedback section
                story.append(Paragraph("DETAILED TEACHER FEEDBACK", section_style))
                safe_feedback = marking_data.get('summary_feedback', 'Good effort!').replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;')
                story.append(Paragraph(safe_feedback, styles['Normal']))
                story.append(Spacer(1, 15))

                # Corrections Explanation section
                corrections_explanation = marking_data.get('corrections_explanation', [])
                if corrections_explanation:
                    story.append(Paragraph("AREAS FOR IMPROVEMENT", section_style))
                    for i, explanation in enumerate(corrections_explanation, 1):
                        safe_explanation = str(explanation).replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;')
                        story.append(Paragraph(f"<font color='red'>{i}. {safe_explanation}</font>", styles['Normal']))
                    story.append(Spacer(1, 20))

                # Improved Version section
                if marking_data.get('improved_version'):
                    story.append(Paragraph("IMPROVED VERSION FOR LEARNING", section_style))
                    safe_improved = str(marking_data['improved_version']).replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;')
                    story.append(Paragraph(safe_improved, styles['Normal']))
                    story.append(Spacer(1, 30))

                doc.build(story)
                logger.info(f"PDF created successfully: {pdf_path}")

            except Exception as pdf_error:
                logger.error(f"Error creating PDF: {pdf_error}")
                raise pdf_error

            # Format corrections for chat display
            corrections = marking_data.get('corrections_explanation', [])
            specific_errors = marking_data.get('specific_errors', [])

            corrections_text = ""
            if specific_errors:
                # Show specific errors found
                error_list = []
                for error in specific_errors[:3]:  # Show first 3 errors
                    wrong = error.get('wrong', '')
                    correct = error.get('correct', '')
                    error_type = error.get('type', '')
                    if wrong and correct:
                        error_list.append(f"• {wrong} → {correct} ({error_type})")
                corrections_text = "\n".join(error_list)
            elif corrections:
                # Fallback to general corrections
                corrections_text = "\n".join([f"• {correction}" for correction in corrections[:3]])

            # Create download URL
            # NOTE: This URL assumes a web server setup to serve static files.
            # It might need adjustment based on your deployment environment.
            # Using repl.co domain for Replit deployments.
            repl_slug = os.environ.get('REPL_SLUG')
            repl_owner = os.environ.get('REPL_OWNER')
            if repl_slug and repl_owner:
                pdf_filename = os.path.basename(pdf_path)
                pdf_url = f"https://{repl_slug}.{repl_owner}.repl.co/download/pdf/{pdf_filename}"
            else:
                # Fallback for local development or different deployment scenarios
                pdf_url = f"file:///{os.path.abspath(pdf_path)}" # Local file path

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
            return "Well tried"
        elif score >= 10:
            return "Fair effort"
        else:
            return "Keep practicing"

    def _create_corrected_essay_text(self, essay_text, marking_data):
        """Create essay text with proper red underlines and corrections like the user's example"""
        import re

        # Ensure we have the full essay text
        corrected_text = str(essay_text)

        # Get specific errors from Gemini AI response
        specific_errors = marking_data.get('specific_errors', [])

        # Sort errors by length (longer first) to avoid partial replacements
        specific_errors = sorted(specific_errors, key=lambda x: len(x.get('wrong', '')), reverse=True)

        # Apply corrections from Gemini AI analysis
        for error in specific_errors:
            wrong_text = error.get('wrong', '').strip()
            correct_text = error.get('correct', '').strip()

            if wrong_text and correct_text and wrong_text != correct_text:
                # Create exact format: red strikethrough + red correct text
                pattern = re.escape(wrong_text)
                matches = list(re.finditer(pattern, corrected_text, re.IGNORECASE))

                # Apply corrections from right to left to maintain positions
                for match in reversed(matches):
                    start, end = match.span()
                    original = match.group(0)

                    # Format exactly like user example: red strikethrough + red correct
                    correction_html = f'<font color="red"><u><strike>{original}</strike></u> <b>{correct_text}</b></font>'
                    corrected_text = corrected_text[:start] + correction_html + corrected_text[end:]

        # Additional common ZIMSEC errors targeting specific patterns
        common_fixes = [
            # Spacing issues
            (r'(\w+)\.([A-Z])', r'\1. \2'),  # Missing space after period
            (r'\bhave had\b', 'had'),
            (r'\bwas were\b', 'were'),
            (r'\bwere was\b', 'was'),
            (r'\bmoment\b(?=\s+ever)', 'moments'),
            (r'\benjoy\b(?=\s+every)', 'enjoyed'),
            (r'\bmake\b(?=\s+everyone)', 'made'),
            (r'\btaking\b(?=\s+many)', 'took'),
            (r'\btell\b(?=\s+stories)', 'told'),
            (r'\bbring\b(?=\s+all)', 'brought'),
            (r'\binspire\b(?=\s+me)', 'inspired'),
            (r'\bneed\b(?=\s+to\s+help)', 'needs'),
            (r'\bteache\b', 'teacher'),
        ]

        for pattern, replacement in common_fixes:
            matches = list(re.finditer(pattern, corrected_text, re.IGNORECASE))
            for match in reversed(matches):
                # Only apply if not already corrected
                context = corrected_text[max(0, match.start()-30):match.end()+30]
                if '<font color="red">' not in context:
                    start, end = match.span()
                    original = match.group(0)
                    correction_html = f'<font color="red"><u><strike>{original}</strike></u> <b>{replacement}</b></font>'
                    corrected_text = corrected_text[:start] + correction_html + corrected_text[end:]

        # Format title if present
        if corrected_text.strip():
            lines = corrected_text.split('\n')
            if lines[0] and not lines[0].startswith('<'):
                # Make title bold and italic
                lines[0] = f'<b><i>{lines[0]}</i></b>'
                corrected_text = '\n'.join(lines)

        # Clean up any double encoding
        corrected_text = corrected_text.replace('&amp;', '&')
        corrected_text = corrected_text.replace('&', '&amp;')

        return corrected_text

    def handle_grammar_usage(self, user_id: str):
        """Handle Grammar and Usage - one question at a time"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            credits = get_user_credits(user_id)

            if credits < 1:
                self.whatsapp_service.send_message(user_id, f"❌ Insufficient credits! You need 1 credit but have {credits}. Purchase more credits to continue.")
                return

            # Check and deduct credits using advanced credit service
            from services.advanced_credit_service import advanced_credit_service

            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id,
                'english_topical',  # 1 credit - use correct action key
                None
            )

            if not credit_result['success']:
                if credit_result.get('insufficient'):
                    message = f"❌ Insufficient credits. You need {credit_result['required_credits']} but have {credit_result['current_credits']}."
                else:
                    message = credit_result.get('message', '❌ Error processing credits. Please try again.')
                self.whatsapp_service.send_message(user_id, message)
                return

            # Send loading message
            self.whatsapp_service.send_message(user_id, "📝 Loading Grammar question from database...\n⏳ Please wait...")

            # Get one grammar question from database
            response = self.english_service.generate_grammar_question()

            if not response or not response.get('success'):
                self.whatsapp_service.send_message(user_id, "❌ Error loading question. Please try again.")
                return

            question_data = response['question_data']

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

            # Send formatted question
            topic_indicator = f"📚 {question_data.get('topic_area', 'Grammar')}" if question_data.get('topic_area') else "📚 Grammar"

            message = f"""{topic_indicator} Question

{question_data['question']}

💡 Instructions: {question_data.get('instructions', 'Please provide your answer.')}

✏️ Type your answer below:"""

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

            if credits < 1:
                self.whatsapp_service.send_message(user_id, f"❌ Insufficient credits! You need 1 credit but have {credits}. Purchase more credits to continue.")
                return

            # Check and deduct credits using advanced credit service
            from services.advanced_credit_service import advanced_credit_service

            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id,
                'english_topical',  # 1 credit - use correct action key
                None
            )

            if not credit_result['success']:
                if credit_result.get('insufficient'):
                    message = f"❌ Insufficient credits. You need {credit_result['required_credits']} but have {credit_result['current_credits']}."
                else:
                    message = credit_result.get('message', '❌ Error processing credits. Please try again.')
                self.whatsapp_service.send_message(user_id, message)
                return

            # Send loading message
            self.whatsapp_service.send_message(user_id, "📚 Loading Vocabulary question from database...\n⏳ Please wait...")

            # Generate one vocabulary MCQ
            result = self.english_service.generate_vocabulary_question()

            if not result or not result.get('success'):
                self.whatsapp_service.send_message(user_id, "❌ Error generating question. Please try again.")
                return

            question_data = result['question_data']

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
            from database.external_db import get_user_stats, get_user_credits, add_xp, update_streak

            session_data = get_user_session(user_id)
            if not session_data or session_data.get('session_type') != 'english_grammar':
                self.whatsapp_service.send_message(user_id, "❌ No active grammar session found.")
                return

            # Parse question_data from JSON string
            import json
            question_data_str = session_data.get('question_data', '{}')
            question_data = json.loads(question_data_str) if question_data_str else {}
            user_name = session_data.get('user_name', 'Student')

            # Get user stats before awarding XP
            stats = get_user_stats(user_id) or {}
            current_credits = get_user_credits(user_id)
            current_xp = stats.get('xp_points', 0)
            current_level = stats.get('level', 1)
            current_streak = stats.get('streak', 0)

            # Award XP and update streak
            points_earned = 5
            add_xp(user_id, points_earned, 'english_grammar')
            update_streak(user_id)

            # Calculate new stats
            new_xp = current_xp + points_earned
            new_level = max(1, (new_xp // 100) + 1)
            new_streak = current_streak + 1

            # Format the answer response
            question_text = question_data.get('question', 'Question not available')
            instructions = question_data.get('instructions', '')
            answer_text = question_data.get('answer', 'Answer not available')
            explanation_text = question_data.get('explanation', 'Explanation not available')
            topic_area = question_data.get('topic_area', 'Grammar')

            # FIRST MESSAGE: Answer and explanation only
            answer_message = f"🎉 EXCELLENT! {user_name}! 🎉\n\n"
            answer_message += f"📚 {topic_area} Question\n\n"
            answer_message += f"Question: {question_text}\n\n"

            if instructions:
                answer_message += f"Instructions: {instructions}\n\n"

            answer_message += f"✅ Correct Answer: {answer_text}\n\n"
            answer_message += f"📖 Explanation: {explanation_text}"

            self.whatsapp_service.send_message(user_id, answer_message)

            # SECOND MESSAGE: Gamified stats and progress
            level_up_bonus = ""
            if new_level > current_level:
                level_up_bonus = f"\n🎉 *LEVEL UP!* Level {current_level} → Level {new_level}!"

            stats_message = f"""🎮 Your English Progress Dashboard 🎮

👤 {user_name}'s English Journey:
💰 Credits: {current_credits} (Used: 1 credit)
✨ XP Earned: +{points_earned} XP
⭐ Total XP: {new_xp}
🔥 Streak: {new_streak} days
🎯 Level: {new_level}

{level_up_bonus}

📚 Keep practicing to master English grammar! 🚀"""

            buttons = [
                {"text": "➡️ Next Grammar Question", "callback_data": "english_grammar_usage"},
                {"text": "📚 Try Vocabulary", "callback_data": "english_vocabulary_building"},
                {"text": "🔙 Back to Topics", "callback_data": "english_topical_questions"}
            ]

            self.whatsapp_service.send_interactive_message(user_id, stats_message, buttons)

            # Clear session
            clear_user_session(user_id)

        except Exception as e:
            logger.error(f"Error handling grammar answer for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error processing answer. Please try again.")

    def handle_vocabulary_answer(self, user_id: str, selected_option: int):
        """Handle vocabulary MCQ answer"""
        try:
            from database.session_db import get_user_session, clear_user_session
            from database.external_db import get_user_stats, get_user_credits, add_xp, update_streak

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

            # Get user stats before awarding XP
            stats = get_user_stats(user_id) or {}
            current_credits = get_user_credits(user_id)
            current_xp = stats.get('xp_points', 0)
            current_level = stats.get('level', 1)
            current_streak = stats.get('streak', 0)

            # Award XP and update streak
            points_earned = 5 if is_correct else 2  # More XP for correct answers
            add_xp(user_id, points_earned, 'english_vocabulary')
            update_streak(user_id)

            # Calculate new stats
            new_xp = current_xp + points_earned
            new_level = max(1, (new_xp // 100) + 1)
            new_streak = current_streak + 1

            # Show result
            if is_correct:
                result_emoji = "✅"
                result_text = "OUTSTANDING!"
            else:
                result_emoji = "📚"
                result_text = "Good Try!"

            # FIRST MESSAGE: Answer and explanation
            answer_message = f"{result_emoji} {result_text} {user_name}!\n\n"
            answer_message += f"📚 Question: {question_data.get('question', '')}\n\n"
            answer_message += f"🎯 Correct Answer: {options[correct_answer] if correct_answer < len(options) else 'N/A'}\n\n"
            answer_message += f"💡 Explanation: {question_data.get('explanation', 'Keep learning!')}"

            self.whatsapp_service.send_message(user_id, answer_message)

            # SECOND MESSAGE: Gamified stats and progress
            level_up_bonus = ""
            if new_level > current_level:
                level_up_bonus = f"\n🎉 *LEVEL UP!* Level {current_level} → Level {new_level}!"

            stats_message = f"""🎮 Your English Progress Dashboard 🎮

👤 {user_name}'s Vocabulary Journey:
💰 Credits: {current_credits} (Used: 1 credit)
✨ XP Earned: +{points_earned} XP
⭐ Total XP: {new_xp}
🔥 Streak: {new_streak} days
🎯 Level: {new_level}

{level_up_bonus}

📚 Keep expanding your vocabulary! 🚀"""

            buttons = [
                {"text": "➡️ Next Vocabulary Question", "callback_data": "english_vocabulary_building"},
                {"text": "📝 Try Grammar", "callback_data": "english_grammar_usage"},
                {"text": "🔙 Back to Topics", "callback_data": "english_topical_questions"}
            ]

            self.whatsapp_service.send_interactive_message(user_id, stats_message, buttons)

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

            # Check and deduct credits using advanced credit service
            from services.advanced_credit_service import advanced_credit_service

            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id,
                'english_comprehension',  # 3 credits as per config
                None
            )

            if not credit_result['success']:
                if credit_result.get('insufficient'):
                    message = f"❌ Insufficient credits. You need {credit_result['required_credits']} but have {credit_result['current_credits']}."
                else:
                    message = credit_result.get('message', '❌ Error processing credits. Please try again.')
                self.whatsapp_service.send_message(user_id, message)
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

            # Check and deduct credits using advanced credit service
            from services.advanced_credit_service import advanced_credit_service

            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id,
                'english_essay_writing',  # 3 credits as per config
                None
            )

            if not credit_result['success']:
                if credit_result.get('insufficient'):
                    message = f"❌ Insufficient credits. You need {credit_result['required_credits']} but have {credit_result['current_credits']}."
                else:
                    message = credit_result.get('message', '❌ Error processing credits. Please try again.')
                self.whatsapp_service.send_message(user_id, message)
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

                message += f"**Question {i}** ({marks} mark{'s' if marks > 1 else ''}) - {(difficulty or 'medium').title()}\n"
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