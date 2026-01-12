-- Update Credit Costs to Standard 1-5 Scale (Refined)
-- Reference: NerdX Credit Pricing Model (Finalized v2)

-- 1. Combined Science
UPDATE credit_costs SET cost = 1 WHERE action_key = 'combined_science_topical';
UPDATE credit_costs SET cost = 3 WHERE action_key = 'combined_science_exam';

-- 2. Mathematics
UPDATE credit_costs SET cost = 1 WHERE action_key = 'math_topical';
UPDATE credit_costs SET cost = 3 WHERE action_key = 'math_exam';
UPDATE credit_costs SET cost = 3 WHERE action_key = 'math_graph_practice';

-- 3. English
UPDATE credit_costs SET cost = 1 WHERE action_key = 'english_topical';
UPDATE credit_costs SET cost = 3 WHERE action_key = 'english_comprehension';
UPDATE credit_costs SET cost = 4 WHERE action_key = 'english_essay_writing';

-- 4. Audio/Voice (Time based & Scaled)
UPDATE credit_costs SET cost = 0 WHERE action_key = 'audio_feature';
UPDATE credit_costs SET cost = 3 WHERE action_key = 'voice_chat'; -- 3 credits per minute

-- 5. AI Teacher & Project Assistant (Free Follow-ups)
-- Start session costs
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES 
('teacher_mode_start', 3, 'AI Teacher', 'Start Teacher Chat', 'Initial context for AI Teacher', true, NOW(), NOW()),
('project_assistant_start', 3, 'Project Assistant', 'Start Project Chat', 'Initial context for Project Assistant', true, NOW(), NOW())
ON CONFLICT (action_key) DO UPDATE SET cost = EXCLUDED.cost, updated_at = NOW();

-- Follow-up chats (FREE)
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES 
('teacher_mode_followup', 0, 'AI Teacher', 'Teacher Chat', 'Follow-up chat with AI Teacher', true, NOW(), NOW()),
('project_assistant_followup', 0, 'Project Assistant', 'Project Chat', 'Follow-up chat with Project Assistant', true, NOW(), NOW())
ON CONFLICT (action_key) DO UPDATE SET cost = EXCLUDED.cost, updated_at = NOW();

-- 6. Insert Other New Keys (Upsert)
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES 
('flashcard_audio', 3, 'Audio Features', 'Audio Flashcards', 'Credit cost for generating audio flashcards', true, NOW(), NOW()),
('ocr_solve', 3, 'Vision Tools', 'Image Solve', 'Credit cost for AI image analysis', true, NOW(), NOW()),
('image_generation', 3, 'Vision Tools', 'Image Generation', 'Credit cost for generating educational images', true, NOW(), NOW()),
('a_level_biology', 2, 'A-Level', 'A-Level Biology', 'A-Level Biology Questions', true, NOW(), NOW()),
('a_level_chemistry', 2, 'A-Level', 'A-Level Chemistry', 'A-Level Chemistry Questions', true, NOW(), NOW()),
('a_level_physics', 2, 'A-Level', 'A-Level Physics', 'A-Level Physics Questions', true, NOW(), NOW()),
('a_level_math', 2, 'A-Level', 'A-Level Math', 'A-Level Math Questions', true, NOW(), NOW()),
('teacher_mode_pdf', 2, 'AI Teacher', 'PDF Notes', 'Generating PDF notes from teacher chat', true, NOW(), NOW())
ON CONFLICT (action_key) 
DO UPDATE SET 
    cost = EXCLUDED.cost,
    updated_at = NOW();

-- Verification Query
SELECT action_key, cost, category FROM credit_costs ORDER BY cost DESC;
