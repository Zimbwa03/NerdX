
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
    'maic_student_progress'
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
