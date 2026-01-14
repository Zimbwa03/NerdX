
import os
import requests
import json
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def list_users():
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        print("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
        return

    url = f"{SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=100"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            users = response.json().get('users', [])
            print(f"\nFound {len(users)} registered users in Supabase:\n")
            print(f"{'EMAIL':<40} | {'PROVIDER':<15} | {'CREATED AT':<20}")
            print("-" * 80)
            
            for user in users:
                email = user.get('email', 'No Email')
                providers = user.get('app_metadata', {}).get('providers', ['email'])
                provider_str = ", ".join(providers)
                created_at = user.get('created_at', '')[:10]  # YYYY-MM-DD
                
                print(f"{email:<40} | {provider_str:<15} | {created_at:<20}")
            print("\n")
        else:
            print(f"Error fetching users: {response.status_code} {response.text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    list_users()
