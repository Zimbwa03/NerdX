"""
Message Throttle Service to prevent rapid message sending and message chains
"""
import time
import logging
from typing import Dict
from collections import defaultdict

logger = logging.getLogger(__name__)

class MessageThrottle:
    """Service to throttle outgoing messages and prevent message chains"""
    
    def __init__(self):
        # Track last message sent time per user
        self.last_message_time: Dict[str, float] = defaultdict(float)
        
        # Minimum delay between messages (in seconds)
        self.min_delay_between_messages = 0.3  # 300ms minimum - reduced for better UX
        
        # Maximum messages per minute
        self.max_messages_per_minute = 20
        
        # Track message count in sliding window
        self.message_history: Dict[str, list] = defaultdict(list)
        
        # Lock to prevent concurrent message sends per user
        self.user_locks: Dict[str, bool] = defaultdict(bool)
        
    def can_send_message(self, user_id: str) -> bool:
        """Check if we can send a message to this user"""
        current_time = time.time()
        
        # Check if user is locked (message in progress)
        if self.user_locks[user_id]:
            logger.warning(f"Message blocked for {user_id} - concurrent send detected")
            return False
        
        # Check minimum delay between messages
        time_since_last = current_time - self.last_message_time[user_id]
        if time_since_last < self.min_delay_between_messages:
            logger.warning(f"Message blocked for {user_id} - too rapid (only {time_since_last:.2f}s since last)")
            return False
        
        # Check rate limit (messages per minute)
        self._clean_message_history(user_id)
        if len(self.message_history[user_id]) >= self.max_messages_per_minute:
            logger.warning(f"Message blocked for {user_id} - rate limit exceeded")
            return False
        
        return True
    
    def record_message_sent(self, user_id: str):
        """Record that a message was sent"""
        current_time = time.time()
        self.last_message_time[user_id] = current_time
        self.message_history[user_id].append(current_time)
        
    def _clean_message_history(self, user_id: str):
        """Remove old entries from message history"""
        current_time = time.time()
        cutoff_time = current_time - 60  # 1 minute window
        
        self.message_history[user_id] = [
            timestamp for timestamp in self.message_history[user_id]
            if timestamp > cutoff_time
        ]
    
    def acquire_lock(self, user_id: str) -> bool:
        """Acquire a lock for sending message to user"""
        if self.user_locks[user_id]:
            return False
        self.user_locks[user_id] = True
        return True
    
    def release_lock(self, user_id: str):
        """Release the lock after message is sent"""
        self.user_locks[user_id] = False
    
    def throttle_delay(self, user_id: str) -> float:
        """Get recommended delay before sending next message"""
        time_since_last = time.time() - self.last_message_time[user_id]
        if time_since_last < self.min_delay_between_messages:
            return self.min_delay_between_messages - time_since_last
        return 0

# Global instance
message_throttle = MessageThrottle()
