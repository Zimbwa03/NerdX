#!/usr/bin/env python3
"""
Add missing required fields to tables
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

def test_insert_with_all_fields(table_name, test_data):
    """Test insert with all required fields"""
    logger.info(f"\n🧪 Testing insert for {table_name} with all fields...")
    
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
    """Main function to test inserts with correct field structure"""
    logger.info("🔧 Testing inserts with correct field structure...")
    
    # Test users_registration with ALL required fields
    logger.info("\n" + "="*50)
    logger.info("🧪 TESTING USERS_REGISTRATION INSERT")
    logger.info("="*50)
    
    # Based on the actual table structure we found
    test_user = {
        "chat_id": "test_chat_123",
        "name": "Test",
        "surname": "User", 
        "date_of_birth": "1990-01-01",
        "nerdx_id": "N12345",
        "credits": 100,  # This field exists in the table
        "registration_date": "2025-08-30",  # This field exists in the table
        "referred_by_nerdx_id": None
    }
    
    logger.info(f"Test data: {test_user}")
    test_insert_with_all_fields("users_registration", test_user)
    
    # Test user_stats
    logger.info("\n" + "="*50)
    logger.info("🧪 TESTING USER_STATS INSERT")
    logger.info("="*50)
    
    test_stats = {
        "user_id": "test_user_123",
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User",
        "credits": 100,
        "total_questions_answered": 0,
        "total_correct_answers": 0,
        "current_level": 1,
        "current_xp": 0
    }
    
    logger.info(f"Test data: {test_stats}")
    test_insert_with_all_fields("user_stats", test_stats)
    
    # Test referral_codes
    logger.info("\n" + "="*50)
    logger.info("🧪 TESTING REFERRAL_CODES INSERT")
    logger.info("="*50)
    
    test_referral = {
        "user_id": "test_user_123",
        "referral_code": "REF123",
        "is_active": True,
        "usage_count": 0
    }
    
    logger.info(f"Test data: {test_referral}")
    test_insert_with_all_fields("referral_codes", test_referral)
    
    # Test credit_transactions
    logger.info("\n" + "="*50)
    logger.info("🧪 TESTING CREDIT_TRANSACTIONS INSERT")
    logger.info("="*50)
    
    test_credit = {
        "user_id": "test_user_123",
        "transaction_type": "test",
        "credits_used": -50,
        "credits_before": 100,
        "credits_after": 150,
        "description": "Test credit addition",
        "reference_id": None
    }
    
    logger.info(f"Test data: {test_credit}")
    test_insert_with_all_fields("credit_transactions", test_credit)
    
    logger.info("\n🏁 Field testing completed!")

if __name__ == "__main__":
    main()



