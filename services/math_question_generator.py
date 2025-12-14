#!/usr/bin/env python3
"""
Mathematics Question Generator using Gemini AI (primary) and DeepSeek AI (fallback)
Generates ZIMSEC-style mathematics questions with step-by-step solutions
"""

import logging
import os
import json
import requests
import time
import random
from typing import Dict, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# Import structured prompts
try:
    from services.math_prompts_master import get_random_prompt, get_prompt, get_all_topics
    PROMPTS_AVAILABLE = True
    logger.info("✅ Structured math prompts loaded (2,520 prompts)")
except ImportError:
    PROMPTS_AVAILABLE = False
    logger.warning("⚠️ Structured prompts not available, using default prompts")

# Try to import Gemini AI
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
    logger.info("✅ google.generativeai loaded for Math Question Generator")
except ImportError:
    genai = None
    GENAI_AVAILABLE = False
    logger.warning("⚠️ google.generativeai not available, will use DeepSeek only")


class MathQuestionGenerator:
    """Gemini AI (primary) + DeepSeek AI (fallback) mathematics question generator"""

    def __init__(self):
        # DeepSeek configuration (fallback)
        self.deepseek_api_key = os.environ.get('DEEPSEEK_API_KEY')
        self.deepseek_api_url = 'https://api.deepseek.com/chat/completions'
        
        # Gemini configuration (primary - faster and more reliable)
        self.gemini_api_key = os.environ.get('GEMINI_API_KEY')
        self._gemini_configured = False
        
        if self.gemini_api_key and GENAI_AVAILABLE:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self._gemini_configured = True
                logger.info("✅ Gemini AI configured as PRIMARY provider for math questions")
            except Exception as e:
                logger.error(f"Failed to configure Gemini: {e}")
        
        if self.deepseek_api_key:
            logger.info("✅ DeepSeek AI configured as FALLBACK provider")
        
        # Legacy compatibility
        self.api_key = self.deepseek_api_key
        self.api_url = self.deepseek_api_url

        # Reduced timeout parameters to prevent worker crashes
        self.max_retries = 2  # Reduced retries for faster fallback
        self.base_timeout = 25  # Reduced timeout to prevent worker kills
        self.retry_delay = 1   # Minimal delay between retries

    def generate_question(self, subject: str, topic: str, difficulty: str = 'medium', user_id: str = None) -> Optional[Dict]:
        """
        Generate a question using Gemini AI (primary) with DeepSeek fallback.
        Uses reduced timeouts to prevent Gunicorn worker crashes.
        """
        try:
            # Get recent AI topics for this user to avoid repetition
            recent_topics = set()
            if user_id:
                try:
                    from services.question_history_service import question_history_service
                    ai_subject_key = f"{subject}_AI"
                    recent_questions = question_history_service.get_recent_questions(user_id, ai_subject_key)
                    recent_topics = {q.split('_')[0] for q in recent_questions if '_' in q}
                except ImportError:
                    logger.info("Question history service not available, continuing without anti-repetition")
                    recent_topics = set()
            
            # PRIMARY: Try Gemini AI first (faster and more reliable)
            if self._gemini_configured:
                logger.info(f"🔷 Trying Gemini AI (primary) for {subject}/{topic}")
                gemini_result = self._generate_with_gemini(subject, topic, difficulty, recent_topics)
                if gemini_result:
                    # Validate and format response
                    question_data = self._validate_and_format_question(gemini_result, subject, topic, difficulty, user_id)
                    if question_data:
                        question_data['source'] = 'gemini_ai'
                        logger.info(f"✅ Gemini AI generated question for {subject}/{topic}")
                        return question_data
                logger.warning("Gemini AI failed, falling back to DeepSeek")
            
            # FALLBACK: Try DeepSeek with reduced timeout
            if self.deepseek_api_key:
                logger.info(f"🔶 Trying DeepSeek AI (fallback) for {subject}/{topic}")
                prompt = self._create_question_prompt(subject, topic, difficulty, recent_topics)
                
                # Single attempt with reduced timeout to prevent worker crash
                try:
                    response = self._send_api_request(prompt, timeout=25)
                    if response:
                        question_data = self._validate_and_format_question(response, subject, topic, difficulty, user_id)
                        if question_data:
                            question_data['source'] = 'deepseek_ai'
                            logger.info(f"✅ DeepSeek AI generated question for {subject}/{topic}")
                            return question_data
                except requests.exceptions.Timeout:
                    logger.warning("DeepSeek API timeout (25s limit to prevent worker crash)")
                except Exception as e:
                    logger.warning(f"DeepSeek API error: {e}")

            # FINAL FALLBACK: Use local fallback questions
            logger.warning(f"All AI providers failed for {subject}/{topic}, using local fallback questions")
            return self._generate_fallback_question(subject, topic, difficulty)

        except Exception as e:
            logger.error(f"Critical error in generate_question: {e}")
            return self._generate_fallback_question(subject, topic, difficulty)

    def _generate_with_gemini(self, subject: str, topic: str, difficulty: str, recent_topics: set = None) -> Optional[Dict]:
        """
        Generate a math question using Gemini AI.
        Returns parsed question data or None on failure.
        """
        if not self._gemini_configured or not GENAI_AVAILABLE:
            return None
        
        try:
            # Build the prompt
            prompt = self._create_question_prompt(subject, topic, difficulty, recent_topics)
            
            # Use Gemini Flash for speed
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            
            # Request JSON response
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.8,
                    max_output_tokens=2000
                ),
                request_options={'timeout': 20}  # 20 second timeout
            )
            
            if response and hasattr(response, 'text') and response.text:
                # Parse JSON response
                text = response.text.strip()
                
                # Clean markdown fences if present
                if text.startswith('```json'):
                    text = text[7:]
                if text.startswith('```'):
                    text = text[3:]
                if text.endswith('```'):
                    text = text[:-3]
                text = text.strip()
                
                question_data = json.loads(text)
                logger.info(f"Gemini generated: {question_data.get('question', '')[:80]}...")
                return question_data
            
            logger.warning("Empty response from Gemini")
            return None
            
        except json.JSONDecodeError as e:
            logger.error(f"Gemini JSON parse error: {e}")
            return None
        except Exception as e:
            logger.error(f"Gemini generation error: {e}")
            return None

    def generate_question_with_gemini(self, subject: str, topic: str, difficulty: str = 'medium') -> Optional[Dict]:
        """
        Legacy method for backward compatibility.
        Now calls the main generate_question which uses Gemini as primary.
        """
        return self.generate_question(subject, topic, difficulty)

    def _create_question_prompt(self, subject: str, topic: str, difficulty: str, recent_topics: set = None) -> str:
        """Create optimized prompt using structured prompts when available"""
        
        if recent_topics is None:
            recent_topics = set()
        
        difficulty_descriptions = {
            "easy": "Direct application of basic concepts, straightforward calculations, minimal steps",
            "medium": "Requires understanding of multiple concepts, moderate calculations, 2-3 steps",
            "difficult": "Complex problem-solving, multi-step reasoning, synthesis of several concepts"
        }
        
        # Try to get a structured prompt for this topic
        structured_prompt = None
        subtopic = topic
        learning_obj = f"Test understanding of {topic}"
        
        if PROMPTS_AVAILABLE:
            try:
                prompt_data = get_random_prompt(topic, difficulty=difficulty)
                if prompt_data:
                    structured_prompt = prompt_data.get('prompt', '')
                    subtopic = prompt_data.get('subtopic', topic)
                    learning_obj = prompt_data.get('learning_objective', learning_obj)
                    logger.info(f"Using structured prompt: {prompt_data.get('id', 'unknown')} for {topic}")
            except Exception as e:
                logger.warning(f"Error getting structured prompt: {e}")
        
        # Build variation instruction if we have recent topics
        variation_note = ""
        if recent_topics and topic.lower() in [t.lower() for t in recent_topics]:
            variation_note = "\nIMPORTANT: Generate a DIFFERENT question from previous ones on this topic. Vary the numbers, scenario, or approach."
        
        points = 10 if difficulty == 'easy' else 20 if difficulty == 'medium' else 30
        
        # Use structured prompt if available
        if structured_prompt:
            prompt = f"""Generate a ZIMSEC O-Level Mathematics question.

**Topic:** {topic}
**Subtopic:** {subtopic}
**Difficulty:** {difficulty} - {difficulty_descriptions[difficulty]}
**Learning Objective:** {learning_obj}
{variation_note}

**Specific Instructions:**
{structured_prompt}

Return your response in this EXACT JSON format:
{{
    "question": "Clear, focused question testing the concept",
    "solution": "Complete step-by-step solution with working",
    "answer": "Final answer only",
    "points": {points},
    "explanation": "Conceptual explanation of what is being tested",
    "teaching_explanation": "Friendly tutor-style explanation with analogies",
    "difficulty": "{difficulty}",
    "subtopic": "{subtopic}"
}}

Generate the question now:"""
        else:
            # Default prompt when structured prompts not available
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
    "points": {points},
    "explanation": "Brief explanation of the concept being tested",
    "teaching_explanation": "Friendly tutor-style explanation"
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
            # Required fields validation
            required_fields = ['question', 'solution']
            
            for field in required_fields:
                if field not in question_data or not question_data[field]:
                    logger.error(f"Missing required field: {field}")
                    return None
            
            # Format the question with all necessary fields
            formatted_question = {
                'question': question_data.get('question', '').strip(),
                'solution': question_data.get('solution', '').strip(),
                'answer': question_data.get('answer', '').strip(),
                'points': question_data.get('points', 10 if difficulty == 'easy' else 20 if difficulty == 'medium' else 30),
                'explanation': question_data.get('explanation', ''),
                'difficulty': difficulty,
                'topic': topic,
                'subject': subject,
                'generated_at': datetime.now().isoformat(),
                'source': 'deepseek_ai'
            }

            if len(formatted_question['solution']) < 20:
                logger.error("Solution too short")
                return None

            # Add to history service if user provided and question was successfully generated
            if user_id and formatted_question and formatted_question.get('question'):
                try:
                    from services.question_history_service import question_history_service
                    ai_subject_key = f"{subject}_AI"
                    question_identifier = f"{topic}_{difficulty}_{hash(formatted_question['question'][:50]) % 10000}"

                    # Add both ID and text to history
                    question_history_service.add_question_to_history(user_id, ai_subject_key, question_identifier)
                    # Combine subject, topic, and difficulty into a key for text history
                    history_key = f"{subject}_{topic}_{difficulty}"
                    question_history_service.add_question_text_to_history(
                        user_id, history_key, formatted_question['question']
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
            "Sets": {
                "easy": {
                    "question": "List the elements of set A = {x : x is a prime number less than 15}",
                    "solution": "Step 1: Identify prime numbers less than 15\nPrime numbers are numbers greater than 1 that have exactly two factors: 1 and themselves.\n\nStep 2: Check each number from 2 to 14\n2 = prime (factors: 1, 2)\n3 = prime (factors: 1, 3)\n4 = not prime (factors: 1, 2, 4)\n5 = prime (factors: 1, 5)\n7 = prime (factors: 1, 7)\n11 = prime (factors: 1, 11)\n13 = prime (factors: 1, 13)\n\nTherefore: A = {2, 3, 5, 7, 11, 13}",
                    "answer": "A = {2, 3, 5, 7, 11, 13}",
                    "points": 10
                },
                "medium": {
                    "question": "If U = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, A = {2, 4, 6, 8} and B = {1, 2, 3, 4, 5}, find A ∩ B and A ∪ B.",
                    "solution": "Step 1: Find the intersection A ∩ B\nA ∩ B contains elements that are in BOTH A and B\nA = {2, 4, 6, 8}\nB = {1, 2, 3, 4, 5}\nCommon elements: 2 and 4\nA ∩ B = {2, 4}\n\nStep 2: Find the union A ∪ B\nA ∪ B contains ALL elements in A or B (or both)\nA ∪ B = {1, 2, 3, 4, 5, 6, 8}\n\nTherefore: A ∩ B = {2, 4}, A ∪ B = {1, 2, 3, 4, 5, 6, 8}",
                    "answer": "A ∩ B = {2, 4}, A ∪ B = {1, 2, 3, 4, 5, 6, 8}",
                    "points": 20
                },
                "difficult": {
                    "question": "In a class of 40 students, 25 study Mathematics, 15 study Physics, and 5 study both. How many study neither subject?",
                    "solution": "Step 1: Use the formula for union of two sets\nn(A ∪ B) = n(A) + n(B) - n(A ∩ B)\n\nStep 2: Substitute values\nn(M ∪ P) = 25 + 15 - 5 = 35\n\nStep 3: Find those who study neither\nNeither = Total - n(M ∪ P)\nNeither = 40 - 35 = 5\n\nTherefore: 5 students study neither subject",
                    "answer": "5",
                    "points": 30
                }
            },
            "Real Numbers": {
                "easy": {
                    "question": "Express 0.75 as a fraction in its simplest form.",
                    "solution": "Step 1: Write as a fraction\n0.75 = 75/100\n\nStep 2: Simplify by dividing both numerator and denominator by their GCD\nGCD of 75 and 100 is 25\n75 ÷ 25 = 3\n100 ÷ 25 = 4\n\nTherefore: 0.75 = 3/4",
                    "answer": "3/4",
                    "points": 10
                },
                "medium": {
                    "question": "Simplify: √48 + √27",
                    "solution": "Step 1: Simplify √48\n√48 = √(16 × 3) = √16 × √3 = 4√3\n\nStep 2: Simplify √27\n√27 = √(9 × 3) = √9 × √3 = 3√3\n\nStep 3: Add the simplified surds\n4√3 + 3√3 = 7√3\n\nTherefore: √48 + √27 = 7√3",
                    "answer": "7√3",
                    "points": 20
                },
                "difficult": {
                    "question": "Rationalize the denominator: 6/(√5 - √2)",
                    "solution": "Step 1: Multiply by the conjugate\n6/(√5 - √2) × (√5 + √2)/(√5 + √2)\n\nStep 2: Simplify the numerator\n6(√5 + √2) = 6√5 + 6√2\n\nStep 3: Simplify the denominator using difference of squares\n(√5)² - (√2)² = 5 - 2 = 3\n\nStep 4: Write the final answer\n(6√5 + 6√2)/3 = 2√5 + 2√2 = 2(√5 + √2)\n\nTherefore: 6/(√5 - √2) = 2(√5 + √2)",
                    "answer": "2(√5 + √2) or 2√5 + 2√2",
                    "points": 30
                }
            },
            "Financial Mathematics": {
                "easy": {
                    "question": "Calculate the simple interest on $500 at 5% per annum for 2 years.",
                    "solution": "Step 1: Use the simple interest formula\nSimple Interest = (P × R × T)/100\n\nStep 2: Substitute values\nP = $500, R = 5%, T = 2 years\nSI = (500 × 5 × 2)/100\nSI = 5000/100 = $50\n\nTherefore: The simple interest is $50",
                    "answer": "$50",
                    "points": 10
                },
                "medium": {
                    "question": "A shopkeeper marks up goods by 25% and offers a 10% discount. Find the profit percent.",
                    "solution": "Step 1: Assume cost price = $100\nMarked price = 100 + 25% of 100 = $125\n\nStep 2: Calculate selling price after 10% discount\nDiscount = 10% of 125 = $12.50\nSelling price = 125 - 12.50 = $112.50\n\nStep 3: Calculate profit percent\nProfit = SP - CP = 112.50 - 100 = $12.50\nProfit % = (12.50/100) × 100 = 12.5%\n\nTherefore: Profit percent is 12.5%",
                    "answer": "12.5%",
                    "points": 20
                },
                "difficult": {
                    "question": "Calculate the compound interest on $8000 at 10% per annum for 2 years, compounded annually.",
                    "solution": "Step 1: Use compound interest formula\nA = P(1 + r/100)^n\n\nStep 2: Substitute values\nA = 8000(1 + 10/100)²\nA = 8000(1.1)²\nA = 8000 × 1.21\nA = $9680\n\nStep 3: Calculate compound interest\nCI = A - P = 9680 - 8000 = $1680\n\nTherefore: The compound interest is $1680",
                    "answer": "$1680",
                    "points": 30
                }
            },
            "Measures and Mensuration": {
                "easy": {
                    "question": "Find the perimeter of a rectangle with length 12 cm and width 8 cm.",
                    "solution": "Step 1: Use perimeter formula\nPerimeter = 2(length + width)\n\nStep 2: Substitute values\nPerimeter = 2(12 + 8)\nPerimeter = 2 × 20\nPerimeter = 40 cm\n\nTherefore: The perimeter is 40 cm",
                    "answer": "40 cm",
                    "points": 10
                },
                "medium": {
                    "question": "Find the volume of a cylinder with radius 7 cm and height 10 cm. (Use π = 22/7)",
                    "solution": "Step 1: Use volume formula\nVolume = πr²h\n\nStep 2: Substitute values\nVolume = (22/7) × 7² × 10\nVolume = (22/7) × 49 × 10\nVolume = 22 × 7 × 10\nVolume = 1540 cm³\n\nTherefore: The volume is 1540 cm³",
                    "answer": "1540 cm³",
                    "points": 20
                },
                "difficult": {
                    "question": "Find the total surface area of a cone with radius 5 cm and slant height 13 cm. (Use π = 3.14)",
                    "solution": "Step 1: Use total surface area formula\nTSA = πr² + πrl = πr(r + l)\n\nStep 2: Substitute values\nTSA = 3.14 × 5 × (5 + 13)\nTSA = 3.14 × 5 × 18\nTSA = 282.6 cm²\n\nTherefore: The total surface area is 282.6 cm²",
                    "answer": "282.6 cm²",
                    "points": 30
                }
            },
            "Graphs": {
                "easy": {
                    "question": "Find the gradient of the line passing through points A(2, 3) and B(6, 11).",
                    "solution": "Step 1: Use the gradient formula\nGradient = (y₂ - y₁)/(x₂ - x₁)\n\nStep 2: Substitute values\nGradient = (11 - 3)/(6 - 2)\nGradient = 8/4\nGradient = 2\n\nTherefore: The gradient is 2",
                    "answer": "2",
                    "points": 10
                },
                "medium": {
                    "question": "Find the equation of the line with gradient 3 passing through the point (2, 5).",
                    "solution": "Step 1: Use point-slope form\ny - y₁ = m(x - x₁)\n\nStep 2: Substitute m = 3 and point (2, 5)\ny - 5 = 3(x - 2)\ny - 5 = 3x - 6\ny = 3x - 6 + 5\ny = 3x - 1\n\nTherefore: The equation is y = 3x - 1",
                    "answer": "y = 3x - 1",
                    "points": 20
                },
                "difficult": {
                    "question": "Find the coordinates of the point of intersection of lines y = 2x + 3 and y = -x + 9.",
                    "solution": "Step 1: Set the equations equal\n2x + 3 = -x + 9\n\nStep 2: Solve for x\n2x + x = 9 - 3\n3x = 6\nx = 2\n\nStep 3: Find y by substituting x = 2\ny = 2(2) + 3 = 7\n\nTherefore: The point of intersection is (2, 7)",
                    "answer": "(2, 7)",
                    "points": 30
                }
            },
            "Variation": {
                "easy": {
                    "question": "If y varies directly as x, and y = 12 when x = 4, find y when x = 7.",
                    "solution": "Step 1: Write the direct variation equation\ny = kx where k is the constant\n\nStep 2: Find k using y = 12 when x = 4\n12 = k × 4\nk = 12/4 = 3\n\nStep 3: Find y when x = 7\ny = 3 × 7 = 21\n\nTherefore: y = 21",
                    "answer": "21",
                    "points": 10
                },
                "medium": {
                    "question": "If y varies inversely as x, and y = 6 when x = 8, find x when y = 12.",
                    "solution": "Step 1: Write the inverse variation equation\ny = k/x where k is the constant\n\nStep 2: Find k using y = 6 when x = 8\n6 = k/8\nk = 6 × 8 = 48\n\nStep 3: Find x when y = 12\n12 = 48/x\nx = 48/12 = 4\n\nTherefore: x = 4",
                    "answer": "4",
                    "points": 20
                },
                "difficult": {
                    "question": "If z varies directly as x and inversely as the square of y, and z = 12 when x = 4 and y = 2, find z when x = 8 and y = 4.",
                    "solution": "Step 1: Write the combined variation equation\nz = kx/y²\n\nStep 2: Find k using z = 12, x = 4, y = 2\n12 = k × 4/2²\n12 = k × 4/4\n12 = k\n\nStep 3: Find z when x = 8, y = 4\nz = 12 × 8/4²\nz = 96/16\nz = 6\n\nTherefore: z = 6",
                    "answer": "6",
                    "points": 30
                }
            },
            "Vectors": {
                "easy": {
                    "question": "If a = (3, 4) and b = (2, -1), find a + b.",
                    "solution": "Step 1: Add corresponding components\na + b = (3 + 2, 4 + (-1))\na + b = (5, 3)\n\nTherefore: a + b = (5, 3)",
                    "answer": "(5, 3)",
                    "points": 10
                },
                "medium": {
                    "question": "Find the magnitude of vector v = (3, 4).",
                    "solution": "Step 1: Use the magnitude formula\n|v| = √(x² + y²)\n\nStep 2: Substitute values\n|v| = √(3² + 4²)\n|v| = √(9 + 16)\n|v| = √25\n|v| = 5\n\nTherefore: The magnitude is 5 units",
                    "answer": "5",
                    "points": 20
                },
                "difficult": {
                    "question": "If vectors a = 2i + 3j and b = 4i - j, find the vector 2a - 3b.",
                    "solution": "Step 1: Calculate 2a\n2a = 2(2i + 3j) = 4i + 6j\n\nStep 2: Calculate 3b\n3b = 3(4i - j) = 12i - 3j\n\nStep 3: Calculate 2a - 3b\n2a - 3b = (4i + 6j) - (12i - 3j)\n2a - 3b = 4i - 12i + 6j + 3j\n2a - 3b = -8i + 9j\n\nTherefore: 2a - 3b = -8i + 9j",
                    "answer": "-8i + 9j",
                    "points": 30
                }
            },
            "Matrices": {
                "easy": {
                    "question": "If A = [[2, 3], [1, 4]], find 2A.",
                    "solution": "Step 1: Multiply each element by 2\n2A = [[2×2, 2×3], [2×1, 2×4]]\n2A = [[4, 6], [2, 8]]\n\nTherefore: 2A = [[4, 6], [2, 8]]",
                    "answer": "[[4, 6], [2, 8]]",
                    "points": 10
                },
                "medium": {
                    "question": "Find the determinant of matrix M = [[3, 5], [2, 4]].",
                    "solution": "Step 1: Use the determinant formula for 2×2 matrix\ndet(M) = ad - bc where M = [[a, b], [c, d]]\n\nStep 2: Substitute values\ndet(M) = (3 × 4) - (5 × 2)\ndet(M) = 12 - 10\ndet(M) = 2\n\nTherefore: The determinant is 2",
                    "answer": "2",
                    "points": 20
                },
                "difficult": {
                    "question": "Find the inverse of matrix A = [[4, 3], [5, 4]].",
                    "solution": "Step 1: Find the determinant\ndet(A) = (4 × 4) - (3 × 5) = 16 - 15 = 1\n\nStep 2: Find the adjugate matrix\nadj(A) = [[4, -3], [-5, 4]]\n\nStep 3: Calculate the inverse\nA⁻¹ = (1/det) × adj(A)\nA⁻¹ = (1/1) × [[4, -3], [-5, 4]]\nA⁻¹ = [[4, -3], [-5, 4]]\n\nTherefore: A⁻¹ = [[4, -3], [-5, 4]]",
                    "answer": "[[4, -3], [-5, 4]]",
                    "points": 30
                }
            },
            "Transformation": {
                "easy": {
                    "question": "A point P(3, 2) is reflected in the x-axis. Find the image P'.",
                    "solution": "Step 1: Apply reflection in x-axis rule\nReflection in x-axis: (x, y) → (x, -y)\n\nStep 2: Apply to point P(3, 2)\nP'(3, -2)\n\nTherefore: P' = (3, -2)",
                    "answer": "(3, -2)",
                    "points": 10
                },
                "medium": {
                    "question": "Point A(4, 3) is translated by vector (−2, 5). Find the image A'.",
                    "solution": "Step 1: Apply translation rule\nTranslation by (a, b): (x, y) → (x + a, y + b)\n\nStep 2: Apply to point A(4, 3) with translation (-2, 5)\nA' = (4 + (-2), 3 + 5)\nA' = (2, 8)\n\nTherefore: A' = (2, 8)",
                    "answer": "(2, 8)",
                    "points": 20
                },
                "difficult": {
                    "question": "Point P(2, 5) is rotated 90° anticlockwise about the origin. Find the image P'.",
                    "solution": "Step 1: Apply 90° anticlockwise rotation rule\nRotation 90° anticlockwise about origin: (x, y) → (-y, x)\n\nStep 2: Apply to point P(2, 5)\nP' = (-5, 2)\n\nTherefore: P' = (-5, 2)",
                    "answer": "(-5, 2)",
                    "points": 30
                }
            },
            "Probability": {
                "easy": {
                    "question": "A bag contains 3 red balls and 5 blue balls. If one ball is drawn at random, find the probability of drawing a red ball.",
                    "solution": "Step 1: Count total number of balls\nTotal = 3 + 5 = 8 balls\n\nStep 2: Count favorable outcomes (red balls)\nFavorable = 3\n\nStep 3: Calculate probability\nP(red) = Favorable/Total = 3/8\n\nTherefore: P(red ball) = 3/8",
                    "answer": "3/8",
                    "points": 10
                },
                "medium": {
                    "question": "A fair die is thrown. Find the probability of getting a number greater than 4.",
                    "solution": "Step 1: List all possible outcomes\nS = {1, 2, 3, 4, 5, 6}\nTotal outcomes = 6\n\nStep 2: List favorable outcomes (greater than 4)\nFavorable = {5, 6}\nNumber of favorable outcomes = 2\n\nStep 3: Calculate probability\nP(>4) = 2/6 = 1/3\n\nTherefore: P(number > 4) = 1/3",
                    "answer": "1/3",
                    "points": 20
                },
                "difficult": {
                    "question": "Two fair coins are tossed. Find the probability of getting at least one head.",
                    "solution": "Step 1: List all possible outcomes\nS = {HH, HT, TH, TT}\nTotal outcomes = 4\n\nStep 2: Find P(at least one head)\nMethod 1: Directly count\nFavorable = {HH, HT, TH} = 3\nP(at least one head) = 3/4\n\nOR Method 2: Use complement\nP(at least one head) = 1 - P(no heads)\nP(no heads) = P(TT) = 1/4\nP(at least one head) = 1 - 1/4 = 3/4\n\nTherefore: P(at least one head) = 3/4",
                    "answer": "3/4",
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