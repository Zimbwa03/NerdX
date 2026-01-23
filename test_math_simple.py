#!/usr/bin/env python3
"""
Simple test for mathematics question generation without dependencies
"""

import os
import requests
import json
import logging
from utils.deepseek import get_deepseek_chat_model

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Set the API key directly
os.environ['DEEPSEEK_API_KEY'] = 'sk-5e3b99e25a5246eb8df7f480e4989677'

def test_direct_math_generation():
    """Test direct mathematics question generation using DeepSeek API"""
    
    print("🧮 Testing Direct Mathematics Question Generation")
    print("=" * 60)
    
    api_key = os.environ.get('DEEPSEEK_API_KEY')
    
    # Test topics and difficulties
    test_cases = [
        ("Algebra", "easy"),
        ("Algebra", "medium"), 
        ("Algebra", "difficult"),
        ("Geometry", "easy"),
        ("Statistics", "medium"),
        ("Trigonometry", "difficult")
    ]
    
    for topic, difficulty in test_cases:
        print(f"\n📚 Testing: {topic} - {difficulty.upper()}")
        print("-" * 40)
        
        # Create prompt for mathematics question
        prompt = f"""Generate a high-quality {difficulty} level Mathematics question about {topic} for ZIMSEC O-Level students.

Requirements:
- Create a clear, specific question following ZIMSEC exam format
- Use proper mathematical notation and terminology
- Include specific numbers and realistic scenarios
- Appropriate for {difficulty} difficulty level
- Focus specifically on {topic}
- Question should test understanding, not just recall
- Provide a complete step-by-step solution
- Give the final answer clearly

Return your response in this EXACT JSON format:
{{
    "question": "Your generated question here",
    "solution": "Complete step-by-step solution with clear working",
    "answer": "Final answer only",
    "points": 10,
    "explanation": "Brief explanation of the concept being tested"
}}

Generate the question now:"""

        try:
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': get_deepseek_chat_model(),
                'messages': [
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'max_tokens': 2000,
                'temperature': 0.7
            }
            
            print(f"🔄 Generating {difficulty} {topic} question...")
            response = requests.post(
                'https://api.deepseek.com/chat/completions',
                headers=headers,
                json=data,
                timeout=45
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                # Extract JSON from response
                json_start = content.find('{')
                json_end = content.rfind('}') + 1
                
                if json_start >= 0 and json_end > json_start:
                    json_str = content[json_start:json_end]
                    try:
                        question_data = json.loads(json_str)
                        
                        # Validate required fields
                        required_fields = ['question', 'solution', 'answer', 'points']
                        if all(field in question_data for field in required_fields):
                            print(f"✅ SUCCESS: Generated {difficulty} {topic} question")
                            print(f"   Question: {question_data['question'][:100]}...")
                            print(f"   Answer: {question_data['answer']}")
                            print(f"   Points: {question_data['points']}")
                            print(f"   Solution length: {len(question_data['solution'])} characters")
                        else:
                            print(f"❌ INVALID: Missing required fields in response")
                            print(f"   Available fields: {list(question_data.keys())}")
                    except json.JSONDecodeError as e:
                        print(f"❌ JSON ERROR: {e}")
                        print(f"   Raw response: {content[:200]}...")
                else:
                    print(f"❌ NO JSON: Could not find JSON in response")
                    print(f"   Raw response: {content[:200]}...")
            else:
                print(f"❌ API ERROR: {response.status_code} - {response.text}")
                
        except requests.exceptions.Timeout:
            print(f"❌ TIMEOUT: Request timed out after 45 seconds")
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
    
    print("\n" + "=" * 60)
    print("🏁 Direct generation test completed!")

if __name__ == "__main__":
    test_direct_math_generation()

