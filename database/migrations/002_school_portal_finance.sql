-- School Portal + Finance migration
-- Safe to run multiple times.

-- 1) Extend schools table
ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS bank_name TEXT,
  ADD COLUMN IF NOT EXISTS bank_account_number TEXT,
  ADD COLUMN IF NOT EXISTS bank_branch TEXT;

-- Backfill slug where missing so NOT NULL/UNIQUE can be enforced.
UPDATE schools
SET slug = LOWER(
  REGEXP_REPLACE(
    COALESCE(name, 'school') || '_' || COALESCE(school_id, id::text),
    '[^a-zA-Z0-9]+',
    '_',
    'g'
  )
)
WHERE slug IS NULL OR slug = '';

ALTER TABLE schools
  ALTER COLUMN slug SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'schools_slug_key'
  ) THEN
    ALTER TABLE schools
      ADD CONSTRAINT schools_slug_key UNIQUE (slug);
  END IF;
END $$;

-- 2) School payments
CREATE TABLE IF NOT EXISTS school_payments (
  id BIGSERIAL PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  num_students INT NOT NULL DEFAULT 0 CHECK (num_students >= 0),
  period_start DATE,
  period_end DATE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('ecocash', 'bank_transfer')),
  paynow_reference TEXT,
  paynow_poll_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'verified', 'failed', 'rejected')),
  receipt_url TEXT,
  notes TEXT,
  admin_notes TEXT,
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_payments_school_id
  ON school_payments(school_id);
CREATE INDEX IF NOT EXISTS idx_school_payments_status
  ON school_payments(status);
CREATE INDEX IF NOT EXISTS idx_school_payments_created_at
  ON school_payments(created_at DESC);

-- 3) Daily student activity
CREATE TABLE IF NOT EXISTS school_student_activity (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES users_registration(id) ON DELETE CASCADE,
  school_id TEXT NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  sessions_count INT NOT NULL DEFAULT 0 CHECK (sessions_count >= 0),
  questions_answered INT NOT NULL DEFAULT 0 CHECK (questions_answered >= 0),
  credits_used INT NOT NULL DEFAULT 0 CHECK (credits_used >= 0),
  time_spent_minutes INT NOT NULL DEFAULT 0 CHECK (time_spent_minutes >= 0),
  subjects_accessed TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, school_id, date)
);

CREATE INDEX IF NOT EXISTS idx_school_student_activity_school_date
  ON school_student_activity(school_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_school_student_activity_student_date
  ON school_student_activity(student_id, date DESC);

-- 4) School sessions
CREATE TABLE IF NOT EXISTS school_sessions (
  id BIGSERIAL PRIMARY KEY,
  school_id TEXT NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_sessions_school_id
  ON school_sessions(school_id);
CREATE INDEX IF NOT EXISTS idx_school_sessions_expires_at
  ON school_sessions(expires_at);

