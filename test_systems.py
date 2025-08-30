#!/usr/bin/env python3
"""
Test script to verify all NerdX Bot systems are working
"""
import os
import requests
import json
import logging
from datetime import datetime

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

def test_admin_authentication():
    """Test admin authentication system"""
    logger.info("\n🔐 Testing Admin Authentication System...")
    
    try:
        # Check if admin user exists
        result = make_supabase_request("GET", "admin_users", filters={"email": "eq.admin@nerdx.com"})
        if result and len(result) > 0:
            admin_user = result[0]
            logger.info(f"✅ Admin user found: {admin_user.get('email')} (Role: {admin_user.get('role')})")
            
            # Check admin_sessions table
            sessions_result = make_supabase_request("GET", "admin_sessions", limit=1)
            if sessions_result is not None:
                logger.info("✅ Admin sessions table accessible")
                return True
            else:
                logger.error("❌ Admin sessions table not accessible")
                return False
        else:
            logger.error("❌ Admin user not found - run fix_missing_tables.sql first")
            return False
    except Exception as e:
        logger.error(f"❌ Admin authentication test failed: {e}")
        return False

def test_user_registration():
    """Test user registration system"""
    logger.info("\n👥 Testing User Registration System...")
    
    try:
        # Test creating a user registration
        test_user = {
            "chat_id": f"test_chat_{int(datetime.now().timestamp())}",
            "name": "Test",
            "surname": "User",
            "date_of_birth": "1990-01-01",
            "nerdx_id": f"N{int(datetime.now().timestamp()) % 100000:05d}",
            "referred_by_nerdx_id": None
        }
        
        # Insert user registration
        result = make_supabase_request("POST", "users_registration", test_user)
        if result:
            logger.info("✅ User registration created successfully")
            user_id = result[0].get('id')
            
            # Test creating user stats
            user_stats = {
                "user_id": test_user["chat_id"],
                "username": test_user["name"].lower(),
                "first_name": test_user["name"],
                "credits": 100
            }
            
            stats_result = make_supabase_request("POST", "user_stats", user_stats)
            if stats_result:
                logger.info("✅ User stats created successfully")
                
                # Clean up test data
                make_supabase_request("PATCH", "users_registration", {"name": "DELETED"}, filters={"id": f"eq.{user_id}"})
                make_supabase_request("PATCH", "user_stats", {"first_name": "DELETED"}, filters={"user_id": f"eq.{test_user['chat_id']}"})
                
                logger.info("✅ User registration system test completed")
                return True
            else:
                logger.error("❌ Failed to create user stats")
                return False
        else:
            logger.error("❌ Failed to create user registration")
            return False
    except Exception as e:
        logger.error(f"❌ User registration test failed: {e}")
        return False

def test_referral_system():
    """Test referral system"""
    logger.info("\n🔗 Testing Referral System...")
    
    try:
        # Test creating referral codes
        test_referrer = {
            "user_id": f"test_referrer_{int(datetime.now().timestamp())}",
            "referral_code": f"REF{int(datetime.now().timestamp()) % 10000:04d}"
        }
        
        result = make_supabase_request("POST", "referral_codes", test_referrer)
        if result:
            logger.info("✅ Referral code created successfully")
            
            # Test creating referral tracking
            referral = {
                "referrer_id": test_referrer["user_id"],
                "referee_id": f"test_referee_{int(datetime.now().timestamp())}",
                "referral_code": test_referrer["referral_code"],
                "bonus_awarded": True
            }
            
            ref_result = make_supabase_request("POST", "referrals", referral)
            if ref_result:
                logger.info("✅ Referral tracking created successfully")
                
                # Test referral stats
                stats = {
                    "user_id": test_referrer["user_id"],
                    "total_referrals": 1,
                    "successful_referrals": 1,
                    "total_bonus_earned": 5
                }
                
                stats_result = make_supabase_request("POST", "referral_stats", stats)
                if stats_result:
                    logger.info("✅ Referral stats created successfully")
                    
                    # Clean up test data
                    make_supabase_request("PATCH", "referral_codes", {"referral_code": "DELETED"}, filters={"user_id": f"eq.{test_referrer['user_id']}"})
                    make_supabase_request("PATCH", "referrals", {"referral_code": "DELETED"}, filters={"referrer_id": f"eq.{test_referrer['user_id']}"})
                    make_supabase_request("PATCH", "referral_stats", {"total_referrals": 0}, filters={"user_id": f"eq.{test_referrer['user_id']}"})
                    
                    logger.info("✅ Referral system test completed")
                    return True
                else:
                    logger.error("❌ Failed to create referral stats")
                    return False
            else:
                logger.error("❌ Failed to create referral tracking")
                return False
        else:
            logger.error("❌ Failed to create referral code")
            return False
    except Exception as e:
        logger.error(f"❌ Referral system test failed: {e}")
        return False

def test_credit_system():
    """Test credit system"""
    logger.info("\n💰 Testing Credit System...")
    
    try:
        # Test creating credit transaction
        test_transaction = {
            "user_id": f"test_credit_user_{int(datetime.now().timestamp())}",
            "transaction_type": "test",
            "credits_used": -50,  # Negative for adding credits
            "credits_before": 100,
            "credits_after": 150,
            "description": "Test credit addition"
        }
        
        result = make_supabase_request("POST", "credit_transactions", test_transaction)
        if result:
            logger.info("✅ Credit transaction created successfully")
            
            # Test updating user credits
            update_result = make_supabase_request("PATCH", "user_stats", {"credits": 150}, filters={"user_id": f"eq.{test_transaction['user_id']}"})
            if update_result:
                logger.info("✅ User credits updated successfully")
                
                # Clean up test data
                make_supabase_request("PATCH", "credit_transactions", {"description": "DELETED"}, filters={"user_id": f"eq.{test_transaction['user_id']}"})
                
                logger.info("✅ Credit system test completed")
                return True
            else:
                logger.error("❌ Failed to update user credits")
                return False
        else:
            logger.error("❌ Failed to create credit transaction")
            return False
    except Exception as e:
        logger.error(f"❌ Credit system test failed: {e}")
        return False

def test_payment_system():
    """Test payment system"""
    logger.info("\n💳 Testing Payment System...")
    
    try:
        # Test creating payment transaction
        test_payment = {
            "user_id": f"test_payment_user_{int(datetime.now().timestamp())}",
            "package_id": "test_package",
            "reference_code": f"PAY{int(datetime.now().timestamp()) % 100000:05d}",
            "amount": 10.00,
            "credits": 100,
            "status": "pending"
        }
        
        result = make_supabase_request("POST", "payment_transactions", test_payment)
        if result:
            logger.info("✅ Payment transaction created successfully")
            
            # Test updating payment status
            update_result = make_supabase_request("PATCH", "payment_transactions", {"status": "completed"}, filters={"reference_code": f"eq.{test_payment['reference_code']}"})
            if update_result:
                logger.info("✅ Payment status updated successfully")
                
                # Clean up test data
                make_supabase_request("PATCH", "payment_transactions", {"status": "DELETED"}, filters={"reference_code": f"eq.{test_payment['reference_code']}"})
                
                logger.info("✅ Payment system test completed")
                return True
            else:
                logger.error("❌ Failed to update payment status")
                return False
        else:
            logger.error("❌ Failed to create payment transaction")
            return False
    except Exception as e:
        logger.error(f"❌ Payment system test failed: {e}")
        return False

def main():
    """Main test function"""
    logger.info("🧪 Starting NerdX Bot System Tests...")
    
    # Run all tests
    tests = [
        ("Admin Authentication", test_admin_authentication),
        ("User Registration", test_user_registration),
        ("Referral System", test_referral_system),
        ("Credit System", test_credit_system),
        ("Payment System", test_payment_system)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            logger.error(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    logger.info("\n" + "="*50)
    logger.info("📋 TEST RESULTS SUMMARY")
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
    else:
        logger.info("⚠️ Some systems need attention")
    
    logger.info("\n🏁 System testing completed!")

if __name__ == "__main__":
    main()



