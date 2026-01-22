
import os
import sys
import logging

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# Add user site-packages where requests is installed
sys.path.append(r"c:\users\gwenje\appdata\roaming\python\python311\site-packages")

# Set up logging to console
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_cs_generation():
    """Test Computer Science Question Generation using DeepSeek"""
    try:
        from services.computer_science_generator import ComputerScienceGenerator
        
        generator = ComputerScienceGenerator()
        user_id = "test_user_123"
        topic = "Hardware and Software"
        difficulty = "medium"
        
        print("\n" + "="*50)
        print("TESTING COMPUTER SCIENCE GENERATION (DeepSeek)")
        print("="*50 + "\n")
        
        # 1. Test MCQ Generation
        print(f"1. Testing MCQ Generation for topic: {topic}...")
        mcq_result = generator.generate_topical_question(topic, difficulty, user_id)
        
        if mcq_result:
            print(f"[PASS] MCQ Generated Successfully!")
            print(f"   Source: {mcq_result.get('source', 'unknown')}")
            print(f"   Question: {mcq_result.get('question')}")
            print(f"   Options: {mcq_result.get('options')}")
            print(f"   Answer: {mcq_result.get('correct_answer')}")
        else:
            print("[FAIL] MCQ Generation Failed")

        print("-" * 30)

        # 2. Test Structured Question Generation
        print(f"\n2. Testing Structured Question Generation for topic: {topic}...")
        struct_result = generator.generate_structured_question(topic, difficulty, user_id)
        
        if struct_result:
            print(f"[PASS] Structured Question Generated Successfully!")
            print(f"   Source: {struct_result.get('source', 'unknown')}")
            print(f"   Context: {struct_result.get('stem', '')[:100]}...")
            parts = struct_result.get('parts', [])
            print(f"   Parts generated: {len(parts)}")
            for i, part in enumerate(parts):
                print(f"     Part {i+1}: {part.get('question')} [{part.get('marks')} marks]")
        else:
            print("[FAIL] Structured Question Generation Failed")

        print("-" * 30)

        # 3. Test Essay Question Generation
        print(f"\n3. Testing Essay Question Generation for topic: {topic}...")
        essay_result = generator.generate_essay_question(topic, difficulty, user_id)
        
        if essay_result:
            print(f"[PASS] Essay Question Generated Successfully!")
            print(f"   Source: {essay_result.get('source', 'unknown')}")
            print(f"   Question: {essay_result.get('question')}")
            print(f"   Marks: {essay_result.get('marks')}")
        else:
            print("[FAIL] Essay Question Generation Failed")

    except Exception as e:
        print(f"\n[FATAL ERROR]: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_cs_generation()
