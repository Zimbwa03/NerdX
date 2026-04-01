import { AnimatePresence, motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Bell,
  BookOpen,
  Calendar,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Download,
  FileBarChart2,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  LogOut,
  Megaphone,
  Plus,
  Search,
  Settings,
  Sparkles,
  UserCircle2,
  Users,
  WandSparkles,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import './teacher-dashboard.css';

export interface TeacherDashboardStudent {
  id: number;
  name: string;
  studentCode: string;
  avatarInitial: string;
  mastery: number;
  sessions: number;
  status: 'active' | 'idle';
  lastSeenLabel: string;
  badge: string;
}

export interface TeacherDashboardClass {
  id: number;
  classroomId: number | null;
  subject: string;
  formName: string;
  classroomName: string;
  zimsecCode: string;
  studentCount: number;
  averageMastery: number | null;
  weeklySessions: number;
  activity7d: Array<{ day: string; value: number }>;
  students: TeacherDashboardStudent[];
}

export interface TeacherDashboardActivityPoint {
  label: string;
  value: number;
}

export interface TeacherDashboardBucket {
  label: string;
  value: number;
  color: string;
}

export interface TeacherDashboardSubjectRow {
  topic: string;
  students: number;
  avgScore: number | null;
  trend: 'up' | 'down' | 'flat';
}

export interface TeacherDashboardScheduleDay {
  key: string;
  label: string;
  date: number;
  isToday: boolean;
  hasClass: boolean;
}

export interface TeacherDashboardDueItem {
  id: string;
  title: string;
  subtitle: string;
  dueLabel: string;
  status: 'overdue' | 'today' | 'upcoming';
}

export interface TeacherDashboardReviewItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface TeacherDashboardFeedItem {
  id: string;
  studentName: string;
  detail: string;
  timeLabel: string;
  initial: string;
}

export interface TeacherDashboardQuickAction {
  key: string;
  title: string;
  description: string;
  cta: string;
  colorClass: string;
  icon: typeof Plus;
  onClick: () => void;
}

export interface TeacherDashboardShellProps {
  teacherName: string;
  teacherShortName: string;
  teacherRole: string;
  schoolName: string;
  subjectName: string;
  notificationCount: number;
  myClasses: TeacherDashboardClass[];
  totalStudents: number;
  activeStudentsToday: number;
  pendingReviewsCount: number;
  averageMastery: number | null;
  activitySeries: TeacherDashboardActivityPoint[];
  masteryBuckets: TeacherDashboardBucket[];
  subjectRows: TeacherDashboardSubjectRow[];
  dueItems: TeacherDashboardDueItem[];
  reviewItems: TeacherDashboardReviewItem[];
  feedItems: TeacherDashboardFeedItem[];
  scheduleDays: TeacherDashboardScheduleDay[];
  nextClassLabel: string;
  onOpenClassroom: (classroomId: number | null) => void;
  onNavigateToAccount: () => void;
  onChangeSchool: () => void;
  onLogout: () => void;
  onExportReport: () => void;
}

interface TeacherTopbarProps {
  teacherName: string;
  schoolName: string;
  subjectName: string;
  notificationCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigateToAccount: () => void;
  onChangeSchool: () => void;
  onLogout: () => void;
}

interface TeacherSidebarProps {
  teacherName: string;
  teacherRole: string;
  schoolName: string;
  pendingReviewsCount: number;
  onJumpTo: (id: string) => void;
  onOpenCreateTest: () => void;
  onOpenAnnouncement: () => void;
  onOpenSettings: () => void;
}

interface WelcomeStripProps {
  teacherShortName: string;
}

interface TeacherKPIRowProps {
  classCount: number;
  activeStudentsToday: number;
  pendingReviewsCount: number;
  averageMastery: number | null;
  activitySeries: TeacherDashboardActivityPoint[];
}

interface ClassCardProps {
  item: TeacherDashboardClass;
  onOpenClassroom: (classroomId: number | null) => void;
}

interface StudentRowInClassProps {
  student: TeacherDashboardStudent;
}

interface PerformanceChartsSectionProps {
  activitySeries: TeacherDashboardActivityPoint[];
  masteryBuckets: TeacherDashboardBucket[];
  studentCount: number;
}

interface SubjectMasteryTableProps {
  rows: TeacherDashboardSubjectRow[];
  onExportReport: () => void;
}

interface QuickActionsGridProps {
  actions: TeacherDashboardQuickAction[];
}

interface RightPanelProps {
  dueItems: TeacherDashboardDueItem[];
  reviewItems: TeacherDashboardReviewItem[];
  feedItems: TeacherDashboardFeedItem[];
  scheduleDays: TeacherDashboardScheduleDay[];
  nextClassLabel: string;
}

interface ActivityFeedItemProps {
  item: TeacherDashboardFeedItem;
}

type SortKey = 'topic' | 'students' | 'avgScore' | 'trend';

const SECTION_MOTION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - (1 - progress) * (1 - progress))));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function formatMastery(value: number | null) {
  return value === null ? '---%' : `${Math.round(value)}%`;
}

function heightClass(units: number) {
  if (units <= 1) return 'h-2';
  if (units <= 2) return 'h-3';
  if (units <= 3) return 'h-4';
  if (units <= 4) return 'h-5';
  if (units <= 5) return 'h-6';
  if (units <= 6) return 'h-7';
  if (units <= 7) return 'h-8';
  if (units <= 8) return 'h-9';
  return 'h-10';
}

function TeacherAvatar({ name, large = false }: { name: string; large?: boolean }) {
  const sizeClass = large ? 'h-12 w-12 text-base' : 'h-8 w-8 text-xs';
  return (
    <div className={`rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-sky-500 p-[2px] ${large ? 'teacher-glow-brand' : ''}`}>
      <div className={`flex ${sizeClass} items-center justify-center rounded-full bg-[var(--bg-surface)] font-semibold uppercase tracking-[0.12em] text-[var(--text-primary)]`}>
        {name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join('')}
      </div>
    </div>
  );
}

function StatValue({ value }: { value: number }) {
  const count = useCountUp(value);
  return <span>{count.toLocaleString('en-US')}</span>;
}

export function TeacherDashboardShell({
  teacherName,
  teacherShortName,
  teacherRole,
  schoolName,
  subjectName,
  notificationCount,
  myClasses,
  totalStudents,
  activeStudentsToday,
  pendingReviewsCount,
  averageMastery,
  activitySeries,
  masteryBuckets,
  subjectRows,
  dueItems,
  reviewItems,
  feedItems,
  scheduleDays,
  nextClassLabel,
  onOpenClassroom,
  onNavigateToAccount,
  onChangeSchool,
  onLogout,
  onExportReport,
}: TeacherDashboardShellProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return myClasses;
    }
    return myClasses.filter((item) => {
      const classMatch = [item.subject, item.formName, item.classroomName, item.zimsecCode].join(' ').toLowerCase().includes(query);
      const studentMatch = item.students.some((student) => `${student.name} ${student.studentCode}`.toLowerCase().includes(query));
      return classMatch || studentMatch;
    });
  }, [myClasses, searchTerm]);

  const filteredStudentCount = useMemo(() => filteredClasses.reduce((sum, item) => sum + item.students.length, 0), [filteredClasses]);
  const filteredMastery = useMemo(() => {
    const students = filteredClasses.flatMap((item) => item.students).filter((student) => student.mastery > 0);
    if (!students.length) {
      return averageMastery;
    }
    return students.reduce((sum, student) => sum + student.mastery, 0) / students.length;
  }, [averageMastery, filteredClasses]);

  const primaryClassroomId = filteredClasses[0]?.classroomId ?? myClasses[0]?.classroomId ?? null;

  const quickActions = useMemo<TeacherDashboardQuickAction[]>(
    () => [
      {
        key: 'create-test',
        title: 'Create Test',
        description: 'Build a ZIMSEC-style quiz with Vertex AI support for faster setup and stronger question coverage.',
        cta: 'Create Now',
        colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        icon: Plus,
        onClick: () => onOpenClassroom(primaryClassroomId),
      },
      {
        key: 'announcement',
        title: 'Post Announcement',
        description: 'Send a classroom update with due dates, reminders, or resource links to your learners.',
        cta: 'Post Now',
        colorClass: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
        icon: Megaphone,
        onClick: () => onOpenClassroom(primaryClassroomId),
      },
      {
        key: 'analytics',
        title: 'View Analytics',
        description: 'Deep dive into class activity, mastery patterns, and where students are falling behind.',
        cta: 'View',
        colorClass: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
        icon: LineChart,
        onClick: () => {
          document.getElementById('teacher-performance')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      },
      {
        key: 'report',
        title: 'Download Report',
        description: 'Export a clean class performance snapshot for school leadership or your own records.',
        cta: 'Export',
        colorClass: 'text-violet-300 border-violet-500/30 bg-violet-500/10',
        icon: Download,
        onClick: onExportReport,
      },
    ],
    [onExportReport, onOpenClassroom, primaryClassroomId],
  );

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="teacher-dashboard-shell min-h-screen text-[var(--text-primary)]">
      <TeacherTopbar
        teacherName={teacherName}
        schoolName={schoolName}
        subjectName={subjectName}
        notificationCount={notificationCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNavigateToAccount={onNavigateToAccount}
        onChangeSchool={onChangeSchool}
        onLogout={onLogout}
      />

      <div className="hidden xl:fixed xl:inset-y-[60px] xl:left-0 xl:block xl:w-[220px] xl:border-r xl:border-[var(--border)] xl:bg-[var(--bg-surface)]">
        <TeacherSidebar
          teacherName={teacherName}
          teacherRole={teacherRole}
          schoolName={schoolName}
          pendingReviewsCount={pendingReviewsCount}
          onJumpTo={jumpTo}
          onOpenCreateTest={() => onOpenClassroom(primaryClassroomId)}
          onOpenAnnouncement={() => onOpenClassroom(primaryClassroomId)}
          onOpenSettings={onNavigateToAccount}
        />
      </div>

      <div className="hidden xl:fixed xl:inset-y-[60px] xl:right-0 xl:block xl:w-[280px] xl:border-l xl:border-[var(--border)] xl:bg-[var(--bg-surface)]">
        <RightPanel dueItems={dueItems} reviewItems={reviewItems} feedItems={feedItems} scheduleDays={scheduleDays} nextClassLabel={nextClassLabel} />
      </div>

      <main className="px-4 pb-10 pt-[76px] sm:px-6 xl:px-7 xl:pl-[248px] xl:pr-[308px]">
        <div className="mx-auto max-w-[1180px] space-y-7">
          <motion.div {...SECTION_MOTION} transition={{ duration: 0.45 }}>
            <WelcomeStrip teacherShortName={teacherShortName} />
          </motion.div>

          <motion.div {...SECTION_MOTION} transition={{ duration: 0.45, delay: 0.08 }}>
            <TeacherKPIRow
              classCount={filteredClasses.length}
              activeStudentsToday={Math.min(activeStudentsToday, filteredStudentCount || activeStudentsToday)}
              pendingReviewsCount={pendingReviewsCount}
              averageMastery={filteredMastery}
              activitySeries={activitySeries.slice(-7)}
            />
          </motion.div>

          <motion.section {...SECTION_MOTION} transition={{ duration: 0.45, delay: 0.16 }} id="teacher-classes" className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-['Sora'] text-[17px] font-semibold text-[var(--text-primary)]">My Classes</h2>
                <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{filteredClasses.length} active classrooms ready to manage</p>
              </div>
              <button type="button" onClick={() => onOpenClassroom(primaryClassroomId)} className="text-[13px] font-medium text-[var(--brand)] transition hover:text-emerald-300">
                Manage
              </button>
            </div>

            <div className="space-y-4">
              {filteredClasses.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + index * 0.08, duration: 0.35 }}>
                  <ClassCard item={item} onOpenClassroom={onOpenClassroom} />
                </motion.div>
              ))}

              {filteredClasses.length === 0 ? (
                <div className="teacher-surface rounded-[16px] p-6 text-center text-[13px] text-[var(--text-secondary)]">No classes or students matched “{searchTerm}”.</div>
              ) : null}
            </div>
          </motion.section>

          <motion.section {...SECTION_MOTION} transition={{ duration: 0.45, delay: 0.24 }} id="teacher-performance" className="space-y-4">
            <div>
              <h2 className="font-['Sora'] text-[17px] font-semibold text-[var(--text-primary)]">Student NerdX Performance</h2>
              <p className="mt-1 text-[13px] text-[var(--text-secondary)]">How your students are using NerdX this term</p>
            </div>
            <PerformanceChartsSection activitySeries={activitySeries} masteryBuckets={masteryBuckets} studentCount={filteredStudentCount || totalStudents} />
            <SubjectMasteryTable rows={subjectRows} onExportReport={onExportReport} />
          </motion.section>

          <motion.section {...SECTION_MOTION} transition={{ duration: 0.45, delay: 0.32 }} id="teacher-actions" className="space-y-4">
            <div>
              <h2 className="font-['Sora'] text-[17px] font-semibold text-[var(--text-primary)]">Quick Actions</h2>
              <p className="mt-1 text-[13px] text-[var(--text-secondary)]">Shortcuts for the work teachers do most</p>
            </div>
            <QuickActionsGrid actions={quickActions} />
          </motion.section>

          <div className="xl:hidden">
            <RightPanel dueItems={dueItems} reviewItems={reviewItems} feedItems={feedItems} scheduleDays={scheduleDays} nextClassLabel={nextClassLabel} />
          </div>
        </div>
      </main>
    </div>
  );
}

export function TeacherTopbar({
  teacherName,
  schoolName,
  subjectName,
  notificationCount,
  searchTerm,
  onSearchChange,
  onNavigateToAccount,
  onChangeSchool,
  onLogout,
}: TeacherTopbarProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onShortcut);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onShortcut);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-[60px] border-b border-[var(--border)] bg-[rgba(13,17,23,0.92)] backdrop-blur">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 text-[#041218]">
            <GraduationCap size={18} />
          </div>
          <span className="hidden font-['Sora'] text-[16px] font-bold text-[var(--text-primary)] sm:inline">NerdX</span>
          <div className="hidden h-5 w-px bg-[var(--border)] md:block" />
          <span className="hidden truncate text-[13px] text-[var(--text-secondary)] md:block">{schoolName}</span>
          <span className="hidden rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 text-[12px] text-[var(--text-primary)] lg:inline">{subjectName}</span>
        </div>

        <div className="hidden flex-1 justify-center lg:flex">
          <label className="flex h-10 w-full max-w-[280px] items-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--bg-elevated)] px-3 text-[13px] text-[var(--text-secondary)]">
            <Search size={15} className="text-[var(--text-muted)]" />
            <input
              ref={inputRef}
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search students, classes..."
              className="h-full flex-1 bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]"
            />
            <span className="rounded border border-[var(--border)] px-1.5 py-0.5 font-['JetBrains_Mono'] text-[10px] text-[var(--text-muted)]">Cmd+K</span>
          </label>
        </div>

        <div ref={containerRef} className="flex items-center gap-3">
          <button type="button" className="relative rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
            <Bell size={18} />
            {notificationCount > 0 ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--rose)]" /> : null}
          </button>
          <button type="button" className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-2 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
            <Calendar size={18} />
          </button>
          <div className="hidden h-5 w-px bg-[var(--border)] sm:block" />
          <button type="button" onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-2 py-1 text-left transition hover:border-emerald-500/30">
            <TeacherAvatar name={teacherName} />
            <span className="hidden font-['Sora'] text-[13px] font-semibold capitalize text-[var(--text-primary)] sm:inline">{teacherName.toLowerCase()}</span>
            <ChevronDown size={16} className={`text-[var(--text-secondary)] transition ${open ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {open ? (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.16 }} className="absolute right-4 top-[54px] w-[200px] rounded-[14px] border border-[var(--border)] bg-[var(--bg-surface)] p-2 shadow-2xl sm:right-6">
                <DropdownAction icon={UserCircle2} label="Profile Settings" onClick={onNavigateToAccount} />
                <DropdownAction icon={BookOpen} label="Change School" onClick={onChangeSchool} />
                <DropdownAction icon={LogOut} label="Sign Out" onClick={onLogout} danger />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function DropdownAction({ icon: Icon, label, onClick, danger = false }: { icon: typeof UserCircle2; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] transition ${danger ? 'text-rose-300 hover:bg-rose-500/10' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'}`}>
      <Icon size={15} />
      <span>{label}</span>
    </button>
  );
}

export function TeacherSidebar({ teacherName, teacherRole, schoolName, pendingReviewsCount, onJumpTo, onOpenCreateTest, onOpenAnnouncement, onOpenSettings }: TeacherSidebarProps) {
  const groups = [
    {
      label: 'Overview',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, active: true, onClick: () => onJumpTo('teacher-classes') },
        { label: 'My Analytics', icon: LineChart, onClick: () => onJumpTo('teacher-performance') },
      ],
    },
    {
      label: 'Classroom',
      items: [
        { label: 'My Classes', icon: BookOpen, onClick: () => onJumpTo('teacher-classes') },
        { label: 'My Students', icon: Users, onClick: () => onJumpTo('teacher-classes') },
        { label: 'Assignments & Tests', icon: ClipboardList, onClick: onOpenCreateTest },
        { label: 'Pending Reviews', icon: FileText, badge: pendingReviewsCount, onClick: () => onJumpTo('teacher-actions') },
      ],
    },
    {
      label: 'Content',
      items: [
        { label: 'Create Test', icon: Plus, onClick: onOpenCreateTest },
        { label: 'Post Announcement', icon: Megaphone, onClick: onOpenAnnouncement },
        { label: 'Resources', icon: FolderOpen, onClick: onOpenAnnouncement },
      ],
    },
    {
      label: 'NerdX Insights',
      items: [
        { label: 'Student AI Activity', icon: WandSparkles, onClick: () => onJumpTo('teacher-performance') },
        { label: 'Performance Reports', icon: FileBarChart2, onClick: () => onJumpTo('teacher-performance') },
      ],
    },
  ];

  return (
    <aside className="teacher-dashboard-scroll flex h-full flex-col overflow-y-auto px-4 py-5">
      <div className="teacher-surface rounded-[18px] p-4">
        <div className="flex items-center gap-3">
          <TeacherAvatar name={teacherName} large />
          <div className="min-w-0">
            <p className="truncate font-['Sora'] text-[15px] font-semibold text-[var(--text-primary)]">{teacherName.toLowerCase()}</p>
            <p className="text-[12px] text-[var(--text-secondary)]">{teacherRole}</p>
            <p className="truncate text-[11px] text-[var(--text-muted)]">{schoolName}</p>
          </div>
        </div>
      </div>

      <div className="my-4 h-px bg-[var(--border)]" />

      <nav className="space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className={`flex h-[38px] w-full items-center gap-3 rounded-[7px] px-3 text-left text-[13px] transition ${
                    item.active ? 'border-l-[3px] border-[var(--brand)] bg-[var(--brand-dim)] text-[var(--brand)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <item.icon size={16} />
                  <span className="flex-1">{item.label}</span>
                  {typeof item.badge === 'number' ? (
                    <span className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 font-['JetBrains_Mono'] text-[10px] ${item.badge > 0 ? 'teacher-pulse bg-[var(--amber)] text-black' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'}`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-5">
        <button type="button" onClick={onOpenSettings} className="flex h-[38px] w-full items-center gap-3 rounded-[7px] px-3 text-[13px] text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}

export function WelcomeStrip({ teacherShortName }: WelcomeStripProps) {
  const hour = new Date().getHours();
  const greeting = hour >= 17 ? 'Good evening' : hour >= 12 ? 'Good afternoon' : 'Good morning';
  return (
    <section>
      <h1 className="font-['Sora'] text-[22px] font-bold text-[var(--text-primary)]">
        {greeting}, {teacherShortName} <span className="text-emerald-300">.</span>
      </h1>
      <p className="mt-2 text-[13px] text-[var(--text-secondary)]">Here&apos;s how your students are doing today.</p>
    </section>
  );
}

export function TeacherKPIRow({ classCount, activeStudentsToday, pendingReviewsCount, averageMastery, activitySeries }: TeacherKPIRowProps) {
  const cards = [
    { label: 'My Classes', value: classCount, icon: BookOpen, accent: 'text-emerald-400 bg-emerald-500/12', foot: classCount > 0 ? 'Ready to manage' : 'Awaiting class assignments' },
    { label: 'Students Active', value: activeStudentsToday, icon: Users, accent: 'text-sky-400 bg-sky-500/12', foot: 'Students active today' },
    { label: 'Pending Reviews', value: pendingReviewsCount, icon: FileText, accent: 'text-amber-300 bg-amber-500/12', foot: pendingReviewsCount > 0 ? 'Needs teacher action' : 'All clear', highlight: pendingReviewsCount > 0 },
    { label: 'Avg Student Mastery', value: averageMastery ? Math.round(averageMastery) : 0, icon: Sparkles, accent: 'text-emerald-300 bg-emerald-500/12', foot: averageMastery === null ? 'No mastery data yet' : 'Across tracked students', isMastery: true },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.35 }} className={`teacher-surface rounded-[14px] p-5 ${card.highlight ? 'border-amber-500/50 bg-[linear-gradient(180deg,rgba(245,158,11,0.08),rgba(13,17,23,0.96))] teacher-glow-amber' : ''}`}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${card.accent}`}>
              <card.icon size={18} />
            </div>
            <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">{card.label}</span>
          </div>
          <div className="font-['JetBrains_Mono'] text-[28px] font-bold text-[var(--text-primary)]">{card.isMastery ? formatMastery(averageMastery) : <StatValue value={card.value} />}</div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <span className="text-[12px] text-[var(--text-secondary)]">{card.foot}</span>
            <div className="flex h-10 items-end gap-1">
              {activitySeries.map((point) => (
                <div key={`${card.label}-${point.label}`} className={`w-1.5 rounded-full ${heightClass(point.value)} ${card.highlight ? 'bg-amber-400/70' : 'bg-emerald-400/70'}`} />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}

export function ClassCard({ item, onOpenClassroom }: ClassCardProps) {
  return (
    <motion.article whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="group relative overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition hover:border-emerald-500/40">
      <div className="absolute inset-y-4 left-0 w-[3px] rounded-full bg-[var(--brand)] transition-all duration-200 group-hover:inset-y-0" />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="teacher-grid-pattern rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-emerald-500/10 text-emerald-400">
                <BookOpen size={18} />
              </span>
              <div className="min-w-0">
                <h3 className="truncate font-['Sora'] text-[18px] font-semibold text-[var(--text-primary)]">{item.subject}</h3>
                <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
                  {item.formName} · {item.zimsecCode || 'ZIMSEC'} · {item.studentCount} student{item.studentCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <button type="button" onClick={() => onOpenClassroom(item.classroomId)} className="inline-flex items-center gap-2 self-start rounded-[10px] border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-[13px] font-medium text-emerald-300 transition hover:border-emerald-400/40 hover:text-emerald-200">
          Open
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <ClassMiniStat label="Students Enrolled" value={`${item.studentCount}`} />
        <ClassMiniStat label="Avg Mastery" value={formatMastery(item.averageMastery)} />
        <ClassMiniStat label="NerdX Sessions" value={`${item.weeklySessions} this week`} />
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] font-medium text-[var(--text-primary)]">Student NerdX Activity (last 7 days)</p>
          <span className="text-[11px] text-[var(--text-muted)]">{item.classroomName}</span>
        </div>
        <div className="teacher-surface rounded-[12px] p-4">
          <div className="flex h-12 items-end gap-2">
            {item.activity7d.map((point) => (
              <div key={`${item.id}-${point.day}`} className="flex flex-1 flex-col items-center gap-1">
                <div className={`w-full rounded-t-full bg-emerald-400/75 ${heightClass(point.value + 1)}`} />
                <span className="font-['JetBrains_Mono'] text-[10px] text-[var(--text-muted)]">{point.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
        <p className="mb-3 text-[13px] font-medium text-[var(--text-primary)]">Students in this class:</p>
        <div className="space-y-3">
          {item.students.length > 0 ? item.students.map((student) => <StudentRowInClass key={student.id} student={student} />) : <p className="text-[12px] text-[var(--text-secondary)]">No students enrolled in this class yet.</p>}
        </div>
      </div>

      <button type="button" onClick={() => onOpenClassroom(item.classroomId)} className="mt-4 rounded-[10px] border border-[var(--border)] bg-transparent px-4 py-2 text-[13px] text-[var(--text-secondary)] transition hover:border-emerald-500/30 hover:text-[var(--text-primary)]">
        + Add Students
      </button>
    </motion.article>
  );
}

function ClassMiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="teacher-surface rounded-[12px] p-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 font-['JetBrains_Mono'] text-[16px] font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

export function StudentRowInClass({ student }: StudentRowInClassProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-[var(--border)] bg-[rgba(8,11,15,0.45)] px-3 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/30 to-emerald-500/30 text-[11px] font-semibold uppercase text-[var(--text-primary)]">{student.avatarInitial}</div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{student.name}</p>
          <p className="text-[11px] text-[var(--text-secondary)]">{student.studentCode}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[12px] text-[var(--text-secondary)]">
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-300">Mastery: {student.mastery}%</span>
        <span className={`flex items-center gap-1 ${student.status === 'active' ? 'text-emerald-300' : 'text-[var(--text-secondary)]'}`}>
          <span className={`h-2 w-2 rounded-full ${student.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
          {student.lastSeenLabel}
        </span>
        <span className="font-['JetBrains_Mono'] text-[11px]">Sessions: {student.sessions}</span>
      </div>
    </div>
  );
}

export function PerformanceChartsSection({ activitySeries, masteryBuckets, studentCount }: PerformanceChartsSectionProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
      <div className="teacher-surface rounded-[16px] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-['Sora'] text-[15px] font-semibold text-[var(--text-primary)]">Class Activity - Last 30 Days</h3>
            <p className="mt-1 text-[12px] text-[var(--text-secondary)]">Daily NerdX sessions across your classes</p>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1 font-['JetBrains_Mono'] text-[10px] text-[var(--text-secondary)]">30D</div>
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activitySeries}>
              <defs>
                <linearGradient id="teacher-activity-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(123,143,166,0.10)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#7B8FA6', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7B8FA6', fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip cursor={{ stroke: 'rgba(16,185,129,0.25)' }} contentStyle={{ backgroundColor: '#0D1117', borderColor: '#1E2D3D', borderRadius: 12 }} labelStyle={{ color: '#EDF2F7' }} />
              <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#teacher-activity-fill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="teacher-surface rounded-[16px] p-5">
        <div className="mb-4">
          <h3 className="font-['Sora'] text-[15px] font-semibold text-[var(--text-primary)]">Mastery Distribution</h3>
          <p className="mt-1 text-[12px] text-[var(--text-secondary)]">All {studentCount} students · Updated today</p>
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={masteryBuckets} layout="vertical" margin={{ left: 8, right: 12 }}>
              <CartesianGrid stroke="rgba(123,143,166,0.08)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#7B8FA6', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="label" type="category" tick={{ fill: '#7B8FA6', fontSize: 11 }} axisLine={false} tickLine={false} width={52} />
              <Tooltip cursor={{ fill: 'rgba(16,185,129,0.08)' }} contentStyle={{ backgroundColor: '#0D1117', borderColor: '#1E2D3D', borderRadius: 12 }} labelStyle={{ color: '#EDF2F7' }} />
              <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                {masteryBuckets.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function SubjectMasteryTable({ rows, onExportReport }: SubjectMasteryTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('topic');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

  const sortedRows = useMemo(() => {
    const multiplier = direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      if (sortKey === 'topic') return a.topic.localeCompare(b.topic) * multiplier;
      if (sortKey === 'students') return (a.students - b.students) * multiplier;
      if (sortKey === 'avgScore') return ((a.avgScore ?? -1) - (b.avgScore ?? -1)) * multiplier;
      const order = { down: 0, flat: 1, up: 2 };
      return (order[a.trend] - order[b.trend]) * multiplier;
    });
  }, [direction, rows, sortKey]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setDirection('asc');
  };

  return (
    <div className="teacher-surface rounded-[16px] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-['Sora'] text-[15px] font-semibold text-[var(--text-primary)]">Subject Mastery Table</h3>
          <p className="mt-1 text-[12px] text-[var(--text-secondary)]">Topic-level coverage trends for the subject you teach</p>
        </div>
        <button type="button" onClick={onExportReport} className="text-[13px] font-medium text-[var(--brand)] transition hover:text-emerald-300">
          Export report →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              <SortableHeader label="Topic" onClick={() => handleSort('topic')} />
              <SortableHeader label="Students" onClick={() => handleSort('students')} />
              <SortableHeader label="Avg Score" onClick={() => handleSort('avgScore')} />
              <SortableHeader label="Trend" onClick={() => handleSort('trend')} />
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.topic} className="rounded-[12px] bg-[var(--bg-elevated)] text-[13px] text-[var(--text-secondary)]">
                <td className="rounded-l-[12px] px-4 py-3 text-[var(--text-primary)]">{row.topic}</td>
                <td className="px-4 py-3 font-['JetBrains_Mono']">{row.students}</td>
                <td className="px-4 py-3 font-['JetBrains_Mono']">{formatMastery(row.avgScore)}</td>
                <td className="rounded-r-[12px] px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] ${row.trend === 'up' ? 'bg-emerald-500/10 text-emerald-300' : row.trend === 'down' ? 'bg-rose-500/10 text-rose-300' : 'bg-slate-500/10 text-slate-300'}`}>
                    {row.trend === 'up' ? '↑ Improving' : row.trend === 'down' ? '↓ Declining' : '— Stable'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortableHeader({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <th className="px-4 py-2">
      <button type="button" onClick={onClick} className="transition hover:text-[var(--text-secondary)]">
        {label}
      </button>
    </th>
  );
}

export function QuickActionsGrid({ actions }: QuickActionsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {actions.map((action, index) => (
        <motion.button key={action.key} type="button" onClick={action.onClick} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.35 }} whileHover={{ y: -3 }} className="teacher-surface group rounded-[14px] p-5 text-left transition">
          <div className="flex items-start gap-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full border transition group-hover:scale-105 ${action.colorClass}`}>
              <action.icon size={18} />
            </div>
            <div className="flex-1">
              <h3 className="font-['Sora'] text-[14px] font-semibold text-[var(--text-primary)]">{action.title}</h3>
              <p className="mt-2 text-[12px] leading-5 text-[var(--text-secondary)]">{action.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--brand)] transition group-hover:underline">
                {action.cta}
                <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

export function RightPanel({ dueItems, reviewItems, feedItems, scheduleDays, nextClassLabel }: RightPanelProps) {
  return (
    <aside className="teacher-dashboard-scroll h-full overflow-y-auto p-5">
      <div className="space-y-5">
        <section className="teacher-surface rounded-[16px] p-4">
          <h3 className="font-['Sora'] text-[16px] font-semibold text-[var(--text-primary)]">Today</h3>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <div className="mt-4 space-y-3">
            {dueItems.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-6 text-center">
                <Calendar size={40} className="mx-auto text-[var(--text-muted)]" />
                <p className="mt-3 text-[13px] text-[var(--text-secondary)]">Nothing due today</p>
                <p className="mt-1 text-[12px] text-[var(--text-muted)]">All clear for now.</p>
              </div>
            ) : (
              dueItems.map((item) => <DueItemRow key={item.id} item={item} />)
            )}
          </div>
        </section>

        <section className="teacher-surface rounded-[16px] p-4">
          <h3 className="font-['Sora'] text-[14px] font-semibold text-[var(--text-primary)]">Pending Reviews</h3>
          <div className="mt-4 space-y-3">
            {reviewItems.length === 0 ? (
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-4 text-center">
                <CheckCheck size={24} className="mx-auto text-emerald-400" />
                <p className="mt-2 text-[13px] text-[var(--text-secondary)]">All reviews done ✓</p>
              </div>
            ) : (
              reviewItems.map((item) => (
                <div key={item.id} className="rounded-[14px] border border-amber-500/20 bg-amber-500/5 p-3">
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">{item.title}</p>
                  <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{item.subtitle}</p>
                  <button type="button" className="mt-3 text-[12px] font-medium text-[var(--amber)] transition hover:text-amber-200">Review now →</button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="teacher-surface rounded-[16px] p-4">
          <h3 className="font-['Sora'] text-[14px] font-semibold text-[var(--text-primary)]">Recent NerdX Activity</h3>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">Your students on NerdX today</p>
          <div className="mt-4 space-y-3">
            {feedItems.length === 0 ? (
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-5 text-center">
                <p className="text-[13px] text-[var(--text-secondary)]">No activity today</p>
                <p className="mt-1 text-[12px] text-[var(--text-muted)]">Students haven&apos;t logged into NerdX yet.</p>
              </div>
            ) : (
              feedItems.map((item) => <ActivityFeedItem key={item.id} item={item} />)
            )}
          </div>
          <p className="mt-4 text-[10px] text-[var(--text-muted)]">Updated just now · auto-refresh 60s</p>
        </section>

        <section className="teacher-surface rounded-[16px] p-4">
          <h3 className="font-['Sora'] text-[14px] font-semibold text-[var(--text-primary)]">My Schedule This Week</h3>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {scheduleDays.map((day) => (
              <div key={day.key} className={`rounded-[12px] border px-2 py-3 text-center ${day.isToday ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-[var(--border)] bg-[var(--bg-elevated)]'}`}>
                <p className="text-[11px] text-[var(--text-secondary)]">{day.label}</p>
                <p className="mt-1 font-['JetBrains_Mono'] text-[13px] text-[var(--text-primary)]">{day.date}</p>
                <div className={`mx-auto mt-2 h-2 w-2 rounded-full ${day.hasClass ? 'bg-emerald-400' : 'border border-[var(--border)] bg-transparent'}`} />
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Next Class</p>
            <p className="mt-2 text-[13px] font-medium text-[var(--text-primary)]">{nextClassLabel}</p>
          </div>
        </section>
      </div>
    </aside>
  );
}

function DueItemRow({ item }: { item: TeacherDashboardDueItem }) {
  const dotClass = item.status === 'overdue' ? 'bg-[var(--rose)]' : item.status === 'today' ? 'bg-[var(--amber)]' : 'bg-emerald-400';
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-3">
      <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-[var(--text-primary)]">{item.title}</p>
        <p className="text-[11px] text-[var(--text-muted)]">{item.subtitle}</p>
      </div>
      <span className="font-['JetBrains_Mono'] text-[11px] text-[var(--text-muted)]">{item.dueLabel}</span>
    </div>
  );
}

export function ActivityFeedItem({ item }: ActivityFeedItemProps) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/15 text-[12px] font-semibold uppercase text-sky-300">{item.initial}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-[var(--text-primary)]">
          <span className="font-medium">{item.studentName}</span> {item.detail}
        </p>
        <p className="mt-1 text-[11px] text-[var(--text-muted)]">{item.timeLabel}</p>
      </div>
    </motion.div>
  );
}
