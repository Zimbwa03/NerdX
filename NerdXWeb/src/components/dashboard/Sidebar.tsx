import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  BookCheck,
  Briefcase,
  Flame,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Plus,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useCountUp } from './useCountUp';

export type DashboardNavId =
  | 'learning-hub'
  | 'overview'
  | 'core-modes'
  | 'ai-insights'
  | 'progress'
  | 'teacher-feed';

export interface SidebarProps {
  displayName: string;
  userInitial: string;
  nerdxId: string;
  creditsRaw: number;
  activeNav: DashboardNavId;
  onNavigate: (id: DashboardNavId) => void;
  className?: string;
  onCloseMobile?: () => void;
}

function NavGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-7 first:mt-0">
      <p className="mb-2 px-3 font-dm text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function NavItem({
  id,
  active,
  icon: Icon,
  label,
  onSelect,
}: {
  id: DashboardNavId;
  active: boolean;
  icon: typeof BookCheck;
  label: string;
  onSelect: (id: DashboardNavId) => void;
}) {
  return (
    <a
      href={`#${id}`}
      onClick={(e) => {
        e.preventDefault();
        onSelect(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
      className={`group flex h-11 items-center gap-3 rounded-[8px] px-3 text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] active:scale-[0.98] ${
        active
          ? 'border-l-[3px] border-[var(--brand)] bg-[var(--brand-dim)] font-semibold text-[var(--brand)]'
          : 'border-l-[3px] border-transparent font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      <Icon
        className={`h-5 w-5 shrink-0 transition-colors duration-150 ${
          active
            ? 'text-[var(--brand)]'
            : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
        }`}
        strokeWidth={active ? 2 : 1.5}
        aria-hidden
      />
      <span className="font-dm">{label}</span>
    </a>
  );
}

export function Sidebar({
  displayName,
  userInitial,
  nerdxId,
  creditsRaw,
  activeNav,
  onNavigate,
  className = '',
  onCloseMobile,
}: SidebarProps) {
  const creditsDisplay = useCountUp(Math.max(0, Math.floor(creditsRaw)), 1200, creditsRaw > 0);

  const wrapClose = (id: DashboardNavId) => {
    onNavigate(id);
    onCloseMobile?.();
  };

  return (
    <aside
      className={`flex w-[260px] shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-elevated)] lg:min-h-[calc(100vh-4rem)] ${className}`}
      aria-label="Main navigation"
    >
      {/* ── Logo area ── */}
      <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-5 py-5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
          style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
          aria-hidden
        >
          <GraduationCap className="h-5 w-5 text-white" strokeWidth={2} />
        </div>
        <span className="font-sora text-[18px] font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
          Nerd
          <span className="text-[var(--brand)]">X</span>
        </span>
      </div>

      {/* ── Credits badge ── */}
      <div className="px-4 py-4">
        <Link
          to="/app/credits"
          onClick={onCloseMobile}
          className="flex h-11 items-center justify-between gap-2 rounded-full border border-[rgba(245,158,11,0.3)] bg-[var(--warning-dim,#1C1400)] px-4 text-[var(--text-primary)] transition-all duration-150 hover:border-[var(--accent-gold)] hover:shadow-[0_0_12px_rgba(245,158,11,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-elevated)]"
          aria-label={`Credits balance: ${creditsDisplay}. Add credits`}
        >
          <span className="flex items-center gap-2">
            <Zap className="h-[14px] w-[14px] text-[var(--accent-gold)]" strokeWidth={2} aria-hidden />
            <span className="font-jetbrains text-sm font-bold tabular-nums text-[var(--accent-gold)]">
              {creditsDisplay.toLocaleString()}
            </span>
            <span className="font-dm text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
              Credits
            </span>
          </span>
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--success)] text-white"
            aria-hidden
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Dashboard sections">
        <NavGroup label="Learn">
          <NavItem
            id="learning-hub"
            active={activeNav === 'learning-hub'}
            icon={BookCheck}
            label="Learning Hub"
            onSelect={wrapClose}
          />
          <NavItem
            id="overview"
            active={activeNav === 'overview'}
            icon={LayoutDashboard}
            label="Overview"
            onSelect={wrapClose}
          />
          <NavItem
            id="core-modes"
            active={activeNav === 'core-modes'}
            icon={Layers}
            label="Core Modes"
            onSelect={wrapClose}
          />
        </NavGroup>

        <NavGroup label="Track">
          <NavItem
            id="ai-insights"
            active={activeNav === 'ai-insights'}
            icon={Sparkles}
            label="AI Insights"
            onSelect={wrapClose}
          />
          <NavItem
            id="progress"
            active={activeNav === 'progress'}
            icon={TrendingUp}
            label="My Progress"
            onSelect={wrapClose}
          />
        </NavGroup>

        <NavGroup label="Community">
          <NavItem
            id="teacher-feed"
            active={activeNav === 'teacher-feed'}
            icon={Users}
            label="Teacher Feed"
            onSelect={wrapClose}
          />
        </NavGroup>

        {/* Quick links */}
        <NavGroup label="Quick access">
          <Link
            to="/app/marketplace"
            onClick={onCloseMobile}
            className="flex h-11 items-center gap-3 rounded-[8px] border-l-[3px] border-transparent px-3 font-dm text-sm font-medium text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
          >
            <Briefcase className="h-5 w-5 shrink-0 text-[var(--text-muted)]" strokeWidth={1.5} aria-hidden />
            Marketplace
          </Link>
          <Link
            to="/app/preferences"
            onClick={onCloseMobile}
            className="flex h-11 items-center gap-3 rounded-[8px] border-l-[3px] border-transparent px-3 font-dm text-sm font-medium text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
          >
            <Settings className="h-5 w-5 shrink-0 text-[var(--text-muted)]" strokeWidth={1.5} aria-hidden />
            Settings
          </Link>
        </NavGroup>
      </nav>

      {/* ── User profile footer ── */}
      <div className="border-t border-[var(--border-subtle)] px-4 py-4">
        <Link
          to="/app/preferences"
          onClick={onCloseMobile}
          className="flex items-center gap-3 rounded-[10px] p-2 transition-colors duration-150 hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-elevated)]"
          aria-label="Open profile settings"
        >
          {/* Avatar */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-sora text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
            aria-hidden
          >
            {userInitial.slice(0, 1).toUpperCase()}
          </div>
          {/* Name & ID */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-dm text-sm font-semibold text-[var(--text-primary)]">{displayName}</p>
            <p className="truncate font-jetbrains text-[11px] text-[var(--text-muted)]">
              ID: {nerdxId}
            </p>
          </div>
          {/* Streak indicator */}
          <Flame className="h-4 w-4 shrink-0 text-[var(--accent-gold)]" strokeWidth={1.5} aria-hidden />
        </Link>
      </div>
    </aside>
  );
}
