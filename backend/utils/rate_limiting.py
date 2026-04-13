import time
import logging
from typing import Dict, Optional
from config import Config

logger = logging.getLogger(__name__)

class RateLimiter:
    """Rate limiting utility to prevent abuse and loops"""
    
    def __init__(self):
        self.session_rate_limits = {}
        self.active_generations = {}
        self.cooldown_period = Config.SESSION_COOLDOWN
    
    def check_rate_limit(self, user_id: str, action: str) -> bool:
        """Check if user is rate limited for specific action"""
        session_key = f"{user_id}_{action}"
        current_time = time.time()
        
        if session_key in self.session_rate_limits:
            last_request = self.session_rate_limits[session_key]
            if current_time - last_request < self.cooldown_period:
                return True  # Rate limited
        
        self.session_rate_limits[session_key] = current_time
        return False  # Not rate limited
    
    def check_active_generation(self, user_id: str, generation_type: str) -> bool:
        """Check if user already has an active generation process"""
        generation_key = f"{user_id}_{generation_type}"
        current_time = time.time()
        
        # Clean up old entries (older than 2 minutes)
        self._cleanup_old_generations(current_time)
        
        # Check if generation is already in progress
        if generation_key in self.active_generations:
            return True  # Generation already active
        
        # Mark as active
        self.active_generations[generation_key] = current_time
        return False  # Not active, now marked as active
    
    def clear_active_generation(self, user_id: str, generation_type: str):
        """Clear active generation status"""
        generation_key = f"{user_id}_{generation_type}"
        if generation_key in self.active_generations:
            del self.active_generations[generation_key]
    
    def _cleanup_old_generations(self, current_time: float):
        """Clean up old generation entries"""
        timeout = 120  # 2 minutes timeout
        to_remove = []
        
        for key, timestamp in self.active_generations.items():
            if current_time - timestamp > timeout:
                to_remove.append(key)
        
        for key in to_remove:
            del self.active_generations[key]
    
    def get_remaining_cooldown(self, user_id: str, action: str) -> int:
        """Get remaining cooldown time in seconds"""
        session_key = f"{user_id}_{action}"
        current_time = time.time()
        
        if session_key in self.session_rate_limits:
            last_request = self.session_rate_limits[session_key]
            remaining = self.cooldown_period - (current_time - last_request)
            return max(0, int(remaining))
        
        return 0
    
    def reset_rate_limit(self, user_id: str, action: str):
        """Reset rate limit for specific user action"""
        session_key = f"{user_id}_{action}"
        if session_key in self.session_rate_limits:
            del self.session_rate_limits[session_key]
    
    def cleanup_expired_limits(self):
        """Clean up expired rate limit entries"""
        current_time = time.time()
        expired_keys = []
        
        for key, timestamp in self.session_rate_limits.items():
            if current_time - timestamp > self.cooldown_period * 2:  # Double cooldown for cleanup
                expired_keys.append(key)
        
        for key in expired_keys:
            del self.session_rate_limits[key]
        
        logger.info(f"Cleaned up {len(expired_keys)} expired rate limit entries")

# Global rate limiter instance
rate_limiter = RateLimiter()
