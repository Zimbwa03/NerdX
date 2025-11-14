// Theme configuration for NerdX App
import { Theme } from '../types';

export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#FF9800',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#F57C00',
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#90CAF9',
    secondary: '#BDBDBD',
    accent: '#FFB74D',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#BDBDBD',
    error: '#EF5350',
    success: '#4CAF50',
    warning: '#FF9800',
  },
};
