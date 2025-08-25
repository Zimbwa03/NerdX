#!/usr/bin/env python3
"""
Mathematics Question Generator using DeepSeek AI
Generates ZIMSEC-style mathematics questions with step-by-step solutions
"""

import logging
import os
import json
import requests
import time
from typing import Dict, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class MathQuestionGenerator:
    """DeepSeek AI-powered mathematics question generator"""

    def __init__(self):
        self.api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.api_url = 'https://api.deepseek.com/chat/completions'

        # Extended timeout and retry parameters for DeepSeek API quality generation
        self.max_retries = 3  # More retries for better success rate
        self.base_timeout = 30  # Much longer timeout for DeepSeek API quality generation
        self.retry_delay = 3   # Longer delay between retries

    def generate_question(self, subject: str, topic: str, difficulty: str = 'medium', user_id: str = None) -> Optional[Dict]:
        """
        Generate a question using DeepSeek AI with anti-repetition logic and improved error handling
        """
        try:
            # Import question history service for AI anti-repetition
            from services.question_history_service import question_history_service
            
            # Get recent AI topics for this user to avoid repetition
            recent_topics = set()
            if user_id:
                ai_subject_key = f"{subject}_AI"
                recent_questions = question_history_service.get_recent_questions(user_id, ai_subject_key)
                recent_topics = {q.split('_')[0] for q in recent_questions if '_' in q}  # Extract topic from stored format
            
            # Create comprehensive prompt for DeepSeek AI with variation
            prompt = self._create_question_prompt(subject, topic, difficulty, recent_topics)

            # Balanced timeout settings for DeepSeek API - quality vs responsiveness
            if 'graph' in topic.lower():
                timeouts = [20, 30, 40]       # Reasonable timeouts for graph questions
                max_attempts = 3              # 3 attempts for graph questions
            else:
                timeouts = [15, 25, 35]       # Standard timeouts for topical questions  
                max_attempts = 3              # 3 attempts for quality generation

            for attempt in range(max_attempts):
                timeout = timeouts[min(attempt, len(timeouts) - 1)]
                logger.info(f"AI API attempt {attempt + 1}/{max_attempts} (timeout: {timeout}s)")

                try:
                    # Make request to DeepSeek AI with progressive timeout
                    response = self._send_api_request(prompt, timeout)

                    if response:
                        # Validate and format response
                        question_data = self._validate_and_format_question(response, subject, topic, difficulty, user_id)
                        if question_data:
                            logger.info(f"✅ Successfully generated question for {subject}/{topic} on attempt {attempt + 1}")
                            return question_data
                        else:
                            logger.warning(f"Question validation failed on attempt {attempt + 1}")

                except requests.exceptions.Timeout:
                    logger.warning(f"AI API timeout on attempt {attempt + 1}/{max_attempts} (waited {timeout}s)")
                    if attempt < max_attempts - 1:
                        time.sleep(self.retry_delay)  # Use configured retry delay
                    continue

                except (requests.exceptions.ConnectionError, requests.exceptions.HTTPError) as e:
                    logger.warning(f"AI API connection error: {e}")
                    if attempt < max_attempts - 1:
                        time.sleep(self.retry_delay)  # Use configured retry delay
                    continue

                except Exception as e:
                    logger.error(f"AI API error on attempt {attempt + 1}: {e}")
                    if attempt < max_attempts - 1:
                        time.sleep(self.retry_delay)  # Use configured retry delay
                    continue

            # All attempts failed, use local fallback questions
            logger.warning("All AI API attempts failed, using local fallback questions")
            return self._generate_fallback_question(subject, topic, difficulty)

        except Exception as e:
            logger.error(f"Critical error in generate_question: {e}")
            return self._generate_fallback_question(subject, topic, difficulty)

    def generate_question_with_gemini(self, subject: str, topic: str, difficulty: str = 'medium') -> Optional[Dict]:
        """
        Generate a question using Gemini AI for graph-related topics.
        """
        try:
            # Create prompt for Gemini AI, specifically for graph questions
            prompt = self._create_question_prompt(subject, topic, difficulty)

            # Use Gemini API details here (placeholder, actual implementation needed)
            # For now, we'll just call the DeepSeek fallback as a placeholder
            logger.info(f"Switching to Gemini AI for graph question generation (topic: {topic})")
            return self._generate_fallback_question(subject, topic, difficulty) # Placeholder for Gemini API call

        except Exception as e:
            logger.error(f"Critical error in generate_question_with_gemini: {e}")
            return self._generate_fallback_question(subject, topic, difficulty)


    def _create_question_prompt(self, subject: str, topic: str, difficulty: str, recent_topics: set = None) -> str:
        """Create optimized prompt for DeepSeek AI with enhanced ZIMSEC graph support and anti-repetition"""

        # Enhanced prompts for different subjects and topics
        if 'graph' in topic.lower() or 'linear programming' in topic.lower():
            # Specific prompts for each remaining graph module
            if 'linear functions' in topic.lower() or 'straight lines' in topic.lower():
                return f"""Generate a ZIMSEC O-Level Mathematics question about Linear Functions and Straight Lines.

CRITICAL: You MUST include a specific linear equation in the format y = mx + c in your question.

Requirements:
- Use specific numerical coefficients (integers or simple fractions)
- Choose from these formats: y = 2x + 3, y = -x + 4, y = 0.5x - 2, y = 3x - 1, y = -2x + 5
- Ask students to plot the line and identify key features
- Include instructions to find intercepts, gradient, or specific points
- Difficulty level: {difficulty}
- Use ZIMSEC exam format

MANDATORY: Your question MUST contain a specific equation like "y = 2x + 3" that can be extracted for graph plotting.

Example: "Plot the graph of y = 2x + 3. Mark the y-intercept clearly and find where the line crosses the x-axis."

Return your response in this EXACT JSON format:
{{
    "question": "Your generated linear functions question with specific equation",
    "solution": "Complete step-by-step solution showing how to plot the graph and find intercepts",
    "answer": "Final answer with coordinates",
    "points": 15,
    "explanation": "Testing understanding of linear functions and graphing skills"
}}"""

            elif 'quadratic' in topic.lower() or 'parabola' in topic.lower():
                return f"""Generate a ZIMSEC O-Level Mathematics question about Quadratic Functions and Parabolas.

CRITICAL: You MUST include a specific quadratic equation in the format y = ax² + bx + c in your question.

Requirements:
- Use specific numerical coefficients (integers only)
- Choose from these formats: y = x² - 4x + 3, y = -x² + 2x + 3, y = 2x² - 6x + 4, y = x² + 2x - 3, y = -x² + 4x - 3
- Ask students to sketch the parabola and find key features
- Include instructions to find vertex, roots, y-intercept, or turning point
- Difficulty level: {difficulty}
- Use ZIMSEC exam format

MANDATORY: Your question MUST contain a specific equation like "y = x² - 4x + 3" that can be extracted for graph plotting.

Example: "Sketch the graph of y = x² - 4x + 3. Find and mark the vertex, y-intercept, and x-intercepts on your graph."

Return your response in this EXACT JSON format:
{{
    "question": "Your generated quadratic functions question with specific equation",
    "solution": "Complete step-by-step solution showing how to find vertex, intercepts and sketch the parabola",
    "answer": "Final answer with all key coordinates",
    "points": 20,
    "explanation": "Testing understanding of quadratic functions and parabola properties"
}}"""

            elif 'trigonometric' in topic.lower():
                return f"""Generate a ZIMSEC O-Level Mathematics question about Trigonometric Functions.

CRITICAL: You MUST include a specific trigonometric equation that can be plotted.

Requirements:
- Use specific trigonometric functions with clear coefficients
- Choose from these formats: y = sin(x), y = cos(x), y = 2sin(x), y = 3cos(x), y = sin(2x), y = cos(x/2)
- Ask students to plot the graph for a specific range (0° to 360° or 0 to 2π)
- Include instructions to mark key points like maximum, minimum, or period
- Difficulty level: {difficulty}
- Use ZIMSEC exam format

MANDATORY: Your question MUST contain a specific equation like "y = sin(x)" or "y = 2cos(x)" that can be extracted for graph plotting.

Example: "Plot y = sin(x) for x from 0° to 360°. Mark the maximum and minimum points clearly and state the period."

Return your response in this EXACT JSON format:
{{
    "question": "Your generated trigonometric functions question with specific equation",
    "solution": "Complete step-by-step solution showing how to plot the trigonometric graph",
    "answer": "Final answer with key coordinates and points",
    "points": 15,
    "explanation": "Testing understanding of trigonometric functions and their graphs"
}}"""

            elif 'linear programming' in topic.lower():
                return f"""Generate a ZIMSEC O-Level Mathematics Linear Programming question.

CRITICAL: You MUST include specific constraints that can be extracted and plotted.

Use this exact format:
"Answer the whole of this question on the grid.

(a) Draw the graphs of these inequalities by shading the unwanted region.

(i) [constraint like: 2x + y ≤ 12]
(ii) [constraint like: x + 2y ≤ 10] 
(iii) x ≥ 0
(iv) y ≥ 1

(b) Mark R the region defined by the four inequalities in (a)."

Requirements:
- Use realistic integer coefficients (keep numbers small: 1-5 range)
- Choose from constraint formats: 2x + y ≤ 12, x + 3y ≤ 15, 3x + 2y ≤ 18
- Always include x ≥ 0 and y ≥ [small number like 1, 2, or 3]
- Difficulty level: {difficulty}
- Follow ZIMSEC exam format exactly

MANDATORY: Your constraints must be extractable as separate inequalities for graph plotting.

Example: "2x + y ≤ 12, x + 2y ≤ 10, x ≥ 0, y ≥ 1"

Return your response in this EXACT JSON format:
{{
    "question": "Your generated linear programming question with specific constraints",
    "solution": "Complete step-by-step solution showing how to plot constraints and identify feasible region",
    "answer": "Final answer identifying the feasible region R with vertices",
    "points": 25,
    "explanation": "Testing understanding of linear programming and constraint visualization"
}}"""

        # Enhanced standard academic question prompt for non-graph topics with anti-repetition
        base_prompt = f"""Generate a high-quality {difficulty} level {subject} question about {topic} for ZIMSEC O-Level students.

Requirements:
- Create a clear, specific question following ZIMSEC exam format
- Use proper mathematical notation and terminology
- Include specific numbers and realistic scenarios
- Appropriate for {difficulty} difficulty level
- Focus specifically on {topic}
- Question should test understanding, not just recall
- Provide a complete step-by-step solution
- Give the final answer clearly"""

        # Add anti-repetition instructions if recent topics available
        if recent_topics:
            variation_prompt = f"""

CRITICAL ANTI-REPETITION REQUIREMENTS:
- This user has recently practiced: {', '.join(recent_topics)}
- Create a DIFFERENT approach, angle, or sub-topic variation
- Use different numerical values and scenarios
- Vary the question structure and focus area
- Ensure this question feels fresh and unique"""
            base_prompt += variation_prompt

        # Add randomization instructions
        import random
        variation_styles = [
            "Focus on real-world applications and practical scenarios",
            "Emphasize step-by-step calculations and working out",
            "Include multiple parts with increasing difficulty",
            "Test both calculation skills and conceptual understanding",
            "Create a problem-solving scenario with context"
        ]
        
        selected_style = random.choice(variation_styles)
        base_prompt += f"\n- {selected_style}"

        base_prompt += f"""

Return your response in this EXACT JSON format:
{{
    "question": "Your generated question here",
    "solution": "Complete step-by-step solution with clear working",
    "answer": "Final answer only",
    "points": 10,
    "explanation": "Brief explanation of the concept being tested"
}}

Generate the question now:"""

        return base_prompt

    def _get_topic_guidelines(self, subject: str, topic: str) -> str:
        """Get specific guidelines for each topic"""

        guidelines = {
            "Algebra": {
                "Linear Equations": "Focus on solving for unknowns, word problems involving linear relationships",
                "Quadratic Equations": "Include factoring, completing the square, quadratic formula methods",
                "Simultaneous Equations": "Use substitution and elimination methods, practical applications",
                "Inequalities": "Include number line representations, compound inequalities",
                "Factorization": "Cover common factors, difference of squares, trinomial factoring",
                "Algebraic Expressions": "Simplification, substitution, expanding brackets",
                "Graph - Linear Programming": """Generate questions in this EXACT format:

Answer the whole of this question on the grid on page 26.

(a) Draw the graphs of these inequalities by shading the unwanted region.

(i) [inequality 1, e.g., 2x+y≤40]
(ii) [inequality 2, e.g., x+2y≤48] 
(iii) [inequality 3, e.g., x≥0]
(iv) [inequality 4, e.g., y≥5]

(b) Mark R the region defined by the four inequalities in (a).

The solution should explain how to plot each inequality and identify the feasible region R."""
            },
            "Geometry": {
                "Angles": "Include angle relationships, parallel lines, triangles, polygons",
                "Triangles": "Properties, congruence, similarity, Pythagorean theorem",
                "Quadrilaterals": "Properties of rectangles, squares, parallelograms, rhombus",
                "Circles": "Circumference, area, arc length, sector area, circle theorems",
                "Area and Perimeter": "Composite shapes, optimization problems",
                "Volume and Surface Area": "3D shapes - prisms, pyramids, cylinders, spheres"
            },
            "Trigonometry": {
                "Basic Trigonometry": "SOH-CAH-TOA, basic ratios in right triangles",
                "Trigonometric Ratios": "sin, cos, tan for angles 0° to 360°",
                "Solving Triangles": "Sine rule, cosine rule, area of triangles",
                "Trigonometric Identities": "Basic identities, simplification",
                "Graphs of Trigonometric Functions": "Amplitude, period, phase shifts"
            },
            "Statistics": {
                "Data Collection": "Sampling methods, surveys, bias",
                "Frequency Tables": "Grouped data, histograms, frequency polygons",
                "Measures of Central Tendency": "Mean, median, mode for grouped and ungrouped data",
                "Probability": "Basic probability, compound events, tree diagrams",
                "Graphs and Charts": "Bar charts, pie charts, scatter plots",
                "Correlation": "Positive/negative correlation, line of best fit"
            },
            "Number Theory": {
                "Real Numbers": "Classification, operations, properties",
                "Rational Numbers": "Fractions, decimals, percentage conversions",
                "Irrational Numbers": "Surds, square roots, simplification",
                "Number Sequences": "Arithmetic, geometric progressions",
                "Indices and Logarithms": "Laws of indices, logarithmic equations",
                "Standard Form": "Scientific notation, calculations"
            },
            "Calculus": {
                "Functions": "Domain, range, composition, inverse functions",
                "Limits": "Basic limits, continuity concepts",
                "Differentiation": "Rules of differentiation, applications",
                "Integration": "Basic integration, definite integrals",
                "Applications of Calculus": "Rate of change, optimization",
                "Curve Sketching": "Using derivatives to analyze graphs"
            }
        }

        return guidelines.get(subject, {}).get(topic, f"Focus on {topic} concepts appropriate for ZIMSEC O-Level standard")

    def _send_api_request(self, prompt: str, timeout: int = 30) -> Optional[Dict]:
        """Send request to DeepSeek API with configurable timeout"""

        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }

        data = {
            'model': 'deepseek-chat',
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': 2500,  # Increased for detailed solutions
            'temperature': 0.7
        }

        try:
            response = requests.post(
                self.api_url,
                headers=headers,
                json=data,
                timeout=timeout
            )

            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']

                # Extract JSON from response
                json_start = content.find('{')
                json_end = content.rfind('}') + 1

                if json_start >= 0 and json_end > json_start:
                    json_str = content[json_start:json_end]
                    question_data = json.loads(json_str)

                    logger.info(f"✅ Successfully generated question")
                    return question_data
                else:
                    logger.error("No valid JSON found in AI response")
                    return None
            else:
                logger.error(f"AI API error: {response.status_code} - {response.text}")
                return None

        except requests.exceptions.Timeout:
            logger.warning(f"AI API request timed out after {timeout}s")
            return None
        except requests.exceptions.ConnectionError as e:
            logger.warning(f"AI API connection error: {e}")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from AI response: {e}")
            return None
        except Exception as e:
            logger.error(f"An unexpected error occurred during AI API request: {e}")
            return None

    def _validate_and_format_question(self, question_data: Dict, subject: str, topic: str, difficulty: str, user_id: str = None) -> Dict:
        """Validate and format the question response"""
        try:
            # Required fields validation - 'answer' is optional as it's often included in solution
            required_fields = ['question', 'solution']

            for field in required_fields:
                if field not in question_data or not question_data[field]:
                    logger.error(f"Missing or empty required field: {field}")
                    return self._generate_fallback_question(subject, topic, difficulty)

            # Format the question data with safe handling of optional fields
            formatted_question = {
                'question': str(question_data['question']).strip(),
                'solution': str(question_data['solution']).strip(),
                'answer': str(question_data.get('answer', 'See solution above')).strip(),
                'points': question_data.get('points', 10),
                'explanation': question_data.get('explanation', 'No explanation provided'),
                'difficulty': difficulty,
                'topic': topic,
                'subject': subject,
                'generated_at': datetime.now().isoformat(),
                'source': 'ai_generated'
            }

            # Validation checks
            if len(formatted_question['question']) < 10:
                logger.error("Question too short")
                return self._generate_fallback_question(subject, topic, difficulty)

            if len(formatted_question['solution']) < 20:
                logger.error("Solution too short")
                return self._generate_fallback_question(subject, topic, difficulty)

            # Add to history service if user provided and question was successfully generated
            if user_id and formatted_question and formatted_question.get('question'):
                from services.question_history_service import question_history_service
                ai_subject_key = f"{subject}_AI"
                question_identifier = f"{topic}_{difficulty}_{hash(formatted_question['question'][:50]) % 10000}"
                question_history_service.add_question_to_history(user_id, ai_subject_key, question_identifier)
                logger.info(f"Added AI question to history: {question_identifier}")

            logger.info(f"Successfully validated AI question: {formatted_question['question'][:50]}...")
            return formatted_question

        except Exception as e:
            logger.error(f"Error validating question: {e}")
            return self._generate_fallback_question(subject, topic, difficulty)

    def _generate_fallback_question(self, subject: str, topic: str, difficulty: str) -> Dict:
        """Generate fallback questions when DeepSeek API fails"""

        fallback_questions = {
            "Algebra": {
                "Linear Equations": {
                    "easy": {
                        "question": "Solve for x: 3x + 7 = 22",
                        "solution": "Step 1: Subtract 7 from both sides\n3x + 7 - 7 = 22 - 7\n3x = 15\n\nStep 2: Divide both sides by 3\n3x ÷ 3 = 15 ÷ 3\nx = 5\n\nTherefore: x = 5",
                        "answer": "x = 5",
                        "points": 10
                    },
                    "medium": {
                        "question": "Solve for x: 2(x - 3) = 4x + 8",
                        "solution": "Step 1: Expand the left side\n2(x - 3) = 2x - 6\n\nStep 2: Set up the equation\n2x - 6 = 4x + 8\n\nStep 3: Collect like terms\n2x - 4x = 8 + 6\n-2x = 14\n\nStep 4: Divide by -2\nx = -7\n\nTherefore: x = -7",
                        "answer": "x = -7",
                        "points": 20
                    }
                },
                "Trigonometry": {
                    "easy": {
                        "question": "If sin θ = 0.6 and θ is an acute angle, find cos θ.",
                        "solution": "Step 1: Use the Pythagorean identity\nsin²θ + cos²θ = 1\n\nStep 2: Substitute sin θ = 0.6\n(0.6)² + cos²θ = 1\n0.36 + cos²θ = 1\n\nStep 3: Solve for cos²θ\ncos²θ = 1 - 0.36 = 0.64\n\nStep 4: Take the square root\ncos θ = ±√0.64 = ±0.8\n\nStep 5: Since θ is acute, cos θ is positive\nTherefore: cos θ = 0.8",
                        "answer": "cos θ = 0.8",
                        "points": 15
                    },
                    "medium": {
                        "question": "A ladder 5m long leans against a wall. If the foot of the ladder is 3m from the wall, find the angle the ladder makes with the ground.",
                        "solution": "Step 1: Draw a right triangle\n- Hypotenuse = ladder = 5m\n- Adjacent side = distance from wall = 3m\n- We need to find the angle with the ground\n\nStep 2: Use cosine ratio\ncos θ = adjacent/hypotenuse = 3/5 = 0.6\n\nStep 3: Find the angle\nθ = cos⁻¹(0.6)\nθ = 53.13°\n\nTherefore: The ladder makes an angle of 53.13° with the ground",
                        "answer": "53.13°",
                        "points": 20
                    }
                }
            }
        }

        # Get fallback question or create a basic one
        try:
            fallback = fallback_questions.get(subject, {}).get(topic, {}).get(difficulty)

            if not fallback:
                # Create a very basic fallback
                fallback = {
                    "question": f"Basic {topic} question: Find the value of x if x + 5 = 12",
                    "solution": "Step 1: Subtract 5 from both sides\nx + 5 - 5 = 12 - 5\nx = 7\n\nTherefore: x = 7",
                    "answer": "x = 7",
                    "points": 10
                }

            # Add metadata
            fallback.update({
                'explanation': f'This is a {difficulty} level {topic} problem.',
                'difficulty': difficulty,
                'topic': topic,
                'subject': subject,
                'generated_at': datetime.now().isoformat(),
                'source': 'fallback'
            })

            logger.info(f"Generated fallback question for {subject}/{topic}/{difficulty}")
            return fallback

        except Exception as e:
            logger.error(f"Error generating fallback question: {e}")
            return {
                'question': 'Sample question: What is 2 + 2?',
                'solution': 'Step 1: Add the numbers\n2 + 2 = 4\n\nTherefore: 4',
                'answer': '4',
                'points': 10,
                'explanation': 'Basic arithmetic',
                'difficulty': difficulty,
                'topic': topic,
                'subject': subject,
                'generated_at': datetime.now().isoformat(),
                'source': 'emergency_fallback'
            }

# Global math question generator instance
math_question_generator = MathQuestionGenerator()