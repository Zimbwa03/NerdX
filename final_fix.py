#!/usr/bin/env python3
"""
Final database fix for NerdX Bot Dashboard
"""

import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def final_fix():
    """Final database fix"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("🔧 Final database fix...")
        
        # Check current table structures
        cursor.execute("""
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'credit_costs' 
            ORDER BY ordinal_position
        """)
        
        columns = cursor.fetchall()
        logger.info("Current credit_costs columns:")
        for col in columns:
            logger.info(f"  - {col[0]}: {col[1]} (nullable: {col[2]})")
        
        # Fix 1: Add missing component column if it doesn't exist
        try:
            cursor.execute("""
                ALTER TABLE credit_costs 
                ADD COLUMN IF NOT EXISTS component VARCHAR(100) DEFAULT 'default'
            """)
            logger.info("✅ Added component column to credit_costs")
        except Exception as e:
            logger.error(f"❌ Error adding component column: {e}")
        
        # Fix 2: Update existing records with component value
        try:
            cursor.execute("""
                UPDATE credit_costs SET component = 'default' WHERE component IS NULL
            """)
            logger.info("✅ Updated component values")
        except Exception as e:
            logger.error(f"❌ Error updating component values: {e}")
        
        # Fix 3: Fix broadcast_logs table structure
        try:
            cursor.execute("""
                ALTER TABLE broadcast_logs 
                ADD COLUMN IF NOT EXISTS admin_user VARCHAR(100) DEFAULT 'admin'
            """)
            logger.info("✅ Fixed broadcast_logs admin_user column")
        except Exception as e:
            logger.error(f"❌ Error fixing broadcast_logs: {e}")
        
        # Fix 4: Create proper indexes
        try:
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_broadcast_logs_admin_date ON broadcast_logs(admin_user, created_at);
                CREATE INDEX IF NOT EXISTS idx_credit_costs_category ON credit_costs(category);
                CREATE INDEX IF NOT EXISTS idx_credit_costs_active ON credit_costs(is_active);
            """)
            logger.info("✅ Created proper indexes")
        except Exception as e:
            logger.error(f"❌ Error creating indexes: {e}")
        
        # Fix 5: Clean up and reinsert credit costs properly
        try:
            # Delete existing records
            cursor.execute("DELETE FROM credit_costs")
            logger.info("✅ Cleaned existing credit_costs records")
            
            # Insert fresh data
            cursor.execute("""
                INSERT INTO credit_costs (action_key, action_name, category, cost, description, component) VALUES
                ('math_topical', 'Math Topical Questions', 'math', 5, 'Mathematics topical practice questions', 'math'),
                ('math_exam', 'Math Exam Questions', 'math', 10, 'Mathematics exam-style questions', 'math'),
                ('math_graph_practice', 'Math Graph Practice', 'math', 15, 'Mathematics graph generation and practice', 'math'),
                ('combined_science_topical', 'Science Topical Questions', 'science', 5, 'Combined science topical practice', 'science'),
                ('combined_science_exam', 'Science Exam Questions', 'science', 10, 'Combined science exam-style questions', 'science'),
                ('english_topical', 'English Topical Questions', 'english', 3, 'English language topical practice', 'english'),
                ('english_comprehension', 'English Comprehension', 'english', 7, 'English reading comprehension', 'english'),
                ('english_essay_writing', 'English Essay Writing', 'english', 12, 'English essay writing assistance', 'english'),
                ('image_solve', 'Image Question Solving', 'features', 15, 'Solve questions from images', 'features'),
                ('audio_feature', 'Audio Question Feature', 'features', 20, 'Audio-based question answering', 'features'),
                ('voice_chat', 'Voice Chat Feature', 'features', 25, 'Voice-based chat with AI', 'features')
            """)
            logger.info("✅ Inserted fresh credit costs data")
        except Exception as e:
            logger.error(f"❌ Error reinserting credit costs: {e}")
        
        # Verify final state
        cursor.execute("SELECT COUNT(*) FROM credit_costs")
        costs_count = cursor.fetchone()[0]
        logger.info(f"✅ Final credit costs count: {costs_count} records")
        
        cursor.execute("SELECT COUNT(*) FROM packages")
        packages_count = cursor.fetchone()[0]
        logger.info(f"✅ Final packages count: {packages_count} records")
        
        cursor.close()
        conn.close()
        
        logger.info("🎉 Final database fix completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error in final fix: {e}")

if __name__ == "__main__":
    final_fix()

