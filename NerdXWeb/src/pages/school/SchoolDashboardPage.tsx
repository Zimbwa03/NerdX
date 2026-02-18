import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchoolAuth } from '../../context/SchoolAuthContext';
import { schoolApi, type SchoolOverview, type SchoolStudent, type SchoolStudentDetail, type FinanceSummary } from '../../services/api/schoolDashboardApi';
import { FloatingParticles } from '../../components/FloatingParticles';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  ArrowLeft, School, Users, UserCheck, TrendingUp, DollarSign, Calendar,
  Clock, BookOpen, Zap, Search, ChevronRight, ChevronLeft, Loader2,
  LayoutDashboard, CreditCard, Settings, Menu, X, LogOut, Smartphone,
  Building2, Upload, CheckCircle, AlertCircle,
} from 'lucide-react';

type SidebarSection = 'overview' | 'students' | 'finance' | 'settings';

const CHART_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export function SchoolDashboardPage() {
  const { school, token, logout, isAuthenticated } = useSchoolAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<SidebarSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Overview
  const [overview, setOverview] = useState<SchoolOverview | null>(null);

  // Students
  const [students, setStudents] = useState<SchoolStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<SchoolStudentDetail | null>(null);
  const [studentDetailLoading, setStudentDetailLoading] = useState(false);

  // Finance
  const [finance, setFinance] = useState<FinanceSummary | null>(null);
  const [financeLoading, setFinanceLoading] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState<'ecocash' | 'bank'>('ecocash');
  const [payPhone, setPayPhone] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payEmail, setPayEmail] = useState('');
  const [paying, setPaying] = useState(false);
  const [payResult, setPayResult] = useState<{ success: boolean; message: string } | null>(null);
  const [checkingPay, setCheckingPay] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Bank receipt upload
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [bankAmount, setBankAmount] = useState('');
  const [bankNotes, setBankNotes] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  const loadOverview = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const data = await schoolApi.getOverview(token);
    if (data) setOverview(data);
    setLoading(false);
  }, [token]);

  const loadStudents = useCallback(async () => {
    if (!token) return;
    setStudentsLoading(true);
    const data = await schoolApi.getStudents(token);
    setStudents(data.students);
    setStudentsLoading(false);
  }, [token]);

  const loadStudentDetail = useCallback(async (id: number) => {
    if (!token) return;
    setStudentDetailLoading(true);
    const data = await schoolApi.getStudentDetail(token, id);
    setSelectedStudent(data);
    setStudentDetailLoading(false);
  }, [token]);

  const loadFinance = useCallback(async () => {
    if (!token) return;
    setFinanceLoading(true);
    const data = await schoolApi.getFinanceSummary(token);
    if (data) setFinance(data);
    setFinanceLoading(false);
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOverview();
  }, [isAuthenticated, loadOverview]);

  useEffect(() => {
    if (activeSection === 'students' && students.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadStudents();
    }
    if (activeSection === 'finance' && !finance) {
      loadFinance();
    }
  }, [activeSection, students.length, finance, loadStudents, loadFinance]);

  const handleSectionChange = (s: SidebarSection) => {
    setActiveSection(s);
    setSidebarOpen(false);
    if (s === 'students') setSelectedStudent(null);
  };

  const handleLogout = () => {
    logout();
    navigate(`/school/${school?.slug || ''}`, { replace: true });
  };

  // Payment handlers
  const handleEcocashPay = async () => {
    if (!token || !payPhone || !payAmount) return;
    setPaying(true);
    setPayResult(null);
    const res = await schoolApi.payEcocash(token, payPhone, parseFloat(payAmount), payEmail || undefined);
    if (res.success && res.reference) {
      setPayResult({ success: true, message: res.instructions || 'Check your phone for EcoCash prompt' });
      startPolling(res.reference);
    } else {
      setPayResult({ success: false, message: res.error || 'Payment failed' });
    }
    setPaying(false);
  };

  const startPolling = (ref: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      if (!token) return;
      setCheckingPay(true);
      const status = await schoolApi.checkPaymentStatus(token, ref);
      if (status.paid) {
        if (pollRef.current) clearInterval(pollRef.current);
        setPayResult({ success: true, message: 'Payment confirmed!' });
        setCheckingPay(false);
        loadFinance();
        return;
      }
      setCheckingPay(false);
    }, 5000);
    setTimeout(() => { if (pollRef.current) clearInterval(pollRef.current); }, 120000);
  };

  useEffect(() => { return () => { if (pollRef.current) clearInterval(pollRef.current); }; }, []);

  const handleReceiptUpload = async () => {
    if (!token || !receiptFile || !bankAmount) return;
    setUploadingReceipt(true);
    const res = await schoolApi.uploadReceipt(token, receiptFile, parseFloat(bankAmount), bankNotes);
    if (res.success) {
      setPayResult({ success: true, message: 'Receipt uploaded. Pending admin verification.' });
      setReceiptFile(null);
      setReceiptFileName('');
      setBankAmount('');
      setBankNotes('');
      loadFinance();
    } else {
      setPayResult({ success: false, message: res.error || 'Upload failed' });
    }
    setUploadingReceipt(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => { setReceiptFile(reader.result as string); };
    reader.readAsDataURL(file);
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (d: string | null) => {
    if (!d) return 'N/A';
    try { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return d; }
  };

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

  if (!isAuthenticated || !school) return null;

  // ─── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <div className="sd-v2">
      <FloatingParticles />

      {/* Mobile Header */}
      <div className="sd-v2-mobile-header">
        <button className="sd-v2-mobile-back" onClick={handleLogout}><ArrowLeft size={20} /></button>
        <span className="sd-v2-mobile-title">{school.name}</span>
        <button className="sd-v2-mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={22} /></button>
      </div>

      {/* Sidebar */}
      <aside className={`sd-v2-sidebar ${sidebarOpen ? 'sd-v2-sidebar--open' : ''}`}>
        <div className="sd-v2-sidebar__header">
          <button className="sd-v2-sidebar__close" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>

        <div className="sd-v2-sidebar__school">
          {school.logo_url ? (
            <img src={school.logo_url} alt={school.name} className="sd-v2-sidebar__logo" />
          ) : (
            <div className="sd-v2-sidebar__logo-placeholder"><School size={32} /></div>
          )}
          <h2 className="sd-v2-sidebar__name">{school.name}</h2>
          <span className="sd-v2-sidebar__id">ID: {school.school_id}</span>
        </div>

        <nav className="sd-v2-sidebar__nav">
          {([
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'students', icon: Users, label: 'Students' },
            { id: 'finance', icon: DollarSign, label: 'Finance' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ] as const).map(item => (
            <button
              key={item.id}
              className={`sd-v2-sidebar__nav-item ${activeSection === item.id ? 'sd-v2-sidebar__nav-item--active' : ''}`}
              onClick={() => handleSectionChange(item.id)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sd-v2-sidebar__footer">
          <button className="sd-v2-sidebar__logout" onClick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="sd-v2-main">

        {/* ─── OVERVIEW ─── */}
        {activeSection === 'overview' && (
          <div className="sd-section">
            <div className="sd-hero">
              <div className="sd-hero__text">
                <h1 className="sd-hero__title">{school.name}</h1>
                <p className="sd-hero__sub">School Dashboard</p>
              </div>
              {overview?.subscription_active ? (
                <span className="sd-badge sd-badge--green">Active - {overview.days_remaining} days left</span>
              ) : (
                <span className="sd-badge sd-badge--red">Subscription Expired</span>
              )}
            </div>

            {loading ? (
              <div className="sd-loader"><Loader2 size={28} className="sd-spin" /></div>
            ) : overview ? (
              <>
                {/* Stat Cards */}
                <div className="sd-stats-grid">
                  <div className="sd-stat-card">
                    <div className="sd-stat-card__icon sd-stat-card__icon--blue"><Users size={22} /></div>
                    <div className="sd-stat-card__info">
                      <span className="sd-stat-card__value">{overview.total_students}</span>
                      <span className="sd-stat-card__label">Total Students</span>
                    </div>
                  </div>
                  <div className="sd-stat-card">
                    <div className="sd-stat-card__icon sd-stat-card__icon--green"><UserCheck size={22} /></div>
                    <div className="sd-stat-card__info">
                      <span className="sd-stat-card__value">{overview.active_students}</span>
                      <span className="sd-stat-card__label">Active (30d)</span>
                    </div>
                  </div>
                  <div className="sd-stat-card">
                    <div className="sd-stat-card__icon sd-stat-card__icon--emerald"><DollarSign size={22} /></div>
                    <div className="sd-stat-card__info">
                      <span className="sd-stat-card__value sd-stat-card__value--green">{formatCurrency(overview.revenue.school_share)}</span>
                      <span className="sd-stat-card__label">Your Earnings (30%)</span>
                    </div>
                  </div>
                  <div className="sd-stat-card">
                    <div className="sd-stat-card__icon sd-stat-card__icon--amber"><Calendar size={22} /></div>
                    <div className="sd-stat-card__info">
                      <span className="sd-stat-card__value">{overview.days_remaining}</span>
                      <span className="sd-stat-card__label">Days Remaining</span>
                    </div>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="sd-card sd-revenue-card">
                  <h3 className="sd-card__title">Revenue Breakdown</h3>
                  <div className="sd-revenue-grid">
                    <div className="sd-revenue-item sd-revenue-item--highlight">
                      <span className="sd-revenue-item__label">Your Monthly Earnings</span>
                      <span className="sd-revenue-item__value sd-revenue-item__value--green">
                        {formatCurrency(overview.revenue.school_share)}
                      </span>
                      <span className="sd-revenue-item__sub">30% of {formatCurrency(overview.revenue.total_monthly)}</span>
                    </div>
                    <div className="sd-revenue-item">
                      <span className="sd-revenue-item__label">Per Student</span>
                      <span className="sd-revenue-item__value">{formatCurrency(overview.revenue.per_student)}/mo</span>
                      <span className="sd-revenue-item__sub">You earn $3.00 per student</span>
                    </div>
                    <div className="sd-revenue-item">
                      <span className="sd-revenue-item__label">NerdX Platform Fee</span>
                      <span className="sd-revenue-item__value">{formatCurrency(overview.revenue.nerdx_share)}</span>
                      <span className="sd-revenue-item__sub">70% platform fee</span>
                    </div>
                    <div className="sd-revenue-item">
                      <span className="sd-revenue-item__label">Amount Due</span>
                      <span className="sd-revenue-item__value">{formatCurrency(Math.max(0, overview.revenue.amount_due))}</span>
                      <span className="sd-revenue-item__sub">
                        Paid: {formatCurrency(overview.revenue.total_paid)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                {overview.daily_activity.length > 0 && (
                  <div className="sd-card">
                    <h3 className="sd-card__title">Student Activity (Last 30 Days)</h3>
                    <div className="sd-chart-wrap">
                      <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={overview.daily_activity}>
                          <defs>
                            <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                          <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={v => v.slice(5)} />
                          <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                          <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#22c55e" fill="url(#actGrad)" />
                          <Area type="monotone" dataKey="questions" name="Questions" stroke="#3b82f6" fill="transparent" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {overview.subject_distribution.length > 0 && (
                  <div className="sd-card">
                    <h3 className="sd-card__title">Subject Usage</h3>
                    <div className="sd-chart-wrap">
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie data={overview.subject_distribution} dataKey="count" nameKey="subject" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {overview.subject_distribution.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="sd-empty">No data available</div>
            )}
          </div>
        )}

        {/* ─── STUDENTS ─── */}
        {activeSection === 'students' && (
          <div className="sd-section">
            {selectedStudent ? (
              <div>
                <button className="sd-back-btn" onClick={() => setSelectedStudent(null)}>
                  <ChevronLeft size={18} /> Back to Students
                </button>

                {studentDetailLoading ? (
                  <div className="sd-loader"><Loader2 size={28} className="sd-spin" /></div>
                ) : (
                  <>
                    <div className="sd-student-header">
                      <h2 className="sd-student-header__name">{selectedStudent.student.name}</h2>
                      <span className="sd-badge sd-badge--blue">{selectedStudent.student.level}</span>
                    </div>

                    <div className="sd-stats-grid">
                      <div className="sd-stat-card">
                        <div className="sd-stat-card__icon sd-stat-card__icon--blue"><Zap size={20} /></div>
                        <div className="sd-stat-card__info">
                          <span className="sd-stat-card__value">{selectedStudent.student.xp}</span>
                          <span className="sd-stat-card__label">XP Points</span>
                        </div>
                      </div>
                      <div className="sd-stat-card">
                        <div className="sd-stat-card__icon sd-stat-card__icon--green"><TrendingUp size={20} /></div>
                        <div className="sd-stat-card__info">
                          <span className="sd-stat-card__value">{selectedStudent.student.streak}</span>
                          <span className="sd-stat-card__label">Day Streak</span>
                        </div>
                      </div>
                      <div className="sd-stat-card">
                        <div className="sd-stat-card__icon sd-stat-card__icon--amber"><BookOpen size={20} /></div>
                        <div className="sd-stat-card__info">
                          <span className="sd-stat-card__value">{selectedStudent.summary.total_questions}</span>
                          <span className="sd-stat-card__label">Questions Answered</span>
                        </div>
                      </div>
                      <div className="sd-stat-card">
                        <div className="sd-stat-card__icon sd-stat-card__icon--purple"><Clock size={20} /></div>
                        <div className="sd-stat-card__info">
                          <span className="sd-stat-card__value">{selectedStudent.summary.total_time_minutes}m</span>
                          <span className="sd-stat-card__label">Total Time</span>
                        </div>
                      </div>
                    </div>

                    <div className="sd-card">
                      <h3 className="sd-card__title">Subjects Used</h3>
                      <div className="sd-subjects-list">
                        {selectedStudent.summary.subjects_used.length > 0 ? (
                          selectedStudent.summary.subjects_used.map(s => (
                            <span key={s} className="sd-subject-tag">{s}</span>
                          ))
                        ) : (
                          <span className="sd-muted">No subjects recorded yet</span>
                        )}
                      </div>
                    </div>

                    {selectedStudent.activity.length > 0 && (
                      <div className="sd-card">
                        <h3 className="sd-card__title">Activity History</h3>
                        <div className="sd-chart-wrap">
                          <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={selectedStudent.activity.slice(0, 30)}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                              <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickFormatter={v => v.slice(5)} />
                              <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                              <Bar dataKey="questions" name="Questions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="sessions" name="Sessions" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="sd-section-header">
                  <h2 className="sd-section-header__title">Students</h2>
                  <div className="sd-search-wrap">
                    <Search size={16} />
                    <input
                      className="sd-search-input"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {studentsLoading ? (
                  <div className="sd-loader"><Loader2 size={28} className="sd-spin" /></div>
                ) : filteredStudents.length === 0 ? (
                  <div className="sd-empty">No students found</div>
                ) : (
                  <div className="sd-students-list">
                    {filteredStudents.map(st => (
                      <div key={st.id} className="sd-student-row" onClick={() => loadStudentDetail(st.id)}>
                        <div className="sd-student-row__info">
                          <span className="sd-student-row__name">{st.name}</span>
                          <span className="sd-student-row__level">{st.level}</span>
                        </div>
                        <div className="sd-student-row__stats">
                          <span className="sd-student-row__stat"><Zap size={14} /> {st.xp} XP</span>
                          <span className="sd-student-row__stat"><TrendingUp size={14} /> {st.streak} streak</span>
                          <span className={`sd-student-row__status ${st.is_active ? 'sd-student-row__status--active' : ''}`}>
                            {st.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <ChevronRight size={18} className="sd-student-row__chevron" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── FINANCE ─── */}
        {activeSection === 'finance' && (
          <div className="sd-section">
            <div className="sd-section-header">
              <h2 className="sd-section-header__title">Finance & Payments</h2>
            </div>

            {financeLoading ? (
              <div className="sd-loader"><Loader2 size={28} className="sd-spin" /></div>
            ) : finance ? (
              <>
                {/* Summary Cards */}
                <div className="sd-stats-grid">
                  <div className="sd-stat-card sd-stat-card--highlight">
                    <div className="sd-stat-card__icon sd-stat-card__icon--emerald"><DollarSign size={22} /></div>
                    <div className="sd-stat-card__info">
                      <span className="sd-stat-card__value sd-stat-card__value--green">{formatCurrency(finance.school_earnings)}</span>
                      <span className="sd-stat-card__label">Your Earnings ({finance.school_share_percent}%)</span>
                    </div>
                  </div>
                  <div className="sd-stat-card">
                    <div className="sd-stat-card__icon sd-stat-card__icon--blue"><CreditCard size={22} /></div>
                    <div className="sd-stat-card__info">
                      <span className="sd-stat-card__value">{formatCurrency(finance.amount_due)}</span>
                      <span className="sd-stat-card__label">Amount Due to NerdX</span>
                    </div>
                  </div>
                  <div className="sd-stat-card">
                    <div className="sd-stat-card__icon sd-stat-card__icon--green"><CheckCircle size={22} /></div>
                    <div className="sd-stat-card__info">
                      <span className="sd-stat-card__value">{formatCurrency(finance.total_paid)}</span>
                      <span className="sd-stat-card__label">Total Paid</span>
                    </div>
                  </div>
                  <div className="sd-stat-card">
                    <div className="sd-stat-card__icon sd-stat-card__icon--amber"><Clock size={22} /></div>
                    <div className="sd-stat-card__info">
                      <span className="sd-stat-card__value">{formatCurrency(finance.total_pending)}</span>
                      <span className="sd-stat-card__label">Pending</span>
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="sd-card">
                  <h3 className="sd-card__title">Monthly Breakdown</h3>
                  <div className="sd-finance-breakdown">
                    <div className="sd-finance-row">
                      <span>Students</span><span><strong>{finance.num_students}</strong></span>
                    </div>
                    <div className="sd-finance-row">
                      <span>Fee per Student</span><span>{formatCurrency(finance.per_student_fee)}/mo</span>
                    </div>
                    <div className="sd-finance-row">
                      <span>Total Monthly Revenue</span><span>{formatCurrency(finance.total_monthly_revenue)}</span>
                    </div>
                    <div className="sd-finance-row sd-finance-row--green">
                      <span>Your Share ({finance.school_share_percent}%)</span><span><strong>{formatCurrency(finance.school_earnings)}</strong></span>
                    </div>
                    <div className="sd-finance-row">
                      <span>NerdX Platform Fee ({finance.nerdx_share_percent}%)</span><span>{formatCurrency(finance.nerdx_share)}</span>
                    </div>
                  </div>
                </div>

                {/* Pay Now */}
                <div className="sd-card">
                  <div className="sd-card__header-row">
                    <h3 className="sd-card__title">Make Payment</h3>
                    {!showPayModal && (
                      <button className="sd-btn sd-btn--primary" onClick={() => { setShowPayModal(true); setPayResult(null); }}>
                        Pay Now
                      </button>
                    )}
                  </div>

                  {showPayModal && (
                    <div className="sd-pay-modal">
                      <div className="sd-pay-tabs">
                        <button className={`sd-pay-tab ${payMethod === 'ecocash' ? 'sd-pay-tab--active' : ''}`} onClick={() => setPayMethod('ecocash')}>
                          <Smartphone size={16} /> EcoCash
                        </button>
                        <button className={`sd-pay-tab ${payMethod === 'bank' ? 'sd-pay-tab--active' : ''}`} onClick={() => setPayMethod('bank')}>
                          <Building2 size={16} /> Bank Transfer
                        </button>
                      </div>

                      {payMethod === 'ecocash' ? (
                        <div className="sd-pay-form">
                          <div className="sd-field">
                            <label className="sd-label">Amount (USD)</label>
                            <input className="sd-input" type="number" placeholder="0.00" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
                          </div>
                          <div className="sd-field">
                            <label className="sd-label">EcoCash Number</label>
                            <input className="sd-input" type="tel" placeholder="0771234567" value={payPhone} onChange={e => setPayPhone(e.target.value)} />
                          </div>
                          <div className="sd-field">
                            <label className="sd-label">Email (optional)</label>
                            <input className="sd-input" type="email" placeholder="school@email.com" value={payEmail} onChange={e => setPayEmail(e.target.value)} />
                          </div>
                          <button className="sd-btn sd-btn--primary sd-btn--full" onClick={handleEcocashPay} disabled={paying || !payPhone || !payAmount}>
                            {paying ? <><Loader2 size={16} className="sd-spin" /> Processing...</> : `Pay ${payAmount ? formatCurrency(parseFloat(payAmount)) : '$0.00'} via EcoCash`}
                          </button>
                          {checkingPay && <p className="sd-muted" style={{ marginTop: 8 }}>Checking payment status...</p>}
                        </div>
                      ) : (
                        <div className="sd-pay-form">
                          <div className="sd-bank-details">
                            <h4>NerdX Bank Details</h4>
                            <p><strong>Bank:</strong> Will be provided</p>
                            <p><strong>Account:</strong> Will be provided</p>
                            <p><strong>Branch:</strong> Will be provided</p>
                            <p className="sd-muted">Transfer the amount and upload your receipt below</p>
                          </div>
                          <div className="sd-field">
                            <label className="sd-label">Amount Transferred (USD)</label>
                            <input className="sd-input" type="number" placeholder="0.00" value={bankAmount} onChange={e => setBankAmount(e.target.value)} />
                          </div>
                          <div className="sd-field">
                            <label className="sd-label">Upload Receipt</label>
                            <label className="sd-file-upload">
                              <Upload size={18} />
                              <span>{receiptFileName || 'Choose file...'}</span>
                              <input type="file" accept="image/*,.pdf" onChange={handleFileSelect} hidden />
                            </label>
                            {receiptFile && <img src={receiptFile} alt="Receipt preview" className="sd-receipt-preview" />}
                          </div>
                          <div className="sd-field">
                            <label className="sd-label">Notes (optional)</label>
                            <textarea className="sd-input sd-textarea" placeholder="Transaction reference, date, etc." value={bankNotes} onChange={e => setBankNotes(e.target.value)} />
                          </div>
                          <button className="sd-btn sd-btn--primary sd-btn--full" onClick={handleReceiptUpload} disabled={uploadingReceipt || !receiptFile || !bankAmount}>
                            {uploadingReceipt ? <><Loader2 size={16} className="sd-spin" /> Uploading...</> : 'Upload Receipt'}
                          </button>
                        </div>
                      )}

                      {payResult && (
                        <div className={`sd-pay-result ${payResult.success ? 'sd-pay-result--success' : 'sd-pay-result--error'}`}>
                          {payResult.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                          {payResult.message}
                        </div>
                      )}

                      <button className="sd-btn sd-btn--ghost" onClick={() => { setShowPayModal(false); setPayResult(null); }} style={{ marginTop: 8 }}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment History */}
                <div className="sd-card">
                  <h3 className="sd-card__title">Payment History</h3>
                  {finance.payments.length === 0 ? (
                    <p className="sd-muted">No payments yet</p>
                  ) : (
                    <div className="sd-payments-table">
                      <div className="sd-payments-table__header">
                        <span>Date</span><span>Amount</span><span>Method</span><span>Status</span>
                      </div>
                      {finance.payments.map(p => (
                        <div key={p.id} className="sd-payments-table__row">
                          <span>{formatDate(p.created_at)}</span>
                          <span>{formatCurrency(parseFloat(String(p.amount)))}</span>
                          <span>{p.payment_method === 'ecocash' ? 'EcoCash' : 'Bank Transfer'}</span>
                          <span className={`sd-status-badge sd-status-badge--${p.status}`}>{p.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="sd-empty">Unable to load financial data</div>
            )}
          </div>
        )}

        {/* ─── SETTINGS ─── */}
        {activeSection === 'settings' && (
          <div className="sd-section">
            <div className="sd-section-header">
              <h2 className="sd-section-header__title">School Information</h2>
            </div>
            <div className="sd-card">
              <div className="sd-settings-grid">
                <div className="sd-settings-item">
                  <span className="sd-settings-item__label">School Name</span>
                  <span className="sd-settings-item__value">{school.name}</span>
                </div>
                <div className="sd-settings-item">
                  <span className="sd-settings-item__label">School ID</span>
                  <span className="sd-settings-item__value">{school.school_id}</span>
                </div>
                <div className="sd-settings-item">
                  <span className="sd-settings-item__label">Email</span>
                  <span className="sd-settings-item__value">{school.email || 'Not set'}</span>
                </div>
                <div className="sd-settings-item">
                  <span className="sd-settings-item__label">Phone</span>
                  <span className="sd-settings-item__value">{school.phone || 'Not set'}</span>
                </div>
                <div className="sd-settings-item">
                  <span className="sd-settings-item__label">Contact Person</span>
                  <span className="sd-settings-item__value">{school.contact_person || 'Not set'}</span>
                </div>
                <div className="sd-settings-item">
                  <span className="sd-settings-item__label">Subscription Expires</span>
                  <span className="sd-settings-item__value">{formatDate(school.subscription_expires_at)}</span>
                </div>
                <div className="sd-settings-item">
                  <span className="sd-settings-item__label">Dashboard URL</span>
                  <span className="sd-settings-item__value sd-settings-item__value--mono">{window.location.origin}/school/{school.slug}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
