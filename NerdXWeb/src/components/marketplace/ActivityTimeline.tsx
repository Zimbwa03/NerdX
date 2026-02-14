import { useState } from 'react';
import type { ActivityItem } from '../../types';
import {
  Calendar, CheckCircle, Star, MessageSquare, FileText,
  ChevronDown, Activity,
} from 'lucide-react';

interface ActivityTimelineProps {
  items: ActivityItem[];
  loading?: boolean;
}

const ACTIVITY_CONFIG: Record<ActivityItem['type'], { icon: typeof Calendar; color: string; bg: string }> = {
  booking: { icon: Calendar, color: '#00E5FF', bg: 'rgba(0,229,255,0.12)' },
  lesson_completed: { icon: CheckCircle, color: '#00E676', bg: 'rgba(0,230,118,0.12)' },
  review: { icon: Star, color: '#FFAB00', bg: 'rgba(255,171,0,0.12)' },
  comment: { icon: MessageSquare, color: '#FF4081', bg: 'rgba(255,64,129,0.12)' },
  post: { icon: FileText, color: '#7C4DFF', bg: 'rgba(124,77,255,0.12)' },
};

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

export function ActivityTimeline({ items, loading }: ActivityTimelineProps) {
  const [visibleCount, setVisibleCount] = useState(8);

  if (loading) {
    return (
      <div className="td-v2-timeline">
        <div className="td-v2-timeline__header">
          <Activity size={18} />
          <h3>Recent Activity</h3>
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="td-v2-skeleton td-v2-skeleton--timeline" />
        ))}
      </div>
    );
  }

  const visible = items.slice(0, visibleCount);
  const hasMore = items.length > visibleCount;

  return (
    <div className="td-v2-timeline">
      <div className="td-v2-timeline__header">
        <Activity size={18} />
        <h3>Recent Activity</h3>
        <span className="td-v2-timeline__count">{items.length} events</span>
      </div>

      {items.length === 0 ? (
        <div className="td-v2-timeline-empty">
          <Activity size={32} />
          <p>No activity yet. Start by accepting bookings!</p>
        </div>
      ) : (
        <div className="td-v2-timeline-list">
          {visible.map((item, idx) => {
            const config = ACTIVITY_CONFIG[item.type];
            const Icon = config.icon;
            return (
              <div key={item.id} className="td-v2-timeline-item">
                {idx < visible.length - 1 && <div className="td-v2-timeline-item__line" />}
                <div
                  className="td-v2-timeline-item__icon"
                  style={{ background: config.bg, color: config.color }}
                >
                  <Icon size={14} />
                </div>
                <div className="td-v2-timeline-item__content">
                  <span className="td-v2-timeline-item__title">{item.title}</span>
                  <span className="td-v2-timeline-item__desc">{item.description}</span>
                </div>
                <span className="td-v2-timeline-item__time">{timeAgo(item.timestamp)}</span>
              </div>
            );
          })}
        </div>
      )}

      {hasMore && (
        <button
          className="td-v2-timeline-more"
          onClick={() => setVisibleCount(prev => prev + 8)}
        >
          <ChevronDown size={16} /> Show More
        </button>
      )}
    </div>
  );
}
