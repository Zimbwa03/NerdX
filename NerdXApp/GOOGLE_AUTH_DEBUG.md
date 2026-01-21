# Google Authentication Debug Guide

## Current Issue
After clicking a Google account, the system fails to redirect back to the app and gets stuck.

## Root Cause Analysis

The issue occurs in the OAuth redirect flow. After Google authentication, Supabase should redirect to `nerdx://auth/callback`, but the redirect isn't working properly.

## Fixes Applied

### 1. Enhanced Redirect Handling
Updated `useGoogleAuth.ts` to:
- Better handle cases where WebBrowser returns success but no URL
- Check for session directly if URL parsing fails
- Add more detailed logging
- Handle edge cases where redirect completes but URL isn't captured

### 2. Required Supabase Configuration

**You MUST configure these in Supabase Dashboard:**

1. **Redirect URLs** (Authentication → URL Configuration):
   - `nerdx://auth/callback`
   - `com.Ngoni03.nerdxapp://auth/callback`
   - `https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback`

2. **Site URL**:
   - Set to: `nerdx://`

3. **Google Provider** (Authentication → Providers → Google):
   - Must be **Enabled**
   - Client ID and Secret must be configured
   - In Google Cloud Console, ensure redirect URI includes:
     ```
     https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
     ```

## Testing Checklist

- [ ] Verified redirect URLs in Supabase Dashboard
- [ ] Set Site URL to `nerdx://`
- [ ] Google provider is enabled
- [ ] Google Cloud Console redirect URI configured
- [ ] App deep linking works (test with `nerdx://auth/callback`)
- [ ] Checked app logs during sign-in attempt
- [ ] Cleared app cache/data if needed

## Debug Commands

### Check if deep linking works:
```bash
# Android
adb shell am start -W -a android.intent.action.VIEW -d "nerdx://auth/callback?test=1" com.Ngoni03.nerdxapp

# iOS Simulator
xcrun simctl openurl booted "nerdx://auth/callback?test=1"
```

### View logs:
```bash
# React Native
npx react-native log-android
# or
npx react-native log-ios

# Expo
npx expo start --clear
```

## What to Look For in Logs

1. **Before OAuth:**
   ```
   🔑 Starting Supabase Google Auth with redirect: nerdx://auth/callback
   ```

2. **After Account Selection:**
   ```
   🔑 Browser result type: success
   🔑 Callback URL received: nerdx://auth/callback?access_token=...
   ```

3. **If Stuck:**
   - Check if `result.type` is something other than 'success'
   - Check if `result.url` is null/undefined
   - Look for any error messages

## Alternative Solution

If the redirect still doesn't work, we can try:

1. **Using `startAsync` instead of `openAuthSessionAsync`:**
   - More control over the browser session
   - Better error handling

2. **Manual URL parsing:**
   - Listen for deep link events directly
   - Parse tokens from URL manually

3. **Check Supabase session directly:**
   - After OAuth, check if Supabase has a session
   - Extract user data from session

## Next Steps

1. **First:** Configure Supabase redirect URLs (see SUPABASE_REDIRECT_URL_CHECK.md)
2. **Then:** Test the authentication flow
3. **If still stuck:** Check logs and report what you see
4. **Alternative:** We can implement a different OAuth flow if needed
