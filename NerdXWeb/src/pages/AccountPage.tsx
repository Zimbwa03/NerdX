import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Gift, Hash, LogOut, Mail, Phone, Receipt, Shield, SlidersHorizontal, User } from 'lucide-react';

export function AccountPage() {
  const { user, logout } = useAuth();

  return (
    <div className="account-page">
      <Link to="/app" className="back-link">
        <span aria-hidden="true">&larr;</span> Back to Dashboard
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
              <Phone size={20} />
              <span>{user.phone_number}</span>
            </div>
          )}
          <div className="account-row">
            <Hash size={20} />
            <span>NerdX ID: {user?.nerdx_id || 'N/A'}</span>
          </div>
        </div>
        <div className="account-actions">
          <h2 className="account-actions-title">Account tools</h2>
          <div className="account-actions-grid">
            <Link to="/app/referral" className="account-action-card">
              <span className="account-action-icon" aria-hidden="true">
                <Gift size={18} />
              </span>
              <span className="account-action-text">
                <span className="account-action-title">Referral Hub</span>
                <span className="account-action-subtitle">Invite friends, earn credits</span>
              </span>
            </Link>

            <Link to="/app/billing" className="account-action-card">
              <span className="account-action-icon" aria-hidden="true">
                <Receipt size={18} />
              </span>
              <span className="account-action-text">
                <span className="account-action-title">Billing</span>
                <span className="account-action-subtitle">Payments and credit usage</span>
              </span>
            </Link>

            <Link to="/app/security" className="account-action-card">
              <span className="account-action-icon" aria-hidden="true">
                <Shield size={18} />
              </span>
              <span className="account-action-text">
                <span className="account-action-title">Security Center</span>
                <span className="account-action-subtitle">Password and sessions</span>
              </span>
            </Link>

            <Link to="/app/preferences" className="account-action-card">
              <span className="account-action-icon" aria-hidden="true">
                <SlidersHorizontal size={18} />
              </span>
              <span className="account-action-text">
                <span className="account-action-title">Learning Preferences</span>
                <span className="account-action-subtitle">Goals, difficulty, reminders</span>
              </span>
            </Link>

            <Link to="/app/notifications" className="account-action-card">
              <span className="account-action-icon" aria-hidden="true">
                <Bell size={18} />
              </span>
              <span className="account-action-text">
                <span className="account-action-title">Notifications</span>
                <span className="account-action-subtitle">Updates and messages</span>
              </span>
            </Link>
          </div>
        </div>
        <button type="button" className="logout-btn" onClick={() => logout()}>
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </div>
  );
}
