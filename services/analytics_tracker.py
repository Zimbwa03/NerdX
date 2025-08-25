"""
Real-time Analytics Tracker for NerdX
Tracks user interactions and updates analytics tables
"""
import psycopg2
from datetime import datetime, date
import logging
import json
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class AnalyticsTracker:
    def __init__(self):
        self.conn_string = 'postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
    
    def _get_connection(self):
        """Get database connection"""
        try:
            return psycopg2.connect(self.conn_string)
        except Exception as e:
            logger.error(f"Database connection error: {e}")
            return None
    
    def track_user_session_start(self, user_id: str, session_id: str, device_info: Dict = None):
        """Track when a user starts a session"""
        try:
            conn = self._get_connection()
            if not conn:
                return False
            
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO user_sessions_analytics 
                (user_id, session_id, start_time, device_info)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (session_id) DO NOTHING
            """, (user_id, session_id, datetime.now(), json.dumps(device_info) if device_info else None))
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
            
        except Exception as e:
            logger.error(f"Error tracking session start: {e}")
            return False
    
    def track_user_session_end(self, session_id: str, questions_attempted: int = 0, 
                              questions_correct: int = 0, credits_used: int = 0, 
                              subjects_touched: List[str] = None):
        """Track when a user ends a session"""
        try:
            conn = self._get_connection()
            if not conn:
                return False
            
            cursor = conn.cursor()
            
            # Calculate session duration
            cursor.execute("""
                UPDATE user_sessions_analytics 
                SET end_time = %s,
                    duration_seconds = EXTRACT(EPOCH FROM (%s - start_time)),
                    questions_attempted = %s,
                    questions_correct = %s,
                    credits_used = %s,
                    subjects_touched = %s
                WHERE session_id = %s
            """, (datetime.now(), datetime.now(), questions_attempted, questions_correct,
                  credits_used, subjects_touched or [], session_id))
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
            
        except Exception as e:
            logger.error(f"Error tracking session end: {e}")
            return False
    
    def track_question_attempt(self, user_id: str, subject: str, topic: str = None, 
                              difficulty: str = None, is_correct: bool = False, 
                              time_taken: int = 0, credits_used: int = 1):
        """Track individual question attempts"""
        try:
            conn = self._get_connection()
            if not conn:
                return False
            
            cursor = conn.cursor()
            
            today = date.today()
            
            # Update subject usage analytics
            cursor.execute("""
                INSERT INTO subject_usage_analytics 
                (date, subject, topic, difficulty, total_attempts, correct_attempts, 
                 total_users, avg_time_per_question, credits_consumed)
                VALUES (%s, %s, %s, %s, 1, %s, 1, %s, %s)
                ON CONFLICT (date, subject, topic, difficulty) 
                DO UPDATE SET
                    total_attempts = subject_usage_analytics.total_attempts + 1,
                    correct_attempts = subject_usage_analytics.correct_attempts + %s,
                    avg_time_per_question = (
                        (subject_usage_analytics.avg_time_per_question * subject_usage_analytics.total_attempts + %s) / 
                        (subject_usage_analytics.total_attempts + 1)
                    ),
                    credits_consumed = subject_usage_analytics.credits_consumed + %s
            """, (today, subject, topic, difficulty, 1 if is_correct else 0, time_taken, credits_used,
                  1 if is_correct else 0, time_taken, credits_used))
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
            
        except Exception as e:
            logger.error(f"Error tracking question attempt: {e}")
            return False
    
    def track_feature_usage(self, feature_name: str, user_id: str, success: bool = True, 
                           time_spent: int = 0, credits_consumed: int = 0):
        """Track feature usage"""
        try:
            conn = self._get_connection()
            if not conn:
                return False
            
            cursor = conn.cursor()
            
            today = date.today()
            
            cursor.execute("""
                INSERT INTO feature_usage_analytics 
                (date, feature_name, usage_count, unique_users, total_time_spent, 
                 credits_consumed, success_rate)
                VALUES (%s, %s, 1, 1, %s, %s, %s)
                ON CONFLICT (date, feature_name) 
                DO UPDATE SET
                    usage_count = feature_usage_analytics.usage_count + 1,
                    total_time_spent = feature_usage_analytics.total_time_spent + %s,
                    credits_consumed = feature_usage_analytics.credits_consumed + %s,
                    success_rate = (
                        (feature_usage_analytics.success_rate * feature_usage_analytics.usage_count + %s) / 
                        (feature_usage_analytics.usage_count + 1)
                    ),
                    updated_at = NOW()
            """, (today, feature_name, time_spent, credits_consumed, 100 if success else 0,
                  time_spent, credits_consumed, 100 if success else 0))
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
            
        except Exception as e:
            logger.error(f"Error tracking feature usage: {e}")
            return False
    
    def update_daily_user_activity(self, user_id: str, is_new_user: bool = False, 
                                  session_duration: int = 0, questions_attempted: int = 0, 
                                  credits_used: int = 0):
        """Update daily user activity aggregates"""
        try:
            conn = self._get_connection()
            if not conn:
                return False
            
            cursor = conn.cursor()
            
            today = date.today()
            
            cursor.execute("""
                INSERT INTO daily_user_activity 
                (date, total_active_users, new_users, returning_users, total_sessions,
                 avg_session_duration, total_questions_attempted, total_credits_used)
                VALUES (%s, 1, %s, %s, 1, %s, %s, %s)
                ON CONFLICT (date) 
                DO UPDATE SET
                    total_active_users = daily_user_activity.total_active_users + 1,
                    new_users = daily_user_activity.new_users + %s,
                    returning_users = daily_user_activity.returning_users + %s,
                    total_sessions = daily_user_activity.total_sessions + 1,
                    avg_session_duration = (
                        (daily_user_activity.avg_session_duration * daily_user_activity.total_sessions + %s) / 
                        (daily_user_activity.total_sessions + 1)
                    ),
                    total_questions_attempted = daily_user_activity.total_questions_attempted + %s,
                    total_credits_used = daily_user_activity.total_credits_used + %s,
                    updated_at = NOW()
            """, (today, 1 if is_new_user else 0, 0 if is_new_user else 1, session_duration, 
                  questions_attempted, credits_used, 1 if is_new_user else 0, 
                  0 if is_new_user else 1, session_duration, questions_attempted, credits_used))
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
            
        except Exception as e:
            logger.error(f"Error updating daily user activity: {e}")
            return False
    
    def update_user_engagement(self, user_id: str, session_time: int = 0, 
                              questions_attempted: int = 0, questions_correct: int = 0, 
                              credits_used: int = 0, subjects_engaged: List[str] = None):
        """Update user engagement metrics"""
        try:
            conn = self._get_connection()
            if not conn:
                return False
            
            cursor = conn.cursor()
            
            today = date.today()
            
            # Calculate engagement score
            accuracy = (questions_correct / questions_attempted * 100) if questions_attempted > 0 else 0
            engagement_score = min(100, (questions_attempted * 0.5) + (accuracy * 0.3) + (session_time / 60 * 0.2))
            
            # Determine retention status
            retention_status = 'active'
            if questions_attempted == 0:
                retention_status = 'at_risk'
            elif session_time < 300:  # Less than 5 minutes
                retention_status = 'at_risk'
            
            cursor.execute("""
                INSERT INTO user_engagement_metrics 
                (user_id, date, session_count, total_time_spent, questions_attempted,
                 questions_correct, credits_used, subjects_engaged, engagement_score, retention_status)
                VALUES (%s, %s, 1, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_id, date) 
                DO UPDATE SET
                    session_count = user_engagement_metrics.session_count + 1,
                    total_time_spent = user_engagement_metrics.total_time_spent + %s,
                    questions_attempted = user_engagement_metrics.questions_attempted + %s,
                    questions_correct = user_engagement_metrics.questions_correct + %s,
                    credits_used = user_engagement_metrics.credits_used + %s,
                    subjects_engaged = %s,
                    engagement_score = %s,
                    retention_status = %s,
                    updated_at = NOW()
            """, (user_id, today, session_time, questions_attempted, questions_correct, 
                  credits_used, subjects_engaged or [], engagement_score, retention_status,
                  session_time, questions_attempted, questions_correct, credits_used, 
                  subjects_engaged or [], engagement_score, retention_status))
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
            
        except Exception as e:
            logger.error(f"Error updating user engagement: {e}")
            return False
    
    def log_system_performance_metric(self, metric_name: str, metric_value: float, 
                                     metric_unit: str = None, additional_data: Dict = None):
        """Log system performance metrics"""
        try:
            conn = self._get_connection()
            if not conn:
                return False
            
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT INTO system_performance_metrics 
                (metric_name, metric_value, metric_unit, additional_data)
                VALUES (%s, %s, %s, %s)
            """, (metric_name, metric_value, metric_unit, 
                  json.dumps(additional_data) if additional_data else None))
            
            conn.commit()
            cursor.close()
            conn.close()
            return True
            
        except Exception as e:
            logger.error(f"Error logging performance metric: {e}")
            return False

# Global instance
analytics_tracker = AnalyticsTracker()
