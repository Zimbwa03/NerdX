#!/usr/bin/env python3
"""
Generate Password Hash for Super Admin
This script generates the password hash and salt for neezykidngoni@gmail.com
You can use these values to manually insert/update the admin in Supabase
"""

import hashlib
import secrets

# Password for the super admin
password = "Ngoni2003"

# Generate salt
salt = secrets.token_hex(32)

# Hash password using PBKDF2 with SHA256 (same as AdminAuthService)
password_hash = hashlib.pbkdf2_hmac(
    'sha256', 
    password.encode('utf-8'), 
    salt.encode('utf-8'), 
    100000  # 100,000 iterations
).hex()

print("=" * 70)
print("PASSWORD HASH GENERATOR FOR SUPER ADMIN")
print("=" * 70)
print(f"Email: neezykidngoni@gmail.com")
print(f"Password: {password}")
print()
print("Generated Values:")
print(f"Password Hash: {password_hash}")
print(f"Password Salt: {salt}")
print()
print("=" * 70)
print("SQL to insert/update admin:")
print("=" * 70)
print(f"""
-- Update existing admin
UPDATE admin_users
SET 
    password_hash = '{password_hash}',
    password_salt = '{salt}',
    role = 'super_admin',
    is_active = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'neezykidngoni@gmail.com';

-- OR Insert new admin (if not exists)
INSERT INTO admin_users (
    email,
    password_hash,
    password_salt,
    first_name,
    last_name,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    'neezykidngoni@gmail.com',
    '{password_hash}',
    '{salt}',
    'Ngonidzashe',
    'Zimbwa',
    'super_admin',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE
SET 
    password_hash = EXCLUDED.password_hash,
    password_salt = EXCLUDED.password_salt,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = CURRENT_TIMESTAMP;
""")
print("=" * 70)
