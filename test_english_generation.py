import sys
import os
import logging

# Add the current directory to sys.path to make imports work
sys.path.append(os.getcwd())

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from services.english_service import EnglishService
    from standalone_english_comprehension_generator import standalone_english_comprehension_generator
    import google.generativeai as genai
    from dotenv import load_dotenv
    
    # Load environment variables
    load_dotenv()
except ImportError as e:
    print(f"Import Error: {e}")
    sys.exit(1)

def test_generation():
    print("--- Testing English Comprehension Generation ---")
    
    # Check API Keys
    gemini_key = os.getenv('GEMINI_API_KEY')
    deepseek_key = os.getenv('DEEPSEEK_API_KEY')
    
    print(f"GEMINI_API_KEY present: {bool(gemini_key)}")
    print(f"DEEPSEEK_API_KEY present: {bool(deepseek_key)}")

    service = EnglishService()
    
    print(f"Service Configured (Gemini): {service._is_configured}")
    
    # Test Gemini Generation directly if configured
    if service._is_configured:
        print("\nAttempting Gemini Generation...")
        try:
            result = service.generate_gemini_comprehension_passage("Technology", form_level=4)
            if result:
                print("Gemini Generation SUCCESS")
                print(str(result)[:200] + "...")
            else:
                print("Gemini Generation FAILED (returned None)")
        except Exception as e:
            print(f"Gemini Generation ERROR: {e}")
    else:
        print("\nSkipping Gemini Generation (Not Configured)")

    # Test DeepSeek Generation directly
    print("\nAttempting DeepSeek Generation...")
    try:
        result = standalone_english_comprehension_generator.generate_comprehension_passage("Technology")
        if result and result.get('success'):
            print("DeepSeek Generation SUCCESS")
            print(str(result)[:200] + "...")
        else:
            print("DeepSeek Generation FAILED")
            if result:
                print(f"Result: {result}")
    except Exception as e:
        print(f"DeepSeek Generation ERROR: {e}")

if __name__ == "__main__":
    test_generation()
