#!/usr/bin/env python3
"""
Script to add credits to a user account
"""
import os
import sys

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.external_db import add_credits, get_user_credits

# Add 1000 credits to user neezykidngoni@gmail.com
chat_id = "neezykidngoni@gmail.com"
credits_to_add = 1000

print(f"[CREDITS] Adding {credits_to_add} credits to user {chat_id}...")

current = get_user_credits(chat_id)
print(f"[INFO] Current credits: {current}")

success = add_credits(chat_id, credits_to_add, "admin_grant", "Admin credit grant - 1000 credits")

if success:
    new_balance = get_user_credits(chat_id)
    print(f"[SUCCESS] New balance: {new_balance} credits")
else:
    print(f"[ERROR] Failed to add credits")
