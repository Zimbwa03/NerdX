#!/usr/bin/env python3
"""
Credit Sync Tool for NerdX Quiz Bot
Synchronizes credits between users_registration and user_stats tables
Usage: python sync_credits_tool.py [user_id]
"""

import sys
sys.path.append('.')

from database.external_db import sync_user_credits

def main():
    """Run credit sync with optional user ID"""
    user_id = None
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
        print(f"🔄 Running credit sync for user: {user_id}")
    else:
        print("🔄 Running credit sync for ALL users...")
    
    try:
        result = sync_user_credits(user_id)
        
        print(f"\n📊 Sync Results:")
        print(f"Success: {result['success']}")
        print(f"Message: {result['message']}")
        
        if result['success'] and 'synced' in result:
            print(f"✅ Synced: {result['synced']} users")
            print(f"❌ Failed: {result['failed']} users")
        
    except Exception as e:
        print(f"❌ Error running sync: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())