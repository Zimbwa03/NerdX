#!/usr/bin/env python3
"""
NerdX Bot Database Table Restoration Script
This script will restore all the tables that were dropped during the reset
"""

import psycopg2
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def restore_tables():
    """Restore all the tables that were dropped"""
    try:
        logger.info("🔄 Starting table restoration...")
        
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("✅ Connected to database successfully")
        
        # ========================================
        # RESTORE ALL TABLES
        # ========================================
        
        # 1. users_registration table
        logger.info("📋 Creating users_registration table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users_registration (
                id SERIAL PRIMARY KEY,
                chat_id VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                surname VARCHAR(255) NOT NULL,
                date_of_birth VARCHAR(10) NOT NULL,
                nerdx_id VARCHAR(10) UNIQUE NOT NULL,
                referred_by_nerdx_id VARCHAR(10),
                phone_number VARCHAR(20),
                email VARCHAR(255),
                credits INTEGER DEFAULT 75,
                xp INTEGER DEFAULT 0,
                level INTEGER DEFAULT 1,
                streak INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 2. payment_transactions table
        logger.info("📋 Creating payment_transactions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS payment_transactions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                package_id VARCHAR(50) NOT NULL,
                reference_code VARCHAR(100) UNIQUE NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                credits INTEGER NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                payment_proof TEXT,
                payment_method VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                proof_submitted_at TIMESTAMP,
                approved_at TIMESTAMP,
                rejected_at TIMESTAMP,
                admin_notes TEXT,
                credits_added INTEGER DEFAULT 0
            );
        """)
        
        # 3. packages table
        logger.info("📋 Creating packages table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS packages (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                credits INTEGER NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 4. credit_costs table
        logger.info("📋 Creating credit_costs table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS credit_costs (
                id SERIAL PRIMARY KEY,
                action_key VARCHAR(100) UNIQUE NOT NULL,
                cost INTEGER NOT NULL,
                category VARCHAR(50) NOT NULL,
                component VARCHAR(100) NOT NULL,
                description TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 5. admin_users table
        logger.info("📋 Creating admin_users table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(255),
                role VARCHAR(50) DEFAULT 'admin',
                is_active BOOLEAN DEFAULT TRUE,
                last_login TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 6. user_sessions table
        logger.info("📋 Creating user_sessions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_sessions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                session_data TEXT,
                subject VARCHAR(50),
                topic VARCHAR(100),
                question_id VARCHAR(100),
                session_type VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 7. user_question_history table
        logger.info("📋 Creating user_question_history table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_question_history (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                question_hash VARCHAR(255) NOT NULL,
                topic VARCHAR(100),
                difficulty VARCHAR(20),
                subject VARCHAR(50),
                asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, question_hash)
            );
        """)
        
        # 8. questions table
        logger.info("📋 Creating questions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS questions (
                id SERIAL PRIMARY KEY,
                subject VARCHAR(50) NOT NULL,
                topic VARCHAR(100) NOT NULL,
                difficulty VARCHAR(20) NOT NULL,
                question_type VARCHAR(20) NOT NULL,
                question_text TEXT NOT NULL,
                options TEXT,
                correct_answer TEXT,
                solution TEXT,
                points INTEGER DEFAULT 10,
                source VARCHAR(50) DEFAULT 'ai_generated',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 9. user_stats table
        logger.info("📋 Creating user_stats table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_stats (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                total_questions_answered INTEGER DEFAULT 0,
                correct_answers INTEGER DEFAULT 0,
                total_points_earned INTEGER DEFAULT 0,
                subjects_used TEXT[],
                last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 10. system_settings table
        logger.info("📋 Creating system_settings table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS system_settings (
                id SERIAL PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT,
                description TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # ========================================
        # CREATE INDEXES
        # ========================================
        logger.info("🔍 Creating indexes...")
        
        # users_registration indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_registration_chat_id ON users_registration(chat_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_registration_nerdx_id ON users_registration(nerdx_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_registration_referred_by ON users_registration(referred_by_nerdx_id);")
        
        # payment_transactions indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference_code ON payment_transactions(reference_code);")
        
        # user_sessions indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);")
        
        # user_question_history indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_question_history_user_id ON user_question_history(user_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_question_history_topic ON user_question_history(topic);")
        
        # questions indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);")
        
        # ========================================
        # ENABLE ROW LEVEL SECURITY
        # ========================================
        logger.info("🔒 Enabling Row Level Security...")
        
        tables = [
            'users_registration', 'payment_transactions', 'packages', 
            'credit_costs', 'admin_users', 'user_sessions', 
            'user_question_history', 'questions', 'user_stats', 'system_settings'
        ]
        
        for table in tables:
            try:
                cursor.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;")
                logger.info(f"   ✅ Enabled RLS for {table}")
            except Exception as e:
                logger.info(f"   ℹ️  {table} RLS already enabled: {e}")
        
        # ========================================
        # CREATE POLICIES
        # ========================================
        logger.info("📋 Creating RLS policies...")
        
        for table in tables:
            try:
                cursor.execute(f"""
                    DROP POLICY IF EXISTS "Allow all operations on {table}" ON {table};
                    CREATE POLICY "Allow all operations on {table}" ON {table}
                        FOR ALL USING (true) WITH CHECK (true);
                """)
                logger.info(f"   ✅ Created policy for {table}")
            except Exception as e:
                logger.info(f"   ℹ️  Policy for {table} already exists: {e}")
        
        # ========================================
        # INSERT DEFAULT DATA
        # ========================================
        logger.info("📝 Inserting default data...")
        
        # Insert default admin user
        try:
            cursor.execute("""
                INSERT INTO admin_users (username, email, password_hash, full_name, role)
                VALUES ('admin', 'admin@nerdx.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kq8Kq8', 'NerdX Admin', 'admin');
            """)
            logger.info("   ✅ Inserted default admin user")
        except Exception as e:
            logger.info(f"   ℹ️  Admin user already exists: {e}")
        
        # Insert default packages (aligned with bot pricing)
        packages = [
            ('POCKET PACKAGE', 'Perfect for quick 
            ('math_medium', 10, 'Mathematics', 'Topical Questions', 'Medium math questions'),
            ('math_hard', 20, 'Mathematics', 'Topical Questions', 'Hard math questions'),
            ('graph_generation', 15, 'Mathematics', 'Graph Generation', 'Generate mathematical graphs'),
            ('english_questions', 8, 'English', 'Topical Questions', 'English language questions'),
            ('science_questions', 10, 'Combined Science', 'Topical Questions', 'Science questions')
        ]
        
        for action, cost, category, component, desc in credit_costs:
            try:
                cursor.execute("""
                    INSERT INTO credit_costs (action_key, cost, category, component, description)
                    VALUES (%s, %s, %s, %s, %s);
                """, (action, cost, category, component, desc))
                logger.info(f"   ✅ Inserted credit cost: {action}")
            except Exception as e:
                logger.info(f"   ℹ️  Credit cost {action} already exists: {e}")
        
        # Insert system settings
        settings = [
            ('bot_name', 'NerdX Bot', 'Name of the WhatsApp bot'),
            ('default_credits', '75', 'Default credits for new users'),
            ('maintenance_mode', 'false', 'Whether the bot is in maintenance mode'),
            ('max_questions_per_day', '50', 'Maximum questions a user can ask per day')
        ]
        
        for key, value, desc in settings:
            try:
                cursor.execute("""
                    INSERT INTO system_settings (setting_key, setting_value, description)
                    VALUES (%s, %s, %s);
                """, (key, value, desc))
                logger.info(f"   ✅ Inserted setting: {key}")
            except Exception as e:
                logger.info(f"   ℹ️  Setting {key} already exists: {e}")
        
        # ========================================
        # VERIFY RESTORATION
        # ========================================
        logger.info("🔍 Verifying table restoration...")
        
        cursor.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename NOT LIKE 'pg_%'
            ORDER BY tablename;
        """)
        
        restored_tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"   📊 Restored {len(restored_tables)} tables: {restored_tables}")
        
        # Close connection
        cursor.close()
        conn.close()
        
        logger.info("✅ Database connection closed")
        logger.info("🎉 Table restoration complete!")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Table restoration failed: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 60)
    print("🔄 NERDX BOT DATABASE TABLE RESTORATION")
    print("=" * 60)
    print("This will restore all the tables that were dropped")
    print("=" * 60)
    
    print("\n🔄 Starting table restoration...")
    print("⏳ This may take a few minutes...")
    
    # Execute restoration
    success = restore_tables()
    
    if success:
        print("\n🎉 TABLE RESTORATION COMPLETE!")
        print("✅ All tables have been restored")
        print("✅ Database structure is back to normal")
        print("✅ Default data has been inserted")
        print("\n📋 Next steps:")
        print("   1. Test the bot functionality")
        print("   2. Verify all features work")
        print("   3. Start fresh marketing campaign")
    else:
        print("\n❌ TABLE RESTORATION FAILED!")
        print("Please check the logs above for errors")

if __name__ == "__main__":
    main()
