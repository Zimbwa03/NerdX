
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
