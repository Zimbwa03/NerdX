import sys
import os
import logging
import json
from dotenv import load_dotenv

# Add the current directory to sys.path to make imports work
sys.path.append(os.getcwd())

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

try:
    from services.english_service import EnglishService
    from standalone_english_comprehension_generator import standalone_english_comprehension_generator
except ImportError as e:
    print(f"Import Error: {e}")
    sys.exit(1)

def test_generation():
    print("--- Testing English Generation ---")
    
    service = EnglishService()
    print(f"Service Configured (Gemini): {service._is_configured}")

    # 1. Test Grammar Generation
    print("\n--- Testing English Grammar Generation ---")
    try:
        grammar_q = service.generate_grammar_question()
        print("Grammar Question Generated Successfully:")
        print(json.dumps(grammar_q, indent=2))
    except Exception as e:
        print(f"Grammar Generation Failed: {e}")

    # 2. Test Vocabulary Generation
    print("\n--- Testing English Vocabulary Generation ---")
    try:
        vocab_q = service.generate_vocabulary_question()
        print("Vocabulary Question Generated Successfully:")
        print(json.dumps(vocab_q, indent=2))
    except Exception as e:
        print(f"Vocabulary Generation Failed: {e}")

    # 3. Test Comprehension (Brief check)
    print("\n--- Testing English Comprehension Generation (DeepSeek) ---")
    try:
        # Test 1: Standard Verification
        print("Testing Standard Generation...")
        result = standalone_english_comprehension_generator.generate_comprehension_passage("Technology")
        if result and result.get('success'):
            print("DeepSeek Standard Generation SUCCESS")
        else:
            print("DeepSeek Standard Generation FAILED")

        # Test 2: Long Passage Verification
        print("\nTesting LONG Passage Generation (10 Questions)...")
        long_result = standalone_english_comprehension_generator.generate_long_comprehension_passage("Traditional Culture vs Modernity")
        
        if long_result and 'passage' in long_result and 'questions' in long_result:
            questions = long_result['questions']
            text = long_result['passage'].get('text', '')
            word_count = len(text.split())
            
            print(f"DeepSeek LONG Generation SUCCESS")
            print(f"Passage Length: {len(text)} chars (~{word_count} words)")
            print(f"Question Count: {len(questions)}")
            
            if len(questions) == 10:
                 print("✅ Question count is EXACTLY 10")
            else:
                 print(f"⚠️ Question count is {len(questions)} (Expected 10)")
                 
            if word_count > 600:
                print("✅ Passage length is satisfactory (> 600 words)")
            else:
                print(f"⚠️ Passage length might be short ({word_count} words)")

            print("\nSample Questions:")
            for i, q in enumerate(questions[:3]):
                print(f"{i+1}. {q.get('question')}")
                
        else:
            print("DeepSeek LONG Generation FAILED - Invalid Response Structure")

    except Exception as e:
        print(f"DeepSeek Generation ERROR: {e}")

if __name__ == "__main__":
    test_generation()
