# Welcome Bonus Diagnostic Report

## Issue
Users are reporting they are not receiving 150 credits (1500 units) on first entry/registration in the mobile application.

## Configuration Check ✅

### Current Configuration
- **`config.py`**: `REGISTRATION_BONUS = 1500` (150 credits = 1500 units) ✅ **CORRECT**
- **`database/external_db.py`**: `WELCOME_BONUS_CREDITS = Config.REGISTRATION_BONUS` ✅ **CORRECT**

## Code Flow Analysis

### Registration Endpoint (`api/mobile.py`)
1. **Line 746**: Calls `claim_welcome_bonus(user_identifier)` after user registration
2. **Line 759**: Returns `welcome_result.get("awarded", False)` in notifications
3. **Line 773**: Returns credits in response: `credit_info_display.get("total", "0.0")`

### Welcome Bonus Function (`database/external_db.py`)
**Function**: `claim_welcome_bonus(user_id: str)`

**Logic Flow**:
1. **Line 1027-1029**: Queries `users_registration` table for user's `credits` and `welcome_bonus_claimed`
2. **Line 1036-1037**: Gets `already_claimed` flag and `current_credits`
3. **Line 1040-1042**: If already claimed AND credits >= 1500, returns "Already claimed"
4. **Line 1045-1049**: If already claimed BUT credits < 1500, **upgrades** to 1500 units
5. **Line 1050-1053**: If credits > 0 but < 1500 (legacy fix), sets to 1500 units
6. **Line 1054-1057**: **New user** (credits = 0): Adds 1500 units to current credits

**Potential Issues**:

#### Issue 1: User Not Found
- **Line 1031-1033**: If user not found in `users_registration` table, returns error
- **Possible cause**: User created in Supabase Auth but not in `users_registration` table
- **Check**: Verify `create_user_registration()` is called before `claim_welcome_bonus()`

#### Issue 2: Credits Already Set During Registration
- If `create_user_registration()` sets `credits` to a non-zero value (e.g., 0 or NULL)
- Then `claim_welcome_bonus()` logic at line 1054-1057 adds 1500 to existing credits
- **Check**: What does `create_user_registration()` set for initial credits?

#### Issue 3: Database Update Failure
- **Line 1064-1065**: Updates `users_registration` table
- **Line 1070-1072**: Syncs to `user_stats` table (wrapped in try/except, may fail silently)
- **Check**: Verify Supabase permissions and RLS policies allow updates

#### Issue 4: Transaction Logging Failure
- **Line 1076-1094**: Logs transaction (wrapped in try/except, may fail silently)
- This shouldn't prevent credit award, but worth checking

## Testing Steps

### Step 1: Verify Supabase Connection
```python
# Run test script
python test_welcome_bonus_supabase.py
```

### Step 2: Check Recent Registrations
Query Supabase directly:
```sql
SELECT 
    chat_id,
    name,
    credits,
    welcome_bonus_claimed,
    created_at
FROM users_registration
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 10;
```

### Step 3: Check Specific User
```sql
SELECT 
    chat_id,
    name,
    credits,
    welcome_bonus_claimed,
    created_at
FROM users_registration
WHERE chat_id = 'USER_ID_HERE';
```

### Step 4: Check Credit Transactions
```sql
SELECT 
    user_id,
    transaction_type,
    credits_change,
    balance_before,
    balance_after,
    description,
    transaction_date
FROM credit_transactions
WHERE transaction_type = 'welcome_bonus'
ORDER BY transaction_date DESC
LIMIT 10;
```

## Recommended Fixes

### Fix 1: Ensure User Exists Before Claiming Bonus
In `api/mobile.py` registration endpoint:
- Verify `user_data` exists before calling `claim_welcome_bonus()`
- Add error handling if user creation fails

### Fix 2: Verify Initial Credits Value
In `create_user_registration()`:
- Ensure `credits` field defaults to `0` or `NULL` (not a non-zero value)
- Check if there's any default value set in Supabase table schema

### Fix 3: Add Better Error Logging
In `claim_welcome_bonus()`:
- Log when user not found
- Log when update fails
- Log when sync to `user_stats` fails
- Return more detailed error messages

### Fix 4: Check Supabase RLS Policies
Verify Row Level Security policies allow:
- Service role to read/write `users_registration`
- Service role to read/write `user_stats`
- Service role to insert into `credit_transactions`

## Next Steps

1. **Run test script** to verify Supabase connection and configuration
2. **Query Supabase** to check recent user registrations and their credit status
3. **Check Render logs** for any errors during registration
4. **Verify database schema** - ensure `credits` defaults to 0
5. **Test registration flow** with a new user account

## Files to Review

1. `api/mobile.py` - Registration endpoint (lines 700-786)
2. `database/external_db.py` - `claim_welcome_bonus()` function (lines 1020-1109)
3. `database/external_db.py` - `create_user_registration()` function
4. Supabase database schema for `users_registration` table
