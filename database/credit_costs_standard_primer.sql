-- Credit Costs Standard Primer Migration
-- Aligns Supabase credit_costs with FEATURE_CREDITS_TABLE.md (1 credit = 10 units).
-- Run via Supabase MCP execute_sql or Dashboard SQL editor.

-- Commands (unchanged: 10 units = 1 credit per bundle)
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'menu_navigation';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'help_command';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'check_balance';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'settings_access';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'registration_step';

-- O-Level Combined Science – 0.5 credit each (5 units)
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'combined_science_topical';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'combined_science_topical_mcq';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'combined_science_topical_structured';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'combined_science_exam';

-- O-Level Computer Science – 3, 5, 10
UPDATE credit_costs SET cost = 3, updated_at = NOW() WHERE action_key = 'computer_science_topical_mcq';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'computer_science_topical_structured';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'computer_science_topical_essay';
UPDATE credit_costs SET cost = 3, updated_at = NOW() WHERE action_key = 'computer_science_exam_mcq';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'computer_science_exam_structured';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'computer_science_exam_essay';

-- O-Level Mathematics – 0.5 credit each (5 units)
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'math_topical';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'math_exam';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'math_graph_practice';

-- O-Level English basic – 0.5 credit (5 units)
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'english_topical';

-- English complex – 2 credits each (20 units)
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'english_comprehension';
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'english_essay_writing';
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'english_essay_marking';
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'english_comprehension_grading';
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'english_summary_grading';

-- AI Teacher Mode – 0.1 credit (1 unit)
UPDATE credit_costs SET cost = 1, updated_at = NOW() WHERE action_key = 'teacher_mode_start';
UPDATE credit_costs SET cost = 1, updated_at = NOW() WHERE action_key = 'teacher_mode_followup';

-- Project Assistant basic – 0.2 credit (2 units)
UPDATE credit_costs SET cost = 2, updated_at = NOW() WHERE action_key = 'project_assistant_start';
UPDATE credit_costs SET cost = 2, updated_at = NOW() WHERE action_key = 'project_assistant_followup';

-- Study tools & virtual lab – 0.3 / 0.1 credit
UPDATE credit_costs SET cost = 3, updated_at = NOW() WHERE action_key = 'flashcard_single';
UPDATE credit_costs SET cost = 3, updated_at = NOW() WHERE action_key = 'virtual_lab_knowledge_check';
UPDATE credit_costs SET cost = 1, updated_at = NOW() WHERE action_key = 'geo_maps_feedback';

-- Vision/tools – 1 credit each (10 units)
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'ocr_solve';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'image_solve';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'image_generation';

-- Audio & voice – 2 credits (20 units)
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'audio_feature';
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'voice_chat';

-- AI Teacher PDF, flashcard_audio – 2 credits (20 units)
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'teacher_mode_pdf';
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'flashcard_audio';

-- Project Assistant advanced – transcribe 1 credit (10), rest 2 credits (20)
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'project_transcribe';
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'project_image_generation';
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'project_web_search';
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'project_deep_research';
UPDATE credit_costs SET cost = 20, updated_at = NOW() WHERE action_key = 'project_assistant_batch';

-- A-Level Pure Math, Chemistry, Physics – 0.5 credit each (5 units)
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_pure_math_topical';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_pure_math_topical_mcq';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_pure_math_topical_structured';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_pure_math_exam';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_chemistry_topical';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_chemistry_topical_mcq';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_chemistry_topical_structured';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_chemistry_exam';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_physics_topical';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_physics_topical_mcq';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_physics_topical_structured';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_physics_exam';

-- A-Level Biology – MCQ/structured 5, essay 10
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_biology_topical_mcq';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_biology_topical_structured';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'a_level_biology_topical_essay';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_biology_exam_mcq';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_biology_exam_structured';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'a_level_biology_exam_essay';

-- A-Level Computer Science – 3, 5, 10 (no change if already set)
UPDATE credit_costs SET cost = 3, updated_at = NOW() WHERE action_key = 'a_level_computer_science_topical_mcq';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_computer_science_topical_structured';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'a_level_computer_science_topical_essay';
UPDATE credit_costs SET cost = 3, updated_at = NOW() WHERE action_key = 'a_level_computer_science_exam_mcq';
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_computer_science_exam_structured';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'a_level_computer_science_exam_essay';

-- A-Level Geography – 0.5 / 1 credit
UPDATE credit_costs SET cost = 5, updated_at = NOW() WHERE action_key = 'a_level_geography_topical_essay';
UPDATE credit_costs SET cost = 10, updated_at = NOW() WHERE action_key = 'a_level_geography_exam_essay';

-- Insert missing action keys (if table has unique on action_key, use ON CONFLICT)
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active, created_at, updated_at)
VALUES
  ('math_quiz', 5, 'Mathematics', 'Quiz', '0.5 credit per streaming quiz question', true, NOW(), NOW()),
  ('programming_lab_ai', 1, 'Virtual Lab', 'Programming Lab AI', '0.1 credit per AI request', true, NOW(), NOW())
ON CONFLICT (action_key) DO UPDATE SET cost = EXCLUDED.cost, updated_at = NOW();
