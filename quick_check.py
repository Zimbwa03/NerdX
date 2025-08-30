#!/usr/bin/env python3
"""
Quick check to see what's wrong with the tables
"""
import requests
import json

# Supabase configuration
SUPABASE_URL = "https://hvlvwvzliqrlmqjbfgoa.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM4MjEyOSwiZXhwIjoyMDY3OTU4MTI5fQ.p4qtbG42XUiN8sXH3phmUMwwQPo1v-StjUkwUZOR4Bg"

def check_table(table_name):
    """Check a single table"""
    print(f"\n🔍 Checking {table_name}...")
    
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Try to get data
    url = f"{SUPABASE_URL}/rest/v1/{table_name}?limit=1"
    try:
        response = requests.get(url, headers=headers, timeout=30)
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                print(f"✅ {table_name}: Has data")
                print(f"   Sample fields: {list(data[0].keys())}")
                return data[0]
            else:
                print(f"⚠️ {table_name}: Empty table")
                return None
        else:
            print(f"❌ {table_name}: HTTP {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ {table_name}: Error - {e}")
        return None

def test_insert(table_name, test_data):
    """Test inserting data"""
    print(f"\n🧪 Testing insert into {table_name}...")
    
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    url = f"{SUPABASE_URL}/rest/v1/{table_name}"
    
    try:
        response = requests.post(url, headers=headers, json=test_data, timeout=30)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        
        if response.status_code == 200 or response.status_code == 201:
            print(f"✅ Insert successful")
            return True
        else:
            print(f"❌ Insert failed")
            return False
    except Exception as e:
        print(f"❌ Insert error: {e}")
        return False

def main():
    print("🚀 Quick table check...")
    
    # Check key tables
    tables = ["users_registration", "user_stats", "referral_codes"]
    
    for table in tables:
        schema = check_table(table)
        if schema:
            print(f"   Schema: {schema}")
    
    # Test minimal insert
    print("\n" + "="*50)
    print("🧪 TESTING MINIMAL INSERTS")
    print("="*50)
    
    # Test users_registration
    test_user = {
        "chat_id": "test123",
        "name": "Test",
        "surname": "User",
        "date_of_birth": "1990-01-01",
        "nerdx_id": "N12345"
    }
    test_insert("users_registration", test_user)
    
    # Test user_stats
    test_stats = {
        "user_id": "test123",
        "credits": 100
    }
    test_insert("user_stats", test_stats)
    
    print("\n🏁 Quick check completed!")

if __name__ == "__main__":
    main()



