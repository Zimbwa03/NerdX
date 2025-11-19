import json
from app import app
import routes

client = app.test_client()
payload = {
    "subject": "mathematics",
    "topic": "Algebra",
    "difficulty": "easy",
    "type": "topical"
}
resp = client.post('/api/mobile/quiz/generate', json=payload)
print('STATUS', resp.status_code)
try:
    data = resp.get_json()
    print('JSON', json.dumps(data, indent=2))
except Exception as e:
    print('Error parsing JSON', e)
