# Production APK OAuth Setup - Complete Guide

## ✅ Fixes Applied for Production APK

### 1. Production Redirect URL
**File:** `NerdXApp/src/hooks/useGoogleAuth.ts`

- ✅ Always uses `nerdx://auth/callback` for OAuth redirect
- ✅ Works in both development and production
- ✅ Ensures APK builds use production deep link

### 2. Deep Link Handler
**File:** `NerdXApp/src/screens/LoginScreen.tsx`

- ✅ Processes `nerdx://auth/callback` URLs
- ✅ Filters out Expo dev URLs (`exp://`)
- ✅ Completes OAuth login flow automatically
- ✅ Navigates to dashboard after successful login

### 3. Backend Account Creation
**File:** `api/mobile.py` & `database/external_db.py`

- ✅ Checks by email first (prevents duplicates)
- ✅ Creates OAuth users correctly
- ✅ Grants welcome bonus (150 credits)
- ✅ Returns JWT token for authentication

## 🔄 Complete OAuth Flow (Production APK)

### Step-by-Step:

1. **User clicks "Sign in with Google"**
   - App generates redirect URL: `nerdx://auth/callback`
   - Opens Google OAuth in browser

2. **User selects Google account**
   - Google authenticates user
   - Redirects to Supabase callback

3. **Supabase processes OAuth**
   - Creates/updates user in `auth.users`
   - Redirects to: `nerdx://auth/callback?access_token=...&refresh_token=...`

4. **App receives deep link**
   - `LoginScreen` deep link handler catches URL
   - Extracts `access_token` and `refresh_token`

5. **App processes OAuth callback**
   - Sets Supabase session
   - Gets user data from Supabase
   - Sends to backend via `authApi.socialLogin()`

6. **Backend creates/updates user**
   - Checks if user exists by email
   - Creates new user or updates existing
   - Grants welcome bonus (if new user)
   - Returns JWT token and user data

7. **App logs user in**
   - Calls `login()` with user data and token
   - `AuthContext` sets authentication state
   - `AppNavigator` detects `isAuthenticated === true`
   - **Automatically navigates to Dashboard** ✅

## 📋 Required Supabase Configuration

### Redirect URLs (Authentication → URL Configuration):
```
nerdx://auth/callback
com.Ngoni03.nerdxapp://auth/callback
https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
```

### Site URL:
```
nerdx://
```

### Google Provider:
- ✅ Enabled
- ✅ Client ID and Secret configured
- ✅ Redirect URI in Google Cloud Console: `https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback`

## 🧪 Testing Checklist

### Before Building APK:
- [ ] Supabase redirect URLs configured
- [ ] Google provider enabled
- [ ] Test in development (should work via WebBrowser return)

### After Building APK:
- [ ] Install APK on device
- [ ] Click "Sign in with Google"
- [ ] Select Google account
- [ ] Verify redirect to `nerdx://auth/callback`
- [ ] Verify automatic login
- [ ] Verify navigation to dashboard
- [ ] Check logs for successful flow

## 🔍 Expected Logs (Production APK)

```
🔑 Starting Supabase Google Auth with redirect: nerdx://auth/callback
🔑 Production/standalone build - using: nerdx://auth/callback
🔑 Opening OAuth URL in browser...
🔑 Deep link received: nerdx://auth/callback?access_token=...
🔑 Processing OAuth callback...
🔑 Setting Supabase session from OAuth callback...
🔑 Session set successfully, getting user data...
🔑 User data retrieved: { email: ..., id: ... }
🔑 Sending to backend for authentication...
🔑 Backend response: { success: true, hasToken: true, hasUser: true }
✅ Social login successful, logging in user...
✅ User logged in successfully
```

## ⚠️ Important Notes

1. **Development vs Production:**
   - Development (Expo Go): May use `exp://` URLs, but WebBrowser handles it
   - Production (APK): Always uses `nerdx://auth/callback`

2. **Deep Link Handling:**
   - Filters out `exp://` URLs in development
   - Processes `nerdx://` URLs in production
   - Both methods work, but production uses deep links

3. **Navigation:**
   - Happens automatically when `isAuthenticated` becomes `true`
   - No manual navigation needed
   - `AppNavigator` handles the switch from auth stack to main stack

## 🚀 Building Production APK

After these fixes, build your APK:

```bash
cd "c:\Users\GWENJE\Desktop\Nerdx 1\NerdX\NerdXApp"
eas build --platform android --profile production
```

The APK will:
- ✅ Use `nerdx://auth/callback` for OAuth redirect
- ✅ Process deep links correctly
- ✅ Complete login flow automatically
- ✅ Navigate to dashboard after Google sign-in

## ✅ Summary

**All fixes applied:**
- ✅ Production redirect URL (`nerdx://auth/callback`)
- ✅ Deep link handling in LoginScreen
- ✅ OAuth callback processing
- ✅ Backend account creation with duplicate prevention
- ✅ Automatic navigation to dashboard

**The Google OAuth flow is now production-ready!**
