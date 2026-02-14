import { useState } from 'react';
import type { FeedbackItem } from '../../types';
import { MessageSquare, Star, MessageCircle, ChevronDown, User } from 'lucide-react';

interface StudentFeedbackFeedProps {
  items: FeedbackItem[];
  loading?: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function StudentFeedbackFeed({ items, loading }: StudentFeedbackFeedProps) {
  const [visibleCount, setVisibleCount] = useState(5);

  if (loading) {
    return (
      <div className="td-v2-feedback">
        <div className="td-v2-feedback__header">
          <MessageSquare size={18} />
          <h3>Student Feedback</h3>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="td-v2-skeleton td-v2-skeleton--feedback" />
        ))}
      </div>
    );
  }

  const visible = items.slice(0, visibleCount);
  const hasMore = items.length > visibleCount;

  return (
    <div className="td-v2-feedback">
      <div className="td-v2-feedback__header">
        <div className="td-v2-feedback__title">
          <MessageSquare size={18} />
          <h3>Student Feedback</h3>
        </div>
        <span className="td-v2-feedback__count">{items.length} total</span>
      </div>

      {items.length === 0 ? (
        <div className="td-v2-feedback-empty">
          <MessageCircle size={32} />
          <p>No feedback yet. Keep teaching and reviews will come!</p>
        </div>
      ) : (
        <div className="td-v2-feedback-list">
          {visible.map(item => (
            <div key={item.id} className={`td-v2-feedback-item td-v2-feedback-item--${item.type}`}>
              <div className="td-v2-feedback-item__avatar">
                <User size={16} />
              </div>
              <div className="td-v2-feedback-item__content">
                <div className="td-v2-feedback-item__top">
                  <span className="td-v2-feedback-item__name">{item.studentName}</span>
                  {item.type === 'review' && item.rating && (
                    <span className="td-v2-feedback-item__stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < item.rating! ? '#FFAB00' : 'transparent'}
                          color={i < item.rating! ? '#FFAB00' : 'rgba(255,255,255,0.2)'}
                        />
                      ))}
                    </span>
                  )}
                  <span className="td-v2-feedback-item__time">{timeAgo(item.timestamp)}</span>
                </div>
                <p className="td-v2-feedback-item__text">{item.content}</p>
                {item.type === 'comment' && item.postTitle && (
                  <span className="td-v2-feedback-item__post-ref">
                    <MessageCircle size={10} /> on: {item.postTitle}
                  </span>
                )}
              </div>
              <span className={`td-v2-feedback-item__badge td-v2-feedback-item__badge--${item.type}`}>
                {item.type === 'review' ? 'Review' : 'Comment'}
              </span>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <button
          className="td-v2-feedback-more"
          onClick={() => setVisibleCount(prev => prev + 5)}
        >
          <ChevronDown size={16} /> Show More ({items.length - visibleCount} remaining)
        </button>
      )}
    </div>
  );
}
