#!/usr/bin/env python3
"""
Question History Service
Tracks recently shown questions to prevent immediate repetition and enhance user experience
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set

logger = logging.getLogger(__name__)

class QuestionHistoryService:
    """Service to track and manage question history to prevent repetition"""
    
    def __init__(self):
        # In-memory storage for question history
        # Format: {user_id: {subject: [question_ids...]}}
        self.user_history: Dict[str, Dict[str, List[str]]] = {}
        
        # Maximum history size per subject (prevent memory bloat)
        self.max_history_per_subject = 50
        
        # Recent question threshold (prevent immediate repeats)
        self.recent_threshold = 10  # Last 10 questions per subject
        
    def add_question_to_history(self, user_id: str, subject: str, question_id: str):
        """Add a question to user's history for a specific subject"""
        try:
            if user_id not in self.user_history:
                self.user_history[user_id] = {}
                
            if subject not in self.user_history[user_id]:
                self.user_history[user_id][subject] = []
                
            history_list = self.user_history[user_id][subject]
            
            # Remove if already exists (move to end)
            if question_id in history_list:
                history_list.remove(question_id)
                
            # Add to end of list (most recent)
            history_list.append(question_id)
            
            # Trim history if too long
            if len(history_list) > self.max_history_per_subject:
                history_list.pop(0)  # Remove oldest
                
            logger.debug(f"Added question {question_id} to history for {user_id}/{subject}")
            
        except Exception as e:
            logger.error(f"Error adding question to history: {e}")
            
    def get_recent_questions(self, user_id: str, subject: str) -> Set[str]:
        """Get set of recently shown question IDs for a subject"""
        try:
            if user_id not in self.user_history:
                return set()
                
            if subject not in self.user_history[user_id]:
                return set()
                
            history_list = self.user_history[user_id][subject]
            
            # Get last N questions (recent threshold)
            recent_questions = history_list[-self.recent_threshold:] if len(history_list) > self.recent_threshold else history_list
            
            return set(recent_questions)
            
        except Exception as e:
            logger.error(f"Error getting recent questions: {e}")
            return set()
            
    def filter_questions_by_history(self, user_id: str, subject: str, questions: List[Dict], min_new_questions: int = 5) -> List[Dict]:
        """Filter out recently shown questions, ensuring minimum new questions available"""
        try:
            if not questions:
                return questions
                
            recent_ids = self.get_recent_questions(user_id, subject)
            
            if not recent_ids:
                return questions  # No history, return all
                
            # Separate new and old questions
            new_questions = [q for q in questions if str(q.get('id', '')) not in recent_ids]
            old_questions = [q for q in questions if str(q.get('id', '')) in recent_ids]
            
            # If we have enough new questions, return only new ones
            if len(new_questions) >= min_new_questions:
                logger.info(f"Found {len(new_questions)} new questions for {user_id}/{subject}")
                return new_questions
            else:
                # If not enough new questions, include some old ones but prioritize new
                logger.info(f"Only {len(new_questions)} new questions available, including some previous ones")
                return new_questions + old_questions
                
        except Exception as e:
            logger.error(f"Error filtering questions by history: {e}")
            return questions
            
    def clear_history(self, user_id: str, subject: Optional[str] = None):
        """Clear history for user (optionally for specific subject)"""
        try:
            if user_id not in self.user_history:
                return
                
            if subject:
                if subject in self.user_history[user_id]:
                    del self.user_history[user_id][subject]
                    logger.info(f"Cleared history for {user_id}/{subject}")
            else:
                del self.user_history[user_id]
                logger.info(f"Cleared all history for {user_id}")
                
        except Exception as e:
            logger.error(f"Error clearing history: {e}")
            
    def get_history_stats(self, user_id: str) -> Dict:
        """Get statistics about user's question history"""
        try:
            if user_id not in self.user_history:
                return {"total_subjects": 0, "subjects": {}}
                
            stats = {
                "total_subjects": len(self.user_history[user_id]),
                "subjects": {}
            }
            
            for subject, history in self.user_history[user_id].items():
                stats["subjects"][subject] = {
                    "total_questions": len(history),
                    "recent_questions": min(len(history), self.recent_threshold)
                }
                
            return stats
            
        except Exception as e:
            logger.error(f"Error getting history stats: {e}")
            return {"total_subjects": 0, "subjects": {}}

# Global instance
question_history_service = QuestionHistoryService()
