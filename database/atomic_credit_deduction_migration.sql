-- =====================================================
-- NERDX ATOMIC CREDIT DEDUCTION MIGRATION
-- =====================================================
-- Run this in your Supabase SQL Editor
-- This creates the deduct_credits_atomic RPC function for secure, race-condition-free credit deductions

-- 1. Create credit_transactions table if not exists (for audit trail)
CREATE TABLE IF NOT EXISTS credit_transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL, -- In credit units (10 units = 1 display credit)
    balance_before INTEGER,
    balance_after INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_date ON credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);

-- Enable RLS on credit_transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DROP POLICY IF EXISTS "Service role can manage transactions" ON credit_transactions;
CREATE POLICY "Service role can manage transactions" ON credit_transactions
    FOR ALL USING (true) WITH CHECK (true);

-- 2. Create the atomic deduction function
CREATE OR REPLACE FUNCTION deduct_credits_atomic(
    p_user_id VARCHAR(255),
    p_amount INTEGER,
    p_transaction_type VARCHAR(50) DEFAULT 'feature_use',
    p_description TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_credits INTEGER;
    v_purchased_credits INTEGER;
    v_free_credits INTEGER;
    v_deduct_from_purchased INTEGER;
    v_deduct_from_free INTEGER;
    v_new_purchased INTEGER;
    v_new_total INTEGER;
    v_result JSONB;
BEGIN
    -- Lock the user row for update to prevent race conditions
    SELECT credits, COALESCE(purchased_credits, 0)
    INTO v_current_credits, v_purchased_credits
    FROM users_registration
    WHERE chat_id = p_user_id
    FOR UPDATE;
    
    -- Check if user exists
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not found',
            'credits_remaining', NULL
        );
    END IF;
    
    -- Calculate free credits
    v_free_credits := v_current_credits - v_purchased_credits;
    IF v_free_credits < 0 THEN
        v_free_credits := 0;
    END IF;
    
    -- Check if sufficient credits
    IF v_current_credits < p_amount THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Insufficient credits',
            'credits_remaining', v_current_credits,
            'required', p_amount
        );
    END IF;
    
    -- Calculate deduction split (purchased credits first)
    IF v_purchased_credits >= p_amount THEN
        v_deduct_from_purchased := p_amount;
        v_deduct_from_free := 0;
    ELSE
        v_deduct_from_purchased := v_purchased_credits;
        v_deduct_from_free := p_amount - v_purchased_credits;
    END IF;
    
    -- Calculate new values
    v_new_purchased := v_purchased_credits - v_deduct_from_purchased;
    v_new_total := v_current_credits - p_amount;
    
    -- Perform the deduction
    UPDATE users_registration
    SET 
        credits = v_new_total,
        purchased_credits = v_new_purchased,
        updated_at = NOW()
    WHERE chat_id = p_user_id;
    
    -- Log the transaction
    INSERT INTO credit_transactions (
        user_id,
        transaction_type,
        amount,
        balance_before,
        balance_after,
        description,
        metadata
    ) VALUES (
        p_user_id,
        p_transaction_type,
        -p_amount,
        v_current_credits,
        v_new_total,
        COALESCE(p_description, p_transaction_type),
        jsonb_build_object(
            'from_purchased', v_deduct_from_purchased,
            'from_free', v_deduct_from_free
        )
    );
    
    -- Return success with new balance
    RETURN jsonb_build_object(
        'success', true,
        'credits_remaining', v_new_total,
        'deducted', p_amount,
        'from_purchased', v_deduct_from_purchased,
        'from_free', v_deduct_from_free
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'credits_remaining', NULL
        );
END;
$$;

-- 3. Create atomic credit addition function (for purchases and bonuses)
CREATE OR REPLACE FUNCTION add_credits_atomic(
    p_user_id VARCHAR(255),
    p_amount INTEGER,
    p_is_purchased BOOLEAN DEFAULT false,
    p_transaction_type VARCHAR(50) DEFAULT 'credit_add',
    p_description TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_credits INTEGER;
    v_purchased_credits INTEGER;
    v_new_total INTEGER;
    v_new_purchased INTEGER;
BEGIN
    -- Lock the user row for update
    SELECT credits, COALESCE(purchased_credits, 0)
    INTO v_current_credits, v_purchased_credits
    FROM users_registration
    WHERE chat_id = p_user_id
    FOR UPDATE;
    
    -- Check if user exists
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not found',
            'credits_remaining', NULL
        );
    END IF;
    
    -- Calculate new values
    v_new_total := v_current_credits + p_amount;
    v_new_purchased := v_purchased_credits;
    IF p_is_purchased THEN
        v_new_purchased := v_purchased_credits + p_amount;
    END IF;
    
    -- Perform the addition
    UPDATE users_registration
    SET 
        credits = v_new_total,
        purchased_credits = v_new_purchased,
        updated_at = NOW()
    WHERE chat_id = p_user_id;
    
    -- Log the transaction
    INSERT INTO credit_transactions (
        user_id,
        transaction_type,
        amount,
        balance_before,
        balance_after,
        description,
        metadata
    ) VALUES (
        p_user_id,
        p_transaction_type,
        p_amount,
        v_current_credits,
        v_new_total,
        COALESCE(p_description, p_transaction_type),
        jsonb_build_object('is_purchased', p_is_purchased)
    );
    
    -- Return success with new balance
    RETURN jsonb_build_object(
        'success', true,
        'credits_remaining', v_new_total,
        'added', p_amount
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'credits_remaining', NULL
        );
END;
$$;

-- 4. Create function to claim welcome bonus atomically
CREATE OR REPLACE FUNCTION claim_welcome_bonus_atomic(
    p_user_id VARCHAR(255),
    p_bonus_amount INTEGER DEFAULT 1500  -- 150 display credits = 1500 units
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_already_claimed BOOLEAN;
    v_current_credits INTEGER;
    v_new_total INTEGER;
BEGIN
    -- Lock the user row
    SELECT welcome_bonus_claimed, credits
    INTO v_already_claimed, v_current_credits
    FROM users_registration
    WHERE chat_id = p_user_id
    FOR UPDATE;
    
    -- Check if user exists
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not found',
            'awarded', false
        );
    END IF;
    
    -- Check if already claimed
    IF v_already_claimed THEN
        RETURN jsonb_build_object(
            'success', true,
            'awarded', false,
            'message', 'Welcome bonus already claimed',
            'credits_remaining', v_current_credits
        );
    END IF;
    
    -- Award the bonus
    v_new_total := v_current_credits + p_bonus_amount;
    
    UPDATE users_registration
    SET 
        credits = v_new_total,
        welcome_bonus_claimed = true,
        updated_at = NOW()
    WHERE chat_id = p_user_id;
    
    -- Log the transaction
    INSERT INTO credit_transactions (
        user_id,
        transaction_type,
        amount,
        balance_before,
        balance_after,
        description
    ) VALUES (
        p_user_id,
        'welcome_bonus',
        p_bonus_amount,
        v_current_credits,
        v_new_total,
        'Welcome bonus for new user'
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'awarded', true,
        'message', 'Welcome bonus claimed successfully',
        'credits_remaining', v_new_total,
        'bonus_amount', p_bonus_amount
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'awarded', false
        );
END;
$$;

-- 5. Grant execute permissions to authenticated users (via service role)
GRANT EXECUTE ON FUNCTION deduct_credits_atomic TO authenticated;
GRANT EXECUTE ON FUNCTION deduct_credits_atomic TO service_role;
GRANT EXECUTE ON FUNCTION add_credits_atomic TO authenticated;
GRANT EXECUTE ON FUNCTION add_credits_atomic TO service_role;
GRANT EXECUTE ON FUNCTION claim_welcome_bonus_atomic TO authenticated;
GRANT EXECUTE ON FUNCTION claim_welcome_bonus_atomic TO service_role;

-- =====================================================
-- VERIFICATION QUERIES (Run to verify installation)
-- =====================================================

-- Check functions exist
SELECT proname, prokind 
FROM pg_proc 
WHERE proname IN ('deduct_credits_atomic', 'add_credits_atomic', 'claim_welcome_bonus_atomic');

-- Test the function (replace with an actual user_id)
-- SELECT deduct_credits_atomic('test_user', 10, 'test', 'Testing atomic deduction');
