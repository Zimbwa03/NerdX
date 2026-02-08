import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Gift, Info, RefreshCw, TriangleAlert } from 'lucide-react';
import {
  fetchNotificationRecipient,
  markAsRead,
  type NotificationRecipient,
} from '../../services/notifications';

function getTypeIcon(type?: string) {
  if (type === 'warning') return TriangleAlert;
  if (type === 'update') return RefreshCw;
  if (type === 'promo') return Gift;
  return Info;
}

function getTypeColor(type?: string) {
  if (type === 'warning') return '#FF6B6B';
  if (type === 'update') return '#4ECDC4';
  if (type === 'promo') return '#FFD93D';
  return 'var(--primary)';
}

function formatLong(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = (location.state || {}) as { recipient?: NotificationRecipient };

  const [recipient, setRecipient] = useState<NotificationRecipient | null>(state.recipient ?? null);
  const [loading, setLoading] = useState(!state.recipient);

  useEffect(() => {
    if (!id || recipient) return;
    let active = true;
    (async () => {
      setLoading(true);
      const full = await fetchNotificationRecipient(id);
      if (!active) return;
      setRecipient(full);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [id, recipient]);

  useEffect(() => {
    if (!recipient?.id || recipient.read_at) return;
    void markAsRead(recipient.id);
  }, [recipient?.id, recipient?.read_at]);

  const notification = recipient?.notification;
  const Icon = useMemo(() => getTypeIcon(notification?.type), [notification?.type]);
  const color = useMemo(() => getTypeColor(notification?.type), [notification?.type]);

  if (loading) {
    return (
      <div className="notification-detail-page">
        <Link to="/app/notifications" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <div className="notification-detail-loading">Loading notification...</div>
      </div>
    );
  }

  if (!recipient || !notification) {
    return (
      <div className="notification-detail-page">
        <Link to="/app/notifications" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <div className="notification-detail-missing">Notification not found.</div>
      </div>
    );
  }

  const actionUrl = notification.metadata?.action_url as string | undefined;
  const actionLabel = (notification.metadata?.action_label as string | undefined) || 'Open';

  return (
    <div className="notification-detail-page">
      <header className="notification-detail-header">
        <Link to="/app/notifications" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
      </header>

      <div className="notification-detail-card">
        <div className="notification-detail-icon" style={{ background: `${color}22`, borderColor: `${color}33` }}>
          <Icon size={34} color={color as any} />
        </div>
        <h1 className="notification-detail-title">{notification.title}</h1>
        <div className="notification-detail-time">{formatLong(recipient.created_at)}</div>
        <div className="notification-detail-body">{notification.body}</div>

        {actionUrl && (
          <a className="notification-detail-action" href={actionUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={18} /> {actionLabel}
          </a>
        )}
      </div>
    </div>
  );
}

