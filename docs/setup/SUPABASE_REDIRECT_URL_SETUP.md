# How to Configure Supabase Redirect URLs for Password Reset

## Step-by-Step Instructions

### Step 1: Access Supabase Dashboard

1. Go to **https://supabase.com/dashboard**
2. Sign in to your account
3. Select your project: **lzteiewcvxoazqfxfjgg** (or the project name)

### Step 2: Navigate to Authentication Settings

1. In the left sidebar, click on **Authentication**
2. Click on **URL Configuration** (or **Providers** → scroll down to find URL settings)

### Step 3: Add Redirect URLs

You'll see a section called **Redirect URLs** or **Site URL & Redirect URLs**. 

Add each of these URLs one by one (click **Add URL** or **+ Add** for each):

```
nerdx://reset-password
```

```
https://nerdx.app/reset-password
```

```
com.Ngoni03.nerdxapp://reset-password
```

```
https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback
```

### Step 4: Set Site URL (Optional but Recommended)

In the **Site URL** field, set:
```
nerdx://
```

Or if you have a website:
```
https://nerdx.app
```

### Step 5: Save Changes

1. Click **Save** or **Update** button
2. Wait for confirmation that settings are saved

## Visual Guide

The URL Configuration page should look like this:

```
┌─────────────────────────────────────────────────────┐
│ URL Configuration                                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Site URL:                                           │
│ [nerdx://                                    ]      │
│                                                      │
│ Redirect URLs:                                      │
│ ┌─────────────────────────────────────────────┐   │
│ │ nerdx://reset-password                     │   │
│ │ https://nerdx.app/reset-password           │   │
│ │ com.Ngoni03.nerdxapp://reset-password      │   │
│ │ https://lzteiewcvxoazqfxfjgg.supabase.co/  │   │
│ │   auth/v1/callback                         │   │
│ └─────────────────────────────────────────────┘   │
│                                                      │
│                  [Save] [Cancel]                    │
└─────────────────────────────────────────────────────┘
```

## Alternative Method: Via Supabase SQL Editor

If you prefer using SQL or want to automate this:

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Run this SQL (Note: This typically needs to be done via Dashboard UI, as redirect URLs are managed through Supabase's auth configuration, not directly via SQL)

**However, the recommended method is through the Dashboard UI as shown above.**

## What Each URL Does

- **`nerdx://reset-password`**: Main deep link for mobile app password reset
- **`https://nerdx.app/reset-password`**: Web fallback URL (if user opens on web)
- **`com.Ngoni03.nerdxapp://reset-password`**: iOS bundle identifier format (alternative deep link)
- **`https://lzteiewcvxoazqfxfjgg.supabase.co/auth/v1/callback`**: Supabase's default callback URL (required for auth flows)

## Testing the Configuration

After saving:

1. Request a password reset from your app
2. Check the email - the reset link should open your app
3. If the link doesn't work, check:
   - URL is exactly as configured (no trailing slashes)
   - App deep linking is properly configured
   - Device permissions allow opening the app from links

## Troubleshooting

### Issue: "Redirect URL not allowed" error

**Solution**: 
- Make sure all redirect URLs are added exactly as shown (case-sensitive)
- Check for typos
- Ensure URLs are saved before testing

### Issue: Link opens in browser instead of app

**Solution**:
- Verify deep linking is configured in `app.json` (scheme: `nerdx`)
- Check if the app is installed on the device
- For iOS: May need to test on a physical device (simulator has limitations)

### Issue: "Invalid redirect URL"

**Solution**:
- Ensure the URL matches exactly what's in the email link
- Check Supabase email template isn't modifying the URL
- Verify the redirect URL in the code matches the dashboard configuration

## Additional Notes

- Changes to redirect URLs take effect immediately (no deployment needed)
- You can add multiple redirect URLs - Supabase will validate against all of them
- The order doesn't matter
- Make sure to save after adding all URLs

## Need Help?

If you encounter issues:
1. Check Supabase documentation: https://supabase.com/docs/guides/auth
2. Verify your app's deep linking configuration matches these URLs
3. Test with a simple reset request to see the exact URL format Supabase generates
