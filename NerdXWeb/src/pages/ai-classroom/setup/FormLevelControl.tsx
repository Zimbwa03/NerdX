import { motion } from 'framer-motion';

export type FormLevelKind = 'O-Level' | 'A-Level';

type Props = {
  form: number;
  level: FormLevelKind;
  onFormChange: (n: number) => void;
  onLevelChange: (l: FormLevelKind) => void;
};

const FORMS = [1, 2, 3, 4, 5, 6] as const;

export function FormLevelControl({ form, level, onFormChange, onLevelChange }: Props) {
  return (
    <div className="font-dm">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-classroom-text-muted">
        Form / Level
      </p>
      <div
        className="relative flex flex-wrap gap-1 rounded-[10px] border border-classroom-border bg-classroom-elevated p-1"
        role="radiogroup"
        aria-label="Form"
      >
        {FORMS.map((n) => {
          const active = form === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onFormChange(n)}
              className={`relative flex h-9 min-w-[3.75rem] flex-1 items-center justify-center rounded-[7px] px-3 text-[13px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-brand focus-visible:ring-offset-2 focus-visible:ring-offset-classroom-elevated ${
                active ? 'z-[1] font-semibold text-white' : 'text-classroom-text-secondary'
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="maic-form-segment"
                  className="absolute inset-0 z-0 rounded-[7px] bg-classroom-brand shadow-[0_2px_8px_rgba(16,185,129,0.3)]"
                  transition={{ type: 'tween', ease: [0.4, 0, 0.2, 1], duration: 0.2 }}
                />
              ) : null}
              <span className="relative z-[1]">Form {n}</span>
            </button>
          );
        })}
      </div>

      <div
        className="mt-3 flex gap-1 rounded-lg border border-classroom-border bg-classroom-surface p-0.5"
        role="radiogroup"
        aria-label="Curriculum level"
      >
        {(['O-Level', 'A-Level'] as const).map((lv) => {
          const active = level === lv;
          return (
            <button
              key={lv}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onLevelChange(lv)}
              className={`flex-1 rounded-md py-1.5 text-center text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-brand focus-visible:ring-offset-2 focus-visible:ring-offset-classroom-surface ${
                active
                  ? 'bg-classroom-elevated text-classroom-text-primary'
                  : 'text-classroom-text-muted hover:text-classroom-text-secondary'
              }`}
            >
              {lv === 'O-Level' ? 'O Level' : 'A Level'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
