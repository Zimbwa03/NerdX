import logging
from typing import Dict, Optional, List
from datetime import datetime, timedelta
import random
import string
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Use direct database connection instead of app context
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///nerdx_quiz.db")

# Clean the DATABASE_URL to remove pgbouncer and other problematic parameters
def clean_database_url(url):
    """Remove problematic parameters from database URL"""
    if url and "postgresql://" in url:
        # Remove pgbouncer parameter and other problematic ones
        cleaned_url = url.split('?')[0]  # Remove all query parameters
        return cleaned_url
    return url

cleaned_db_url = clean_database_url(DATABASE_URL)
engine = create_engine(cleaned_db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

logger = logging.getLogger(__name__)

class ReferralService:
    """Handle user referral system with bonus credits"""
    
    def __init__(self):
        # Referral rewards - updated to match new credit system
        from config import Config
        self.referral_bonus = {
            'referrer': Config.REFERRAL_BONUS,  # 5 credits for the person who referred
            'referee': Config.REFERRAL_BONUS,   # 5 credits for the new user
        }
    
    def generate_referral_code(self, user_id: str) -> Optional[str]:
        """Get user's existing nerdx_id from registration table as referral code"""
        try:
            # Use the existing nerdx_id from user_registration table
            from database.external_db import get_user_registration
            
            # Get user registration data
            registration = get_user_registration(user_id)
            if registration and registration.get('nerdx_id'):
                nerdx_id = registration['nerdx_id']
                logger.info(f"Retrieved existing nerdx_id {nerdx_id} as referral code for user {user_id}")
                return nerdx_id
            else:
                logger.warning(f"No nerdx_id found for user {user_id} in registration table")
                # Fallback: generate temporary code if no registration found
                fallback_code = self._generate_fallback_code(user_id)
                logger.info(f"Generated fallback referral code {fallback_code} for unregistered user {user_id}")
                return fallback_code
                
        except Exception as e:
            logger.error(f"Error getting nerdx_id for user {user_id}: {e}")
            # Fallback approach: Generate code without database
            fallback_code = self._generate_fallback_code(user_id)
            logger.info(f"Generated fallback referral code {fallback_code} due to error")
            return fallback_code
    
    def _generate_code(self, user_id: str = None) -> str:
        """Generate a random 8-character referral code"""
        try:
            # Use mix of uppercase letters and digits
            characters = string.ascii_uppercase + string.digits
            # Exclude confusing characters
            characters = characters.replace('0', '').replace('O', '').replace('I', '').replace('1')
            
            return ''.join(random.choice(characters) for _ in range(8))
            
        except Exception as e:
            logger.error(f"Error generating code: {e}")
            # Create a unique fallback code using user_id if available
            if user_id:
                return self._generate_fallback_code(user_id)
            return "NERDX123"  # Last resort fallback
    
    def _generate_fallback_code(self, user_id: str) -> str:
        """Generate a fallback referral code based on user ID"""
        try:
            import hashlib
            
            # Create a hash of the user ID to ensure uniqueness
            hash_object = hashlib.md5(f"NERDX_{user_id}".encode())
            hash_hex = hash_object.hexdigest().upper()
            
            # Take first 6 characters and add "NX" prefix
            unique_part = hash_hex[:6]
            fallback_code = f"NX{unique_part}"
            
            logger.info(f"Generated fallback referral code {fallback_code} for user {user_id}")
            return fallback_code
            
        except Exception as e:
            logger.error(f"Error generating fallback code: {e}")
            # Last resort: use last 6 digits of user_id with prefix
            try:
                safe_id = ''.join(filter(str.isdigit, user_id))[-6:].zfill(6)
                return f"NX{safe_id}"
            except:
                return "NERDX123"
    
    def validate_referral_code(self, referral_code: str) -> Optional[str]:
        """Validate referral code (nerdx_id) and return referrer user_id"""
        try:
            # Use existing nerdx_id validation from external_db
            from database.external_db import get_user_by_nerdx_id
            
            # Look up user by nerdx_id (which is the referral code)
            user = get_user_by_nerdx_id(referral_code.upper())
            if user and user.get('chat_id'):
                logger.info(f"Valid referral code {referral_code} found for user {user['chat_id']}")
                return user['chat_id']  # Return the chat_id as user_id
            else:
                logger.warning(f"Invalid referral code: {referral_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error validating referral code {referral_code}: {e}")
            return None
    
    def process_referral(self, referrer_id: str, referee_id: str, referral_code: str) -> bool:
        """Process a referral using existing nerdx_id system"""
        try:
            # Prevent self-referral
            if referrer_id == referee_id:
                logger.warning(f"Self-referral attempt blocked: {referee_id}")
                return False
            
            # Use existing referral credit system
            from database.external_db import add_referral_credits, add_credits, get_user_registration
            
            # Get referrer's nerdx_id to use existing system
            referrer_registration = get_user_registration(referrer_id)
            if not referrer_registration:
                logger.error(f"Referrer {referrer_id} not found in registration")
                return False
                
            referrer_nerdx_id = referrer_registration.get('nerdx_id')
            if not referrer_nerdx_id:
                logger.error(f"No nerdx_id found for referrer {referrer_id}")
                return False
            
            # Check if the referral_code matches the referrer's nerdx_id
            if referral_code.upper() != referrer_nerdx_id.upper():
                logger.error(f"Referral code {referral_code} doesn't match referrer's nerdx_id {referrer_nerdx_id}")
                return False
            
            # Check if referee was already referred (check if they have referred_by_nerdx_id)
            referee_registration = get_user_registration(referee_id)
            if referee_registration and referee_registration.get('referred_by_nerdx_id'):
                logger.warning(f"User {referee_id} was already referred by {referee_registration.get('referred_by_nerdx_id')}")
                return False
            
            # Use existing add_referral_credits function
            # This function already handles credit awarding to referrer
            success = add_referral_credits(referrer_nerdx_id, referee_id)
            
            if success:
                # Also award bonus credits to the new user (referee)
                add_credits(referee_id, self.referral_bonus['referee'], f"Referral signup bonus via {referrer_nerdx_id}")
                logger.info(f"Successfully processed referral: {referrer_nerdx_id} -> {referee_id}")
                return True
            else:
                logger.warning(f"Failed to process referral credits for {referrer_nerdx_id} -> {referee_id}")
                return False
            
        except Exception as e:
            logger.error(f"Error processing referral: {e}")
            return False
    
    def award_referral_bonuses(self, referrer_id: str, referee_id: str, referral_id: int) -> Dict:
        """Award bonus credits to referrer and referee"""
        session = SessionLocal()
        try:
            from services.user_service import UserService
            from models import Referral
            
            user_service = UserService()
            
            results = {
                'referrer_bonus': 0,
                'referee_bonus': 0,
                'success': False
            }
            
            # Award bonus to referrer
            referrer_success = user_service.add_credits(referrer_id, self.referral_bonus['referrer'])
            if referrer_success:
                results['referrer_bonus'] = self.referral_bonus['referrer']
            
            # Award bonus to referee
            referee_success = user_service.add_credits(referee_id, self.referral_bonus['referee'])
            if referee_success:
                results['referee_bonus'] = self.referral_bonus['referee']
            
            # Mark bonus as awarded
            referral = session.query(Referral).get(referral_id)
            if referral:
                referral.bonus_awarded = True
                session.commit()
            
            results['success'] = True
            logger.info(f"Referral bonuses awarded: referrer +{results['referrer_bonus']}, referee +{results['referee_bonus']}")
            
            return results
            
        except Exception as e:
            logger.error(f"Error awarding referral bonuses: {e}")
            session.rollback()
            return {'referrer_bonus': 0, 'referee_bonus': 0, 'success': False}
        finally:
            session.close()
    
    def get_referral_stats(self, user_id: str) -> Dict:
        """Get referral statistics using existing nerdx_id system"""
        try:
            # Get user's nerdx_id as referral code
            from database.external_db import get_user_registration, get_referral_stats as get_existing_referral_stats
            
            # Get user's nerdx_id
            registration = get_user_registration(user_id)
            if not registration:
                logger.warning(f"No registration found for user {user_id}")
                return {
                    'referral_code': None,
                    'total_referrals': 0,
                    'successful_referrals': 0,
                    'total_bonus_earned': 0,
                    'recent_referrals': [],
                    'referrer_bonus': self.referral_bonus['referrer'],
                    'referee_bonus': self.referral_bonus['referee']
                }
            
            nerdx_id = registration.get('nerdx_id')
            if not nerdx_id:
                logger.warning(f"No nerdx_id found for user {user_id}")
                return {
                    'referral_code': None,
                    'total_referrals': 0,
                    'successful_referrals': 0,
                    'total_bonus_earned': 0,
                    'recent_referrals': [],
                    'referrer_bonus': self.referral_bonus['referrer'],
                    'referee_bonus': self.referral_bonus['referee']
                }
            
            # Use existing referral stats function
            existing_stats = get_existing_referral_stats(nerdx_id)
            
            if existing_stats:
                return {
                    'referral_code': nerdx_id,
                    'total_referrals': existing_stats.get('total_referrals', 0),
                    'successful_referrals': existing_stats.get('total_referrals', 0),  # Same as total in existing system
                    'total_bonus_earned': existing_stats.get('total_credits_earned', 0),
                    'recent_referrals': existing_stats.get('recent_referrals', []),
                    'referrer_bonus': self.referral_bonus['referrer'],
                    'referee_bonus': self.referral_bonus['referee']
                }
            else:
                # Return default stats with nerdx_id as referral code
                return {
                    'referral_code': nerdx_id,
                    'total_referrals': 0,
                    'successful_referrals': 0,
                    'total_bonus_earned': 0,
                    'recent_referrals': [],
                    'referrer_bonus': self.referral_bonus['referrer'],
                    'referee_bonus': self.referral_bonus['referee']
                }
            
        except Exception as e:
            logger.error(f"Error getting referral stats for {user_id}: {e}")
            # Try to get nerdx_id as fallback
            try:
                from database.external_db import get_user_registration
                registration = get_user_registration(user_id)
                fallback_code = registration.get('nerdx_id') if registration else None
            except:
                fallback_code = None
            
            return {
                'referral_code': fallback_code,
                'total_referrals': 0,
                'successful_referrals': 0,
                'total_bonus_earned': 0,
                'recent_referrals': [],
                'referrer_bonus': self.referral_bonus['referrer'],
                'referee_bonus': self.referral_bonus['referee']
            }
    
    def get_top_referrers(self, limit: int = 10) -> List[Dict]:
        """Get top users by referral count"""
        session = SessionLocal()
        try:
            from models import ReferralStats
            
            top_stats = session.query(ReferralStats).filter(
                ReferralStats.successful_referrals > 0
            ).order_by(
                ReferralStats.successful_referrals.desc()
            ).limit(limit).all()
            
            top_referrers = []
            for stats in top_stats:
                top_referrers.append({
                    'user_id': stats.user_id,
                    'referrals': stats.successful_referrals,
                    'bonus_earned': stats.total_bonus_earned
                })
            
            return top_referrers
            
        except Exception as e:
            logger.error(f"Error getting top referrers: {e}")
            return []
        finally:
            session.close()
    
    def generate_whatsapp_referral_link(self, referral_code: str) -> str:
        """Generate WhatsApp referral link that automatically opens chat"""
        try:
            # Use the correct bot number: +263779779967
            bot_number = "263779779967"
            
            # Create WhatsApp link that automatically opens chat with referral message
            # The text parameter will pre-fill the message
            referral_message = f"Hello! I want to join NerdX using referral code: {referral_code}"
            
            # URL encode the message
            import urllib.parse
            encoded_message = urllib.parse.quote(referral_message)
            
            # Create WhatsApp link
            whatsapp_link = f"https://wa.me/{bot_number}?text={encoded_message}"
            
            return whatsapp_link
            
        except Exception as e:
            logger.error(f"Error generating WhatsApp referral link: {e}")
            # Fallback link
            return f"https://wa.me/263779779967?text=Hello!%20I%20want%20to%20join%20NerdX%20using%20referral%20code:%20{referral_code}"
    
    def get_referral_share_message(self, user_id: str, user_name: str = None) -> Dict:
        """Get complete referral share message with link"""
        try:
            # Generate or get existing referral code
            referral_code = self.generate_referral_code(user_id)
            if not referral_code:
                return {
                    'success': False,
                    'message': 'Could not generate referral code'
                }
            
            # Generate WhatsApp link
            whatsapp_link = self.generate_whatsapp_referral_link(referral_code)
            
            # Create share message
            if not user_name:
                user_name = "Student"
            
            share_message = f"""📤 *Share NerdX with Friends!*

Hey {user_name}! 👋

💎 Earn *{self.referral_bonus['referrer']} FREE CREDITS* for every friend who registers using your referral code!

🎯 *Your Referral Code:* `{referral_code}`

📲 *Share this message:*

---
🎓 Join NerdX - The #1 ZIMSEC Quiz Bot!

🧬 Study Biology, Chemistry & Physics
🤖 AI-powered questions  
📊 Track your progress

💎 Register with referral code: *{referral_code}* and get bonus credits!

🚀 Start here: {whatsapp_link}
---

✨ *How it works:*
1️⃣ Share your referral code with friends
2️⃣ They register using your code
3️⃣ You both get +{self.referral_bonus['referrer']} credits!
4️⃣ They also get +{self.referral_bonus['referee']} bonus credits!"""

            return {
                'success': True,
                'referral_code': referral_code,
                'whatsapp_link': whatsapp_link,
                'share_message': share_message,
                'referrer_bonus': self.referral_bonus['referrer'],
                'referee_bonus': self.referral_bonus['referee']
            }
            
        except Exception as e:
            logger.error(f"Error getting referral share message: {e}")
            return {
                'success': False,
                'message': 'Error generating referral information'
            }