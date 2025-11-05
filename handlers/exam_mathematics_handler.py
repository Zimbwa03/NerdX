import json
import logging
import random
import re
from typing import Dict, List, Optional
from database.external_db import get_user_registration, get_user_credits
from database.session_db import save_user_session, get_user_session, clear_user_session
from services.whatsapp_service import WhatsAppService
from services.mathematics_service import MathematicsService
from services.math_question_generator import MathQuestionGenerator
from standalone_math_generator import StandaloneMathGenerator

logger = logging.getLogger(__name__)

class ExamMathematicsHandler:
    """Handler for mathematics exam functionality with database questions and AI generation"""
    
    def __init__(self, whatsapp_service: WhatsAppService, mathematics_service: MathematicsService, 
                 question_generator: MathQuestionGenerator = None):
        self.whatsapp_service = whatsapp_service
        self.mathematics_service = mathematics_service
        # Use standalone generator with DeepSeek V3.1 if no generator provided
        self.question_generator = question_generator or StandaloneMathGenerator()
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
            # Check and deduct credits for exam question
            from services.advanced_credit_service import advanced_credit_service
            
            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id, 
                'math_exam',  # 2 credits as per config
                None
            )
            
            if not credit_result['success']:
                if credit_result.get('insufficient'):
                    # Show insufficient credits message with gamified elements
                    current_credits = credit_result['current_credits']
                    required_credits = credit_result['required_credits']
                    shortage = credit_result['shortage']
                    
                    insufficient_msg = f"""💰 **Need More Credits for Exam!** 💰

🎯 **Math Exam Practice**
💳 **Credit Status:**
• Current Credits: {current_credits}
• Required Credits: {required_credits}
• Need: {shortage} more credits

🎮 **Exam Mode Benefits:**
• Past paper questions with solutions
• AI-generated practice questions  
• XP and level progression
• Streak building opportunities

💎 **Get More Credits:**"""
                    
                    buttons = [
                        {"text": "💰 Buy Credits", "callback_data": "credit_store"},
                        {"text": "👥 Invite Friends (+5 each)", "callback_data": "share_to_friend"},
                        {"text": "📚 Free Topics", "callback_data": "mathematics_mcq"},
                        {"text": "🏠 Main Menu", "callback_data": "main_menu"}
                    ]
                    
                    self.whatsapp_service.send_interactive_message(user_id, insufficient_msg, buttons)
                    return
                else:
                    self.whatsapp_service.send_message(user_id, credit_result['message'])
                    return
            
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
            
            # Determine question type: AI for questions divisible by 3 (3, 6, 9, 12...)
            should_generate_ai = (question_count % 3 == 0)
            question_type = 'ai' if should_generate_ai else 'database'
            
            logger.info(f"🎯 Question {question_count} for {user_id}: type={question_type} {'(DIVISIBLE BY 3 - AI GENERATION)' if should_generate_ai else '(DATABASE)'}")
            logger.info(f"📊 Session stats - DB questions: {db_questions}, AI questions: {ai_questions}")
            logger.info(f"🔄 Question count modulo 3: {question_count % 3} (AI trigger when = 0)")
            
            # Update session with question count first
            session_data['question_count'] = question_count
            save_user_session(user_id, session_data)
            
            if question_type == 'ai':
                # Generate AI question without database fallback to prevent double questions
                self._load_ai_question(user_id, user_name, question_count)
            else:
                self._load_database_question(user_id, user_name, question_count)
                
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
            # Send error message instead of attempting AI fallback to prevent double questions
            self.whatsapp_service.send_message(user_id, "❌ Error loading database question. Please try again.")

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
            
            # Check if AI service is available and generate question
            question_data = None
            
            if not hasattr(self.question_generator, 'api_key') or not self.question_generator.api_key:
                logger.error(f"AI API key not configured for {user_id}")
                # Use fallback AI question instead of switching to database
                question_data = self._create_fallback_ai_question(topic, difficulty)
                logger.info(f"Using fallback AI question for {user_id} - API not configured")
            else:
                # Generate question using AI with enhanced error handling
                logger.info(f"🤖 Attempting AI generation for {user_id}: {topic}/{difficulty}")
                
                try:
                    question_data = self.question_generator.generate_question('Mathematics', topic, difficulty, user_id)
                    
                    if not question_data:
                        logger.error(f"AI generation returned None for {user_id}: {topic}/{difficulty}")
                        # Instead of fallback, provide a simple AI fallback question to maintain exam flow
                        question_data = self._create_fallback_ai_question(topic, difficulty)
                        logger.info(f"Using fallback AI question for {user_id}")
                
                except Exception as ai_error:
                    logger.error(f"Exception during AI generation for {user_id}: {ai_error}")
                    # Provide a simple AI fallback question instead of switching to database
                    question_data = self._create_fallback_ai_question(topic, difficulty)
                    logger.info(f"Using emergency fallback AI question for {user_id} due to AI error")
            
            # Ensure we have a question before proceeding
            if not question_data:
                logger.error(f"No question data available for {user_id} - this should not happen")
                self.whatsapp_service.send_message(user_id, "❌ Error generating question. Please try again.")
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
            # Always send error message instead of attempting database fallback to prevent double questions
            self.whatsapp_service.send_message(user_id, "❌ AI question generation failed. Please try again.")

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
            
            # Get user stats for display
            from database.external_db import get_user_credits, get_user_stats
            
            current_credits = get_user_credits(user_id)
            user_stats = get_user_stats(user_id) or {}
            current_xp = user_stats.get('xp_points', 0)
            current_level = user_stats.get('level', 1)
            current_streak = user_stats.get('streak', 0)
            
            # Create solution message with stats
            topic_display = question_data.get('topic') or 'General Mathematics'
            year_display = question_data.get('year') or 'Practice'
            
            message = f"""💡 **Complete Solution** 💡

👤 **Student:** {user_name}
📂 **Topic:** {topic_display}
📅 **Year:** {year_display}

✅ **Answer images sent above** ⬆️

📊 **Your Current Stats:**
💰 **Credits:** {current_credits}
⭐ **XP Points:** {current_xp}
🏆 **Level:** {current_level}
🔥 **Streak:** {current_streak} days

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
            
            # Get user stats for display
            from database.external_db import get_user_credits, get_user_stats
            
            current_credits = get_user_credits(user_id)
            user_stats = get_user_stats(user_id) or {}
            current_xp = user_stats.get('xp_points', 0)
            current_level = user_stats.get('level', 1)
            current_streak = user_stats.get('streak', 0)
            
            # Clean LaTeX from solution and explanation
            solution = self._clean_latex_for_whatsapp(question_data.get('solution', ''))
            explanation = self._clean_latex_for_whatsapp(question_data.get('explanation', ''))
            answer = self._clean_latex_for_whatsapp(question_data.get('answer', ''))
            
            # Combine solution and explanation efficiently
            # If explanation is redundant or very short, merge into solution
            combined_solution = solution
            if explanation and explanation.strip() and explanation != 'Work through each step carefully.':
                # Check if explanation adds value (not just a generic message)
                if len(explanation) > 30 and explanation.lower() not in ['work through each step carefully.', 'solve step by step.']:
                    # Combine if they're different
                    if explanation not in solution:
                        combined_solution = f"{solution}\n\n💡 {explanation}"
            
            # Calculate available space for solution (target ~3000 chars total)
            # Header + stats section is approximately 400 characters
            header_stats_length = len(f"""🤖 **AI Solution** 🤖

👤 **Student:** {user_name}
📂 **Topic:** {topic}
🎯 **Difficulty:** {difficulty.title()}

✅ **Answer:** {answer}

📋 **Step-by-Step Solution:**


📊 **Your Current Stats:**
💰 **Credits:** {current_credits}
⭐ **XP Points:** {current_xp}
🏆 **Level:** {current_level}
🔥 **Streak:** {current_streak} days

🎯 **Keep practicing to master this topic!**""")
            
            max_solution_length = 3000 - header_stats_length - 50  # 50 char buffer
            
            # Truncate solution if needed
            if len(combined_solution) > max_solution_length:
                combined_solution = self._truncate_solution_text(combined_solution, max_solution_length)
            
            # Create AI solution message with stats (question removed)
            message = f"""🤖 **AI Solution** 🤖

👤 **Student:** {user_name}
📂 **Topic:** {topic}
🎯 **Difficulty:** {difficulty.title()}

✅ **Answer:** {answer}

📋 **Step-by-Step Solution:**
{combined_solution}

📊 **Your Current Stats:**
💰 **Credits:** {current_credits}
⭐ **XP Points:** {current_xp}
🏆 **Level:** {current_level}
🔥 **Streak:** {current_streak} days

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

    def _clean_latex_for_whatsapp(self, text: str) -> str:
        """Convert LaTeX math notation to WhatsApp-friendly format"""
        if not text:
            return text
        
        try:
            # Convert \binom{a}{b} to (a, b) format
            text = re.sub(r'\\binom\{([^}]+)\}\{([^}]+)\}', r'(\1, \2)', text)
            
            # Remove LaTeX math mode delimiters \( and \)
            text = re.sub(r'\\\(', '', text)
            text = re.sub(r'\\\)', '', text)
            
            # Remove dollar signs used for LaTeX math mode
            text = re.sub(r'\$([^$]+)\$', r'\1', text)
            text = re.sub(r'\$\$([^$]+)\$\$', r'\1', text)
            
            # Convert \frac{a}{b} to (a)/(b) format
            text = re.sub(r'\\frac\{([^}]+)\}\{([^}]+)\}', r'(\1)/(\2)', text)
            
            # Convert common LaTeX commands to readable format
            replacements = {
                r'\\times': '×',
                r'\\div': '÷',
                r'\\pm': '±',
                r'\\sqrt\{([^}]+)\}': r'√(\1)',
                r'\\sqrt': '√',
                r'\\pi': 'π',
                r'\\alpha': 'α',
                r'\\beta': 'β',
                r'\\theta': 'θ',
                r'\\infty': '∞',
                r'\\cdot': '·',
                r'\\leq': '≤',
                r'\\geq': '≥',
                r'\\neq': '≠',
                r'\\approx': '≈'
            }
            
            for pattern, replacement in replacements.items():
                text = re.sub(pattern, replacement, text)
            
            # Clean up any remaining LaTeX braces (only if they look like LaTeX, not regular text)
            # Match braces that are likely LaTeX (preceded by backslash or are standalone math)
            text = re.sub(r'\\\{([^}]+)\}', r'\1', text)  # Escaped braces
            text = re.sub(r'(?<!\w)\{([^}]+)\}(?!\w)', r'\1', text)  # Standalone braces (not part of words)
            
            # Remove extra whitespace
            text = re.sub(r'\s+', ' ', text)
            text = text.strip()
            
            return text
            
        except Exception as e:
            logger.error(f"Error cleaning LaTeX: {e}")
            return text
    
    def _truncate_solution_text(self, text: str, max_length: int) -> str:
        """Safely truncate solution text while preserving readability"""
        if not text or len(text) <= max_length:
            return text
        
        try:
            # Try to truncate at sentence boundaries first
            sentences = re.split(r'([.!?]\s+)', text)
            truncated = ""
            
            for i in range(0, len(sentences), 2):
                sentence = sentences[i] + (sentences[i+1] if i+1 < len(sentences) else '')
                if len(truncated + sentence) <= max_length - 10:  # Leave room for "..."
                    truncated += sentence
                else:
                    break
            
            # If we have content, add ellipsis
            if truncated and len(truncated) < len(text):
                truncated = truncated.rstrip() + "..."
            elif not truncated:
                # If no sentence boundary found, truncate at word boundary
                words = text.split()
                truncated = ""
                for word in words:
                    if len(truncated + word + " ") <= max_length - 10:
                        truncated += word + " "
                    else:
                        break
                truncated = truncated.rstrip() + "..."
            
            return truncated if truncated else text[:max_length - 3] + "..."
            
        except Exception as e:
            logger.error(f"Error truncating text: {e}")
            # Fallback: simple truncation
            return text[:max_length - 3] + "..." if len(text) > max_length else text

    def _create_fallback_ai_question(self, topic: str, difficulty: str) -> Dict:
        """Create a simple fallback AI question when generation fails"""
        import random
        
        # Simple fallback questions by topic
        fallback_questions = {
            'Algebra': [
                {
                    'question': 'Solve for x: 3x + 7 = 22',
                    'answer': 'x = 5',
                    'solution': 'Step 1: Subtract 7 from both sides\n3x + 7 - 7 = 22 - 7\n3x = 15\n\nStep 2: Divide both sides by 3\n3x ÷ 3 = 15 ÷ 3\nx = 5',
                    'points': 10
                },
                {
                    'question': 'Solve for y: 2y - 5 = 13',
                    'answer': 'y = 9',
                    'solution': 'Step 1: Add 5 to both sides\n2y - 5 + 5 = 13 + 5\n2y = 18\n\nStep 2: Divide both sides by 2\n2y ÷ 2 = 18 ÷ 2\ny = 9',
                    'points': 10
                }
            ],
            'Geometry': [
                {
                    'question': 'Find the area of a rectangle with length 8cm and width 5cm.',
                    'answer': '40 cm²',
                    'solution': 'Area of rectangle = length × width\nArea = 8cm × 5cm = 40 cm²',
                    'points': 10
                }
            ],
            'Statistics': [
                {
                    'question': 'Find the mean of: 4, 6, 8, 10, 12',
                    'answer': '8',
                    'solution': 'Mean = Sum of values ÷ Number of values\nSum = 4 + 6 + 8 + 10 + 12 = 40\nMean = 40 ÷ 5 = 8',
                    'points': 10
                }
            ]
        }
        
        # Get questions for the topic, or use Algebra as default
        topic_questions = fallback_questions.get(topic, fallback_questions['Algebra'])
        selected_question = random.choice(topic_questions)
        
        # Add metadata
        selected_question.update({
            'topic': topic,
            'difficulty': difficulty,
            'source': 'fallback_ai',
            'subject': 'Mathematics'
        })
        
        return selected_question