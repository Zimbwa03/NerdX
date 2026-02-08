import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Gift, Info, RefreshCw, TriangleAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getNotifications,
  markAllAsRead,
  subscribeToNotifications,
  type NotificationRecipient,
} from '../../services/notifications';
import { getSupabaseAuthUserId } from '../../services/supabase';

function formatRelative(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

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

export function NotificationsPage() {
  const navigate = useNavigate();
  const { isSupabaseAuthReady } = useAuth();
  const [items, setItems] = useState<NotificationRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const load = useCallback(
    async (reset: boolean) => {
      try {
        if (reset) {
          setLoading(true);
          setOffset(0);
        } else {
          setLoadingMore(true);
        }
        const currentOffset = reset ? 0 : offset;
        const data = await getNotifications(20, currentOffset);
        setItems((prev) => (reset ? data : [...prev, ...data]));
        setHasMore(data.length === 20);
        setOffset(currentOffset + data.length);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [offset]
  );

  useEffect(() => {
    void load(true);
  }, [load]);

  useEffect(() => {
    if (!isSupabaseAuthReady) return;
    let unsubscribe: (() => void) | undefined;
    let active = true;

    (async () => {
      const supabaseUserId = await getSupabaseAuthUserId();
      if (!active || !supabaseUserId) return;
      unsubscribe = subscribeToNotifications(
        supabaseUserId,
        (newRecipient) => setItems((prev) => [newRecipient, ...prev]),
        (updatedRecipient) =>
          setItems((prev) => prev.map((n) => (n.id === updatedRecipient.id ? { ...n, ...updatedRecipient } : n)))
      );
    })();

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, [isSupabaseAuthReady]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read_at).length, [items]);

  const markAll = async () => {
    const ok = await markAllAsRead();
    if (ok) {
      setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
      showToast('Marked all as read');
    } else {
      showToast('Failed to mark as read');
    }
  };

  const openItem = (recipient: NotificationRecipient) => {
    navigate(`/app/notifications/${recipient.id}`, { state: { recipient } });
  };

  return (
    <div className="notifications-page">
      {toast && (
        <div className="notifications-toast" role="status">
          {toast}
        </div>
      )}

      <header className="notifications-header">
        <Link to="/app" className="back-link">
          <span aria-hidden="true">&larr;</span> Back
        </Link>
        <div className="notifications-title">
          <h1>
            <Bell size={22} /> Notifications
          </h1>
          <p>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            {!isSupabaseAuthReady ? ' (Supabase session not active)' : ''}
          </p>
        </div>
        <div className="notifications-actions">
          <button type="button" className="notifications-btn" onClick={() => void load(true)} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="notifications-btn primary" onClick={markAll} disabled={items.length === 0}>
            Mark all read
          </button>
        </div>
      </header>

      {!isSupabaseAuthReady && (
        <div className="notifications-callout">
          Notifications require Supabase auth (used for secure realtime updates). If you just signed in, wait a moment; otherwise log out and log in again.
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="notifications-loading">Loading notifications...</div>
      ) : items.length === 0 ? (
        <div className="notifications-empty">
          <div className="notifications-empty-icon">
            <Bell size={34} />
          </div>
          <h2>No notifications yet</h2>
          <p>Updates and messages will appear here.</p>
        </div>
      ) : (
        <>
          <div className="notifications-list">
            {items.map((r) => {
              const n = r.notification;
              if (!n) return null;
              const unread = !r.read_at;
              const Icon = getTypeIcon(n.type);
              const color = getTypeColor(n.type);
              return (
                <button
                  key={r.id}
                  type="button"
                  className={`notifications-item ${unread ? 'unread' : ''}`}
                  onClick={() => openItem(r)}
                >
                  <div className="notifications-item-icon" style={{ background: `${color}22`, borderColor: `${color}33` }}>
                    <Icon size={20} color={color as any} />
                  </div>
                  <div className="notifications-item-body">
                    <div className="notifications-item-top">
                      <div className="notifications-item-title">{n.title}</div>
                      {unread && <span className="notifications-unread-dot" aria-label="Unread" />}
                    </div>
                    <div className="notifications-item-text">{n.body}</div>
                    <div className="notifications-item-time">{formatRelative(r.created_at)}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="notifications-footer">
            <button
              type="button"
              className="notifications-btn"
              onClick={() => void load(false)}
              disabled={!hasMore || loadingMore}
              title={hasMore ? 'Load more' : 'No more notifications'}
            >
              {loadingMore ? 'Loading...' : hasMore ? 'Load more' : 'No more'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

