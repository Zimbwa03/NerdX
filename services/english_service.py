import os
import json
import logging
import requests
import time
from typing import Dict, List, Optional
from config import Config

logger = logging.getLogger(__name__)

class EnglishService:
    """Comprehensive English Language service for ZIMSEC curriculum"""
    
    def __init__(self):
        self.deepseek_api_key = Config.DEEPSEEK_API_KEY
        self.gemini_api_key = Config.GEMINI_API_KEY
        
        if not self.deepseek_api_key:
            raise ValueError("DEEPSEEK_API_KEY is required")
    
    def generate_essay_question(self, essay_type: str, difficulty: str) -> Optional[Dict]:
        """Generate essay questions with different types and formats"""
        try:
            essay_types = {
                "narrative": {
                    "description": "Tell a story with clear beginning, middle, and end",
                    "examples": ["Write about a memorable day in your life", "Tell the story of how you learned an important lesson"]
                },
                "descriptive": {
                    "description": "Describe using vivid details and sensory language",
                    "examples": ["Describe your ideal holiday destination", "Describe a person who has influenced your life"]
                },
                "argumentative": {
                    "description": "Present and defend your opinion with evidence",
                    "examples": ["Should students wear school uniforms?", "Is social media beneficial for teenagers?"]
                },
                "expository": {
                    "description": "Explain a topic clearly and informatively",
                    "examples": ["Explain the importance of education", "How to prepare for examinations"]
                }
            }
            
            prompt = f"""
You are an expert English Language tutor for ZIMSEC O-Level curriculum.

Generate an essay question for: {essay_type.title()} Essay
Difficulty: {difficulty}

Type Description: {essay_types.get(essay_type, {}).get('description', '')}

Requirements:
1. Age-appropriate for Forms 1-4 students
2. Clear instructions and word count guidance
3. Engaging and relevant topics
4. Include marking criteria
5. Provide sample essay structure

MANDATORY JSON FORMAT:
{{
    "question": "Essay question with clear instructions",
    "essay_type": "{essay_type}",
    "word_count": "300-500 words",
    "marking_criteria": {{
        "content": "Ideas, creativity, relevance to topic",
        "structure": "Introduction, body paragraphs, conclusion",
        "language": "Grammar, vocabulary, sentence structure",
        "mechanics": "Spelling, punctuation, paragraphing"
    }},
    "sample_structure": "Brief outline of how to approach the essay",
    "points": {30 if difficulty == 'easy' else 50 if difficulty == 'medium' else 70}
}}

Generate ONE {essay_type} essay question now:
"""
            
            return self._call_deepseek_api(prompt)
            
        except Exception as e:
            logger.error(f"Error generating essay question: {e}")
            return self._get_fallback_essay_question(essay_type, difficulty)
    
    def mark_essay(self, essay_text: str, question: str, essay_type: str) -> Optional[Dict]:
        """AI-powered essay marking with detailed feedback"""
        try:
            prompt = f"""
You are an experienced ZIMSEC English Language examiner marking O-Level essays.

ESSAY QUESTION: {question}
ESSAY TYPE: {essay_type.title()}
STUDENT ESSAY: {essay_text}

MARKING CRITERIA (Total: 50 marks):
- Content & Ideas (15 marks): Relevance, creativity, development of ideas
- Structure & Organization (15 marks): Introduction, paragraphs, conclusion, flow
- Language & Style (10 marks): Vocabulary, sentence variety, appropriateness
- Grammar & Mechanics (10 marks): Spelling, punctuation, grammar accuracy

Provide constructive feedback and mark fairly but thoroughly.

MANDATORY JSON FORMAT:
{{
    "overall_score": 35,
    "grade": "B",
    "breakdown": {{
        "content": {{
            "score": 12,
            "max": 15,
            "feedback": "Detailed feedback on content and ideas"
        }},
        "structure": {{
            "score": 11,
            "max": 15,
            "feedback": "Feedback on organization and structure"
        }},
        "language": {{
            "score": 7,
            "max": 10,
            "feedback": "Comments on language use and style"
        }},
        "mechanics": {{
            "score": 5,
            "max": 10,
            "feedback": "Grammar, spelling, punctuation feedback"
        }}
    }},
    "strengths": ["List of what the student did well"],
    "areas_for_improvement": ["Specific areas needing work"],
    "detailed_feedback": "Overall assessment with suggestions for improvement",
    "recommendations": ["Specific steps to improve writing"]
}}

Mark this essay thoroughly and fairly:
"""
            
            return self._call_deepseek_api(prompt)
            
        except Exception as e:
            logger.error(f"Error marking essay: {e}")
            return None
    
    def generate_comprehension_passage(self, topic: str, difficulty: str) -> Optional[Dict]:
        """Generate comprehension passages with questions"""
        try:
            prompt = f"""
You are creating a reading comprehension exercise for ZIMSEC O-Level English.

Topic: {topic}
Difficulty: {difficulty}

Requirements:
1. 250-400 word passage appropriate for Forms 1-4
2. 5 comprehension questions of varying difficulty
3. Include different question types: literal, inferential, evaluative
4. Age-appropriate and educational content
5. Clear marking scheme

MANDATORY JSON FORMAT:
{{
    "passage_title": "Engaging title for the passage",
    "passage_text": "Full text of the reading passage (250-400 words)",
    "questions": [
        {{
            "number": 1,
            "question": "Question text",
            "type": "literal/inferential/evaluative",
            "marks": 3,
            "sample_answer": "Expected answer or key points"
        }}
    ],
    "total_marks": 25,
    "reading_time": "10 minutes",
    "instructions": "Clear instructions for students"
}}

Generate a comprehension passage about {topic}:
"""
            
            return self._call_deepseek_api(prompt)
            
        except Exception as e:
            logger.error(f"Error generating comprehension: {e}")
            return None
    
    def generate_grammar_exercise(self, topic: str, difficulty: str) -> Optional[Dict]:
        """Generate grammar exercises and activities"""
        try:
            grammar_topics = {
                "parts_of_speech": "Nouns, verbs, adjectives, adverbs, etc.",
                "tenses": "Past, present, future tenses and their forms",
                "sentence_structure": "Simple, compound, complex sentences",
                "punctuation": "Commas, semicolons, apostrophes, quotation marks",
                "agreement": "Subject-verb agreement, pronoun agreement",
                "voice": "Active and passive voice"
            }
            
            prompt = f"""
You are creating a grammar exercise for ZIMSEC O-Level English students.

Grammar Topic: {grammar_topics.get(topic, topic)}
Difficulty: {difficulty}

Requirements:
1. 10-15 practice questions
2. Clear instructions and examples
3. Include both identification and correction tasks
4. Provide answer key with explanations
5. Progressive difficulty within the exercise

MANDATORY JSON FORMAT:
{{
    "exercise_title": "Grammar Exercise: {topic.title()}",
    "instructions": "Clear instructions for students",
    "questions": [
        {{
            "number": 1,
            "question_text": "Question or sentence to work with",
            "task": "identify/correct/complete/choose",
            "options": ["A. option", "B. option", "C. option", "D. option"], 
            "correct_answer": "A",
            "explanation": "Why this is correct"
        }}
    ],
    "total_marks": 30,
    "estimated_time": "20 minutes",
    "learning_objectives": ["What students will practice"]
}}

Create a grammar exercise for {topic}:
"""
            
            return self._call_deepseek_api(prompt)
            
        except Exception as e:
            logger.error(f"Error generating grammar exercise: {e}")
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
                'max_tokens': 4000,
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
                        
                        if self._validate_question_data(question_data):
                            logger.info(f"✅ Successfully generated English content on attempt {attempt + 1}")
                            return question_data
                        else:
                            logger.warning(f"Invalid format on attempt {attempt + 1}")
                            continue
                    else:
                        logger.error(f"DeepSeek API error: {response.status_code}")
                        if attempt < Config.AI_MAX_RETRIES - 1:
                            time.sleep(2 ** attempt)
                        
                except requests.Timeout:
                    logger.warning(f"Timeout on attempt {attempt + 1}")
                    if attempt < Config.AI_MAX_RETRIES - 1:
                        time.sleep(2 ** attempt)
                        
            logger.error("All DeepSeek API attempts failed for English service")
            return None
            
        except Exception as e:
            logger.error(f"Error calling DeepSeek API: {e}")
            return None
    
    def _validate_question_data(self, data: Dict) -> bool:
        """Validate English content data structure"""
        if not isinstance(data, dict):
            return False
        
        # Basic validation - check for essential fields
        if not data:
            return False
        
        # Must have some content
        has_content = any([
            'question' in data,
            'passage_text' in data,
            'questions' in data,
            'exercise_title' in data
        ])
        
        return has_content
    
    def _get_fallback_essay_question(self, essay_type: str, difficulty: str) -> Dict:
        """Fallback essay questions when API fails"""
        fallback_questions = {
            "narrative": {
                "question": "Write a story about a time when you had to make a difficult decision. Show how this experience changed you as a person.",
                "essay_type": "narrative",
                "word_count": "300-500 words",
                "points": 50
            },
            "descriptive": {
                "question": "Describe a place that holds special meaning for you. Use vivid details to help your reader understand why this place is important.",
                "essay_type": "descriptive", 
                "word_count": "300-500 words",
                "points": 50
            }
        }
        
        return fallback_questions.get(essay_type, fallback_questions["narrative"])