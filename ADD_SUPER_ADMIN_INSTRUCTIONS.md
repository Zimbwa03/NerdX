# Add Super Admin: neezykidngoni@gmail.com

## Instructions

Since direct database connection from your local machine isn't working, here are three ways to add the super admin:

### Option 1: Run SQL Script in Supabase Dashboard (Recommended - Easiest)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `hvlvwvzliqrlmqjbfgoa`
3. Navigate to **SQL Editor** (in the left sidebar)
4. Click **New query**
5. Open the file `add_super_admin_ngoni_final.sql` from this repository
6. Copy and paste the **entire SQL script** into the SQL Editor
7. Click **Run** (or press Ctrl+Enter) to execute the script
8. Verify the admin was created successfully (you should see the admin in the results)

**✅ This SQL script includes the correct password hash (PBKDF2-SHA256) matching your Python code!**

### Option 2: Use Python Script on Server/Cloud (Best Method)

If you have access to run Python on your server (where the app is deployed):

1. SSH into your server or use your cloud platform's terminal
2. Navigate to your project directory
3. Make sure environment variables are set (DATABASE_URL or SUPABASE_DATABASE_URL)
4. Run:
   ```bash
   python add_super_admin_rest_api.py
   ```
   OR
   ```bash
   python add_super_admin_ngoni.py
   ```

### Option 3: Manual Insert via Supabase Table Editor

1. Go to Supabase Dashboard → Table Editor
2. Find the `admin_users` table
3. Click **Insert** → **Insert row**
4. Fill in:
   - `email`: neezykidngoni@gmail.com
   - `first_name`: Ngonidzashe
   - `last_name`: Zimbwa
   - `role`: super_admin
   - `is_active`: true
   - `password_hash`: (You'll need to generate this using the Python script or use a temporary password first)

**For password_hash**: The password needs to be hashed using PBKDF2 with SHA256. The easiest way is to run the Python script on a machine with internet access, or use the simplified SQL script.

## Login Credentials After Setup

- **Email:** neezykidngoni@gmail.com
- **Password:** Ngoni2003
- **Role:** super_admin

## After Adding the Admin

1. Go to https://nerdx.onrender.com/login
2. Login with the credentials above
3. Once logged in, you can:
   - Navigate to **Admin Users** section
   - Add other admins from the dashboard
   - Manage all admin users

## Troubleshooting

If you're still unable to log in after adding the admin:

1. **Check password hash format**: The password must be hashed using PBKDF2 with SHA256, 100,000 iterations (same as AdminAuthService)
2. **Verify admin is active**: Make sure `is_active = true` in the database
3. **Check email format**: Ensure email is lowercase in the database
4. **Clear browser cache**: Try logging in with a private/incognito window

## Quick Fix: Update Password Hash Using Python

If you need to update the password hash after using the SQL script, run this on a machine with Python and network access:

```python
import hashlib
import secrets

password = "Ngoni2003"
salt = secrets.token_hex(32)
password_hash = hashlib.pbkdf2_hmac('sha256', 
                                   password.encode('utf-8'), 
                                   salt.encode('utf-8'), 
                                   100000).hex()

print(f"Password Hash: {password_hash}")
print(f"Password Salt: {salt}")
```

Then update the database with these values.
