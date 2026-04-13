import logging
import hashlib
import json
from typing import Dict, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class QuestionCacheService:
    def __init__(self):
        self._question_cache = {}  # In-memory cache
    
    def generate_question_hash(self, question_text: str) -> str:
        """Generate a hash for a question to track uniqueness"""
        try:
            return hashlib.md5(question_text.lower().strip().encode()).hexdigest()
        except Exception as e:
            logger.error(f"Error generating question hash: {e}")
            return ""
    
    def has_question_been_asked(self, chat_id: str, question_hash: str) -> bool:
        """Check if a question has already been asked to this user"""
        try:
            # Import here to avoid circular imports
            from app import db
            from models import UserQuestionHistory
            
            existing = UserQuestionHistory.query.filter_by(
                user_id=chat_id, 
                question_hash=question_hash
            ).first()
            
            return existing is not None
            
        except Exception as e:
            logger.error(f"Error checking question history: {e}")
            return False
    
    def save_question_to_history(self, chat_id: str, question_text: str, topic: str, difficulty: str):
        """Save a question to user's history to prevent duplicates"""
        try:
            # Import here to avoid circular imports
            from app import db
            from models import UserQuestionHistory
            
            question_hash = self.generate_question_hash(question_text)
            
            # Check if already exists
            existing = UserQuestionHistory.query.filter_by(
                user_id=chat_id,
                question_hash=question_hash
            ).first()
            
            if not existing:
                history_record = UserQuestionHistory(
                    user_id=chat_id,
                    question_hash=question_hash,
                    topic=topic,
                    difficulty=difficulty
                )
                db.session.add(history_record)
                db.session.commit()
                
                logger.info(f"Saved question to history for user {chat_id}")
            
        except Exception as e:
            logger.error(f"Error saving question to history: {e}")
            db.session.rollback()
    
    def cache_question(self, topic: str, difficulty: str, question: Dict):
        """Cache a question for future use"""
        try:
            cache_key = f"{topic}_{difficulty}"
            
            if cache_key not in self._question_cache:
                self._question_cache[cache_key] = []
            
            # Keep only last 20 questions per topic/difficulty to manage memory
            if len(self._question_cache[cache_key]) >= 20:
                self._question_cache[cache_key].pop(0)
            
            self._question_cache[cache_key].append(question)
            logger.info(f"Cached question for {cache_key}")
            
        except Exception as e:
            logger.error(f"Error caching question: {e}")
    
    def get_cached_question(self, topic: str, difficulty: str, chat_id: str) -> Optional[Dict]:
        """Get a cached question that hasn't been asked to this user"""
        try:
            cache_key = f"{topic}_{difficulty}"
            
            if cache_key not in self._question_cache:
                return None
            
            # Try to find a question not asked to this user
            for question in self._question_cache[cache_key]:
                question_hash = self.generate_question_hash(question.get('question', ''))
                if not self.has_question_been_asked(chat_id, question_hash):
                    return question
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting cached question: {e}")
            return None
    
    def clear_user_history(self, chat_id: str, topic: Optional[str] = None):
        """Clear question history for a user (optionally for specific topic)"""
        try:
            # Import here to avoid circular imports
            from app import db
            from models import UserQuestionHistory
            
            query = UserQuestionHistory.query.filter_by(user_id=chat_id)
            
            if topic:
                query = query.filter_by(topic=topic)
            
            query.delete()
            db.session.commit()
            
            logger.info(f"Cleared question history for user {chat_id}")
            
        except Exception as e:
            logger.error(f"Error clearing user history: {e}")
            # Import here to avoid circular imports
            from app import db
            db.session.rollback()