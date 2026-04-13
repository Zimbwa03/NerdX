import time
import logging
from typing import Dict, Optional
from datetime import datetime
from config import Config

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self):
        self.session_limits = {}
        self.active_generations = {}
        self.active_sessions = {}  # Track active generation sessions
        
    def check_rate_limit(self, user_id: str, action: str) -> bool:
        """Check if user is rate limited for specific action"""
        try:
            session_key = f"{user_id}_{action}"
            current_time = time.time()
            
            # Get appropriate cooldown for the action type (adjusted for user session)
            cooldown = self.get_adjusted_cooldown(user_id, action)
            
            if session_key in self.session_limits:
                last_request = self.session_limits[session_key]
                if current_time - last_request < cooldown:
                    return False  # Rate limited
                
            self.session_limits[session_key] = current_time
            return True  # Not rate limited
            
        except Exception as e:
            logger.error(f"Error checking rate limit: {e}")
            return True  # Allow on error
    
    def check_session_rate_limit(self, chat_id: str, action: str) -> bool:
        """Check if user is rate limited for specific action - returns True when rate limited"""
        session_key = f"{chat_id}_{action}"
        current_time = time.time()
        
        # Get appropriate cooldown for the action type (adjusted for user session)
        cooldown = self.get_adjusted_cooldown(chat_id, action)
        
        if session_key in self.session_limits:
            last_request = self.session_limits[session_key]
            if current_time - last_request < cooldown:
                return True  # Rate limited
                
        self.session_limits[session_key] = current_time
        return False  # Not rate limited
    
    def _get_cooldown_for_action(self, action: str) -> int:
        """Get the appropriate cooldown period for different action types"""
        # Default cooldown
        default_cooldown = 5
        
        # Check if we have specific rate limits configured
        if hasattr(Config, 'RATE_LIMITS'):
            rate_limits = Config.RATE_LIMITS
            
            # Map actions to specific rate limits
            if 'text' in action.lower() or 'message' in action.lower():
                return rate_limits.get('text_message', 3)
            elif 'image' in action.lower():
                return rate_limits.get('image_message', 10)
            elif 'quiz' in action.lower() or 'question' in action.lower():
                return rate_limits.get('quiz_action', 5)
            elif 'ai' in action.lower() or 'generation' in action.lower():
                return rate_limits.get('ai_generation', 15)
            elif 'menu' in action.lower() or 'navigation' in action.lower():
                return rate_limits.get('menu_navigation', 1)
            else:
                # For other actions, use the default session cooldown
                return getattr(Config, 'SESSION_COOLDOWN', default_cooldown)
        
        # Fallback to default if no specific configuration
        return getattr(Config, 'SESSION_COOLDOWN', default_cooldown)
    
    def is_user_in_active_session(self, user_id: str) -> bool:
        """Check if user is in an active session (reduces rate limiting)"""
        try:
            # Check if user has any recent activity
            current_time = time.time()
            user_actions = [key for key in self.session_limits.keys() if key.startswith(f"{user_id}_")]
            
            if not user_actions:
                return False
            
            # If user has recent activity (within last 5 minutes), consider them active
            for key in user_actions:
                timestamp = self.session_limits[key]
                if current_time - timestamp < 300:  # 5 minutes
                    return True
            
            return False
        except Exception as e:
            logger.error(f"Error checking user session status: {e}")
            return False
    
    def get_adjusted_cooldown(self, user_id: str, action: str) -> int:
        """Get cooldown adjusted for user session status"""
        base_cooldown = self._get_cooldown_for_action(action)
        
        # Reduce cooldown for users in active sessions
        if self.is_user_in_active_session(user_id):
            # Reduce cooldown by 50% for active users, minimum 1 second
            adjusted_cooldown = max(1, int(base_cooldown * 0.5))
            return adjusted_cooldown
        
        return base_cooldown
    
    def get_remaining_cooldown(self, user_id: str, action: str) -> int:
        """Get remaining cooldown time in seconds"""
        session_key = f"{user_id}_{action}"
        current_time = time.time()
        
        if session_key in self.session_limits:
            last_request = self.session_limits[session_key]
            cooldown = self.get_adjusted_cooldown(user_id, action)
            remaining = cooldown - (current_time - last_request)
            return max(0, int(remaining))
        
        return 0
    
    def check_active_generation(self, user_id: str, generation_type: str) -> bool:
        """Check if user already has an active generation process"""
        try:
            generation_key = f"{user_id}_{generation_type}"
            current_time = time.time()
            
            # Clean up old entries (older than 2 minutes)
            to_remove = []
            for key, timestamp in self.active_generations.items():
                if current_time - timestamp > 120:  # 2 minutes timeout
                    to_remove.append(key)
            
            for key in to_remove:
                del self.active_generations[key]
            
            # Check if generation is already in progress
            if generation_key in self.active_generations:
                return True  # Generation already active
            
            # Mark as active
            self.active_generations[generation_key] = current_time
            return False  # Not active, now marked as active
            
        except Exception as e:
            logger.error(f"Error checking active generation: {e}")
            return False
    
    def check_active_session(self, user_id: str, session_type: str) -> bool:
        """Check if user has an active session to prevent duplicates"""
        try:
            session_key = f"{session_type}_{user_id}"
            if session_key in self.active_sessions:
                session_data = self.active_sessions[session_key]
                timestamp = session_data.get("timestamp", 0)
                current_time = datetime.now().timestamp()
                
                # Check if session is still valid (within timeout)
                if current_time - timestamp < 300:  # 5 minutes timeout
                    return True  # Session already active
                else:
                    # Clean up expired session
                    del self.active_sessions[session_key]
            
            return False  # No active session
            
        except Exception as e:
            logger.error(f"Error checking active session: {e}")
            return False
    
    def set_active_session(self, user_id: str, session_type: str, data: Optional[Dict] = None):
        """Mark session as active"""
        try:
            session_key = f"{session_type}_{user_id}"
            self.active_sessions[session_key] = {
                "timestamp": datetime.now().timestamp(),
                "type": session_type,
                "data": data or {}
            }
            logger.info(f"Set active session: {session_key}")
        except Exception as e:
            logger.error(f"Error setting active session: {e}")
    
    def clear_active_session(self, user_id: str, session_type: str):
        """Clear active session"""
        try:
            session_key = f"{session_type}_{user_id}"
            if session_key in self.active_sessions:
                del self.active_sessions[session_key]
                logger.info(f"Cleared active session: {session_key}")
        except Exception as e:
            logger.error(f"Error clearing active session: {e}")
            
    def clear_active_generation(self, user_id: str, generation_type: str):
        """Clear active generation status"""
        try:
            generation_key = f"{user_id}_{generation_type}"
            if generation_key in self.active_generations:
                del self.active_generations[generation_key]
                logger.info(f"Cleared active generation: {generation_key}")
        except Exception as e:
            logger.error(f"Error clearing active generation: {e}")
    
    def reset_rate_limit(self, user_id: str, action: str):
        """Reset rate limit for specific user action"""
        try:
            session_key = f"{user_id}_{action}"
            if session_key in self.session_limits:
                del self.session_limits[session_key]
                logger.info(f"Reset rate limit for user {user_id}, action {action}")
        except Exception as e:
            logger.error(f"Error resetting rate limit: {e}")
    
    def reset_all_user_limits(self, user_id: str):
        """Reset all rate limits for a specific user"""
        try:
            keys_to_remove = [key for key in self.session_limits.keys() if key.startswith(f"{user_id}_")]
            for key in keys_to_remove:
                del self.session_limits[key]
            logger.info(f"Reset all rate limits for user {user_id} ({len(keys_to_remove)} actions)")
        except Exception as e:
            logger.error(f"Error resetting all user limits: {e}")
    
    def get_user_rate_limit_status(self, user_id: str) -> Dict[str, int]:
        """Get current rate limit status for a user across all actions"""
        try:
            current_time = time.time()
            user_status = {}
            
            for key, timestamp in self.session_limits.items():
                if key.startswith(f"{user_id}_"):
                    action = key.replace(f"{user_id}_", "", 1)
                    cooldown = self._get_cooldown_for_action(action)
                    remaining = cooldown - (current_time - timestamp)
                    if remaining > 0:
                        user_status[action] = remaining
            
            return user_status
        except Exception as e:
            logger.error(f"Error getting user rate limit status: {e}")
            return {}