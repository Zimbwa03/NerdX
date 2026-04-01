import { useEffect, useRef, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  School,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  BarChart2,
  Building,
  Layers,
  BookOpen,
  GraduationCap,
  UserPlus,
  Users,
  DollarSign,
  Settings,
} from 'lucide-react';
import { FloatingParticles } from '../../components/FloatingParticles';
import type { SchoolProfile } from '../../services/api/schoolDashboardApi';
import type { SubSchool } from '../../services/api/schoolEcosystemApi';
import type { SchoolDashboardSection } from './schoolDashboard.types';
import '../../styles/school-dashboard.css';

export type PortalExportKind = 'pdf-summary' | 'students-xlsx' | 'pptx-highlights';

export interface SchoolDashboardLayoutProps {
  school: SchoolProfile;
  dashBase: string;
  activeSection: SchoolDashboardSection;
  activeSubSchool: SubSchool | null;
  subSchools: SubSchool[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
  dateRangeDays: 7 | 30 | 90;
  setDateRangeDays: (days: 7 | 30 | 90) => void;
  overviewCampusScope: 'all' | string;
  setOverviewCampusScope: (scope: 'all' | string) => void;
  onOpenHerentalsAI?: () => void;
  onExport?: (kind: PortalExportKind) => void;
  exportInProgress?: boolean;
  children: ReactNode;
}

const navCls = ({ isActive }: { isActive: boolean }) =>
  `sd-v2-sidebar__nav-item${isActive ? ' sd-v2-sidebar__nav-item--active' : ''}`;

export function SchoolDashboardLayout({
  school,
  dashBase,
  activeSection,
  activeSubSchool,
  subSchools,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  dateRangeDays,
  setDateRangeDays,
  overviewCampusScope,
  setOverviewCampusScope,
  onOpenHerentalsAI,
  onExport,
  exportInProgress = false,
  children,
}: SchoolDashboardLayoutProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const exportWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exportOpen) return;
    const close = (e: MouseEvent) => {
      if (exportWrapRef.current && !exportWrapRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [exportOpen]);

  const showManageTabs =
    activeSection === 'forms' ||
    activeSection === 'subjects' ||
    activeSection === 'teachers' ||
    activeSection === 'ecosystem_students';

  return (
    <div className="school-dashboard-root sd-v2 sd-v2-layout">
      <FloatingParticles />

      <div className="sd-v2-mobile-header">
        <button type="button" className="sd-v2-mobile-back" onClick={onLogout}>
          <ArrowLeft size={20} />
        </button>
        <span className="sd-v2-mobile-title">{school.name}</span>
        <button type="button" className="sd-v2-mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={22} />
        </button>
      </div>

      <header className="sd-topbar">
        <div className="sd-topbar__left">
          <div className="sd-topbar__brand">
            {school.logo_url ? (
              <img src={school.logo_url} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <School size={28} style={{ opacity: 0.85 }} />
            )}
            <span className="sd-topbar__brand-name">{school.name}</span>
          </div>
          {school.group_id && subSchools.length > 0 && (
            <select
              className="sd-topbar__select"
              aria-label="Campus scope for overview"
              value={overviewCampusScope}
              onChange={(e) => setOverviewCampusScope(e.target.value as 'all' | string)}
            >
              <option value="all">All schools</option>
              {subSchools.map((ss) => (
                <option key={ss.school_id} value={ss.school_id}>
                  {ss.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="sd-topbar__dates" aria-label="Chart date range">
          {([7, 30, 90] as const).map((d) => (
            <button
              key={d}
              type="button"
              className={`sd-topbar__date-btn${dateRangeDays === d ? ' sd-topbar__date-btn--active' : ''}`}
              onClick={() => setDateRangeDays(d)}
            >
              {d}d
            </button>
          ))}
        </div>
        <div className="sd-topbar__right">
          <div className="sd-export-wrap" ref={exportWrapRef}>
            <button
              type="button"
              className="sd-topbar__phase2-btn"
              disabled={!onExport || exportInProgress}
              onClick={() => onExport && setExportOpen((o) => !o)}
              title="Download PDF summary, Excel student list, or PowerPoint highlights"
            >
              {exportInProgress ? 'Exporting…' : 'Export'}
            </button>
            {exportOpen && onExport && (
              <div className="sd-export-menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  disabled={exportInProgress}
                  onClick={() => {
                    setExportOpen(false);
                    onExport('pdf-summary');
                  }}
                >
                  PDF summary
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled={exportInProgress}
                  onClick={() => {
                    setExportOpen(false);
                    onExport('students-xlsx');
                  }}
                >
                  Students (Excel)
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled={exportInProgress}
                  onClick={() => {
                    setExportOpen(false);
                    onExport('pptx-highlights');
                  }}
                >
                  PowerPoint highlights
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="sd-topbar__phase2-btn sd-topbar__phase2-btn--gold"
            disabled={!onOpenHerentalsAI}
            onClick={onOpenHerentalsAI}
            title="Ask Herentals AI (Vertex Gemini, read-only portal context)"
          >
            Herentals AI
          </button>
        </div>
      </header>

      <div className="sd-v2-inner">
        <aside className={`sd-v2-sidebar ${sidebarOpen ? 'sd-v2-sidebar--open' : ''}`}>
          <div className="sd-v2-sidebar__header">
            <button type="button" className="sd-v2-sidebar__close" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="sd-v2-sidebar__school">
            {school.logo_url ? (
              <img src={school.logo_url} alt={school.name} className="sd-v2-sidebar__logo" />
            ) : (
              <div className="sd-v2-sidebar__logo-placeholder">
                <School size={32} />
              </div>
            )}
            <h2 className="sd-v2-sidebar__name">{school.name}</h2>
            <span className="sd-v2-sidebar__id">ID: {school.school_id}</span>
            {school.group_id && (
              <span
                style={{
                  fontSize: '0.65rem',
                  color: '#a78bfa',
                  background: 'rgba(139,92,246,0.12)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  marginTop: 4,
                  display: 'inline-block',
                }}
              >
                Group School
              </span>
            )}
          </div>

          <nav className="sd-v2-sidebar__nav">
            <div
              style={{
                padding: '4px 16px 6px',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              Overview
            </div>
            <NavLink to={`${dashBase}/overview`} className={navCls} onClick={() => setSidebarOpen(false)}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to={`${dashBase}/performance`} className={navCls} onClick={() => setSidebarOpen(false)}>
              <BarChart2 size={18} />
              <span>Performance</span>
            </NavLink>

            {school.group_id && (
              <>
                <div
                  style={{
                    padding: '14px 16px 6px',
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                    color: 'rgba(255,255,255,0.3)',
                  }}
                >
                  Group Network
                </div>
                <NavLink to={`${dashBase}/sub-schools`} className={navCls} onClick={() => setSidebarOpen(false)}>
                  <Building size={18} />
                  <span>Sub-Schools</span>
                </NavLink>
              </>
            )}

            <div
              style={{
                padding: '14px 16px 6px',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              {activeSubSchool ? activeSubSchool.name : 'School operations'}
            </div>
            <NavLink to={`${dashBase}/manage/structure`} className={navCls} onClick={() => setSidebarOpen(false)}>
              <Layers size={18} />
              <span>Forms & Classes</span>
            </NavLink>
            <NavLink to={`${dashBase}/manage/subjects`} className={navCls} onClick={() => setSidebarOpen(false)}>
              <BookOpen size={18} />
              <span>Subjects</span>
            </NavLink>
            <NavLink to={`${dashBase}/manage/teachers`} className={navCls} onClick={() => setSidebarOpen(false)}>
              <GraduationCap size={18} />
              <span>Teachers</span>
            </NavLink>
            <NavLink to={`${dashBase}/manage/students-v2`} className={navCls} onClick={() => setSidebarOpen(false)}>
              <UserPlus size={18} />
              <span>Students (v2)</span>
            </NavLink>

            <div
              style={{
                padding: '14px 16px 6px',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              Operations
            </div>
            <NavLink to={`${dashBase}/nerdx-students`} className={navCls} onClick={() => setSidebarOpen(false)}>
              <Users size={18} />
              <span>NerdX Students</span>
            </NavLink>
            <NavLink to={`${dashBase}/finance`} className={navCls} onClick={() => setSidebarOpen(false)}>
              <DollarSign size={18} />
              <span>Finance</span>
            </NavLink>
            <NavLink to={`${dashBase}/settings`} className={navCls} onClick={() => setSidebarOpen(false)}>
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>
          </nav>

          <div className="sd-v2-sidebar__footer">
            <button type="button" className="sd-v2-sidebar__logout" onClick={onLogout}>
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </aside>

        <main className="sd-v2-main">
          {showManageTabs && (
            <nav className="sd-manage-tabs" aria-label="School operations tabs">
              <NavLink to={`${dashBase}/manage/structure`} className={({ isActive }) => (isActive ? 'sd-manage-tabs__active' : '')}>
                Structure
              </NavLink>
              <NavLink to={`${dashBase}/manage/subjects`} className={({ isActive }) => (isActive ? 'sd-manage-tabs__active' : '')}>
                Subjects
              </NavLink>
              <NavLink to={`${dashBase}/manage/teachers`} className={({ isActive }) => (isActive ? 'sd-manage-tabs__active' : '')}>
                Teachers
              </NavLink>
              <NavLink to={`${dashBase}/manage/students-v2`} className={({ isActive }) => (isActive ? 'sd-manage-tabs__active' : '')}>
                Students (v2)
              </NavLink>
            </nav>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
