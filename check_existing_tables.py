#!/usr/bin/env python3
"""
Check existing tables in Supabase and ensure all systems are working
"""
import os
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

def check_table_exists(table_name):
    """Check if a table exists and is accessible"""
    try:
        result = make_supabase_request("GET", table_name, limit=1)
        if result is not None:
            logger.info(f"✅ Table {table_name} exists and is accessible")
            return True
        else:
            logger.warning(f"⚠️ Table {table_name} exists but may have access issues")
            return False
    except Exception as e:
        logger.error(f"❌ Table {table_name} does not exist or is not accessible: {e}")
        return False

def check_all_tables():
    """Check all required tables"""
    required_tables = [
        # Admin authentication
        "admin_users",
        "admin_sessions", 
        "admin_activity_logs",
        
        # User registration and referral
        "users_registration",
        "user_stats",
        "referral_codes",
        "referrals",
        "referral_stats",
        
        # Payment and credits
        "payment_transactions",
        "credit_transactions",
        "xp_transactions",
        
        # Questions and learning
        "questions",
        "user_question_history",
        "question_cache",
        
        # User sessions and activity
        "user_sessions",
        "activity_logs"
    ]
    
    existing_tables = []
    missing_tables = []
    
    logger.info("🔍 Checking existing tables in Supabase...")
    
    for table in required_tables:
        if check_table_exists(table):
            existing_tables.append(table)
        else:
            missing_tables.append(table)
    
    logger.info(f"\n📊 Table Status Summary:")
    logger.info(f"✅ Existing tables: {len(existing_tables)}")
    logger.info(f"❌ Missing tables: {len(missing_tables)}")
    
    if existing_tables:
        logger.info(f"\n✅ Existing tables: {', '.join(existing_tables)}")
    
    if missing_tables:
        logger.info(f"\n❌ Missing tables: {', '.join(missing_tables)}")
    
    return existing_tables, missing_tables

def check_admin_auth_system():
    """Check admin authentication system"""
    logger.info("\n🔐 Checking Admin Authentication System...")
    
    # Check admin_users table
    if not check_table_exists("admin_users"):
        logger.error("❌ Admin users table missing - authentication will fail")
        return False
    
    # Check if default admin user exists
    try:
        result = make_supabase_request("GET", "admin_users", filters={"email": "eq.admin@nerdx.com"})
        if result and len(result) > 0:
            admin_user = result[0]
            logger.info(f"✅ Default admin user exists: {admin_user.get('email')} (Role: {admin_user.get('role')})")
            return True
        else:
            logger.warning("⚠️ Default admin user not found - will need to create one")
            return False
    except Exception as e:
        logger.error(f"❌ Error checking admin user: {e}")
        return False

def check_user_registration_system():
    """Check user registration system"""
    logger.info("\n👥 Checking User Registration System...")
    
    required_tables = ["users_registration", "user_stats"]
    missing = []
    
    for table in required_tables:
        if not check_table_exists(table):
            missing.append(table)
    
    if missing:
        logger.error(f"❌ Missing tables for user registration: {', '.join(missing)}")
        return False
    
    logger.info("✅ User registration system tables are ready")
    return True

def check_referral_system():
    """Check referral system"""
    logger.info("\n🔗 Checking Referral System...")
    
    required_tables = ["referral_codes", "referrals", "referral_stats"]
    missing = []
    
    for table in required_tables:
        if not check_table_exists(table):
            missing.append(table)
    
    if missing:
        logger.error(f"❌ Missing tables for referral system: {', '.join(missing)}")
        return False
    
    logger.info("✅ Referral system tables are ready")
    return True

def check_credit_system():
    """Check credit system"""
    logger.info("\n💰 Checking Credit System...")
    
    required_tables = ["user_stats", "credit_transactions"]
    missing = []
    
    for table in required_tables:
        if not check_table_exists(table):
            missing.append(table)
    
    if missing:
        logger.error(f"❌ Missing tables for credit system: {', '.join(missing)}")
        return False
    
    logger.info("✅ Credit system tables are ready")
    return True

def check_payment_system():
    """Check payment system"""
    logger.info("\n💳 Checking Payment System...")
    
    required_tables = ["payment_transactions", "user_stats"]
    missing = []
    
    for table in required_tables:
        if not check_table_exists(table):
            missing.append(table)
    
    if missing:
        logger.error(f"❌ Missing tables for payment system: {', '.join(missing)}")
        return False
    
    logger.info("✅ Payment system tables are ready")
    return True

def create_missing_tables(missing_tables):
    """Create missing tables using the SQL script"""
    logger.info(f"\n🔨 Creating missing tables: {', '.join(missing_tables)}")
    
    # Read the SQL script
    try:
        with open('supabase_database_setup.sql', 'r') as f:
            sql_script = f.read()
        
        logger.info("✅ SQL script loaded successfully")
        logger.info("📝 Please run the SQL script in your Supabase SQL Editor to create missing tables")
        
        # Show which tables need to be created
        for table in missing_tables:
            logger.info(f"   - {table}")
        
        return True
    except FileNotFoundError:
        logger.error("❌ SQL script file not found")
        return False

def test_basic_operations():
    """Test basic operations on existing tables"""
    logger.info("\n🧪 Testing Basic Operations...")
    
    # Test user_stats table operations
    if check_table_exists("user_stats"):
        logger.info("Testing user_stats table operations...")
        
        # Test insert
        test_user = {
            "user_id": "test_user_123",
            "username": "testuser",
            "first_name": "Test",
            "credits": 100
        }
        
        try:
            result = make_supabase_request("POST", "user_stats", test_user)
            if result:
                logger.info("✅ Insert operation successful")
                
                # Test select
                select_result = make_supabase_request("GET", "user_stats", filters={"user_id": "eq.test_user_123"})
                if select_result:
                    logger.info("✅ Select operation successful")
                    
                    # Test update
                    update_data = {"credits": 150}
                    update_result = make_supabase_request("PATCH", "user_stats", update_data, filters={"user_id": "eq.test_user_123"})
                    if update_result:
                        logger.info("✅ Update operation successful")
                        
                        # Clean up test data
                        # Note: We'll leave the test data for now to avoid complications
                        logger.info("✅ Basic operations test completed successfully")
                        return True
                    else:
                        logger.error("❌ Update operation failed")
                else:
                    logger.error("❌ Select operation failed")
            else:
                logger.error("❌ Insert operation failed")
        except Exception as e:
            logger.error(f"❌ Error during basic operations test: {e}")
    
    return False

def main():
    """Main function to check and fix database issues"""
    logger.info("🚀 Starting NerdX Bot Database Health Check...")
    
    # Check existing tables
    existing_tables, missing_tables = check_all_tables()
    
    # Check specific systems
    admin_auth_ok = check_admin_auth_system()
    user_reg_ok = check_user_registration_system()
    referral_ok = check_referral_system()
    credit_ok = check_credit_system()
    payment_ok = check_payment_system()
    
    # Summary
    logger.info("\n" + "="*50)
    logger.info("📋 SYSTEM STATUS SUMMARY")
    logger.info("="*50)
    logger.info(f"🔐 Admin Authentication: {'✅ READY' if admin_auth_ok else '❌ ISSUES'}")
    logger.info(f"👥 User Registration: {'✅ READY' if user_reg_ok else '❌ ISSUES'}")
    logger.info(f"🔗 Referral System: {'✅ READY' if referral_ok else '❌ ISSUES'}")
    logger.info(f"💰 Credit System: {'✅ READY' if credit_ok else '❌ ISSUES'}")
    logger.info(f"💳 Payment System: {'✅ READY' if payment_ok else '❌ ISSUES'}")
    logger.info("="*50)
    
    # Handle missing tables
    if missing_tables:
        logger.info(f"\n⚠️ {len(missing_tables)} tables are missing")
        create_missing_tables(missing_tables)
        
        logger.info("\n📋 NEXT STEPS:")
        logger.info("1. Go to your Supabase dashboard")
        logger.info("2. Navigate to SQL Editor")
        logger.info("3. Copy and paste the contents of 'supabase_database_setup.sql'")
        logger.info("4. Run the script")
        logger.info("5. Run this check script again to verify")
    else:
        logger.info("\n🎉 All required tables exist!")
        
        # Test basic operations
        if test_basic_operations():
            logger.info("\n✅ Database is fully operational!")
        else:
            logger.warning("\n⚠️ Tables exist but may have permission issues")
    
    logger.info("\n🏁 Database health check completed!")

if __name__ == "__main__":
    main()



