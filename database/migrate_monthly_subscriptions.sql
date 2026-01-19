-- Migration: Add Monthly Subscription Support
-- This migration adds fields to track monthly subscription periods and credit expiry

-- Add subscription tracking fields to users_registration table
ALTER TABLE users_registration 
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_credit_expiry_check TIMESTAMP;

-- Add index for efficient expiry queries
CREATE INDEX IF NOT EXISTS idx_users_registration_subscription_expires 
ON users_registration(subscription_expires_at) 
WHERE subscription_expires_at IS NOT NULL;

-- Add subscription fields to payment_transactions for tracking
ALTER TABLE payment_transactions
ADD COLUMN IF NOT EXISTS subscription_period_start TIMESTAMP,
ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_monthly_subscription BOOLEAN DEFAULT true;

-- Add index for subscription period queries
CREATE INDEX IF NOT EXISTS idx_payment_transactions_subscription_period 
ON payment_transactions(subscription_period_end) 
WHERE subscription_period_end IS NOT NULL;

-- Create function to check and expire credits for subscriptions
CREATE OR REPLACE FUNCTION check_and_expire_monthly_credits()
RETURNS TABLE (
    user_id TEXT,
    expired_credits INTEGER,
    new_balance INTEGER
) AS $$
BEGIN
    -- Update users whose subscription has expired
    RETURN QUERY
    WITH expired_users AS (
        UPDATE users_registration
        SET 
            purchased_credits = 0,
            credits = GREATEST(0, credits),  -- Keep only free/bonus credits
            last_credit_expiry_check = CURRENT_TIMESTAMP
        WHERE 
            subscription_expires_at IS NOT NULL
            AND subscription_expires_at < CURRENT_TIMESTAMP
            AND purchased_credits > 0
        RETURNING 
            chat_id,
            purchased_credits as expired_credits,
            credits as new_balance
    )
    SELECT 
        eu.chat_id::TEXT as user_id,
        eu.expired_credits::INTEGER as expired_credits,
        eu.new_balance::INTEGER as new_balance
    FROM expired_users eu;
END;
$$ LANGUAGE plpgsql;

-- Create function to get active subscription status
CREATE OR REPLACE FUNCTION get_subscription_status(p_user_id TEXT)
RETURNS TABLE (
    is_active BOOLEAN,
    expires_at TIMESTAMP,
    days_remaining INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (subscription_expires_at IS NOT NULL AND subscription_expires_at > CURRENT_TIMESTAMP) as is_active,
        subscription_expires_at as expires_at,
        CASE 
            WHEN subscription_expires_at IS NOT NULL AND subscription_expires_at > CURRENT_TIMESTAMP
            THEN EXTRACT(DAY FROM (subscription_expires_at - CURRENT_TIMESTAMP))::INTEGER
            ELSE 0
        END as days_remaining
    FROM users_registration
    WHERE chat_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_and_expire_monthly_credits() TO service_role;
GRANT EXECUTE ON FUNCTION get_subscription_status(TEXT) TO service_role;

COMMENT ON COLUMN users_registration.subscription_started_at IS 'When the current monthly subscription period started';
COMMENT ON COLUMN users_registration.subscription_expires_at IS 'When the current monthly subscription period expires (credits expire after this date)';
COMMENT ON COLUMN users_registration.last_credit_expiry_check IS 'Last time we checked for expired credits';
COMMENT ON COLUMN payment_transactions.subscription_period_start IS 'Start date of subscription period for this payment';
COMMENT ON COLUMN payment_transactions.subscription_period_end IS 'End date of subscription period (1 month from purchase)';
COMMENT ON COLUMN payment_transactions.is_monthly_subscription IS 'Whether this is a monthly subscription purchase (default: true)';
