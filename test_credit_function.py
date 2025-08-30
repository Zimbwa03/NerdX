#!/usr/bin/env python3
"""
Test Credit Function - Debug the credit awarding function
"""

import psycopg2
import logging

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

def test_credit_function(conn):
    """Test the credit awarding function step by step"""
    try:
        cursor = conn.cursor()
        
        # Test data
        test_chat_id = "test_user_789"
        test_name = "Test"
        test_surname = "User"
        test_dob = "2000-03-15"
        
        # 1. Generate NerdX ID
        cursor.execute("SELECT generate_nerdx_id()")
        nerdx_id = cursor.fetchone()[0]
        logger.info(f"Generated NerdX ID: {nerdx_id}")
        
        # 2. Insert test user
        cursor.execute("""
            INSERT INTO users_registration (chat_id, name, surname, date_of_birth, nerdx_id, credits)
            VALUES (%s, %s, %s, %s, %s, 0)
            RETURNING id, chat_id, nerdx_id, credits
        """, (test_chat_id, test_name, test_surname, test_dob, nerdx_id))
        
        result = cursor.fetchone()
        user_id, chat_id, nerdx_id, credits = result
        logger.info(f"User created: ID={user_id}, Chat={chat_id}, NerdX={nerdx_id}, Credits={credits}")
        
        # 3. Check current state
        cursor.execute("SELECT credits FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        current_credits = cursor.fetchone()[0]
        logger.info(f"Current credits: {current_credits}")
        
        # 4. Test the function directly
        logger.info("Testing award_registration_credits function...")
        cursor.execute("SELECT award_registration_credits(%s)", (test_chat_id,))
        function_result = cursor.fetchone()[0]
        logger.info(f"Function result: {function_result}")
        
        # 5. Check final state
        cursor.execute("SELECT credits FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        final_credits = cursor.fetchone()[0]
        logger.info(f"Final credits: {final_credits}")
        
        # 6. Check transactions
        cursor.execute("SELECT COUNT(*) FROM credit_transactions WHERE user_id = %s", (test_chat_id,))
        transaction_count = cursor.fetchone()[0]
        logger.info(f"Transactions created: {transaction_count}")
        
        # Clean up
        cursor.execute("DELETE FROM credit_transactions WHERE user_id = %s", (test_chat_id,))
        cursor.execute("DELETE FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        logger.info("Test data cleaned up")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Error testing credit function: {e}")
        return False

def main():
    """Main function"""
    logger.info("🔍 Testing Credit Function...")
    
    conn = connect_to_database()
    if not conn:
        return False
    
    try:
        success = test_credit_function(conn)
        if success:
            logger.info("✅ Credit function test completed")
        else:
            logger.error("❌ Credit function test failed")
        return success
        
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()
