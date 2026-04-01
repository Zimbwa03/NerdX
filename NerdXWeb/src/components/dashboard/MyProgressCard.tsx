import { useId } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { SubjectProgress } from '../../services/dashboardDataService';
import { getSubjectAccent } from './subjectAccents';
import { useAnimatedPercent } from './useAnimatedPercent';

export interface MyProgressCardProps {
  loading?: boolean;
  subjects: SubjectProgress[];
  nextStudyPlan: string;
}

function masteryLabel(pct: number): { text: string; className: string } {
  if (pct >= 75) return { text: 'Mastered', className: 'bg-emerald-500/15 text-emerald-400' };
  if (pct >= 50) return { text: 'Proficient', className: 'bg-sky-500/15 text-sky-400' };
  if (pct >= 25) return { text: 'Developing', className: 'bg-amber-500/15 text-amber-400' };
  return { text: 'Beginner', className: 'bg-[var(--bg-elevated)] text-[var(--text-muted)]' };
}

function ProgressRow({ item }: { item: SubjectProgress }) {
  const accent = getSubjectAccent(item.subject);
  const label = masteryLabel(item.value);
  const w = useAnimatedPercent(item.value, 800, true);
  const uid = useId().replace(/:/g, '');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-dm text-sm font-semibold text-[var(--text-primary)]">{item.label}</span>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 font-dm text-[11px] font-medium ${label.className}`}
          >
            {label.text}
          </span>
          <span className="font-jetbrains text-[13px] tabular-nums text-[var(--text-secondary)]">{item.value}%</span>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]" role="presentation">
        <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="h-2 w-full" aria-hidden>
          <defs>
            <linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accent.hex} />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width={w} height="8" fill={`url(#${uid})`} rx="4" />
        </svg>
      </div>
    </div>
  );
}

export function MyProgressCard({ loading, subjects, nextStudyPlan }: MyProgressCardProps) {
  return (
    <section
      id="progress"
      className="animate-dash-fade-up mb-10 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-7 opacity-0 [animation-delay:320ms] [animation-fill-mode:forwards]"
      aria-labelledby="my-progress-title"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="my-progress-title" className="font-sora text-[17px] font-semibold text-[var(--text-primary)]">
            My Progress
          </h2>
          <p className="mt-1 font-dm text-xs text-[var(--text-secondary)]">Mastery across your subjects</p>
        </div>
        <Link
          to="/app/progress"
          className="inline-flex items-center gap-1 font-dm text-sm font-medium text-[var(--text-muted)] underline-offset-4 hover:text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] sm:shrink-0"
          aria-label="Open detailed progress view"
        >
          Detailed View <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </Link>
      </div>

      {loading ? (
        <p className="font-dm text-sm text-[var(--text-secondary)]">Loading progress…</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {subjects.map((s) => (
              <ProgressRow key={`${s.subject}-${s.label}`} item={s} />
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
            <h3 className="mb-1 font-sora text-sm font-semibold text-[var(--text-primary)]">Next study plan</h3>
            <p className="font-dm text-sm leading-relaxed text-[var(--text-secondary)]">{nextStudyPlan}</p>
            <Link
              to="/app/progress"
              className="mt-4 inline-flex items-center gap-1 font-dm text-sm font-medium text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-elevated)]"
              aria-label="Start a study session from progress page"
            >
              Continue learning <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
