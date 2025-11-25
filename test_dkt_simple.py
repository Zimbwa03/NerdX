"""
Simple DKT API Test Runner - No Emojis
"""
import requests
import json
import os

API_URL = os.getenv('API_URL', 'https://nerdx.onrender.com/api/mobile')
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdF80ZWZlNzYyN2RlNDEiLCJleHAiOjE3MzI5NDIxNDQsImlhdCI6MTczMjMzNzM0NH0.2Ow5TqVyRTZNjGdOiKHNTlQJyWqxXcXpMBVVdxrNYhE"

headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

print("\n" + "="*60)
print("DKT API TEST SUITE")
print("="*60)
print(f"API URL: {API_URL}")
print(f"Token: {TOKEN[:20]}...")
print("="*60 + "\n")

# Test 1: Log Interaction
print("[TEST 1] Logging Interaction...")
try:
    response = requests.post(
        f'{API_URL}/dkt/log-interaction',
        headers=headers,
        json={
            "subject": "Mathematics",
            "topic": "Algebra",
            "skill_id": "algebra_basics",
            "question_id": "test_q_001",
            "correct": True,
            "confidence": "high",
            "time_spent": 45,
            "hints_used": 0,
            "session_id": "test_session_001"
        },
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
    if response.status_code == 200:
        print("PASS - Log Interaction")
    else:
        print(f"FAIL - Log Interaction (Status {response.status_code})")
except Exception as e:
    print(f"ERROR - Log Interaction: {str(e)}")

print("\n" + "-"*60 + "\n")

# Test 2: Get Knowledge Map
print("[TEST 2] Getting Knowledge Map...")
try:
    response = requests.get(
        f'{API_URL}/dkt/knowledge-map',
        headers=headers,
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
    if response.status_code == 200:
        print("PASS - Knowledge Map")
    else:
        print(f"FAIL - Knowledge Map (Status {response.status_code})")
except Exception as e:
    print(f"ERROR - Knowledge Map: {str(e)}")

print("\n" + "-"*60 + "\n")

# Test 3: Get Skill Mastery
print("[TEST 3] Getting Skill Mastery...")
try:
    response = requests.get(
        f'{API_URL}/dkt/skill-mastery/algebra_basics',
        headers=headers,
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
    if response.status_code == 200:
        print("PASS - Skill Mastery")
    else:
        print(f"FAIL - Skill Mastery (Status {response.status_code})")
except Exception as e:
    print(f"ERROR - Skill Mastery: {str(e)}")

print("\n" + "-"*60 + "\n")

# Test 4: Get Recommendations
print("[TEST 4] Getting Recommendations...")
try:
    response = requests.get(
        f'{API_URL}/dkt/personalized-recommendations',
        headers=headers,
        params={'subject': 'Mathematics', 'limit': 5},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
    if response.status_code == 200:
        print("PASS - Recommendations")
    else:
        print(f"FAIL - Recommendations (Status {response.status_code})")
except Exception as e:
    print(f"ERROR - Recommendations: {str(e)}")

print("\n" + "-"*60 + "\n")

# Test 5: Get Interaction History
print("[TEST 5] Getting Interaction History...")
try:
    response = requests.get(
        f'{API_URL}/dkt/interaction-history',
        headers=headers,
        params={'limit': 10},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
    if response.status_code == 200:
        print("PASS - Interaction History")
    else:
        print(f"FAIL - Interaction History (Status {response.status_code})")
except Exception as e:
    print(f"ERROR - Interaction History: {str(e)}")

print("\n" + "="*60)
print("TEST SUITE COMPLETE")
print("="*60)
