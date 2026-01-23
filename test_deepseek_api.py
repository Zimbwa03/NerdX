#!/usr/bin/env python3
"""
Quick test to verify DeepSeek API is working
"""
import os
import requests
from utils.deepseek import get_deepseek_chat_model

# Set the API key
os.environ['DEEPSEEK_API_KEY'] = 'sk-5e3b99e25a5246eb8df7f480e4989677'

api_key = os.environ.get('DEEPSEEK_API_KEY')
api_url = 'https://api.deepseek.com/chat/completions'

print("=" * 80)
print("TESTING DEEPSEEK API CONNECTION")
print("=" * 80)
print(f"\nAPI Key: {api_key[:20]}...")
print(f"API URL: {api_url}\n")

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

data = {
    'model': get_deepseek_chat_model(),
    'messages': [{'role': 'user', 'content': 'Generate a simple math question: What is 5 + 3?'}],
    'max_tokens': 100,
    'temperature': 0.7
}

try:
    print("Sending request to DeepSeek API...")
    response = requests.post(api_url, headers=headers, json=data, timeout=30)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\n✅ SUCCESS! DeepSeek API is working!")
        print(f"\nResponse: {result['choices'][0]['message']['content'][:200]}")
    else:
        print(f"\n❌ ERROR: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"\n❌ EXCEPTION: {str(e)}")

print("\n" + "=" * 80)
