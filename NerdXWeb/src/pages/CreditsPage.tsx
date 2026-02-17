/**
 * CreditsPage – Premium Desktop Credit Purchase Experience
 * Full EcoCash + Visa/Mastercard payment flow with analytics & transaction history
 * Now includes Lesson Wallet tab for teacher marketplace payments
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
import {
  walletApi,
  type WalletBalance,
  type WalletTransaction,
  type WalletPaymentMethod,
} from '../services/api/walletApi';
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
  BookOpen,
  DollarSign,
  Plus,
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

  /* ── main page tab ── */
  const [pageTab, setPageTab] = useState<'credits' | 'wallet'>('credits');

  /* ── data state ── */
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [creditStoreMessage, setCreditStoreMessage] = useState<string | null>(null);

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

  /* ── Lesson Wallet state ── */
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(5);
  const [customTopUpAmount, setCustomTopUpAmount] = useState('');
  const [walletPaymentMethod, setWalletPaymentMethod] = useState<WalletPaymentMethod>('ecocash');
  const [walletPhoneNumber, setWalletPhoneNumber] = useState('');
  const [walletEmail, setWalletEmail] = useState('');
  const [toppingUp, setToppingUp] = useState(false);
  const [walletPolling, setWalletPolling] = useState(false);
  const [walletPollRef, setWalletPollRefState] = useState<string | null>(null);
  const walletPollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showWalletSuccess, setShowWalletSuccess] = useState(false);
  const [walletSuccessAmount, setWalletSuccessAmount] = useState(0);

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
      setCreditStoreMessage(null);
    } catch (error: unknown) {
      const msg = (error as { message?: string })?.message || 'Failed to load data. Please try again.';
      setCreditStoreMessage(msg);
      setPackages([]);
      showToast('error', msg);
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

  /* ═══════════════ Wallet data loading ═══════════════ */
  const loadWalletData = useCallback(async () => {
    try {
      setWalletLoading(true);
      const [bal, txns] = await Promise.all([
        walletApi.getBalance(),
        walletApi.getTransactions(20),
      ]);
      setWalletBalance(bal);
      setWalletTransactions(txns);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setWalletLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pageTab === 'wallet') {
      loadWalletData();
    }
  }, [pageTab, loadWalletData]);

  useEffect(() => {
    if (user?.email) setWalletEmail(user.email);
    if (user?.phone_number) setWalletPhoneNumber(user.phone_number);
  }, [user]);

  useEffect(() => () => { if (walletPollIntervalRef.current) clearInterval(walletPollIntervalRef.current); }, []);

  const QUICK_AMOUNTS = [1, 2, 5, 10];

  const startWalletPolling = (ref: string) => {
    if (walletPollIntervalRef.current) clearInterval(walletPollIntervalRef.current);
    let attempts = 0;
    const MAX = 40;
    walletPollIntervalRef.current = setInterval(async () => {
      attempts++;
      if (attempts > MAX) {
        clearInterval(walletPollIntervalRef.current!);
        walletPollIntervalRef.current = null;
        setWalletPolling(false);
        showToast('info', "We haven't received confirmation yet. Your wallet will be credited once payment confirms.");
        return;
      }
      try {
        const status = await walletApi.checkPaymentStatus(ref);
        if (!status) return;
        if (status.paid || status.status === 'approved' || status.status === 'completed') {
          clearInterval(walletPollIntervalRef.current!);
          walletPollIntervalRef.current = null;
          // Complete the top-up
          await walletApi.completeTopUp(ref);
          setWalletPolling(false);
          setShowTopUpModal(false);
          setWalletPollRefState(null);
          setWalletSuccessAmount(topUpAmount);
          setShowWalletSuccess(true);
          showToast('success', `$${topUpAmount.toFixed(2)} added to your Lesson Wallet!`);
          await loadWalletData();
        } else if (status.status === 'failed' || status.status === 'cancelled') {
          clearInterval(walletPollIntervalRef.current!);
          walletPollIntervalRef.current = null;
          setWalletPolling(false);
          showToast('error', 'Payment failed. Please try again.');
        }
      } catch { /* continue polling */ }
    }, 3000);
  };

  const handleWalletTopUp = async () => {
    const amt = customTopUpAmount ? parseFloat(customTopUpAmount) : topUpAmount;
    if (!amt || amt <= 0) {
      showToast('error', 'Please enter a valid amount');
      return;
    }
    if (walletPaymentMethod === 'ecocash' && (!walletPhoneNumber.trim() || !walletEmail.trim())) {
      showToast('error', 'Please enter both phone number and email for EcoCash.');
      return;
    }
    if (walletPaymentMethod === 'visa_mastercard' && !walletEmail.trim()) {
      showToast('error', 'Please enter your email address.');
      return;
    }

    setToppingUp(true);
    try {
      const result = await walletApi.topUp(
        amt,
        walletPaymentMethod,
        walletPaymentMethod === 'ecocash' ? walletPhoneNumber.trim() : undefined,
        walletEmail.trim(),
      );

      if (result.success && result.reference) {
        setWalletPollRefState(result.reference);
        setWalletPolling(true);
        if (result.payment_method === 'visa_mastercard' && result.redirect_url) {
          window.open(result.redirect_url, '_blank');
          showToast('info', 'Complete your card payment in the new tab.');
        } else {
          showToast('info', result.instructions || 'Check your phone for the EcoCash USSD prompt.');
        }
        startWalletPolling(result.reference);
      } else {
        showToast('error', result.message || 'Top-up failed');
      }
    } catch (err: unknown) {
      showToast('error', (err as { message?: string })?.message || 'Top-up failed');
    } finally {
      setToppingUp(false);
    }
  };

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

      {/* ─── Main Page Tabs ─── */}
      <div className="cpv2-page-tabs">
        <button
          type="button"
          className={`cpv2-page-tab ${pageTab === 'credits' ? 'cpv2-page-tab--active' : ''}`}
          onClick={() => setPageTab('credits')}
        >
          <Coins size={18} />
          <span>Study Credits</span>
        </button>
        <button
          type="button"
          className={`cpv2-page-tab ${pageTab === 'wallet' ? 'cpv2-page-tab--active' : ''}`}
          onClick={() => setPageTab('wallet')}
        >
          <BookOpen size={18} />
          <span>Lesson Wallet</span>
        </button>
      </div>

      {/* ─── Header ─── */}
      <header className="cpv2-header">
        <div className="cpv2-header__inner">
          <div>
            <h1 className="cpv2-header__title">{pageTab === 'credits' ? 'Buy Credits' : 'Lesson Wallet'}</h1>
            <p className="cpv2-header__sub">{pageTab === 'credits' ? 'Top up your learning account' : 'Fund your live lesson account'}</p>
          </div>
          {pageTab === 'credits' ? <Coins size={36} /> : <Wallet size={36} />}
        </div>
      </header>

      {/* ═══════════════ STUDY CREDITS TAB ═══════════════ */}
      {pageTab === 'credits' && (
        <>
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
            <h2 className="cpv2-section-title">Spending Overview</h2>
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
            <h2 className="cpv2-section-title">Credit Packages</h2>
            {creditStoreMessage ? (
              <div className="cpv2-empty">
                <XCircle size={32} />
                <p>{creditStoreMessage}</p>
              </div>
            ) : (
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
            )}
          </section>

          {/* ─── Transaction History ─── */}
          <section className="cpv2-transactions">
            <h2 className="cpv2-section-title">Transaction History</h2>
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
        </>
      )}

      {/* ═══════════════ LESSON WALLET TAB ═══════════════ */}
      {pageTab === 'wallet' && (
        <>
          {walletLoading ? (
            <div className="cpv2-loading">
              <Loader2 size={40} className="cpv2-spinner" />
              <p>Loading wallet...</p>
            </div>
          ) : (
            <>
              {/* ─── Wallet Balance Card ─── */}
              <section className="cpv2-balance">
                <div className="cpv2-balance__card">
                  <div className="cpv2-balance__glow" />
                  <div className="cpv2-balance__icon-wrap">
                    <DollarSign size={28} />
                  </div>
                  <div className="cpv2-balance__info">
                    <span className="cpv2-balance__label">Lesson Wallet Balance</span>
                    <span className="cpv2-balance__amount">${(walletBalance?.balance ?? 0).toFixed(2)}</span>
                    <div className="cpv2-balance__breakdown">
                      <span>Lessons Available: <b>{walletBalance?.lessons_available ?? 0}</b></span>
                      <span>Total Deposited: <b>${(walletBalance?.total_deposited ?? 0).toFixed(2)}</b></span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cpv2-wallet-topup-btn"
                    onClick={() => setShowTopUpModal(true)}
                  >
                    <Plus size={18} /> Top Up
                  </button>
                </div>
              </section>

              {/* ─── Wallet Info ─── */}
              <section className="cpv2-analytics">
                <h2 className="cpv2-section-title">How Lesson Wallet Works</h2>
                <div className="cpv2-stats-row">
                  <div className="cpv2-stat-card">
                    <span className="cpv2-stat-value cpv2-stat-value--green">$0.50</span>
                    <span className="cpv2-stat-label">Per Lesson (45 min)</span>
                  </div>
                  <div className="cpv2-stat-card">
                    <span className="cpv2-stat-value cpv2-stat-value--blue">{walletBalance?.lessons_available ?? 0}</span>
                    <span className="cpv2-stat-label">Lessons You Can Book</span>
                  </div>
                </div>
                <div className="cpv2-wallet-info">
                  <p>Top up your wallet, then book live lessons with teachers. $0.50 is deducted when each lesson starts. Funds never expire.</p>
                </div>
              </section>

              {/* ─── Quick Top-Up Buttons ─── */}
              <section className="cpv2-packages">
                <h2 className="cpv2-section-title">Quick Top-Up</h2>
                <div className="cpv2-packages__grid">
                  {QUICK_AMOUNTS.map((amt) => (
                    <div
                      className="cpv2-pkg-card"
                      key={amt}
                      onClick={() => { setTopUpAmount(amt); setCustomTopUpAmount(''); setShowTopUpModal(true); }}
                    >
                      <div className="cpv2-pkg-icon"><DollarSign size={28} /></div>
                      <h3 className="cpv2-pkg-name">${amt.toFixed(2)}</h3>
                      <p className="cpv2-pkg-credits">{Math.floor(amt / 0.5)} lessons</p>
                      <p className="cpv2-pkg-desc">Top up ${amt.toFixed(2)} to your wallet</p>
                      <button className="cpv2-pkg-btn" type="button">Top Up</button>
                    </div>
                  ))}
                </div>
              </section>

              {/* ─── Wallet Transaction History ─── */}
              <section className="cpv2-transactions">
                <h2 className="cpv2-section-title">Wallet Transactions</h2>
                <div className="cpv2-txn-list">
                  {walletTransactions.map(t => (
                    <div className={`cpv2-txn-card cpv2-txn-card--${t.type}`} key={t.id}>
                      <div className="cpv2-txn-icon">
                        {t.type === 'top_up' && <ArrowUpRight size={20} />}
                        {t.type === 'lesson_payment' && <ArrowDownRight size={20} />}
                        {t.type === 'refund' && <RefreshCw size={20} />}
                      </div>
                      <div className="cpv2-txn-info">
                        <span className="cpv2-txn-desc">{t.description || t.type.replace('_', ' ')}</span>
                        <span className="cpv2-txn-date">
                          {t.created_at ? new Date(t.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      </div>
                      <span className={`cpv2-txn-amount ${t.amount >= 0 ? 'positive' : 'negative'}`}>
                        {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {walletTransactions.length === 0 && (
                    <div className="cpv2-empty">
                      <Clock size={32} />
                      <p>No wallet transactions yet. Top up to get started!</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Refresh */}
              <div className="cpv2-refresh">
                <button type="button" className="cpv2-refresh-btn" onClick={loadWalletData}>
                  <RefreshCw size={18} /> Refresh Wallet
                </button>
              </div>
            </>
          )}

          {/* ═══════════ Wallet Top-Up Modal ═══════════ */}
          {showTopUpModal && (
            <div className="cpv2-overlay" onClick={() => { if (!walletPolling) setShowTopUpModal(false); }}>
              <div className="cpv2-modal" onClick={e => e.stopPropagation()}>
                <div className="cpv2-modal__header">
                  <span className="cpv2-modal__ticket-title">LESSON WALLET</span>
                  <span className="cpv2-modal__ticket-sub">TOP UP</span>
                  <button className="cpv2-modal__close" onClick={() => { if (!walletPolling) setShowTopUpModal(false); }} type="button">
                    <X size={20} />
                  </button>
                </div>

                <div className="cpv2-modal__body">
                  {!walletPolling && (
                    <>
                      <h3 className="cpv2-modal__title">Add Funds to Wallet</h3>

                      {/* Amount selection */}
                      <label className="cpv2-modal__label">AMOUNT (USD)</label>
                      <div className="cpv2-wallet-amounts">
                        {QUICK_AMOUNTS.map(amt => (
                          <button
                            key={amt}
                            type="button"
                            className={`cpv2-wallet-amt-btn ${topUpAmount === amt && !customTopUpAmount ? 'cpv2-wallet-amt-btn--active' : ''}`}
                            onClick={() => { setTopUpAmount(amt); setCustomTopUpAmount(''); }}
                          >
                            ${amt.toFixed(2)}
                          </button>
                        ))}
                      </div>
                      <input
                        className="cpv2-modal__input"
                        type="number"
                        value={customTopUpAmount}
                        onChange={e => { setCustomTopUpAmount(e.target.value); }}
                        placeholder="Or enter custom amount..."
                        min="0.50"
                        max="100"
                        step="0.50"
                      />
                      <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: 4 }}>
                        = {Math.floor((customTopUpAmount ? parseFloat(customTopUpAmount) : topUpAmount) / 0.5) || 0} lessons
                      </p>

                      {/* Payment method */}
                      <label className="cpv2-modal__label">PAYMENT METHOD</label>
                      <div className="cpv2-modal__methods">
                        <button
                          type="button"
                          className={`cpv2-method-btn ${walletPaymentMethod === 'ecocash' ? 'cpv2-method-btn--active' : ''}`}
                          onClick={() => setWalletPaymentMethod('ecocash')}
                        >
                          <Smartphone size={20} />
                          <span>EcoCash</span>
                        </button>
                        <button
                          type="button"
                          className={`cpv2-method-btn ${walletPaymentMethod === 'visa_mastercard' ? 'cpv2-method-btn--active' : ''}`}
                          onClick={() => setWalletPaymentMethod('visa_mastercard')}
                        >
                          <CreditCard size={20} />
                          <span>Visa / Mastercard</span>
                        </button>
                      </div>

                      {walletPaymentMethod === 'ecocash' && (
                        <>
                          <label className="cpv2-modal__label">ECOCASH NUMBER</label>
                          <input
                            className="cpv2-modal__input"
                            type="tel"
                            value={walletPhoneNumber}
                            onChange={e => setWalletPhoneNumber(e.target.value)}
                            placeholder="077..."
                            maxLength={10}
                          />
                        </>
                      )}
                      <label className="cpv2-modal__label">EMAIL ADDRESS</label>
                      <input
                        className="cpv2-modal__input"
                        type="email"
                        value={walletEmail}
                        onChange={e => setWalletEmail(e.target.value)}
                        placeholder="email@example.com"
                      />
                    </>
                  )}

                  {walletPolling && (
                    <div className="cpv2-modal__checking">
                      <Loader2 size={40} className="cpv2-spinner" />
                      <p className="cpv2-modal__checking-text">Waiting for payment confirmation...</p>
                      {walletPollRef && <p className="cpv2-modal__ref">Ref: {walletPollRef}</p>}
                      <p className="cpv2-modal__instruction">
                        {walletPaymentMethod === 'ecocash'
                          ? 'Please check your phone and enter your EcoCash PIN.'
                          : 'Complete your payment on the Paynow payment page.'}
                      </p>
                      <button
                        type="button"
                        className="cpv2-modal__cancel-polling"
                        onClick={() => {
                          if (walletPollIntervalRef.current) { clearInterval(walletPollIntervalRef.current); walletPollIntervalRef.current = null; }
                          setWalletPolling(false);
                          setShowTopUpModal(false);
                          setWalletPollRefState(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!walletPolling && (
                  <div className="cpv2-modal__footer">
                    <button type="button" className="cpv2-modal__cancel-btn" onClick={() => setShowTopUpModal(false)}>
                      CANCEL
                    </button>
                    <button
                      type="button"
                      className={`cpv2-modal__pay-btn ${walletPaymentMethod === 'visa_mastercard' ? 'cpv2-modal__pay-btn--card' : ''}`}
                      disabled={toppingUp || (walletPaymentMethod === 'ecocash' && !walletPhoneNumber.trim()) || !walletEmail.trim()}
                      onClick={handleWalletTopUp}
                    >
                      {toppingUp
                        ? <Loader2 size={20} className="cpv2-spinner" />
                        : `TOP UP $${(customTopUpAmount ? parseFloat(customTopUpAmount) : topUpAmount).toFixed(2)}`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════ Wallet Success Modal ═══════════ */}
          {showWalletSuccess && (
            <div className="cpv2-overlay" onClick={() => setShowWalletSuccess(false)}>
              <div className="cpv2-success-modal" onClick={e => e.stopPropagation()}>
                <div className="cpv2-success__header">
                  <span className="cpv2-success__emoji">🎉</span>
                  <h2>WALLET TOPPED UP!</h2>
                  <p>Payment Successful</p>
                </div>
                <div className="cpv2-success__body">
                  <p>Your lesson wallet has been funded. You're ready to book lessons!</p>
                  <div className="cpv2-success__credits-box">
                    <span className="cpv2-success__credits-label">AMOUNT ADDED</span>
                    <span className="cpv2-success__credits-value">+${walletSuccessAmount.toFixed(2)}</span>
                  </div>
                  <p className="cpv2-success__motivation">
                    You can now book {Math.floor(walletSuccessAmount / 0.5)} lessons at $0.50 each. Find a teacher and start learning!
                  </p>
                  <button
                    type="button"
                    className="cpv2-success__btn"
                    onClick={() => setShowWalletSuccess(false)}
                  >
                    DONE
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

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
