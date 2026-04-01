import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CORE_SUBJECTS,
  EXTRA_SUBJECTS,
  displayLabel,
  lineForSubject,
  subjectOptionFromLine,
  type LevelKind,
  type SubjectOption,
} from './subjectData';
import { SUBJECT_ICON_UNSELECTED, SUBJECT_PILL_SELECTED } from './subjectPillClasses';

function matchesSubjectPill(subject: string, opt: SubjectOption, level: LevelKind): boolean {
  const line = lineForSubject(opt, level);
  const s = subject.trim();
  if (s === line) return true;
  if (s.toLowerCase() === opt.apiName.toLowerCase()) return true;
  if (opt.id === 'math' && (/\bmaths?\b/i.test(s) || /\bmathematics\b/i.test(s))) return true;
  return false;
}

type Props = {
  subject: string;
  level: LevelKind;
  onSubjectChange: (value: string) => void;
};

function SubjectPill({
  opt,
  selected,
  level,
  onSelect,
}: {
  opt: SubjectOption;
  selected: boolean;
  level: LevelKind;
  onSelect: () => void;
}) {
  const Icon = opt.Icon;
  const selectedCls = SUBJECT_PILL_SELECTED[opt.id] ?? SUBJECT_PILL_SELECTED.bio;
  const iconTone = SUBJECT_ICON_UNSELECTED[opt.id] ?? 'text-classroom-text-secondary';

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      animate={{ scale: selected ? 1.02 : 1, opacity: selected ? 1 : 0.9 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className={`subject-pill--${opt.id} flex items-center gap-2 rounded-[10px] border px-4 py-2.5 text-left text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-brand focus-visible:ring-offset-2 focus-visible:ring-offset-classroom-surface ${
        selected ? selectedCls : 'border-classroom-border bg-classroom-elevated text-classroom-text-primary'
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${selected ? '' : iconTone}`} aria-hidden />
      {displayLabel(opt, level)}
    </motion.button>
  );
}

export function SubjectSelector({ subject, level, onSubjectChange }: Props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const customActive = Boolean(subject.trim() && !subjectOptionFromLine(subject));

  const visible = useMemo(
    () => (moreOpen ? [...CORE_SUBJECTS, ...EXTRA_SUBJECTS] : CORE_SUBJECTS),
    [moreOpen]
  );

  return (
    <div className="font-dm">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-classroom-text-muted">Subject</p>
      <div className="grid grid-cols-2 gap-2 sm:gap-3" role="radiogroup" aria-label="Subject">
        {visible.map((opt) => {
          const line = lineForSubject(opt, level);
          const selected = matchesSubjectPill(subject, opt, level);
          return (
            <SubjectPill
              key={opt.id}
              opt={opt}
              level={level}
              selected={selected}
              onSelect={() => onSubjectChange(line)}
            />
          );
        })}
      </div>
      <button
        type="button"
        className="mt-3 text-[13px] font-medium text-classroom-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-brand focus-visible:ring-offset-2 focus-visible:ring-offset-classroom-surface"
        onClick={() => setMoreOpen((o) => !o)}
        aria-expanded={moreOpen}
      >
        {moreOpen ? '← Fewer subjects' : '+ More subjects →'}
      </button>
      {moreOpen ? (
        <div className="mt-3">
          <label htmlFor="classroom-subject-custom" className="sr-only">
            Custom subject
          </label>
          <input
            id="classroom-subject-custom"
            value={customActive ? subject : ''}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="e.g. O Level Combined Science…"
            className="w-full rounded-xl border border-classroom-border bg-classroom-elevated px-4 py-3 text-sm text-classroom-text-primary placeholder:text-classroom-text-muted focus:border-classroom-brand focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {!customActive ? (
            <p className="mt-1.5 text-[11px] text-classroom-text-muted">
              Type a subject above if yours is not listed.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
