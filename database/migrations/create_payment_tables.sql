-- NerdX Payment System Tables
-- Run this in your Supabase SQL Editor to create the required tables

-- 1. Create payment_transactions table for storing payment proofs and admin review
CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    package_id VARCHAR(50) NOT NULL,
    reference_code VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    credits INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    payment_proof TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    proof_submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    credits_added INTEGER DEFAULT 0,
    admin_notes TEXT
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference_code ON payment_transactions(reference_code);

-- 3. Create payments table for completed transactions (dashboard analytics)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    credits_added INTEGER NOT NULL,
    transaction_reference VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    payment_method VARCHAR(50) DEFAULT 'ecocash',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for payments table
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- 5. Enable Row Level Security (RLS) on payment tables
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for payment_transactions
DROP POLICY IF EXISTS "Allow all operations on payment_transactions" ON payment_transactions;
CREATE POLICY "Allow all operations on payment_transactions" ON payment_transactions
    FOR ALL USING (true) WITH CHECK (true);

-- 7. Create RLS policies for payments
DROP POLICY IF EXISTS "Allow all operations on payments" ON payments;
CREATE POLICY "Allow all operations on payments" ON payments
    FOR ALL USING (true) WITH CHECK (true);

-- 8. Verify tables were created
SELECT 
    table_name, 
    table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('payment_transactions', 'payments')
ORDER BY table_name;

-- 9. Show table structure
\d payment_transactions;
\d payments;
