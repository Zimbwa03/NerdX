-- Scan & Solve + analytics tables (Supabase / Postgres)
-- Run in Supabase SQL Editor (or migration runner). Test on staging first.
-- Python: services/analytics_tracker.py (feature_usage, subject_usage, scan_solve_runs).

-- ---------------------------------------------------------------------------
-- feature_usage_analytics — aggregates per feature per day (e.g. scan_solve)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feature_usage_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    unique_users INTEGER NOT NULL DEFAULT 0,
    total_time_spent INTEGER NOT NULL DEFAULT 0,
    credits_consumed INTEGER NOT NULL DEFAULT 0,
    success_rate DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (date, feature_name)
);

ALTER TABLE public.feature_usage_analytics ADD COLUMN IF NOT EXISTS total_time_spent INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.feature_usage_analytics ADD COLUMN IF NOT EXISTS credits_consumed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.feature_usage_analytics ADD COLUMN IF NOT EXISTS success_rate DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE public.feature_usage_analytics ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS feature_usage_analytics_date_feature_unique
    ON public.feature_usage_analytics (date, feature_name);

-- ---------------------------------------------------------------------------
-- subject_usage_analytics — subject/topic aggregates (shared with quizzes etc.)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subject_usage_analytics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(150) NOT NULL DEFAULT '',
    difficulty VARCHAR(50) NOT NULL DEFAULT '',
    total_attempts INTEGER NOT NULL DEFAULT 0,
    correct_attempts INTEGER NOT NULL DEFAULT 0,
    total_users INTEGER NOT NULL DEFAULT 0,
    avg_time_per_question DOUBLE PRECISION NOT NULL DEFAULT 0,
    credits_consumed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (date, subject, topic, difficulty)
);

ALTER TABLE public.subject_usage_analytics ADD COLUMN IF NOT EXISTS topic VARCHAR(150) NOT NULL DEFAULT '';
ALTER TABLE public.subject_usage_analytics ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50) NOT NULL DEFAULT '';
ALTER TABLE public.subject_usage_analytics ADD COLUMN IF NOT EXISTS total_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.subject_usage_analytics ADD COLUMN IF NOT EXISTS correct_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.subject_usage_analytics ADD COLUMN IF NOT EXISTS total_users INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.subject_usage_analytics ADD COLUMN IF NOT EXISTS avg_time_per_question DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE public.subject_usage_analytics ADD COLUMN IF NOT EXISTS credits_consumed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.subject_usage_analytics ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS subject_usage_analytics_unique_idx
    ON public.subject_usage_analytics (date, subject, topic, difficulty);

-- ---------------------------------------------------------------------------
-- scan_solve_runs — one row per API solve (cache hit or live Vertex call)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scan_solve_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    subject VARCHAR(100) NOT NULL DEFAULT '',
    difficulty VARCHAR(50) NOT NULL DEFAULT '',
    duration_ms INTEGER NOT NULL DEFAULT 0,
    cache_hit BOOLEAN NOT NULL DEFAULT FALSE,
    solvable BOOLEAN NOT NULL DEFAULT TRUE,
    input_kind VARCHAR(32) NOT NULL DEFAULT 'image',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scan_solve_runs_user_created
    ON public.scan_solve_runs (user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Grants — backend connects with service role / direct credentials
-- ---------------------------------------------------------------------------
GRANT ALL ON TABLE public.feature_usage_analytics TO service_role;
GRANT ALL ON TABLE public.subject_usage_analytics TO service_role;
GRANT ALL ON TABLE public.scan_solve_runs TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ---------------------------------------------------------------------------
-- RLS: deny anon/authenticated direct access; service_role bypasses RLS
-- (Aligns with database/nerdx_supabase_advisor_resume_20260403.sql for analytics tables.)
-- ---------------------------------------------------------------------------
ALTER TABLE public.scan_solve_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS block_anon_authenticated_scan_solve_runs ON public.scan_solve_runs;
CREATE POLICY block_anon_authenticated_scan_solve_runs ON public.scan_solve_runs
    FOR ALL TO anon, authenticated
    USING (false)
    WITH CHECK (false);
