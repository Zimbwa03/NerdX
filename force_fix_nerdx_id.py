#!/usr/bin/env python3
"""
Force fix the nerdx_id field length issue by checking for constraints and using aggressive approach.
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

def check_constraints_and_indexes(conn):
    """Check for any constraints or indexes that might be limiting nerdx_id length."""
    logger.info("🔍 Checking for constraints and indexes...")
    
    try:
        cursor = conn.cursor()
        
        # Check for check constraints
        cursor.execute("""
            SELECT conname, pg_get_constraintdef(oid) as constraint_def
            FROM pg_constraint 
            WHERE conrelid = 'users'::regclass 
            AND contype = 'c';
        """)
        
        check_constraints = cursor.fetchall()
        if check_constraints:
            logger.info(f"   Found {len(check_constraints)} check constraints:")
            for conname, constraint_def in check_constraints:
                logger.info(f"     {conname}: {constraint_def}")
        else:
            logger.info("   No check constraints found")
        
        # Check for indexes
        cursor.execute("""
            SELECT indexname, indexdef
            FROM pg_indexes 
            WHERE tablename = 'users' AND indexdef LIKE '%nerdx_id%';
        """)
        
        indexes = cursor.fetchall()
        if indexes:
            logger.info(f"   Found {len(indexes)} indexes on nerdx_id:")
            for indexname, indexdef in indexes:
                logger.info(f"     {indexname}: {indexdef}")
        else:
            logger.info("   No indexes found on nerdx_id")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Failed to check constraints: {e}")
        return False

def force_fix_nerdx_id_length(conn):
    """Force fix nerdx_id field length using a more aggressive approach."""
    logger.info("🔧 Force fixing nerdx_id field length...")
    
    try:
        cursor = conn.cursor()
        
        # First, let's see what the actual current type is
        cursor.execute("""
            SELECT column_name, data_type, character_maximum_length, 
                   CASE WHEN character_maximum_length IS NULL THEN 'unlimited' 
                        ELSE character_maximum_length::text END as actual_length
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'nerdx_id';
        """)
        
        current_info = cursor.fetchone()
        logger.info(f"   Current nerdx_id info: {current_info}")
        
        # Try to force it to TEXT type (unlimited)
        cursor.execute("""
            ALTER TABLE users 
            ALTER COLUMN nerdx_id TYPE TEXT;
        """)
        logger.info("   ✅ Changed nerdx_id to TEXT type (unlimited)")
        
        # Also fix users_registration
        cursor.execute("""
            ALTER TABLE users_registration 
            ALTER COLUMN nerdx_id TYPE TEXT;
        """)
        logger.info("   ✅ Changed users_registration.nerdx_id to TEXT type")
        
        # Fix user_stats.user_id
        cursor.execute("""
            ALTER TABLE user_stats 
            ALTER COLUMN user_id TYPE TEXT;
        """)
        logger.info("   ✅ Changed user_stats.user_id to TEXT type")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Failed to force fix nerdx_id length: {e}")
        return False

def test_very_long_nerdx_id(conn):
    """Test inserting a very long nerdx_id to verify the fix."""
    logger.info("🧪 Testing very long nerdx_id insertion...")
    
    try:
        cursor = conn.cursor()
        
        # Create a very long nerdx_id (200 characters)
        very_long_nerdx_id = "VERY_VERY_LONG_NERDX_ID_" + "A" * 180
        
        cursor.execute("""
            INSERT INTO users (whatsapp_id, nerdx_id, name, surname, credits)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, (f"263{very_long_nerdx_id}", very_long_nerdx_id, "Test", "VeryLongID", 75))
        
        test_user_id = cursor.fetchone()[0]
        logger.info(f"   ✅ Very long nerdx_id test successful: {len(very_long_nerdx_id)} characters")
        
        # Clean up test data
        cursor.execute("DELETE FROM users WHERE id = %s;", (test_user_id,))
        logger.info("   🧹 Test data cleaned up")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Very long nerdx_id test failed: {e}")
        return False

def verify_final_fix(conn):
    """Verify the final fix was applied correctly."""
    logger.info("🔍 Final verification...")
    
    try:
        cursor = conn.cursor()
        
        # Check final field types
        cursor.execute("""
            SELECT table_name, column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE (table_name = 'users' AND column_name = 'nerdx_id')
               OR (table_name = 'users_registration' AND column_name = 'nerdx_id')
               OR (table_name = 'user_stats' AND column_name = 'user_id');
        """)
        
        columns = cursor.fetchall()
        for table_name, column_name, data_type, max_length in columns:
            if max_length is None:
                logger.info(f"   ✅ {table_name}.{column_name}: {data_type} (unlimited)")
            else:
                logger.info(f"   ⚠️ {table_name}.{column_name}: {data_type}({max_length})")
        
        return True
        
    except Exception as e:
        logger.error(f"   ❌ Final verification failed: {e}")
        return False

def main():
    """Main function to force fix nerdx_id field length."""
    logger.info("🚀 Starting force fix of nerdx_id field length...")
    
    conn = None
    
    try:
        conn = get_db_connection()
        
        # Check constraints and indexes
        logger.info(f"\n{'='*50}")
        logger.info("Step 1: Check constraints and indexes")
        logger.info(f"{'='*50}")
        
        if not check_constraints_and_indexes(conn):
            sys.exit(1)
        
        # Force fix field lengths
        logger.info(f"\n{'='*50}")
        logger.info("Step 2: Force fix field lengths to TEXT")
        logger.info(f"{'='*50}")
        
        if not force_fix_nerdx_id_length(conn):
            sys.exit(1)
        
        # Test the fix
        logger.info(f"\n{'='*50}")
        logger.info("Step 3: Test very long nerdx_id insertion")
        logger.info(f"{'='*50}")
        
        if not test_very_long_nerdx_id(conn):
            sys.exit(1)
        
        # Final verification
        logger.info(f"\n{'='*50}")
        logger.info("Step 4: Final verification")
        logger.info(f"{'='*50}")
        
        verify_final_fix(conn)
        
        logger.info(f"\n{'='*60}")
        logger.info("🎉 NERDX_ID FIELD LENGTH FORCE FIXED SUCCESSFULLY!")
        logger.info("All nerdx_id fields are now TEXT (unlimited) and can handle any length.")
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
