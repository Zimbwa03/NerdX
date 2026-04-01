import { Link } from 'react-router-dom';
import { ClipboardList, Film, GraduationCap, Mic, PlayCircle, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  credits: number;
};

const pills = [
  { Icon: Film, label: 'Slides' },
  { Icon: Mic, label: 'Voice' },
  { Icon: Users, label: 'Classmates' },
  { Icon: ClipboardList, label: 'Quizzes' },
];

export function ClassroomHero({ credits }: Props) {
  const formatted = credits.toLocaleString();

  return (
    <motion.header
      className="classroom-hero-shell font-dm text-classroom-text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative mx-auto flex min-h-[160px] max-w-[1400px] flex-col justify-center px-6 py-8 md:px-10 lg:px-10">
        <Link
          to="/app"
          className="mb-3 w-fit text-[13px] text-classroom-text-muted transition-colors hover:text-classroom-text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b0f]"
        >
          ← Dashboard
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-start gap-4">
            <div
              className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-classroom-border bg-classroom-elevated text-classroom-brand"
              aria-hidden="true"
            >
              <GraduationCap className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-sora text-3xl font-bold tracking-tight classroom-title-glow md:text-4xl">
                AI CLASSROOM
              </h1>
              <p className="mt-1 max-w-xl text-sm text-classroom-text-secondary">
                Projected slides · Live voice highlighting · AI classmates
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {pills.map(({ Icon: P, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-classroom-border bg-classroom-elevated px-3 py-1 text-xs font-medium text-classroom-text-secondary"
                  >
                    <P className="h-[13px] w-[13px] shrink-0 opacity-90" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:absolute lg:right-10 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col lg:items-end">
            <div
              className="inline-flex items-center gap-3 rounded-[10px] border border-amber-400/30 bg-classroom-elevated px-4 py-2.5"
              role="status"
              aria-label={`Credits balance ${formatted}`}
            >
              <Zap className="h-5 w-5 text-classroom-accent-ai" aria-hidden />
              <div className="flex flex-col leading-none">
                <span className="font-jetbrains text-xl font-bold text-classroom-accent-ai">{formatted}</span>
                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-classroom-text-muted">
                  Credits
                </span>
              </div>
            </div>
            <a
              href="#maic-session-preview"
              className="inline-flex items-center gap-1.5 text-[13px] text-classroom-text-secondary transition-colors hover:text-classroom-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b0f]"
            >
              <PlayCircle className="h-[13px] w-[13px] shrink-0" aria-hidden />
              How it works
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
