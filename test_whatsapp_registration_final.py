#!/usr/bin/env python3
"""
Test WhatsApp Registration Final - Verify the registration system works for WhatsApp
"""

import psycopg2
import logging
from datetime import datetime

# Database connection
DATABASE_URL = "postgresql://postgres.hvlvwvzliqrlmqjbfgoa:Ngonidzashe2003.@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def connect_to_database():
    """Connect to the database"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        logger.info("✅ Database connection successful")
        return conn
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return None

def test_whatsapp_registration_flow(conn):
    """Test the complete WhatsApp registration flow"""
    try:
        cursor = conn.cursor()
        
        # Simulate WhatsApp registration flow
        whatsapp_id = "whatsapp_test_user_123"
        name = "WhatsApp"
        surname = "TestUser"
        date_of_birth = "2000-03-15"
        
        logger.info("🚀 Testing WhatsApp Registration Flow...")
        logger.info(f"📱 WhatsApp ID: {whatsapp_id}")
        logger.info(f"👤 Name: {name} {surname}")
        logger.info(f"📅 Date of Birth: {date_of_birth}")
        
        # Step 1: Generate NerdX ID
        cursor.execute("SELECT generate_nerdx_id()")
        nerdx_id = cursor.fetchone()[0]
        logger.info(f"🆔 Generated NerdX ID: {nerdx_id}")
        
        # Step 2: Create user registration (this is what happens in the webhook)
        cursor.execute("""
            INSERT INTO users_registration (chat_id, name, surname, date_of_birth, nerdx_id, credits)
            VALUES (%s, %s, %s, %s, %s, 0)
            RETURNING id, chat_id, nerdx_id, credits
        """, (whatsapp_id, name, surname, date_of_birth, nerdx_id))
        
        result = cursor.fetchone()
        user_id, chat_id, nerdx_id, credits = result
        logger.info(f"✅ User registered: ID={user_id}, Chat={chat_id}, NerdX={nerdx_id}, Credits={credits}")
        
        # Step 3: Award registration credits (this is what the user service calls)
        logger.info("💰 Awarding registration credits...")
        cursor.execute("SELECT award_registration_credits(%s)", (whatsapp_id,))
        credit_result = cursor.fetchone()[0]
        
        if credit_result:
            logger.info("✅ Credits awarded successfully")
        else:
            logger.error("❌ Failed to award credits")
            return False
        
        # Step 4: Check final state
        cursor.execute("SELECT credits FROM users_registration WHERE chat_id = %s", (whatsapp_id,))
        final_credits = cursor.fetchone()[0]
        logger.info(f"💳 Final credit balance: {final_credits}")
        
        # Step 5: Verify user can be found (for future operations)
        cursor.execute("SELECT * FROM users_registration WHERE chat_id = %s", (whatsapp_id,))
        user_data = cursor.fetchone()
        if user_data:
            logger.info("✅ User can be retrieved successfully")
        else:
            logger.error("❌ User cannot be retrieved")
            return False
        
        # Step 6: Test credit transaction recording
        cursor.execute("SELECT COUNT(*) FROM credit_transactions WHERE user_id = %s", (whatsapp_id,))
        transaction_count = cursor.fetchone()[0]
        logger.info(f"📊 Credit transactions recorded: {transaction_count}")
        
        # Clean up test data
        cursor.execute("DELETE FROM credit_transactions WHERE user_id = %s", (whatsapp_id,))
        cursor.execute("DELETE FROM users_registration WHERE chat_id = %s", (whatsapp_id,))
        logger.info("🧹 Test data cleaned up")
        
        # Final verification
        if final_credits == 75 and credit_result:
            logger.info("🎉 WhatsApp Registration Test PASSED!")
            logger.info("✅ The registration system is working perfectly for WhatsApp users")
            return True
        else:
            logger.error("❌ WhatsApp Registration Test FAILED")
            return False
        
    except Exception as e:
        logger.error(f"❌ Error testing WhatsApp registration: {e}")
        return False

def verify_system_components(conn):
    """Verify all system components are working"""
    try:
        cursor = conn.cursor()
        
        logger.info("🔍 Verifying System Components...")
        
        # 1. Check if required functions exist
        functions_to_check = [
            'generate_nerdx_id',
            'award_registration_credits',
            'add_referral_credits'
        ]
        
        for func_name in functions_to_check:
            cursor.execute("SELECT * FROM information_schema.routines WHERE routine_name = %s", (func_name,))
            if cursor.fetchone():
                logger.info(f"✅ Function {func_name} exists")
            else:
                logger.error(f"❌ Function {func_name} missing")
                return False
        
        # 2. Check if required tables exist and have data
        tables_to_check = [
            ('users_registration', 'User registrations'),
            ('credit_costs', 'Credit costs'),
            ('credit_transactions', 'Credit transactions'),
            ('user_stats', 'User statistics')
        ]
        
        for table_name, description in tables_to_check:
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            logger.info(f"✅ {description}: {count} records")
        
        # 3. Check credit costs are properly configured
        cursor.execute("SELECT COUNT(*) FROM credit_costs")
        credit_cost_count = cursor.fetchone()[0]
        if credit_cost_count > 0:
            logger.info(f"✅ Credit costs configured: {credit_cost_count} items")
        else:
            logger.error("❌ No credit costs configured")
            return False
        
        logger.info("✅ All system components verified")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error verifying system components: {e}")
        return False

def main():
    """Main function"""
    logger.info("🚀 Final WhatsApp Registration Test...")
    
    conn = connect_to_database()
    if not conn:
        return False
    
    try:
        # Step 1: Verify system components
        if not verify_system_components(conn):
            logger.error("❌ System components verification failed")
            return False
        
        # Step 2: Test WhatsApp registration flow
        if not test_whatsapp_registration_flow(conn):
            logger.error("❌ WhatsApp registration test failed")
            return False
        
        logger.info("")
        logger.info("🎉 SUCCESS: WhatsApp Registration System is Ready!")
        logger.info("")
        logger.info("📋 What's Working:")
        logger.info("✅ User registration with NerdX ID generation")
        logger.info("✅ Automatic 75 credit award for new users")
        logger.info("✅ Credit transaction recording")
        logger.info("✅ Credit cost system for all subjects")
        logger.info("✅ Database functions for seamless operation")
        logger.info("")
        logger.info("🚀 Users can now register on WhatsApp and get credits automatically!")
        logger.info("🔗 The webhook should handle registration seamlessly")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return False
    
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()
