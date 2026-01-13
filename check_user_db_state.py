import requests
import os
import json
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

# Set env vars explicitly if needed before import
# (external_db reads os.environ at module level)
if not os.getenv("SUPABASE_URL"):
    print("WARNING: SUPABASE_URL not found in environment!")

from database.external_db import get_user_registration, SUPABASE_URL, SUPABASE_KEY

def check_user(email):
    print(f"Checking {email} in users_registration...")
    try:
        user = get_user_registration(email)
        if user:
            print(f"[FOUND] Found in users_registration: {user}")
        else:
            print(f"[NOT FOUND] NOT FOUND in users_registration")
    except Exception as e:
        print(f"[ERROR] Checking users_registration: {e}")
        
    # Check Supabase Auth (Admin check)
    print(f"Checking {email} in Supabase Auth (via Admin API)...")
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
    # This requires SERVICE_ROLE_KEY to list users
    url = f"{SUPABASE_URL}/auth/v1/admin/users"
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            users = response.json().get('users', [])
            found = next((u for u in users if u.get('email') == email), None)
            if found:
                 print(f"[FOUND] Found in Supabase Auth: ID={found.get('id')}, Provider={found.get('app_metadata', {}).get('provider')}")
            else:
                 print(f"[NOT FOUND] NOT FOUND in Supabase Auth")
        else:
            print(f"Request failed: {response.status_code} {response.text}")
    except Exception as e:
        print(f"Error checking Supabase Auth: {e}")

if __name__ == "__main__":
    check_user("zimbwatakudzwa98@gmail.com")
    check_user("neezykidngoni@gmail.com")
