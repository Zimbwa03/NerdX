#!/usr/bin/env python3
"""
Fix User Stats Table for NerdX Bot
This script fixes the user_stats table structure to include all necessary columns
"""

import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def fix_user_stats_table():
    """Fix the user_stats table structure"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("🔧 Fixing user_stats table structure...")
        
        # Check current table structure
        cursor.execute("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'user_stats' 
            ORDER BY ordinal_position
        """)
        
        columns = cursor.fetchall()
        logger.info("Current user_stats columns:")
        for col in columns:
            logger.info(f"  - {col[0]}: {col[1]} (nullable: {col[2]})")
        
        # Add missing columns to user_stats table
        missing_columns = [
            ('credits', 'INTEGER DEFAULT 75'),
            ('xp_points', 'INTEGER DEFAULT 0'),
            ('level', 'INTEGER DEFAULT 1'),
            ('streak', 'INTEGER DEFAULT 0'),
            ('max_streak', 'INTEGER DEFAULT 0'),
            ('username', 'VARCHAR(100)'),
            ('first_name', 'VARCHAR(100)'),
            ('last_activity', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
        ]
        
        for col_name, col_definition in missing_columns:
            try:
                cursor.execute(f"ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS {col_name} {col_definition}")
                logger.info(f"✅ Added column: {col_name}")
            except Exception as e:
                logger.error(f"❌ Error adding column {col_name}: {e}")
        
        # Update existing records to have default values
        try:
            cursor.execute("""
                UPDATE user_stats 
                SET 
                    credits = COALESCE(credits, 75),
                    xp_points = COALESCE(xp_points, 0),
                    level = COALESCE(level, 1),
                    streak = COALESCE(streak, 0),
                    max_streak = COALESCE(max_streak, 0),
                    last_activity = COALESCE(last_activity, CURRENT_TIMESTAMP)
                WHERE credits IS NULL OR xp_points IS NULL OR level IS NULL
            """)
            logger.info("✅ Updated existing records with default values")
        except Exception as e:
            logger.error(f"❌ Error updating existing records: {e}")
        
        # Create user stats for users who don't have them
        try:
            cursor.execute("""
                INSERT INTO user_stats (user_id, credits, total_questions_answered, correct_answers, xp_points, level, streak, max_streak)
                SELECT 
                    ur.chat_id,
                    75,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0
                FROM users_registration ur
                LEFT JOIN user_stats us ON ur.chat_id = us.user_id
                WHERE us.user_id IS NULL
            """)
            
            new_stats_created = cursor.rowcount
            if new_stats_created > 0:
                logger.info(f"✅ Created user stats for {new_stats_created} new users")
            else:
                logger.info("ℹ️  All users already have stats")
                
        except Exception as e:
            logger.error(f"❌ Error creating user stats: {e}")
        
        # Verify the fix
        logger.info("\n🔍 Verifying table structure...")
        
        cursor.execute("SELECT COUNT(*) FROM user_stats")
        total_stats = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM user_stats WHERE credits >= 75")
        users_with_credits = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM user_stats WHERE xp_points >= 0")
        users_with_xp = cursor.fetchone()[0]
        
        logger.info(f"✅ Total user stats records: {total_stats}")
        logger.info(f"✅ Users with 75+ credits: {users_with_credits}")
        logger.info(f"✅ Users with XP points: {users_with_xp}")
        
        # Check final table structure
        cursor.execute("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'user_stats' 
            ORDER BY ordinal_position
        """)
        
        final_columns = cursor.fetchall()
        logger.info("\nFinal user_stats columns:")
        for col in final_columns:
            logger.info(f"  - {col[0]}: {col[1]} (nullable: {col[2]})")
        
        cursor.close()
        conn.close()
        
        logger.info("\n🎉 User stats table fixed successfully!")
        logger.info("✅ All necessary columns added")
        logger.info("✅ Existing users updated with proper credits")
        logger.info("✅ New users will get 75 credits by default")
        
    except Exception as e:
        logger.error(f"❌ Error fixing user_stats table: {e}")

if __name__ == "__main__":
    fix_user_stats_table()
