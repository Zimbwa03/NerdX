-- =====================================================
-- Add Super Admin: neezykidngoni@gmail.com
-- =====================================================
-- This SQL script adds neezykidngoni@gmail.com as a super admin
-- Run this in your Supabase SQL Editor at: https://supabase.com/dashboard/project/_/sql
--
-- Password: Ngoni2003 (hashed with PBKDF2-SHA256, 100,000 iterations)
-- Role: super_admin
-- =====================================================

-- Use ON CONFLICT to either insert new admin or update existing one
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
    '04b98f750bddcb8c12bf8133514e117293a31531dac09ca1e60b66fec237738e',
    '98f171d29755f2048ceb66ee935f460eb78e473f3c8693fcba5c4866916bc096',
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
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = CURRENT_TIMESTAMP;

-- Verify the admin was created/updated
SELECT 
    id,
    email,
    first_name || ' ' || last_name AS full_name,
    role,
    is_active,
    created_at,
    last_login
FROM admin_users
WHERE email = 'neezykidngoni@gmail.com';

-- List all admin users for verification
SELECT 
    id,
    email,
    first_name || ' ' || last_name AS full_name,
    role,
    is_active,
    created_at
FROM admin_users
ORDER BY created_at;
