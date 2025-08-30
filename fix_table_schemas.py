#!/usr/bin/env python3
"""
Database Table Schema Fixer for NerdX Bot Dashboard
This script connects to the Supabase database and creates all missing tables
"""

import psycopg2
import logging
from datetime import datetime
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def get_database_connection():
    """Create and return database connection"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        logger.info("✅ Database connection established successfully")
        return conn
            except Exception as e:
        logger.error(f"❌ Failed to connect to database: {e}")
        return None

def execute_sql_commands(conn):
    """Execute all SQL commands to fix the database schema"""
    
    # SQL commands to create missing tables
    sql_commands = [
        # 1. ANALYTICS TABLES FOR DASHBOARD
        """
        -- Daily user activity analytics table
        CREATE TABLE IF NOT EXISTS daily_user_activity (
                id SERIAL PRIMARY KEY,
            date DATE UNIQUE NOT NULL,
            total_active_users INTEGER DEFAULT 0,
            new_users INTEGER DEFAULT 0,
            returning_users INTEGER DEFAULT 0,
            total_sessions INTEGER DEFAULT 0,
            avg_session_duration INTEGER DEFAULT 0,
            total_questions_attempted INTEGER DEFAULT 0,
            total_credits_used INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        
        """
        -- Subject usage analytics table
        CREATE TABLE IF NOT EXISTS subject_usage_analytics (
                id SERIAL PRIMARY KEY,
            date DATE NOT NULL,
            subject VARCHAR(100) NOT NULL,
            total_attempts INTEGER DEFAULT 0,
            correct_attempts INTEGER DEFAULT 0,
            avg_time_per_question INTEGER DEFAULT 0,
            unique_users INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(date, subject)
        );
        """,
        
        """
        -- User engagement metrics table
        CREATE TABLE IF NOT EXISTS user_engagement_metrics (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
            date DATE NOT NULL,
            session_count INTEGER DEFAULT 1,
            total_time_spent INTEGER DEFAULT 0,
            questions_attempted INTEGER DEFAULT 0,
            questions_correct INTEGER DEFAULT 0,
            credits_used INTEGER DEFAULT 0,
            subjects_engaged TEXT[],
            engagement_score DECIMAL(5,2) DEFAULT 0.0,
            retention_status VARCHAR(20) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, date)
        );
        """,
        
        """
        -- Feature usage analytics table
        CREATE TABLE IF NOT EXISTS feature_usage_analytics (
                id SERIAL PRIMARY KEY,
            date DATE NOT NULL,
            feature_name VARCHAR(100) NOT NULL,
            usage_count INTEGER DEFAULT 0,
            unique_users INTEGER DEFAULT 0,
            total_time_spent INTEGER DEFAULT 0,
            credits_consumed INTEGER DEFAULT 0,
            success_rate DECIMAL(5,2) DEFAULT 100.0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(date, feature_name)
        );
        """,
        
        # 2. PAYMENT AND PACKAGE TABLES
        """
        -- Packages table for credit packages
        CREATE TABLE IF NOT EXISTS packages (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                credits INTEGER NOT NULL,
                price DECIMAL(10,2) NOT NULL,
            is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        
        """
        -- Broadcast logs table for admin announcements
        CREATE TABLE IF NOT EXISTS broadcast_logs (
                id SERIAL PRIMARY KEY,
            admin_user VARCHAR(100) NOT NULL,
            message TEXT NOT NULL,
            target_group VARCHAR(50) DEFAULT 'all',
            total_recipients INTEGER DEFAULT 0,
            successful_sends INTEGER DEFAULT 0,
            failed_sends INTEGER DEFAULT 0,
            additional_data JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        
        # 3. CREDIT COSTS MANAGEMENT TABLE
        """
        -- Credit costs table for dynamic pricing
        CREATE TABLE IF NOT EXISTS credit_costs (
                id SERIAL PRIMARY KEY,
            action_key VARCHAR(100) UNIQUE NOT NULL,
            action_name VARCHAR(100) NOT NULL,
            category VARCHAR(50) NOT NULL,
            cost INTEGER NOT NULL DEFAULT 0,
                description TEXT,
            is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """,
        
        # 4. ENHANCED PAYMENT TRANSACTIONS TABLE
        """
        -- Add missing columns to existing payment_transactions table
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_transactions' AND column_name='payment_method') THEN
                ALTER TABLE payment_transactions ADD COLUMN payment_method VARCHAR(50) DEFAULT 'ecocash';
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_transactions' AND column_name='phone_number') THEN
                ALTER TABLE payment_transactions ADD COLUMN phone_number VARCHAR(20);
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_transactions' AND column_name='email') THEN
                ALTER TABLE payment_transactions ADD COLUMN email VARCHAR(255);
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_transactions' AND column_name='admin_notes') THEN
                ALTER TABLE payment_transactions ADD COLUMN admin_notes TEXT;
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_transactions' AND column_name='rejection_reason') THEN
                ALTER TABLE payment_transactions ADD COLUMN rejection_reason TEXT;
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_transactions' AND column_name='rejected_at') THEN
                ALTER TABLE payment_transactions ADD COLUMN rejected_at TIMESTAMP;
            END IF;
        END $$;
        """,
        
        # 5. CREATE INDEXES FOR PERFORMANCE
        """
        -- Analytics table indexes
        CREATE INDEX IF NOT EXISTS idx_daily_user_activity_date ON daily_user_activity(date);
        CREATE INDEX IF NOT EXISTS idx_subject_usage_analytics_date_subject ON subject_usage_analytics(date, subject);
        CREATE INDEX IF NOT EXISTS idx_user_engagement_metrics_user_date ON user_engagement_metrics(user_id, date);
        CREATE INDEX IF NOT EXISTS idx_feature_usage_analytics_date_feature ON feature_usage_analytics(date, feature_name);
        """,
        
        """
        -- Payment and package indexes
        CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(is_active);
        CREATE INDEX IF NOT EXISTS idx_broadcast_logs_admin_date ON broadcast_logs(admin_user, created_at);
        CREATE INDEX IF NOT EXISTS idx_credit_costs_category ON credit_costs(category);
        CREATE INDEX IF NOT EXISTS idx_credit_costs_active ON credit_costs(is_active);
        """,
        
        """
        -- Enhanced payment transaction indexes
        CREATE INDEX IF NOT EXISTS idx_payment_transactions_method ON payment_transactions(payment_method);
        CREATE INDEX IF NOT EXISTS idx_payment_transactions_phone ON payment_transactions(phone_number);
        CREATE INDEX IF NOT EXISTS idx_payment_transactions_email ON payment_transactions(email);
        """,
        
        # 6. ENABLE ROW LEVEL SECURITY (RLS)
        """
        -- Enable RLS on new tables
        ALTER TABLE daily_user_activity ENABLE ROW LEVEL SECURITY;
        ALTER TABLE subject_usage_analytics ENABLE ROW LEVEL SECURITY;
        ALTER TABLE user_engagement_metrics ENABLE ROW LEVEL SECURITY;
        ALTER TABLE feature_usage_analytics ENABLE ROW LEVEL SECURITY;
        ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
        ALTER TABLE broadcast_logs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE credit_costs ENABLE ROW LEVEL SECURITY;
        """,
        
        # 7. CREATE POLICIES
        """
        -- Create policies for new tables (allow all operations for bot functionality)
        DROP POLICY IF EXISTS "Daily user activity - allow all operations" ON daily_user_activity;
        CREATE POLICY "Daily user activity - allow all operations" ON daily_user_activity
            FOR ALL USING (true) WITH CHECK (true);
        """,
        
        """
        DROP POLICY IF EXISTS "Subject usage analytics - allow all operations" ON subject_usage_analytics;
        CREATE POLICY "Subject usage analytics - allow all operations" ON subject_usage_analytics
            FOR ALL USING (true) WITH CHECK (true);
        """,
        
        """
        DROP POLICY IF EXISTS "User engagement metrics - allow all operations" ON user_engagement_metrics;
        CREATE POLICY "User engagement metrics - allow all operations" ON user_engagement_metrics
            FOR ALL USING (true) WITH CHECK (true);
        """,
        
        """
        DROP POLICY IF EXISTS "Feature usage analytics - allow all operations" ON feature_usage_analytics;
        CREATE POLICY "Feature usage analytics - allow all operations" ON feature_usage_analytics
            FOR ALL USING (true) WITH CHECK (true);
        """,
        
        """
        DROP POLICY IF EXISTS "Packages - allow all operations" ON packages;
        CREATE POLICY "Packages - allow all operations" ON packages
            FOR ALL USING (true) WITH CHECK (true);
        """,
        
        """
        DROP POLICY IF EXISTS "Broadcast logs - allow all operations" ON broadcast_logs;
        CREATE POLICY "Broadcast logs - allow all operations" ON broadcast_logs
            FOR ALL USING (true) WITH CHECK (true);
        """,
        
        """
        DROP POLICY IF EXISTS "Credit costs - allow all operations" ON credit_costs;
        CREATE POLICY "Credit costs - allow all operations" ON credit_costs
            FOR ALL USING (true) WITH CHECK (true);
        """,
        
        # 8. INSERT DEFAULT DATA
        """
        -- Insert default credit packages
        INSERT INTO packages (name, description, credits, price) VALUES
        ('Starter Pack', 'Perfect for beginners', 100, 5.00),
        ('Student Pack', 'Most popular choice', 500, 20.00),
        ('Scholar Pack', 'For serious learners', 1000, 35.00),
        ('Master Pack', 'Unlimited learning', 2000, 60.00)
        ON CONFLICT DO NOTHING;
        """,
        
        """
        -- Insert default credit costs
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
        ON CONFLICT (action_key) DO NOTHING;
        """
    ]
    
    cursor = conn.cursor()
    successful_commands = 0
    failed_commands = 0
    
    logger.info("🚀 Starting database schema fix...")
    
    for i, sql in enumerate(sql_commands, 1):
        try:
            cursor.execute(sql)
            successful_commands += 1
            logger.info(f"✅ Command {i}/{len(sql_commands)} executed successfully")
            except Exception as e:
            failed_commands += 1
            logger.error(f"❌ Command {i}/{len(sql_commands)} failed: {e}")
            logger.error(f"SQL: {sql[:100]}...")
    
    cursor.close()
    
    logger.info(f"📊 Schema fix completed: {successful_commands} successful, {failed_commands} failed")
    return successful_commands, failed_commands

def verify_tables(conn):
    """Verify that all required tables were created successfully"""
    logger.info("🔍 Verifying table creation...")
    
    required_tables = [
        'daily_user_activity', 'subject_usage_analytics', 'user_engagement_metrics',
        'feature_usage_analytics', 'packages', 'broadcast_logs', 'credit_costs'
    ]
    
    cursor = conn.cursor()
    
    # Check table existence
                cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ANY(%s)
    """, (required_tables,))
    
    existing_tables = [row[0] for row in cursor.fetchall()]
    missing_tables = [table for table in required_tables if table not in existing_tables]
    
    logger.info(f"✅ Existing tables: {existing_tables}")
    if missing_tables:
        logger.warning(f"⚠️  Missing tables: {missing_tables}")
    else:
        logger.info("🎉 All required tables created successfully!")
    
    # Check default data
    try:
        cursor.execute("SELECT COUNT(*) FROM packages")
        packages_count = cursor.fetchone()[0]
        logger.info(f"📦 Credit packages: {packages_count} records")
        
        cursor.execute("SELECT COUNT(*) FROM credit_costs")
        costs_count = cursor.fetchone()[0]
        logger.info(f"💰 Credit costs: {costs_count} records")
            except Exception as e:
        logger.error(f"❌ Error checking default data: {e}")
    
    cursor.close()
    
    return len(missing_tables) == 0

def main():
    """Main function to execute the database fix"""
    logger.info("🚀 Starting NerdX Bot Database Schema Fix")
    logger.info(f"🔗 Connecting to: {DATABASE_URL.split('@')[1]}")
    
    # Connect to database
    conn = get_database_connection()
    if not conn:
        logger.error("❌ Cannot proceed without database connection")
        sys.exit(1)
    
    try:
        # Execute SQL commands
        successful, failed = execute_sql_commands(conn)
        
        # Verify results
        all_tables_created = verify_tables(conn)
        
        # Summary
        logger.info("\n" + "="*60)
        logger.info("📋 DATABASE FIX SUMMARY")
        logger.info("="*60)
        logger.info(f"✅ Successful commands: {successful}")
        logger.info(f"❌ Failed commands: {failed}")
        logger.info(f"🎯 All tables created: {'Yes' if all_tables_created else 'No'}")
        
        if all_tables_created:
            logger.info("\n🎉 SUCCESS! Your dashboard should now work properly.")
            logger.info("🌐 Test the dashboard at: /dashboard")
            logger.info("🔑 Login with: admin@nerdx.com / admin123")
        else:
            logger.warning("\n⚠️  Some tables may be missing. Check the logs above.")
        
        logger.info("="*60)
        
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
    finally:
        conn.close()
        logger.info("🔌 Database connection closed")

if __name__ == "__main__":
    main()
iencd