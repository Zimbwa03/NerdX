import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell, Sun, Moon, Search } from 'lucide-react';
import { getUnreadCount, subscribeToNotifications } from '../services/notifications';
import { getSupabaseAuthUserId } from '../services/supabase';
import { appUpdateApi, type AppUpdateInfo } from '../services/api/appUpdateApi';

export function AppLayout() {
  const { user, isSupabaseAuthReady } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const initial = (user?.name || 'N')[0].toUpperCase();
  const [unreadCount, setUnreadCount] = useState(0);
  const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo | null>(null);
  const [softDismissed, setSoftDismissed] = useState(false);

  useEffect(() => {
    let active = true;
    const dismissedKey = 'nerdx_soft_update_dismissed_v1';
    try {
      const raw = localStorage.getItem(dismissedKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { latest?: string; at?: string };
        if (parsed?.latest) setSoftDismissed(true);
      }
    } catch {
      // ignore
    }

    (async () => {
      if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
      const info = await appUpdateApi.check('web');
      if (!active) return;
      setUpdateInfo(info);
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const refreshUnread = async () => {
      const count = await getUnreadCount();
      if (!active) return;
      setUnreadCount(count);
    };

    if (!isSupabaseAuthReady) {
      setUnreadCount(0);
      return () => {
        active = false;
      };
    }

    void refreshUnread();

    (async () => {
      const supabaseUserId = await getSupabaseAuthUserId();
      if (!active || !supabaseUserId) return;
      unsubscribe = subscribeToNotifications(
        supabaseUserId,
        () => void refreshUnread(),
        () => void refreshUnread()
      );
    })();

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, [isSupabaseAuthReady]);

  return (
    <div className="app-layout">
      <header className="dashboard-header">
        <div className="header-inner">
          <Link to="/app" className="header-logo">
            <img src="/logo.png" alt="" className="header-logo-img" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span>NerdX</span>
          </Link>
          <div className="header-actions">
            <Link to="/app/marketplace" className="icon-btn header-marketplace" aria-label="Find a Teacher" title="Find a Teacher">
              <Search size={20} />
            </Link>
            <button
              type="button"
              className="icon-btn theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/app/notifications" className="icon-btn header-notifications" aria-label="Notifications" title="Notifications">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="header-notifications-badge" aria-label={`${unreadCount} unread notifications`}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <Link to="/app/account" className="profile-btn" aria-label="Account">
              <span className="profile-initial">{initial}</span>
            </Link>
          </div>
        </div>
      </header>

      {updateInfo?.soft_update && !updateInfo.update_required && !softDismissed && (
        <div className="update-banner" role="status">
          <span className="update-banner-text">
            {updateInfo.update_message || 'A new version of NerdX is available.'}
          </span>
          <div className="update-banner-actions">
            {updateInfo.update_url ? (
              <a className="update-banner-btn" href={updateInfo.update_url} target="_blank" rel="noreferrer">
                Update
              </a>
            ) : null}
            <button
              type="button"
              className="update-banner-btn secondary"
              onClick={() => {
                setSoftDismissed(true);
                try {
                  localStorage.setItem('nerdx_soft_update_dismissed_v1', JSON.stringify({ latest: updateInfo.latest_version, at: new Date().toISOString() }));
                } catch {
                  // ignore
                }
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main className="app-main">
        <Outlet />
      </main>

      {updateInfo?.update_required && (
        <div className="update-required-overlay" role="dialog" aria-label="Update required">
          <div className="update-required-card">
            <h3>Update Required</h3>
            <p>{updateInfo.update_message || 'Please update NerdX to continue.'}</p>
            <div className="update-required-actions">
              {updateInfo.update_url ? (
                <a className="gradient-btn" href={updateInfo.update_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  Update Now
                </a>
              ) : (
                <button type="button" className="gradient-btn" onClick={() => window.location.reload()}>
                  Reload
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
