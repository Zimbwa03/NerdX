#!/usr/bin/env python3
"""
Fix User Constraints for NerdX Bot
This script checks and fixes foreign key constraints preventing data insertion
"""

import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def fix_user_constraints():
    """Check and fix user table constraints"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("🔧 CHECKING AND FIXING USER CONSTRAINTS")
        logger.info("="*60)
        
        # 1. Check what tables exist
        logger.info("\n📋 1. CHECKING EXISTING TABLES...")
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE '%user%'
            ORDER BY table_name
        """)
        
        user_tables = cursor.fetchall()
        logger.info("User-related tables found:")
        for table in user_tables:
            logger.info(f"  • {table[0]}")
        
        # 2. Check users_registration table
        logger.info("\n👥 2. CHECKING USERS_REGISTRATION...")
        try:
            cursor.execute("SELECT COUNT(*) FROM users_registration")
            reg_count = cursor.fetchone()[0]
            logger.info(f"  ✅ users_registration: {reg_count} records")
            
            # Show sample users
            cursor.execute("SELECT chat_id FROM users_registration LIMIT 5")
            sample_users = cursor.fetchall()
            logger.info("  Sample users:")
            for user in sample_users:
                logger.info(f"    - {user[0]}")
                
        except Exception as e:
            logger.error(f"  ❌ Error checking users_registration: {e}")
        
        # 3. Check if 'users' table exists
        logger.info("\n🔍 3. CHECKING FOR 'users' TABLE...")
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
        """)
        
        users_table = cursor.fetchone()
        if users_table:
            logger.info("  ✅ 'users' table exists")
            
            cursor.execute("SELECT COUNT(*) FROM users")
            users_count = cursor.fetchone()[0]
            logger.info(f"  📊 users table: {users_count} records")
        else:
            logger.info("  ❌ 'users' table does not exist")
        
        # 4. Check foreign key constraints
        logger.info("\n🔗 4. CHECKING FOREIGN KEY CONSTRAINTS...")
        cursor.execute("""
            SELECT 
                tc.constraint_name, 
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_name = 'user_stats'
        """)
        
        constraints = cursor.fetchall()
        if constraints:
            logger.info("  Foreign key constraints on user_stats:")
            for constraint in constraints:
                logger.info(f"    • {constraint[0]}: {constraint[1]}.{constraint[2]} -> {constraint[3]}.{constraint[4]}")
        else:
            logger.info("  ✅ No foreign key constraints found on user_stats")
        
        # 5. Check if we need to create a users table or fix constraints
        logger.info("\n⚙️ 5. ANALYZING SOLUTION...")
        
        if not users_table:
            logger.info("  📝 Solution: Create 'users' table to match foreign key constraint")
            
            try:
                # Create users table based on users_registration
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        id SERIAL PRIMARY KEY,
                        chat_id VARCHAR(255) UNIQUE NOT NULL,
                        username VARCHAR(100),
                        first_name VARCHAR(100),
                        last_name VARCHAR(100),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                
                # Copy data from users_registration
                cursor.execute("""
                    INSERT INTO users (chat_id, username, first_name, last_name, created_at)
                    SELECT chat_id, username, first_name, last_name, created_at
                    FROM users_registration
                    ON CONFLICT (chat_id) DO NOTHING
                """)
                
                logger.info("  ✅ Created 'users' table and populated with data")
                
            except Exception as e:
                logger.error(f"  ❌ Error creating users table: {e}")
        else:
            logger.info("  ✅ 'users' table exists, checking data consistency")
            
            # Check if all users_registration users exist in users table
            cursor.execute("""
                SELECT COUNT(*) FROM users_registration ur
                LEFT JOIN users u ON ur.chat_id = u.chat_id
                WHERE u.chat_id IS NULL
            """)
            
            missing_users = cursor.fetchone()[0]
            if missing_users > 0:
                logger.info(f"  ⚠️  {missing_users} users missing from 'users' table")
                
                # Add missing users
                cursor.execute("""
                    INSERT INTO users (chat_id, username, first_name, last_name, created_at)
                    SELECT ur.chat_id, ur.username, ur.first_name, ur.last_name, ur.created_at
                    FROM users_registration ur
                    LEFT JOIN users u ON ur.chat_id = u.chat_id
                    WHERE u.chat_id IS NULL
                """)
                
                logger.info("  ✅ Added missing users to 'users' table")
            else:
                logger.info("  ✅ All users are properly synchronized")
        
        # 6. Final verification
        logger.info("\n🔍 6. FINAL VERIFICATION...")
        
        cursor.execute("SELECT COUNT(*) FROM users")
        final_users_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM users_registration")
        final_reg_count = cursor.fetchone()[0]
        
        logger.info(f"  ✅ users table: {final_users_count} records")
        logger.info(f"  ✅ users_registration: {final_reg_count} records")
        
        if final_users_count == final_reg_count:
            logger.info("  ✅ User tables are now synchronized!")
        else:
            logger.warning(f"  ⚠️  User count mismatch: users={final_users_count}, registration={final_reg_count}")
        
        cursor.close()
        conn.close()
        
        logger.info("\n🎉 USER CONSTRAINT FIX COMPLETED!")
        logger.info("✅ You can now populate dashboard data successfully")
        
    except Exception as e:
        logger.error(f"❌ User constraint fix failed: {e}")

if __name__ == "__main__":
    fix_user_constraints()

