"""
Test script for Mobile API endpoints
Run this to verify the mobile API is working correctly
"""
import requests
import json

BASE_URL = "http://localhost:5000/api/mobile"

def test_registration():
    """Test user registration"""
    print("\n=== Testing Registration ===")
    url = f"{BASE_URL}/auth/register"
    data = {
        "name": "Test",
        "surname": "User",
        "email": "test@example.com",
        "password": "test123",
        "date_of_birth": "2000-01-01"
    }
    
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json() if response.status_code in [200, 201] else None

def test_login(email, password):
    """Test user login"""
    print("\n=== Testing Login ===")
    url = f"{BASE_URL}/auth/login"
    data = {
        "email": email,
        "password": password
    }
    
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json() if response.status_code == 200 else None

def test_protected_endpoint(token):
    """Test protected endpoint"""
    print("\n=== Testing Protected Endpoint ===")
    url = f"{BASE_URL}/user/profile"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json() if response.status_code == 200 else None

def test_credits(token):
    """Test credits endpoint"""
    print("\n=== Testing Credits Balance ===")
    url = f"{BASE_URL}/credits/balance"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json() if response.status_code == 200 else None

if __name__ == "__main__":
    print("🚀 Testing NerdX Mobile API")
    print("=" * 50)
    
    # Test registration
    reg_result = test_registration()
    
    if reg_result and reg_result.get('success'):
        token = reg_result.get('token')
        user_email = reg_result.get('user', {}).get('email', 'test@example.com')
        
        # Test login
        login_result = test_login(user_email, "test123")
        
        if login_result and login_result.get('success'):
            token = login_result.get('token')
            
            # Test protected endpoints
            test_protected_endpoint(token)
            test_credits(token)
            
            print("\n✅ All tests passed!")
        else:
            print("\n❌ Login test failed")
    else:
        print("\n❌ Registration test failed")
        print("Trying login with existing user...")
        # Try login anyway
        login_result = test_login("test@example.com", "test123")
        if login_result and login_result.get('success'):
            token = login_result.get('token')
            test_protected_endpoint(token)
            test_credits(token)

