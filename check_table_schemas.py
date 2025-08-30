#!/usr/bin/env python3
"""
Check table schemas to identify what's causing 400 errors
"""
import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Supabase configuration
SUPABASE_URL = "https://hvlvwvzliqrlmqjbfgoa.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bHZ3dnpsaXFybG1xamJmZ29hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM4MjEyOSwiZXhwIjoyMDY3OTU4MTI5fQ.p4qtbG42XUiN8sXH3phmUMwwQPo1v-StjUkwUZOR4Bg"

def make_supabase_request(method, table, data=None, select="*", filters=None, limit=None, offset=None):
    """Make a request to Supabase REST API"""
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }

    url = f"{SUPABASE_URL}/rest/v1/{table}"

    params = {}
    if select and method == "GET":
        params["select"] = select
    if filters:
        params.update(filters)
    if limit:
        params["limit"] = str(limit)
    if offset:
        params["offset"] = str(offset)

    try:
        if method == "GET":
            response = requests.get(url, headers=headers, params=params, timeout=30)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data, params=params, timeout=30)
        elif method == "PATCH":
            response = requests.patch(url, headers=headers, json=data, params=params, timeout=30)
        
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Error with {method} request to {table}: {e}")
        return None

def check_table_schema(table_name):
    """Check table schema by looking at existing data"""
    logger.info(f"\n🔍 Checking {table_name} table schema...")
    
    try:
        # Get a few records to see the structure
        result = make_supabase_request("GET", table_name, limit=3)
        if result and len(result) > 0:
            logger.info(f"✅ {table_name} table accessible")
            
            # Show the first record structure
            first_record = result[0]
            logger.info(f"📋 Sample record structure:")
            for key, value in first_record.items():
                logger.info(f"   {key}: {type(value).__name__} = {value}")
            
            return first_record
        else:
            logger.warning(f"⚠️ {table_name} table empty or inaccessible")
            return None
    except Exception as e:
        logger.error(f"❌ Error checking {table_name}: {e}")
        return None

def test_minimal_insert(table_name, sample_data):
    """Test minimal insert to see what's required"""
    logger.info(f"\n🧪 Testing minimal insert for {table_name}...")
    
    try:
        result = make_supabase_request("POST", table_name, sample_data)
        if result:
            logger.info(f"✅ Insert successful for {table_name}")
            return True
        else:
            logger.error(f"❌ Insert failed for {table_name}")
            return False
    except Exception as e:
        logger.error(f"❌ Insert error for {table_name}: {e}")
        return False

def main():
    """Main function to check table schemas"""
    logger.info("🔍 Starting table schema analysis...")
    
    # Check key tables
    tables_to_check = [
        "users_registration",
        "user_stats", 
        "referral_codes",
        "referrals",
        "referral_stats",
        "payment_transactions",
        "credit_transactions"
    ]
    
    schemas = {}
    
    for table in tables_to_check:
        schema = check_table_schema(table)
        if schema:
            schemas[table] = schema
    
    # Test minimal inserts
    logger.info("\n" + "="*50)
    logger.info("🧪 TESTING MINIMAL INSERTS")
    logger.info("="*50)
    
    # Test users_registration with minimal data
    if "users_registration" in schemas:
        minimal_user = {
            "chat_id": "test_minimal",
            "name": "Test",
            "surname": "User",
            "date_of_birth": "1990-01-01",
            "nerdx_id": "N12345"
        }
        test_minimal_insert("users_registration", minimal_user)
    
    # Test user_stats with minimal data
    if "user_stats" in schemas:
        minimal_stats = {
            "user_id": "test_minimal",
            "credits": 100
        }
        test_minimal_insert("user_stats", minimal_stats)
    
    # Test referral_codes with minimal data
    if "referral_codes" in schemas:
        minimal_referral = {
            "user_id": "test_minimal",
            "referral_code": "REF123"
        }
        test_minimal_insert("referral_codes", minimal_referral)
    
    logger.info("\n🏁 Schema analysis completed!")

if __name__ == "__main__":
    main()




