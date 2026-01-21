# ✅ REQUIRED: Supabase Redirect URLs Configuration

## ⚠️ Critical: These URLs MUST be added to Supabase

Without these redirect URLs configured in Supabase, Google OAuth will **fail** with an error like:
- "Redirect URL not allowed"
- "Invalid redirect URL"
- OAuth flow gets stuck after account selection

## 📋 Step-by-Step Configuration

### Step 1: Go to Supabase Dashboard
1. Visit: **https://supabase.com/dashboard**
2. Sign in to your account
3. Select project: **lzteiewcvxoazqfxfjgg**

### Step 2: Navigate to URL Configuration
1. Click **Authentication** in the left sidebar
2. Click **URL Configuration** (or find it under Authentication settings)

### Step 3: Add These Redirect URLs

Click **Add URL** or **+ Add** for each of these URLs:

#### ✅ Required for Google OAuth:
```
nerdx://auth/callback
```

#### ✅ Alternative format (iOS bundle identifier):
```
com.Ngoni03.nerdxapp://auth/callback
```

#### ✅ Supabase default callback (REQUIRED):
```
https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
```

#### ✅ For password reset (if using):
```
nerdx://reset-password
```

### Step 4: Set Site URL

In the **Site URL** field, set:
```
nerdx://
```

### Step 5: Save Changes

Click **Save** or **Update** and wait for confirmation.

## 🔍 How to Verify

After adding the URLs, you should see them listed in the **Redirect URLs** section:

```
Redirect URLs:
✓ nerdx://auth/callback
✓ com.Ngoni03.nerdxapp://auth/callback
✓ https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
✓ nerdx://reset-password
```

## ⚠️ Important Notes

1. **Case-sensitive**: URLs must match exactly (e.g., `nerdx://` not `NerdX://`)
2. **No trailing slashes**: `nerdx://auth/callback` not `nerdx://auth/callback/`
3. **Must save**: Changes don't take effect until you click Save
4. **Takes effect immediately**: After saving, OAuth should work right away

## 🧪 Test After Configuration

1. **Restart your app** (if running)
2. **Try Google sign-in**:
   - Click "Sign in with Google"
   - Select account
   - Should redirect back to app successfully

3. **Check logs** for:
   ```
   🔑 Starting Supabase Google Auth with redirect: nerdx://auth/callback
   🔑 Deep link received: nerdx://auth/callback?access_token=...
   ✅ User logged in successfully
   ```

## ❌ Common Errors (If Not Configured)

- **"Redirect URL not allowed"** → Add `nerdx://auth/callback` to Supabase
- **"Invalid redirect URL"** → Check for typos, case sensitivity
- **OAuth stuck after account selection** → Redirect URL not configured
- **Browser doesn't redirect back** → Deep link URL not in Supabase allowlist

## ✅ Summary

**YES, you MUST add these redirect URLs to Supabase:**
- ✅ `nerdx://auth/callback` (Primary - REQUIRED)
- ✅ `com.Ngoni03.nerdxapp://auth/callback` (Alternative format)
- ✅ `https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback` (Supabase callback - REQUIRED)
- ✅ `nerdx://reset-password` (For password reset)

**Without these, Google OAuth will NOT work!**
