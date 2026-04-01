import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { useSchoolAuth } from '../../context/SchoolAuthContext';
import {
  schoolApi,
  type SchoolOverview,
  type SchoolStudent,
  type SchoolStudentDetail,
  type FinanceSummary,
  type GroupNetworkAnalytics,
  type PortalAnalyticsExtras,
} from '../../services/api/schoolDashboardApi';
import { GroupNetworkAnalyticsPanel } from '../../components/school/GroupNetworkAnalyticsPanel';
import { GroupOverviewCharts } from '../../components/school/dashboard/GroupOverviewCharts';
import { schoolEcosystemApi, type AcademicYear, type SchoolForm, type SchoolClass, type SchoolSubject, type SchoolTeacher, type SchoolStudent as EcoStudent, type SubSchool } from '../../services/api/schoolEcosystemApi';
import { HerentalsAIPanel } from '../../components/school/dashboard/HerentalsAIPanel';
import { SchoolDashboardLayout, type PortalExportKind } from './SchoolDashboardLayout';
import type { SchoolDashboardSection } from './schoolDashboard.types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import {
  Users, UserCheck, TrendingUp, DollarSign, Calendar,
  Clock, BookOpen, Zap, Search, ChevronRight, ChevronLeft, Loader2,
  CreditCard, Smartphone,
  Building2, Upload, CheckCircle, AlertCircle, GraduationCap, UserPlus,
  Layers, ClipboardList, Plus, Link2, Copy, Building, MapPin, Eye, X,
} from 'lucide-react';
import { getPublicSiteOrigin } from '../../services/api/config';

const CHART_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#10B981', '#ec4899', '#06b6d4', '#f97316'];

function sectionToPath(s: SchoolDashboardSection): string {
  switch (s) {
    case 'overview':
      return 'overview';
    case 'performance':
      return 'performance';
    case 'sub_schools':
      return 'sub-schools';
    case 'forms':
      return 'manage/structure';
    case 'subjects':
      return 'manage/subjects';
    case 'teachers':
      return 'manage/teachers';
    case 'ecosystem_students':
      return 'manage/students-v2';
    case 'students':
      return 'nerdx-students';
    case 'finance':
      return 'finance';
    case 'settings':
      return 'settings';
    default:
      return 'overview';
  }
}

function pathToSection(pathname: string): SchoolDashboardSection {
  const idx = pathname.indexOf('/dashboard');
  const rest = idx >= 0 ? pathname.slice(idx + '/dashboard'.length).replace(/^\/+/, '') : 'overview';
  const norm = rest.split('?')[0].replace(/\/$/, '') || 'overview';
  if (norm === 'overview') return 'overview';
  if (norm === 'performance') return 'performance';
  if (norm === 'sub-schools') return 'sub_schools';
  if (norm === 'nerdx-students') return 'students';
  if (norm === 'finance') return 'finance';
  if (norm === 'settings') return 'settings';
  if (norm === 'manage/structure' || norm === 'manage') return 'forms';
  if (norm === 'manage/subjects') return 'subjects';
  if (norm === 'manage/teachers') return 'teachers';
  if (norm === 'manage/students-v2') return 'ecosystem_students';
  return 'overview';
}

function sectionLabel(section: SchoolDashboardSection): string {
  switch (section) {
    case 'overview':
      return 'Overview';
    case 'performance':
      return 'Performance';
    case 'sub_schools':
      return 'Sub-schools';
    case 'forms':
      return 'Manage · Structure';
    case 'subjects':
      return 'Manage · Subjects';
    case 'teachers':
      return 'Manage · Teachers';
    case 'ecosystem_students':
      return 'Manage · Students';
    case 'students':
      return 'NerdX students';
    case 'finance':
      return 'Finance';
    case 'settings':
      return 'Settings';
    default:
      return 'Dashboard';
  }
}

export function SchoolDashboardPage() {
  const { school, token, logout, isAuthenticated, refreshSchool } = useSchoolAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { schoolSlug } = useParams<{ schoolSlug: string }>();

  const activeSection = pathToSection(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRangeDays, setDateRangeDays] = useState<7 | 30 | 90>(30);
  const [overviewCampusScope, setOverviewCampusScope] = useState<'all' | string>('all');
  const [analyticsExtras, setAnalyticsExtras] = useState<PortalAnalyticsExtras | null>(null);
  const [extrasLoading, setExtrasLoading] = useState(false);

  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsPhone, setSettingsPhone] = useState('');
  const [settingsContact, setSettingsContact] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);

  // Overview
  const [overview, setOverview] = useState<SchoolOverview | null>(null);
  const [groupAnalytics, setGroupAnalytics] = useState<GroupNetworkAnalytics | null>(null);

  // Students
  const [students, setStudents] = useState<SchoolStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<SchoolStudentDetail | null>(null);
  const [studentDetailLoading, setStudentDetailLoading] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editingExpiryDate, setEditingExpiryDate] = useState('');
  const [savingStudentId, setSavingStudentId] = useState<number | null>(null);
  const [studentsMessage, setStudentsMessage] = useState<{ success: boolean; message: string } | null>(null);

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

  // ─── ECOSYSTEM v2 STATE ───
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [forms, setForms] = useState<SchoolForm[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<SchoolSubject[]>([]);
  const [ecoTeachers, setEcoTeachers] = useState<SchoolTeacher[]>([]);
  const [ecoStudents, setEcoStudents] = useState<EcoStudent[]>([]);
  const [ecoLoading, setEcoLoading] = useState(false);

  // Form creation
  const [showAddYear, setShowAddYear] = useState(false);
  const [newYearLabel, setNewYearLabel] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFormNumber, setNewFormNumber] = useState(1);
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedFormIdForClass, setSelectedFormIdForClass] = useState<number | null>(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectCompulsory, setNewSubjectCompulsory] = useState(false);
  const [selectedFormIdForSubject, setSelectedFormIdForSubject] = useState<number | null>(null);

  // Teacher creation
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newTeacherFirst, setNewTeacherFirst] = useState('');
  const [newTeacherLast, setNewTeacherLast] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');
  const [newTeacherSpec, setNewTeacherSpec] = useState('');
  const [createdTeacherCode, setCreatedTeacherCode] = useState('');

  // Student creation
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentFirst, setNewStudentFirst] = useState('');
  const [newStudentLast, setNewStudentLast] = useState('');
  const [newStudentDob, setNewStudentDob] = useState('');
  const [newStudentGender, setNewStudentGender] = useState('');
  const [newStudentClassId, setNewStudentClassId] = useState<number | null>(null);
  const [newStudentGuardian, setNewStudentGuardian] = useState('');
  const [newStudentGuardianPhone, setNewStudentGuardianPhone] = useState('');
  const [createdStudentCode, setCreatedStudentCode] = useState('');

  // Teacher assignment
  const [showAssign, setShowAssign] = useState(false);
  const [assignClassId, setAssignClassId] = useState<number | null>(null);
  const [assignSubjectId, setAssignSubjectId] = useState<number | null>(null);
  const [assignTeacherId, setAssignTeacherId] = useState<number | null>(null);

  const [ecoMessage, setEcoMessage] = useState<{ success: boolean; message: string } | null>(null);

  // ─── GROUP / SUB-SCHOOLS STATE ───
  const [subSchools, setSubSchools] = useState<SubSchool[]>([]);
  const [subSchoolsLoading, setSubSchoolsLoading] = useState(false);
  const [showAddSubSchool, setShowAddSubSchool] = useState(false);
  const [newSubSchoolName, setNewSubSchoolName] = useState('');
  const [newSubSchoolCampus, setNewSubSchoolCampus] = useState('');
  const [newSubSchoolCity, setNewSubSchoolCity] = useState('');
  const [newSubSchoolLocation, setNewSubSchoolLocation] = useState('');
  const [newSubSchoolContact, setNewSubSchoolContact] = useState('');
  const [newSubSchoolPhone, setNewSubSchoolPhone] = useState('');
  const [newSubSchoolEmail, setNewSubSchoolEmail] = useState('');
  const [createdSubSchoolId, setCreatedSubSchoolId] = useState('');
  const [activeSubSchool, setActiveSubSchool] = useState<SubSchool | null>(null);
  const [subSchoolSearch, setSubSchoolSearch] = useState('');
  const [subSchoolSort, setSubSchoolSort] = useState<'name' | 'students' | 'teachers' | 'city'>('name');
  const [subSchoolView, setSubSchoolView] = useState<'grid' | 'list'>('grid');

  // Ecosystem data loaders
  const loadEcosystemData = useCallback(async () => {
    if (!token || !school) return;
    const targetSchoolId = activeSubSchool?.school_id || school.school_id;
    setEcoLoading(true);
    try {
      const [yearsRes, teachersRes, studentsRes] = await Promise.all([
        schoolEcosystemApi.listAcademicYears(token, targetSchoolId),
        schoolEcosystemApi.listTeachers(token, targetSchoolId),
        schoolEcosystemApi.listStudents(token, targetSchoolId),
      ]);
      setAcademicYears(yearsRes.academic_years || []);
      setEcoTeachers(teachersRes.teachers || []);
      setEcoStudents(studentsRes.students || []);

      const activeYear = (yearsRes.academic_years || []).find((y: AcademicYear) => y.is_active);
      if (activeYear) {
        setSelectedYearId(activeYear.id);
        const [formsRes, classesRes, subjectsRes] = await Promise.all([
          schoolEcosystemApi.listForms(token, targetSchoolId, activeYear.id),
          schoolEcosystemApi.listClasses(token, targetSchoolId),
          schoolEcosystemApi.listSubjects(token, targetSchoolId),
        ]);
        setForms(formsRes.forms || []);
        setClasses(classesRes.classes || []);
        setSubjects(subjectsRes.subjects || []);
      }
    } catch (e) { console.error('Ecosystem load error:', e); }
    setEcoLoading(false);
  }, [token, school, activeSubSchool]);

  const loadSubSchools = useCallback(async () => {
    if (!school?.group_id) return;
    setSubSchoolsLoading(true);
    try {
      const res = await schoolEcosystemApi.listGroupSubSchools(school.group_id);
      setSubSchools(res.sub_schools || []);
    } catch (e) { console.error('Sub-schools load error:', e); }
    setSubSchoolsLoading(false);
  }, [school]);

  const loadFormsAndClasses = useCallback(async () => {
    if (!token || !school || !selectedYearId) return;
    const targetSchoolId = activeSubSchool?.school_id || school.school_id;
    const [formsRes, classesRes] = await Promise.all([
      schoolEcosystemApi.listForms(token, targetSchoolId, selectedYearId),
      schoolEcosystemApi.listClasses(token, targetSchoolId),
    ]);
    setForms(formsRes.forms || []);
    setClasses(classesRes.classes || []);
  }, [token, school, selectedYearId, activeSubSchool]);

  const loadOverview = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const hasGroup = Boolean(school?.group_id);
      const [data, ga] = await Promise.all([
        schoolApi.getOverview(token),
        hasGroup ? schoolApi.getGroupNetworkAnalytics(token) : Promise.resolve(null),
      ]);
      if (data) setOverview(data);
      setGroupAnalytics(ga);
    } finally {
      setLoading(false);
    }
  }, [token, school?.group_id]);

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
    if (['overview', 'forms', 'teachers', 'ecosystem_students', 'subjects'].includes(activeSection) && academicYears.length === 0) {
      loadEcosystemData();
    }
    if (['overview', 'sub_schools', 'performance'].includes(activeSection) && subSchools.length === 0 && school?.group_id) {
      loadSubSchools();
    }
  }, [activeSection, students.length, finance, academicYears.length, subSchools.length, loadStudents, loadFinance, loadEcosystemData, loadSubSchools]);

  useEffect(() => {
    if (school) {
      setSettingsEmail(school.email || '');
      setSettingsPhone(school.phone || '');
      setSettingsContact(school.contact_person || '');
    }
  }, [school]);

  useEffect(() => {
    if (activeSection !== 'performance' || !token) return;
    let cancelled = false;
    setExtrasLoading(true);
    schoolApi.getAnalyticsExtras(token, dateRangeDays === 90 ? 90 : 30).then((d) => {
      if (!cancelled) {
        setAnalyticsExtras(d);
        setExtrasLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeSection, token, dateRangeDays]);

  const goTo = (s: SchoolDashboardSection) => {
    const slug = schoolSlug || school?.slug;
    if (!slug) return;
    navigate(`/school/${slug}/dashboard/${sectionToPath(s)}`);
    setSidebarOpen(false);
    if (s === 'students') setSelectedStudent(null);
  };

  const handleLogout = () => {
    logout();
    navigate(`/school/${schoolSlug || school?.slug || ''}`, { replace: true });
  };

  const handlePortalExport = useCallback(
    async (kind: PortalExportKind) => {
      if (!token) return;
      setExportBusy(true);
      const filenames: Record<PortalExportKind, string> = {
        'pdf-summary': 'nerdx-school-summary.pdf',
        'students-xlsx': 'nerdx-portal-students.xlsx',
        'pptx-highlights': 'nerdx-school-highlights.pptx',
      };
      try {
        const r = await schoolApi.downloadPortalExport(token, kind, filenames[kind]);
        if (!r.ok) window.alert(r.error || 'Export failed');
      } finally {
        setExportBusy(false);
      }
    },
    [token]
  );

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
  const toDateInputValue = (dateValue: string | null) => {
    if (!dateValue) return '';
    const base = dateValue.includes('T') ? dateValue.split('T')[0] : dateValue.slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(base) ? base : '';
  };

  const startEditStudentExpiry = (student: SchoolStudent) => {
    setStudentsMessage(null);
    setEditingStudentId(student.id);
    setEditingExpiryDate(toDateInputValue(student.subscription_expires_at));
  };

  const cancelEditStudentExpiry = () => {
    setEditingStudentId(null);
    setEditingExpiryDate('');
  };

  const saveStudentExpiry = async (studentId: number) => {
    if (!token) return;
    if (!editingExpiryDate) {
      setStudentsMessage({ success: false, message: 'Please choose a valid expiry date.' });
      return;
    }

    setSavingStudentId(studentId);
    const expiresAt = `${editingExpiryDate}T23:59:59Z`;
    const res = await schoolApi.updateStudentExpiry(token, studentId, expiresAt);

    if (res.success && res.subscription_expires_at) {
      setStudents(prev => prev.map(st => (
        st.id === studentId ? { ...st, subscription_expires_at: res.subscription_expires_at as string } : st
      )));
      setSelectedStudent(prev => (
        prev && prev.student.id === studentId
          ? { ...prev, student: { ...prev.student, subscription_expires_at: res.subscription_expires_at as string } }
          : prev
      ));
      setStudentsMessage({ success: true, message: 'Student expiry date updated successfully.' });
      cancelEditStudentExpiry();
    } else {
      setStudentsMessage({ success: false, message: res.error || 'Failed to update expiry date.' });
    }

    setSavingStudentId(null);
  };

  const targetSchoolId = activeSubSchool?.school_id || school?.school_id || '';

  if (!isAuthenticated || !school) return null;

  if (schoolSlug && /\/school\/[^/]+\/dashboard\/?$/.test(location.pathname)) {
    return <Navigate to={`/school/${schoolSlug}/dashboard/overview`} replace />;
  }

  const dashBase = `/school/${schoolSlug || school.slug}/dashboard`;

  // ─── RENDER ──────────────────────────────────────────────────────────────────

  return (
    <>
    <SchoolDashboardLayout
      school={school}
      dashBase={dashBase}
      activeSection={activeSection}
      activeSubSchool={activeSubSchool}
      subSchools={subSchools}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      onLogout={handleLogout}
      dateRangeDays={dateRangeDays}
      setDateRangeDays={setDateRangeDays}
      overviewCampusScope={overviewCampusScope}
      setOverviewCampusScope={setOverviewCampusScope}
      onOpenHerentalsAI={() => setAiPanelOpen(true)}
      onExport={handlePortalExport}
      exportInProgress={exportBusy}
    >
        {/* ─── OVERVIEW ─── */}
        {activeSection === 'overview' && (
          <div className="sd-section">
            <div className="sd-hero">
              <div className="sd-hero__text">
                <h1 className="sd-hero__title">{school.name}</h1>
                <p className="sd-hero__sub">{school.group_id ? 'Group Network Dashboard' : 'School Dashboard'}</p>
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
                {school.group_id && groupAnalytics && (
                  <GroupNetworkAnalyticsPanel data={groupAnalytics} />
                )}

                {school.group_id && groupAnalytics && (
                  <GroupOverviewCharts
                    groupAnalytics={groupAnalytics}
                    overview={overview}
                    dateRangeDays={dateRangeDays}
                    campusSchoolId={overviewCampusScope}
                    showGroupBlock
                  />
                )}

                {school.group_id && (
                  <p className="sd-section-header__sub" style={{ margin: '20px 0 12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
                    Head office login — account snapshot (this portal school only)
                  </p>
                )}

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

                {/* Group Network Quick View */}
                {school.group_id && (
                  <div className="sd-card" style={{ borderLeft: '3px solid #8b5cf6' }}>
                    <div className="sd-card__header-row">
                      <h3 className="sd-card__title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Building size={18} style={{ color: '#a78bfa' }} /> Group Network
                      </h3>
                      <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => goTo('sub_schools')}>
                        Manage Schools <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="sd-stats-grid" style={{ marginTop: 8 }}>
                      <div className="sd-stat-card" style={{ cursor: 'pointer' }} onClick={() => goTo('sub_schools')}>
                        <div className="sd-stat-card__icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}><Building size={20} /></div>
                        <div className="sd-stat-card__info">
                          <span className="sd-stat-card__value">{subSchools.length}</span>
                          <span className="sd-stat-card__label">Sub-Schools</span>
                        </div>
                      </div>
                      <div className="sd-stat-card">
                        <div className="sd-stat-card__icon sd-stat-card__icon--green"><Users size={20} /></div>
                        <div className="sd-stat-card__info">
                          <span className="sd-stat-card__value">{subSchools.reduce((sum, s) => sum + (s.student_count || 0), 0)}</span>
                          <span className="sd-stat-card__label">Total Students (Network)</span>
                        </div>
                      </div>
                      <div className="sd-stat-card">
                        <div className="sd-stat-card__icon sd-stat-card__icon--amber"><GraduationCap size={20} /></div>
                        <div className="sd-stat-card__info">
                          <span className="sd-stat-card__value">{subSchools.reduce((sum, s) => sum + (s.teacher_count || 0), 0)}</span>
                          <span className="sd-stat-card__label">Total Teachers (Network)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ecosystem Quick View */}
                <div className="sd-card">
                  <div className="sd-card__header-row">
                    <h3 className="sd-card__title">School Ecosystem</h3>
                    <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => goTo('forms')}>Manage <ChevronRight size={14} /></button>
                  </div>
                  <div className="sd-stats-grid" style={{ marginTop: 8 }}>
                    <div className="sd-stat-card" style={{ cursor: 'pointer' }} onClick={() => goTo('forms')}>
                      <div className="sd-stat-card__icon sd-stat-card__icon--blue"><Layers size={20} /></div>
                      <div className="sd-stat-card__info">
                        <span className="sd-stat-card__value">{forms.length}</span>
                        <span className="sd-stat-card__label">Forms</span>
                      </div>
                    </div>
                    <div className="sd-stat-card" style={{ cursor: 'pointer' }} onClick={() => goTo('forms')}>
                      <div className="sd-stat-card__icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399' }}><ClipboardList size={20} /></div>
                      <div className="sd-stat-card__info">
                        <span className="sd-stat-card__value">{classes.length}</span>
                        <span className="sd-stat-card__label">Classes</span>
                      </div>
                    </div>
                    <div className="sd-stat-card" style={{ cursor: 'pointer' }} onClick={() => goTo('teachers')}>
                      <div className="sd-stat-card__icon sd-stat-card__icon--amber"><GraduationCap size={20} /></div>
                      <div className="sd-stat-card__info">
                        <span className="sd-stat-card__value">{ecoTeachers.length}</span>
                        <span className="sd-stat-card__label">Teachers</span>
                      </div>
                    </div>
                    <div className="sd-stat-card" style={{ cursor: 'pointer' }} onClick={() => goTo('ecosystem_students')}>
                      <div className="sd-stat-card__icon sd-stat-card__icon--green"><UserPlus size={20} /></div>
                      <div className="sd-stat-card__info">
                        <span className="sd-stat-card__value">{ecoStudents.length}</span>
                        <span className="sd-stat-card__label">Enrolled Students</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '10px 16px', flex: 1, minWidth: 200 }}>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>Teacher Login URL</p>
                      <p style={{ margin: '4px 0 0', fontFamily: 'monospace', fontSize: '0.8rem', color: '#a5b4fc', wordBreak: 'break-all' }}>
                        {getPublicSiteOrigin()}/school/{school.school_id}/teacher-login
                      </p>
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
                {(() => {
                  const actWindow = [...overview.daily_activity]
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .slice(-dateRangeDays);
                  return actWindow.length > 0 ? (
                  <div className="sd-card">
                    <h3 className="sd-card__title">Student Activity (last {dateRangeDays} days)</h3>
                    <div className="sd-chart-wrap">
                      <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={actWindow}>
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
                  ) : null;
                })()}

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

        {activeSection === 'performance' && (
          <div className="sd-section">
            <div className="sd-section-header">
              <h2 className="sd-section-header__title sd-font-display">Performance analytics</h2>
              <p className="sd-section-header__sub">
                Ecosystem mastery distribution and top portal learners (group scope when your school belongs to a network).
              </p>
            </div>
            {groupAnalytics && (
              <div className="sd-stats-grid sd-stats-grid--4" style={{ marginBottom: 20 }}>
                <div className="sd-stat-card">
                  <span className="sd-stat-card__value sd-font-mono">
                    {groupAnalytics.totals.weighted_avg_accuracy != null
                      ? `${groupAnalytics.totals.weighted_avg_accuracy}%`
                      : '—'}
                  </span>
                  <span className="sd-stat-card__label">Weighted avg accuracy</span>
                </div>
                <div className="sd-stat-card">
                  <span className="sd-stat-card__value sd-font-mono">
                    {groupAnalytics.projected_pass_rate_pct != null ? `${groupAnalytics.projected_pass_rate_pct}%` : '—'}
                  </span>
                  <span className="sd-stat-card__label">Indicative readiness</span>
                </div>
                <div className="sd-stat-card">
                  <span className="sd-stat-card__value sd-font-mono">{groupAnalytics.performance.students_with_assessment_data}</span>
                  <span className="sd-stat-card__label">Learners w/ assessments</span>
                </div>
                <div className="sd-stat-card">
                  <span className="sd-stat-card__value sd-font-mono">{groupAnalytics.performance.eco_student_records}</span>
                  <span className="sd-stat-card__label">Ecosystem student rows</span>
                </div>
              </div>
            )}
            {!school.group_id && overview && (
              <div className="sd-stats-grid sd-stats-grid--4" style={{ marginBottom: 20 }}>
                <div className="sd-stat-card">
                  <span className="sd-stat-card__value sd-font-mono">{overview.total_students}</span>
                  <span className="sd-stat-card__label">Portal students</span>
                </div>
                <div className="sd-stat-card">
                  <span className="sd-stat-card__value sd-font-mono">{overview.active_students}</span>
                  <span className="sd-stat-card__label">Active ({dateRangeDays}d window label)</span>
                </div>
                <div className="sd-stat-card">
                  <span className="sd-stat-card__value sd-font-mono">{overview.revenue.total_paid > 0 ? formatCurrency(overview.revenue.total_paid) : '—'}</span>
                  <span className="sd-stat-card__label">Verified payments</span>
                </div>
                <div className="sd-stat-card">
                  <span className="sd-stat-card__value sd-font-mono">{overview.days_remaining}</span>
                  <span className="sd-stat-card__label">Subscription days left</span>
                </div>
              </div>
            )}
            {extrasLoading ? (
              <div className="sd-loader">
                <Loader2 size={28} className="sd-spin" />
              </div>
            ) : analyticsExtras ? (
              <div className="sd-exec-grid2">
                <div className="sd-card">
                  <h3 className="sd-card__title">Accuracy distribution (ecosystem)</h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 0 }}>
                    Sample: {analyticsExtras.accuracy_sample_size ?? 0} performance rows
                  </p>
                  <div className="sd-chart-wrap">
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={analyticsExtras.accuracy_histogram}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="range" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                        <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="sd-card">
                  <h3 className="sd-card__title">Top portal learners (XP)</h3>
                  <div className="sd-table-container" style={{ maxHeight: 320, overflow: 'auto' }}>
                    <table className="sd-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>School</th>
                          <th>XP</th>
                          <th>Streak</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsExtras.top_learners.map((row, i) => (
                          <tr key={row.id}>
                            <td className="sd-font-mono">{i + 1}</td>
                            <td>{row.name}</td>
                            <td>{row.school_name || '—'}</td>
                            <td className="sd-font-mono">{row.xp}</td>
                            <td className="sd-font-mono">{row.streak}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="sd-empty">No extended analytics available.</div>
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
                {studentsMessage && (
                  <div className={`sd-student-message ${studentsMessage.success ? 'sd-student-message--success' : 'sd-student-message--error'}`}>
                    {studentsMessage.message}
                  </div>
                )}

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
                          <span className="sd-student-row__expiry">
                            Expiry: {formatDate(st.subscription_expires_at)}
                          </span>
                        </div>
                        <div className="sd-student-row__stats">
                          <span className="sd-student-row__stat"><Zap size={14} /> {st.xp} XP</span>
                          <span className="sd-student-row__stat"><TrendingUp size={14} /> {st.streak} streak</span>
                          <span className={`sd-student-row__status ${st.is_active ? 'sd-student-row__status--active' : ''}`}>
                            {st.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="sd-student-row__actions" onClick={e => e.stopPropagation()}>
                          {editingStudentId === st.id ? (
                            <div className="sd-student-expiry-editor">
                              <input
                                className="sd-student-expiry-input"
                                type="date"
                                value={editingExpiryDate}
                                onChange={e => setEditingExpiryDate(e.target.value)}
                              />
                              <button
                                className="sd-btn sd-btn--primary sd-btn--xs"
                                onClick={() => saveStudentExpiry(st.id)}
                                disabled={savingStudentId === st.id || !editingExpiryDate}
                              >
                                {savingStudentId === st.id ? 'Saving...' : 'Save'}
                              </button>
                              <button className="sd-btn sd-btn--ghost sd-btn--xs" onClick={cancelEditStudentExpiry} disabled={savingStudentId === st.id}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button className="sd-btn sd-btn--ghost sd-btn--xs" onClick={() => startEditStudentExpiry(st)}>
                              Edit expiry
                            </button>
                          )}
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
              <h2 className="sd-section-header__title sd-font-display">School information</h2>
              <p className="sd-section-header__sub">Update contact details and logo (mirrors safe admin fields via school portal API).</p>
            </div>
            {settingsMessage && (
              <div className={`sd-pay-result ${settingsMessage.ok ? 'sd-pay-result--success' : 'sd-pay-result--error'}`} style={{ marginBottom: 12 }}>
                {settingsMessage.text}
              </div>
            )}
            <div className="sd-card" style={{ marginBottom: 16 }}>
              <h3 className="sd-card__title">Logo</h3>
              <p className="sd-muted" style={{ fontSize: 13 }}>PNG or JPG, shown on the dashboard and login page.</p>
              <label className="sd-file-upload" style={{ marginTop: 8 }}>
                <Upload size={18} />
                <span>{logoUploading ? 'Uploading…' : 'Choose image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={!token || logoUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file || !token) return;
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const data = reader.result as string;
                      setLogoUploading(true);
                      setSettingsMessage(null);
                      const res = await schoolApi.uploadSchoolLogo(token, data);
                      setLogoUploading(false);
                      e.target.value = '';
                      if (res.success && res.logo_url) {
                        setSettingsMessage({ ok: true, text: 'Logo updated.' });
                        await refreshSchool();
                      } else {
                        setSettingsMessage({ ok: false, text: res.error || 'Logo upload failed' });
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
            <div className="sd-card">
              <h3 className="sd-card__title">Contact</h3>
              <div className="sd-form-grid" style={{ marginTop: 12 }}>
                <div className="sd-field">
                  <label className="sd-label">School name</label>
                  <input className="sd-input" value={school.name} disabled />
                </div>
                <div className="sd-field">
                  <label className="sd-label">School ID</label>
                  <input className="sd-input sd-font-mono" value={school.school_id} disabled />
                </div>
                <div className="sd-field">
                  <label className="sd-label">Email</label>
                  <input className="sd-input" value={settingsEmail} onChange={(e) => setSettingsEmail(e.target.value)} />
                </div>
                <div className="sd-field">
                  <label className="sd-label">Phone</label>
                  <input className="sd-input" value={settingsPhone} onChange={(e) => setSettingsPhone(e.target.value)} />
                </div>
                <div className="sd-field">
                  <label className="sd-label">Contact person</label>
                  <input className="sd-input" value={settingsContact} onChange={(e) => setSettingsContact(e.target.value)} />
                </div>
                <div className="sd-field">
                  <label className="sd-label">Subscription expires</label>
                  <input className="sd-input" value={formatDate(school.subscription_expires_at)} disabled />
                </div>
              </div>
              <button
                type="button"
                className="sd-btn sd-btn--primary"
                style={{ marginTop: 16 }}
                disabled={settingsSaving || !token}
                onClick={async () => {
                  if (!token) return;
                  setSettingsSaving(true);
                  setSettingsMessage(null);
                  const res = await schoolApi.updateSchoolProfile(token, {
                    email: settingsEmail.trim() || undefined,
                    phone: settingsPhone.trim() || undefined,
                    contact_person: settingsContact.trim() || undefined,
                  });
                  setSettingsSaving(false);
                  if (res.success) {
                    setSettingsMessage({ ok: true, text: 'Profile saved.' });
                    await refreshSchool();
                  } else {
                    setSettingsMessage({ ok: false, text: res.error || 'Save failed' });
                  }
                }}
              >
                {settingsSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
            <div className="sd-card" style={{ marginTop: 16 }}>
              <h3 className="sd-card__title">Portal links</h3>
              <div className="sd-settings-grid">
                <div className="sd-settings-item">
                  <span className="sd-settings-item__label">Dashboard URL</span>
                  <span className="sd-settings-item__value sd-settings-item__value--mono">{getPublicSiteOrigin()}/school/{school.slug}</span>
                </div>
                <div className="sd-settings-item">
                  <span className="sd-settings-item__label">Teacher login URL</span>
                  <span className="sd-settings-item__value sd-settings-item__value--mono">
                    {getPublicSiteOrigin()}/school/{school.school_id}/teacher-login
                    <button type="button" className="sd-copy-btn" title="Copy link" onClick={() => { navigator.clipboard.writeText(`${getPublicSiteOrigin()}/school/${school.school_id}/teacher-login`); }}>
                      <Copy size={14} />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── SUB-SCHOOLS (Group Dashboard) ─── */}
        {activeSection === 'sub_schools' && (() => {
          const totalStudents = subSchools.reduce((s, x) => s + (x.student_count || 0), 0);
          const totalTeachers = subSchools.reduce((s, x) => s + (x.teacher_count || 0), 0);
          const filteredSchools = subSchools
            .filter(ss => {
              if (!subSchoolSearch.trim()) return true;
              const q = subSchoolSearch.toLowerCase();
              return ss.name.toLowerCase().includes(q) || (ss.city || '').toLowerCase().includes(q) || (ss.campus_name || '').toLowerCase().includes(q) || ss.school_id.toLowerCase().includes(q);
            })
            .sort((a, b) => {
              if (subSchoolSort === 'students') return (b.student_count || 0) - (a.student_count || 0);
              if (subSchoolSort === 'teachers') return (b.teacher_count || 0) - (a.teacher_count || 0);
              if (subSchoolSort === 'city') return (a.city || '').localeCompare(b.city || '');
              return a.name.localeCompare(b.name);
            });

          return (
          <div className="sd-section">
            {/* Group Header */}
            <div className="sd-group-hero">
              <div className="sd-group-hero__left">
                {school.logo_url ? (
                  <img src={school.logo_url} alt={school.name} className="sd-group-hero__logo" />
                ) : (
                  <div className="sd-group-hero__logo-placeholder"><Building size={36} /></div>
                )}
                <div>
                  <h1 className="sd-group-hero__title">{school.name}</h1>
                  <p className="sd-group-hero__sub">Group Network Management Dashboard</p>
                </div>
              </div>
              <button className="sd-btn sd-btn--primary" onClick={() => { setShowAddSubSchool(true); setCreatedSubSchoolId(''); }}>
                <Plus size={16} /> Register New School
              </button>
            </div>

            {/* Network Stats */}
            <div className="sd-stats-grid sd-stats-grid--4">
              <div className="sd-stat-card sd-stat-card--glow-purple">
                <div className="sd-stat-card__icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}><Building size={22} /></div>
                <div className="sd-stat-card__info">
                  <span className="sd-stat-card__value">{subSchools.length}</span>
                  <span className="sd-stat-card__label">Schools in Network</span>
                </div>
              </div>
              <div className="sd-stat-card sd-stat-card--glow-green">
                <div className="sd-stat-card__icon sd-stat-card__icon--green"><Users size={22} /></div>
                <div className="sd-stat-card__info">
                  <span className="sd-stat-card__value">{totalStudents.toLocaleString()}</span>
                  <span className="sd-stat-card__label">Total Students</span>
                </div>
              </div>
              <div className="sd-stat-card sd-stat-card--glow-amber">
                <div className="sd-stat-card__icon sd-stat-card__icon--amber"><GraduationCap size={22} /></div>
                <div className="sd-stat-card__info">
                  <span className="sd-stat-card__value">{totalTeachers.toLocaleString()}</span>
                  <span className="sd-stat-card__label">Total Teachers</span>
                </div>
              </div>
              <div className="sd-stat-card sd-stat-card--glow-blue">
                <div className="sd-stat-card__icon sd-stat-card__icon--blue"><Zap size={22} /></div>
                <div className="sd-stat-card__info">
                  <span className="sd-stat-card__value">{subSchools.length > 0 ? Math.round(totalStudents / subSchools.length) : 0}</span>
                  <span className="sd-stat-card__label">Avg Students / School</span>
                </div>
              </div>
            </div>

            {/* Network Info Bar */}
            <div className="sd-network-info">
              <div className="sd-network-info__item">
                <span className="sd-network-info__label">Group ID</span>
                <code className="sd-code">{school.group_id}</code>
                <button className="sd-copy-btn" title="Copy" onClick={() => navigator.clipboard.writeText(school.group_id || '')}><Copy size={12} /></button>
              </div>
              <div className="sd-network-info__item">
                <span className="sd-network-info__label">School Code</span>
                <code className="sd-code">{school.school_id}</code>
              </div>
              <div className="sd-network-info__item">
                <span className="sd-network-info__label">Dashboard</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#a5b4fc' }}>{getPublicSiteOrigin()}/school/{school.slug}</span>
              </div>
            </div>

            {/* Add Sub-School */}
            {showAddSubSchool && (
              <div className="sd-card sd-card--add-school">
                <h3 className="sd-card__title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Building size={18} /> Register New Sub-School
                </h3>
                {createdSubSchoolId ? (
                  <div className="sd-success-card">
                    <CheckCircle size={32} style={{ color: '#22c55e' }} />
                    <h4>School Successfully Registered</h4>
                    <p style={{ margin: '8px 0' }}>School ID: <strong className="sd-code" style={{ fontSize: '1rem' }}>{createdSubSchoolId}</strong></p>
                    <p className="sd-muted">This school is now part of the {school.name} network and ready for setup.</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={() => {
                        const newSchool = subSchools.find(s => s.school_id === createdSubSchoolId);
                        if (newSchool) {
                          setActiveSubSchool(newSchool);
                          setAcademicYears([]); setForms([]); setClasses([]); setSubjects([]);
                          setEcoTeachers([]); setEcoStudents([]);
                          goTo('forms');
                        }
                        setShowAddSubSchool(false); setCreatedSubSchoolId('');
                      }}>Setup This School</button>
                      <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => { setShowAddSubSchool(false); setCreatedSubSchoolId(''); }}>Done</button>
                    </div>
                  </div>
                ) : (
                  <div className="sd-add-school-form">
                    <div className="sd-form-grid">
                      <div className="sd-field">
                        <label className="sd-label">School Name *</label>
                        <input className="sd-input" placeholder="e.g. Herentals Masvingo Branch" value={newSubSchoolName} onChange={e => setNewSubSchoolName(e.target.value)} />
                      </div>
                      <div className="sd-field">
                        <label className="sd-label">Campus / Branch Name</label>
                        <input className="sd-input" placeholder="e.g. Masvingo Campus" value={newSubSchoolCampus} onChange={e => setNewSubSchoolCampus(e.target.value)} />
                      </div>
                      <div className="sd-field">
                        <label className="sd-label">City / Town</label>
                        <input className="sd-input" placeholder="e.g. Masvingo" value={newSubSchoolCity} onChange={e => setNewSubSchoolCity(e.target.value)} />
                      </div>
                      <div className="sd-field">
                        <label className="sd-label">Location / Address</label>
                        <input className="sd-input" placeholder="e.g. 123 Main Street" value={newSubSchoolLocation} onChange={e => setNewSubSchoolLocation(e.target.value)} />
                      </div>
                      <div className="sd-field">
                        <label className="sd-label">Contact Person</label>
                        <input className="sd-input" placeholder="e.g. Principal Name" value={newSubSchoolContact} onChange={e => setNewSubSchoolContact(e.target.value)} />
                      </div>
                      <div className="sd-field">
                        <label className="sd-label">Phone</label>
                        <input className="sd-input" placeholder="e.g. 0771234567" value={newSubSchoolPhone} onChange={e => setNewSubSchoolPhone(e.target.value)} />
                      </div>
                      <div className="sd-field">
                        <label className="sd-label">Email</label>
                        <input className="sd-input" placeholder="e.g. masvingo@herentals.co.zw" value={newSubSchoolEmail} onChange={e => setNewSubSchoolEmail(e.target.value)} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      <button className="sd-btn sd-btn--primary" onClick={async () => {
                        if (!newSubSchoolName.trim()) { setEcoMessage({ success: false, message: 'School name is required.' }); return; }
                        setEcoMessage(null);
                        try {
                          const res = await schoolEcosystemApi.createSubSchool({
                            name: newSubSchoolName.trim(),
                            group_id: school.group_id,
                            campus_name: newSubSchoolCampus.trim() || undefined,
                            city: newSubSchoolCity.trim() || undefined,
                            location: newSubSchoolLocation.trim() || undefined,
                            contact_person: newSubSchoolContact.trim() || undefined,
                            phone: newSubSchoolPhone.trim() || undefined,
                            email: newSubSchoolEmail.trim() || undefined,
                          });
                          if (res.sub_school) {
                            setCreatedSubSchoolId(res.sub_school.school_id || res.school_id || '');
                            setNewSubSchoolName(''); setNewSubSchoolCampus(''); setNewSubSchoolCity('');
                            setNewSubSchoolLocation(''); setNewSubSchoolContact(''); setNewSubSchoolPhone(''); setNewSubSchoolEmail('');
                            loadSubSchools();
                          } else {
                            setEcoMessage({ success: false, message: res.error || 'Failed to create school' });
                          }
                        } catch { setEcoMessage({ success: false, message: 'Failed to create sub-school' }); }
                      }}><Plus size={14} /> Register School</button>
                      <button className="sd-btn sd-btn--ghost" onClick={() => setShowAddSubSchool(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Search & Filter Bar */}
            <div className="sd-card sd-schools-toolbar">
              <div className="sd-schools-toolbar__left">
                <div className="sd-search-wrap sd-search-wrap--wide">
                  <Search size={16} />
                  <input className="sd-search-input" placeholder="Search schools by name, city, or ID..." value={subSchoolSearch} onChange={e => setSubSchoolSearch(e.target.value)} />
                  {subSchoolSearch && (
                    <button className="sd-search-clear" onClick={() => setSubSchoolSearch('')}><X size={14} /></button>
                  )}
                </div>
                <span className="sd-schools-toolbar__count">
                  {filteredSchools.length} of {subSchools.length} school{subSchools.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="sd-schools-toolbar__right">
                <select className="sd-input sd-input--sm" value={subSchoolSort} onChange={e => setSubSchoolSort(e.target.value as typeof subSchoolSort)}>
                  <option value="name">Sort: Name</option>
                  <option value="students">Sort: Most Students</option>
                  <option value="teachers">Sort: Most Teachers</option>
                  <option value="city">Sort: City</option>
                </select>
                <div className="sd-view-toggle">
                  <button className={`sd-view-toggle__btn ${subSchoolView === 'grid' ? 'sd-view-toggle__btn--active' : ''}`} onClick={() => setSubSchoolView('grid')} title="Grid view">
                    <Layers size={15} />
                  </button>
                  <button className={`sd-view-toggle__btn ${subSchoolView === 'list' ? 'sd-view-toggle__btn--active' : ''}`} onClick={() => setSubSchoolView('list')} title="List view">
                    <ClipboardList size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Schools Grid / List */}
            {subSchoolsLoading ? (
              <div className="sd-loader"><Loader2 size={28} className="sd-spin" /></div>
            ) : filteredSchools.length === 0 ? (
              <div className="sd-empty-state">
                <Building size={48} />
                <h3>{subSchools.length === 0 ? 'No Schools Registered Yet' : 'No Results Found'}</h3>
                <p>{subSchools.length === 0 ? 'Register your first school to start managing your network.' : `No schools match "${subSchoolSearch}". Try a different search term.`}</p>
                {subSchools.length === 0 && (
                  <button className="sd-btn sd-btn--primary" onClick={() => { setShowAddSubSchool(true); setCreatedSubSchoolId(''); }}>
                    <Plus size={16} /> Register First School
                  </button>
                )}
              </div>
            ) : subSchoolView === 'grid' ? (
              <div className="sd-schools-grid">
                {filteredSchools.map(ss => (
                  <div key={ss.school_id} className="sd-school-card">
                    <div className="sd-school-card__header">
                      <div className="sd-school-card__icon">
                        <Building size={20} />
                      </div>
                      <div className="sd-school-card__title-area">
                        <h4 className="sd-school-card__name">{ss.name}</h4>
                        <code className="sd-code sd-code--sm">{ss.school_id}</code>
                      </div>
                    </div>
                    {(ss.city || ss.location || ss.campus_name) && (
                      <div className="sd-school-card__location">
                        <MapPin size={13} />
                        <span>{[ss.campus_name, ss.city, ss.location].filter(Boolean).join(' · ')}</span>
                      </div>
                    )}
                    <div className="sd-school-card__stats">
                      <div className="sd-school-card__stat">
                        <Users size={14} />
                        <span className="sd-school-card__stat-value">{(ss.student_count || 0).toLocaleString()}</span>
                        <span className="sd-school-card__stat-label">Students</span>
                      </div>
                      <div className="sd-school-card__stat">
                        <GraduationCap size={14} />
                        <span className="sd-school-card__stat-value">{(ss.teacher_count || 0).toLocaleString()}</span>
                        <span className="sd-school-card__stat-label">Teachers</span>
                      </div>
                    </div>
                    <div className="sd-school-card__actions">
                      <button className="sd-btn sd-btn--primary sd-btn--sm sd-btn--full" onClick={() => {
                        setActiveSubSchool(ss);
                        setAcademicYears([]); setForms([]); setClasses([]); setSubjects([]);
                        setEcoTeachers([]); setEcoStudents([]);
                        goTo('forms');
                      }}>
                        <Eye size={14} /> View & Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sd-card">
                <div className="sd-table-container">
                  <table className="sd-table sd-table--schools">
                    <thead>
                      <tr>
                        <th>School</th>
                        <th>School ID</th>
                        <th>City</th>
                        <th>Students</th>
                        <th>Teachers</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchools.map(ss => (
                        <tr key={ss.school_id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="sd-school-card__icon sd-school-card__icon--sm"><Building size={14} /></div>
                              <div>
                                <strong>{ss.name}</strong>
                                {ss.campus_name && <span style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{ss.campus_name}</span>}
                              </div>
                            </div>
                          </td>
                          <td><code className="sd-code sd-code--sm">{ss.school_id}</code></td>
                          <td>{ss.city || '—'}</td>
                          <td><span style={{ color: '#22c55e', fontWeight: 600 }}>{(ss.student_count || 0).toLocaleString()}</span></td>
                          <td><span style={{ color: '#f59e0b', fontWeight: 600 }}>{(ss.teacher_count || 0).toLocaleString()}</span></td>
                          <td>
                            <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={() => {
                              setActiveSubSchool(ss);
                              setAcademicYears([]); setForms([]); setClasses([]); setSubjects([]);
                              setEcoTeachers([]); setEcoStudents([]);
                              goTo('forms');
                            }}>
                              <Eye size={13} /> Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {ecoMessage && (
              <div className={`sd-pay-result ${ecoMessage.success ? 'sd-pay-result--success' : 'sd-pay-result--error'}`} style={{ margin: '12px 0' }}>
                {ecoMessage.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {ecoMessage.message}
              </div>
            )}
          </div>
          );
        })()}

        {/* Active Sub-School Context Bar */}
        {activeSubSchool && ['forms', 'teachers', 'ecosystem_students', 'subjects'].includes(activeSection) && (
          <div className="sd-context-bar">
            <div className="sd-context-bar__top">
              <div className="sd-context-bar__info">
                <div className="sd-context-bar__icon"><Building size={18} /></div>
                <div>
                  <span className="sd-context-bar__name">{activeSubSchool.name}</span>
                  <div className="sd-context-bar__meta">
                    <code className="sd-code sd-code--sm">{activeSubSchool.school_id}</code>
                    {activeSubSchool.city && <span className="sd-context-bar__city"><MapPin size={11} /> {activeSubSchool.city}</span>}
                  </div>
                </div>
              </div>
              <div className="sd-context-bar__right">
                <div className="sd-context-bar__stats">
                  <span><Users size={13} /> {(activeSubSchool.student_count || ecoStudents.length).toLocaleString()} students</span>
                  <span><GraduationCap size={13} /> {(activeSubSchool.teacher_count || ecoTeachers.length).toLocaleString()} teachers</span>
                </div>
                <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => {
                  setActiveSubSchool(null);
                  setAcademicYears([]); setForms([]); setClasses([]); setSubjects([]);
                  setEcoTeachers([]); setEcoStudents([]);
                  goTo('sub_schools');
                }}>
                  <ChevronLeft size={14} /> Back to Network
                </button>
              </div>
            </div>
            <div className="sd-context-bar__nav">
              {([
                { id: 'forms' as const, label: 'Forms & Classes', icon: Layers },
                { id: 'subjects' as const, label: 'Subjects', icon: BookOpen },
                { id: 'teachers' as const, label: 'Teachers', icon: GraduationCap },
                { id: 'ecosystem_students' as const, label: 'Students', icon: UserPlus },
              ]).map(tab => (
                <button key={tab.id} className={`sd-context-bar__tab ${activeSection === tab.id ? 'sd-context-bar__tab--active' : ''}`} onClick={() => goTo(tab.id)}>
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>
            {/* Teacher Login URL for this sub-school */}
            <div className="sd-context-bar__url">
              <span>Teacher Portal:</span>
              <code>{getPublicSiteOrigin()}/school/{activeSubSchool.school_id}/teacher-login</code>
              <button className="sd-copy-btn" onClick={() => navigator.clipboard.writeText(`${getPublicSiteOrigin()}/school/${activeSubSchool.school_id}/teacher-login`)}><Copy size={12} /></button>
            </div>
          </div>
        )}

        {/* ─── FORMS & CLASSES ─── */}
        {activeSection === 'forms' && (
          <div className="sd-section">
            <div className="sd-section-header">
              <h2 className="sd-section-header__title">Forms & Classes</h2>
              <p className="sd-section-header__sub">Manage academic years, forms, and class groups for your school</p>
            </div>

            {ecoLoading ? (
              <div className="sd-loader"><Loader2 size={28} className="sd-spin" /></div>
            ) : (
              <>
                {/* Academic Years */}
                <div className="sd-card">
                  <div className="sd-card__header-row">
                    <h3 className="sd-card__title">Academic Years</h3>
                    <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={() => setShowAddYear(true)}><Plus size={14} /> Add Year</button>
                  </div>
                  {showAddYear && (
                    <div className="sd-inline-form">
                      <input className="sd-input" placeholder="e.g. 2026 Academic Year" value={newYearLabel} onChange={e => setNewYearLabel(e.target.value)} />
                      <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={async () => {
                        if (!token || !school || !newYearLabel.trim()) return;
                        setEcoMessage(null);
                        try {
                          const res = await schoolEcosystemApi.createAcademicYear(token, targetSchoolId, { year_label: newYearLabel.trim() });
                          if (res.academic_year) {
                            setAcademicYears(prev => [...prev, res.academic_year]);
                            if (!selectedYearId) setSelectedYearId(res.academic_year.id);
                            setNewYearLabel('');
                            setShowAddYear(false);
                            setEcoMessage({ success: true, message: 'Academic year created.' });
                          }
                        } catch { setEcoMessage({ success: false, message: 'Failed to create academic year' }); }
                      }}>Save</button>
                      <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => { setShowAddYear(false); setNewYearLabel(''); }}>Cancel</button>
                    </div>
                  )}
                  <div className="sd-tag-list">
                    {academicYears.map(y => (
                      <button key={y.id} className={`sd-tag ${selectedYearId === y.id ? 'sd-tag--active' : ''}`} onClick={() => { setSelectedYearId(y.id); loadFormsAndClasses(); }}>
                        {y.year_label} {y.is_active && <span className="sd-tag__badge">Active</span>}
                      </button>
                    ))}
                    {academicYears.length === 0 && <p className="sd-muted">No academic years yet. Add one to get started.</p>}
                  </div>
                </div>

                {/* Forms */}
                {selectedYearId && (
                  <div className="sd-card">
                    <div className="sd-card__header-row">
                      <h3 className="sd-card__title">Forms (Grade Levels)</h3>
                      <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={() => setShowAddForm(true)}><Plus size={14} /> Add Form</button>
                    </div>
                    {showAddForm && (
                      <div className="sd-inline-form">
                        <select className="sd-input" value={newFormNumber} onChange={e => setNewFormNumber(parseInt(e.target.value))}>
                          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>Form {n}</option>)}
                        </select>
                        <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={async () => {
                          if (!token || !school || !selectedYearId) return;
                          setEcoMessage(null);
                          try {
                            const res = await schoolEcosystemApi.createForm(token, targetSchoolId, { form_number: newFormNumber, academic_year_id: selectedYearId });
                            if (res.form) {
                              setForms(prev => [...prev, res.form]);
                              setShowAddForm(false);
                              setEcoMessage({ success: true, message: `Form ${newFormNumber} created.` });
                            } else {
                              setEcoMessage({ success: false, message: res.error || 'Failed' });
                            }
                          } catch { setEcoMessage({ success: false, message: 'Failed to create form' }); }
                        }}>Save</button>
                        <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => setShowAddForm(false)}>Cancel</button>
                      </div>
                    )}
                    {forms.length === 0 ? (
                      <p className="sd-muted">No forms created yet for this academic year.</p>
                    ) : (
                      <div className="sd-forms-grid">
                        {forms.map(f => {
                          const formClasses = classes.filter(c => c.form_id === f.id);
                          return (
                            <div key={f.id} className="sd-form-card">
                              <div className="sd-form-card__header">
                                <Layers size={18} />
                                <h4>Form {f.form_number}</h4>
                                <span className="sd-badge sd-badge--blue">{formClasses.length} classes</span>
                              </div>
                              <div className="sd-form-card__classes">
                                {formClasses.map(c => (
                                  <div key={c.id} className="sd-class-chip">
                                    <span className="sd-class-chip__name">{c.class_name}</span>
                                    <span className="sd-class-chip__cap">cap: {c.capacity || '—'}</span>
                                  </div>
                                ))}
                                {formClasses.length === 0 && <p className="sd-muted" style={{ fontSize: 12 }}>No classes yet</p>}
                              </div>
                              <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => { setSelectedFormIdForClass(f.id); setShowAddClass(true); }}>
                                <Plus size={14} /> Add Class
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Add Class Modal */}
                {showAddClass && selectedFormIdForClass && (
                  <div className="sd-card sd-card--highlight">
                    <h3 className="sd-card__title">Add Class to Form {forms.find(f => f.id === selectedFormIdForClass)?.form_number}</h3>
                    <div className="sd-inline-form">
                      <input className="sd-input" placeholder="Class name (e.g. Red, Blue, Green)" value={newClassName} onChange={e => setNewClassName(e.target.value)} />
                      <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={async () => {
                        if (!token || !school || !selectedFormIdForClass || !newClassName.trim()) return;
                        setEcoMessage(null);
                        try {
                          const res = await schoolEcosystemApi.createClass(token, targetSchoolId, { form_id: selectedFormIdForClass, class_name: newClassName.trim() });
                          if (res.school_class) {
                            setClasses(prev => [...prev, res.school_class]);
                            setNewClassName('');
                            setShowAddClass(false);
                            setEcoMessage({ success: true, message: `Class "${newClassName.trim()}" created.` });
                          } else {
                            setEcoMessage({ success: false, message: res.error || 'Failed' });
                          }
                        } catch { setEcoMessage({ success: false, message: 'Failed to create class' }); }
                      }}>Save</button>
                      <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => { setShowAddClass(false); setNewClassName(''); }}>Cancel</button>
                    </div>
                  </div>
                )}

                {ecoMessage && (
                  <div className={`sd-pay-result ${ecoMessage.success ? 'sd-pay-result--success' : 'sd-pay-result--error'}`} style={{ margin: '12px 0' }}>
                    {ecoMessage.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {ecoMessage.message}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── SUBJECTS ─── */}
        {activeSection === 'subjects' && (
          <div className="sd-section">
            <div className="sd-section-header">
              <h2 className="sd-section-header__title">Subjects</h2>
              <p className="sd-section-header__sub">Define subjects offered per form level and assign teachers</p>
            </div>
            {ecoLoading ? (
              <div className="sd-loader"><Loader2 size={28} className="sd-spin" /></div>
            ) : (
              <>
                <div className="sd-card">
                  <div className="sd-card__header-row">
                    <h3 className="sd-card__title">Subject List</h3>
                    <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={() => setShowAddSubject(true)}><Plus size={14} /> Add Subject</button>
                  </div>
                  {showAddSubject && (
                    <div className="sd-inline-form" style={{ flexWrap: 'wrap' }}>
                      <select className="sd-input" value={selectedFormIdForSubject || ''} onChange={e => setSelectedFormIdForSubject(parseInt(e.target.value) || null)}>
                        <option value="">Select Form</option>
                        {forms.map(f => <option key={f.id} value={f.id}>Form {f.form_number}</option>)}
                      </select>
                      <input className="sd-input" placeholder="Subject name" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} />
                      <input className="sd-input" placeholder="ZIMSEC Code (e.g. 4008)" value={newSubjectCode} onChange={e => setNewSubjectCode(e.target.value)} style={{ width: 120 }} />
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 13 }}>
                        <input type="checkbox" checked={newSubjectCompulsory} onChange={e => setNewSubjectCompulsory(e.target.checked)} /> Compulsory
                      </label>
                      <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={async () => {
                        if (!token || !school || !selectedFormIdForSubject || !newSubjectName.trim()) return;
                        setEcoMessage(null);
                        try {
                          const res = await schoolEcosystemApi.createSubject(token, targetSchoolId, {
                            form_id: selectedFormIdForSubject,
                            name: newSubjectName.trim(),
                            zimsec_code: newSubjectCode.trim() || undefined,
                            is_compulsory: newSubjectCompulsory,
                          });
                          if (res.subject) {
                            setSubjects(prev => [...prev, res.subject]);
                            setNewSubjectName(''); setNewSubjectCode(''); setNewSubjectCompulsory(false);
                            setShowAddSubject(false);
                            setEcoMessage({ success: true, message: `Subject "${newSubjectName.trim()}" created.` });
                          } else {
                            setEcoMessage({ success: false, message: res.error || 'Failed' });
                          }
                        } catch { setEcoMessage({ success: false, message: 'Failed to create subject' }); }
                      }}>Save</button>
                      <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => { setShowAddSubject(false); setNewSubjectName(''); setNewSubjectCode(''); }}>Cancel</button>
                    </div>
                  )}

                  {subjects.length === 0 ? (
                    <p className="sd-muted">No subjects created yet. Add forms first, then add subjects.</p>
                  ) : (
                    <div className="sd-table-container">
                      <table className="sd-table">
                        <thead>
                          <tr><th>Subject</th><th>ZIMSEC Code</th><th>Form</th><th>Compulsory</th></tr>
                        </thead>
                        <tbody>
                          {subjects.map(s => (
                            <tr key={s.id}>
                              <td><strong>{s.name}</strong></td>
                              <td>{s.zimsec_code || '—'}</td>
                              <td>Form {forms.find(f => f.id === s.form_id)?.form_number || '?'}</td>
                              <td>{s.is_compulsory ? <span className="sd-badge sd-badge--green">Yes</span> : <span className="sd-badge sd-badge--grey">No</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Assign Teacher to Subject+Class */}
                <div className="sd-card">
                  <div className="sd-card__header-row">
                    <h3 className="sd-card__title">Assign Teacher to Subject & Class</h3>
                    <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={() => setShowAssign(true)}><Link2 size={14} /> Assign</button>
                  </div>
                  {showAssign && (
                    <div className="sd-inline-form" style={{ flexWrap: 'wrap' }}>
                      <select className="sd-input" value={assignClassId || ''} onChange={e => setAssignClassId(parseInt(e.target.value) || null)}>
                        <option value="">Select Class</option>
                        {classes.map(c => {
                          const f = forms.find(ff => ff.id === c.form_id);
                          return <option key={c.id} value={c.id}>Form {f?.form_number || '?'} — {c.class_name}</option>;
                        })}
                      </select>
                      <select className="sd-input" value={assignSubjectId || ''} onChange={e => setAssignSubjectId(parseInt(e.target.value) || null)}>
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name} (Form {forms.find(f => f.id === s.form_id)?.form_number || '?'})</option>)}
                      </select>
                      <select className="sd-input" value={assignTeacherId || ''} onChange={e => setAssignTeacherId(parseInt(e.target.value) || null)}>
                        <option value="">Select Teacher</option>
                        {ecoTeachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
                      </select>
                      <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={async () => {
                        if (!token || !school || !assignClassId || !assignSubjectId || !assignTeacherId || !selectedYearId) return;
                        setEcoMessage(null);
                        try {
                          const res = await schoolEcosystemApi.assignTeacher(token, targetSchoolId, {
                            class_id: assignClassId, subject_id: assignSubjectId, teacher_id: assignTeacherId, academic_year_id: selectedYearId,
                          });
                          if (res.class_subject) {
                            setEcoMessage({ success: true, message: 'Teacher assigned to class-subject. AI Classroom created.' });
                            setShowAssign(false);
                          } else {
                            setEcoMessage({ success: false, message: res.error || 'Failed to assign.' });
                          }
                        } catch { setEcoMessage({ success: false, message: 'Assignment failed' }); }
                      }}>Assign</button>
                      <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => setShowAssign(false)}>Cancel</button>
                    </div>
                  )}
                </div>

                {ecoMessage && (
                  <div className={`sd-pay-result ${ecoMessage.success ? 'sd-pay-result--success' : 'sd-pay-result--error'}`} style={{ margin: '12px 0' }}>
                    {ecoMessage.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {ecoMessage.message}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── TEACHERS ─── */}
        {activeSection === 'teachers' && (
          <div className="sd-section">
            <div className="sd-section-header">
              <h2 className="sd-section-header__title">Teachers</h2>
              <p className="sd-section-header__sub">Register and manage teachers at your school</p>
            </div>
            {ecoLoading ? (
              <div className="sd-loader"><Loader2 size={28} className="sd-spin" /></div>
            ) : (
              <>
                <div className="sd-card">
                  <div className="sd-card__header-row">
                    <h3 className="sd-card__title">Registered Teachers ({ecoTeachers.length})</h3>
                    <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={() => { setShowAddTeacher(true); setCreatedTeacherCode(''); }}><Plus size={14} /> Register Teacher</button>
                  </div>

                  {showAddTeacher && (
                    <div className="sd-teacher-form">
                      {createdTeacherCode ? (
                        <div className="sd-success-card">
                          <CheckCircle size={28} style={{ color: '#22c55e' }} />
                          <h4>Teacher Registered Successfully</h4>
                          <p>Login Code: <strong className="sd-code">{createdTeacherCode}</strong></p>
                          <p className="sd-muted">Share this code with the teacher. They will use it along with the School ID to log in.</p>
                          <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={() => { setShowAddTeacher(false); setCreatedTeacherCode(''); }}>Done</button>
                        </div>
                      ) : (
                        <div className="sd-inline-form" style={{ flexWrap: 'wrap', gap: 10 }}>
                          <input className="sd-input" placeholder="First Name" value={newTeacherFirst} onChange={e => setNewTeacherFirst(e.target.value)} />
                          <input className="sd-input" placeholder="Last Name" value={newTeacherLast} onChange={e => setNewTeacherLast(e.target.value)} />
                          <input className="sd-input" placeholder="Email (optional)" value={newTeacherEmail} onChange={e => setNewTeacherEmail(e.target.value)} />
                          <input className="sd-input" placeholder="Phone (optional)" value={newTeacherPhone} onChange={e => setNewTeacherPhone(e.target.value)} />
                          <input className="sd-input" placeholder="Specialisation (e.g. Mathematics)" value={newTeacherSpec} onChange={e => setNewTeacherSpec(e.target.value)} />
                          <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={async () => {
                            if (!token || !school || !newTeacherFirst.trim() || !newTeacherLast.trim()) return;
                            setEcoMessage(null);
                            try {
                              const res = await schoolEcosystemApi.registerTeacher(token, targetSchoolId, {
                                first_name: newTeacherFirst.trim(),
                                last_name: newTeacherLast.trim(),
                                email: newTeacherEmail.trim() || undefined,
                                phone: newTeacherPhone.trim() || undefined,
                                specialisation: newTeacherSpec.trim() || undefined,
                              });
                              if (res.teacher) {
                                setEcoTeachers(prev => [...prev, res.teacher]);
                                setCreatedTeacherCode(res.teacher.login_code);
                                setNewTeacherFirst(''); setNewTeacherLast(''); setNewTeacherEmail(''); setNewTeacherPhone(''); setNewTeacherSpec('');
                              } else {
                                setEcoMessage({ success: false, message: res.error || 'Failed' });
                              }
                            } catch { setEcoMessage({ success: false, message: 'Failed to register teacher' }); }
                          }}>Register</button>
                          <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => setShowAddTeacher(false)}>Cancel</button>
                        </div>
                      )}
                    </div>
                  )}

                  {ecoTeachers.length === 0 ? (
                    <p className="sd-muted">No teachers registered yet.</p>
                  ) : (
                    <div className="sd-table-container">
                      <table className="sd-table">
                        <thead>
                          <tr><th>Name</th><th>Specialisation</th><th>Login Code</th><th>Email</th><th>Phone</th></tr>
                        </thead>
                        <tbody>
                          {ecoTeachers.map(t => (
                            <tr key={t.id}>
                              <td><strong>{t.first_name} {t.last_name}</strong></td>
                              <td>{t.specialisation || '—'}</td>
                              <td><code className="sd-code">{t.login_code}</code></td>
                              <td>{t.email || '—'}</td>
                              <td>{t.phone || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {ecoMessage && (
                  <div className={`sd-pay-result ${ecoMessage.success ? 'sd-pay-result--success' : 'sd-pay-result--error'}`} style={{ margin: '12px 0' }}>
                    {ecoMessage.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {ecoMessage.message}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── ECOSYSTEM STUDENTS (v2) ─── */}
        {activeSection === 'ecosystem_students' && (
          <div className="sd-section">
            <div className="sd-section-header">
              <h2 className="sd-section-header__title">Student Registration (v2)</h2>
              <p className="sd-section-header__sub">Enroll students with full details and assign them to classes</p>
            </div>
            {ecoLoading ? (
              <div className="sd-loader"><Loader2 size={28} className="sd-spin" /></div>
            ) : (
              <>
                <div className="sd-card">
                  <div className="sd-card__header-row">
                    <h3 className="sd-card__title">Enrolled Students ({ecoStudents.length})</h3>
                    <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={() => { setShowAddStudent(true); setCreatedStudentCode(''); }}><Plus size={14} /> Enroll Student</button>
                  </div>

                  {showAddStudent && (
                    <div className="sd-teacher-form">
                      {createdStudentCode ? (
                        <div className="sd-success-card">
                          <CheckCircle size={28} style={{ color: '#22c55e' }} />
                          <h4>Student Enrolled Successfully</h4>
                          <p>Student Code: <strong className="sd-code">{createdStudentCode}</strong></p>
                          <p className="sd-muted">This code is the student's unique identifier within the school.</p>
                          <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={() => { setShowAddStudent(false); setCreatedStudentCode(''); }}>Done</button>
                        </div>
                      ) : (
                        <div className="sd-inline-form" style={{ flexWrap: 'wrap', gap: 10 }}>
                          <input className="sd-input" placeholder="First Name *" value={newStudentFirst} onChange={e => setNewStudentFirst(e.target.value)} />
                          <input className="sd-input" placeholder="Last Name *" value={newStudentLast} onChange={e => setNewStudentLast(e.target.value)} />
                          <input className="sd-input" type="date" placeholder="Date of Birth" value={newStudentDob} onChange={e => setNewStudentDob(e.target.value)} style={{ minWidth: 160 }} />
                          <select className="sd-input" value={newStudentGender} onChange={e => setNewStudentGender(e.target.value)}>
                            <option value="">Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          <select className="sd-input" value={newStudentClassId || ''} onChange={e => setNewStudentClassId(parseInt(e.target.value) || null)}>
                            <option value="">Assign to Class *</option>
                            {classes.map(c => {
                              const f = forms.find(ff => ff.id === c.form_id);
                              return <option key={c.id} value={c.id}>Form {f?.form_number || '?'} — {c.class_name}</option>;
                            })}
                          </select>
                          <input className="sd-input" placeholder="Guardian Name" value={newStudentGuardian} onChange={e => setNewStudentGuardian(e.target.value)} />
                          <input className="sd-input" placeholder="Guardian Phone" value={newStudentGuardianPhone} onChange={e => setNewStudentGuardianPhone(e.target.value)} />
                          <button className="sd-btn sd-btn--primary sd-btn--sm" onClick={async () => {
                            if (!token || !school || !newStudentFirst.trim() || !newStudentLast.trim() || !newStudentClassId) {
                              setEcoMessage({ success: false, message: 'First name, last name, and class are required.' });
                              return;
                            }
                            setEcoMessage(null);
                            try {
                              const res = await schoolEcosystemApi.registerStudent(token, targetSchoolId, {
                                first_name: newStudentFirst.trim(),
                                last_name: newStudentLast.trim(),
                                date_of_birth: newStudentDob || undefined,
                                gender: newStudentGender || undefined,
                                class_id: newStudentClassId,
                                guardian_name: newStudentGuardian.trim() || undefined,
                                guardian_phone: newStudentGuardianPhone.trim() || undefined,
                              });
                              if (res.student) {
                                setEcoStudents(prev => [...prev, res.student]);
                                setCreatedStudentCode(res.student.student_code);
                                setNewStudentFirst(''); setNewStudentLast(''); setNewStudentDob(''); setNewStudentGender('');
                                setNewStudentClassId(null); setNewStudentGuardian(''); setNewStudentGuardianPhone('');
                              } else {
                                setEcoMessage({ success: false, message: res.error || 'Failed' });
                              }
                            } catch { setEcoMessage({ success: false, message: 'Failed to enroll student' }); }
                          }}>Enroll</button>
                          <button className="sd-btn sd-btn--ghost sd-btn--sm" onClick={() => setShowAddStudent(false)}>Cancel</button>
                        </div>
                      )}
                    </div>
                  )}

                  {ecoStudents.length === 0 ? (
                    <p className="sd-muted">No students enrolled yet. Create forms & classes first, then enroll students.</p>
                  ) : (
                    <div className="sd-table-container">
                      <table className="sd-table">
                        <thead>
                          <tr><th>Name</th><th>Student Code</th><th>Class</th><th>Gender</th><th>DOB</th><th>Guardian</th></tr>
                        </thead>
                        <tbody>
                          {ecoStudents.map(s => {
                            const cls = classes.find(c => c.id === s.class_id);
                            const frm = cls ? forms.find(f => f.id === cls.form_id) : null;
                            return (
                              <tr key={s.id}>
                                <td><strong>{s.first_name} {s.last_name}</strong></td>
                                <td><code className="sd-code">{s.student_code}</code></td>
                                <td>{frm ? `Form ${frm.form_number}` : ''} {cls ? `— ${cls.class_name}` : '—'}</td>
                                <td style={{ textTransform: 'capitalize' }}>{s.gender || '—'}</td>
                                <td>{s.date_of_birth ? formatDate(s.date_of_birth) : '—'}</td>
                                <td>{s.guardian_name || '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {ecoMessage && (
                  <div className={`sd-pay-result ${ecoMessage.success ? 'sd-pay-result--success' : 'sd-pay-result--error'}`} style={{ margin: '12px 0' }}>
                    {ecoMessage.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {ecoMessage.message}
                  </div>
                )}
              </>
            )}
          </div>
        )}
    </SchoolDashboardLayout>
    {token && (
      <HerentalsAIPanel
        open={aiPanelOpen}
        onClose={() => setAiPanelOpen(false)}
        token={token}
        pageContext={sectionLabel(activeSection)}
      />
    )}
    </>
  );
}
