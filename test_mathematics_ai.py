#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Automated Test Script for Mathematics AI Features
Tests all AI-powered mathematics features in the mobile application
"""

import requests
import json
import time
import sys
import io
from typing import Dict, Optional, List
from datetime import datetime

# Fix Windows console encoding for Unicode characters
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Configuration
BASE_URL = "https://nerdx.onrender.com"  # Update with your backend URL
# BASE_URL = "http://localhost:5000"  # For local testing

# Test user credentials (update with valid test user)
TEST_USER_EMAIL = "neezykidngoni@gmail.com"
TEST_USER_PASSWORD = "Ngoni2003"

# Global session
session = requests.Session()
auth_token = None
user_id = None


def log_test(test_name: str, status: str, details: str = ""):
    """Log test results"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"[{timestamp}] {status_icon} {test_name}: {status}")
    if details:
        print(f"    {details}")


def authenticate():
    """Authenticate and get token"""
    global auth_token, user_id
    
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
            # API returns token directly, not in data.token
            auth_token = data.get('token') or data.get('data', {}).get('token')
            user_data = data.get('user') or data.get('data', {}).get('user', {})
            user_id = user_data.get('id') if user_data else None
            
            if auth_token:
                session.headers.update({
                    'Authorization': f'Bearer {auth_token}',
                    'Content-Type': 'application/json'
                })
                log_test("Authentication", "PASS", f"Token obtained for user {user_id}")
                return True
            else:
                log_test("Authentication", "FAIL", f"No token in response. Response: {data}")
                return False
        else:
            error_data = response.json() if response.content else {}
            error_msg = error_data.get('message', f'Status code: {response.status_code}')
            log_test("Authentication", "FAIL", f"{error_msg}")
            return False
    except Exception as e:
        log_test("Authentication", "FAIL", f"Error: {str(e)}")
        return False


def test_quiz_question_generation(subject: str = "mathematics", topic: str = "algebra", 
                                   difficulty: str = "medium", question_type: str = "topical") -> Optional[Dict]:
    """Test AI-powered quiz question generation"""
    test_name = f"Quiz Question Generation ({question_type}, {topic}, {difficulty})"
    
    try:
        start_time = time.time()
        response = session.post(
            f"{BASE_URL}/api/mobile/quiz/generate",
            json={
                "subject": subject,
                "topic": topic,
                "difficulty": difficulty,
                "type": question_type
            }
        )
        elapsed_time = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                question = data.get('data', {})
                
                # Validate question structure
                required_fields = ['question_text', 'correct_answer', 'solution']
                missing_fields = [f for f in required_fields if not question.get(f)]
                
                if missing_fields:
                    log_test(test_name, "FAIL", f"Missing fields: {missing_fields}")
                    return None
                
                # Check response time
                if elapsed_time > 30:
                    log_test(test_name, "WARN", f"Slow response: {elapsed_time:.2f}s")
                else:
                    log_test(test_name, "PASS", f"Response time: {elapsed_time:.2f}s")
                
                # Log question details
                print(f"    Question: {question.get('question_text', '')[:100]}...")
                print(f"    Answer: {question.get('correct_answer', '')}")
                print(f"    Allows text input: {question.get('allows_text_input', False)}")
                print(f"    Allows image upload: {question.get('allows_image_upload', False)}")
                
                return question
            else:
                log_test(test_name, "FAIL", f"API returned success=false: {data.get('message')}")
                return None
        elif response.status_code == 400:
            error_msg = response.json().get('message', 'Unknown error')
            if 'credits' in error_msg.lower():
                log_test(test_name, "SKIP", f"Insufficient credits: {error_msg}")
            else:
                log_test(test_name, "FAIL", f"Bad request: {error_msg}")
            return None
        else:
            log_test(test_name, "FAIL", f"Status code: {response.status_code}")
            return None
            
    except Exception as e:
        log_test(test_name, "FAIL", f"Error: {str(e)}")
        return None


def test_answer_evaluation(question_id: str, answer: str, subject: str, 
                          correct_answer: str, solution: str, question_text: str) -> bool:
    """Test AI-powered answer evaluation"""
    test_name = f"Answer Evaluation (answer: {answer})"
    
    try:
        start_time = time.time()
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
        elapsed_time = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                result = data.get('data', {})
                
                # Validate result structure
                if 'correct' not in result:
                    log_test(test_name, "FAIL", "Missing 'correct' field in response")
                    return False
                
                # Check response time
                if elapsed_time > 10:
                    log_test(test_name, "WARN", f"Slow response: {elapsed_time:.2f}s")
                else:
                    log_test(test_name, "PASS", f"Response time: {elapsed_time:.2f}s")
                
                # Log evaluation details
                is_correct = result.get('correct', False)
                print(f"    Correct: {is_correct}")
                print(f"    Feedback: {result.get('feedback', '')[:100]}...")
                print(f"    Points earned: {result.get('points_earned', 0)}")
                
                if result.get('what_went_right'):
                    print(f"    What went right: {result.get('what_went_right')[:100]}...")
                if result.get('what_went_wrong'):
                    print(f"    What went wrong: {result.get('what_went_wrong')[:100]}...")
                
                return True
            else:
                log_test(test_name, "FAIL", f"API returned success=false: {data.get('message')}")
                return False
        else:
            log_test(test_name, "FAIL", f"Status code: {response.status_code}")
            return False
            
    except Exception as e:
        log_test(test_name, "FAIL", f"Error: {str(e)}")
        return False


def test_graph_generation(graph_type: str = "linear") -> Optional[Dict]:
    """Test AI-powered graph generation"""
    test_name = f"Graph Generation ({graph_type})"
    
    try:
        start_time = time.time()
        response = session.post(
            f"{BASE_URL}/api/mobile/math/graph/generate",
            json={
                "graph_type": graph_type
            }
        )
        elapsed_time = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                graph_data = data.get('data', {})
                
                # Validate graph data structure
                required_fields = ['graph_url', 'equation', 'question', 'solution']
                missing_fields = [f for f in required_fields if not graph_data.get(f)]
                
                if missing_fields:
                    log_test(test_name, "FAIL", f"Missing fields: {missing_fields}")
                    return None
                
                # Check response time
                if elapsed_time > 20:
                    log_test(test_name, "WARN", f"Slow response: {elapsed_time:.2f}s")
                else:
                    log_test(test_name, "PASS", f"Response time: {elapsed_time:.2f}s")
                
                # Log graph details
                print(f"    Equation: {graph_data.get('equation', '')}")
                print(f"    Graph URL: {graph_data.get('graph_url', '')[:80]}...")
                print(f"    Question: {graph_data.get('question', '')[:100]}...")
                
                return graph_data
            else:
                log_test(test_name, "FAIL", f"API returned success=false: {data.get('message')}")
                return None
        elif response.status_code == 400:
            error_msg = response.json().get('message', 'Unknown error')
            if 'credits' in error_msg.lower():
                log_test(test_name, "SKIP", f"Insufficient credits: {error_msg}")
            else:
                log_test(test_name, "FAIL", f"Bad request: {error_msg}")
            return None
        else:
            log_test(test_name, "FAIL", f"Status code: {response.status_code}")
            return None
            
    except Exception as e:
        log_test(test_name, "FAIL", f"Error: {str(e)}")
        return None


def run_comprehensive_tests():
    """Run all mathematics AI feature tests"""
    print("=" * 80)
    print("MATHEMATICS AI FEATURES - COMPREHENSIVE TEST SUITE")
    print("=" * 80)
    print()
    
    # Authenticate
    if not authenticate():
        print("❌ Authentication failed. Cannot proceed with tests.")
        return
    
    print()
    print("=" * 80)
    print("TEST 1: QUIZ QUESTION GENERATION")
    print("=" * 80)
    print()
    
    # Test 1: Topical question generation
    question = test_quiz_question_generation(
        subject="mathematics",
        topic="algebra",
        difficulty="medium",
        question_type="topical"
    )
    
    if question:
        print()
        print("=" * 80)
        print("TEST 2: ANSWER EVALUATION")
        print("=" * 80)
        print()
        
        # Test with correct answer
        test_answer_evaluation(
            question_id=question.get('id', 'test-id'),
            answer=question.get('correct_answer', ''),
            subject="mathematics",
            correct_answer=question.get('correct_answer', ''),
            solution=question.get('solution', ''),
            question_text=question.get('question_text', '')
        )
        
        print()
        # Test with incorrect answer
        test_answer_evaluation(
            question_id=question.get('id', 'test-id'),
            answer="wrong_answer",
            subject="mathematics",
            correct_answer=question.get('correct_answer', ''),
            solution=question.get('solution', ''),
            question_text=question.get('question_text', '')
        )
    
    print()
    print("=" * 80)
    print("TEST 3: GRAPH GENERATION")
    print("=" * 80)
    print()
    
    # Test different graph types
    graph_types = ["linear", "quadratic", "exponential", "trigonometric"]
    for graph_type in graph_types:
        test_graph_generation(graph_type)
        print()
        time.sleep(1)  # Small delay between requests
    
    print()
    print("=" * 80)
    print("TEST 4: DIFFERENT TOPICS")
    print("=" * 80)
    print()
    
    # Test different topics
    topics = ["algebra", "geometry", "trigonometry", "calculus"]
    for topic in topics:
        test_quiz_question_generation(
            subject="mathematics",
            topic=topic,
            difficulty="medium",
            question_type="topical"
        )
        print()
        time.sleep(1)
    
    print()
    print("=" * 80)
    print("TEST 5: DIFFERENT DIFFICULTIES")
    print("=" * 80)
    print()
    
    # Test different difficulties
    difficulties = ["easy", "medium", "hard"]
    for difficulty in difficulties:
        test_quiz_question_generation(
            subject="mathematics",
            topic="algebra",
            difficulty=difficulty,
            question_type="topical"
        )
        print()
        time.sleep(1)
    
    print()
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print("All tests completed. Review the results above.")
    print("=" * 80)


if __name__ == "__main__":
    # Check if custom URL provided
    if len(sys.argv) > 1:
        BASE_URL = sys.argv[1]
        print(f"Using custom base URL: {BASE_URL}")
    
    # Check if credentials provided
    if len(sys.argv) > 3:
        TEST_USER_EMAIL = sys.argv[2]
        TEST_USER_PASSWORD = sys.argv[3]
        print(f"Using custom credentials for: {TEST_USER_EMAIL}")
    
    run_comprehensive_tests()

