import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Gift, LinkIcon, Share2, Users } from 'lucide-react';
import { FloatingParticles } from '../../components/FloatingParticles';
import { accountApi, type ReferralShareLink, type ReferralStats } from '../../services/api/accountApi';

function formatDate(dateString: string | null) {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
}

function buildWebLink(code: string): string {
  return code ? `${window.location.origin}/register?ref=${code}` : '';
}

export function ReferralHubPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [shareInfo, setShareInfo] = useState<ReferralShareLink | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const loadData = useCallback(async () => {
    try {
      const [statsData, shareData] = await Promise.all([accountApi.getReferralStats(), accountApi.getReferralShareLink()]);
      if (statsData) setStats(statsData);
      if (shareData) setShareInfo(shareData);
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

  const referralCode = stats?.referral_code || '';
  const webLink = shareInfo?.web_link || buildWebLink(referralCode);
  const bonusPerReferral = shareInfo?.bonus_per_referral ?? 10;

  const copyCode = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      showToast('Copied referral code');
    } catch {
      showToast('Copy failed');
    }
  };

  const copyLink = async () => {
    if (!webLink) return;
    try {
      await navigator.clipboard.writeText(webLink);
      showToast('Referral link copied!');
    } catch {
      showToast('Copy failed');
    }
  };

  const shareGeneral = async () => {
    const text = webLink
      ? `Join NerdX and ace your exams! Sign up using my link: ${webLink}`
      : (shareInfo?.share_message || '');
    if (!text) return;
    const navAny: any = navigator;
    if (typeof navAny.share === 'function') {
      try {
        await navAny.share({ text });
        return;
      } catch {
        /* ignore */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied share message');
    } catch {
      showToast('Share not supported');
    }
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hey! Join NerdX - the AI-powered study platform - using my referral link and get free starter credits:\n\n${webLink}\n\nAce your ZIMSEC exams with AI tutoring, notes, and practice questions!`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank', 'noreferrer');
  };

  const successful = stats?.successful_referrals || 0;
  const milestones = useMemo(
    () => [
      { name: 'Super Sharer', desc: 'Refer 5 friends', target: 5, reward: 10 },
      { name: 'Ambassador', desc: 'Refer 10 friends', target: 10, reward: 25 },
      { name: 'Legend', desc: 'Refer 25 friends', target: 25, reward: 50 },
    ],
    []
  );

  return (
    <div className="referral-page">
      <FloatingParticles count={12} />

      {toast && (
        <div className="referral-toast" role="status">
          {toast}
        </div>
      )}

      <header className="referral-header">
        <Link to="/app/account" className="back-link">
          <span aria-hidden="true">&larr;</span> Back
        </Link>
        <div className="referral-title">
          <h1>Referral Hub</h1>
          <p>Invite friends and earn credits</p>
        </div>
        <button type="button" className="referral-btn" onClick={onRefresh} disabled={refreshing || loading}>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </header>

      {loading ? (
        <div className="referral-loading">Loading referral data...</div>
      ) : (
        <div className="referral-grid">
          <section className="referral-hero">
            <div className="referral-hero-top">
              <div className="referral-hero-icon">
                <Gift size={22} />
              </div>
              <div>
                <h2>Invite friends, earn credits</h2>
                <p>Earn <strong>{bonusPerReferral} credits</strong> for each successful referral.</p>
              </div>
            </div>

            <div className="referral-code-card">
              <div className="referral-code-label">Your code</div>
              <div className="referral-code-row">
                <code className="referral-code">{referralCode || '---'}</code>
                <button type="button" className="referral-btn primary" onClick={copyCode} disabled={!referralCode}>
                  <Copy size={16} /> Copy
                </button>
              </div>

              {/* Shareable web link */}
              {webLink && (
                <div style={{ marginTop: 16 }}>
                  <div className="referral-code-label">Your referral link</div>
                  <div className="referral-code-row" style={{ marginTop: 6 }}>
                    <code className="referral-code" style={{ fontSize: 12, wordBreak: 'break-all' }}>{webLink}</code>
                    <button type="button" className="referral-btn primary" onClick={copyLink}>
                      <LinkIcon size={16} /> Copy Link
                    </button>
                  </div>
                </div>
              )}

              <div className="referral-share-row">
                <button type="button" className="referral-btn" onClick={shareWhatsApp} disabled={!webLink}>
                  WhatsApp
                </button>
                <button type="button" className="referral-btn" onClick={shareGeneral} disabled={!webLink}>
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>

            {/* How it works */}
            <div style={{
              marginTop: 20, padding: '16px 18px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)',
            }}>
              <div style={{ fontWeight: 600, color: '#fff', marginBottom: 8 }}>How it works</div>
              <div>1. Share your link with friends</div>
              <div>2. They click the link and register on NerdX</div>
              <div>3. You receive <strong style={{ color: '#10B981' }}>+{bonusPerReferral} credits</strong> instantly</div>
              <div style={{ marginTop: 6, opacity: 0.6, fontSize: 13 }}>Only you (the referrer) earn credits. New users receive their own welcome bonus.</div>
            </div>
          </section>

          <section className="referral-stats">
            <div className="referral-card">
              <div className="referral-card-head">
                <Users size={18} />
                <h2>Your stats</h2>
              </div>
              <div className="referral-stats-grid">
                <div className="referral-stat">
                  <div className="referral-stat-value">{stats?.total_referrals || 0}</div>
                  <div className="referral-stat-label">Total</div>
                </div>
                <div className="referral-stat">
                  <div className="referral-stat-value">{successful}</div>
                  <div className="referral-stat-label">Successful</div>
                </div>
                <div className="referral-stat">
                  <div className="referral-stat-value accent">+{stats?.total_bonus_earned || 0}</div>
                  <div className="referral-stat-label">Credits earned</div>
                </div>
              </div>
              {stats?.last_referral_date && (
                <div className="referral-last">Last referral: {formatDate(stats.last_referral_date)}</div>
              )}
            </div>

            {stats?.referred_users?.length ? (
              <div className="referral-card">
                <div className="referral-card-head">
                  <Users size={18} />
                  <h2>People you referred</h2>
                </div>
                <div className="referral-users">
                  {stats.referred_users.map((u, idx) => (
                    <div key={`${u.nerdx_id}-${idx}`} className="referral-user">
                      <div className="referral-avatar">{(u.name || 'U')[0].toUpperCase()}</div>
                      <div className="referral-user-info">
                        <div className="referral-user-name">
                          {u.name} {u.surname}
                        </div>
                        <div className="referral-user-date">Joined {formatDate(u.joined_date)}</div>
                      </div>
                      <div className="referral-user-badge">+{bonusPerReferral}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="referral-card">
              <div className="referral-card-head">
                <Gift size={18} />
                <h2>Milestones</h2>
              </div>
              <div className="referral-milestones">
                {milestones.map((m) => {
                  const done = successful >= m.target;
                  return (
                    <div key={m.name} className="referral-milestone">
                      <div className={`referral-milestone-dot ${done ? 'done' : ''}`} aria-hidden="true" />
                      <div className="referral-milestone-info">
                        <div className="referral-milestone-name">{m.name}</div>
                        <div className="referral-milestone-desc">{m.desc}</div>
                      </div>
                      <div className="referral-milestone-reward">+{m.reward}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
