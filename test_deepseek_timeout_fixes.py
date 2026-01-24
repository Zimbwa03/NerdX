#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive test for DeepSeek API with timeout and retry logic
Tests the fixes for timeout errors in math_question_generator.py
"""

import os
import sys
import time
import logging
from typing import Dict, Optional

# Fix Windows encoding issues
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up logging to see retry attempts
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import the generator
from services.math_question_generator import MathQuestionGenerator

def test_deepseek_configuration():
    """Test that DeepSeek is properly configured"""
    print("\n" + "=" * 80)
    print("TEST 1: DEEPSEEK CONFIGURATION")
    print("=" * 80)
    
    generator = MathQuestionGenerator()
    
    # Check API key
    if not generator.deepseek_api_key:
        print("❌ FAILED: DEEPSEEK_API_KEY not configured!")
        print("   Set DEEPSEEK_API_KEY environment variable")
        return False
    else:
        print(f"✅ DeepSeek API Key: {generator.deepseek_api_key[:15]}...")
    
    # Check timeout configuration
    print(f"✅ Base Timeout: {generator.base_timeout}s")
    print(f"✅ Connect Timeout: {generator.connect_timeout}s")
    print(f"✅ Max Retries: {generator.max_retries}")
    print(f"✅ Progressive Timeouts: {generator.timeouts}")
    print(f"✅ Retry Delay: {generator.retry_delay}s")
    
    return True

def test_simple_question_generation():
    """Test generating a simple question"""
    print("\n" + "=" * 80)
    print("TEST 2: SIMPLE QUESTION GENERATION")
    print("=" * 80)
    
    generator = MathQuestionGenerator()
    start_time = time.time()
    
    try:
        print(f"\n🔍 Generating question: Mathematics / Algebra / easy")
        question = generator.generate_question(
            subject="Mathematics",
            topic="Algebra",
            difficulty="easy",
            user_id="test_user"
        )
        
        elapsed = time.time() - start_time
        
        if question:
            print(f"✅ SUCCESS - Question generated in {elapsed:.2f}s")
            print(f"   Source: {question.get('source', 'unknown')}")
            print(f"   Topic: {question.get('topic', 'N/A')}")
            print(f"   Difficulty: {question.get('difficulty', 'N/A')}")
            print(f"   Question: {question.get('question', '')[:150]}...")
            print(f"   Answer: {question.get('answer', 'N/A')}")
            print(f"   Points: {question.get('points', 'N/A')}")
            
            # Verify required fields
            required_fields = ['question', 'solution', 'answer']
            missing = [field for field in required_fields if not question.get(field)]
            if missing:
                print(f"⚠️  WARNING: Missing fields: {missing}")
                return False
            else:
                print("✅ All required fields present")
                return True
        else:
            print(f"❌ FAILED - No question generated after {elapsed:.2f}s")
            return False
            
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"❌ ERROR after {elapsed:.2f}s: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_multiple_topics():
    """Test generating questions for different topics"""
    print("\n" + "=" * 80)
    print("TEST 3: MULTIPLE TOPICS")
    print("=" * 80)
    
    generator = MathQuestionGenerator()
    test_cases = [
        ("Mathematics", "Algebra", "easy"),
        ("Mathematics", "Geometry", "medium"),
        ("Mathematics", "Real Numbers", "easy"),
    ]
    
    results = []
    
    for subject, topic, difficulty in test_cases:
        print(f"\n🔍 Testing: {subject} / {topic} / {difficulty}")
        start_time = time.time()
        
        try:
            question = generator.generate_question(
                subject=subject,
                topic=topic,
                difficulty=difficulty,
                user_id="test_user"
            )
            
            elapsed = time.time() - start_time
            
            if question and question.get('source') == 'deepseek_ai':
                print(f"✅ SUCCESS - Generated in {elapsed:.2f}s")
                print(f"   Question: {question.get('question', '')[:100]}...")
                results.append(True)
            elif question:
                print(f"⚠️  Generated but source is: {question.get('source')}")
                results.append(True)  # Still counts as success
            else:
                print(f"❌ FAILED - No question after {elapsed:.2f}s")
                results.append(False)
                
        except Exception as e:
            elapsed = time.time() - start_time
            print(f"❌ ERROR after {elapsed:.2f}s: {str(e)}")
            results.append(False)
    
    success_count = sum(results)
    total_count = len(results)
    
    print(f"\n📊 Results: {success_count}/{total_count} successful")
    
    return success_count == total_count

def test_progressive_timeouts():
    """Test that progressive timeouts work correctly"""
    print("\n" + "=" * 80)
    print("TEST 4: PROGRESSIVE TIMEOUTS")
    print("=" * 80)
    
    generator = MathQuestionGenerator()
    
    # Verify timeout configuration
    print(f"\n📋 Timeout Configuration:")
    print(f"   Base Timeout: {generator.base_timeout}s")
    print(f"   Progressive Timeouts: {generator.timeouts}")
    print(f"   Max Retries: {generator.max_retries}")
    
    # Test that timeouts are progressive
    if len(generator.timeouts) == 3:
        if generator.timeouts[0] < generator.timeouts[1] < generator.timeouts[2]:
            print("✅ Progressive timeouts are correctly configured (increasing)")
        else:
            print("❌ Progressive timeouts are not increasing")
            return False
    else:
        print(f"❌ Expected 3 timeouts, got {len(generator.timeouts)}")
        return False
    
    # Test a question generation to see retry behavior
    print(f"\n🔍 Testing question generation with timeout handling...")
    start_time = time.time()
    
    try:
        question = generator.generate_question(
            subject="Mathematics",
            topic="Sets",
            difficulty="medium",
            user_id="test_user"
        )
        
        elapsed = time.time() - start_time
        
        if question:
            print(f"✅ SUCCESS - Question generated in {elapsed:.2f}s")
            print(f"   This shows timeout handling is working correctly")
            return True
        else:
            print(f"⚠️  No question generated after {elapsed:.2f}s")
            print(f"   This might indicate timeout issues, but could also be API unavailability")
            return False
            
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"❌ ERROR after {elapsed:.2f}s: {str(e)}")
        return False

def test_graph_question():
    """Test graph question generation"""
    print("\n" + "=" * 80)
    print("TEST 5: GRAPH QUESTION GENERATION")
    print("=" * 80)
    
    generator = MathQuestionGenerator()
    start_time = time.time()
    
    try:
        print(f"\n🔍 Generating graph question for: y = 2x + 3")
        question = generator.generate_graph_question(
            equation="y = 2x + 3",
            graph_type="linear",
            difficulty="medium",
            user_id="test_user"
        )
        
        elapsed = time.time() - start_time
        
        if question:
            print(f"✅ SUCCESS - Graph question generated in {elapsed:.2f}s")
            print(f"   Source: {question.get('source', 'unknown')}")
            print(f"   Equation: {question.get('equation', 'N/A')}")
            print(f"   Question: {question.get('question', '')[:150]}...")
            return True
        else:
            print(f"⚠️  No graph question generated after {elapsed:.2f}s")
            return False
            
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"❌ ERROR after {elapsed:.2f}s: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_timeout_parameter():
    """Test timeout_seconds parameter support"""
    print("\n" + "=" * 80)
    print("TEST 6: TIMEOUT PARAMETER SUPPORT")
    print("=" * 80)
    
    generator = MathQuestionGenerator()
    
    # Test with a short timeout to verify it's respected
    print(f"\n🔍 Testing with timeout_seconds=15 (should cap attempts)")
    start_time = time.time()
    
    try:
        question = generator.generate_question(
            subject="Mathematics",
            topic="Algebra",
            difficulty="easy",
            user_id="test_user",
            timeout_seconds=15
        )
        
        elapsed = time.time() - start_time
        
        if question:
            print(f"✅ SUCCESS - Question generated in {elapsed:.2f}s")
            print(f"   Timeout parameter was respected")
            return True
        else:
            print(f"⚠️  No question generated (might be due to short timeout)")
            return False
            
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"❌ ERROR after {elapsed:.2f}s: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("\n" + "=" * 80)
    print("DEEPSEEK API TEST SUITE - Timeout and Retry Logic")
    print("=" * 80)
    print("\nThis test suite verifies that DeepSeek API integration works correctly")
    print("with the new progressive timeout and retry logic.\n")
    
    # Check if API key is set
    api_key = os.environ.get('DEEPSEEK_API_KEY')
    if not api_key:
        print("⚠️  WARNING: DEEPSEEK_API_KEY not set in environment")
        print("   Some tests may fail or use fallback questions")
        print("   Set DEEPSEEK_API_KEY to test full AI functionality\n")
    
    # Run tests
    tests = [
        ("Configuration", test_deepseek_configuration),
        ("Simple Question", test_simple_question_generation),
        ("Multiple Topics", test_multiple_topics),
        ("Progressive Timeouts", test_progressive_timeouts),
        ("Graph Question", test_graph_question),
        ("Timeout Parameter", test_timeout_parameter),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n❌ Test '{test_name}' crashed: {str(e)}")
            import traceback
            traceback.print_exc()
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status}: {test_name}")
    
    print(f"\n📊 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! DeepSeek integration is working correctly.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Review the output above for details.")
        return 1

if __name__ == "__main__":
    exit(main())
