/**
 * NerdX Theme Context
 * Provides dark/light mode with the full NerdX brand color system.
 * Dark mode is the default experience.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, getColors, type NerdXColors } from '../theme/colors';
import { darkShadows, lightShadows, getShadows } from '../theme/shadows';

export interface Theme {
  isDark: boolean;
  colors: NerdXColors;
  shadows: typeof darkShadows;
}

export const darkTheme: Theme = {
  isDark: true,
  colors: darkColors,
  shadows: darkShadows,
};

export const lightTheme: Theme = {
  isDark: false,
  colors: lightColors as NerdXColors,
  shadows: lightShadows,
};

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  colors: NerdXColors;
  shadows: typeof darkShadows;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@nerdx:theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark is default

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved !== null) {
          setIsDarkMode(saved === 'dark');
        } else {
          // Respect system preference on first launch
          setIsDarkMode(systemColorScheme !== 'light');
        }
      } catch {
        // Keep dark default on error
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  const saveTheme = async (isDark: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Silently fail
    }
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    saveTheme(next);
  };

  const setDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    saveTheme(value);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;
  const colors = getColors(isDarkMode);
  const shadows = getShadows(isDarkMode);

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, colors, shadows, toggleTheme, setDarkMode }}>
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
