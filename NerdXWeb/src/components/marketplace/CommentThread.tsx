import { useState, useEffect } from 'react';
import { Send, Trash2, Loader } from 'lucide-react';
import { getPostComments } from '../../services/api/teacherMarketplaceApi';
import type { PostComment } from '../../types';

interface CommentThreadProps {
  postId: string;
  currentUserId?: string;
  currentUserName?: string;
  onAddComment?: (postId: string, content: string) => Promise<PostComment | null>;
  onDeleteComment?: (commentId: string, postId: string) => void;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export function CommentThread({
  postId,
  currentUserId,
  currentUserName,
  onAddComment,
  onDeleteComment,
  onCommentAdded,
  onCommentDeleted,
}: CommentThreadProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      const comment = await onAddComment(postId, newComment.trim());
      if (comment) {
        setComments((prev) => [...prev, comment]);
        setNewComment('');
        onCommentAdded?.();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    onDeleteComment?.(commentId, postId);
    onCommentDeleted?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const userInitial = (name: string) =>
    name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="comment-thread">
      {loading ? (
        <div className="comment-thread__loading">
          <Loader size={16} className="spin" />
          <span>Loading comments...</span>
        </div>
      ) : (
        <>
          {comments.length === 0 && (
            <div className="comment-thread__empty">No comments yet. Be the first!</div>
          )}
          <div className="comment-thread__list">
            {comments.map((c) => (
              <div key={c.id} className="comment-item">
                <div className="comment-item__avatar">
                  {userInitial(c.user_name)}
                </div>
                <div className="comment-item__body">
                  <div className="comment-item__header">
                    <span className="comment-item__name">{c.user_name}</span>
                    <span className="comment-item__time">{timeAgo(c.created_at)}</span>
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
            ))}
          </div>
        </>
      )}

      {/* Write comment input */}
      {currentUserId && (
        <div className="comment-input">
          <div className="comment-input__avatar">
            {userInitial(currentUserName || 'U')}
          </div>
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
            {submitting ? <Loader size={16} className="spin" /> : <Send size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}
