-- ============================================================================
-- NerdX MAIC (Multi-Agent Interactive Classroom) — Phase 1
-- Neuronet AI Solutions (Pvt) Ltd
-- student_id = NerdX users_registration.id (BIGINT), same as Flask JWT user_id
-- ============================================================================

CREATE TABLE IF NOT EXISTS maic_classroom_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id BIGINT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  form_level TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'intro',
  concepts_done INTEGER NOT NULL DEFAULT 0,
  lesson_outline JSONB,
  rag_context_stub TEXT,
  summary_text TEXT,
  credits_used INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes_url TEXT,
  quiz_snapshot JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_maic_sessions_student ON maic_classroom_sessions (student_id);
CREATE INDEX IF NOT EXISTS idx_maic_sessions_student_started ON maic_classroom_sessions (student_id, started_at DESC);

CREATE TABLE IF NOT EXISTS maic_classroom_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES maic_classroom_sessions (id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('teacher', 'classmate', 'student')),
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'whiteboard', 'quiz')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_maic_messages_session ON maic_classroom_messages (session_id, created_at);

CREATE TABLE IF NOT EXISTS maic_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES maic_classroom_sessions (id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL,
  questions JSONB NOT NULL,
  answers JSONB NOT NULL,
  score NUMERIC(6, 2),
  feedback TEXT,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_maic_quiz_session ON maic_quiz_attempts (session_id);
CREATE INDEX IF NOT EXISTS idx_maic_quiz_student ON maic_quiz_attempts (student_id);

CREATE TABLE IF NOT EXISTS maic_student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id BIGINT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  form_level TEXT NOT NULL,
  sessions_count INTEGER NOT NULL DEFAULT 1,
  avg_quiz_score NUMERIC(6, 2),
  last_studied TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  mastery_level TEXT NOT NULL DEFAULT 'beginner',
  UNIQUE (student_id, subject, topic, form_level)
);

CREATE INDEX IF NOT EXISTS idx_maic_progress_student ON maic_student_progress (student_id);

COMMENT ON TABLE maic_classroom_sessions IS 'MAIC AI classroom lesson sessions (ZIMSEC-oriented multi-agent flow)';
COMMENT ON TABLE maic_classroom_messages IS 'Ordered messages within a MAIC session';
COMMENT ON TABLE maic_quiz_attempts IS 'Quiz submissions and AI feedback for MAIC';
COMMENT ON TABLE maic_student_progress IS 'Per-topic aggregate progress for MAIC';
