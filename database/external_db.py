import os
import json
import logging
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, List, Optional, Any
from datetime import datetime
import random

logger = logging.getLogger(__name__)

def get_connection():
    """Get database connection"""
    try:
        # Use PostgreSQL connection from environment
        database_url = os.getenv('DATABASE_URL')
        if database_url:
            conn = psycopg2.connect(database_url)
            return conn
        else:
            # Fallback to individual connection parameters
            conn = psycopg2.connect(
                host=os.getenv('PGHOST', 'localhost'),
                database=os.getenv('PGDATABASE', 'nerdx_quiz'),
                user=os.getenv('PGUSER', 'postgres'),
                password=os.getenv('PGPASSWORD', ''),
                port=os.getenv('PGPORT', '5432')
            )
            return conn
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return None

def test_connection() -> bool:
    """Test database connection"""
    try:
        conn = get_connection()
        if conn:
            conn.close()
            logger.info("Database connection test successful")
            return True
        return False
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False

def is_user_registered(whatsapp_id: str) -> bool:
    """Check if user is registered"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM users_registration WHERE chat_id = %s", (whatsapp_id,))
        result = cursor.fetchone()
        
        conn.close()
        return result is not None
        
    except Exception as e:
        logger.error(f"Error checking user registration: {e}")
        return False

def get_user_registration(whatsapp_id: str) -> Optional[Dict]:
    """Get user registration data"""
    try:
        conn = get_connection()
        if not conn:
            return None
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT chat_id as whatsapp_id, nerdx_id, name, surname, date_of_birth, 
                   referred_by_nerdx_id as referred_by, created_at
            FROM users_registration WHERE chat_id = %s
        """, (whatsapp_id,))
        
        result = cursor.fetchone()
        conn.close()
        
        if result:
            # Add default values for fields not in users_registration table
            user_dict = dict(result)
            user_dict.update({
                'phone_number': whatsapp_id,  # Use WhatsApp ID as phone
                'email': None,
                'credits': 50,  # Default credits
                'total_points': 0,
                'streak_count': 0,
                'last_activity': None,
                'is_active': True
            })
            return user_dict
        return None
        
    except Exception as e:
        logger.error(f"Error getting user registration: {e}")
        return None

def create_user_registration(user_data: Dict) -> bool:
    """Create new user registration"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        # Use date of birth as string (matches schema)
        dob = user_data.get('date_of_birth')
        
        cursor.execute("""
            INSERT INTO users_registration (chat_id, nerdx_id, name, surname, date_of_birth, 
                                          referred_by_nerdx_id, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user_data['whatsapp_id'],  # chat_id = whatsapp_id
            user_data['nerdx_id'],
            user_data['name'],
            user_data['surname'],
            dob,  # Keep as string
            user_data.get('referred_by'),
            datetime.utcnow(),
            datetime.utcnow()
        ))
        
        # Also create entry in users table for credits tracking
        cursor.execute("""
            INSERT INTO users (whatsapp_id, nerdx_id, name, surname, date_of_birth, 
                             phone_number, credits, referred_by, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user_data['whatsapp_id'],
            user_data['nerdx_id'],
            user_data['name'],
            user_data['surname'],
            dob,
            user_data['whatsapp_id'],  # Use WhatsApp ID as phone
            50,  # Welcome credits
            user_data.get('referred_by'),
            datetime.utcnow()
        ))
        
        conn.commit()
        conn.close()
        
        logger.info(f"User registration created: {user_data['nerdx_id']}")
        return True
        
    except Exception as e:
        logger.error(f"Error creating user registration: {e}")
        return False

def get_user_credits(user_id: str) -> int:
    """Get user's current credit balance"""
    try:
        conn = get_connection()
        if not conn:
            return 0
        
        cursor = conn.cursor()
        # First check users table for credits
        cursor.execute("SELECT credits FROM users WHERE whatsapp_id = %s", (user_id,))
        result = cursor.fetchone()
        
        # If not found in users table, check if they exist in users_registration
        if not result:
            cursor.execute("SELECT 1 FROM users_registration WHERE chat_id = %s", (user_id,))
            reg_result = cursor.fetchone()
            if reg_result:
                # User exists in registration but not in users table, create users entry
                cursor.execute("""INSERT INTO users (whatsapp_id, credits, created_at) 
                                  VALUES (%s, %s, %s) ON CONFLICT (whatsapp_id) DO NOTHING""",
                              (user_id, 50, datetime.utcnow()))
                conn.commit()
                conn.close()
                return 50
        
        conn.close()
        return result[0] if result else 0
        
    except Exception as e:
        logger.error(f"Error getting user credits: {e}")
        return 0

def add_credits(user_id: str, amount: int, reason: str = 'manual') -> bool:
    """Add credits to user account"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE users 
            SET credits = credits + %s, updated_at = %s 
            WHERE whatsapp_id = %s
        """, (amount, datetime.utcnow(), user_id))
        
        conn.commit()
        conn.close()
        
        logger.info(f"Added {amount} credits to user {user_id} (reason: {reason})")
        return True
        
    except Exception as e:
        logger.error(f"Error adding credits: {e}")
        return False

def deduct_credits(user_id: str, amount: int) -> bool:
    """Deduct credits from user account"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        # Check if user has sufficient credits
        cursor.execute("SELECT credits FROM users WHERE whatsapp_id = %s", (user_id,))
        result = cursor.fetchone()
        
        if not result or result[0] < amount:
            conn.close()
            return False
        
        # Deduct credits
        cursor.execute("""
            UPDATE users 
            SET credits = credits - %s, updated_at = %s 
            WHERE whatsapp_id = %s
        """, (amount, datetime.utcnow(), user_id))
        
        conn.commit()
        conn.close()
        
        logger.info(f"Deducted {amount} credits from user {user_id}")
        return True
        
    except Exception as e:
        logger.error(f"Error deducting credits: {e}")
        return False

def get_or_create_user_stats(user_id: str, subject: str, topic: str, difficulty: str) -> Dict:
    """Get or create user statistics"""
    try:
        conn = get_connection()
        if not conn:
            return {}
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Try to get existing stats
        cursor.execute("""
            SELECT * FROM user_stats 
            WHERE user_id = %s AND subject = %s AND topic = %s AND difficulty = %s
        """, (user_id, subject, topic, difficulty))
        
        result = cursor.fetchone()
        
        if result:
            conn.close()
            return dict(result)
        
        # Create new stats entry
        cursor.execute("""
            INSERT INTO user_stats (user_id, subject, topic, difficulty, 
                                   total_questions, correct_answers, total_points)
            VALUES (%s, %s, %s, %s, 0, 0, 0)
            RETURNING *
        """, (user_id, subject, topic, difficulty))
        
        result = cursor.fetchone()
        
        conn.commit()
        conn.close()
        
        return dict(result) if result else {}
        
    except Exception as e:
        logger.error(f"Error getting/creating user stats: {e}")
        return {}

def update_user_stats(user_id: str, subject: str, topic: str, difficulty: str, 
                     correct: bool, points: int) -> bool:
    """Update user statistics"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        # Update stats
        cursor.execute("""
            UPDATE user_stats 
            SET total_questions = total_questions + 1,
                correct_answers = correct_answers + %s,
                total_points = total_points + %s,
                last_updated = %s
            WHERE user_id = %s AND subject = %s AND topic = %s AND difficulty = %s
        """, (1 if correct else 0, points, datetime.utcnow(), 
              user_id, subject, topic, difficulty))
        
        # Also update user's total points
        cursor.execute("""
            UPDATE users 
            SET total_points = total_points + %s, 
                last_activity = %s,
                updated_at = %s
            WHERE whatsapp_id = %s
        """, (points, datetime.utcnow(), datetime.utcnow(), user_id))
        
        conn.commit()
        conn.close()
        
        return True
        
    except Exception as e:
        logger.error(f"Error updating user stats: {e}")
        return False

def get_random_mcq_question(subject: str, topic: Optional[str] = None) -> Optional[Dict]:
    """Get a random MCQ question from database"""
    try:
        conn = get_connection()
        if not conn:
            return None
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if topic:
            cursor.execute("""
                SELECT * FROM questions 
                WHERE subject = %s AND topic = %s AND question_type = 'mcq'
                ORDER BY RANDOM() LIMIT 1
            """, (subject, topic))
        else:
            cursor.execute("""
                SELECT * FROM questions 
                WHERE subject = %s AND question_type = 'mcq'
                ORDER BY RANDOM() LIMIT 1
            """, (subject,))
        
        result = cursor.fetchone()
        conn.close()
        
        return dict(result) if result else None
        
    except Exception as e:
        logger.error(f"Error getting random MCQ question: {e}")
        return None

def get_questions_by_category_and_topic(subject: str, topic: str, limit: int = 10) -> List[Dict]:
    """Get questions by category and topic"""
    try:
        conn = get_connection()
        if not conn:
            return []
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT * FROM questions 
            WHERE subject = %s AND topic = %s
            ORDER BY RANDOM() LIMIT %s
        """, (subject, topic, limit))
        
        results = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in results]
        
    except Exception as e:
        logger.error(f"Error getting questions by category and topic: {e}")
        return []

def count_questions_by_category_and_topic(subject: str, topic: str) -> int:
    """Count questions by category and topic"""
    try:
        conn = get_connection()
        if not conn:
            return 0
        
        cursor = conn.cursor()
        cursor.execute("""
            SELECT COUNT(*) FROM questions 
            WHERE subject = %s AND topic = %s
        """, (subject, topic))
        
        result = cursor.fetchone()
        conn.close()
        
        return result[0] if result else 0
        
    except Exception as e:
        logger.error(f"Error counting questions: {e}")
        return 0

def save_ai_question_to_database(subject: str, topic: str, difficulty: str, 
                                question_type: str, question_text: str,
                                options: Optional[str] = None, correct_answer: Optional[str] = None,
                                solution: Optional[str] = None, points: int = 10) -> bool:
    """Save AI-generated question to database"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO questions (subject, topic, difficulty, question_type,
                                 question_text, options, correct_answer, solution, points)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (subject, topic, difficulty, question_type, question_text,
              options, correct_answer, solution, points))
        
        conn.commit()
        conn.close()
        
        return True
        
    except Exception as e:
        logger.error(f"Error saving AI question to database: {e}")
        return False

def create_pending_payment(user_id: str, amount: float, credits: int, 
                          reference: str, external_reference: Optional[str] = None) -> bool:
    """Create pending payment record"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO payments (user_id, amount, credits, payment_method, 
                                reference, status, external_reference)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (user_id, amount, credits, 'ecocash', reference, 'pending', external_reference))
        
        conn.commit()
        conn.close()
        
        return True
        
    except Exception as e:
        logger.error(f"Error creating pending payment: {e}")
        return False

def get_pending_payment(reference: str) -> Optional[Dict]:
    """Get pending payment by reference"""
    try:
        conn = get_connection()
        if not conn:
            return None
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT * FROM payments 
            WHERE reference = %s AND status = 'pending'
        """, (reference,))
        
        result = cursor.fetchone()
        conn.close()
        
        return dict(result) if result else None
        
    except Exception as e:
        logger.error(f"Error getting pending payment: {e}")
        return None

def complete_payment(reference: str, external_reference: Optional[str] = None, 
                    status: str = 'completed') -> bool:
    """Complete payment transaction"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE payments 
            SET status = %s, external_reference = %s, completed_at = %s
            WHERE reference = %s
        """, (status, external_reference, datetime.utcnow(), reference))
        
        conn.commit()
        conn.close()
        
        return True
        
    except Exception as e:
        logger.error(f"Error completing payment: {e}")
        return False

def process_ecocash_payment(payment_data: Dict) -> bool:
    """Process EcoCash payment callback"""
    try:
        # This would integrate with actual EcoCash API
        # For now, return True for successful processing
        reference = payment_data.get('reference')
        status = payment_data.get('status', 'completed')
        
        return complete_payment(reference or '', status=status)
        
    except Exception as e:
        logger.error(f"Error processing EcoCash payment: {e}")
        return False

def get_user_by_nerdx_id(nerdx_id: str) -> Optional[Dict]:
    """Get user by NerdX ID"""
    try:
        conn = get_connection()
        if not conn:
            return None
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT * FROM users WHERE nerdx_id = %s
        """, (nerdx_id,))
        
        result = cursor.fetchone()
        conn.close()
        
        return dict(result) if result else None
        
    except Exception as e:
        logger.error(f"Error getting user by NerdX ID: {e}")
        return None

def add_referral_credits(referrer_nerdx_id: str, new_user_id: str) -> bool:
    """Add referral credits to both referrer and new user"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        # Add credits to referrer
        cursor.execute("""
            UPDATE users 
            SET credits = credits + 25, updated_at = %s
            WHERE nerdx_id = %s
        """, (datetime.utcnow(), referrer_nerdx_id))
        
        # Add bonus credits to new user
        cursor.execute("""
            UPDATE users 
            SET credits = credits + 15, updated_at = %s
            WHERE whatsapp_id = %s
        """, (datetime.utcnow(), new_user_id))
        
        conn.commit()
        conn.close()
        
        logger.info(f"Referral credits added: {referrer_nerdx_id} -> {new_user_id}")
        return True
        
    except Exception as e:
        logger.error(f"Error adding referral credits: {e}")
        return False

def get_user_stats(user_id: str) -> Optional[Dict]:
    """Get comprehensive user statistics"""
    try:
        conn = get_connection()
        if not conn:
            return None
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get user basic info
        cursor.execute("""
            SELECT whatsapp_id, nerdx_id, name, surname, credits, total_points,
                   streak_count, last_activity, created_at
            FROM users WHERE whatsapp_id = %s
        """, (user_id,))
        
        user_data = cursor.fetchone()
        if not user_data:
            conn.close()
            return None
        
        # Get aggregated stats
        cursor.execute("""
            SELECT 
                COUNT(*) as questions_answered,
                SUM(correct_answers) as total_correct,
                SUM(total_points) as stats_points
            FROM user_stats WHERE user_id = %s
        """, (user_id,))
        
        stats_data = cursor.fetchone()
        
        conn.close()
        
        result = dict(user_data)
        if stats_data:
            result.update(dict(stats_data))
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting user stats: {e}")
        return None

def add_xp(user_id: str, xp_amount: int) -> bool:
    """Add experience points to user"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE users 
            SET total_points = total_points + %s, updated_at = %s
            WHERE whatsapp_id = %s
        """, (xp_amount, datetime.utcnow(), user_id))
        
        conn.commit()
        conn.close()
        
        return True
        
    except Exception as e:
        logger.error(f"Error adding XP: {e}")
        return False

def update_streak(user_id: str) -> bool:
    """Update user's learning streak"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        
        # Check last activity
        cursor.execute("""
            SELECT last_activity FROM users WHERE whatsapp_id = %s
        """, (user_id,))
        
        result = cursor.fetchone()
        if not result:
            conn.close()
            return False
        
        last_activity = result[0]
        now = datetime.utcnow()
        
        # If last activity was yesterday, increment streak
        if last_activity and (now - last_activity).days == 1:
            cursor.execute("""
                UPDATE users 
                SET streak_count = streak_count + 1, 
                    last_activity = %s, 
                    updated_at = %s
                WHERE whatsapp_id = %s
            """, (now, now, user_id))
        # If last activity was today, just update last_activity
        elif last_activity and (now - last_activity).days == 0:
            cursor.execute("""
                UPDATE users 
                SET last_activity = %s, updated_at = %s
                WHERE whatsapp_id = %s
            """, (now, now, user_id))
        # If gap is more than 1 day, reset streak
        else:
            cursor.execute("""
                UPDATE users 
                SET streak_count = 1, last_activity = %s, updated_at = %s
                WHERE whatsapp_id = %s
            """, (now, now, user_id))
        
        conn.commit()
        conn.close()
        
        return True
        
    except Exception as e:
        logger.error(f"Error updating streak: {e}")
        return False

def update_user_last_activity(user_id: str) -> bool:
    """Update user's last activity timestamp"""
    try:
        conn = get_connection()
        if not conn:
            return False
        
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE users 
            SET last_activity = %s, updated_at = %s
            WHERE whatsapp_id = %s
        """, (datetime.utcnow(), datetime.utcnow(), user_id))
        
        conn.commit()
        conn.close()
        
        return True
        
    except Exception as e:
        logger.error(f"Error updating last activity: {e}")
        return False

def get_question_by_id(question_id: int) -> Optional[Dict]:
    """Get specific question by ID"""
    try:
        conn = get_connection()
        if not conn:
            return None
        
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM questions WHERE id = %s", (question_id,))
        
        result = cursor.fetchone()
        conn.close()
        
        return dict(result) if result else None
        
    except Exception as e:
        logger.error(f"Error getting question by ID: {e}")
        return None
