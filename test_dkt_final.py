"""
Final DKT Test - Generate token inline
"""
import requests
import jwt
import datetime

API_URL = 'https://nerdx.onrender.com/api/mobile'
JWT_SECRET = 'nerdx-mobile-secret-key-change-in-production'
JWT_ALGORITHM = 'HS256'
user_id = "test_4efe7627de41"

# Generate fresh token
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
print("DKT API FINAL TEST")
print("="*60)
print(f"Token (first 50 chars): {token[:50]}...")
print("="*60 + "\n")

# Test all 5 endpoints
tests = [
    ("Log Interaction", "POST", "/dkt/log-interaction", {
        "subject": "Mathematics",
        "topic": "Algebra",
        "skill_id": "algebra_basics",
        "question_id": "test_q_001",
        "correct": True,
        "confidence": "high",
        "time_spent": 45,
        "hints_used": 0,
        "session_id": "test_session_001"
    }),
    ("Knowledge Map", "GET", "/dkt/knowledge-map", None),
    ("Skill Mastery", "GET", "/dkt/mastery/algebra_basics", None),
    ("Recommendations", "POST", "/dkt/recommend-next", {"subject": "Mathematics"}),
    ("Interaction History", "GET", "/dkt/interaction-history", None)
]

results = []
for name, method, endpoint, data in tests:
    print(f"[TEST] {name}...")
    try:
        if method == "POST":
            response = requests.post(f'{API_URL}{endpoint}', headers=headers, json=data, timeout=10)
        else:
            response = requests.get(f'{API_URL}{endpoint}', headers=headers, timeout=10)
        
        status = response.status_code
        print(f"Status: {status}")
        print(f"Response: {response.text[:150]}")
        
        if status in [200, 201]:
            print(f"✓ PASS - {name}")
            results.append(True)
        else:
            print(f"✗ FAIL - {name} (Status {status})")
            results.append(False)
    except Exception as e:
        print(f"✗ ERROR - {name}: {e}")
        results.append(False)
    print("-"*60 + "\n")

print("="*60)
print(f"RESULTS: {sum(results)}/{len(results)} tests passed")
print("="*60)
