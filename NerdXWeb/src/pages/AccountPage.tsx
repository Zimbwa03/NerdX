import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Hash } from 'lucide-react';

export function AccountPage() {
  const { user, logout } = useAuth();

  return (
    <div className="account-page">
      <Link to="/app" className="back-link">
        <span>←</span> Back to Dashboard
      </Link>
      <div className="account-card glass-card">
        <div className="account-header">
          <div className="account-avatar">
            {(user?.name || 'N')[0].toUpperCase()}
          </div>
          <h1>Account</h1>
          <p className="account-subtitle">Your profile and settings</p>
        </div>
        <div className="account-details">
          <div className="account-row">
            <User size={20} />
            <span>{user?.name} {user?.surname || ''}</span>
          </div>
          {user?.email && (
            <div className="account-row">
              <Mail size={20} />
              <span>{user.email}</span>
            </div>
          )}
          {user?.phone_number && (
            <div className="account-row">
              <span className="account-icon">📱</span>
              <span>{user.phone_number}</span>
            </div>
          )}
          <div className="account-row">
            <Hash size={20} />
            <span>NerdX ID: {user?.nerdx_id || 'N/A'}</span>
          </div>
        </div>
        <p className="account-coming-soon">Change password and other settings coming soon.</p>
        <button type="button" className="logout-btn" onClick={() => logout()}>
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </div>
  );
}
