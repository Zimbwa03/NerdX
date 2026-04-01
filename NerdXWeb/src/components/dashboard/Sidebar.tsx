import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  BookCheck,
  Compass,
  Layers,
  MessagesSquare,
  Plus,
  Sparkles,
  TrendingUp,
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

function NavSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="mb-2 px-4 font-dm text-[10px] font-medium uppercase tracking-widest text-[var(--text-muted)]">
        {label}
      </p>
      <div className="flex flex-col gap-1">{children}</div>
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
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
      className={`flex h-11 items-center gap-3 rounded-lg px-4 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] active:scale-[0.97] ${
        active
          ? 'border-l-[3px] border-[var(--brand)] bg-[var(--brand-dim)] font-medium text-[var(--brand)]'
          : 'border-l-[3px] border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
      } `}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} aria-hidden />
      <span>{label}</span>
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
      className={`flex w-[240px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-surface)] lg:min-h-[calc(100vh-4rem)] ${className}`}
      aria-label="Main navigation"
    >
      <div className="border-b border-[var(--border)] px-4 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-[2px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-elevated)] font-sora text-base font-semibold text-white">
              {userInitial.slice(0, 1).toUpperCase()}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-dm text-sm font-semibold text-[var(--text-primary)]">{displayName}</p>
            <p className="truncate font-jetbrains text-xs text-[var(--text-muted)]">NerdX ID: {nerdxId}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <Link
          to="/app/credits"
          onClick={onCloseMobile}
          className="flex h-11 items-center justify-between gap-3 rounded-full bg-neutral-800 px-4 text-[var(--text-primary)] transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
          aria-label={`Credits balance ${creditsDisplay}. Add credits`}
        >
          <span className="flex items-center gap-2">
            <Zap className="h-[18px] w-[18px] text-[var(--brand)]" strokeWidth={1.5} aria-hidden />
            <span className="font-jetbrains text-lg font-bold tabular-nums text-[var(--brand)]">
              {creditsDisplay.toLocaleString()}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-secondary)]">Credits</span>
          </span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-dim)] text-[var(--brand)]"
            aria-hidden
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-6" aria-label="Dashboard sections">
        <NavSection label="Learn">
          <NavItem
            id="learning-hub"
            active={activeNav === 'learning-hub'}
            icon={BookCheck}
            label="Learning Hub"
            onSelect={wrapClose}
          />
          <NavItem id="overview" active={activeNav === 'overview'} icon={Layers} label="Overview" onSelect={wrapClose} />
          <NavItem
            id="core-modes"
            active={activeNav === 'core-modes'}
            icon={Compass}
            label="Core Modes"
            onSelect={wrapClose}
          />
        </NavSection>
        <NavSection label="Track">
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
        </NavSection>
        <NavSection label="Community">
          <NavItem
            id="teacher-feed"
            active={activeNav === 'teacher-feed'}
            icon={MessagesSquare}
            label="Teacher Feed"
            onSelect={wrapClose}
          />
        </NavSection>
      </nav>
    </aside>
  );
}
