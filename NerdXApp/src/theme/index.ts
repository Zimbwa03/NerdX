/**
 * NerdX Brand Kit — Mobile Theme System
 * Single import for all design tokens.
 *
 * Usage:
 *   import { useTheme } from '../theme';
 *   const { colors, typography, spacing, shadows } = useTheme();
 */

export { darkColors, lightColors, subjectColors, getColors, getSubjectColor } from './colors';
export type { NerdXColors, SubjectColorKey } from './colors';

export { fonts, textStyles } from './typography';
export type { TextStyleKey } from './typography';

export { spacing, borderRadius, iconSize, touchTarget, Spacing, BorderRadius } from './spacing';

export { darkShadows, lightShadows, getShadows, Shadows } from './shadows';

/* Re-export theme context hook */
export { useTheme } from '../context/ThemeContext';
