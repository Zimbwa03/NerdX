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
        result = standalone_english_comprehension_generator.generate_comprehension_passage("Technology")
        if result and result.get('success'):
            print("DeepSeek Generation SUCCESS")
            print(str(result)[:200] + "...")
        else:
            print("DeepSeek Generation FAILED")
    except Exception as e:
        print(f"DeepSeek Generation ERROR: {e}")

if __name__ == "__main__":
    test_generation()
