import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Trash2, Clock, Lightbulb, Image, Video, BookOpen, FileText } from 'lucide-react';
import { SubjectBadge } from './SubjectBadge';
import { CommentThread } from './CommentThread';
import type { TeacherPost, PostComment } from '../../types';

interface PostCardProps {
  post: TeacherPost;
  currentUserId?: string;
  currentUserName?: string;
  isOwner?: boolean;
  showTeacherLink?: boolean;
  onLike?: (postId: string) => Promise<{ liked: boolean; newCount: number }>;
  onDelete?: (postId: string) => void;
  onAddComment?: (postId: string, content: string) => Promise<PostComment | null>;
  onDeleteComment?: (commentId: string, postId: string) => void;
}

const POST_TYPE_ICONS: Record<string, React.ReactNode> = {
  tip: <Lightbulb size={14} />,
  image: <Image size={14} />,
  video: <Video size={14} />,
  resource: <BookOpen size={14} />,
  text: <FileText size={14} />,
};

const POST_TYPE_LABELS: Record<string, string> = {
  tip: 'Learning Tip',
  image: 'Photo',
  video: 'Video',
  resource: 'Resource',
  text: 'Post',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function PostCard({
  post,
  currentUserId,
  currentUserName,
  isOwner = false,
  showTeacherLink = false,
  onLike,
  onDelete,
  onAddComment,
  onDeleteComment,
}: PostCardProps) {
  const [liked, setLiked] = useState(post.user_has_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [showAllComments, setShowAllComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

  const handleLike = async () => {
    if (!currentUserId || !onLike || likeLoading) return;
    setLikeLoading(true);
    try {
      const result = await onLike(post.id);
      setLiked(result.liked);
      setLikesCount(result.newCount);
      if (result.liked) {
        setLikeAnimation(true);
        setTimeout(() => setLikeAnimation(false), 600);
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentAdded = () => {
    setCommentsCount((c) => c + 1);
  };

  const handleCommentDeleted = () => {
    setCommentsCount((c) => Math.max(0, c - 1));
  };

  const initials = (post.teacher_name || 'T')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const teacherProfileUrl = post.teacher_id ? `/app/marketplace/teacher/${post.teacher_id}` : '#';

  return (
    <div className="post-card post-card--v2">
      {/* Header */}
      <div className="post-card__header">
        <Link to={teacherProfileUrl} className="post-card__avatar-link">
          <div className="post-card__avatar">
            {post.teacher_image ? (
              <img src={post.teacher_image} alt={post.teacher_name} />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        </Link>
        <div className="post-card__meta">
          {showTeacherLink ? (
            <Link to={teacherProfileUrl} className="post-card__author post-card__author--link">
              {post.teacher_name || 'Teacher'}
            </Link>
          ) : (
            <span className="post-card__author">{post.teacher_name || 'Teacher'}</span>
          )}
          <span className="post-card__time">
            <Clock size={12} />
            {timeAgo(post.created_at)}
          </span>
        </div>
        <div className="post-card__badges">
          <span className={`post-card__type post-card__type--${post.post_type}`}>
            {POST_TYPE_ICONS[post.post_type]}
            {POST_TYPE_LABELS[post.post_type] || 'Post'}
          </span>
          {post.subject_tag && <SubjectBadge subject={post.subject_tag} size="sm" />}
        </div>
        {isOwner && (
          <button
            className="post-card__delete"
            onClick={() => onDelete?.(post.id)}
            title="Delete post"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="post-card__content">
        {post.content.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* Media */}
      {post.media_url && (
        <div className="post-card__media">
          {post.post_type === 'video' ? (
            <video src={post.media_url} controls preload="metadata" />
          ) : (
            <img src={post.media_url} alt="Post media" loading="lazy" />
          )}
        </div>
      )}

      {/* Actions bar */}
      <div className="post-card__actions">
        <button
          className={`post-card__action-btn post-card__like${liked ? ' post-card__like--active' : ''}${likeAnimation ? ' post-card__like--pulse' : ''}`}
          onClick={handleLike}
          disabled={!currentUserId || likeLoading}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          <span>{likesCount}</span>
        </button>
        <button
          className={`post-card__action-btn post-card__comment-btn${showAllComments ? ' post-card__comment-btn--active' : ''}`}
          onClick={() => setShowAllComments(!showAllComments)}
        >
          <MessageCircle size={18} />
          <span>{commentsCount}</span>
        </button>
      </div>

      {/* Inline preview comments (always show first 2) */}
      <CommentThread
        postId={post.id}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        onAddComment={onAddComment}
        onDeleteComment={onDeleteComment}
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={handleCommentDeleted}
        previewMode={!showAllComments}
        previewCount={2}
        totalComments={commentsCount}
        onExpandRequest={() => setShowAllComments(true)}
      />
    </div>
  );
}
