#!/usr/bin/env python3
"""
Standalone Mathematics Question Generator using DeepSeek AI V3.1
No external dependencies - works independently
"""

import os
import json
import requests
import time
import logging
from typing import Dict, List, Optional
from datetime import datetime
from utils.deepseek import get_deepseek_chat_model

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class StandaloneMathGenerator:
    """Standalone DeepSeek AI-powered mathematics question generator"""

    def __init__(self):
        self.api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.api_url = 'https://api.deepseek.com/chat/completions'
        self.deepseek_model = get_deepseek_chat_model()

        # Optimized settings for DeepSeek API V3.1
        self.max_retries = 3
        self.timeouts = [30, 45, 60]  # Progressive timeouts
        self.retry_delay = 2

    def generate_question(self, subject: str, topic: str, difficulty: str = 'medium', user_id: str = None) -> Optional[Dict]:
        """
        Generate a mathematics question using DeepSeek AI V3.1
        """
        try:
            if not self.api_key:
                logger.error("DEEPSEEK_API_KEY not found in environment")
                return self._generate_fallback_question(subject, topic, difficulty)

            # Create optimized prompt for DeepSeek V3.1
            prompt = self._create_question_prompt(subject, topic, difficulty)

            # Try with progressive timeouts
            for attempt in range(self.max_retries):
                timeout = self.timeouts[min(attempt, len(self.timeouts) - 1)]
                logger.info(f"DeepSeek V3.1 attempt {attempt + 1}/{self.max_retries} (timeout: {timeout}s)")

                try:
                    response = self._send_api_request(prompt, timeout)

                    if response:
                        question_data = self._validate_and_format_question(response, subject, topic, difficulty)
                        if question_data:
                            logger.info(f"✅ Successfully generated {difficulty} {topic} question on attempt {attempt + 1}")
                            return question_data
                        else:
                            logger.warning(f"Question validation failed on attempt {attempt + 1}")

                except requests.exceptions.Timeout:
                    logger.warning(f"DeepSeek V3.1 timeout on attempt {attempt + 1}/{self.max_retries} (waited {timeout}s)")
                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay)
                    continue

                except (requests.exceptions.ConnectionError, requests.exceptions.HTTPError) as e:
                    logger.warning(f"DeepSeek V3.1 connection error: {e}")
                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay)
                    continue

                except Exception as e:
                    logger.error(f"DeepSeek V3.1 error on attempt {attempt + 1}: {e}")
                    if attempt < self.max_retries - 1:
                        time.sleep(self.retry_delay)
                    continue

            # All attempts failed, use fallback
            logger.warning(f"All DeepSeek V3.1 attempts failed for {subject}/{topic}, using fallback")
            return self._generate_fallback_question(subject, topic, difficulty)

        except Exception as e:
            logger.error(f"Critical error in generate_question: {e}")
            return self._generate_fallback_question(subject, topic, difficulty)

    def _create_question_prompt(self, subject: str, topic: str, difficulty: str) -> str:
        """Create optimized prompt for DeepSeek V3.1"""
        
        difficulty_descriptions = {
            "easy": "Direct application of basic concepts, straightforward calculations, minimal steps",
            "medium": "Requires understanding of multiple concepts, moderate calculations, 2-3 steps",
            "difficult": "Complex problem-solving, multi-step reasoning, synthesis of several concepts"
        }

        prompt = f"""Generate a high-quality {difficulty} level {subject} question about {topic} for ZIMSEC O-Level students.

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
        """Send request to DeepSeek API V3.1"""

        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }

        data = {
            'model': self.deepseek_model,
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': 2500,
            'temperature': 0.7,
            'stream': False
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
                logger.info(f"Raw DeepSeek V3.1 response: {content[:200]}...")

                # Extract JSON from response
                json_start = content.find('{')
                json_end = content.rfind('}') + 1

                if json_start >= 0 and json_end > json_start:
                    json_str = content[json_start:json_end]
                    try:
                        question_data = json.loads(json_str)
                        logger.info(f"✅ Successfully parsed JSON from DeepSeek V3.1")
                        return question_data
                    except json.JSONDecodeError as e:
                        logger.error(f"JSON parsing failed: {e}. Raw JSON: {json_str[:200]}...")
                        return None
                else:
                    logger.error(f"No valid JSON found in AI response. Content: {content[:500]}...")
                    return None
            else:
                logger.error(f"DeepSeek V3.1 API error: {response.status_code} - {response.text}")
                return None

        except requests.exceptions.Timeout:
            logger.warning(f"DeepSeek V3.1 API request timed out after {timeout}s")
            return None
        except requests.exceptions.ConnectionError as e:
            logger.warning(f"DeepSeek V3.1 API connection error: {e}")
            return None
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from DeepSeek V3.1 response: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error during DeepSeek V3.1 API request: {e}")
            return None

    def _validate_and_format_question(self, question_data: Dict, subject: str, topic: str, difficulty: str) -> Optional[Dict]:
        """Validate and format the question response"""
        try:
            # Required fields validation
            required_fields = ['question', 'solution']

            for field in required_fields:
                if field not in question_data or not question_data[field]:
                    logger.error(f"Missing or empty required field: {field}")
                    return None

            # Format the question data
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
                'source': 'deepseek_v3.1'
            }

            # Validation checks
            if len(formatted_question['question']) < 10:
                logger.error("Question too short")
                return None

            if len(formatted_question['solution']) < 20:
                logger.error("Solution too short")
                return None

            logger.info(f"Successfully validated DeepSeek V3.1 question: {formatted_question['question'][:50]}...")
            return formatted_question

        except Exception as e:
            logger.error(f"Error validating question: {e}")
            return None

    def _generate_fallback_question(self, subject: str, topic: str, difficulty: str) -> Dict:
        """Generate fallback questions when DeepSeek API fails"""

        fallback_questions = {
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
                    "points": 30
                }
            }
        }

        # Get fallback question
        try:
            fallback = fallback_questions.get(topic, {}).get(difficulty)
            
            if not fallback:
                # Try any difficulty level for the topic
                for diff in ['easy', 'medium', 'difficult']:
                    fallback = fallback_questions.get(topic, {}).get(diff)
                    if fallback:
                        break
            
            if not fallback:
                # Create a basic fallback
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

# Global standalone math question generator instance
standalone_math_generator = StandaloneMathGenerator()

