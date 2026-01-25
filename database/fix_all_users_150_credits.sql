-- ========================================
-- Fix All Users to Have 150 Credits (1500 units)
-- ========================================
-- This script ensures ALL users have exactly 150 credits (1500 units) as welcome bonus
-- Registration bonus: 150 credits = 1500 units

-- Step 1: Fix users who claimed welcome bonus but have wrong amount
-- Set all users with welcome_bonus_claimed = true to have exactly 1500 units (150 credits)
UPDATE users_registration
SET 
    credits = 1500,
    updated_at = NOW()
WHERE 
    welcome_bonus_claimed = true 
    AND credits != 1500;

-- Step 2: Award welcome bonus to users who never claimed it
-- Set users with welcome_bonus_claimed = false to have 1500 units and mark as claimed
UPDATE users_registration
SET 
    credits = 1500,
    welcome_bonus_claimed = true,
    updated_at = NOW()
WHERE 
    welcome_bonus_claimed = false 
    OR welcome_bonus_claimed IS NULL;

-- Step 3: Fix any users with credits > 1500 who shouldn't have that much
-- (Only if they have welcome_bonus_claimed = true and no purchased credits)
-- This ensures users who only have welcome bonus don't have more than 150 credits
UPDATE users_registration
SET 
    credits = 1500,
    updated_at = NOW()
WHERE 
    welcome_bonus_claimed = true 
    AND credits > 1500
    AND (purchased_credits IS NULL OR purchased_credits = 0);

-- Step 4: Sync user_stats table to match users_registration
UPDATE user_stats us
SET 
    credits = ur.credits,
    updated_at = NOW()
FROM users_registration ur
WHERE 
    us.user_id = ur.chat_id
    AND us.credits != ur.credits;

-- Step 5: Log the fix transactions for audit
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
    ur.chat_id as user_id,
    'welcome_bonus_fix' as action,
    'welcome_bonus_fix' as transaction_type,
    (1500 - ur.credits) as credits_change,
    ur.credits as balance_before,
    1500 as balance_after,
    'Welcome bonus fixed to 150 credits (1500 units)' as description,
    NOW() as transaction_date
FROM users_registration ur
WHERE 
    ur.credits != 1500
    AND ur.welcome_bonus_claimed = true;

-- Verification Query: Check all users have 150 credits (1500 units)
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN credits = 1500 THEN 1 END) as users_with_150_credits,
    COUNT(CASE WHEN credits != 1500 THEN 1 END) as users_with_wrong_credits,
    COUNT(CASE WHEN welcome_bonus_claimed = true THEN 1 END) as users_claimed_bonus,
    COUNT(CASE WHEN welcome_bonus_claimed = false OR welcome_bonus_claimed IS NULL THEN 1 END) as users_not_claimed
FROM users_registration;

-- Detailed check: Show users who still have wrong credits (should be 0 after fix)
SELECT 
    chat_id,
    name,
    credits,
    welcome_bonus_claimed,
    purchased_credits,
    created_at
FROM users_registration
WHERE credits != 1500
ORDER BY created_at DESC;
