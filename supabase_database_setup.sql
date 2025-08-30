-- =====================================================
-- NERDX BOT SUPABASE DATABASE SETUP
-- =====================================================
-- This script creates all necessary tables for the NerdX bot system
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. ADMIN AUTHENTICATION TABLES
-- =====================================================

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    last_login_ip INET
);

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    admin_user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Admin activity logs table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id SERIAL PRIMARY KEY,
    admin_user_id INTEGER REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. USER REGISTRATION AND REFERRAL TABLES
-- =====================================================

-- Users registration table
CREATE TABLE IF NOT EXISTS users_registration (
    id SERIAL PRIMARY KEY,
    chat_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    date_of_birth VARCHAR(10) NOT NULL,
    nerdx_id VARCHAR(10) UNIQUE NOT NULL,
    referred_by_nerdx_id VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100),
    first_name VARCHAR(100),
    total_attempts INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    xp_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    credits INTEGER DEFAULT 100,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referral codes table
CREATE TABLE IF NOT EXISTS referral_codes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referrals tracking table
CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    referrer_id VARCHAR(255) NOT NULL,
    referee_id VARCHAR(255) NOT NULL,
    referral_code VARCHAR(20) NOT NULL,
    bonus_awarded BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referral statistics table
CREATE TABLE IF NOT EXISTS referral_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    total_referrals INTEGER DEFAULT 0,
    successful_referrals INTEGER DEFAULT 0,
    total_bonus_earned INTEGER DEFAULT 0,
    last_referral_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. PAYMENT AND CREDIT SYSTEM TABLES
-- =====================================================

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    package_id VARCHAR(50) NOT NULL,
    reference_code VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    credits INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_proof TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    proof_submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    credits_added INTEGER DEFAULT 0
);

-- Credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    credits_used INTEGER NOT NULL,
    credits_before INTEGER NOT NULL,
    credits_after INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- XP transactions table
CREATE TABLE IF NOT EXISTS xp_transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    xp_earned INTEGER NOT NULL,
    xp_before INTEGER NOT NULL,
    xp_after INTEGER NOT NULL,
    level_before INTEGER NOT NULL,
    level_after INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. QUESTION AND LEARNING SYSTEM TABLES
-- =====================================================

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    answer TEXT,
    explanation TEXT,
    category VARCHAR(100),
    subject VARCHAR(100),
    topic VARCHAR(100),
    difficulty_level VARCHAR(20) DEFAULT 'medium',
    question_type VARCHAR(20) DEFAULT 'mcq',
    image_url TEXT,
    points INTEGER DEFAULT 10,
    source VARCHAR(50) DEFAULT 'ai_generated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User question history table
CREATE TABLE IF NOT EXISTS user_question_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    question_hash VARCHAR(256) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_hash)
);

-- Question cache table
CREATE TABLE IF NOT EXISTS question_cache (
    id SERIAL PRIMARY KEY,
    cache_key VARCHAR(100) UNIQUE NOT NULL,
    question_data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. USER SESSIONS AND ACTIVITY TABLES
-- =====================================================

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    question_data TEXT,
    subject VARCHAR(50),
    topic VARCHAR(100),
    question_id VARCHAR(100),
    question_source VARCHAR(50),
    session_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT,
    additional_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================

-- Admin users indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- Admin sessions indexes
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active ON admin_sessions(is_active);

-- User registration indexes
CREATE INDEX IF NOT EXISTS idx_users_registration_chat_id ON users_registration(chat_id);
CREATE INDEX IF NOT EXISTS idx_users_registration_nerdx_id ON users_registration(nerdx_id);
CREATE INDEX IF NOT EXISTS idx_users_registration_referred_by ON users_registration(referred_by_nerdx_id);

-- User stats indexes
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_credits ON user_stats(credits);

-- Referral indexes
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee ON referrals(referee_id);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference ON payment_transactions(reference_code);

-- Question indexes
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(question_type);

-- =====================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_registration ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for admin tables (restrictive)
CREATE POLICY "Admin users - service role only" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin sessions - service role only" ON admin_sessions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin activity logs - service role only" ON admin_activity_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Create policies for user tables (more permissive for bot operations)
CREATE POLICY "Users registration - allow all operations" ON users_registration
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "User stats - allow all operations" ON user_stats
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Referral codes - allow all operations" ON referral_codes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Referrals - allow all operations" ON referrals
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Referral stats - allow all operations" ON referral_stats
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Payment transactions - allow all operations" ON payment_transactions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Credit transactions - allow all operations" ON credit_transactions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "XP transactions - allow all operations" ON xp_transactions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Questions - allow all operations" ON questions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "User question history - allow all operations" ON user_question_history
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Question cache - allow all operations" ON question_cache
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "User sessions - allow all operations" ON user_sessions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Activity logs - allow all operations" ON activity_logs
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 8. INSERT DEFAULT SUPER ADMIN USER
-- =====================================================

-- Insert a default super admin user (password: admin123)
-- You should change this password after first login
INSERT INTO admin_users (email, password_hash, password_salt, first_name, last_name, role, is_active)
VALUES (
    'admin@nerdx.com',
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', -- hash of 'admin123'
    'default_salt_change_me',
    'Super',
    'Admin',
    'super_admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 9. COMMENTS AND NOTES
-- =====================================================

/*
IMPORTANT NOTES:

1. After running this script, change the default admin password:
   - Login with admin@nerdx.com / admin123
   - Change password immediately

2. The script creates all necessary tables with proper indexes and RLS policies

3. All tables use SERIAL primary keys for auto-incrementing IDs

4. RLS policies are set to allow all operations for bot functionality
   - Admin tables are restricted to service role only
   - User tables allow all operations for bot access

5. The referral system is fully integrated with:
   - users_registration table for user data
   - referral_codes for tracking referral codes
   - referrals for tracking successful referrals
   - referral_stats for analytics

6. Payment system includes:
   - payment_transactions for payment tracking
   - credit_transactions for credit history
   - xp_transactions for experience tracking

7. Question system supports:
   - Multiple question types (MCQ, etc.)
   - Image questions with image_url field
   - Difficulty levels and topics
   - Question history tracking

8. All tables include created_at timestamps for audit trails
*/

-- =====================================================
-- SCRIPT COMPLETED
-- =====================================================




