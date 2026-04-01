import type { ElementType } from 'react';
import { ChevronRight } from 'lucide-react';
import { getSubjectAccent } from './subjectAccents';
import { useAnimatedPercent } from './useAnimatedPercent';

export interface SubjectCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: ElementType;
  masteryPercent?: number;
  onClick: () => void;
}

export function SubjectCard({ id, title, subtitle, icon: Icon, masteryPercent = 0, onClick }: SubjectCardProps) {
  const accent = getSubjectAccent(id);
  const barW = useAnimatedPercent(masteryPercent > 0 ? masteryPercent : 0, 800, masteryPercent > 0);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex h-24 w-full flex-col overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--bg-surface)] text-left shadow-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--bg-elevated)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] active:scale-[0.99] ${accent.hoverBorder} `}
      aria-label={`Open ${title}`}
    >
      <div className="flex min-h-0 flex-1 items-center gap-3 px-4 py-3 md:gap-4 md:px-5">
        <div
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl ${accent.iconBg}`}
        >
          <Icon className={`h-[22px] w-[22px] ${accent.iconText}`} strokeWidth={1.5} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-sora text-[15px] font-semibold leading-snug text-[var(--text-primary)]">{title}</h3>
          <p className="mt-0.5 line-clamp-2 font-dm text-xs leading-relaxed text-[var(--text-secondary)]">{subtitle}</p>
        </div>
        <ChevronRight
          className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-1"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
      {masteryPercent > 0 ? (
        <div className="h-0.5 w-full bg-[var(--bg-elevated)] px-0" aria-hidden>
          <svg
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            className="h-0.5 w-full text-[var(--brand)]"
            aria-hidden
          >
            <rect x="0" y="0" width={barW} height="2" fill="currentColor" rx="1" />
          </svg>
        </div>
      ) : null}
    </button>
  );
}
