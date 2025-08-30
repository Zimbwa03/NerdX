#!/usr/bin/env python3
"""
Fix schema issues in NerdX Bot database
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

def check_table_structure(table_name):
    """Check the exact structure of a table"""
    logger.info(f"\n🔍 Checking {table_name} table structure...")
    
    try:
        # Get a few records to see the structure
        result = make_supabase_request("GET", table_name, limit=1)
        if result and len(result) > 0:
            first_record = result[0]
            logger.info(f"✅ {table_name} table accessible")
            logger.info(f"📋 Fields: {list(first_record.keys())}")
            logger.info(f"📋 Sample data: {first_record}")
            return first_record
        else:
            logger.warning(f"⚠️ {table_name} table empty")
            return None
    except Exception as e:
        logger.error(f"❌ Error checking {table_name}: {e}")
        return None

def test_fixed_insert(table_name, test_data):
    """Test insert with fixed data format"""
    logger.info(f"\n🧪 Testing fixed insert for {table_name}...")
    
    try:
        result = make_supabase_request("POST", table_name, test_data)
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
    """Main function to fix schema issues"""
    logger.info("🔧 Starting schema fix...")
    
    # Check table structures
    tables_to_check = [
        "users_registration",
        "user_stats", 
        "referral_codes",
        "payment_transactions",
        "credit_transactions"
    ]
    
    schemas = {}
    
    for table in tables_to_check:
        schema = check_table_structure(table)
        if schema:
            schemas[table] = schema
    
    # Test fixed inserts based on actual table structures
    logger.info("\n" + "="*50)
    logger.info("🧪 TESTING FIXED INSERTS")
    logger.info("="*50)
    
    # Test users_registration with correct structure
    if "users_registration" in schemas:
        actual_fields = list(schemas["users_registration"].keys())
        logger.info(f"users_registration actual fields: {actual_fields}")
        
        # Create test data matching actual structure
        test_user = {}
        for field in actual_fields:
            if field == "id":
                continue  # Skip auto-generated ID
            elif field == "chat_id":
                test_user[field] = "test_chat_123"
            elif field == "name":
                test_user[field] = "Test"
            elif field == "surname":
                test_user[field] = "User"
            elif field == "date_of_birth":
                test_user[field] = "1990-01-01"
            elif field == "nerdx_id":
                test_user[field] = "N12345"
            elif field == "referred_by_nerdx_id":
                test_user[field] = None
            elif field == "created_at":
                continue  # Skip timestamp
            else:
                # For any other fields, use a default value
                test_user[field] = None
        
        logger.info(f"Test data: {test_user}")
        test_fixed_insert("users_registration", test_user)
    
    # Test user_stats with correct structure
    if "user_stats" in schemas:
        actual_fields = list(schemas["user_stats"].keys())
        logger.info(f"user_stats actual fields: {actual_fields}")
        
        test_stats = {}
        for field in actual_fields:
            if field == "id":
                continue
            elif field == "user_id":
                test_stats[field] = "test_user_123"
            elif field == "credits":
                test_stats[field] = 100
            elif field == "created_at":
                continue
            else:
                test_stats[field] = None
        
        logger.info(f"Test data: {test_stats}")
        test_fixed_insert("user_stats", test_stats)
    
    # Test referral_codes with correct structure
    if "referral_codes" in schemas:
        actual_fields = list(schemas["referral_codes"].keys())
        logger.info(f"referral_codes actual fields: {actual_fields}")
        
        test_referral = {}
        for field in actual_fields:
            if field == "id":
                continue
            elif field == "user_id":
                test_referral[field] = "test_user_123"
            elif field == "referral_code":
                test_referral[field] = "REF123"
            elif field == "created_at":
                continue
            else:
                test_referral[field] = None
        
        logger.info(f"Test data: {test_referral}")
        test_fixed_insert("referral_codes", test_referral)
    
    logger.info("\n🏁 Schema fix completed!")

if __name__ == "__main__":
    main()



