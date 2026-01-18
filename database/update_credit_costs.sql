-- Update Credit Costs to Unit System (1 credit = 10 units)
-- Reference: NerdX Credit Pricing Model (Units)

-- 1. Combined Science (O-Level)
UPDATE credit_costs SET cost = 3 WHERE action_key = 'combined_science_topical';
UPDATE credit_costs SET cost = 3 WHERE action_key = 'combined_science_topical_mcq';
UPDATE credit_costs SET cost = 5 WHERE action_key = 'combined_science_topical_structured';
UPDATE credit_costs SET cost = 5 WHERE action_key = 'combined_science_exam';

-- 2. Mathematics (O-Level)
UPDATE credit_costs SET cost = 5 WHERE action_key = 'math_topical';
UPDATE credit_costs SET cost = 5 WHERE action_key = 'math_exam';
UPDATE credit_costs SET cost = 5 WHERE action_key = 'math_quiz';
UPDATE credit_costs SET cost = 10 WHERE action_key = 'math_graph_practice';

-- 3. English
UPDATE credit_costs SET cost = 10 WHERE action_key = 'english_topical';
UPDATE credit_costs SET cost = 30 WHERE action_key = 'english_comprehension';
UPDATE credit_costs SET cost = 30 WHERE action_key = 'english_essay_writing';
UPDATE credit_costs SET cost = 30 WHERE action_key = 'english_essay_marking';
UPDATE credit_costs SET cost = 30 WHERE action_key = 'english_comprehension_grading';
UPDATE credit_costs SET cost = 30 WHERE action_key = 'english_summary_grading';

-- 4. Audio/Voice
UPDATE credit_costs SET cost = 10 WHERE action_key = 'audio_feature';
UPDATE credit_costs SET cost = 1 WHERE action_key = 'voice_chat'; -- 0.1 credit per 5 seconds

-- 5. AI Teacher & Project Assistant (Per-response)
-- Start session costs (per response)
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES 
('teacher_mode_start', 1, 'AI Teacher', 'AI Response', 'Per-response AI Teacher cost', true, NOW(), NOW()),
('project_assistant_start', 2, 'Project Assistant', 'AI Response', 'Per-response Project Assistant cost', true, NOW(), NOW())
ON CONFLICT (action_key) DO UPDATE SET cost = EXCLUDED.cost, updated_at = NOW();

-- Follow-up chats (Per-response)
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES 
('teacher_mode_followup', 1, 'AI Teacher', 'AI Response', 'Per-response AI Teacher cost', true, NOW(), NOW()),
('project_assistant_followup', 2, 'Project Assistant', 'AI Response', 'Per-response Project Assistant cost', true, NOW(), NOW())
ON CONFLICT (action_key) DO UPDATE SET cost = EXCLUDED.cost, updated_at = NOW();

-- 6. Insert Other New Keys (Upsert)
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES 
('flashcard_single', 3, 'Study Tools', 'Flashcards', '0.25 credit per flashcard (rounded up)', true, NOW(), NOW()),
('flashcard_audio', 30, 'Audio Features', 'Audio Flashcards', '3 credits per audio flashcards', true, NOW(), NOW()),
('ocr_solve', 30, 'Vision Tools', 'Image Solve', '3 credits for AI image analysis', true, NOW(), NOW()),
('image_generation', 30, 'Vision Tools', 'Image Generation', '3 credits for image generation', true, NOW(), NOW()),
('project_image_generation', 20, 'Project Assistant', 'Image Generation', '2 credits per image', true, NOW(), NOW()),
('project_web_search', 20, 'Project Assistant', 'Web Search', '2 credits per search', true, NOW(), NOW()),
('project_deep_research', 50, 'Project Assistant', 'Deep Research', '5 credits per deep research', true, NOW(), NOW()),
('project_transcribe', 20, 'Project Assistant', 'Audio Transcription', '2 credits per transcription', true, NOW(), NOW()),
('virtual_lab_knowledge_check', 5, 'Virtual Lab', 'Knowledge Check', '0.5 credit per question', true, NOW(), NOW()),
('teacher_mode_pdf', 10, 'AI Teacher', 'PDF Notes', '1 credit per PDF', true, NOW(), NOW()),
('a_level_pure_math_topical', 5, 'A-Level', 'Pure Math Topical', '0.5 credit per question', true, NOW(), NOW()),
('a_level_pure_math_exam', 5, 'A-Level', 'Pure Math Exam', '0.5 credit per question', true, NOW(), NOW()),
('a_level_chemistry_topical', 5, 'A-Level', 'Chemistry Topical', '0.5 credit per question', true, NOW(), NOW()),
('a_level_chemistry_exam', 5, 'A-Level', 'Chemistry Exam', '0.5 credit per question', true, NOW(), NOW()),
('a_level_physics_topical', 5, 'A-Level', 'Physics Topical', '0.5 credit per question', true, NOW(), NOW()),
('a_level_physics_exam', 5, 'A-Level', 'Physics Exam', '0.5 credit per question', true, NOW(), NOW()),
('a_level_biology_topical_mcq', 3, 'A-Level', 'Biology Topical MCQ', '0.25 credit per MCQ (rounded up)', true, NOW(), NOW()),
('a_level_biology_topical_structured', 5, 'A-Level', 'Biology Topical Structured', '0.5 credit per structured', true, NOW(), NOW()),
('a_level_biology_topical_essay', 5, 'A-Level', 'Biology Topical Essay', '0.5 credit per essay', true, NOW(), NOW()),
('a_level_biology_exam_mcq', 3, 'A-Level', 'Biology Exam MCQ', '0.25 credit per MCQ (rounded up)', true, NOW(), NOW()),
('a_level_biology_exam_structured', 5, 'A-Level', 'Biology Exam Structured', '0.5 credit per structured', true, NOW(), NOW()),
('a_level_biology_exam_essay', 5, 'A-Level', 'Biology Exam Essay', '0.5 credit per essay', true, NOW(), NOW())
ON CONFLICT (action_key) 
DO UPDATE SET 
    cost = EXCLUDED.cost,
    updated_at = NOW();

-- Verification Query
SELECT action_key, cost, category FROM credit_costs ORDER BY cost DESC;
