/**
 * NerdX Brand Kit — Subject accent colors & Tailwind utility classes.
 * Each subject has a unique color identity per the design system spec.
 */

export type SubjectAccentKey = keyof typeof SUBJECT_ACCENTS;

export const SUBJECT_ACCENTS = {
  mathematics: {
    hex: '#F59E0B',            // Amber
    iconText: 'text-amber-400',
    iconBg: 'bg-amber-400/[0.15]',
    hoverBorder: 'hover:border-amber-400/40',
    barColor: '#F59E0B',
  },
  biology: {
    hex: '#10B981',            // Emerald
    iconText: 'text-emerald-500',
    iconBg: 'bg-emerald-500/[0.15]',
    hoverBorder: 'hover:border-emerald-500/40',
    barColor: '#10B981',
  },
  chemistry: {
    hex: '#8B5CF6',            // Violet
    iconText: 'text-violet-500',
    iconBg: 'bg-violet-500/[0.15]',
    hoverBorder: 'hover:border-violet-500/40',
    barColor: '#8B5CF6',
  },
  physics: {
    hex: '#0EA5E9',            // Sky
    iconText: 'text-sky-400',
    iconBg: 'bg-sky-400/[0.15]',
    hoverBorder: 'hover:border-sky-400/40',
    barColor: '#0EA5E9',
  },
  english: {
    hex: '#EC4899',            // Pink
    iconText: 'text-pink-500',
    iconBg: 'bg-pink-500/[0.15]',
    hoverBorder: 'hover:border-pink-500/40',
    barColor: '#EC4899',
  },
  sciences: {
    hex: '#14B8A6',            // Teal — Combined Science
    iconText: 'text-teal-500',
    iconBg: 'bg-teal-500/[0.15]',
    hoverBorder: 'hover:border-teal-500/40',
    barColor: '#14B8A6',
  },
  geography: {
    hex: '#22C55E',            // Green
    iconText: 'text-green-500',
    iconBg: 'bg-green-500/[0.15]',
    hoverBorder: 'hover:border-green-500/40',
    barColor: '#22C55E',
  },
  commerce: {
    hex: '#F97316',            // Orange
    iconText: 'text-orange-500',
    iconBg: 'bg-orange-500/[0.15]',
    hoverBorder: 'hover:border-orange-500/40',
    barColor: '#F97316',
  },
  accounting: {
    hex: '#A78BFA',            // Light Violet
    iconText: 'text-violet-400',
    iconBg: 'bg-violet-400/[0.15]',
    hoverBorder: 'hover:border-violet-400/40',
    barColor: '#A78BFA',
  },
  computer_science: {
    hex: '#06B6D4',            // Cyan
    iconText: 'text-cyan-400',
    iconBg: 'bg-cyan-400/[0.15]',
    hoverBorder: 'hover:border-cyan-400/40',
    barColor: '#06B6D4',
  },
  business_enterprise_skills: {
    hex: '#FB923C',            // Orange-red
    iconText: 'text-orange-400',
    iconBg: 'bg-orange-400/[0.15]',
    hoverBorder: 'hover:border-orange-400/40',
    barColor: '#FB923C',
  },
  history: {
    hex: '#DC2626',            // Red
    iconText: 'text-red-500',
    iconBg: 'bg-red-500/[0.15]',
    hoverBorder: 'hover:border-red-500/40',
    barColor: '#DC2626',
  },
  project_assistant: {
    hex: '#10B981',
    iconText: 'text-emerald-500',
    iconBg: 'bg-emerald-500/[0.15]',
    hoverBorder: 'hover:border-emerald-500/40',
    barColor: '#10B981',
  },
  pure_mathematics: {
    hex: '#6366F1',            // Indigo — A Level Pure Math
    iconText: 'text-indigo-400',
    iconBg: 'bg-indigo-400/[0.15]',
    hoverBorder: 'hover:border-indigo-400/40',
    barColor: '#6366F1',
  },
} as const;

export function getSubjectAccent(id: string) {
  return SUBJECT_ACCENTS[id as SubjectAccentKey] ?? SUBJECT_ACCENTS.mathematics;
}
