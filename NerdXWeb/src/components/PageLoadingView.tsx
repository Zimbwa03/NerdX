/**
 * Full-page or section loading state with animated ring (Suspense + data fetching).
 */
export interface PageLoadingViewProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function PageLoadingView({
  title = 'Loading…',
  subtitle,
  className = '',
}: PageLoadingViewProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex min-h-[min(55vh,420px)] flex-col items-center justify-center gap-6 px-6 py-12 ${className}`}
    >
      <div className="relative h-16 w-16" aria-hidden>
        <div className="absolute inset-0 rounded-full bg-emerald-500/[0.12]" />
        <div
          className="absolute inset-0 animate-spin rounded-full border-[3px] border-emerald-500/20 border-t-emerald-500"
          style={{ animationDuration: '0.9s' }}
        />
        <div className="absolute inset-2 rounded-full border border-white/[0.06]" />
      </div>
      <div className="max-w-sm text-center">
        <p className="font-sora text-base font-semibold tracking-tight text-slate-100">{title}</p>
        {subtitle ? <p className="mt-2 text-sm leading-relaxed text-slate-400">{subtitle}</p> : null}
      </div>
    </div>
  );
}
