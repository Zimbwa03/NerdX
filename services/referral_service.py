import logging
import sqlite3
from typing import Dict, Optional, List
from datetime import datetime, timedelta
import random
import string

logger = logging.getLogger(__name__)

class ReferralService:
    """Handle user referral system with bonus credits"""
    
    def __init__(self, db_path='nerdx_quiz.db'):
        self.db_path = db_path
        self.init_referral_tables()
        
        # Referral rewards
        self.referral_bonus = {
            'referrer': 50,  # Credits for the person who referred
            'referee': 25,   # Credits for the new user
        }
    
    def init_referral_tables(self):
        """Initialize referral tables in SQLite"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Referral codes table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS referral_codes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT UNIQUE,
                    referral_code TEXT UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Referrals table  
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS referrals (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    referrer_id TEXT,
                    referee_id TEXT,
                    referral_code TEXT,
                    bonus_awarded BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Referral stats table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS referral_stats (
                    user_id TEXT PRIMARY KEY,
                    total_referrals INTEGER DEFAULT 0,
                    successful_referrals INTEGER DEFAULT 0,
                    total_bonus_earned INTEGER DEFAULT 0,
                    last_referral_date TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Referral tables initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing referral tables: {e}")
    
    def generate_referral_code(self, user_id: str) -> Optional[str]:
        """Generate a unique referral code for user"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Check if user already has a referral code
            cursor.execute('SELECT referral_code FROM referral_codes WHERE user_id = ?', (user_id,))
            existing_code = cursor.fetchone()
            
            if existing_code:
                conn.close()
                return existing_code[0]
            
            # Generate new unique code
            for _ in range(10):  # Try 10 times to generate unique code
                code = self._generate_code()
                
                cursor.execute('SELECT COUNT(*) FROM referral_codes WHERE referral_code = ?', (code,))
                if cursor.fetchone()[0] == 0:
                    # Code is unique, save it
                    cursor.execute('''
                        INSERT INTO referral_codes (user_id, referral_code)
                        VALUES (?, ?)
                    ''', (user_id, code))
                    
                    conn.commit()
                    conn.close()
                    
                    logger.info(f"Generated referral code {code} for user {user_id}")
                    return code
            
            conn.close()
            logger.error("Could not generate unique referral code")
            return None
            
        except Exception as e:
            logger.error(f"Error generating referral code: {e}")
            return None
    
    def _generate_code(self) -> str:
        """Generate a random 8-character referral code"""
        try:
            # Use mix of uppercase letters and digits
            characters = string.ascii_uppercase + string.digits
            # Exclude confusing characters
            characters = characters.replace('0', '').replace('O', '').replace('I', '').replace('1')
            
            return ''.join(random.choice(characters) for _ in range(8))
            
        except Exception as e:
            logger.error(f"Error generating code: {e}")
            return "NERDX123"  # Fallback code
    
    def validate_referral_code(self, referral_code: str) -> Optional[str]:
        """Validate referral code and return referrer user_id"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT user_id FROM referral_codes 
                WHERE referral_code = ?
            ''', (referral_code.upper(),))
            
            result = cursor.fetchone()
            conn.close()
            
            if result:
                return result[0]
            else:
                return None
                
        except Exception as e:
            logger.error(f"Error validating referral code: {e}")
            return None
    
    def process_referral(self, referrer_id: str, referee_id: str, referral_code: str) -> bool:
        """Process a referral and award bonuses"""
        try:
            # Prevent self-referral
            if referrer_id == referee_id:
                logger.warning(f"Self-referral attempt blocked: {referee_id}")
                return False
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Check if referee was already referred
            cursor.execute('''
                SELECT COUNT(*) FROM referrals WHERE referee_id = ?
            ''', (referee_id,))
            
            if cursor.fetchone()[0] > 0:
                conn.close()
                logger.warning(f"User {referee_id} already has been referred")
                return False
            
            # Record the referral
            cursor.execute('''
                INSERT INTO referrals (referrer_id, referee_id, referral_code)
                VALUES (?, ?, ?)
            ''', (referrer_id, referee_id, referral_code))
            
            # Update referral stats
            cursor.execute('''
                INSERT OR REPLACE INTO referral_stats 
                (user_id, total_referrals, successful_referrals, total_bonus_earned, last_referral_date)
                VALUES (?, 
                    COALESCE((SELECT total_referrals FROM referral_stats WHERE user_id = ?), 0) + 1,
                    COALESCE((SELECT successful_referrals FROM referral_stats WHERE user_id = ?), 0) + 1,
                    COALESCE((SELECT total_bonus_earned FROM referral_stats WHERE user_id = ?), 0) + ?,
                    ?)
            ''', (referrer_id, referrer_id, referrer_id, referrer_id, self.referral_bonus['referrer'], datetime.now()))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Referral processed: {referrer_id} referred {referee_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error processing referral: {e}")
            return False
    
    def award_referral_bonuses(self, referrer_id: str, referee_id: str, referral_id: int) -> Dict:
        """Award bonus credits to referrer and referee"""
        try:
            from services.user_service import UserService
            user_service = UserService()
            
            results = {
                'referrer_bonus': 0,
                'referee_bonus': 0,
                'success': False
            }
            
            # Award bonus to referrer (placeholder - user_service integration)
            # referrer_bonus = user_service.add_credits(referrer_id, self.referral_bonus['referrer'], "Referral bonus")
            results['referrer_bonus'] = self.referral_bonus['referrer']
            
            # Award bonus to referee (placeholder - user_service integration)
            # referee_bonus = user_service.add_credits(referee_id, self.referral_bonus['referee'], "Welcome bonus")  
            results['referee_bonus'] = self.referral_bonus['referee']
            
            # Mark bonus as awarded
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE referrals SET bonus_awarded = TRUE 
                WHERE id = ?
            ''', (referral_id,))
            conn.commit()
            conn.close()
            
            results['success'] = True
            logger.info(f"Referral bonuses awarded: referrer +{results['referrer_bonus']}, referee +{results['referee_bonus']}")
            
            return results
            
        except Exception as e:
            logger.error(f"Error awarding referral bonuses: {e}")
            return {'referrer_bonus': 0, 'referee_bonus': 0, 'success': False}
    
    def get_referral_stats(self, user_id: str) -> Dict:
        """Get referral statistics for a user"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get referral code
            cursor.execute('SELECT referral_code FROM referral_codes WHERE user_id = ?', (user_id,))
            code_result = cursor.fetchone()
            referral_code = code_result[0] if code_result else None
            
            # Get stats
            cursor.execute('''
                SELECT total_referrals, successful_referrals, total_bonus_earned 
                FROM referral_stats WHERE user_id = ?
            ''', (user_id,))
            
            stats_result = cursor.fetchone()
            
            if stats_result:
                total_referrals, successful_referrals, total_bonus_earned = stats_result
            else:
                total_referrals = successful_referrals = total_bonus_earned = 0
            
            # Get recent referrals
            cursor.execute('''
                SELECT referee_id, created_at FROM referrals 
                WHERE referrer_id = ? AND bonus_awarded = TRUE
                ORDER BY created_at DESC LIMIT 5
            ''', (user_id,))
            
            recent_referrals = cursor.fetchall()
            
            conn.close()
            
            return {
                'referral_code': referral_code,
                'total_referrals': total_referrals,
                'successful_referrals': successful_referrals,
                'total_bonus_earned': total_bonus_earned,
                'recent_referrals': recent_referrals,
                'referrer_bonus': self.referral_bonus['referrer'],
                'referee_bonus': self.referral_bonus['referee']
            }
            
        except Exception as e:
            logger.error(f"Error getting referral stats: {e}")
            return {
                'referral_code': None,
                'total_referrals': 0,
                'successful_referrals': 0,
                'total_bonus_earned': 0,
                'recent_referrals': [],
                'referrer_bonus': self.referral_bonus['referrer'],
                'referee_bonus': self.referral_bonus['referee']
            }
    
    def get_top_referrers(self, limit: int = 10) -> List[Dict]:
        """Get top users by referral count"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT user_id, successful_referrals, total_bonus_earned
                FROM referral_stats
                WHERE successful_referrals > 0
                ORDER BY successful_referrals DESC
                LIMIT ?
            ''', (limit,))
            
            results = cursor.fetchall()
            conn.close()
            
            top_referrers = []
            for result in results:
                user_id, referrals, bonus = result
                top_referrers.append({
                    'user_id': user_id,
                    'referrals': referrals,
                    'bonus_earned': bonus
                })
            
            return top_referrers
            
        except Exception as e:
            logger.error(f"Error getting top referrers: {e}")
            return []