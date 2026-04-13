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
  const barW = useAnimatedPercent(masteryPercent > 0 ? masteryPercent : 0, 700, masteryPercent > 0);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col overflow-hidden rounded-[16px] border border-t-[3px] border-[var(--border)] bg-[var(--bg-elevated)] text-left transition-all duration-200 ease-out hover:-translate-y-[2px] hover:border-[var(--border-accent)] hover:bg-[var(--bg-hover)] hover:shadow-[var(--shadow-lg,0_8px_32px_rgba(0,0,0,0.5))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] active:scale-[0.99] active:translate-y-0 ${accent.hoverBorder}`}
      style={{ borderTopColor: accent.hex }}
      aria-label={`Open ${title}`}
    >
      {/* Card shine overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 60%)' }}
        aria-hidden
      />

      <div className="flex flex-col gap-4 p-6">
        {/* Subject icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] ${accent.iconBg} transition-transform duration-200 group-hover:scale-105`}
        >
          <Icon className={`h-6 w-6 ${accent.iconText}`} strokeWidth={1.5} aria-hidden />
        </div>

        {/* Title & tagline */}
        <div className="min-w-0 flex-1">
          <h3 className="font-sora text-[17px] font-bold leading-snug tracking-[-0.01em] text-[var(--text-primary)]">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 font-dm text-[13px] leading-relaxed text-[var(--text-secondary)]">
            {subtitle}
          </p>
        </div>

        {/* Progress section */}
        <div className="mt-auto pt-1">
          {/* Progress bar track */}
          <div
            className="mb-2.5 h-[4px] w-full overflow-hidden rounded-full bg-[var(--border-subtle,#1E2740)]"
            role="progressbar"
            aria-valuenow={Math.round(masteryPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${title} mastery: ${Math.round(masteryPercent)}%`}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${barW}%`,
                backgroundColor: accent.barColor,
                transition: 'width 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-dm text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--text-muted)]">
              {masteryPercent > 0 ? `${Math.round(masteryPercent)}% complete` : 'Not started'}
            </span>
            <ChevronRight
              className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
              strokeWidth={2}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </button>
  );
}
