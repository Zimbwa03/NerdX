-- ZIMSEC Project Assistant Tables

-- 1. User Projects Table (Enhanced)
CREATE TABLE IF NOT EXISTS user_projects (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    project_title VARCHAR(500),
    subject VARCHAR(100),
    current_stage VARCHAR(50) DEFAULT 'Selection', -- Changed from INTEGER to VARCHAR for clarity
    project_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_completed ON user_projects(completed);

-- 2. Project Chat History Table
CREATE TABLE IF NOT EXISTS project_chat_history (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES user_projects(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_chat_history_project_id ON project_chat_history(project_id);
CREATE INDEX IF NOT EXISTS idx_project_chat_history_timestamp ON project_chat_history(timestamp);

-- Enable RLS
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_chat_history ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow all operations on user_projects" ON user_projects;
CREATE POLICY "Allow all operations on user_projects" ON user_projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on project_chat_history" ON project_chat_history;
CREATE POLICY "Allow all operations on project_chat_history" ON project_chat_history FOR ALL USING (true) WITH CHECK (true);
