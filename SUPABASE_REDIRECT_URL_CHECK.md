# Supabase Redirect URL Configuration Check

## Current Configuration Required

Based on your app configuration, you need to ensure these redirect URLs are configured in Supabase:

### Required Redirect URLs

1. **Primary OAuth Callback:**
   ```
   nerdx://auth/callback
   ```

2. **Alternative Deep Link Format:**
   ```
   com.Ngoni03.nerdxapp://auth/callback
   ```

3. **Supabase Default Callback (Required):**
   ```
   https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
   ```

4. **Password Reset (if using):**
   ```
   nerdx://reset-password
   ```

### Site URL Configuration

Set the **Site URL** in Supabase to:
```
nerdx://
```

## How to Check/Configure in Supabase Dashboard

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select project: **lzteiewcvxoazqfxfjgg**

2. **Navigate to Authentication Settings:**
   - Click **Authentication** in left sidebar
   - Click **URL Configuration**

3. **Verify/Add Redirect URLs:**
   - Check if `nerdx://auth/callback` is in the list
   - If not, click **Add URL** and add it
   - Ensure all URLs listed above are present

4. **Set Site URL:**
   - In the **Site URL** field, set: `nerdx://`
   - Click **Save**

5. **Verify Google Provider:**
   - Go to **Authentication** → **Providers**
   - Click on **Google**
   - Ensure it's **Enabled**
   - Verify **Client ID** and **Client Secret** are set
   - Check that **Authorized redirect URIs** in Google Cloud Console includes:
     ```
     https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
     ```

## Common Issues and Fixes

### Issue: "Redirect URL not allowed"
**Solution:** 
- Make sure `nerdx://auth/callback` is exactly as shown (case-sensitive)
- No trailing slashes
- Ensure it's saved in Supabase Dashboard

### Issue: Browser opens but doesn't redirect back
**Possible Causes:**
1. Redirect URL not configured in Supabase
2. Deep linking not properly set up on device
3. WebBrowser session not handling redirect correctly

**Solutions:**
1. Verify redirect URL is in Supabase Dashboard
2. Test deep linking: Try opening `nerdx://auth/callback` manually
3. Check app logs for redirect URL being used
4. Ensure app is installed (not just running in Expo Go)

### Issue: Stuck on Google account selection
**Possible Causes:**
1. Google OAuth not properly configured
2. Redirect URL mismatch between app and Supabase
3. Network issues preventing redirect

**Solutions:**
1. Check Google Cloud Console redirect URIs
2. Verify Supabase redirect URLs match exactly
3. Check network connectivity
4. Try clearing browser cache/data

## Testing the Configuration

1. **Test Deep Linking:**
   ```bash
   # On Android (via ADB)
   adb shell am start -W -a android.intent.action.VIEW -d "nerdx://auth/callback?test=1" com.Ngoni03.nerdxapp
   
   # On iOS (via Simulator)
   xcrun simctl openurl booted "nerdx://auth/callback?test=1"
   ```

2. **Check Logs:**
   - Look for: `🔑 Starting Supabase Google Auth with redirect:`
   - Verify the redirect URL matches what's in Supabase
   - Check for any error messages about redirect URLs

3. **Manual Test:**
   - Try signing in with Google
   - After selecting account, check if app receives the callback
   - Check browser console/logs for any errors

## Debugging Steps

1. **Enable Debug Logging:**
   - Check React Native logs for authentication flow
   - Look for console.log messages starting with `🔑`

2. **Verify Redirect URL Generation:**
   - The app uses `makeRedirectUri({ scheme: 'nerdx', path: 'auth/callback' })`
   - This should generate: `nerdx://auth/callback`
   - Verify this matches Supabase configuration

3. **Check WebBrowser Result:**
   - After OAuth, check `result.type` and `result.url`
   - If `result.type === 'success'` but no URL, session might be set directly
   - The code now handles this case

## Next Steps After Configuration

1. Save all changes in Supabase Dashboard
2. Restart your app
3. Try Google sign-in again
4. Check logs for any errors
5. If still stuck, check the updated `useGoogleAuth.ts` which now handles edge cases better
