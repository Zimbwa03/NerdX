-- Add authentication columns to users_registration table
-- Run this in your Supabase SQL Editor

ALTER TABLE users_registration 
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS password_salt TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_registration_email ON users_registration(email);
CREATE INDEX IF NOT EXISTS idx_users_registration_phone ON users_registration(phone_number);

-- Comment to confirm execution
COMMENT ON COLUMN users_registration.password_hash IS 'Stores PBKDF2 password hash';
