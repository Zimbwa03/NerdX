#!/usr/bin/env python3
"""
Comprehensive Registration Fix - Ensure the registration system works seamlessly
This script creates a working registration system that matches the existing database schema
"""

import psycopg2
import logging
from datetime import datetime
import sys

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

def create_simple_registration_function(conn):
    """Create a simple, working registration function"""
    try:
        cursor = conn.cursor()
        
        # Drop existing functions
        cursor.execute("DROP FUNCTION IF EXISTS award_registration_credits(VARCHAR)")
        cursor.execute("DROP FUNCTION IF EXISTS add_referral_credits(TEXT, VARCHAR)")
        
        # Create a very simple registration function
        cursor.execute("""
            CREATE OR REPLACE FUNCTION award_registration_credits(user_whatsapp_id VARCHAR)
            RETURNS BOOLEAN
            LANGUAGE plpgsql
            AS $$
            BEGIN
                -- Simply update credits to 75
                UPDATE users_registration 
                SET credits = 75 
                WHERE chat_id = user_whatsapp_id;
                
                -- Always return true if we get here
                RETURN TRUE;
            EXCEPTION
                WHEN OTHERS THEN
                    RETURN FALSE;
            END;
            $$;
        """)
        
        # Create a simple referral function
        cursor.execute("""
            CREATE OR REPLACE FUNCTION add_referral_credits(referred_by_nerdx_id TEXT, new_user_chat_id VARCHAR)
            RETURNS BOOLEAN
            LANGUAGE plpgsql
            AS $$
            BEGIN
                -- Add 5 credits to referrer
                UPDATE users_registration 
                SET credits = COALESCE(credits, 0) + 5
                WHERE nerdx_id = referred_by_nerdx_id;
                
                -- Add 5 credits to new user
                UPDATE users_registration 
                SET credits = COALESCE(credits, 0) + 5
                WHERE chat_id = new_user_chat_id;
                
                RETURN TRUE;
            EXCEPTION
                WHEN OTHERS THEN
                    RETURN FALSE;
            END;
            $$;
        """)
        
        logger.info("✅ Simple registration functions created successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creating functions: {e}")
        return False

def test_registration_system(conn):
    """Test the complete registration system"""
    try:
        cursor = conn.cursor()
        
        # Test data
        test_chat_id = "comprehensive_test_user"
        test_name = "Comprehensive"
        test_surname = "Test"
        test_dob = "2000-03-15"
        
        # 1. Generate NerdX ID
        cursor.execute("SELECT generate_nerdx_id()")
        nerdx_id = cursor.fetchone()[0]
        logger.info(f"Generated NerdX ID: {nerdx_id}")
        
        # 2. Create test user
        cursor.execute("""
            INSERT INTO users_registration (chat_id, name, surname, date_of_birth, nerdx_id, credits)
            VALUES (%s, %s, %s, %s, %s, 0)
            RETURNING id, chat_id, nerdx_id, credits
        """, (test_chat_id, test_name, test_surname, test_dob, nerdx_id))
        
        result = cursor.fetchone()
        user_id, chat_id, nerdx_id, credits = result
        logger.info(f"User created: ID={user_id}, Chat={chat_id}, NerdX={nerdx_id}, Credits={credits}")
        
        # 3. Test credit awarding
        logger.info("Testing credit awarding...")
        cursor.execute("SELECT award_registration_credits(%s)", (test_chat_id,))
        credit_result = cursor.fetchone()[0]
        logger.info(f"Credit function result: {credit_result}")
        
        # 4. Check final credits
        cursor.execute("SELECT credits FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        final_credits = cursor.fetchone()[0]
        logger.info(f"Final credits: {final_credits}")
        
        # 5. Test referral system
        logger.info("Testing referral system...")
        cursor.execute("SELECT add_referral_credits(%s, %s)", (nerdx_id, test_chat_id))
        referral_result = cursor.fetchone()[0]
        logger.info(f"Referral function result: {referral_result}")
        
        # 6. Check final credits after referral
        cursor.execute("SELECT credits FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        referral_credits = cursor.fetchone()[0]
        logger.info(f"Credits after referral: {referral_credits}")
        
        # Clean up
        cursor.execute("DELETE FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        logger.info("Test data cleaned up")
        
        # Verify success
        if credit_result and final_credits == 75 and referral_result and referral_credits == 80:
            logger.info("✅ Registration system is working perfectly!")
            return True
        else:
            logger.error("❌ Registration system has issues")
            return False
        
    except Exception as e:
        logger.error(f"❌ Error testing registration system: {e}")
        return False

def update_credit_costs_final(conn):
    """Update credit costs with the correct structure"""
    try:
        cursor = conn.cursor()
        
        # Clear existing data
        cursor.execute("DELETE FROM credit_costs")
        
        # Insert credit costs using the existing column structure
        credit_costs_data = [
            ('combined_science_topical', 1, 'science', 'questions', 'Combined Science topical questions'),
            ('combined_science_exam', 1, 'science', 'questions', 'Combined Science exam questions'),
            ('mathematics_topical', 2, 'mathematics', 'questions', 'Mathematics topical questions'),
            ('mathematics_exam', 1, 'mathematics', 'questions', 'Mathematics exam questions'),
            ('mathematics_graphs', 3, 'mathematics', 'graphs', 'Mathematics graph generation'),
            ('english_topical', 1, 'english', 'questions', 'English topical questions'),
            ('english_comprehension', 3, 'english', 'comprehension', 'English comprehension questions'),
            ('english_essay', 3, 'english', 'essay', 'English essay writing'),
            ('audio_generation', 10, 'audio', 'audio', 'Audio generation cost'),
        ]
        
        for cost_data in credit_costs_data:
            cursor.execute("""
                INSERT INTO credit_costs (action_key, cost, category, component, description)
                VALUES (%s, %s, %s, %s, %s)
            """, cost_data)
        
        logger.info("✅ Credit costs updated successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error updating credit costs: {e}")
        return False

def main():
    """Main function to fix the registration system comprehensively"""
    logger.info("🚀 Starting Comprehensive Registration Fix...")
    
    # Connect to database
    conn = connect_to_database()
    if not conn:
        logger.error("❌ Cannot proceed without database connection")
        return False
    
    try:
        # Step 1: Create simple, working functions
        if not create_simple_registration_function(conn):
            logger.error("❌ Failed to create registration functions")
            return False
        
        # Step 2: Update credit costs
        if not update_credit_costs_final(conn):
            logger.error("❌ Failed to update credit costs")
            return False
        
        # Step 3: Test the complete system
        if not test_registration_system(conn):
            logger.error("❌ Registration system test failed")
            return False
        
        logger.info("🎉 Comprehensive registration fix completed successfully!")
        logger.info("")
        logger.info("📋 What's now working:")
        logger.info("✅ User registration with NerdX ID generation")
        logger.info("✅ Automatic 75 credit award for new users")
        logger.info("✅ Referral system with 5 credit bonus")
        logger.info("✅ Credit cost system for all subjects")
        logger.info("✅ Database functions for seamless operation")
        logger.info("")
        logger.info("🚀 The WhatsApp registration should now work seamlessly!")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return False
    
    finally:
        if conn:
            conn.close()
            logger.info("Database connection closed")

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
