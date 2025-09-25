#!/usr/bin/env python3
"""
Mathematics Handler for NerdX ZIMSEC Quiz Bot
Handles all mathematics-related webhook interactions
"""

import logging
import json
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


class MathematicsHandler:
    """Handler for mathematics webhook interactions"""
    
    def __init__(self, whatsapp_service, mathematics_service, question_generator, math_solver):
        self.whatsapp_service = whatsapp_service
        self.mathematics_service = mathematics_service
        self.question_generator = question_generator
        self.math_solver = math_solver

    def handle_mathematics_main_menu(self, user_id: str):
        """Handle mathematics main menu request"""
        try:
            from database.external_db import get_user_registration
            
            # Get user info
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            # Get menu message and buttons with user stats
            message = self.mathematics_service.format_main_menu_message(user_name, user_id)
            buttons = self.mathematics_service.get_main_menu_buttons()
            
            # Send interactive message
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            logger.info(f"Sent mathematics main menu to {user_id}")
            
        except Exception as e:
            logger.error(f"Error handling mathematics main menu for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading mathematics menu. Please try again.")

    def handle_topic_selection(self, user_id: str, topic: str):
        """Handle mathematics topic selection (show difficulty menu)"""
        try:
            from database.external_db import get_user_registration, get_user_credits
            
            # Format topic name
            formatted_topic = self.mathematics_service.format_topic_name(topic)
            
            # Validate topic
            if not self.mathematics_service.is_valid_topic(formatted_topic):
                self.whatsapp_service.send_message(user_id, "❌ Invalid topic selected.")
                return
            
            # Get user info and credits
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            credits = get_user_credits(user_id)
            
            # Get difficulty menu with user stats
            message = self.mathematics_service.format_topic_difficulty_message(
                formatted_topic, user_name, credits, user_id
            )
            buttons = self.mathematics_service.get_difficulty_menu_buttons(formatted_topic)
            
            # Send interactive message
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            logger.info(f"Sent difficulty menu for {formatted_topic} to {user_id}")
            
        except Exception as e:
            logger.error(f"Error handling topic selection for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading difficulty options. Please try again.")


    def handle_question_generation(self, user_id: str, topic: str, difficulty: str):
        """Handle mathematics question generation with ULTRA-SECURE credit system"""
        try:
            from database.external_db import get_user_registration
            from database.session_db import save_user_session, get_user_session
            from services.secure_credit_system import secure_credit_system
            
            # Check if user already has an active math question session
            existing_session = get_user_session(user_id)
            if existing_session and existing_session.get('session_type') == 'math_question':
                # Send message with cancel button
                message = "⏳ You already have an active math question session. Please complete your current question first or type 'cancel' to reset."
                
                buttons = [
                    {"text": "❌ Cancel", "callback_data": f"math_cancel_session_{topic}_{difficulty}"},
                    {"text": "🏠 Main Menu", "callback_data": "main_menu"}
                ]
                
                self.whatsapp_service.send_interactive_message(user_id, message, buttons)
                return
            
            # Format topic name
            formatted_topic = self.mathematics_service.format_topic_name(topic)
            
            # Validate inputs
            if not self.mathematics_service.is_valid_difficulty(difficulty):
                self.whatsapp_service.send_message(user_id, "❌ Invalid difficulty selected.")
                return
            
            # 🔒 ULTRA-SECURE CREDIT VALIDATION (STEP 1: NO DEDUCTION YET!)
            # This BLOCKS zero-credit users completely
            validation = secure_credit_system.ultra_secure_pre_validation(user_id, 'math_topical')
            
            if not validation['success']:
                logger.warning(f"🚨 SECURE BLOCK: User {user_id} denied access to math topical - {validation.get('message')}")
                
                # Send security-formatted error message
                message, buttons = secure_credit_system.format_insufficient_credits_message(user_id, 'math_topical')
                self.whatsapp_service.send_interactive_message(user_id, message, buttons)
                return
            
            # User has sufficient credits - proceed with generation (NO DEDUCTION YET!)
            logger.info(f"✅ SECURE: User {user_id} passed validation for math topical, generating question...")
            
            # Send generating message (but NO credit deduction until delivery succeeds)
            self.whatsapp_service.send_message(
                user_id, 
                f"🧮 Generating {difficulty} Mathematics question on {formatted_topic}...\n\n"
                f"💳 Cost: {validation['required_credits']} credits (will be deducted after successful delivery)"
            )
            
            # Create a temporary session to prevent duplicate generation
            temp_session = {
                'session_type': 'math_generating',
                'subject': "Mathematics",
                'topic': formatted_topic,
                'difficulty': difficulty,
                'generating': True
            }
            save_user_session(user_id, temp_session)
            
            # Generate question using DeepSeek AI with user_id for anti-repetition
            logger.info(f"Generating math question: Mathematics/{formatted_topic}/{difficulty}")
            question_data = None
            
            try:
                # Small delay to prevent message throttling conflicts with previous messages
                import time
                time.sleep(0.5)
                
                question_data = self.question_generator.generate_question("Mathematics", formatted_topic, difficulty, user_id)
                
                if not question_data:
                    logger.warning("Question generator returned None, this should not happen with fallback system")
                    # Force generate a basic fallback question
                    question_data = {
                        'question': f"Solve for x: 2x + 5 = 13",
                        'solution': "Step 1: Subtract 5 from both sides\n2x + 5 - 5 = 13 - 5\n2x = 8\n\nStep 2: Divide both sides by 2\n2x ÷ 2 = 8 ÷ 2\nx = 4\n\nTherefore: x = 4",
                        'answer': "x = 4",
                        'points': 10,
                        'explanation': f'This is a {difficulty} level {formatted_topic} problem.',
                        'difficulty': difficulty,
                        'topic': formatted_topic,
                        'subject': "Mathematics",
                        'generated_at': datetime.now().isoformat(),
                        'source': 'emergency_fallback'
                    }
                    
            except Exception as e:
                logger.error(f"Exception during question generation: {e}")
                # Force generate a basic fallback question
                question_data = {
                    'question': f"Solve for x: x + 7 = 15",
                    'solution': "Step 1: Subtract 7 from both sides\nx + 7 - 7 = 15 - 7\nx = 8\n\nTherefore: x = 8",
                    'answer': "x = 8",
                    'points': 10,
                    'explanation': f'This is a {difficulty} level {formatted_topic} problem.',
                    'difficulty': difficulty,
                    'topic': formatted_topic,
                    'subject': "Mathematics",
                    'generated_at': datetime.now().isoformat(),
                    'source': 'emergency_fallback'
                }
            
            # Ensure we always have a valid question
            if not question_data or not question_data.get('question'):
                logger.error("Failed to generate any question, creating emergency fallback")
                question_data = {
                    'question': f"Basic Mathematics: What is 15 + 25?",
                    'solution': "Step 1: Add the numbers\n15 + 25 = 40\n\nTherefore: 40",
                    'answer': "40",
                    'points': 10,
                    'explanation': 'Basic arithmetic problem.',
                    'difficulty': difficulty,
                    'topic': formatted_topic,
                    'subject': "Mathematics",
                    'generated_at': datetime.now().isoformat(),
                    'source': 'emergency_fallback'
                }
            
            # Send question to user
            self._send_question_to_user(user_id, question_data, "Mathematics", formatted_topic, difficulty)
            
            # 🔒 SECURE: ONLY NOW DEDUCT CREDITS AFTER SUCCESSFUL DELIVERY
            deduction_result = secure_credit_system.secure_post_delivery_deduction(user_id, 'math_topical', True)
            
            if deduction_result['success'] and deduction_result['deducted']:
                logger.info(f"✅ SECURE: Credits successfully deducted after delivery - {deduction_result['message']}")
            else:
                logger.error(f"💥 SECURE: Credit deduction failed after delivery - {deduction_result.get('message')}")
            
            # Store final session with question data
            session_data = {
                'session_type': 'math_question',
                'subject': "Mathematics",
                'topic': formatted_topic,
                'difficulty': difficulty,
                'question_data': json.dumps(question_data),
                'generated_at': question_data.get('generated_at'),
                'source': question_data.get('source', 'deepseek_ai'),
                'awaiting_answer': True,
                'credits_deducted': deduction_result.get('credits_deducted', 0),
                'transaction_status': 'completed' if deduction_result['success'] else 'failed'
            }
            
            save_user_session(user_id, session_data)
            logger.info(f"Generated and sent math question to {user_id} with secure credit deduction")
            
        except Exception as e:
            logger.error(f"Error generating math question for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error generating question. Please try again.")

    def handle_math_answer(self, user_id: str, user_answer: str):
        """Handle mathematics answer submission"""
        try:
            from database.external_db import (get_user_registration, get_user_stats, update_user_stats, 
                                            add_xp, update_streak)
            from database.session_db import get_user_session, clear_user_session
            
            # Get session data
            session_data = get_user_session(user_id)
            if not session_data or session_data.get('session_type') != 'math_question':
                self.whatsapp_service.send_message(user_id, "❌ No active math session found. Please start a new question.")
                return
            
            # Parse question data
            question_data = json.loads(session_data.get('question_data', '{}'))
            topic = session_data.get('topic') or 'Unknown'
            difficulty = session_data.get('difficulty') or 'unknown'
            
            # Get user info
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            # Analyze answer using DeepSeek AI
            analysis = self.math_solver.analyze_answer(
                question_data['question'], 
                user_answer, 
                question_data['answer'],
                question_data['solution']
            )
            
            is_correct = analysis.get('is_correct', False)
            points = question_data.get('points', 10)
            
            # Update user stats
            current_stats = get_user_stats(user_id) or {}
            
            if is_correct:
                # Award XP and update streak
                add_xp(user_id, points, 'math_questions')
                update_streak(user_id)
                
                # Check for level up
                current_xp = current_stats.get('xp_points', 0)
                current_level = current_stats.get('level', 1)
                new_xp = current_xp + points
                new_level = new_xp // 100 + 1
                
                if new_level > current_level:
                    update_user_stats(user_id, {'level': new_level})
            else:
                # Update streak for incorrect answer
                update_streak(user_id)
            
            # Update attempts and correct answers
            update_user_stats(user_id, {
                'total_attempts': current_stats.get('total_attempts', 0) + 1,
                'correct_answers': current_stats.get('correct_answers', 0) + (1 if is_correct else 0)
            })
            
            # Send result message
            self._send_result_message(user_id, user_name, analysis, question_data, topic, difficulty)
            
            # Clear session
            clear_user_session(user_id)
            
        except Exception as e:
            logger.error(f"Error handling math answer for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error processing your answer. Please try again.")

    def _send_question_to_user(self, user_id: str, question_data: Dict, subject: str, topic: str, difficulty: str):
        """Send formatted question to user with consistent stats display"""
        try:
            from database.external_db import get_user_stats, get_user_credits, get_user_registration
            
            # Get user info and stats for consistent display
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            stats = get_user_stats(user_id) or {}
            credits = get_user_credits(user_id)
            
            # Format question message with consistent stats
            difficulty_emoji = {"easy": "🟢", "medium": "🟡", "difficult": "🔴"}
            emoji = difficulty_emoji.get(difficulty, "📝")
            
            message = f"""🧮 *Mathematics Question*

👤 *Student:* {user_name}
📝 *Topic:* {topic}
{emoji} *Difficulty:* {difficulty.title()}
💎 *Points:* {question_data.get('points', 10)} XP

📊 *Your Current Stats:*
💳 *Credits:* {credits}
⭐ *Level:* {stats.get('level', 1)} (XP: {stats.get('xp_points', 0)})
🔥 *Streak:* {stats.get('streak', 0)} days

❓ *Question:*
{question_data['question']}

💭 *Type your answer below (numbers, expressions, or equations)*

🎯 *Authentic ZIMSEC-style problem with step-by-step solution!*"""

            # Create answer buttons for common responses
            buttons = [
                {"text": "💡 Show Solution", "callback_data": f"math_show_solution_{topic.lower().replace(' ', '_')}"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            # Send question
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
            logger.info(f"Sent math question to {user_id}: {topic}/{difficulty}")
            
        except Exception as e:
            logger.error(f"Error sending question to {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error displaying question.")

    def _send_result_message(self, user_id: str, user_name: str, analysis: Dict, question_data: Dict, 
                           topic: str, difficulty: str):
        """Send result in two separate messages: answer first, then stats with buttons"""
        try:
            from database.external_db import get_user_stats, get_user_credits
            import time
            
            is_correct = analysis.get('is_correct', False)
            points = question_data.get('points', 10)
            
            # Get updated stats with proper credit retrieval
            updated_stats = get_user_stats(user_id) or {}
            final_credits = get_user_credits(user_id)  # Use dedicated credit function
            final_xp = updated_stats.get('xp_points', 0)
            final_streak = updated_stats.get('streak', 0)
            final_level = updated_stats.get('level', 1)
            
            # FIRST MESSAGE: Answer and explanation ONLY (no stats)
            if is_correct:
                answer_message = f"🎉 *OUTSTANDING!* {user_name}! 🎉\n\n"
                answer_message += f"✅ *Correct Answer:* {question_data['answer']}\n"
                answer_message += f"🎯 *Difficulty:* {difficulty.title()}\n"
                answer_message += f"📚 *Topic:* {topic}\n\n"
                
                # Special achievement messages
                if final_streak >= 10:
                    answer_message += f"🏆 *STREAK MASTER!* You're on fire!\n"
                elif final_streak >= 5:
                    answer_message += f"⚡ *HOT STREAK!* Keep it going!\n"
                elif final_streak >= 3:
                    answer_message += f"🌟 *BUILDING MOMENTUM!* Great job!\n"
                answer_message += "\n"
            else:
                answer_message = f"📚 *Keep Learning,* {user_name}! 📚\n\n"
                answer_message += f"🎯 *Correct Answer:* {question_data['answer']}\n"
                answer_message += f"🎯 *Difficulty:* {difficulty.title()}\n"
                answer_message += f"📚 *Topic:* {topic}\n\n"
                answer_message += f"💡 *Don't worry!* Every mistake is a learning opportunity!\n\n"
            
            # Add analysis if available to answer message
            if analysis.get('detailed_analysis'):
                answer_message += f"🔍 *Analysis:*\n{analysis.get('feedback', '')}\n\n"
                
                if analysis.get('improvement_tips'):
                    answer_message += f"💡 *Tips:* {analysis.get('improvement_tips')}\n\n"
            
            # Add complete solution to answer message
            answer_message += f"📝 *Complete Solution:*\n{question_data['solution']}\n\n"
            
            # Add explanation to answer message
            if question_data.get('explanation'):
                explanation = question_data['explanation']
                answer_message += f"💡 *Explanation:*\n{explanation}"
            
            # Send FIRST message (answer and solution only)
            self.whatsapp_service.send_message(user_id, answer_message)
            
            # Wait to ensure answer message loads first and avoid throttling
            time.sleep(2)
            
            # SECOND MESSAGE: User stats and navigation buttons
            stats_message = f"📊 *{user_name}'s Progress Dashboard:*\n"
            stats_message += f"💳 *Credits:* {final_credits}\n"
            stats_message += f"⭐ *Level:* {final_level} (XP: {final_xp})\n"
            stats_message += f"🔥 *Streak:* {final_streak} days\n"
            
            if is_correct:
                stats_message += f"✨ *Points Earned:* +{points} XP\n"
                # Check for level up
                current_level = analysis.get('previous_level', final_level)
                if final_level > current_level:
                    stats_message += f"🎊 *LEVEL UP!* Welcome to Level {final_level}!\n"
            
            stats_message += f"\n🚀 *Ready for your next challenge?*"
            
            # Create enhanced navigation buttons with gamification
            topic_encoded = (topic or '').lower().replace(' ', '_')
            
            buttons = [
                {"text": f"➡️ Next Question (+{points} XP)", "callback_data": f"math_question_{topic_encoded}_{difficulty}"},
                {"text": "📊 My Stats", "callback_data": "user_stats"},
                {"text": "📚 Change Topic", "callback_data": "mathematics_mcq"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            # Send SECOND message with stats and buttons
            self.whatsapp_service.send_interactive_message(user_id, stats_message, buttons)
            
        except Exception as e:
            logger.error(f"Error sending result message to {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "✅ Answer processed successfully!")

    def handle_show_solution(self, user_id: str):
        """Handle show solution request for current question"""
        try:
            from database.session_db import get_user_session, clear_user_session
            
            # Get current session
            session_data = get_user_session(user_id)
            if not session_data or session_data.get('session_type') != 'math_question':
                self.whatsapp_service.send_message(user_id, "❌ No active question found.")
                return
            
            # Get question data
            question_data = json.loads(session_data.get('question_data', '{}'))
            topic = session_data.get('topic')
            difficulty = session_data.get('difficulty')
            
            # Create solution message
            message = f"✅ Answer:\n\n"
            message += f"{question_data.get('answer', '')}\n\n"
            message += f"Ready for another challenge?"
            
            # Create navigation buttons
            topic_encoded = (topic or '').lower().replace(' ', '_')
            buttons = [
                {"text": "➡️ Next Question", "callback_data": f"math_question_{topic_encoded}_{difficulty}"},
                {"text": "📚 Change Topic", "callback_data": "mathematics_mcq"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            # Send solution message
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
            # Clear session since solution was shown
            clear_user_session(user_id)
            
        except Exception as e:
            logger.error(f"Error handling show solution request for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error showing solution. Please try again.")

    def handle_hint_request(self, user_id: str):
        """Handle hint request for current question"""
        try:
            from database.session_db import get_user_session
            
            # Get current session
            session_data = get_user_session(user_id)
            if not session_data or session_data.get('session_type') != 'math_question':
                self.whatsapp_service.send_message(user_id, "❌ No active question found.")
                return
            
            # Get question data
            question_data = json.loads(session_data.get('question_data', '{}'))
            difficulty = session_data.get('difficulty')
            topic = session_data.get('topic')
            
            # Get hint from AI
            hint = self.math_solver.get_hint(question_data['question'], difficulty)
            
            hint_message = f"💡 Hint\n\n"
            if hint:
                hint_message += hint
            else:
                hint_message += "Break the problem into smaller steps. Identify what you know and what you need to find first!"
            
            # Add Show Solution button to hint message
            buttons = [
                {"text": "💡 Show Solution", "callback_data": f"math_show_solution_{(topic or '').lower().replace(' ', '_')}"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, hint_message, buttons)
                
        except Exception as e:
            logger.error(f"Error handling hint request for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "💡 Take your time and work through each step carefully!")

    def handle_cancel_session(self, user_id: str, topic: str, difficulty: str):
        """Handle session cancellation and offer to continue with new question"""
        try:
            from database.session_db import clear_user_session
            
            # Clear the session
            clear_user_session(user_id)
            
            # Format topic name
            formatted_topic = self.mathematics_service.format_topic_name(topic)
            
            # Send confirmation message with continue option
            message = "✅ Session cancelled. You can now start a new question."
            
            buttons = [
                {"text": "▶️ Continue", "callback_data": f"math_question_{topic}_{difficulty}"},
                {"text": "📚 Change Topic", "callback_data": "mathematics_mcq"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            
            logger.info(f"Cancelled math session for {user_id}")
            
        except Exception as e:
            logger.error(f"Error handling session cancellation for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "✅ Session cancelled. You can now start a new question.")

    