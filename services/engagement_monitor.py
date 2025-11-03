"""
Enterprise Scale Engagement Monitor
Critical for 100,000+ user operation to prevent spam flags
"""
import time
import logging
from typing import Dict, List
from collections import defaultdict, deque
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class EngagementMonitor:
    """Monitor user engagement at enterprise scale to prevent spam flags"""
    
    def __init__(self):
        # User engagement tracking
        self.user_metrics = defaultdict(dict)
        self.daily_stats = defaultdict(int)
        self.hourly_stats = defaultdict(int)
        
        # Quality monitoring
        self.complaint_reports = deque(maxlen=1000)  # Track recent complaints
        self.engagement_scores = defaultdict(float)
        self.response_rates = defaultdict(list)
        
        # Scale protection thresholds
        self.max_daily_messages = 50000  # Conservative for scaling
        self.complaint_threshold = 0.05  # 0.05% complaint rate = 25 complaints per 50k messages
        self.min_response_rate = 0.75    # 75% minimum response rate
        
        # Message variety tracking (prevent repetitive content flags)
        self.message_patterns = defaultdict(list)
        self.content_hashes = defaultdict(int)
        
    def track_message_sent(self, user_id: str, message_content: str = "", message_type: str = "text"):
        """Track outgoing message for engagement analysis"""
        try:
            current_time = time.time()
            today = datetime.now().date()
            hour = datetime.now().hour
            
            # Update counters
            self.daily_stats[f"{today}_sent"] += 1
            self.hourly_stats[f"{today}_{hour}_sent"] += 1
            
            # Track user-specific metrics
            if user_id not in self.user_metrics:
                self.user_metrics[user_id] = {
                    'messages_sent': 0,
                    'messages_received': 0,
                    'last_activity': current_time,
                    'engagement_score': 0.5,  # Start neutral
                    'response_rate': 0.0,
                    'complaint_reported': False
                }
            
            self.user_metrics[user_id]['messages_sent'] += 1
            self.user_metrics[user_id]['last_activity'] = current_time
            
            # Content variety tracking (prevent spam patterns)
            if message_content:
                content_hash = hash(message_content[:100])  # First 100 chars
                self.content_hashes[content_hash] += 1
                
                # Alert if same content sent too frequently
                if self.content_hashes[content_hash] > 100:  # Same message to 100+ users
                    logger.warning(f"SPAM RISK: Identical content sent to {self.content_hashes[content_hash]} users")
            
            # Scale monitoring
            if self.daily_stats[f"{today}_sent"] % 1000 == 0:
                self._log_daily_metrics()
                
        except Exception as e:
            logger.error(f"Error tracking message sent: {e}")
    
    def track_message_received(self, user_id: str, message_content: str = ""):
        """Track incoming message (user response)"""
        try:
            current_time = time.time()
            today = datetime.now().date()
            hour = datetime.now().hour
            
            # Update counters
            self.daily_stats[f"{today}_received"] += 1
            self.hourly_stats[f"{today}_{hour}_received"] += 1
            
            # Update user engagement
            if user_id in self.user_metrics:
                self.user_metrics[user_id]['messages_received'] += 1
                self.user_metrics[user_id]['last_activity'] = current_time
                
                # Calculate response rate
                sent = self.user_metrics[user_id]['messages_sent']
                received = self.user_metrics[user_id]['messages_received']
                if sent > 0:
                    response_rate = min(received / sent, 1.0)  # Cap at 100%
                    self.user_metrics[user_id]['response_rate'] = response_rate
                    
                    # Update engagement score based on response rate
                    if response_rate > 0.8:
                        self.user_metrics[user_id]['engagement_score'] = 0.9
                    elif response_rate > 0.5:
                        self.user_metrics[user_id]['engagement_score'] = 0.7
                    else:
                        self.user_metrics[user_id]['engagement_score'] = 0.3
                        
        except Exception as e:
            logger.error(f"Error tracking message received: {e}")
    
    def report_spam_complaint(self, user_id: str, complaint_type: str = "spam"):
        """Track spam complaints - CRITICAL for scale operation"""
        try:
            current_time = time.time()
            
            complaint_data = {
                'user_id': user_id,
                'timestamp': current_time,
                'type': complaint_type,
                'daily_message_count': self.daily_stats.get(f"{datetime.now().date()}_sent", 0)
            }
            
            self.complaint_reports.append(complaint_data)
            
            # Mark user as complained
            if user_id in self.user_metrics:
                self.user_metrics[user_id]['complaint_reported'] = True
                self.user_metrics[user_id]['engagement_score'] = 0.0
            
            # Calculate current complaint rate
            complaint_rate = self.get_complaint_rate()
            
            logger.critical(f"SPAM COMPLAINT: User {user_id}, Type: {complaint_type}, Rate: {complaint_rate:.4f}%")
            
            # Emergency response if complaint rate too high
            if complaint_rate > self.complaint_threshold:
                self._trigger_emergency_response(complaint_rate)
                
        except Exception as e:
            logger.error(f"Error reporting spam complaint: {e}")
    
    def get_complaint_rate(self) -> float:
        """Calculate current complaint rate (critical metric)"""
        try:
            today = datetime.now().date()
            messages_sent_today = self.daily_stats.get(f"{today}_sent", 0)
            
            if messages_sent_today == 0:
                return 0.0
            
            # Count complaints in last 24 hours
            cutoff_time = time.time() - 86400  # 24 hours ago
            recent_complaints = [c for c in self.complaint_reports if c['timestamp'] > cutoff_time]
            
            complaint_rate = (len(recent_complaints) / messages_sent_today) * 100
            return complaint_rate
            
        except Exception as e:
            logger.error(f"Error calculating complaint rate: {e}")
            return 0.0
    
    def get_response_rate(self) -> float:
        """Calculate overall response rate (engagement metric)"""
        try:
            today = datetime.now().date()
            sent = self.daily_stats.get(f"{today}_sent", 0)
            received = self.daily_stats.get(f"{today}_received", 0)
            
            if sent == 0:
                return 0.0
                
            return min((received / sent) * 100, 100.0)  # Cap at 100%
            
        except Exception as e:
            logger.error(f"Error calculating response rate: {e}")
            return 0.0
    
    def get_engagement_summary(self) -> Dict:
        """Get current engagement metrics for monitoring"""
        try:
            today = datetime.now().date()
            
            # Calculate averages
            total_users = len(self.user_metrics)
            avg_engagement = sum([u.get('engagement_score', 0) for u in self.user_metrics.values()]) / max(total_users, 1)
            avg_response_rate = sum([u.get('response_rate', 0) for u in self.user_metrics.values()]) / max(total_users, 1)
            
            return {
                'daily_messages_sent': self.daily_stats.get(f"{today}_sent", 0),
                'daily_messages_received': self.daily_stats.get(f"{today}_received", 0),
                'overall_response_rate': self.get_response_rate(),
                'complaint_rate': self.get_complaint_rate(),
                'total_users': total_users,
                'avg_engagement_score': avg_engagement,
                'avg_response_rate': avg_response_rate * 100,
                'high_engagement_users': sum([1 for u in self.user_metrics.values() if u.get('engagement_score', 0) > 0.7]),
                'low_engagement_users': sum([1 for u in self.user_metrics.values() if u.get('engagement_score', 0) < 0.3]),
                'complaint_users': sum([1 for u in self.user_metrics.values() if u.get('complaint_reported', False)])
            }
            
        except Exception as e:
            logger.error(f"Error getting engagement summary: {e}")
            return {}
    
    def should_throttle_user(self, user_id: str) -> bool:
        """Determine if messaging to user should be throttled"""
        try:
            if user_id not in self.user_metrics:
                return False
            
            user_data = self.user_metrics[user_id]
            
            # Throttle if user complained
            if user_data.get('complaint_reported', False):
                return True
            
            # Throttle low engagement users to improve overall metrics
            if user_data.get('engagement_score', 0.5) < 0.2:
                return True
            
            # Throttle if user hasn't responded recently
            last_activity = user_data.get('last_activity', 0)
            if time.time() - last_activity > 86400 * 7:  # 7 days
                return True
                
            return False
            
        except Exception as e:
            logger.error(f"Error checking throttle for user {user_id}: {e}")
            return False
    
    def _trigger_emergency_response(self, complaint_rate: float):
        """Emergency response when complaint rate too high"""
        logger.critical(f"EMERGENCY: Complaint rate {complaint_rate:.4f}% exceeds threshold {self.complaint_threshold}%")
        
        # TODO: Implement emergency actions
        # - Reduce message frequency
        # - Pause new user messaging
        # - Alert administrators
        # - Analyze complaint patterns
        # - Adjust content strategy
        
        # For now, just log the emergency
        logger.critical("EMERGENCY RESPONSE NEEDED: Manual intervention required")
    
    def _log_daily_metrics(self):
        """Log daily metrics for monitoring"""
        try:
            summary = self.get_engagement_summary()
            
            logger.info(f"DAILY METRICS: Sent={summary.get('daily_messages_sent', 0)}, "
                       f"Response Rate={summary.get('overall_response_rate', 0):.1f}%, "
                       f"Complaint Rate={summary.get('complaint_rate', 0):.3f}%, "
                       f"Users={summary.get('total_users', 0)}")
            
            # Alert on concerning trends
            if summary.get('complaint_rate', 0) > 0.03:  # 0.03% warning threshold
                logger.warning(f"SPAM RISK: Complaint rate {summary.get('complaint_rate', 0):.3f}% approaching limit")
            
            if summary.get('overall_response_rate', 0) < 60:  # 60% warning threshold
                logger.warning(f"ENGAGEMENT RISK: Response rate {summary.get('overall_response_rate', 0):.1f}% below target")
                
        except Exception as e:
            logger.error(f"Error logging daily metrics: {e}")

# Global instance
engagement_monitor = EngagementMonitor()



