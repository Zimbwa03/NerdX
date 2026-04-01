import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useMemo, useState } from 'react';

const DEFAULT_CHIPS = ['Fractions', 'Algebra', 'Geometry', 'Statistics'];

type Props = {
  value: string;
  onChange: (v: string) => void;
  suggestions?: string[];
};

export function TopicInput({ value, onChange, suggestions = DEFAULT_CHIPS }: Props) {
  const [focused, setFocused] = useState(false);
  const chips = useMemo(() => suggestions, [suggestions]);

  return (
    <div className="font-dm">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-widest text-classroom-text-muted">
          Topic (optional)
        </p>
        <p className="text-right text-[11px] italic text-classroom-text-muted">Leave blank for AI to choose</p>
      </div>
      <div
        className={`relative rounded-xl border bg-classroom-elevated transition-shadow ${
          focused
            ? 'border-classroom-brand shadow-[0_0_0_3px_rgba(16,185,129,0.15),0_0_20px_rgba(16,185,129,0.15)]'
            : 'border-classroom-border'
        }`}
      >
        <BookOpen
          className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
            focused ? 'text-classroom-brand' : 'text-classroom-text-muted'
          }`}
          aria-hidden
        />
        <input
          id="maic-topic"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="e.g. Approximation and Estimation"
          className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-4 text-sm text-classroom-text-primary placeholder:text-classroom-text-muted focus:outline-none"
        />
      </div>
      <AnimatePresence>
        {focused ? (
          <motion.div
            className="mt-2 flex flex-wrap gap-2"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.04 } },
            }}
          >
            {chips.map((c) => (
              <motion.button
                key={c}
                type="button"
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: { opacity: 1, y: 0 },
                }}
                className="rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-2.5 py-1 text-[11px] font-medium text-classroom-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-brand focus-visible:ring-offset-2 focus-visible:ring-offset-classroom-surface"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onChange(c)}
              >
                {c}
              </motion.button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
