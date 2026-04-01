/**
 * Maps subject ids to accent colors and Tailwind utility classes (no inline styles).
 */
export type SubjectAccentKey = keyof typeof SUBJECT_ACCENTS;

export const SUBJECT_ACCENTS = {
  mathematics: {
    hex: '#3B82F6',
    iconText: 'text-blue-500',
    iconBg: 'bg-blue-500/[0.15]',
    hoverBorder: 'hover:border-blue-500/40',
    barFrom: 'from-blue-500',
  },
  biology: {
    hex: '#10B981',
    iconText: 'text-emerald-500',
    iconBg: 'bg-emerald-500/[0.15]',
    hoverBorder: 'hover:border-emerald-500/40',
    barFrom: 'from-emerald-500',
  },
  chemistry: {
    hex: '#8B5CF6',
    iconText: 'text-violet-500',
    iconBg: 'bg-violet-500/[0.15]',
    hoverBorder: 'hover:border-violet-500/40',
    barFrom: 'from-violet-500',
  },
  physics: {
    hex: '#F59E0B',
    iconText: 'text-amber-500',
    iconBg: 'bg-amber-500/[0.15]',
    hoverBorder: 'hover:border-amber-500/40',
    barFrom: 'from-amber-500',
  },
  english: {
    hex: '#EC4899',
    iconText: 'text-pink-500',
    iconBg: 'bg-pink-500/[0.15]',
    hoverBorder: 'hover:border-pink-500/40',
    barFrom: 'from-pink-500',
  },
  geography: {
    hex: '#06B6D4',
    iconText: 'text-cyan-500',
    iconBg: 'bg-cyan-500/[0.15]',
    hoverBorder: 'hover:border-cyan-500/40',
    barFrom: 'from-cyan-500',
  },
  history: {
    hex: '#EF4444',
    iconText: 'text-red-500',
    iconBg: 'bg-red-500/[0.15]',
    hoverBorder: 'hover:border-red-500/40',
    barFrom: 'from-red-500',
  },
  accounting: {
    hex: '#F97316',
    iconText: 'text-orange-500',
    iconBg: 'bg-orange-500/[0.15]',
    hoverBorder: 'hover:border-orange-500/40',
    barFrom: 'from-orange-500',
  },
  commerce: {
    hex: '#84CC16',
    iconText: 'text-lime-500',
    iconBg: 'bg-lime-500/[0.15]',
    hoverBorder: 'hover:border-lime-500/40',
    barFrom: 'from-lime-500',
  },
  sciences: {
    hex: '#2DD4BF',
    iconText: 'text-teal-400',
    iconBg: 'bg-teal-400/[0.15]',
    hoverBorder: 'hover:border-teal-400/40',
    barFrom: 'from-teal-400',
  },
  computer_science: {
    hex: '#0EA5E9',
    iconText: 'text-sky-500',
    iconBg: 'bg-sky-500/[0.15]',
    hoverBorder: 'hover:border-sky-500/40',
    barFrom: 'from-sky-500',
  },
  business_enterprise_skills: {
    hex: '#34D399',
    iconText: 'text-emerald-400',
    iconBg: 'bg-emerald-400/[0.15]',
    hoverBorder: 'hover:border-emerald-400/40',
    barFrom: 'from-emerald-400',
  },
  project_assistant: {
    hex: '#10B981',
    iconText: 'text-[var(--brand)]',
    iconBg: 'bg-[var(--brand)]/15',
    hoverBorder: 'hover:border-[var(--brand)]/40',
    barFrom: 'from-emerald-500',
  },
  pure_mathematics: {
    hex: '#3B82F6',
    iconText: 'text-blue-500',
    iconBg: 'bg-blue-500/[0.15]',
    hoverBorder: 'hover:border-blue-500/40',
    barFrom: 'from-blue-500',
  },
} as const;

export function getSubjectAccent(id: string) {
  return SUBJECT_ACCENTS[id as SubjectAccentKey] ?? SUBJECT_ACCENTS.mathematics;
}
