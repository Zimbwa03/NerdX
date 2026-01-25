# Welcome Bonus Fixed: 150 Credits for First-Time Users

## Summary
Updated the system to award **150 credits** (1500 units) to first-time users instead of the previous 75 credits (750 units).

## Changes Made

### 1. Configuration Update
**File:** `config.py`
- Changed `REGISTRATION_BONUS` from `750` (75 credits) to `1500` (150 credits)

### 2. Database Function Updates
**File:** `database/external_db.py`
- Updated `claim_welcome_bonus()` function:
  - Changed docstring from "75 credits" to "150 credits"
  - Added logic to upgrade existing users who claimed with old amount (75 credits) to new amount (150 credits)
  - Enhanced transaction logging to distinguish upgrades from new claims

### 3. Mobile API Updates
**File:** `api/mobile.py`
- **Registration Endpoint (`/auth/register`):**
  - Added `claim_welcome_bonus()` call immediately after user creation
  - Returns actual credits from database instead of expected amount
  - Includes welcome bonus notification in response
  - Returns credit breakdown for better transparency

- **Login Endpoint (`/auth/login`):**
  - Already calls `claim_welcome_bonus()` ✅
  - Will now award/upgrade to 150 credits

- **Social Login Endpoint (`/auth/social-login`):**
  - Already calls `claim_welcome_bonus()` ✅
  - Will now award/upgrade to 150 credits

### 4. User Service Updates
**File:** `services/user_service.py`
- Updated welcome message to dynamically show welcome bonus amount from config
- Uses `format_credits(Config.REGISTRATION_BONUS)` instead of hardcoded "75 Credits"

### 5. WhatsApp Webhook Updates
**File:** `api/webhook.py`
- Updated referral message to mention "150 welcome credits" instead of "75 welcome credits"

### 6. Referral Service Updates
**File:** `services/referral_service.py`
- Updated comment to reflect "150 welcome credits" instead of "75 welcome credits"

### 7. Database Migration Script
**File:** `database/upgrade_welcome_bonus_to_150.sql`
- Created SQL migration script to upgrade existing users who already claimed with old amount
- Updates `users_registration` table
- Syncs `user_stats` table
- Logs upgrade transactions in `credit_transactions` table

## How It Works

### For New Users:
1. User registers via mobile app
2. `create_user_registration()` creates user with 0 credits
3. `claim_welcome_bonus()` is called immediately after registration
4. User receives 1500 units (150 credits)
5. `welcome_bonus_claimed` flag is set to `true`

### For Existing Users Who Already Claimed:
- Users who claimed with 75 credits (750 units) will be automatically upgraded to 150 credits (1500 units) when they:
  - Log in to the mobile app
  - Access WhatsApp bot main menu
  - The `claim_welcome_bonus()` function detects they have less than 1500 units and upgrades them

### For Existing Users Who Haven't Claimed:
- Users with `welcome_bonus_claimed = false` will receive the full 150 credits when they claim

## Database Migration

To upgrade existing users who already claimed with the old amount, run:

```sql
-- Execute: database/upgrade_welcome_bonus_to_150.sql
```

This will:
- Update all users with `welcome_bonus_claimed = true` and `credits < 1500` to have 1500 credits
- Sync the `user_stats` table
- Log upgrade transactions

## Verification

### Check Current Status:
```sql
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN welcome_bonus_claimed = false THEN 1 END) as unclaimed,
    COUNT(CASE WHEN welcome_bonus_claimed = true AND credits < 1500 THEN 1 END) as needs_upgrade,
    COUNT(CASE WHEN welcome_bonus_claimed = true AND credits >= 1500 THEN 1 END) as has_full_bonus
FROM users_registration;
```

### Test New Registration:
1. Register a new user via mobile app
2. Check that user receives 150 credits (1500 units)
3. Verify `welcome_bonus_claimed = true`
4. Verify transaction logged in `credit_transactions`

## Supabase Status
✅ Supabase is working correctly
- API logs show successful requests
- Database queries execute properly
- No connection issues detected

## Render Logs
- Render MCP tools are available but logs need to be accessed via Render dashboard
- Application is running and processing requests successfully

## Next Steps

1. **Deploy Changes:**
   - Push code changes to repository
   - Render will auto-deploy

2. **Run Migration (Optional but Recommended):**
   - Execute `database/upgrade_welcome_bonus_to_150.sql` in Supabase SQL editor
   - This upgrades existing users immediately instead of waiting for them to log in

3. **Monitor:**
   - Check new registrations receive 150 credits
   - Verify existing users get upgraded on next login
   - Monitor credit transactions for accuracy

## Notes

- The system uses a unit-based credit system: **1 credit = 10 units**
- All internal calculations use units (1500 units = 150 credits)
- Display values are automatically converted using `format_credits()` function
- The upgrade logic is backward-compatible and handles both old and new users gracefully
