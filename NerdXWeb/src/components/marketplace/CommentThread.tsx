import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Loader, MessageCircle, Reply, X } from 'lucide-react';
import { getPostComments } from '../../services/api/teacherMarketplaceApi';
import type { PostComment } from '../../types';

interface CommentThreadProps {
  postId: string;
  currentUserId?: string;
  currentUserName?: string;
  onAddComment?: (postId: string, content: string, parentId?: string | null) => Promise<PostComment | null>;
  onDeleteComment?: (commentId: string, postId: string) => void;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
  /** When true, only show `previewCount` comments and a "View all" link */
  previewMode?: boolean;
  /** Number of comments to show in preview mode */
  previewCount?: number;
  /** Total comments count (used for "View all X comments" label) */
  totalComments?: number;
  /** Callback to expand from preview to full */
  onExpandRequest?: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return '1d';
  return `${days}d`;
}

/** Group flat comments into a tree: top-level + nested replies */
function buildCommentTree(flat: PostComment[]): PostComment[] {
  const map = new Map<string, PostComment>();
  const roots: PostComment[] = [];

  // Index all comments
  for (const c of flat) {
    map.set(c.id, { ...c, replies: [] });
  }

  // Build tree
  for (const c of flat) {
    const node = map.get(c.id)!;
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.replies!.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function CommentThread({
  postId,
  currentUserId,
  currentUserName,
  onAddComment,
  onDeleteComment,
  onCommentAdded,
  onCommentDeleted,
  previewMode = false,
  previewCount = 2,
  totalComments = 0,
  onExpandRequest,
}: CommentThreadProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-load comments on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await getPostComments(postId);
      if (!cancelled) {
        setComments(data);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [postId]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !onAddComment || submitting) return;
    setSubmitting(true);
    try {
      const parentId = replyingTo?.id || null;
      const comment = await onAddComment(postId, newComment.trim(), parentId);
      if (comment) {
        // Add parent_id to the returned comment for local state
        const newC = { ...comment, parent_id: parentId };
        setComments((prev) => [...prev, newC]);
        setNewComment('');
        setReplyingTo(null);
        onCommentAdded?.();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (commentId: string) => {
    // Remove comment and all its replies
    setComments((prev) => prev.filter((c) => c.id !== commentId && c.parent_id !== commentId));
    onDeleteComment?.(commentId, postId);
    onCommentDeleted?.();
  };

  const handleReply = (commentId: string, userName: string) => {
    setReplyingTo({ id: commentId, name: userName });
    setNewComment('');
    // Focus the input
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape' && replyingTo) {
      cancelReply();
    }
  };

  const userInitial = (name: string) =>
    name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  // Build tree for threaded display
  const tree = buildCommentTree(comments);
  const displayComments = previewMode ? tree.slice(0, previewCount) : tree;
  const hiddenCount = previewMode ? Math.max(0, (totalComments || comments.length) - previewCount) : 0;

  /** Render a single comment + its nested replies */
  const renderComment = (c: PostComment, isReply = false) => (
    <div key={c.id} className={`comment-item ${isReply ? 'comment-item--reply' : ''}`}>
      <div className="comment-item__avatar">
        {userInitial(c.user_name)}
      </div>
      <div className="comment-item__body">
        <div className="comment-item__header">
          <span className="comment-item__name">{c.user_name}</span>
          <span className="comment-item__time">{timeAgo(c.created_at)}</span>
          {/* Reply button -- visible to everyone */}
          {currentUserId && !previewMode && (
            <button
              className="comment-item__reply-btn"
              onClick={() => handleReply(isReply ? (c.parent_id || c.id) : c.id, c.user_name)}
              title={`Reply to ${c.user_name}`}
            >
              <Reply size={12} />
              <span>Reply</span>
            </button>
          )}
          {currentUserId === c.user_id && (
            <button
              className="comment-item__delete"
              onClick={() => handleDelete(c.id)}
              title="Delete comment"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
        <p className="comment-item__text">{c.content}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="comment-thread comment-thread--inline">
        <div className="comment-thread__loading">
          <Loader size={14} className="spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`comment-thread ${previewMode ? 'comment-thread--inline' : ''}`}>
      {/* Comments list */}
      {displayComments.length > 0 && (
        <div className="comment-thread__list">
          {displayComments.map((c) => (
            <div key={c.id} className="comment-group">
              {renderComment(c, false)}
              {/* Render nested replies */}
              {!previewMode && c.replies && c.replies.length > 0 && (
                <div className="comment-replies">
                  {c.replies.map((r) => renderComment(r, true))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* "View all X comments" expander */}
      {previewMode && hiddenCount > 0 && (
        <button
          type="button"
          className="comment-thread__view-all"
          onClick={onExpandRequest}
        >
          <MessageCircle size={14} />
          View all {totalComments || comments.length} comments
        </button>
      )}

      {/* Empty state (only in full mode) */}
      {!previewMode && comments.length === 0 && (
        <div className="comment-thread__empty">No comments yet. Be the first!</div>
      )}

      {/* Reply indicator */}
      {replyingTo && !previewMode && (
        <div className="comment-reply-indicator">
          <Reply size={13} />
          <span>Replying to <strong>{replyingTo.name}</strong></span>
          <button className="comment-reply-indicator__cancel" onClick={cancelReply} title="Cancel reply">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Write comment input (always visible when logged in, unless preview mode) */}
      {currentUserId && !previewMode && (
        <div className={`comment-input ${replyingTo ? 'comment-input--replying' : ''}`}>
          <div className="comment-input__avatar">
            {userInitial(currentUserName || 'U')}
          </div>
          <input
            ref={inputRef}
            type="text"
            className="comment-input__field"
            placeholder={replyingTo ? `Reply to ${replyingTo.name}...` : 'Write a comment...'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={submitting}
            maxLength={500}
          />
          <button
            className="comment-input__send"
            onClick={handleSubmit}
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? <Loader size={16} className="spin" /> : <Send size={16} />}
          </button>
        </div>
      )}

      {/* Mini comment input in preview mode */}
      {currentUserId && previewMode && (
        <div className="comment-input comment-input--mini">
          <input
            type="text"
            className="comment-input__field"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={submitting}
            maxLength={500}
          />
          <button
            className="comment-input__send"
            onClick={handleSubmit}
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? <Loader size={14} className="spin" /> : <Send size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}
