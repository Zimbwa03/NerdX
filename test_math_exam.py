"""
Test script for Math Exam Service
Verifies the hybrid question generation logic (DB vs AI)
"""
import sys
import os

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.math_exam_service import math_exam_service

def test_exam_flow():
    print("Testing Math Exam Flow...")
    user_id = "test_user_123"
    
    # Test sequence of 6 questions
    for i in range(1, 7):
        print(f"\n--- Question {i} ---")
        try:
            question = math_exam_service.get_next_question(user_id, i, year="2023")
            
            is_ai = question.get('is_ai', False)
            q_type = question.get('type', 'unknown')
            
            print(f"Type: {q_type}")
            print(f"Is AI: {is_ai}")
            print(f"Text: {question.get('question_text')[:50]}...")
            
            # Verification
            if i % 3 == 0:
                if not is_ai:
                    print("❌ ERROR: Expected AI question")
                else:
                    print("✅ Correct: AI Question")
            else:
                if is_ai:
                    print("❌ ERROR: Expected DB question")
                else:
                    print("✅ Correct: DB Question")
                    
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_exam_flow()
