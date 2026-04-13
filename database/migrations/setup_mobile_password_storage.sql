-- =====================================================
-- Mobile App Password Storage Setup
-- =====================================================
-- Run this SQL script in your Supabase SQL Editor
-- This extends the users_registration table to support mobile authentication

-- Option 1: Extend existing users_registration table (Recommended)
-- Add password and authentication fields
ALTER TABLE users_registration 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_salt VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_registration_email ON users_registration(email);
CREATE INDEX IF NOT EXISTS idx_users_registration_phone ON users_registration(phone_number);

-- =====================================================
-- Alternative Option 2: Create separate mobile_users table
-- =====================================================
-- Uncomment below if you prefer a separate table approach

/*
CREATE TABLE IF NOT EXISTS mobile_users (
    id SERIAL PRIMARY KEY,
    user_identifier VARCHAR(255) UNIQUE NOT NULL,  -- email or phone
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255) NOT NULL,
    user_chat_id VARCHAR(255) REFERENCES users_registration(chat_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mobile_users_identifier ON mobile_users(user_identifier);
CREATE INDEX IF NOT EXISTS idx_mobile_users_chat_id ON mobile_users(user_chat_id);
*/

-- =====================================================
-- Verification
-- =====================================================
-- Run this to verify the columns were added:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'users_registration' 
-- AND column_name IN ('password_hash', 'password_salt', 'email', 'phone_number');

