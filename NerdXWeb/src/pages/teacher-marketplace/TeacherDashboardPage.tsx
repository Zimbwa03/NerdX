import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StarRating } from '../../components/marketplace/StarRating';
import { AvailabilityGrid } from '../../components/marketplace/AvailabilityGrid';
import { PostCard } from '../../components/marketplace/PostCard';
import { CreatePostForm } from '../../components/marketplace/CreatePostForm';
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
} from '../../services/api/teacherMarketplaceApi';
import { DAYS_OF_WEEK, TIME_SLOTS } from '../../data/marketplaceConstants';
import type { TeacherProfile, LessonBooking, DayOfWeek, TeacherPost, PostComment, PostType } from '../../types';
import {
  ArrowLeft, User, ShieldCheck, Clock, Calendar, Star, BookOpen,
  MessageSquare, Loader2, Edit3, Plus, Trash2, Check, X,
  AlertCircle, CheckCircle, BarChart3, Rss, Video
} from 'lucide-react';

export function TeacherDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [bookings, setBookings] = useState<LessonBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'availability' | 'posts'>('overview');
  const [myPosts, setMyPosts] = useState<TeacherPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Availability editor
  const [editingAvailability, setEditingAvailability] = useState(false);
  const [availSlots, setAvailSlots] = useState<{ day_of_week: DayOfWeek; start_time: string; end_time: string }[]>([]);
  const [savingAvail, setSavingAvail] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      const teacherProfile = await getTeacherProfileByUserId(user.id);
      if (teacherProfile) {
        setProfile(teacherProfile);
        const bk = await getTeacherBookings(teacherProfile.id);
        setBookings(bk);
        setAvailSlots(
          (teacherProfile.availability || []).map((a) => ({
            day_of_week: a.day_of_week,
            start_time: a.start_time,
            end_time: a.end_time,
          })),
        );
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const handleConfirmBooking = async (bookingId: string) => {
    const success = await updateBookingStatus(bookingId, 'confirmed');
    if (success) {
      // Refresh bookings to get the generated room_id
      if (profile) {
        const refreshed = await getTeacherBookings(profile.id);
        setBookings(refreshed);
      } else {
        setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' } : b)));
      }
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const success = await updateBookingStatus(bookingId, 'cancelled');
    if (success) {
      setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b)));
    }
  };

  const handleAddSlot = () => {
    setAvailSlots([...availSlots, { day_of_week: 'Monday', start_time: '09:00', end_time: '10:00' }]);
  };

  const handleRemoveSlot = (idx: number) => {
    setAvailSlots(availSlots.filter((_, i) => i !== idx));
  };

  const handleSlotChange = (idx: number, field: string, value: string) => {
    setAvailSlots(availSlots.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const handleSaveAvailability = async () => {
    if (!profile) return;
    setSavingAvail(true);
    const success = await setTeacherAvailability(profile.id, availSlots);
    if (success) {
      setEditingAvailability(false);
      // Refresh
      const updated = await getTeacherProfileByUserId(user!.id);
      if (updated) setProfile(updated);
    }
    setSavingAvail(false);
  };

  // Load posts when My Posts tab is opened
  useEffect(() => {
    if (activeTab !== 'posts' || !profile) return;
    let cancelled = false;
    (async () => {
      setPostsLoading(true);
      const data = await getTeacherPosts(profile.id, user?.id);
      if (!cancelled) {
        setMyPosts(data);
        setPostsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeTab, profile?.id, user?.id]);

  const handleCreatePost = async (
    teacherId: string,
    content: string,
    postType: PostType,
    mediaUrl?: string | null,
    subjectTag?: string | null,
  ) => {
    return createPost(teacherId, content, postType, mediaUrl, subjectTag);
  };

  const handlePostCreated = (newPost: TeacherPost) => {
    setMyPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = async (postId: string) => {
    const success = await deletePostApi(postId);
    if (success) {
      setMyPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return { liked: false, newCount: 0 };
    const result = await toggleLike(postId, user.id);
    setMyPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, user_has_liked: result.liked, likes_count: result.newCount }
          : p,
      ),
    );
    return result;
  };

  const handleAddComment = async (postId: string, content: string): Promise<PostComment | null> => {
    if (!user) return null;
    const userName = `${user.name} ${user.surname?.charAt(0) || ''}.`;
    return addComment(postId, user.id, userName, content);
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    await deleteComment(commentId, postId);
    setMyPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments_count: Math.max(0, p.comments_count - 1) } : p,
      ),
    );
  };

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  if (loading) {
    return (
      <div className="tp-loading">
        <Loader2 size={32} className="marketplace-loading__spinner" />
        <span>Loading teacher dashboard...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="marketplace-empty">
        <User size={48} />
        <h3>No Teacher Profile Found</h3>
        <p>You haven't created a teacher profile yet.</p>
        <button type="button" className="to-btn to-btn--primary" onClick={() => navigate('/app/teacher-onboarding')}>
          Create Teacher Profile
        </button>
      </div>
    );
  }

  const statusBadge = {
    pending: { icon: Clock, label: 'Pending Verification', className: 'td-status--pending' },
    approved: { icon: CheckCircle, label: 'Verified', className: 'td-status--approved' },
    rejected: { icon: AlertCircle, label: 'Rejected', className: 'td-status--rejected' },
  }[profile.verification_status];

  return (
    <div className="teacher-dashboard">
      <div className="td-header">
        <Link to="/app" className="td-header__back">
          <ArrowLeft size={20} />
        </Link>
        <h1>Teacher Dashboard</h1>
      </div>

      {/* Profile summary */}
      <div className="td-profile-card">
        <div className="td-profile-card__avatar">
          {profile.profile_image_url ? (
            <img src={profile.profile_image_url} alt="" className="td-profile-card__img" />
          ) : (
            <div className="td-profile-card__placeholder"><User size={36} /></div>
          )}
        </div>
        <div className="td-profile-card__info">
          <h2>{profile.full_name} {profile.surname}</h2>
          <div className={`td-status ${statusBadge.className}`}>
            <statusBadge.icon size={14} />
            {statusBadge.label}
          </div>
          <div className="td-profile-card__rating">
            <StarRating rating={profile.average_rating || 0} size={14} showValue reviewCount={profile.total_reviews} />
          </div>
        </div>
        <button
          type="button"
          className="to-btn to-btn--outline to-btn--sm"
          onClick={() => navigate(`/app/marketplace/teacher/${profile.id}`)}
        >
          <Edit3 size={14} /> View Public Profile
        </button>
      </div>

      {/* Stats */}
      <div className="td-stats">
        <div className="td-stat-card">
          <BarChart3 size={20} />
          <span className="td-stat-card__value">{bookings.length}</span>
          <span className="td-stat-card__label">Total Bookings</span>
        </div>
        <div className="td-stat-card">
          <Calendar size={20} />
          <span className="td-stat-card__value">{confirmedBookings.length}</span>
          <span className="td-stat-card__label">Upcoming</span>
        </div>
        <div className="td-stat-card">
          <Star size={20} />
          <span className="td-stat-card__value">{(profile.average_rating || 0).toFixed(1)}</span>
          <span className="td-stat-card__label">Avg Rating</span>
        </div>
        <div className="td-stat-card">
          <MessageSquare size={20} />
          <span className="td-stat-card__value">{profile.total_reviews || 0}</span>
          <span className="td-stat-card__label">Reviews</span>
        </div>
        <div className="td-stat-card">
          <Rss size={20} />
          <span className="td-stat-card__value">{myPosts.length}</span>
          <span className="td-stat-card__label">Posts</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tp-tabs">
        <button type="button" className={`tp-tab${activeTab === 'overview' ? ' tp-tab--active' : ''}`} onClick={() => setActiveTab('overview')}>
          <BarChart3 size={16} /> Overview
        </button>
        <button type="button" className={`tp-tab${activeTab === 'bookings' ? ' tp-tab--active' : ''}`} onClick={() => setActiveTab('bookings')}>
          <Calendar size={16} /> Bookings ({pendingBookings.length} pending)
        </button>
        <button type="button" className={`tp-tab${activeTab === 'availability' ? ' tp-tab--active' : ''}`} onClick={() => setActiveTab('availability')}>
          <Clock size={16} /> Availability
        </button>
        <button type="button" className={`tp-tab${activeTab === 'posts' ? ' tp-tab--active' : ''}`} onClick={() => setActiveTab('posts')}>
          <Rss size={16} /> My Posts
        </button>
      </div>

      <div className="td-body">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="td-overview">
            {profile.verification_status === 'pending' && (
              <div className="td-notice td-notice--warning">
                <Clock size={18} />
                <div>
                  <strong>Profile Under Review</strong>
                  <p>Your teacher profile is currently being verified. This usually takes 1-3 business days. You'll be notified once approved.</p>
                </div>
              </div>
            )}
            {profile.verification_status === 'rejected' && (
              <div className="td-notice td-notice--error">
                <AlertCircle size={18} />
                <div>
                  <strong>Profile Not Approved</strong>
                  <p>Your profile was not approved. Please update your credentials and resubmit.</p>
                </div>
              </div>
            )}

            {pendingBookings.length > 0 && (
              <div className="td-section">
                <h3><Clock size={16} /> Pending Bookings</h3>
                {pendingBookings.slice(0, 3).map((b) => (
                  <div key={b.id} className="td-booking-card">
                    <div className="td-booking-card__info">
                      <span className="td-booking-card__subject"><BookOpen size={14} /> {b.subject}</span>
                      <span className="td-booking-card__time"><Calendar size={14} /> {b.date} at {b.start_time}</span>
                    </div>
                    <div className="td-booking-card__actions">
                      <button type="button" className="to-btn to-btn--primary to-btn--sm" onClick={() => handleConfirmBooking(b.id)}>
                        <Check size={14} /> Confirm
                      </button>
                      <button type="button" className="to-btn to-btn--outline to-btn--sm" onClick={() => handleCancelBooking(b.id)}>
                        <X size={14} /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {confirmedBookings.length > 0 && (
              <div className="td-section">
                <h3><Video size={16} /> Upcoming Lessons</h3>
                {confirmedBookings.slice(0, 3).map((b) => (
                  <div key={b.id} className="td-booking-card td-booking-card--confirmed">
                    <div className="td-booking-card__info">
                      <span className="td-booking-card__subject"><BookOpen size={14} /> {b.subject}</span>
                      <span className="td-booking-card__time"><Calendar size={14} /> {b.date} at {b.start_time}</span>
                    </div>
                    <div className="td-booking-card__actions">
                      {b.room_id && (
                        <button
                          type="button"
                          className="vc-join-btn vc-join-btn--sm"
                          onClick={() => navigate(`/app/classroom/${b.id}`)}
                        >
                          <Video size={14} /> Join Classroom
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {profile.reviews && profile.reviews.length > 0 && (
              <div className="td-section">
                <h3><MessageSquare size={16} /> Recent Reviews</h3>
                {profile.reviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="td-review-mini">
                    <StarRating rating={r.rating} size={12} />
                    <p>"{r.comment.slice(0, 100)}{r.comment.length > 100 ? '...' : ''}"</p>
                    <span className="td-review-mini__author">— {r.student_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div className="td-bookings">
            {bookings.length === 0 ? (
              <div className="marketplace-empty">
                <Calendar size={48} />
                <h3>No Bookings Yet</h3>
                <p>When students book lessons with you, they'll appear here.</p>
              </div>
            ) : (
              <div className="td-booking-list">
                {bookings.map((b) => (
                  <div key={b.id} className={`td-booking-card td-booking-card--${b.status}`}>
                    <div className="td-booking-card__info">
                      <span className="td-booking-card__subject"><BookOpen size={14} /> {b.subject}</span>
                      <span className="td-booking-card__time">
                        <Calendar size={14} /> {b.date} &middot; {b.start_time} - {b.end_time}
                      </span>
                      <span className={`td-booking-card__status td-booking-card__status--${b.status}`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </div>
                    <div className="td-booking-card__actions">
                      {b.status === 'pending' && (
                        <>
                          <button type="button" className="to-btn to-btn--primary to-btn--sm" onClick={() => handleConfirmBooking(b.id)}>
                            <Check size={14} /> Confirm
                          </button>
                          <button type="button" className="to-btn to-btn--outline to-btn--sm" onClick={() => handleCancelBooking(b.id)}>
                            <X size={14} />
                          </button>
                        </>
                      )}
                      {b.status === 'confirmed' && b.room_id && (
                        <button
                          type="button"
                          className="vc-join-btn vc-join-btn--sm"
                          onClick={() => navigate(`/app/classroom/${b.id}`)}
                        >
                          <Video size={14} /> Join Classroom
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Availability */}
        {activeTab === 'availability' && (
          <div className="td-availability">
            {!editingAvailability ? (
              <>
                <AvailabilityGrid availability={profile.availability || []} />
                <button
                  type="button"
                  className="to-btn to-btn--primary"
                  onClick={() => setEditingAvailability(true)}
                >
                  <Edit3 size={16} /> Edit Availability
                </button>
              </>
            ) : (
              <div className="td-avail-editor">
                <h3>Edit Your Availability</h3>
                {availSlots.map((slot, idx) => (
                  <div key={idx} className="td-avail-slot">
                    <select
                      value={slot.day_of_week}
                      onChange={(e) => handleSlotChange(idx, 'day_of_week', e.target.value)}
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <select
                      value={slot.start_time}
                      onChange={(e) => handleSlotChange(idx, 'start_time', e.target.value)}
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <span>to</span>
                    <select
                      value={slot.end_time}
                      onChange={(e) => handleSlotChange(idx, 'end_time', e.target.value)}
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <button type="button" className="td-avail-slot__remove" onClick={() => handleRemoveSlot(idx)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" className="to-btn to-btn--outline to-btn--sm" onClick={handleAddSlot}>
                  <Plus size={14} /> Add Time Slot
                </button>
                <div className="td-avail-editor__actions">
                  <button type="button" className="to-btn to-btn--primary" onClick={handleSaveAvailability} disabled={savingAvail}>
                    {savingAvail ? <Loader2 size={14} className="to-spinner" /> : <Check size={14} />}
                    Save Availability
                  </button>
                  <button type="button" className="to-btn to-btn--outline" onClick={() => setEditingAvailability(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* My Posts */}
        {activeTab === 'posts' && (
          <div className="td-posts">
            <CreatePostForm
              teacherId={profile.id}
              teacherName={`${profile.full_name} ${profile.surname}`}
              teacherImage={profile.profile_image_url || undefined}
              onPostCreated={handlePostCreated}
              onSubmitPost={handleCreatePost}
            />

            {postsLoading ? (
              <div className="tp-feed__loading">
                <Loader2 size={24} className="marketplace-loading__spinner" />
                <span>Loading your posts...</span>
              </div>
            ) : myPosts.length > 0 ? (
              <div className="tp-feed__list">
                {myPosts.map((post) => (
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
              <div className="tp-feed__empty">
                <Rss size={48} />
                <h3>No Posts Yet</h3>
                <p>Share tips, resources, and updates with your students. Posts help build your reputation!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
