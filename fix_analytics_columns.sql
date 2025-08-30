-- Fix missing device_info column in user_sessions_analytics table
-- Run this in Supabase SQL Editor

-- Add device_info column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_sessions_analytics' 
        AND column_name = 'device_info'
    ) THEN
        ALTER TABLE user_sessions_analytics 
        ADD COLUMN device_info JSONB;
        
        RAISE NOTICE 'Added device_info column to user_sessions_analytics';
    ELSE
        RAISE NOTICE 'device_info column already exists in user_sessions_analytics';
    END IF;
END $$;

-- Ensure all required columns exist
DO $$ 
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_sessions_analytics' 
        AND column_name = 'questions_attempted'
    ) THEN
        ALTER TABLE user_sessions_analytics 
        ADD COLUMN questions_attempted INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_sessions_analytics' 
        AND column_name = 'questions_correct'
    ) THEN
        ALTER TABLE user_sessions_analytics 
        ADD COLUMN questions_correct INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_sessions_analytics' 
        AND column_name = 'credits_used'
    ) THEN
        ALTER TABLE user_sessions_analytics 
        ADD COLUMN credits_used INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_sessions_analytics' 
        AND column_name = 'subjects_touched'
    ) THEN
        ALTER TABLE user_sessions_analytics 
        ADD COLUMN subjects_touched TEXT[];
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_sessions_analytics' 
        AND column_name = 'duration_seconds'
    ) THEN
        ALTER TABLE user_sessions_analytics 
        ADD COLUMN duration_seconds INTEGER;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_sessions_analytics' 
        AND column_name = 'end_time'
    ) THEN
        ALTER TABLE user_sessions_analytics 
        ADD COLUMN end_time TIMESTAMP;
    END IF;
    
    RAISE NOTICE 'Analytics table columns verified and updated';
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_sessions_analytics_user_id ON user_sessions_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_analytics_session_id ON user_sessions_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_analytics_start_time ON user_sessions_analytics(start_time);

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_sessions_analytics' 
ORDER BY ordinal_position;
