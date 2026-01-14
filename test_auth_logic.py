
import os
import sys

# Add project root to path
sys.path.append(os.getcwd())

from database.external_db import authenticate_supabase_user, get_user_by_email_admin

print("Testing Supabase Authentication and Admin Lookup...")

# Test Email (Invalid Password => Should Fail Auth, but can act as test for function)
print("\n--- Testing Email Auth (Expected: None) ---")
result_email = authenticate_supabase_user("privilegemutsambiwa@gmail.com", "wrongpassword")
if result_email is None:
    print("Result: Auth Failed (Correct for wrong password)")
else:
    print("Result: Auth Success (Unexpected)")

# Test Admin Lookup
print("\n--- Testing Admin User Lookup (Expected: Found) ---")
admin_user = get_user_by_email_admin("privilegemutsambiwa@gmail.com")
if admin_user:
    print(f"Result: User Found! Provider: {admin_user.get('user', {}).get('app_metadata', {}).get('providers')}")
else:
    print("Result: User NOT Found (Failure)")
