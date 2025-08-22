import time
import logging
from typing import Dict, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self):
        self.session_limits = {}
        self.active_generations = {}
        self.active_sessions = {}  # Track active generation sessions
        self.session_cooldown = 30  # 30 seconds
        
    def check_rate_limit(self, user_id: str, action: str) -> bool:
        """Check if user is rate limited for specific action"""
        try:
            session_key = f"{user_id}_{action}"
            current_time = time.time()
            
            if session_key in self.session_limits:
                last_request = self.session_limits[session_key]
                if current_time - last_request < self.session_cooldown:
                    return False  # Rate limited
            
            self.session_limits[session_key] = current_time
            return True  # Not rate limited
            
        except Exception as e:
            logger.error(f"Error checking rate limit: {e}")
            return True  # Allow on error
    
    def check_session_rate_limit(self, chat_id: str, action: str) -> bool:
        """Check if user is rate limited for specific action - legacy compatibility"""
        return not self.check_rate_limit(chat_id, action)
            
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