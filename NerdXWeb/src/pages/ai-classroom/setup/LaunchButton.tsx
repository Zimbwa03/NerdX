import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Loader2 } from 'lucide-react';

type Props = {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  creditsLabel: string;
};

export function LaunchButton({ loading, disabled, onClick, creditsLabel }: Props) {
  const busy = loading || disabled;

  return (
    <div className="flex flex-col items-center font-dm">
      <motion.button
        type="button"
        disabled={busy}
        onClick={onClick}
        aria-busy={loading}
        aria-describedby="maic-launch-credits-hint"
        whileHover={busy ? undefined : { y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`group ac-launch-btn relative flex h-[52px] min-w-[280px] items-center justify-center gap-3 rounded-[14px] bg-gradient-to-br from-emerald-700 via-emerald-500 to-emerald-400 px-8 font-sora text-[15px] font-semibold text-white shadow-classroom-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-brand focus-visible:ring-offset-2 focus-visible:ring-offset-classroom-surface ${
          busy
            ? 'cursor-not-allowed opacity-80'
            : 'cursor-pointer hover:shadow-classroom-cta-hover'
        } ${loading ? 'ac-launch-btn--loading' : ''}`}
      >
        {loading ? (
          <Loader2 className="relative z-[1] h-[18px] w-[18px] shrink-0 animate-spin" aria-hidden />
        ) : (
          <GraduationCap className="relative z-[1] h-[18px] w-[18px] shrink-0" aria-hidden />
        )}
        <span className="relative z-[1]">{loading ? 'Preparing your classroom...' : 'Start Classroom Session'}</span>
        {loading ? null : (
          <ArrowRight
            className="relative z-[1] h-4 w-4 text-white/70 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          />
        )}
      </motion.button>
      <p id="maic-launch-credits-hint" className="mt-3 text-center text-[11px] text-classroom-text-muted">
        ⚡ ~8 credits per lesson segment · Balance: {creditsLabel}
      </p>
      {loading ? (
        <span className="sr-only" role="status" aria-live="polite">
          Preparing classroom
        </span>
      ) : null}
    </div>
  );
}
