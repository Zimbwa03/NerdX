"""
Generate fresh JWT token for testing
"""
import jwt
import datetime

JWT_SECRET = 'nerdx-mobile-secret-key-change-in-production'
JWT_ALGORITHM = 'HS256'
user_id = "test_4efe7627de41"

payload = {
    'user_id': user_id,
    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
    'iat': datetime.datetime.utcnow()
}

token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
print(f"Fresh token: {token}")
