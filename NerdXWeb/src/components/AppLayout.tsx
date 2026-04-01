import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appUpdateApi, type AppUpdateInfo } from '../services/api/appUpdateApi';
import { useUnreadNotificationCount } from '../hooks/useUnreadNotificationCount';
import { Topbar } from './dashboard/Topbar';

/** Full-bleed experiences that ship their own chrome (no outer AppLayout top bar). */
const IMMERSIVE_APP_PREFIXES = [
  '/app/project-assistant',
  '/app/teacher/chat',
  '/app/offline',
  '/app/nerdx-live',
  '/app/ai-classroom',
] as const;

function isImmersiveAppPath(pathname: string): boolean {
  return IMMERSIVE_APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function AppLayout() {
  const { user, isSupabaseAuthReady } = useAuth();
  const location = useLocation();
  const unreadCount = useUnreadNotificationCount(isSupabaseAuthReady);
  const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo | null>(null);
  const [softDismissed, setSoftDismissed] = useState(false);

  const isDashboardHome = location.pathname === '/app' || location.pathname === '/app/';
  const immersive = isImmersiveAppPath(location.pathname);
  /** Premium Topbar for most /app routes; dashboard home has its own shell; immersive pages are full-bleed. */
  const showAppTopChrome = !isDashboardHome && !immersive;

  const softUpdateBanner =
    updateInfo?.soft_update && !updateInfo.update_required && !softDismissed ? (
      <div
        className={`update-banner${isDashboardHome || showAppTopChrome ? ' update-banner--flush-top' : ''}`}
        role="status"
      >
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
                localStorage.setItem(
                  'nerdx_soft_update_dismissed_v1',
                  JSON.stringify({ latest: updateInfo.latest_version, at: new Date().toISOString() }),
                );
              } catch {
                // ignore
              }
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    ) : null;

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

  return (
    <div
      className={`app-layout${isDashboardHome ? ' app-layout--dashboard-home' : ''}${immersive ? ' app-layout--immersive' : ''}`}
    >
      {showAppTopChrome ? (
        <div className="dashboard-premium-shell flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--text-primary)] antialiased">
          <Topbar
            userInitial={(user?.name || 'S').slice(0, 1)}
            hasUnreadNotifications={unreadCount > 0}
            showMobileMenu={false}
          />
          {softUpdateBanner}
          <main className="app-main app-main--premium-chrome min-h-0 flex-1">
            <Outlet />
          </main>
        </div>
      ) : (
        <>
          {softUpdateBanner}
          <main
            className={`app-main${isDashboardHome ? ' app-main--dashboard-fullbleed' : ''}${immersive ? ' app-main--immersive' : ''}`}
          >
            <Outlet />
          </main>
        </>
      )}

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
