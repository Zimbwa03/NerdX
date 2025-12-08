import os
import json
import logging
import requests
import time
from typing import Dict, List, Optional
from config import Config

logger = logging.getLogger(__name__)

class AIService:
    """Service for AI-powered question generation using DeepSeek AI (primary provider)"""

    def __init__(self):
        self.deepseek_api_key = Config.DEEPSEEK_API_KEY
        # DeepSeek is now the primary AI provider for all subjects
        self.deepseek_model = 'deepseek-chat'
        self.deepseek_api_url = 'https://api.deepseek.com/chat/completions'

        if not self.deepseek_api_key:
            logger.warning("DEEPSEEK_API_KEY not configured - AI features will be limited")
            self.client = None

    def generate_math_questions(self, topic: str, difficulty: str, count: int = 1, chat_id: Optional[str] = None):
        """Generate mathematics questions using DeepSeek AI with fallback and caching"""
        try:
            from utils.fallback_questions import generate_fallback_math_questions
            from utils.question_cache import QuestionCacheService

            question_cache = QuestionCacheService()
            questions = []

            # Try to get questions from cache first
            if chat_id:
                cached_question = question_cache.get_cached_question(topic, difficulty, chat_id)
                if cached_question:
                    question_cache.save_question_to_history(chat_id, cached_question.get('question', ''), topic, difficulty)
                    return [cached_question]

            # Generate new questions using API
            for i in range(count):
                question = self.generate_math_question(topic, difficulty)

                if question:
                    # Cache the question
                    if chat_id:
                        question_cache.cache_question(topic, difficulty, question)
                        question_cache.save_question_to_history(chat_id, question.get('question', ''), topic, difficulty)
                    questions.append(question)
                else:
                    # Use fallback system
                    logger.info(f"Using fallback questions for {topic} ({difficulty})")
                    fallback_questions = generate_fallback_math_questions(topic, difficulty, 1)
                    if fallback_questions:
                        if chat_id:
                            question_cache.save_question_to_history(chat_id, fallback_questions[0].get('question', ''), topic, difficulty)
                        questions.extend(fallback_questions)

            return questions if questions else generate_fallback_math_questions(topic, difficulty, count)

        except Exception as e:
            logger.error(f"Error generating math questions: {e}")
            from utils.fallback_questions import generate_fallback_math_questions
            return generate_fallback_math_questions(topic, difficulty, count)

    def generate_math_question(self, topic: str, difficulty: str, user_id: str = None) -> Optional[Dict]:
        """Generate a mathematics question using DeepSeek AI with improved timeouts"""
        try:
            # Use the dedicated math question generator for better performance
            from services.math_question_generator import math_question_generator
            
            # Call the dedicated generator with proper parameters
            question_data = math_question_generator.generate_question("Mathematics", topic, difficulty, user_id)
            
            if question_data:
                logger.info(f"✅ Successfully generated math question for {topic}/{difficulty}")
                return question_data
            else:
                logger.warning(f"Math question generator returned no data for {topic}/{difficulty}")
                return None
            
        except Exception as e:
            logger.error(f"Error in generate_math_question: {e}")
            return None

    def generate_science_question(self, subject: str, topic: str, difficulty: str) -> Optional[Dict]:
        """Generate a science question using AI"""
        try:
            difficulty_descriptions = {
                "easy": "Direct application of basic concepts, straightforward calculations, minimal steps",
                "medium": "Requires understanding of multiple concepts, moderate calculations, 2-3 steps",
                "difficult": "Complex problem-solving, multi-step reasoning, synthesis of several concepts"
            }

            prompt = f"""
You are ScienceMentor, an expert O-Level Science tutor for ZIMSEC curriculum.

CRITICAL INSTRUCTION: Generate EXACTLY ONE single question - never return arrays or multiple questions.

Subject: {subject}
Topic: {topic}
Difficulty: {difficulty} - {difficulty_descriptions[difficulty]}

STRICT REQUIREMENTS:
1. NEVER use arrays or lists - generate ONE single question only
2. Questions must be ZIMSEC O-Level Mathematics standard (Forms 1-4, 2015-2022)
3. Use simple mathematical notation (x², not complex LaTeX)
4. Provide clear, step-by-step solutions with explanations
5. Make the question educational and unique

MANDATORY JSON FORMAT (single object, not array):
{{
    "question": "A clear mathematics problem statement",
    "solution": "Step 1: Clear explanation\\nStep 2: Next step\\nStep 3: Final answer",
    "points": {10 if difficulty == 'easy' else 20 if difficulty == 'medium' else 50}
}}

EXAMPLE for {topic}:
- Question should be concise and clear
- Solution should show ALL working steps
- Points are: Easy=10, Medium=20, Difficult=50

Generate ONE question now (not multiple, not an array):
"""

            return self._call_deepseek_api(prompt)

        except Exception as e:
            logger.error(f"Error generating math question: {e}")
            return None

    def generate_science_question(self, subject: str, topic: str, difficulty: str) -> Optional[Dict]:
        """Generate a ZIMSEC O-level Combined Science question using DeepSeek AI (primary)"""
        try:
            # DeepSeek AI is now the primary provider for science
            return self._generate_science_with_deepseek(subject, topic, difficulty)

        except Exception as e:
            logger.error(f"Error generating science question: {e}")
            return None

    def _generate_science_with_deepseek(self, subject: str, topic: str, difficulty: str) -> Optional[Dict]:
        """Generate science question using DeepSeek AI (primary provider)"""
        try:
            difficulty_map = {
                "easy": "Basic recall and understanding of fundamental concepts",
                "medium": "Application of concepts with moderate analysis and problem-solving",
                "difficult": "Complex analysis, synthesis, evaluation and higher-order thinking"
            }

            # Enhanced ZIMSEC-specific context prompts
            zimsec_context = {
                "Biology": "ZIMSEC O-Level Combined Science Biology syllabus covering cell biology, human biology, plant biology, genetics, ecology, and evolution for Forms 1-4 students in Zimbabwe",
                "Chemistry": "ZIMSEC O-Level Combined Science Chemistry syllabus covering atomic structure, chemical bonding, acids/bases, metals, organic chemistry, and chemical reactions for Forms 1-4 students in Zimbabwe", 
                "Physics": "ZIMSEC O-Level Combined Science Physics syllabus covering mechanics, heat, light, sound, electricity, magnetism, and modern physics for Forms 1-4 students in Zimbabwe"
            }

            prompt = f"""
You are ScienceMentor, an expert ZIMSEC Combined Science tutor with deep knowledge of Zimbabwe's O-Level curriculum.

CONTEXT: {zimsec_context.get(subject, '')}

Generate ONE single {subject} MCQ question for the topic: {topic}
Difficulty Level: {difficulty} - {difficulty_map[difficulty]}

STRICT ZIMSEC O-LEVEL REQUIREMENTS:
1. Generate EXACTLY ONE question (not multiple, not an array)
2. Must strictly align with ZIMSEC Combined Science syllabus (Forms 1-4)
3. Use terminology and concepts familiar to Zimbabwean O-Level students
4. Include 4 realistic multiple choice options (A, B, C, D)
5. Ensure distractors are plausible but clearly incorrect
6. Provide comprehensive explanation with scientific reasoning
7. Make it culturally relevant to Zimbabwe where appropriate
8. Use proper scientific terminology expected at O-Level

MANDATORY JSON FORMAT:
{{
    "question": "Clear, precise question statement with proper scientific terminology",
    "options": {{
        "A": "Option A - scientifically accurate or plausible distractor",
        "B": "Option B - scientifically accurate or plausible distractor", 
        "C": "Option C - scientifically accurate or plausible distractor",
        "D": "Option D - scientifically accurate or plausible distractor"
    }},
    "correct_answer": "A",
    "explanation": "Detailed scientific explanation including why the correct answer is right and why other options are incorrect. Include relevant ZIMSEC syllabus concepts.",
    "points": {10 if difficulty == 'easy' else 20 if difficulty == 'medium' else 50},
    "zimsec_topic": "{topic}",
    "curriculum_reference": "ZIMSEC O-Level Combined Science"
}}

Generate ONE high-quality {subject} MCQ question for {topic} now:
"""

            return self._call_deepseek_api(prompt)

        except Exception as e:
            logger.error(f"Error generating science question with DeepSeek: {e}")
            return None

    def _validate_science_question_data(self, data: Dict) -> bool:
        """Validate the structure of generated science question data"""
        if not isinstance(data, dict):
            return False

        # Check for required fields for science MCQs
        required_fields = ['question', 'options', 'correct_answer', 'explanation', 'points']
        for field in required_fields:
            if field not in data:
                return False

        # Validate question is not empty
        if not data['question'].strip():
            return False

        # Validate options structure (should be a dict with A, B, C, D keys)
        options = data.get('options', {})
        if not isinstance(options, dict) or not all(key in options for key in ['A', 'B', 'C', 'D']):
            return False

        # Validate correct answer is one of A, B, C, D
        if data.get('correct_answer') not in ['A', 'B', 'C', 'D']:
            return False

        # Validate points is a positive integer
        try:
            points = int(data['points'])
            if points <= 0:
                return False
        except (ValueError, TypeError):
            return False

        return True

    def generate_english_question(self, topic: str, difficulty: str) -> Optional[Dict]:
        """Generate an English question using DeepSeek AI (primary provider)"""
        try:
            return self._generate_english_with_deepseek(topic, difficulty)

        except Exception as e:
            logger.error(f"Error generating English question: {e}")
            return None

    def _generate_english_with_deepseek(self, topic: str, difficulty: str) -> Optional[Dict]:
        """Generate English question using DeepSeek AI (primary provider)"""
        try:
            prompt = f"""
You are an expert English Language tutor for ZIMSEC O-Level curriculum.

Generate ONE multiple choice English question for: {topic}
Difficulty: {difficulty}

Requirements:
1. Align with ZIMSEC English Language syllabus
2. Age-appropriate for Forms 1-4 students
3. Multiple choice format with 4 options (A, B, C, D)
4. Clear question with one correct answer
5. Practical and educational

MANDATORY JSON format:
{{
    "question": "Clear English language question",
    "options": {{
        "A": "First option",
        "B": "Second option", 
        "C": "Third option", 
        "D": "Fourth option"
    }},
    "correct_answer": "A",
    "explanation": "Detailed explanation of why the answer is correct",
    "points": {10 if difficulty == 'easy' else 20 if difficulty == 'medium' else 30}
}}
"""

            return self._call_deepseek_api(prompt)

        except Exception as e:
            logger.error(f"Error generating English question with DeepSeek: {e}")
            return None

    def _call_deepseek_api(self, prompt: str) -> Optional[Dict]:
        """Make API call to DeepSeek with retry logic"""
        try:
            headers = {
                'Authorization': f'Bearer {self.deepseek_api_key}',
                'Content-Type': 'application/json'
            }

            data = {
                'model': 'deepseek-chat',
                'messages': [
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'max_tokens': 3000,
                'temperature': 0.7
            }

            # Retry with different timeouts
            for attempt in range(Config.AI_MAX_RETRIES):
                try:
                    timeout = Config.AI_REQUEST_TIMEOUT[min(attempt, len(Config.AI_REQUEST_TIMEOUT) - 1)]
                    logger.info(f"DeepSeek API attempt {attempt + 1}/{Config.AI_MAX_RETRIES} with {timeout}s timeout")

                    response = requests.post(
                        'https://api.deepseek.com/chat/completions',
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
                        json_str = content[json_start:json_end]

                        question_data = json.loads(json_str)

                        # Validate response structure
                        if self._validate_question_data(question_data):
                            logger.info(f"✅ Successfully generated question on attempt {attempt + 1}")
                            return question_data
                        else:
                            logger.warning(f"Invalid question format on attempt {attempt + 1}")
                            continue
                    else:
                        logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                        if attempt < Config.AI_MAX_RETRIES - 1:
                            time.sleep(2 ** attempt)  # Exponential backoff

                except requests.Timeout:
                    logger.warning(f"Timeout on attempt {attempt + 1}")
                    if attempt < Config.AI_MAX_RETRIES - 1:
                        time.sleep(2 ** attempt)

            logger.error("All DeepSeek API attempts failed")
            return None

        except Exception as e:
            logger.error(f"Error calling DeepSeek API: {e}")
            return None

    def _validate_question_data(self, data: Dict) -> bool:
        """Validate the structure of generated question data"""
        if not isinstance(data, dict):
            return False

        # Check for required fields based on question type
        if 'question' not in data or 'points' not in data:
            return False

        # Validate question is not empty
        if not data['question'].strip():
            return False

        # Validate points is a positive integer
        try:
            points = int(data['points'])
            if points <= 0:
                return False
        except (ValueError, TypeError):
            return False

        return True