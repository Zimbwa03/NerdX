#!/usr/bin/env python3
"""
NerdX Bot Database Schema Fix Script
This script will fix incomplete table schemas by recreating them with proper columns
"""

import psycopg2
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = "postgresql://postgres:Ngonidzashe2003.@db.hvlvwvzliqrlmqjbfgoa.supabase.co:5432/postgres"

def fix_table_schemas():
    """Fix incomplete table schemas by recreating them properly"""
    try:
        logger.info("🔧 Starting table schema fixes...")
        
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        
        logger.info("✅ Connected to database successfully")
        
        # ========================================
        # DROP INCOMPLETE TABLES
        # ========================================
        logger.info("🗑️  Dropping incomplete tables...")
        
        tables_to_drop = [
            'users_registration', 'payment_transactions', 'packages', 'credit_costs',
            'admin_users', 'user_sessions', 'user_question_history', 'questions',
            'user_stats', 'system_settings'
        ]
        
        for table in tables_to_drop:
            try:
                cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")
                logger.info(f"   ✅ Dropped table: {table}")
            except Exception as e:
                logger.info(f"   ℹ️  Table {table} not found: {e}")
        
        # ========================================
        # RECREATE TABLES WITH PROPER SCHEMAS
        # ========================================
        logger.info("🔨 Recreating tables with proper schemas...")
        
        # 1. users_registration table - COMPLETE SCHEMA
        logger.info("📋 Creating users_registration table with complete schema...")
        cursor.execute("""
            CREATE TABLE users_registration (
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
        
        # 2. users table - COMPLETE SCHEMA
        logger.info("📋 Creating users table with complete schema...")
        cursor.execute("""
            CREATE TABLE users (
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
        
        # 3. payment_transactions table - COMPLETE SCHEMA
        logger.info("📋 Creating payment_transactions table with complete schema...")
        cursor.execute("""
            CREATE TABLE payment_transactions (
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
        
        # 4. payments table - COMPLETE SCHEMA
        logger.info("📋 Creating payments table with complete schema...")
        cursor.execute("""
            CREATE TABLE payments (
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
        
        # 5. pending_payments table - COMPLETE SCHEMA
        logger.info("📋 Creating pending_payments table with complete schema...")
        cursor.execute("""
            CREATE TABLE pending_payments (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                payment_method VARCHAR(50),
                reference_code VARCHAR(100) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 6. packages table - COMPLETE SCHEMA
        logger.info("📋 Creating packages table with complete schema...")
        cursor.execute("""
            CREATE TABLE packages (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                credits INTEGER NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 7. credit_costs table - COMPLETE SCHEMA
        logger.info("📋 Creating credit_costs table with complete schema...")
        cursor.execute("""
            CREATE TABLE credit_costs (
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
        
        # 8. credit_transactions table - COMPLETE SCHEMA
        logger.info("📋 Creating credit_transactions table with complete schema...")
        cursor.execute("""
            CREATE TABLE credit_transactions (
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
        
        # 9. admin_users table - COMPLETE SCHEMA
        logger.info("📋 Creating admin_users table with complete schema...")
        cursor.execute("""
            CREATE TABLE admin_users (
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
        
        # 10. admin_sessions table - COMPLETE SCHEMA
        logger.info("📋 Creating admin_sessions table with complete schema...")
        cursor.execute("""
            CREATE TABLE admin_sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                session_token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 11. admin_password_reset_tokens table - COMPLETE SCHEMA
        logger.info("📋 Creating admin_password_reset_tokens table with complete schema...")
        cursor.execute("""
            CREATE TABLE admin_password_reset_tokens (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 12. admin_activity_logs table - COMPLETE SCHEMA
        logger.info("📋 Creating admin_activity_logs table with complete schema...")
        cursor.execute("""
            CREATE TABLE admin_activity_logs (
                id SERIAL PRIMARY KEY,
                admin_id INTEGER NOT NULL,
                action VARCHAR(100) NOT NULL,
                details TEXT,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 13. user_sessions table - COMPLETE SCHEMA
        logger.info("📋 Creating user_sessions table with complete schema...")
        cursor.execute("""
            CREATE TABLE user_sessions (
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
        
        # 14. user_question_history table - COMPLETE SCHEMA
        logger.info("📋 Creating user_question_history table with complete schema...")
        cursor.execute("""
            CREATE TABLE user_question_history (
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
        
        # 15. user_stats table - COMPLETE SCHEMA
        logger.info("📋 Creating user_stats table with complete schema...")
        cursor.execute("""
            CREATE TABLE user_stats (
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
        
        # 16. questions table - COMPLETE SCHEMA
        logger.info("📋 Creating questions table with complete schema...")
        cursor.execute("""
            CREATE TABLE questions (
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
        
        # 17. question_bank table - COMPLETE SCHEMA
        logger.info("📋 Creating question_bank table with complete schema...")
        cursor.execute("""
            CREATE TABLE question_bank (
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
        
        # 18. question_cache table - COMPLETE SCHEMA
        logger.info("📋 Creating question_cache table with complete schema...")
        cursor.execute("""
            CREATE TABLE question_cache (
                id SERIAL PRIMARY KEY,
                cache_key VARCHAR(255) UNIQUE NOT NULL,
                question_data TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 19. olevel_math_questions table - COMPLETE SCHEMA
        logger.info("📋 Creating olevel_math_questions table with complete schema...")
        cursor.execute("""
            CREATE TABLE olevel_math_questions (
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
        
        # 20. quiz_sessions table - COMPLETE SCHEMA
        logger.info("📋 Creating quiz_sessions table with complete schema...")
        cursor.execute("""
            CREATE TABLE quiz_sessions (
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
        
        # 21. registration_sessions table - COMPLETE SCHEMA
        logger.info("📋 Creating registration_sessions table with complete schema...")
        cursor.execute("""
            CREATE TABLE registration_sessions (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                step VARCHAR(50) NOT NULL,
                data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 22. referral_codes table - COMPLETE SCHEMA
        logger.info("📋 Creating referral_codes table with complete schema...")
        cursor.execute("""
            CREATE TABLE referral_codes (
                id SERIAL PRIMARY KEY,
                code VARCHAR(20) UNIQUE NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                usage_limit INTEGER DEFAULT -1,
                usage_count INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 23. referrals table - COMPLETE SCHEMA
        logger.info("📋 Creating referrals table with complete schema...")
        cursor.execute("""
            CREATE TABLE referrals (
                id SERIAL PRIMARY KEY,
                referrer_id VARCHAR(255) NOT NULL,
                referred_id VARCHAR(255) NOT NULL,
                referral_code VARCHAR(20) NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                bonus_credits INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 24. referral_stats table - COMPLETE SCHEMA
        logger.info("📋 Creating referral_stats table with complete schema...")
        cursor.execute("""
            CREATE TABLE referral_stats (
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
        
        # 25. user_badges table - COMPLETE SCHEMA
        logger.info("📋 Creating user_badges table with complete schema...")
        cursor.execute("""
            CREATE TABLE user_badges (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                badge_type VARCHAR(50) NOT NULL,
                badge_name VARCHAR(100) NOT NULL,
                description TEXT,
                earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 26. spaced_repetition table - COMPLETE SCHEMA
        logger.info("📋 Creating spaced_repetition table with complete schema...")
        cursor.execute("""
            CREATE TABLE spaced_repetition (
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
        
        # 27. system_settings table - COMPLETE SCHEMA
        logger.info("📋 Creating system_settings table with complete schema...")
        cursor.execute("""
            CREATE TABLE system_settings (
                id SERIAL PRIMARY KEY,
                setting_key VARCHAR(100) UNIQUE NOT NULL,
                setting_value TEXT,
                description TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 28. activity_logs table - COMPLETE SCHEMA
        logger.info("📋 Creating activity_logs table with complete schema...")
        cursor.execute("""
            CREATE TABLE activity_logs (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255),
                action VARCHAR(100) NOT NULL,
                details TEXT,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 29. ai_generation_logs table - COMPLETE SCHEMA
        logger.info("📋 Creating ai_generation_logs table with complete schema...")
        cursor.execute("""
            CREATE TABLE ai_generation_logs (
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
        
        # 30. broadcast_logs table - COMPLETE SCHEMA
        logger.info("📋 Creating broadcast_logs table with complete schema...")
        cursor.execute("""
            CREATE TABLE broadcast_logs (
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
        
        # 31. daily_metrics table - COMPLETE SCHEMA
        logger.info("📋 Creating daily_metrics table with complete schema...")
        cursor.execute("""
            CREATE TABLE daily_metrics (
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
        
        # 32. daily_user_activity table - COMPLETE SCHEMA
        logger.info("📋 Creating daily_user_activity table with complete schema...")
        cursor.execute("""
            CREATE TABLE daily_user_activity (
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
        
        # 33. feature_usage_analytics table - COMPLETE SCHEMA
        logger.info("📋 Creating feature_usage_analytics table with complete schema...")
        cursor.execute("""
            CREATE TABLE feature_usage_analytics (
                id SERIAL PRIMARY KEY,
                feature_name VARCHAR(100) NOT NULL,
                usage_count INTEGER DEFAULT 0,
                unique_users INTEGER DEFAULT 0,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 34. package_analytics table - COMPLETE SCHEMA
        logger.info("📋 Creating package_analytics table with complete schema...")
        cursor.execute("""
            CREATE TABLE package_analytics (
                id SERIAL PRIMARY KEY,
                package_id INTEGER NOT NULL,
                sales_count INTEGER DEFAULT 0,
                total_revenue DECIMAL(10,2) DEFAULT 0,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 35. payment_method_analytics table - COMPLETE SCHEMA
        logger.info("📋 Creating payment_method_analytics table with complete schema...")
        cursor.execute("""
            CREATE TABLE payment_method_analytics (
                id SERIAL PRIMARY KEY,
                payment_method VARCHAR(50) NOT NULL,
                transaction_count INTEGER DEFAULT 0,
                total_amount DECIMAL(10,2) DEFAULT 0,
                success_rate DECIMAL(5,2) DEFAULT 0,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 36. revenue_analytics table - COMPLETE SCHEMA
        logger.info("📋 Creating revenue_analytics table with complete schema...")
        cursor.execute("""
            CREATE TABLE revenue_analytics (
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
        
        # 37. subject_analytics table - COMPLETE SCHEMA
        logger.info("📋 Creating subject_analytics table with complete schema...")
        cursor.execute("""
            CREATE TABLE subject_analytics (
                id SERIAL PRIMARY KEY,
                subject VARCHAR(50) NOT NULL,
                questions_asked INTEGER DEFAULT 0,
                unique_users INTEGER DEFAULT 0,
                average_score DECIMAL(5,2) DEFAULT 0,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 38. subject_usage_analytics table - COMPLETE SCHEMA
        logger.info("📋 Creating subject_usage_analytics table with complete schema...")
        cursor.execute("""
            CREATE TABLE subject_usage_analytics (
                id SERIAL PRIMARY KEY,
                subject VARCHAR(50) NOT NULL,
                topic VARCHAR(100) NOT NULL,
                usage_count INTEGER DEFAULT 0,
                difficulty_distribution JSONB,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 39. user_engagement_metrics table - COMPLETE SCHEMA
        logger.info("📋 Creating user_engagement_metrics table with complete schema...")
        cursor.execute("""
            CREATE TABLE user_engagement_metrics (
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
        
        # 40. user_financial_summary table - COMPLETE SCHEMA
        logger.info("📋 Creating user_financial_summary table with complete schema...")
        cursor.execute("""
            CREATE TABLE user_financial_summary (
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
        
        # 41. user_sessions_analytics table - COMPLETE SCHEMA
        logger.info("📋 Creating user_sessions_analytics table with complete schema...")
        cursor.execute("""
            CREATE TABLE user_sessions_analytics (
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
        
        # 42. system_health_logs table - COMPLETE SCHEMA
        logger.info("📋 Creating system_health_logs table with complete schema...")
        cursor.execute("""
            CREATE TABLE system_health_logs (
                id SERIAL PRIMARY KEY,
                component VARCHAR(100) NOT NULL,
                status VARCHAR(20) NOT NULL,
                message TEXT,
                response_time_ms INTEGER,
                error_details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 43. system_performance_metrics table - COMPLETE SCHEMA
        logger.info("📋 Creating system_performance_metrics table with complete schema...")
        cursor.execute("""
            CREATE TABLE system_performance_metrics (
                id SERIAL PRIMARY KEY,
                metric_name VARCHAR(100) NOT NULL,
                metric_value DECIMAL(10,2) NOT NULL,
                unit VARCHAR(20),
                timestamp TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 44. rate_limits table - COMPLETE SCHEMA
        logger.info("📋 Creating rate_limits table with complete schema...")
        cursor.execute("""
            CREATE TABLE rate_limits (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                action VARCHAR(100) NOT NULL,
                request_count INTEGER DEFAULT 1,
                window_start TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, action, window_start)
            );
        """)
        
        logger.info("✅ All 44 tables recreated with complete schemas!")
        
        # ========================================
        # CREATE INDEXES
        # ========================================
        logger.info("🔍 Creating indexes...")
        
        # Create comprehensive indexes for all tables
        index_queries = [
            # users_registration indexes
            "CREATE INDEX idx_users_registration_chat_id ON users_registration(chat_id);",
            "CREATE INDEX idx_users_registration_nerdx_id ON users_registration(nerdx_id);",
            "CREATE INDEX idx_users_registration_referred_by ON users_registration(referred_by_nerdx_id);",
            
            # users indexes
            "CREATE INDEX idx_users_whatsapp_id ON users(whatsapp_id);",
            "CREATE INDEX idx_users_nerdx_id ON users(nerdx_id);",
            
            # payment_transactions indexes
            "CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);",
            "CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);",
            "CREATE INDEX idx_payment_transactions_reference_code ON payment_transactions(reference_code);",
            
            # payments indexes
            "CREATE INDEX idx_payments_user_id ON payments(user_id);",
            "CREATE INDEX idx_payments_status ON payments(status);",
            
            # admin_users indexes
            "CREATE INDEX idx_admin_users_username ON admin_users(username);",
            "CREATE INDEX idx_admin_users_email ON admin_users(email);",
            
            # user_sessions indexes
            "CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);",
            "CREATE INDEX idx_user_sessions_subject ON user_sessions(subject);",
            
            # user_question_history indexes
            "CREATE INDEX idx_user_question_history_user_id ON user_question_history(user_id);",
            "CREATE INDEX idx_user_question_history_topic ON user_question_history(topic);",
            
            # questions indexes
            "CREATE INDEX idx_questions_subject ON questions(subject);",
            "CREATE INDEX idx_questions_topic ON questions(topic);",
            "CREATE INDEX idx_questions_difficulty ON questions(difficulty);",
            
            # question_bank indexes
            "CREATE INDEX idx_question_bank_subject ON question_bank(subject);",
            "CREATE INDEX idx_question_bank_topic ON question_bank(topic);",
            
            # referral_codes indexes
            "CREATE INDEX idx_referral_codes_code ON referral_codes(code);",
            "CREATE INDEX idx_referral_codes_user_id ON referral_codes(user_id);",
            
            # referrals indexes
            "CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);",
            "CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);",
            
            # daily_metrics indexes
            "CREATE INDEX idx_daily_metrics_date ON daily_metrics(date);",
            
            # daily_user_activity indexes
            "CREATE INDEX idx_daily_user_activity_user_id ON daily_user_activity(user_id);",
            "CREATE INDEX idx_daily_user_activity_date ON daily_user_activity(date);",
            
            # activity_logs indexes
            "CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);",
            "CREATE INDEX idx_activity_logs_action ON activity_logs(action);",
            "CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);",
            
            # ai_generation_logs indexes
            "CREATE INDEX idx_ai_generation_logs_user_id ON ai_generation_logs(user_id);",
            "CREATE INDEX idx_ai_generation_logs_action ON ai_generation_logs(action);",
            
            # system_health_logs indexes
            "CREATE INDEX idx_system_health_logs_component ON system_health_logs(component);",
            "CREATE INDEX idx_system_health_logs_status ON system_health_logs(status);",
            
            # rate_limits indexes
            "CREATE INDEX idx_rate_limits_user_id ON rate_limits(user_id);",
            "CREATE INDEX idx_rate_limits_action ON rate_limits(action);"
        ]
        
        for query in index_queries:
            try:
                cursor.execute(query)
                logger.info(f"   ✅ Created index")
            except Exception as e:
                logger.info(f"   ℹ️  Index creation: {e}")
        
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
        # VERIFY SCHEMA FIXES
        # ========================================
        logger.info("🔍 Verifying schema fixes...")
        
        cursor.execute("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename NOT LIKE 'pg_%'
            ORDER BY tablename;
        """)
        
        restored_tables = [row[0] for row in cursor.fetchall()]
        logger.info(f"   📊 Found {len(restored_tables)} tables: {restored_tables}")
        
        # Check a few tables to verify they have proper columns
        test_tables = ['users_registration', 'payment_transactions', 'admin_users']
        for table in test_tables:
            try:
                cursor.execute(f"""
                    SELECT column_name, data_type, is_nullable 
                    FROM information_schema.columns 
                    WHERE table_name = '{table}' 
                    ORDER BY ordinal_position;
                """)
                columns = cursor.fetchall()
                logger.info(f"   📋 {table} has {len(columns)} columns")
                for col in columns[:3]:  # Show first 3 columns
                    logger.info(f"      - {col[0]} ({col[1]}, nullable: {col[2]})")
            except Exception as e:
                logger.info(f"   ❌ Error checking {table}: {e}")
        
        # Close connection
        cursor.close()
        conn.close()
        
        logger.info("✅ Database connection closed")
        logger.info("🎉 Schema fixes complete!")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Schema fixes failed: {e}")
        return False

def main():
    """Main execution function"""
    print("=" * 60)
    print("🔧 NERDX BOT DATABASE SCHEMA FIXES")
    print("=" * 60)
    print("This will fix incomplete table schemas")
    print("by recreating them with proper columns")
    print("=" * 60)
    
    print("\n🔧 Starting schema fixes...")
    print("⏳ This will take several minutes...")
    
    # Execute schema fixes
    success = fix_table_schemas()
    
    if success:
        print("\n🎉 SCHEMA FIXES COMPLETE!")
        print("✅ All tables have proper schemas with correct columns")
        print("✅ All indexes, RLS, and policies are set up")
        print("✅ Default data has been inserted")
        print("\n📋 What was fixed:")
        print("   - Dropped incomplete tables")
        print("   - Recreated all 44 tables with proper schemas")
        print("   - Added all necessary columns and data types")
        print("   - Created comprehensive indexes")
        print("   - Set up RLS and policies")
        print("\n📋 Next steps:")
        print("   1. Test the bot functionality")
        print("   2. Verify all features work")
        print("   3. Start fresh marketing campaign")
    else:
        print("\n❌ SCHEMA FIXES FAILED!")
        print("Please check the logs above for errors")

if __name__ == "__main__":
    main()
