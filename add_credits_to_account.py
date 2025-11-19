#!/usr/bin/env python3
"""
Add 500 credits to user account by email
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.external_db import add_credits, get_user_credits, make_supabase_request
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def find_user_by_email(email):
    """Find user by email address"""
    try:
        # Query users_registration table by email
        result = make_supabase_request(
            "GET", 
            "users_registration", 
            filters={"email": f"eq.{email.lower()}"},
            use_service_role=True
        )
        
        if result and len(result) > 0:
            return result[0]
        return None
    except Exception as e:
        logger.error(f"Error finding user by email: {e}")
        return None

def add_credits_to_user(email: str, amount: int = 500):
    """Add credits to user account by email"""
    try:
        # Find user by email
        logger.info(f"Searching for user with email: {email}")
        user = find_user_by_email(email)
        
        if not user:
            logger.error(f"User with email {email} not found")
            # Try using email as chat_id (for mobile users)
            logger.info(f"Trying email as chat_id...")
            user = make_supabase_request(
                "GET",
                "users_registration",
                filters={"chat_id": f"eq.{email.lower()}"},
                use_service_role=True
            )
            if user and len(user) > 0:
                user = user[0]
            else:
                return False
        
        chat_id = user.get('chat_id') or email
        current_credits = user.get('credits', 0) or get_user_credits(chat_id) or 0
        name = user.get('name', 'Unknown')
        surname = user.get('surname', '')
        
        logger.info(f"Found user: {name} {surname} (ID: {chat_id})")
        logger.info(f"Current credits: {current_credits}")
        
        # Add credits
        success = add_credits(
            user_id=chat_id,
            amount=amount,
            transaction_type="admin_addition",
            description=f"Added {amount} credits for testing AI features"
        )
        
        if success:
            # Get updated credits
            new_credits = get_user_credits(chat_id) or 0
            logger.info(f"✅ Successfully added {amount} credits to {email}")
            logger.info(f"Previous balance: {current_credits}")
            logger.info(f"New balance: {new_credits}")
            print(f"\n✅ SUCCESS: Added {amount} credits to {email}")
            print(f"   Previous: {current_credits} credits")
            print(f"   New: {new_credits} credits")
            return True
        else:
            logger.error(f"Failed to add credits to {email}")
            print(f"\n❌ FAILED: Could not add credits to {email}")
            return False
            
    except Exception as e:
        logger.error(f"Error adding credits: {e}", exc_info=True)
        print(f"\n❌ ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    email = "neezykidngoni@gmail.com"
    amount = 500
    
    print("=" * 80)
    print("ADDING CREDITS TO USER ACCOUNT")
    print("=" * 80)
    print(f"Email: {email}")
    print(f"Amount: {amount} credits")
    print("=" * 80)
    print()
    
    success = add_credits_to_user(email, amount)
    
    if success:
        print("\n✅ Credits added successfully!")
    else:
        print("\n❌ Failed to add credits. Check logs for details.")

