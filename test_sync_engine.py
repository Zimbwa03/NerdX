"""
Verification script for Phase 2: Offline-First Sync
Tests the backend sync endpoints
"""
import requests
import json
import datetime
import jwt

API_URL = 'https://nerdx.onrender.com/api/mobile'
JWT_SECRET = 'nerdx-mobile-secret-key-change-in-production'
JWT_ALGORITHM = 'HS256'
user_id = "test_4efe7627de41"

# Generate token
payload = {
    'user_id': user_id,
    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
    'iat': datetime.datetime.utcnow()
}
token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

print("="*60)
print("PHASE 2: SYNC ENGINE VERIFICATION")
print("="*60)

# Test 1: Pull Changes
print("\n[TEST 1] Pull Changes (GET /sync/pull)")
try:
    response = requests.get(
        f'{API_URL}/sync/pull',
        headers=headers,
        params={'last_pulled_at': 0, 'schema_version': 1},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
    if response.status_code == 200:
        print("PASS - Pull Changes")
    else:
        print("FAIL - Pull Changes")
except Exception as e:
    print(f"ERROR: {e}")

# Test 2: Push Changes
print("\n[TEST 2] Push Changes (POST /sync/push)")
push_data = {
    "last_pulled_at": 1600000000,
    "changes": {
        "interactions": {
            "created": [
                {
                    "skill_id": "math_algebra_basic",
                    "question_id": "offline_q_001",
                    "correct": True,
                    "confidence": "high",
                    "time_spent": 30,
                    "hints_used": 0,
                    "session_id": "offline_session_1",
                    "subject": "mathematics"
                }
            ],
            "updated": [],
            "deleted": []
        }
    }
}

try:
    response = requests.post(
        f'{API_URL}/sync/push',
        headers=headers,
        json=push_data,
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
    if response.status_code == 200:
        print("PASS - Push Changes")
    else:
        print("FAIL - Push Changes")
except Exception as e:
    print(f"ERROR: {e}")

print("\n" + "="*60)
print("VERIFICATION COMPLETE")
print("="*60)
