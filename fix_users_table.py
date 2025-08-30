#!/usr/bin/env python3
"""
Fix Users Table for NerdX Bot
This script populates the users table with nerdx_id values to fix foreign key constraints
"""

import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def fix_users_table():
    """Populate users table with nerdx_id values to fix foreign key constraints"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("🔧 FIXING USERS TABLE FOR FOREIGN KEY CONSTRAINTS")
        logger.info("="*60)
        
        # 1. Check current state
        logger.info("\n📊 1. CHECKING CURRENT STATE...")
        
        cursor.execute("SELECT COUNT(*) FROM users")
        users_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM users_registration")
        reg_count = cursor.fetchone()[0]
        
        logger.info(f"  • users table: {users_count} records")
        logger.info(f"  • users_registration: {reg_count} records")
        
        # 2. Get all nerdx_id values from users_registration
        logger.info("\n🔍 2. GETTING NERDX_ID VALUES...")
        
        cursor.execute("SELECT nerdx_id, chat_id, name, surname FROM users_registration")
        reg_users = cursor.fetchall()
        
        logger.info(f"  ✅ Found {len(reg_users)} users in registration")
        
        # 3. Check which nerdx_id values are missing from users table
        logger.info("\n📋 3. CHECKING MISSING NERDX_ID VALUES...")
        
        missing_users = []
        for reg_user in reg_users:
            nerdx_id, chat_id, name, surname = reg_user
            
            cursor.execute("SELECT id FROM users WHERE nerdx_id = %s", (nerdx_id,))
            existing = cursor.fetchone()
            
            if not existing:
                missing_users.append(reg_user)
                logger.info(f"  ⚠️  Missing: {nerdx_id} ({name} {surname})")
            else:
                logger.info(f"  ✅ Exists: {nerdx_id} ({name} {surname})")
        
        # 4. Insert missing users
        if missing_users:
            logger.info(f"\n➕ 4. INSERTING {len(missing_users)} MISSING USERS...")
            
            for reg_user in missing_users:
                nerdx_id, chat_id, name, surname = reg_user
                
                try:
                    cursor.execute("""
                        INSERT INTO users (
                            nerdx_id, name, surname, email, credits, total_points, 
                            streak_count, is_active, last_activity, is_sso_user, is_anonymous
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        nerdx_id, name, surname, f"{name.lower()}@example.com", 75, 0, 0, True, 
                        '2025-08-30 09:00:00', False, False
                    ))
                    
                    logger.info(f"  ✅ Inserted: {nerdx_id} ({name} {surname})")
                    
                except Exception as e:
                    logger.error(f"  ❌ Error inserting {nerdx_id}: {e}")
        else:
            logger.info("  ✅ No missing users to insert")
        
        # 5. Final verification
        logger.info("\n🔍 5. FINAL VERIFICATION...")
        
        cursor.execute("SELECT COUNT(*) FROM users")
        final_users_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM users_registration")
        final_reg_count = cursor.fetchone()[0]
        
        logger.info(f"  ✅ users table: {final_users_count} records")
        logger.info(f"  ✅ users_registration: {final_reg_count} records")
        
        # Check if foreign key constraint will work
        logger.info("\n🔗 6. TESTING FOREIGN KEY CONSTRAINT...")
        
        try:
            # Try to insert a test user_stats record
            test_nerdx_id = reg_users[0][0] if reg_users else "TEST123"
            
            cursor.execute("""
                INSERT INTO user_stats (
                    user_id, credits, total_questions_answered, correct_answers,
                    xp_points, level, streak, max_streak, total_points_earned,
                    streak_count, last_activity_date, created_at, updated_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_id) DO UPDATE SET
                    credits = EXCLUDED.credits,
                    updated_at = CURRENT_TIMESTAMP
            """, (
                test_nerdx_id, 75, 0, 0, 0, 1, 0, 0, 0, 0, 
                '2025-08-30', '2025-08-30 09:00:00', '2025-08-30 09:00:00'
            ))
            
            logger.info(f"  ✅ Foreign key constraint test successful with {test_nerdx_id}")
            
            # Clean up test record
            cursor.execute("DELETE FROM user_stats WHERE user_id = %s", (test_nerdx_id,))
            logger.info("  ✅ Test record cleaned up")
            
        except Exception as e:
            logger.error(f"  ❌ Foreign key constraint test failed: {e}")
        
        cursor.close()
        conn.close()
        
        logger.info("\n🎉 USERS TABLE FIX COMPLETED!")
        logger.info("✅ Foreign key constraints should now work")
        logger.info("✅ You can now populate dashboard data successfully")
        
    except Exception as e:
        logger.error(f"❌ Users table fix failed: {e}")

if __name__ == "__main__":
    fix_users_table()

