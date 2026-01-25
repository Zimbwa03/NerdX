-- Fix Existing Users Welcome Bonus
-- This script awards or upgrades welcome bonus for users who need it
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Fix users who never claimed welcome bonus
-- ============================================
-- Users with welcome_bonus_claimed = FALSE and credits < 1500
-- Award them 1500 units (150 credits)
UPDATE users_registration
SET 
    credits = 1500,
    welcome_bonus_claimed = TRUE,
    updated_at = NOW()
WHERE welcome_bonus_claimed = FALSE
AND credits < 1500;

-- Log transactions for these users
INSERT INTO credit_transactions (
    user_id,
    action,
    transaction_type,
    credits_change,
    balance_before,
    balance_after,
    description,
    transaction_date
)
SELECT 
    chat_id,
    'welcome_bonus',
    'welcome_bonus',
    1500,
    0,
    1500,
    'Welcome bonus: 150 credits (retroactive fix)',
    NOW()
FROM users_registration
WHERE welcome_bonus_claimed = TRUE
AND credits = 1500
AND updated_at >= NOW() - INTERVAL '1 minute';

-- ============================================
-- 2. Upgrade users who claimed old amount (75 credits)
-- ============================================
-- Users with welcome_bonus_claimed = TRUE but credits < 1500
-- Upgrade them to 1500 units
UPDATE users_registration
SET 
    credits = 1500,
    updated_at = NOW()
WHERE welcome_bonus_claimed = TRUE
AND credits < 1500
AND credits > 0;

-- Log upgrade transactions
INSERT INTO credit_transactions (
    user_id,
    action,
    transaction_type,
    credits_change,
    balance_before,
    balance_after,
    description,
    transaction_date
)
SELECT 
    ur.chat_id,
    'welcome_bonus',
    'welcome_bonus_upgrade',
    1500 - ur.credits,
    ur.credits,
    1500,
    'Welcome bonus upgrade: ' || (1500 - ur.credits) || ' units (retroactive fix)',
    NOW()
FROM users_registration ur
WHERE ur.welcome_bonus_claimed = TRUE
AND ur.credits = 1500
AND ur.updated_at >= NOW() - INTERVAL '1 minute'
AND NOT EXISTS (
    SELECT 1 FROM credit_transactions ct
    WHERE ct.user_id = ur.chat_id
    AND ct.transaction_type = 'welcome_bonus_upgrade'
    AND ct.transaction_date >= NOW() - INTERVAL '1 minute'
);

-- ============================================
-- 3. Fix users with 0 credits but claimed = TRUE
-- ============================================
-- These users might have spent all credits, but should still have welcome bonus
-- Reset their welcome_bonus_claimed to FALSE so they can claim again
-- OR award them 1500 credits if they never got it
UPDATE users_registration
SET 
    credits = 1500,
    welcome_bonus_claimed = TRUE,
    updated_at = NOW()
WHERE credits = 0
AND welcome_bonus_claimed = TRUE
AND created_at >= NOW() - INTERVAL '30 days';

-- ============================================
-- 4. Verification Query
-- ============================================
-- Check how many users were fixed
SELECT 
    COUNT(*) as total_fixed,
    SUM(CASE WHEN credits = 1500 AND welcome_bonus_claimed = TRUE THEN 1 ELSE 0 END) as users_with_full_bonus,
    SUM(CASE WHEN credits < 1500 THEN 1 ELSE 0 END) as users_still_need_fix
FROM users_registration
WHERE created_at >= NOW() - INTERVAL '30 days';
