/**
 * DashboardPage - Premium Desktop Dashboard
 * Advanced design with gradient cards, floating particles, and glassmorphism
 * Loads live data from Supabase via dashboardDataService
 */
import type { ElementType, ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCreditBalance } from '../utils/creditCalculator';
import { SubjectCard } from '../components/SubjectCard';
import {
  AIInsightsCard,
  DashboardLayout,
  HeroStrip,
  LearningHub,
  MyProgressCard,
  RightPanel,
  Sidebar,
  Topbar,
  type DashboardNavId,
} from '../components/dashboard';
import { useCountUp } from '../components/dashboard/useCountUp';
import { getStudentBookings } from '../services/api/teacherMarketplaceApi';
import type { LessonBooking } from '../types';
import { LogOut, Calculator, FlaskConical, BookOpen, Monitor, Globe, Receipt, Briefcase, Clock, GraduationCap, MessageCircle, Beaker, Atom, Brain, Map, Sparkles, Wallet, Calendar, Video, ArrowRight, Rss } from 'lucide-react';
import { PostCard } from '../components/marketplace/PostCard';
import { getAllPosts } from '../services/api/teacherMarketplaceApi';
import type { TeacherPost, PostComment } from '../types';
import { toggleLike, addComment, deleteComment } from '../services/api/teacherMarketplaceApi';
import { fetchDashboardData, type DashboardData } from '../services/dashboardDataService';
import { useUnreadNotificationCount } from '../hooks/useUnreadNotificationCount';
function DashSectionHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ElementType;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="flex flex-wrap items-center gap-2 font-sora text-[22px] font-semibold tracking-tight text-[var(--text-primary)]">
          {Icon ? <Icon className="h-6 w-6 shrink-0 text-[var(--brand)]" strokeWidth={1.5} aria-hidden /> : null}
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl font-dm text-sm leading-relaxed text-[var(--text-secondary)]">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

// O Level subjects with gradient colors and icons
const O_LEVEL_SUBJECTS = [
  { id: 'mathematics', title: 'Mathematics', subtitle: 'Build Strong Math Foundations', icon: Calculator, from: '#10B981', to: '#059669' },
  { id: 'biology', title: 'Biology', subtitle: 'Life Sciences & Organisms', icon: Brain, from: '#00E676', to: '#00C853' },
  { id: 'chemistry', title: 'Chemistry', subtitle: 'Matter & Reactions', icon: Beaker, from: '#00BCD4', to: '#0097A7' },
  { id: 'physics', title: 'Physics', subtitle: 'Forces & Energy', icon: Atom, from: '#6366F1', to: '#4F46E5' },
  { id: 'sciences', title: 'Combined Science', subtitle: 'Biology - Chemistry - Physics', icon: FlaskConical, from: '#06B6D4', to: '#00E676' },
  { id: 'english', title: 'English', subtitle: 'Read, Write & Communicate', icon: BookOpen, from: '#FF9100', to: '#FF6D00' },
  { id: 'computer_science', title: 'Computer Science', subtitle: 'ZimSec & Cambridge O Level', icon: Monitor, from: '#0EA5E9', to: '#0284C7' },
  { id: 'geography', title: 'Geography', subtitle: 'Explore Our World', icon: Globe, from: '#2E7D32', to: '#1B5E20' },
  { id: 'accounting', title: 'Accounting', subtitle: 'Principles of Accounting', icon: Wallet, from: '#D4AF37', to: '#B8860B' },
  { id: 'commerce', title: 'Commerce', subtitle: 'Business, Trade & Finance', icon: Receipt, from: '#FF9800', to: '#EF6C00' },
  { id: 'business_enterprise_skills', title: 'Business Enterprise', subtitle: 'Leadership & Skills', icon: Briefcase, from: '#14B8A6', to: '#0D9488' },
  { id: 'history', title: 'History', subtitle: 'Explore Past Events', icon: Clock, from: '#5D4037', to: '#4E342E' },
];

// A Level subjects
const A_LEVEL_SUBJECTS = [
  { id: 'pure_mathematics', title: 'Pure Mathematics', subtitle: 'Logical & Analytical Skills', icon: Calculator, from: '#10B981', to: '#047857' },
  { id: 'chemistry', title: 'Chemistry', subtitle: 'Matter & Reactions', icon: Beaker, from: '#10B981', to: '#059669' },
  { id: 'physics', title: 'Physics', subtitle: 'Laws of Nature', icon: Atom, from: '#6366F1', to: '#4F46E5' },
  { id: 'biology', title: 'Biology', subtitle: 'Cell Biology & Genetics', icon: Brain, from: '#14B8A6', to: '#0D9488' },
  { id: 'computer_science', title: 'Computer Science', subtitle: 'Code, Algorithms & Systems', icon: Monitor, from: '#0EA5E9', to: '#0284C7' },
  { id: 'geography', title: 'Geography', subtitle: 'Advanced Concepts', icon: Map, from: '#2E7D32', to: '#1B5E20' },
];

// Feature cards (no images, just gradients and icons)
const FEATURE_CARDS = [
  { id: 'agents', title: 'Agent Hub', subtitle: 'Multi-agent tutoring & coaching', icon: Sparkles, from: '#10B981', to: '#00E676' },
  { id: 'teacher', title: 'Teacher Mode', subtitle: 'Interactive AI Teaching', icon: MessageCircle, from: '#00E676', to: '#00C853' },
  { id: 'virtual_labs', title: 'Virtual Labs', subtitle: 'Interactive Simulations', icon: FlaskConical, from: '#FF6D00', to: '#E65100' },
  {
    id: 'project_assistant',
    title: 'Project Assistant',
    subtitle: 'Plan, Research & Succeed',
    icon: GraduationCap,
    from: '#10B981',
    to: '#059669',
  },
];

export function DashboardPage() {
  const [selectedLevel, setSelectedLevel] = useState<'O Level' | 'A Level'>('O Level');
  const [toast, setToast] = useState<string | null>(null);
  const [upcomingLessons, setUpcomingLessons] = useState<LessonBooking[]>([]);
  const [feedPosts, setFeedPosts] = useState<TeacherPost[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<DashboardNavId>('overview');
  const { user, logout, isSupabaseAuthReady } = useAuth();
  const navigate = useNavigate();
  const unreadCount = useUnreadNotificationCount(isSupabaseAuthReady);
  const creditsAnimated = useCountUp(formatCreditBalance(user?.credits), 1400, true);

  // Redirect teachers to their dashboard
  useEffect(() => {
    if (user?.role === 'teacher' || user?.is_teacher) {
      navigate('/app/teacher-dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Stable references for data fetching (only change on login/logout, not credit updates)
  const userId = user?.id;
  const userRole = user?.role;
  const isTeacher = userRole === 'teacher';

  // Fetch live dashboard data (AI Insights, Progress, Levels, Weekly Activity)
  const loadDashboardData = useCallback(async () => {
    if (!userId || isTeacher) return;
    setDashboardLoading(true);
    try {
      const data = await fetchDashboardData(userId);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setDashboardLoading(false);
    }
  }, [userId, isTeacher]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const root = document.getElementById('dashboard-main-scroll');
    if (!root) return;
    const ids: DashboardNavId[] = [
      'overview',
      'learning-hub',
      'core-modes',
      'ai-insights',
      'progress',
      'teacher-feed',
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.12)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        const raw = visible?.target?.id;
        if (raw && ids.includes(raw as DashboardNavId)) {
          setActiveNav(raw as DashboardNavId);
        }
      },
      { root, rootMargin: '-12% 0px -48% 0px', threshold: [0.08, 0.18, 0.35] },
    );
    const observeAll = () => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };
    observeAll();
    const raf = window.requestAnimationFrame(observeAll);
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  // Fetch student's confirmed bookings (including those waiting for room setup)
  useEffect(() => {
    if (!userId || isTeacher) return;
    (async () => {
      const bookings = await getStudentBookings(userId);
      const now = Date.now();
      const confirmed = bookings
        .filter((b) => b.status === 'confirmed')
        .filter((b) => {
          const normalizedStartTime = b.start_time?.split(':').length === 2 ? `${b.start_time}:00` : b.start_time;
          const lessonTime = new Date(`${b.date}T${normalizedStartTime || '00:00:00'}`).getTime();
          // Keep upcoming lessons and any very recent lesson still in progress.
          return Number.isNaN(lessonTime) || lessonTime >= now - (24 * 60 * 60 * 1000);
        })
        .sort((a, b) => {
          const aTime = new Date(`${a.date}T${a.start_time?.split(':').length === 2 ? `${a.start_time}:00` : a.start_time || '00:00:00'}`).getTime();
          const bTime = new Date(`${b.date}T${b.start_time?.split(':').length === 2 ? `${b.start_time}:00` : b.start_time || '00:00:00'}`).getTime();
          if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
          return aTime - bTime;
        });
      setUpcomingLessons(confirmed);
    })();
  }, [userId, isTeacher]);

  // Fetch latest posts for feed preview
  useEffect(() => {
    if (!userId || isTeacher) return;
    (async () => {
      setFeedLoading(true);
      try {
        const posts = await getAllPosts(1, 3, userId);
        setFeedPosts(posts);
      } catch {
        // silent fail
      } finally {
        setFeedLoading(false);
      }
    })();
  }, [userId, isTeacher]);

  // Live recommended focus (from actual failed topics)
  const recommendedFocus = dashboardData?.recommendedFocus || [
    { title: 'Start Practicing', detail: 'Answer questions to get AI recommendations', tone: 'focus-med', studyTip: 'Try answering 10 questions in any subject to get started.', subject: '', accuracy: 0, attempts: 0 },
  ];

  // Next study plan text
  const nextStudyPlan = dashboardData?.progress.nextStudyPlan || 'Start answering questions to get personalized study plans';

  // Post interaction handlers
  const handlePostLike = async (postId: string) => {
    if (!user) return { liked: false, newCount: 0 };
    return toggleLike(postId, user.id);
  };

  const handleAddComment = async (postId: string, content: string): Promise<PostComment | null> => {
    if (!user) return null;
    return addComment(postId, user.id, user.name || 'Student', content);
  };

  const handleDeleteComment = (commentId: string, postId: string) => {
    deleteComment(commentId);
  };

  const showComingSoon = () => {
    setToast('Coming soon - available on the NerdX mobile app');
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubjectClick = (id: string) => {
    const routeMap: Record<string, string> = {
      credits: '/app/credits',
      progress: '/app/progress',
      ai_insights: '/app/ai-insights',
      notifications: '/app/notifications',
      agents: '/app/agents',
      referral: '/app/referral',
      billing: '/app/billing',
      security: '/app/security',
      preferences: '/app/preferences',
      mathematics: '/app/mathematics',
      biology: '/app/biology',
      chemistry: '/app/chemistry',
      physics: '/app/physics',
      sciences: '/app/sciences',
      english: '/app/english',
      computer_science: '/app/computer-science',
      geography: '/app/geography',
      accounting: '/app/accounting',
      commerce: '/app/commerce',
      business_enterprise_skills: '/app/business-enterprise-skills',
      history: '/app/history',
      teacher: '/app/teacher',
      marketplace: '/app/marketplace',
      my_lessons: '/app/my-lessons',
      teacher_dashboard: '/app/teacher-dashboard',
      virtual_labs: '/app/virtual-lab',
      formula_sheet: '/app/formula-sheet',
      past_papers: '/app/past-papers',
      project_assistant: '/app/project-assistant',
      nerdx_live: '/app/nerdx-live',
      offline: '/app/offline',
    };

    if (routeMap[id]) {
      navigate(routeMap[id]);
    } else {
      showComingSoon();
    }
  };

  const handleALevelClick = (id: string) => {
    const routeMap: Record<string, string> = {
      pure_mathematics: '/app/pure-math',
      chemistry: '/app/a-level-chemistry',
      physics: '/app/a-level-physics',
      biology: '/app/a-level-biology',
      computer_science: '/app/a-level-computer-science',
      geography: '/app/a-level-geography',
    };

    if (routeMap[id]) {
      navigate(routeMap[id]);
    } else {
      showComingSoon();
    }
  };

  const subjects = selectedLevel === 'O Level' ? O_LEVEL_SUBJECTS : A_LEVEL_SUBJECTS;

  const firstName = (user?.name || 'Student').split(/\s+/)[0] || 'Student';
  const displayFullName = user?.name ? `${user.name} ${user.surname || ''}`.trim() : 'Student';
  const progressList = dashboardData?.progress.subjects ?? [];
  const subjectProgressTop = dashboardData
    ? dashboardData.progress.subjects.filter((s) => s.value > 0).slice(0, 6)
    : [];
  const progressForCard =
    subjectProgressTop.length > 0
      ? subjectProgressTop
      : dashboardData?.progress.subjects.slice(0, 6) || [
          { label: 'Mathematics', value: 0, subject: 'mathematics' },
          { label: 'Biology', value: 0, subject: 'biology' },
          { label: 'Chemistry', value: 0, subject: 'chemistry' },
          { label: 'Physics', value: 0, subject: 'physics' },
          { label: 'English', value: 0, subject: 'english' },
          { label: 'Geography', value: 0, subject: 'geography' },
        ];

  const masteryFor = (id: string) => progressList.find((p) => p.subject === id)?.value ?? 0;
  const learningSubjects = subjects.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    icon: s.icon,
    masteryPercent: masteryFor(s.id),
  }));

  const skills = dashboardData?.knowledgeMap?.skills ?? [];
  const topicsCovered = skills.length;
  const topicsTrend =
    topicsCovered >= 12 ? '+strong coverage' : topicsCovered > 0 ? '+growing' : 'Start tracking skills';

  const weeklyForChart =
    dashboardData?.weeklyActivity && dashboardData.weeklyActivity.length > 0
      ? dashboardData.weeklyActivity
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayLabel) => ({ dayLabel, value: 0 }));

  const recentActivity = feedPosts.slice(0, 5).map((p) => ({
    id: p.id,
    title:
      (p.content?.trim() || 'Teacher post').slice(0, 72) + (p.content && p.content.length > 72 ? '…' : ''),
    time: new Date(p.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }));

  const ins = dashboardData?.insights;

  return (
    <>
      {toast ? (
        <div className="dashboard-toast" role="alert">
          {toast}
        </div>
      ) : null}

      <DashboardLayout
        mobileNavOpen={mobileNavOpen}
        onMobileNavClose={() => setMobileNavOpen(false)}
        topbar={
          <Topbar
            userInitial={(user?.name || 'S').slice(0, 1)}
            hasUnreadNotifications={unreadCount > 0}
            onMobileMenuClick={() => setMobileNavOpen(true)}
          />
        }
        sidebar={
          <Sidebar
            displayName={displayFullName}
            userInitial={(user?.name || 'S').slice(0, 1)}
            nerdxId={user?.nerdx_id || 'N/A'}
            creditsRaw={formatCreditBalance(user?.credits)}
            activeNav={activeNav}
            onNavigate={setActiveNav}
            onCloseMobile={() => setMobileNavOpen(false)}
          />
        }
        rightPanel={
          <RightPanel
            upcomingLessons={upcomingLessons}
            nextStudyPlan={nextStudyPlan}
            masteryScore={ins?.masteryScore ?? 0}
            studyStreak={ins?.studyStreak ?? 0}
            predictedGrade={ins?.predictedGrade ?? '—'}
            recentActivity={recentActivity}
          />
        }
      >
        <HeroStrip
          firstName={firstName}
          masteryPercent={ins?.masteryScore ?? 0}
          streakDays={ins?.studyStreak ?? 0}
          creditsDisplay={creditsAnimated}
        />
        <LearningHub
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          subjects={learningSubjects}
          onSubjectClick={(id) =>
            selectedLevel === 'O Level' ? handleSubjectClick(id) : handleALevelClick(id)
          }
        />
        <AIInsightsCard
          loading={dashboardLoading}
          masteryScore={ins?.masteryScore ?? 0}
          masteryTrend={ins?.masteryTrend ?? '—'}
          studyStreak={ins?.studyStreak ?? 0}
          streakTrend={ins?.streakTrend ?? '—'}
          predictedGrade={ins?.predictedGrade ?? '—'}
          gradeTrend={ins?.gradeTrend ?? '—'}
          topicsCovered={topicsCovered}
          topicsTrend={topicsTrend}
          weeklyActivity={weeklyForChart}
        />
        <MyProgressCard
          loading={dashboardLoading}
          subjects={progressForCard}
          nextStudyPlan={nextStudyPlan}
        />

        <section
          className="animate-dash-fade-up mb-10 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-7 opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]"
          aria-labelledby="recommended-focus-title"
        >
          <div className="mb-6">
            <h2 id="recommended-focus-title" className="font-sora text-[17px] font-semibold text-[var(--text-primary)]">
              Recommended focus
            </h2>
            <p className="mt-1 font-dm text-xs text-[var(--text-secondary)]">Based on your weakest topics this week</p>
          </div>
          {dashboardLoading ? (
            <p className="font-dm text-sm text-[var(--text-secondary)]">Analysing your weak areas…</p>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {recommendedFocus.map((focus) => (
                  <div
                    key={focus.title}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5"
                  >
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h3 className="font-dm text-sm font-semibold text-[var(--text-primary)]">{focus.title}</h3>
                      {focus.accuracy > 0 ? (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 font-jetbrains text-xs font-medium ${
                            focus.accuracy <= 30
                              ? 'bg-rose-500/15 text-rose-400'
                              : focus.accuracy <= 50
                                ? 'bg-amber-500/15 text-amber-400'
                                : 'bg-emerald-500/15 text-emerald-400'
                          }`}
                        >
                          {focus.accuracy}%
                        </span>
                      ) : null}
                    </div>
                    <p className="font-dm text-sm text-[var(--text-secondary)]">{focus.detail}</p>
                    {focus.studyTip ? (
                      <p className="mt-3 flex items-start gap-2 font-dm text-xs text-[var(--text-muted)]">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--brand)]" strokeWidth={1.5} aria-hidden />
                        {focus.studyTip}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 font-dm text-xs text-[var(--text-muted)]">
                <Calendar className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                <span>Updates every time you answer questions</span>
              </div>
            </>
          )}
        </section>

        <section className="mb-12 scroll-mt-24" id="core-modes">
          <DashSectionHeader
            title="Core modes"
            subtitle="Agent hub, teacher mode, virtual labs, project assistant — your main learning spaces."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {FEATURE_CARDS.map((card) => (
              <SubjectCard
                key={card.id}
                title={card.title}
                subtitle={card.subtitle}
                icon={card.icon}
                gradientFrom={card.from}
                gradientTo={card.to}
                onClick={() => handleSubjectClick(card.id)}
              />
            ))}
          </div>
        </section>

        <section className="mb-12 scroll-mt-24">
          <DashSectionHeader
            title="Upcoming lessons"
            subtitle="Your next confirmed live sessions with marketplace teachers."
            icon={Video}
            action={
              <Link
                to="/app/my-lessons"
                className="inline-flex items-center gap-1.5 font-dm text-sm font-semibold text-[var(--brand)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
              >
                View all <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Link>
            }
          />
          {upcomingLessons.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {upcomingLessons.slice(0, 4).map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition-colors hover:border-[var(--border-accent)] md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-sora text-sm font-semibold text-[var(--text-primary)]">
                      <BookOpen className="h-4 w-4 shrink-0 text-[var(--brand)]" strokeWidth={1.5} aria-hidden />
                      {lesson.subject}
                    </p>
                    <p className="mt-2 flex flex-wrap items-center gap-2 font-dm text-xs text-[var(--text-secondary)]">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" strokeWidth={1.5} aria-hidden />
                      <span>
                        {lesson.date} · {lesson.start_time} – {lesson.end_time}
                      </span>
                    </p>
                  </div>
                  {lesson.room_id ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/app/classroom/${lesson.id}`)}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 font-dm text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] active:scale-[0.98]"
                      aria-label={`Join classroom for ${lesson.subject}`}
                    >
                      <Video className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      Join classroom
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/app/my-lessons')}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--bg-elevated)] px-4 py-2.5 font-dm text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
                      aria-label="Open my lessons — room not ready yet"
                    >
                      <Clock className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      Room not ready
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--border-accent)] bg-[var(--bg-surface)] px-6 py-10 text-center">
              <p className="mx-auto max-w-md font-dm text-sm leading-relaxed text-[var(--text-secondary)]">
                No confirmed lessons yet. Book teachers from the marketplace and track every session in My Lessons.
              </p>
              <button
                type="button"
                onClick={() => navigate('/app/my-lessons')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-2.5 font-dm text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
              >
                Open My Lessons <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          )}
        </section>

        <section className="mb-12 scroll-mt-24" id="teacher-feed">
          <DashSectionHeader
            title="Teacher feed"
            subtitle="Posts and tips from verified ZIMSEC and Cambridge teachers."
            icon={Rss}
            action={
              <Link
                to="/app/marketplace/feed"
                className="inline-flex items-center gap-1.5 font-dm text-sm font-semibold text-[var(--brand)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
              >
                See all <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Link>
            }
          />
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 md:p-6">
            {feedLoading ? (
              <div className="flex flex-col gap-4">
                <div className="h-24 animate-pulse rounded-xl bg-[var(--bg-elevated)]" />
                <div className="h-24 animate-pulse rounded-xl bg-[var(--bg-elevated)]" />
              </div>
            ) : feedPosts.length > 0 ? (
              <div className="flex flex-col gap-4">
                {feedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={user?.id}
                    currentUserName={user?.name}
                    onLike={handlePostLike}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Rss className="mb-4 h-10 w-10 text-[var(--text-muted)]" strokeWidth={1.5} aria-hidden />
                <p className="max-w-sm font-dm text-sm text-[var(--text-secondary)]">
                  Teachers haven&apos;t posted yet. Check back soon or browse the marketplace.
                </p>
                <Link
                  to="/app/marketplace"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--brand-dim)] px-4 py-2 font-dm text-sm font-semibold text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
                >
                  Browse teachers <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                </Link>
              </div>
            )}
          </div>
        </section>

        <footer className="mt-14 border-t border-[var(--border)] pt-10 pb-8">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-dm text-sm text-[var(--text-muted)]">End your session on this device</p>
              <button
                type="button"
                onClick={() => logout()}
                className="group inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-xl border border-[var(--border-accent)] bg-[var(--bg-elevated)] px-5 py-3 font-dm text-sm font-semibold text-[var(--text-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] transition-[color,background-color,border-color,box-shadow,transform] duration-200 hover:border-rose-400/45 hover:bg-rose-500/[0.12] hover:text-rose-100 hover:shadow-[0_2px_12px_rgba(244,63,94,0.12)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] sm:w-auto sm:justify-start"
                aria-label="Sign out"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-surface)] text-rose-300 transition-colors group-hover:bg-rose-500/20 group-hover:text-rose-200">
                  <LogOut className="h-[18px] w-[18px]" strokeWidth={2.25} aria-hidden />
                </span>
                Sign out
              </button>
            </div>
          </div>
        </footer>
      </DashboardLayout>
    </>
  );
}
