"""
Test Deep Knowledge Tracing API Endpoints
Run this to verify DKT integration is working
"""

import requests
import json
import os

API_URL = os.getenv('API_URL', 'https://nerdx.onrender.com/api/mobile')

# You'll need a valid JWT token - get from login
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdF80ZWZlNzYyN2RlNDEiLCJleHAiOjE3NjQ2NDQyMjcsImlhdCI6MTc2NDAzOTQyN30.TGBk1Z7jQcBueGaafN4nk1jMLv9e66ve8r6UcC72uqk"  # Replace with actual token

headers = {
    'Authorization': f'Bearer {TOKEN}',
    'Content-Type': 'application/json'
}

def test_log_interaction():
    """Test logging a student interaction"""
    print("\n" + "="*60)
    print("TEST 1: Log Interaction")
    print("="*60)
    
    data = {
        "subject": "mathematics",
        "topic": "Algebra",
        "skill_id": "math_algebra_quadratic",
        "question_id": "test_q1",
        "correct": True,
        "confidence": "high",
        "time_spent": 45,
        "hints_used": 0
    }
    
    response = requests.post(
        f'{API_URL}/dkt/log-interaction',
        headers=headers,
        json=data
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 201

def test_knowledge_map():
    """Test getting knowledge map"""
    print("\n" + "="*60)
    print("TEST 2: Get Knowledge Map")
    print("="*60)
    
    response = requests.get(
        f'{API_URL}/dkt/knowledge-map',
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    result = response.json()
    
    if result.get('success'):
        data = result['data']
        print(f"\nTotal Skills: {data['total_skills']}")
        print(f"Mastered: {data['mastered_skills']}")
        print(f"Learning: {data['learning_skills']}")
        print(f"Struggling: {data['struggling_skills']}")
        
        if data['skills']:
            print("\nTop 5 Skills:")
            for skill in data['skills'][:5]:
                mastery_pct = skill['mastery'] * 100
                print(f"  - {skill['skill_name']}: {mastery_pct:.1f}% ({skill['status']})")
    else:
        print(f"Error: {result.get('message')}")
    
    return response.status_code == 200

def test_skill_mastery():
    """Test getting specific skill mastery"""
    print("\n" + "="*60)
    print("TEST 3: Get Skill Mastery")
    print("="*60)
    
    skill_id = "math_algebra_quadratic"
    
    response = requests.get(
        f'{API_URL}/dkt/mastery/{skill_id}',
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    result = response.json()
    
    if result.get('success'):
        data = result['data']
        print(f"\nSkill: {skill_id}")
        print(f"Mastery: {data['mastery_probability']:.2f} ({data['status']})")
        print(f"Total Interactions: {data['total_interactions']}")
        
        if data['recent_history']:
            print("\nRecent History:")
            for interaction in data['recent_history'][:3]:
                result_str = "✓ Correct" if interaction['correct'] else "✗ Incorrect"
                print(f"  - {result_str} | Confidence: {interaction.get('confidence', 'N/A')}")
    else:
        print(f"Error: {result.get('message')}")
    
    return response.status_code == 200

def test_recommendation():
    """Test getting personalized recommendation"""
    print("\n" + "="*60)
    print("TEST 4: Get Recommendation")
    print("="*60)
    
    data = {
        "subject": "mathematics",
        "topic": "Algebra"
    }
    
    response = requests.post(
        f'{API_URL}/dkt/recommend-next',
        headers=headers,
        json=data
    )
    
    print(f"Status: {response.status_code}")
    result = response.json()
    
    if result.get('success'):
        rec = result['data']
        if rec.get('recommended'):
            print(f"\n✨ Recommendation:")
            print(f"  Skill: {rec['skill_name']}")
            print(f"  Topic: {rec['topic']}")
            print(f"  Current Mastery: {rec['current_mastery']:.2f}")
            print(f"  Suggested Difficulty: {rec['suggested_difficulty']}")
            print(f"  Reason: {rec['reason']}")
        else:
            print(f"\nNo recommendation: {rec.get('reason')}")
    else:
        print(f"Error: {result.get('message')}")
    
    return response.status_code == 200

def test_interaction_history():
    """Test getting interaction history"""
    print("\n" + "="*60)
    print("TEST 5: Get Interaction History")
    print("="*60)
    
    response = requests.get(
        f'{API_URL}/dkt/interaction-history',
        headers=headers,
        params={'limit': 10}
    )
    
    print(f"Status: {response.status_code}")
    result = response.json()
    
    if result.get('success'):
        data = result['data']
        print(f"\nTotal Interactions: {data['total']}")
        
        if data['interactions']:
            print("\nRecent Interactions:")
            for i, interaction in enumerate(data['interactions'][:5], 1):
                result_str = "✓" if interaction['correct'] else "✗"
                print(f"{i}. {result_str} {interaction['skill_id']} | {interaction.get('timestamp', 'N/A')}")
    else:
        print(f"Error: {result.get('message')}")
    
    return response.status_code == 200

def run_all_tests():
    """Run all DKT API tests"""
    print("\n" + "="*80)
    print("🧪 DEEP KNOWLEDGE TRACING API TESTS")
    print("="*80)
    
    if TOKEN == "YOUR_JWT_TOKEN_HERE":
        print("\n❌ ERROR: Please set a valid JWT token first!")
        print("\nTo get a token:")
        print("1. Login via /auth/login endpoint")
        print("2. Copy the token from response")
        print("3. Set TOKEN variable in this script")
        return
    
    results = []
    
    # Run tests
    results.append(("Log Interaction", test_log_interaction()))
    results.append(("Knowledge Map", test_knowledge_map()))
    results.append(("Skill Mastery", test_skill_mastery()))
    results.append(("Recommendation", test_recommendation()))
    results.append(("Interaction History", test_interaction_history()))
    
    # Summary
    print("\n" + "="*80)
    print("📊 TEST SUMMARY")
    print("="*80)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    total_passed = sum(1 for _, passed in results if passed)
    print(f"\nTotal: {total_passed}/{len(results)} tests passed")
    
    if total_passed == len(results):
        print("\n🎉 All tests passed! DKT integration is working!\n")
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.\n")

if __name__ == "__main__":
    run_all_tests()
