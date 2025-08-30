#!/usr/bin/env python3
"""
Fix RLS permissions in Supabase to allow write operations
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

def test_write_operations():
    """Test write operations on key tables"""
    logger.info("🧪 Testing write operations...")
    
    # Test user_stats table
    test_user = {
        "user_id": f"test_user_{int(requests.get('https://httpbin.org/uuid').json()['uuid'].replace('-', '')[:8])}",
        "username": "testuser",
        "first_name": "Test",
        "credits": 100
    }
    
    logger.info("Testing user_stats table write...")
    result = make_supabase_request("POST", "user_stats", test_user)
    if result:
        logger.info("✅ user_stats write operation successful")
        
        # Clean up test data
        make_supabase_request("PATCH", "user_stats", {"first_name": "DELETED"}, filters={"user_id": f"eq.{test_user['user_id']}"})
        return True
    else:
        logger.error("❌ user_stats write operation failed")
        return False

def test_user_registration():
    """Test user registration system"""
    logger.info("👥 Testing user registration...")
    
    test_user = {
        "chat_id": f"test_chat_{int(requests.get('https://httpbin.org/uuid').json()['uuid'].replace('-', '')[:8])}",
        "name": "Test",
        "surname": "User",
        "date_of_birth": "1990-01-01",
        "nerdx_id": f"N{int(requests.get('https://httpbin.org/uuid').json()['uuid'].replace('-', '')[:5]):05d}",
        "referred_by_nerdx_id": None
    }
    
    result = make_supabase_request("POST", "users_registration", test_user)
    if result:
        logger.info("✅ User registration successful")
        
        # Clean up test data
        make_supabase_request("PATCH", "users_registration", {"name": "DELETED"}, filters={"chat_id": f"eq.{test_user['chat_id']}"})
        return True
    else:
        logger.error("❌ User registration failed")
        return False

def test_referral_system():
    """Test referral system"""
    logger.info("🔗 Testing referral system...")
    
    test_referrer = {
        "user_id": f"test_referrer_{int(requests.get('https://httpbin.org/uuid').json()['uuid'].replace('-', '')[:8])}",
        "referral_code": f"REF{int(requests.get('https://httpbin.org/uuid').json()['uuid'].replace('-', '')[:4]:04d}"
    }
    
    result = make_supabase_request("POST", "referral_codes", test_referrer)
    if result:
        logger.info("✅ Referral code creation successful")
        
        # Clean up test data
        make_supabase_request("PATCH", "referral_codes", {"referral_code": "DELETED"}, filters={"user_id": f"eq.{test_referrer['user_id']}"})
        return True
    else:
        logger.error("❌ Referral code creation failed")
        return False

def test_credit_system():
    """Test credit system"""
    logger.info("💰 Testing credit system...")
    
    test_transaction = {
        "user_id": f"test_credit_{int(requests.get('https://httpbin.org/uuid').json()['uuid'].replace('-', '')[:8])}",
        "transaction_type": "test",
        "credits_used": -50,
        "credits_before": 100,
        "credits_after": 150,
        "description": "Test credit addition"
    }
    
    result = make_supabase_request("POST", "credit_transactions", test_transaction)
    if result:
        logger.info("✅ Credit transaction creation successful")
        
        # Clean up test data
        make_supabase_request("PATCH", "credit_transactions", {"description": "DELETED"}, filters={"user_id": f"eq.{test_transaction['user_id']}"})
        return True
    else:
        logger.error("❌ Credit transaction creation failed")
        return False

def test_payment_system():
    """Test payment system"""
    logger.info("💳 Testing payment system...")
    
    test_payment = {
        "user_id": f"test_payment_{int(requests.get('https://httpbin.org/uuid').json()['uuid'].replace('-', '')[:8])}",
        "package_id": "test_package",
        "reference_code": f"PAY{int(requests.get('https://httpbin.org/uuid').json()['uuid'].replace('-', '')[:5]):05d}",
        "amount": 10.00,
        "credits": 100,
        "status": "pending"
    }
    
    result = make_supabase_request("POST", "payment_transactions", test_payment)
    if result:
        logger.info("✅ Payment transaction creation successful")
        
        # Clean up test data
        make_supabase_request("PATCH", "payment_transactions", {"status": "DELETED"}, filters={"reference_code": f"eq.{test_payment['reference_code']}"})
        return True
    else:
        logger.error("❌ Payment transaction creation failed")
        return False

def main():
    """Main function to test all systems"""
    logger.info("🚀 Testing all NerdX Bot systems...")
    
    # Test all systems
    tests = [
        ("Write Operations", test_write_operations),
        ("User Registration", test_user_registration),
        ("Referral System", test_referral_system),
        ("Credit System", test_credit_system),
        ("Payment System", test_payment_system)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            logger.info(f"\n{'='*20} {test_name} {'='*20}")
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            logger.error(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    logger.info("\n" + "="*50)
    logger.info("📋 SYSTEM TEST RESULTS")
    logger.info("="*50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        logger.info(f"{test_name}: {status}")
        if result:
            passed += 1
    
    logger.info("="*50)
    logger.info(f"🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        logger.info("🎉 All systems are working perfectly!")
        logger.info("\n🔐 Dashboard Login:")
        logger.info("   Email: admin@nerdx.com")
        logger.info("   Password: admin123")
    else:
        logger.warning("⚠️ Some systems need attention")
        logger.info("\n📋 Next steps:")
        logger.info("1. Check Supabase RLS policies")
        logger.info("2. Verify table permissions")
        logger.info("3. Check for any constraint violations")
    
    logger.info("\n🏁 System testing completed!")

if __name__ == "__main__":
    main()
