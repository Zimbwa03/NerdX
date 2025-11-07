-- ZIMSEC Project Assistant - User Projects Table
-- Run this script in your Supabase SQL Editor to create the user_projects table

CREATE TABLE IF NOT EXISTS user_projects (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    project_title VARCHAR(500),
    subject VARCHAR(100),
    current_stage INTEGER DEFAULT 1,
    project_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_completed ON user_projects(completed);
CREATE INDEX IF NOT EXISTS idx_user_projects_updated_at ON user_projects(updated_at);
CREATE INDEX IF NOT EXISTS idx_user_projects_user_active ON user_projects(user_id, completed);

-- Enable Row Level Security (RLS)
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust for production as needed)
DROP POLICY IF EXISTS "Allow all operations on user_projects" ON user_projects;
CREATE POLICY "Allow all operations on user_projects" ON user_projects
    FOR ALL USING (true) WITH CHECK (true);

-- Verify table creation
SELECT * FROM user_projects LIMIT 1;
