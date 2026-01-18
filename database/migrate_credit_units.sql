-- Migrate credits to unit system (1 credit = 10 units)
-- Run once after deploying unit-based costs

BEGIN;

-- Users: multiply credits and purchased_credits
UPDATE users_registration
SET credits = credits * 10,
    purchased_credits = COALESCE(purchased_credits, 0) * 10;

UPDATE user_stats
SET credits = credits * 10,
    purchased_credits = COALESCE(purchased_credits, 0) * 10;

-- Transactions: multiply all credit deltas and balances if stored
UPDATE credit_transactions
SET credits_change = credits_change * 10,
    balance_before = balance_before * 10,
    balance_after = balance_after * 10;

COMMIT;
