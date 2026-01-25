-- Fix Welcome Bonus Issues in Supabase
-- Run this in Supabase SQL Editor to ensure proper defaults and fix existing users

-- ============================================
-- 1. Check Current Schema
-- ============================================
-- Run this first to see current state:
SELECT 
    column_name, 
    column_default, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users_registration'
AND column_name IN ('credits', 'welcome_bonus_claimed')
ORDER BY column_name;

-- ============================================
-- 2. Set Default Values (if not already set)
-- ============================================
-- Ensure credits defaults to 0
ALTER TABLE users_registration 
ALTER COLUMN credits SET DEFAULT 0;

-- Ensure welcome_bonus_claimed defaults to FALSE
ALTER TABLE users_registration 
ALTER COLUMN welcome_bonus_claimed SET DEFAULT FALSE;

-- ============================================
-- 3. Fix Existing NULL Values
-- ============================================
-- Set NULL credits to 0
UPDATE users_registration 
SET credits = 0 
WHERE credits IS NULL;

-- Set NULL welcome_bonus_claimed to FALSE
UPDATE users_registration 
SET welcome_bonus_claimed = FALSE
WHERE welcome_bonus_claimed IS NULL;

-- ============================================
-- 4. Find Users Who Should Have Welcome Bonus But Don't
-- ============================================
-- Users registered in last 30 days with less than 1500 units (150 credits)
SELECT 
    chat_id,
    name,
    credits,
    welcome_bonus_claimed,
    created_at,
    CASE 
        WHEN credits < 1500 AND welcome_bonus_claimed = FALSE THEN 'Needs welcome bonus'
        WHEN credits < 1500 AND welcome_bonus_claimed = TRUE THEN 'Needs upgrade (claimed old amount)'
        WHEN credits >= 1500 AND welcome_bonus_claimed = FALSE THEN 'Has credits but flag not set'
        ELSE 'OK'
    END as status
FROM users_registration
WHERE created_at >= NOW() - INTERVAL '30 days'
AND (credits < 1500 OR welcome_bonus_claimed = FALSE)
ORDER BY created_at DESC;

-- ============================================
-- 5. Manual Fix for Specific Users (if needed)
-- ============================================
-- Uncomment and replace USER_ID_HERE with actual user chat_id:
-- UPDATE users_registration
-- SET 
--     credits = 1500,
--     welcome_bonus_claimed = TRUE,
--     updated_at = NOW()
-- WHERE chat_id = 'USER_ID_HERE'
-- AND (credits < 1500 OR welcome_bonus_claimed = FALSE);

-- ============================================
-- 6. Verify Credit Transactions
-- ============================================
-- Check welcome bonus transactions
SELECT 
    user_id,
    transaction_type,
    credits_change,
    balance_before,
    balance_after,
    description,
    transaction_date
FROM credit_transactions
WHERE transaction_type IN ('welcome_bonus', 'welcome_bonus_upgrade')
ORDER BY transaction_date DESC
LIMIT 20;

-- ============================================
-- 7. Check RLS Policies (if needed)
-- ============================================
-- Verify service role can update credits
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users_registration';
