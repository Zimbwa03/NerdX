import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    secondary: '#03DAC6',
    tertiary: '#3700B3',
    error: '#B00020',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    accent: '#FF6B6B',
    success: '#4CAF50',
    warning: '#FF9800',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    secondary: '#03DAC6',
    tertiary: '#3700B3',
    error: '#CF6679',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    accent: '#FF6B6B',
    success: '#4CAF50',
    warning: '#FF9800',
  },
};

export const theme = lightTheme; // Default theme

