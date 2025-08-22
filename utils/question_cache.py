import logging
import hashlib
import sqlite3
from typing import Dict, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class QuestionCache:
    def __init__(self, db_path='nerdx_quiz.db'):
        self.db_path = db_path
        self._question_cache = {}  # In-memory cache
        self.init_cache_tables()
        
    def init_cache_tables(self):
        """Initialize cache tables in SQLite"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create question cache table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS question_cache (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    cache_key TEXT UNIQUE,
                    question_data TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create user question history table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_question_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT,
                    question_hash TEXT,
                    topic TEXT,
                    difficulty TEXT,
                    asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, question_hash)
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Question cache tables initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing cache tables: {e}")
    
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
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT COUNT(*) FROM user_question_history 
                WHERE user_id = ? AND question_hash = ?
            ''', (chat_id, question_hash))
            
            count = cursor.fetchone()[0]
            conn.close()
            
            return count > 0
            
        except Exception as e:
            logger.error(f"Error checking question history: {e}")
            return False
    
    def save_question_to_history(self, chat_id: str, question_text: str, topic: str, difficulty: str):
        """Save a question to user's history to prevent duplicates"""
        try:
            question_hash = self.generate_question_hash(question_text)
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR IGNORE INTO user_question_history 
                (user_id, question_hash, topic, difficulty)
                VALUES (?, ?, ?, ?)
            ''', (chat_id, question_hash, topic, difficulty))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Saved question to history for user {chat_id}")
            
        except Exception as e:
            logger.error(f"Error saving question to history: {e}")
    
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
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            if topic:
                cursor.execute('''
                    DELETE FROM user_question_history 
                    WHERE user_id = ? AND topic = ?
                ''', (chat_id, topic))
            else:
                cursor.execute('''
                    DELETE FROM user_question_history 
                    WHERE user_id = ?
                ''', (chat_id,))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Cleared question history for user {chat_id}")
            
        except Exception as e:
            logger.error(f"Error clearing user history: {e}")