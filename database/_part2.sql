
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
    user_id = current_student_nerdx_id()
    OR (
      auth.jwt() ->> 'email' IS NOT NULL
      AND lower(trim(coalesce(user_email, ''))) = lower(trim(auth.jwt() ->> 'email'))
    )
  )
  WITH CHECK (
    user_id = current_student_nerdx_id()
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
