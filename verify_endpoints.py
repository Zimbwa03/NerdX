import requests
import json
import sys

# Configuration
# BASE_URL = 'http://127.0.0.1:5000' # Local
BASE_URL = 'https://nerdx.onrender.com' # Production
TEST_EMAIL = 'test_essay@nerdx.com'
TEST_PASSWORD = 'password123'

def login():
    """Login to get token"""
    print(f"Logging in as {TEST_EMAIL}...")
    try:
        response = requests.post(f'{BASE_URL}/api/mobile/auth/login', json={
            'email': TEST_EMAIL,
            'password': TEST_PASSWORD
        })
        if response.status_code == 200:
            print("Login successful")
            return response.json().get('token')
        else:
            # Try registering if login fails
            print("Login failed, trying registration with new user...")
            import random
            random_email = f"test_essay_{random.randint(1000, 9999)}@nerdx.com"
            reg_response = requests.post(f'{BASE_URL}/api/mobile/auth/register', json={
                'name': 'Test',
                'surname': 'User',
                'email': random_email,
                'password': TEST_PASSWORD,
                'phone_number': f'077{random.randint(1000000, 9999999)}'
            })
            if reg_response.status_code == 201:
                print(f"Registration successful with {random_email}")
                return reg_response.json().get('token')
            else:
                print(f"Registration failed: {reg_response.text}")
                return None
    except Exception as e:
        print(f"Connection error: {e}")
        return None

def test_essay_endpoints(token):
    """Test essay endpoints"""
    headers = {'Authorization': f'Bearer {token}'}
    
    print("\n--- Testing Essay Endpoints ---")
    
    # 1. Get Free Response Topics
    print("1. Getting Free Response Topics...")
    try:
        response = requests.get(f'{BASE_URL}/api/mobile/english/essay/free-response-topics', headers=headers)
        if response.status_code == 200:
            topics = response.json().get('data', [])
            print(f"[SUCCESS] Success! Got {len(topics)} topics")
            if topics:
                print(f"Sample topic: {topics[0]['title']}")
        else:
            print(f"[FAILED] Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"[ERROR] Error: {e}")

    # 2. Get Guided Composition
    print("\n2. Getting Guided Composition...")
    try:
        response = requests.get(f'{BASE_URL}/api/mobile/english/essay/guided-composition', headers=headers)
        if response.status_code == 200:
            prompt = response.json().get('data', {})
            print(f"[SUCCESS] Success! Got prompt: {prompt.get('title')}")
        else:
            print(f"[FAILED] Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"[ERROR] Error: {e}")

def test_quiz_generation(token):
    """Test quiz generation for all subjects"""
    headers = {'Authorization': f'Bearer {token}'}
    
    print("\n--- Testing Quiz Generation ---")
    
    subjects = [
        {'subject': 'mathematics', 'topic': 'Algebra'},
        {'subject': 'english', 'topic': 'Grammar'},
        {'subject': 'combined_science', 'topic': 'Cell Structure', 'parent_subject': 'Biology'}
    ]
    
    for subj in subjects:
        print(f"\nTesting {subj['subject']}...")
        try:
            payload = {
                'subject': subj['subject'],
                'topic': subj['topic'],
                'difficulty': 'medium',
                'type': 'topical'
            }
            if 'parent_subject' in subj:
                payload['parent_subject'] = subj['parent_subject']
                
            response = requests.post(f'{BASE_URL}/api/mobile/quiz/generate', json=payload, headers=headers)
            
            if response.status_code == 200:
                question = response.json().get('data', {})
                print(f"[SUCCESS] Success! Generated question ID: {question.get('id')}")
                print(f"Question text: {question.get('question_text')[:50]}...")
            else:
                print(f"[FAILED] Failed: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"[ERROR] Error: {e}")

if __name__ == "__main__":
    token = login()
    if token:
        test_essay_endpoints(token)
        test_quiz_generation(token)
    else:
        print("Cannot proceed without token")
