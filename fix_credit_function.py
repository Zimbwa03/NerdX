#!/usr/bin/env python3
"""
Fix Credit Function - Create a working credit awarding function
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

def fix_credit_function(conn):
    """Fix the credit awarding function with simpler syntax"""
    try:
        cursor = conn.cursor()
        
        # Drop the existing function
        cursor.execute("DROP FUNCTION IF EXISTS award_registration_credits(VARCHAR)")
        
        # Create a simpler version
        cursor.execute("""
            CREATE OR REPLACE FUNCTION award_registration_credits(user_whatsapp_id VARCHAR)
            RETURNS BOOLEAN
            LANGUAGE plpgsql
            AS $$
            BEGIN
                -- Update credits for new user
                UPDATE users_registration 
                SET credits = 75 
                WHERE chat_id = user_whatsapp_id AND (credits = 0 OR credits IS NULL);
                
                -- Check if update was successful
                IF FOUND THEN
                    -- Record the transaction
                    INSERT INTO credit_transactions (user_id, action, credits_change, balance_before, balance_after, description, transaction_type)
                    VALUES (user_whatsapp_id, 'registration_bonus', 75, 0, 75, 'Welcome bonus credits', 'registration_bonus');
                    
                    RETURN TRUE;
                ELSE
                    RETURN FALSE;
                END IF;
                
            EXCEPTION
                WHEN OTHERS THEN
                    RETURN FALSE;
            END;
            $$;
        """)
        
        logger.info("✅ Credit function fixed successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error fixing credit function: {e}")
        return False

def test_fixed_function(conn):
    """Test the fixed function"""
    try:
        cursor = conn.cursor()
        
        # Test data
        test_chat_id = "test_user_fixed"
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
        
        # 3. Test the fixed function
        logger.info("Testing fixed award_registration_credits function...")
        cursor.execute("SELECT award_registration_credits(%s)", (test_chat_id,))
        function_result = cursor.fetchone()[0]
        logger.info(f"Function result: {function_result}")
        
        # 4. Check final state
        cursor.execute("SELECT credits FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        final_credits = cursor.fetchone()[0]
        logger.info(f"Final credits: {final_credits}")
        
        # 5. Check transactions
        cursor.execute("SELECT COUNT(*) FROM credit_transactions WHERE user_id = %s", (test_chat_id,))
        transaction_count = cursor.fetchone()[0]
        logger.info(f"Transactions created: {transaction_count}")
        
        # Clean up
        cursor.execute("DELETE FROM credit_transactions WHERE user_id = %s", (test_chat_id,))
        cursor.execute("DELETE FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        logger.info("Test data cleaned up")
        
        if function_result and final_credits == 75:
            logger.info("✅ Credit function is now working correctly!")
            return True
        else:
            logger.error("❌ Credit function still has issues")
            return False
        
    except Exception as e:
        logger.error(f"❌ Error testing fixed function: {e}")
        return False

def main():
    """Main function"""
    logger.info("🔧 Fixing Credit Function...")
    
    conn = connect_to_database()
    if not conn:
        return False
    
    try:
        # Step 1: Fix the function
        if not fix_credit_function(conn):
            logger.error("❌ Failed to fix credit function")
            return False
        
        # Step 2: Test the fixed function
        if not test_fixed_function(conn):
            logger.error("❌ Fixed function test failed")
            return False
        
        logger.info("🎉 Credit function fix completed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return False
    
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()
