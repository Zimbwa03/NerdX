#!/usr/bin/env python3
"""
Script to add credits to a user account by email address
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.external_db import make_supabase_request, add_credits, get_user_credits
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

def add_credits_to_user_by_email(email, amount, description="Admin credit addition"):
    """Add credits to user account by email"""
    try:
        # Find user by email
        logger.info(f"Searching for user with email: {email}")
        user = find_user_by_email(email)
        
        if not user:
            logger.error(f"User with email {email} not found")
            return False
        
        chat_id = user.get('chat_id')
        current_credits = user.get('credits', 0)
        name = user.get('name', 'Unknown')
        surname = user.get('surname', '')
        
        logger.info(f"Found user: {name} {surname} (chat_id: {chat_id})")
        logger.info(f"Current credits: {current_credits}")
        
        # Add credits using the existing function
        success = add_credits(
            user_id=chat_id,
            amount=amount,
            transaction_type="admin_addition",
            description=description
        )
        
        if success:
            # Get updated credits
            new_credits = get_user_credits(chat_id)
            logger.info(f"✅ Successfully added {amount} credits to {email}")
            logger.info(f"New credit balance: {new_credits}")
            return True
        else:
            logger.error(f"Failed to add credits to {email}")
            return False
            
    except Exception as e:
        logger.error(f"Error adding credits: {e}")
        return False

if __name__ == "__main__":
    email = "neezykidngoni@gmail.com"
    amount = 100  # Add 100 credits - you can change this amount
    
    print(f"\n{'='*60}")
    print(f"Adding Credits to User Account")
    print(f"{'='*60}")
    print(f"Email: {email}")
    print(f"Amount: {amount} credits")
    print(f"{'='*60}\n")
    
    success = add_credits_to_user_by_email(
        email=email,
        amount=amount,
        description="Admin credit addition via script"
    )
    
    if success:
        print(f"\n✅ Credits successfully added!")
    else:
        print(f"\n❌ Failed to add credits. Check the logs above for details.")
        sys.exit(1)

