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

        # Rate limiting parameters - reduced timeout to prevent worker timeouts
        self.max_retries = 2
        self.base_timeout = 8  # Reduced from 30 to 8 seconds
        self.retry_delay = 1

    def generate_question(self, subject: str, topic: str, difficulty: str) -> Optional[Dict]:
        """Generate a mathematics question using DeepSeek AI"""
        try:
            if not self.api_key:
                logger.error("AI API key not configured")
                return self._generate_fallback_question(subject, topic, difficulty)

            # Create the prompt for DeepSeek AI
            prompt = self._create_question_prompt(subject, topic, difficulty)

            # Send request to DeepSeek API
            question_data = self._send_api_request(prompt)

            if question_data:
                # Validate and format the response
                return self._validate_and_format_question(question_data, subject, topic, difficulty)
            else:
                logger.warning("AI API failed, using fallback")
                return self._generate_fallback_question(subject, topic, difficulty)

        except Exception as e:
            logger.error(f"Error generating math question: {e}")
            return self._generate_fallback_question(subject, topic, difficulty)

    def _create_question_prompt(self, subject: str, topic: str, difficulty: str) -> str:
        """Create a detailed prompt for DeepSeek AI"""

        difficulty_specs = {
            "easy": {
                "description": "Direct application of basic concepts, straightforward calculations, minimal steps",
                "points": 10,
                "complexity": "1-2 steps, basic formulas"
            },
            "medium": {
                "description": "Requires understanding of multiple concepts, moderate calculations, 2-3 steps",
                "points": 20,
                "complexity": "2-3 steps, combine concepts"
            },
            "difficult": {
                "description": "Complex problem-solving, multi-step reasoning, synthesis of several concepts",
                "points": 50,
                "complexity": "4+ steps, deep understanding"
            }
        }

        spec = difficulty_specs[difficulty]

        # Topic-specific guidelines
        topic_guidelines = self._get_topic_guidelines(subject, topic)

        prompt = f"""You are MathMentor, an expert ZIMSEC O-Level Mathematics tutor with deep knowledge of the Zimbabwe curriculum (Forms 1-4, 2015-2024).

TASK: Generate EXACTLY ONE mathematics question for the ZIMSEC O-Level examination.

SPECIFICATIONS:
- Subject: {subject}
- Topic: {topic}
- Difficulty: {difficulty} ({spec['description']})
- Complexity: {spec['complexity']}
- Points: {spec['points']}

TOPIC GUIDELINES:
{topic_guidelines}

CRITICAL REQUIREMENTS:
1. Generate EXACTLY ONE question (never arrays or multiple questions)
2. Follow ZIMSEC O-Level standards and marking schemes
3. Use clear mathematical notation (x², √, ÷, not complex LaTeX)
4. Provide complete step-by-step solutions with explanations
5. Include proper mathematical reasoning at each step
6. Make the question unique and educational
7. Ensure answers can be verified mathematically

MANDATORY JSON FORMAT (single object only):
{{
    "question": "Clear, concise mathematics problem statement appropriate for ZIMSEC O-Level",
    "solution": "Step 1: [Clear explanation of first step]\\nStep 2: [Next logical step with reasoning]\\nStep 3: [Continue until final answer]\\nTherefore: [Final answer with units if applicable]",
    "answer": "Final numerical or algebraic answer only",
    "points": {spec['points']},
    "explanation": "Brief explanation of the mathematical concept being tested",
    "difficulty": "{difficulty}",
    "topic": "{topic}",
    "subject": "{subject}"
}}

EXAMPLE QUALITY STANDARDS:
- Question: Clear, unambiguous, realistic scenario if applicable
- Solution: Each step justified with mathematical reasoning
- Answer: Exact final result (numerical, algebraic, or descriptive)
- All work must be mathematically sound and verifiable

Generate your ZIMSEC-standard {difficulty} {subject} question on {topic} now:"""

        return prompt

    def _get_topic_guidelines(self, subject: str, topic: str) -> str:
        """Get specific guidelines for each topic"""

        guidelines = {
            "Algebra": {
                "Linear Equations": "Focus on solving for unknowns, word problems involving linear relationships",
                "Quadratic Equations": "Include factoring, completing the square, quadratic formula methods",
                "Simultaneous Equations": "Use substitution and elimination methods, practical applications",
                "Inequalities": "Include number line representations, compound inequalities",
                "Factorization": "Cover common factors, difference of squares, trinomial factoring",
                "Algebraic Expressions": "Simplification, substitution, expanding brackets"
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

    def _send_api_request(self, prompt: str) -> Optional[Dict]:
        """Send request to DeepSeek API with retries"""

        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }

        data = {
            'model': 'deepseek-chat',
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': 3000,
            'temperature': 0.7
        }

        for attempt in range(self.max_retries):
            try:
                timeout = self.base_timeout  # Fixed timeout, no increase per attempt
                logger.info(f"AI API attempt {attempt + 1}/{self.max_retries} (timeout: {timeout}s)")

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

                        logger.info(f"✅ Successfully generated question on attempt {attempt + 1}")
                        return question_data
                    else:
                        logger.error("No valid JSON found in AI response")

                else:
                    logger.error(f"AI API error: {response.status_code} - {response.text}")

            except requests.exceptions.Timeout:
                logger.warning(f"AI API timeout on attempt {attempt + 1}/{self.max_retries} (waited {timeout}s)")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                continue

            except requests.exceptions.ConnectionError as e:
                logger.warning(f"AI API connection error: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                continue

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON from AI response: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                continue

            except Exception as e:
                logger.error(f"AI API error on attempt {attempt + 1}: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                continue

        logger.error("All AI API attempts failed, returning None for fallback")
        return None

    def _validate_and_format_question(self, question_data: Dict, subject: str, topic: str, difficulty: str) -> Dict:
        """Validate and format the question response"""
        try:
            # Required fields validation
            required_fields = ['question', 'solution', 'answer']

            for field in required_fields:
                if field not in question_data:
                    logger.error(f"Missing required field: {field}")
                    return self._generate_fallback_question(subject, topic, difficulty)

            # Format the question data
            formatted_question = {
                'question': str(question_data['question']).strip(),
                'solution': str(question_data['solution']).strip(),
                'answer': str(question_data['answer']).strip(),
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