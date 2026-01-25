-- WhatsApp Intelligent Credit System Migration
-- Updates all credit costs to new 1-3 credit scale
-- Replaces old 0.1/0.2 credit system

-- ============================================
-- TIER 1: Simple Commands (1 Credit)
-- ============================================
-- Base cost for all WhatsApp messages (covers Twilio $0.005 per message)

INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('menu_navigation', 1, 'System', 'Navigation', 'Menu navigation commands', true),
  ('help_command', 1, 'System', 'Help', 'Help and information commands', true),
  ('check_balance', 1, 'System', 'Balance', 'Credit balance check', true),
  ('settings_access', 1, 'System', 'Settings', 'Settings and profile access', true),
  ('registration_step', 1, 'System', 'Registration', 'Registration flow steps', true)
ON CONFLICT (action_key) DO UPDATE SET
  cost = EXCLUDED.cost,
  category = EXCLUDED.category,
  component = EXCLUDED.component,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ============================================
-- TIER 2: AI-Generated Content (2 Credits)
-- ============================================
-- Moderate AI usage: Twilio ($0.005) + AI API (~$0.001-0.003)

-- Combined Science
UPDATE credit_costs SET cost = 2, updated_at = NOW() 
WHERE action_key IN (
  'combined_science_topical',
  'combined_science_topical_mcq',
  'combined_science_topical_structured',
  'combined_science_exam'
);

-- Mathematics
UPDATE credit_costs SET cost = 2, updated_at = NOW() 
WHERE action_key IN (
  'math_topical',
  'math_exam',
  'math_quiz',
  'math_graph_practice'
);

-- English (Topical only - Tier 2)
UPDATE credit_costs SET cost = 2, updated_at = NOW() 
WHERE action_key = 'english_topical';

-- AI Teacher Mode
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('teacher_mode_start', 2, 'AI Teacher', 'Start Session', 'Starting new teaching session', true),
  ('teacher_mode_followup', 2, 'AI Teacher', 'Follow-up Response', 'Follow-up questions in active session', true)
ON CONFLICT (action_key) DO UPDATE SET
  cost = EXCLUDED.cost,
  category = EXCLUDED.category,
  component = EXCLUDED.component,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Project Assistant (Basic)
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('project_assistant_start', 2, 'Project Assistant', 'Start Session', 'Starting new project assistance session', true),
  ('project_assistant_followup', 2, 'Project Assistant', 'Follow-up Response', 'Continued conversation in project session', true)
ON CONFLICT (action_key) DO UPDATE SET
  cost = EXCLUDED.cost,
  category = EXCLUDED.category,
  component = EXCLUDED.component,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Study Tools
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('flashcard_single', 2, 'Study Tools', 'Flashcard Generation', 'Single flashcard generation', true),
  ('virtual_lab_knowledge_check', 2, 'Virtual Lab', 'Knowledge Check', 'Virtual lab knowledge check questions', true)
ON CONFLICT (action_key) DO UPDATE SET
  cost = EXCLUDED.cost,
  category = EXCLUDED.category,
  component = EXCLUDED.component,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ============================================
-- TIER 3: Complex AI Features (3 Credits)
-- ============================================
-- High AI usage: Twilio ($0.005) + High AI API (~$0.003-0.015)

-- English (Complex Features)
UPDATE credit_costs SET cost = 3, updated_at = NOW() 
WHERE action_key IN (
  'english_comprehension',
  'english_essay_writing',
  'english_essay_marking',
  'english_comprehension_grading',
  'english_summary_grading'
);

-- Image Processing
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('image_solve', 3, 'Mathematics', 'Image Math Solver (OCR)', 'OCR-based math problem solving from images', true),
  ('ocr_solve', 3, 'Vision', 'OCR Solver', 'OCR-based problem solving', true),
  ('image_generation', 3, 'Vision', 'Image Generation', 'AI image generation', true)
ON CONFLICT (action_key) DO UPDATE SET
  cost = EXCLUDED.cost,
  category = EXCLUDED.category,
  component = EXCLUDED.component,
  description = EXCLUDED.description,
  updated_at = NOW();

-- A-Level (All Subjects - All are Tier 3 due to complexity)
UPDATE credit_costs SET cost = 3, updated_at = NOW() 
WHERE action_key LIKE 'a_level_%';

-- Audio Features
UPDATE credit_costs SET cost = 3, updated_at = NOW() 
WHERE action_key IN (
  'audio_feature',
  'voice_chat'
);

-- Project Assistant (Advanced Features)
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('project_web_search', 3, 'Project Assistant', 'Web Search', 'Google grounding search for project research', true),
  ('project_deep_research', 3, 'Project Assistant', 'Deep Research', 'Advanced deep research feature', true),
  ('project_transcribe', 3, 'Project Assistant', 'Audio Transcription', 'Transcribing audio for projects', true),
  ('project_image_generation', 3, 'Project Assistant', 'Image Generation', 'Generating images for projects', true),
  ('project_assistant_batch', 3, 'Project Assistant', 'Batch Processing', 'Batch project processing', true)
ON CONFLICT (action_key) DO UPDATE SET
  cost = EXCLUDED.cost,
  category = EXCLUDED.category,
  component = EXCLUDED.component,
  description = EXCLUDED.description,
  updated_at = NOW();

-- AI Teacher PDF Generation
INSERT INTO credit_costs (action_key, cost, category, component, description, is_active)
VALUES 
  ('teacher_mode_pdf', 3, 'AI Teacher', 'PDF Notes Generation', 'Generating PDF study notes from session', true)
ON CONFLICT (action_key) DO UPDATE SET
  cost = EXCLUDED.cost,
  category = EXCLUDED.category,
  component = EXCLUDED.component,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify all costs are in 1-3 range:
-- SELECT action_key, cost, category 
-- FROM credit_costs 
-- WHERE is_active = true 
-- ORDER BY cost, category, action_key;

-- Expected results:
-- Cost = 1: System commands (menu, help, balance, settings)
-- Cost = 2: Topical questions, exam questions, teacher mode, project assistant basic
-- Cost = 3: Complex features (essays, comprehension, A-Level, audio, images, deep research)
