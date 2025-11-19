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

        # Extended timeout and retry parameters for DeepSeek API V3.1 quality generation
        self.max_retries = 3  # More retries for better success rate
        self.base_timeout = 60  # Increased timeout for DeepSeek V3.1
        self.retry_delay = 3   # Reduced delay between retries for faster response

    def generate_question(self, subject: str, topic: str, difficulty: str = 'medium', user_id: str = None) -> Optional[Dict]:
        """
        Generate a question using DeepSeek AI with anti-repetition logic and improved error handling
        """
        try:
            # Get recent AI topics for this user to avoid repetition (simplified)
            recent_topics = set()
            if user_id:
                try:
                    # Try to import question history service for AI anti-repetition
                    from services.question_history_service import question_history_service
                    ai_subject_key = f"{subject}_AI"
                    recent_questions = question_history_service.get_recent_questions(user_id, ai_subject_key)
                    recent_topics = {q.split('_')[0] for q in recent_questions if '_' in q}  # Extract topic from stored format
                except ImportError:
                    # If question history service is not available, continue without anti-repetition
                    logger.info("Question history service not available, continuing without anti-repetition")
                    recent_topics = set()
            
            # Create comprehensive prompt for DeepSeek AI with variation
            prompt = self._create_question_prompt(subject, topic, difficulty, recent_topics)

            # Optimized timeout settings for DeepSeek API V3.1
            if 'graph' in topic.lower():
                timeouts = [45, 60]           # Adequate timeouts for complex graph questions
                max_attempts = 3              # 3 attempts for graph questions
            else:
                timeouts = [30, 45, 60]       # Progressive timeouts for topical questions  
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
                    logger.warning(f"DeepSeek API V3.1 timeout on attempt {attempt + 1}/{max_attempts} (waited {timeout}s)")
                    if attempt < max_attempts - 1:
                        time.sleep(2)  # Reduced retry delay for DeepSeek V3.1
                    continue

                except (requests.exceptions.ConnectionError, requests.exceptions.HTTPError) as e:
                    logger.warning(f"DeepSeek API V3.1 connection error: {e}")
                    if attempt < max_attempts - 1:
                        time.sleep(2)  # Reduced retry delay for DeepSeek V3.1
                    continue

                except Exception as e:
                    logger.error(f"DeepSeek API V3.1 error on attempt {attempt + 1}: {e}")
                    if attempt < max_attempts - 1:
                        time.sleep(2)  # Reduced retry delay for DeepSeek V3.1
                    continue

            # All attempts failed, use local fallback questions
            logger.warning(f"All DeepSeek API attempts failed for {subject}/{topic}, using local fallback questions")
            return self._generate_fallback_question(subject, topic, difficulty)

        except Exception as e:
            logger.error(f"Critical error in generate_question: {e}")
            return self._generate_fallback_question(subject, topic, difficulty)

    def generate_question_with_gemini(self, subject: str, topic: str, difficulty: str = 'medium') -> Optional[Dict]:
        """
        Generate a question using Gemini AI for graph-related topics.
        """
        # Define guidelines for Gemini AI graph questions
        guidelines = {
            "Algebra": {
                "Linear Equations": "Focus on solving for unknowns, word problems involving linear relationships",
                "Quadratic Equations": "Include factoring, completing the square, quadratic formula methods",
                "Simultaneous Equations": "Use substitution and elimination methods, practical applications",
                "Inequalities": "Include number line representations, compound inequalities",
                "Factorization": "Cover common factors, difference of squares, trinomial factoring",
                "Algebraic Expressions": "Simplification, substitution, expanding brackets",
                "Graph - Linear Programming": """Generate questions in this EXACT format:\n\nAnswer the whole of this question on the grid on page 26.\n\n(a) Draw the graphs of these inequalities by shading the unwanted region.\n\n(i) [inequality 1, e.g., 2x+y≤40]\n(ii) [inequality 2, e.g., x+2y≤48] \n(iii) [inequality 3, e.g., x≥0]\n(iv) [inequality 4, e.g., y≥5]\n\n(b) Mark R the region defined by the four inequalities in (a).\n\nThe solution should explain how to plot each inequality and identify the feasible region R."""
            },
            "Geometry": {
                "Angles": "Include angle relationships, parallel lines, triangles, polygons",
                "Triangles": "Properties, congruence, similarity, Pythagorean theorem",
                "Quadrilaterals": "Properties of rectangles, squares, parallelograms, rhombus"
            }
        }
        
        # Use Gemini API details here (placeholder, actual implementation needed)
        # For now, we'll just call the DeepSeek fallback as a placeholder
        logger.info(f"Switching to Gemini AI for graph question generation (topic: {topic})")
        
        # Fallback to DeepSeek for now
        return self.generate_question(subject, topic, difficulty)

    def _create_question_prompt(self, subject: str, topic: str, difficulty: str, recent_topics: set = None) -> str:
        """Create optimized prompt for DeepSeek AI"""
        
        if recent_topics is None:
            recent_topics = set()
        
        difficulty_descriptions = {
            "easy": "Direct application of basic concepts, straightforward calculations, minimal steps",
            "medium": "Requires understanding of multiple concepts, moderate calculations, 2-3 steps",
            "difficult": "Complex problem-solving, multi-step reasoning, synthesis of several concepts"
        }
        
        # Build variation instruction if we have recent topics
        variation_note = ""
        if recent_topics and topic.lower() in [t.lower() for t in recent_topics]:
            variation_note = "\nIMPORTANT: Generate a DIFFERENT question from previous ones on this topic. Vary the numbers, scenario, or approach."
        
        prompt = f"""Generate a high-quality {difficulty} level {subject} question about {topic} for ZIMSEC O-Level students.
{variation_note}
Requirements:
- Create a clear, specific question following ZIMSEC exam format
- Use proper mathematical notation and terminology
- Include specific numbers and realistic scenarios
- Appropriate for {difficulty} difficulty level: {difficulty_descriptions[difficulty]}
- Focus specifically on {topic}
- Question should test understanding, not just recall
- Provide a complete step-by-step solution
- Give the final answer clearly

Return your response in this EXACT JSON format:
{{
    "question": "Your generated question here",
    "solution": "Complete step-by-step solution with clear working",
    "answer": "Final answer only",
    "points": {10 if difficulty == 'easy' else 20 if difficulty == 'medium' else 50},
    "explanation": "Brief explanation of the concept being tested"
}}

Generate the question now:"""

        return prompt

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
            'temperature': 0.85  # Increased for more creative variation and diversity
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
                if 'choices' not in result or len(result['choices']) == 0:
                    logger.error(f"Invalid API response format: {result}")
                    return None
                    
                content = result['choices'][0]['message']['content']
                logger.info(f"Raw DeepSeek response: {content[:200]}...")

                # Extract JSON from response with better error handling
                json_start = content.find('{')
                json_end = content.rfind('}') + 1

                if json_start >= 0 and json_end > json_start:
                    json_str = content[json_start:json_end]
                    try:
                        question_data = json.loads(json_str)
                        logger.info(f"✅ Successfully generated question: {question_data.get('question', '')[:100]}...")
                        return question_data
                    except json.JSONDecodeError as e:
                        logger.error(f"JSON parsing failed: {e}. Raw JSON: {json_str[:200]}...")
                        return None
                else:
                    logger.error(f"No valid JSON found in AI response. Content: {content[:500]}...")
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


            if len(formatted_question['solution']) < 20:
                logger.error("Solution too short")
                return self._generate_fallback_question(subject, topic, difficulty)

            # Add to history service if user provided and question was successfully generated
            if user_id and formatted_question and formatted_question.get('question'):
                try:
                    from services.question_history_service import question_history_service
                    ai_subject_key = f"{subject}_AI"
                    question_identifier = f"{topic}_{difficulty}_{hash(formatted_question['question'][:50]) % 10000}"

                    # Add both ID and text to history
                    question_history_service.add_question_to_history(user_id, ai_subject_key, question_identifier)
                    question_history_service.add_question_text_to_history(
                        user_id, subject, topic, difficulty, formatted_question['question']
                    )
                    logger.info(f"Added AI question to history: {question_identifier} with text tracking")
                except ImportError:
                    # If question history service is not available, skip history tracking
                    logger.info("Question history service not available, skipping history tracking")

            logger.info(f"Successfully validated AI question: {formatted_question['question'][:50]}...")
            return formatted_question

        except Exception as e:
            logger.error(f"Error validating question: {e}")
            return self._generate_fallback_question(subject, topic, difficulty)

    def _generate_fallback_question(self, subject: str, topic: str, difficulty: str) -> Dict:
        """Generate fallback questions when DeepSeek API fails"""

        fallback_questions = {
            "Statistics": {
                "easy": {
                    "question": "Find the mean of the following data: 5, 8, 12, 15, 20",
                    "solution": "Step 1: Add all the values\n5 + 8 + 12 + 15 + 20 = 60\n\nStep 2: Count the number of values\nThere are 5 values\n\nStep 3: Calculate the mean\nMean = Sum ÷ Number of values\nMean = 60 ÷ 5 = 12\n\nTherefore: The mean is 12",
                    "answer": "12",
                    "points": 10
                },
                "medium": {
                    "question": "The scores of 10 students in a test are: 45, 52, 48, 61, 55, 49, 58, 47, 53, 62. Find the median score.",
                    "solution": "Step 1: Arrange the scores in ascending order\n45, 47, 48, 49, 52, 53, 55, 58, 61, 62\n\nStep 2: Find the middle value(s)\nSince there are 10 values (even number), the median is the average of the 5th and 6th values\n\nStep 3: Identify the 5th and 6th values\n5th value = 52\n6th value = 53\n\nStep 4: Calculate the median\nMedian = (52 + 53) ÷ 2 = 105 ÷ 2 = 52.5\n\nTherefore: The median score is 52.5",
                    "answer": "52.5",
                    "points": 20
                },
                "difficult": {
                    "question": "Calculate the standard deviation of the data set: 10, 12, 14, 16, 18",
                    "solution": "Step 1: Calculate the mean\nMean = (10 + 12 + 14 + 16 + 18) ÷ 5 = 70 ÷ 5 = 14\n\nStep 2: Calculate deviations from mean\n(10-14)² = 16\n(12-14)² = 4\n(14-14)² = 0\n(16-14)² = 4\n(18-14)² = 16\n\nStep 3: Calculate variance\nVariance = (16 + 4 + 0 + 4 + 16) ÷ 5 = 40 ÷ 5 = 8\n\nStep 4: Calculate standard deviation\nStandard deviation = √8 = 2.83\n\nTherefore: The standard deviation is 2.83",
                    "answer": "2.83",
                    "points": 50
                }
            },
            "Algebra": {
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
                },
                "difficult": {
                    "question": "Solve the quadratic equation: x² - 5x + 6 = 0",
                    "solution": "Step 1: Factor the quadratic\nx² - 5x + 6 = 0\nLook for two numbers that multiply to 6 and add to -5\n-2 and -3 work: (-2) × (-3) = 6 and (-2) + (-3) = -5\n\nStep 2: Write in factored form\n(x - 2)(x - 3) = 0\n\nStep 3: Use zero product property\nx - 2 = 0  or  x - 3 = 0\nx = 2  or  x = 3\n\nTherefore: x = 2 or x = 3",
                    "answer": "x = 2 or x = 3",
                    "points": 30
                }
            },
            "Geometry": {
                "easy": {
                    "question": "Find the area of a rectangle with length 8 cm and width 5 cm.",
                    "solution": "Step 1: Use the area formula for a rectangle\nArea = length × width\n\nStep 2: Substitute the values\nArea = 8 × 5\nArea = 40\n\nTherefore: The area is 40 cm²",
                    "answer": "40 cm²",
                    "points": 10
                },
                "medium": {
                    "question": "Find the area of a triangle with base 12 cm and height 8 cm.",
                    "solution": "Step 1: Use the area formula for a triangle\nArea = ½ × base × height\n\nStep 2: Substitute the values\nArea = ½ × 12 × 8\nArea = ½ × 96\nArea = 48\n\nTherefore: The area is 48 cm²",
                    "answer": "48 cm²",
                    "points": 20
                },
                "difficult": {
                    "question": "Find the area of a circle with radius 7 cm. (Use π = 22/7)",
                    "solution": "Step 1: Use the area formula for a circle\nArea = πr²\n\nStep 2: Substitute the values\nArea = (22/7) × 7²\nArea = (22/7) × 49\nArea = 22 × 7\nArea = 154\n\nTherefore: The area is 154 cm²",
                    "answer": "154 cm²",
                    "points": 30
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
                },
                "difficult": {
                    "question": "Solve for θ in the range 0° ≤ θ ≤ 360°: 2sin θ = 1",
                    "solution": "Step 1: Solve for sin θ\n2sin θ = 1\nsin θ = ½\n\nStep 2: Find angles where sin θ = ½\nIn the range 0° ≤ θ ≤ 360°:\nθ = 30° (first quadrant)\nθ = 150° (second quadrant)\n\nStep 3: Verify both solutions\nsin 30° = ½ ✓\nsin 150° = ½ ✓\n\nTherefore: θ = 30° or θ = 150°",
                    "answer": "θ = 30° or θ = 150°",
                    "points": 30
                }
            }
        }

        # Get fallback question or create a basic one
        try:
            # First try to get by exact topic match
            fallback = fallback_questions.get(topic, {}).get(difficulty)
            
            # If not found, try by subject
            if not fallback:
                fallback = fallback_questions.get(subject, {}).get(difficulty)
            
            # If still not found, try any difficulty level for the topic
            if not fallback:
                for diff in ['easy', 'medium', 'difficult']:
                    fallback = fallback_questions.get(topic, {}).get(diff)
                    if fallback:
                        break
            
            # If still not found, try any difficulty level for the subject
            if not fallback:
                for diff in ['easy', 'medium', 'difficult']:
                    fallback = fallback_questions.get(subject, {}).get(diff)
                    if fallback:
                        break

            if not fallback:
                # Create a very basic fallback based on difficulty
                if difficulty == 'easy':
                    fallback = {
                        "question": f"Solve for x: x + 3 = 8",
                        "solution": "Step 1: Subtract 3 from both sides\nx + 3 - 3 = 8 - 3\nx = 5\n\nTherefore: x = 5",
                        "answer": "x = 5",
                        "points": 10
                    }
                elif difficulty == 'medium':
                    fallback = {
                        "question": f"Solve for x: 2x - 4 = 10",
                        "solution": "Step 1: Add 4 to both sides\n2x - 4 + 4 = 10 + 4\n2x = 14\n\nStep 2: Divide both sides by 2\n2x ÷ 2 = 14 ÷ 2\nx = 7\n\nTherefore: x = 7",
                        "answer": "x = 7",
                        "points": 20
                    }
                else:  # difficult
                    fallback = {
                        "question": f"Solve for x: x² - 3x - 4 = 0",
                        "solution": "Step 1: Factor the quadratic\nx² - 3x - 4 = 0\nLook for two numbers that multiply to -4 and add to -3\n-4 and 1 work: (-4) × 1 = -4 and (-4) + 1 = -3\n\nStep 2: Write in factored form\n(x - 4)(x + 1) = 0\n\nStep 3: Use zero product property\nx - 4 = 0  or  x + 1 = 0\nx = 4  or  x = -1\n\nTherefore: x = 4 or x = -1",
                        "answer": "x = 4 or x = -1",
                        "points": 30
                    }

            # Add metadata
            fallback.update({
                'explanation': f'This is a {difficulty} level {topic} problem from our local question bank.',
                'difficulty': difficulty,
                'topic': topic,
                'subject': subject,
                'generated_at': datetime.now().isoformat(),
                'source': 'fallback'
            })

            logger.info(f"✅ Generated fallback question for {subject}/{topic}/{difficulty}")
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