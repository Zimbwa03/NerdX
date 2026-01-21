# Supabase URL Fix - Critical Issue Resolved

## Problem Identified
The app was trying to connect to the wrong Supabase project:
- **Wrong URL:** `hvlvwvzliqrlmqjbfgoa.supabase.co` (old project)
- **Correct URL:** `lzteiewcvxoazqfxfjgg.supabase.co` (current project)

This caused DNS errors and authentication failures.

## Fixes Applied

### 1. ✅ Added Explicit Configuration to `app.json`
Added Supabase URL and key directly to `app.json` under `extra`:
```json
"extra": {
  "supabaseUrl": "https://lzteiewcvxoazqfxfjgg.supabase.co",
  "supabaseAnonKey": "..."
}
```

This ensures the correct URL is always used, even if environment variables are wrong.

### 2. ✅ Enhanced `supabase.ts` with Validation
- Added validation to detect if wrong URL is being used
- Added console warnings if incorrect URL detected
- Added logging to show which URL is being used
- Priority order: `app.json` extra > environment variable > hardcoded fallback

### 3. ✅ Configuration Priority
The app now uses this priority order:
1. `app.json` → `extra.supabaseUrl` (most reliable - now set)
2. `EXPO_PUBLIC_SUPABASE_URL` environment variable
3. Hardcoded fallback (correct URL)

## Verification Steps

1. **Check App Logs:**
   When the app starts, you should see:
   ```
   🔧 Supabase Configuration:
      URL: https://lzteiewcvxoazqfxfjgg.supabase.co
      Project: ✅ CORRECT
   ```

2. **If you see a warning:**
   ```
   ⚠️ WARNING: Using incorrect Supabase URL: ...
   ```
   This means something is overriding the correct URL.

3. **Test Authentication:**
   - Try Google sign-in
   - Should now connect to correct Supabase project
   - Should not see DNS errors

## Next Steps

1. **Restart the app** to load new configuration
2. **Clear app cache** if needed (uninstall/reinstall)
3. **Check logs** to verify correct URL is being used
4. **Test Google authentication** - should work now

## If Still Having Issues

1. **Check Environment Variables:**
   - Look for `.env` files in project root
   - Ensure `EXPO_PUBLIC_SUPABASE_URL` is set to correct URL
   - Or remove it to use `app.json` config

2. **Clear Expo Cache:**
   ```bash
   npx expo start --clear
   ```

3. **Rebuild App:**
   - The `app.json` configuration requires a rebuild
   - Run: `eas build` or `expo prebuild`

## Files Modified

1. **NerdXApp/app.json**
   - Added `supabaseUrl` and `supabaseAnonKey` to `extra` section

2. **NerdXApp/src/services/supabase.ts**
   - Added validation and logging
   - Added warnings for incorrect URLs
   - Ensured correct URL is always used

## Important Notes

- The correct Supabase project is: **lzteiewcvxoazqfxfjgg**
- All authentication must use this project
- The old project (`hvlvwvzliqrlmqjbfgoa`) should not be used
- Configuration in `app.json` takes priority over environment variables
