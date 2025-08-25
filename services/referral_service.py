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
        """Generate a unique referral code for user"""
        session = SessionLocal()
        try:
            from models import ReferralCode
            
            # Check if user already has a referral code
            existing_code = session.query(ReferralCode).filter_by(user_id=user_id).first()
            if existing_code:
                return existing_code.referral_code
            
            # Generate new unique code
            for _ in range(10):  # Try 10 times to generate unique code
                code = self._generate_code()
                
                # Check if code is unique
                if not session.query(ReferralCode).filter_by(referral_code=code).first():
                    # Code is unique, save it
                    new_code = ReferralCode(user_id=user_id, referral_code=code)
                    session.add(new_code)
                    session.commit()
                    
                    logger.info(f"Generated referral code {code} for user {user_id}")
                    return code
            
            logger.error("Could not generate unique referral code")
            return None
            
        except Exception as e:
            logger.error(f"Error generating referral code: {e}")
            session.rollback()
            return None
        finally:
            session.close()
    
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
        session = SessionLocal()
        try:
            from models import ReferralCode
            referral_record = session.query(ReferralCode).filter_by(referral_code=referral_code.upper()).first()
            return referral_record.user_id if referral_record else None
                
        except Exception as e:
            logger.error(f"Error validating referral code: {e}")
            return None
        finally:
            session.close()
    
    def process_referral(self, referrer_id: str, referee_id: str, referral_code: str) -> bool:
        """Process a referral and award bonuses"""
        session = SessionLocal()
        try:
            from models import Referral, ReferralStats
            
            # Prevent self-referral
            if referrer_id == referee_id:
                logger.warning(f"Self-referral attempt blocked: {referee_id}")
                return False
            
            # Check if referee was already referred
            existing_referral = session.query(Referral).filter_by(referee_id=referee_id).first()
            if existing_referral:
                logger.warning(f"User {referee_id} already has been referred")
                return False
            
            # Record the referral
            new_referral = Referral(
                referrer_id=referrer_id,
                referee_id=referee_id,
                referral_code=referral_code
            )
            session.add(new_referral)
            
            # Update or create referral stats
            stats = session.query(ReferralStats).filter_by(user_id=referrer_id).first()
            if stats:
                stats.total_referrals += 1
                stats.successful_referrals += 1
                stats.total_bonus_earned += self.referral_bonus['referrer']
                stats.last_referral_date = datetime.utcnow()
            else:
                stats = ReferralStats(
                    user_id=referrer_id,
                    total_referrals=1,
                    successful_referrals=1,
                    total_bonus_earned=self.referral_bonus['referrer'],
                    last_referral_date=datetime.utcnow()
                )
                session.add(stats)
            
            session.commit()
            logger.info(f"Referral processed: {referrer_id} referred {referee_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error processing referral: {e}")
            session.rollback()
            return False
        finally:
            session.close()
    
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
        """Get referral statistics for a user"""
        session = SessionLocal()
        try:
            from models import ReferralCode, ReferralStats, Referral
            
            # Get referral code
            code_record = session.query(ReferralCode).filter_by(user_id=user_id).first()
            referral_code = code_record.referral_code if code_record else None
            
            # Get stats
            stats = session.query(ReferralStats).filter_by(user_id=user_id).first()
            
            if stats:
                total_referrals = stats.total_referrals
                successful_referrals = stats.successful_referrals
                total_bonus_earned = stats.total_bonus_earned
            else:
                total_referrals = successful_referrals = total_bonus_earned = 0
            
            # Get recent referrals
            recent_referrals = session.query(Referral).filter_by(
                referrer_id=user_id, 
                bonus_awarded=True
            ).order_by(Referral.created_at.desc()).limit(5).all()
            
            recent_referrals_data = [(ref.referee_id, ref.created_at) for ref in recent_referrals]
            
            return {
                'referral_code': referral_code,
                'total_referrals': total_referrals,
                'successful_referrals': successful_referrals,
                'total_bonus_earned': total_bonus_earned,
                'recent_referrals': recent_referrals_data,
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
        finally:
            session.close()
    
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