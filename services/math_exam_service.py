"""
Math Exam Service - Hybrid Exam System
Manages the hybrid exam flow: DB questions (images) + AI questions (DeepSeek)
"""

import logging
import random
import uuid
from typing import Dict, Optional, List
from database.external_db import make_supabase_request
from services.math_question_generator import MathQuestionGenerator

logger = logging.getLogger(__name__)

class MathExamService:
    """
    Manages the hybrid exam flow for Mathematics.
    - Questions 1, 2, 4, 5, 7, 8... from DB (Image-based)
    - Questions 3, 6, 9, 12... from AI (DeepSeek)
    """
    
    def __init__(self):
        self.math_generator = MathQuestionGenerator()
        
    def get_next_question(self, user_id: str, question_count: int, year: Optional[str] = None, paper: Optional[str] = None) -> Dict:
        """
        Get the next question based on the current count.
        If count % 3 == 0, generate AI question.
        Else, fetch from DB.
        """
        try:
            # Logic: Every 3rd question is AI (3, 6, 9...)
            is_ai_turn = (question_count % 3 == 0)
            
            if is_ai_turn:
                return self._generate_ai_question(user_id)
            else:
                return self._fetch_db_question(year, paper)
                
        except Exception as e:
            logger.error(f"Error getting next exam question: {e}")
            # Fallback to AI if DB fails, or simple error
            return self._generate_ai_question(user_id)

    def _generate_ai_question(self, user_id: str) -> Dict:
        """Generate a question using DeepSeek (via MathQuestionGenerator)"""
        try:
            # Random topic for exam mode
            from constants import TOPICS
            math_topics = TOPICS.get('Mathematics', ['Algebra'])
            topic = random.choice(math_topics).lower().replace(' ', '_')
            
            question_data = self.math_generator.generate_question(
                'Mathematics', 
                topic, 
                'medium', 
                user_id
            )
            
            if not question_data:
                raise Exception("Failed to generate AI question")
                
            # Format for mobile
            return {
                'id': str(uuid.uuid4()),
                'type': 'ai_generated',
                'question_text': question_data.get('question', ''),
                'question_image_url': None,
                'options': [], # Math AI questions are usually short answer
                'correct_answer': question_data.get('answer', ''),
                'solution': question_data.get('solution', ''),
                'explanation': question_data.get('explanation', ''),
                'allows_text_input': True,
                'allows_image_upload': True,
                'is_ai': True
            }
            
        except Exception as e:
            logger.error(f"AI generation error: {e}")
            raise e

    def _fetch_db_question(self, year: Optional[str], paper: Optional[str]) -> Dict:
        """Fetch a random question from the olevel_maths table"""
        try:
            # Build query params
            params = {}
            if year:
                params['year'] = f"eq.{year}"
            # Note: 'paper' column might not exist in the schema provided, 
            # but we can filter if it does or just ignore for now.
            # The schema provided: id, question_image_url, answer_image_urls..., topic, year, difficulty
            
            # We want a random question. 
            # Supabase doesn't have native random(), so we might need to fetch a range or use a stored procedure.
            # For simplicity/performance in this context, we'll fetch a batch and pick one.
            # Or better: fetch count, pick random offset.
            
            # 1. Get count (simplified: just fetch up to 100 and pick one)
            # In production, use proper count query.
            
            # Build filters for Supabase query
            filters = {}
            if year:
                filters['year'] = f"eq.{year}"
                
            response = make_supabase_request('GET', 'olevel_maths', filters=filters, limit=50)
            
            if not response or not isinstance(response, list) or len(response) == 0:
                logger.warning("No DB questions found, falling back to AI")
                # If no DB questions, fallback to AI (handled by caller or recursive call?)
                # For now, raise exception to trigger fallback in get_next_question
                raise Exception("No DB questions found")
                
            # Pick random question
            db_question = random.choice(response)
            
            # Format for mobile
            return {
                'id': str(db_question.get('id')),
                'type': 'db_image',
                'question_text': 'Solve the problem shown in the image.', # Default text
                'question_image_url': db_question.get('question_image_url'),
                'answer_image_urls': [
                    db_question.get('answer_image_url_1'),
                    db_question.get('answer_image_url_2'),
                    db_question.get('answer_image_url_3'),
                    db_question.get('answer_image_url_4'),
                    db_question.get('answer_image_url_5')
                ], # Filter None values in frontend or here
                'topic': db_question.get('topic'),
                'year': db_question.get('year'),
                'allows_text_input': True,
                'allows_image_upload': True,
                'is_ai': False
            }
            
        except Exception as e:
            logger.error(f"DB fetch error: {e}")
            raise e

# Singleton
math_exam_service = MathExamService()
