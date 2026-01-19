# Supabase Password Reset Configuration

## Required Configuration Steps

### 1. Configure Redirect URLs in Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `lzteiewcvxoazqfxfjgg`
3. Navigate to **Authentication** → **URL Configuration**
4. Add the following **Redirect URLs**:
   - `nerdx://reset-password` (for mobile deep linking)
   - `https://nerdx.app/reset-password` (for web fallback)
   - `com.Ngoni03.nerdxapp://reset-password` (iOS bundle identifier format)
   - `https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback` (Supabase callback)

### 2. Email Template Configuration (Optional)

1. Go to **Authentication** → **Email Templates**
2. Find the **Reset Password** template
3. Ensure the template includes:
   - A button/link that redirects to the app
   - The redirect URL should be: `nerdx://reset-password`

### 3. Site URL Configuration

1. In **Authentication** → **URL Configuration**
2. Set **Site URL** to: `nerdx://` or your app's deep link scheme

## Password Reset Flow

1. **User requests reset** → `ForgotPasswordScreen.tsx` calls `supabase.auth.resetPasswordForEmail()`
2. **Supabase sends email** → User receives email with reset link
3. **User clicks link** → Opens app via deep link: `nerdx://reset-password?access_token=xxx&type=recovery`
4. **App handles deep link** → `AppNavigator.tsx` routing navigates to `ResetPasswordScreen`
5. **User enters new password** → `ResetPasswordScreen.tsx` calls `supabase.auth.updateUser()`
6. **Password updated** → Both Supabase Auth and backend database are updated
7. **Redirect to login** → User is redirected to `LoginScreen` to login with new password

## Testing

1. Request password reset from `ForgotPasswordScreen`
2. Check email for reset link
3. Click link on device (should open app)
4. Enter new password in `ResetPasswordScreen`
5. Login with new password

## Troubleshooting

- **Link doesn't open app**: Check deep linking configuration in `app.json` and device settings
- **"Invalid token" error**: Reset link may have expired (links expire after 1 hour by default)
- **Session not found**: Ensure `detectSessionInUrl: true` in Supabase client config
- **Redirect URL blocked**: Add URL to Supabase Dashboard → Authentication → URL Configuration
