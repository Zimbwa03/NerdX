import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Monitor, RefreshCw, Shield, Trash2 } from 'lucide-react';
import { FloatingParticles } from '../../components/FloatingParticles';
import { accountApi, type LoginSession } from '../../services/api/accountApi';

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

function deviceDesc(info: any) {
  if (!info) return 'Unknown device';
  const parts: string[] = [];
  if (info.platform) parts.push(info.platform);
  if (info.model) parts.push(info.model);
  if (info.os_version) parts.push(`v${info.os_version}`);
  return parts.length ? parts.join(' • ') : 'Unknown device';
}

export function SecurityCenterPage() {
  const [tab, setTab] = useState<'password' | 'sessions' | 'history'>('password');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [history, setHistory] = useState<LoginSession[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const loadData = useCallback(async () => {
    try {
      const [sessionsData, historyData] = await Promise.all([accountApi.getActiveSessions(), accountApi.getLoginHistory(20)]);
      setSessions(sessionsData || []);
      setHistory(historyData || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    showToast('Updated');
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('Fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }
    setPwLoading(true);
    const result = await accountApi.changePassword(oldPassword, newPassword);
    setPwLoading(false);
    if (result.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated');
    } else {
      showToast(result.message || 'Failed to change password');
    }
  };

  const logoutSession = async (sessionId: number) => {
    const ok = window.confirm('Log out this session?');
    if (!ok) return;
    const success = await accountApi.logoutSession(sessionId);
    if (success) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      showToast('Session logged out');
    } else {
      showToast('Failed to log out session');
    }
  };

  const tips = useMemo(
    () => [
      'Use at least 8 characters with letters, numbers, and symbols',
      'Do not reuse passwords from other accounts',
      'Never share your password with anyone',
    ],
    []
  );

  return (
    <div className="security-page">
      <FloatingParticles count={10} />

      {toast && (
        <div className="security-toast" role="status">
          {toast}
        </div>
      )}

      <header className="security-header">
        <Link to="/app/account" className="back-link">
          <span aria-hidden="true">&larr;</span> Back
        </Link>
        <div className="security-title">
          <h1>
            <Shield size={20} /> Security Center
          </h1>
          <p>Password, sessions, and login history</p>
        </div>
        <button type="button" className="security-btn" onClick={onRefresh} disabled={refreshing || loading}>
          <RefreshCw size={16} /> {refreshing ? 'Refreshing' : 'Refresh'}
        </button>
      </header>

      {loading ? (
        <div className="security-loading">Loading security data...</div>
      ) : (
        <>
          <div className="security-tabs">
            <button type="button" className={`security-tab ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>
              Password
            </button>
            <button type="button" className={`security-tab ${tab === 'sessions' ? 'active' : ''}`} onClick={() => setTab('sessions')}>
              Sessions
            </button>
            <button type="button" className={`security-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
              History
            </button>
          </div>

          {tab === 'password' && (
            <div className="security-card">
              <div className="security-card-head">
                <Lock size={18} />
                <h2>Change password</h2>
              </div>

              <div className="security-form">
                <label className="security-label">
                  Old password
                  <div className="security-input-row">
                    <input
                      className="security-input"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      type={showOld ? 'text' : 'password'}
                      placeholder="Enter old password"
                    />
                    <button type="button" className="security-eye" onClick={() => setShowOld((p) => !p)} aria-label="Toggle old password visibility">
                      {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                <label className="security-label">
                  New password
                  <div className="security-input-row">
                    <input
                      className="security-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type={showNew ? 'text' : 'password'}
                      placeholder="Enter new password"
                    />
                    <button type="button" className="security-eye" onClick={() => setShowNew((p) => !p)} aria-label="Toggle new password visibility">
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                <label className="security-label">
                  Confirm new password
                  <input
                    className="security-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirm new password"
                  />
                </label>

                <button type="button" className="security-btn primary" onClick={changePassword} disabled={pwLoading}>
                  {pwLoading ? 'Updating...' : 'Update password'}
                </button>
              </div>

              <div className="security-tips">
                <div className="security-tips-title">Security tips</div>
                <ul className="security-tips-list">
                  {tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'sessions' && (
            <div className="security-card">
              <div className="security-card-head">
                <Monitor size={18} />
                <h2>Active sessions</h2>
              </div>
              {sessions.length ? (
                <div className="security-list">
                  {sessions.map((s) => (
                    <div key={s.id} className="security-item">
                      <div className="security-item-left">
                        <div className="security-item-title">{deviceDesc(s.device_info)}</div>
                        <div className="security-item-sub">
                          {(s.ip_address || 'Unknown IP') + ' • ' + formatDate(s.login_at)}
                        </div>
                        {s.is_current && <div className="security-pill">Current session</div>}
                      </div>
                      {!s.is_current && (
                        <button type="button" className="security-btn danger" onClick={() => void logoutSession(s.id)}>
                          <Trash2 size={16} /> Logout
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="security-empty">No active sessions found.</div>
              )}
            </div>
          )}

          {tab === 'history' && (
            <div className="security-card">
              <div className="security-card-head">
                <Monitor size={18} />
                <h2>Login history</h2>
              </div>
              {history.length ? (
                <div className="security-list">
                  {history.map((s) => (
                    <div key={s.id} className="security-item">
                      <div className="security-item-left">
                        <div className="security-item-title">{deviceDesc(s.device_info)}</div>
                        <div className="security-item-sub">
                          {(s.ip_address || 'Unknown IP') + ' • ' + formatDate(s.login_at)}
                        </div>
                      </div>
                      <div className={`security-status ${s.is_active ? 'active' : ''}`}>{s.is_active ? 'Active' : 'Ended'}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="security-empty">No login history yet.</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

