import os
import json
import logging
import random
from typing import Dict, List, Optional
from database.external_db import get_user_registration, get_user_credits, deduct_credits
from database.session_db import save_user_session, get_user_session, clear_user_session
from services.whatsapp_service import WhatsAppService
from services.graph_service import GraphService
from services.math_question_generator import MathQuestionGenerator

logger = logging.getLogger(__name__)

class GraphPracticeHandler:
    """Comprehensive Graph Practice Handler for ZIMSEC O-Level Students"""

    def __init__(self, whatsapp_service: WhatsAppService, graph_service: GraphService, question_generator: MathQuestionGenerator):
        self.whatsapp_service = whatsapp_service
        self.graph_service = graph_service
        self.question_generator = question_generator

        # Graph learning modules for ZIMSEC O-Level
        self.graph_modules = {
            "linear_functions": {
                "title": "📈 Linear Functions & Straight Lines",
                "description": "Master y = mx + c and straight line graphs",
                "examples": ["y = 2x + 3", "y = -x + 4", "y = 0.5x - 2"],
                "difficulty": "easy"
            },
            "quadratic_functions": {
                "title": "📊 Quadratic Functions & Parabolas",
                "description": "Explore y = ax² + bx + c and parabolic curves",
                "examples": ["y = x^2", "y = -2x^2 + 4x - 1", "y = 0.5x^2 - 3x + 2"],
                "difficulty": "medium"
            },
            "trigonometric_functions": {
                "title": "🌊 Trigonometric Functions",
                "description": "Learn sin, cos, tan graphs and their transformations",
                "examples": ["y = sin(x)", "y = 2cos(x)", "y = tan(x/2)"],
                "difficulty": "medium"
            },
            "linear_programming": {
                "title": "⭐ Linear Programming",
                "description": "Constraint graphs, feasible regions, optimization",
                "examples": ["2x + 3y ≤ 12", "x + y ≤ 8", "x ≥ 0, y ≥ 0"],
                "difficulty": "hard"
            }
        }

        logger.info("Graph Practice Handler initialized for ZIMSEC O-Level")

    def is_awaiting_expression_input(self, user_id: str) -> bool:
        """Check if user session is awaiting expression input"""
        try:
            session_data = get_user_session(user_id)
            return session_data and session_data.get('awaiting_expression', False)
        except:
            return False

    def handle_graph_practice_start(self, user_id: str):
        """Start graph practice session with comprehensive learning menu"""
        try:
            # Get user info
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            # Check user credits
            credits = get_user_credits(user_id)

            # Create comprehensive welcome message
            message = f"""📊 ZIMSEC Graph Practice Academy

👋 Welcome {user_name}!

🎯 Master Core O-Level Graph Types:
📈 Linear Functions & Straight Lines
📊 Quadratic Functions & Parabolas
🌊 Trigonometric Functions
⭐ Linear Programming

💰 Your Credits: {credits}
✨ Features:
• Professional graphs with grids & scaling
• Step-by-step explanations with AI
• Practice exercises for every topic
• Real ZIMSEC exam-style problems
• Interactive learning modules

🚀 Choose your learning path:"""

            # Create interactive buttons for graph modules
            buttons = []
            for module_id, module_info in self.graph_modules.items():
                buttons.append({
                    "text": module_info["title"],
                    "callback_data": f"graph_module_{module_id}"
                })

            # Add utility buttons
            buttons.extend([
                {"text": "🎓 Graph Tutorial", "callback_data": "graph_tutorial"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ])

            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

            # Save session
            graph_session = {
                'session_type': 'graph_practice',
                'user_name': user_name,
                'current_module': None,
                'progress': 0
            }
            save_user_session(user_id, graph_session)

            logger.info("Graph practice started for user %s", user_id)

        except Exception as e:
            logger.error("Error starting graph practice for %s: %s", user_id, e)
            self.whatsapp_service.send_message(user_id, "❌ Error starting graph practice. Please try again.")

    def handle_graph_module(self, user_id: str, module_id: str):
        """Handle specific graph module selection with new button structure"""
        try:
            if module_id not in self.graph_modules:
                self.whatsapp_service.send_message(user_id, "❌ Invalid module selected.")
                return

            module_info = self.graph_modules[module_id]
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            # Create module introduction message
            message = f"""🎓 {module_info['title']}

👤 Student: {user_name}
📚 Topic: {module_info['description']}
🎯 Difficulty: {module_info['difficulty'].title()}

📖 What you'll learn:
• Graph characteristics and behavior
• Key points and transformations
• Real-world applications
• ZIMSEC exam techniques

💡 Example functions:
{chr(10).join(['• ' + example for example in module_info['examples']])}

🚀 Ready to start learning?"""

            # New button structure as requested
            buttons = [
                {"text": "📝 Practice Questions", "callback_data": f"graph_practice_{module_id}"},
                {"text": "📊 Sample Graphs", "callback_data": f"graph_sample_graphs_{module_id}"},
                {"text": "📖 Learn Theory", "callback_data": f"graph_theory_{module_id}"},
                {"text": "🔙 Back Topics", "callback_data": "graph_practice_start"}
            ]

            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

            # Update session
            session_data = get_user_session(user_id) or {}
            session_data.update({
                'current_module': module_id,
                'module_info': module_info
            })
            save_user_session(user_id, session_data)

        except Exception as e:
            logger.error("Error handling graph module %s for %s: %s", module_id, user_id, e)
            self.whatsapp_service.send_message(user_id, "❌ Error loading module. Please try again.")

    def handle_graph_practice_questions(self, user_id: str, module_id: str):
        """Handle Practice Questions - show Generate Graph and Plot options"""
        try:
            if module_id not in self.graph_modules:
                self.whatsapp_service.send_message(user_id, "❌ Invalid module selected.")
                return

            module_info = self.graph_modules[module_id]
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            message = f"""📝 Practice Questions - {module_info['title']}

👤 Student: {user_name}
📚 Topic: {module_info['description']}

🎯 Choose your practice method:

🤖 **Generate Graph**: AI creates ZIMSEC-style questions for you to plot
📐 **Plot**: Enter your own expression and see the graph

🚀 Ready to practice?"""

            # Practice Questions sub-menu
            buttons = [
                {"text": "🤖 Generate Graph", "callback_data": f"graph_generate_{module_id}"},
                {"text": "📐 Plot", "callback_data": f"graph_plot_{module_id}"},
                {"text": "🔙 Back", "callback_data": f"graph_module_{module_id}"}
            ]

            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

            # Update session
            session_data = get_user_session(user_id) or {}
            session_data.update({
                'practice_mode': 'questions',
                'current_module': module_id
            })
            save_user_session(user_id, session_data)

        except Exception as e:
            logger.error("Error handling practice questions %s for %s: %s", module_id, user_id, e)
            self.whatsapp_service.send_message(user_id, "❌ Error loading practice questions. Please try again.")

    def handle_graph_generate(self, user_id: str, module_id: str):
        """Generate AI question using DeepSeek for specific graph topic"""
        try:
            if module_id not in self.graph_modules:
                return

            module_info = self.graph_modules[module_id]
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            # Send generating message
            generating_msg = f"""🤖 **Generating ZIMSEC Question** 🤖

👤 Student: {user_name}
📂 Topic: {module_info['title']}
⏳ DeepSeek AI is creating an authentic O-Level question...

🧠 Please wait while we generate your personalized graph question!"""

            self.whatsapp_service.send_message(user_id, generating_msg)

            # Generate question using DeepSeek AI
            topic_name = module_info['title'].replace('📈 ', '').replace('📊 ', '').replace('🌊 ', '').replace('⭐ ', '')

            # Use DeepSeek AI for ALL graph topics with immediate fallback
            question_data = self.question_generator.generate_question(
                'Mathematics',
                f"Graph - {topic_name}",
                'medium'
            )

            if question_data:
                # AI successful - format the generated question
                question_text = question_data.get('question', 'Graph plotting question')

                message = f"""📝 **ZIMSEC O-Level Question** (AI Generated)

👤 Student: {user_name}
📂 Topic: {topic_name}
🎯 Instructions: Plot the graph for this question

❓ **Question:**
{question_text}

📐 **Your Task:**
Study the question and when ready, click "Show Graph" to see the correct graph with guidelines and your personalized NerdX watermark.

🤖 *This question was generated by AI to match ZIMSEC standards*"""

                buttons = [
                    {"text": "📊 Show Graph", "callback_data": f"show_generated_graph_{module_id}"},
                    {"text": "🔄 Generate New Question", "callback_data": f"graph_generate_{module_id}"},
                    {"text": "🔙 Back", "callback_data": f"graph_practice_{module_id}"}
                ]

                self.whatsapp_service.send_interactive_message(user_id, message, buttons)

                # Save question data in session
                session_data = get_user_session(user_id) or {}
                session_data.update({
                    'generated_question': question_data,
                    'current_module': module_id,
                    'question_text': question_text
                })
                save_user_session(user_id, session_data)

            else:
                # AI failed - use immediate fallback
                logger.info(f"Generated fallback question for {topic_name}")
                fallback_question = self._get_fallback_question(module_id)
                
                message = f"""📝 **ZIMSEC Practice Question**

👤 Student: {user_name}
📂 Topic: {topic_name}
🎯 Instructions: Plot the graph for this question

❓ **Question:**
{fallback_question}

📐 **Your Task:**
Study the question and when ready, click "Show Graph" to see the correct graph with guidelines and your personalized NerdX watermark.

💡 *Practice question from our curriculum bank*"""

                buttons = [
                    {"text": "📊 Show Graph", "callback_data": f"show_generated_graph_{module_id}"},
                    {"text": "🔄 Try Generate New", "callback_data": f"graph_generate_{module_id}"},
                    {"text": "🔙 Back", "callback_data": f"graph_practice_{module_id}"}
                ]

                self.whatsapp_service.send_interactive_message(user_id, message, buttons)

                # Save fallback question in session
                session_data = get_user_session(user_id) or {}
                session_data.update({
                    'generated_question': {'question': fallback_question},
                    'current_module': module_id,
                    'question_text': fallback_question
                })
                save_user_session(user_id, session_data)

        except Exception as e:
            logger.error("Error generating graph question for %s: %s", user_id, e)
            self.whatsapp_service.send_message(user_id, "❌ Error generating question. Please try again.")

    def handle_show_generated_graph(self, user_id: str, module_id: str):
        """Show the graph for the AI-generated question using Desmos API"""
        try:
            session_data = get_user_session(user_id)
            if not session_data or 'generated_question' not in session_data:
                self.whatsapp_service.send_message(user_id, "❌ No question found. Please generate a question first.")
                return

            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            module_info = self.graph_modules[module_id]

            # Send processing message
            processing_msg = f"""📊 **Generating Your Graph** 📊

👤 Student: {user_name}
🎨 NerdX is creating your personalized graph...
⏳ Adding guidelines, watermark, and your name...

🚀 Almost ready!"""

            self.whatsapp_service.send_message(user_id, processing_msg)

            # Extract function/expression from the generated question
            question_data = session_data['generated_question']
            question_text = session_data.get('question_text', '')

            # Try to extract mathematical expression from question
            # This is a simplified approach - in production you'd want more sophisticated parsing
            expression = self._extract_expression_from_question(question_text, module_id)

            if not expression:
                # Fallback expressions based on module
                fallback_expressions = {
                    'linear_functions': 'y = 2x + 3',
                    'quadratic_functions': 'y = x^2 - 4x + 3',
                    'trigonometric_functions': 'y = sin(x)',
                    'linear_programming': '2x + 3y <= 12'
                }
                expression = fallback_expressions.get(module_id, 'y = x')

            # Create graph - special handling for linear programming
            if module_id == 'linear_programming':
                # Extract constraints and use linear programming graph generator
                constraints = expression.split(', ') if expression else ["x + y <= 10", "2x + y <= 16", "x >= 0", "y >= 2"]
                graph_result = self.graph_service.generate_linear_programming_graph(
                    constraints,
                    objective_function=None,
                    user_name=user_name,
                    title=f"ZIMSEC Linear Programming - {user_name}"
                )
            else:
                # Use regular graph creation for other modules
                graph_result = self.graph_service.create_graph(
                    user_id,
                    expression,
                    module_id.replace('_', ' ').title(),
                    user_name
                )

            if graph_result and 'image_path' in graph_result:
                # Send success message with graph
                success_msg = f"""✅ **Your Personalized Graph** ✅

👤 Student: {user_name}
📊 Expression: {expression}
📂 Topic: {module_info['title']}
🎨 Created with NerdX watermark

📈 Study this graph carefully and compare with your manual plotting!

💰 Credits Remaining: {get_user_credits(user_id)}"""

                # Send the graph image using the file path directly
                self.whatsapp_service.send_image_file(user_id, graph_result['image_path'], success_msg)

                # Add navigation buttons
                buttons = [
                    {"text": "🔄 Generate New Question", "callback_data": f"graph_generate_{module_id}"},
                    {"text": "📐 Plot Your Own", "callback_data": f"graph_plot_{module_id}"},
                    {"text": "🔙 Back", "callback_data": f"graph_practice_{module_id}"}
                ]

                self.whatsapp_service.send_interactive_message(user_id, "🚀 What would you like to do next?", buttons)

            else:
                self.whatsapp_service.send_message(user_id, "❌ Failed to generate graph. Please try again.")

        except Exception as e:
            logger.error("Error showing generated graph for %s: %s", user_id, e)
            self.whatsapp_service.send_message(user_id, "❌ Error creating graph. Please try again.")

    def handle_graph_plot(self, user_id: str, module_id: str):
        """Handle Plot option - ask user for expression input"""
        try:
            if module_id not in self.graph_modules:
                return

            module_info = self.graph_modules[module_id]
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            # Create input instruction based on graph type
            format_examples = {
                'linear_functions': 'y = mx + c\nExample: y = 2x + 3',
                'quadratic_functions': 'y = ax² + bx + c\nExample: y = x^2 - 4x + 3',
                'trigonometric_functions': 'y = sin(x), y = cos(x), y = tan(x)\nExample: y = 2sin(x)',
                'linear_programming': 'Constraint format: ax + by <= c\nExample: 2x + 3y <= 12'
            }

            format_info = format_examples.get(module_id, 'y = expression\nExample: y = x')

            message = f"""📐 **Plot Your Own Graph** 📐

👤 Student: {user_name}
📂 Topic: {module_info['title']}

📝 **Please type your {module_info['title'].lower()} in this format:**

{format_info}

💡 **Instructions:**
1. Type your expression below
2. NerdX will process and create your personalized graph
3. Graph will include guidelines and your name watermark

⌨️ Type your expression now:"""

            self.whatsapp_service.send_message(user_id, message)

            # Update session to expect user input
            session_data = get_user_session(user_id) or {}
            session_data.update({
                'awaiting_expression': True,
                'plot_module': module_id,
                'session_type': 'graph_practice'
            })
            save_user_session(user_id, session_data)

        except Exception as e:
            logger.error("Error handling plot request for %s: %s", user_id, e)
            self.whatsapp_service.send_message(user_id, "❌ Error setting up plot. Please try again.")

    def handle_user_expression_input(self, user_id: str, expression: str):
        """Process user's mathematical expression and create graph"""
        try:
            session_data = get_user_session(user_id)
            if not session_data or not session_data.get('awaiting_expression'):
                return False  # Not expecting input

            module_id = session_data.get('plot_module')
            if not module_id:
                return False

            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            # Send processing message with user's name
            processing_msg = f"""⏳ **Processing Your Graph** ⏳

Wait {user_name} NerdX is processing your Graph...

📊 Expression: {expression}
🎨 Adding guidelines and watermark
👤 Personalizing with your name

🚀 Almost ready!"""

            self.whatsapp_service.send_message(user_id, processing_msg)

            # Create graph - special handling for linear programming
            module_info = self.graph_modules[module_id]
            if module_id == 'linear_programming':
                # Handle linear programming constraints
                if ',' in expression:
                    constraints = [c.strip() for c in expression.split(',')]
                else:
                    constraints = [expression]
                
                graph_result = self.graph_service.generate_linear_programming_graph(
                    constraints,
                    objective_function=None,
                    user_name=user_name,
                    title=f"Custom Linear Programming - {user_name}"
                )
            else:
                # Use regular graph creation for other modules
                graph_result = self.graph_service.create_graph(
                    user_id,
                    expression,
                    module_info['title'],
                    user_name
                )

            if graph_result and 'image_path' in graph_result:
                # Send success message with graph
                success_msg = f"""✅ **Your Custom Graph Created!** ✅

👤 Student: {user_name}
📊 Expression: {expression}
📂 Topic: {module_info['title']}
🎨 Personalized with NerdX watermark

💰 Credits Remaining: {get_user_credits(user_id)}"""

                # Send the graph image using send_image_file method
                success = self.whatsapp_service.send_image_file(user_id, graph_result['image_path'], success_msg)
                if not success:
                    logger.error("Failed to send custom graph to WhatsApp for user %s", user_id)
                    self.whatsapp_service.send_message(user_id, "❌ Graph created but failed to send. Please try again.")

                # Add navigation buttons
                buttons = [
                    {"text": "📐 Type Another Graph", "callback_data": f"graph_plot_{module_id}"},
                    {"text": "🔙 Back", "callback_data": f"graph_practice_{module_id}"}
                ]

                self.whatsapp_service.send_interactive_message(user_id, "🚀 What would you like to do next?", buttons)

            else:
                self.whatsapp_service.send_message(user_id, "❌ Failed to create graph. Please check your expression format and try again.")

            # Clear awaiting state
            session_data['awaiting_expression'] = False
            save_user_session(user_id, session_data)

            return True  # Successfully handled input

        except Exception as e:
            logger.error("Error processing user expression for %s: %s", user_id, e)
            self.whatsapp_service.send_message(user_id, "❌ Error processing your expression. Please try again.")
            return True  # Handled but with error

    def handle_sample_graphs(self, user_id: str, module_id: str):
        """Handle Sample Graphs option - show 3 plotted graph images for the topic"""
        try:
            if module_id not in self.graph_modules:
                return

            module_info = self.graph_modules[module_id]
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            # Send initial message
            message = f"""📊 **Sample Graphs** - {module_info['title']}

👤 Student: {user_name}
📚 Topic: {module_info['description']}

🎨 Loading 3 sample graphs to show you how {module_info['title'].lower()} look like...

⏳ NerdX is generating visual examples for you!"""

            self.whatsapp_service.send_message(user_id, message)

            # Get 3 sample expressions for this topic
            sample_expressions = self._get_sample_expressions(module_id)

            # Generate and send 3 sample graphs
            if module_id == "linear_programming":
                # Special handling for linear programming sample problems in ZIMSEC format
                linear_programs = [
                    {
                        "constraints": ["2x + y <= 40", "x + 2y <= 48", "x >= 0", "y > 5"],
                        "objective": None,
                        "title": "ZIMSEC Example 1: Production Constraints"
                    },
                    {
                        "constraints": ["3x + 2y <= 60", "x + 3y <= 45", "x >= 0", "y > 3"],
                        "objective": None,
                        "title": "ZIMSEC Example 2: Resource Allocation"
                    },
                    {
                        "constraints": ["x + y <= 30", "2x + 3y <= 54", "x >= 0", "y > 4"],
                        "objective": None,
                        "title": "ZIMSEC Example 3: Manufacturing Problem"
                    }
                ]

                for i, lp_problem in enumerate(linear_programs, 1):
                    try:
                        # Create linear programming graph
                        graph_result = self.graph_service.generate_linear_programming_graph(
                            lp_problem["constraints"],
                            objective_function=lp_problem["objective"],
                            user_name=user_name,
                            title=f"Example {i}: {lp_problem['title']}"
                        )

                        if graph_result and 'image_path' in graph_result:
                            # Send the sample linear programming graph
                            caption = f"""📊 **ZIMSEC Linear Programming Example {i}/3**

🏭 Problem Type: {lp_problem['title']}
📐 Constraints: {', '.join(lp_problem['constraints'])}
🟢 Green area R = Feasible region (wanted)
🔴 Red/Gray areas = Unwanted regions (shaded)
🔴 Red dots = Corner points 
📍 Large R = Required region marker

💡 This matches ZIMSEC exam format exactly!"""

                            # Use send_image_file method which handles file paths properly
                            success = self.whatsapp_service.send_image_file(user_id, graph_result['image_path'], caption)
                            if not success:
                                logger.error("Failed to send LP graph %i to WhatsApp for user %s", i, user_id)
                                self.whatsapp_service.send_message(user_id, f"⚠️ Linear programming example {i} failed to send.")

                    except Exception as graph_error:
                        logger.error("Error generating LP sample graph %i for %s: %s", i, user_id, graph_error)
                        self.whatsapp_service.send_message(user_id, f"⚠️ Linear programming example {i} failed to generate.")
            else:
                # Standard handling for other modules
                for i, expression in enumerate(sample_expressions[:3], 1):
                    try:
                        # Create graph using the graph service
                        graph_result = self.graph_service.create_graph(
                            user_id,
                            expression,
                            f"{module_info['title']} - Example {i}",
                            user_name
                        )

                        if graph_result and 'image_path' in graph_result:
                            # Send the sample graph
                            caption = f"""📊 **Sample Graph {i}/3**

📈 Expression: {expression}
📂 Topic: {module_info['title']}
🎨 Example for visual learning

💡 Study this graph pattern and characteristics!"""

                            # Use send_image_file method which handles file paths properly
                            success = self.whatsapp_service.send_image_file(user_id, graph_result['image_path'], caption)
                            if not success:
                                logger.error("Failed to send sample graph %i to WhatsApp for user %s", i, user_id)
                                self.whatsapp_service.send_message(user_id, f"⚠️ Sample graph {i} failed to send.")

                    except Exception as graph_error:
                        logger.error("Error generating sample graph %i for %s: %s", i, user_id, graph_error)
                        self.whatsapp_service.send_message(user_id, f"⚠️ Sample graph {i} failed to generate.")

            # Send completion message with navigation buttons
            completion_msg = f"""✅ **Sample Graphs Complete!**

👁️ You've seen 3 examples of {module_info['title'].lower()}
📚 Study these patterns and characteristics
🎯 Ready to practice creating your own?

💰 Credits Remaining: {get_user_credits(user_id)}"""

            buttons = [
                {"text": "🤖 Generate Practice Question", "callback_data": f"graph_generate_{module_id}"},
                {"text": "📐 Plot Your Own Graph", "callback_data": f"graph_plot_{module_id}"},
                {"text": "🔙 Back", "callback_data": f"graph_module_{module_id}"}
            ]

            self.whatsapp_service.send_interactive_message(user_id, completion_msg, buttons)

        except Exception as e:
            logger.error("Error showing sample graphs for %s: %s", user_id, e)
            self.whatsapp_service.send_message(user_id, "❌ Error loading sample graphs. Please try again.")

    def _extract_expression_from_question(self, question_text: str, module_id: str) -> str:
        """Extract mathematical expression from AI-generated question text"""
        try:
            import re

            # Special handling for linear programming
            if module_id == 'linear_programming':
                return self._extract_linear_programming_constraints(question_text)

            # Common patterns for different types of functions
            patterns = {
                'linear_functions': r'y\s*=\s*[+-]?\d*[.]?\d*x\s*[+-]?\s*\d+',
                'quadratic_functions': r'y\s*=\s*[+-]?\d*[.]?\d*x\^?2\s*[+-]?\s*\d*[.]?\d*x?\s*[+-]?\s*\d*',
                'trigonometric_functions': r'y\s*=\s*\d*[.]?\d*\s*(sin|cos|tan)\s*\([^)]+\)',
            }

            if module_id in patterns:
                matches = re.findall(patterns[module_id], question_text, re.IGNORECASE)
                if matches:
                    return matches[0].strip()

            # Fallback: look for any y = expression
            fallback_match = re.search(r'y\s*=\s*[^\n]+', question_text, re.IGNORECASE)
            if fallback_match:
                return fallback_match.group().strip()

            return None

        except Exception as e:
            logger.error("Error extracting expression from question: %s", e)
            return None

    def _extract_linear_programming_constraints(self, question_text: str) -> str:
        """Extract linear programming constraints from question text"""
        try:
            import re
            
            # Look for constraints in the format (i) constraint, (ii) constraint, etc.
            constraint_pattern = r'\([iv]+\)\s*([^(\n]+?)(?=\s*\([iv]+\)|$)'
            matches = re.findall(constraint_pattern, question_text, re.IGNORECASE | re.DOTALL)
            
            if matches:
                # Clean and format constraints
                constraints = []
                for match in matches:
                    constraint = match.strip()
                    # Replace unicode symbols with standard operators
                    constraint = constraint.replace('≤', '<=').replace('≥', '>=').replace('>', '>')
                    if constraint and any(op in constraint for op in ['<=', '>=', '>', '<', '=']):
                        constraints.append(constraint)
                
                if constraints:
                    return ', '.join(constraints)
            
            # Alternative: look for direct constraint format
            direct_pattern = r'([x\d\s+\-*]+[<>=≤≥]+\s*\d+)'
            direct_matches = re.findall(direct_pattern, question_text)
            if direct_matches:
                constraints = [match.replace('≤', '<=').replace('≥', '>=') for match in direct_matches[:4]]
                return ', '.join(constraints)
            
            # Fallback constraints for linear programming
            return "x + y <= 10, 2x + y <= 16, x >= 0, y >= 2"
            
        except Exception as e:
            logger.error(f"Error extracting linear programming constraints: {e}")
            return "x + y <= 10, 2x + y <= 16, x >= 0, y >= 2"

    def _get_sample_expressions(self, module_id: str) -> List[str]:
        """Get 3 sample expressions for each graph module to create visual examples"""
        sample_expressions = {
            'linear_functions': [
                "y = 2x + 3",
                "y = -x + 4",
                "y = 0.5x - 2"
            ],
            'quadratic_functions': [
                "y = x^2 - 4x + 3",
                "y = -x^2 + 2x + 3",
                "y = 2x^2 - 8x + 6"
            ],
            'trigonometric_functions': [
                "y = sin(x)",
                "y = 2*cos(x)",
                "y = tan(x)"
            ],
            'linear_programming': [
                "2x + y <= 40, x + 2y <= 48, x >= 0, y > 5",
                "3x + 2y <= 60, x + 3y <= 45, x >= 0, y > 3", 
                "x + y <= 30, 2x + 3y <= 54, x >= 0, y > 4"
            ]
        }

        return sample_expressions.get(module_id, [
            "y = x",
            "y = 2x",
            "y = x + 1"
        ])

    def _get_sample_questions(self, module_id: str) -> List[str]:
        """Get sample questions for specific graph module"""
        sample_questions = {
            'linear_functions': [
                "Plot the graph of y = 2x + 3. Mark the y-intercept and find where it crosses the x-axis.",
                "Draw the line y = -x + 4. What is the gradient and y-intercept?",
                "Graph y = 0.5x - 2 and y = -0.5x + 2 on the same axes. Where do they intersect?",
                "Plot y = 3x and identify three points on this line.",
                "Draw the graph of 2x + 3y = 12. Find the x and y intercepts."
            ],
            'quadratic_functions': [
                "Sketch the graph of y = x² - 4x + 3. Find the vertex and roots.",
                "Plot y = -x² + 2x + 3. Determine the maximum point and y-intercept.",
                "Graph y = 2x² - 8x + 6 and find where it crosses the x-axis.",
                "Draw y = x² - 6x + 9. What is special about this parabola?",
                "Sketch y = -2x² + 4x and find the turning point."
            ],
            'trigonometric_functions': [
                "Plot y = sin(x) for x from 0° to 360°. Mark the maximum and minimum points.",
                "Graph y = 2cos(x) and compare it to y = cos(x). What is the amplitude?",
                "Sketch y = sin(2x) for one complete cycle. What is the period?",
                "Plot y = tan(x) from -90° to 270°. Mark the asymptotes.",
                "Draw y = sin(x) + 2. How does this compare to y = sin(x)?"
            ],
            'linear_programming': [
                "Graph the constraints: x + y ≤ 8, 2x + y ≤ 10, x ≥ 0, y ≥ 0. Find the feasible region.",
                "Plot 3x + 2y ≤ 12 and x + 3y ≤ 9 with non-negativity constraints.",
                "Draw the constraint lines for x + 2y ≤ 10, 2x + y ≤ 8, x ≥ 1, y ≥ 1.",
                "Graph the system: 4x + 3y ≤ 24, x + y ≤ 7, x ≥ 0, y ≥ 0.",
                "Plot the constraints and find vertices: x + y ≤ 6, 2x + 3y ≤ 12, x ≥ 0, y ≥ 0."
            ]
        }

        return sample_questions.get(module_id, [
            "Practice plotting basic functions.",
            "Find key points and characteristics.",
            "Compare different function types."
        ])

    def _get_fallback_question(self, module_id: str) -> str:
        """Get fallback questions when AI fails"""
        fallback_questions = {
            'linear_functions': "Plot the straight line y = 2x + 3. Mark the y-intercept clearly and find where the line crosses the x-axis.",
            'quadratic_functions': "Sketch the parabola y = x² - 4x + 3. Find and mark the vertex, y-intercept, and x-intercepts on your graph.",
            'trigonometric_functions': "Draw the graph of y = sin(x) for x from 0° to 360°. Mark the maximum and minimum points clearly.",
            'linear_programming': """Answer the whole of this question on the grid.

(a) Draw the graphs of these inequalities by shading the unwanted region.

(i) 2x + y ≤ 40
(ii) x + 2y ≤ 48  
(iii) x ≥ 0
(iv) y > 5

(b) Mark R the region defined by the four inequalities in (a)."""
        }

        return fallback_questions.get(module_id, "Plot a basic mathematical function and identify its key characteristics.")

    def handle_graph_theory(self, user_id: str, module_id: str):
        """Provide comprehensive theory explanation with AI assistance"""
        try:
            if module_id not in self.graph_modules:
                return

            module_info = self.graph_modules[module_id]
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            # Generate AI explanation using DeepSeek
            theory_prompt = f"""
            Create a comprehensive ZIMSEC O-Level mathematics explanation for {module_info['title']}.

            Include:
            1. Key concepts and definitions
            2. Important characteristics
            3. Common exam questions patterns
            4. Step-by-step problem solving approach
            5. Common mistakes to avoid

            Make it educational and engaging for O-Level students.
            """

            # Get AI explanation
            ai_explanation = self._get_ai_explanation(theory_prompt)

            # Create theory message
            message = f"""📚 {module_info['title']} - Theory

👤 Student: {user_name}

{ai_explanation}

📊 Want to see these concepts in action?"""

            # Create interactive buttons
            buttons = [
                {"text": "📊 Generate Example Graph", "callback_data": f"graph_example_{module_id}"},
                {"text": "🎯 Try Practice Problem", "callback_data": f"graph_practice_{module_id}"},
                {"text": "🔙 Back to Module", "callback_data": f"graph_module_{module_id}"}
            ]

            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error("Error providing theory for %s: %s", module_id, e)
            self.whatsapp_service.send_message(user_id, "❌ Error loading theory. Please try again.")

    def handle_graph_creation(self, user_id: str, module_id: str):
        """Handle graph creation with example"""
        try:
            if module_id not in self.graph_modules:
                return

            module_info = self.graph_modules[module_id]
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            # Check credits for graph creation (cost: 2 credits)
            credits = get_user_credits(user_id)
            if credits < 2:
                message = f"""💰 Insufficient Credits

👤 Student: {user_name}
💰 Current Credits: {credits}
🎯 Required: 2 credits for graph creation

🔄 Please purchase more credits or try free theory lessons."""

                buttons = [
                    {"text": "💰 Buy Credits", "callback_data": "buy_credits"},
                    {"text": "📖 Free Theory", "callback_data": f"graph_theory_{module_id}"},
                    {"text": "🏠 Main Menu", "callback_data": "main_menu"}
                ]

                self.whatsapp_service.send_interactive_message(user_id, message, buttons)
                return

            # Deduct credits
            if not deduct_credits(user_id, 2, "graph_creation", f"Graph creation for {module_info['title']}"):
                self.whatsapp_service.send_message(user_id, "❌ Error processing credits. Please try again.")
                return

            # Generate appropriate graph based on module
            graph_path = self._create_module_graph(module_id, module_info)

            if graph_path:
                # Send graph with explanation
                message = f"""📊 {module_info['title']} - Example Graph

👤 Student: {user_name}
💰 Credits Used: 2 (Remaining: {credits - 2})

📈 Professional ZIMSEC-style graph generated!

🔍 Study the graph features:
• Professional grid lines and scaling
• Clear axis labels and values
• Educational formatting
• ZIMSEC exam standards

Ready for more learning?"""

                buttons = [
                    {"text": "🎯 Practice Problem", "callback_data": f"graph_practice_{module_id}"},
                    {"text": "📊 Create Another", "callback_data": f"graph_create_{module_id}"},
                    {"text": "🔙 Back to Module", "callback_data": f"graph_module_{module_id}"}
                ]

                # Send graph image
                self.whatsapp_service.send_image(user_id, graph_path, "Professional ZIMSEC Graph")

                # Then send interactive message
                self.whatsapp_service.send_interactive_message(user_id, message, buttons)

                logger.info("Graph created for module %s for user %s", module_id, user_id)
            else:
                self.whatsapp_service.send_message(user_id, "❌ Error creating graph. Please try again.")

        except Exception as e:
            logger.error("Error creating graph for module %s: %s", module_id, e)
            self.whatsapp_service.send_message(user_id, "❌ Error creating graph. Please try again.")


    def _create_module_graph(self, module_id: str, module_info: Dict) -> Optional[str]:
        """Create a graph based on the module type"""
        try:
            if module_id == "linear_functions":
                # Create linear function graph
                example = random.choice(module_info["examples"])
                return self.graph_service.create_advanced_function_graph(
                    example,
                    f"ZIMSEC Linear Functions: {example}"
                )

            elif module_id == "quadratic_functions":
                # Create quadratic function graph
                example = random.choice(module_info["examples"])
                return self.graph_service.create_advanced_function_graph(
                    example,
                    f"ZIMSEC Quadratic Functions: {example}"
                )

            elif module_id == "trigonometric_functions":
                # Create trigonometric function graph
                example = random.choice(module_info["examples"])
                viewport = {"xmin": -6.28, "xmax": 6.28, "ymin": -3, "ymax": 3}
                return self.graph_service.create_advanced_function_graph(
                    example,
                    f"ZIMSEC Trigonometric Functions: {example}",
                    viewport
                )


            elif module_id == "linear_programming":
                # Create linear programming graph with shaded feasible region
                constraints = ["2x + 3y <= 12", "x + y <= 8", "x >= 0", "y >= 0"]
                return self.graph_service.generate_linear_programming_graph(
                    constraints,
                    objective_function="maximize x + y",
                    user_name="Student",
                    title="ZIMSEC Linear Programming - Feasible Region"
                )

            return None

        except Exception as e:
            logger.error("Error creating module graph for %s: %s", module_id, e)
            return None

    def _get_practice_problem(self, module_id: str) -> str:
        """Get pre-built practice problem for specific module"""
        practice_problems = {
            "linear_functions": """📝 **Practice Problem: Linear Functions**

**Problem:** A taxi company charges a base fee of $3 plus $2 per kilometer traveled.

**Tasks:**
1. Write the equation relating cost (C) to distance (d)
2. Find the cost for a 15km journey
3. What distance gives a cost of $25?

**Solution Guide:**
• Step 1: C = 3 + 2d (base fee + rate × distance)
• Step 2: C = 3 + 2(15) = 3 + 30 = $33
• Step 3: 25 = 3 + 2d → 22 = 2d → d = 11km

**Graph Features:** y-intercept = 3, slope = 2, straight line""",

            "quadratic_functions": """📝 **Practice Problem: Quadratic Functions**

**Problem:** A ball is thrown upward with initial velocity. Its height h (in meters) after t seconds is: h = -5t² + 20t + 2

**Tasks:**
1. Find the maximum height and when it occurs
2. When does the ball hit the ground?
3. What is the initial height?

**Solution Guide:**
• Maximum at t = -b/2a = -20/(-10) = 2 seconds
• Maximum height: h = -5(4) + 20(2) + 2 = 22m
• Ground: -5t² + 20t + 2 = 0 → t ≈ 4.1 seconds
• Initial height: h(0) = 2m

**Graph Features:** Parabola opening downward, vertex at (2, 22)""",

            "trigonometric_functions": """📝 **Practice Problem: Trigonometric Functions**

**Problem:** The height of a Ferris wheel rider above ground is given by: h = 10 + 8sin(2πt/30)

**Tasks:**
1. What is the minimum and maximum height?
2. How long does one complete rotation take?
3. What height at t = 7.5 minutes?

**Solution Guide:**
• Maximum: 10 + 8 = 18m, Minimum: 10 - 8 = 2m
• Period = 30 minutes (one rotation)
• h(7.5) = 10 + 8sin(π/2) = 10 + 8 = 18m

**Graph Features:** Sine wave, amplitude = 8, period = 30, vertical shift = 10""",

            "exponential_functions": """📝 **Practice Problem: Exponential Functions**

**Problem:** A bacteria population doubles every 3 hours. Starting with 100 bacteria: P = 100 × 2^(t/3)

**Tasks:**
1. Find population after 6 hours
2. When will population reach 1600?
3. What was population 3 hours ago?

**Solution Guide:**
• After 6h: P = 100 × 2^(6/3) = 100 × 4 = 400 bacteria
• For 1600: 1600 = 100 × 2^(t/3) → 16 = 2^(t/3) → t = 12 hours
• 3h ago: P = 100 × 2^(-1) = 50 bacteria

**Graph Features:** Exponential growth, starts at 100, increases rapidly"""
        }

        return practice_problems.get(module_id, self._get_fallback_explanation())

    def _get_graph_explanation(self, user_input: str) -> str:
        """Get explanation for a specific graph"""
        try:
            prompt = f"""
            Explain this mathematical graph for a ZIMSEC O-Level student: {user_input}

            Include:
            1. What type of graph this is
            2. Key features and characteristics
            3. How to interpret the graph
            4. Relevant ZIMSEC exam tips

            Keep it concise and educational.
            """

            return self._get_ai_explanation(prompt)
        except Exception as e:
            logger.error("Error getting graph explanation: %s", e)
            return f"This is a graph of: {user_input}\n\nStudy the shape, intercepts, and behavior of the function."

    def _get_fallback_explanation(self) -> str:
        """Provide fallback explanation when AI fails"""
        return """📚 ZIMSEC Graph Theory

🎯 Key Concepts:
• Identify graph type and characteristics
• Find intercepts, domain, and range
• Analyze function behavior
• Apply transformations

📖 Study Tips:
• Practice sketching by hand first
• Use technology to verify your work
• Focus on key features for exams
• Connect graphs to real-world problems

💡 Remember: Understanding the concepts is more important than memorizing formulas!"""

    def handle_graph_tutorial(self, user_id: str):
        """Provide comprehensive graph tutorial"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            message = f"""🎓 ZIMSEC Graph Master Tutorial

👤 Student: {user_name}

📚 Complete Guide to O-Level Graphs:

1️⃣ **Linear Functions (y = mx + c)**
   • Straight lines
   • m = gradient/slope
   • c = y-intercept

2️⃣ **Quadratic Functions (y = ax² + bx + c)**
   • Parabolas (U-shaped)
   • Vertex form important
   • Axis of symmetry

3️⃣ **Trigonometric Functions**
   • sin, cos: wave patterns
   • tan: has asymptotes
   • Period and amplitude

4️⃣ **Statistics Graphs**
   • Histograms: frequency data
   • Box plots: quartiles
   • Scatter: correlation

5️⃣ **Linear Programming**
   • Constraint inequalities
   • Feasible regions
   • Optimization

🎯 ZIMSEC Exam Tips:
• Always label axes clearly
• Show key points and coordinates
• Use appropriate scales
• Read questions carefully

Ready to practice?"""

            buttons = [
                {"text": "🎯 Start Practice", "callback_data": "graph_practice_start"},
                {"text": "📊 Create Custom Graph", "callback_data": "graph_custom_creator"},
                {"text": "🏠 Main Menu", "callback_data": "main_menu"}
            ]

            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as e:
            logger.error("Error providing graph tutorial for %s: %s", user_id, e)
            self.whatsapp_service.send_message(user_id, "❌ Error loading tutorial. Please try again.")

    def handle_graph_practice_problems(self, user_id: str, module_id: str):
        """Handle practice problems for a specific graph module"""
        try:
            if module_id not in self.graph_modules:
                return

            module_info = self.graph_modules[module_id]
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"

            # Use pre-built practice problems to avoid timeout issues
            problem_explanation = self._get_practice_problem(module_id)

            message = f"""🎯 {module_info['title']} - Practice Problem

👤 Student: {user_name}

{problem_explanation}

🚀 Ready to create a graph for this problem?"""

            buttons = [
                {"text": "📊 Create Practice Graph", "callback_data": f"graph_create_{module_id}"},
                {"text": "📖 Review Theory", "callback_data": f"graph_theory_{module_id}"},
                {"text": "🔙 Back to Module", "callback_data": f"graph_module_{module_id}"}
            ]

            self.whatsapp_service.send_interactive_message(user_id, message, buttons)

        except Exception as graph_error:
            logger.error("Error in graph practice handler: %s", graph_error)
            self.whatsapp_service.send_message(user_id, "❌ Error processing graph request. Please try again.")

    def _get_ai_explanation(self, prompt: str) -> str:
        """
        Placeholder for fetching explanation from an AI model.
        In a real implementation, this would call an LLM API.
        """
        # Simulate AI response
        return f"This is a comprehensive explanation for ZIMSEC O-Level graphs based on your prompt: '{prompt}'.\n\nKey concepts, characteristics, problem-solving steps, and common mistakes are covered here to help you master this topic."