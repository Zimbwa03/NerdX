
import os
import requests
import json
import uuid
from dotenv import load_dotenv

load_dotenv()

# Simulate the registration function logic locally since we can't easily hit the running API from here without ensuring it's reloaded.
# Actually, calling the function directly from the script (importing it) is better for unit testing logic.

from database.external_db import register_supabase_auth_user

def test_registration_logic():
    print("Testing Registration Logic...")
    
    # Generate random email to avoid collision
    random_id = str(uuid.uuid4())[:8]
    test_email = f"test_{random_id}@example.com"
    test_password = "TestPassword123!"
    metadata = {"name": "Test", "surname": "User"}
    
    print(f"Attempting to register: {test_email}")
    
    result = register_supabase_auth_user(test_email, test_password, metadata)
    
    if result:
        print("✅ Registration Success! User created in Supabase Auth.")
        print(f"User ID: {result.get('id') or result.get('user', {}).get('id')}")
        # Note: If Supabase requires email verification, we won't get a session, but the user is created.
    else:
        print("❌ Registration Failed.")
        
    print("\nAttempting Duplicate Registration (Should Fail)...")
    result_dup = register_supabase_auth_user(test_email, test_password, metadata)
    if result_dup is None:
         print("✅ Duplicate Registration Failed as expected.")
    else:
         print("❌ Duplicate Registration unexpectedly succeeded (or API allows it?).")

if __name__ == "__main__":
    test_registration_logic()
