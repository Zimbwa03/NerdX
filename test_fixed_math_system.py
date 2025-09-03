#!/usr/bin/env python3
"""
Test the fixed mathematics question generation system
"""

import os
import sys
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Set the API key directly
os.environ['DEEPSEEK_API_KEY'] = 'sk-5e3b99e25a5246eb8df7f480e4989677'

def test_fixed_math_system():
    """Test the fixed mathematics question generation system"""
    
    print("🧮 Testing Fixed Mathematics Question Generation System")
    print("=" * 60)
    
    try:
        # Import the fixed math question generator
        from services.math_question_generator import math_question_generator
        
        # Test cases
        test_cases = [
            ("Algebra", "easy"),
            ("Geometry", "medium"),
            ("Statistics", "difficult")
        ]
        
        for topic, difficulty in test_cases:
            print(f"\n📚 Testing: {topic} - {difficulty.upper()}")
            print("-" * 40)
            
            try:
                # Generate question using the fixed system
                question_data = math_question_generator.generate_question(
                    subject="Mathematics",
                    topic=topic,
                    difficulty=difficulty,
                    user_id="test_user_123"
                )
                
                if question_data:
                    print(f"✅ SUCCESS: Generated {difficulty} {topic} question")
                    print(f"   Question: {question_data.get('question', '')[:100]}...")
                    print(f"   Answer: {question_data.get('answer', 'N/A')}")
                    print(f"   Points: {question_data.get('points', 'N/A')}")
                    print(f"   Source: {question_data.get('source', 'N/A')}")
                    print(f"   Difficulty: {question_data.get('difficulty', 'N/A')}")
                    print(f"   Topic: {question_data.get('topic', 'N/A')}")
                else:
                    print(f"❌ FAILED: No question generated for {difficulty} {topic}")
                    
            except Exception as e:
                print(f"❌ ERROR: {str(e)}")
                
        print("\n" + "=" * 60)
        print("🏁 Fixed system test completed!")
        
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("Make sure you're running this from the project root directory")
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")

if __name__ == "__main__":
    test_fixed_math_system()

