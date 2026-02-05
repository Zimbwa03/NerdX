import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export function AppPlaceholderPage() {
  const { user, logout } = useAuth();

  return (
    <div className="auth-page">
      <div className="glass-card" style={{ maxWidth: 480 }}>
        <div className="logo-section">
          <img src="/logo.png" alt="NerdX" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <h1>Welcome to NerdX</h1>
          <p>You're logged in as {user?.name} {user?.surname}</p>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 24 }}>
          The full dashboard and features are coming soon. For now, you can access the mobile app for the complete experience.
        </p>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
          Credits: {user?.credits ?? 0}
        </p>

        <button
          type="button"
          className="gradient-btn"
          onClick={() => logout()}
          style={{ background: 'rgba(239, 68, 68, 0.8)' }}
        >
          <LogOut size={20} /> Log Out
        </button>
      </div>
    </div>
  );
}
