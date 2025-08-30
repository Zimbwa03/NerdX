#!/usr/bin/env python3
"""
Simple Users Fix for NerdX Bot
This script simply inserts the required nerdx_id values into the users table
"""

import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def simple_users_fix():
    """Simple fix to add missing nerdx_id values to users table"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("🔧 SIMPLE USERS TABLE FIX")
        logger.info("="*60)
        
        # Get all nerdx_id values from users_registration
        cursor.execute("SELECT nerdx_id, name, surname FROM users_registration")
        reg_users = cursor.fetchall()
        
        logger.info(f"✅ Found {len(reg_users)} users in registration")
        
        # Check which ones are missing from users table
        missing_count = 0
        for reg_user in reg_users:
            nerdx_id, name, surname = reg_user
            
            cursor.execute("SELECT id FROM users WHERE nerdx_id = %s", (nerdx_id,))
            existing = cursor.fetchone()
            
            if not existing:
                missing_count += 1
                logger.info(f"  ⚠️  Missing: {nerdx_id} ({name} {surname})")
                
                # Try simple insert with minimal fields
                try:
                    cursor.execute("""
                        INSERT INTO users (nerdx_id, name, surname)
                        VALUES (%s, %s, %s)
                    """, (nerdx_id, name, surname))
                    
                    logger.info(f"  ✅ Inserted: {nerdx_id}")
                    
                except Exception as e:
                    logger.error(f"  ❌ Error inserting {nerdx_id}: {e}")
            else:
                logger.info(f"  ✅ Exists: {nerdx_id} ({name} {surname})")
        
        # Final count
        cursor.execute("SELECT COUNT(*) FROM users")
        final_users_count = cursor.fetchone()[0]
        
        logger.info(f"\n📊 Final Status:")
        logger.info(f"  • users table: {final_users_count} records")
        logger.info(f"  • users_registration: {len(reg_users)} records")
        logger.info(f"  • Missing users found: {missing_count}")
        
        if missing_count == 0:
            logger.info("✅ All users are now synchronized!")
        else:
            logger.warning(f"⚠️  {missing_count} users still missing")
        
        cursor.close()
        conn.close()
        
        logger.info("\n🎉 Simple users fix completed!")
        
    except Exception as e:
        logger.error(f"❌ Simple users fix failed: {e}")

if __name__ == "__main__":
    simple_users_fix()

