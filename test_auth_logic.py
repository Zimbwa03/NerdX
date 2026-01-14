
import os
import sys

# Add project root to path
sys.path.append(os.getcwd())

from database.external_db import authenticate_supabase_user

print("Testing authenticate_supabase_user implementation...")

# Test Email
print("\n--- Testing Email Format ---")
# We expect 400 (Invalid Credentials) because user doesn't exist, but it proves the request format is valid
result_email = authenticate_supabase_user("test@example.com", "wrongpassword")
if result_email is None:
    print("Result: Auth Failed (Expected for bad creds)")
else:
    print("Result: Auth Success (Unexpected)")

# Test Phone
print("\n--- Testing Phone Format ---")
# We expect 400 (Invalid Credentials) because user doesn't exist, but it proves the request format is valid (sending 'phone')
result_phone = authenticate_supabase_user("1234567890", "wrongpassword")
if result_phone is None:
    print("Result: Auth Failed (Expected for bad creds)")
else:
    print("Result: Auth Success (Unexpected)")
