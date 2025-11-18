#!/usr/bin/env python3
"""
Script to check user credits and verify the user identifier
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.external_db import make_supabase_request, get_user_credits
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_user_by_email(email):
    """Check user details by email"""
    try:
        # Query users_registration table by email
        result = make_supabase_request(
            "GET", 
            "users_registration", 
            filters={"email": f"eq.{email.lower()}"},
            use_service_role=True
        )
        
        if result and len(result) > 0:
            user = result[0]
            chat_id = user.get('chat_id')
            
            print(f"\n{'='*60}")
            print(f"User Details")
            print(f"{'='*60}")
            print(f"Email: {email}")
            print(f"Chat ID: {chat_id}")
            print(f"Name: {user.get('name')} {user.get('surname')}")
            print(f"NerdX ID: {user.get('nerdx_id')}")
            print(f"Phone: {user.get('phone_number', 'N/A')}")
            print(f"Credits in DB: {user.get('credits', 0)}")
            print(f"{'='*60}\n")
            
            # Check credits using chat_id
            credits_by_chat_id = get_user_credits(chat_id)
            print(f"Credits using chat_id ({chat_id}): {credits_by_chat_id}")
            
            # Check credits using email
            credits_by_email = get_user_credits(email.lower())
            print(f"Credits using email ({email.lower()}): {credits_by_email}")
            
            return user
        else:
            print(f"User with email {email} not found")
            return None
            
    except Exception as e:
        logger.error(f"Error checking user: {e}")
        return None

if __name__ == "__main__":
    email = "neezykidngoni@gmail.com"
    check_user_by_email(email)

