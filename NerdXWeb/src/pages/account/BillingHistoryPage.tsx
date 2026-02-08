import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, History, Receipt, RefreshCw } from 'lucide-react';
import { FloatingParticles } from '../../components/FloatingParticles';
import { accountApi, type BillingHistory, type CreditTransaction, type PaymentRecord } from '../../services/api/accountApi';

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

function statusColor(status: string) {
  const s = (status || '').toLowerCase();
  if (s === 'completed' || s === 'approved' || s === 'paid') return '#10B981';
  if (s === 'pending') return '#F59E0B';
  if (s === 'failed' || s === 'rejected') return '#EF4444';
  return 'rgba(255,255,255,0.7)';
}

export function BillingHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [billing, setBilling] = useState<BillingHistory | null>(null);
  const [tab, setTab] = useState<'payments' | 'usage'>('payments');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const loadData = useCallback(async () => {
    try {
      const data = await accountApi.getBillingHistory(50);
      if (data) setBilling(data);
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

  const payments = useMemo(() => billing?.payments ?? [], [billing]);
  const usage = useMemo(() => billing?.credit_transactions ?? [], [billing]);

  const renderPayment = (p: PaymentRecord) => {
    const c = statusColor(p.status);
    return (
      <div key={p.id} className="billing-item">
        <div className="billing-item-icon" style={{ background: 'rgba(16, 185, 129, 0.18)', borderColor: 'rgba(16, 185, 129, 0.28)' }}>
          <CreditCard size={18} />
        </div>
        <div className="billing-item-body">
          <div className="billing-item-title">Credit purchase</div>
          <div className="billing-item-sub">{p.credits} credits</div>
          <div className="billing-item-time">{formatDate(p.date)}</div>
        </div>
        <div className="billing-item-right">
          <div className="billing-item-amount">${Number(p.amount).toFixed(2)}</div>
          <div className="billing-item-badge" style={{ color: c, background: `${c}22`, borderColor: `${c}33` }}>
            {p.status}
          </div>
        </div>
      </div>
    );
  };

  const renderUsage = (t: CreditTransaction) => {
    const positive = t.credits_change > 0;
    const c = positive ? '#10B981' : '#EF4444';
    return (
      <div key={t.id} className="billing-item">
        <div className="billing-item-icon" style={{ background: `${c}1f`, borderColor: `${c}33` }}>
          <History size={18} />
        </div>
        <div className="billing-item-body">
          <div className="billing-item-title">{t.action || t.type}</div>
          <div className="billing-item-sub">{t.description}</div>
          <div className="billing-item-time">{formatDate(t.date)}</div>
        </div>
        <div className="billing-item-right">
          <div className="billing-item-amount" style={{ color: c }}>
            {positive ? '+' : ''}
            {t.credits_change}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="billing-page">
      <FloatingParticles count={10} />

      {toast && (
        <div className="billing-toast" role="status">
          {toast}
        </div>
      )}

      <header className="billing-header">
        <Link to="/app/account" className="back-link">
          <span aria-hidden="true">&larr;</span> Back
        </Link>
        <div className="billing-title">
          <h1>
            <Receipt size={20} /> Billing
          </h1>
          <p>Payments and credit usage</p>
        </div>
        <button type="button" className="billing-btn" onClick={onRefresh} disabled={refreshing || loading}>
          <RefreshCw size={16} /> {refreshing ? 'Refreshing' : 'Refresh'}
        </button>
      </header>

      {loading ? (
        <div className="billing-loading">Loading billing history...</div>
      ) : (
        <div className="billing-grid">
          <section className="billing-summary">
            <div className="billing-balance">
              <div className="billing-balance-top">
                <div className="billing-balance-label">Credit balance</div>
                <div className="billing-balance-value">{billing?.credit_balance?.total ?? 0}</div>
              </div>
              <div className="billing-balance-split">
                <div className="billing-split-item">
                  <div className="billing-split-value">{billing?.credit_balance?.purchased ?? 0}</div>
                  <div className="billing-split-label">Purchased</div>
                </div>
                <div className="billing-split-divider" />
                <div className="billing-split-item">
                  <div className="billing-split-value">{billing?.credit_balance?.free ?? 0}</div>
                  <div className="billing-split-label">Free/Bonus</div>
                </div>
              </div>
            </div>

            {billing?.subscription && (
              <div className="billing-subscription">
                <div className="billing-sub-head">
                  <span className="billing-sub-icon">Plan</span>
                  <strong>Subscription</strong>
                </div>
                <div className={`billing-sub-badge ${billing.subscription.is_active ? 'active' : 'inactive'}`}>
                  {billing.subscription.is_active ? 'Active' : 'Inactive'}
                </div>
                {billing.subscription.subscription_expires_at && (
                  <div className="billing-sub-expiry">
                    {billing.subscription.is_active ? 'Expires' : 'Expired'}: {formatDate(billing.subscription.subscription_expires_at)}
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="billing-list-card">
            <div className="billing-tabs">
              <button type="button" className={`billing-tab ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>
                Payments
              </button>
              <button type="button" className={`billing-tab ${tab === 'usage' ? 'active' : ''}`} onClick={() => setTab('usage')}>
                Credit usage
              </button>
            </div>

            <div className="billing-list">
              {tab === 'payments' ? (
                payments.length ? (
                  payments.map(renderPayment)
                ) : (
                  <div className="billing-empty">
                    <div className="billing-empty-title">No payments yet</div>
                    <div className="billing-empty-sub">Your purchases will appear here.</div>
                  </div>
                )
              ) : usage.length ? (
                usage.map(renderUsage)
              ) : (
                <div className="billing-empty">
                  <div className="billing-empty-title">No credit transactions yet</div>
                  <div className="billing-empty-sub">Your usage history will appear here.</div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

