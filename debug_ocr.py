
import os
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_ocr_setup():
    print("\n--- Testing OCR Setup ---\n")
    
    # 1. Check Python version
    print(f"Python Version: {sys.version}")
    
    # 2. Check for .env file
    env_path = os.path.join(os.getcwd(), 'NerdX', '.env')
    if os.path.exists(env_path):
        print(f"[OK] .env file found at {env_path}")
        # Try to load it explicitly
        try:
            from dotenv import load_dotenv
            load_dotenv(env_path)
            print("[OK] Loaded .env file with python-dotenv")
        except ImportError:
            print("[WARN] python-dotenv not installed, cannot load .env automatically")
    else:
        print(f"[FAIL] .env file NOT found at {env_path}")
        # Check current dir just in case
        local_env = os.path.join(os.getcwd(), '.env')
        if os.path.exists(local_env):
             print(f"[OK] .env file found at {local_env}")
        else:
             print(f"[FAIL] .env file NOT found at {local_env}")

    # 3. Check Environment Variables
    gemini_key = os.environ.get('GEMINI_API_KEY')
    if gemini_key:
        print(f"[OK] GEMINI_API_KEY found: {gemini_key[:4]}...{gemini_key[-4:]}")
    else:
        print("[FAIL] GEMINI_API_KEY NOT found in environment variables")
        
    deepseek_key = os.environ.get('DEEPSEEK_API_KEY')
    if deepseek_key:
        print(f"[OK] DEEPSEEK_API_KEY found: {deepseek_key[:4]}...{deepseek_key[-4:]}")
    else:
        print("[FAIL] DEEPSEEK_API_KEY NOT found")

    # 4. Check Library Import
    print("\n--- Checking Libraries ---")
    try:
        import google.generativeai as genai
        print(f"[OK] google.generativeai imported successfully. Version: {genai.__version__ if hasattr(genai, '__version__') else 'Unknown'}")
    except ImportError as e:
        print(f"[FAIL] Failed to import google.generativeai: {e}")
        return

    # 5. Check Service Logic (Manual Re-implementation of Init)
    print("\n--- Testing Service Logic ---")
    try:
        # Hack to ensure imports work if run from root
        sys.path.append(os.path.join(os.getcwd(), 'NerdX'))
        from services.math_ocr_service import MathOCRService
        service = MathOCRService()
        
        verification = service.verify_installation()
        print(f"Service Verification: {verification}")
        
        if verification.get('gemini_available'):
            print("[OK] OCR Service reports Gemini is available")
        else:
            print("[FAIL] OCR Service reports Gemini is NOT available")
            
    except Exception as e:
        print(f"[FAIL] Error initializing MathOCRService: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_ocr_setup()
