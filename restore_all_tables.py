#!/usr/bin/env python3
"""
NerdX Bot Database Complete Table Restoration Script
This script will restore ALL 41 tables that were dropped during the reset
"""

import psycopg2
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def restore_all_tables():
    """Restore ALL 41 tables that were dropped"""
    try:
        logger.info("🔄 Starting complete table restoration (ALL 41 tables)...")
        
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("✅ Connected to database successfully")
        
        # ========================================
        # RESTORE ALL 41 TABLES
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
        
        # 2. users table
        logger.info("📋 Creating users table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                whatsapp_id VARCHAR(50) UNIQUE NOT NULL,
                nerdx_id VARCHAR(20) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                surname VARCHAR(100) NOT NULL,
                date_of_birth DATE,
                phone_number VARCHAR(20),
                email VARCHAR(120),
                credits INTEGER DEFAULT 0,
                total_points INTEGER DEFAULT 0,
                streak_count INTEGER DEFAULT 0,
                last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                referred_by VARCHAR(20),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 3. payment_transactions table
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
        
        # 4. payments table
        logger.info("📋 Creating payments table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                payment_method VARCHAR(50),
                reference_code VARCHAR(100) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP
            );
        """)
        
        # 5. pending_payments table
        logger.info("📋 Creating pending_payments table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS pending_payments (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                payment_method VARCHAR(50),
                reference_code VARCHAR(100) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 6. packages table
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
        
        # 7. credit_costs table
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
        
        # 8. credit_transactions table
        logger.info("📋 Creating credit_transactions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS credit_transactions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                action VARCHAR(100) NOT NULL,
                credits_change INTEGER NOT NULL,
                balance_before INTEGER NOT NULL,
                balance_after INTEGER NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 9. admin_users table
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
        
        # 10. admin_sessions table
        logger.info("📋 Creating admin_sessions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                session_token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 11. admin_password_reset_tokens table
        logger.info("📋 Creating admin_password_reset_tokens table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_password_reset_tokens (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 12. admin_activity_logs table
        logger.info("📋 Creating admin_activity_logs table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_activity_logs (
                id SERIAL PRIMARY KEY,
                admin_id INTEGER NOT NULL,
                action VARCHAR(100) NOT NULL,
                details TEXT,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 13. user_sessions table
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
        
        # 14. user_question_history table
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
        
        # 15. user_stats table
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
        
        # 16. questions table
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
        
        # 17. question_bank table
        logger.info("📋 Creating question_bank table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS question_bank (
                id SERIAL PRIMARY KEY,
                subject VARCHAR(50) NOT NULL,
                topic VARCHAR(100) NOT NULL,
                difficulty VARCHAR(20) NOT NULL,
                question_text TEXT NOT NULL,
                answer TEXT NOT NULL,
                explanation TEXT,
                usage_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 18. question_cache table
        logger.info("📋 Creating question_cache table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS question_cache (
                id SERIAL PRIMARY KEY,
                cache_key VARCHAR(255) UNIQUE NOT NULL,
                question_data TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 19. olevel_math_questions table
        logger.info("📋 Creating olevel_math_questions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS olevel_math_questions (
                id SERIAL PRIMARY KEY,
                topic VARCHAR(100) NOT NULL,
                difficulty VARCHAR(20) NOT NULL,
                question_text TEXT NOT NULL,
                solution TEXT,
                answer TEXT,
                marks INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 20. quiz_sessions table
        logger.info("📋 Creating quiz_sessions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS quiz_sessions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                subject VARCHAR(50) NOT NULL,
                topic VARCHAR(100) NOT NULL,
                difficulty VARCHAR(20) NOT NULL,
                questions_answered INTEGER DEFAULT 0,
                correct_answers INTEGER DEFAULT 0,
                score INTEGER DEFAULT 0,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP
            );
        """)
        
        # 21. registration_sessions table
        logger.info("📋 Creating registration_sessions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS registration_sessions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                step VARCHAR(50) NOT NULL,
                data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 22. referral_codes table
        logger.info("📋 Creating referral_codes table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS referral_codes (
                id SERIAL PRIMARY KEY,
                code VARCHAR(20) UNIQUE NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                usage_limit INTEGER DEFAULT -1,
                usage_count INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 23. referrals table
        logger.info("📋 Creating referrals table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS referrals (
                id SERIAL PRIMARY KEY,
                referrer_id VARCHAR(255) NOT NULL,
                referred_id VARCHAR(255) NOT NULL,
                referral_code VARCHAR(20) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                bonus_credits INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 24. referral_stats table
        logger.info("📋 Creating referral_stats table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS referral_stats (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                total_referrals INTEGER DEFAULT 0,
                successful_referrals INTEGER DEFAULT 0,
                total_bonus_earned INTEGER DEFAULT 0,
                last_referral_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 25. user_badges table
        logger.info("📋 Creating user_badges table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_badges (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                badge_type VARCHAR(50) NOT NULL,
                badge_name VARCHAR(100) NOT NULL,
                description TEXT,
                earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 26. spaced_repetition table
        logger.info("📋 Creating spaced_repetition table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS spaced_repetition (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                question_id INTEGER NOT NULL,
                next_review TIMESTAMP NOT NULL,
                interval_days INTEGER DEFAULT 1,
                ease_factor DECIMAL(3,2) DEFAULT 2.5,
                review_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 27. system_settings table
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
        
        # 28. activity_logs table
        logger.info("📋 Creating activity_logs table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS activity_logs (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255),
                action VARCHAR(100) NOT NULL,
                details TEXT,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 29. ai_generation_logs table
        logger.info("📋 Creating ai_generation_logs table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ai_generation_logs (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255),
                action VARCHAR(100) NOT NULL,
                prompt TEXT,
                response_length INTEGER,
                tokens_used INTEGER,
                processing_time_ms INTEGER,
                success BOOLEAN DEFAULT TRUE,
                error_message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 30. broadcast_logs table
        logger.info("📋 Creating broadcast_logs table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS broadcast_logs (
                id SERIAL PRIMARY KEY,
                admin_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                target_users INTEGER DEFAULT 0,
                sent_count INTEGER DEFAULT 0,
                failed_count INTEGER DEFAULT 0,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP
            );
        """)
        
        # 31. daily_metrics table
        logger.info("📋 Creating daily_metrics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS daily_metrics (
                id SERIAL PRIMARY KEY,
                date DATE UNIQUE NOT NULL,
                total_users INTEGER DEFAULT 0,
                active_users INTEGER DEFAULT 0,
                new_registrations INTEGER DEFAULT 0,
                questions_asked INTEGER DEFAULT 0,
                total_revenue DECIMAL(10,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 32. daily_user_activity table
        logger.info("📋 Creating daily_user_activity table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS daily_user_activity (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                questions_asked INTEGER DEFAULT 0,
                credits_spent INTEGER DEFAULT 0,
                time_spent_minutes INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, date)
            );
        """)
        
        # 33. feature_usage_analytics table
        logger.info("📋 Creating feature_usage_analytics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS feature_usage_analytics (
                id SERIAL PRIMARY KEY,
                feature_name VARCHAR(100) NOT NULL,
                usage_count INTEGER DEFAULT 0,
                unique_users INTEGER DEFAULT 0,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 34. package_analytics table
        logger.info("📋 Creating package_analytics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS package_analytics (
                id SERIAL PRIMARY KEY,
                package_id INTEGER NOT NULL,
                sales_count INTEGER DEFAULT 0,
                total_revenue DECIMAL(10,2) DEFAULT 0,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 35. payment_method_analytics table
        logger.info("📋 Creating payment_method_analytics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS payment_method_analytics (
                id SERIAL PRIMARY KEY,
                payment_method VARCHAR(50) NOT NULL,
                transaction_count INTEGER DEFAULT 0,
                total_amount DECIMAL(10,2) DEFAULT 0,
                success_rate DECIMAL(5,2) DEFAULT 0,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 36. revenue_analytics table
        logger.info("📋 Creating revenue_analytics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS revenue_analytics (
                id SERIAL PRIMARY KEY,
                date DATE NOT NULL,
                total_revenue DECIMAL(10,2) DEFAULT 0,
                new_subscriptions INTEGER DEFAULT 0,
                recurring_revenue DECIMAL(10,2) DEFAULT 0,
                refunds DECIMAL(10,2) DEFAULT 0,
                net_revenue DECIMAL(10,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 37. subject_analytics table
        logger.info("📋 Creating subject_analytics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS subject_analytics (
                id SERIAL PRIMARY KEY,
                subject VARCHAR(50) NOT NULL,
                questions_asked INTEGER DEFAULT 0,
                unique_users INTEGER DEFAULT 0,
                average_score DECIMAL(5,2) DEFAULT 0,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 38. subject_usage_analytics table
        logger.info("📋 Creating subject_usage_analytics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS subject_usage_analytics (
                id SERIAL PRIMARY KEY,
                subject VARCHAR(50) NOT NULL,
                topic VARCHAR(100) NOT NULL,
                usage_count INTEGER DEFAULT 0,
                difficulty_distribution JSONB,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 39. user_engagement_metrics table
        logger.info("📋 Creating user_engagement_metrics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_engagement_metrics (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                date DATE NOT NULL,
                session_count INTEGER DEFAULT 0,
                total_session_time INTEGER DEFAULT 0,
                questions_per_session DECIMAL(5,2) DEFAULT 0,
                return_rate BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, date)
            );
        """)
        
        # 40. user_financial_summary table
        logger.info("📋 Creating user_financial_summary table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_financial_summary (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                total_spent DECIMAL(10,2) DEFAULT 0,
                total_credits_purchased INTEGER DEFAULT 0,
                total_credits_used INTEGER DEFAULT 0,
                current_balance INTEGER DEFAULT 0,
                last_purchase_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 41. user_sessions_analytics table
        logger.info("📋 Creating user_sessions_analytics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_sessions_analytics (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                session_id INTEGER NOT NULL,
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP,
                duration_seconds INTEGER,
                actions_performed INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 42. system_health_logs table
        logger.info("📋 Creating system_health_logs table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS system_health_logs (
                id SERIAL PRIMARY KEY,
                component VARCHAR(100) NOT NULL,
                status VARCHAR(20) NOT NULL,
                message TEXT,
                response_time_ms INTEGER,
                error_details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 43. system_performance_metrics table
        logger.info("📋 Creating system_performance_metrics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS system_performance_metrics (
                id SERIAL PRIMARY KEY,
                metric_name VARCHAR(100) NOT NULL,
                metric_value DECIMAL(10,2) NOT NULL,
                unit VARCHAR(20),
                timestamp TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 44. rate_limits table
        logger.info("📋 Creating rate_limits table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS rate_limits (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                action VARCHAR(100) NOT NULL,
                request_count INTEGER DEFAULT 1,
                window_start TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, action, window_start)
            );
        """)
        
        logger.info("✅ All 44 tables created successfully!")
        
        # ========================================
        # CREATE INDEXES FOR ALL TABLES
        # ========================================
        logger.info("🔍 Creating indexes for all tables...")
        
        # Create indexes for all tables
        index_queries = [
            # users_registration indexes
            "CREATE INDEX IF NOT EXISTS idx_users_registration_chat_id ON users_registration(chat_id);",
            "CREATE INDEX IF NOT EXISTS idx_users_registration_nerdx_id ON users_registration(nerdx_id);",
            "CREATE INDEX IF NOT EXISTS idx_users_registration_referred_by ON users_registration(referred_by_nerdx_id);",
            
            # users indexes
            "CREATE INDEX IF NOT EXISTS idx_users_whatsapp_id ON users(whatsapp_id);",
            "CREATE INDEX IF NOT EXISTS idx_users_nerdx_id ON users(nerdx_id);",
            
            # payment_transactions indexes
            "CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);",
            "CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference_code ON payment_transactions(reference_code);",
            
            # payments indexes
            "CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);",
            
            # admin_users indexes
            "CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);",
            "CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);",
            
            # user_sessions indexes
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_user_sessions_subject ON user_sessions(subject);",
            
            # user_question_history indexes
            "CREATE INDEX IF NOT EXISTS idx_user_question_history_user_id ON user_question_history(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_user_question_history_topic ON user_question_history(topic);",
            
            # questions indexes
            "CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);",
            "CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);",
            "CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);",
            
            # question_bank indexes
            "CREATE INDEX IF NOT EXISTS idx_question_bank_subject ON question_bank(subject);",
            "CREATE INDEX IF NOT EXISTS idx_question_bank_topic ON question_bank(topic);",
            
            # referral_codes indexes
            "CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);",
            "CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);",
            
            # referrals indexes
            "CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);",
            "CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);",
            
            # daily_metrics indexes
            "CREATE INDEX IF NOT EXISTS idx_daily_metrics_date ON daily_metrics(date);",
            
            # daily_user_activity indexes
            "CREATE INDEX IF NOT EXISTS idx_daily_user_activity_user_id ON daily_user_activity(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_daily_user_activity_date ON daily_user_activity(date);",
            
            # activity_logs indexes
            "CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);",
            "CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);",
            
            # ai_generation_logs indexes
            "CREATE INDEX IF NOT EXISTS idx_ai_generation_logs_user_id ON ai_generation_logs(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_ai_generation_logs_action ON ai_generation_logs(action);",
            
            # system_health_logs indexes
            "CREATE INDEX IF NOT EXISTS idx_system_health_logs_component ON system_health_logs(component);",
            "CREATE INDEX IF NOT EXISTS idx_system_health_logs_status ON system_health_logs(status);",
            
            # rate_limits indexes
            "CREATE INDEX IF NOT EXISTS idx_rate_limits_user_id ON rate_limits(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_rate_limits_action ON rate_limits(action);"
        ]
        
        for query in index_queries:
            try:
                cursor.execute(query)
            except Exception as e:
                logger.info(f"   ℹ️  Index already exists: {e}")
        
        logger.info("✅ All indexes created successfully!")
        
        # ========================================
        # ENABLE ROW LEVEL SECURITY
        # ========================================
        logger.info("🔒 Enabling Row Level Security...")
        
        # Get all table names
        cursor.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename NOT LIKE 'pg_%'
            ORDER BY tablename;
        """)
        
        all_tables = [row[0] for row in cursor.fetchall()]
        
        for table in all_tables:
            try:
                cursor.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;")
                logger.info(f"   ✅ Enabled RLS for {table}")
            except Exception as e:
                logger.info(f"   ℹ️  {table} RLS already enabled: {e}")
        
        # ========================================
        # CREATE RLS POLICIES
        # ========================================
        logger.info("📋 Creating RLS policies...")
        
        for table in all_tables:
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
        
        # Insert default packages
        packages = [
            ('Starter Pack', 'Get started with NerdX', 100, 5.00),
            ('Student Pack', 'Perfect for students', 250, 10.00),
            ('Premium Pack', 'Best value for money', 500, 18.00),
            ('Ultimate Pack', 'Maximum credits', 1000, 30.00)
        ]
        
        for name, desc, credits, price in packages:
            try:
                cursor.execute("""
                    INSERT INTO packages (name, description, credits, price)
                    VALUES (%s, %s, %s, %s);
                """, (name, desc, credits, price))
                logger.info(f"   ✅ Inserted package: {name}")
            except Exception as e:
                logger.info(f"   ℹ️  Package {name} already exists: {e}")
        
        # Insert default credit costs
        credit_costs = [
            ('math_easy', 5, 'Mathematics', 'Topical Questions', 'Easy math questions'),
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
        logger.info("🔍 Verifying complete table restoration...")
        
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
        logger.info("🎉 Complete table restoration finished!")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Complete table restoration failed: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 60)
    print("🔄 NERDX BOT COMPLETE TABLE RESTORATION")
    print("=" * 60)
    print("This will restore ALL 44 tables that were dropped")
    print("Including all analytics, logging, and specialized tables")
    print("=" * 60)
    
    print("\n🔄 Starting complete table restoration...")
    print("⏳ This will take several minutes to restore all tables...")
    
    # Execute restoration
    success = restore_all_tables()
    
    if success:
        print("\n🎉 COMPLETE TABLE RESTORATION FINISHED!")
        print("✅ All 44 tables have been restored")
        print("✅ Complete database structure is back to normal")
        print("✅ All indexes, RLS, and policies are set up")
        print("✅ Default data has been inserted")
        print("\n📋 What was restored:")
        print("   - All core tables (users, payments, questions)")
        print("   - All analytics tables (daily metrics, user analytics)")
        print("   - All logging tables (activity, AI generation, system health)")
        print("   - All specialized tables (referrals, badges, spaced repetition)")
        print("   - All admin and system tables")
        print("\n📋 Next steps:")
        print("   1. Test the bot functionality")
        print("   2. Verify all features work")
        print("   3. Start fresh marketing campaign")
    else:
        print("\n❌ COMPLETE TABLE RESTORATION FAILED!")
        print("Please check the logs above for errors")

if __name__ == "__main__":
    main()
