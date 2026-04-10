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
