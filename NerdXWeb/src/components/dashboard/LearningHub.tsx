import type { ElementType } from 'react';
import { GraduationCap } from 'lucide-react';
import { SubjectCard } from './SubjectCard';

export interface LearningHubSubject {
  id: string;
  title: string;
  subtitle: string;
  icon: ElementType;
  masteryPercent?: number;
}

export interface LearningHubProps {
  selectedLevel: 'O Level' | 'A Level';
  onLevelChange: (level: 'O Level' | 'A Level') => void;
  subjects: LearningHubSubject[];
  onSubjectClick: (id: string) => void;
}

export function LearningHub({ selectedLevel, onLevelChange, subjects, onSubjectClick }: LearningHubProps) {
  return (
    <section
      id="learning-hub"
      className="animate-dash-fade-up mb-10 scroll-mt-24 opacity-0 [animation-delay:160ms] [animation-fill-mode:forwards]"
      aria-labelledby="learning-hub-title"
    >
      {/* Section header */}
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h2
            id="learning-hub-title"
            className="mb-1.5 flex items-center gap-2.5 font-sora text-[22px] font-bold tracking-[-0.02em] text-[var(--text-primary)]"
          >
            <GraduationCap
              className="h-6 w-6 shrink-0 text-[var(--brand)]"
              strokeWidth={1.5}
              aria-hidden
            />
            Learning Hub
          </h2>
          <p className="font-dm text-sm text-[var(--text-secondary)]">
            ZIMSEC &amp; Cambridge paths, one place.
          </p>
        </div>

        {/* Level toggle */}
        <div
          className="inline-flex h-10 w-fit max-w-full shrink-0 self-start sm:self-center"
          role="group"
          aria-label="Exam level"
        >
          <div className="flex h-full items-stretch gap-1 rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] p-1">
            {(['O Level', 'A Level'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onLevelChange(level)}
                className={`min-h-8 min-w-[5.5rem] rounded-md px-4 font-dm text-[13px] font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] active:scale-[0.98] sm:min-w-[6.25rem] ${
                  selectedLevel === level
                    ? 'bg-[var(--brand)] text-white shadow-[var(--shadow-brand,0_4px_20px_rgba(99,102,241,0.35))]'
                    : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }`}
                aria-pressed={selectedLevel === level}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subject cards grid — 3 cols desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s, i) => (
          <div
            key={s.id}
            className="animate-dash-fade-up opacity-0 [animation-fill-mode:forwards]"
            style={{ animationDelay: `${160 + i * 40}ms` }}
          >
            <SubjectCard
              id={s.id}
              title={s.title}
              subtitle={s.subtitle}
              icon={s.icon}
              masteryPercent={s.masteryPercent}
              onClick={() => onSubjectClick(s.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
