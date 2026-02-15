import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StarRating } from '../../components/marketplace/StarRating';
import { SubjectBadge } from '../../components/marketplace/SubjectBadge';
import { ReviewCard } from '../../components/marketplace/ReviewCard';
import { AvailabilityGrid } from '../../components/marketplace/AvailabilityGrid';
import { PostCard } from '../../components/marketplace/PostCard';
import {
  getTeacherProfile,
  getTeacherReviews,
  submitReview,
  getTeacherPosts,
  toggleLike,
  addComment,
  deleteComment,
} from '../../services/api/teacherMarketplaceApi';
import { FEATURED_TEACHERS } from '../../data/marketplaceConstants';
import type { TeacherProfile, TeacherReview, TeacherPost, PostComment } from '../../types';
import {
  ArrowLeft, User, ShieldCheck, Calendar, MessageSquare,
  BookOpen, Award, Briefcase, Loader2, Play, Star, Send, Clock, Rss
} from 'lucide-react';

export function TeacherProfilePage() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [reviews, setReviews] = useState<TeacherReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'feed' | 'reviews' | 'availability'>('feed');
  const [posts, setPosts] = useState<TeacherPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function load() {
      if (!teacherId) return;
      setLoading(true);

      const profile = await getTeacherProfile(teacherId);

      if (profile) {
        setTeacher(profile);
        setReviews(profile.reviews || []);
      } else {
        // Fall back to demo data
        const demo = FEATURED_TEACHERS.find((t) => t.id === teacherId);
        if (demo) {
          setTeacher({
            id: demo.id,
            user_id: demo.id,
            full_name: demo.full_name,
            surname: demo.surname,
            email: '',
            whatsapp: '',
            bio: demo.bio,
            experience_description: 'Experienced educator with a passion for helping students achieve their academic goals. Has taught at several leading schools in Zimbabwe and has extensive experience with both ZIMSEC and Cambridge examination boards.',
            years_of_experience: 8,
            verification_status: 'approved',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            subjects: demo.subjects.map((s, i) => ({
              id: `${demo.id}-s-${i}`,
              teacher_id: demo.id,
              subject_name: s,
              academic_level: 'O-Level' as const,
              form_levels: ['Form 3', 'Form 4'] as any,
              curriculum: 'ZIMSEC' as const,
            })),
            qualifications: [
              { id: '1', teacher_id: demo.id, title: 'B.Ed Honours', institution: 'University of Zimbabwe', year: 2015, qualification_type: 'Degree' as const },
              { id: '2', teacher_id: demo.id, title: 'PGCE', institution: 'Great Zimbabwe University', year: 2016, qualification_type: 'Diploma' as const },
            ],
            availability: [
              { id: '1', teacher_id: demo.id, day_of_week: 'Monday', start_time: '09:00', end_time: '12:00' },
              { id: '2', teacher_id: demo.id, day_of_week: 'Wednesday', start_time: '14:00', end_time: '17:00' },
              { id: '3', teacher_id: demo.id, day_of_week: 'Friday', start_time: '09:00', end_time: '15:00' },
              { id: '4', teacher_id: demo.id, day_of_week: 'Saturday', start_time: '10:00', end_time: '13:00' },
            ],
            average_rating: demo.rating,
            total_reviews: demo.reviews,
            reviews: [
              { id: 'r1', teacher_id: demo.id, student_id: 's1', student_name: 'Tatenda M.', rating: 5, comment: 'Excellent teacher! Explains concepts clearly and patiently. My grades improved significantly.', created_at: '2026-01-15T10:00:00Z' },
              { id: 'r2', teacher_id: demo.id, student_id: 's2', student_name: 'Rudo C.', rating: 5, comment: 'Very knowledgeable and professional. The lessons are well-structured and engaging.', created_at: '2026-01-20T14:00:00Z' },
              { id: 'r3', teacher_id: demo.id, student_id: 's3', student_name: 'Kudzai N.', rating: 4, comment: 'Great teacher, very patient with questions. Helped me understand difficult topics.', created_at: '2026-02-01T09:00:00Z' },
            ],
          } as TeacherProfile);
          setReviews([
            { id: 'r1', teacher_id: demo.id, student_id: 's1', student_name: 'Tatenda M.', rating: 5, comment: 'Excellent teacher! Explains concepts clearly and patiently. My grades improved significantly.', created_at: '2026-01-15T10:00:00Z' },
            { id: 'r2', teacher_id: demo.id, student_id: 's2', student_name: 'Rudo C.', rating: 5, comment: 'Very knowledgeable and professional. The lessons are well-structured and engaging.', created_at: '2026-01-20T14:00:00Z' },
            { id: 'r3', teacher_id: demo.id, student_id: 's3', student_name: 'Kudzai N.', rating: 4, comment: 'Great teacher, very patient with questions. Helped me understand difficult topics.', created_at: '2026-02-01T09:00:00Z' },
          ]);
        }
      }
      setLoading(false);
    }
    load();
  }, [teacherId]);

  // Load posts eagerly (feed is default tab)
  useEffect(() => {
    if (!teacherId) return;
    let cancelled = false;
    (async () => {
      setPostsLoading(true);
      const data = await getTeacherPosts(teacherId, user?.id);
      if (!cancelled) {
        setPosts(data);
        setPostsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [teacherId, user?.id]);

  const handleLikePost = async (postId: string) => {
    if (!user) return { liked: false, newCount: 0 };
    const result = await toggleLike(postId, user.id);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, user_has_liked: result.liked, likes_count: result.newCount }
          : p,
      ),
    );
    return result;
  };

  const handleAddComment = async (postId: string, content: string, parentId?: string | null): Promise<PostComment | null> => {
    if (!user) return null;
    const userName = `${user.name} ${user.surname?.charAt(0) || ''}.`;
    return addComment(postId, user.id, userName, content, parentId);
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    await deleteComment(commentId, postId);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments_count: Math.max(0, p.comments_count - 1) } : p,
      ),
    );
  };

  const handleSubmitReview = async () => {
    if (!user || !teacherId || !reviewComment.trim()) return;
    setSubmittingReview(true);
    const success = await submitReview(
      teacherId,
      user.id,
      `${user.name} ${user.surname?.charAt(0) || ''}.`,
      reviewRating,
      reviewComment.trim(),
    );
    if (success) {
      const newReview: TeacherReview = {
        id: Date.now().toString(),
        teacher_id: teacherId,
        student_id: user.id,
        student_name: `${user.name} ${user.surname?.charAt(0) || ''}.`,
        rating: reviewRating,
        comment: reviewComment.trim(),
        created_at: new Date().toISOString(),
      };
      setReviews([newReview, ...reviews]);
      setReviewComment('');
      setReviewRating(5);
    }
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="tp-loading">
        <Loader2 size={32} className="marketplace-loading__spinner" />
        <span>Loading teacher profile...</span>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="marketplace-empty">
        <User size={48} />
        <h3>Teacher Not Found</h3>
        <p>This teacher profile could not be found.</p>
        <Link to="/app/marketplace" className="to-btn to-btn--primary">Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="teacher-profile-page">
      {/* Header - Facebook-style profile */}
      <div className="tp-header tp-header--fb">
        <Link to="/app/marketplace" className="tp-header__back">
          <ArrowLeft size={20} />
        </Link>
        <div className="tp-header__banner" />
        <div className="tp-header__content">
          <div className="tp-avatar tp-avatar--large">
            {teacher.profile_image_url ? (
              <img src={teacher.profile_image_url} alt={teacher.full_name} className="tp-avatar__img" />
            ) : (
              <div className="tp-avatar__placeholder">
                {`${(teacher.full_name || 'T')[0]}${(teacher.surname || '')[0] || ''}`.toUpperCase()}
              </div>
            )}
            {teacher.verification_status === 'approved' && (
              <span className="tp-avatar__verified" title="Verified Teacher">
                <ShieldCheck size={20} />
              </span>
            )}
          </div>
          <div className="tp-header__info">
            <h1 className="tp-header__name">{teacher.full_name} {teacher.surname}</h1>
            <div className="tp-header__meta">
              <StarRating
                rating={teacher.average_rating || 0}
                size={18}
                showValue
                reviewCount={teacher.total_reviews}
              />
              <span className="tp-header__exp">
                <Briefcase size={14} />
                {teacher.years_of_experience} years experience
              </span>
            </div>
            {teacher.bio && (
              <p className="tp-header__bio">{teacher.bio.length > 150 ? teacher.bio.slice(0, 150) + '...' : teacher.bio}</p>
            )}
            <div className="tp-header__subjects">
              {teacher.subjects?.map((s) => (
                <SubjectBadge key={s.id} subject={s.subject_name} level={s.academic_level} />
              ))}
            </div>
          </div>
          <div className="tp-header__actions">
            <button
              type="button"
              className="to-btn to-btn--primary"
              onClick={() => navigate(`/app/marketplace/book/${teacher.id}`)}
            >
              <Calendar size={16} /> Book a Lesson
            </button>
          </div>
        </div>
      </div>

      {/* Video preview */}
      {teacher.intro_video_url && (
        <div className="tp-video-section">
          {showVideo ? (
            <video
              src={teacher.intro_video_url}
              controls
              autoPlay
              className="tp-video-player"
            />
          ) : (
            <button
              type="button"
              className="tp-video-thumbnail"
              onClick={() => setShowVideo(true)}
            >
              <Play size={48} />
              <span>Watch Introduction Video</span>
            </button>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="tp-tabs">
        <button
          type="button"
          className={`tp-tab${activeTab === 'about' ? ' tp-tab--active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <BookOpen size={16} /> About
        </button>
        <button
          type="button"
          className={`tp-tab${activeTab === 'feed' ? ' tp-tab--active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <Rss size={16} /> Feed
        </button>
        <button
          type="button"
          className={`tp-tab${activeTab === 'reviews' ? ' tp-tab--active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <MessageSquare size={16} /> Reviews ({reviews.length})
        </button>
        <button
          type="button"
          className={`tp-tab${activeTab === 'availability' ? ' tp-tab--active' : ''}`}
          onClick={() => setActiveTab('availability')}
        >
          <Clock size={16} /> Availability
        </button>
      </div>

      <div className="tp-body">
        {/* About tab */}
        {activeTab === 'about' && (
          <div className="tp-about">
            <div className="tp-section">
              <h2><User size={18} /> Bio</h2>
              <p className="tp-bio">{teacher.bio}</p>
            </div>

            <div className="tp-section">
              <h2><Briefcase size={18} /> Teaching Experience</h2>
              <p className="tp-experience">{teacher.experience_description}</p>
            </div>

            {teacher.qualifications && teacher.qualifications.length > 0 && (
              <div className="tp-section">
                <h2><Award size={18} /> Qualifications</h2>
                <div className="tp-qualifications">
                  {teacher.qualifications.map((q) => (
                    <div key={q.id} className="tp-qual">
                      <div className="tp-qual__icon"><Award size={16} /></div>
                      <div className="tp-qual__info">
                        <span className="tp-qual__title">{q.title}</span>
                        <span className="tp-qual__institution">{q.institution} ({q.year})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="tp-section">
              <h2><BookOpen size={18} /> Subjects & Levels</h2>
              <div className="tp-subjects-list">
                {teacher.subjects?.map((s) => (
                  <div key={s.id} className="tp-subject-row">
                    <SubjectBadge subject={s.subject_name} level={s.academic_level} size="md" />
                    <span className="tp-subject-row__forms">
                      {s.form_levels?.join(', ')}
                    </span>
                    <span className="tp-subject-row__curriculum">{s.curriculum}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feed tab */}
        {activeTab === 'feed' && (
          <div className="tp-feed">
            {postsLoading ? (
              <div className="tp-feed__loading">
                <Loader2 size={24} className="marketplace-loading__spinner" />
                <span>Loading posts...</span>
              </div>
            ) : posts.length > 0 ? (
              <div className="tp-feed__list">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={user?.id}
                    currentUserName={user ? `${user.name} ${user.surname?.charAt(0) || ''}.` : undefined}
                    onLike={handleLikePost}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                  />
                ))}
              </div>
            ) : (
              <div className="tp-feed__empty">
                <Rss size={48} />
                <h3>No Posts Yet</h3>
                <p>This teacher hasn't shared any posts yet. Check back later!</p>
              </div>
            )}
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === 'reviews' && (
          <div className="tp-reviews">
            <div className="tp-reviews-summary">
              <div className="tp-reviews-summary__big">
                <span className="tp-reviews-summary__number">{(teacher.average_rating || 0).toFixed(1)}</span>
                <StarRating rating={teacher.average_rating || 0} size={20} />
                <span className="tp-reviews-summary__count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="tp-reviews-summary__bars">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => Math.floor(r.rating) === star).length;
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="tp-rating-bar">
                      <span>{star}<Star size={12} /></span>
                      <div className="tp-rating-bar__track">
                        <div className="tp-rating-bar__fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="tp-rating-bar__count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Write review */}
            {user && (
              <div className="tp-write-review">
                <h3>Write a Review</h3>
                <div className="tp-write-review__rating">
                  <span>Your Rating:</span>
                  <StarRating
                    rating={reviewRating}
                    size={22}
                    interactive
                    onChange={setReviewRating}
                  />
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this teacher..."
                  rows={3}
                  className="tp-write-review__input"
                />
                <button
                  type="button"
                  className="to-btn to-btn--primary to-btn--sm"
                  onClick={handleSubmitReview}
                  disabled={!reviewComment.trim() || submittingReview}
                >
                  {submittingReview ? <Loader2 size={14} className="to-spinner" /> : <Send size={14} />}
                  Submit Review
                </button>
              </div>
            )}

            {/* Review list */}
            <div className="tp-review-list">
              {reviews.length > 0 ? (
                reviews.map((r) => <ReviewCard key={r.id} review={r} />)
              ) : (
                <div className="tp-reviews-empty">
                  <MessageSquare size={32} />
                  <p>No reviews yet. Be the first to leave a review!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Availability tab */}
        {activeTab === 'availability' && (
          <div className="tp-availability">
            <h2><Clock size={18} /> Weekly Availability</h2>
            <AvailabilityGrid availability={teacher.availability || []} />
            <div className="tp-availability__cta">
              <button
                type="button"
                className="to-btn to-btn--primary"
                onClick={() => navigate(`/app/marketplace/book/${teacher.id}`)}
              >
                <Calendar size={16} /> Book a Lesson
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
