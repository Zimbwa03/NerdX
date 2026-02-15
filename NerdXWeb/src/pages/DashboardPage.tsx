/**
 * DashboardPage - Premium Desktop Dashboard
 * Advanced design with gradient cards, floating particles, and glassmorphism
 * Loads live data from Supabase via dashboardDataService
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCreditBalance } from '../utils/creditCalculator';
import { FloatingParticles } from '../components/FloatingParticles';
import { SubjectCard } from '../components/SubjectCard';
import { getStudentBookings } from '../services/api/teacherMarketplaceApi';
import type { LessonBooking } from '../types';
import { LogOut, Calculator, FlaskConical, BookOpen, Monitor, Globe, Receipt, Briefcase, Clock, GraduationCap, MessageCircle, Beaker, TrendingUp, Coins, Wifi, Mic, Atom, Brain, Map, Sparkles, Bell, Sigma, FileText, Wallet, Search, Calendar, Video, ArrowRight, Rss, Heart, BarChart3, Target, Zap, Layers, BookCheck, Compass, MessagesSquare, Loader2 } from 'lucide-react';
import { PostCard } from '../components/marketplace/PostCard';
import { getAllPosts } from '../services/api/teacherMarketplaceApi';
import type { TeacherPost, PostComment } from '../types';
import { toggleLike, addComment, deleteComment } from '../services/api/teacherMarketplaceApi';
import { fetchDashboardData, type DashboardData } from '../services/dashboardDataService';

// O Level subjects with gradient colors and icons
const O_LEVEL_SUBJECTS = [
  { id: 'mathematics', title: 'Mathematics', subtitle: 'Build Strong Math Foundations', icon: Calculator, from: '#2979FF', to: '#1565C0' },
  { id: 'biology', title: 'Biology', subtitle: 'Life Sciences & Organisms', icon: Brain, from: '#00E676', to: '#00C853' },
  { id: 'chemistry', title: 'Chemistry', subtitle: 'Matter & Reactions', icon: Beaker, from: '#00BCD4', to: '#0097A7' },
  { id: 'physics', title: 'Physics', subtitle: 'Forces & Energy', icon: Atom, from: '#5C6BC0', to: '#3949AB' },
  { id: 'sciences', title: 'Combined Science', subtitle: 'Biology - Chemistry - Physics', icon: FlaskConical, from: '#06B6D4', to: '#00E676' },
  { id: 'english', title: 'English', subtitle: 'Read, Write & Communicate', icon: BookOpen, from: '#FF9100', to: '#FF6D00' },
  { id: 'computer_science', title: 'Computer Science', subtitle: 'ZimSec & Cambridge O Level', icon: Monitor, from: '#0288D1', to: '#01579B' },
  { id: 'geography', title: 'Geography', subtitle: 'Explore Our World', icon: Globe, from: '#2E7D32', to: '#1B5E20' },
  { id: 'accounting', title: 'Accounting', subtitle: 'Principles of Accounting', icon: Wallet, from: '#D4AF37', to: '#B8860B' },
  { id: 'commerce', title: 'Commerce', subtitle: 'Business, Trade & Finance', icon: Receipt, from: '#FF9800', to: '#EF6C00' },
  { id: 'business_enterprise_skills', title: 'Business Enterprise', subtitle: 'Leadership & Skills', icon: Briefcase, from: '#14B8A6', to: '#0D9488' },
  { id: 'history', title: 'History', subtitle: 'Explore Past Events', icon: Clock, from: '#5D4037', to: '#4E342E' },
  { id: 'project_assistant', title: 'Project Assistant', subtitle: 'Plan, Research & Succeed', icon: GraduationCap, from: '#7C4DFF', to: '#651FFF' },
];

// A Level subjects
const A_LEVEL_SUBJECTS = [
  { id: 'pure_mathematics', title: 'Pure Mathematics', subtitle: 'Logical & Analytical Skills', icon: Calculator, from: '#8B5CF6', to: '#6D28D9' },
  { id: 'chemistry', title: 'Chemistry', subtitle: 'Matter & Reactions', icon: Beaker, from: '#10B981', to: '#059669' },
  { id: 'physics', title: 'Physics', subtitle: 'Laws of Nature', icon: Atom, from: '#3B82F6', to: '#2563EB' },
  { id: 'biology', title: 'Biology', subtitle: 'Cell Biology & Genetics', icon: Brain, from: '#14B8A6', to: '#0D9488' },
  { id: 'computer_science', title: 'Computer Science', subtitle: 'Code, Algorithms & Systems', icon: Monitor, from: '#0D47A1', to: '#0A3A8A' },
  { id: 'geography', title: 'Geography', subtitle: 'Advanced Concepts', icon: Map, from: '#2E7D32', to: '#1B5E20' },
];

// Feature cards (no images, just gradients and icons)
const FEATURE_CARDS = [
  { id: 'marketplace', title: 'Find a Teacher', subtitle: 'Verified ZIMSEC & Cambridge teachers', icon: Search, from: '#667eea', to: '#764ba2' },
  { id: 'agents', title: 'Agent Hub', subtitle: 'Multi-agent tutoring & coaching', icon: Sparkles, from: '#7C4DFF', to: '#00E676' },
  { id: 'teacher', title: 'Teacher Mode', subtitle: 'Interactive AI Teaching', icon: MessageCircle, from: '#00E676', to: '#00C853' },
  { id: 'virtual_labs', title: 'Virtual Labs', subtitle: 'Interactive Simulations', icon: FlaskConical, from: '#FF6D00', to: '#E65100' },
];

const MORE_TOOLS = [
  { id: 'formula_sheet', title: 'Formula Sheet', subtitle: 'Quick Revision Formulas', icon: Sigma, from: '#2979FF', to: '#7C4DFF' },
  { id: 'past_papers', title: 'Past Papers', subtitle: 'Real Exam Practice', icon: FileText, from: '#FF9100', to: '#FF6D00' },
  { id: 'ai_insights', title: 'AI Insights', subtitle: 'Personal Learning Analytics', icon: TrendingUp, from: '#7C4DFF', to: '#00E676' },
  { id: 'notifications', title: 'Notifications', subtitle: 'Updates and Messages', icon: Bell, from: '#6C63FF', to: '#5A52E0' },
  { id: 'offline', title: 'Offline Chat', subtitle: 'Free - Works Offline', icon: Wifi, from: '#10B981', to: '#059669' },
  { id: 'nerdx_live', title: 'NerdX Live', subtitle: 'Real-time Speech Conversations', icon: Mic, from: '#6C63FF', to: '#5A52E0' },
  { id: 'progress', title: 'My Progress', subtitle: 'Track Your Learning', icon: TrendingUp, from: '#a18cd1', to: '#8B7FD1' },
  { id: 'my_lessons', title: 'My Lessons', subtitle: 'Upcoming Booked Lessons', icon: Calendar, from: '#667eea', to: '#764ba2' },
  { id: 'teacher_dashboard', title: 'Teacher Dashboard', subtitle: 'Manage Your Teaching', icon: GraduationCap, from: '#00E676', to: '#00C853' },
  { id: 'credits', title: 'Credits & Store', subtitle: 'Boost Your Learning', icon: Coins, from: '#fbc2eb', to: '#e8b4d9' },
];

// Live data insight icons mapping
const INSIGHT_ICONS = [
  { label: 'Mastery Score', icon: Target },
  { label: 'Study Streak', icon: Zap },
  { label: 'Predicted Grade', icon: BarChart3 },
];

export function DashboardPage() {
  const [selectedLevel, setSelectedLevel] = useState<'O Level' | 'A Level'>('O Level');
  const [toast, setToast] = useState<string | null>(null);
  const [upcomingLessons, setUpcomingLessons] = useState<LessonBooking[]>([]);
  const [feedPosts, setFeedPosts] = useState<TeacherPost[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  // Fetch student's confirmed bookings
  useEffect(() => {
    if (!userId || isTeacher) return;
    (async () => {
      const bookings = await getStudentBookings(userId);
      const confirmed = bookings.filter((b) => b.status === 'confirmed' && b.room_id);
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

  // Build live insights snapshots for the AI Insights panel
  const insightsSnapshots = dashboardData ? [
    { label: 'Mastery Score', value: `${dashboardData.insights.masteryScore}%`, trend: dashboardData.insights.masteryTrend, icon: Target },
    { label: 'Study Streak', value: `${dashboardData.insights.studyStreak} days`, trend: dashboardData.insights.streakTrend, icon: Zap },
    { label: 'Predicted Grade', value: dashboardData.insights.predictedGrade, trend: dashboardData.insights.gradeTrend, icon: BarChart3 },
  ] : INSIGHT_ICONS.map(i => ({ ...i, value: '--', trend: '--' }));

  // Build weekly activity graph values (7 bars, percentage of max)
  const weeklyGraphValues = dashboardData
    ? dashboardData.weeklyActivity.map(d => {
        const maxVal = Math.max(...dashboardData.weeklyActivity.map(w => w.value), 1);
        return Math.round((d.value / maxVal) * 100);
      })
    : [0, 0, 0, 0, 0, 0, 0];

  const weeklyGraphLabels = dashboardData
    ? dashboardData.weeklyActivity.map(d => d.dayLabel.charAt(0))
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Live subject progress (top 4 for dashboard card)
  const subjectProgressItems = dashboardData
    ? dashboardData.progress.subjects.filter(s => s.value > 0).slice(0, 4)
    : [];

  // If no subjects have data yet, show defaults with 0
  const displaySubjects = subjectProgressItems.length > 0
    ? subjectProgressItems
    : (dashboardData?.progress.subjects.slice(0, 4) || [
        { label: 'Mathematics', value: 0, subject: 'mathematics' },
        { label: 'Biology', value: 0, subject: 'biology' },
        { label: 'Chemistry', value: 0, subject: 'chemistry' },
        { label: 'Physics', value: 0, subject: 'physics' },
      ]);

  // Live levels
  const learningLevels = dashboardData?.levels || [
    { label: 'Foundation', percent: 0, status: 'Locked' },
    { label: 'Core Skills', percent: 0, status: 'Locked' },
    { label: 'Exam Readiness', percent: 0, status: 'Locked' },
    { label: 'Top Performer', percent: 0, status: 'Locked' },
  ];

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
      my_lessons: '/app/marketplace',
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

  return (
    <div className="dashboard-page-v2">
      <FloatingParticles count={20} />

      {toast && (
        <div className="dashboard-toast" role="alert">
          {toast}
        </div>
      )}

      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              <span>{(user?.name || 'S').slice(0, 1)}</span>
            </div>
            <div className="sidebar-profile__meta">
              <span className="sidebar-profile__name">{user?.name ? `${user.name} ${user.surname || ''}`.trim() : 'Student'}</span>
              <span className="sidebar-profile__id">NerdX ID: {user?.nerdx_id || 'N/A'}</span>
            </div>
          </div>

          <Link to="/app/credits" className="credits-card-v2 sidebar-credits">
            <div className="credits-glow" />
            <span className="credits-amount">{formatCreditBalance(user?.credits)}</span>
            <span className="credits-label">Credits</span>
            <span className="credits-add">+</span>
          </Link>

          <nav className="sidebar-nav">
            <a href="#overview" className="sidebar-link"><Layers size={16} /> Overview</a>
            <a href="#ai-insights" className="sidebar-link"><Sparkles size={16} /> AI Insights</a>
            <a href="#progress" className="sidebar-link"><TrendingUp size={16} /> My Progress</a>
            <a href="#learning-hub" className="sidebar-link"><BookCheck size={16} /> Learning Hub</a>
            <a href="#core-modes" className="sidebar-link"><Compass size={16} /> Core Modes</a>
            <a href="#teacher-feed" className="sidebar-link"><MessagesSquare size={16} /> Teacher Feed</a>
            <a href="#tools" className="sidebar-link"><Sigma size={16} /> Tools</a>
          </nav>

          <div className="sidebar-levels">
            <div className="sidebar-levels__header">
              <h4>Your Levels</h4>
              <span>O &amp; A Level</span>
            </div>
            <div className="sidebar-levels__list">
              {dashboardLoading ? (
                <div className="sidebar-levels__loading">
                  <Loader2 size={16} className="spin-icon" /> Loading...
                </div>
              ) : (
                learningLevels.map((level) => (
                  <div key={level.label} className="level-row">
                    <div className="level-row__meta">
                      <span className="level-row__label">{level.label}</span>
                      <span className="level-row__status">{level.status}</span>
                    </div>
                    <div className="level-row__bar">
                      <span style={{ width: `${level.percent}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-hero-v2" id="overview">
            <div className="hero-content">
              <span className="hero-greeting">Welcome back</span>
              <h1 className="hero-name">{user?.name ? `${user.name} ${user.surname || ''}`.trim() : 'Student'}</h1>
              <div className="hero-id">
                <span>Personalized Dashboard</span>
                <code>Adaptive insights</code>
              </div>
            </div>
            <div className="hero-actions">
              <button type="button" className="hero-action" onClick={() => navigate('/app/ai-insights')}>
                <Sparkles size={18} /> View AI Insights
              </button>
              <button type="button" className="hero-action hero-action--ghost" onClick={() => navigate('/app/progress')}>
                <TrendingUp size={18} /> View Progress
              </button>
            </div>
          </section>

          <section className="insights-grid" id="ai-insights">
            <div className="insights-card insights-card--primary">
              <div className="insights-card__header">
                <div>
                  <h3>AI Insights</h3>
                  <p>Real-time learning analytics tailored to you</p>
                </div>
                <Link to="/app/ai-insights" className="insights-link">
                  Open Dashboard <ArrowRight size={16} />
                </Link>
              </div>
              {dashboardLoading ? (
                <div className="insights-loading">
                  <Loader2 size={20} className="spin-icon" />
                  <span>Loading insights...</span>
                </div>
              ) : (
                <>
                  <div className="insights-metrics">
                    {insightsSnapshots.map((stat) => (
                      <div key={stat.label} className="insight-metric">
                        <span className="insight-metric__icon"><stat.icon size={18} /></span>
                        <div>
                          <span className="insight-metric__label">{stat.label}</span>
                          <span className="insight-metric__value">{stat.value}</span>
                        </div>
                        <span className="insight-metric__trend">{stat.trend}</span>
                      </div>
                    ))}
                  </div>
                  <div className="insight-graph">
                    <div className="insight-graph__bars">
                      {weeklyGraphValues.map((value, index) => (
                        <span key={`graph-${index}`} style={{ height: `${Math.max(value, 3)}%` }} title={dashboardData ? `${dashboardData.weeklyActivity[index]?.value || 0} questions` : ''} />
                      ))}
                    </div>
                    <div className="insight-graph__labels">
                      {weeklyGraphLabels.map((label, index) => (
                        <span key={`label-${index}`}>{label}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="insights-card" id="progress">
              <div className="insights-card__header">
                <div>
                  <h3>My Progress</h3>
                  <p>Track mastery across your subjects</p>
                </div>
                <Link to="/app/progress" className="insights-link">
                  Detailed View <ArrowRight size={16} />
                </Link>
              </div>
              {dashboardLoading ? (
                <div className="insights-loading">
                  <Loader2 size={20} className="spin-icon" />
                  <span>Loading progress...</span>
                </div>
              ) : (
                <>
                  <div className="progress-list">
                    {displaySubjects.map((item) => (
                      <div key={item.label} className="progress-row">
                        <span>{item.label}</span>
                        <div className="progress-row__bar">
                          <span style={{ width: `${item.value}%` }} />
                        </div>
                        <span className="progress-row__value">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="next-study">
                    <div>
                      <h4>Next Study Plan</h4>
                      <p>{nextStudyPlan}</p>
                    </div>
                    <button type="button" onClick={() => navigate('/app/progress')}>
                      Start Session <ArrowRight size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="insights-card insights-card--compact">
              <div className="insights-card__header">
                <div>
                  <h3>Recommended Focus</h3>
                  <p>Based on your weakest topics this week</p>
                </div>
              </div>
              {dashboardLoading ? (
                <div className="insights-loading">
                  <Loader2 size={20} className="spin-icon" />
                  <span>Analysing your weak areas...</span>
                </div>
              ) : (
                <>
                  <div className="focus-list">
                    {recommendedFocus.map((focus) => (
                      <div key={focus.title} className={`focus-item ${focus.tone}`}>
                        <div className="focus-item__header">
                          <h4>{focus.title}</h4>
                          {focus.accuracy > 0 && (
                            <span className={`focus-item__accuracy ${focus.accuracy <= 30 ? 'acc-low' : focus.accuracy <= 50 ? 'acc-med' : 'acc-ok'}`}>
                              {focus.accuracy}%
                            </span>
                          )}
                        </div>
                        <span className="focus-item__detail">{focus.detail}</span>
                        {focus.studyTip && (
                          <p className="focus-item__tip">
                            <Sparkles size={12} /> {focus.studyTip}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="study-reminder">
                    <Calendar size={16} />
                    <span>Updates every time you answer questions</span>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="find-teacher-banner" onClick={() => navigate('/app/marketplace')}>
            <div className="find-teacher-banner__bg" />
            <div className="find-teacher-banner__content">
              <div className="find-teacher-banner__icon">
                <GraduationCap size={36} />
              </div>
              <div className="find-teacher-banner__text">
                <h2 className="find-teacher-banner__title">Find a Teacher</h2>
                <p className="find-teacher-banner__subtitle">
                  Book live lessons with verified ZIMSEC &amp; Cambridge teachers
                </p>
              </div>
              <button
                type="button"
                className="find-teacher-banner__cta"
                onClick={(e) => { e.stopPropagation(); navigate('/app/marketplace'); }}
              >
                Browse Teachers <ArrowRight size={16} />
              </button>
            </div>
          </section>

          <section className="learning-hub-v2" id="learning-hub">
            <div className="section-header-v2">
              <h2>Learning Hub</h2>
              <div className="level-toggle-v2">
                <button
                  type="button"
                  className={`level-btn ${selectedLevel === 'O Level' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('O Level')}
                >
                  O Level
                </button>
                <button
                  type="button"
                  className={`level-btn ${selectedLevel === 'A Level' ? 'active' : ''}`}
                  onClick={() => setSelectedLevel('A Level')}
                >
                  A Level
                </button>
              </div>
            </div>

            <div className="subjects-grid-v2">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  title={subject.title}
                  subtitle={subject.subtitle}
                  icon={subject.icon}
                  gradientFrom={subject.from}
                  gradientTo={subject.to}
                  onClick={() => selectedLevel === 'O Level' ? handleSubjectClick(subject.id) : handleALevelClick(subject.id)}
                />
              ))}
            </div>
          </section>

          <section className="features-section-v2" id="core-modes">
            <div className="section-header-v2">
              <h2>Core Modes</h2>
              <p>Agentic Hub, Teacher Mode, and interactive learning spaces</p>
            </div>
            <div className="features-grid-v2">
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

          {upcomingLessons.length > 0 && (
            <section className="upcoming-lessons-v2">
              <h3><Video size={18} /> Upcoming Lessons</h3>
              <div className="upcoming-lessons-grid">
                {upcomingLessons.slice(0, 4).map((lesson) => (
                  <div key={lesson.id} className="upcoming-lesson-card">
                    <div className="upcoming-lesson-card__info">
                      <span className="upcoming-lesson-card__subject">
                        <BookOpen size={14} /> {lesson.subject}
                      </span>
                      <span className="upcoming-lesson-card__time">
                        <Calendar size={12} /> {lesson.date} &middot; {lesson.start_time} - {lesson.end_time}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="vc-join-btn"
                      onClick={() => navigate(`/app/classroom/${lesson.id}`)}
                    >
                      <Video size={14} /> Join Classroom
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="dashboard-feed-preview" id="teacher-feed">
            <div className="section-header-v2">
              <h2><Rss size={18} /> Teacher Feed</h2>
              <Link to="/app/marketplace/feed" className="dashboard-feed-preview__see-all">
                See All <ArrowRight size={14} />
              </Link>
            </div>
            {feedLoading ? (
              <div className="dashboard-feed-preview__loading">
                <div className="feed-skeleton-card" />
                <div className="feed-skeleton-card" />
              </div>
            ) : feedPosts.length > 0 ? (
              <div className="dashboard-feed-preview__posts">
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
              <div className="dashboard-feed-preview__empty">
                <Rss size={24} />
                <p>Teachers haven't posted yet. Check back soon!</p>
                <Link to="/app/marketplace" className="dashboard-feed-preview__browse">
                  Browse Teachers
                </Link>
              </div>
            )}
          </section>

          <section className="more-tools-v2" id="tools">
            <h3>More Tools</h3>
            <div className="tools-grid-v2">
              {MORE_TOOLS.map((tool) => (
                <SubjectCard
                  key={tool.id}
                  title={tool.title}
                  subtitle={tool.subtitle}
                  icon={tool.icon}
                  gradientFrom={tool.from}
                  gradientTo={tool.to}
                  onClick={() => handleSubjectClick(tool.id)}
                />
              ))}
            </div>
          </section>

          <footer className="dashboard-footer-v2">
            <button type="button" className="logout-btn-v2" onClick={() => logout()}>
              <LogOut size={18} /> Sign Out
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
