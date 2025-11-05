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
try:
    import google.generativeai as genai
    from google.generativeai import types
    GENAI_AVAILABLE = True
except ImportError:
    genai = None
    types = None
    GENAI_AVAILABLE = False

from config import Config

logger = logging.getLogger(__name__)

class EnglishService:
    def __init__(self):
        """Initialize Enhanced ZIMSEC English Service with AI capabilities"""
        self.client = None
        self._is_configured = False
        self.deepseek_api_key = Config.DEEPSEEK_API_KEY
        self.deepseek_api_url = 'https://api.deepseek.com/chat/completions'

        # Initialize Gemini AI
        try:
            if GENAI_AVAILABLE:
                api_key = os.getenv('GEMINI_API_KEY')
                if api_key and genai:
                    genai.configure(api_key=api_key)
                    # Use the genai module directly, not a Client class
                    self.client = genai
                    self._is_configured = True
                    logger.info("Enhanced ZIMSEC English Service initialized with Gemini AI")
                else:
                    logger.warning("GEMINI_API_KEY not found - using fallback methods")
            else:
                logger.warning("Google Generative AI not available - using fallback methods")
        except Exception as e:
            logger.error(f"Error initializing English service: {e}")

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

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.6,
                    max_output_tokens=1500
                ),
            )

            if not response or not getattr(response, 'text', None):
                logger.warning("Empty response from Gemini AI for grammar question")
                return None

            try:
                clean_text = self._clean_json_block(response.text)
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
                'model': 'deepseek-chat',
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

    def generate_grammar_question(self, last_question_type: Optional[str] = None) -> Optional[Dict]:
        """Retrieve grammar questions prioritising AI generation with resilient fallbacks"""
        # Primary: Gemini AI generation
        ai_response = self.generate_ai_grammar_question(last_question_type=last_question_type)
        if ai_response and ai_response.get('success'):
            return ai_response

        # Secondary: DeepSeek AI generation
        deepseek_response = self.generate_deepseek_grammar_question(last_question_type=last_question_type)
        if deepseek_response and deepseek_response.get('success'):
            return deepseek_response

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

    def generate_vocabulary_question(self) -> Optional[Dict]:
        """Retrieve vocabulary questions from Supabase database with minimal fallback"""
        # Primary: Get question from database
        try:
            from database.external_db import get_random_vocabulary_question

            question_data = get_random_vocabulary_question()
            if question_data:
                logger.info(f"Retrieved vocabulary question from database - Question: {question_data.get('question', 'Unknown')[:50]}...")
                return {
                    'success': True,
                    'question_data': question_data
                }
            else:
                logger.warning("No vocabulary questions found in database")
        except Exception as e:
            logger.error(f"Error retrieving vocabulary question from database: {e}")

        # Minimal fallback only if database completely fails
        logger.warning("Database unavailable - using minimal fallback")
        return {
            'success': True,
            'question_data': self._get_fallback_vocabulary_question()
        }

    def generate_essay_prompts(self, user_level: str = "Form 3") -> Optional[Dict]:
        """Generate essay writing prompts for ZIMSEC students"""
        if not self._is_configured or not self.client:
            logger.warning("English service not configured - using fallback essay prompts")
            return {
                'success': True,
                'prompts': self._get_fallback_essay_prompts()
            }

        try:
            prompt = f"""Generate 3 diverse ZIMSEC O-Level English essay prompts suitable for {user_level} students.

*Essay types to include:*
- Narrative/Personal experience
- Argumentative/Opinion
- Descriptive

Requirements:
- Age-appropriate topics (14-17 years)
- Zimbabwean context and experiences
- 350-450 words target length
- Clear, engaging prompts
- Varied difficulty levels

Return ONLY a JSON array:
[
    {{
        "title": "Essay prompt title",
        "description": "Detailed prompt with guidance",
        "type": "narrative/argumentative/descriptive",
        "suggested_length": "350-400 words"
    }}
]"""

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.8,
                    max_output_tokens=1200
                ),
            )

            if response.text:
                try:
                    clean_text = response.text.strip()
                    if clean_text.startswith('```json'):
                        clean_text = clean_text[7:]
                    if clean_text.endswith('```'):
                        clean_text = clean_text[:-3]
                    clean_text = clean_text.strip()

                    prompts_data = json.loads(clean_text)

                    if isinstance(prompts_data, list) and len(prompts_data) >= 3:
                        return {
                            'success': True,
                            'prompts': prompts_data
                        }

                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error in essay prompts: {e}")
                except Exception as e:
                    logger.error(f"Error processing essay prompts: {e}")

        except Exception as e:
            logger.error(f"Error generating essay prompts: {e}")

        # Fallback
        return {
            'success': True,
            'prompts': self._get_fallback_essay_prompts()
        }

    def _get_fallback_essay_prompts(self) -> List[Dict]:
        """Fallback essay prompts when AI fails"""
        return [
            {
                "title": "A Day I Will Never Forget",
                "description": "Write about a memorable day in your life. Describe what happened, how you felt, and why this day was so special or significant to you.",
                "type": "narrative",
                "suggested_length": "350-400 words"
            },
            {
                "title": "Should Students Wear School Uniforms?",
                "description": "Give your opinion on whether students should be required to wear school uniforms. Provide at least three reasons to support your view.",
                "type": "argumentative", 
                "suggested_length": "400-450 words"
            },
            {
                "title": "My Favorite Place in Zimbabwe",
                "description": "Describe a place in Zimbabwe that you love visiting. Use vivid details to paint a picture with words so readers can imagine being there.",
                "type": "descriptive",
                "suggested_length": "350-400 words"
            }
        ]

    def analyze_essay_with_ai(self, essay_text: str, prompt: str) -> Optional[Dict]:
        """Analyze student essay using AI for comprehensive feedback"""
        if not self._is_configured or not self.client:
            logger.warning("AI not configured for essay analysis")
            return None

        try:
            analysis_prompt = f"""Analyze this ZIMSEC O-Level student essay and provide detailed feedback.

*Essay Prompt:* {prompt}

*Student Essay:*
{essay_text}

*Analyze these areas:*
1. *Content & Ideas* (25%): Relevance, creativity, depth
2. *Organization* (25%): Structure, flow, transitions
3. *Language Use* (25%): Grammar, vocabulary, sentence variety
4. *Mechanics* (25%): Spelling, punctuation, paragraphing

*Requirements:*
- Give scores out of 25 for each area
- Provide specific examples from the essay
- Suggest 2-3 concrete improvements
- Keep feedback constructive and encouraging
- Total possible: 100 points

Return ONLY a JSON object:
{{
    "content_score": 0,
    "organization_score": 0,
    "language_score": 0,
    "mechanics_score": 0,
    "total_score": 0,
    "grade": "A/B/C/D/E",
    "strengths": ["strength1", "strength2"],
    "areas_for_improvement": ["area1", "area2"],
    "specific_feedback": "Detailed paragraph with examples",
    "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}}"""

            response = self.client.models.generate_content(
                model="gemini-2.5-pro",
                contents=analysis_prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                    max_output_tokens=2000
                ),
            )

            if response.text:
                try:
                    clean_text = response.text.strip()
                    if clean_text.startswith('```json'):
                        clean_text = clean_text[7:]
                    if clean_text.endswith('```'):
                        clean_text = clean_text[:-3]
                    clean_text = clean_text.strip()

                    analysis = json.loads(clean_text)
                    logger.info("Essay analysis completed successfully")
                    return analysis

                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error in essay analysis: {e}")
                except Exception as e:
                    logger.error(f"Error processing essay analysis: {e}")

        except Exception as e:
            logger.error(f"Error in AI essay analysis: {e}")

        return None

    def generate_comprehension_question(self) -> Optional[Dict]:
        """Generate comprehension passage with questions from database"""
        from database.external_db import get_supabase_client

        try:
            supabase = get_supabase_client()

            # Get a random passage with its questions
            passages_response = supabase.table('english_comprehension_passages').select('*').execute()

            if not passages_response.data:
                logger.warning("No comprehension passages found in database")
                return self._get_fallback_comprehension()

            # Select a random passage
            passage = random.choice(passages_response.data)
            passage_id = passage['id']

            # Get questions for this passage
            questions_response = supabase.table('english_comprehension_questions').select('*').eq('passage_id', passage_id).order('question_order').execute()

            if not questions_response.data:
                logger.warning(f"No questions found for passage {passage_id}")
                return self._get_fallback_comprehension()

            logger.info(f"Retrieved comprehension passage from database - Topic: {passage['topic_area']}")

            return {
                'success': True,
                'question_data': {
                    'passage_id': passage_id,
                    'title': passage['title'],
                    'passage': passage['passage'],
                    'topic_area': passage['topic_area'],
                    'difficulty_level': passage['difficulty_level'],
                    'reading_time': passage['reading_time'],
                    'questions': questions_response.data,
                    'total_questions': len(questions_response.data)
                }
            }

        except Exception as e:
            logger.error(f"Database error in comprehension question generation: {e}")
            return self._get_fallback_comprehension()

    def _get_fallback_comprehension(self) -> Dict:
        """Fallback comprehension when database fails"""
        return {
            'success': True, 
            'question_data': {
                'passage_id': 999,
                'title': 'The Power of Reading',
                'passage': 'Reading is one of the most important skills a person can develop. It opens doors to knowledge, improves vocabulary, and enhances critical thinking abilities. Students who read regularly perform better in all subjects, not just English. Reading also provides entertainment and helps people understand different cultures and perspectives.',
                'topic_area': 'Reading Comprehension',
                'difficulty_level': 'medium',
                'reading_time': 3,
                'questions': [
                    {
                        'id': 1,
                        'question': 'According to the passage, what does reading improve?',
                        'option_a': 'Only English skills',
                        'option_b': 'Vocabulary and critical thinking',
                        'option_c': 'Physical fitness',
                        'option_d': 'Mathematical abilities',
                        'correct_answer': 1,
                        'explanation': 'The passage states that reading "improves vocabulary, and enhances critical thinking abilities."'
                    }
                ],
                'total_questions': 1
            }
        }

    def generate_comprehension_passage(self, theme: str = "General") -> Optional[Dict]:
        """Generate reading comprehension passages with questions using DeepSeek V3.1"""
        try:
            # Use DeepSeek V3.1 for comprehension generation
            from standalone_english_comprehension_generator import standalone_english_comprehension_generator
            
            logger.info(f"Generating comprehension passage with DeepSeek V3.1 for theme: {theme}")
            result = standalone_english_comprehension_generator.generate_comprehension_passage(theme)
            
            if result and result.get('success'):
                logger.info(f"✅ Successfully generated comprehension passage using DeepSeek V3.1")
                return result
            else:
                logger.warning("DeepSeek comprehension generation failed, using fallback")
                return {
                    'success': True,
                    'passage_data': self._get_fallback_comprehension(),
                    'source': 'fallback'
                }
                
        except Exception as e:
            logger.error(f"Error in DeepSeek comprehension generation: {e}")
            return {
                'success': True,
                'passage_data': self._get_fallback_comprehension(),
                'source': 'fallback'
            }

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
        """Generate essay marking using Gemini AI with robust error handling and improved marking criteria"""
        if not self._is_configured or not self.client:
            logger.warning("English service not configured for essay marking")
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

Return valid JSON with the exact format requested."""

            # Try with Gemini 2.5 Flash first
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=enhanced_prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                    max_output_tokens=2500
                ),
            )

            if response and hasattr(response, 'text') and response.text and response.text.strip():
                logger.info("Essay marking completed successfully with Gemini 2.5 Flash")
                return response.text.strip()
            else:
                logger.error("Empty or invalid response from Gemini 2.5 Flash")
                    return self._generate_fallback_essay_marking()

        except Exception as e:
            logger.error(f"Error in Gemini essay marking: {e}")
            return self._generate_fallback_essay_marking()

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

    def generate_long_comprehension_passage(self, theme: str, form_level: int = 4) -> Optional[Dict]:
        """Generate long comprehensive passage with 10 questions for comprehension practice using DeepSeek V3.1"""
        try:
            # Use DeepSeek V3.1 for long comprehension generation
            from standalone_english_comprehension_generator import standalone_english_comprehension_generator
            
            logger.info(f"Generating long comprehension passage with DeepSeek V3.1 for theme: {theme}, form: {form_level}")
            result = standalone_english_comprehension_generator.generate_long_comprehension_passage(theme, form_level)
            
            if result:
                logger.info(f"✅ Successfully generated long comprehension passage using DeepSeek V3.1")
                return result
            else:
                logger.warning("DeepSeek long comprehension generation failed, using fallback")
                return self._get_fallback_long_comprehension(theme)
                
        except Exception as e:
            logger.error(f"Error in DeepSeek long comprehension generation: {e}")
            return self._get_fallback_long_comprehension(theme)

    def generate_long_comprehension_passage_fast(self, theme: str, form_level: int = 4) -> Optional[Dict]:
        """Fast version with reduced timeouts to prevent worker crashes on Render"""
        try:
            # Use DeepSeek V3.1 with reduced timeouts for Render deployment
            from standalone_english_comprehension_generator import standalone_english_comprehension_generator
            
            logger.info(f"Fast generation: DeepSeek V3.1 for theme: {theme}, form: {form_level}")
            
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
                logger.warning("Fast DeepSeek generation failed, using fallback immediately")
                return self._get_fallback_long_comprehension(theme)
                
        except Exception as e:
            logger.error(f"Error in fast DeepSeek generation: {e}")
            logger.info("🔄 Falling back to enhanced fallback immediately")
            return self._get_fallback_long_comprehension(theme)

    def _get_fallback_long_comprehension(self, theme: str) -> Dict:
        """Enhanced ZIMSEC-style fallback long comprehension passage when AI fails"""
        # Use the enhanced fallback from the standalone generator
        try:
            from standalone_english_comprehension_generator import standalone_english_comprehension_generator
            return standalone_english_comprehension_generator._get_fallback_long_comprehension(theme)
        except Exception as e:
            logger.error(f"Error accessing enhanced fallback: {e}")
            # Basic fallback if even the enhanced one fails
            return {
                "passage": {
                    "title": "Education in Zimbabwe",
                    "text": """Education has always been a cornerstone of Zimbabwean society, with families making significant sacrifices to ensure their children receive quality schooling. In rural areas like Mutoko, students often walk long distances to reach their schools, demonstrating the high value placed on learning.

The challenges facing rural schools are numerous. Many lack basic resources such as textbooks, laboratory equipment, and reliable electricity. Teachers often work with outdated materials and large class sizes, making it difficult to provide individual attention to students who need extra help.

However, the determination of both students and teachers has led to remarkable achievements. Many rural schools have produced students who excel in national examinations and go on to pursue higher education at universities both within Zimbabwe and abroad. These success stories inspire younger students and demonstrate that excellence is possible regardless of circumstances.

Technology is beginning to transform education in Zimbabwe. Solar power systems and internet connectivity are gradually reaching remote areas, opening up new possibilities for learning. Students can now access online resources, participate in virtual classes, and connect with mentors from around the world.

The government and various organizations are working to address educational challenges through infrastructure development, teacher training programs, and the provision of learning materials. Community involvement has also been crucial, with parents and local leaders supporting school development projects.

Despite the challenges, the future of education in Zimbabwe looks promising. Young people are embracing new technologies while maintaining respect for traditional values and knowledge. This balance between innovation and tradition will be key to the country's continued development.""",
                    "word_count": 245,
                    "theme": theme
                },
            "questions": [
                {
                    "question": "According to the passage, how has mobile technology impacted financial services in Zimbabwe?",
                    "correct_answer": "Mobile money platforms have revolutionized financial transactions, allowing people to send money, pay bills, and conduct business without traditional banking infrastructure.",
                    "question_type": "literal",
                    "marks": 2,
                    "explanation": "This information is directly stated in the second paragraph."
                },
                {
                    "question": "What challenges does the passage mention regarding technology in education?",
                    "correct_answer": "Unreliable internet connectivity and the digital divide between urban and rural areas.",
                    "question_type": "literal",
                    "marks": 2,
                    "explanation": "These challenges are explicitly mentioned in the education paragraph."
                },
                {
                    "question": "How has technology benefited farmers according to the passage?",
                    "correct_answer": "Farmers can receive weather forecasts, market prices, and agricultural advice through mobile applications, use satellite imagery to monitor crops, and GPS technology for precision farming.",
                    "question_type": "literal",
                    "marks": 3,
                    "explanation": "Multiple benefits are listed in the agricultural technology paragraph."
                },
                {
                    "question": "What concerns does the passage raise about technology adoption?",
                    "correct_answer": "Cybersecurity threats, data privacy concerns, spread of misinformation, and difficulties for older generations to adapt.",
                    "question_type": "literal",
                    "marks": 2,
                    "explanation": "These concerns are mentioned in the challenges paragraph."
                },
                {
                    "question": "Why might older generations struggle more with technology adoption?",
                    "correct_answer": "The rapid pace of technological change makes it difficult for them to adapt.",
                    "question_type": "inferential",
                    "marks": 2,
                    "explanation": "This requires inference from the statement about rapid technological change."
                },
                {
                    "question": "What does the passage suggest about youth and technology use?",
                    "correct_answer": "Youth have embraced technology readily, using it for self-expression, connections, and starting online businesses, but this raises concerns about screen time and mental health.",
                    "question_type": "literal",
                    "marks": 3,
                    "explanation": "This information is provided in the youth technology paragraph."
                },
                {
                    "question": "What is meant by 'digital divide' in the context of this passage?",
                    "correct_answer": "The gap in technology access and usage between urban and rural areas.",
                    "question_type": "inferential",
                    "marks": 2,
                    "explanation": "This requires understanding the context in which the term is used."
                },
                {
                    "question": "According to the passage, what is needed for Zimbabwe's continued technological development?",
                    "correct_answer": "Investment in education, infrastructure, and policies that protect citizens while promoting innovation.",
                    "question_type": "literal",
                    "marks": 2,
                    "explanation": "This is stated in the concluding paragraph."
                },
                {
                    "question": "How has technology created both opportunities and challenges in Zimbabwe?",
                    "correct_answer": "Opportunities include improved access to services, education, and economic activities; challenges include cybersecurity, digital divide, and adaptation difficulties.",
                    "question_type": "critical",
                    "marks": 3,
                    "explanation": "This requires synthesizing information from throughout the passage."
                },
                {
                    "question": "What is the main message of this passage?",
                    "correct_answer": "Technology has brought significant benefits to Zimbabwe but also creates challenges that need to be addressed through proper planning and investment.",
                    "question_type": "critical",
                    "marks": 3,
                    "explanation": "This requires understanding the overall theme and conclusion of the passage."
                }
            ]
        }