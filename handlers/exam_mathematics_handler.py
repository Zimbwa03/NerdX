import json
import logging
import random
from typing import Dict, List, Optional
from database.external_db import get_user_registration, get_user_credits
from database.session_db import save_user_session, get_user_session, clear_user_session
from services.whatsapp_service import WhatsAppService
from services.mathematics_service import MathematicsService
from services.math_question_generator import MathQuestionGenerator

logger = logging.getLogger(__name__)

class ExamMathematicsHandler:
    """Handler for mathematics exam functionality with database questions and AI generation"""
    
    def __init__(self, whatsapp_service: WhatsAppService, mathematics_service: MathematicsService, 
                 question_generator: MathQuestionGenerator):
        self.whatsapp_service = whatsapp_service
        self.mathematics_service = mathematics_service
        self.question_generator = question_generator
        self.question_counter_key = "exam_question_count"
        
    def handle_exam_start(self, user_id: str):
        """Start the mathematics exam mode"""
        try:
            # Get user info
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            # Clear any existing exam session
            clear_user_session(user_id)
            
            # Initialize exam session with proper tracking
            exam_session = {
                'session_type': 'math_exam',
                'question_count': 0,
                'database_questions_used': 0,
                'ai_questions_used': 0,
                'current_question_type': None,
                'started_at': str(json.dumps({})),  # Will be replaced with timestamp
                'force_next_ai': False  # Flag to force AI generation
            }
            
            save_user_session(user_id, exam_session)
            
            # Send exam welcome message
            message = f"""📚 ZIMSEC Mathematics Exam Practice

👋 Welcome {user_name}!

🎯 Exam Mode Features:
• Real past paper questions with images
• AI-generated practice questions
• Step-by-step solutions 
• Authentic exam atmosphere
• Unlimited practice

⚡ Ready to begin your mathematics exam practice?

💡 Study tip: Take your time and work through each problem systematically, just like in a real exam."""

            buttons = [
                {"text": "📝 Start Exam Practice", "callback_data": "exam_math_next_question"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            logger.info(f"Started exam mode for {user_id}")
            
        except Exception as e:
            logger.error(f"Error starting exam mode for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error starting exam mode. Please try again.")

    def handle_next_question(self, user_id: str):
        """Load the next question based on 2:1 ratio (2 database : 1 AI)"""
        try:
            # Get user info
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            # Get exam session
            session_data = get_user_session(user_id)
            if not session_data or session_data.get('session_type') != 'math_exam':
                # Start new exam session if none exists
                self.handle_exam_start(user_id)
                return
            
            # Update question count
            question_count = session_data.get('question_count', 0) + 1
            db_questions = session_data.get('database_questions_used', 0)
            ai_questions = session_data.get('ai_questions_used', 0)
            
            # Improved 2:1 ratio logic
            # Force AI generation every 3rd, 6th, 9th, 12th, etc. question
            should_generate_ai = (question_count % 3 == 0)
            
            # Also force AI if we have too many database questions compared to AI
            total_questions = db_questions + ai_questions
            if total_questions > 0:
                ai_ratio = ai_questions / total_questions
                # If AI ratio is below 0.25 (should be ~0.33 for 2:1), force AI
                if ai_ratio < 0.25 and question_count > 3:
                    should_generate_ai = True
            
            question_type = 'ai' if should_generate_ai else 'database'
            
            logger.info(f"Question {question_count} for {user_id}: type={question_type}, db_used={db_questions}, ai_used={ai_questions}, should_ai={should_generate_ai}")
            
            if question_type == 'database':
                self._load_database_question(user_id, user_name, question_count)
            else:
                self._load_ai_question(user_id, user_name, question_count)
                
        except Exception as e:
            logger.error(f"Error loading next exam question for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading question. Please try again.")

    def _load_database_question(self, user_id: str, user_name: str, question_count: int):
        """Load a question from the olevel_math_questions database"""
        try:
            
            # Get a random question from database using make_supabase_request
            from database.external_db import make_supabase_request
            
            # Get random subset of questions for better performance
            result = make_supabase_request("GET", "olevel_math_questions", limit=50)
            
            if not result or len(result) == 0:
                # Fallback to AI question if no database questions
                logger.warning("No database questions found, falling back to AI generation")
                self._load_ai_question(user_id, user_name, question_count)
                return
            
            # Select random question from results
            question_data = random.choice(result)
            
            # Format exam question message
            topic_display = question_data.get('topic') or 'General Mathematics'
            year_display = question_data.get('year') or 'Practice'
            
            message = f"""📚 ZIMSEC Mathematics Exam

👤 Student: {user_name}
📝 Question {question_count}
📂 Topic: {topic_display}
📅 Year: {year_display}

📷 Question image sent above ⬆️

🎯 Study the question carefully and work through it step by step!"""

            # Create exam-style buttons
            buttons = [
                {"text": "💡 Show Answer", "callback_data": f"exam_show_solution_{question_data['id']}"},
                {"text": "➡️ Next Question", "callback_data": "exam_math_next_question"},
                {"text": "📚 Mathematics Hub", "callback_data": "mathematics_mcq"}
            ]
            
            # Send question image first (this is the main content)
            if question_data.get('question_image_url'):
                self.whatsapp_service.send_image(
                    user_id, 
                    question_data['question_image_url'], 
                    f"📝 ZIMSEC Exam Question {question_count}"
                )
                
                # Wait to ensure image loads and appears first in chat
                import time
                time.sleep(2)
            
            # Send interactive message with buttons
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
            # Update session
            session_data = get_user_session(user_id)
            session_data.update({
                'question_count': question_count,
                'database_questions_used': session_data.get('database_questions_used', 0) + 1,
                'current_question_type': 'database',
                'current_question_id': question_data['id'],
                'current_question_data': json.dumps(question_data)
            })
            save_user_session(user_id, session_data)
            
            logger.info(f"Loaded database question {question_data['id']} for {user_id}")
            
        except Exception as e:
            logger.error(f"Error loading database question for {user_id}: {e}")
            # Fallback to AI question
            self._load_ai_question(user_id, user_name, question_count)

    def _load_ai_question(self, user_id: str, user_name: str, question_count: int):
        """Generate an AI question from any random topic"""
        try:
            # Select random topic and difficulty
            topics = self.mathematics_service.mathematics_topics
            difficulties = ['easy', 'medium', 'difficult']
            
            topic = random.choice(topics)
            difficulty = random.choice(difficulties)
            
            # Send generating message
            generating_message = f"""🤖 **Generating AI Question** 🤖

👤 **Student:** {user_name}
📝 **Question {question_count}** (AI Generated)
📂 **Topic:** {topic}
🎯 **Difficulty:** {difficulty.title()}

⏳ Creating authentic ZIMSEC-style question...
🧠 Using AI to ensure exam-level complexity"""

            self.whatsapp_service.send_message(user_id, generating_message)
            
            # Check if AI service is available
            if not hasattr(self.question_generator, 'api_key') or not self.question_generator.api_key:
                logger.error(f"AI API key not configured for {user_id}")
                self.whatsapp_service.send_message(user_id, "⚠️ AI service not configured. Loading database question...")
                self._load_database_question(user_id, user_name, question_count)
                return
            
            # Generate question using AI with longer timeout
            logger.info(f"🤖 Attempting AI generation for {user_id}: {topic}/{difficulty}")
            question_data = self.question_generator.generate_question('Mathematics', topic, difficulty)
            
            if not question_data:
                logger.error(f"AI generation failed for {user_id}: {topic}/{difficulty} - Using fallback")
                self.whatsapp_service.send_message(user_id, "⚠️ AI generation taking longer than expected. Loading database question...")
                # Don't increment AI counter on failure, try database instead
                self._load_database_question(user_id, user_name, question_count)
                return
            
            logger.info(f"✅ Successfully generated AI question for {user_id}: {topic}/{difficulty}")
            
            # Format AI question message with clear AI indicator
            message = f"""🤖 **AI-Generated Exam Question** 🤖

👤 Student: {user_name}
📝 Question {question_count} (AI Generated)
📂 Topic: {topic}
🎯 Difficulty: {difficulty.title()}
💎 Points: {question_data.get('points', 10)}

❓ **Question:**
{question_data['question']}

📝 **Instructions:** Solve this step-by-step as you would in an exam.

🧠 *This question was generated using AI to provide unlimited practice.*"""

            # Create exam-style buttons
            buttons = [
                {"text": "💡 Show Solution", "callback_data": "exam_ai_solution"},
                {"text": "➡️ Next Question", "callback_data": "exam_math_next_question"},
                {"text": "📚 Main Menu", "callback_data": "main_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
            # Update session - CRITICAL: Increment AI counter ONLY on success
            session_data = get_user_session(user_id)
            if not session_data:
                logger.error(f"No session found for {user_id} when saving AI question")
                session_data = {'session_type': 'math_exam', 'database_questions_used': 0, 'ai_questions_used': 0}
            
            # Increment AI questions counter
            new_ai_count = session_data.get('ai_questions_used', 0) + 1
            
            session_data.update({
                'question_count': question_count,
                'ai_questions_used': new_ai_count,
                'current_question_type': 'ai',
                'current_ai_topic': topic,
                'current_ai_difficulty': difficulty,
                'current_ai_question_data': json.dumps(question_data)
            })
            save_user_session(user_id, session_data)
            
            logger.info(f"✅ AI question session updated for {user_id}: Q{question_count}, DB={session_data.get('database_questions_used', 0)}, AI={new_ai_count}")
            
        except Exception as e:
            logger.error(f"Exception in AI question generation for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ AI service temporarily unavailable. Loading database question...")
            # Fallback to database question without incrementing AI counter
            self._load_database_question(user_id, user_name, question_count)

    def handle_show_database_solution(self, user_id: str, question_id: str):
        """Show solution for database question with images"""
        try:
            from database.external_db import make_supabase_request
            
            # Get question data
            result = make_supabase_request("GET", "olevel_math_questions", filters={"id": f"eq.{question_id}"})
            
            if not result or len(result) == 0:
                self.whatsapp_service.send_message(user_id, "❌ Solution not found.")
                return
            
            question_data = result[0]
            
            # Get user name
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            # Create solution message
            topic_display = question_data.get('topic') or 'General Mathematics'
            year_display = question_data.get('year') or 'Practice'
            
            message = f"""💡 **Complete Solution** 💡

👤 **Student:** {user_name}
📂 **Topic:** {topic_display}
📅 **Year:** {year_display}

✅ **Answer images sent above** ⬆️

📚 **Study the solution carefully - Ready for the next challenge?**"""

            # Send solution images in order
            if question_data.get('answer_image_url1'):
                self.whatsapp_service.send_image(
                    user_id, 
                    question_data['answer_image_url1'], 
                    "✅ Complete Solution"
                )
            
            if question_data.get('answer_image_url2'):
                self.whatsapp_service.send_image(
                    user_id, 
                    question_data['answer_image_url2'], 
                    "✅ Solution Part 2"
                )
                
            if question_data.get('answer_image_url3'):
                self.whatsapp_service.send_image(
                    user_id, 
                    question_data['answer_image_url3'], 
                    "✅ Solution Part 3"
                )
            
            # Wait to ensure images load and appear first in chat
            import time
            time.sleep(2)
            
            # Create navigation buttons
            buttons = [
                {"text": "➡️ Next Question", "callback_data": "exam_math_next_question"},
                {"text": "📚 Topics Menu", "callback_data": "mathematics_mcq"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
            logger.info(f"Showed database solution for question {question_id} to {user_id}")
            
        except Exception as e:
            logger.error(f"Error showing database solution for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading solution. Please try again.")

    def handle_show_ai_solution(self, user_id: str):
        """Show solution for AI-generated question"""
        try:
            # Get session data
            session_data = get_user_session(user_id)
            if not session_data or session_data.get('session_type') != 'math_exam' or session_data.get('current_question_type') != 'ai':
                logger.warning(f"No AI question session found for {user_id}: session_type={session_data.get('session_type') if session_data else None}, question_type={session_data.get('current_question_type') if session_data else None}")
                self.whatsapp_service.send_message(user_id, "❌ No active AI question found. Please generate a new question.")
                return
            
            # Get AI question data
            question_data = json.loads(session_data.get('current_ai_question_data', '{}'))
            topic = session_data.get('current_ai_topic', 'General')
            difficulty = session_data.get('current_ai_difficulty', 'medium')
            
            # Get user name
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            # Create AI solution message
            message = f"""🤖 **AI Solution** 🤖

👤 **Student:** {user_name}
📂 **Topic:** {topic}
🎯 **Difficulty:** {difficulty.title()}

📝 **Question:**
{question_data.get('question', '')}

✅ **Answer:** {question_data.get('answer', '')}

📋 **Step-by-Step Solution:**
{question_data.get('solution', '')}

💡 **Explanation:**
{question_data.get('explanation', 'Work through each step carefully.')}

🎯 **Keep practicing to master this topic!**"""

            # Create navigation buttons
            buttons = [
                {"text": "➡️ Next Question", "callback_data": "exam_math_next_question"},
                {"text": "📚 Topics Menu", "callback_data": "mathematics_mcq"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
            logger.info(f"Showed AI solution to {user_id}")
            
        except Exception as e:
            logger.error(f"Error showing AI solution for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading solution. Please try again.")