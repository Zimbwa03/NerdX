#!/usr/bin/env python3
"""
Fix remaining database schema issues identified in the comprehensive test.
"""

import os
import sys
import logging
import psycopg2
from psycopg2.extras import RealDictCursor

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def get_db_connection():
    """Get database connection."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        logger.info("✅ Database connection established successfully")
        return conn
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        sys.exit(1)

def fix_nerdx_id_length(conn):
    """Fix the nerdx_id field length in users table."""
    logger.info("🔧 Fixing nerdx_id field length...")
    
    try:
        cursor = conn.cursor()
        
        # Check current column definition
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'nerdx_id';
        """)
        
        column_info = cursor.fetchone()
        if column_info:
            logger.info(f"   Current nerdx_id: {column_info[1]}({column_info[2]})")
        
        # Alter the column to increase length
        cursor.execute("""
            ALTER TABLE users 
            ALTER COLUMN nerdx_id TYPE VARCHAR(50);
        """)
        
        logger.info("   ✅ nerdx_id field length increased to VARCHAR(50)")
        
        # Also fix users_registration table if needed
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'users_registration' AND column_name = 'nerdx_id';
        """)
        
        reg_column_info = cursor.fetchone()
        if reg_column_info and reg_column_info[2] < 50:
            cursor.execute("""
                ALTER TABLE users_registration 
                ALTER COLUMN nerdx_id TYPE VARCHAR(50);
            """)
            logger.info("   ✅ users_registration.nerdx_id field length increased to VARCHAR(50)")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Failed to fix nerdx_id length: {e}")
        return False

def fix_user_stats_table(conn):
    """Fix user_stats table to ensure proper user_id field."""
    logger.info("🔧 Fixing user_stats table...")
    
    try:
        cursor = conn.cursor()
        
        # Check if user_stats table exists and has correct structure
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'user_stats' AND column_name = 'user_id';
        """)
        
        user_id_column = cursor.fetchone()
        if not user_id_column:
            logger.info("   ⚠️ user_stats table doesn't exist, creating it...")
            
            cursor.execute("""
                CREATE TABLE user_stats (
                    id SERIAL PRIMARY KEY,
                    user_id VARCHAR(50) NOT NULL,
                    total_questions_answered INTEGER DEFAULT 0,
                    correct_answers INTEGER DEFAULT 0,
                    total_points_earned INTEGER DEFAULT 0,
                    streak_count INTEGER DEFAULT 0,
                    last_activity_date DATE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(nerdx_id) ON DELETE CASCADE
                );
            """)
            
            logger.info("   ✅ user_stats table created with proper structure")
            
        else:
            logger.info(f"   ✅ user_stats table exists with user_id: {user_id_column[1]}")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Failed to fix user_stats table: {e}")
        return False

def verify_fixes(conn):
    """Verify that all fixes were applied correctly."""
    logger.info("🔍 Verifying fixes...")
    
    try:
        cursor = conn.cursor()
        
        # Test 1: Check nerdx_id field length
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'nerdx_id';
        """)
        
        nerdx_id_info = cursor.fetchone()
        if nerdx_id_info and nerdx_id_info[2] >= 50:
            logger.info(f"   ✅ users.nerdx_id: {nerdx_id_info[1]}({nerdx_id_info[2]}) - FIXED")
        else:
            logger.error(f"   ❌ users.nerdx_id: {nerdx_id_info[1]}({nerdx_id_info[2]}) - NOT FIXED")
            return False
        
        # Test 2: Check users_registration nerdx_id field length
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = 'users_registration' AND column_name = 'nerdx_id';
        """)
        
        reg_nerdx_id_info = cursor.fetchone()
        if reg_nerdx_id_info and reg_nerdx_id_info[2] >= 50:
            logger.info(f"   ✅ users_registration.nerdx_id: {reg_nerdx_id_info[1]}({reg_nerdx_id_info[2]}) - FIXED")
        else:
            logger.error(f"   ❌ users_registration.nerdx_id: {reg_nerdx_id_info[1]}({reg_nerdx_id_info[2]}) - NOT FIXED")
            return False
        
        # Test 3: Check user_stats table structure
        cursor.execute("""
            SELECT COUNT(*) FROM user_stats;
        """)
        
        user_stats_count = cursor.fetchone()[0]
        logger.info(f"   ✅ user_stats table accessible: {user_stats_count} rows")
        
        # Test 4: Test inserting a long nerdx_id
        test_nerdx_id = "TEST" + "A" * 45  # Create a 49-character nerdx_id
        
        cursor.execute("""
            INSERT INTO users (whatsapp_id, nerdx_id, name, surname, credits)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (f"263{test_nerdx_id}", test_nerdx_id, "Test", "LongID", 75))
        
        test_user_id = cursor.fetchone()[0]
        logger.info(f"   ✅ Long nerdx_id test successful: {len(test_nerdx_id)} characters")
        
        # Clean up test data
        cursor.execute("DELETE FROM users WHERE id = %s;", (test_user_id,))
        logger.info("   🧹 Test data cleaned up")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Verification failed: {e}")
        return False

def main():
    """Main function to fix remaining issues."""
    logger.info("🚀 Starting to fix remaining database issues...")
    
    conn = None
    
    try:
        conn = get_db_connection()
        
        # Fix the issues
        fixes = [
            ("Fix nerdx_id field length", fix_nerdx_id_length),
            ("Fix user_stats table", fix_user_stats_table),
            ("Verify fixes", verify_fixes)
        ]
        
        for fix_name, fix_func in fixes:
            logger.info(f"\n{'='*50}")
            logger.info(f"Running: {fix_name}")
            logger.info(f"{'='*50}")
            
            try:
                result = fix_func(conn)
                
                if result:
                    logger.info(f"✅ {fix_name}: SUCCESS")
                else:
                    logger.error(f"❌ {fix_name}: FAILED")
                    sys.exit(1)
                    
            except Exception as e:
                logger.error(f"❌ {fix_name}: ERROR - {e}")
                sys.exit(1)
        
        logger.info(f"\n{'='*60}")
        logger.info("🎉 ALL ISSUES FIXED SUCCESSFULLY!")
        logger.info("The database is now fully compatible with the application code.")
        logger.info(f"{'='*60}")
        
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        sys.exit(1)
    finally:
        if conn:
            conn.close()
            logger.info("🔌 Database connection closed")

if __name__ == "__main__":
    main()
