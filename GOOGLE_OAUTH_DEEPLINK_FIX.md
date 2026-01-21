# Google OAuth Deep Link Fix - Complete Login Flow

## Problem
After selecting a Google account, the app gets stuck and doesn't log the user in, even though password reset deep links work correctly.

## Root Cause
The `LoginScreen` was not handling OAuth callback deep links (`nerdx://auth/callback?access_token=...`). While password reset worked because `ResetPasswordScreen` handles its deep links, the OAuth callback wasn't being processed.

## Solution Applied

### 1. ✅ Added Deep Link Handling to LoginScreen
- Added `Linking` import and listeners
- Added `handleDeepLink` function to process OAuth callbacks
- Added `handleOAuthCallback` function to complete the login flow
- Handles both initial URL (when app opens via deep link) and URL events (when app is running)

### 2. ✅ Complete OAuth Flow
When Google redirects to `nerdx://auth/callback?access_token=...`:
1. Deep link listener catches the URL
2. Extracts `access_token` and `refresh_token`
3. Sets Supabase session
4. Gets user data from Supabase
5. Sends to backend via `authApi.socialLogin`
6. Calls `login()` to authenticate user
7. Navigation happens automatically via `AppNavigator`

### 3. ✅ Dual Handling
The app now handles OAuth callbacks in two ways:
- **Via WebBrowser return**: `useGoogleAuth` hook processes the callback when `WebBrowser.openAuthSessionAsync` returns
- **Via Deep Link**: `LoginScreen` processes the callback when deep link is received (fallback if WebBrowser doesn't capture it)

## How It Works Now

### Flow 1: WebBrowser Captures Redirect (Primary)
1. User clicks "Sign in with Google"
2. Browser opens, user selects account
3. Google redirects to Supabase
4. Supabase redirects to `nerdx://auth/callback?access_token=...`
5. `WebBrowser.openAuthSessionAsync` returns with URL
6. `useGoogleAuth` processes tokens and returns user data
7. `LoginScreen` sends to backend and logs user in

### Flow 2: Deep Link Opens App (Fallback)
1. User clicks "Sign in with Google"
2. Browser opens, user selects account
3. Google redirects to Supabase
4. Supabase redirects to `nerdx://auth/callback?access_token=...`
5. App opens via deep link (WebBrowser might not capture it)
6. `LoginScreen` deep link listener catches the URL
7. `handleOAuthCallback` processes tokens
8. Sends to backend and logs user in

## Files Modified

1. **NerdXApp/src/screens/LoginScreen.tsx**
   - Added `Linking` import
   - Added `supabase` import
   - Added deep link listener `useEffect`
   - Added `handleDeepLink` function
   - Added `handleOAuthCallback` function
   - Enhanced route params handling for OAuth callbacks

## Testing

1. **Test Google Sign-In:**
   - Click "Sign in with Google"
   - Select account
   - Should redirect back to app
   - Should automatically log in and navigate to dashboard

2. **Check Logs:**
   Look for these log messages:
   ```
   🔑 Starting Google Sign-In flow...
   🔑 Opening OAuth URL in browser...
   🔑 Deep link received: nerdx://auth/callback?access_token=...
   🔑 Processing OAuth callback...
   🔑 Setting Supabase session from OAuth callback...
   🔑 Session set successfully, getting user data...
   🔑 User data retrieved: { email: ..., id: ... }
   🔑 Sending to backend for authentication...
   ✅ Social login successful, logging in user...
   ✅ User logged in successfully
   ```

3. **Verify:**
   - User is logged in
   - Navigated to dashboard
   - User data is correct
   - No errors in console

## Important Notes

- The deep link handler works even if `WebBrowser.openAuthSessionAsync` doesn't return the URL
- Both methods (WebBrowser return and deep link) can work, but deep link is the fallback
- Password reset still works as before (handled separately)
- OAuth callbacks are distinguished from password reset by checking for `type !== 'recovery'`

## If Still Having Issues

1. **Check Supabase Configuration:**
   - Ensure `nerdx://auth/callback` is in redirect URLs
   - Verify Google provider is enabled

2. **Check Logs:**
   - Look for deep link messages
   - Check for any error messages
   - Verify tokens are being extracted

3. **Test Deep Link Manually:**
   ```bash
   # Android
   adb shell am start -W -a android.intent.action.VIEW -d "nerdx://auth/callback?access_token=test" com.Ngoni03.nerdxapp
   ```

4. **Clear App Data:**
   - Uninstall and reinstall app
   - Clear cache if needed
