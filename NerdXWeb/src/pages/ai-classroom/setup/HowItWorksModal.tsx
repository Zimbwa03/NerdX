import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function HowItWorksModal({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close dialog"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-it-works-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-classroom-border bg-classroom-surface p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="how-it-works-title" className="font-sora text-lg font-semibold text-classroom-text-primary">
                How AI Classroom works
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-classroom-text-secondary hover:bg-classroom-elevated hover:text-classroom-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-brand"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-classroom-text-secondary">
              <li>Pick your subject, form, and optional topic — we shape a ZIMSEC-style lesson outline.</li>
              <li>Slides project as the teacher explains; narration can track words on screen.</li>
              <li>Chido (your AI classmate) jumps in with questions so it feels like a real class.</li>
              <li>At the end, a quiz is marked with feedback — export notes anytime during the lesson.</li>
            </ol>
            <p className="mt-4 text-xs text-classroom-text-muted">
              Credits are used per lesson segment (~8 credits typical). Check your balance in the hero.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
