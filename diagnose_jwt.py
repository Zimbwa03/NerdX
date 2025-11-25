"""
Diagnostic script to test JWT and endpoint accessibility
"""
import requests
import jwt
import datetime

API_URL = 'https://nerdx.onrender.com/api/mobile'
JWT_SECRET = 'nerdx-mobile-secret-key-change-in-production'
JWT_ALGORITHM = 'HS256'

print("="*60)
print("DKT DIAGNOSTIC TEST")
print("="*60)

# Test 1: Check if API is accessible (no auth)
print("\n[TEST 1] API Accessibility (No Auth)")
try:
    response = requests.get(f'{API_URL}/health', timeout=10)
    print(f"Health endpoint: {response.status_code}")
except Exception as e:
    print(f"Health endpoint error: {e}")

# Test 2: Generate token and decode it locally
print("\n[TEST 2] JWT Token Generation")
user_id = "test_4efe7627de41"
payload = {
    'user_id': user_id,
    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
    'iat': datetime.datetime.utcnow()
}
token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
print(f"Generated token: {token[:50]}...")

# Verify it locally
try:
    decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    print(f"Local verification: SUCCESS")
    print(f"User ID: {decoded['user_id']}")
    print(f"Expires: {datetime.datetime.fromtimestamp(decoded['exp'])}")
except Exception as e:
    print(f"Local verification FAILED: {e}")

# Test 3: Try DKT endpoint with new token
print("\n[TEST 3] DKT Knowledge Map Endpoint")
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}
try:
    response = requests.get(
        f'{API_URL}/dkt/knowledge-map',
        headers=headers,
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")

# Test 4: Try with different user_id format
print("\n[TEST 4] Testing with chat_id format")
payload2 = {
    'user_id': user_id,  # Same user
    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
    'iat': datetime.datetime.utcnow()
}
token2 = jwt.encode(payload2, JWT_SECRET, algorithm=JWT_ALGORITHM)
headers2 = {
    'Authorization': f'Bearer {token2}',
    'Content-Type': 'application/json'
}
try:
    response = requests.get(
        f'{API_URL}/dkt/knowledge-map',
        headers=headers2,
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "="*60)
print("DIAGNOSTIC COMPLETE")
print("="*60)
