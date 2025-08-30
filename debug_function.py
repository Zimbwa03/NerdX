#!/usr/bin/env python3
"""
Debug Function - Check what's wrong with the credit function
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

def debug_function(conn):
    """Debug the credit function step by step"""
    try:
        cursor = conn.cursor()
        
        # Test data
        test_chat_id = "debug_user_123"
        test_name = "Debug"
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
        
        # 4. Test the UPDATE part manually
        logger.info("Testing UPDATE manually...")
        cursor.execute("""
            UPDATE users_registration 
            SET credits = 75 
            WHERE chat_id = %s AND (credits = 0 OR credits IS NULL)
        """, (test_chat_id,))
        
        update_count = cursor.rowcount
        logger.info(f"UPDATE affected {update_count} rows")
        
        # 5. Check if FOUND would be true
        cursor.execute("SELECT FOUND")
        found_result = cursor.fetchone()[0]
        logger.info(f"FOUND result: {found_result}")
        
        # 6. Check final credits
        cursor.execute("SELECT credits FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        final_credits = cursor.fetchone()[0]
        logger.info(f"Final credits: {final_credits}")
        
        # 7. Test transaction insert manually
        if final_credits == 75:
            logger.info("Testing transaction insert manually...")
            cursor.execute("""
                INSERT INTO credit_transactions (user_id, action, credits_change, balance_before, balance_after, description, transaction_type)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (test_chat_id, 'registration_bonus', 75, 0, 75, 'Welcome bonus credits', 'registration_bonus'))
            
            logger.info("Transaction inserted successfully")
        
        # Clean up
        cursor.execute("DELETE FROM credit_transactions WHERE user_id = %s", (test_chat_id,))
        cursor.execute("DELETE FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        logger.info("Test data cleaned up")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Error debugging function: {e}")
        return False

def main():
    """Main function"""
    logger.info("🔍 Debugging Credit Function...")
    
    conn = connect_to_database()
    if not conn:
        return False
    
    try:
        success = debug_function(conn)
        if success:
            logger.info("✅ Debug completed")
        else:
            logger.error("❌ Debug failed")
        return success
        
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()
