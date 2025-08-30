#!/usr/bin/env python3
"""
Proper Users Fix for NerdX Bot
This script properly inserts users with all required fields including whatsapp_id
"""

import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def proper_users_fix():
    """Proper fix to add missing users with all required fields"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("🔧 PROPER USERS TABLE FIX")
        logger.info("="*60)
        
        # Get all nerdx_id values from users_registration
        cursor.execute("SELECT nerdx_id, chat_id, name, surname FROM users_registration")
        reg_users = cursor.fetchall()
        
        logger.info(f"✅ Found {len(reg_users)} users in registration")
        
        # Check which ones are missing from users table
        missing_count = 0
        for reg_user in reg_users:
            nerdx_id, chat_id, name, surname = reg_user
            
            cursor.execute("SELECT id FROM users WHERE nerdx_id = %s", (nerdx_id,))
            existing = cursor.fetchone()
            
            if not existing:
                missing_count += 1
                logger.info(f"  ⚠️  Missing: {nerdx_id} ({name} {surname})")
                
                # Try proper insert with all required fields
                try:
                    cursor.execute("""
                        INSERT INTO users (
                            nerdx_id, whatsapp_id, name, surname, email, 
                            credits, total_points, streak_count, is_active
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        nerdx_id, chat_id, name, surname, f"{name.lower()}@example.com",
                        75, 0, 0, True
                    ))
                    
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
        
        logger.info("\n🎉 Proper users fix completed!")
        
    except Exception as e:
        logger.error(f"❌ Proper users fix failed: {e}")

if __name__ == "__main__":
    proper_users_fix()

