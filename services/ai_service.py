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
            # ZIMSEC O-Level English topic-specific learning objectives
            english_objectives = {
                "Continuous Writing / Composition": [
                    "Write narrative compositions with clear plot, setting, and characterization",
                    "Write descriptive compositions with vivid imagery and sensory details",
                    "Write argumentative/discursive compositions with clear thesis and supporting evidence",
                    "Use appropriate register, tone, and style for different composition types",
                    "Structure compositions with clear introduction, body paragraphs, and conclusion",
                    "Demonstrate accurate grammar, punctuation, and spelling",
                    "Use varied sentence structures and vocabulary appropriate for O-Level"
                ],
                "Guided Writing / Functional Writing": [
                    "Write formal letters with correct format (addresses, date, salutation, closing)",
                    "Write informal letters with appropriate tone and structure",
                    "Write reports with clear sections (introduction, body, conclusion)",
                    "Write speeches appropriate for different audiences and occasions",
                    "Write articles for school magazines or youth publications",
                    "Use appropriate register and format for each functional writing type",
                    "Include all required elements specified in guided composition prompts"
                ],
                "Comprehension Skills": [
                    "Answer literal questions by identifying information directly stated in the text",
                    "Answer inferential questions by drawing conclusions from implied information",
                    "Answer vocabulary-in-context questions by determining word meaning from surrounding text",
                    "Identify main ideas and supporting details in passages",
                    "Analyze author's tone, mood, and purpose",
                    "Make connections between different parts of a text",
                    "Evaluate text critically and express personal opinions with evidence"
                ],
                "Summary Writing": [
                    "Identify key points and main ideas from source text",
                    "Paraphrase information using own words while retaining original meaning",
                    "Write summaries within specified word limits",
                    "Maintain logical sequence and coherence in summaries",
                    "Exclude irrelevant details and examples",
                    "Use appropriate linking words and transitions",
                    "Demonstrate accurate grammar and spelling in summary writing"
                ],
                "Language and Grammar in Context": [
                    "Identify and correct errors in sentence structure",
                    "Use correct tenses (present, past, future, perfect, continuous forms)",
                    "Demonstrate subject-verb agreement (concord)",
                    "Use correct punctuation marks (periods, commas, semicolons, colons, apostrophes, quotation marks)",
                    "Maintain appropriate register (formal vs informal) and tone",
                    "Use correct word classes (nouns, verbs, adjectives, adverbs, prepositions, conjunctions)",
                    "Identify and correct common grammatical errors (double negatives, misplaced modifiers, run-on sentences)"
                ],
                "Grammar Usage and Vocabulary": [
                    "Define and use vocabulary appropriate for O-Level English",
                    "Distinguish between commonly confused words (affect/effect, accept/except, their/there/they're)",
                    "Use idioms and expressions correctly in context",
                    "Demonstrate understanding of word formation (prefixes, suffixes, root words)",
                    "Use synonyms and antonyms appropriately",
                    "Demonstrate understanding of figurative language (similes, metaphors, personification)",
                    "Use appropriate vocabulary for different contexts and registers"
                ]
            }
            
            # Get learning objectives for the topic
            objectives = english_objectives.get(topic, [
                f"Demonstrate understanding of {topic}",
                f"Apply {topic} skills to exam-style questions",
                f"Use correct English language conventions for {topic}"
            ])
            
            # Select a specific subtopic/objective to test
            import random
            selected_subtopic = random.choice(objectives) if objectives else f"understanding of {topic}"
            
            difficulty_guidance = {
                'easy': "Basic recall and understanding level. Test definitions, simple grammar rules, and basic vocabulary.",
                'medium': "Application and analysis level. Require understanding of context, inference, and application of grammar rules.",
                'difficult': "Evaluation and synthesis level. Complex scenarios requiring deeper understanding, critical thinking, and analysis."
            }
            
            prompt = f"""You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience setting professional examination papers for Zimbabwean students. You have deep knowledge of the ZIMSEC Ordinary Level English Language syllabus and extensive experience as a ZIMSEC examiner and marker.

ROLE: EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER & TEACHER

CORE PRINCIPLES (NON-NEGOTIABLE):
1. STRICT ZIMSEC ALIGNMENT
   - Use ONLY topics, skills, and task types examinable under ZIMSEC O-Level English
   - Do NOT introduce external systems (IELTS, Cambridge IGCSE variations, foreign rubrics)
   - Focus on ZIMSEC Paper structure and marking schemes only

2. EXAMINER-FOCUSED
   - Generate questions that test exactly what ZIMSEC examiners look for
   - Highlight how marks are awarded and lost
   - Emphasize structure, register, relevance, and accuracy
   - Reference ZIMSEC marking criteria and common examiner comments

3. PAPER-BASED THINKING
   - Every question must be mapped to a specific ZIMSEC paper and section
   - No vague "English skills" — everything must link to an examinable task
   - Consider time allocation and mark distribution per section

4. ZIMBABWE CONTEXT
   - Use local, culturally relevant contexts (schools, communities, daily life in Zimbabwe)
   - Maintain formal exam-appropriate English register
   - Include Zimbabwean names, places, and situations where appropriate

SUBJECT: English Language (ZIMSEC O-Level - Paper 1 & Paper 2)
TOPIC: {topic}
SPECIFIC SUBTOPIC TO TEST: {selected_subtopic}
DIFFICULTY: {difficulty} - {difficulty_guidance.get(difficulty, 'Standard level')}

COMPREHENSIVE COVERAGE REQUIREMENT:
- This question MUST test understanding of a SPECIFIC subtopic: "{selected_subtopic}"
- Reference: ZIMSEC O-Level English Language past papers and marking schemes
- All available subtopics for this topic: {chr(10).join(f"  - {obj}" for obj in objectives)}
- To ensure full syllabus coverage, different subtopics should be tested across multiple question generations
- Questions should rotate through all learning objectives to ensure comprehensive topic coverage

ZIMSEC EXAM STRUCTURE REFERENCE:
- Paper 1: Continuous Writing (Composition) and Guided Writing (Functional Writing)
- Paper 2: Comprehension, Summary, and Language & Grammar in Context
- This question type aligns with: {topic} section of ZIMSEC papers

EXPERT EXAMINER GUIDELINES - PROFESSIONAL EXAM STANDARDS:
- Use appropriate ZIMSEC command words: "identify", "explain", "describe", "analyze", "compare", "correct", "choose", "select"
- Create distractors based on common student misconceptions from ZIMSEC marking experience
- Ensure question tests the cognitive level appropriate for {difficulty}:
  * Easy: Knowledge and comprehension (recall facts, understand basic grammar rules, identify correct vocabulary)
  * Medium: Application and analysis (apply knowledge, interpret context, analyze language use, infer meaning)
  * Difficult: Synthesis and evaluation (evaluate language use, synthesize information, make critical judgments)
- Question should feel FRESH and different from standard textbook questions
- Include relevant Zimbabwean context where applicable
- Distractors should be linguistically plausible but clearly incorrect
- Reference ZIMSEC marking criteria and examiner expectations

FRESHNESS REQUIREMENTS - CREATE UNIQUE QUESTIONS:
- Use unique scenarios NOT commonly found in typical textbook questions
- Vary contexts: school situations, community events, everyday life in Zimbabwe, cultural references
- Create innovative applications of the language concept being tested
- Ensure question feels like a professional ZIMSEC exam question, NOT a generic textbook exercise
- Avoid repetitive question structures - vary how questions are phrased
- Use different real-world applications for the same concept across different generations
- For guided writing topics: Use varied situations, audiences, and purposes relevant to Zimbabwean students

QUESTION REQUIREMENTS:
- Subject: English Language
- Topic: {topic}
- Format: Multiple choice (4 options A, B, C, D)
- Use clear, simple language suitable for ZIMSEC O-Level students (ages 15-17, Forms 1-4)
- One option must be clearly correct
- Distractors should be plausible but linguistically/grammatically incorrect
- All options should be of similar length where possible
- Ensure question tests ZIMSEC examinable skills only

CRITICAL - AVOID:
- IELTS-style questions or Cambridge IGCSE variations (foreign syllabus contamination)
- Overly complex university-level content or A-Level English concepts
- Ambiguous options where multiple could be correct
- Using the same scenario repeatedly (vary contexts for each generation)
- Foreign cultural references that don't apply to Zimbabwean students
- Questions that require knowledge beyond ZIMSEC O-Level syllabus

ZIMSEC-SPECIFIC REQUIREMENTS:
- For Composition topics: Focus on structure, register, and relevance to prompt
- For Comprehension topics: Test literal understanding, inference, and vocabulary in context
- For Summary topics: Emphasize note selection, conciseness, and paraphrasing
- For Grammar topics: Test sentence structure, tenses, concord, punctuation in context
- For Vocabulary topics: Test understanding of word meaning, usage, and register appropriateness

Return ONLY a valid JSON object (NO markdown formatting, NO additional text):
{{
    "question": "Clear, focused, professional ZIMSEC exam-style question testing: {selected_subtopic}",
    "options": {{
        "A": "First option - plausible distractor based on common student misconception",
        "B": "Second option - plausible distractor based on common student misconception", 
        "C": "Third option - correct answer",
        "D": "Fourth option - plausible distractor based on common student misconception"
    }},
    "correct_answer": "C",
    "explanation": "DETAILED EXPLANATION: A thorough professional explanation (4-6 sentences) covering WHY the correct answer is right, WHY each other option is wrong (with linguistic/grammatical reasoning), and the underlying language principle. Reference ZIMSEC marking criteria and examiner expectations. Use proper linguistic terminology appropriate for O-Level students.",
    "teaching_explanation": "TEACHER FEEDBACK: A warm, encouraging, conversational explanation written as if you're a patient, experienced ZIMSEC English teacher having a one-on-one conversation with the student. Use relatable examples from Zimbabwean school/community life, or real-life applications to help them truly understand. MUST BE COMPLETELY DIFFERENT from the explanation above - focus on making the concept memorable, easy to understand, and relatable. Use simple language and friendly tone.",
    "difficulty": "{difficulty}",
    "learning_objective": "{selected_subtopic}",
    "zimsec_paper_reference": "Paper 1 or Paper 2 (specify section)",
    "subtopic_tested": "{selected_subtopic}",
    "points": {10 if difficulty == 'easy' else 20 if difficulty == 'medium' else 30}
}}

CRITICAL REQUIREMENTS:
- The 'explanation' and 'teaching_explanation' MUST be completely different texts with different approaches!
- 'explanation': Formal, academic, professional (for understanding ZIMSEC marking criteria)
- 'teaching_explanation': Conversational, relatable, encouraging (for student engagement and memorability)
- Question must feel fresh and professionally crafted like a real ZIMSEC exam question
- Ensure comprehensive coverage of subtopic: {selected_subtopic}
- Strictly ZIMSEC-aligned - NO foreign syllabus contamination

Generate a high-quality, professional ZIMSEC exam-style question now!"""

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