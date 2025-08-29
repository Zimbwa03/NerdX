#!/usr/bin/env python3
"""
Check and fix the actual nerdx_id field length issue.
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

def check_actual_field_lengths(conn):
    """Check the actual current field lengths for nerdx_id columns."""
    logger.info("🔍 Checking actual field lengths...")
    
    try:
        cursor = conn.cursor()
        
        # Check users table
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length, 
                   CASE WHEN character_maximum_length IS NULL THEN 'unlimited' 
                        ELSE character_maximum_length::text END as actual_length
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'nerdx_id';
        """)
        
        users_nerdx_info = cursor.fetchone()
        if users_nerdx_info:
            logger.info(f"   users.nerdx_id: {users_nerdx_info[1]}({users_nerdx_info[3]})")
        
        # Check users_registration table
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length,
                   CASE WHEN character_maximum_length IS NULL THEN 'unlimited' 
                        ELSE character_maximum_length::text END as actual_length
            FROM information_schema.columns 
            WHERE table_name = 'users_registration' AND column_name = 'nerdx_id';
        """)
        
        reg_nerdx_info = cursor.fetchone()
        if reg_nerdx_info:
            logger.info(f"   users_registration.nerdx_id: {reg_nerdx_info[1]}({reg_nerdx_info[3]})")
        
        # Check user_stats table
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length,
                   CASE WHEN character_maximum_length IS NULL THEN 'unlimited' 
                        ELSE character_maximum_length::text END as actual_length
            FROM information_schema.columns 
            WHERE table_name = 'user_stats' AND column_name = 'user_id';
        """)
        
        stats_user_info = cursor.fetchone()
        if stats_user_info:
            logger.info(f"   user_stats.user_id: {stats_user_info[1]}({stats_user_info[3]})")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Failed to check field lengths: {e}")
        return False

def fix_nerdx_id_lengths_properly(conn):
    """Fix nerdx_id field lengths to be truly unlimited."""
    logger.info("🔧 Fixing nerdx_id field lengths to unlimited...")
    
    try:
        cursor = conn.cursor()
        
        # Fix users.nerdx_id to unlimited VARCHAR
        cursor.execute("""
            ALTER TABLE users 
            ALTER COLUMN nerdx_id TYPE VARCHAR;
        """)
        logger.info("   ✅ users.nerdx_id: Changed to unlimited VARCHAR")
        
        # Fix users_registration.nerdx_id to unlimited VARCHAR
        cursor.execute("""
            ALTER TABLE users_registration 
            ALTER COLUMN nerdx_id TYPE VARCHAR;
        """)
        logger.info("   ✅ users_registration.nerdx_id: Changed to unlimited VARCHAR")
        
        # Fix user_stats.user_id to unlimited VARCHAR
        cursor.execute("""
            ALTER TABLE user_stats 
            ALTER COLUMN user_id TYPE VARCHAR;
        """)
        logger.info("   ✅ user_stats.user_id: Changed to unlimited VARCHAR")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Failed to fix field lengths: {e}")
        return False

def test_long_nerdx_id(conn):
    """Test inserting a very long nerdx_id to verify the fix."""
    logger.info("🧪 Testing long nerdx_id insertion...")
    
    try:
        cursor = conn.cursor()
        
        # Create a very long nerdx_id (100 characters)
        long_nerdx_id = "VERY_LONG_NERDX_ID_" + "A" * 80
        
        cursor.execute("""
            INSERT INTO users (whatsapp_id, nerdx_id, name, surname, credits)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (f"263{long_nerdx_id}", long_nerdx_id, "Test", "LongID", 75))
        
        test_user_id = cursor.fetchone()[0]
        logger.info(f"   ✅ Long nerdx_id test successful: {len(long_nerdx_id)} characters")
        
        # Clean up test data
        cursor.execute("DELETE FROM users WHERE id = %s;", (test_user_id,))
        logger.info("   🧹 Test data cleaned up")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Long nerdx_id test failed: {e}")
        return False

def main():
    """Main function to check and fix nerdx_id field lengths."""
    logger.info("🚀 Starting nerdx_id field length check and fix...")
    
    conn = None
    
    try:
        conn = get_db_connection()
        
        # Check current field lengths
        logger.info(f"\n{'='*50}")
        logger.info("Step 1: Check current field lengths")
        logger.info(f"{'='*50}")
        
        if not check_actual_field_lengths(conn):
            sys.exit(1)
        
        # Fix field lengths
        logger.info(f"\n{'='*50}")
        logger.info("Step 2: Fix field lengths to unlimited")
        logger.info(f"{'='*50}")
        
        if not fix_nerdx_id_lengths_properly(conn):
            sys.exit(1)
        
        # Test the fix
        logger.info(f"\n{'='*50}")
        logger.info("Step 3: Test long nerdx_id insertion")
        logger.info(f"{'='*50}")
        
        if not test_long_nerdx_id(conn):
            sys.exit(1)
        
        # Final verification
        logger.info(f"\n{'='*50}")
        logger.info("Step 4: Final verification")
        logger.info(f"{'='*50}")
        
        check_actual_field_lengths(conn)
        
        logger.info(f"\n{'='*60}")
        logger.info("🎉 NERDX_ID FIELD LENGTH ISSUE FIXED SUCCESSFULLY!")
        logger.info("All nerdx_id fields are now unlimited VARCHAR and can handle any length.")
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
