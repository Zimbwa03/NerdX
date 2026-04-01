import type { ElementType } from 'react';
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
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h2 id="learning-hub-title" className="mb-2 font-sora text-[22px] font-semibold text-[var(--text-primary)]">
            Learning Hub
          </h2>
          <p className="font-dm text-sm text-[var(--text-secondary)]">ZIMSEC &amp; Cambridge paths, one place.</p>
        </div>
        <div
          className="inline-flex h-10 w-fit max-w-full shrink-0 self-start sm:self-center"
          role="group"
          aria-label="Exam level"
        >
          <div className="flex h-full items-stretch gap-0.5 rounded-[10px] border border-[var(--border)] bg-[var(--bg-surface)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <button
              type="button"
              onClick={() => onLevelChange('O Level')}
              className={`min-h-8 min-w-[5.5rem] rounded-md px-4 font-dm text-[13px] font-semibold tracking-tight transition-[color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] active:scale-[0.98] sm:min-w-[6.25rem] ${
                selectedLevel === 'O Level'
                  ? 'bg-[var(--brand)] text-white shadow-[0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.14)]'
                  : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
              } `}
              aria-pressed={selectedLevel === 'O Level'}
            >
              O Level
            </button>
            <button
              type="button"
              onClick={() => onLevelChange('A Level')}
              className={`min-h-8 min-w-[5.5rem] rounded-md px-4 font-dm text-[13px] font-semibold tracking-tight transition-[color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] active:scale-[0.98] sm:min-w-[6.25rem] ${
                selectedLevel === 'A Level'
                  ? 'bg-[var(--brand)] text-white shadow-[0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.14)]'
                  : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
              } `}
              aria-pressed={selectedLevel === 'A Level'}
            >
              A Level
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <SubjectCard
            key={s.id}
            id={s.id}
            title={s.title}
            subtitle={s.subtitle}
            icon={s.icon}
            masteryPercent={s.masteryPercent}
            onClick={() => onSubjectClick(s.id)}
          />
        ))}
      </div>
    </section>
  );
}
