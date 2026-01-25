# Welcome Bonus Fix - Summary & Action Plan

## Current Status

### ✅ Configuration is Correct
- `config.py`: `REGISTRATION_BONUS = 1500` (150 credits = 1500 units) ✅
- `database/external_db.py`: `WELCOME_BONUS_CREDITS = Config.REGISTRATION_BONUS` ✅

### ⚠️ Potential Issues Identified

#### Issue 1: Credits Field Not Set During Registration
**Location**: `database/external_db.py` - `create_user_registration()` function (lines 1281-1305)

**Problem**: The `create_user_registration()` function does NOT explicitly set the `credits` field when creating a new user. This means:
- If database default is `NULL` or `0`: ✅ Should work (claim_welcome_bonus adds 1500 to 0)
- If database default is something else: ❌ May cause issues

**Solution**: Ensure `credits` field defaults to `0` in Supabase table schema.

#### Issue 2: User Stats Table Sets Different Credits
**Location**: `database/external_db.py` - `get_or_create_user_stats()` function (line 407)

**Problem**: When creating `user_stats`, it sets `"credits": 100` (10 credits), not 1500 units.

**Impact**: This shouldn't affect welcome bonus since `claim_welcome_bonus()` updates `users_registration` table (primary source), but the sync to `user_stats` might be inconsistent.

#### Issue 3: Silent Failures in Sync
**Location**: `database/external_db.py` - `claim_welcome_bonus()` function (lines 1070-1074)

**Problem**: Sync to `user_stats` table is wrapped in try/except and may fail silently.

**Impact**: Credits might be updated in `users_registration` but not in `user_stats`, causing display issues.

## Recommended Fixes

### Fix 1: Ensure Credits Defaults to 0 in Database

**Run this SQL in Supabase SQL Editor**:

```sql
-- Check current default value
SELECT column_name, column_default, data_type
FROM information_schema.columns
WHERE table_name = 'users_registration'
AND column_name = 'credits';

-- If default is not 0, update it
ALTER TABLE users_registration 
ALTER COLUMN credits SET DEFAULT 0;

-- Update any existing NULL values to 0
UPDATE users_registration 
SET credits = 0 
WHERE credits IS NULL;
```

### Fix 2: Explicitly Set Credits to 0 in create_user_registration()

**File**: `database/external_db.py`

**Change** (around line 1281):
```python
# Prepare registration data
registration_data = {
    'chat_id': chat_id,
    'name': name,
    'surname': surname,
    'date_of_birth': formatted_date,
    'nerdx_id': nerdx_id,
    'referred_by_nerdx_id': referred_by_nerdx_id,
    'registration_date': datetime.utcnow().isoformat(),
    'credits': 0,  # ← ADD THIS: Explicitly set credits to 0
    'welcome_bonus_claimed': False  # ← ADD THIS: Explicitly set flag to False
}
```

### Fix 3: Improve Error Handling in claim_welcome_bonus()

**File**: `database/external_db.py`

**Change** (around line 1070):
```python
# Sync to user_stats
try:
    sync_result = make_supabase_request("PATCH", "user_stats", 
                        {"credits": new_credits, "welcome_bonus_claimed": True}, 
                        filters={"user_id": f"eq.{user_id}"}, use_service_role=True)
    if not sync_result:
        logger.warning(f"Failed to sync welcome bonus to user_stats for {user_id}")
except Exception as sync_error:
    logger.error(f"Error syncing welcome bonus to user_stats for {user_id}: {sync_error}")
    # Don't fail the whole operation, but log the error
```

### Fix 4: Add Better Logging

**File**: `database/external_db.py` - `claim_welcome_bonus()`

Add logging at key points:
- When user not found
- When credits are being upgraded
- When new bonus is awarded
- When update succeeds/fails

## Testing Checklist

### Step 1: Verify Database Schema
```sql
-- Check credits column default
SELECT column_name, column_default, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users_registration'
AND column_name IN ('credits', 'welcome_bonus_claimed');
```

### Step 2: Check Recent Registrations
```sql
-- Find users registered in last 7 days who don't have 150 credits
SELECT 
    chat_id,
    name,
    credits,
    welcome_bonus_claimed,
    created_at
FROM users_registration
WHERE created_at >= NOW() - INTERVAL '7 days'
AND (credits < 1500 OR welcome_bonus_claimed = FALSE)
ORDER BY created_at DESC;
```

### Step 3: Check Credit Transactions
```sql
-- Verify welcome bonus transactions
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
```

### Step 4: Test New Registration
1. Create a test user via mobile app registration
2. Check `users_registration` table:
   - `credits` should be 1500 (or close to it)
   - `welcome_bonus_claimed` should be `true`
3. Check `credit_transactions` table for welcome_bonus entry
4. Check `user_stats` table for sync

## Immediate Action Items

1. **Run SQL queries** to check current state of database
2. **Check Render logs** for registration errors
3. **Verify Supabase RLS policies** allow service role to update credits
4. **Test registration flow** with a new user
5. **Apply Fix 2** (explicitly set credits to 0 in create_user_registration)

## Files to Modify

1. `database/external_db.py`:
   - `create_user_registration()` - Add explicit credits: 0
   - `claim_welcome_bonus()` - Improve error handling and logging

2. **Supabase Database**:
   - Ensure `credits` column defaults to 0
   - Ensure `welcome_bonus_claimed` column defaults to FALSE
   - Verify RLS policies

## Next Steps

1. ✅ Configuration verified (1500 units = 150 credits)
2. ⏳ Test Supabase connection and query recent users
3. ⏳ Check database schema defaults
4. ⏳ Apply fixes to code
5. ⏳ Test with new user registration
6. ⏳ Monitor Render logs for errors
