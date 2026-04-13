/**
 * NerdX Brand Kit — Mobile Typography System
 *
 * Font families (must be loaded via @expo-google-fonts):
 *   PlusJakartaSans-* → Headings (display)
 *   DMSans-*          → Body / UI text
 *   JetBrainsMono-*   → Scores, IDs, credits, code
 */

export const fonts = {
  /* Display — Plus Jakarta Sans */
  display:  'PlusJakartaSans-ExtraBold',  // 800
  heading:  'PlusJakartaSans-Bold',       // 700
  semibold: 'DMSans-SemiBold',           // 600

  /* Body — DM Sans */
  medium:   'DMSans-Medium',    // 500
  regular:  'DMSans-Regular',   // 400

  /* Mono — JetBrains Mono */
  mono:     'JetBrainsMono-Bold',    // 700
  monoReg:  'JetBrainsMono-Regular', // 400
} as const;

/* Type scale (mobile — ~10% smaller than web) */
export const textStyles = {
  /* Headings */
  h1: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  h2: {
    fontFamily: fonts.heading,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  h3: {
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily: fonts.semibold,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: 0,
  },

  /* Body */
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0,
  },

  /* Labels */
  label: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },

  /* Numbers / Scores */
  score: {
    fontFamily: fonts.mono,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  scoreSmall: {
    fontFamily: fonts.mono,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  id: {
    fontFamily: fonts.monoReg,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.4,
  },

  /* Navigation */
  navLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0,
  },
} as const;

export type TextStyleKey = keyof typeof textStyles;
