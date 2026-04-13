/**
 * NerdX Brand Kit — Mobile Spacing & Radius System
 * Base unit: 4pt
 */

export const spacing = {
  0:  0,
  1:  4,    // xs
  2:  8,    // sm
  3:  12,
  4:  16,   // md (default padding)
  5:  20,
  6:  24,   // lg (card padding)
  8:  32,   // xl
  10: 40,
  12: 48,   // xxl
  16: 64,
  20: 80,
  24: 96,
} as const;

export const borderRadius = {
  sm:   4,    // badges, tags
  md:   8,    // buttons
  lg:   12,   // cards (mobile)
  xl:   16,   // modals, panels
  '2xl': 24,  // large cards
  full: 9999, // pill shapes
} as const;

export const iconSize = {
  xs:  14,  // inline text icons
  sm:  16,  // secondary UI icons
  md:  20,  // navigation, buttons (default)
  lg:  24,  // card icons
  xl:  32,  // empty states
  '2xl': 48, // subject icons, onboarding
} as const;

export const touchTarget = {
  min:       44,  // Apple HIG minimum
  preferred: 48,  // preferred for primary actions
} as const;

/* Backward-compatible aliases */
export const Spacing = {
  xs:  spacing[1],
  sm:  spacing[2],
  md:  spacing[4],
  lg:  spacing[6],
  xl:  spacing[8],
  xxl: spacing[12],
};

export const BorderRadius = {
  sm:    borderRadius.sm,
  md:    borderRadius.md,
  lg:    borderRadius.lg,
  xl:    borderRadius.xl,
  round: borderRadius.full,
};

export default { spacing, borderRadius, Spacing, BorderRadius };
