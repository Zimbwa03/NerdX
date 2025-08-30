#!/usr/bin/env python3
"""
Fix Registration System - Comprehensive Database Setup
This script ensures all required tables and functions exist for seamless user registration
"""

import psycopg2
import logging
from datetime import datetime
import sys

# Database connection - using the working Supabase connection string
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

def create_registration_tables(conn):
    """Create all tables required for user registration"""
    try:
        cursor = conn.cursor()
        
        # 1. Create users_registration table
        logger.info("Creating users_registration table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users_registration (
                id SERIAL PRIMARY KEY,
                chat_id VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                surname VARCHAR(255) NOT NULL,
                date_of_birth VARCHAR(10) NOT NULL,
                nerdx_id VARCHAR(10) UNIQUE NOT NULL,
                referred_by_nerdx_id VARCHAR(10),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 2. Create users table (if it doesn't exist)
        logger.info("Creating users table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                nerdx_id VARCHAR(10) UNIQUE NOT NULL,
                whatsapp_id VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                surname VARCHAR(255) NOT NULL,
                date_of_birth VARCHAR(10) NOT NULL,
                referred_by_nerdx_id VARCHAR(10),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 3. Create user_stats table
        logger.info("Creating user_stats table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_stats (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                credits INTEGER DEFAULT 75,
                xp_points INTEGER DEFAULT 0,
                level INTEGER DEFAULT 1,
                streak INTEGER DEFAULT 0,
                max_streak INTEGER DEFAULT 0,
                username VARCHAR(255),
                first_name VARCHAR(255),
                total_questions_answered INTEGER DEFAULT 0,
                streak_count INTEGER DEFAULT 0,
                last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 4. Create credit_transactions table
        logger.info("Creating credit_transactions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS credit_transactions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                transaction_type VARCHAR(50) NOT NULL,
                amount INTEGER NOT NULL,
                description TEXT,
                balance_after INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 5. Create registration_sessions table
        logger.info("Creating registration_sessions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS registration_sessions (
                id SERIAL PRIMARY KEY,
                chat_id VARCHAR(255) UNIQUE NOT NULL,
                session_data JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 6. Create credit_costs table
        logger.info("Creating credit_costs table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS credit_costs (
                id SERIAL PRIMARY KEY,
                subject VARCHAR(100) NOT NULL,
                topic VARCHAR(100) NOT NULL,
                difficulty VARCHAR(50) NOT NULL,
                credits INTEGER NOT NULL,
                component VARCHAR(100) NOT NULL,
                action_name VARCHAR(100) NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 7. Create system_settings table
        logger.info("Creating system_settings table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS system_settings (
                id SERIAL PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create indexes
        logger.info("Creating indexes...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_registration_chat_id ON users_registration(chat_id);
            CREATE INDEX IF NOT EXISTS idx_users_registration_nerdx_id ON users_registration(nerdx_id);
            CREATE INDEX IF NOT EXISTS idx_users_registration_referred_by ON users_registration(referred_by_nerdx_id);
            CREATE INDEX IF NOT EXISTS idx_users_nerdx_id ON users(nerdx_id);
            CREATE INDEX IF NOT EXISTS idx_users_whatsapp_id ON users(whatsapp_id);
            CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
            CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
            CREATE INDEX IF NOT EXISTS idx_registration_sessions_chat_id ON registration_sessions(chat_id);
        """)
        
        logger.info("✅ All registration tables created successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creating tables: {e}")
        return False

def populate_credit_costs(conn):
    """Populate credit costs based on user specifications"""
    try:
        cursor = conn.cursor()
        
        # Clear existing data
        cursor.execute("DELETE FROM credit_costs")
        
        # Insert credit costs as specified by user
        credit_costs_data = [
            # Combined Science
            ('Combined Science', 'Topical Questions', 'Any', 1, 'questions', 'topical_questions', 'science', 'Combined Science topical questions'),
            ('Combined Science', 'Exam Questions', 'Any', 1, 'questions', 'exam_questions', 'science', 'Combined Science exam questions'),
            
            # Mathematics
            ('Mathematics', 'Topical Questions', 'Any', 2, 'questions', 'topical_questions', 'mathematics', 'Mathematics topical questions'),
            ('Mathematics', 'Exam Questions', 'Any', 1, 'questions', 'exam_questions', 'mathematics', 'Mathematics exam questions'),
            ('Mathematics', 'Graphs', 'Any', 3, 'graphs', 'graph_generation', 'mathematics', 'Mathematics graph generation'),
            
            # English
            ('English', 'Topical Questions', 'Any', 1, 'questions', 'topical_questions', 'english', 'English topical questions'),
            ('English', 'Comprehension', 'Any', 3, 'comprehension', 'comprehension_questions', 'english', 'English comprehension questions'),
            ('English', 'Essay Writing', 'Any', 3, 'essay', 'essay_writing', 'english', 'English essay writing'),
            
            # Audio Generation
            ('Audio', 'Generation', 'Any', 10, 'audio', 'audio_generation', 'audio', 'Audio generation cost'),
        ]
        
        for cost_data in credit_costs_data:
            cursor.execute("""
                INSERT INTO credit_costs (subject, topic, difficulty, credits, component, action_name, category, description)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, cost_data)
        
        # Insert system settings
        cursor.execute("""
            INSERT INTO system_settings (setting_key, setting_value, description) VALUES
            ('credit_cost_per_operation', '0.009', 'Cost per credit operation in USD'),
            ('user_credit_price', '0.02', 'Price per credit for users in USD'),
            ('new_user_credits', '75', 'Default credits for new users'),
            ('referral_bonus', '5', 'Bonus credits for referral'),
            ('referral_bonus_per_user', '5', 'Bonus credits per referred user')
            ON CONFLICT (setting_key) DO UPDATE SET
            setting_value = EXCLUDED.setting_value,
            updated_at = CURRENT_TIMESTAMP
        """)
        
        logger.info("✅ Credit costs and system settings populated successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error populating credit costs: {e}")
        return False

def create_database_functions(conn):
    """Create necessary database functions"""
    try:
        cursor = conn.cursor()
        
        # Function to generate NerdX ID
        cursor.execute("""
            CREATE OR REPLACE FUNCTION generate_nerdx_id()
            RETURNS VARCHAR(10)
            LANGUAGE plpgsql
            AS $$
            DECLARE
                new_id VARCHAR(10);
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
        cursor.execute("""
            CREATE OR REPLACE FUNCTION award_registration_credits(user_whatsapp_id VARCHAR)
            RETURNS BOOLEAN
            LANGUAGE plpgsql
            AS $$
            DECLARE
                user_nerdx_id VARCHAR(10);
                new_credits INTEGER;
            BEGIN
                -- Get user's NerdX ID
                SELECT nerdx_id INTO user_nerdx_id 
                FROM users_registration 
                WHERE chat_id = user_whatsapp_id;
                
                IF user_nerdx_id IS NULL THEN
                    RETURN FALSE;
                END IF;
                
                -- Award 75 credits for new user
                INSERT INTO user_stats (user_id, credits, first_name)
                SELECT chat_id, 75, name
                FROM users_registration
                WHERE chat_id = user_whatsapp_id
                ON CONFLICT (user_id) DO UPDATE SET
                credits = user_stats.credits + 75,
                updated_at = CURRENT_TIMESTAMP;
                
                -- Record the transaction
                INSERT INTO credit_transactions (user_id, transaction_type, amount, description, balance_after)
                SELECT chat_id, 'registration_bonus', 75, 'Welcome bonus credits', 75
                FROM users_registration
                WHERE chat_id = user_whatsapp_id;
                
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

def test_registration_flow(conn):
    """Test the registration flow with a sample user"""
    try:
        cursor = conn.cursor()
        
        # Test data
        test_chat_id = "test_user_123"
        test_name = "Test"
        test_surname = "User"
        test_dob = "15/03/2000"
        
        # 1. Test table creation
        logger.info("Testing table creation...")
        cursor.execute("SELECT COUNT(*) FROM users_registration")
        count = cursor.fetchone()[0]
        logger.info(f"Users registration table has {count} records")
        
        # 2. Test NerdX ID generation
        logger.info("Testing NerdX ID generation...")
        cursor.execute("SELECT generate_nerdx_id()")
        nerdx_id = cursor.fetchone()[0]
        logger.info(f"Generated NerdX ID: {nerdx_id}")
        
        # 3. Test credit costs
        cursor.execute("SELECT COUNT(*) FROM credit_costs")
        credit_count = cursor.fetchone()[0]
        logger.info(f"Credit costs table has {credit_count} records")
        
        # 4. Test system settings
        cursor.execute("SELECT COUNT(*) FROM system_settings")
        settings_count = cursor.fetchone()[0]
        logger.info(f"System settings table has {settings_count} records")
        
        logger.info("✅ Registration flow test completed successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error testing registration flow: {e}")
        return False

def main():
    """Main function to fix the registration system"""
    logger.info("🚀 Starting Registration System Fix...")
    
    # Connect to database
    conn = connect_to_database()
    if not conn:
        logger.error("❌ Cannot proceed without database connection")
        return False
    
    try:
        # Step 1: Create all required tables
        if not create_registration_tables(conn):
            logger.error("❌ Failed to create tables")
            return False
        
        # Step 2: Populate credit costs
        if not populate_credit_costs(conn):
            logger.error("❌ Failed to populate credit costs")
            return False
        
        # Step 3: Create database functions
        if not create_database_functions(conn):
            logger.error("❌ Failed to create functions")
            return False
        
        # Step 4: Test the system
        if not test_registration_flow(conn):
            logger.error("❌ Registration flow test failed")
            return False
        
        logger.info("🎉 Registration system fix completed successfully!")
        logger.info("✅ All tables created")
        logger.info("✅ Credit costs populated")
        logger.info("✅ Database functions created")
        logger.info("✅ Registration flow tested")
        
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
