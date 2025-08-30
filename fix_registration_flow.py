#!/usr/bin/env python3
"""
Fix Registration Flow - Work with existing table structure
This script ensures the registration system works with the current database schema
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

def create_missing_functions(conn):
    """Create necessary database functions for registration"""
    try:
        cursor = conn.cursor()
        
        # Function to generate NerdX ID
        logger.info("Creating generate_nerdx_id function...")
        cursor.execute("""
            CREATE OR REPLACE FUNCTION generate_nerdx_id()
            RETURNS TEXT
            LANGUAGE plpgsql
            AS $$
            DECLARE
                new_id TEXT;
                counter INTEGER := 0;
            BEGIN
                LOOP
                    -- Generate ID: N + 5 random alphanumeric characters
                    new_id := 'N' || 
                              chr(65 + (random() * 25)::INTEGER) ||  -- A-Z
                              chr(65 + (random() * 25)::INTEGER) ||  -- A-Z
                              chr(48 + (random() * 10)::INTEGER) ||  -- 0-9
                              chr(48 + (random() * 10)::INTEGER) ||  -- 0-9
                              chr(48 + (random() * 10)::INTEGER);    -- 0-9
                    
                    -- Check if ID already exists
                    IF NOT EXISTS (SELECT 1 FROM users_registration WHERE nerdx_id = new_id) THEN
                        RETURN new_id;
                    END IF;
                    
                    counter := counter + 1;
                    IF counter > 100 THEN
                        RAISE EXCEPTION 'Unable to generate unique NerdX ID after 100 attempts';
                    END IF;
                END LOOP;
            END;
            $$;
        """)
        
        # Function to award registration credits
        logger.info("Creating award_registration_credits function...")
        cursor.execute("""
            CREATE OR REPLACE FUNCTION award_registration_credits(user_whatsapp_id VARCHAR)
            RETURNS BOOLEAN
            LANGUAGE plpgsql
            AS $$
            DECLARE
                user_nerdx_id TEXT;
                current_credits INTEGER;
            BEGIN
                -- Get user's NerdX ID
                SELECT nerdx_id INTO user_nerdx_id 
                FROM users_registration 
                WHERE chat_id = user_whatsapp_id;
                
                IF user_nerdx_id IS NULL THEN
                    RETURN FALSE;
                END IF;
                
                -- Get current credits
                SELECT COALESCE(credits, 0) INTO current_credits
                FROM users_registration
                WHERE chat_id = user_whatsapp_id;
                
                -- Award 75 credits for new user (if they don't have credits yet)
                IF current_credits = 0 OR current_credits IS NULL THEN
                    UPDATE users_registration 
                    SET credits = 75 
                    WHERE chat_id = user_whatsapp_id;
                    
                    -- Record the transaction
                    INSERT INTO credit_transactions (user_id, action, credits_change, balance_before, balance_after, description, transaction_type)
                    VALUES (user_whatsapp_id, 'registration_bonus', 75, 0, 75, 'Welcome bonus credits', 'registration_bonus');
                END IF;
                
                RETURN TRUE;
            EXCEPTION
                WHEN OTHERS THEN
                    RETURN FALSE;
            END;
            $$;
        """)
        
        # Function to add referral credits
        logger.info("Creating add_referral_credits function...")
        cursor.execute("""
            CREATE OR REPLACE FUNCTION add_referral_credits(referred_by_nerdx_id TEXT, new_user_chat_id VARCHAR)
            RETURNS BOOLEAN
            LANGUAGE plpgsql
            AS $$
            DECLARE
                referrer_chat_id VARCHAR;
                referrer_name VARCHAR;
                new_user_name VARCHAR;
                referral_bonus INTEGER := 5;
            BEGIN
                -- Get the referrer's information
                SELECT chat_id, name INTO referrer_chat_id, referrer_name
                FROM users_registration 
                WHERE nerdx_id = referred_by_nerdx_id;
                
                IF referrer_chat_id IS NULL THEN
                    RETURN FALSE;
                END IF;
                
                -- Get the new user's information
                SELECT name INTO new_user_name
                FROM users_registration
                WHERE chat_id = new_user_chat_id;
                
                -- Add referral bonus credits to referrer
                UPDATE users_registration 
                SET credits = COALESCE(credits, 0) + referral_bonus
                WHERE chat_id = referrer_chat_id;
                
                -- Record the transaction for referrer
                INSERT INTO credit_transactions (user_id, action, credits_change, balance_before, balance_after, description, transaction_type)
                SELECT chat_id, 'referral_bonus', referral_bonus, COALESCE(credits, 0), COALESCE(credits, 0) + referral_bonus, 
                       format('Referral bonus: %s joined using your code', new_user_name), 'referral_bonus'
                FROM users_registration
                WHERE chat_id = referrer_chat_id;
                
                -- Add referral bonus to new user too
                UPDATE users_registration 
                SET credits = COALESCE(credits, 0) + referral_bonus
                WHERE chat_id = new_user_chat_id;
                
                -- Record the transaction for new user
                INSERT INTO credit_transactions (user_id, action, credits_change, balance_before, balance_after, description, transaction_type)
                SELECT chat_id, 'referral_bonus', referral_bonus, COALESCE(credits, 0) - referral_bonus, COALESCE(credits, 0), 
                       format('Referral signup bonus via %s', referred_by_nerdx_id), 'referral_bonus'
                FROM users_registration
                WHERE chat_id = new_user_chat_id;
                
                RETURN TRUE;
                
            EXCEPTION
                WHEN OTHERS THEN
                    RETURN FALSE;
            END;
            $$;
        """)
        
        logger.info("✅ Database functions created successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creating functions: {e}")
        return False

def update_credit_costs(conn):
    """Update credit costs to match the existing table structure"""
    try:
        cursor = conn.cursor()
        
        # Clear existing data
        cursor.execute("DELETE FROM credit_costs")
        
        # Insert credit costs based on user specifications, using existing column names
        credit_costs_data = [
            # Combined Science
            ('combined_science_topical', 1, 'science', 'questions', 'Combined Science topical questions'),
            ('combined_science_exam', 1, 'science', 'questions', 'Combined Science exam questions'),
            
            # Mathematics
            ('mathematics_topical', 2, 'mathematics', 'questions', 'Mathematics topical questions'),
            ('mathematics_exam', 1, 'mathematics', 'questions', 'Mathematics exam questions'),
            ('mathematics_graphs', 3, 'mathematics', 'graphs', 'Mathematics graph generation'),
            
            # English
            ('english_topical', 1, 'english', 'questions', 'English topical questions'),
            ('english_comprehension', 3, 'english', 'comprehension', 'English comprehension questions'),
            ('english_essay', 3, 'english', 'essay', 'English essay writing'),
            
            # Audio Generation
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

def test_registration_flow(conn):
    """Test the registration flow with a sample user"""
    try:
        cursor = conn.cursor()
        
        # Test data
        test_chat_id = "test_user_456"
        test_name = "Test"
        test_surname = "User"
        test_dob = "2000-03-15"  # Using date format
        
        # 1. Test NerdX ID generation
        logger.info("Testing NerdX ID generation...")
        cursor.execute("SELECT generate_nerdx_id()")
        nerdx_id = cursor.fetchone()[0]
        logger.info(f"Generated NerdX ID: {nerdx_id}")
        
        # 2. Test user registration
        logger.info("Testing user registration...")
        cursor.execute("""
            INSERT INTO users_registration (chat_id, name, surname, date_of_birth, nerdx_id, credits)
            VALUES (%s, %s, %s, %s, %s, 0)
            RETURNING id, chat_id, nerdx_id, credits
        """, (test_chat_id, test_name, test_surname, test_dob, nerdx_id))
        
        result = cursor.fetchone()
        if result:
            user_id, chat_id, nerdx_id, credits = result
            logger.info(f"User registered: ID={user_id}, Chat={chat_id}, NerdX={nerdx_id}, Credits={credits}")
        else:
            logger.error("Failed to register test user")
            return False
        
        # 3. Test credit awarding
        logger.info("Testing credit awarding...")
        cursor.execute("SELECT award_registration_credits(%s)", (test_chat_id,))
        credit_result = cursor.fetchone()[0]
        if credit_result:
            logger.info("✅ Credits awarded successfully")
        else:
            logger.error("❌ Failed to award credits")
            return False
        
        # 4. Check final state
        cursor.execute("SELECT credits FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        final_credits = cursor.fetchone()[0]
        logger.info(f"Final credit balance: {final_credits}")
        
        # 5. Check credit transactions
        cursor.execute("SELECT COUNT(*) FROM credit_transactions WHERE user_id = %s", (test_chat_id,))
        transaction_count = cursor.fetchone()[0]
        logger.info(f"Credit transactions created: {transaction_count}")
        
        # Clean up test data
        cursor.execute("DELETE FROM credit_transactions WHERE user_id = %s", (test_chat_id,))
        cursor.execute("DELETE FROM users_registration WHERE chat_id = %s", (test_chat_id,))
        logger.info("Test data cleaned up")
        
        logger.info("✅ Registration flow test completed successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error testing registration flow: {e}")
        return False

def main():
    """Main function to fix the registration flow"""
    logger.info("🚀 Starting Registration Flow Fix...")
    
    # Connect to database
    conn = connect_to_database()
    if not conn:
        logger.error("❌ Cannot proceed without database connection")
        return False
    
    try:
        # Step 1: Create necessary functions
        if not create_missing_functions(conn):
            logger.error("❌ Failed to create functions")
            return False
        
        # Step 2: Update credit costs
        if not update_credit_costs(conn):
            logger.error("❌ Failed to update credit costs")
            return False
        
        # Step 3: Test the system
        if not test_registration_flow(conn):
            logger.error("❌ Registration flow test failed")
            return False
        
        logger.info("🎉 Registration flow fix completed successfully!")
        logger.info("✅ Database functions created")
        logger.info("✅ Credit costs updated")
        logger.info("✅ Registration flow tested")
        logger.info("")
        logger.info("📋 Next steps:")
        logger.info("1. The registration system should now work seamlessly")
        logger.info("2. Users will get 75 credits upon registration")
        logger.info("3. Referral system will award 5 credits to both users")
        logger.info("4. All credit costs are properly configured")
        
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
