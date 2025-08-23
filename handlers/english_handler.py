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
        """Handle comprehension practice module"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            credits = get_user_credits(user_id)
            
            module_info = self.english_modules["comprehension"]
            
            if credits < module_info["credit_cost"]:
                self._send_insufficient_credits_message(user_id, user_name, credits, module_info["credit_cost"])
                return
            
            message = f"""📖 ZIMSEC Comprehension Practice

👤 Student: {user_name}
💰 Cost: {module_info["credit_cost"]} credits

🌍 Choose your theme:
(All passages feature Zimbabwean cultural context)"""

            buttons = []
            for theme in module_info["themes"]:
                buttons.append({
                    "text": theme,
                    "callback_data": f"english_comprehension_{theme.replace(' ', '_').lower()}"
                })
            
            buttons.append({"text": "🔙 Back to English", "callback_data": "english_menu"})
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error(f"Error in comprehension practice for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading comprehension themes. Please try again.")

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
            session_data = {
                'session_type': 'english_grammar',
                'question_data': question_data,
                'awaiting_answer': True,
                'user_name': user_name
            }
            
            if not save_user_session(user_id, session_data):
                self.whatsapp_service.send_message(user_id, "❌ Error saving question session. Please try again.")
                return
            
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
            session_data = {
                'session_type': 'english_vocabulary',
                'question_data': question_data,
                'user_name': user_name
            }
            
            if not save_user_session(user_id, session_data):
                self.whatsapp_service.send_message(user_id, "❌ Error saving question session. Please try again.")
                return
            
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
            
            question_data = session_data.get('question_data', {})
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
            
            question_data = session_data.get('question_data', {})
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
            
            if not save_user_session(user_id, session_data):
                self.whatsapp_service.send_message(user_id, "❌ Error saving essay session. Please try again.")
                return

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