import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Calendar, Menu, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { NerdXMark } from '../brand/NerdXMark';

/** Raised, bordered icon buttons for the topbar */
const topbarActionClass =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] transition-all duration-150 hover:border-[var(--border-accent)] hover:bg-[var(--bg-surface)] hover:text-[var(--brand)] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]';

const iconStroke = 2.25 as const;

export interface TopbarProps {
  userName?: string;
  userInitial?: string;
  hasUnreadNotifications?: boolean;
  onMobileMenuClick?: () => void;
  showMobileMenu?: boolean;
}

export function Topbar({
  userInitial = 'S',
  hasUnreadNotifications = false,
  onMobileMenuClick,
  showMobileMenu = true,
}: TopbarProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const searchKbd = useMemo(() => {
    if (typeof navigator === 'undefined') return '⌘K';
    return /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl+K';
  }, []);

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg-surface)]/95 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--bg-surface)]/88 md:px-6"
      role="banner"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {showMobileMenu && (
          <button
            type="button"
            className={`${topbarActionClass} lg:hidden`}
            onClick={onMobileMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" strokeWidth={iconStroke} aria-hidden />
          </button>
        )}

        <Link
          to="/app"
          className="group flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
          aria-label="NerdX home"
        >
          <NerdXMark className="transition-transform duration-200 group-hover:scale-[1.03]" />
          <span className="font-sora text-[18px] font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
            Nerd
            <span className="text-[var(--brand)]">X</span>
          </span>
        </Link>

        <div className="relative mx-2 hidden min-w-0 flex-1 md:mx-4 md:block md:max-w-[280px]">
          <label htmlFor="dash-search" className="sr-only">
            Search topics and subjects
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]"
            strokeWidth={2}
            aria-hidden
          />
          <input
            id="dash-search"
            type="search"
            placeholder="Search topics, subjects..."
            className="h-10 w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] py-2 pl-10 pr-16 font-dm text-sm text-[var(--text-primary)] placeholder:italic placeholder:text-[var(--text-muted)] transition-all duration-150 focus:border-[var(--brand)] focus:outline-none focus:shadow-[0_0_0_3px_var(--brand-glow)] focus:w-[360px]"
            aria-label="Search topics, subjects"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                (e.target as HTMLInputElement).focus();
              }
            }}
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--border-accent)] bg-[var(--bg-surface)] px-1.5 py-0.5 font-jetbrains text-[10px] text-[var(--text-muted)] sm:inline-block">
            {searchKbd}
          </kbd>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/app/my-lessons')}
          className={topbarActionClass}
          aria-label="Open calendar and lessons"
        >
          <Calendar className="h-5 w-5" strokeWidth={iconStroke} aria-hidden />
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className={topbarActionClass}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" strokeWidth={iconStroke} aria-hidden />
          ) : (
            <Moon className="h-5 w-5" strokeWidth={iconStroke} aria-hidden />
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate('/app/notifications')}
          className={`relative ${topbarActionClass}`}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" strokeWidth={iconStroke} aria-hidden />
          {hasUnreadNotifications ? (
            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--accent-rose)] ring-[3px] ring-[var(--bg-elevated)]"
              aria-hidden
            />
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => navigate('/app/preferences')}
          className={`${topbarActionClass} ml-0.5 overflow-hidden p-[3px] hover:text-[var(--text-primary)]`}
          aria-label="Account and settings"
        >
          <div className="flex h-full w-full items-center justify-center rounded-[10px] p-[2px] shadow-inner" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}>
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-[var(--bg-elevated)] font-sora text-[14px] font-semibold text-[var(--text-primary)]">
              {userInitial.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
