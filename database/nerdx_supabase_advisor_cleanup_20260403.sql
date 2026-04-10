-- NerdX Supabase: advisor cleanup + scale-oriented indexes
-- Run via Supabase migration or SQL editor. Test on staging first.
-- Maps logged-in users to nerdx_id via JWT user_metadata or users.email.

-- 1) Resolve current learner id for RLS (initplan-friendly subqueries in policies)
CREATE OR REPLACE FUNCTION public.current_student_nerdx_id()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    NULLIF(trim(auth.jwt() -> 'user_metadata' ->> 'nerdx_id'), ''),
    (SELECT u.nerdx_id
     FROM public.users u
     WHERE auth.uid() IS NOT NULL
       AND u.email IS NOT NULL
       AND auth.jwt() ->> 'email' IS NOT NULL
       AND lower(trim(u.email)) = lower(trim(auth.jwt() ->> 'email'))
     LIMIT 1)
  );
$$;

CREATE INDEX IF NOT EXISTS idx_users_email_lower
  ON public.users (lower(trim(email)))
  WHERE email IS NOT NULL;

-- 2) Function search_path hardening (security advisor)
ALTER FUNCTION public.check_and_award_badges() SET search_path = public;
ALTER FUNCTION public.check_and_expire_monthly_credits() SET search_path = public;
ALTER FUNCTION public.cleanup_engagement_campaign_log() SET search_path = public;
ALTER FUNCTION public.get_subscription_status(text) SET search_path = public;
ALTER FUNCTION public.increment_participant_count(text) SET search_path = public;
ALTER FUNCTION public.is_admin(text) SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.update_user_stats_after_quiz() SET search_path = public;
ALTER FUNCTION public.deduct_credits_atomic(text, integer, text, text) SET search_path = public;

-- 3) Drop duplicate indexes (performance advisor — keep the more descriptive name)
DROP INDEX IF EXISTS public.idx_credit_transactions_user_id;
DROP INDEX IF EXISTS public.idx_user_date;
DROP INDEX IF EXISTS public.idx_pending_sync;
DROP INDEX IF EXISTS public.idx_pending_payments_transaction_reference;
DROP INDEX IF EXISTS public.idx_session;
DROP INDEX IF EXISTS public.idx_user_timestamp;
DROP INDEX IF EXISTS public.idx_user_skill;
DROP INDEX IF EXISTS public.idx_sync;
DROP INDEX IF EXISTS public.idx_skill_mastery;
DROP INDEX IF EXISTS public.idx_user_reviews;
DROP INDEX IF EXISTS public.idx_user_misconceptions;
DROP INDEX IF EXISTS public.subject_usage_analytics_unique_idx;

-- 4) Foreign-key covering indexes (join / cascade performance at scale)
CREATE INDEX IF NOT EXISTS idx_admin_users_created_by ON public.admin_users (created_by);
CREATE INDEX IF NOT EXISTS idx_app_versions_updated_by ON public.app_versions (updated_by);
CREATE INDEX IF NOT EXISTS idx_attendance_log_slot_id ON public.attendance_log (slot_id);
CREATE INDEX IF NOT EXISTS idx_class_subjects_academic_year_id ON public.class_subjects (academic_year_id);
CREATE INDEX IF NOT EXISTS idx_misconceptions_skill_id ON public.misconceptions (skill_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_by ON public.notifications (created_by);
CREATE INDEX IF NOT EXISTS idx_school_students_user_id ON public.school_students (user_id);
CREATE INDEX IF NOT EXISTS idx_skills_taxonomy_parent_skill_id ON public.skills_taxonomy (parent_skill_id);
CREATE INDEX IF NOT EXISTS idx_student_misconceptions_log_interaction_id ON public.student_misconceptions_log (interaction_id);
CREATE INDEX IF NOT EXISTS idx_student_misconceptions_log_misconception_id ON public.student_misconceptions_log (misconception_id);
CREATE INDEX IF NOT EXISTS idx_teacher_sessions_sub_school_id ON public.teacher_sessions (sub_school_id);

-- 5) Replace permissive "true" policies on dashboard tables
DROP POLICY IF EXISTS "Users can insert own weekly activity" ON public.student_weekly_activity;
DROP POLICY IF EXISTS "Users can read own weekly activity" ON public.student_weekly_activity;
DROP POLICY IF EXISTS "Users can update own weekly activity" ON public.student_weekly_activity;

CREATE POLICY "Users can read own weekly activity" ON public.student_weekly_activity
  FOR SELECT TO anon, authenticated
  USING (user_id = current_student_nerdx_id());

CREATE POLICY "Users can insert own weekly activity" ON public.student_weekly_activity
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id = current_student_nerdx_id());

CREATE POLICY "Users can update own weekly activity" ON public.student_weekly_activity
  FOR UPDATE TO anon, authenticated
  USING (user_id = current_student_nerdx_id())
  WITH CHECK (user_id = current_student_nerdx_id());

DROP POLICY IF EXISTS "Users can insert own level progress" ON public.student_level_progress;
DROP POLICY IF EXISTS "Users can read own level progress" ON public.student_level_progress;
DROP POLICY IF EXISTS "Users can update own level progress" ON public.student_level_progress;

CREATE POLICY "Users can read own level progress" ON public.student_level_progress
  FOR SELECT TO anon, authenticated
  USING (user_id = current_student_nerdx_id());

CREATE POLICY "Users can insert own level progress" ON public.student_level_progress
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id = current_student_nerdx_id());

CREATE POLICY "Users can update own level progress" ON public.student_level_progress
  FOR UPDATE TO anon, authenticated
  USING (user_id = current_student_nerdx_id())
  WITH CHECK (user_id = current_student_nerdx_id());

-- 6) RLS: learner data (nerdx_id column)
ALTER TABLE public.student_knowledge_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.english_essay_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_misconceptions_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_knowledge_state_own" ON public.student_knowledge_state;
CREATE POLICY "student_knowledge_state_own" ON public.student_knowledge_state
  FOR ALL TO anon, authenticated
  USING (user_id = current_student_nerdx_id())
  WITH CHECK (user_id = current_student_nerdx_id());

DROP POLICY IF EXISTS "student_interactions_own" ON public.student_interactions;
CREATE POLICY "student_interactions_own" ON public.student_interactions
  FOR ALL TO anon, authenticated
  USING (user_id = current_student_nerdx_id())
  WITH CHECK (user_id = current_student_nerdx_id());

DROP POLICY IF EXISTS "daily_review_queue_own" ON public.daily_review_queue;
CREATE POLICY "daily_review_queue_own" ON public.daily_review_queue
  FOR ALL TO anon, authenticated
  USING (user_id = current_student_nerdx_id())
  WITH CHECK (user_id = current_student_nerdx_id());

DROP POLICY IF EXISTS "bible_chat_history_own" ON public.bible_chat_history;
CREATE POLICY "bible_chat_history_own" ON public.bible_chat_history
  FOR ALL TO anon, authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR (
      auth.jwt() ->> 'email' IS NOT NULL
      AND lower(trim(coalesce(user_email, ''))) = lower(trim(auth.jwt() ->> 'email'))
    )
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR (
      auth.jwt() ->> 'email' IS NOT NULL
      AND lower(trim(coalesce(user_email, ''))) = lower(trim(auth.jwt() ->> 'email'))
    )
  );

DROP POLICY IF EXISTS "offline_sync_queue_own" ON public.offline_sync_queue;
CREATE POLICY "offline_sync_queue_own" ON public.offline_sync_queue
  FOR ALL TO anon, authenticated
  USING (user_id = current_student_nerdx_id())
  WITH CHECK (user_id = current_student_nerdx_id());

DROP POLICY IF EXISTS "english_essay_submissions_own" ON public.english_essay_submissions;
CREATE POLICY "english_essay_submissions_own" ON public.english_essay_submissions
  FOR ALL TO anon, authenticated
  USING (user_id = current_student_nerdx_id())
  WITH CHECK (user_id = current_student_nerdx_id());

DROP POLICY IF EXISTS "student_misconceptions_log_own" ON public.student_misconceptions_log;
CREATE POLICY "student_misconceptions_log_own" ON public.student_misconceptions_log
  FOR ALL TO anon, authenticated
  USING (user_id = current_student_nerdx_id())
  WITH CHECK (user_id = current_student_nerdx_id());

-- 7) Public read taxonomy / content
ALTER TABLE public.skills_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.misconceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.olevel_maths ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "skills_taxonomy_select_public" ON public.skills_taxonomy;
CREATE POLICY "skills_taxonomy_select_public" ON public.skills_taxonomy
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "misconceptions_select_public" ON public.misconceptions;
CREATE POLICY "misconceptions_select_public" ON public.misconceptions
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "olevel_maths_select_public" ON public.olevel_maths;
CREATE POLICY "olevel_maths_select_public" ON public.olevel_maths
  FOR SELECT TO anon, authenticated
  USING (true);

-- 8) Backend / aggregate / admin — no direct client access (anon + authenticated denied)
ALTER TABLE public.dkt_model_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_solve_runs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.school_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_student_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maic_classroom_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maic_classroom_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maic_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maic_student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_sessions ENABLE ROW LEVEL SECURITY;

-- Deny anon/authenticated (service_role still bypasses RLS in Supabase)
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'dkt_model_metrics','group_schools','schools','academic_years',
    'subject_usage_analytics','broadcast_logs','feature_usage_analytics','scan_solve_runs',
    'school_forms','school_classes','school_subjects','school_teachers',
    'available_slots','school_students','class_subjects','ai_classrooms',
    'school_payments','school_student_activity','school_sessions','classroom_posts',
    'assessments','assessment_questions','maic_classroom_sessions','maic_classroom_messages',
    'maic_quiz_attempts','student_submissions','student_performance','teacher_uploads',
    'maic_student_progress','teacher_sessions'
  ]
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.%I',
      'block_anon_authenticated_' || t, t
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
      'block_anon_authenticated_' || t, t
    );
  END LOOP;
END $$;

-- 8b) users: allow SELECT for own row (email match) so current_student_nerdx_id() works; block writes from clients
DROP POLICY IF EXISTS block_anon_authenticated_users ON public.users;
DROP POLICY IF EXISTS users_select_own_by_jwt_email ON public.users;
DROP POLICY IF EXISTS users_deny_insert ON public.users;
DROP POLICY IF EXISTS users_deny_update ON public.users;
DROP POLICY IF EXISTS users_deny_delete ON public.users;

CREATE POLICY users_select_own_by_jwt_email ON public.users
  FOR SELECT TO anon, authenticated
  USING (
    auth.jwt() ->> 'email' IS NOT NULL
    AND email IS NOT NULL
    AND lower(trim(email)) = lower(trim(auth.jwt() ->> 'email'))
  );

CREATE POLICY users_deny_insert ON public.users
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY users_deny_update ON public.users
  FOR UPDATE TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY users_deny_delete ON public.users
  FOR DELETE TO anon, authenticated
  USING (false);

-- 9) Lock down user_projects (was USING true — breaks project_* owner checks)
DROP POLICY IF EXISTS "Allow all operations on user_projects" ON public.user_projects;
DROP POLICY IF EXISTS "user_projects_own" ON public.user_projects;
CREATE POLICY "user_projects_own" ON public.user_projects
  FOR ALL TO anon, authenticated
  USING (user_id = current_student_nerdx_id())
  WITH CHECK (user_id = current_student_nerdx_id());

-- 10) Tables that had RLS on but zero policies — learner-scoped where applicable
DROP POLICY IF EXISTS "engagement_campaign_log_own" ON public.engagement_campaign_log;
CREATE POLICY "engagement_campaign_log_own" ON public.engagement_campaign_log
  FOR ALL TO anon, authenticated
  USING (user_id = current_student_nerdx_id())
  WITH CHECK (user_id = current_student_nerdx_id());

DROP POLICY IF EXISTS "mobile_push_tokens_own" ON public.mobile_push_tokens;
CREATE POLICY "mobile_push_tokens_own" ON public.mobile_push_tokens
  FOR ALL TO anon, authenticated
  USING (
    supabase_user_id = (SELECT auth.uid())::text
    OR user_id = current_student_nerdx_id()
  )
  WITH CHECK (
    supabase_user_id = (SELECT auth.uid())::text
    OR user_id = current_student_nerdx_id()
  );

DROP POLICY IF EXISTS "user_notification_preferences_own" ON public.user_notification_preferences;
CREATE POLICY "user_notification_preferences_own" ON public.user_notification_preferences
  FOR ALL TO anon, authenticated
  USING (user_id = current_student_nerdx_id())
  WITH CHECK (user_id = current_student_nerdx_id());

-- Project artefacts: scoped via user_projects
DROP POLICY IF EXISTS "project_evidence_owner" ON public.project_evidence;
CREATE POLICY "project_evidence_owner" ON public.project_evidence
  FOR ALL TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_projects up
      WHERE up.id = project_evidence.project_id
        AND up.user_id = current_student_nerdx_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_projects up
      WHERE up.id = project_evidence.project_id
        AND up.user_id = current_student_nerdx_id()
    )
  );

DROP POLICY IF EXISTS "project_exports_owner" ON public.project_exports;
CREATE POLICY "project_exports_owner" ON public.project_exports
  FOR ALL TO anon, authenticated
  USING (
    user_id = current_student_nerdx_id()
    OR EXISTS (
      SELECT 1 FROM public.user_projects up
      WHERE up.id = project_exports.project_id
        AND up.user_id = current_student_nerdx_id()
    )
  )
  WITH CHECK (
    user_id = current_student_nerdx_id()
    OR EXISTS (
      SELECT 1 FROM public.user_projects up
      WHERE up.id = project_exports.project_id
        AND up.user_id = current_student_nerdx_id()
    )
  );

DROP POLICY IF EXISTS "project_logbook_owner" ON public.project_logbook;
CREATE POLICY "project_logbook_owner" ON public.project_logbook
  FOR ALL TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_projects up
      WHERE up.id = project_logbook.project_id
        AND up.user_id = current_student_nerdx_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_projects up
      WHERE up.id = project_logbook.project_id
        AND up.user_id = current_student_nerdx_id()
    )
  );

DROP POLICY IF EXISTS "project_references_owner" ON public.project_references;
CREATE POLICY "project_references_owner" ON public.project_references
  FOR ALL TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_projects up
      WHERE up.id = project_references.project_id
        AND up.user_id = current_student_nerdx_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_projects up
      WHERE up.id = project_references.project_id
        AND up.user_id = current_student_nerdx_id()
    )
  );

DROP POLICY IF EXISTS "project_sections_owner" ON public.project_sections;
CREATE POLICY "project_sections_owner" ON public.project_sections
  FOR ALL TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_projects up
      WHERE up.id = project_sections.project_id
        AND up.user_id = current_student_nerdx_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_projects up
      WHERE up.id = project_sections.project_id
        AND up.user_id = current_student_nerdx_id()
    )
  );
