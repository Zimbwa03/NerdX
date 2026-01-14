
import os
import logging
import json
from dotenv import load_dotenv
from services.combined_science_generator import CombinedScienceGenerator

# Setup logging
logging.basicConfig(level=logging.INFO)
load_dotenv()

def test_generation():
    print("Testing CombinedScienceGenerator...")
    gen = CombinedScienceGenerator()
    
    if not gen.api_key:
        print("❌ API Key missing!")
        return

    subject = "Biology"
    topic = "Cell Structure and Organisation"
    difficulty = "medium"
    
    print(f"Generating question for {subject} - {topic}...")
    question = gen.generate_topical_question(subject, topic, difficulty)
    
    if question:
        print("✅ Generation Successful!")
        print(json.dumps(question, indent=2))
        
        # Check if it was a fallback
        if question.get('source') == 'fallback_olevel':
            print("⚠️  Result was from FALLBACK, not DeepSeek.")
        else:
            print("🎉 Result was from DeepSeek!")
            
    else:
        print("❌ Generation Failed completely.")

if __name__ == "__main__":
    test_generation()
