# Google OAuth Setup for Supabase

## Current Configuration Status

The app uses Supabase Auth for Google OAuth authentication. After successful Google sign-in, users should be automatically logged in and navigated to the dashboard.

## Configuration Steps

### 1. Supabase Dashboard - Google OAuth Provider

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list and click on it
4. Ensure it's **Enabled**
5. Configure the following:
   - **Client ID**: Your Google OAuth Client ID (from Google Cloud Console)
   - **Client Secret**: Your Google OAuth Client Secret
   - **Authorized Redirect URIs**: Must include:
     ```
     https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
     ```
     ```
     nerdx://auth/callback
     ```
     ```
     nerdxapp://auth/callback
     ```

### 2. Google Cloud Console Configuration

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Select your project (or create one)
3. Go to **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID** (if not exists):
   - **Application type**: Web application
   - **Name**: NerdX Mobile App
   - **Authorized JavaScript origins**: 
     ```
     https://lzteiewcvxoazqfxfjgg.supabase.co
     ```
   - **Authorized redirect URIs**:
     ```
     https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
     ```
5. Copy the **Client ID** and **Client Secret**
6. Paste them into Supabase Dashboard → Authentication → Providers → Google

### 3. App Configuration

The app is already configured to use:
- **Scheme**: `nerdx` and `nerdxapp`
- **Redirect Path**: `auth/callback`
- **Supabase Client**: Configured to handle OAuth sessions

## How It Works

1. User clicks "Sign in with Google"
2. `useGoogleAuth` hook initiates OAuth flow via Supabase
3. User selects Google account and grants permissions
4. Google redirects to Supabase callback URL
5. Supabase creates session and redirects to app: `nerdx://auth/callback`
6. App extracts access token and creates Supabase session
7. App calls `/api/mobile/auth/social-login` with user data
8. Backend creates/updates user record and returns JWT token
9. App calls `login()` which sets user in AuthContext
10. `AppNavigator` detects `isAuthenticated === true` and navigates to Dashboard

## Troubleshooting

### Issue: Redirects back to login instead of dashboard

**Causes:**
- OAuth succeeded but user data not properly synced
- JWT token not being stored correctly
- AuthContext not detecting authentication state

**Solutions:**
- Check browser console/React Native logs for errors
- Verify user data structure matches backend expectations
- Ensure `AsyncStorage` is working (check token is saved)

### Issue: "Wrong password" when trying email/password login after Google sign-in

**Cause:** Google OAuth users don't have passwords in the system.

**Solution:** Users who sign in with Google should continue using Google sign-in. The app now properly handles OAuth users without passwords.

### Issue: Google OAuth not working

**Check:**
1. Google OAuth provider is enabled in Supabase
2. Client ID and Secret are correctly configured
3. Redirect URIs match exactly (case-sensitive)
4. Google Cloud Console has correct redirect URIs configured

## Testing

1. Click "Sign in with Google" button
2. Select Google account
3. Grant permissions
4. Should automatically navigate to Dashboard
5. User data (name, email) should be populated from Google
6. User should have welcome bonus credits (if new user)

## Notes

- OAuth users don't have passwords - they must use Google sign-in
- User data (name, email) is synced from Google on each login
- If user exists in system, they're logged in; if new, account is created automatically
