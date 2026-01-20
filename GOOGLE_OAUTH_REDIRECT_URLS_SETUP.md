# Google OAuth Redirect URLs - Required Supabase Dashboard Configuration

## Quick Fix Summary

The mobile app has been updated to use the correct Supabase project (`lzteiewcvxoazqfxfjgg`). To complete the Google sign-in fix, you need to configure redirect URLs in the Supabase Dashboard.

## Required Supabase Dashboard Configuration

### Step 1: Navigate to URL Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: **lzteiewcvxoazqfxfjgg**
3. Navigate to **Authentication** → **URL Configuration**

### Step 2: Add OAuth Redirect URLs

Add these redirect URLs (click **Add URL** or **+ Add** for each):

**For Google OAuth:**
```
nerdx://auth/callback
```

**For Password Reset (if not already added):**
```
nerdx://reset-password
```

**Optional (for iOS bundle identifier format):**
```
com.Ngoni03.nerdxapp://auth/callback
com.Ngoni03.nerdxapp://reset-password
```

**Required Supabase callback:**
```
https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
```

### Step 3: Set Site URL (Optional but Recommended)

In the **Site URL** field, set:
```
nerdx://
```

### Step 4: Save Changes

Click **Save** or **Update** button and wait for confirmation.

## Verify Google Provider Configuration

### In Supabase Dashboard:

1. Navigate to **Authentication** → **Providers**
2. Find **Google** in the list
3. Ensure it's **Enabled**
4. Verify **Client ID** and **Client Secret** are configured

### In Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID for "NerdX Mobile App"
4. Verify **Authorized redirect URIs** includes:
   ```
   https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
   ```

## Testing After Configuration

1. Run the mobile app
2. Tap **Sign in with Google**
3. Browser should open showing Google account picker (not DNS error)
4. Select a Google account
5. App should receive callback and log user in

## Troubleshooting

### Still seeing DNS error?

- Verify the mobile app is using the correct Supabase URL (should be `lzteiewcvxoazqfxfjgg`)
- Check that redirect URLs are saved in Supabase Dashboard
- Ensure Google provider is enabled in Supabase

### Redirect URL not allowed?

- Make sure URLs are added exactly as shown (case-sensitive)
- Check for typos
- Ensure URLs are saved before testing

### Google account picker not showing?

- Verify Google OAuth Client ID/Secret in Supabase Dashboard
- Check Google Cloud Console redirect URI configuration
- Ensure Google provider is enabled in Supabase

## Related Documentation

- [SUPABASE_REDIRECT_URL_SETUP.md](SUPABASE_REDIRECT_URL_SETUP.md) - Detailed redirect URL setup
- [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) - Complete Google OAuth setup guide
