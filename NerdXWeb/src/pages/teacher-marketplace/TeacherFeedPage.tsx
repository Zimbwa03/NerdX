/**
 * TeacherFeedPage - Global Facebook-style scrollable feed of ALL teachers' posts
 */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PostCard } from '../../components/marketplace/PostCard';
import {
  getAllPosts,
  toggleLike,
  addComment,
  deleteComment,
} from '../../services/api/teacherMarketplaceApi';
import type { TeacherPost, PostComment } from '../../types';
import {
  ArrowLeft, Rss, Loader2, RefreshCw, ChevronDown,
} from 'lucide-react';

const PAGE_SIZE = 10;

export function TeacherFeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<TeacherPost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNum: number, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const data = await getAllPosts(pageNum, PAGE_SIZE, user?.id);
      if (data.length < PAGE_SIZE) setHasMore(false);
      setPosts((prev) => append ? [...prev, ...data] : data);
    } catch {
      console.error('Failed to load feed');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  };

  const handleLike = async (postId: string) => {
    if (!user) return { liked: false, newCount: 0 };
    return toggleLike(postId, user.id);
  };

  const handleAddComment = async (postId: string, content: string): Promise<PostComment | null> => {
    if (!user) return null;
    return addComment(postId, user.id, user.name || 'Student', content);
  };

  const handleDeleteComment = (commentId: string, _postId: string) => {
    deleteComment(commentId);
  };

  return (
    <div className="global-feed-page">
      {/* Header */}
      <div className="global-feed-page__header">
        <Link to="/app/marketplace" className="global-feed-page__back">
          <ArrowLeft size={20} />
        </Link>
        <div className="global-feed-page__title-group">
          <Rss size={22} />
          <h1>Teacher Feed</h1>
        </div>
        <button
          type="button"
          className="global-feed-page__refresh"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
        </button>
      </div>

      <p className="global-feed-page__subtitle">
        Discover posts, tips, and resources from all teachers
      </p>

      {/* Feed Content */}
      <div className="global-feed-page__content">
        {loading ? (
          <div className="global-feed-page__skeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="feed-skeleton-card">
                <div className="feed-skeleton-card__header">
                  <div className="skeleton-circle" />
                  <div className="skeleton-lines">
                    <div className="skeleton-line skeleton-line--short" />
                    <div className="skeleton-line skeleton-line--shorter" />
                  </div>
                </div>
                <div className="skeleton-line skeleton-line--full" />
                <div className="skeleton-line skeleton-line--medium" />
                <div className="skeleton-block" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="global-feed-page__posts">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id}
                  currentUserName={user?.name}
                  onLike={handleLike}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                  showTeacherLink
                />
              ))}
            </div>

            {hasMore && (
              <button
                type="button"
                className="global-feed-page__load-more"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader2 size={16} className="spin" /> Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} /> Load More Posts
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="global-feed-page__empty">
            <Rss size={48} />
            <h3>No Posts Yet</h3>
            <p>Teachers haven't shared any content yet. Check back soon for learning tips, resources, and updates!</p>
            <Link to="/app/marketplace" className="global-feed-page__browse-btn">
              Browse Teachers
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
