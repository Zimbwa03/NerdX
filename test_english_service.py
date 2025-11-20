import sys
import os
import logging
import json

# Add project root to path
sys.path.append(os.getcwd())

try:
    from services.english_service import EnglishService
except ImportError as e:
    print(f"ImportError: {e}")
    sys.exit(1)

# Configure logging
logging.basicConfig(level=logging.INFO)

def test_comprehension():
    print("Initializing EnglishService...")
    try:
        service = EnglishService()
    except Exception as e:
        print(f"Failed to initialize service: {e}")
        return

    print("Testing generate_comprehension...")
    try:
        result = service.generate_comprehension()
        if result:
            print("\n--- Generation Result ---")
            passage = result.get('passage', '')
            questions = result.get('questions', [])
            
            word_count = len(passage.split())
            print(f"Passage Length: {word_count} words")
            print(f"Number of Questions: {len(questions)}")
            
            if questions:
                print("\nSample Question 1:")
                print(json.dumps(questions[0], indent=2))
            
            if word_count < 100:
                print("\nWARNING: Passage seems too short (likely fallback).")
            
            if len(questions) != 10:
                print(f"\nWARNING: Expected 10 questions, got {len(questions)}.")
                
        else:
            print("Failed: returned None")
    except Exception as e:
        print(f"Error executing generate_comprehension: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_comprehension()
