// Theme Context - Light/Dark Mode Toggle
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme colors definition
export interface ThemeColors {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    paper: string;
    card: string;
    text: string;
    textSecondary: string;
    textHint: string;
    border: string;
    borderLight: string;
    error: string;
    success: string;
    warning: string;
    info: string;
}

export interface Theme {
    isDark: boolean;
    colors: ThemeColors;
}

// Dark theme - Space/Cyberpunk theme (current default)
export const darkTheme: Theme = {
    isDark: true,
    colors: {
        primary: '#7C4DFF', // Electric Violet
        primaryLight: '#B47CFF',
        primaryDark: '#3F1DCB',
        secondary: '#00E5FF', // Cyan Neon
        accent: '#FF9100',
        background: '#0A0E21', // Deep Space Blue
        surface: '#1D1E33', // Dark Nebula
        paper: '#1D1E33',
        card: '#2D2F45',
        text: '#FFFFFF',
        textSecondary: '#B0BEC5',
        textHint: '#78909C',
        border: '#2D2F45',
        borderLight: '#2D2F45',
        error: '#FF1744',
        success: '#00E676',
        warning: '#FFC400',
        info: '#2979FF',
    },
};

// Light theme - Clean professional theme
export const lightTheme: Theme = {
    isDark: false,
    colors: {
        primary: '#6200EE', // Purple
        primaryLight: '#9D46FF',
        primaryDark: '#3700B3',
        secondary: '#03DAC6', // Teal
        accent: '#FF5722',
        background: '#FAFAFA', // Light grey
        surface: '#FFFFFF',
        paper: '#FFFFFF',
        card: '#F5F5F5',
        text: '#1A1A1A',
        textSecondary: '#666666',
        textHint: '#999999',
        border: '#E0E0E0',
        borderLight: '#F0F0F0',
        error: '#D32F2F',
        success: '#388E3C',
        warning: '#F57C00',
        info: '#1976D2',
    },
};

interface ThemeContextType {
    theme: Theme;
    isDarkMode: boolean;
    toggleTheme: () => void;
    setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@nerdx_theme_mode';

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

    // Load saved theme preference
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme !== null) {
                    setIsDarkMode(savedTheme === 'dark');
                } else {
                    // Use system preference if no saved preference
                    setIsDarkMode(systemColorScheme === 'dark');
                }
            } catch (error) {
                console.error('Failed to load theme preference:', error);
            }
        };
        loadTheme();
    }, [systemColorScheme]);

    // Save theme preference
    const saveThemePreference = async (isDark: boolean) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        saveThemePreference(newMode);
    };

    const setDarkMode = (value: boolean) => {
        setIsDarkMode(value);
        saveThemePreference(value);
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
