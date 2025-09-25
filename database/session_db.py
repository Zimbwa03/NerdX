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
                custom_data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Add custom_data column if it doesn't exist (for existing databases)
        try:
            cursor.execute('ALTER TABLE user_sessions ADD COLUMN custom_data TEXT')
        except sqlite3.OperationalError:
            # Column already exists
            pass
        
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
        
        # Separate standard fields from custom data
        standard_fields = ['question_data', 'subject', 'topic', 'question_id', 'question_source', 'session_type']
        custom_data = {k: v for k, v in session_data.items() if k not in standard_fields}
        
        cursor.execute('''
            INSERT OR REPLACE INTO user_sessions 
            (user_id, question_data, subject, topic, question_id, question_source, session_type, custom_data, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            json.dumps(session_data.get('question_data')) if session_data.get('question_data') else None,
            session_data.get('subject'),
            session_data.get('topic'),
            session_data.get('question_id'),
            session_data.get('question_source'),
            session_data.get('session_type'),
            json.dumps(custom_data) if custom_data else None,
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
            SELECT question_data, subject, topic, question_id, question_source, session_type, custom_data, created_at, updated_at
            FROM user_sessions 
            WHERE user_id = ?
        ''', (user_id,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            session_data = {
                'question_data': json.loads(row[0]) if row[0] else None,
                'subject': row[1],
                'topic': row[2],
                'question_id': row[3],
                'question_source': row[4],
                'session_type': row[5],
                'created_at': row[7],
                'updated_at': row[8]
            }
            
            # Parse custom data if exists
            if row[6]:  # custom_data field
                try:
                    custom_data = json.loads(row[6])
                    session_data.update(custom_data)
                except json.JSONDecodeError:
                    logger.warning(f"Failed to parse custom_data for user {user_id}")
            
            return session_data
        
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

def save_combined_exam_session(user_id: str, question_data: Dict) -> bool:
    """Save Combined Exam session"""
    try:
        session_data = {
            'question_data': json.dumps(question_data),
            'subject': 'Combined Science',
            'topic': question_data.get('topic', 'Mixed'),
            'question_id': str(question_data.get('id', '')),
            'question_source': 'database',
            'session_type': 'combined_exam'
        }
        return save_user_session(user_id, session_data)
        
    except Exception as e:
        logger.error(f"Error saving combined exam session: {e}")
        return False

def get_combined_exam_session(user_id: str) -> Optional[Dict]:
    """Get Combined Exam session"""
    try:
        session = get_user_session(user_id)
        if session and session.get('session_type') == 'combined_exam':
            # Parse question data from JSON
            if session.get('question_data'):
                session['question_data'] = json.loads(session['question_data'])
            return session
        return None
        
    except Exception as e:
        logger.error(f"Error getting combined exam session: {e}")
        return None

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
