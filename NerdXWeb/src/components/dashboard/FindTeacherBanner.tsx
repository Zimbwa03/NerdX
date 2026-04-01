import { ArrowRight, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface FindTeacherBannerProps {
  teachersOnline?: number;
}

export function FindTeacherBanner({ teachersOnline = 47 }: FindTeacherBannerProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="animate-dash-fade-up relative mb-10 h-20 w-full overflow-hidden rounded-xl border border-[var(--border)] text-left opacity-0 [animation-delay:80ms] [animation-fill-mode:forwards] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
      onClick={() => navigate('/app/marketplace')}
      aria-label="Find a teacher — browse verified ZIMSEC and Cambridge tutors"
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(135deg,#065F46_0%,#0F4C5C_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(135deg,white_0,white_1px,transparent_1px,transparent_6px)]"
        aria-hidden
      />
      <span className="relative flex h-full items-center justify-between gap-4 px-4 md:px-6">
        <span className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm md:h-[36px] md:w-[36px]">
            <GraduationCap className="h-[18px] w-[18px] text-white md:h-5 md:w-5" strokeWidth={1.5} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="mb-0.5 flex flex-wrap items-center gap-2">
              <span className="font-sora text-base font-semibold text-white">Find a Teacher</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-2 py-0.5 text-[11px] font-medium text-emerald-100">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-dash-pulse-dot"
                  aria-hidden
                />
                {teachersOnline} teachers online
              </span>
            </span>
            <span className="block truncate text-xs text-emerald-200 md:text-[12px]">
              Book live lessons with verified ZIMSEC &amp; Cambridge teachers
            </span>
          </span>
        </span>
        <span className="pointer-events-none shrink-0 rounded-xl bg-white px-4 py-2.5 font-dm text-sm font-semibold text-[#065F46] shadow-sm">
          Browse Teachers{' '}
          <ArrowRight className="ml-1 inline h-4 w-4 align-text-bottom" strokeWidth={1.5} aria-hidden />
        </span>
      </span>
    </button>
  );
}
