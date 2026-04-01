-- ============================================================================
-- NerdX AI School Ecosystem v2.0 — Database Migration
-- Neuronet AI Solutions (Pvt) Ltd
-- Safe to run multiple times (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
-- ============================================================================

-- 1) Group Schools (parent network, e.g. Herentals)
CREATE TABLE IF NOT EXISTS group_schools (
  id BIGSERIAL PRIMARY KEY,
  group_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  admin_email TEXT,
  phone TEXT,
  country TEXT DEFAULT 'Zimbabwe',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_schools_group_id ON group_schools(group_id);

-- 2) Extend existing schools table with group linkage
ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS group_id TEXT,
  ADD COLUMN IF NOT EXISTS campus_name TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS unique_login_url TEXT,
  ADD COLUMN IF NOT EXISTS admin_id BIGINT;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'schools_group_id_fkey'
  ) THEN
    ALTER TABLE schools
      ADD CONSTRAINT schools_group_id_fkey
      FOREIGN KEY (group_id) REFERENCES group_schools(group_id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_schools_group_id ON schools(group_id);

-- 3) Academic Years
CREATE TABLE IF NOT EXISTS academic_years (
  id BIGSERIAL PRIMARY KEY,
  sub_school_id TEXT NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
  year_label TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  term_structure JSONB DEFAULT '[]',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sub_school_id, year_label)
);

CREATE INDEX IF NOT EXISTS idx_academic_years_school ON academic_years(sub_school_id);

-- 4) Forms
CREATE TABLE IF NOT EXISTS school_forms (
  id BIGSERIAL PRIMARY KEY,
  sub_school_id TEXT NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
  academic_year_id BIGINT NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  form_number INT NOT NULL CHECK (form_number BETWEEN 1 AND 6),
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sub_school_id, academic_year_id, form_number)
);

CREATE INDEX IF NOT EXISTS idx_school_forms_school ON school_forms(sub_school_id);
CREATE INDEX IF NOT EXISTS idx_school_forms_year ON school_forms(academic_year_id);

-- 5) Classes
CREATE TABLE IF NOT EXISTS school_classes (
  id BIGSERIAL PRIMARY KEY,
  form_id BIGINT NOT NULL REFERENCES school_forms(id) ON DELETE CASCADE,
  sub_school_id TEXT NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  capacity INT DEFAULT 40,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(form_id, class_name)
);

CREATE INDEX IF NOT EXISTS idx_school_classes_form ON school_classes(form_id);
CREATE INDEX IF NOT EXISTS idx_school_classes_school ON school_classes(sub_school_id);

-- 6) Subjects
CREATE TABLE IF NOT EXISTS school_subjects (
  id BIGSERIAL PRIMARY KEY,
  sub_school_id TEXT NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
  form_id BIGINT REFERENCES school_forms(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  zimsec_code TEXT,
  description TEXT,
  is_compulsory BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_school_subjects_school ON school_subjects(sub_school_id);
CREATE INDEX IF NOT EXISTS idx_school_subjects_form ON school_subjects(form_id);

-- 7) Teachers
CREATE TABLE IF NOT EXISTS school_teachers (
  id BIGSERIAL PRIMARY KEY,
  sub_school_id TEXT NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
  login_code TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  national_id TEXT,
  photo_url TEXT,
  specialisation TEXT,
  qualification TEXT,
  bio TEXT,
  password_hash TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sub_school_id, login_code)
);

CREATE INDEX IF NOT EXISTS idx_school_teachers_school ON school_teachers(sub_school_id);
CREATE INDEX IF NOT EXISTS idx_school_teachers_login ON school_teachers(sub_school_id, login_code);

-- 8) Teacher Sessions
CREATE TABLE IF NOT EXISTS teacher_sessions (
  id BIGSERIAL PRIMARY KEY,
  teacher_id BIGINT NOT NULL REFERENCES school_teachers(id) ON DELETE CASCADE,
  sub_school_id TEXT NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teacher_sessions_token ON teacher_sessions(token);
CREATE INDEX IF NOT EXISTS idx_teacher_sessions_teacher ON teacher_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_sessions_expiry ON teacher_sessions(expires_at);

-- 9) Students
CREATE TABLE IF NOT EXISTS school_students (
  id BIGSERIAL PRIMARY KEY,
  sub_school_id TEXT NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
  class_id BIGINT NOT NULL REFERENCES school_classes(id),
  user_id BIGINT REFERENCES users_registration(id),
  student_code TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  home_address TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_email TEXT,
  guardian_relationship TEXT,
  national_id TEXT,
  photo_url TEXT,
  medical_notes TEXT,
  previous_school TEXT,
  enrolled_at DATE DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'transferred', 'graduated')),
  password_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sub_school_id, student_code)
);

CREATE INDEX IF NOT EXISTS idx_school_students_school ON school_students(sub_school_id);
CREATE INDEX IF NOT EXISTS idx_school_students_class ON school_students(class_id);
CREATE INDEX IF NOT EXISTS idx_school_students_code ON school_students(sub_school_id, student_code);

-- 10) Class-Subject-Teacher mapping
CREATE TABLE IF NOT EXISTS class_subjects (
  id BIGSERIAL PRIMARY KEY,
  class_id BIGINT NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE,
  subject_id BIGINT NOT NULL REFERENCES school_subjects(id) ON DELETE CASCADE,
  teacher_id BIGINT REFERENCES school_teachers(id) ON DELETE SET NULL,
  academic_year_id BIGINT REFERENCES academic_years(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_class_subjects_class ON class_subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_class_subjects_subject ON class_subjects(subject_id);
CREATE INDEX IF NOT EXISTS idx_class_subjects_teacher ON class_subjects(teacher_id);

-- 11) AI Classrooms
CREATE TABLE IF NOT EXISTS ai_classrooms (
  id BIGSERIAL PRIMARY KEY,
  class_subject_id BIGINT NOT NULL REFERENCES class_subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(class_subject_id)
);

CREATE INDEX IF NOT EXISTS idx_ai_classrooms_cs ON ai_classrooms(class_subject_id);

-- 12) Classroom Posts
CREATE TABLE IF NOT EXISTS classroom_posts (
  id BIGSERIAL PRIMARY KEY,
  classroom_id BIGINT NOT NULL REFERENCES ai_classrooms(id) ON DELETE CASCADE,
  teacher_id BIGINT NOT NULL REFERENCES school_teachers(id),
  post_type TEXT NOT NULL CHECK (post_type IN ('announcement', 'homework', 'assignment', 'test', 'material', 'resource')),
  title TEXT NOT NULL,
  content TEXT,
  attachments JSONB DEFAULT '[]',
  due_date TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT true,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classroom_posts_classroom ON classroom_posts(classroom_id);
CREATE INDEX IF NOT EXISTS idx_classroom_posts_teacher ON classroom_posts(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classroom_posts_type ON classroom_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_classroom_posts_created ON classroom_posts(created_at DESC);

-- 13) Assessments
CREATE TABLE IF NOT EXISTS assessments (
  id BIGSERIAL PRIMARY KEY,
  classroom_id BIGINT NOT NULL REFERENCES ai_classrooms(id) ON DELETE CASCADE,
  teacher_id BIGINT NOT NULL REFERENCES school_teachers(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'essay', 'saq', 'mixed', 'upload')),
  instructions TEXT,
  ai_marking_enabled BOOLEAN DEFAULT true,
  time_limit_mins INT,
  total_marks NUMERIC,
  due_date TIMESTAMPTZ,
  release_date TIMESTAMPTZ,
  is_released BOOLEAN DEFAULT false,
  results_released BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_classroom ON assessments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_assessments_teacher ON assessments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assessments_released ON assessments(is_released);

-- 14) Assessment Questions
CREATE TABLE IF NOT EXISTS assessment_questions (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'essay', 'saq', 'true_false')),
  options_json JSONB,
  correct_answer TEXT,
  marks NUMERIC NOT NULL DEFAULT 1,
  topic_tag TEXT,
  explanation TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(assessment_id, question_number)
);

CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment ON assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_topic ON assessment_questions(topic_tag);

-- 15) Student Submissions
CREATE TABLE IF NOT EXISTS student_submissions (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES school_students(id) ON DELETE CASCADE,
  answers_json JSONB,
  attachments JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('in_progress', 'submitted', 'ai_marked', 'teacher_reviewed', 'returned')),
  ai_score NUMERIC,
  ai_total NUMERIC,
  ai_feedback_json JSONB,
  teacher_reviewed BOOLEAN DEFAULT false,
  teacher_score NUMERIC,
  teacher_feedback TEXT,
  final_score NUMERIC,
  final_total NUMERIC,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(assessment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_student_submissions_assessment ON student_submissions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_student_submissions_student ON student_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_student_submissions_status ON student_submissions(status);

-- 16) Student Performance
CREATE TABLE IF NOT EXISTS student_performance (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES school_students(id) ON DELETE CASCADE,
  subject_id BIGINT NOT NULL REFERENCES school_subjects(id) ON DELETE CASCADE,
  topic_tag TEXT NOT NULL,
  accuracy_pct NUMERIC(5,2) DEFAULT 0,
  total_attempts INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  weak_areas_json JSONB DEFAULT '[]',
  improvement_trend TEXT DEFAULT 'new' CHECK (improvement_trend IN ('improving', 'declining', 'stagnant', 'new')),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subject_id, topic_tag)
);

CREATE INDEX IF NOT EXISTS idx_student_performance_student ON student_performance(student_id);
CREATE INDEX IF NOT EXISTS idx_student_performance_subject ON student_performance(subject_id);
CREATE INDEX IF NOT EXISTS idx_student_performance_topic ON student_performance(topic_tag);

-- 17) Teacher Uploads
CREATE TABLE IF NOT EXISTS teacher_uploads (
  id BIGSERIAL PRIMARY KEY,
  classroom_id BIGINT NOT NULL REFERENCES ai_classrooms(id) ON DELETE CASCADE,
  teacher_id BIGINT NOT NULL REFERENCES school_teachers(id),
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teacher_uploads_classroom ON teacher_uploads(classroom_id);
CREATE INDEX IF NOT EXISTS idx_teacher_uploads_teacher ON teacher_uploads(teacher_id);
