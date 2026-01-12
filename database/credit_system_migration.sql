-- =====================================================
-- NERDX CREDIT SYSTEM MIGRATION
-- =====================================================
-- Run this in your Supabase SQL Editor

-- 1. Add new columns to user_stats table
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS welcome_bonus_claimed BOOLEAN DEFAULT FALSE;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS purchased_credits INTEGER DEFAULT 0;
ALTER TABLE user_stats ADD COLUMN IF NOT EXISTS last_daily_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 2. Add new columns to users_registration table (primary source)
ALTER TABLE users_registration ADD COLUMN IF NOT EXISTS welcome_bonus_claimed BOOLEAN DEFAULT FALSE;
ALTER TABLE users_registration ADD COLUMN IF NOT EXISTS purchased_credits INTEGER DEFAULT 0;
ALTER TABLE users_registration ADD COLUMN IF NOT EXISTS last_daily_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 3. Migrate existing users:
-- Mark welcome bonus as claimed for users who already have credits
UPDATE users_registration 
SET welcome_bonus_claimed = TRUE 
WHERE credits > 0 AND welcome_bonus_claimed IS NOT TRUE;

UPDATE user_stats 
SET welcome_bonus_claimed = TRUE 
WHERE credits > 0 AND welcome_bonus_claimed IS NOT TRUE;

-- 4. Initialize last_daily_reset for all existing users
UPDATE users_registration 
SET last_daily_reset = CURRENT_TIMESTAMP 
WHERE last_daily_reset IS NULL;

UPDATE user_stats 
SET last_daily_reset = CURRENT_TIMESTAMP 
WHERE last_daily_reset IS NULL;

-- 5. Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_users_registration_daily_reset ON users_registration(last_daily_reset);
CREATE INDEX IF NOT EXISTS idx_user_stats_daily_reset ON user_stats(last_daily_reset);

-- =====================================================
-- VERIFICATION QUERIES (Optional - run to verify)
-- =====================================================

-- Check column additions
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users_registration' 
AND column_name IN ('welcome_bonus_claimed', 'purchased_credits', 'last_daily_reset');

-- Check existing users migration
SELECT COUNT(*) as total_users,
       SUM(CASE WHEN welcome_bonus_claimed = TRUE THEN 1 ELSE 0 END) as welcome_claimed,
       SUM(CASE WHEN credits > 0 THEN 1 ELSE 0 END) as has_credits
FROM users_registration;
