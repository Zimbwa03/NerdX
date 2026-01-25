-- Migration: Upgrade Welcome Bonus from 75 to 150 Credits
-- This script updates all users who claimed the welcome bonus with the old amount (750 units = 75 credits)
-- to receive the full 150 credits (1500 units)

-- Step 1: Update users who already claimed but have less than 1500 units
-- Add the difference to bring them to 1500 units (150 credits)
UPDATE users_registration
SET 
    credits = credits + (1500 - credits),
    updated_at = NOW()
WHERE 
    welcome_bonus_claimed = true 
    AND credits < 1500
    AND credits >= 0;

-- Step 2: Update user_stats to match
UPDATE user_stats
SET 
    credits = (SELECT credits FROM users_registration WHERE users_registration.chat_id = user_stats.user_id),
    updated_at = NOW()
WHERE 
    user_id IN (
        SELECT chat_id 
        FROM users_registration 
        WHERE welcome_bonus_claimed = true 
        AND credits >= 1500
    );

-- Step 3: Log the upgrade transactions
INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    description,
    metadata
)
SELECT 
    chat_id as user_id,
    'welcome_bonus_upgrade' as transaction_type,
    (1500 - credits) as amount,
    credits as balance_before,
    1500 as balance_after,
    'Welcome bonus upgraded from 75 to 150 credits' as description,
    jsonb_build_object('upgrade', true, 'old_bonus', 750, 'new_bonus', 1500) as metadata
FROM users_registration
WHERE 
    welcome_bonus_claimed = true 
    AND credits < 1500
    AND credits >= 0;

-- Verification query (run this to check results)
-- SELECT 
--     COUNT(*) as total_updated,
--     MIN(credits) as min_credits,
--     MAX(credits) as max_credits,
--     AVG(credits) as avg_credits
-- FROM users_registration
-- WHERE welcome_bonus_claimed = true AND credits >= 1500;
