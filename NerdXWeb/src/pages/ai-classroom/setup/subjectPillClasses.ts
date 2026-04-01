/** Tailwind classes for selected subject pills (no inline styles). */
export const SUBJECT_PILL_SELECTED: Record<string, string> = {
  math: 'border-2 border-blue-500 bg-blue-500/[0.12] text-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.2)]',
  bio: 'border-2 border-emerald-500 bg-emerald-500/[0.12] text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.2)]',
  chem: 'border-2 border-violet-500 bg-violet-500/[0.12] text-violet-300 shadow-[0_0_16px_rgba(139,92,246,0.2)]',
  phys: 'border-2 border-amber-500 bg-amber-500/[0.12] text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.2)]',
  eng: 'border-2 border-pink-500 bg-pink-500/[0.12] text-pink-400 shadow-[0_0_16px_rgba(236,72,153,0.2)]',
  geo: 'border-2 border-cyan-500 bg-cyan-500/[0.12] text-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.2)]',
  acc: 'border-2 border-indigo-500 bg-indigo-500/[0.12] text-indigo-300 shadow-[0_0_16px_rgba(99,102,241,0.2)]',
  hist: 'border-2 border-orange-500 bg-orange-500/[0.12] text-orange-400 shadow-[0_0_16px_rgba(249,115,22,0.2)]',
};

export const SUBJECT_ICON_UNSELECTED: Record<string, string> = {
  math: 'text-blue-400/80',
  bio: 'text-emerald-400/80',
  chem: 'text-violet-300/80',
  phys: 'text-amber-400/80',
  eng: 'text-pink-400/80',
  geo: 'text-cyan-400/80',
  acc: 'text-indigo-300/80',
  hist: 'text-orange-400/80',
};

export const SUBJECT_ROW_CIRCLE: Record<string, string> = {
  math: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
  bio: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  chem: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  phys: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  eng: 'border-pink-500/40 bg-pink-500/10 text-pink-400',
  geo: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
  acc: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
  hist: 'border-orange-500/40 bg-orange-500/10 text-orange-400',
};
