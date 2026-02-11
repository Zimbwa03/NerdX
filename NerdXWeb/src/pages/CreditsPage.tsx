/**
 * CreditsPage – Premium Desktop Credit Purchase Experience
 * Full EcoCash + Visa/Mastercard payment flow with analytics & transaction history
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  creditsApi,
  type CreditPackage,
  type CreditTransaction,
  type PaymentMethod,
  type PaymentStatus,
} from '../services/api/creditsApi';
import { formatCreditBalance } from '../utils/creditCalculator';
import {
  ArrowLeft,
  Coins,
  Wallet,
  TrendingUp,
  Zap,
  Star,
  Crown,
  Shield,
  Smartphone,
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  X,
} from 'lucide-react';

/* ─── package icon/badge helpers ─── */
const PACKAGE_META: Record<string, { icon: typeof Coins; badge?: string; badgeClass?: string }> = {
  lite: { icon: Zap },
  starter: { icon: Star },
  standard: { icon: TrendingUp, badge: '🔥 Popular', badgeClass: 'popular' },
  pro: { icon: Shield, badge: '⭐ Best Value', badgeClass: 'best-value' },
  premium: { icon: Crown, badge: '👑 Ultimate', badgeClass: 'ultimate' },
};

export function CreditsPage() {
  const { user, refreshCredits, updateUser } = useAuth();

  /* ── data state ── */
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── payment flow state ── */
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ecocash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── success modal ── */
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successCredits, setSuccessCredits] = useState(0);

  /* ── transaction filter ── */
  const [activeTab, setActiveTab] = useState<'all' | 'purchase' | 'usage'>('all');

  /* ── toast ── */
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const showToast = (type: 'success' | 'error' | 'info', text: string, duration = 5000) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), duration);
  };

  /* ═══════════════ data loading ═══════════════ */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [pkgs, txns] = await Promise.all([
        creditsApi.getPackages(),
        creditsApi.getTransactions(20),
      ]);
      setPackages(pkgs);
      setTransactions(txns);
    } catch {
      showToast('error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* pre-fill from user */
  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.phone_number) setPhoneNumber(user.phone_number);
  }, [user]);

  /* cleanup on unmount */
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  /* ═══════════════ refresh balance ═══════════════ */
  const doRefreshCredits = async () => {
    try {
      const info = await creditsApi.getCreditInfo();
      if (user && info) {
        const total = typeof (info as Record<string, unknown>).total === 'number'
          ? (info as Record<string, unknown>).total as number
          : user.credits;
        updateUser({ credits: total, credit_breakdown: info as typeof user.credit_breakdown });
      }
    } catch { /* silent */ }
  };

  /* ═══════════════ payment polling ═══════════════ */
  const startPolling = (ref: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    let attempts = 0;
    const MAX = 40;
    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > MAX) {
        clearInterval(pollRef.current!);
        pollRef.current = null;
        setCheckingPayment(false);
        showToast('info', "We haven't received a confirmation yet. If you completed the payment, your credits will be added once confirmed.");
        return;
      }
      try {
        const status: PaymentStatus | null = await creditsApi.checkPaymentStatus(ref);
        if (!status) return;
        if (status.paid || status.status === 'completed' || status.status === 'approved') {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          setCheckingPayment(false);
          setShowPaymentModal(false);
          setPaymentReference(null);
          setSuccessCredits(status.credits);
          setShowSuccessModal(true);
          showToast('success', `🎉 You purchased ${status.credits} credits!`);
          await loadData();
          await doRefreshCredits();
        } else if (status.status === 'failed' || status.status === 'cancelled') {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          setCheckingPayment(false);
          showToast('error', '❌ Payment failed. Please try again.');
        }
      } catch { /* continue polling */ }
    }, 3000);
  };

  /* ═══════════════ purchase handler ═══════════════ */
  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;
    if (paymentMethod === 'ecocash' && (!phoneNumber.trim() || !email.trim())) {
      showToast('error', 'Please enter both phone number and email for EcoCash.');
      return;
    }
    if (paymentMethod === 'visa_mastercard' && !email.trim()) {
      showToast('error', 'Please enter your email address for card payment.');
      return;
    }

    setPurchasing(true);
    try {
      let result = await creditsApi.purchaseCredits(
        selectedPackage.id,
        paymentMethod,
        paymentMethod === 'ecocash' ? phoneNumber.trim() : undefined,
        email.trim(),
      );

      if (!result) {
        const latest = await creditsApi.getLatestPayment();
        if (latest?.reference) { result = latest; }
      }

      if (result) {
        setPaymentReference(result.reference);
        setCheckingPayment(true);
        if (result.payment_method === 'visa_mastercard' && result.redirect_url) {
          window.open(result.redirect_url, '_blank');
          showToast('info', 'A new tab has opened for your card payment. Complete the payment there.');
        } else {
          showToast('info', result.instructions || 'Check your phone for the EcoCash USSD prompt and enter your PIN.');
        }
        startPolling(result.reference);
      }
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || 'Failed to initiate purchase.';
      showToast('error', msg);
    } finally {
      setPurchasing(false);
    }
  };

  /* ═══════════════ analytics helpers ═══════════════ */
  const totalSpent = transactions
    .filter(t => t.transaction_type === 'purchase')
    .reduce((s, t) => s + (t.amount || 0), 0);

  const creditsUsed = transactions
    .filter(t => t.transaction_type === 'usage')
    .reduce((s, t) => s + Math.abs(t.credits_change), 0);

  const getMonthlySpending = () => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return { key: `${d.getMonth()}-${d.getFullYear()}`, label: d.toLocaleString('default', { month: 'short' }), amount: 0 };
    });
    transactions.forEach(t => {
      if (t.transaction_type === 'purchase' && t.transaction_date) {
        const d = new Date(t.transaction_date);
        const k = `${d.getMonth()}-${d.getFullYear()}`;
        const m = months.find(m => m.key === k);
        if (m) m.amount += t.amount || 0;
      }
    });
    return months;
  };

  const monthlyData = getMonthlySpending();
  const maxMonthly = Math.max(...monthlyData.map(m => m.amount), 1);

  /* ── breakdown ── */
  const breakdown = user?.credit_breakdown;

  /* ═══════════════ RENDER ═══════════════ */
  if (loading) {
    return (
      <div className="credits-page-v2">
        <div className="cpv2-loading">
          <Loader2 size={40} className="cpv2-spinner" />
          <p>Loading credit packages…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="credits-page-v2">
      {/* Toast */}
      {toast && (
        <div className={`cpv2-toast cpv2-toast--${toast.type}`} role="alert">
          {toast.type === 'success' && <CheckCircle2 size={18} />}
          {toast.type === 'error' && <XCircle size={18} />}
          {toast.type === 'info' && <Sparkles size={18} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Back link */}
      <Link to="/app" className="cpv2-back">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      {/* ─── Header ─── */}
      <header className="cpv2-header">
        <div className="cpv2-header__inner">
          <div>
            <h1 className="cpv2-header__title">Buy Credits</h1>
            <p className="cpv2-header__sub">Top up your learning account</p>
          </div>
          <Coins size={36} />
        </div>
      </header>

      {/* ─── Balance Card ─── */}
      <section className="cpv2-balance">
        <div className="cpv2-balance__card">
          <div className="cpv2-balance__glow" />
          <div className="cpv2-balance__icon-wrap">
            <Wallet size={28} />
          </div>
          <div className="cpv2-balance__info">
            <span className="cpv2-balance__label">Current Balance</span>
            <span className="cpv2-balance__amount">{formatCreditBalance(user?.credits)} Credits</span>
            {breakdown && (
              <div className="cpv2-balance__breakdown">
                <span>Purchased: <b>{breakdown.purchased_credits}</b></span>
                <span>Free/Bonus: <b>{breakdown.free_credits}</b></span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Analytics ─── */}
      <section className="cpv2-analytics">
        <h2 className="cpv2-section-title">📊 Spending Overview</h2>
        <div className="cpv2-stats-row">
          <div className="cpv2-stat-card">
            <span className="cpv2-stat-value cpv2-stat-value--green">${totalSpent.toFixed(2)}</span>
            <span className="cpv2-stat-label">Total Spent</span>
          </div>
          <div className="cpv2-stat-card">
            <span className="cpv2-stat-value cpv2-stat-value--blue">{creditsUsed}</span>
            <span className="cpv2-stat-label">Credits Used</span>
          </div>
        </div>

        {/* Mini bar chart */}
        <div className="cpv2-chart">
          <div className="cpv2-chart__bars">
            {monthlyData.map(m => (
              <div className="cpv2-chart__col" key={m.key}>
                <div
                  className="cpv2-chart__bar"
                  style={{ height: `${Math.max((m.amount / maxMonthly) * 100, 4)}%` }}
                  title={`$${m.amount.toFixed(2)}`}
                />
                <span className="cpv2-chart__label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Credit Packages ─── */}
      <section className="cpv2-packages">
        <h2 className="cpv2-section-title">💎 Credit Packages</h2>
        <div className="cpv2-packages__grid">
          {packages.map((pkg) => {
            const meta = PACKAGE_META[pkg.id] || { icon: Coins };
            const Icon = meta.icon;
            return (
              <div className="cpv2-pkg-card" key={pkg.id} onClick={() => { setSelectedPackage(pkg); setShowPaymentModal(true); }}>
                {meta.badge && (
                  <span className={`cpv2-pkg-badge cpv2-pkg-badge--${meta.badgeClass}`}>{meta.badge}</span>
                )}
                <div className="cpv2-pkg-icon"><Icon size={28} /></div>
                <h3 className="cpv2-pkg-name">{pkg.name}</h3>
                <p className="cpv2-pkg-credits">{pkg.credits} credits</p>
                <p className="cpv2-pkg-price">${pkg.price.toFixed(2)}<span>/month</span></p>
                <p className="cpv2-pkg-desc">{pkg.description}</p>
                <button className="cpv2-pkg-btn" type="button">Select Package</button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Transaction History ─── */}
      <section className="cpv2-transactions">
        <h2 className="cpv2-section-title">📜 Transaction History</h2>
        <div className="cpv2-tabs">
          {(['all', 'purchase', 'usage'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              className={`cpv2-tab ${activeTab === tab ? 'cpv2-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="cpv2-txn-list">
          {transactions
            .filter(t => activeTab === 'all' || t.transaction_type.toLowerCase() === activeTab)
            .slice(0, 10)
            .map(t => (
              <div className={`cpv2-txn-card cpv2-txn-card--${t.transaction_type}`} key={t.id}>
                <div className="cpv2-txn-icon">
                  {t.transaction_type === 'purchase'
                    ? <ArrowUpRight size={20} />
                    : <ArrowDownRight size={20} />}
                </div>
                <div className="cpv2-txn-info">
                  <span className="cpv2-txn-desc">{t.description || t.transaction_type}</span>
                  <span className="cpv2-txn-date">
                    {t.transaction_date ? new Date(t.transaction_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </div>
                <span className={`cpv2-txn-amount ${t.credits_change >= 0 ? 'positive' : 'negative'}`}>
                  {t.credits_change >= 0 ? '+' : ''}{t.credits_change}
                </span>
              </div>
            ))}
          {transactions.length === 0 && (
            <div className="cpv2-empty">
              <Clock size={32} />
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Refresh */}
      <div className="cpv2-refresh">
        <button type="button" className="cpv2-refresh-btn" onClick={() => { doRefreshCredits(); loadData(); }}>
          <RefreshCw size={18} /> Refresh Balance
        </button>
      </div>

      {/* ═══════════ Payment Modal ═══════════ */}
      {showPaymentModal && (
        <div className="cpv2-overlay" onClick={() => { if (!checkingPayment) { setShowPaymentModal(false); } }}>
          <div className="cpv2-modal" onClick={e => e.stopPropagation()}>
            {/* Gold header */}
            <div className="cpv2-modal__header">
              <span className="cpv2-modal__ticket-title">🎫 GOLD TICKET</span>
              <span className="cpv2-modal__ticket-sub">PREMIUM ACCESS</span>
              <button className="cpv2-modal__close" onClick={() => { if (!checkingPayment) setShowPaymentModal(false); }} type="button">
                <X size={20} />
              </button>
            </div>

            <div className="cpv2-modal__body">
              {selectedPackage && !checkingPayment && (
                <>
                  <h3 className="cpv2-modal__title">Confirm Purchase</h3>
                  <div className="cpv2-modal__pkg-info">
                    <div className="cpv2-modal__pkg-row"><span>PACKAGE</span><span>{selectedPackage.name}</span></div>
                    <div className="cpv2-modal__pkg-row"><span>CREDITS</span><span className="cpv2-modal__credits-val">{selectedPackage.credits}</span></div>
                    <div className="cpv2-modal__pkg-row"><span>PRICE</span><span className="cpv2-modal__price-val">${selectedPackage.price.toFixed(2)}/month</span></div>
                    <div className="cpv2-modal__pkg-row"><span>VALIDITY</span><span className="cpv2-modal__validity">1 Month</span></div>
                  </div>
                  <div className="cpv2-modal__warning">
                    ⚠️ Credits expire after 1 month from purchase. Use them or they'll be lost!
                  </div>

                  {/* Payment method selector */}
                  <label className="cpv2-modal__label">PAYMENT METHOD</label>
                  <div className="cpv2-modal__methods">
                    <button
                      type="button"
                      className={`cpv2-method-btn ${paymentMethod === 'ecocash' ? 'cpv2-method-btn--active' : ''}`}
                      onClick={() => setPaymentMethod('ecocash')}
                    >
                      <Smartphone size={20} />
                      <span>EcoCash</span>
                    </button>
                    <button
                      type="button"
                      className={`cpv2-method-btn ${paymentMethod === 'visa_mastercard' ? 'cpv2-method-btn--active' : ''}`}
                      onClick={() => setPaymentMethod('visa_mastercard')}
                    >
                      <CreditCard size={20} />
                      <span>Visa / Mastercard</span>
                    </button>
                  </div>

                  {/* Conditional phone */}
                  {paymentMethod === 'ecocash' && (
                    <>
                      <label className="cpv2-modal__label">ECOCASH NUMBER</label>
                      <input
                        className="cpv2-modal__input"
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="077..."
                        maxLength={10}
                      />
                    </>
                  )}

                  <label className="cpv2-modal__label">EMAIL ADDRESS</label>
                  <input
                    className="cpv2-modal__input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </>
              )}

              {/* Checking payment status */}
              {checkingPayment && (
                <div className="cpv2-modal__checking">
                  <Loader2 size={40} className="cpv2-spinner" />
                  <p className="cpv2-modal__checking-text">Waiting for payment confirmation…</p>
                  {paymentReference && <p className="cpv2-modal__ref">Ref: {paymentReference}</p>}
                  <p className="cpv2-modal__instruction">
                    {paymentMethod === 'ecocash'
                      ? 'Please check your phone and enter your EcoCash PIN.'
                      : 'Complete your payment on the Paynow payment page.'}
                  </p>
                  <button
                    type="button"
                    className="cpv2-modal__cancel-polling"
                    onClick={() => {
                      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
                      setCheckingPayment(false);
                      setShowPaymentModal(false);
                      setPaymentReference(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            {!checkingPayment && (
              <div className="cpv2-modal__footer">
                <button type="button" className="cpv2-modal__cancel-btn" onClick={() => setShowPaymentModal(false)}>
                  CANCEL
                </button>
                <button
                  type="button"
                  className={`cpv2-modal__pay-btn ${paymentMethod === 'visa_mastercard' ? 'cpv2-modal__pay-btn--card' : ''}`}
                  disabled={purchasing || (paymentMethod === 'ecocash' && !phoneNumber.trim()) || !email.trim()}
                  onClick={handleConfirmPurchase}
                >
                  {purchasing
                    ? <Loader2 size={20} className="cpv2-spinner" />
                    : paymentMethod === 'ecocash' ? 'PAY VIA ECOCASH' : 'PAY WITH CARD'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════ Success Modal ═══════════ */}
      {showSuccessModal && (
        <div className="cpv2-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="cpv2-success-modal" onClick={e => e.stopPropagation()}>
            <div className="cpv2-success__header">
              <span className="cpv2-success__emoji">🎉</span>
              <h2>CONGRATULATIONS!</h2>
              <p>Payment Successful</p>
            </div>
            <div className="cpv2-success__body">
              <p>You're amazing! Your credits have been added to your account.</p>
              <div className="cpv2-success__credits-box">
                <span className="cpv2-success__credits-label">CREDITS ADDED</span>
                <span className="cpv2-success__credits-value">+{successCredits}</span>
              </div>
              <p className="cpv2-success__motivation">
                🚀 Keep learning, keep growing! Your dedication to education is inspiring. Let's achieve greatness together!
              </p>
              <button
                type="button"
                className="cpv2-success__btn"
                onClick={() => setShowSuccessModal(false)}
              >
                📚 START LEARNING
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
