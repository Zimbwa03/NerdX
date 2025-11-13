"""
Simple API Test Script
Tests the mobile API endpoints step by step
"""
import requests
import json
import time

BASE_URL = "http://localhost:5000/api/mobile"

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_connection():
    """Test if server is running"""
    print_section("Testing Server Connection")
    try:
        response = requests.get("http://localhost:5000/", timeout=5)
        print(f"✅ Server is running! Status: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running!")
        print("   Please start the Flask server first:")
        print("   python app.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_registration():
    """Test user registration"""
    print_section("Testing Registration Endpoint")
    url = f"{BASE_URL}/auth/register"
    
    # Use timestamp to ensure unique email
    import datetime
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    test_email = f"test{timestamp}@example.com"
    
    data = {
        "name": "Test",
        "surname": "User",
        "email": test_email,
        "password": "test123456",
        "date_of_birth": "2000-01-01"
    }
    
    print(f"Registering user: {test_email}")
    try:
        response = requests.post(url, json=data, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code in [200, 201]:
            result = response.json()
            print("✅ Registration Successful!")
            print(f"Response: {json.dumps(result, indent=2)}")
            return result.get('token'), test_email
        else:
            print(f"❌ Registration Failed!")
            print(f"Response: {response.text}")
            return None, test_email
    except Exception as e:
        print(f"❌ Error: {e}")
        return None, test_email

def test_login(email, password):
    """Test user login"""
    print_section("Testing Login Endpoint")
    url = f"{BASE_URL}/auth/login"
    
    data = {
        "email": email,
        "password": password
    }
    
    print(f"Logging in as: {email}")
    try:
        response = requests.post(url, json=data, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Login Successful!")
            print(f"Response: {json.dumps(result, indent=2)}")
            return result.get('token')
        else:
            print(f"❌ Login Failed!")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_protected_endpoint(token, endpoint_name, endpoint_path):
    """Test a protected endpoint"""
    print_section(f"Testing {endpoint_name}")
    url = f"{BASE_URL}{endpoint_path}"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ {endpoint_name} Successful!")
            print(f"Response: {json.dumps(result, indent=2)}")
            return True
        else:
            print(f"❌ {endpoint_name} Failed!")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("\n" + "🚀"*30)
    print("  NerdX Mobile API Test Suite")
    print("🚀"*30)
    
    # Test 1: Check server connection
    if not test_connection():
        print("\n⚠️  Please start the Flask server first:")
        print("   python app.py")
        return
    
    # Wait a moment for server to be ready
    print("\n⏳ Waiting for server to be ready...")
    time.sleep(2)
    
    # Test 2: Registration
    token, email = test_registration()
    
    if not token:
        print("\n⚠️  Registration failed. Trying login with existing user...")
        # Try login anyway (in case user already exists)
        token = test_login("test@example.com", "test123456")
        if not token:
            print("\n❌ Both registration and login failed. Check server logs.")
            return
    else:
        # Test 3: Login
        print("\n⏳ Testing login with registered user...")
        time.sleep(1)
        login_token = test_login(email, "test123456")
        if login_token:
            token = login_token
    
    if not token:
        print("\n❌ No valid token obtained. Cannot test protected endpoints.")
        return
    
    # Test 4: Protected endpoints
    print("\n⏳ Testing protected endpoints...")
    time.sleep(1)
    
    test_protected_endpoint(token, "User Profile", "/user/profile")
    test_protected_endpoint(token, "User Stats", "/user/stats")
    test_protected_endpoint(token, "Credits Balance", "/credits/balance")
    test_protected_endpoint(token, "Credit Packages", "/credits/packages")
    test_protected_endpoint(token, "Subjects", "/quiz/subjects")
    
    print("\n" + "="*60)
    print("  ✅ Testing Complete!")
    print("="*60)
    print("\nIf all tests passed, your API is working correctly! 🎉")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()

