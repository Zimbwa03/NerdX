-- Option B Credit System Migration
-- New Structure: Commands (1 credit = 2 commands), AI (1 credit), Complex (2 credits)
-- Student-friendly: Encourages learning, not spending on navigation

-- ============================================
-- COMMANDS: Bundled System (1 Credit = 2 Commands)
-- ============================================
-- Note: These are tracked via command_credit_tracker service
-- User pays 1 credit, gets 2 command uses
-- Cost: $0.005 × 2 = $0.010 per credit (sustainable)

-- Commands remain at 1 credit in database (tracked separately)
-- The bundling logic is handled in code via command_credit_tracker

-- ============================================
-- AI-GENERATED CONTENT: 1 Credit Per Use
-- ============================================
-- Reduced from 2 credits to 1 credit - makes learning more affordable

-- Combined Science
UPDATE credit_costs SET cost = 1, updated_at = NOW() 
WHERE action_key IN (
  'combined_science_topical',
  'combined_science_topical_mcq',
  'combined_science_topical_structured',
  'combined_science_exam'
);

-- Mathematics
UPDATE credit_costs SET cost = 1, updated_at = NOW() 
WHERE action_key IN (
  'math_topical',
  'math_exam',
  'math_quiz',
  'math_graph_practice'
);

-- English (Topical)
UPDATE credit_costs SET cost = 1, updated_at = NOW() 
WHERE action_key = 'english_topical';

-- AI Teacher Mode
UPDATE credit_costs SET cost = 1, updated_at = NOW() 
WHERE action_key IN (
  'teacher_mode_start',
  'teacher_mode_followup'
);

-- Project Assistant (Basic)
UPDATE credit_costs SET cost = 1, updated_at = NOW() 
WHERE action_key IN (
  'project_assistant_start',
  'project_assistant_followup'
);

-- Study Tools
UPDATE credit_costs SET cost = 1, updated_at = NOW() 
WHERE action_key IN (
  'flashcard_single',
  'virtual_lab_knowledge_check'
);

-- ============================================
-- COMPLEX FEATURES: 2 Credits Per Use
-- ============================================
-- Reduced from 3 credits to 2 credits

-- English (Complex Features)
UPDATE credit_costs SET cost = 2, updated_at = NOW() 
WHERE action_key IN (
  'english_comprehension',
  'english_essay_writing',
  'english_essay_marking',
  'english_comprehension_grading',
  'english_summary_grading'
);

-- A-Level (All Subjects)
UPDATE credit_costs SET cost = 2, updated_at = NOW() 
WHERE action_key LIKE 'a_level_%';

-- Audio Features
UPDATE credit_costs SET cost = 2, updated_at = NOW() 
WHERE action_key IN (
  'audio_feature',
  'voice_chat'
);

-- Vision/Tools
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('image_solve', 2, 'Mathematics', 'Image Math Solver (OCR)', 'OCR-based math problem solving from images', true),
  ('ocr_solve', 2, 'Vision', 'OCR Solver', 'OCR-based problem solving', true),
  ('image_generation', 2, 'Vision', 'Image Generation', 'AI image generation', true)
ON CONFLICT (action_key) DO UPDATE SET
  cost = EXCLUDED.cost,
  category = EXCLUDED.category,
  component = EXCLUDED.component,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Project Assistant (Advanced)
UPDATE credit_costs SET cost = 2, updated_at = NOW() 
WHERE action_key IN (
  'project_web_search',
  'project_deep_research',
  'project_transcribe',
  'project_image_generation',
  'project_assistant_batch'
);

-- AI Teacher PDF
UPDATE credit_costs SET cost = 2, updated_at = NOW() 
WHERE action_key = 'teacher_mode_pdf';

-- Audio Flashcards
UPDATE credit_costs SET cost = 2, updated_at = NOW() 
WHERE action_key = 'flashcard_audio';

-- ============================================
-- COMMANDS: Add to Database (1 Credit Each)
-- ============================================
-- Note: Bundling (1 credit = 2 commands) is handled in code
-- Database stores individual command costs for tracking

INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('menu_navigation', 1, 'System', 'Navigation', 'Menu navigation (bundled: 1 credit = 2 commands)', true),
  ('help_command', 1, 'System', 'Help', 'Help commands (bundled: 1 credit = 2 commands)', true),
  ('check_balance', 1, 'System', 'Balance', 'Balance check (bundled: 1 credit = 2 commands)', true),
  ('settings_access', 1, 'System', 'Settings', 'Settings access (bundled: 1 credit = 2 commands)', true),
  ('registration_step', 1, 'System', 'Registration', 'Registration steps (bundled: 1 credit = 2 commands)', true)
ON CONFLICT (action_key) DO UPDATE SET
  cost = EXCLUDED.cost,
  category = EXCLUDED.category,
  component = EXCLUDED.component,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify all costs are correct:
-- SELECT action_key, cost, category 
-- FROM credit_costs 
-- WHERE is_active = true 
-- ORDER BY cost, category, action_key;

-- Expected results:
-- Cost = 1: Commands (bundled), AI-generated content (topical, exam, teacher mode, etc.)
-- Cost = 2: Complex features (essays, comprehension, A-Level, audio, images, deep research)
