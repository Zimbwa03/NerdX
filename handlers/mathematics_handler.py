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
            
            # Get menu message and buttons
            message = self.mathematics_service.format_main_menu_message(user_name)
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
            
            # Get difficulty menu
            message = self.mathematics_service.format_topic_difficulty_message(
                formatted_topic, user_name, credits
            )
            buttons = self.mathematics_service.get_difficulty_menu_buttons(formatted_topic)
            
            # Send interactive message
            self.whatsapp_service.send_interactive_message(user_id, message, buttons)
            logger.info(f"Sent difficulty menu for {formatted_topic} to {user_id}")
            
        except Exception as e:
            logger.error(f"Error handling topic selection for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading difficulty options. Please try again.")


    def handle_question_generation(self, user_id: str, topic: str, difficulty: str):
        """Handle mathematics question generation"""
        try:
            from database.external_db import get_user_registration, get_user_credits, deduct_credits
            from database.session_db import save_user_session, get_user_session
            
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
            
            # Check credits
            user_credits = get_user_credits(user_id)
            has_credits, credit_error = self.mathematics_service.check_sufficient_credits(user_credits, difficulty)
            
            if not has_credits:
                self.whatsapp_service.send_message(user_id, credit_error)
                return
            
            # Deduct credits using advanced credit service
            from services.advanced_credit_service import advanced_credit_service
            
            credit_result = advanced_credit_service.check_and_deduct_credits(
                user_id, 
                'math_topical',  # Use standardized action name
                difficulty
            )
            
            if not credit_result['success']:
                # Send credit error message with helpful info
                if credit_result.get('insufficient'):
                    message = f"❌ Insufficient credits. You need {credit_result['required_credits']} but have {credit_result['current_credits']}.\n\n💰 *Get More Credits:*\n• Daily bonus: 5 credits\n• Referral bonus: 10 credits\n• Share NerdX with friends!"
                else:
                    message = credit_result.get('message', '❌ Error processing credits. Please try again.')
                self.whatsapp_service.send_message(user_id, message)
                return
            
            # Send generating message with correct credit amount
            self.whatsapp_service.send_message(
                user_id, 
                f"🧮 Generating {difficulty} Mathematics question on {formatted_topic}...\n\n"
                f"💳 Credits deducted: {credit_result['deducted']}"
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
            
            # Generate question using DeepSeek AI
            logger.info(f"Generating math question: Mathematics/{formatted_topic}/{difficulty}")
            try:
                question_data = self.question_generator.generate_question("Mathematics", formatted_topic, difficulty)
                
                if not question_data:
                    logger.error("Question generator returned None, using fallback")
                    # Clear generating session
                    from database.session_db import clear_user_session
                    clear_user_session(user_id)
                    
                    # Send error message and return early to prevent loops
                    self.whatsapp_service.send_message(
                        user_id, 
                        "❌ Unable to generate question at this time. Our AI service is experiencing delays. Please try again in a few minutes.\n\n💳 Your credits have been refunded."
                    )
                    # Refund credits
                    from database.external_db import add_credits
                    add_credits(user_id, credit_cost, 'refund', f'Refund for failed {difficulty} Mathematics question')
                    return
                    
            except Exception as e:
                logger.error(f"Exception during question generation: {e}")
                # Clear generating session
                from database.session_db import clear_user_session
                clear_user_session(user_id)
                
                self.whatsapp_service.send_message(
                    user_id, 
                    "❌ Service temporarily unavailable. Please try again in a few minutes.\n\n💳 Your credits have been refunded."
                )
                # Refund credits
                from database.external_db import add_credits
                add_credits(user_id, credit_cost, 'refund', f'Refund for failed {difficulty} Mathematics question')
                return
            
            # Send question to user
            self._send_question_to_user(user_id, question_data, "Mathematics", formatted_topic, difficulty)
            
            # Store final session with question data
            session_data = {
                'session_type': 'math_question',
                'subject': "Mathematics",
                'topic': formatted_topic,
                'difficulty': difficulty,
                'question_data': json.dumps(question_data),
                'generated_at': question_data.get('generated_at'),
                'source': question_data.get('source', 'deepseek_ai'),
                'awaiting_answer': True
            }
            
            save_user_session(user_id, session_data)
            logger.info(f"Generated and sent math question to {user_id}")
            
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
        """Send formatted question to user"""
        try:
            # Format question message
            difficulty_emoji = {"easy": "🟢", "medium": "🟡", "difficult": "🔴"}
            emoji = difficulty_emoji.get(difficulty, "📝")
            
            message = f"""🧮 Mathematics Question

📝 Topic: {topic}
{emoji} Difficulty: {difficulty.title()}
💎 Points: {question_data.get('points', 10)}

❓ Question:
{question_data['question']}

💭 Type your answer below (numbers, expressions, or equations)

🎯 Authentic ZIMSEC-style problem with step-by-step solution!"""

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
        """Send detailed result message with AI analysis - split into answer and stats messages"""
        try:
            from database.external_db import get_user_stats
            
            is_correct = analysis.get('is_correct', False)
            points = question_data.get('points', 10)
            
            # Get updated stats
            updated_stats = get_user_stats(user_id) or {}
            final_credits = updated_stats.get('credits', 0)
            final_xp = updated_stats.get('xp_points', 0)
            final_streak = updated_stats.get('streak', 0)
            final_level = updated_stats.get('level', 1)
            
            # FIRST MESSAGE: Answer and explanation (no stats)
            if is_correct:
                answer_message = f"🎉 **OUTSTANDING!** {user_name}! 🎉\n\n"
                answer_message += f"✅ **Correct Answer:** {question_data['answer']}\n"
                answer_message += f"🎯 **Difficulty:** {difficulty.title()}\n"
                answer_message += f"📚 **Topic:** {topic}\n\n"
                
                # Special achievement messages
                if final_streak >= 10:
                    answer_message += f"🏆 **STREAK MASTER!** You're on fire!\n"
                elif final_streak >= 5:
                    answer_message += f"⚡ **HOT STREAK!** Keep it going!\n"
                elif final_streak >= 3:
                    answer_message += f"🌟 **BUILDING MOMENTUM!** Great job!\n"
                answer_message += "\n"
            else:
                answer_message = f"📚 **Keep Learning,** {user_name}! 📚\n\n"
                answer_message += f"🎯 **Correct Answer:** {question_data['answer']}\n"
                answer_message += f"🎯 **Difficulty:** {difficulty.title()}\n"
                answer_message += f"📚 **Topic:** {topic}\n\n"
                answer_message += f"💡 **Don't worry!** Every mistake is a learning opportunity!\n\n"
            
            # Add analysis if available to answer message
            if analysis.get('detailed_analysis'):
                answer_message += f"🔍 Analysis:\n{analysis.get('feedback', '')}\n\n"
                
                if analysis.get('improvement_tips'):
                    answer_message += f"💡 Tips: {analysis.get('improvement_tips')}\n\n"
            
            # Add complete solution to answer message
            answer_message += f"📝 Complete Solution:\n{question_data['solution']}\n\n"
            
            # Add explanation to answer message
            if question_data.get('explanation'):
                explanation = question_data['explanation']
                answer_message += f"💡 Explanation:\n{explanation}\n\n"
            
            # Send the first message with answer and explanation
            self.whatsapp_service.send_message(user_id, answer_message)
            
            # SECOND MESSAGE: User stats and progress (separate message)
            stats_message = f"🎮 **Your Progress Dashboard** 🎮\n"
            stats_message += f"━━━━━━━━━━━━━━━━━━━━\n"
            stats_message += f"💰 **Credits:** {final_credits}\n"
            stats_message += f"⚡ **Total XP:** {final_xp}\n"
            stats_message += f"🔥 **Current Streak:** {final_streak}\n"
            stats_message += f"🏆 **Level:** {final_level}\n"
            
            # Add level progress bar to stats message
            xp_for_next_level = (final_level * 100) - final_xp
            if xp_for_next_level > 0:
                stats_message += f"📈 **Next Level:** {xp_for_next_level} XP away!\n"
            else:
                stats_message += f"🌟 **Level Master!** Keep climbing!\n"
                
            stats_message += f"━━━━━━━━━━━━━━━━━━━━\n\n"
            
            # Add encouragement to stats message
            if analysis.get('encouragement'):
                stats_message += f"🌟 {analysis.get('encouragement')}\n\n"
            
            # Create enhanced navigation buttons with gamification
            topic_encoded = (topic or '').lower().replace(' ', '_')
            
            buttons = [
                {"text": f"➡️ Next Question (+{points} XP)", "callback_data": f"math_question_{topic_encoded}_{difficulty}"},
                {"text": "📊 My Stats", "callback_data": "user_stats"},
                {"text": "📚 Change Topic", "callback_data": "mathematics_mcq"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]
            
            # Send stats message with navigation buttons
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
            message = f"💡 Complete Solution\n\n"
            message += f"📝 Question: {question_data['question']}\n\n"
            message += f"✅ Answer: {question_data['answer']}\n\n"
            message += f"📋 Step-by-Step Solution:\n{question_data['solution']}\n\n"
            
            if question_data.get('explanation'):
                explanation = question_data['explanation']
                # Shorten explanation to maximum 200 characters
                if len(explanation) > 200:
                    explanation = explanation[:200] + "... (Key concept only)"
                message += f"💭 Explanation: {explanation}\n\n"
            
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

    