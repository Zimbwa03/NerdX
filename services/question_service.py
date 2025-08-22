import json
import logging
import hashlib
from typing import Dict, List, Optional
from constants import TOPICS, DIFFICULTY_LEVELS, POINT_VALUES
from services.ai_service import AIService
from database.external_db import (
    get_random_mcq_question, save_ai_question_to_database,
    get_questions_by_category_and_topic, count_questions_by_category_and_topic
)

logger = logging.getLogger(__name__)

class QuestionService:
    """Service for managing questions and question generation"""
    
    def __init__(self):
        self.ai_service = AIService()
    
    def get_question(self, user_id: str, subject: str, topic: str, difficulty: str, force_ai: bool = False) -> Optional[Dict]:
        """Get a question for the user (from database or generate new)"""
        try:
            # Validate input parameters
            if not self._validate_question_params(subject, topic, difficulty):
                return None
            
            # Try to get from database first (unless forced AI generation)
            if not force_ai:
                db_question = self._get_database_question(user_id, subject, topic, difficulty)
                if db_question:
                    return db_question
            
            # Generate new question using AI
            ai_question = self._generate_ai_question(subject, topic, difficulty)
            if ai_question:
                # Save to database for future use
                self._save_generated_question(ai_question, subject, topic, difficulty)
                return ai_question
            
            logger.error(f"Failed to get question for {subject}/{topic}/{difficulty}")
            return None
            
        except Exception as e:
            logger.error(f"Error getting question: {e}")
            return None
    
    def _validate_question_params(self, subject: str, topic: str, difficulty: str) -> bool:
        """Validate question parameters"""
        if subject not in TOPICS:
            logger.error(f"Invalid subject: {subject}")
            return False
        
        if topic not in TOPICS[subject]:
            logger.error(f"Invalid topic for {subject}: {topic}")
            return False
        
        if difficulty not in DIFFICULTY_LEVELS:
            logger.error(f"Invalid difficulty: {difficulty}")
            return False
        
        return True
    
    def _get_database_question(self, user_id: str, subject: str, topic: str, difficulty: str) -> Optional[Dict]:
        """Get a question from the database"""
        try:
            # Check how many questions are available
            question_count = count_questions_by_category_and_topic(subject, topic)
            if question_count == 0:
                logger.info(f"No database questions available for {subject}/{topic}")
                return None
            
            # Get a random question that user hasn't seen recently
            questions = get_questions_by_category_and_topic(subject, topic, limit=10)
            
            # Filter out recently asked questions
            from database.session_db import get_recent_question_hashes
            recent_hashes = get_recent_question_hashes(user_id, days=7)
            
            available_questions = []
            for question in questions:
                question_hash = self._generate_question_hash(question['question'])
                if question_hash not in recent_hashes:
                    available_questions.append(question)
            
            if not available_questions:
                logger.info(f"No new database questions for user {user_id}")
                return None
            
            # Select question based on difficulty
            filtered_questions = [q for q in available_questions if q.get('difficulty') == difficulty]
            if not filtered_questions:
                # Fallback to any difficulty if specific not available
                filtered_questions = available_questions
            
            if filtered_questions:
                question = filtered_questions[0]  # Could randomize this
                
                # Format for consistency
                return {
                    'question': question['question'],
                    'options': json.loads(question.get('options', '{}')),
                    'correct_answer': question.get('correct_answer'),
                    'explanation': question.get('explanation', ''),
                    'solution': question.get('solution', ''),
                    'points': question.get('points', POINT_VALUES[difficulty]),
                    'source': 'database',
                    'question_id': question.get('id')
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting database question: {e}")
            return None
    
    def _generate_ai_question(self, subject: str, topic: str, difficulty: str) -> Optional[Dict]:
        """Generate a new question using AI"""
        try:
            if subject == "Mathematics":
                question_data = self.ai_service.generate_math_question(topic, difficulty)
            elif subject in ["Biology", "Chemistry", "Physics"]:
                question_data = self.ai_service.generate_science_question(subject, topic, difficulty)
            elif subject == "English":
                question_data = self.ai_service.generate_english_question(topic, difficulty)
            else:
                logger.error(f"Unsupported subject for AI generation: {subject}")
                return None
            
            if question_data:
                question_data['source'] = 'ai_generated'
                question_data['subject'] = subject
                question_data['topic'] = topic
                question_data['difficulty'] = difficulty
                return question_data
            
            return None
            
        except Exception as e:
            logger.error(f"Error generating AI question: {e}")
            return None
    
    def _save_generated_question(self, question_data: Dict, subject: str, topic: str, difficulty: str):
        """Save generated question to database"""
        try:
            # Determine question type
            question_type = 'mcq' if 'options' in question_data else 'open'
            if subject == "Mathematics":
                question_type = 'math'
            elif subject == "English":
                question_type = 'essay'
            
            # Format options for storage
            options_json = None
            if 'options' in question_data:
                options_json = json.dumps(question_data['options'])
            
            # Save to database with correct function signature
            save_ai_question_to_database(question_data, subject, topic)
            
            logger.info(f"Saved AI-generated question to database: {subject}/{topic}/{difficulty}")
            
        except Exception as e:
            logger.error(f"Error saving generated question: {e}")
    
    def _generate_question_hash(self, question_text: str) -> str:
        """Generate hash for question to track duplicates"""
        return hashlib.md5(question_text.encode()).hexdigest()
    
    def get_topic_list(self, subject: str) -> List[str]:
        """Get list of topics for a subject"""
        return TOPICS.get(subject, [])
    
    def get_subject_list(self) -> List[str]:
        """Get list of available subjects"""
        return list(TOPICS.keys())
    
    def get_difficulty_levels(self) -> List[str]:
        """Get list of difficulty levels"""
        return DIFFICULTY_LEVELS.copy()
    
    def validate_answer(self, question_data: Dict, user_answer: str) -> Dict:
        """Validate user's answer and return result"""
        try:
            correct_answer = question_data.get('correct_answer', '').strip().upper()
            user_answer_clean = user_answer.strip().upper()
            
            is_correct = False
            
            # For MCQ questions
            if 'options' in question_data:
                is_correct = user_answer_clean == correct_answer
            
            # For math questions, check if numerical answers match
            elif question_data.get('subject') == 'Mathematics':
                is_correct = self._validate_math_answer(question_data, user_answer)
            
            # For essay questions, provide feedback but don't auto-grade
            elif question_data.get('subject') == 'English':
                return {
                    'is_correct': None,  # Cannot auto-grade essays
                    'feedback': "Thank you for your response. Essays require manual review.",
                    'points_awarded': 0,
                    'explanation': question_data.get('sample_answer', '')
                }
            
            points_awarded = question_data.get('points', 0) if is_correct else 0
            
            return {
                'is_correct': is_correct,
                'points_awarded': points_awarded,
                'explanation': question_data.get('solution', question_data.get('explanation', '')),
                'correct_answer': correct_answer
            }
            
        except Exception as e:
            logger.error(f"Error validating answer: {e}")
            return {
                'is_correct': False,
                'points_awarded': 0,
                'explanation': "Error validating answer",
                'correct_answer': question_data.get('correct_answer', '')
            }
    
    def _validate_math_answer(self, question_data: Dict, user_answer: str) -> bool:
        """Validate mathematical answers with some tolerance"""
        try:
            # Extract numerical value from solution
            solution = question_data.get('solution', '')
            correct_answer = question_data.get('correct_answer', '')
            
            # Try to extract numbers from both answers
            import re
            
            # Look for final answer in solution
            final_answer_match = re.search(r'final answer[:\s]*([+-]?\d*\.?\d+)', solution.lower())
            if final_answer_match:
                correct_value = float(final_answer_match.group(1))
            else:
                # Try to parse correct_answer directly
                try:
                    correct_value = float(correct_answer)
                except ValueError:
                    # Fallback to string comparison
                    return user_answer.strip().lower() == correct_answer.strip().lower()
            
            # Extract number from user answer
            user_number_match = re.search(r'([+-]?\d*\.?\d+)', user_answer)
            if user_number_match:
                user_value = float(user_number_match.group(1))
                
                # Check with small tolerance for floating point errors
                tolerance = abs(correct_value * 0.001)  # 0.1% tolerance
                return abs(user_value - correct_value) <= max(tolerance, 0.01)
            
            # Fallback to string comparison
            return user_answer.strip().lower() == correct_answer.strip().lower()
            
        except Exception as e:
            logger.error(f"Error validating math answer: {e}")
            # Fallback to string comparison
            return user_answer.strip().lower() == question_data.get('correct_answer', '').strip().lower()
