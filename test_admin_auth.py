
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print(f"SUPABASE_URL: {SUPABASE_URL}")
print(f"SUPABASE_SERVICE_ROLE_KEY present: {bool(SUPABASE_SERVICE_ROLE_KEY)}")

def check_admin_users():
    # Try to list users (limited)
    url = f"{SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=10"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    print(f"Testing Admin URL: {url}")
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            users = response.json().get('users', [])
            print(f"Retrieved {len(users)} users.")
            if users:
                print(f"Sample user email: {users[0].get('email')}")
                print(f"Sample user providers: {users[0].get('app_metadata', {}).get('providers')}")
        else:
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    check_admin_users()
