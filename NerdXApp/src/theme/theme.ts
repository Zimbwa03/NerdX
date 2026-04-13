/**
 * NerdX Brand Kit — React Navigation theme compatibility
 * These theme objects match the React Navigation `Theme` interface.
 */
import type { Theme } from '@react-navigation/native';

export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary:    '#4F46E5',  // Indigo
    background: '#F8FAFF',
    card:       '#FFFFFF',
    text:       '#0F172A',
    border:     '#D1D9F0',
    notification: '#F43F5E',
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary:    '#6366F1',  // Indigo
    background: '#0A0E1A',
    card:       '#0F1629',
    text:       '#F0F4FF',
    border:     '#2A3558',
    notification: '#F43F5E',
  },
};
