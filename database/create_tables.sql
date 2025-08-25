-- NerdX Bot Database Tables for Supabase
-- Run this SQL script in your Supabase SQL Editor if automatic table creation fails

-- Create users_registration table
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

-- Create indexes for users_registration
CREATE INDEX IF NOT EXISTS idx_users_registration_chat_id ON users_registration(chat_id);
CREATE INDEX IF NOT EXISTS idx_users_registration_nerdx_id ON users_registration(nerdx_id);
CREATE INDEX IF NOT EXISTS idx_users_registration_referred_by ON users_registration(referred_by_nerdx_id);

-- Create payment_transactions table
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

-- Create indexes for payment_transactions
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference_code ON payment_transactions(reference_code);

-- Enable Row Level Security (RLS)
ALTER TABLE users_registration ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (adjust as needed for production)
DROP POLICY IF EXISTS "Allow all operations on users_registration" ON users_registration;
CREATE POLICY "Allow all operations on users_registration" ON users_registration
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on payment_transactions" ON payment_transactions;
CREATE POLICY "Allow all operations on payment_transactions" ON payment_transactions
    FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions to service role (replace with your actual service role if different)
GRANT ALL ON users_registration TO service_role;
GRANT ALL ON payment_transactions TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Insert a test record to verify everything works (will be cleaned up automatically)
INSERT INTO users_registration (chat_id, name, surname, date_of_birth, nerdx_id, created_at)
VALUES ('test_user', 'Test', 'User', '01/01/2000', 'TEST01', NOW())
ON CONFLICT (chat_id) DO NOTHING;

-- Clean up test record
DELETE FROM users_registration WHERE chat_id = 'test_user';

-- Show table info for verification
SELECT 'users_registration table created' as status;
SELECT 'payment_transactions table created' as status;
