#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Focused test for answer evaluation fix
Tests correct and incorrect answer evaluation without generating new questions
"""

import requests
import json
import sys
import io
from datetime import datetime

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE_URL = "https://nerdx.onrender.com"
TEST_USER_EMAIL = "neezykidngoni@gmail.com"
TEST_USER_PASSWORD = "Ngoni2003"

session = requests.Session()
auth_token = None

def log_test(test_name: str, status: str, details: str = ""):
    """Log test results"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"[{timestamp}] {status_icon} {test_name}: {status}")
    if details:
        print(f"    {details}")

def authenticate():
    """Authenticate and get token"""
    global auth_token
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/mobile/auth/login",
            json={
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            auth_token = data.get('token') or data.get('data', {}).get('token')
            
            if auth_token:
                session.headers.update({
                    'Authorization': f'Bearer {auth_token}',
                    'Content-Type': 'application/json'
                })
                log_test("Authentication", "PASS", "Token obtained")
                return True
            else:
                log_test("Authentication", "FAIL", "No token in response")
                return False
        else:
            error_data = response.json() if response.content else {}
            error_msg = error_data.get('message', f'Status code: {response.status_code}')
            log_test("Authentication", "FAIL", f"{error_msg}")
            return False
    except Exception as e:
        log_test("Authentication", "FAIL", f"Error: {str(e)}")
        return False

def test_answer_evaluation(question_id: str, answer: str, subject: str, 
                          correct_answer: str, solution: str, question_text: str, 
                          expected_correct: bool):
    """Test answer evaluation"""
    test_name = f"Answer Evaluation ({'CORRECT' if expected_correct else 'INCORRECT'} answer: {answer})"
    
    try:
        response = session.post(
            f"{BASE_URL}/api/mobile/quiz/submit-answer",
            json={
                "question_id": question_id,
                "answer": answer,
                "subject": subject,
                "correct_answer": correct_answer,
                "solution": solution,
                "question_text": question_text
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                result = data.get('data', {})
                is_correct = result.get('correct', False)
                
                if is_correct == expected_correct:
                    log_test(test_name, "PASS", f"Correctly identified as {'correct' if is_correct else 'incorrect'}")
                    print(f"    Feedback: {result.get('feedback', '')[:80]}...")
                    print(f"    Points: {result.get('points_earned', 0)}")
                    return True
                else:
                    log_test(test_name, "FAIL", f"Expected {expected_correct}, got {is_correct}")
                    return False
            else:
                log_test(test_name, "FAIL", f"API returned success=false: {data.get('message')}")
                return False
        else:
            error_data = response.json() if response.content else {}
            error_msg = error_data.get('message', f'Status code: {response.status_code}')
            log_test(test_name, "FAIL", f"Error: {error_msg}")
            print(f"    Response: {response.text[:200]}")
            return False
            
    except Exception as e:
        log_test(test_name, "FAIL", f"Error: {str(e)}")
        return False

def main():
    print("=" * 80)
    print("ANSWER EVALUATION FIX TEST")
    print("=" * 80)
    print()
    
    if not authenticate():
        print("❌ Authentication failed. Cannot proceed.")
        return
    
    print()
    print("=" * 80)
    print("TESTING ANSWER EVALUATION")
    print("=" * 80)
    print()
    
    # Test case 1: Correct answer
    print("Test 1: Correct Answer")
    test_answer_evaluation(
        question_id="test-question-1",
        answer="7",
        subject="mathematics",
        correct_answer="7",
        solution="To solve 2x - 4 = 10, add 4 to both sides: 2x = 14, then divide by 2: x = 7",
        question_text="Solve for x: 2x - 4 = 10",
        expected_correct=True
    )
    print()
    
    # Test case 2: Correct answer with different format
    print("Test 2: Correct Answer (x = 7 format)")
    test_answer_evaluation(
        question_id="test-question-2",
        answer="x = 7",
        subject="mathematics",
        correct_answer="7",
        solution="To solve 2x - 4 = 10, add 4 to both sides: 2x = 14, then divide by 2: x = 7",
        question_text="Solve for x: 2x - 4 = 10",
        expected_correct=True
    )
    print()
    
    # Test case 3: Incorrect answer
    print("Test 3: Incorrect Answer")
    test_answer_evaluation(
        question_id="test-question-3",
        answer="5",
        subject="mathematics",
        correct_answer="7",
        solution="To solve 2x - 4 = 10, add 4 to both sides: 2x = 14, then divide by 2: x = 7",
        question_text="Solve for x: 2x - 4 = 10",
        expected_correct=False
    )
    print()
    
    # Test case 4: Another correct answer
    print("Test 4: Correct Answer (Algebra)")
    test_answer_evaluation(
        question_id="test-question-4",
        answer="5",
        subject="mathematics",
        correct_answer="5",
        solution="To solve x + 3 = 8, subtract 3 from both sides: x = 5",
        question_text="Solve for x: x + 3 = 8",
        expected_correct=True
    )
    print()
    
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print("Answer evaluation tests completed.")
    print("=" * 80)

if __name__ == "__main__":
    main()

