"""
Command Credit Tracker - Option B Implementation
Tracks command usage with bundling: 1 credit = 2 commands
"""

import logging
from typing import Dict, Optional
from datetime import datetime, timedelta
from database.session_db import get_user_session, save_user_session

logger = logging.getLogger(__name__)

class CommandCreditTracker:
    """
    Tracks command usage for bundled credit system
    Option B: 1 credit = 2 commands
    """
    
    def __init__(self):
        self.command_actions = [
            'menu_navigation',
            'help_command',
            'check_balance',
            'settings_access',
            'registration_step'
        ]
    
    def is_command_action(self, action: str) -> bool:
        """Check if action is a simple command"""
        return action in self.command_actions
    
    def should_deduct_credit(self, user_id: str, action: str) -> Dict:
        """
        Check if credit should be deducted for command
        Returns dict with:
        - should_deduct: bool
        - commands_used: int (in current bundle)
        - commands_remaining: int (in current bundle)
        - bundle_complete: bool
        """
        try:
            if not self.is_command_action(action):
                # Not a command - deduct immediately (AI/Complex features)
                return {
                    'should_deduct': True,
                    'is_command': False,
                    'commands_used': 0,
                    'commands_remaining': 0,
                    'bundle_complete': True
                }
            
            # Get user's command tracking session
            session_key = f"command_tracker_{user_id}"
            session_data = get_user_session(session_key)
            
            if not session_data:
                # First command in new bundle
                save_user_session(session_key, {
                    'session_type': 'command_bundle',
                    'commands_used': 1,
                    'bundle_started_at': datetime.now().isoformat(),
                    'last_action': action
                })
                
                return {
                    'should_deduct': False,  # Don't deduct yet - waiting for 2nd command
                    'is_command': True,
                    'commands_used': 1,
                    'commands_remaining': 1,
                    'bundle_complete': False,
                    'message': 'Command 1 of 2 - No credit deducted yet'
                }
            
            # Check if bundle expired (24 hour window)
            bundle_started = datetime.fromisoformat(session_data.get('bundle_started_at', datetime.now().isoformat()))
            if (datetime.now() - bundle_started) > timedelta(hours=24):
                # Bundle expired - start new bundle
                save_user_session(session_key, {
                    'session_type': 'command_bundle',
                    'commands_used': 1,
                    'bundle_started_at': datetime.now().isoformat(),
                    'last_action': action
                })
                
                return {
                    'should_deduct': False,
                    'is_command': True,
                    'commands_used': 1,
                    'commands_remaining': 1,
                    'bundle_complete': False,
                    'message': 'New bundle started - Command 1 of 2'
                }
            
            # Increment command count
            commands_used = session_data.get('commands_used', 0) + 1
            
            if commands_used >= 2:
                # Bundle complete - deduct 1 credit
                # Clear the session
                from database.session_db import clear_user_session
                clear_user_session(session_key)
                
                return {
                    'should_deduct': True,
                    'is_command': True,
                    'commands_used': 2,
                    'commands_remaining': 0,
                    'bundle_complete': True,
                    'message': 'Bundle complete - Deducting 1 credit for 2 commands'
                }
            else:
                # Still in bundle - don't deduct yet
                save_user_session(session_key, {
                    'session_type': 'command_bundle',
                    'commands_used': commands_used,
                    'bundle_started_at': session_data.get('bundle_started_at'),
                    'last_action': action
                })
                
                return {
                    'should_deduct': False,
                    'is_command': True,
                    'commands_used': commands_used,
                    'commands_remaining': 2 - commands_used,
                    'bundle_complete': False,
                    'message': f'Command {commands_used} of 2 - No credit deducted yet'
                }
                
        except Exception as e:
            logger.error(f"Error in command credit tracker: {e}")
            # On error, deduct credit to be safe
            return {
                'should_deduct': True,
                'is_command': False,
                'error': str(e)
            }
    
    def get_bundle_status(self, user_id: str) -> Dict:
        """Get current command bundle status for user"""
        try:
            session_key = f"command_tracker_{user_id}"
            session_data = get_user_session(session_key)
            
            if not session_data:
                return {
                    'has_active_bundle': False,
                    'commands_used': 0,
                    'commands_remaining': 2
                }
            
            commands_used = session_data.get('commands_used', 0)
            bundle_started = datetime.fromisoformat(session_data.get('bundle_started_at', datetime.now().isoformat()))
            
            # Check if expired
            if (datetime.now() - bundle_started) > timedelta(hours=24):
                return {
                    'has_active_bundle': False,
                    'commands_used': 0,
                    'commands_remaining': 2,
                    'expired': True
                }
            
            return {
                'has_active_bundle': True,
                'commands_used': commands_used,
                'commands_remaining': 2 - commands_used,
                'bundle_started_at': bundle_started.isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting bundle status: {e}")
            return {
                'has_active_bundle': False,
                'error': str(e)
            }
    
    def reset_bundle(self, user_id: str) -> bool:
        """Reset user's command bundle (for testing/admin)"""
        try:
            session_key = f"command_tracker_{user_id}"
            from database.session_db import clear_user_session
            clear_user_session(session_key)
            return True
        except Exception as e:
            logger.error(f"Error resetting bundle: {e}")
            return False

# Global instance
command_credit_tracker = CommandCreditTracker()
