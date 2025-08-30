#!/usr/bin/env python3
"""
Fix remaining database issues for NerdX Bot Dashboard
"""

import psycopg2
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def fix_remaining_issues():
    """Fix the remaining database issues"""
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("🔧 Fixing remaining database issues...")
        
        # Fix 1: Add missing columns to credit_costs table
        try:
        cursor.execute("""
                ALTER TABLE credit_costs 
                ADD COLUMN IF NOT EXISTS action_name VARCHAR(100),
                ADD COLUMN IF NOT EXISTS category VARCHAR(50),
                ADD COLUMN IF NOT EXISTS description TEXT,
                ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            """)
            logger.info("✅ Added missing columns to credit_costs table")
        except Exception as e:
            logger.error(f"❌ Error adding columns to credit_costs: {e}")
        
        # Fix 2: Update existing credit_costs records with proper data
        try:
        cursor.execute("""
                UPDATE credit_costs SET 
                action_name = CASE 
                    WHEN action_key = 'math_topical' THEN 'Math Topical Questions'
                    WHEN action_key = 'math_exam' THEN 'Math Exam Questions'
                    WHEN action_key = 'math_graph_practice' THEN 'Math Graph Practice'
                    WHEN action_key = 'combined_science_topical' THEN 'Science Topical Questions'
                    WHEN action_key = 'combined_science_exam' THEN 'Science Exam Questions'
                    WHEN action_key = 'english_topical' THEN 'English Topical Questions'
                    WHEN action_key = 'english_comprehension' THEN 'English Comprehension'
                    WHEN action_key = 'english_essay_writing' THEN 'English Essay Writing'
                    WHEN action_key = 'image_solve' THEN 'Image Question Solving'
                    WHEN action_key = 'audio_feature' THEN 'Audio Question Feature'
                    WHEN action_key = 'voice_chat' THEN 'Voice Chat Feature'
                    ELSE 'Unknown Action'
                END,
                category = CASE 
                    WHEN action_key LIKE 'math%' THEN 'math'
                    WHEN action_key LIKE 'science%' THEN 'science'
                    WHEN action_key LIKE 'english%' THEN 'english'
                    ELSE 'features'
                END,
                description = CASE 
                    WHEN action_key = 'math_topical' THEN 'Mathematics topical practice questions'
                    WHEN action_key = 'math_exam' THEN 'Mathematics exam-style questions'
                    WHEN action_key = 'math_graph_practice' THEN 'Mathematics graph generation and practice'
                    WHEN action_key = 'combined_science_topical' THEN 'Combined science topical practice'
                    WHEN action_key = 'combined_science_exam' THEN 'Combined science exam-style questions'
                    WHEN action_key = 'english_topical' THEN 'English language topical practice'
                    WHEN action_key = 'english_comprehension' THEN 'English reading comprehension'
                    WHEN action_key = 'english_essay_writing' THEN 'English essay writing assistance'
                    WHEN action_key = 'image_solve' THEN 'Solve questions from images'
                    WHEN action_key = 'audio_feature' THEN 'Audio-based question answering'
                    WHEN action_key = 'voice_chat' THEN 'Voice-based chat with AI'
                    ELSE 'Feature description'
                END
                WHERE action_name IS NULL OR category IS NULL
            """)
            logger.info("✅ Updated credit_costs records with proper data")
    except Exception as e:
            logger.error(f"❌ Error updating credit_costs data: {e}")

        # Fix 3: Create missing indexes
    try:
        cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_broadcast_logs_admin_date ON broadcast_logs(admin_user, created_at);
                CREATE INDEX IF NOT EXISTS idx_credit_costs_category ON credit_costs(category);
                CREATE INDEX IF NOT EXISTS idx_credit_costs_active ON credit_costs(is_active);
            """)
            logger.info("✅ Created missing indexes")
    except Exception as e:
            logger.error(f"❌ Error creating indexes: {e}")

        # Fix 4: Insert any missing credit costs
    try:
        cursor.execute("""
                INSERT INTO credit_costs (action_key, action_name, category, cost, description) VALUES
                ('math_topical', 'Math Topical Questions', 'math', 5, 'Mathematics topical practice questions'),
                ('math_exam', 'Math Exam Questions', 'math', 10, 'Mathematics exam-style questions'),
                ('math_graph_practice', 'Math Graph Practice', 'math', 15, 'Mathematics graph generation and practice'),
                ('combined_science_topical', 'Science Topical Questions', 'science', 5, 'Combined science topical practice'),
                ('combined_science_exam', 'Science Exam Questions', 'science', 10, 'Combined science exam-style questions'),
                ('english_topical', 'English Topical Questions', 'english', 3, 'English language topical practice'),
                ('english_comprehension', 'English Comprehension', 'english', 7, 'English reading comprehension'),
                ('english_essay_writing', 'English Essay Writing', 'english', 12, 'English essay writing assistance'),
                ('image_solve', 'Image Question Solving', 'features', 15, 'Solve questions from images'),
                ('audio_feature', 'Audio Question Feature', 'features', 20, 'Audio-based question answering'),
                ('voice_chat', 'Voice Chat Feature', 'features', 25, 'Voice-based chat with AI')
                ON CONFLICT (action_key) DO UPDATE SET
                action_name = EXCLUDED.action_name,
                category = EXCLUDED.category,
                cost = EXCLUDED.cost,
                description = EXCLUDED.description,
                updated_at = CURRENT_TIMESTAMP
            """)
            logger.info("✅ Inserted/updated credit costs data")
    except Exception as e:
            logger.error(f"❌ Error inserting credit costs: {e}")
        
        # Verify the fix
        cursor.execute("SELECT COUNT(*) FROM credit_costs WHERE action_name IS NOT NULL AND category IS NOT NULL")
        valid_records = cursor.fetchone()[0]
        logger.info(f"✅ Credit costs with valid data: {valid_records} records")
        
        cursor.close()
        conn.close()
        
        logger.info("🎉 All remaining issues fixed successfully!")
                    
            except Exception as e:
        logger.error(f"❌ Error fixing remaining issues: {e}")

if __name__ == "__main__":
    fix_remaining_issues()
