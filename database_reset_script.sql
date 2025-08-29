-- ========================================
-- NERDX BOT DATABASE COMPLETE RESET SCRIPT
-- ========================================
-- This script will completely reset the database to start fresh
-- WARNING: This will DELETE ALL DATA permanently!
-- Run this in your Supabase SQL Editor

-- ========================================
-- STEP 1: DISABLE ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE IF EXISTS users_registration DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS credit_costs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_question_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS registration_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS rate_limits DISABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 2: DROP ALL EXISTING TABLES
-- ========================================
-- Drop tables in reverse dependency order

-- Drop payment-related tables first
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS payments CASCADE;

-- Drop user-related tables
DROP TABLE IF EXISTS users_registration CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_question_history CASCADE;
DROP TABLE IF EXISTS registration_sessions CASCADE;
DROP TABLE IF EXISTS rate_limits CASCADE;

-- Drop package and credit cost tables
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS credit_costs CASCADE;

-- Drop any other tables that might exist
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- ========================================
-- STEP 3: DROP ALL SEQUENCES
-- ========================================
-- Reset all auto-increment sequences
DROP SEQUENCE IF EXISTS users_registration_id_seq CASCADE;
DROP SEQUENCE IF EXISTS payment_transactions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS packages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS credit_costs_id_seq CASCADE;
DROP SEQUENCE IF EXISTS questions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_stats_id_seq CASCADE;

-- ========================================
-- STEP 4: DROP ALL INDEXES
-- ========================================
-- (Indexes are automatically dropped when tables are dropped)

-- ========================================
-- STEP 5: DROP ALL POLICIES
-- ========================================
-- (Policies are automatically dropped when tables are dropped)

-- ========================================
-- STEP 6: CLEAN UP SCHEMA
-- ========================================
-- Remove any orphaned objects
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- ========================================
-- STEP 7: VERIFY CLEAN STATE
-- ========================================
-- Check that all tables are gone
SELECT 
    schemaname,
    tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check that all sequences are gone
SELECT 
    schemaname,
    sequencename 
FROM pg_sequences 
WHERE schemaname = 'public'
ORDER BY sequencename;

-- ========================================
-- STEP 8: RESET DATABASE STATISTICS
-- ========================================
-- Reset PostgreSQL statistics
ANALYZE;

-- ========================================
-- STEP 9: VERIFY RESET COMPLETE
-- ========================================
DO $$
BEGIN
    -- Check if any tables remain
    IF EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
    ) THEN
        RAISE NOTICE 'WARNING: Some tables still exist after reset!';
    ELSE
        RAISE NOTICE 'SUCCESS: Database completely reset - all tables removed!';
    END IF;
    
    -- Check if any sequences remain
    IF EXISTS (
        SELECT 1 FROM pg_sequences 
        WHERE schemaname = 'public'
    ) THEN
        RAISE NOTICE 'WARNING: Some sequences still exist after reset!';
    ELSE
        RAISE NOTICE 'SUCCESS: All sequences removed!';
    END IF;
END $$;

-- ========================================
-- RESET COMPLETE!
-- ========================================
-- Your database is now completely clean and ready for fresh marketing data.
-- All previous users, payments, and data have been permanently removed.
-- 
-- Next steps:
-- 1. Run the table creation scripts to set up fresh structure
-- 2. Configure initial settings and credit costs
-- 3. Start fresh marketing campaign
-- 4. Monitor new user registrations and growth
