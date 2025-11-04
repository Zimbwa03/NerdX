"""
Quality Monitor - Tracks WhatsApp Business compliance metrics
Monitors complaint rates, response rates, and quality indicators
"""
import logging
import time
from typing import Dict, List, Optional, Any
from collections import defaultdict, deque
from datetime import datetime, timedelta
import json
import os

logger = logging.getLogger(__name__)

class QualityMonitor:
    """Monitors WhatsApp Business quality metrics and compliance"""
    
    def __init__(self):
        # Quality metrics tracking
        self.metrics = {
            'total_messages_sent': 0,
            'total_messages_delivered': 0,
            'total_messages_read': 0,
            'total_responses_received': 0,
            'total_complaints': 0,
            'total_blocks': 0,
            'total_unsubscribes': 0,
            'daily_message_count': 0,
            'last_reset_date': datetime.now().date()
        }
        
        # Override flag to force-disable quality throttling when needed
        self.force_disable_throttle = os.environ.get('DISABLE_WHATSAPP_THROTTLE', 'false').lower() == 'true'
        self.last_override_check = time.time()
        
        # Per-user tracking
        self.user_metrics = defaultdict(lambda: {
            'messages_sent': 0,
            'responses_received': 0,
            'last_interaction': 0,
            'complaints': 0,
            'blocks': 0,
            'unsubscribes': 0,
            'engagement_score': 0.5
        })
        
        # Time-based tracking (last 24 hours)
        self.hourly_metrics = deque(maxlen=24)
        self.daily_metrics = deque(maxlen=30)
        
        # Quality thresholds (WhatsApp Business requirements)
        self.thresholds = {
            'max_complaint_rate': 0.05,  # 0.05% = 5 complaints per 10,000 messages
            'min_response_rate': 0.85,   # 85% of messages should get responses
            'max_daily_messages': 50000,  # Conservative daily limit
            'max_messages_per_user_per_day': 50,  # Per user daily limit
            'min_engagement_score': 0.3,  # Minimum user engagement
            'max_block_rate': 0.01       # 0.01% = 1 block per 10,000 messages
        }
        
        # Alert system
        self.alerts = []
        self.alert_thresholds = {
            'complaint_rate_warning': 0.03,  # 3% - warning level
            'complaint_rate_critical': 0.05,  # 5% - critical level
            'response_rate_warning': 0.80,   # 80% - warning level
            'response_rate_critical': 0.70,  # 70% - critical level
        }
    
    def track_message_sent(self, user_id: str, message_type: str = 'text') -> bool:
        """Track a message being sent"""
        try:
            current_time = time.time()
            
            # Update global metrics
            self.metrics['total_messages_sent'] += 1
            self.metrics['daily_message_count'] += 1
            
            # Update user metrics
            self.user_metrics[user_id]['messages_sent'] += 1
            self.user_metrics[user_id]['last_interaction'] = current_time
            
            # Update hourly tracking
            self._update_hourly_metrics('messages_sent', 1)
            
            # Check for daily reset
            self._check_daily_reset()
            
            # Check if we're approaching limits
            if self._is_approaching_daily_limit():
                self._create_alert('warning', f"Approaching daily message limit: {self.metrics['daily_message_count']}")
            
            if self._is_user_exceeding_daily_limit(user_id):
                self._create_alert('warning', f"User {user_id} exceeding daily message limit")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Error tracking message sent: {e}")
            return True
    
    def track_message_delivered(self, user_id: str) -> None:
        """Track a message being delivered"""
        try:
            self.metrics['total_messages_delivered'] += 1
            self._update_hourly_metrics('messages_delivered', 1)
            
        except Exception as e:
            logger.error(f"Error tracking message delivered: {e}")
    
    def track_message_read(self, user_id: str) -> None:
        """Track a message being read"""
        try:
            self.metrics['total_messages_read'] += 1
            self._update_hourly_metrics('messages_read', 1)
            
        except Exception as e:
            logger.error(f"Error tracking message read: {e}")
    
    def track_response_received(self, user_id: str) -> None:
        """Track a response received from user"""
        try:
            self.metrics['total_responses_received'] += 1
            self.user_metrics[user_id]['responses_received'] += 1
            
            # Update engagement score
            self._update_user_engagement_score(user_id)
            
            self._update_hourly_metrics('responses_received', 1)
            
        except Exception as e:
            logger.error(f"Error tracking response received: {e}")
    
    def track_complaint(self, user_id: str, complaint_type: str = 'spam') -> None:
        """Track a complaint received"""
        try:
            self.metrics['total_complaints'] += 1
            self.user_metrics[user_id]['complaints'] += 1
            
            self._update_hourly_metrics('complaints', 1)
            
            # Create critical alert for complaints
            self._create_alert('critical', f"Complaint received from user {user_id}: {complaint_type}")
            
            # Check if complaint rate is too high
            complaint_rate = self.get_complaint_rate()
            if complaint_rate > self.thresholds['max_complaint_rate']:
                self._create_alert('critical', f"Complaint rate exceeded: {complaint_rate:.2%}")
            
        except Exception as e:
            logger.error(f"Error tracking complaint: {e}")
    
    def track_block(self, user_id: str) -> None:
        """Track a user blocking the bot"""
        try:
            self.metrics['total_blocks'] += 1
            self.user_metrics[user_id]['blocks'] += 1
            
            self._update_hourly_metrics('blocks', 1)
            
            # Create critical alert for blocks
            self._create_alert('critical', f"User {user_id} blocked the bot")
            
        except Exception as e:
            logger.error(f"Error tracking block: {e}")
    
    def track_unsubscribe(self, user_id: str) -> None:
        """Track a user unsubscribing"""
        try:
            self.metrics['total_unsubscribes'] += 1
            self.user_metrics[user_id]['unsubscribes'] += 1
            
            self._update_hourly_metrics('unsubscribes', 1)
            
        except Exception as e:
            logger.error(f"Error tracking unsubscribe: {e}")
    
    def get_complaint_rate(self) -> float:
        """Calculate current complaint rate"""
        try:
            if self.metrics['total_messages_sent'] == 0:
                return 0.0
            
            return self.metrics['total_complaints'] / self.metrics['total_messages_sent']
            
        except Exception as e:
            logger.error(f"Error calculating complaint rate: {e}")
            return 0.0
    
    def get_response_rate(self) -> float:
        """Calculate current response rate"""
        try:
            if self.metrics['total_messages_sent'] == 0:
                return 0.0
            
            return self.metrics['total_responses_received'] / self.metrics['total_messages_sent']
            
        except Exception as e:
            logger.error(f"Error calculating response rate: {e}")
            return 0.0
    
    def get_delivery_rate(self) -> float:
        """Calculate message delivery rate"""
        try:
            if self.metrics['total_messages_sent'] == 0:
                return 0.0
            
            return self.metrics['total_messages_delivered'] / self.metrics['total_messages_sent']
            
        except Exception as e:
            logger.error(f"Error calculating delivery rate: {e}")
            return 0.0
    
    def get_read_rate(self) -> float:
        """Calculate message read rate"""
        try:
            if self.metrics['total_messages_delivered'] == 0:
                return 0.0
            
            return self.metrics['total_messages_read'] / self.metrics['total_messages_delivered']
            
        except Exception as e:
            logger.error(f"Error calculating read rate: {e}")
            return 0.0
    
    def get_quality_rating(self) -> str:
        """Get current quality rating (GREEN, YELLOW, RED)"""
        try:
            complaint_rate = self.get_complaint_rate()
            response_rate = self.get_response_rate()
            
            if complaint_rate <= 0.01 and response_rate >= 0.90:
                return "GREEN"
            elif complaint_rate <= 0.03 and response_rate >= 0.80:
                return "YELLOW"
            else:
                return "RED"
                
        except Exception as e:
            logger.error(f"Error calculating quality rating: {e}")
            return "RED"
    
    def should_throttle_messaging(self) -> bool:
        """Determine if messaging should be throttled based on quality metrics"""
        try:
            # Refresh override flag periodically so ops can toggle without restart
            self._refresh_throttle_override()

            if getattr(self, 'force_disable_throttle', False):
                logger.info("WhatsApp throttle override active - allowing message despite quality metrics")
                return False

            complaint_rate = self.get_complaint_rate()
            response_rate = self.get_response_rate()
            quality_rating = self.get_quality_rating()
            
            # Throttle if quality is poor
            if quality_rating == "RED":
                return True
            
            # Throttle if approaching daily limits
            if self._is_approaching_daily_limit():
                return True
            
            # Throttle if complaint rate is high
            if complaint_rate > self.alert_thresholds['complaint_rate_warning']:
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking throttle condition: {e}")
            return True
    
    def get_quality_report(self) -> Dict[str, Any]:
        """Get comprehensive quality report"""
        try:
            return {
                'timestamp': datetime.now().isoformat(),
                'quality_rating': self.get_quality_rating(),
                'metrics': {
                    'total_messages_sent': self.metrics['total_messages_sent'],
                    'total_messages_delivered': self.metrics['total_messages_delivered'],
                    'total_messages_read': self.metrics['total_messages_read'],
                    'total_responses_received': self.metrics['total_responses_received'],
                    'total_complaints': self.metrics['total_complaints'],
                    'total_blocks': self.metrics['total_blocks'],
                    'total_unsubscribes': self.metrics['total_unsubscribes'],
                    'daily_message_count': self.metrics['daily_message_count']
                },
                'rates': {
                    'complaint_rate': self.get_complaint_rate(),
                    'response_rate': self.get_response_rate(),
                    'delivery_rate': self.get_delivery_rate(),
                    'read_rate': self.get_read_rate()
                },
                'thresholds': self.thresholds,
                'active_alerts': len([a for a in self.alerts if a['status'] == 'active']),
                'should_throttle': self.should_throttle_messaging()
            }
            
        except Exception as e:
            logger.error(f"Error generating quality report: {e}")
            return {}
    
    def _update_hourly_metrics(self, metric_type: str, value: int) -> None:
        """Update hourly metrics tracking"""
        try:
            current_hour = datetime.now().hour
            current_date = datetime.now().date()
            
            # Find or create current hour entry
            hour_entry = None
            for entry in self.hourly_metrics:
                if entry['hour'] == current_hour and entry['date'] == current_date:
                    hour_entry = entry
                    break
            
            if not hour_entry:
                hour_entry = {
                    'hour': current_hour,
                    'date': current_date,
                    'messages_sent': 0,
                    'messages_delivered': 0,
                    'messages_read': 0,
                    'responses_received': 0,
                    'complaints': 0,
                    'blocks': 0,
                    'unsubscribes': 0
                }
                self.hourly_metrics.append(hour_entry)
            
            # Update the metric
            if metric_type in hour_entry:
                hour_entry[metric_type] += value
                
        except Exception as e:
            logger.error(f"Error updating hourly metrics: {e}")
    
    def _update_user_engagement_score(self, user_id: str) -> None:
        """Update user engagement score based on interactions"""
        try:
            user_metrics = self.user_metrics[user_id]
            
            if user_metrics['messages_sent'] == 0:
                return
            
            # Calculate engagement score (responses per message)
            engagement_score = user_metrics['responses_received'] / user_metrics['messages_sent']
            
            # Apply time decay (recent interactions matter more)
            current_time = time.time()
            time_since_last = current_time - user_metrics['last_interaction']
            time_decay = max(0.1, 1.0 - (time_since_last / 86400))  # Decay over 24 hours
            
            user_metrics['engagement_score'] = min(1.0, engagement_score * time_decay)
            
        except Exception as e:
            logger.error(f"Error updating user engagement score: {e}")
    
    def _check_daily_reset(self) -> None:
        """Check if daily metrics need to be reset"""
        try:
            current_date = datetime.now().date()
            if current_date != self.metrics['last_reset_date']:
                # Reset daily counters
                self.metrics['daily_message_count'] = 0
                self.metrics['last_reset_date'] = current_date
                
                # Archive daily metrics
                daily_summary = {
                    'date': self.metrics['last_reset_date'].isoformat(),
                    'messages_sent': self.metrics['total_messages_sent'],
                    'complaints': self.metrics['total_complaints'],
                    'complaint_rate': self.get_complaint_rate(),
                    'response_rate': self.get_response_rate()
                }
                self.daily_metrics.append(daily_summary)
                
        except Exception as e:
            logger.error(f"Error checking daily reset: {e}")
    
    def _is_approaching_daily_limit(self) -> bool:
        """Check if approaching daily message limit"""
        try:
            return self.metrics['daily_message_count'] >= (self.thresholds['max_daily_messages'] * 0.8)
        except Exception as e:
            logger.error(f"Error checking daily limit: {e}")
            return False
    
    def _is_user_exceeding_daily_limit(self, user_id: str) -> bool:
        """Check if user is exceeding daily message limit"""
        try:
            user_metrics = self.user_metrics[user_id]
            return user_metrics['messages_sent'] >= self.thresholds['max_messages_per_user_per_day']
        except Exception as e:
            logger.error(f"Error checking user daily limit: {e}")
            return False
    
    def _create_alert(self, level: str, message: str) -> None:
        """Create a quality alert"""
        try:
            alert = {
                'id': f"{int(time.time())}_{len(self.alerts)}",
                'level': level,
                'message': message,
                'timestamp': datetime.now().isoformat(),
                'status': 'active'
            }
            self.alerts.append(alert)
            
            # Keep only last 100 alerts
            if len(self.alerts) > 100:
                self.alerts = self.alerts[-100:]
            
            logger.warning(f"Quality Alert [{level}]: {message}")
            
        except Exception as e:
            logger.error(f"Error creating alert: {e}")
    
    def get_active_alerts(self) -> List[Dict[str, Any]]:
        """Get all active alerts"""
        try:
            return [alert for alert in self.alerts if alert['status'] == 'active']
        except Exception as e:
            logger.error(f"Error getting active alerts: {e}")
            return []
    
    def resolve_alert(self, alert_id: str) -> bool:
        """Mark an alert as resolved"""
        try:
            for alert in self.alerts:
                if alert['id'] == alert_id:
                    alert['status'] = 'resolved'
                    return True
            return False
        except Exception as e:
            logger.error(f"Error resolving alert: {e}")
            return False

    def _refresh_throttle_override(self) -> None:
        """Refresh the throttle override flag from environment variables."""
        try:
            current_time = time.time()
            # Avoid checking constantly; refresh every 30 seconds
            if current_time - getattr(self, 'last_override_check', 0) < 30:
                return

            self.force_disable_throttle = os.environ.get('DISABLE_WHATSAPP_THROTTLE', 'false').lower() == 'true'
            self.last_override_check = current_time
        except Exception as e:
            logger.error(f"Error refreshing throttle override flag: {e}")

# Global instance
quality_monitor = QualityMonitor()




