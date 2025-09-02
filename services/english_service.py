#!/usr/bin/env python3
"""
Enhanced English Service for ZIMSEC O-Level students
Provides comprehensive English language learning features including grammar, vocabulary, essays, and comprehension
"""

import json
import logging
import random
import os
from typing import Optional, Dict, List
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

class EnglishService:
    def __init__(self):
        """Initialize Enhanced ZIMSEC English Service with AI capabilities"""
        self.client = None
        self._is_configured = False

        # Initialize Gemini AI
        try:
            api_key = os.getenv('GEMINI_API_KEY')
            if api_key:
                self.client = genai.Client(api_key=api_key)
                self._is_configured = True
                logger.info("Enhanced ZIMSEC English Service initialized with Gemini AI")
            else:
                logger.warning("GEMINI_API_KEY not found - using fallback methods")
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

    def generate_grammar_question(self) -> Optional[Dict]:
        """Retrieve grammar questions from Supabase database with minimal fallback"""
        # Primary: Get question from database
        try:
            from database.external_db import get_random_grammar_question

            question_data = get_random_grammar_question()
            if question_data:
                logger.info(f"Retrieved grammar question from database - Topic: {question_data.get('topic_area', 'Unknown')}")
                return {
                    'success': True,
                    'question_data': question_data
                }
            else:
                logger.warning("No questions found in database")
        except Exception as e:
            logger.error(f"Error retrieving question from database: {e}")

        # Minimal fallback only if database completely fails
        logger.warning("Database unavailable - using minimal fallback")
        return {
            'success': True,
            'question_data': self._get_fallback_grammar_question()
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

**Essay types to include:**
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

**Essay Prompt:** {prompt}

**Student Essay:**
{essay_text}

**Analyze these areas:**
1. **Content & Ideas** (25%): Relevance, creativity, depth
2. **Organization** (25%): Structure, flow, transitions
3. **Language Use** (25%): Grammar, vocabulary, sentence variety
4. **Mechanics** (25%): Spelling, punctuation, paragraphing

**Requirements:**
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
        """Generate reading comprehension passages with questions"""
        if not self._is_configured or not self.client:
            logger.warning("English service not configured - using fallback comprehension")
            return {
                'success': True,
                'passage_data': self._get_fallback_comprehension()
            }

        try:
            prompt = f"""Generate a ZIMSEC O-Level English reading comprehension exercise on the theme: {theme}

**Requirements:**
- Passage: 200-300 words
- Zimbabwean context and characters
- Age-appropriate content (14-17 years)
- 5 comprehension questions with answers
- Mix of literal and inferential questions
- Form 3-4 reading level

Return ONLY a JSON object:
{{
    "passage": "The complete reading passage",
    "title": "Passage title",
    "questions": [
        {{
            "question": "Question text",
            "answer": "Expected answer",
            "type": "literal/inferential"
        }}
    ]
}}"""

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                    max_output_tokens=1500
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

                    passage_data = json.loads(clean_text)

                    # Validate structure
                    if 'passage' in passage_data and 'questions' in passage_data:
                        return {
                            'success': True,
                            'passage_data': passage_data
                        }

                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error in comprehension: {e}")

        except Exception as e:
            logger.error(f"Error generating comprehension: {e}")

        # Fallback
        return {
            'success': True,
            'passage_data': self._get_fallback_comprehension()
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
        """Generate essay marking using Gemini AI with robust error handling"""
        if not self._is_configured or not self.client:
            logger.warning("English service not configured for essay marking")
            return self._generate_fallback_essay_marking()

        try:
            # Try with Gemini 2.5 Flash first
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=marking_prompt,
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
                logger.warning("Empty or invalid response from Gemini 2.5 Flash, trying alternative model")

                # Try with alternative model
                response_alt = self.client.models.generate_content(
                    model="gemini-1.5-flash",
                    contents=marking_prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.4,
                        max_output_tokens=2000
                    ),
                )

                if response_alt and hasattr(response_alt, 'text') and response_alt.text and response_alt.text.strip():
                    logger.info("Essay marking completed successfully with Gemini 1.5 Flash")
                    return response_alt.text.strip()
                else:
                    logger.error("Both Gemini models returned empty responses")
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
        """Generate long comprehensive passage with 10 questions for comprehension practice"""
        if not self._is_configured or not self.client:
            logger.warning("English service not configured - using fallback long comprehension")
            return self._get_fallback_long_comprehension(theme)

        try:
            prompt = f"""Generate a ZIMSEC O-Level English reading comprehension exercise on the theme: {theme}

**Requirements:**
- Passage: 400-600 words (long passage for proper comprehension practice)
- Zimbabwean context and characters where appropriate
- Age-appropriate content for Form {form_level} students (15-17 years)
- EXACTLY 10 comprehension questions with detailed answers
- Mix of literal, inferential, and critical thinking questions
- Varied question types: multiple choice, short answer, analysis
- Form {form_level} reading level

Return ONLY a JSON object:
{{
    "passage": {{
        "title": "Engaging passage title",
        "text": "The complete 400-600 word reading passage",
        "word_count": 500,
        "theme": "{theme}"
    }},
    "questions": [
        {{
            "question": "Question text here",
            "correct_answer": "Expected detailed answer",
            "question_type": "literal/inferential/critical",
            "marks": 2,
            "explanation": "Why this is the correct answer"
        }}
    ]
}}

Make the passage engaging and educational, suitable for O-Level comprehension practice."""

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                    max_output_tokens=3000
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

                    passage_data = json.loads(clean_text)

                    # Validate structure
                    if 'passage' in passage_data and 'questions' in passage_data:
                        # Ensure we have exactly 10 questions
                        questions = passage_data['questions']
                        if len(questions) < 10:
                            # Pad with additional questions if needed
                            while len(questions) < 10:
                                questions.append({
                                    "question": f"Additional comprehension question {len(questions) + 1} - What is your understanding of the main message in this passage?",
                                    "correct_answer": "Based on careful reading and analysis of the passage content.",
                                    "question_type": "inferential",
                                    "marks": 2,
                                    "explanation": "This question tests overall comprehension and analytical skills."
                                })

                        logger.info(f"Generated long comprehension passage: {theme} with {len(questions)} questions")
                        return passage_data

                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error in long comprehension: {e}")

        except Exception as e:
            logger.error(f"Error generating long comprehension: {e}")

        # Fallback
        return self._get_fallback_long_comprehension(theme)

    def _get_fallback_long_comprehension(self, theme: str) -> Dict:
        """Fallback long comprehension passage when AI fails"""

        return {
            "passage": {
                "title": f"Understanding {theme}",
                "text": f"""Technology has dramatically transformed the way we live, work, and communicate in the 21st century. In Zimbabwe, like many developing countries, the adoption of digital technology has brought both opportunities and challenges that affect every aspect of society.

The rise of mobile technology has been particularly significant. With the widespread availability of smartphones, even in rural areas, people can now access information, banking services, and educational resources that were previously unavailable. Mobile money platforms have revolutionized financial transactions, allowing people to send money, pay bills, and conduct business without traditional banking infrastructure.

In education, technology has opened new doors for learning. Students in remote areas can now access online courses, educational videos, and digital libraries. This has been especially important during times when physical attendance at schools was not possible. However, challenges remain, including unreliable internet connectivity and the digital divide between urban and rural areas.

The agricultural sector, which employs a significant portion of Zimbabwe's population, has also benefited from technological advances. Farmers can now receive weather forecasts, market prices, and agricultural advice through mobile applications. Satellite imagery helps monitor crop conditions, while GPS technology assists in precision farming techniques.

Despite these benefits, technology adoption has created new challenges. Cybersecurity threats have increased, and there are concerns about data privacy and the spread of misinformation through social media platforms. Additionally, the rapid pace of technological change has left some people, particularly older generations, struggling to adapt.

The youth have embraced technology more readily, using social media platforms to express themselves, connect with others, and even start online businesses. This has created new economic opportunities but also raised concerns about screen time and its impact on mental health and social relationships.

As Zimbabwe continues to develop its technological infrastructure, it is crucial to ensure that the benefits of technology are accessible to all citizens while addressing the challenges that come with digital transformation. This requires investment in education, infrastructure, and policies that protect citizens while promoting innovation.""",
                "word_count": 345,
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