# Supabase Account Verification - Google OAuth

## Database Structure Verified

### Tables Checked:
1. ✅ **auth.users** - Supabase Auth table (stores OAuth users)
2. ✅ **users_registration** - Custom user table (stores app users)

### users_registration Table Structure:
- `id` (integer, primary key)
- `chat_id` (varchar) - For OAuth users, this is the email
- `email` (varchar, nullable)
- `name` (varchar)
- `surname` (varchar)
- `nerdx_id` (varchar) - Unique user identifier
- `credits` (integer)
- `welcome_bonus_claimed` (boolean)
- `password_hash` (varchar, nullable) - NULL for OAuth users
- `password_salt` (varchar, nullable) - NULL for OAuth users
- `created_at`, `updated_at` (timestamps)

## Google OAuth Account Creation Flow

### Step 1: Supabase Auth (auth.users)
When user signs in with Google:
1. Supabase creates/updates user in `auth.users` table
2. Stores OAuth provider info (Google)
3. Stores user metadata (name, email, picture, etc.)
4. Creates session with access_token and refresh_token

### Step 2: App Processing (LoginScreen)
1. Deep link receives: `nerdx://auth/callback?access_token=...`
2. `handleOAuthCallback` extracts tokens
3. Sets Supabase session
4. Gets user data from Supabase Auth
5. Extracts: email, name, given_name, family_name, id

### Step 3: Backend Sync (api/mobile.py - social_login)
1. Receives user data from app
2. Checks if user exists in `users_registration` by email
3. **If new user:**
   - Creates record in `users_registration`
   - Sets `chat_id = email` (for OAuth users)
   - Sets `name` and `surname` from Google data
   - Sets `password_hash = NULL` (OAuth users don't have passwords)
   - Calls `claim_welcome_bonus()` to grant 150 credits
   - Returns JWT token and user data
4. **If existing user:**
   - Updates name if different from Google
   - Returns existing user data and JWT token

## Verification Queries

### Check Recent Google OAuth Users:
```sql
-- Check Supabase Auth users (OAuth)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'full_name' as name,
  raw_user_meta_data->>'given_name' as given_name,
  created_at,
  last_sign_in_at
FROM auth.users 
WHERE email IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 10;

-- Check users_registration (app users)
SELECT 
  id,
  email,
  name,
  chat_id,
  nerdx_id,
  credits,
  welcome_bonus_claimed,
  password_hash IS NULL as is_oauth_user,
  registration_date
FROM users_registration 
WHERE email IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 10;
```

### Verify OAuth User Creation:
```sql
-- Find OAuth users (no password hash)
SELECT 
  email,
  name,
  chat_id,
  credits,
  welcome_bonus_claimed,
  created_at
FROM users_registration
WHERE password_hash IS NULL
  AND email IS NOT NULL
ORDER BY created_at DESC;
```

## Expected Behavior

### New Google OAuth User:
1. ✅ Created in `auth.users` (by Supabase)
2. ✅ Created in `users_registration` (by backend)
3. ✅ `chat_id` = email
4. ✅ `password_hash` = NULL
5. ✅ `welcome_bonus_claimed` = true (after bonus granted)
6. ✅ `credits` = 150 (welcome bonus)
7. ✅ `nerdx_id` = generated unique ID

### Existing User (Google OAuth):
1. ✅ Found in `users_registration` by email
2. ✅ Name updated if different from Google
3. ✅ Returns existing user data
4. ✅ No duplicate account created

## Testing Checklist

- [ ] Test Google sign-in with new account
- [ ] Verify user created in `users_registration`
- [ ] Verify `chat_id` = email
- [ ] Verify `password_hash` = NULL
- [ ] Verify welcome bonus granted (150 credits)
- [ ] Verify `welcome_bonus_claimed` = true
- [ ] Test Google sign-in with existing account
- [ ] Verify no duplicate created
- [ ] Verify name synced from Google

## Common Issues

### Issue: User not created in users_registration
**Possible Causes:**
- Backend `/api/mobile/auth/social-login` not called
- Backend error during user creation
- Email validation failing

**Check:**
- Backend logs for errors
- Verify API endpoint is being called
- Check email format

### Issue: Duplicate accounts
**Possible Causes:**
- User registered with email/password, then tries Google OAuth
- Email mismatch (case sensitivity)

**Solution:**
- Backend checks by email (case-insensitive)
- Should find existing user and update, not create duplicate

### Issue: Welcome bonus not granted
**Possible Causes:**
- `claim_welcome_bonus()` function error
- User already claimed bonus
- Credits not updating

**Check:**
- Backend logs for bonus claim
- Verify `welcome_bonus_claimed` flag
- Check credit_transactions table

## Next Steps

1. **Test Google OAuth sign-in** with a test account
2. **Verify account creation** using the queries above
3. **Check logs** for any errors
4. **Verify welcome bonus** is granted
5. **Test existing user** login to ensure no duplicates
