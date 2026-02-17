import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FloatingParticles } from '../../components/FloatingParticles';
import { StarRating } from '../../components/marketplace/StarRating';
import { AvailabilityGrid } from '../../components/marketplace/AvailabilityGrid';
import { PostCard } from '../../components/marketplace/PostCard';
import { CreatePostForm } from '../../components/marketplace/CreatePostForm';
import { TeacherAnalyticsCharts } from '../../components/marketplace/TeacherAnalyticsCharts';
import { LessonCalendarWidget } from '../../components/marketplace/LessonCalendarWidget';
import { StudentFeedbackFeed } from '../../components/marketplace/StudentFeedbackFeed';
import { QuickStartLesson } from '../../components/marketplace/QuickStartLesson';
import { ActivityTimeline } from '../../components/marketplace/ActivityTimeline';
import {
  getTeacherProfileByUserId,
  getTeacherBookings,
  setTeacherAvailability,
  updateBookingStatus,
  getTeacherPosts,
  createPost,
  deletePost as deletePostApi,
  toggleLike,
  addComment,
  deleteComment,
  getTeacherDashboardStats,
  getStudentFeedbackFeed,
  getWeeklyLessonData,
  getMonthlyRatingTrend,
  getTeacherActivityTimeline,
} from '../../services/api/teacherMarketplaceApi';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../../data/marketplaceConstants';
import type {
  TeacherProfile, LessonBooking, DayOfWeek, TeacherPost, PostComment, PostType,
  TeacherDashboardStats, WeeklyLessonData, EngagementData, MonthlyRatingData,
  SubjectDistribution, FeedbackItem, ActivityItem,
} from '../../types';
import {
  ArrowLeft, User, ShieldCheck, Clock, Calendar, Star, BookOpen,
  MessageSquare, Loader2, Edit3, Plus, Trash2, Check, X,
  AlertCircle, CheckCircle, BarChart3, Rss, Video, TrendingUp,
  Award, Users, Zap, ChevronRight, Settings, LayoutDashboard, Menu,
  DollarSign, Wallet, Smartphone, CreditCard,
} from 'lucide-react';
import { walletApi, type EarningsDashboard, type TeacherEarning, type TeacherPayout } from '../../services/api/walletApi';

type SidebarSection = 'overview' | 'lessons' | 'posts' | 'availability' | 'bookings' | 'earnings';

export function TeacherDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Core state
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [bookings, setBookings] = useState<LessonBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SidebarSection>('overview');
  const [myPosts, setMyPosts] = useState<TeacherPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Analytics state
  const [dashStats, setDashStats] = useState<TeacherDashboardStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyLessonData[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [ratingTrend, setRatingTrend] = useState<MonthlyRatingData[]>([]);
  const [subjectDist, setSubjectDist] = useState<SubjectDistribution[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Availability editor
  const [editingAvailability, setEditingAvailability] = useState(false);
  const [availSlots, setAvailSlots] = useState<{ day_of_week: DayOfWeek; start_time: string; end_time: string }[]>([]);
  const [savingAvail, setSavingAvail] = useState(false);

  // Earnings state
  const [earningsData, setEarningsData] = useState<EarningsDashboard | null>(null);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutPhone, setPayoutPhone] = useState('');
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState('');
  const [payoutError, setPayoutError] = useState('');

  // Redirect non-teachers
  useEffect(() => {
    if (user && user.role === 'student' && !user.is_teacher) {
      navigate('/app', { replace: true });
    }
  }, [user, navigate]);

  // Stable user ID reference - prevents re-fetching when user object changes (e.g. credit updates)
  const userId = user?.id;

  // Load profile and bookings - only re-run when the actual user identity changes, not on credit refreshes
  useEffect(() => {
    async function load() {
      if (!userId) return;
      setLoading(true);
      const teacherProfile = await getTeacherProfileByUserId(userId);
      if (teacherProfile) {
        setProfile(teacherProfile);
        const bk = await getTeacherBookings(teacherProfile.id);
        setBookings(bk);
        setAvailSlots(
          (teacherProfile.availability || []).map(a => ({
            day_of_week: a.day_of_week,
            start_time: a.start_time,
            end_time: a.end_time,
          })),
        );
      }
      setLoading(false);
    }
    load();
  }, [userId]);

  // Load analytics data after profile loads
  useEffect(() => {
    if (!profile) return;
    let cancelled = false;

    (async () => {
      setAnalyticsLoading(true);
      try {
        const [stats, chartData, ratings, feedback, activity] = await Promise.all([
          getTeacherDashboardStats(profile.id),
          getWeeklyLessonData(profile.id),
          getMonthlyRatingTrend(profile.id),
          getStudentFeedbackFeed(profile.id),
          getTeacherActivityTimeline(profile.id),
        ]);

        if (cancelled) return;

        if (stats) setDashStats(stats);
        setWeeklyData(chartData.weekly);
        setEngagementData(chartData.engagement);
        setSubjectDist(chartData.subjects);
        setRatingTrend(ratings);
        setFeedbackItems(feedback);
        setActivityItems(activity);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      }
      if (!cancelled) setAnalyticsLoading(false);
    })();

    return () => { cancelled = true; };
  }, [profile?.id]);

  // Load posts when section is opened - use stable userId to prevent re-fetches
  useEffect(() => {
    if (activeSection !== 'posts' || !profile) return;
    let cancelled = false;
    (async () => {
      setPostsLoading(true);
      const data = await getTeacherPosts(profile.id, userId);
      if (!cancelled) {
        setMyPosts(data);
        setPostsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeSection, profile?.id, userId]);

  // Load earnings when section is opened
  useEffect(() => {
    if (activeSection !== 'earnings') return;
    let cancelled = false;
    (async () => {
      setEarningsLoading(true);
      const data = await walletApi.getEarningsDashboard();
      if (!cancelled && data) {
        setEarningsData(data);
      }
      if (!cancelled) setEarningsLoading(false);
    })();
    return () => { cancelled = true; };
  }, [activeSection]);

  // Payout handler
  const handleRequestPayout = async () => {
    if (!payoutPhone.trim()) {
      setPayoutError('Please enter your EcoCash number');
      return;
    }
    setRequestingPayout(true);
    setPayoutError('');
    setPayoutSuccess('');
    const result = await walletApi.requestPayout(payoutPhone.trim());
    if (result.success) {
      setPayoutSuccess(result.message);
      setShowPayoutModal(false);
      setPayoutPhone('');
      // Refresh earnings data
      const data = await walletApi.getEarningsDashboard();
      if (data) setEarningsData(data);
    } else {
      setPayoutError(result.message);
    }
    setRequestingPayout(false);
  };

  // Booking handlers
  const handleConfirmBooking = useCallback(async (bookingId: string) => {
    const success = await updateBookingStatus(bookingId, 'confirmed');
    if (success && profile) {
      const refreshed = await getTeacherBookings(profile.id);
      setBookings(refreshed);
    } else if (!success) {
      window.alert('Cannot confirm this booking yet. Student lesson wallet balance is below $0.50.');
    }
  }, [profile]);

  const handleCancelBooking = useCallback(async (bookingId: string) => {
    const success = await updateBookingStatus(bookingId, 'cancelled');
    if (success) {
      const booking = bookings.find((b) => b.id === bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      // Teacher-initiated cancellation always refunds the student
      if (booking) {
        const normalizedStartTime = booking.start_time?.split(':').length === 2
          ? `${booking.start_time}:00`
          : booking.start_time;
        const scheduledTime = `${booking.date}T${normalizedStartTime}`;
        walletApi.cancelLesson(
          bookingId,
          'teacher',
          scheduledTime,
          booking.student_id,
        ).catch(() => {
          // Refund is best-effort; if there was no payment, the API returns gracefully.
        });
      }
    }
  }, [bookings]);

  // Availability handlers
  const handleAddSlot = () => {
    setAvailSlots([...availSlots, { day_of_week: 'Monday', start_time: '09:00', end_time: '10:00' }]);
  };
  const handleRemoveSlot = (idx: number) => setAvailSlots(availSlots.filter((_, i) => i !== idx));
  const handleSlotChange = (idx: number, field: string, value: string) => {
    setAvailSlots(availSlots.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };
  const handleSaveAvailability = async () => {
    if (!profile) return;
    setSavingAvail(true);
    const success = await setTeacherAvailability(profile.id, availSlots);
    if (success) {
      setEditingAvailability(false);
      const updated = await getTeacherProfileByUserId(userId!);
      if (updated) setProfile(updated);
    }
    setSavingAvail(false);
  };

  // Post handlers
  const handleCreatePost = async (teacherId: string, content: string, postType: PostType, mediaUrl?: string | null, subjectTag?: string | null) => {
    return createPost(teacherId, content, postType, mediaUrl, subjectTag);
  };
  const handlePostCreated = (newPost: TeacherPost) => setMyPosts(prev => [newPost, ...prev]);
  const handleDeletePost = async (postId: string) => {
    const success = await deletePostApi(postId);
    if (success) setMyPosts(prev => prev.filter(p => p.id !== postId));
  };
  const handleLikePost = async (postId: string) => {
    if (!user) return { liked: false, newCount: 0 };
    const result = await toggleLike(postId, user.id);
    setMyPosts(prev => prev.map(p => p.id === postId ? { ...p, user_has_liked: result.liked, likes_count: result.newCount } : p));
    return result;
  };
  const handleAddComment = async (postId: string, content: string, parentId?: string | null): Promise<PostComment | null> => {
    if (!user) return null;
    const userName = `${user.name} ${user.surname?.charAt(0) || ''}.`;
    return addComment(postId, user.id, userName, content, parentId);
  };
  const handleDeleteComment = async (commentId: string, postId: string) => {
    await deleteComment(commentId, postId);
    setMyPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: Math.max(0, p.comments_count - 1) } : p));
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const statusConfig = profile ? {
    pending: { icon: Clock, label: 'Pending Verification', cls: 'pending' },
    approved: { icon: CheckCircle, label: 'Verified Teacher', cls: 'approved' },
    rejected: { icon: AlertCircle, label: 'Rejected', cls: 'rejected' },
  }[profile.verification_status] : { icon: Clock, label: 'Loading...', cls: 'pending' };

  const StatusIcon = statusConfig.icon;

  const sidebarNav: { id: SidebarSection; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'lessons', label: 'Lessons', icon: BookOpen, badge: confirmedBookings.length },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badge: pendingBookings.length },
    { id: 'posts', label: 'My Posts', icon: Rss },
    { id: 'availability', label: 'Availability', icon: Clock },
  ];

  // Skeleton placeholder for loading panels - deterministic widths to avoid re-render jitter
  const SKELETON_WIDTHS = ['100%', '85%', '92%', '78%', '95%', '88%', '70%', '82%'];
  const SkeletonBlock = ({ lines = 3, wide = false }: { lines?: number; wide?: boolean }) => (
    <div className="td-v2-skeleton">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="td-v2-skeleton__line"
          style={{ width: wide ? '100%' : SKELETON_WIDTHS[i % SKELETON_WIDTHS.length] }}
        />
      ))}
    </div>
  );

  return (
    <div className="td-v2">
      <FloatingParticles count={12} />

      {/* Mobile header */}
      <div className="td-v2-mobile-header">
        <Link to="/app" className="td-v2-mobile-header__back">
          <ArrowLeft size={20} />
        </Link>
        <h1>Teacher Dashboard</h1>
        <button className="td-v2-mobile-header__menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar - always visible, with loading-safe content */}
      <aside className={`td-v2-sidebar ${sidebarOpen ? 'td-v2-sidebar--open' : ''}`}>
        <div className="td-v2-sidebar__header">
          <Link to="/app" className="td-v2-sidebar__back">
            <ArrowLeft size={18} />
            <span>Back to App</span>
          </Link>
        </div>

        {/* Profile card in sidebar */}
        <div className="td-v2-sidebar__profile">
          {loading ? (
            <>
              <div className="td-v2-sidebar__avatar">
                <div className="td-v2-sidebar__avatar-placeholder"><User size={28} /></div>
              </div>
              <div className="td-v2-skeleton__line" style={{ width: '60%', height: '14px', borderRadius: '6px' }} />
              <div className="td-v2-skeleton__line" style={{ width: '40%', height: '10px', borderRadius: '6px' }} />
            </>
          ) : profile ? (
            <>
              <div className="td-v2-sidebar__avatar">
                {profile.profile_image_url ? (
                  <img src={profile.profile_image_url} alt={profile.full_name} />
                ) : (
                  <div className="td-v2-sidebar__avatar-placeholder"><User size={28} /></div>
                )}
                {profile.verification_status === 'approved' && (
                  <span className="td-v2-sidebar__verified"><ShieldCheck size={12} /></span>
                )}
              </div>
              <h3 className="td-v2-sidebar__name">{profile.full_name} {profile.surname}</h3>
              <div className={`td-v2-sidebar__status td-v2-sidebar__status--${statusConfig.cls}`}>
                <StatusIcon size={12} /> {statusConfig.label}
              </div>
              <div className="td-v2-sidebar__rating">
                <StarRating rating={profile.average_rating || 0} size={13} showValue reviewCount={profile.total_reviews} />
              </div>
            </>
          ) : (
            <>
              <div className="td-v2-sidebar__avatar">
                <div className="td-v2-sidebar__avatar-placeholder"><User size={28} /></div>
              </div>
              <h3 className="td-v2-sidebar__name">{user?.name || 'Teacher'}</h3>
              <div className="td-v2-sidebar__status td-v2-sidebar__status--pending">
                <AlertCircle size={12} /> No Profile
              </div>
            </>
          )}
        </div>

        {/* Navigation - always visible */}
        <nav className="td-v2-sidebar__nav">
          {sidebarNav.map(item => {
            const NavIcon = item.icon;
            return (
              <button
                key={item.id}
                className={`td-v2-sidebar__nav-item ${activeSection === item.id ? 'td-v2-sidebar__nav-item--active' : ''}`}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              >
                <NavIcon size={18} />
                <span>{item.label}</span>
                {!loading && item.badge != null && item.badge > 0 && (
                  <span className="td-v2-sidebar__badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Start in sidebar */}
        <div className="td-v2-sidebar__quick-start">
          <QuickStartLesson bookings={bookings} onConfirmBooking={handleConfirmBooking} loading={loading} />
        </div>

        {/* View profile link */}
        {profile && (
          <button
            className="td-v2-sidebar__view-profile"
            onClick={() => navigate(`/app/marketplace/teacher/${profile.id}`)}
          >
            <Edit3 size={14} /> View Public Profile
            <ChevronRight size={14} />
          </button>
        )}
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="td-v2-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="td-v2-main">
        {/* No profile state - shown inside the main area, not replacing the whole page */}
        {!loading && !profile && (
          <div className="td-v2-no-profile-inline">
            <div className="td-v2-no-profile-inline__content">
              <User size={56} />
              <h2>No Teacher Profile Found</h2>
              <p>You haven't created a teacher profile yet. Get started to reach students!</p>
              <button className="td-v2-btn td-v2-btn--primary td-v2-btn--lg" onClick={() => navigate('/app/teacher-onboarding')}>
                <Plus size={18} /> Create Teacher Profile
              </button>
            </div>
          </div>
        )}
        {/* ═══════════ OVERVIEW SECTION ═══════════ */}
        {activeSection === 'overview' && (loading || profile) && (
          <div className="td-v2-overview">
            {/* Hero header */}
            <div className="td-v2-hero">
              <div className="td-v2-hero__text">
                {loading ? (
                  <>
                    <div className="td-v2-skeleton__line" style={{ width: '260px', height: '22px', borderRadius: '8px', marginBottom: '8px' }} />
                    <div className="td-v2-skeleton__line" style={{ width: '200px', height: '14px', borderRadius: '6px' }} />
                  </>
                ) : (
                  <>
                    <h1>Welcome back, {profile!.full_name.split(' ')[0]}!</h1>
                    <p>Here's what's happening with your teaching today.</p>
                  </>
                )}
              </div>
              {!loading && (
                <div className="td-v2-hero__badges">
                  <div className="td-v2-hero__badge">
                    <Zap size={16} />
                    <span>{confirmedBookings.length} lesson{confirmedBookings.length !== 1 ? 's' : ''} today</span>
                  </div>
                  <div className="td-v2-hero__badge">
                    <Clock size={16} />
                    <span>{pendingBookings.length} pending</span>
                  </div>
                  <div className="td-v2-hero__badge">
                    <Star size={16} />
                    <span>{profile!.total_reviews || 0} reviews</span>
                  </div>
                </div>
              )}
            </div>

            {/* Verification notices */}
            {!loading && profile?.verification_status === 'pending' && (
              <div className="td-v2-notice td-v2-notice--warning">
                <Clock size={18} />
                <div>
                  <strong>Profile Under Review</strong>
                  <p>Your teacher profile is being verified. This usually takes 1-3 business days.</p>
                </div>
              </div>
            )}
            {!loading && profile?.verification_status === 'rejected' && (
              <div className="td-v2-notice td-v2-notice--error">
                <AlertCircle size={18} />
                <div>
                  <strong>Profile Not Approved</strong>
                  <p>Your profile was not approved. Please update your credentials and resubmit.</p>
                </div>
              </div>
            )}

            {/* Stat cards */}
            <div className="td-v2-stat-cards">
              <div className="td-v2-stat-card td-v2-stat-card--purple">
                <div className="td-v2-stat-card__icon"><BookOpen size={20} /></div>
                <div className="td-v2-stat-card__data">
                  {loading ? (
                    <div className="td-v2-skeleton__line" style={{ width: '50px', height: '20px', borderRadius: '6px' }} />
                  ) : (
                    <span className="td-v2-stat-card__value">{dashStats?.total_lessons_completed || completedBookings.length}</span>
                  )}
                  <span className="td-v2-stat-card__label">Lessons Completed</span>
                </div>
                <TrendingUp size={14} className="td-v2-stat-card__trend" />
              </div>
              <div className="td-v2-stat-card td-v2-stat-card--cyan">
                <div className="td-v2-stat-card__icon"><Users size={20} /></div>
                <div className="td-v2-stat-card__data">
                  {loading ? (
                    <div className="td-v2-skeleton__line" style={{ width: '40px', height: '20px', borderRadius: '6px' }} />
                  ) : (
                    <span className="td-v2-stat-card__value">{dashStats?.total_students || new Set(bookings.map(b => b.student_id)).size}</span>
                  )}
                  <span className="td-v2-stat-card__label">Students Taught</span>
                </div>
                <TrendingUp size={14} className="td-v2-stat-card__trend" />
              </div>
              <div className="td-v2-stat-card td-v2-stat-card--gold">
                <div className="td-v2-stat-card__icon"><Star size={20} /></div>
                <div className="td-v2-stat-card__data">
                  {loading ? (
                    <div className="td-v2-skeleton__line" style={{ width: '40px', height: '20px', borderRadius: '6px' }} />
                  ) : (
                    <span className="td-v2-stat-card__value">{(profile!.average_rating || 0).toFixed(1)}</span>
                  )}
                  <span className="td-v2-stat-card__label">Avg Rating</span>
                </div>
                <Award size={14} className="td-v2-stat-card__trend" />
              </div>
              <div className="td-v2-stat-card td-v2-stat-card--green">
                <div className="td-v2-stat-card__icon"><TrendingUp size={20} /></div>
                <div className="td-v2-stat-card__data">
                  {loading ? (
                    <div className="td-v2-skeleton__line" style={{ width: '50px', height: '20px', borderRadius: '6px' }} />
                  ) : (
                    <span className="td-v2-stat-card__value">{dashStats?.completion_rate?.toFixed(0) || 0}%</span>
                  )}
                  <span className="td-v2-stat-card__label">Completion Rate</span>
                </div>
                <CheckCircle size={14} className="td-v2-stat-card__trend" />
              </div>
            </div>

            {/* Analytics Charts */}
            <div className="td-v2-section">
              <div className="td-v2-section__header">
                <BarChart3 size={20} />
                <h2>Analytics</h2>
              </div>
              <TeacherAnalyticsCharts
                weeklyData={weeklyData}
                engagementData={engagementData}
                ratingTrend={ratingTrend}
                subjectDistribution={subjectDist}
                loading={analyticsLoading}
              />
            </div>

            {/* Upcoming Lessons Calendar */}
            <div className="td-v2-section">
              <LessonCalendarWidget bookings={bookings} loading={loading} />
            </div>

            {/* Two-column: Feedback + Activity */}
            <div className="td-v2-two-col">
              <div className="td-v2-two-col__left">
                <StudentFeedbackFeed items={feedbackItems} loading={analyticsLoading} />
              </div>
              <div className="td-v2-two-col__right">
                <ActivityTimeline items={activityItems} loading={analyticsLoading} />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ LESSONS SECTION ═══════════ */}
        {activeSection === 'lessons' && (
          <div className="td-v2-lessons-section">
            <div className="td-v2-section__header">
              <BookOpen size={20} />
              <h2>Upcoming Lessons</h2>
            </div>

            {loading ? (
              <SkeletonBlock lines={4} wide />
            ) : (
              <>
                <LessonCalendarWidget bookings={bookings} loading={false} />

                {confirmedBookings.length > 0 && (
                  <div className="td-v2-lesson-list">
                    <h3>Confirmed Lessons</h3>
                    {confirmedBookings.map(b => (
                      <div key={b.id} className="td-v2-lesson-card td-v2-lesson-card--confirmed">
                        <div className="td-v2-lesson-card__info">
                          <span className="td-v2-lesson-card__subject"><BookOpen size={14} /> {b.subject}</span>
                          <span className="td-v2-lesson-card__time"><Calendar size={14} /> {b.date} &middot; {b.start_time} - {b.end_time}</span>
                        </div>
                        <div className="td-v2-lesson-card__actions">
                          {b.room_id && (
                            <button className="td-v2-btn td-v2-btn--join" onClick={() => navigate(`/app/classroom/${b.id}`)}>
                              <Video size={14} /> Join Classroom
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {completedBookings.length > 0 && (
                  <div className="td-v2-lesson-list">
                    <h3>Completed ({completedBookings.length})</h3>
                    {completedBookings.slice(0, 5).map(b => (
                      <div key={b.id} className="td-v2-lesson-card td-v2-lesson-card--completed">
                        <div className="td-v2-lesson-card__info">
                          <span className="td-v2-lesson-card__subject"><BookOpen size={14} /> {b.subject}</span>
                          <span className="td-v2-lesson-card__time"><Calendar size={14} /> {b.date}</span>
                        </div>
                        <span className="td-v2-lesson-card__badge"><CheckCircle size={14} /> Completed</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ═══════════ BOOKINGS SECTION ═══════════ */}
        {activeSection === 'bookings' && loading && (
          <div className="td-v2-bookings-section">
            <div className="td-v2-section__header">
              <Calendar size={20} />
              <h2>Booking Management</h2>
            </div>
            <SkeletonBlock lines={5} wide />
          </div>
        )}
        {activeSection === 'bookings' && !loading && profile && (
          <div className="td-v2-bookings-section">
            <div className="td-v2-section__header">
              <Calendar size={20} />
              <h2>Booking Management</h2>
              <span className="td-v2-section__count">{bookings.length} total</span>
            </div>

            {bookings.length === 0 ? (
              <div className="td-v2-empty-state">
                <Calendar size={48} />
                <h3>No Bookings Yet</h3>
                <p>When students book lessons with you, they'll appear here.</p>
              </div>
            ) : (
              <>
                {/* Pending Bookings */}
                {pendingBookings.length > 0 && (
                  <div className="td-v2-booking-group">
                    <h3 className="td-v2-booking-group__title">
                      <Clock size={16} /> Pending ({pendingBookings.length})
                    </h3>
                    {pendingBookings.map(b => (
                      <div key={b.id} className="td-v2-booking-card td-v2-booking-card--pending">
                        <div className="td-v2-booking-card__info">
                          <span className="td-v2-booking-card__subject"><BookOpen size={14} /> {b.subject}</span>
                          <span className="td-v2-booking-card__time">
                            <Calendar size={14} /> {b.date} &middot; {b.start_time} - {b.end_time}
                          </span>
                        </div>
                        <div className="td-v2-booking-card__actions">
                          <button className="td-v2-btn td-v2-btn--confirm" onClick={() => handleConfirmBooking(b.id)}>
                            <Check size={14} /> Confirm
                          </button>
                          <button className="td-v2-btn td-v2-btn--decline" onClick={() => handleCancelBooking(b.id)}>
                            <X size={14} /> Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Confirmed Bookings */}
                {confirmedBookings.length > 0 && (
                  <div className="td-v2-booking-group">
                    <h3 className="td-v2-booking-group__title">
                      <CheckCircle size={16} /> Confirmed ({confirmedBookings.length})
                    </h3>
                    {confirmedBookings.map(b => (
                      <div key={b.id} className="td-v2-booking-card td-v2-booking-card--confirmed">
                        <div className="td-v2-booking-card__info">
                          <span className="td-v2-booking-card__subject"><BookOpen size={14} /> {b.subject}</span>
                          <span className="td-v2-booking-card__time">
                            <Calendar size={14} /> {b.date} &middot; {b.start_time} - {b.end_time}
                          </span>
                        </div>
                        <div className="td-v2-booking-card__actions">
                          {b.room_id && (
                            <button className="td-v2-btn td-v2-btn--join" onClick={() => navigate(`/app/classroom/${b.id}`)}>
                              <Video size={14} /> Join
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Completed Bookings */}
                {completedBookings.length > 0 && (
                  <div className="td-v2-booking-group">
                    <h3 className="td-v2-booking-group__title">
                      <Award size={16} /> Completed ({completedBookings.length})
                    </h3>
                    {completedBookings.slice(0, 10).map(b => (
                      <div key={b.id} className="td-v2-booking-card td-v2-booking-card--completed">
                        <div className="td-v2-booking-card__info">
                          <span className="td-v2-booking-card__subject"><BookOpen size={14} /> {b.subject}</span>
                          <span className="td-v2-booking-card__time"><Calendar size={14} /> {b.date}</span>
                        </div>
                        <span className="td-v2-booking-card__status-badge"><CheckCircle size={12} /> Done</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ═══════════ POSTS SECTION ═══════════ */}
        {/* Posts section stays mounted once profile exists - never unmounts to preserve form state */}
        {activeSection === 'posts' && (
          <div className="td-v2-posts-section">
            <div className="td-v2-section__header">
              <Rss size={20} />
              <h2>My Posts</h2>
            </div>

            {profile ? (
              <>
                <CreatePostForm
                  teacherId={profile.id}
                  teacherName={`${profile.full_name} ${profile.surname}`}
                  teacherImage={profile.profile_image_url || undefined}
                  onPostCreated={handlePostCreated}
                  onSubmitPost={handleCreatePost}
                />

                {postsLoading ? (
                  <div className="td-v2-posts-loading">
                    <Loader2 size={24} className="td-v2-spinner" />
                    <span>Loading your posts...</span>
                  </div>
                ) : myPosts.length > 0 ? (
                  <div className="td-v2-posts-list">
                    {myPosts.map(post => (
                      <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={user?.id}
                        currentUserName={user ? `${user.name} ${user.surname?.charAt(0) || ''}.` : undefined}
                        isOwner
                        onLike={handleLikePost}
                        onDelete={handleDeletePost}
                        onAddComment={handleAddComment}
                        onDeleteComment={handleDeleteComment}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="td-v2-empty-state">
                    <Rss size={48} />
                    <h3>No Posts Yet</h3>
                    <p>Share tips, resources, and updates with your students. Posts help build your reputation!</p>
                  </div>
                )}
              </>
            ) : (
              <SkeletonBlock lines={4} wide />
            )}
          </div>
        )}

        {/* ═══════════ EARNINGS SECTION ═══════════ */}
        {activeSection === 'earnings' && (
          <div className="td-v2-earnings-section">
            <div className="td-v2-section__header">
              <DollarSign size={20} />
              <h2>Earnings</h2>
            </div>

            {earningsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Loader2 size={32} className="td-v2-spinner" />
                <p style={{ marginTop: '12px', opacity: 0.6 }}>Loading earnings...</p>
              </div>
            ) : earningsData ? (
              <>
                {/* Earnings summary cards */}
                <div className="td-v2-stat-cards" style={{ marginBottom: '24px' }}>
                  <div className="td-v2-stat-card">
                    <div className="td-v2-stat-card__icon" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
                      <Clock size={20} style={{ color: '#F59E0B' }} />
                    </div>
                    <div className="td-v2-stat-card__info">
                      <span className="td-v2-stat-card__value">${earningsData.summary.pending.toFixed(2)}</span>
                      <span className="td-v2-stat-card__label">Pending ({earningsData.hold_days}-day hold)</span>
                    </div>
                  </div>
                  <div className="td-v2-stat-card">
                    <div className="td-v2-stat-card__icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                      <Wallet size={20} style={{ color: '#10B981' }} />
                    </div>
                    <div className="td-v2-stat-card__info">
                      <span className="td-v2-stat-card__value">${earningsData.summary.available.toFixed(2)}</span>
                      <span className="td-v2-stat-card__label">Available for Payout</span>
                    </div>
                  </div>
                  <div className="td-v2-stat-card">
                    <div className="td-v2-stat-card__icon" style={{ background: 'rgba(124, 77, 255, 0.15)' }}>
                      <TrendingUp size={20} style={{ color: '#7C4DFF' }} />
                    </div>
                    <div className="td-v2-stat-card__info">
                      <span className="td-v2-stat-card__value">${earningsData.summary.total_earned.toFixed(2)}</span>
                      <span className="td-v2-stat-card__label">Total Earned</span>
                    </div>
                  </div>
                  <div className="td-v2-stat-card">
                    <div className="td-v2-stat-card__icon" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                      <CheckCircle size={20} style={{ color: '#6366F1' }} />
                    </div>
                    <div className="td-v2-stat-card__info">
                      <span className="td-v2-stat-card__value">${earningsData.summary.total_paid.toFixed(2)}</span>
                      <span className="td-v2-stat-card__label">Total Paid Out</span>
                    </div>
                  </div>
                </div>

                {/* Rate info */}
                <div style={{
                  padding: '14px 18px', borderRadius: '10px', marginBottom: '20px',
                  background: 'rgba(124, 77, 255, 0.08)', border: '1px solid rgba(124, 77, 255, 0.15)',
                  display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.7)'
                }}>
                  <span>Lesson fee: <b>${earningsData.lesson_fee.toFixed(2)}</b></span>
                  <span>Your share: <b>${earningsData.teacher_rate.toFixed(2)}</b> ({100 - parseInt(earningsData.commission_rate)}%)</span>
                  <span>Platform: <b>{earningsData.commission_rate}</b></span>
                  <span>Min payout: <b>${earningsData.minimum_payout.toFixed(2)}</b></span>
                  <span>Hold period: <b>{earningsData.hold_days} days</b></span>
                </div>

                {/* Payout button */}
                <div style={{ marginBottom: '24px' }}>
                  {payoutSuccess && (
                    <div style={{
                      padding: '12px 16px', borderRadius: '10px', marginBottom: '12px',
                      background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)',
                      color: '#10B981', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <CheckCircle size={16} /> {payoutSuccess}
                    </div>
                  )}
                  <button
                    className="td-v2-btn td-v2-btn--primary"
                    onClick={() => { setShowPayoutModal(true); setPayoutError(''); setPayoutSuccess(''); }}
                    disabled={earningsData.summary.available < earningsData.minimum_payout}
                    style={{ opacity: earningsData.summary.available < earningsData.minimum_payout ? 0.5 : 1 }}
                  >
                    <DollarSign size={16} />
                    {earningsData.summary.available >= earningsData.minimum_payout
                      ? `Request Payout ($${earningsData.summary.available.toFixed(2)})`
                      : `Minimum payout $${earningsData.minimum_payout.toFixed(2)} (you have $${earningsData.summary.available.toFixed(2)})`
                    }
                  </button>
                </div>

                {/* Recent earnings table */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Recent Earnings</h3>
                  {earningsData.recent_earnings.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {earningsData.recent_earnings.map((e: TeacherEarning) => (
                        <div key={e.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '12px 16px', borderRadius: '10px',
                          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600 }}>
                              Lesson — {e.num_students} student{e.num_students > 1 ? 's' : ''}
                            </span>
                            <span style={{ fontSize: '12px', opacity: 0.5 }}>
                              {e.created_at ? new Date(e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: 700, color: '#10B981' }}>+${e.teacher_amount.toFixed(2)}</span>
                            <span style={{
                              fontSize: '11px', padding: '2px 8px', borderRadius: '6px',
                              background: e.status === 'paid' ? 'rgba(16, 185, 129, 0.15)' :
                                e.status === 'available' ? 'rgba(99, 102, 241, 0.15)' :
                                e.status === 'cancelled' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: e.status === 'paid' ? '#10B981' :
                                e.status === 'available' ? '#6366F1' :
                                e.status === 'cancelled' ? '#EF4444' : '#F59E0B',
                              fontWeight: 600, textTransform: 'capitalize'
                            }}>
                              {e.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '30px 0', opacity: 0.5 }}>
                      <DollarSign size={32} />
                      <p style={{ marginTop: '8px' }}>No earnings yet. Complete lessons to start earning!</p>
                    </div>
                  )}
                </div>

                {/* Recent payouts */}
                {earningsData.recent_payouts.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Payout History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {earningsData.recent_payouts.map((p: TeacherPayout) => (
                        <div key={p.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '12px 16px', borderRadius: '10px',
                          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600 }}>
                              EcoCash Payout — {p.earnings_count} lessons
                            </span>
                            <span style={{ fontSize: '12px', opacity: 0.5 }}>
                              {p.phone_number} | {p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontWeight: 700 }}>${p.amount.toFixed(2)}</span>
                            <span style={{
                              fontSize: '11px', padding: '2px 8px', borderRadius: '6px',
                              background: p.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' :
                                p.status === 'failed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: p.status === 'completed' ? '#10B981' :
                                p.status === 'failed' ? '#EF4444' : '#F59E0B',
                              fontWeight: 600, textTransform: 'capitalize'
                            }}>
                              {p.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
                <DollarSign size={40} />
                <p style={{ marginTop: '12px' }}>Earnings data not available.</p>
              </div>
            )}

            {/* Payout modal */}
            {showPayoutModal && (
              <div className="vc-modal-overlay" onClick={() => setShowPayoutModal(false)}>
                <div className="vc-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Request EcoCash Payout</h3>
                  <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '16px' }}>
                    Available: <b>${earningsData?.summary.available.toFixed(2)}</b> will be sent to your EcoCash number.
                  </p>

                  {payoutError && (
                    <div style={{
                      padding: '10px 14px', borderRadius: '8px', marginBottom: '12px',
                      background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#EF4444', fontSize: '13px'
                    }}>
                      {payoutError}
                    </div>
                  )}

                  <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block', opacity: 0.7 }}>
                    EcoCash Phone Number
                  </label>
                  <input
                    type="tel"
                    value={payoutPhone}
                    onChange={e => setPayoutPhone(e.target.value)}
                    placeholder="077..."
                    maxLength={10}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
                      color: 'white', fontSize: '15px', marginBottom: '16px', boxSizing: 'border-box'
                    }}
                  />

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="td-v2-btn td-v2-btn--outline"
                      onClick={() => setShowPayoutModal(false)}
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button
                      className="td-v2-btn td-v2-btn--primary"
                      onClick={handleRequestPayout}
                      disabled={requestingPayout || !payoutPhone.trim()}
                      style={{ flex: 1 }}
                    >
                      {requestingPayout ? <Loader2 size={16} className="td-v2-spinner" /> : <DollarSign size={16} />}
                      Request Payout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ AVAILABILITY SECTION ═══════════ */}
        {/* Availability stays mounted once profile exists - protects editing state */}
        {activeSection === 'availability' && (
          <div className="td-v2-availability-section">
            <div className="td-v2-section__header">
              <Clock size={20} />
              <h2>Availability</h2>
            </div>

            {profile ? (
              !editingAvailability ? (
                <div className="td-v2-availability-view">
                  <AvailabilityGrid availability={profile.availability || []} />
                  <button className="td-v2-btn td-v2-btn--primary" onClick={() => setEditingAvailability(true)}>
                    <Edit3 size={16} /> Edit Availability
                  </button>
                </div>
              ) : (
                <div className="td-v2-avail-editor">
                  <h3>Edit Your Availability</h3>
                  {availSlots.map((slot, idx) => (
                    <div key={idx} className="td-v2-avail-slot">
                      <select value={slot.day_of_week} onChange={e => handleSlotChange(idx, 'day_of_week', e.target.value)}>
                        {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select value={slot.start_time} onChange={e => handleSlotChange(idx, 'start_time', e.target.value)}>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <span className="td-v2-avail-slot__sep">to</span>
                      <select value={slot.end_time} onChange={e => handleSlotChange(idx, 'end_time', e.target.value)}>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <button className="td-v2-avail-slot__remove" onClick={() => handleRemoveSlot(idx)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button className="td-v2-btn td-v2-btn--outline td-v2-btn--sm" onClick={handleAddSlot}>
                    <Plus size={14} /> Add Time Slot
                  </button>
                  <div className="td-v2-avail-editor__actions">
                    <button className="td-v2-btn td-v2-btn--primary" onClick={handleSaveAvailability} disabled={savingAvail}>
                      {savingAvail ? <Loader2 size={14} className="td-v2-spinner" /> : <Check size={14} />}
                      Save Availability
                    </button>
                    <button className="td-v2-btn td-v2-btn--outline" onClick={() => setEditingAvailability(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )
            ) : (
              <SkeletonBlock lines={4} wide />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
