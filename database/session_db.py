import sqlite3
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Optional, List

logger = logging.getLogger(__name__)

DATABASE_NAME = 'nerdx_sessions.db'

def init_session_database():
    """Initialize local SQLite database for session management"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()

        # Create user sessions table for managing current questions
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_sessions (
                user_id TEXT PRIMARY KEY,
                question_data TEXT,
                subject TEXT,
                topic TEXT,
                question_id TEXT,
                question_source TEXT,
                session_type TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create table to track previously asked questions to prevent duplicates
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

        # Create registration sessions table for managing registration flow
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS registration_sessions (
                user_id TEXT PRIMARY KEY,
                step TEXT,
                name TEXT,
                surname TEXT,
                date_of_birth TEXT,
                referred_by_nerdx_id TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Create rate limiting table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS rate_limits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                action TEXT,
                last_request TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, action)
            )
        ''')

        conn.commit()
        conn.close()
        logger.info("Session database initialized successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error initializing session database: {e}")
        return False

def save_user_session(user_id: str, session_data: Dict) -> bool:
    """Save or update user session"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO user_sessions 
            (user_id, question_data, subject, topic, question_id, question_source, session_type, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            session_data.get('question_data'),
            session_data.get('subject'),
            session_data.get('topic'),
            session_data.get('question_id'),
            session_data.get('question_source'),
            session_data.get('session_type'),
            datetime.utcnow()
        ))
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        logger.error(f"Error saving user session: {e}")
        return False

def get_user_session(user_id: str) -> Optional[Dict]:
    """Get current user session"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT question_data, subject, topic, question_id, question_source, session_type, created_at, updated_at
            FROM user_sessions 
            WHERE user_id = ?
        ''', (user_id,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                'question_data': row[0],
                'subject': row[1],
                'topic': row[2],
                'question_id': row[3],
                'question_source': row[4],
                'session_type': row[5],
                'created_at': row[6],
                'updated_at': row[7]
            }
        
        return None
        
    except Exception as e:
        logger.error(f"Error getting user session: {e}")
        return None

def clear_user_session(user_id: str) -> bool:
    """Clear user session"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM user_sessions WHERE user_id = ?', (user_id,))
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        logger.error(f"Error clearing user session: {e}")
        return False

def get_registration_session(user_id: str) -> Optional[Dict]:
    """Get registration session data"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT step, name, surname, date_of_birth, referred_by_nerdx_id, created_at, updated_at
            FROM registration_sessions 
            WHERE user_id = ?
        ''', (user_id,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                'step': row[0],
                'name': row[1],
                'surname': row[2],
                'date_of_birth': row[3],
                'referred_by_nerdx_id': row[4],
                'created_at': row[5],
                'updated_at': row[6]
            }
        
        return None
        
    except Exception as e:
        logger.error(f"Error getting registration session: {e}")
        return None

def update_registration_session(user_id: str, session_data: Dict) -> bool:
    """Update registration session"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO registration_sessions 
            (user_id, step, name, surname, date_of_birth, referred_by_nerdx_id, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            session_data.get('step'),
            session_data.get('name'),
            session_data.get('surname'),
            session_data.get('date_of_birth'),
            session_data.get('referred_by_nerdx_id'),
            datetime.utcnow()
        ))
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        logger.error(f"Error updating registration session: {e}")
        return False

def clear_registration_session(user_id: str) -> bool:
    """Clear registration session"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM registration_sessions WHERE user_id = ?', (user_id,))
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        logger.error(f"Error clearing registration session: {e}")
        return False

def add_question_to_history(user_id: str, question_hash: str, topic: str, difficulty: str) -> bool:
    """Add question to user's history to prevent duplicates"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR IGNORE INTO user_question_history 
            (user_id, question_hash, topic, difficulty)
            VALUES (?, ?, ?, ?)
        ''', (user_id, question_hash, topic, difficulty))
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        logger.error(f"Error adding question to history: {e}")
        return False

def get_recent_question_hashes(user_id: str, days: int = 7) -> List[str]:
    """Get recently asked question hashes for a user"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        cursor.execute('''
            SELECT question_hash 
            FROM user_question_history 
            WHERE user_id = ? AND asked_at >= ?
        ''', (user_id, cutoff_date))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [row[0] for row in rows]
        
    except Exception as e:
        logger.error(f"Error getting recent question hashes: {e}")
        return []

def save_rate_limit(user_id: str, action: str) -> bool:
    """Save rate limit entry"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO rate_limits (user_id, action, last_request)
            VALUES (?, ?, ?)
        ''', (user_id, action, datetime.utcnow()))
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        logger.error(f"Error saving rate limit: {e}")
        return False

def check_rate_limit(user_id: str, action: str, cooldown_seconds: int = 30) -> bool:
    """Check if user is rate limited for action"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT last_request 
            FROM rate_limits 
            WHERE user_id = ? AND action = ?
        ''', (user_id, action))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            last_request = datetime.fromisoformat(row[0])
            time_since = (datetime.utcnow() - last_request).total_seconds()
            return time_since < cooldown_seconds
        
        return False
        
    except Exception as e:
        logger.error(f"Error checking rate limit: {e}")
        return False

def complete_registration_session(user_id: str) -> bool:
    """Complete and remove registration session"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM registration_sessions WHERE user_id = ?', (user_id,))
        
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        logger.error(f"Error completing registration session: {e}")
        return False

def clear_registration_session(user_id: str) -> bool:
    """Clear/remove registration session"""
    return complete_registration_session(user_id)

def cleanup_old_sessions():
    """Clean up old session data"""
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        cursor = conn.cursor()
        
        # Remove sessions older than 24 hours
        cutoff = datetime.utcnow() - timedelta(hours=24)
        
        cursor.execute('DELETE FROM user_sessions WHERE created_at < ?', (cutoff,))
        cursor.execute('DELETE FROM registration_sessions WHERE created_at < ?', (cutoff,))
        
        # Remove question history older than 30 days
        question_cutoff = datetime.utcnow() - timedelta(days=30)
        cursor.execute('DELETE FROM user_question_history WHERE asked_at < ?', (question_cutoff,))
        
        # Remove rate limits older than 1 hour
        rate_cutoff = datetime.utcnow() - timedelta(hours=1)
        cursor.execute('DELETE FROM rate_limits WHERE last_request < ?', (rate_cutoff,))
        
        conn.commit()
        conn.close()
        
        logger.info("Session cleanup completed")
        return True
        
    except Exception as e:
        logger.error(f"Error during session cleanup: {e}")
        return False

# Initialize database on import
init_session_database()
