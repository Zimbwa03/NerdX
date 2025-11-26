#!/usr/bin/env python3
"""
Test script for Mathematics Question Generation
Tests the DeepSeek AI integration and fallback mechanisms
"""

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.math_question_generator import MathQuestionGenerator

def test_math_generation():
    """Test mathematics question generation"""
    print("=" * 80)
    print("TESTING MATHEMATICS QUESTION GENERATION")
    print("=" * 80)
    
    # Initialize generator
    generator = MathQuestionGenerator()
    
    # Check API key
    if not generator.api_key:
        print("\n⚠️  WARNING: DEEPSEEK_API_KEY not set!")
        print("The system will use LOCAL FALLBACK questions instead of AI generation.")
        print("Set DEEPSEEK_API_KEY environment variable for AI-powered questions.\n")
    else:
        print(f"\n✅ DeepSeek API Key configured: {generator.api_key[:10]}...")
    
    # Test topics
    test_cases = [
        ("Mathematics", "Algebra", "easy"),
        ("Mathematics", "Geometry", "medium"),
        ("Mathematics", "Statistics", "difficult"),
    ]
    
    print("\n" + "=" * 80)
    print("GENERATING TEST QUESTIONS")
    print("=" * 80)
    
    for subject, topic, difficulty in test_cases:
        print(f"\n🔍 Testing: {subject} / {topic} / {difficulty}")
        print("-" * 80)
        
        try:
            question = generator.generate_question(subject, topic, difficulty, user_id="test_user")
            
            if question:
                print(f"✅ SUCCESS - Question Generated")
                print(f"   Source: {question.get('source', 'unknown')}")
                print(f"   Topic: {question.get('topic', 'N/A')}")
                print(f"   Question: {question.get('question', '')[:100]}...")
                print(f"   Answer: {question.get('answer', 'N/A')}")
                print(f"   Points: {question.get('points', 'N/A')}")
            else:
                print("❌ FAILED - No question generated")
                
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
    
    print("\n" + "=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)
    
if __name__ == "__main__":
    test_math_generation()
