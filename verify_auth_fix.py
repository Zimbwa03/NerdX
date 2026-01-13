"""
Verification script for Authentication Fix
Tests if login works with uppercase email when the user is registered with lowercase email.
"""
import requests
import json
import time

BASE_URL = "http://localhost:5000/api/mobile"

def verify_fix():
    print("\n=== Verifying Authentication Fix ===")
    
    # 1. Register a test user (lowercase email)
    timestamp = int(time.time())
    email = f"test_auth_{timestamp}@example.com"
    password = "TestPassword123!"
    
    print(f"1. Registering user with email: {email}")
    register_url = f"{BASE_URL}/auth/register"
    reg_data = {
        "name": "Auth",
        "surname": "Test",
        "email": email,
        "password": password,
        "date_of_birth": "2000-01-01"
    }
    
    try:
        reg_response = requests.post(register_url, json=reg_data)
        if reg_response.status_code not in [200, 201] and response.status_code != 400: # 400 is fine if user exists
             print(f"Registration failed: {reg_response.text}")
             # Proceeding anyway as user might exist
        else:
            print("Registration successful (or user exists)")
            
    except Exception as e:
        print(f"Registration request failed: {e}")
        print("Please ensure the server is running on http://localhost:5000")
        return

    # 2. Test Login with Uppercase Email
    uppercase_email = email.upper()
    print(f"\n2. Attempting login with UPPERCASE email: {uppercase_email}")
    
    login_url = f"{BASE_URL}/auth/login"
    login_data = {
        "email": uppercase_email,
        "password": password
    }
    
    try:
        login_response = requests.post(login_url, json=login_data)
        
        print(f"Status Code: {login_response.status_code}")
        response_json = login_response.json()
        print(f"Response: {json.dumps(response_json, indent=2)}")
        
        if login_response.status_code == 200 and response_json.get('success'):
            print("\n✅ SUCCESS: Login with uppercase email worked!")
            print("The fix is verified.")
        else:
            print("\n❌ FAILURE: Login with uppercase email failed.")
            print("The fix is NOT working as expected.")
            
    except Exception as e:
        print(f"Login request failed: {e}")

if __name__ == "__main__":
    verify_fix()
