/**
 * NerdX Brand Kit — Mobile Color Tokens
 * "Academic Precision meets Youthful Energy"
 * Primary Brand: Indigo (#6366F1 dark / #4F46E5 light)
 */

/* ════════════════════════════════════════
   DARK MODE — Default & Primary Experience
   ════════════════════════════════════════ */
export const darkColors = {
  /* Backgrounds (layered depth system) */
  bgBase:        '#0A0E1A',  // Deepest — page base
  bgElevated:    '#0F1629',  // Cards, panels
  bgOverlay:     '#161D35',  // Modals, dropdowns
  bgSurface:     '#1C2440',  // Input fields, secondary cards
  bgHover:       '#232C4A',  // Hover states
  bgActive:      '#2A3558',  // Active / selected

  /* Borders */
  borderSubtle:  '#1E2740',
  borderDefault: '#2A3558',
  borderStrong:  '#3D4F7C',
  borderBrand:   '#4F46E5',

  /* Text */
  textPrimary:   '#F0F4FF',
  textSecondary: '#8B9CC8',
  textTertiary:  '#5A6A94',
  textInverse:   '#0A0E1A',
  textLink:      '#818CF8',
  textBrand:     '#6366F1',

  /* Primary — Indigo (brand identity, active states) */
  primary:        '#6366F1',
  primaryHover:   '#4F46E5',
  primarySubtle:  '#1E1B4B',
  primaryGlow:    'rgba(99, 102, 241, 0.25)',

  /* Success — Emerald (correct answers, streaks, CTAs) */
  success:        '#10B981',
  successHover:   '#059669',
  successSubtle:  '#022C22',
  successGlow:    'rgba(16, 185, 129, 0.25)',

  /* Warning — Amber (credits, rewards, badges) */
  warning:        '#F59E0B',
  warningHover:   '#D97706',
  warningSubtle:  '#1C1400',

  /* Danger — Coral (errors, low credits) */
  danger:         '#F43F5E',
  dangerSubtle:   '#1F0A10',

  /* Info — Sky (hints, help) */
  info:           '#0EA5E9',
  infoSubtle:     '#082034',

  /* Gradients (as arrays for LinearGradient) */
  gradientBrand:   ['#4F46E5', '#7C3AED'] as [string, string],
  gradientSuccess: ['#059669', '#10B981'] as [string, string],
  gradientStreak:  ['#F59E0B', '#EF4444'] as [string, string],
  gradientCredits: ['#10B981', '#059669'] as [string, string],
  gradientHero:    ['#0F1629', '#1C2440'] as [string, string],
};

/* ════════════════════════════════════════
   LIGHT MODE — Premium & Crisp
   ════════════════════════════════════════ */
export const lightColors = {
  /* Backgrounds */
  bgBase:        '#F8FAFF',
  bgElevated:    '#FFFFFF',
  bgOverlay:     '#FFFFFF',
  bgSurface:     '#F1F5FF',
  bgHover:       '#E8EEFF',
  bgActive:      '#DDE4FF',

  /* Borders */
  borderSubtle:  '#E8EEFF',
  borderDefault: '#D1D9F0',
  borderStrong:  '#A5B4D4',
  borderBrand:   '#6366F1',

  /* Text */
  textPrimary:   '#0F172A',
  textSecondary: '#475569',
  textTertiary:  '#94A3B8',
  textInverse:   '#FFFFFF',
  textLink:      '#4F46E5',
  textBrand:     '#4F46E5',

  /* Primary */
  primary:        '#4F46E5',
  primaryHover:   '#4338CA',
  primarySubtle:  '#EEF2FF',
  primaryGlow:    'rgba(79, 70, 229, 0.15)',

  /* Success */
  success:        '#059669',
  successHover:   '#047857',
  successSubtle:  '#ECFDF5',
  successGlow:    'rgba(5, 150, 105, 0.15)',

  /* Warning */
  warning:        '#D97706',
  warningHover:   '#B45309',
  warningSubtle:  '#FFFBEB',

  /* Danger */
  danger:         '#DC2626',
  dangerSubtle:   '#FEF2F2',

  /* Info */
  info:           '#0284C7',
  infoSubtle:     '#F0F9FF',

  /* Gradients */
  gradientBrand:   ['#4F46E5', '#6366F1'] as [string, string],
  gradientSuccess: ['#047857', '#059669'] as [string, string],
  gradientStreak:  ['#D97706', '#DC2626'] as [string, string],
  gradientCredits: ['#059669', '#047857'] as [string, string],
  gradientHero:    ['#EEF2FF', '#F8FAFF'] as [string, string],
};

/* ════════════════════════════════════════
   SUBJECT COLORS — theme-independent
   Each subject has a unique visual identity
   ════════════════════════════════════════ */
export const subjectColors = {
  mathematics:             '#F59E0B',  // Amber
  biology:                 '#10B981',  // Emerald
  chemistry:               '#8B5CF6',  // Violet
  physics:                 '#0EA5E9',  // Sky
  english:                 '#EC4899',  // Pink
  sciences:                '#14B8A6',  // Teal — Combined Science
  geography:               '#22C55E',  // Green
  commerce:                '#F97316',  // Orange
  accounting:              '#A78BFA',  // Light Violet
  computer_science:        '#06B6D4',  // Cyan
  business_enterprise_skills: '#FB923C', // Orange-Red
  history:                 '#DC2626',  // Red
  pure_mathematics:        '#6366F1',  // Indigo — A Level
};

export type SubjectColorKey = keyof typeof subjectColors;

export function getSubjectColor(id: string): string {
  return subjectColors[id as SubjectColorKey] ?? subjectColors.mathematics;
}

/* Helper: get colors for current theme */
export function getColors(isDarkMode: boolean) {
  return isDarkMode ? darkColors : lightColors;
}

export type NerdXColors = typeof darkColors;

export const Colors = darkColors;
export default Colors;
