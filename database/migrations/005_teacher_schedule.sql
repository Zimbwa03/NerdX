-- ============================================================================
-- NerdX Teacher Schedule + Scheme of Work
-- Persistent timetable and weekly planning records for teacher classrooms.
-- ============================================================================

CREATE TABLE IF NOT EXISTS teacher_timetable_entries (
  id BIGSERIAL PRIMARY KEY,
  classroom_id BIGINT NOT NULL REFERENCES ai_classrooms(id) ON DELETE CASCADE,
  teacher_id BIGINT NOT NULL REFERENCES school_teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  weekday INT NOT NULL CHECK (weekday BETWEEN 1 AND 7),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  cadence TEXT NOT NULL DEFAULT 'weekly',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teacher_timetable_classroom ON teacher_timetable_entries(classroom_id);
CREATE INDEX IF NOT EXISTS idx_teacher_timetable_teacher ON teacher_timetable_entries(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_timetable_weekday ON teacher_timetable_entries(weekday);

CREATE TABLE IF NOT EXISTS teacher_scheme_of_work (
  id BIGSERIAL PRIMARY KEY,
  classroom_id BIGINT NOT NULL REFERENCES ai_classrooms(id) ON DELETE CASCADE,
  teacher_id BIGINT NOT NULL REFERENCES school_teachers(id) ON DELETE CASCADE,
  week_label TEXT NOT NULL,
  topic TEXT NOT NULL,
  objectives TEXT,
  activities TEXT,
  homework TEXT,
  due_date DATE,
  ai_notes TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teacher_scheme_classroom ON teacher_scheme_of_work(classroom_id);
CREATE INDEX IF NOT EXISTS idx_teacher_scheme_teacher ON teacher_scheme_of_work(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_scheme_due_date ON teacher_scheme_of_work(due_date);
