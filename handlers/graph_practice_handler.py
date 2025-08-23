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
            "exponential_logarithmic": {
                "title": "📈 Exponential & Logarithmic Functions",
                "description": "Master exponential growth/decay and log functions",
                "examples": ["y = 2^x", "y = e^x", "y = log(x)"],
                "difficulty": "hard"
            },
            "statistics_graphs": {
                "title": "📊 Statistics & Data Visualization",
                "description": "Histograms, box plots, scatter plots, bar charts",
                "examples": ["Histogram", "Box Plot", "Scatter Plot", "Bar Chart"],
                "difficulty": "easy"
            },
            "linear_programming": {
                "title": "⭐ Linear Programming",
                "description": "Constraint graphs, feasible regions, optimization",
                "examples": ["2x + 3y ≤ 12", "x + y ≤ 8", "x ≥ 0, y ≥ 0"],
                "difficulty": "hard"
            }
        }
        
        logger.info("Graph Practice Handler initialized for ZIMSEC O-Level")

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

🎯 Master All O-Level Graph Types:
📈 Linear Functions & Straight Lines
📊 Quadratic Functions & Parabolas  
🌊 Trigonometric Functions
📈 Exponential & Logarithmic
📊 Statistics & Data Visualization
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
                {"text": "📝 Custom Graph Creator", "callback_data": "graph_custom_creator"},
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
            
            logger.info(f"Graph practice started for user {user_id}")

        except Exception as e:
            logger.error(f"Error starting graph practice for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error starting graph practice. Please try again.")

    def handle_graph_module(self, user_id: str, module_id: str):
        """Handle specific graph module selection"""
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

            # Create learning path buttons
            buttons = [
                {"text": "📖 Learn Theory", "callback_data": f"graph_theory_{module_id}"},
                {"text": "🎯 Practice Problems", "callback_data": f"graph_practice_{module_id}"},
                {"text": "📊 Create Graph", "callback_data": f"graph_create_{module_id}"},
                {"text": "🔙 Back to Menu", "callback_data": "graph_practice_start"}
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
            logger.error(f"Error handling graph module {module_id} for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading module. Please try again.")

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
            logger.error(f"Error providing theory for {module_id}: {e}")
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
                
                # Send graph image first
                self.whatsapp_service.send_image(user_id, graph_path, "Professional ZIMSEC Graph")
                
                # Then send interactive message
                self.whatsapp_service.send_interactive_message(user_id, message, buttons)
                
                logger.info(f"Graph created for module {module_id} for user {user_id}")
            else:
                self.whatsapp_service.send_message(user_id, "❌ Error creating graph. Please try again.")

        except Exception as e:
            logger.error(f"Error creating graph for module {module_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error creating graph. Please try again.")

    def handle_custom_graph_creator(self, user_id: str):
        """Handle custom graph creation where user inputs any function"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            message = f"""📝 Custom Graph Creator

👤 Student: {user_name}

🎯 Create ANY graph you want!

📊 Supported formats:
• Functions: y = x^2, y = sin(x), y = 2x + 3
• Statistics: histogram, boxplot, scatter, bar
• Linear Programming: constraints with shading
• Parametric: x = t, y = t^2

💡 Examples:
• "y = x^2 + 2x - 1"
• "y = sin(2x)"
• "statistics: 1,2,3,4,5,4,3,2,1"
• "linear: 2x + 3y <= 12, x + y <= 8"

✍️ Type your function or graph request:"""

            self.whatsapp_service.send_message(user_id, message)
            
            # Update session for custom input
            session_data = get_user_session(user_id) or {}
            session_data.update({
                'awaiting_custom_graph': True,
                'session_type': 'graph_practice'
            })
            save_user_session(user_id, session_data)

        except Exception as e:
            logger.error(f"Error in custom graph creator for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error starting custom creator. Please try again.")

    def handle_custom_graph_input(self, user_id: str, user_input: str):
        """Process custom graph input from user"""
        try:
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            # Check credits (3 credits for custom graphs)
            credits = get_user_credits(user_id)
            if credits < 3:
                message = f"""💰 Insufficient Credits

👤 Student: {user_name}
💰 Current Credits: {credits}
🎯 Required: 3 credits for custom graph

🔄 Please purchase more credits."""
                
                self.whatsapp_service.send_message(user_id, message)
                return
            
            # Deduct credits
            if not deduct_credits(user_id, 3, "custom_graph", f"Custom graph: {user_input}"):
                self.whatsapp_service.send_message(user_id, "❌ Error processing credits. Please try again.")
                return
            
            # Process the input and create graph
            graph_path = self._process_custom_graph_input(user_input)
            
            if graph_path:
                # Get AI explanation for the graph
                explanation = self._get_graph_explanation(user_input)
                
                message = f"""📊 Custom Graph Created!

👤 Student: {user_name}
📝 Your Input: {user_input}
💰 Credits Used: 3 (Remaining: {credits - 3})

🤖 AI Explanation:
{explanation}

🎯 Want to create another graph?"""

                buttons = [
                    {"text": "📝 Create Another", "callback_data": "graph_custom_creator"},
                    {"text": "📚 Learn More", "callback_data": "graph_tutorial"},
                    {"text": "🏠 Main Menu", "callback_data": "main_menu"}
                ]
                
                # Send graph image
                self.whatsapp_service.send_image(user_id, graph_path, f"Custom Graph: {user_input}")
                
                # Send explanation
                self.whatsapp_service.send_interactive_message(user_id, message, buttons)
                
                # Clear awaiting state
                session_data = get_user_session(user_id) or {}
                session_data.pop('awaiting_custom_graph', None)
                save_user_session(user_id, session_data)
                
                logger.info(f"Custom graph created for user {user_id}: {user_input}")
            else:
                self.whatsapp_service.send_message(user_id, "❌ Error creating your graph. Please check your input and try again.")

        except Exception as e:
            logger.error(f"Error processing custom graph input for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error processing your graph. Please try again.")

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
                
            elif module_id == "exponential_logarithmic":
                # Create exponential/log function graph
                example = random.choice(module_info["examples"])
                viewport = {"xmin": -5, "xmax": 5, "ymin": -2, "ymax": 10}
                return self.graph_service.create_advanced_function_graph(
                    example, 
                    f"ZIMSEC Exponential/Log Functions: {example}",
                    viewport
                )
                
            elif module_id == "statistics_graphs":
                # Create statistics graph
                sample_data = [random.normalvariate(50, 15) for _ in range(100)]
                graph_type = random.choice(["histogram", "boxplot", "scatter", "bar"])
                return self.graph_service.create_statistics_graph(
                    sample_data, 
                    graph_type,
                    f"ZIMSEC Statistics: {graph_type.title()}"
                )
                
            elif module_id == "linear_programming":
                # Create linear programming graph
                constraints = ["2x + 3y <= 12", "x + y <= 8", "x >= 0", "y >= 0"]
                return self.graph_service.create_linear_programming_graph(
                    constraints,
                    "maximize x + y",
                    title="ZIMSEC Linear Programming Example"
                )
                
            return None

        except Exception as e:
            logger.error(f"Error creating module graph for {module_id}: {e}")
            return None

    def _process_custom_graph_input(self, user_input: str) -> Optional[str]:
        """Process custom graph input and create appropriate graph"""
        try:
            input_lower = user_input.lower().strip()
            
            # Statistics graphs
            if input_lower.startswith("statistics:") or input_lower.startswith("stats:"):
                data_str = user_input.split(":", 1)[1].strip()
                try:
                    data = [float(x.strip()) for x in data_str.split(",")]
                    graph_type = "histogram"  # Default
                    if "boxplot" in input_lower or "box" in input_lower:
                        graph_type = "boxplot"
                    elif "scatter" in input_lower:
                        graph_type = "scatter"
                    elif "bar" in input_lower:
                        graph_type = "bar"
                    
                    return self.graph_service.create_statistics_graph(
                        data, graph_type, f"Custom Statistics: {graph_type.title()}"
                    )
                except ValueError:
                    return None
            
            # Linear programming
            elif input_lower.startswith("linear:") or input_lower.startswith("lp:"):
                constraints_str = user_input.split(":", 1)[1].strip()
                constraints = [c.strip() for c in constraints_str.split(",")]
                return self.graph_service.create_linear_programming_graph(
                    constraints, "objective", title="Custom Linear Programming"
                )
            
            # Regular functions
            else:
                # Assume it's a mathematical function
                return self.graph_service.create_advanced_function_graph(
                    user_input, f"Custom Function: {user_input}"
                )
                
        except Exception as e:
            logger.error(f"Error processing custom graph input: {e}")
            return None

    def _get_ai_explanation(self, prompt: str) -> str:
        """Get AI explanation using DeepSeek"""
        try:
            # Use the question generator's AI to get explanation
            ai_response = self.question_generator._send_api_request(prompt)
            if ai_response and 'choices' in ai_response:
                return ai_response['choices'][0]['message']['content']
            else:
                return self._get_fallback_explanation()
        except Exception as e:
            logger.error(f"Error getting AI explanation: {e}")
            return self._get_fallback_explanation()

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
            logger.error(f"Error getting graph explanation: {e}")
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
            logger.error(f"Error providing graph tutorial for {user_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error loading tutorial. Please try again.")

    def handle_graph_practice_problems(self, user_id: str, module_id: str):
        """Handle practice problems for a specific graph module"""
        try:
            if module_id not in self.graph_modules:
                return
                
            module_info = self.graph_modules[module_id]
            registration = get_user_registration(user_id)
            user_name = registration['name'] if registration else "Student"
            
            # Generate practice problem using AI
            practice_prompt = f"""
            Create a ZIMSEC O-Level practice problem for {module_info['title']}.
            
            Include:
            1. A clear problem statement
            2. Step-by-step solution approach
            3. Final answer
            4. Common mistakes to avoid
            
            Make it challenging but appropriate for O-Level students.
            """
            
            problem_explanation = self._get_ai_explanation(practice_prompt)
            
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

        except Exception as e:
            logger.error(f"Error generating practice problems for {module_id}: {e}")
            self.whatsapp_service.send_message(user_id, "❌ Error generating practice problems. Please try again.")