#!/usr/bin/env python3
"""
Enhanced English Service for ZIMSEC O-Level students
Provides comprehensive English language learning features including grammar, vocabulary, essays, and comprehension
"""

import json
import logging
import random
import os
import uuid
from typing import Optional, Dict, List

import requests
from utils.deepseek import get_deepseek_chat_model

# Try to import google-genai SDK (Vertex AI)
try:
    from google import genai
    from google.genai.types import HttpOptions
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    HttpOptions = None
    GENAI_AVAILABLE = False

from config import Config

logger = logging.getLogger(__name__)
DEEPSEEK_CHAT_MODEL = get_deepseek_chat_model()

class EnglishService:
    def __init__(self):
        """Initialize Enhanced ZIMSEC English Service with AI capabilities"""
        self.client = None
        self._is_configured = False
        self.deepseek_api_key = Config.DEEPSEEK_API_KEY
        self.deepseek_api_url = 'https://api.deepseek.com/chat/completions'
        
        # Vertex AI configuration (preferred - higher rate limits)
        self.project_id = os.environ.get('GOOGLE_CLOUD_PROJECT', 'gen-lang-client-0303273462')
        self.use_vertex_ai = os.environ.get('GOOGLE_GENAI_USE_VERTEXAI', 'True').lower() == 'true'

        # Initialize AI client
        if GENAI_AVAILABLE:
            self._init_gemini_client()
        else:
            logger.info("google-genai SDK not available - using DeepSeek only")
    
    def _init_gemini_client(self):
        """Initialize Gemini client with Vertex AI or API key."""
        try:
            # Try Vertex AI first (higher rate limits)
            if self.use_vertex_ai:
                os.environ['GOOGLE_GENAI_USE_VERTEXAI'] = 'True'
                credentials_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
                service_account_json = os.environ.get('GOOGLE_SERVICE_ACCOUNT_JSON')
                
                if credentials_path and os.path.exists(credentials_path):
                    self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
                    self._is_configured = True
                    logger.info(f"English Service: Gemini via Vertex AI configured (project: {self.project_id})")
                    return
                elif service_account_json:
                    import tempfile
                    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
                        f.write(service_account_json)
                        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = f.name
                    self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
                    self._is_configured = True
                    logger.info("English Service: Gemini via Vertex AI configured (inline credentials)")
                    return
                else:
                    # Try ADC
                    try:
                        self.client = genai.Client(http_options=HttpOptions(api_version="v1"))
                        self._is_configured = True
                        logger.info("English Service: Gemini via Vertex AI configured (ADC)")
                        return
                    except Exception:
                        logger.warning("Vertex AI ADC failed, trying API key...")
            
            # Fallback to API key
            api_key = os.getenv('GEMINI_API_KEY')
            if api_key:
                self.client = genai.Client(api_key=api_key)
                self._is_configured = True
                logger.info("English Service: Gemini configured with API key (fallback)")
        except Exception as e:
            logger.error(f"Error initializing English service Gemini client: {e}")

    def _get_fallback_grammar_question(self) -> Dict:
        """Provide fallback grammar question when AI service fails"""
        import random

        fallback_grammar_questions = [
            {
                "question": "Identify the pronouns in this sentence: She told him that they would meet us later.",
                "instructions": "List all the pronouns in the sentence.",
                "answer": "She, him, they, us",
                "explanation": "Pronouns replace nouns. Personal pronouns include subject and object forms.",
                "topic_area": "Parts of Speech"
            },
            {
                "question": "Change this sentence to past tense: I walk to school every day.",
                "instructions": "Rewrite the sentence in simple past tense.",
                "answer": "I walked to school every day.",
                "explanation": "Simple past tense shows completed actions in the past.",
                "topic_area": "Verb Tenses"
            },
            {
                "question": "The cat sat on the mat. The mat was soft.",
                "instructions": "Combine these sentences using a relative pronoun.",
                "answer": "The cat sat on the mat, which was soft.",
                "explanation": "Relative pronouns like 'which' connect clauses and add information.",
                "topic_area": "Sentence Structure"
            }
        ]

        return random.choice(fallback_grammar_questions)

    def _get_fallback_vocabulary_question(self) -> Dict:
        """Provide fallback vocabulary MCQ when AI service fails"""
        import random

        fallback_vocab_questions = [
            {
                "question": "What does the word 'abundant' mean?",
                "options": ["Very few", "Plentiful", "Expensive", "Difficult"],
                "correct_answer": 1,
                "explanation": "Abundant means existing in large quantities; plentiful."
            },
            {
                "question": "Choose the synonym for 'brave':",
                "options": ["Fearful", "Courageous", "Weak", "Lazy"],
                "correct_answer": 1,
                "explanation": "Courageous is a synonym for brave, meaning showing courage."
            },
            {
                "question": "What is the opposite of 'ancient'?",
                "options": ["Old", "Modern", "Historic", "Traditional"],
                "correct_answer": 1,
                "explanation": "Modern is the opposite of ancient, meaning belonging to the present time."
            },
            {
                "question": "What does 'diligent' mean in this sentence: 'Rudo is a diligent student.'?",
                "options": ["Lazy", "Hardworking", "Smart", "Friendly"],
                "correct_answer": 1,
                "explanation": "Diligent means showing careful and persistent effort in work or duties."
            },
            {
                "question": "Choose the correct meaning of 'fierce':",
                "options": ["Gentle", "Aggressive", "Calm", "Quiet"],
                "correct_answer": 1,
                "explanation": "Fierce means showing strong, aggressive intensity."
            }
        ]

        return random.choice(fallback_vocab_questions)

    def _clean_json_block(self, text: str) -> str:
        """Remove markdown fences from Gemini responses"""
        cleaned = text.strip()
        if cleaned.startswith('```json'):
            cleaned = cleaned[7:]
        if cleaned.startswith('```'):
            cleaned = cleaned[3:]
        if cleaned.endswith('```'):
            cleaned = cleaned[:-3]
        return cleaned.strip()

    def _normalize_ai_grammar_payload(self, payload: Dict) -> Optional[Dict]:
        """Normalize AI grammar payload into standard structure"""
        if not payload:
            return None

        question = payload.get('question') or payload.get('prompt')
        if not question:
            return None

        topic_area = payload.get('topic_area') or payload.get('grammar_focus') or 'Grammar and Usage'
        question_type = payload.get('question_type') or payload.get('type') or 'Grammar Practice'
        instructions = payload.get('instructions') or payload.get('instruction') or 'Provide your answer.'

        # Acceptable answers handling
        acceptable_answers = payload.get('acceptable_answers') or payload.get('answers') or payload.get('answer_options')
        if acceptable_answers is None:
            acceptable_answers = payload.get('answer') or payload.get('correct_answer')

        if acceptable_answers is None:
            acceptable_answers_list: List[str] = []
        elif isinstance(acceptable_answers, list):
            acceptable_answers_list = [str(ans).strip() for ans in acceptable_answers if str(ans).strip()]
        else:
            acceptable_answers_list = [str(acceptable_answers).strip()]

        # Ensure we have at least one canonical answer text
        canonical_answer = payload.get('correct_answer') or payload.get('answer')
        if not canonical_answer and acceptable_answers_list:
            canonical_answer = acceptable_answers_list[0]
        canonical_answer = str(canonical_answer).strip() if canonical_answer else ''

        # Hints normalization
        hints_raw = payload.get('hint_sequence') or payload.get('hints') or []
        normalized_hints = []
        if isinstance(hints_raw, dict):
            hints_raw = [hints_raw]
        if isinstance(hints_raw, list):
            for idx, item in enumerate(hints_raw):
                if isinstance(item, dict):
                    text = item.get('text') or item.get('hint') or ''
                    level = item.get('level') or item.get('stage') or (idx + 1)
                else:
                    text = str(item)
                    level = idx + 1
                text = text.strip()
                if text:
                    normalized_hints.append({
                        'level': int(level),
                        'text': text
                    })

        # Explanation normalization
        explanation_block = payload.get('explanation') or {}
        if isinstance(explanation_block, list) and explanation_block:
            explanation_block = explanation_block[0]
        if not isinstance(explanation_block, dict):
            explanation_block = {}

        explanation = {
            'correction': explanation_block.get('correction') or canonical_answer,
            'rule': explanation_block.get('rule') or explanation_block.get('rule_statement') or '',
            'error_analysis': explanation_block.get('error_analysis') or explanation_block.get('error') or '',
            'zimsec_importance': explanation_block.get('zimsec_importance') or explanation_block.get('zimsec_relevance') or '',
            'examples': explanation_block.get('examples') if isinstance(explanation_block.get('examples'), list) else []
        }

        options = payload.get('options') or payload.get('choices') or []
        if options and not isinstance(options, list):
            options = [str(options)]

        if not normalized_hints:
            normalized_hints = [
                {'level': 1, 'text': f'Identify the grammar concept involved in this {question_type.lower()} question.'},
                {'level': 2, 'text': 'Recall the specific rule that governs this structure within the ZIMSEC syllabus.'},
                {'level': 3, 'text': 'Focus on the exact word or phrase that must change to satisfy the rule.'}
            ]

        reference_id = payload.get('question_reference') or payload.get('reference')
        if not reference_id:
            reference_id = f"AI-{uuid.uuid4().hex[:8].upper()}"

        return {
            'question_type': question_type,
            'topic_area': topic_area,
            'question': question.strip(),
            'instructions': instructions.strip() if isinstance(instructions, str) else 'Provide your answer.',
            'options': options,
            'acceptable_answers': acceptable_answers_list,
            'answer': canonical_answer,
            'hints': normalized_hints,
            'explanation': explanation,
            'difficulty': payload.get('difficulty') or payload.get('level') or 'standard',
            'register_context': payload.get('register_context'),
            'question_reference': reference_id
        }

    def _wrap_legacy_grammar_question(self, question_data: Dict) -> Dict:
        """Transform legacy database grammar question into AI structure"""
        if not question_data:
            question_data = {}

        question_text = question_data.get('question', 'Provide your answer to the grammar question.')
        instructions = question_data.get('instructions') or 'Please provide your answer.'
        answer_text = question_data.get('answer') or ''
        explanation_text = question_data.get('explanation') or ''
        topic_area = question_data.get('topic_area', 'Grammar and Usage')

        hints = [
            {'level': 1, 'text': f'This question focuses on {topic_area}. Identify the grammatical concept being tested.'},
            {'level': 2, 'text': 'Recall the rule that applies in this situation. Pay attention to the key words in the sentence.'},
            {'level': 3, 'text': 'Look closely at how the subject and verb or the reported speech should agree with each other.'}
        ]

        return {
            'question_type': question_data.get('question_type') or 'Grammar Practice',
            'topic_area': topic_area,
            'question': question_text,
            'instructions': instructions,
            'options': question_data.get('options') or [],
            'acceptable_answers': [answer_text] if answer_text else [],
            'answer': answer_text,
            'hints': hints,
            'explanation': {
                'correction': answer_text,
                'rule': question_data.get('rule') or 'Review the relevant grammar rule and apply it carefully.',
                'error_analysis': explanation_text,
                'zimsec_importance': 'Grammar accuracy is essential for Paper 1 directed writing and Paper 2 language structure questions in the ZIMSEC syllabus.',
                'examples': question_data.get('examples') or []
            },
            'difficulty': question_data.get('difficulty') or 'standard',
            'register_context': question_data.get('register_context'),
            'question_reference': question_data.get('id')
        }

    def generate_ai_grammar_question(self, last_question_type: Optional[str] = None) -> Optional[Dict]:
        """Generate grammar question using Gemini AI persona prompt"""
        if not self._is_configured or not self.client:
            logger.warning("Gemini AI not configured - skipping AI grammar generation")
            return None

        try:
            question_types = [
                "Sentence Transformation",
                "Error Correction",
                "Gap Filling",
                "Multiple Choice",
                "Register/Contextual"
            ]

            available_types = question_types.copy()
            if last_question_type and last_question_type in available_types and len(available_types) > 1:
                available_types.remove(last_question_type)

            selected_type = random.choice(available_types)

            grammar_focus_areas = [
                "Subject-Verb Agreement",
                "Tense Consistency",
                "Active and Passive Voice",
                "Direct and Indirect Speech",
                "Phrasal Verbs",
                "Clauses and Sentence Structure",
                "Register and Formality",
                "Word Formation",
                "Prepositions and Conjunctions",
                "Determiners and Articles"
            ]

            selected_focus = random.choice(grammar_focus_areas)

            prompt = f"""
AI Tutor Persona: Professional ZIMSEC O-Level English Tutor
Goal: Assess and improve the student's mastery of Grammar and Usage within the ZIMSEC English Language syllabus (Forms 1-4).

Interaction Requirements:
- Adopt an encouraging, patient, precise, and authoritative tone.
- Emphasize understanding of the rule and context rather than memorization.
- Connect every concept to ZIMSEC examination demands, including register and communicative purpose.

Current Question Requirements:
- Question Type: {selected_type}
- Grammar Focus: {selected_focus}
- Ensure alignment with ZIMSEC Paper 2 (Language Structures) expectations.

Return ONLY valid JSON (no markdown fences, commentary, or prose) using this exact structure:
{{
  "question_type": "{selected_type}",
  "topic_area": "{selected_focus}",
  "question": "...",
  "instructions": "...",
  "options": ["..."] or [],
  "acceptable_answers": ["..."] ,
  "hint_sequence": [
    {{"level": 1, "text": "Concept identification hint"}},
    {{"level": 2, "text": "Rule reminder hint"}},
    {{"level": 3, "text": "Contextual application hint"}}
  ],
  "explanation": {{
    "correction": "Model answer or correction.",
    "rule": "State the exact grammar rule applied.",
    "error_analysis": "Explain common mistakes or why wrong answers fail.",
    "zimsec_importance": "Why this skill matters for ZIMSEC exams.",
    "examples": ["Example sentence 1", "Example sentence 2"]
  }},
  "register_context": "If relevant, describe the formal/informal context or audience. Otherwise null.",
  "difficulty": "easy/medium/hard",
  "question_reference": "Unique short reference ID"
}}

Additional Instructions:
- For Multiple Choice or Register/Contextual items, include exactly 4 options in the "options" array.
- Ensure "acceptable_answers" lists all variations that should be marked correct.
- Keep hints concise and escalating without revealing the answer directly.
- Use Zimbabwean contexts or names where appropriate.
- Do not include any explanations outside the JSON payload.
"""

            try:
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config={
                        "response_mime_type": "application/json",
                        "temperature": 0.6,
                        "max_output_tokens": 1500
                    }
                )
                logger.info("Gemini API (gemini-2.5-flash) call completed successfully for grammar")
            except Exception as api_error:
                logger.error(f"Gemini API call failed: {api_error}")
                return None

            if not response or not response.text:
                logger.warning("Empty response from Gemini AI for grammar question")
                return None

            try:
                logger.debug(f"Raw Gemini response (first 500 chars): {response.text[:500]}...")
                clean_text = self._clean_json_block(response.text)
                logger.debug(f"Cleaned Gemini response (first 500 chars): {clean_text[:500]}...")
                payload = json.loads(clean_text)
                normalized = self._normalize_ai_grammar_payload(payload)
                if normalized:
                    normalized['source'] = 'ai'
                    logger.info(f"Generated AI grammar question - Type: {normalized.get('question_type')} | Focus: {normalized.get('topic_area')}")
                    return {
                        'success': True,
                        'question_data': normalized
                    }
                logger.warning("AI grammar payload missing required fields")
            except json.JSONDecodeError as e:
                logger.error(f"Grammar AI JSON decode error: {e}")
            except Exception as error:
                logger.error(f"Error normalizing AI grammar payload: {error}")

        except Exception as e:
            logger.error(f"Error generating AI grammar question: {e}")

        return None

    def generate_deepseek_grammar_question(self, last_question_type: Optional[str] = None) -> Optional[Dict]:
        """Generate grammar question using DeepSeek as fallback"""
        if not self.deepseek_api_key:
            logger.warning("DeepSeek API key not configured - skipping DeepSeek grammar generation")
            return None

        try:
            question_types = [
                "Sentence Transformation",
                "Error Correction",
                "Gap Filling",
                "Multiple Choice",
                "Register/Contextual"
            ]

            available_types = question_types.copy()
            if last_question_type and last_question_type in available_types and len(available_types) > 1:
                available_types.remove(last_question_type)

            selected_type = random.choice(available_types)

            grammar_focus_areas = [
                "Subject-Verb Agreement",
                "Tense Consistency",
                "Active and Passive Voice",
                "Direct and Indirect Speech",
                "Phrasal Verbs",
                "Clauses and Sentence Structure",
                "Register and Formality",
                "Word Formation",
                "Prepositions and Conjunctions",
                "Determiners and Articles"
            ]

            selected_focus = random.choice(grammar_focus_areas)

            system_prompt = (
                "You are a professional ZIMSEC O-Level English Tutor. Maintain an encouraging, precise, and authoritative tone "
                "while creating grammar and usage questions that reflect the ZIMSEC syllabus (Forms 1-4)."
            )

            user_prompt = f"""
Goal: Generate a single ZIMSEC O-Level English grammar question.

Question Type: {selected_type}
Grammar Focus: {selected_focus}

Requirements:
- Align with Paper 2 Language Structures expectations.
- Connect the concept to real examination contexts and register demands.
- Provide high-quality hints and explanations following the tutoring protocol.
- Use Zimbabwean contexts where helpful.

Return ONLY valid JSON strictly using this structure (no markdown fences or commentary):
{{
  "question_type": "{selected_type}",
  "topic_area": "{selected_focus}",
  "question": "...",
  "instructions": "...",
  "options": ["..."] or [],
  "acceptable_answers": ["..."],
  "hint_sequence": [
    {{"level": 1, "text": "Concept identification hint"}},
    {{"level": 2, "text": "Rule reminder hint"}},
    {{"level": 3, "text": "Contextual application hint"}}
  ],
  "explanation": {{
    "correction": "Model answer or correction.",
    "rule": "Exact grammar rule applied.",
    "error_analysis": "Why wrong answers fail.",
    "zimsec_importance": "Why this matters for ZIMSEC exams.",
    "examples": ["Example sentence 1", "Example sentence 2"]
  }},
  "register_context": "Describe formality/audience if relevant, else null.",
  "difficulty": "easy/medium/hard",
  "question_reference": "Unique reference ID"
}}
"""

            headers = {
                'Authorization': f'Bearer {self.deepseek_api_key}',
                'Content-Type': 'application/json'
            }

            payload = {
                'model': DEEPSEEK_CHAT_MODEL,
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_prompt}
                ],
                'temperature': 0.6,
                'max_tokens': 1200
            }

            response = requests.post(self.deepseek_api_url, headers=headers, json=payload, timeout=45)
            if response.status_code != 200:
                logger.error(f"DeepSeek grammar generation failed: {response.status_code} - {response.text}")
                return None

            data = response.json()
            choices = data.get('choices') or []
            if not choices:
                logger.warning("DeepSeek grammar response missing choices")
                return None

            content = choices[0].get('message', {}).get('content', '')
            if not content:
                logger.warning("DeepSeek grammar response missing content")
                return None

            try:
                clean_text = self._clean_json_block(content)
                payload = json.loads(clean_text)
                normalized = self._normalize_ai_grammar_payload(payload)
                if normalized:
                    normalized['source'] = 'deepseek'
                    logger.info(
                        "Generated DeepSeek grammar question - Type: %s | Focus: %s",
                        normalized.get('question_type'),
                        normalized.get('topic_area')
                    )
                    return {
                        'success': True,
                        'question_data': normalized
                    }
                logger.warning("DeepSeek grammar payload missing required fields")
            except json.JSONDecodeError as e:
                logger.error(f"DeepSeek grammar JSON decode error: {e}")
            except Exception as error:
                logger.error(f"Error normalizing DeepSeek grammar payload: {error}")

        except requests.RequestException as e:
            logger.error(f"DeepSeek grammar request error: {e}")
        except Exception as e:
            logger.error(f"Error generating DeepSeek grammar question: {e}")

        return None

    def generate_grammar_question(self, last_question_type: Optional[str] = None, platform: str = 'mobile') -> Optional[Dict]:
        """
        Retrieve grammar questions using AI based on platform
        
        Args:
            last_question_type: Last question type to avoid repetition
            platform: 'whatsapp' for Vertex AI, 'mobile' for DeepSeek (default)
        """
        # WhatsApp bot: Use Vertex AI
        if platform == 'whatsapp':
            return self._generate_grammar_with_vertex_ai(last_question_type)
        
        # Mobile app: Use DeepSeek AI first with Gemini fallback (unchanged)
        deepseek_response = self.generate_deepseek_grammar_question(last_question_type=last_question_type)
        if deepseek_response and deepseek_response.get('success'):
            return deepseek_response
        
        # Secondary: Gemini AI fallback
        gemini_response = self.generate_ai_grammar_question(last_question_type=last_question_type)
        if gemini_response and gemini_response.get('success'):
            return gemini_response

        # Tertiary: Database question
        try:
            from database.external_db import get_random_grammar_question

            question_data = get_random_grammar_question()
            if question_data:
                logger.info(f"Retrieved grammar question from database - Topic: {question_data.get('topic_area', 'Unknown')}")
                normalized = self._wrap_legacy_grammar_question(question_data)
                normalized['source'] = 'database'
                return {
                    'success': True,
                    'question_data': normalized
                }
            else:
                logger.warning("No questions found in database")
        except Exception as e:
            logger.error(f"Error retrieving question from database: {e}")

        # Final fallback
        logger.warning("Using fallback grammar question")
        fallback = self._wrap_legacy_grammar_question(self._get_fallback_grammar_question())
        fallback['source'] = 'fallback'
        return {
            'success': True,
            'question_data': fallback
        }

    def generate_ai_vocabulary_question(self, last_question_type: Optional[str] = None) -> Optional[Dict]:
        """Generate vocabulary question using Gemini AI with ZIMSEC O-Level pedagogy"""
        if not self._is_configured or not self.client:
            logger.warning("Gemini AI not configured - skipping AI vocabulary generation")
            return None
        
        try:
            import random
            
            # Select question type with variety
            question_types = [
                "Multiple Choice", "Contextual Cloze", "Synonym Matching", 
                "Sentence Construction", "Usage Correction"
            ]
            available_types = question_types.copy()
            if last_question_type and last_question_type in available_types and len(available_types) > 1:
                available_types.remove(last_question_type)
            selected_type = random.choice(available_types)
            
            # Select vocabulary focus
            vocabulary_categories = [
                ("Register", ["Emotions/Feelings", "Attitude/Character", "Manner/Tone/Mood"]),
                ("Contextual", ["Synonyms/Antonyms", "Phrasal Verbs/Idioms", "Homophones/Confusables"])
            ]
            category, focus_areas = random.choice(vocabulary_categories)
            focus_area = random.choice(focus_areas)
            
            # Select difficulty
            difficulty = random.choice(["easy", "medium", "hard"])
            
            prompt = f"""
AI Tutor Persona: Professional ZIMSEC O-Level English Vocabulary Expert
Goal: Assess and expand student's dictionary knowledge and contextual word usage.

Current Requirements:
- Question Type: {selected_type}
- Vocabulary Category: {category}
- Focus Area: {focus_area}
- Difficulty: {difficulty}
- Align with ZIMSEC O-Level English Language syllabus (Forms 1-4)

Generate ONE vocabulary question following these exact requirements:

For {selected_type}:
{"- Provide 4 options (A, B, C, D) testing precise meaning/nuance" if selected_type == "Multiple Choice" else ""}
{"- Create a sentence with a blank requiring contextual understanding" if selected_type == "Contextual Cloze" else ""}
{"- Provide 5 words to match with their synonyms/antonyms" if selected_type == "Synonym Matching" else ""}
{"- Give a high-level word for the student to use correctly in a sentence" if selected_type == "Sentence Construction" else ""}
{"- Present a sentence with incorrect word usage to identify and correct" if selected_type == "Usage Correction" else ""}

Focus on {focus_area} vocabulary:
{"- Emotions: ecstatic, demoralized, indignant, frustrated" if "Emotions" in focus_area else ""}
{"- Attitude: cynical, diplomatic, conscientious, haughty" if "Attitude" in focus_area else ""}
{"- Tone/Mood: sardonic, contemplative, condescending, jovial" if "Tone" in focus_area else ""}
{"- Test words like ubiquitous, ephemeral, mitigate, profound" if "Synonyms" in focus_area else ""}
{"- Common expressions: look up to, put up with, beat around the bush" if "Phrasal" in focus_area else ""}
{"- Commonly confused: affect/effect, compliment/complement" if "Homophones" in focus_area else ""}

Return ONLY valid JSON (no markdown fences or commentary):
{{
  "question_type": "{selected_type}",
  "vocabulary_category": "{category}",
  "focus_area": "{focus_area}",
  "question": "The complete question text",
  "instructions": "Clear instructions for the student",
  "options": ["option1", "option2", "option3", "option4"] or [],
  "acceptable_answers": ["answer1", "answer2"],
  "hint_sequence": [
    {{"level": 1, "text": "Category identification hint"}},
    {{"level": 2, "text": "Contextual/grammatical clue"}},
    {{"level": 3, "text": "Etymology/root word hint"}}
  ],
  "explanation": {{
    "correction": "The correct answer",
    "definition": "Precise, student-friendly definition",
    "contextual_nuance": "Connotation and register of the word",
    "etymology": "Word origin or family",
    "zimsec_importance": "Why this matters for ZIMSEC exams",
    "examples": ["Example sentence 1", "Example sentence 2"]
  }},
  "difficulty": "{difficulty}",
  "question_reference": "VOC-{selected_type[:3].upper()}-{random.randint(1000,9999)}"
}}
"""
            
            try:
                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config={
                        "response_mime_type": "application/json",
                        "temperature": 0.7,
                        "max_output_tokens": 1800
                    }
                )
                logger.info("Gemini API (gemini-2.5-flash) call completed successfully for vocabulary")
            except Exception as api_error:
                logger.error(f"Gemini API call failed: {api_error}")
                return None
            
            if response and response.text and response.text.strip():
                try:
                    # Clean and parse response
                    cleaned_text = self._clean_json_block(response.text.strip())
                    question_data = json.loads(cleaned_text)
                    
                    # Normalize the payload
                    normalized = self._normalize_ai_vocabulary_payload(question_data)
                    normalized['source'] = 'ai'
                    
                    logger.info(f"AI vocabulary question generated successfully - Type: {selected_type}")
                    return {
                        'success': True,
                        'question_data': normalized
                    }
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse Gemini vocabulary response: {e}")
                    logger.debug(f"Raw response: {response.text[:500]}")
                    return None
            else:
                logger.error("Empty or invalid response from Gemini for vocabulary")
                return None
                
        except Exception as e:
            logger.error(f"Error generating AI vocabulary question: {e}")
            return None
    
    def generate_deepseek_vocabulary_question(self, last_question_type: Optional[str] = None) -> Optional[Dict]:
        """Generate vocabulary question using DeepSeek as fallback"""
        if not self.deepseek_api_key:
            logger.warning("DeepSeek API key not configured - skipping DeepSeek vocabulary generation")
            return None
        
        try:
            import random
            
            # Select question type with variety
            question_types = [
                "Multiple Choice", "Contextual Cloze", "Synonym Matching", 
                "Sentence Construction", "Usage Correction"
            ]
            available_types = question_types.copy()
            if last_question_type and last_question_type in available_types and len(available_types) > 1:
                available_types.remove(last_question_type)
            selected_type = random.choice(available_types)
            
            # Select vocabulary focus
            vocabulary_categories = [
                ("Register", ["Emotions/Feelings", "Attitude/Character", "Manner/Tone/Mood"]),
                ("Contextual", ["Synonyms/Antonyms", "Phrasal Verbs/Idioms", "Homophones/Confusables"])
            ]
            category, focus_areas = random.choice(vocabulary_categories)
            focus_area = random.choice(focus_areas)
            
            system_prompt = (
                "You are a professional ZIMSEC O-Level English Vocabulary Expert. "
                "Create vocabulary questions that expand students' dictionary knowledge and contextual word usage."
            )
            
            user_prompt = f"""
Generate a ZIMSEC O-Level vocabulary question.

Question Type: {selected_type}
Category: {category} - {focus_area}
Difficulty: {random.choice(["easy", "medium", "hard"])}

Requirements:
- Test precise vocabulary understanding
- Focus on register, connotation, and contextual usage
- Provide graduated hints and comprehensive explanations

Return ONLY valid JSON:
{{
  "question_type": "{selected_type}",
  "vocabulary_category": "{category}",
  "focus_area": "{focus_area}",
  "question": "...",
  "instructions": "...",
  "options": [...] or [],
  "acceptable_answers": [...],
  "hint_sequence": [
    {{"level": 1, "text": "Category hint"}},
    {{"level": 2, "text": "Context clue"}},
    {{"level": 3, "text": "Etymology hint"}}
  ],
  "explanation": {{
    "correction": "...",
    "definition": "...",
    "contextual_nuance": "...",
    "etymology": "...",
    "zimsec_importance": "...",
    "examples": [...]
  }},
  "difficulty": "easy/medium/hard"
}}
"""
            
            headers = {
                'Authorization': f'Bearer {self.deepseek_api_key}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                'model': DEEPSEEK_CHAT_MODEL,
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_prompt}
                ],
                'temperature': 0.7,
                'max_tokens': 1500
            }
            
            response = requests.post(self.deepseek_api_url, headers=headers, json=payload, timeout=45)
            
            if response.status_code == 200:
                response_data = response.json()
                content = response_data.get('choices', [{}])[0].get('message', {}).get('content', '')
                
                if content:
                    try:
                        cleaned_text = self._clean_json_block(content.strip())
                        question_data = json.loads(cleaned_text)
                        normalized = self._normalize_ai_vocabulary_payload(question_data)
                        normalized['source'] = 'deepseek'
                        
                        logger.info(f"DeepSeek vocabulary question generated - Type: {selected_type}")
                        return {
                            'success': True,
                            'question_data': normalized
                        }
                    except json.JSONDecodeError as e:
                        logger.error(f"Failed to parse DeepSeek vocabulary response: {e}")
                        return None
            else:
                logger.error(f"DeepSeek API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error generating DeepSeek vocabulary question: {e}")
            return None
    
    def _normalize_ai_vocabulary_payload(self, ai_response: Dict) -> Dict:
        """Normalize AI vocabulary response to standard format"""
        try:
            # Extract hint sequence
            hint_sequence = ai_response.get('hint_sequence', [])
            if not hint_sequence:
                hint_sequence = [
                    {"level": 1, "text": "Think about the category of word needed here."},
                    {"level": 2, "text": "Consider the context and grammatical requirements."},
                    {"level": 3, "text": "Think about related words or word roots."}
                ]
            
            # Extract explanation
            explanation = ai_response.get('explanation', {})
            if isinstance(explanation, str):
                explanation = {
                    "correction": ai_response.get('acceptable_answers', [''])[0],
                    "definition": explanation,
                    "contextual_nuance": "",
                    "etymology": "",
                    "zimsec_importance": "This vocabulary is essential for ZIMSEC exams.",
                    "examples": []
                }
            
            normalized = {
                'question_type': ai_response.get('question_type', 'Vocabulary Practice'),
                'vocabulary_category': ai_response.get('vocabulary_category', 'Contextual'),
                'focus_area': ai_response.get('focus_area', 'General Vocabulary'),
                'question': ai_response.get('question', ''),
                'instructions': ai_response.get('instructions', 'Answer the question.'),
                'options': ai_response.get('options', []),
                'acceptable_answers': ai_response.get('acceptable_answers', []),
                'hint_sequence': hint_sequence,
                'explanation': explanation,
                'difficulty': ai_response.get('difficulty', 'medium'),
                'question_reference': ai_response.get('question_reference', f'VOC-{random.randint(1000,9999)}')
            }
            
            return normalized
            
        except Exception as e:
            logger.error(f"Error normalizing vocabulary payload: {e}")
            return ai_response
    
    def _wrap_legacy_vocabulary_question(self, legacy_question: Dict) -> Dict:
        """Wrap database vocabulary question in new AI-driven structure"""
        try:
            # For MCQ format from database
            options = legacy_question.get('options', [])
            correct_answer = legacy_question.get('correct_answer', 0)
            
            # Build acceptable answers
            acceptable_answers = []
            if options and correct_answer < len(options):
                acceptable_answers = [options[correct_answer]]
            
            return {
                'question_type': 'Multiple Choice',
                'vocabulary_category': 'Contextual',
                'focus_area': 'General Vocabulary',
                'question': legacy_question.get('question', ''),
                'instructions': 'Choose the best answer.',
                'options': options,
                'acceptable_answers': acceptable_answers,
                'hint_sequence': [
                    {"level": 1, "text": "Think about what type of word fits here."},
                    {"level": 2, "text": "Consider the context of the sentence."},
                    {"level": 3, "text": "Eliminate obviously wrong options."}
                ],
                'explanation': {
                    "correction": acceptable_answers[0] if acceptable_answers else '',
                    "definition": legacy_question.get('explanation', ''),
                    "contextual_nuance": "",
                    "etymology": "",
                    "zimsec_importance": "This vocabulary is important for ZIMSEC exams.",
                    "examples": []
                },
                'difficulty': 'medium',
                'question_reference': f"VOC-DB-{random.randint(1000,9999)}"
            }
            
        except Exception as e:
            logger.error(f"Error wrapping legacy vocabulary question: {e}")
            return legacy_question
    
    def evaluate_vocabulary_answer(self, user_answer: str, acceptable_answers: List, options: List = None) -> Dict:
        """Evaluate vocabulary answer with flexible matching"""
        try:
            # Normalize user answer
            normalized_user = user_answer.strip().lower()
            
            # Check direct match with acceptable answers
            for acceptable in acceptable_answers:
                if normalized_user == acceptable.strip().lower():
                    return {
                        'is_correct': True,
                        'matched_answer': acceptable,
                        'correct_answer_text': acceptable
                    }
            
            # Check if user gave option letter (A, B, C, D) for MCQ
            if options and len(normalized_user) == 1 and normalized_user in 'abcd':
                option_index = ord(normalized_user) - ord('a')
                if option_index < len(options):
                    selected_option = options[option_index]
                    for acceptable in acceptable_answers:
                        if selected_option.strip().lower() == acceptable.strip().lower():
                            return {
                                'is_correct': True,
                                'matched_answer': acceptable,
                                'correct_answer_text': acceptable
                            }
            
            # Not correct
            return {
                'is_correct': False,
                'matched_answer': None,
                'correct_answer_text': acceptable_answers[0] if acceptable_answers else ''
            }
            
        except Exception as e:
            logger.error(f"Error evaluating vocabulary answer: {e}")
            return {
                'is_correct': False,
                'matched_answer': None,
                'correct_answer_text': ''
            }
    
    def format_vocabulary_explanation(self, explanation_data: Dict, is_correct: bool, 
                                     user_answer: str, correct_answer: str) -> str:
        """Format comprehensive vocabulary explanation"""
        try:
            lines = []
            
            # Professional teacher-style header
            if is_correct:
                lines.append("✅ **Excellent work!** Your answer is *correct*! 🎉")
                lines.append("")
                lines.append("You've demonstrated a good understanding of this vocabulary concept.")
            else:
                lines.append("📚 **Let's review this together** 📚")
                lines.append("")
                lines.append(f"*Your Answer:* {user_answer if user_answer else 'No answer provided'}")
                lines.append(f"*Correct Answer:* **{correct_answer}**")
                lines.append("")
                lines.append("Let me explain why this is the correct answer:")
            
            lines.append("")
            
            # Definition
            if explanation_data.get('definition'):
                lines.append(f"📖 **Definition:** {explanation_data['definition']}")
                lines.append("")
            
            # Contextual nuance
            if explanation_data.get('contextual_nuance'):
                lines.append(f"💭 **Context & Register:** {explanation_data['contextual_nuance']}")
                lines.append("")
            
            # Etymology
            if explanation_data.get('etymology'):
                lines.append(f"🌱 **Word Origin:** {explanation_data['etymology']}")
                lines.append("")
            
            # ZIMSEC importance
            if explanation_data.get('zimsec_importance'):
                lines.append(f"🎯 **ZIMSEC Relevance:** {explanation_data['zimsec_importance']}")
                lines.append("")
            
            # Examples
            examples = explanation_data.get('examples', [])
            if examples:
                lines.append("📝 **Example Usage:**")
                for i, example in enumerate(examples[:2], 1):
                    lines.append(f"{i}. {example}")
            
            # Encouraging closing
            lines.append("")
            if is_correct:
                lines.append("🌟 *Keep up the excellent work!* Continue expanding your vocabulary! 🌟")
            else:
                lines.append("💪 *Don't worry!* Every word you learn brings you closer to mastery. Keep practicing! 💪")
            
            return "\n".join(lines)
            
        except Exception as e:
            logger.error(f"Error formatting vocabulary explanation: {e}")
            return f"✅ Correct answer: {correct_answer}\n💡 {explanation_data.get('definition', 'Keep expanding your vocabulary!')}"
    
    def generate_vocabulary_question(self, last_question_type: Optional[str] = None) -> Optional[Dict]:
        """Generate vocabulary questions using Gemini AI first with DeepSeek fallback"""
        # Primary: Gemini AI generation
        gemini_response = self.generate_ai_vocabulary_question(last_question_type=last_question_type)
        if gemini_response and gemini_response.get('success'):
            return gemini_response
        
        # Secondary: DeepSeek AI fallback
        deepseek_response = self.generate_deepseek_vocabulary_question(last_question_type=last_question_type)
        if deepseek_response and deepseek_response.get('success'):
            return deepseek_response
        
        # Tertiary: Database question
        try:
            from database.external_db import get_random_vocabulary_question
            question_data = get_random_vocabulary_question()
            if question_data:
                logger.info(f"Retrieved vocabulary question from database")
                normalized = self._wrap_legacy_vocabulary_question(question_data)
                normalized['source'] = 'database'
                return {
                    'success': True,
                    'question_data': normalized
                }
        except Exception as e:
            logger.error(f"Error retrieving vocabulary from database: {e}")
        # Final fallback
        logger.warning("Using fallback vocabulary question")
        fallback = self._wrap_legacy_vocabulary_question(self._get_fallback_vocabulary_question())
        fallback['source'] = 'fallback'
        return {
            'success': True,
            'question_data': fallback
        }

    def generate_gemini_comprehension_passage(self, theme: str, form_level: int = 4) -> Optional[Dict]:
        """Generate comprehension passage using Gemini AI"""
        if not self._is_configured or not self.client:
            return None
            
        try:
            prompt = f"""You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience setting professional comprehension exercises for Zimbabwean students. You have deep knowledge of the ZIMSEC Ordinary Level English Language syllabus and extensive experience as a ZIMSEC examiner and marker.

ROLE: EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER & TEACHER

CORE PRINCIPLES (NON-NEGOTIABLE):
1. STRICT ZIMSEC ALIGNMENT - Use ONLY ZIMSEC O-Level English Language Paper 2 Comprehension format. Do NOT introduce external systems (IELTS, Cambridge IGCSE variations, foreign rubrics).
2. EXAMINER-FOCUSED - Generate comprehension exercises that test exactly what ZIMSEC examiners look for. Reference ZIMSEC marking criteria.
3. PAPER-BASED THINKING - This comprehension exercise aligns with ZIMSEC Paper 2 Section A (Comprehension).
4. ZIMBABWE CONTEXT - Use local, culturally relevant contexts (schools, communities, daily life in Zimbabwe). Include Zimbabwean names, places, and situations.

SUBJECT: English Language (ZIMSEC O-Level - Paper 2 Section A: Comprehension)
THEME: {theme}
LEVEL: Form {form_level} (O-Level, Age 15-17)

ZIMSEC FORMAT REQUIREMENTS:
- Length: 400-500 words (appropriate for shorter comprehension exercises)
- Level: Form {form_level} (O-Level Zimbabwe)
- Include 5 comprehension questions (mix of literal and inferential)
- Include answers for grading with ZIMSEC marking criteria
- Use authentic Zimbabwean context

QUESTION DISTRIBUTION (Must sum to 5):
- Literal (Direct Recall): 2-3 questions - Test information directly stated in the text
- Inferential (Reading between lines): 2-3 questions - Test ability to draw conclusions from implied information

EXPERT EXAMINER GUIDELINES:
- Literal questions: Test direct recall of facts, details, and information explicitly stated
- Inferential questions: Require students to read between lines, understand implied meaning, make connections
- Mark allocation: Typically 2 marks per question (total 10 marks)
- Questions should feel like professional ZIMSEC exam questions, not generic textbook exercises

FRESHNESS REQUIREMENTS:
- Use unique scenarios NOT commonly found in typical textbook passages
- Vary contexts: school situations, community events, everyday life in Zimbabwe, cultural references
- Create engaging, age-appropriate content that resonates with Zimbabwean students

Return ONLY valid JSON (NO markdown formatting, NO additional text):
{{
    "title": "Title Relevant to {theme}",
    "passage": "The full passage text with authentic Zimbabwean context (400-500 words)...",
    "zimsec_paper_reference": "Paper 2 Section A (Comprehension)",
    "questions": [
        {{"question": "Clear ZIMSEC exam-style question", "answer": "Model answer with evidence from passage", "type": "literal/inferential", "marks": 2, "explanation": "Why this answer is correct with reference to passage"}}
    ]
}}"""
            
            model = self.client.GenerativeModel('gemini-2.0-flash-exp')
            response = model.generate_content(
                prompt, 
                generation_config=self.client.types.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.7
                )
            )
            
            if response and hasattr(response, 'text') and response.text:
                clean_text = self._clean_json_block(response.text)
                return json.loads(clean_text)
                
        except Exception as e:
            logger.error(f"Gemini comprehension generation error: {e}")
            
        return None

    def generate_comprehension(self, theme: str = None, form_level: int = 4, platform: str = 'mobile') -> Dict:
        """
        Generate comprehension passage using AI based on platform
        
        Args:
            theme: Optional theme for the passage
            form_level: ZIMSEC form level (1-4), defaults to 4 for O-Level
            platform: 'whatsapp' for Vertex AI, 'mobile' for DeepSeek (default)
            
        Returns:
            Dictionary with passage, title, and questions
        """
        # Select random theme if not provided
        if not theme:
            themes = [
                "technology and youth",
                "environmental conservation",
                "Zimbabwean history and culture",
                "education and career",
                "sports and fitness",
                "family and relationships",
                "community development",
                "health and nutrition",
                "wildlife conservation",
                "entrepreneurship"
            ]
            theme = random.choice(themes)
        
        # WhatsApp bot: Use Vertex AI
        if platform == 'whatsapp':
            result = self._generate_comprehension_with_vertex_ai(theme, form_level)
            if result:
                logger.info("Generated comprehension using Vertex AI for WhatsApp")
                return result
            # Fallback to DeepSeek if Vertex AI fails
            logger.info("Vertex AI failed, falling back to DeepSeek for WhatsApp")
            platform = 'mobile'
        
        # Mobile app: Try DeepSeek first, then Gemini, then fallback (unchanged)
        if platform == 'mobile':
            if self.deepseek_api_key:
                try:
                    deepseek_result = self._generate_deepseek_comprehension(theme, form_level)
                    if deepseek_result:
                        logger.info("Generated comprehension using DeepSeek AI")
                        return deepseek_result
                except Exception as e:
                    logger.warning(f"DeepSeek comprehension generation failed: {e}")
            
            # Try Gemini as fallback
            gemini_result = self.generate_gemini_comprehension_passage(theme, form_level)
            if gemini_result:
                logger.info("Generated comprehension using Gemini AI")
                return gemini_result
        
        # Final fallback
        logger.info("Using fallback comprehension passage")
        return self._get_fallback_comprehension()
    
    def _generate_deepseek_comprehension(self, theme: str, form_level: int = 4) -> Optional[Dict]:
        """Generate comprehension passage using DeepSeek AI"""
        if not self.deepseek_api_key:
            return None
            
        try:
            import requests
            
            prompt = f"""You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience setting professional comprehension exercises for Zimbabwean students. You have deep knowledge of the ZIMSEC Ordinary Level English Language syllabus and extensive experience as a ZIMSEC examiner and marker.

ROLE: EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER & TEACHER

CORE PRINCIPLES (NON-NEGOTIABLE):
1. STRICT ZIMSEC ALIGNMENT
   - Use ONLY ZIMSEC O-Level English Language Paper 2 Comprehension format
   - Do NOT introduce external systems (IELTS, Cambridge IGCSE variations, foreign rubrics)
   - Focus on ZIMSEC Paper 2 structure and marking schemes only

2. EXAMINER-FOCUSED
   - Generate comprehension exercises that test exactly what ZIMSEC examiners look for
   - Highlight how marks are awarded and lost
   - Emphasize literal understanding, inference, vocabulary in context, and critical analysis
   - Reference ZIMSEC marking criteria and common examiner comments

3. PAPER-BASED THINKING
   - This comprehension exercise aligns with ZIMSEC Paper 2 Section A (Comprehension)
   - Consider time allocation and mark distribution per question type
   - Ensure questions test examinable skills only

4. ZIMBABWE CONTEXT
   - Use local, culturally relevant contexts (schools, communities, daily life in Zimbabwe)
   - Maintain formal exam-appropriate English register
   - Include Zimbabwean names, places, and situations
   - Authentic Zimbabwe setting, characters, and cultural references

SUBJECT: English Language (ZIMSEC O-Level - Paper 2 Section A: Comprehension)
THEME: {theme}
LEVEL: Form {form_level} (Age 15-17, O-Level Zimbabwe)

ZIMSEC FORMAT REQUIREMENTS:
- Length: 400-500 words (appropriate for shorter comprehension exercises)
- Level: Form {form_level} (O-Level Zimbabwe)
- Include 5 comprehension questions (mix of literal and inferential)
- Include model answers for grading with ZIMSEC marking criteria
- Use Zimbabwean context where appropriate

QUESTION DISTRIBUTION (Must sum to 5):
- Literal (Direct Recall): 2-3 questions - Test information directly stated in the text
- Inferential (Reading between lines): 2-3 questions - Test ability to draw conclusions from implied information

EXPERT EXAMINER GUIDELINES:
- Literal questions: Should test direct recall of facts, details, and information explicitly stated
- Inferential questions: Should require students to read between lines, understand implied meaning, make connections
- Mark allocation: Typically 2 marks per question (total 10 marks for this exercise)
- Ensure questions progress from easier (literal) to more challenging (inferential)
- Questions should feel like professional ZIMSEC exam questions, not generic textbook exercises

FRESHNESS REQUIREMENTS:
- Use unique scenarios NOT commonly found in typical textbook passages
- Vary contexts: school situations, community events, everyday life in Zimbabwe, cultural references
- Create engaging, age-appropriate content that resonates with Zimbabwean students
- Ensure passage feels professionally crafted like a real ZIMSEC exam passage

Return ONLY valid JSON in this exact format (NO markdown formatting, NO additional text):
{{
    "title": "Passage Title Relevant to {theme}",
    "passage": "The full passage text with authentic Zimbabwean context (400-500 words)...",
    "zimsec_paper_reference": "Paper 2 Section A (Comprehension)",
    "questions": [
        {{"question": "Clear ZIMSEC exam-style question", "answer": "Model answer with evidence from passage", "type": "literal", "marks": 2, "explanation": "Why this answer is correct with reference to passage"}},
        {{"question": "Clear ZIMSEC exam-style question", "answer": "Model answer with evidence from passage", "type": "inferential", "marks": 2, "explanation": "Why this answer is correct with reference to passage"}}
    ]
}}"""
            
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.deepseek_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": DEEPSEEK_CHAT_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience. You create professional ZIMSEC-aligned comprehension exercises for Zimbabwean students. Strictly ZIMSEC format only - no foreign syllabus contamination."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                if content:
                    clean_content = self._clean_json_block(content)
                    return json.loads(clean_content)
                    
        except Exception as e:
            logger.error(f"DeepSeek comprehension generation error: {e}")
            
        return None

    def _get_fallback_comprehension(self) -> Dict:
        """Fallback comprehension passage when AI fails"""

        return {
            "title": "The School Garden Project",
            "passage": "Tendai looked at the empty plot of land behind his school with excitement. As the head of the Environmental Club at Mufakose High School, he had been planning this garden project for months. The headmaster had finally given permission to use the space for growing vegetables. 'This will help our school become more sustainable,' Tendai thought as he sketched plans in his notebook. He envisioned rows of tomatoes, cabbages, and beans that could be used in the school kitchen. The project would also teach students about agriculture and environmental conservation. Tendai knew it wouldn't be easy - they would need tools, seeds, and water. But with the support of his club members and some teachers, he was confident they could create something amazing. The garden would not only provide food but also serve as an outdoor classroom where students could learn practical skills.",
            "questions": [
                {
                    "question": "Who is the main character in this passage?",
                    "answer": "Tendai",
                    "type": "literal"
                },
                {
                    "question": "What school does Tendai attend?",
                    "answer": "Mufakose High School",
                    "type": "literal"
                },
                {
                    "question": "What vegetables does Tendai plan to grow?",
                    "answer": "Tomatoes, cabbages, and beans",
                    "type": "literal"
                },
                {
                    "question": "Why does Tendai think the garden project is important?",
                    "answer": "It will help the school become more sustainable and serve as an outdoor classroom",
                    "type": "inferential"
                },
                {
                    "question": "What challenges does Tendai anticipate for the project?",
                    "answer": "They will need tools, seeds, and water",
                    "type": "literal"
                }
            ]
        }

    def generate_essay_marking(self, marking_prompt: str) -> Optional[str]:
        """Generate essay marking using DeepSeek AI with robust error handling and improved marking criteria"""
        if not self.deepseek_api_key:
            logger.warning("DeepSeek API key not configured for essay marking")
            return self._generate_fallback_essay_marking()

        try:
            # Enhanced marking prompt for better scoring
            enhanced_prompt = f"""
{marking_prompt}

IMPROVED MARKING GUIDELINES:
- Be lenient but fair in marking O-Level students
- Give appropriate marks based on effort and understanding shown
- Consider that these are 15-17 year old students learning English
- Focus on encouraging improvement while being honest about weaknesses

SPECIFIC MARKING CRITERIA:
- Excellent essays (25-30 marks): Very few errors, great ideas, excellent structure
- Good essays (20-24 marks): Some errors but good understanding and effort
- Average essays (15-19 marks): Several errors but shows understanding of topic
- Below average essays (10-14 marks): Many errors but shows some effort and basic understanding
- Poor essays (5-9 marks): Significant problems but student has attempted the task
- Very poor essays (1-4 marks): Major issues throughout but still some content present

Count the actual errors in grammar, spelling, and structure. For every 3-4 significant errors, reduce the score by 2-3 marks from the content baseline. Be encouraging in feedback while being realistic about the grade.

Return valid JSON with the exact format requested (no markdown, no code blocks, just pure JSON)."""

            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.deepseek_api_key}',
            }

            payload = {
                'model': DEEPSEEK_CHAT_MODEL,
                'messages': [{'role': 'user', 'content': enhanced_prompt}],
                'max_tokens': 2500,
                'temperature': 0.3
            }

            response = requests.post(self.deepseek_api_url, headers=headers, json=payload, timeout=60)

            if response.status_code == 200:
                data = response.json()
                if 'choices' in data and len(data['choices']) > 0:
                    content = data['choices'][0].get('message', {}).get('content', '')
                    if content and content.strip():
                        try:
                            clean_text = content.strip()
                            if clean_text.startswith('```json'):
                                clean_text = clean_text[7:]
                            if clean_text.startswith('```'):
                                clean_text = clean_text[3:]
                            if clean_text.endswith('```'):
                                clean_text = clean_text[:-3]
                            clean_text = clean_text.strip()

                            logger.info("Essay marking completed successfully using DeepSeek")
                            return clean_text
                        except Exception as e:
                            logger.error(f"Error processing DeepSeek essay marking response: {e}")
                    else:
                        logger.error("Empty response from DeepSeek essay marking")
                else:
                    logger.warning("DeepSeek essay marking response missing choices")
            else:
                logger.error(f"DeepSeek API error for essay marking: {response.status_code} - {response.text}")

        except requests.exceptions.RequestException as e:
            logger.error(f"DeepSeek essay marking request error: {e}")
        except Exception as e:
            logger.error(f"Error in DeepSeek essay marking: {e}")

        return self._generate_fallback_essay_marking()

    def grade_comprehension_answers(self, passage: str, questions: List[Dict], user_answers: Dict[str, str]) -> Dict:
        """Grade comprehension answers using DeepSeek AI"""
        if not self.deepseek_api_key:
            logger.warning("DeepSeek API key not configured for comprehension grading")
            return self._fallback_comprehension_grading(questions, user_answers)

        try:
            prompt = f"""Grade these ZIMSEC O-Level English comprehension answers.

Passage:
{passage[:1000]}... (truncated for context)

Questions and Student Answers:
"""
            for i, q in enumerate(questions):
                q_text = q.get('question', '')
                q_mark = q.get('marks', 2)
                q_correct = q.get('correct_answer', '')
                u_answer = user_answers.get(str(i), user_answers.get(i, ''))
                
                prompt += f"""
Q{i+1}: {q_text} ({q_mark} marks)
Correct Answer: {q_correct}
Student Answer: {u_answer}
"""

            prompt += """
Instructions:
- Compare student answer to correct answer semantically.
- Award marks (0 to max) based on accuracy and completeness.
- Provide brief, helpful feedback for each.
- Be strict but fair, following ZIMSEC standards.

Return ONLY valid JSON:
{
    "question_grades": [
        {
            "question_index": 0,
            "marks_awarded": 1,
            "max_marks": 2,
            "feedback": "Good attempt, but you missed..."
        }
    ],
    "total_score": 15,
    "total_possible": 20,
    "overall_feedback": "General comment..."
}
"""
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.deepseek_api_key}',
            }

            payload = {
                'model': DEEPSEEK_CHAT_MODEL,
                'messages': [{'role': 'user', 'content': prompt}],
                'max_tokens': 2000,
                'temperature': 0.3
            }

            response = requests.post(self.deepseek_api_url, headers=headers, json=payload, timeout=60)
            if response.status_code == 200:
                content = response.json()['choices'][0]['message']['content']
                clean_text = self._clean_json_block(content)
                return json.loads(clean_text)
            
        except Exception as e:
            logger.error(f"Error grading comprehension: {e}")
            
        return self._fallback_comprehension_grading(questions, user_answers)

    def _fallback_comprehension_grading(self, questions: List[Dict], user_answers: Dict[str, str]) -> Dict:
        """Simple keyword matching fallback"""
        grades = []
        total_score = 0
        total_possible = 0
        
        for i, q in enumerate(questions):
            max_marks = q.get('marks', 2)
            correct = q.get('correct_answer', '').lower()
            student = user_answers.get(str(i), user_answers.get(i, '')).lower()
            
            # Simple overlap check
            correct_words = set(correct.split())
            student_words = set(student.split())
            overlap = len(correct_words.intersection(student_words))
            
            score = 0
            if overlap > len(correct_words) * 0.7:
                score = max_marks
            elif overlap > len(correct_words) * 0.4:
                score = max(1, int(max_marks / 2))
                
            grades.append({
                "question_index": i,
                "marks_awarded": score,
                "max_marks": max_marks,
                "feedback": "Automated fallback grading used."
            })
            total_score += score
            total_possible += max_marks
            
        return {
            "question_grades": grades,
            "total_score": total_score,
            "total_possible": total_possible,
            "overall_feedback": "Graded using keyword matching."
        }

    def grade_summary(self, passage: str, summary_prompt: str, user_summary: str) -> Dict:
        """Grade summary writing using DeepSeek AI"""
        if not self.deepseek_api_key:
            return {"score": 0, "feedback": "AI grading unavailable"}

        try:
            prompt = f"""You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience marking professional summary exercises for Zimbabwean students. You have deep knowledge of the ZIMSEC Ordinary Level English Language syllabus and extensive experience as a ZIMSEC examiner and marker.

ROLE: EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER & MARKER

CORE PRINCIPLES (NON-NEGOTIABLE):
1. STRICT ZIMSEC ALIGNMENT - Use ONLY ZIMSEC O-Level English Language Paper 2 Section B (Summary) marking criteria. Do NOT use external systems (IELTS, Cambridge IGCSE variations, foreign rubrics).
2. EXAMINER-FOCUSED - Mark exactly as ZIMSEC examiners do. Highlight how marks are awarded and lost.
3. PAPER-BASED THINKING - This summary aligns with ZIMSEC Paper 2 Section B (Summary), typically 20 marks total.
4. ZIMBABWE CONTEXT - Consider appropriateness of content for Zimbabwean students and contexts.

SUBJECT: English Language (ZIMSEC O-Level - Paper 2 Section B: Summary)

SOURCE PASSAGE:
{passage}

SUMMARY PROMPT/INSTRUCTIONS:
{summary_prompt}

STUDENT'S SUMMARY:
{user_summary}

ZIMSEC MARKING CRITERIA (Total: 20 marks) - Use EXACTLY these criteria:
1. CONTENT POINTS (10-12 marks):
   - Identification and inclusion of key points from the passage
   - Coverage of all main ideas relevant to the summary prompt
   - Exclusion of irrelevant details and examples
   - Logical organization of points

2. LANGUAGE (8-10 marks):
   - Use of own words (paraphrasing, avoiding direct lifting from passage) - 3-4 marks
   - Language accuracy (grammar, spelling, punctuation) - 3-4 marks
   - Conciseness and clarity - 2 marks
   - Word count discipline (usually 160 words limit) - deduct marks if significantly exceeded

EXAMINER MARKING GUIDELINES:
- Mark strictly but fairly, as a ZIMSEC examiner would
- Award marks for content points identified and included
- Deduct marks for: exceeding word limit significantly, direct lifting without paraphrasing, missing key points, language errors
- Consider the student's level (O-Level, Forms 1-4, ages 15-17)
- Provide specific feedback on strengths and areas for improvement
- Reference ZIMSEC marking standards and common examiner comments
- Be encouraging but honest about the score

COMMON ZIMSEC EXAMINER COMMENTS TO REFERENCE:
- "Good selection of key points but needs more paraphrasing"
- "All main points covered but word count exceeded"
- "Language is accurate but some key points missed"
- "Good use of own words throughout"
- "Needs better organization of points"

Return ONLY valid JSON (NO markdown formatting, NO additional text):
{{
    "content_points": 10,
    "language_mark": 5,
    "total_score": 15,
    "max_score": 20,
    "word_count": 145,
    "word_limit_exceeded": false,
    "feedback": "Detailed ZIMSEC examiner-style feedback on strengths and areas for improvement",
    "key_points_missed": ["Point 1", "Point 2"],
    "key_points_included": ["Point 1", "Point 2"],
    "paraphrasing_quality": "Good/Fair/Poor - assessment of use of own words",
    "zimsec_paper_reference": "Paper 2 Section B (Summary)"
}}
"""
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.deepseek_api_key}',
            }

            payload = {
                'model': DEEPSEEK_CHAT_MODEL,
                'messages': [{'role': 'user', 'content': prompt}],
                'max_tokens': 1500,
                'temperature': 0.3
            }

            response = requests.post(self.deepseek_api_url, headers=headers, json=payload, timeout=60)
            if response.status_code == 200:
                content = response.json()['choices'][0]['message']['content']
                clean_text = self._clean_json_block(content)
                return json.loads(clean_text)

        except Exception as e:
            logger.error(f"Error grading summary: {e}")

        return {"score": 0, "feedback": "Error in grading service"}

    def _generate_fallback_essay_marking(self) -> str:
        """Generate fallback essay marking when AI fails"""
        fallback_data = {
            "score": 18,
            "grade": "C+",
            "summary_feedback": "Your essay demonstrates good understanding of the topic with clear ideas and logical structure. The content is relevant and shows creativity. However, there are some areas that need improvement including grammar consistency, vocabulary usage, and sentence structure. With more practice and attention to detail, your skills will continue to develop. Keep up the good effort!",
            "specific_errors": [
                {"wrong": "have had", "correct": "had", "type": "verb tense"},
                {"wrong": "was were", "correct": "were", "type": "subject-verb agreement"},
                {"wrong": "moment", "correct": "moments", "type": "singular/plural"},
                {"wrong": "enjoy", "correct": "enjoyed", "type": "past tense"},
                {"wrong": "make", "correct": "made", "type": "past tense"}
            ],
            "corrections_explanation": [
                "Maintain consistent tense throughout your essay",
                "Check subject-verb agreement in complex sentences",
                "Proofread for spelling and punctuation errors",
                "Use varied vocabulary to enhance your writing",
                "Ensure clear paragraph transitions"
            ],
            "improved_version": "Your essay has been reviewed. Focus on the feedback provided to improve your writing skills. Practice makes perfect!"
        }

        import json
        return json.dumps(fallback_data)

    def _get_grade_from_score(self, score: int) -> str:
        """Convert numerical score to ZIMSEC grade"""
        if score >= 26:
            return "A"
        elif score >= 22:
            return "B"
        elif score >= 18:
            return "C"
        elif score >= 14:
            return "D"
        elif score >= 10:
            return "E"
        else:
            return "U"

    def _get_grade_from_percentage(self, percentage: int) -> str:
        """Convert percentage to ZIMSEC grade"""
        if percentage >= 75:
            return "A"
        elif percentage >= 65:
            return "B"
        elif percentage >= 50:
            return "C"
        elif percentage >= 45:
            return "D"
        elif percentage >= 40:
            return "E"
        else:
            return "U"

    def generate_long_comprehension_passage(self, theme: str, form_level: int = 4) -> Optional[Dict]:
        """Generate long comprehensive passage with Gemini first, DeepSeek fallback"""
        # Primary: Gemini AI generation
        gemini_result = self.generate_gemini_comprehension_passage(theme, form_level)
        if gemini_result:
            return gemini_result
        
        # Secondary: DeepSeek AI fallback
        try:
            from standalone_english_comprehension_generator import standalone_english_comprehension_generator
            
            logger.info(f"Gemini failed, trying DeepSeek V3.1 for theme: {theme}, form: {form_level}")
            result = standalone_english_comprehension_generator.generate_long_comprehension_passage(theme, form_level)
            
            if result:
                logger.info(f"✅ Successfully generated long comprehension passage using DeepSeek V3.1")
                return result
            else:
                logger.warning("DeepSeek long comprehension generation also failed, using fallback")
                
        except Exception as e:
            logger.error(f"Error in DeepSeek long comprehension generation: {e}")
        
        # Final fallback
        logger.warning("Using fallback long comprehension passage")
        return self._get_fallback_long_comprehension(theme)

    def generate_long_comprehension_passage_fast(self, theme: str, form_level: int = 4) -> Optional[Dict]:
        """Fast comprehension generation with Gemini first, DeepSeek fallback with reduced timeouts"""
        # Primary: Gemini AI generation (faster than DeepSeek)
        gemini_result = self.generate_gemini_comprehension_passage(theme, form_level)
        if gemini_result:
            logger.info(f"✅ Fast generation successful using Gemini 2.0 Flash Exp")
            return gemini_result
        
        # Secondary: DeepSeek AI fallback with reduced timeouts
        try:
            from standalone_english_comprehension_generator import standalone_english_comprehension_generator
            
            logger.info(f"Gemini failed, trying fast DeepSeek V3.1 for theme: {theme}, form: {form_level}")
            
            # Create a fast generator instance with reduced timeouts
            fast_generator = standalone_english_comprehension_generator.__class__()
            fast_generator.api_key = standalone_english_comprehension_generator.api_key
            fast_generator.api_url = standalone_english_comprehension_generator.api_url
            fast_generator.max_retries = 2  # Reduced from 3
            fast_generator.timeouts = [15, 25]  # Reduced from [30, 45, 60]
            fast_generator.retry_delay = 1  # Reduced from 2
            
            result = fast_generator.generate_long_comprehension_passage(theme, form_level)
            
            if result:
                logger.info(f"✅ Fast generation successful using DeepSeek V3.1")
                return result
            else:
                logger.warning("Fast DeepSeek generation also failed, using fallback immediately")
                
        except Exception as e:
            logger.error(f"Error in fast DeepSeek generation: {e}")
            
        return self._get_fallback_long_comprehension(theme)

    def generate_free_response_topics(self) -> Optional[Dict]:
        """Generate free response essay topics using DeepSeek first, then Gemini fallback"""
        
        # Try DeepSeek first (primary AI)
        if self.deepseek_api_key:
            try:
                deepseek_result = self._generate_deepseek_free_response_topics()
                if deepseek_result:
                    logger.info("✅ Generated 7 free response topics using DeepSeek AI")
                    return deepseek_result
            except Exception as e:
                logger.warning(f"DeepSeek free response topics failed: {e}")
        
        # Try Gemini as fallback
        if self._is_configured and self.client:
            try:
                prompt = """You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience setting professional free response composition topics for Zimbabwean students. You have deep knowledge of the ZIMSEC Ordinary Level English Language syllabus and extensive experience as a ZIMSEC examiner and marker.

ROLE: EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER & TEACHER

CORE PRINCIPLES (NON-NEGOTIABLE):
1. STRICT ZIMSEC ALIGNMENT - Use ONLY ZIMSEC O-Level English Language Paper 1 Section A (Free Response) format. Do NOT introduce external systems (IELTS, Cambridge IGCSE variations, foreign rubrics).
2. EXAMINER-FOCUSED - Generate topics that test exactly what ZIMSEC examiners look for: creativity, structure, language use, relevance.
3. PAPER-BASED THINKING - This aligns with ZIMSEC Paper 1 Section A (Free Response), typically 30 marks total.
4. ZIMBABWE CONTEXT - Use local, culturally relevant topics that resonate with Zimbabwean students.

SUBJECT: English Language (ZIMSEC O-Level - Paper 1 Section A: Free Response Composition)

Generate 7 diverse essay topics suitable for O-Level students (15-17 years old).
Include a mix of:
- Narrative (story telling)
- Descriptive (describing person, place, event)
- Expository (factual, explanatory)
- Argumentative (persuasive)

For each topic provide:
1. Title
2. Brief description/prompt
3. Type (narrative, descriptive, etc.)
4. Suggested length (350-450 words)

Return ONLY valid JSON (no markdown fences):
{
  "topics": [
    {
      "title": "A Day I Will Never Forget",
      "description": "Write about a memorable day in your life that left a lasting impression on you.",
      "type": "narrative",
      "suggested_length": "350-450 words"
    },
    ... (6 more topics)
  ]
}"""
                
                model = self.client.GenerativeModel('gemini-2.5-flash')
                response = model.generate_content(
                    prompt,
                    generation_config=self.client.types.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.8,
                        max_output_tokens=2000
                    ),
                )
                
                if response and hasattr(response, 'text') and response.text:
                    clean_text = self._clean_json_block(response.text)
                    data = json.loads(clean_text)
                    logger.info("✅ Generated 7 free response topics using Gemini 2.5 Flash (fallback)")
                    return {
                        'success': True,
                        'topics': data.get('topics', [])
                    }
                
            except Exception as e:
                logger.error(f"Gemini free response topics error: {e}")
        
        return self._get_fallback_free_response_topics()
    
    def _generate_deepseek_free_response_topics(self) -> Optional[Dict]:
        """Generate free response topics using DeepSeek AI"""
        if not self.deepseek_api_key:
            return None
            
        try:
            import requests
            
            prompt = """You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience setting professional free response composition topics for Zimbabwean students. You have deep knowledge of the ZIMSEC Ordinary Level English Language syllabus and extensive experience as a ZIMSEC examiner and marker.

ROLE: EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER & TEACHER

CORE PRINCIPLES (NON-NEGOTIABLE):
1. STRICT ZIMSEC ALIGNMENT - Use ONLY ZIMSEC O-Level English Language Paper 1 Section A (Free Response) format. Do NOT introduce external systems (IELTS, Cambridge IGCSE variations, foreign rubrics).
2. EXAMINER-FOCUSED - Generate topics that test exactly what ZIMSEC examiners look for: creativity, structure, language use, relevance.
3. PAPER-BASED THINKING - This aligns with ZIMSEC Paper 1 Section A (Free Response), typically 30 marks total.
4. ZIMBABWE CONTEXT - Use local, culturally relevant topics that resonate with Zimbabwean students.

SUBJECT: English Language (ZIMSEC O-Level - Paper 1 Section A: Free Response Composition)

Generate 7 diverse essay topics suitable for O-Level students (15-17 years old) in Zimbabwe.
Include a mix of ZIMSEC-examinable types:
- Narrative (story telling with plot, setting, characters)
- Descriptive (describing person, place, event with vivid imagery)
- Expository (factual, explanatory writing)
- Argumentative/Discursive (persuasive writing with clear thesis)

EXPERT EXAMINER GUIDELINES:
- Topics should be appropriate for 15-17 year old Zimbabwean students (Forms 1-4)
- Topics should allow students to demonstrate: creativity, structure, language use, relevance
- Suggested length: 350-450 words (appropriate for ZIMSEC O-Level)
- Topics should be engaging and allow for personal expression
- Ensure topics feel professionally crafted like real ZIMSEC exam topics

FRESHNESS REQUIREMENTS:
- Use unique topics NOT commonly found in typical textbook prompts
- Vary contexts: school situations, community events, everyday life in Zimbabwe, cultural references
- Create engaging, age-appropriate topics that resonate with Zimbabwean students

For each topic provide:
1. Title (clear and engaging)
2. Brief description/prompt (1-2 sentences setting context)
3. Type (narrative, descriptive, expository, argumentative)
4. Suggested length (350-450 words)

Return ONLY valid JSON:
{
  "topics": [
    {
      "title": "A Day I Will Never Forget",
      "description": "Write about a memorable day in your life that left a lasting impression on you.",
      "type": "narrative",
      "suggested_length": "350-450 words"
    }
  ]
}"""
            
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.deepseek_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": DEEPSEEK_CHAT_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are a ZIMSEC English examiner."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.8,
                    "max_tokens": 2000
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                if content:
                    clean_content = self._clean_json_block(content)
                    data = json.loads(clean_content)
                    return {
                        'success': True,
                        'topics': data.get('topics', [])
                    }
                    
        except Exception as e:
            logger.error(f"DeepSeek free response topics error: {e}")
            
        return None

    def _get_fallback_free_response_topics(self) -> Dict:
        """Fallback free response topics when AI fails"""
        return {
            'success': True,
            'topics': [
                {
                    "title": "A Day I Will Never Forget",
                    "description": "Write about a memorable day in your life that left a lasting impression on you.",
                    "type": "narrative",
                    "suggested_length": "350-450 words"
                },
                {
                    "title": "My Role Model",
                    "description": "Describe a person you admire and explain why they inspire you.",
                    "type": "descriptive",
                    "suggested_length": "350-450 words"
                },
                {
                    "title": "The Importance of Education",
                    "description": "Discuss why education is important for young people in Zimbabwe.",
                    "type": "expository",
                    "suggested_length": "350-450 words"
                },
                {
                    "title": "A Frightening Experience",
                    "description": "Narrate a time when you felt scared and how you overcame your fear.",
                    "type": "narrative",
                    "suggested_length": "350-450 words"
                },
                {
                    "title": "My Favorite Place",
                    "description": "Describe a place that is special to you and explain why you love it.",
                    "type": "descriptive",
                    "suggested_length": "350-450 words"
                },
                {
                    "title": "The Impact of Technology on Youth",
                    "description": "Explain how technology has changed the lives of young people in your community.",
                    "type": "expository",
                    "suggested_length": "350-450 words"
                },
                {
                    "title": "Should School Uniforms Be Compulsory?",
                    "description": "Present your argument for or against making school uniforms mandatory.",
                    "type": "argumentative",
                    "suggested_length": "350-450 words"
                }
            ]
        }

    def generate_guided_composition_prompt(self) -> Optional[Dict]:
        """Generate a guided composition prompt for ZIMSEC using DeepSeek first, then Gemini fallback"""
        
        # Try DeepSeek first (primary AI)
        if self.deepseek_api_key:
            try:
                deepseek_result = self._generate_deepseek_guided_composition()
                if deepseek_result:
                    logger.info("✅ Generated guided composition prompt using DeepSeek AI")
                    return deepseek_result
            except Exception as e:
                logger.warning(f"DeepSeek guided composition failed: {e}")
        
        # Try Gemini as fallback
        if self._is_configured and self.client:
            try:
                prompt = """You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience setting professional guided composition prompts for Zimbabwean students. You have deep knowledge of the ZIMSEC Ordinary Level English Language syllabus and extensive experience as a ZIMSEC examiner and marker.

ROLE: EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER & TEACHER

CORE PRINCIPLES (NON-NEGOTIABLE):
1. STRICT ZIMSEC ALIGNMENT
   - Use ONLY ZIMSEC O-Level English Language Paper 1 Section B (Guided Composition) format
   - Do NOT introduce external systems (IELTS, Cambridge IGCSE variations, foreign rubrics)
   - Focus on ZIMSEC Paper 1 structure and marking schemes only

2. EXAMINER-FOCUSED
   - Generate prompts that test exactly what ZIMSEC examiners look for
   - Highlight how marks are awarded: structure, register, relevance, accuracy
   - Reference ZIMSEC marking criteria and common examiner comments
   - Ensure prompts test appropriate register, format, and content

3. PAPER-BASED THINKING
   - This prompt aligns with ZIMSEC Paper 1 Section B (Guided Composition)
   - Consider time allocation and mark distribution (typically 20 marks)
   - Ensure prompts test examinable skills only

4. ZIMBABWE CONTEXT
   - Use local, culturally relevant contexts (schools, communities, daily life in Zimbabwe)
   - Maintain formal exam-appropriate English register
   - Include Zimbabwean names, places, and situations
   - Be relevant to Zimbabwean school/community life

SUBJECT: English Language (ZIMSEC O-Level - Paper 1 Section B: Guided Composition)

Generate ONE guided composition prompt. Choose randomly from these ZIMSEC-examinable formats:
- Formal letter (to headmaster, council, newspaper editor, government official)
- Informal letter (to friend, relative)
- Speech (for school assembly, debate, ceremony, community event)
- Report (school event, community project, field trip)
- Magazine article (for school magazine, youth publication)
- Memorandum/Notice (if syllabus-supported)

EXPERT EXAMINER GUIDELINES:
- Prompt should be appropriate for 15-17 year old Zimbabwean students (Forms 1-4)
- Include clear context and situation relevant to Zimbabwean students
- Provide 4-6 key points to guide the composition (these are what examiners look for)
- Specify the format clearly (formal/informal letter, speech, report, article)
- Ensure prompt tests: structure, register, relevance to prompt, accuracy
- Suggested length: 250-350 words (appropriate for ZIMSEC O-Level)
- Format requirements: Specify exact format expectations (addresses, date, salutation, closing for letters; structure for speeches/reports)

FRESHNESS REQUIREMENTS:
- Use unique scenarios NOT commonly found in typical textbook prompts
- Vary contexts: school situations, community events, everyday life in Zimbabwe, cultural references
- Create engaging, age-appropriate prompts that resonate with Zimbabwean students
- Ensure prompt feels professionally crafted like a real ZIMSEC exam prompt

Return ONLY valid JSON (NO markdown formatting, NO additional text):
{
  "title": "Appropriate Title for the Composition",
  "format": "formal_letter/informal_letter/speech/report/article/memo",
  "context": "Clear, detailed context and situation relevant to Zimbabwean students (1-2 sentences)",
  "key_points": [
    "First key point examiners will look for (4-6 points total)",
    "Second key point",
    "Third key point",
    "Fourth key point",
    "Fifth key point (if needed)",
    "Sixth key point (if needed)"
  ],
  "suggested_length": "250-350 words",
  "format_requirements": "Specific format requirements (e.g., 'Use proper formal letter format with addresses, date, salutation, and closing' or 'Include introduction, body paragraphs, and conclusion for speech')",
  "zimsec_paper_reference": "Paper 1 Section B (Guided Composition)",
  "marking_focus": "Brief note on what examiners will focus on (structure, register, relevance, accuracy)"
}"""
                
                model = self.client.GenerativeModel('gemini-2.5-flash')
                response = model.generate_content(
                    prompt,
                    generation_config=self.client.types.GenerationConfig(
                        response_mime_type="application/json",
                        temperature=0.8,
                        max_output_tokens=1500
                    ),
                )
                
                if response and hasattr(response, 'text') and response.text:
                    clean_text = self._clean_json_block(response.text)
                    data = json.loads(clean_text)
                    logger.info("✅ Generated guided composition prompt using Gemini 2.5 Flash (fallback)")
                    return {
                        'success': True,
                        'prompt': data
                    }
                
            except Exception as e:
                logger.error(f"Gemini guided composition error: {e}")
        
        return self._get_fallback_guided_composition()
    
    def _generate_deepseek_guided_composition(self) -> Optional[Dict]:
        """Generate guided composition prompt using DeepSeek AI"""
        if not self.deepseek_api_key:
            return None
            
        try:
            import requests
            
            prompt = """You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience setting professional guided composition prompts for Zimbabwean students. You have deep knowledge of the ZIMSEC Ordinary Level English Language syllabus and extensive experience as a ZIMSEC examiner and marker.

ROLE: EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER & TEACHER

CORE PRINCIPLES (NON-NEGOTIABLE):
1. STRICT ZIMSEC ALIGNMENT - Use ONLY ZIMSEC O-Level English Language Paper 1 Section B (Guided Composition) format. Do NOT introduce external systems (IELTS, Cambridge IGCSE variations, foreign rubrics).
2. EXAMINER-FOCUSED - Generate prompts that test exactly what ZIMSEC examiners look for: structure, register, relevance, accuracy.
3. PAPER-BASED THINKING - This prompt aligns with ZIMSEC Paper 1 Section B (Guided Composition), typically 20 marks.
4. ZIMBABWE CONTEXT - Use local, culturally relevant contexts (schools, communities, daily life in Zimbabwe).

SUBJECT: English Language (ZIMSEC O-Level - Paper 1 Section B: Guided Composition)

Generate ONE guided composition prompt. Choose randomly from these ZIMSEC-examinable formats:
- Formal letter (to headmaster, council, newspaper editor, government official)
- Informal letter (to friend, relative)
- Speech (for school assembly, debate, ceremony, community event)
- Report (school event, community project, field trip)
- Magazine article (for school magazine, youth publication)
- Memorandum/Notice (if syllabus-supported)

EXPERT EXAMINER GUIDELINES:
- Prompt should be appropriate for 15-17 year old Zimbabwean students (Forms 1-4)
- Include clear context and situation relevant to Zimbabwean students
- Provide 4-6 key points to guide the composition (these are what examiners look for)
- Specify the format clearly (formal/informal letter, speech, report, article)
- Suggested length: 250-350 words (appropriate for ZIMSEC O-Level)
- Format requirements: Specify exact format expectations

FRESHNESS REQUIREMENTS:
- Use unique scenarios NOT commonly found in typical textbook prompts
- Vary contexts: school situations, community events, everyday life in Zimbabwe, cultural references
- Create engaging, age-appropriate prompts that resonate with Zimbabwean students

Return ONLY valid JSON (NO markdown formatting, NO additional text):
{
  "title": "Appropriate Title for the Composition",
  "format": "formal_letter/informal_letter/speech/report/article/memo",
  "context": "Clear, detailed context and situation relevant to Zimbabwean students (1-2 sentences)",
  "key_points": [
    "First key point examiners will look for (4-6 points total)",
    "Second key point",
    "Third key point",
    "Fourth key point"
  ],
  "suggested_length": "250-350 words",
  "format_requirements": "Specific format requirements",
  "zimsec_paper_reference": "Paper 1 Section B (Guided Composition)"
}"""
            
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.deepseek_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": DEEPSEEK_CHAT_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience. You create professional ZIMSEC-aligned guided composition prompts for Zimbabwean students. Strictly ZIMSEC format only - no foreign syllabus contamination."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.8,
                    "max_tokens": 1500
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                if content:
                    clean_content = self._clean_json_block(content)
                    data = json.loads(clean_content)
                    return {
                        'success': True,
                        'prompt': data
                    }
                    
        except Exception as e:
            logger.error(f"DeepSeek guided composition error: {e}")
            
        return None
    
    def _get_fallback_guided_composition(self) -> Dict:
        """Fallback guided composition when AI fails"""
        return {
            'success': True,
            'prompt': {
                "title": "Letter to the Headmaster",
                "format": "formal_letter",
                "context": "As the head of the Environmental Club, write a letter to your headmaster requesting permission and support to start a school garden project.",
                "key_points": [
                    "Explain the purpose of the garden project",
                    "Describe the benefits for the school",
                    "List the resources needed",
                    "Suggest a suitable location",
                    "Request permission and support"
                ],
                "suggested_length": "250-350 words",
                "format_requirements": "Use proper formal letter format with addresses, date, salutation, and closing."
            }
        }

    def mark_free_response_essay(self, student_name: str, student_surname: str, 
                                 essay_text: str, topic: Dict) -> Optional[Dict]:
        """Mark free response essay out of 30 using DeepSeek first, then Gemini fallback"""
        # Primary: DeepSeek AI
        if self.deepseek_api_key:
            try:
                deepseek_result = self._mark_deepseek_free_response_essay(student_name, student_surname, essay_text, topic)
                if deepseek_result:
                    logger.info("✅ Marked free response essay using DeepSeek AI")
                    return deepseek_result
            except Exception as e:
                logger.warning(f"DeepSeek free response marking failed: {e}")

        # Secondary: Gemini AI fallback
        if not self._is_configured or not self.client:
            logger.warning("Gemini AI not configured and DeepSeek failed - cannot mark essay")
            return self._fallback_free_marking(student_name, student_surname)
        
        try:
            # Using concatenation to avoid potential f-string parsing issues with large blocks
            prompt_intro = f"You are a professional ZIMSEC O-Level English examiner marking Paper 1 Section A (Free Response).\n\nSTUDENT INFORMATION:\nName: {student_name} {student_surname}\n\nESSAY TOPIC:\n{topic.get('title', '')}\n{topic.get('description', '')}\n\nSTUDENT ESSAY:\n{essay_text}\n\n"
            
            prompt_criteria = """ZIMSEC MARKING CRITERIA (Total: 30 marks) - Use EXACTLY these criteria as a ZIMSEC examiner would:

1. CONTENT (15 marks):
   - Relevance to topic (addresses the topic directly and fully) - 4 marks
   - Development of ideas (sufficient detail, examples, explanations) - 5 marks
   - Creativity and originality (unique perspective, engaging content) - 3 marks
   - Use of examples and details (specific, relevant examples) - 3 marks

2. LANGUAGE (10 marks):
   - Grammar and sentence structure (correct tenses, subject-verb agreement, sentence variety) - 4 marks
   - Vocabulary and word choice (appropriate, varied vocabulary) - 3 marks
   - Spelling and punctuation (accuracy throughout) - 2 marks
   - Tense consistency (consistent use of tenses) - 1 mark

3. ORGANIZATION (5 marks):
   - Paragraph structure (clear introduction, body paragraphs, conclusion) - 2 marks
   - Logical flow and coherence (smooth transitions, logical sequence) - 3 marks

EXAMINER MARKING GUIDELINES:
- Mark strictly but fairly, as a ZIMSEC examiner would
- Award marks for what is present, not just deduct for errors
- Consider the student's level (O-Level, Forms 1-4, ages 15-17)
- Provide specific feedback on strengths and areas for improvement
- Reference ZIMSEC marking standards and common examiner comments
- Be encouraging but honest about the score

COMMON ZIMSEC EXAMINER COMMENTS TO REFERENCE:
- "Good relevance to topic but needs more development"
- "Creative ideas but language errors affect clarity"
- "Well-organized with clear paragraph structure"
- "Good use of examples but needs better vocabulary"
- "Needs stronger introduction and conclusion"
   - Introduction and conclusion
   - Transitions between ideas

INSTRUCTIONS:
1. Mark the essay strictly according to ZIMSEC standards
2. Identify ALL errors (grammar, spelling, tense, punctuation, word choice)
3. For each error, provide the wrong text and the correct version
4. Write a corrected version of the entire essay
5. Be fair but thorough - this is for learning

Return ONLY valid JSON (no markdown fences):
{
  "score": 24,
  "max_score": 30,
  "breakdown": {
    "content": 12,
    "language": 8,
    "organization": 4
  },
  "corrections": [
    {
      "wrong": "I have went",
      "correct": "I went",
      "type": "grammar",
      "explanation": "Past tense of 'go' is 'went', not 'have went'"
    }
  ],
  "corrected_essay": "Full corrected version of the essay with all errors fixed...",
  "detailed_feedback": "Specific feedback on strengths and areas for improvement..."
}"""
            prompt = prompt_intro + prompt_criteria
            
            model = self.client.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(
                prompt,
                generation_config=self.client.types.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                    max_output_tokens=4000
                ),
            )
            
            if response and hasattr(response, 'text') and response.text:
                clean_text = self._clean_json_block(response.text)
                data = json.loads(clean_text)
                
                # Add teacher comment based on score
                score = data.get('score', 0)
                max_score = data.get('max_score', 30)
                
                # Ensure max_score is valid to prevent division by zero
                if not max_score or max_score <= 0:
                    max_score = 30
                    data['max_score'] = max_score
                    
                teacher_comment = self._get_teacher_comment_by_score(score, max_score, student_name)
                
                data['teacher_comment'] = teacher_comment
                data['essay_type'] = 'free_response'
                
                logger.info(f"✅ Marked free response essay using Gemini 2.5 Flash - Score: {score}/{max_score}")
                return {
                    'success': True,
                    'result': data
                }
            
        except Exception as e:
            logger.error(f"Error marking free response essay with Gemini: {e}")
        
        return self._fallback_free_marking(student_name, student_surname)
    
    def _mark_deepseek_free_response_essay(self, student_name: str, student_surname: str, 
                                 essay_text: str, topic: Dict) -> Optional[Dict]:
        """Mark free response essay using DeepSeek AI"""
        if not self.deepseek_api_key:
            return None
            
        import requests
        
        try:
            prompt_intro = f"""You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience marking professional free response compositions for Zimbabwean students. You have deep knowledge of the ZIMSEC Ordinary Level English Language syllabus and extensive experience as a ZIMSEC examiner and marker.

ROLE: EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER & MARKER

CORE PRINCIPLES (NON-NEGOTIABLE):
1. STRICT ZIMSEC ALIGNMENT - Use ONLY ZIMSEC O-Level English Language Paper 1 Section A (Free Response) marking criteria. Do NOT use external systems (IELTS, Cambridge IGCSE variations, foreign rubrics).
2. EXAMINER-FOCUSED - Mark exactly as ZIMSEC examiners do. Highlight how marks are awarded and lost.
3. PAPER-BASED THINKING - This composition aligns with ZIMSEC Paper 1 Section A (Free Response), typically 30 marks total.
4. ZIMBABWE CONTEXT - Consider appropriateness of content for Zimbabwean students and contexts.

STUDENT INFORMATION:
Name: {student_name} {student_surname}

ESSAY TOPIC:
Title: {topic.get('title', '')}
Description: {topic.get('description', '')}

STUDENT ESSAY:
{essay_text}

"""
            
            prompt_criteria = """ZIMSEC MARKING CRITERIA (Total: 30 marks) - Use EXACTLY these criteria as a ZIMSEC examiner would:

1. CONTENT (15 marks):
   - Relevance to topic (addresses the topic directly and fully) - 4 marks
   - Introduction and Conclusion (clear, engaging introduction; strong conclusion) - 3 marks
   - Use of examples/details (specific, relevant examples and details) - 4 marks
   - Development of ideas (sufficient depth and explanation) - 4 marks

2. LANGUAGE (10 marks):
   - Grammar, Spelling, Punctuation (accuracy throughout) - 4 marks
   - Vocabulary (appropriate, varied vocabulary) - 3 marks
   - Sentence structure (variety and correctness) - 3 marks

3. ORGANIZATION (5 marks):
   - Paragraphing (clear paragraph structure, appropriate length) - 2 marks
   - Coherence (logical flow, smooth transitions, linking words) - 3 marks

EXAMINER MARKING GUIDELINES:
- Mark strictly but fairly, as a ZIMSEC examiner would
- Award marks for what is present, not just deduct for errors
- Consider the student's level (O-Level, Forms 1-4, ages 15-17)
- Provide specific feedback on strengths and areas for improvement
- Reference ZIMSEC marking standards and common examiner comments
- Be encouraging but honest about the score

COMMON ZIMSEC EXAMINER COMMENTS TO REFERENCE:
- "Good relevance to topic but needs more development"
- "Creative ideas but language errors affect clarity"
- "Well-organized with clear paragraph structure"
- "Good use of examples but needs better vocabulary"
- "Needs stronger introduction and conclusion"

Return ONLY valid JSON (NO markdown formatting, NO additional text):
{
  "score": 20,
  "max_score": 30,
  "breakdown": {
    "content": 10,
    "language": 7,
    "organization": 3
  },
  "corrections": [
    {
      "wrong": "...",
      "correct": "...",
      "type": "grammar",
      "explanation": "..."
    }
  ],
  "corrected_essay": "Corrected textual version...",
  "detailed_feedback": "Detailed examiner feedback..."
}"""
            
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.deepseek_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": DEEPSEEK_CHAT_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are a ZIMSEC English examiner."},
                        {"role": "user", "content": prompt_intro + prompt_criteria}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 3000
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                if content:
                    clean_content = self._clean_json_block(content)
                    data = json.loads(clean_content)
                    
                    score = data.get('score', 0)
                    max_score = data.get('max_score', 30)
                    if not max_score: max_score = 30
                    
                    teacher_comment = self._get_teacher_comment_by_score(score, max_score, student_name)
                    data['teacher_comment'] = teacher_comment
                    data['essay_type'] = 'free_response'
                    
                    return {
                        'success': True,
                        'result': data
                    }
                    
        except Exception as e:
            logger.error(f"DeepSeek free response marking error: {e}")
            
        return None

    def _fallback_free_marking(self, student_name: str, student_surname: str) -> Dict:
        """Fallback for free response marking"""
        return {
            'success': True,
            'result': {
                "score": 15,
                "max_score": 30,
                "breakdown": {"content": 8, "language": 5, "organization": 2},
                "corrections": [],
                "corrected_essay": "Essay marking unavailable.",
                "detailed_feedback": "Automatic marking unavailable. Please try again later.",
                "teacher_comment": f"Keep trying, {student_name}.",
                "essay_type": "free_response"
            }
        }

    def mark_guided_composition(self, student_name: str, student_surname: str,
                               essay_text: str, prompt: Dict) -> Optional[Dict]:
        """Mark guided composition out of 20 using DeepSeek first, then Gemini fallback"""
        
        # Primary: DeepSeek AI
        if self.deepseek_api_key:
            try:
                deepseek_result = self._mark_deepseek_guided_composition(student_name, student_surname, essay_text, prompt)
                if deepseek_result:
                    logger.info("✅ Marked guided composition using DeepSeek AI")
                    return deepseek_result
            except Exception as e:
                logger.warning(f"DeepSeek guided composition marking failed: {e}")

        # Secondary: Gemini AI
        if not self._is_configured or not self.client:
            logger.warning("Gemini AI not configured and DeepSeek failed - cannot mark composition")
            return self._fallback_guided_marking(student_name, student_surname)
        
        try:
            # Using concatenation to avoid f-string issues
            prompt_intro = f"""You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience marking professional guided compositions for Zimbabwean students. You have deep knowledge of the ZIMSEC Ordinary Level English Language syllabus and extensive experience as a ZIMSEC examiner and marker.

ROLE: EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER & MARKER

CORE PRINCIPLES (NON-NEGOTIABLE):
1. STRICT ZIMSEC ALIGNMENT - Use ONLY ZIMSEC O-Level English Language Paper 1 Section B (Guided Composition) marking criteria. Do NOT use external systems (IELTS, Cambridge IGCSE variations, foreign rubrics).
2. EXAMINER-FOCUSED - Mark exactly as ZIMSEC examiners do. Highlight how marks are awarded and lost.
3. PAPER-BASED THINKING - This composition aligns with ZIMSEC Paper 1 Section B (Guided Composition), typically 20 marks total.
4. ZIMBABWE CONTEXT - Consider appropriateness of content for Zimbabwean students and contexts.

STUDENT INFORMATION:
Name: {student_name} {student_surname}

COMPOSITION PROMPT:
Title: {prompt.get('title', '')}
Context: {prompt.get('context', '')}
Format: {prompt.get('format', '')}
Key Points to Cover: {', '.join(prompt.get('key_points', []))}

STUDENT COMPOSITION:
{essay_text}

"""
            
            prompt_criteria = """ZIMSEC MARKING CRITERIA (Total: 20 marks) - Use EXACTLY these criteria as a ZIMSEC examiner would:

1. CONTENT & FORMAT (12 marks):
   - Adherence to specified format ({prompt.get('format', '')}) - 3 marks
   - Coverage of all key points from the prompt - 4 marks
   - Relevance and appropriateness to context - 2 marks
   - Development of ideas with sufficient detail - 3 marks

2. LANGUAGE (8 marks):
   - Grammar and sentence structure (correct tenses, subject-verb agreement, sentence variety) - 3 marks
   - Vocabulary and register (appropriate word choice, formal/informal tone as required) - 2 marks
   - Spelling and punctuation (accuracy throughout) - 2 marks
   - Clarity and coherence (logical flow, linking words, paragraph structure) - 1 mark

EXAMINER MARKING GUIDELINES:
- Mark strictly but fairly, as a ZIMSEC examiner would
- Award marks for what is present, not just deduct for errors
- Consider the student's level (O-Level, Forms 1-4, ages 15-17)
- Provide specific feedback on strengths and areas for improvement
- Reference ZIMSEC marking standards and common examiner comments
- Be encouraging but honest about the score

INSTRUCTIONS:
1. Check if the student followed the correct format ({prompt.get('format', '')})
2. Verify all key points were addressed: {', '.join(prompt.get('key_points', []))}
3. Identify ALL errors (grammar, spelling, format, register)
4. Provide corrected version
5. Be strict on format requirements

Return ONLY valid JSON (no markdown fences):
{
  "score": 16,
  "max_score": 20,
  "breakdown": {
    "content_and_format": 10,
    "language": 6
  },
  "corrections": [
    {
      "wrong": "Dear friend",
      "correct": "Dear Sir/Madam",
      "type": "format",
      "explanation": "Formal letter requires formal salutation"
    }
  ],
  "corrected_essay": "Full corrected version...",
  "detailed_feedback": "Specific feedback on format adherence and content..."
}"""
            marking_prompt = prompt_intro + prompt_criteria
            
            model = self.client.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(
                marking_prompt,
                generation_config=self.client.types.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                    max_output_tokens=4000
                ),
            )
            
            if response and hasattr(response, 'text') and response.text:
                clean_text = self._clean_json_block(response.text)
                data = json.loads(clean_text)
                
                # Add teacher comment based on score
                score = data.get('score', 0)
                max_score = data.get('max_score', 20)
                
                # Ensure max_score is valid to prevent division by zero
                if not max_score or max_score <= 0:
                    max_score = 20
                    data['max_score'] = max_score
                    
                teacher_comment = self._get_teacher_comment_by_score(score, max_score, student_name)
                
                data['teacher_comment'] = teacher_comment
                data['essay_type'] = 'guided'
                
                logger.info(f"✅ Marked guided composition using Gemini 2.5 Flash - Score: {score}/{max_score}")
                return {
                    'success': True,
                    'result': data
                }
            
        except Exception as e:
            logger.error(f"Error marking guided composition with Gemini: {e}")
        
        return self._fallback_guided_marking(student_name, student_surname)
    
    def _mark_deepseek_guided_composition(self, student_name: str, student_surname: str,
                                         essay_text: str, prompt_data: Dict) -> Optional[Dict]:
        """Mark guided composition using DeepSeek AI"""
        if not self.deepseek_api_key:
            return None
            
        import requests
        
        try:
            prompt_intro = f"""You are Dr. Muzenda, an EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER with 15+ years experience marking professional guided compositions for Zimbabwean students. You have deep knowledge of the ZIMSEC Ordinary Level English Language syllabus and extensive experience as a ZIMSEC examiner and marker.

ROLE: EXPERT ZIMSEC O-LEVEL ENGLISH LANGUAGE EXAMINER & MARKER

CORE PRINCIPLES (NON-NEGOTIABLE):
1. STRICT ZIMSEC ALIGNMENT - Use ONLY ZIMSEC O-Level English Language Paper 1 Section B (Guided Composition) marking criteria. Do NOT use external systems (IELTS, Cambridge IGCSE variations, foreign rubrics).
2. EXAMINER-FOCUSED - Mark exactly as ZIMSEC examiners do. Highlight how marks are awarded and lost.
3. PAPER-BASED THINKING - This composition aligns with ZIMSEC Paper 1 Section B (Guided Composition), typically 20 marks total.
4. ZIMBABWE CONTEXT - Consider appropriateness of content for Zimbabwean students and contexts.

STUDENT INFORMATION:
Name: {student_name} {student_surname}

COMPOSITION PROMPT:
Title: {prompt_data.get('title', '')}
Context: {prompt_data.get('context', '')}
Format: {prompt_data.get('format', '')}
Key Points to Cover: {', '.join(prompt_data.get('key_points', []))}

STUDENT COMPOSITION:
{essay_text}

"""
            
            prompt_criteria = """ZIMSEC MARKING CRITERIA (Total: 20 marks) - Use EXACTLY these criteria as a ZIMSEC examiner would:

1. CONTENT & FORMAT (12 marks):
   - Adherence to specified format (formal/informal letter, speech, report, article) - 3 marks
   - Coverage of all key points from the prompt - 4 marks
   - Relevance and appropriateness to context - 2 marks
   - Development of ideas with sufficient detail - 3 marks

2. LANGUAGE (8 marks):
   - Grammar and sentence structure (correct tenses, subject-verb agreement, sentence variety) - 3 marks
   - Vocabulary and register (appropriate word choice, formal/informal tone as required) - 2 marks
   - Spelling and punctuation (accuracy throughout) - 2 marks
   - Clarity and coherence (logical flow, linking words, paragraph structure) - 1 mark

EXAMINER MARKING GUIDELINES:
- Mark strictly but fairly, as a ZIMSEC examiner would
- Award marks for what is present, not just deduct for errors
- Consider the student's level (O-Level, Forms 1-4, ages 15-17)
- Provide specific feedback on strengths and areas for improvement
- Reference ZIMSEC marking standards and common examiner comments
- Be encouraging but honest about the score

COMMON ZIMSEC EXAMINER COMMENTS TO REFERENCE:
- "Good structure but needs more development of ideas"
- "All key points covered but format needs improvement"
- "Appropriate register maintained throughout"
- "Some grammatical errors but meaning is clear"
- "Needs better paragraph organization"

Return ONLY valid JSON (NO markdown formatting, NO additional text):
{
  "score": 16,
  "max_score": 20,
  "breakdown": {
    "content_and_format": 10,
    "language": 6
  },
  "corrections": [
    {
      "wrong": "...",
      "correct": "...",
      "type": "format/grammar/spelling",
      "explanation": "..."
    }
  ],
  "corrected_essay": "Full corrected version...",
  "detailed_feedback": "Specific feedback..."
}"""
            
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.deepseek_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": DEEPSEEK_CHAT_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are a ZIMSEC English examiner."},
                        {"role": "user", "content": prompt_intro + prompt_criteria}
                    ],
                    "temperature": 0.3,
                    "max_tokens": 3000
                },
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                if content:
                    clean_content = self._clean_json_block(content)
                    data = json.loads(clean_content)
                    
                    score = data.get('score', 0)
                    max_score = data.get('max_score', 20)
                    if not max_score: max_score = 20
                    
                    teacher_comment = self._get_teacher_comment_by_score(score, max_score, student_name)
                    data['teacher_comment'] = teacher_comment
                    data['essay_type'] = 'guided'
                    
                    return {
                        'success': True,
                        'result': data
                    }
                    
        except Exception as e:
            logger.error(f"DeepSeek guided composition marking error: {e}")
            
        return None

    def _fallback_guided_marking(self, student_name: str, student_surname: str) -> Dict:
        """Provide a fallback result if both AIs fail"""
        return {
            'success': True,
            'result': {
                "score": 10,
                "max_score": 20,
                "breakdown": {"content_and_format": 6, "language": 4},
                "corrections": [],
                "corrected_essay": "Essay marking unavailable at this time.",
                "detailed_feedback": "Automatic marking service is currently unavailable. Please try again later.",
                "teacher_comment": f"Keep practicing, {student_name}.",
                "essay_type": "guided"
            }
        }
    
    def generate_essay_pdf_report(self, student_name: str, student_surname: str,
                                  essay_type: str, score: int, max_score: int,
                                  corrections: List[Dict], teacher_comment: str,
                                  corrected_essay: str, detailed_feedback: str,
                                  original_essay: str, topic_title: str) -> Optional[str]:
        """Generate PDF report for essay marking using reportlab"""
        try:
            from reportlab.lib.pagesizes import letter, A4
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import inch
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
            from reportlab.lib import colors
            from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
            import io
            import base64
            
            # Create PDF in memory
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4,
                                   rightMargin=72, leftMargin=72,
                                   topMargin=72, bottomMargin=18)
            
            # Container for the 'Flowable' objects
            elements = []
            
            # Define styles
            styles = getSampleStyleSheet()
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=18,
                textColor=colors.HexColor('#1976D2'),
                spaceAfter=30,
                alignment=TA_CENTER,
                fontName='Helvetica-Bold'
            )
            
            heading_style = ParagraphStyle(
                'CustomHeading',
                parent=styles['Heading2'],
                fontSize=14,
                textColor=colors.HexColor('#1976D2'),
                spaceAfter=12,
                spaceBefore=12,
                fontName='Helvetica-Bold'
            )
            
            normal_style = styles['Normal']
            normal_style.fontSize = 11
            normal_style.leading = 14
            
            # Title
            essay_type_name = "Free Response Composition" if essay_type == "free_response" else "Guided Composition"
            elements.append(Paragraph(f"ZIMSEC O-Level English - {essay_type_name}", title_style))
            elements.append(Spacer(1, 12))
            
            # Student Information
            student_info = [
                ['Student Name:', f'{student_name} {student_surname}'],
                ['Essay Topic:', topic_title],
                ['Date:', f'{self._get_current_date()}']
            ]
            
            t = Table(student_info, colWidths=[2*inch, 4*inch])
            t.setStyle(TableStyle([
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 11),
                ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#424242')),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 20))
            
            # Score Section
            elements.append(Paragraph("MARKING RESULTS", heading_style))
            
            # Ensure safe calculation
            percentage = 0
            if max_score > 0:
                percentage = int((score / max_score) * 100)
            
            score_data = [
                ['Total Score:', f'{score} / {max_score}', f'{percentage}%'],
                ['Grade:', self._get_grade_from_percentage(percentage), '']
            ]
            
            score_table = Table(score_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
            score_table.setStyle(TableStyle([
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (-1, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 12),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#2E7D32')),
                ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#E8F5E9')),
                ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#2E7D32')),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                ('TOPPADDING', (0, 0), (-1, -1), 10),
            ]))
            elements.append(score_table)
            elements.append(Spacer(1, 20))
            
            # Teacher Comment
            elements.append(Paragraph("TEACHER'S COMMENT", heading_style))
            comment_style = ParagraphStyle(
                'Comment',
                parent=normal_style,
                fontSize=12,
                textColor=colors.HexColor('#D32F2F'),
                fontName='Helvetica-Bold',
                spaceAfter=12
            )
            elements.append(Paragraph(teacher_comment, comment_style))
            elements.append(Spacer(1, 20))
            
            # Corrections
            if corrections and len(corrections) > 0:
                elements.append(Paragraph("CORRECTIONS", heading_style))
                elements.append(Paragraph(f"Total errors found: {len(corrections)}", normal_style))
                elements.append(Spacer(1, 12))
                
                correction_data = [['Wrong', 'Correct', 'Type', 'Explanation']]
                for corr in corrections[:20]:  # Limit to first 20 corrections for space
                    correction_data.append([
                        corr.get('wrong', '')[:30],
                        corr.get('correct', '')[:30],
                        corr.get('type', ''),
                        corr.get('explanation', '')[:50]
                    ])
                
                corr_table = Table(correction_data, colWidths=[1.3*inch, 1.3*inch, 0.8*inch, 2.1*inch])
                corr_table.setStyle(TableStyle([
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 10),
                    ('FONTSIZE', (0, 1), (-1, -1), 9),
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#D32F2F')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#FFEBEE')]),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                ]))
                elements.append(corr_table)
                elements.append(Spacer(1, 20))
            
            # Detailed Feedback
            elements.append(Paragraph("DETAILED FEEDBACK", heading_style))
            elements.append(Paragraph(detailed_feedback, normal_style))
            elements.append(Spacer(1, 20))
            
            # Page break before corrected essay
            elements.append(PageBreak())
            
            # Corrected Essay
            elements.append(Paragraph("CORRECTED VERSION", heading_style))
            corrected_para_style = ParagraphStyle(
                'Corrected',
                parent=normal_style,
                alignment=TA_JUSTIFY,
                spaceAfter=12
            )
            
            # Split corrected essay into paragraphs
            for para in corrected_essay.split('\n'):
                if para.strip():
                    elements.append(Paragraph(para.strip(), corrected_para_style))
                    elements.append(Spacer(1, 8))
            
            # Build PDF
            doc.build(elements)
            
            # Get PDF data as base64
            pdf_data = buffer.getvalue()
            buffer.close()
            pdf_base64 = base64.b64encode(pdf_data).decode('utf-8')
            
            logger.info(f"✅ Generated PDF report for {student_name} {student_surname}")
            return pdf_base64
            
        except ImportError:
            logger.error("reportlab library not installed - cannot generate PDF")
            return None
        except Exception as e:
            logger.error(f"Error generating PDF report: {e}")
            return None
    
    def _get_current_date(self) -> str:
        """Get current date in readable format"""
        from datetime import datetime
        return datetime.now().strftime("%d %B %Y")

    def _get_teacher_comment_by_score(self, score: int, max_score: int, student_name: str) -> str:
        """Get encouraging teacher comment based on score"""
        percentage = (score / max_score) * 100
        
        if percentage >= 80:
            return f"Outstanding work, {student_name}! Your essay is a pleasure to read."
        elif percentage >= 70:
            return f"Very good effort, {student_name}. You have a strong command of the language."
        elif percentage >= 60:
            return f"Good job, {student_name}. You are on the right track."
        elif percentage >= 50:
            return f"Fair effort, {student_name}. Keep practicing to improve your expression."
        else:
            return f"Don't give up, {student_name}. Focus on the corrections and try again."
