/**
 * NerdX Brand Kit — Themed Style Hooks
 * Updated to use the NerdX brand color system.
 */
import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getColors, type NerdXColors } from './colors';
import { getShadows } from './shadows';

export type ThemedColors = NerdXColors & { isDarkMode: boolean };

/**
 * Hook that returns NerdX brand colors for the current theme.
 *
 * Usage:
 *   const colors = useThemedColors();
 *   <View style={{ backgroundColor: colors.bgBase }}>
 */
export const useThemedColors = (): ThemedColors => {
  const { isDarkMode } = useTheme();
  return useMemo(() => ({
    ...getColors(isDarkMode),
    isDarkMode,
  }), [isDarkMode]);
};

/**
 * Returns StatusBar style string for the current theme.
 */
export const useStatusBarStyle = () => {
  const { isDarkMode } = useTheme();
  return isDarkMode ? 'light-content' : 'dark-content';
};

/**
 * Returns pre-built style objects using NerdX design tokens.
 */
export const useThemedStyles = () => {
  const colors = useThemedColors();
  const shadows = getShadows(colors.isDarkMode);

  return useMemo(() => ({
    /* ─── Layout ─── */
    container: {
      flex: 1,
      backgroundColor: colors.bgBase,
    },
    safeContainer: {
      flex: 1,
      backgroundColor: colors.bgBase,
    },

    /* ─── Cards ─── */
    card: {
      backgroundColor: colors.bgElevated,
      borderColor: colors.borderDefault,
      borderWidth: 1,
      borderRadius: 12,
      ...shadows.sm,
    },
    cardSurface: {
      backgroundColor: colors.bgSurface,
      borderColor: colors.borderSubtle,
      borderWidth: 1,
      borderRadius: 12,
    },

    /* ─── Text ─── */
    text: {
      color: colors.textPrimary,
    },
    textSecondary: {
      color: colors.textSecondary,
    },
    textTertiary: {
      color: colors.textTertiary,
    },
    textBrand: {
      color: colors.primary,
    },
    textWarning: {
      color: colors.warning,
    },
    textSuccess: {
      color: colors.success,
    },
    textDanger: {
      color: colors.danger,
    },

    /* ─── Input fields ─── */
    input: {
      backgroundColor: colors.bgSurface,
      borderColor: colors.borderDefault,
      borderWidth: 1.5,
      color: colors.textPrimary,
      borderRadius: 8,
    },
    inputFocused: {
      borderColor: colors.primary,
    },

    /* ─── Dividers ─── */
    divider: {
      backgroundColor: colors.borderSubtle,
      height: 1,
    },

    /* ─── Buttons ─── */
    btnPrimary: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      ...shadows.brand,
    },
    btnSuccess: {
      backgroundColor: colors.success,
      borderRadius: 8,
      ...shadows.success,
    },
    btnWarning: {
      backgroundColor: colors.warning,
      borderRadius: 8,
    },
    btnGhost: {
      backgroundColor: 'transparent',
      borderColor: colors.borderDefault,
      borderWidth: 1.5,
      borderRadius: 8,
    },
    btnText: {
      color: '#FFFFFF',
      fontWeight: '600' as const,
    },

    /* ─── Shadows ─── */
    shadow: shadows.md,
    shadowSm: shadows.sm,
    shadowLg: shadows.lg,
    shadowBrand: shadows.brand,

    /* ─── Gradients (arrays for LinearGradient) ─── */
    gradientBrand:   colors.gradientBrand,
    gradientSuccess: colors.gradientSuccess,
    gradientStreak:  colors.gradientStreak,
    gradientCredits: colors.gradientCredits,
    gradientHero:    colors.gradientHero,
  }), [colors, shadows]);
};

export default useThemedColors;
