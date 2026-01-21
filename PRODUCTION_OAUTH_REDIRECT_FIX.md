# Production OAuth Redirect Fix - APK Build

## Problem
In development, the app uses `exp://172.20.10.5:8082` (Expo dev URL) instead of the production deep link `nerdx://auth/callback`. For production APK builds, we need to ensure it uses the production scheme.

## Fix Applied

### 1. ✅ Updated `useGoogleAuth.ts` for Production Builds
- Detects if app is running in standalone/production mode
- Uses hardcoded `nerdx://auth/callback` for production builds
- Falls back to `makeRedirectUri` for development (Expo Go)

### 2. ✅ Enhanced Deep Link Handler in `LoginScreen.tsx`
- Filters out Expo dev URLs (`exp://`)
- Only processes production deep links (`nerdx://`)
- Still handles Supabase callback URLs for password reset

## How It Works

### Development Mode (Expo Go):
- Uses `makeRedirectUri` which generates `exp://...` URLs
- Deep link handler skips these URLs
- OAuth still works via `WebBrowser.openAuthSessionAsync` return

### Production Mode (APK):
- Uses hardcoded `nerdx://auth/callback`
- Deep link handler processes `nerdx://` URLs
- OAuth callback works via deep link

## Production Flow

1. **User clicks "Sign in with Google"**
2. **App generates redirect URL:** `nerdx://auth/callback` (production)
3. **Browser opens Google OAuth**
4. **User selects account**
5. **Google redirects to Supabase**
6. **Supabase redirects to:** `nerdx://auth/callback?access_token=...`
7. **App receives deep link** → `LoginScreen` processes it
8. **User logged in** → Navigates to dashboard automatically

## Configuration Required

### Supabase Dashboard:
1. Go to: **Authentication** → **URL Configuration**
2. Add redirect URL: `nerdx://auth/callback`
3. Set Site URL: `nerdx://`
4. Save

### Google Cloud Console:
1. Ensure redirect URI includes:
   ```
   https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
   ```

## Testing

### In Development (Expo Go):
- OAuth works via `WebBrowser` return
- Deep links may use `exp://` (handled by WebBrowser)

### In Production (APK):
- OAuth uses `nerdx://auth/callback`
- Deep links processed by `LoginScreen`
- Should redirect to dashboard after login

## Files Modified

1. **NerdXApp/src/hooks/useGoogleAuth.ts**
   - Added production build detection
   - Uses hardcoded `nerdx://auth/callback` for production
   - Falls back to `makeRedirectUri` for development

2. **NerdXApp/src/screens/LoginScreen.tsx**
   - Enhanced deep link filtering
   - Skips Expo dev URLs
   - Only processes production deep links

## Verification

After building APK, test:
1. Install APK on device
2. Click "Sign in with Google"
3. Select account
4. Should redirect to `nerdx://auth/callback`
5. Should automatically log in and navigate to dashboard

## Important Notes

- Production builds will always use `nerdx://auth/callback`
- Development builds use `exp://` (handled by WebBrowser)
- Deep link handler filters out dev URLs
- Both methods work, but production uses deep links
