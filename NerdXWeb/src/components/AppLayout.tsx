import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bell, Sun, Moon } from 'lucide-react';

export function AppLayout() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const initial = (user?.name || 'N')[0].toUpperCase();

  return (
    <div className="app-layout">
      <header className="dashboard-header">
        <div className="header-inner">
          <Link to="/app" className="header-logo">
            <img src="/logo.png" alt="" className="header-logo-img" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span>NerdX</span>
          </Link>
          <div className="header-actions">
            <button
              type="button"
              className="icon-btn theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button type="button" className="icon-btn" aria-label="Notifications" title="Coming soon">
              <Bell size={20} />
            </button>
            <Link to="/app/account" className="profile-btn" aria-label="Account">
              <span className="profile-initial">{initial}</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
