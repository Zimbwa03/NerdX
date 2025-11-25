"""
Setup Test Environment for DKT
Creates a test user and updates test_dkt_api.py with a valid token
"""

import os
import jwt
import datetime
import psycopg2
import uuid
import re
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("⚠️  python-dotenv not installed, assuming env vars are set")

# Configuration
TEST_USER_EMAIL = "dkt_test@nerdx.com"
TEST_USER_NAME = "DKT Test User"
TEST_USER_ID = "dkt_test_user_v1"
JWT_SECRET = os.environ.get('JWT_SECRET', 'nerdx-mobile-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'

def get_db_connection():
    """Connect to database"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ Error: DATABASE_URL environment variable not set")
        return None
    
    try:
        conn = psycopg2.connect(database_url)
        conn.autocommit = True
        return conn
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return None

def create_test_user(conn):
    """Create or get test user"""
    with conn.cursor() as cur:
        # Check if user exists in users_registration table
        cur.execute("SELECT chat_id FROM users_registration WHERE email = %s", (TEST_USER_EMAIL,))
        user = cur.fetchone()
        
        if user:
            print(f"✅ Test user already exists: {user[0]}")
            return user[0]
        
        # Create new user in users_registration table
        try:
            # Generate unique identifiers
            chat_id = f"test_{uuid.uuid4().hex[:12]}"
            nerdx_id = "NX" + uuid.uuid4().hex[:8].upper()
            
            cur.execute("""
                INSERT INTO users_registration (
                    chat_id, name, surname, date_of_birth, nerdx_id, 
                    email, phone_number, credits, is_active
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING chat_id
            """, (
                chat_id, 
                "DKT", 
                "Test User", 
                "2000-01-01", 
                nerdx_id,
                TEST_USER_EMAIL,
                "+263777000000",
                100,
                True
            ))
            
            new_id = cur.fetchone()[0]
            print(f"✅ Created new test user: {new_id}")
            return new_id
            
        except Exception as e:
            print(f"⚠️  Could not create user directly: {e}")
            print("Trying to find ANY user to use for testing...")
            
            cur.execute("SELECT chat_id FROM users_registration LIMIT 1")
            user = cur.fetchone()
            if user:
                print(f"✅ Using existing user: {user[0]}")
                return user[0]
            else:
                print("❌ No users found in database")
                return None

def generate_token(user_id):
    """Generate JWT token"""
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def update_test_script(token):
    """Update test_dkt_api.py with new token"""
    file_path = 'test_dkt_api.py'
    
    if not os.path.exists(file_path):
        print(f"❌ {file_path} not found")
        return False
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace token
    # Look for TOKEN = "..." or TOKEN = '...'
    new_content = re.sub(
        r'TOKEN\s*=\s*["\'].*?["\']', 
        f'TOKEN = "{token}"', 
        content
    )
    
    if content == new_content:
        print("⚠️  Could not update token in file (pattern not found)")
        return False
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"✅ Updated {file_path} with valid token")
    return True

def main():
    print("🚀 Setting up DKT Test Environment...")
    
    # 1. Connect to DB
    conn = get_db_connection()
    if not conn:
        return
    
    # 2. Get/Create User
    user_id = create_test_user(conn)
    conn.close()
    
    if not user_id:
        print("❌ Failed to get a test user")
        return
    
    # 3. Generate Token
    token = generate_token(user_id)
    print(f"🔑 Generated token for user {user_id}")
    
    # 4. Update Test Script
    if update_test_script(token):
        print("\n🎉 Setup complete! You can now run: python test_dkt_api.py")

if __name__ == "__main__":
    main()
