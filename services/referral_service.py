import logging
from typing import Dict, Optional, List
from datetime import datetime, timedelta
import random
import string
from app import db
from models import ReferralCode, Referral, ReferralStats

logger = logging.getLogger(__name__)

class ReferralService:
    """Handle user referral system with bonus credits"""
    
    def __init__(self):
        # Referral rewards
        self.referral_bonus = {
            'referrer': 50,  # Credits for the person who referred
            'referee': 25,   # Credits for the new user
        }
    
    def generate_referral_code(self, user_id: str) -> Optional[str]:
        """Generate a unique referral code for user"""
        try:
            # Check if user already has a referral code
            existing_code = ReferralCode.query.filter_by(user_id=user_id).first()
            if existing_code:
                return existing_code.referral_code
            
            # Generate new unique code
            for _ in range(10):  # Try 10 times to generate unique code
                code = self._generate_code()
                
                # Check if code is unique
                if not ReferralCode.query.filter_by(referral_code=code).first():
                    # Code is unique, save it
                    new_code = ReferralCode(user_id=user_id, referral_code=code)
                    db.session.add(new_code)
                    db.session.commit()
                    
                    logger.info(f"Generated referral code {code} for user {user_id}")
                    return code
            
            logger.error("Could not generate unique referral code")
            return None
            
        except Exception as e:
            logger.error(f"Error generating referral code: {e}")
            db.session.rollback()
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
            referral_record = ReferralCode.query.filter_by(referral_code=referral_code.upper()).first()
            return referral_record.user_id if referral_record else None
                
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
            
            # Check if referee was already referred
            existing_referral = Referral.query.filter_by(referee_id=referee_id).first()
            if existing_referral:
                logger.warning(f"User {referee_id} already has been referred")
                return False
            
            # Record the referral
            new_referral = Referral(
                referrer_id=referrer_id,
                referee_id=referee_id,
                referral_code=referral_code
            )
            db.session.add(new_referral)
            
            # Update or create referral stats
            stats = ReferralStats.query.filter_by(user_id=referrer_id).first()
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
                db.session.add(stats)
            
            db.session.commit()
            logger.info(f"Referral processed: {referrer_id} referred {referee_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error processing referral: {e}")
            db.session.rollback()
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
            
            # Award bonus to referrer
            referrer_success = user_service.add_credits(referrer_id, self.referral_bonus['referrer'])
            if referrer_success:
                results['referrer_bonus'] = self.referral_bonus['referrer']
            
            # Award bonus to referee
            referee_success = user_service.add_credits(referee_id, self.referral_bonus['referee'])
            if referee_success:
                results['referee_bonus'] = self.referral_bonus['referee']
            
            # Mark bonus as awarded
            referral = Referral.query.get(referral_id)
            if referral:
                referral.bonus_awarded = True
                db.session.commit()
            
            results['success'] = True
            logger.info(f"Referral bonuses awarded: referrer +{results['referrer_bonus']}, referee +{results['referee_bonus']}")
            
            return results
            
        except Exception as e:
            logger.error(f"Error awarding referral bonuses: {e}")
            db.session.rollback()
            return {'referrer_bonus': 0, 'referee_bonus': 0, 'success': False}
    
    def get_referral_stats(self, user_id: str) -> Dict:
        """Get referral statistics for a user"""
        try:
            # Get referral code
            code_record = ReferralCode.query.filter_by(user_id=user_id).first()
            referral_code = code_record.referral_code if code_record else None
            
            # Get stats
            stats = ReferralStats.query.filter_by(user_id=user_id).first()
            
            if stats:
                total_referrals = stats.total_referrals
                successful_referrals = stats.successful_referrals
                total_bonus_earned = stats.total_bonus_earned
            else:
                total_referrals = successful_referrals = total_bonus_earned = 0
            
            # Get recent referrals
            recent_referrals = Referral.query.filter_by(
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
    
    def get_top_referrers(self, limit: int = 10) -> List[Dict]:
        """Get top users by referral count"""
        try:
            top_stats = ReferralStats.query.filter(
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