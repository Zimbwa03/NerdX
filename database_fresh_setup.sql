-- ========================================
-- NERDX BOT FRESH DATABASE SETUP SCRIPT
-- ========================================
-- This script creates a fresh database structure after reset
-- Run this in your Supabase SQL Editor after running the reset script

-- ========================================
-- STEP 1: CREATE USERS REGISTRATION TABLE
-- ========================================
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

-- Create indexes for users_registration
CREATE INDEX idx_users_registration_chat_id ON users_registration(chat_id);
CREATE INDEX idx_users_registration_nerdx_id ON users_registration(nerdx_id);
CREATE INDEX idx_users_registration_referred_by ON users_registration(referred_by_nerdx_id);
CREATE INDEX idx_users_registration_phone ON users_registration(phone_number);
CREATE INDEX idx_users_registration_email ON users_registration(email);

-- ========================================
-- STEP 2: CREATE PACKAGES TABLE
-- ========================================
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for packages
CREATE INDEX idx_packages_name ON packages(name);
CREATE INDEX idx_packages_is_active ON packages(is_active);

-- ========================================
-- STEP 3: CREATE PAYMENT TRANSACTIONS TABLE
-- ========================================
CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    package_id INTEGER NOT NULL,
    reference_code VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    credits INTEGER NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'EcoCash',
    status VARCHAR(50) DEFAULT 'pending',
    payment_proof TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    proof_submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    credits_added INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users_registration(chat_id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- Create indexes for payment_transactions
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_reference_code ON payment_transactions(reference_code);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at);

-- ========================================
-- STEP 4: CREATE CREDIT COSTS TABLE
-- ========================================
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

-- Create indexes for credit_costs
CREATE INDEX idx_credit_costs_action_key ON credit_costs(action_key);
CREATE INDEX idx_credit_costs_category ON credit_costs(category);
CREATE INDEX idx_credit_costs_is_active ON credit_costs(is_active);

-- ========================================
-- STEP 5: CREATE ADMIN USERS TABLE
-- ========================================
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for admin_users
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);

-- ========================================
-- STEP 6: CREATE SYSTEM SETTINGS TABLE
-- ========================================
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for system_settings
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_is_active ON system_settings(is_active);

-- ========================================
-- STEP 7: INSERT DEFAULT PACKAGES
-- ========================================
INSERT INTO packages (name, description, credits, price) VALUES
('Starter Pack', 'Perfect for new students to get started', 100, 5.00),
('Student Pack', 'Most popular choice for regular users', 250, 10.00),
('Premium Pack', 'Best value for serious students', 500, 18.00),
('Ultimate Pack', 'Maximum credits for power users', 1000, 30.00);

-- ========================================
-- STEP 8: INSERT DEFAULT CREDIT COSTS
-- ========================================
INSERT INTO credit_costs (action_key, cost, category, component, description) VALUES
('math_easy', 5, 'Mathematics', 'Topical Questions', 'Easy mathematics questions'),
('math_medium', 10, 'Mathematics', 'Topical Questions', 'Medium difficulty mathematics questions'),
('math_difficult', 20, 'Mathematics', 'Topical Questions', 'Difficult mathematics questions'),
('math_graph', 15, 'Mathematics', 'Graph Generation', 'Mathematical graph generation'),
('english_comprehension', 8, 'English', 'Comprehension', 'English comprehension exercises'),
('english_essay', 25, 'English', 'Essay Writing', 'Essay writing and correction'),
('biology_topical', 8, 'Biology', 'Topical Questions', 'Biology topic questions'),
('chemistry_topical', 8, 'Chemistry', 'Topical Questions', 'Chemistry topic questions'),
('physics_topical', 8, 'Physics', 'Topical Questions', 'Physics topic questions'),
('combined_science', 10, 'Combined Science', 'Topical Questions', 'Combined science questions');

-- ========================================
-- STEP 9: INSERT DEFAULT ADMIN USER
-- ========================================
-- Default admin credentials: admin / admin123 (change this in production!)
INSERT INTO admin_users (username, password_hash, full_name, email, role) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqjqG', 'System Administrator', 'admin@nerdx.com', 'super_admin');

-- ========================================
-- STEP 10: INSERT DEFAULT SYSTEM SETTINGS
-- ========================================
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('bot_maintenance_mode', 'false', 'Whether the bot is in maintenance mode'),
('registration_enabled', 'true', 'Whether new user registration is enabled'),
('referral_bonus_credits', '25', 'Bonus credits given for successful referrals'),
('welcome_credits', '75', 'Initial credits given to new users'),
('max_daily_questions', '50', 'Maximum questions per user per day'),
('payment_approval_required', 'true', 'Whether payment approval is required'),
('ai_api_timeout', '30', 'AI API timeout in seconds'),
('webhook_rate_limit', '100', 'Webhook requests per minute limit');

-- ========================================
-- STEP 11: ENABLE ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE users_registration ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 12: CREATE RLS POLICIES
-- ========================================
-- Users registration policies
CREATE POLICY "Allow all operations on users_registration" ON users_registration
    FOR ALL USING (true) WITH CHECK (true);

-- Packages policies
CREATE POLICY "Allow all operations on packages" ON packages
    FOR ALL USING (true) WITH CHECK (true);

-- Payment transactions policies
CREATE POLICY "Allow all operations on payment_transactions" ON payment_transactions
    FOR ALL USING (true) WITH CHECK (true);

-- Credit costs policies
CREATE POLICY "Allow all operations on credit_costs" ON credit_costs
    FOR ALL USING (true) WITH CHECK (true);

-- Admin users policies
CREATE POLICY "Allow all operations on admin_users" ON admin_users
    FOR ALL USING (true) WITH CHECK (true);

-- System settings policies
CREATE POLICY "Allow all operations on system_settings" ON system_settings
    FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- STEP 13: GRANT PERMISSIONS
-- ========================================
-- Grant permissions to service role
GRANT ALL ON users_registration TO service_role;
GRANT ALL ON packages TO service_role;
GRANT ALL ON payment_transactions TO service_role;
GRANT ALL ON credit_costs TO service_role;
GRANT ALL ON admin_users TO service_role;
GRANT ALL ON system_settings TO service_role;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ========================================
-- STEP 14: VERIFY SETUP
-- ========================================
-- Check all tables were created
SELECT 
    schemaname,
    tablename,
    'Table' as object_type
FROM pg_tables 
WHERE schemaname = 'public'
UNION ALL
SELECT 
    schemaname,
    sequencename as tablename,
    'Sequence' as object_type
FROM pg_sequences 
WHERE schemaname = 'public'
ORDER BY object_type, tablename;

-- Check default data was inserted
SELECT 'Packages' as table_name, COUNT(*) as record_count FROM packages
UNION ALL
SELECT 'Credit Costs' as table_name, COUNT(*) as record_count FROM credit_costs
UNION ALL
SELECT 'Admin Users' as table_name, COUNT(*) as record_count FROM admin_users
UNION ALL
SELECT 'System Settings' as table_name, COUNT(*) as record_count FROM system_settings;

-- ========================================
-- SETUP COMPLETE!
-- ========================================
-- Your database is now fresh and ready for marketing!
-- 
-- What was created:
-- ✅ users_registration - User accounts and profiles
-- ✅ packages - Credit packages for purchase
-- ✅ payment_transactions - Payment tracking and approvals
-- ✅ credit_costs - Credit costs for different actions
-- ✅ admin_users - Admin dashboard access
-- ✅ system_settings - Bot configuration settings
-- 
-- Default data inserted:
-- ✅ 4 credit packages (Starter, Student, Premium, Ultimate)
-- ✅ 10 credit cost configurations for all subjects
-- ✅ 1 admin user (admin/admin123)
-- ✅ 8 system settings for bot configuration
-- 
-- Next steps:
-- 1. Test the bot with a new user registration
-- 2. Verify payment flow works correctly
-- 3. Check admin dashboard functionality
-- 4. Start your marketing campaign!
-- 5. Monitor user growth and engagement
