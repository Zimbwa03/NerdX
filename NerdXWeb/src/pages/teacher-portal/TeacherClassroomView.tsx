import { AnimatePresence, motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowLeft,
  BookOpen,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Eye,
  ExternalLink,
  FilePlus2,
  GraduationCap,
  Loader2,
  Megaphone,
  Paperclip,
  PenTool,
  Plus,
  Save,
  Send,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTeacherAuth } from '../../context/TeacherAuthContext';
import { schoolEcosystemApi, type SchoolStudent } from '../../services/api/schoolEcosystemApi';
import {
  teacherPortalApi,
  type Assessment,
  type ClassroomAttachment,
  type TeacherSchemeOfWorkItem,
  type TeacherTimetableEntry,
  type ClassroomInfo,
  type ClassroomPost,
  type ClassAnalytics,
  type StudentWorkspacePreview,
  type StudentSubmission,
} from '../../services/api/teacherPortalApi';

type TabId = 'overview' | 'students' | 'assessments' | 'reviews' | 'schedule';
type QuestionType = 'mcq' | 'essay' | 'saq' | 'true_false';

interface DraftQuestion {
  question_text: string;
  question_type: QuestionType;
  options_json?: Array<{ label: string; text: string }>;
  correct_answer?: string | null;
  marks: number;
  topic_tag?: string | null;
  explanation?: string | null;
}

interface AssessmentDraft {
  title: string;
  type: 'mcq' | 'essay' | 'saq' | 'mixed' | 'upload';
  instructions: string;
  due_date: string;
  time_limit_mins: string;
  ai_marking_enabled: boolean;
  questions: DraftQuestion[];
}

interface AiGeneratorState {
  topic: string;
  question_type: QuestionType;
  count: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

interface ReviewFormState {
  teacher_score: string;
  final_total: string;
  teacher_feedback: string;
}

interface TimetableDraft {
  title: string;
  weekday: string;
  start_time: string;
  end_time: string;
  room: string;
  notes: string;
}

interface SchemeDraft {
  week_label: string;
  topic: string;
  objectives: string;
  activities: string;
  homework: string;
  due_date: string;
  ai_notes: string;
  status: 'planned' | 'in_progress' | 'completed';
}

const TABS: Array<{ id: TabId; label: string; icon: typeof BookOpen }> = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'assessments', label: 'Assessments', icon: PenTool },
  { id: 'reviews', label: 'Reviews', icon: ClipboardCheck },
  { id: 'schedule', label: 'Schedule', icon: CalendarClock },
];

const POST_TYPE_OPTIONS = [
  { id: 'announcement', label: 'Announcement', icon: Megaphone, tone: 'border-sky-500/30 bg-sky-500/10 text-sky-300' },
  { id: 'homework', label: 'Homework', icon: ClipboardList, tone: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
  { id: 'assignment', label: 'Assignment', icon: FilePlus2, tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
  { id: 'test', label: 'Test', icon: PenTool, tone: 'border-rose-500/30 bg-rose-500/10 text-rose-300' },
] as const;

const EMPTY_ASSESSMENT_DRAFT: AssessmentDraft = {
  title: '',
  type: 'mixed',
  instructions: '',
  due_date: '',
  time_limit_mins: '',
  ai_marking_enabled: true,
  questions: [],
};

const EMPTY_REVIEW_FORM: ReviewFormState = {
  teacher_score: '',
  final_total: '',
  teacher_feedback: '',
};

const EMPTY_TIMETABLE_DRAFT: TimetableDraft = {
  title: '',
  weekday: '1',
  start_time: '',
  end_time: '',
  room: '',
  notes: '',
};

const EMPTY_SCHEME_DRAFT: SchemeDraft = {
  week_label: '',
  topic: '',
  objectives: '',
  activities: '',
  homework: '',
  due_date: '',
  ai_notes: '',
  status: 'planned',
};

export function TeacherClassroomView() {
  const { classroomId, studentId } = useParams<{ classroomId: string; studentId?: string }>();
  const { token, school } = useTeacherAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [classroom, setClassroom] = useState<ClassroomInfo | null>(null);
  const [posts, setPosts] = useState<ClassroomPost[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [students, setStudents] = useState<SchoolStudent[]>([]);
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null);
  const [timetable, setTimetable] = useState<TeacherTimetableEntry[]>([]);
  const [schemeItems, setSchemeItems] = useState<TeacherSchemeOfWorkItem[]>([]);
  const [submissionsByAssessmentId, setSubmissionsByAssessmentId] = useState<Record<number, StudentSubmission[]>>({});
  const [loading, setLoading] = useState(true);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [aiSuggestingScheme, setAiSuggestingScheme] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [savingAssessment, setSavingAssessment] = useState(false);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [loadingSubmissionsFor, setLoadingSubmissionsFor] = useState<number | null>(null);

  const [showPostComposer, setShowPostComposer] = useState(false);
  const [postType, setPostType] = useState<(typeof POST_TYPE_OPTIONS)[number]['id']>('announcement');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postDueDate, setPostDueDate] = useState('');
  const [postAttachments, setPostAttachments] = useState<ClassroomAttachment[]>([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [draftingPostWithAi, setDraftingPostWithAi] = useState(false);
  const [studentWorkspacePreview, setStudentWorkspacePreview] = useState<StudentWorkspacePreview | null>(null);

  const [showAssessmentBuilder, setShowAssessmentBuilder] = useState(false);
  const [assessmentDraft, setAssessmentDraft] = useState<AssessmentDraft>(EMPTY_ASSESSMENT_DRAFT);
  const [aiGenerator, setAiGenerator] = useState<AiGeneratorState>({
    topic: '',
    question_type: 'mcq',
    count: 5,
    difficulty: 'medium',
  });
  const [aiGenerating, setAiGenerating] = useState(false);

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewFormState>(EMPTY_REVIEW_FORM);
  const [timetableDraft, setTimetableDraft] = useState<TimetableDraft>(EMPTY_TIMETABLE_DRAFT);
  const [schemeDraft, setSchemeDraft] = useState<SchemeDraft>(EMPTY_SCHEME_DRAFT);

  const crId = Number(classroomId);
  const previewStudentId = studentId ? Number(studentId) : null;

  const loadClassroom = useCallback(async () => {
    if (!token || !crId) return;
    setLoading(true);
    const [crData, postsData, assessmentsData, scheduleData] = await Promise.all([
      teacherPortalApi.getClassroom(token, crId),
      teacherPortalApi.getClassroomPosts(token, crId),
      teacherPortalApi.listAssessments(token, crId),
      teacherPortalApi.getClassroomSchedule(token, crId),
    ]);

    if (crData) {
      setClassroom(crData);
      if (crData.class?.id) {
        const [studentsData, analyticsData] = await Promise.all([
          schoolEcosystemApi.listClassStudents(token, crData.class.id),
          teacherPortalApi.getClassroomAnalytics(token, crId),
        ]);
        setStudents(studentsData.students);
        setAnalytics(analyticsData);
      }
    }

    setPosts(postsData);
    setAssessments(assessmentsData);
    setTimetable(scheduleData.timetable);
    setSchemeItems(scheduleData.scheme_of_work);
    setLoading(false);
  }, [crId, token]);

  useEffect(() => {
    void Promise.resolve().then(loadClassroom);
  }, [loadClassroom]);

  useEffect(() => {
    if (!token || !crId || !previewStudentId) {
      setStudentWorkspacePreview(null);
      return;
    }
    void teacherPortalApi.getStudentWorkspacePreview(token, crId, previewStudentId).then(setStudentWorkspacePreview);
  }, [crId, previewStudentId, token]);

  const ensureSubmissionsLoaded = useCallback(async (assessmentId: number) => {
    if (!token || submissionsByAssessmentId[assessmentId]) return;
    setLoadingSubmissionsFor(assessmentId);
    const data = await teacherPortalApi.listSubmissions(token, assessmentId);
    setSubmissionsByAssessmentId((current) => ({ ...current, [assessmentId]: data }));
    setLoadingSubmissionsFor(null);
  }, [submissionsByAssessmentId, token]);

  useEffect(() => {
    if (activeTab === 'reviews') {
      assessments.filter((item) => item.is_released).forEach((item) => {
        void ensureSubmissionsLoaded(item.id);
      });
    }
  }, [activeTab, assessments, ensureSubmissionsLoaded]);

  const studentMetricsById = useMemo(() => {
    const map = new Map<number, { average_accuracy: number; badge: string; topics_assessed: number }>();
    analytics?.students.forEach((student) => {
      map.set(student.student_id, {
        average_accuracy: student.average_accuracy,
        badge: student.badge,
        topics_assessed: student.topics_assessed,
      });
    });
    return map;
  }, [analytics]);

  const assessmentRows = useMemo(() => {
    return assessments.map((assessment) => {
      const submissions = submissionsByAssessmentId[assessment.id] ?? [];
      return {
        assessment,
        submissions,
        submittedCount: submissions.length,
        reviewedCount: submissions.filter((submission) => submission.teacher_reviewed).length,
      };
    });
  }, [assessments, submissionsByAssessmentId]);

  const pendingReviews = useMemo(() => Object.values(submissionsByAssessmentId).flat().filter((submission) => !submission.teacher_reviewed), [submissionsByAssessmentId]);

  const derivedScheduleItems = useMemo(() => {
    const postItems = posts
      .filter((post) => post.scheduled_at || post.due_date)
      .map((post) => ({
        id: `post-${post.id}`,
        title: post.title,
        type: post.post_type,
        date: post.scheduled_at || post.due_date || post.created_at,
        subtitle: 'Classroom post',
      }));

    const assessmentItems = assessments.map((assessment) => ({
      id: `assessment-${assessment.id}`,
      title: assessment.title,
      type: assessment.type,
      date: assessment.due_date || assessment.release_date || assessment.created_at,
      subtitle: assessment.is_released ? 'Assessment live' : 'Assessment draft',
    }));

    return [...postItems, ...assessmentItems]
      .filter((item) => item.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [assessments, posts]);

  const scheduleItems = useMemo(() => {
    const timetableItems = timetable.map((entry) => ({
      id: `timetable-${entry.id}`,
      title: entry.title,
      type: 'timetable',
      date: `2026-01-0${Math.min(entry.weekday, 7)}T${entry.start_time}`,
      subtitle: `${weekdayLabel(entry.weekday)} · ${entry.start_time.slice(0, 5)}-${entry.end_time.slice(0, 5)}${entry.room ? ` · ${entry.room}` : ''}`,
    }));

    const schemeSchedule = schemeItems.map((item) => ({
      id: `scheme-${item.id}`,
      title: item.topic,
      type: 'scheme',
      date: item.due_date ? `${item.due_date}T08:00` : item.created_at,
      subtitle: `${item.week_label} · ${item.status.replace('_', ' ')}`,
    }));

    return [...timetableItems, ...schemeSchedule, ...derivedScheduleItems].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [derivedScheduleItems, schemeItems, timetable]);

  const activitySeries = useMemo(() => Array.from({ length: 7 }, (_, index) => ({
    label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    value: Math.max(0, Math.round(((students.length || 1) + index + (analytics?.class_average || 0) / 20) / 2)),
  })), [analytics?.class_average, students.length]);

  const badgeDistribution = useMemo(() => [
    { label: 'Excellent', value: analytics?.badge_distribution?.Excellent ?? 0, color: '#10B981' },
    { label: 'Good', value: analytics?.badge_distribution?.Good ?? 0, color: '#3B82F6' },
    { label: 'Needs Help', value: analytics?.badge_distribution?.['Needs Help'] ?? 0, color: '#F59E0B' },
    { label: 'At Risk', value: analytics?.badge_distribution?.['At Risk'] ?? 0, color: '#F43F5E' },
  ], [analytics]);

  const selectedAssessmentRow = selectedAssessmentId ? assessmentRows.find((row) => row.assessment.id === selectedAssessmentId) ?? null : null;

  const handleCreatePost = async () => {
    if (!token || !postTitle.trim()) return;
    setSavingPost(true);
    await teacherPortalApi.createPost(token, crId, {
      post_type: postType,
      title: postTitle.trim(),
      content: postContent.trim() || null,
      due_date: postDueDate || null,
      attachments: postAttachments,
    });
    setPostTitle('');
    setPostContent('');
    setPostDueDate('');
    setPostAttachments([]);
    setShowPostComposer(false);
    setPosts(await teacherPortalApi.getClassroomPosts(token, crId));
    setSavingPost(false);
  };

  const handleUploadPostAttachment = async (fileList: FileList | null) => {
    if (!token || !fileList?.length) return;
    setUploadingAttachment(true);
    try {
      const uploaded = await Promise.all(Array.from(fileList).map((file) => teacherPortalApi.uploadClassroomAttachment(token, crId, file)));
      setPostAttachments((current) => [...current, ...uploaded]);
    } finally {
      setUploadingAttachment(false);
    }
  };

  const handleAiDraftPost = async () => {
    if (!token) return;
    setDraftingPostWithAi(true);
    try {
      const draft = await teacherPortalApi.draftClassroomPost(token, crId, {
        post_type: postType,
        topic: postTitle || classroom?.subject?.name || '',
        objective: postContent,
        due_date: postDueDate || null,
      });
      setPostTitle(draft.title);
      setPostContent(
        draft.checklist?.length
          ? `${draft.content}\n\nChecklist:\n${draft.checklist.map((item) => `- ${item}`).join('\n')}`
          : draft.content,
      );
    } finally {
      setDraftingPostWithAi(false);
    }
  };

  const openStudentWorkspacePreview = (targetStudentId: number) => {
    if (!school?.school_id) return;
    navigate(`/school/${school.school_id}/teacher/classroom/${crId}/student/${targetStudentId}`);
  };

  const handleAddManualQuestion = () => {
    setAssessmentDraft((current) => ({
      ...current,
      questions: [
        ...current.questions,
        {
          question_text: '',
          question_type: 'mcq',
          options_json: [
            { label: 'A', text: '' },
            { label: 'B', text: '' },
            { label: 'C', text: '' },
            { label: 'D', text: '' },
          ],
          correct_answer: 'A',
          marks: 1,
          topic_tag: '',
          explanation: '',
        },
      ],
    }));
  };

  const handleGenerateQuestions = async () => {
    if (!token || !classroom?.subject?.name || !aiGenerator.topic.trim()) return;
    setAiGenerating(true);
    try {
      const result = await teacherPortalApi.generateExam(token, {
        subject: classroom.subject.name,
        topic: aiGenerator.topic.trim(),
        question_type: aiGenerator.question_type,
        count: aiGenerator.count,
        difficulty: aiGenerator.difficulty,
      });

      const questions = Array.isArray(result?.questions) ? result.questions : [];
      setAssessmentDraft((current) => ({
        ...current,
        questions: [
          ...current.questions,
          ...questions.map((question: DraftQuestion) => ({
            question_text: question.question_text ?? '',
            question_type: (question.question_type ?? aiGenerator.question_type) as QuestionType,
            options_json: question.options_json,
            correct_answer: question.correct_answer ?? null,
            marks: Number(question.marks ?? 1),
            topic_tag: question.topic_tag ?? aiGenerator.topic.trim(),
            explanation: question.explanation ?? '',
          })),
        ],
      }));
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCreateAssessment = async () => {
    if (!token || !assessmentDraft.title.trim() || assessmentDraft.questions.length === 0) return;
    setSavingAssessment(true);
    await teacherPortalApi.createAssessment(token, crId, {
      title: assessmentDraft.title.trim(),
      type: assessmentDraft.type,
      instructions: assessmentDraft.instructions.trim() || null,
      due_date: assessmentDraft.due_date || null,
      time_limit_mins: assessmentDraft.time_limit_mins ? Number(assessmentDraft.time_limit_mins) : null,
      ai_marking_enabled: assessmentDraft.ai_marking_enabled,
      questions: assessmentDraft.questions.map((question) => ({
        ...question,
        topic_tag: question.topic_tag || aiGenerator.topic || classroom?.subject?.name || '',
      })),
    });
    setAssessmentDraft(EMPTY_ASSESSMENT_DRAFT);
    setShowAssessmentBuilder(false);
    setAssessments(await teacherPortalApi.listAssessments(token, crId));
    setSavingAssessment(false);
  };

  const handleReleaseAssessment = async (assessmentId: number) => {
    if (!token) return;
    await teacherPortalApi.releaseAssessment(token, assessmentId);
    setAssessments(await teacherPortalApi.listAssessments(token, crId));
    await ensureSubmissionsLoaded(assessmentId);
  };

  const handleReleaseResults = async (assessmentId: number) => {
    if (!token) return;
    await teacherPortalApi.releaseResults(token, assessmentId);
    setAssessments(await teacherPortalApi.listAssessments(token, crId));
    setSubmissionsByAssessmentId((current) => ({
      ...current,
      [assessmentId]: current[assessmentId]?.map((submission) => ({ ...submission, status: 'returned' })) ?? [],
    }));
  };

  const openSubmissionReview = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setReviewForm({
      teacher_score: submission.final_score?.toString() ?? submission.ai_score?.toString() ?? '',
      final_total: submission.final_total?.toString() ?? submission.ai_total?.toString() ?? '',
      teacher_feedback: submission.teacher_feedback ?? '',
    });
  };

  const handleSaveReview = async () => {
    if (!token || !selectedSubmission) return;
    setReviewSaving(true);
    await teacherPortalApi.reviewSubmission(token, selectedSubmission.id, {
      teacher_score: reviewForm.teacher_score ? Number(reviewForm.teacher_score) : undefined,
      final_score: reviewForm.teacher_score ? Number(reviewForm.teacher_score) : undefined,
      final_total: reviewForm.final_total ? Number(reviewForm.final_total) : undefined,
      teacher_feedback: reviewForm.teacher_feedback.trim() || undefined,
    });
    const refreshed = await teacherPortalApi.listSubmissions(token, selectedSubmission.assessment_id);
    setSubmissionsByAssessmentId((current) => ({ ...current, [selectedSubmission.assessment_id]: refreshed }));
    setSelectedSubmission(null);
    setReviewForm(EMPTY_REVIEW_FORM);
    setReviewSaving(false);
  };

  const handleCreateTimetableEntry = async () => {
    if (!token || !timetableDraft.title.trim() || !timetableDraft.start_time || !timetableDraft.end_time) return;
    setScheduleSaving(true);
    await teacherPortalApi.createTimetableEntry(token, crId, {
      title: timetableDraft.title.trim(),
      weekday: Number(timetableDraft.weekday),
      start_time: timetableDraft.start_time,
      end_time: timetableDraft.end_time,
      room: timetableDraft.room.trim() || null,
      notes: timetableDraft.notes.trim() || null,
    });
    const scheduleData = await teacherPortalApi.getClassroomSchedule(token, crId);
    setTimetable(scheduleData.timetable);
    setSchemeItems(scheduleData.scheme_of_work);
    setTimetableDraft(EMPTY_TIMETABLE_DRAFT);
    setScheduleSaving(false);
  };

  const handleSuggestScheme = async () => {
    if (!token || !schemeDraft.topic.trim() || !schemeDraft.week_label.trim()) return;
    setAiSuggestingScheme(true);
    try {
      const result = await teacherPortalApi.suggestSchemeItem(token, crId, {
        topic: schemeDraft.topic.trim(),
        week_label: schemeDraft.week_label.trim(),
        subject: classroom?.subject?.name || '',
      });
      const suggestion = result?.suggestion || {};
      setSchemeDraft((current) => ({
        ...current,
        objectives: String(suggestion.objectives || current.objectives || ''),
        activities: String(suggestion.activities || current.activities || ''),
        homework: String(suggestion.homework || current.homework || ''),
        ai_notes: String(suggestion.ai_notes || current.ai_notes || ''),
      }));
    } finally {
      setAiSuggestingScheme(false);
    }
  };

  const handleCreateSchemeItem = async () => {
    if (!token || !schemeDraft.week_label.trim() || !schemeDraft.topic.trim()) return;
    setScheduleSaving(true);
    await teacherPortalApi.createSchemeItem(token, crId, {
      week_label: schemeDraft.week_label.trim(),
      topic: schemeDraft.topic.trim(),
      objectives: schemeDraft.objectives.trim() || null,
      activities: schemeDraft.activities.trim() || null,
      homework: schemeDraft.homework.trim() || null,
      due_date: schemeDraft.due_date || null,
      ai_notes: schemeDraft.ai_notes.trim() || null,
      status: schemeDraft.status,
    });
    const scheduleData = await teacherPortalApi.getClassroomSchedule(token, crId);
    setTimetable(scheduleData.timetable);
    setSchemeItems(scheduleData.scheme_of_work);
    setSchemeDraft(EMPTY_SCHEME_DRAFT);
    setScheduleSaving(false);
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#080B0F]">
        <Loader2 size={32} className="animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B0F] text-slate-100">
      <div className="border-b border-slate-800 bg-[#0D1117]/95 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(`/school/${school?.school_id}/teacher/dashboard`)}
            className="mb-4 inline-flex items-center gap-2 text-[13px] text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500">
                <GraduationCap size={28} className="text-[#041218]" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate font-['Sora'] text-[24px] font-bold text-white">{classroom?.classroom?.name || 'Classroom'}</h1>
                <p className="mt-1 text-[13px] text-slate-400">
                  {classroom?.class?.display_name} · {classroom?.subject?.name} · {classroom?.student_count} students
                </p>
                <p className="mt-2 text-[12px] text-emerald-300">
                  Teacher workspace: planning, delivery, submissions, review, and AI support
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowPostComposer(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-[13px] font-medium text-sky-300 transition hover:border-sky-400/40 hover:text-sky-200"
              >
                <Megaphone size={15} />
                Send Work or Notice
              </button>
              <button
                type="button"
                onClick={() => setShowAssessmentBuilder(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[13px] font-medium text-emerald-300 transition hover:border-emerald-400/40 hover:text-emerald-200"
              >
                <Plus size={15} />
                Build Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[13px] font-medium transition ${
                activeTab === tab.id
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-800 bg-[#0D1117] text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' ? (
          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <section className="space-y-6">
              {studentWorkspacePreview ? (
                <StudentWorkspacePreviewCard
                  preview={studentWorkspacePreview}
                  onBack={() => {
                    if (school?.school_id) {
                      navigate(`/school/${school.school_id}/teacher/classroom/${crId}`);
                    } else {
                      navigate(-1);
                    }
                  }}
                />
              ) : null}

              <div className="grid gap-4 md:grid-cols-4">
                <MetricCard label="Students" value={`${students.length}`} accent="emerald" />
                <MetricCard label="Live Assessments" value={`${assessments.filter((item) => item.is_released).length}`} accent="sky" />
                <MetricCard label="Pending Reviews" value={`${pendingReviews.length}`} accent="amber" />
                <MetricCard label="Class Average" value={analytics ? `${analytics.class_average}%` : '--'} accent="rose" />
              </div>

              <Panel title="Teacher Command Feed" subtitle="Announcements, work set, and classroom activity">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[12px] text-slate-400">Everything sent to this class appears here in delivery order.</p>
                  <button type="button" onClick={() => setShowPostComposer(true)} className="text-[12px] font-medium text-emerald-300 transition hover:text-emerald-200">
                    New classroom item →
                  </button>
                </div>
                <div className="space-y-3">
                  {posts.length > 0 ? (
                    posts.map((post) => {
                      const meta = POST_TYPE_OPTIONS.find((option) => option.id === post.post_type) ?? POST_TYPE_OPTIONS[0];
                      const Icon = meta.icon;
                      return (
                        <div key={post.id} className="rounded-2xl border border-slate-800 bg-[#11161F] p-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] ${meta.tone}`}>
                              <Icon size={12} />
                              {meta.label}
                            </span>
                            <span className="ml-auto text-[11px] text-slate-500">{formatDateTime(post.created_at)}</span>
                          </div>
                          <h3 className="mt-3 font-['Sora'] text-[16px] font-semibold text-white">{post.title}</h3>
                          {post.content ? <p className="mt-2 text-[13px] leading-6 text-slate-300">{post.content}</p> : null}
                          {post.attachments?.length ? <AttachmentList attachments={post.attachments} /> : null}
                          {post.due_date ? <p className="mt-3 text-[12px] text-amber-300">Due {formatDateTime(post.due_date)}</p> : null}
                        </div>
                      );
                    })
                  ) : (
                    <EmptyState icon={Megaphone} title="No classroom work sent yet" description="Start by sending an announcement, homework, assignment, or test instruction to the class." />
                  )}
                </div>
              </Panel>

              <Panel title="Class Analytics" subtitle="How learners are performing in this classroom">
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="h-[220px] rounded-2xl border border-slate-800 bg-[#11161F] p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activitySeries}>
                        <defs>
                          <linearGradient id="classroom-activity-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.03} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(123,143,166,0.10)" vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: '#7B8FA6', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#7B8FA6', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                        <Tooltip cursor={{ stroke: 'rgba(16,185,129,0.25)' }} contentStyle={{ backgroundColor: '#0D1117', borderColor: '#1E2D3D', borderRadius: 12 }} labelStyle={{ color: '#EDF2F7' }} />
                        <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#classroom-activity-fill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-[220px] rounded-2xl border border-slate-800 bg-[#11161F] p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={badgeDistribution}>
                        <CartesianGrid stroke="rgba(123,143,166,0.08)" vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: '#7B8FA6', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#7B8FA6', fontSize: 11 }} axisLine={false} tickLine={false} width={26} />
                        <Tooltip contentStyle={{ backgroundColor: '#0D1117', borderColor: '#1E2D3D', borderRadius: 12 }} labelStyle={{ color: '#EDF2F7' }} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {badgeDistribution.map((entry) => (
                            <Cell key={entry.label} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Panel>
            </section>

            <section className="space-y-6">
              <Panel title="Weekly Schedule Board" subtitle="Derived from due dates, release dates, and scheduled posts">
                <div className="space-y-3">
                  {scheduleItems.length > 0 ? (
                    scheduleItems.slice(0, 8).map((item) => (
                      <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-[#11161F] p-4">
                        <div className="mt-0.5 h-3 w-3 rounded-full bg-emerald-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium text-white">{item.title}</p>
                          <p className="mt-1 text-[11px] text-slate-400">{item.subtitle}</p>
                        </div>
                        <span className="text-[11px] text-slate-500">{formatDateTime(item.date)}</span>
                      </div>
                    ))
                  ) : (
                    <EmptyState icon={CalendarClock} title="No timed classroom items yet" description="As you add due dates or release dates, the teacher timetable board will populate here." />
                  )}
                </div>
              </Panel>

              <Panel title="Review Queue" subtitle="Submissions that still need teacher action">
                <div className="space-y-3">
                  {pendingReviews.length > 0 ? (
                    pendingReviews.map((submission) => (
                      <button key={submission.id} type="button" onClick={() => openSubmissionReview(submission)} className="flex w-full items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-left transition hover:border-amber-400/30">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                          <ClipboardCheck size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-white">{submission.student?.first_name} {submission.student?.last_name}</p>
                          <p className="mt-1 text-[11px] text-slate-400">Submission pending review · {formatDateTime(submission.submitted_at)}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-500" />
                      </button>
                    ))
                  ) : (
                    <EmptyState icon={CheckCircle2} title="Review queue is clear" description="New submissions will appear here as students hand in work." />
                  )}
                </div>
              </Panel>
            </section>
          </div>
        ) : null}

        {activeTab === 'students' ? (
          <Panel title="Student Roster" subtitle="Every learner in this class, with mastery and activity context">
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {students.length > 0 ? (
                students.map((student) => {
                  const metrics = studentMetricsById.get(student.id);
                  return (
                    <div key={student.id} className="rounded-2xl border border-slate-800 bg-[#11161F] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/25 to-emerald-500/25 text-[13px] font-semibold uppercase text-white">
                          {student.first_name[0]}{student.last_name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-semibold text-white">{student.first_name} {student.last_name}</p>
                          <p className="text-[11px] text-slate-400">{student.student_code}</p>
                        </div>
                        <span className={`ml-auto rounded-full px-2.5 py-1 text-[11px] ${student.status === 'active' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-700/60 text-slate-300'}`}>{student.status}</span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                        <MiniMetric label="Mastery" value={metrics ? `${metrics.average_accuracy}%` : '--'} />
                        <MiniMetric label="Topics" value={metrics ? `${metrics.topics_assessed}` : '0'} />
                        <MiniMetric label="Badge" value={metrics?.badge ?? 'New'} />
                        <MiniMetric label="Guardian" value={student.guardian_name || 'Not set'} />
                      </div>

                      <button type="button" onClick={() => openStudentWorkspacePreview(student.id)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-[12px] font-medium text-sky-300">
                        <Eye size={14} />
                        Preview learner workspace
                      </button>
                    </div>
                  );
                })
              ) : (
                <EmptyState icon={Users} title="No students loaded" description="This class has no student records yet." />
              )}
            </div>
          </Panel>
        ) : null}

        {activeTab === 'assessments' ? (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Panel title="Assessment Studio" subtitle="Create, release, and track tests professionally">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[12px] text-slate-400">Use AI to generate questions, then review before releasing to students.</p>
                <button type="button" onClick={() => setShowAssessmentBuilder(true)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[13px] font-medium text-emerald-300">
                  <Plus size={15} />
                  New Assessment
                </button>
              </div>

              <div className="space-y-4">
                {assessmentRows.length > 0 ? (
                  assessmentRows.map((row) => (
                    <div key={row.assessment.id} className="rounded-2xl border border-slate-800 bg-[#11161F] p-4">
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">{row.assessment.type}</span>
                            {row.assessment.is_released ? (
                              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-300">Released</span>
                            ) : (
                              <span className="rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-[11px] text-slate-300">Draft</span>
                            )}
                          </div>
                          <h3 className="mt-3 font-['Sora'] text-[17px] font-semibold text-white">{row.assessment.title}</h3>
                          <p className="mt-2 text-[12px] leading-6 text-slate-400">{row.assessment.instructions || 'No teacher instructions yet.'}</p>
                          <div className="mt-3 flex flex-wrap gap-3 text-[12px] text-slate-400">
                            <span>{row.assessment.total_marks ?? '--'} marks</span>
                            <span>{row.assessment.time_limit_mins ?? '--'} mins</span>
                            <span>Due {row.assessment.due_date ? formatDateTime(row.assessment.due_date) : 'not set'}</span>
                            <span>{row.submittedCount} submitted</span>
                            <span>{row.reviewedCount} reviewed</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {!row.assessment.is_released ? (
                            <button type="button" onClick={() => void handleReleaseAssessment(row.assessment.id)} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[12px] font-medium text-emerald-300">
                              Release to students
                            </button>
                          ) : null}
                          <button type="button" onClick={() => { setSelectedAssessmentId(row.assessment.id); void ensureSubmissionsLoaded(row.assessment.id); }} className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-[12px] font-medium text-slate-200">
                            View submissions
                          </button>
                          {row.assessment.is_released && row.submittedCount > 0 ? (
                            <button type="button" onClick={() => void handleReleaseResults(row.assessment.id)} className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-[12px] font-medium text-sky-300">
                              Release results
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState icon={PenTool} title="No assessments yet" description="Build your first test, assignment, or AI-assisted quiz for this class." />
                )}
              </div>
            </Panel>

            <Panel title="Submission Explorer" subtitle="Inspect what students have handed in">
              {selectedAssessmentRow ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-slate-800 bg-[#11161F] p-4">
                    <h3 className="font-['Sora'] text-[16px] font-semibold text-white">{selectedAssessmentRow.assessment.title}</h3>
                    <p className="mt-1 text-[12px] text-slate-400">{selectedAssessmentRow.submittedCount} submission(s) loaded</p>
                  </div>

                  {loadingSubmissionsFor === selectedAssessmentRow.assessment.id ? (
                    <div className="grid place-items-center rounded-2xl border border-slate-800 bg-[#11161F] p-10">
                      <Loader2 size={24} className="animate-spin text-emerald-400" />
                    </div>
                  ) : selectedAssessmentRow.submissions.length > 0 ? (
                    selectedAssessmentRow.submissions.map((submission) => (
                      <button key={submission.id} type="button" onClick={() => openSubmissionReview(submission)} className="flex w-full items-center gap-3 rounded-2xl border border-slate-800 bg-[#11161F] p-4 text-left transition hover:border-emerald-500/30">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                          <Eye size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-white">{submission.student?.first_name} {submission.student?.last_name}</p>
                          <p className="mt-1 text-[11px] text-slate-400">Submitted {formatDateTime(submission.submitted_at)} · AI {submission.ai_score ?? 0}/{submission.ai_total ?? submission.final_total ?? 0}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] ${submission.teacher_reviewed ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>{submission.teacher_reviewed ? 'Reviewed' : 'Needs review'}</span>
                      </button>
                    ))
                  ) : (
                    <EmptyState icon={ClipboardList} title="No submissions yet" description="Once students submit, their work will appear here for teacher review." />
                  )}
                </div>
              ) : (
                <EmptyState icon={Eye} title="Choose an assessment" description="Select an assessment on the left to inspect submissions and review student work." />
              )}
            </Panel>
          </div>
        ) : null}

        {activeTab === 'reviews' ? (
          <Panel title="Teacher Review Desk" subtitle="Mark, comment, and return student work">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {pendingReviews.length > 0 ? (
                pendingReviews.map((submission) => (
                  <div key={submission.id} className="rounded-2xl border border-slate-800 bg-[#11161F] p-4">
                    <p className="text-[13px] font-medium text-white">{submission.student?.first_name} {submission.student?.last_name}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Submitted {formatDateTime(submission.submitted_at)}</p>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
                      <MiniMetric label="AI Score" value={`${submission.ai_score ?? 0}/${submission.ai_total ?? submission.final_total ?? 0}`} />
                      <MiniMetric label="Status" value={submission.status} />
                    </div>
                    <button type="button" onClick={() => openSubmissionReview(submission)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[12px] font-medium text-amber-300">
                      <ClipboardCheck size={14} />
                      Review submission
                    </button>
                  </div>
                ))
              ) : (
                <EmptyState icon={CheckCircle2} title="No reviews outstanding" description="Teacher review queue is empty." />
              )}
            </div>
          </Panel>
        ) : null}

        {activeTab === 'schedule' ? (
          <Panel title="Classroom Schedule" subtitle="Operational timetable built from classroom work dates">
            <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-2xl border border-slate-800 bg-[#11161F] p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-['Sora'] text-[16px] font-semibold text-white">Timetable</h3>
                  <span className="text-[11px] text-slate-500">{timetable.length} lesson slot(s)</span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <input value={timetableDraft.title} onChange={(event) => setTimetableDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Lesson title" className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none" />
                  <select value={timetableDraft.weekday} onChange={(event) => setTimetableDraft((current) => ({ ...current, weekday: event.target.value }))} className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none">
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                    <option value="7">Sunday</option>
                  </select>
                  <input type="time" value={timetableDraft.start_time} onChange={(event) => setTimetableDraft((current) => ({ ...current, start_time: event.target.value }))} className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none" />
                  <input type="time" value={timetableDraft.end_time} onChange={(event) => setTimetableDraft((current) => ({ ...current, end_time: event.target.value }))} className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none" />
                  <input value={timetableDraft.room} onChange={(event) => setTimetableDraft((current) => ({ ...current, room: event.target.value }))} placeholder="Room / venue" className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none md:col-span-2" />
                </div>
                <textarea value={timetableDraft.notes} onChange={(event) => setTimetableDraft((current) => ({ ...current, notes: event.target.value }))} rows={3} placeholder="Optional notes" className="mt-3 w-full rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none" />
                <button type="button" onClick={() => void handleCreateTimetableEntry()} disabled={scheduleSaving} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[13px] font-medium text-emerald-300 disabled:opacity-50">
                  {scheduleSaving ? <Loader2 size={15} className="animate-spin" /> : <CalendarClock size={15} />}
                  Save timetable slot
                </button>
                <div className="mt-4 space-y-3">
                  {timetable.length > 0 ? (
                    timetable.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#0D1117] p-4">
                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-white">{item.title}</p>
                          <p className="mt-1 text-[11px] text-slate-400">
                            {weekdayLabel(item.weekday)} · {item.start_time.slice(0, 5)}-{item.end_time.slice(0, 5)}{item.room ? ` · ${item.room}` : ''}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-500">{item.cadence}</span>
                      </div>
                    ))
                  ) : (
                    <EmptyState icon={CalendarClock} title="No timetable slots yet" description="Add the classroom timetable so the teacher schedule is persistent." />
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#11161F] p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-['Sora'] text-[16px] font-semibold text-white">Scheme of Work</h3>
                  <span className="text-[11px] text-slate-500">{schemeItems.length} planning row(s)</span>
                </div>
                <div className="mt-4 grid gap-3">
                  <input value={schemeDraft.week_label} onChange={(event) => setSchemeDraft((current) => ({ ...current, week_label: event.target.value }))} placeholder="Week label e.g. Week 3" className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none" />
                  <input value={schemeDraft.topic} onChange={(event) => setSchemeDraft((current) => ({ ...current, topic: event.target.value }))} placeholder="Topic" className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none" />
                  <textarea value={schemeDraft.objectives} onChange={(event) => setSchemeDraft((current) => ({ ...current, objectives: event.target.value }))} rows={2} placeholder="Objectives" className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none" />
                  <textarea value={schemeDraft.activities} onChange={(event) => setSchemeDraft((current) => ({ ...current, activities: event.target.value }))} rows={2} placeholder="Activities" className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none" />
                  <textarea value={schemeDraft.homework} onChange={(event) => setSchemeDraft((current) => ({ ...current, homework: event.target.value }))} rows={2} placeholder="Homework / follow-up work" className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none" />
                  <input type="date" value={schemeDraft.due_date} onChange={(event) => setSchemeDraft((current) => ({ ...current, due_date: event.target.value }))} className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none" />
                  <select value={schemeDraft.status} onChange={(event) => setSchemeDraft((current) => ({ ...current, status: event.target.value as SchemeDraft['status'] }))} className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none">
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <textarea value={schemeDraft.ai_notes} onChange={(event) => setSchemeDraft((current) => ({ ...current, ai_notes: event.target.value }))} rows={2} placeholder="AI notes / teacher reflections" className="rounded-xl border border-slate-800 bg-[#0D1117] px-4 py-3 text-[13px] text-white outline-none" />
                  <div className="flex flex-wrap gap-3">
                    <button type="button" onClick={() => void handleSuggestScheme()} disabled={aiSuggestingScheme || !schemeDraft.topic.trim() || !schemeDraft.week_label.trim()} className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[13px] font-medium text-emerald-300 disabled:opacity-50">
                      {aiSuggestingScheme ? <Loader2 size={15} className="animate-spin" /> : <Bot size={15} />}
                      AI Suggest Plan
                    </button>
                    <button type="button" onClick={() => void handleCreateSchemeItem()} disabled={scheduleSaving} className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-[13px] font-medium text-sky-300 disabled:opacity-50">
                      {scheduleSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                      Save Scheme Item
                    </button>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {schemeItems.length > 0 ? (
                    schemeItems.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-slate-800 bg-[#0D1117] p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300">{item.week_label}</span>
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-300">{item.status}</span>
                          <span className="ml-auto text-[11px] text-slate-500">{item.due_date || 'No due date'}</span>
                        </div>
                        <p className="mt-3 text-[13px] font-medium text-white">{item.topic}</p>
                        {item.objectives ? <p className="mt-2 text-[12px] text-slate-300">Objectives: {item.objectives}</p> : null}
                        {item.homework ? <p className="mt-2 text-[12px] text-slate-400">Homework: {item.homework}</p> : null}
                      </div>
                    ))
                  ) : (
                    <EmptyState icon={BookOpen} title="No scheme entries yet" description="Save weekly planning items here so the teacher workflow is persistent." />
                  )}
                </div>
              </div>
            </div>
          </Panel>
        ) : null}
      </div>

        <ModalShell open={showPostComposer} onClose={() => setShowPostComposer(false)} title="Send Work to Students" subtitle="Post a professional classroom item learners can see immediately">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {POST_TYPE_OPTIONS.map((option) => (
                <button key={option.id} type="button" onClick={() => setPostType(option.id)} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-medium transition ${postType === option.id ? option.tone : 'border-slate-800 bg-[#11161F] text-slate-300 hover:border-slate-700'}`}>
                <option.icon size={14} />
                {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-800 bg-[#11161F] px-3 py-2 text-[12px] font-medium text-slate-200">
                {uploadingAttachment ? <Loader2 size={14} className="animate-spin" /> : <Paperclip size={14} />}
                Attach resources
                <input type="file" multiple className="hidden" onChange={(event) => void handleUploadPostAttachment(event.target.files)} />
              </label>
              <button type="button" onClick={() => void handleAiDraftPost()} disabled={draftingPostWithAi} className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-[12px] font-medium text-sky-300 disabled:opacity-50">
                {draftingPostWithAi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                AI draft instructions
              </button>
            </div>

            <label className="block">
              <span className="mb-2 block text-[12px] font-medium text-slate-300">Title</span>
              <input value={postTitle} onChange={(event) => setPostTitle(event.target.value)} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" placeholder="e.g. Write the first draft of your essay question" />
            </label>

          <label className="block">
            <span className="mb-2 block text-[12px] font-medium text-slate-300">Instructions</span>
            <textarea value={postContent} onChange={(event) => setPostContent(event.target.value)} rows={5} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" placeholder="Explain exactly what students must do, how to submit, and what success looks like." />
          </label>

            <label className="block">
              <span className="mb-2 block text-[12px] font-medium text-slate-300">Due date</span>
              <input type="datetime-local" value={postDueDate} onChange={(event) => setPostDueDate(event.target.value)} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" />
            </label>

            {postAttachments.length > 0 ? (
              <div className="space-y-2">
                <span className="block text-[12px] font-medium text-slate-300">Attached resources</span>
                <AttachmentList attachments={postAttachments} onRemove={(index) => setPostAttachments((current) => current.filter((_, currentIndex) => currentIndex !== index))} />
              </div>
            ) : null}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowPostComposer(false)} className="rounded-xl border border-slate-800 px-4 py-2 text-[13px] text-slate-300">Cancel</button>
            <button type="button" onClick={() => void handleCreatePost()} disabled={savingPost || !postTitle.trim()} className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[13px] font-medium text-emerald-300 disabled:opacity-50">
              {savingPost ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Send to class
            </button>
          </div>
        </div>
      </ModalShell>

      <ModalShell open={showAssessmentBuilder} onClose={() => setShowAssessmentBuilder(false)} title="Assessment Builder" subtitle="Create tests, assignments, and AI-assisted classroom assessments">
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[12px] font-medium text-slate-300">Assessment title</span>
              <input value={assessmentDraft.title} onChange={(event) => setAssessmentDraft((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" placeholder="e.g. Form 1 History Test 3" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-medium text-slate-300">Type</span>
              <select value={assessmentDraft.type} onChange={(event) => setAssessmentDraft((current) => ({ ...current, type: event.target.value as AssessmentDraft['type'] }))} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30">
                <option value="mixed">Mixed</option>
                <option value="mcq">MCQ</option>
                <option value="essay">Essay</option>
                <option value="saq">Short Answer</option>
                <option value="upload">Upload</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-medium text-slate-300">Due date</span>
              <input type="datetime-local" value={assessmentDraft.due_date} onChange={(event) => setAssessmentDraft((current) => ({ ...current, due_date: event.target.value }))} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[12px] font-medium text-slate-300">Time limit (mins)</span>
              <input value={assessmentDraft.time_limit_mins} onChange={(event) => setAssessmentDraft((current) => ({ ...current, time_limit_mins: event.target.value }))} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" placeholder="45" />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-[12px] font-medium text-slate-300">Teacher instructions</span>
            <textarea value={assessmentDraft.instructions} onChange={(event) => setAssessmentDraft((current) => ({ ...current, instructions: event.target.value }))} rows={4} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" placeholder="Explain the rules, expected answers, and how students should complete this work." />
          </label>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 text-[13px] font-medium text-emerald-300">
              <Sparkles size={15} />
              Vertex AI question generation
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium text-slate-300">Topic</span>
                <input value={aiGenerator.topic} onChange={(event) => setAiGenerator((current) => ({ ...current, topic: event.target.value }))} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" placeholder="e.g. Colonial Africa" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium text-slate-300">Question type</span>
                <select value={aiGenerator.question_type} onChange={(event) => setAiGenerator((current) => ({ ...current, question_type: event.target.value as QuestionType }))} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30">
                  <option value="mcq">MCQ</option>
                  <option value="essay">Essay</option>
                  <option value="saq">Short Answer</option>
                  <option value="true_false">True / False</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium text-slate-300">Count</span>
                <input type="number" min={1} max={10} value={aiGenerator.count} onChange={(event) => setAiGenerator((current) => ({ ...current, count: Number(event.target.value) || 1 }))} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium text-slate-300">Difficulty</span>
                <select value={aiGenerator.difficulty} onChange={(event) => setAiGenerator((current) => ({ ...current, difficulty: event.target.value as AiGeneratorState['difficulty'] }))} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
              </label>
            </div>
            <button type="button" onClick={() => void handleGenerateQuestions()} disabled={aiGenerating || !aiGenerator.topic.trim()} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[13px] font-medium text-emerald-300 disabled:opacity-50">
              {aiGenerating ? <Loader2 size={15} className="animate-spin" /> : <Bot size={15} />}
              Generate with Vertex
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#11161F] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-['Sora'] text-[15px] font-semibold text-white">Question set</h3>
              <button type="button" onClick={handleAddManualQuestion} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-[12px] text-slate-200">
                <Plus size={14} />
                Add manual question
              </button>
            </div>
            <div className="space-y-4">
              {assessmentDraft.questions.length > 0 ? (
                assessmentDraft.questions.map((question, index) => (
                  <div key={`${question.question_text}-${index}`} className="rounded-2xl border border-slate-800 bg-[#0D1117] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-[12px] font-medium text-emerald-300">Question {index + 1}</span>
                      <button type="button" onClick={() => setAssessmentDraft((current) => ({ ...current, questions: current.questions.filter((_, questionIndex) => questionIndex !== index) }))} className="text-[12px] text-rose-300">
                        Remove
                      </button>
                    </div>
                    <textarea value={question.question_text} onChange={(event) => updateQuestion(index, { question_text: event.target.value }, setAssessmentDraft)} rows={3} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" />
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <select value={question.question_type} onChange={(event) => updateQuestion(index, { question_type: event.target.value as QuestionType }, setAssessmentDraft)} className="rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30">
                        <option value="mcq">MCQ</option>
                        <option value="essay">Essay</option>
                        <option value="saq">Short Answer</option>
                        <option value="true_false">True / False</option>
                      </select>
                      <input value={question.marks} onChange={(event) => updateQuestion(index, { marks: Number(event.target.value) || 1 }, setAssessmentDraft)} className="rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" />
                      <input value={question.topic_tag ?? ''} onChange={(event) => updateQuestion(index, { topic_tag: event.target.value }, setAssessmentDraft)} placeholder="Topic tag" className="rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" />
                    </div>

                    {question.question_type === 'mcq' && question.options_json ? (
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {question.options_json.map((option, optionIndex) => (
                          <input
                            key={`${option.label}-${optionIndex}`}
                            value={option.text}
                            onChange={(event) => {
                              const nextOptions = question.options_json?.map((item, currentIndex) => (currentIndex === optionIndex ? { ...item, text: event.target.value } : item));
                              updateQuestion(index, { options_json: nextOptions }, setAssessmentDraft);
                            }}
                            placeholder={`Option ${option.label}`}
                            className="rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30"
                          />
                        ))}
                        <input value={question.correct_answer ?? ''} onChange={(event) => updateQuestion(index, { correct_answer: event.target.value }, setAssessmentDraft)} placeholder="Correct answer (A/B/C/D)" className="rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30 md:col-span-2" />
                      </div>
                    ) : (
                      <input value={question.correct_answer ?? ''} onChange={(event) => updateQuestion(index, { correct_answer: event.target.value }, setAssessmentDraft)} placeholder="Expected answer or marking point" className="mt-3 w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-emerald-500/30" />
                    )}
                  </div>
                ))
              ) : (
                <EmptyState icon={Sparkles} title="No questions yet" description="Generate questions with Vertex or add them manually." />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAssessmentBuilder(false)} className="rounded-xl border border-slate-800 px-4 py-2 text-[13px] text-slate-300">Cancel</button>
            <button type="button" onClick={() => void handleCreateAssessment()} disabled={savingAssessment || !assessmentDraft.title.trim() || assessmentDraft.questions.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[13px] font-medium text-emerald-300 disabled:opacity-50">
              {savingAssessment ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save assessment
            </button>
          </div>
        </div>
      </ModalShell>

      <ModalShell open={!!selectedSubmission} onClose={() => { setSelectedSubmission(null); setReviewForm(EMPTY_REVIEW_FORM); }} title="Review Student Submission" subtitle="Inspect AI marking, add professional feedback, and finalize the result">
        {selectedSubmission ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-[#11161F] p-4">
              <p className="text-[14px] font-semibold text-white">{selectedSubmission.student?.first_name} {selectedSubmission.student?.last_name}</p>
              <p className="mt-1 text-[12px] text-slate-400">Submitted {formatDateTime(selectedSubmission.submitted_at)}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <MiniMetric label="AI Score" value={`${selectedSubmission.ai_score ?? 0}`} />
                <MiniMetric label="AI Total" value={`${selectedSubmission.ai_total ?? selectedSubmission.final_total ?? 0}`} />
                <MiniMetric label="Status" value={selectedSubmission.status} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#11161F] p-4">
              <h3 className="font-['Sora'] text-[15px] font-semibold text-white">Student answers</h3>
              <div className="mt-4 space-y-3">
                {selectedSubmission.answers_json ? (
                  Object.entries(selectedSubmission.answers_json).map(([key, value]) => (
                    <div key={key} className="rounded-2xl border border-slate-800 bg-[#0D1117] p-4">
                      <p className="text-[12px] font-medium text-emerald-300">Question {key}</p>
                      <p className="mt-2 text-[13px] leading-6 text-slate-200">{String(value)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[13px] text-slate-400">No answer payload recorded for this submission.</p>
                )}
              </div>
            </div>

            {Array.isArray(selectedSubmission.ai_feedback_json) && selectedSubmission.ai_feedback_json.length > 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-[#11161F] p-4">
                <h3 className="font-['Sora'] text-[15px] font-semibold text-white">AI feedback snapshot</h3>
                <div className="mt-4 space-y-3">
                  {selectedSubmission.ai_feedback_json.map((item, index) => {
                    const feedback = item as Record<string, unknown>;
                    return (
                      <div key={`${feedback.question_number}-${index}`} className="rounded-2xl border border-slate-800 bg-[#0D1117] p-4">
                        <p className="text-[12px] font-medium text-sky-300">Question {String(feedback.question_number ?? index + 1)}</p>
                        <p className="mt-2 text-[12px] text-slate-300">Earned {String(feedback.earned ?? 0)} / {String(feedback.max ?? 0)}</p>
                        {'correct_answer' in feedback ? <p className="mt-1 text-[12px] text-slate-400">Correct answer: {String(feedback.correct_answer ?? '')}</p> : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium text-slate-300">Teacher score</span>
                <input value={reviewForm.teacher_score} onChange={(event) => setReviewForm((current) => ({ ...current, teacher_score: event.target.value }))} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-amber-500/30" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium text-slate-300">Final total</span>
                <input value={reviewForm.final_total} onChange={(event) => setReviewForm((current) => ({ ...current, final_total: event.target.value }))} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-amber-500/30" />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[12px] font-medium text-slate-300">Teacher feedback</span>
              <textarea value={reviewForm.teacher_feedback} onChange={(event) => setReviewForm((current) => ({ ...current, teacher_feedback: event.target.value }))} rows={5} className="w-full rounded-xl border border-slate-800 bg-[#11161F] px-4 py-3 text-[13px] text-white outline-none transition focus:border-amber-500/30" placeholder="Add concise, actionable feedback for the student." />
            </label>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedSubmission(null)} className="rounded-xl border border-slate-800 px-4 py-2 text-[13px] text-slate-300">Close</button>
              <button type="button" onClick={() => void handleSaveReview()} disabled={reviewSaving} className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[13px] font-medium text-amber-300 disabled:opacity-50">
                {reviewSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Save review
              </button>
            </div>
          </div>
        ) : null}
      </ModalShell>
    </div>
  );
}

function AttachmentList({ attachments, onRemove }: { attachments: ClassroomAttachment[]; onRemove?: (index: number) => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {attachments.map((attachment, index) => (
        <div key={`${attachment.url}-${index}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0D1117] px-3 py-2 text-[12px] text-slate-200">
          <Paperclip size={13} className="text-slate-400" />
          <span className="max-w-[220px] truncate">{attachment.name}</span>
          <a href={attachment.url} target="_blank" rel="noreferrer" className="text-emerald-300 transition hover:text-emerald-200">
            <ExternalLink size={13} />
          </a>
          {onRemove ? (
            <button type="button" onClick={() => onRemove(index)} className="text-rose-300 transition hover:text-rose-200">
              <X size={13} />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function StudentWorkspacePreviewCard({ preview, onBack }: { preview: StudentWorkspacePreview; onBack: () => void }) {
  return (
    <Panel title="Learner Workspace Preview" subtitle="Exactly what this student can currently see and act on">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/25 to-emerald-500/25 text-[14px] font-semibold uppercase text-white">
          {preview.student.first_name[0]}{preview.student.last_name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-white">{preview.student.first_name} {preview.student.last_name}</p>
          <p className="text-[11px] text-slate-400">{preview.student.student_code}</p>
        </div>
        <button type="button" onClick={onBack} className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-[12px] font-medium text-slate-200">
          Back to class
        </button>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-['Sora'] text-[15px] font-semibold text-white">Published classroom posts</h3>
          {preview.posts.length > 0 ? preview.posts.map((post) => (
            <div key={post.id} className="rounded-2xl border border-slate-800 bg-[#11161F] p-4">
              <p className="text-[13px] font-medium text-white">{post.title}</p>
              <p className="mt-1 text-[11px] text-slate-400">{formatDateTime(post.created_at)}</p>
              {post.content ? <p className="mt-3 text-[12px] leading-6 text-slate-300">{post.content}</p> : null}
              {post.attachments?.length ? <AttachmentList attachments={post.attachments} /> : null}
            </div>
          )) : <EmptyState icon={Megaphone} title="No published posts" description="This learner currently has no visible classroom posts." />}
        </div>

        <div className="space-y-3">
          <h3 className="font-['Sora'] text-[15px] font-semibold text-white">Released assessments</h3>
          {preview.assessments.length > 0 ? preview.assessments.map((item) => (
            <div key={item.assessment.id} className="rounded-2xl border border-slate-800 bg-[#11161F] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-medium text-white">{item.assessment.title}</p>
                  <p className="mt-1 text-[11px] text-slate-400">Due {item.assessment.due_date ? formatDateTime(item.assessment.due_date) : 'not set'}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] ${item.submission ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                  {item.submission ? 'Submitted' : 'Awaiting learner'}
                </span>
              </div>
              {item.submission ? (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <MiniMetric label="Status" value={item.submission.status} />
                  <MiniMetric label="Score" value={`${item.submission.final_score ?? item.submission.ai_score ?? 0}/${item.submission.final_total ?? item.submission.ai_total ?? item.assessment.total_marks ?? 0}`} />
                </div>
              ) : null}
            </div>
          )) : <EmptyState icon={PenTool} title="No released assessments" description="Release an assessment to see the learner-facing workspace update here." />}
        </div>
      </div>
    </Panel>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-slate-800 bg-[#0D1117] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
      <div className="mb-5">
        <h2 className="font-['Sora'] text-[18px] font-semibold text-white">{title}</h2>
        <p className="mt-1 text-[12px] text-slate-400">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent: 'emerald' | 'sky' | 'amber' | 'rose' }) {
  const accentClasses = {
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300',
    sky: 'border-sky-500/20 bg-sky-500/5 text-sky-300',
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-300',
    rose: 'border-rose-500/20 bg-rose-500/5 text-rose-300',
  };
  return (
    <div className={`rounded-2xl border p-4 ${accentClasses[accent]}`}>
      <p className="text-[11px] uppercase tracking-[0.2em]">{label}</p>
      <p className="mt-3 font-['JetBrains_Mono'] text-[26px] font-bold text-white">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0D1117] p-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-[12px] font-medium text-white">{value}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: typeof Users; title: string; description: string }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-800 bg-[#11161F] px-6 py-12 text-center">
      <Icon size={32} className="text-slate-500" />
      <h3 className="mt-4 font-['Sora'] text-[16px] font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-[13px] leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function ModalShell({ open, onClose, title, subtitle, children }: { open: boolean; onClose: () => void; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur">
          <div className="flex min-h-full items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-slate-800 bg-[#080B0F] p-6 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-['Sora'] text-[22px] font-semibold text-white">{title}</h2>
                  <p className="mt-1 text-[13px] text-slate-400">{subtitle}</p>
                </div>
                <button type="button" onClick={onClose} className="rounded-full border border-slate-800 p-2 text-slate-300">
                  <X size={16} />
                </button>
              </div>
              {children}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function updateQuestion(index: number, patch: Partial<DraftQuestion>, setAssessmentDraft: React.Dispatch<React.SetStateAction<AssessmentDraft>>) {
  setAssessmentDraft((current) => ({
    ...current,
    questions: current.questions.map((question, questionIndex) => (questionIndex === index ? { ...question, ...patch } : question)),
  }));
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function weekdayLabel(weekday: number) {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][Math.max(0, Math.min(6, weekday - 1))];
}
