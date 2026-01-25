-- Migration: Update Mobile App Credit Costs to Match Frontend
-- This script updates all credit costs in the Supabase credit_costs table
-- to match the frontend mobile app specifications
-- Note: 1 credit = 10 units, fractional credits are converted to units

-- ============================================
-- QUIZ QUESTIONS (TOPICAL)
-- ============================================

-- Mathematics (O-Level)
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'math_topical';
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'math_exam';
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'math_quiz';

-- Combined Science (O-Level)
UPDATE credit_costs SET cost = 3, description = '0.25 credit per MCQ', updated_at = NOW() WHERE action_key = 'combined_science_topical';
UPDATE credit_costs SET cost = 3, description = '0.25 credit per MCQ', updated_at = NOW() WHERE action_key = 'combined_science_topical_mcq';
UPDATE credit_costs SET cost = 5, description = '0.5 credit per structured question', updated_at = NOW() WHERE action_key = 'combined_science_topical_structured';
UPDATE credit_costs SET cost = 5, description = '0.5 credit per exam question', updated_at = NOW() WHERE action_key = 'combined_science_exam';

-- English
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'english_topical';
UPDATE credit_costs SET cost = 20, description = '2 credits per comprehension', updated_at = NOW() WHERE action_key = 'english_comprehension';
UPDATE credit_costs SET cost = 20, description = '2 credits per essay marking', updated_at = NOW() WHERE action_key = 'english_essay_marking';
UPDATE credit_costs SET cost = 10, description = '1 credit per comprehension grading', updated_at = NOW() WHERE action_key = 'english_comprehension_grading';
UPDATE credit_costs SET cost = 10, description = '1 credit per summary grading', updated_at = NOW() WHERE action_key = 'english_summary_grading';

-- A-Level Pure Math
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'a_level_pure_math_topical';
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES ('a_level_pure_math_topical_mcq', 5, 'A-Level', 'Pure Math Topical MCQ', '0.5 credit per MCQ', true, NOW(), NOW())
ON CONFLICT (action_key) DO UPDATE SET cost = 5, description = '0.5 credit per MCQ', updated_at = NOW();
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES ('a_level_pure_math_topical_structured', 5, 'A-Level', 'Pure Math Topical Structured', '0.5 credit per structured question', true, NOW(), NOW())
ON CONFLICT (action_key) DO UPDATE SET cost = 5, description = '0.5 credit per structured question', updated_at = NOW();
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'a_level_pure_math_exam';

-- A-Level Chemistry
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'a_level_chemistry_topical';
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES ('a_level_chemistry_topical_mcq', 5, 'A-Level', 'Chemistry Topical MCQ', '0.5 credit per MCQ', true, NOW(), NOW())
ON CONFLICT (action_key) DO UPDATE SET cost = 5, description = '0.5 credit per MCQ', updated_at = NOW();
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES ('a_level_chemistry_topical_structured', 5, 'A-Level', 'Chemistry Topical Structured', '0.5 credit per structured question', true, NOW(), NOW())
ON CONFLICT (action_key) DO UPDATE SET cost = 5, description = '0.5 credit per structured question', updated_at = NOW();
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'a_level_chemistry_exam';

-- A-Level Physics
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'a_level_physics_topical';
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES ('a_level_physics_topical_mcq', 5, 'A-Level', 'Physics Topical MCQ', '0.5 credit per MCQ', true, NOW(), NOW())
ON CONFLICT (action_key) DO UPDATE SET cost = 5, description = '0.5 credit per MCQ', updated_at = NOW();
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES ('a_level_physics_topical_structured', 5, 'A-Level', 'Physics Topical Structured', '0.5 credit per structured question', true, NOW(), NOW())
ON CONFLICT (action_key) DO UPDATE SET cost = 5, description = '0.5 credit per structured question', updated_at = NOW();
UPDATE credit_costs SET cost = 5, description = '0.5 credit per question', updated_at = NOW() WHERE action_key = 'a_level_physics_exam';

-- A-Level Biology
UPDATE credit_costs SET cost = 3, description = '0.25 credit per MCQ', updated_at = NOW() WHERE action_key = 'a_level_biology_topical_mcq';
UPDATE credit_costs SET cost = 5, description = '0.5 credit per structured question', updated_at = NOW() WHERE action_key = 'a_level_biology_topical_structured';
UPDATE credit_costs SET cost = 5, description = '0.5 credit per essay', updated_at = NOW() WHERE action_key = 'a_level_biology_topical_essay';
UPDATE credit_costs SET cost = 3, description = '0.25 credit per MCQ', updated_at = NOW() WHERE action_key = 'a_level_biology_exam_mcq';
UPDATE credit_costs SET cost = 5, description = '0.5 credit per structured question', updated_at = NOW() WHERE action_key = 'a_level_biology_exam_structured';
UPDATE credit_costs SET cost = 5, description = '0.5 credit per essay', updated_at = NOW() WHERE action_key = 'a_level_biology_exam_essay';

-- ============================================
-- STUDY TOOLS
-- ============================================

UPDATE credit_costs SET cost = 3, description = '0.25 credit per flashcard', updated_at = NOW() WHERE action_key = 'flashcard_single';
UPDATE credit_costs SET cost = 3, description = '0.25 credit per question', updated_at = NOW() WHERE action_key = 'virtual_lab_knowledge_check';

-- ============================================
-- TEACHER MODE
-- ============================================

UPDATE credit_costs SET cost = 1, description = '0.1 credit per AI response (start)', updated_at = NOW() WHERE action_key = 'teacher_mode_start';
UPDATE credit_costs SET cost = 1, description = '0.1 credit per AI response (follow-up)', updated_at = NOW() WHERE action_key = 'teacher_mode_followup';
UPDATE credit_costs SET cost = 20, description = '2 credits per PDF', updated_at = NOW() WHERE action_key = 'teacher_mode_pdf';

-- ============================================
-- PROJECT ASSISTANT
-- ============================================

UPDATE credit_costs SET cost = 1, description = '0.1 credit per AI response (start)', updated_at = NOW() WHERE action_key = 'project_assistant_start';
UPDATE credit_costs SET cost = 1, description = '0.1 credit per AI response (follow-up)', updated_at = NOW() WHERE action_key = 'project_assistant_followup';
UPDATE credit_costs SET cost = 30, description = '3 credits per image', updated_at = NOW() WHERE action_key = 'project_image_generation';
UPDATE credit_costs SET cost = 20, description = '2 credits per search', updated_at = NOW() WHERE action_key = 'project_web_search';
UPDATE credit_costs SET cost = 20, description = '2 credits per deep research', updated_at = NOW() WHERE action_key = 'project_deep_research';
UPDATE credit_costs SET cost = 1, description = '0.1 credit per transcription', updated_at = NOW() WHERE action_key = 'project_transcribe';

-- ============================================
-- IMAGE & OCR
-- ============================================

UPDATE credit_costs SET cost = 20, description = '2 credits per image solve', updated_at = NOW() WHERE action_key = 'image_solve';
UPDATE credit_costs SET cost = 20, description = '2 credits per OCR solve', updated_at = NOW() WHERE action_key = 'ocr_solve';

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify all updates:
-- SELECT action_key, cost, description FROM credit_costs WHERE updated_at >= NOW() - INTERVAL '1 minute' ORDER BY action_key;
