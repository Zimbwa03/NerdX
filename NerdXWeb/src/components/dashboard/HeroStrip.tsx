import { ArrowRight, Flame, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

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

interface StatPillProps {
  icon: typeof Target;
  iconClass: string;
  value: string;
  label: string;
  ariaLabel: string;
}

function StatPill({ icon: Icon, iconClass, value, label, ariaLabel, isDark }: StatPillProps & { isDark: boolean }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-full border px-5 py-2.5"
      style={{
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(79,70,229,0.06)',
        borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(79,70,229,0.15)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      aria-label={ariaLabel}
    >
      <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} strokeWidth={1.5} aria-hidden />
      <div className="flex flex-col leading-none">
        <span className="font-jetbrains text-[18px] font-bold tabular-nums text-[var(--text-primary)]">
          {value}
        </span>
        <span className="mt-0.5 font-dm text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)]">
          {label}
        </span>
      </div>
    </div>
  );
}

export function HeroStrip({ firstName, masteryPercent, streakDays, creditsDisplay }: HeroStripProps) {
  const greet = greetingForHour(new Date());
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <section
      id="overview"
      className="animate-dash-fade-up relative mb-10 w-full overflow-hidden rounded-2xl opacity-0 [animation-fill-mode:forwards] scroll-mt-24"
      aria-labelledby="dash-hero-heading"
      style={{ minHeight: 160 }}
    >
      {/* Background gradient layers */}
      {isDark ? (
        <>
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #1C2440 0%, #0F1629 60%, #1a1f35 100%)' }}
            aria-hidden
          />
          {/* Radial brand glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 25% 50%, rgba(99,102,241,0.18) 0%, transparent 60%)' }}
            aria-hidden
          />
          {/* Right-side emerald hint */}
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)' }}
            aria-hidden
          />
          {/* Subtle top border */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5) 30%, rgba(99,102,241,0.5) 70%, transparent)' }}
            aria-hidden
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 rounded-2xl border border-[var(--border)]"
            style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F8FAFF 60%, #E0E7FF 100%)' }}
            aria-hidden
          />
          {/* Subtle brand glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 25% 50%, rgba(79,70,229,0.08) 0%, transparent 60%)' }}
            aria-hidden
          />
        </>
      )}

      {/* Content */}
      <div className="relative flex h-full flex-col justify-center gap-5 px-6 py-7 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8">
        {/* Left — Greeting + Hero heading + CTA */}
        <div className="min-w-0 flex-1">
          <p className="mb-2 font-dm text-[13px] font-medium text-[var(--text-secondary)]">
            {greet}, {firstName}{' '}
            <span aria-hidden>👋</span>
          </p>
          <h1
            id="dash-hero-heading"
            className="mb-4 font-sora text-[22px] font-extrabold leading-tight tracking-[-0.025em] text-[var(--text-primary)] md:text-[26px]"
          >
            Ready to master your ZIMSEC exams?
          </h1>
          <button
            type="button"
            onClick={() => navigate('/app/mathematics')}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-dm text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:translate-y-0 active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              boxShadow: '0 2px 12px rgba(16,185,129,0.4)',
            }}
            aria-label="Start studying"
          >
            Start Studying
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </button>
        </div>

        {/* Right — Stat pills */}
        <div className="flex flex-wrap items-center gap-3 md:flex-nowrap md:justify-end">
          <StatPill
            icon={Target}
            iconClass="text-[var(--brand)]"
            value={`${masteryPercent}%`}
            label="Mastery"
            ariaLabel={`Overall mastery: ${masteryPercent}%`}
            isDark={isDark}
          />
          <StatPill
            icon={Flame}
            iconClass="text-[var(--accent-gold)]"
            value={`${streakDays}`}
            label="Day streak"
            ariaLabel={`Study streak: ${streakDays} days`}
            isDark={isDark}
          />
          <StatPill
            icon={Zap}
            iconClass="text-[var(--accent-gold)]"
            value={creditsDisplay.toLocaleString()}
            label="Credits"
            ariaLabel={`Credits balance: ${creditsDisplay}`}
            isDark={isDark}
          />
        </div>
      </div>
    </section>
  );
}
