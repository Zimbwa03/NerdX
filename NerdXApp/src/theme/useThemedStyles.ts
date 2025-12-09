// useThemedStyles Hook - Provides theme-aware colors for screens
import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getColors, DarkColors, LightColors } from './colors';

export type ThemedColors = typeof DarkColors;

/**
 * Hook that returns colors based on current theme
 * Use this in screens to get theme-aware colors
 * 
 * Usage:
 * const colors = useThemedColors();
 * <View style={{ backgroundColor: colors.background.default }}>
 */
export const useThemedColors = (): ThemedColors & { isDarkMode: boolean } => {
    const { isDarkMode } = useTheme();

    const colors = useMemo(() => {
        return {
            ...getColors(isDarkMode),
            isDarkMode,
        };
    }, [isDarkMode]);

    return colors;
};

/**
 * Get StatusBar style based on theme
 */
export const useStatusBarStyle = () => {
    const { isDarkMode } = useTheme();
    return isDarkMode ? 'light-content' : 'dark-content';
};

/**
 * Get dynamic styles for common UI elements
 */
export const useThemedStyles = () => {
    const colors = useThemedColors();

    return useMemo(() => ({
        container: {
            flex: 1,
            backgroundColor: colors.background.default,
        },
        card: {
            backgroundColor: colors.background.paper,
            borderColor: colors.border.light,
            borderWidth: 1,
        },
        text: {
            color: colors.text.primary,
        },
        textSecondary: {
            color: colors.text.secondary,
        },
        input: {
            backgroundColor: colors.background.subtle,
            borderColor: colors.border.medium,
            color: colors.text.primary,
        },
        divider: {
            backgroundColor: colors.border.light,
            height: 1,
        },
        button: {
            backgroundColor: colors.primary.main,
        },
        buttonText: {
            color: '#FFFFFF',
        },
        shadow: colors.isDarkMode ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        } : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
        },
        // Helper to get the right gradient colors
        getGradient: (type: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'dark' | 'card') => {
            return colors.gradients[type];
        },
    }), [colors]);
};

export default useThemedColors;
