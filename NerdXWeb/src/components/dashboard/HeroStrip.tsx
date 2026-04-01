import { Flame, Target, Zap } from 'lucide-react';

export interface HeroStripProps {
  firstName: string;
  masteryPercent: number;
  streakDays: number;
  creditsDisplay: number;
}

function greetingForHour(date: Date) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HeroStrip({ firstName, masteryPercent, streakDays, creditsDisplay }: HeroStripProps) {
  const greet = greetingForHour(new Date());

  return (
    <section
      id="overview"
      className="animate-dash-fade-up relative mb-10 h-[140px] w-full overflow-hidden rounded-2xl border border-[var(--border)] opacity-0 [animation-fill-mode:forwards] scroll-mt-24"
      aria-labelledby="dash-hero-heading"
    >
      <div
        className="absolute inset-0 bg-[var(--bg-surface)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,78,59,0.55)_0%,transparent_55%,rgba(16,185,129,0.08)_100%)]"
        aria-hidden
      />
      <div
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.2)_0%,transparent_70%)]"
        aria-hidden
      />
      <div className="relative flex h-full flex-col justify-center gap-6 px-6 py-5 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8">
        <div className="min-w-0">
          <p className="mb-2 font-dm text-[13px] text-[var(--text-muted)]">
            {greet}, {firstName}{' '}
            <span aria-hidden>👋</span>
          </p>
          <h1 id="dash-hero-heading" className="font-sora text-2xl font-bold leading-tight text-[var(--text-primary)] md:text-[24px]">
            Ready to master your ZIMSEC exams?
          </h1>
        </div>
        <div className="flex flex-wrap gap-3 md:flex-nowrap md:justify-end">
          <div
            className="animate-dash-fade-up flex items-center gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--bg-elevated)] px-4 py-3 opacity-0 [animation-delay:40ms] [animation-fill-mode:forwards]"
          >
            <Target className="h-4 w-4 shrink-0 text-[var(--brand)]" strokeWidth={1.5} aria-hidden />
            <span className="text-xs text-[var(--text-secondary)]">Mastery</span>
            <span className="font-jetbrains text-sm font-semibold tabular-nums text-[var(--text-primary)]">
              {masteryPercent}%
            </span>
          </div>
          <div
            className="animate-dash-fade-up flex items-center gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--bg-elevated)] px-4 py-3 opacity-0 [animation-delay:80ms] [animation-fill-mode:forwards]"
          >
            <Flame className="h-4 w-4 shrink-0 text-[var(--accent-gold)]" strokeWidth={1.5} aria-hidden />
            <span className="text-xs text-[var(--text-secondary)]">Streak</span>
            <span className="font-jetbrains text-sm font-semibold tabular-nums text-[var(--text-primary)]">
              {streakDays} days
            </span>
          </div>
          <div
            className="animate-dash-fade-up flex items-center gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--bg-elevated)] px-4 py-3 opacity-0 [animation-delay:120ms] [animation-fill-mode:forwards]"
          >
            <Zap className="h-4 w-4 shrink-0 text-[var(--brand)]" strokeWidth={1.5} aria-hidden />
            <span className="text-xs text-[var(--text-secondary)]">Credits</span>
            <span className="font-jetbrains text-sm font-semibold tabular-nums text-[var(--brand)]">
              {creditsDisplay.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
