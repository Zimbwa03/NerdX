// Professional Color Theme System
// Dark Theme Colors (Default - Space Theme)
export const DarkColors = {
  // Space Theme - Deep Universe & Neon Accents
  primary: {
    main: '#7C4DFF', // Electric Violet
    light: '#B47CFF', // Soft Neon Purple
    dark: '#3F1DCB', // Deep Cosmos
    darker: '#12005E', // Black Hole
    contrastText: '#FFFFFF',
  },

  // Secondary Colors - Cyberpunk Accents
  secondary: {
    main: '#00E5FF', // Cyan Neon
    light: '#6EFFFF',
    dark: '#00B2CC',
    contrastText: '#000000',
  },

  // Success Colors
  success: {
    main: '#00E676', // Neon Green
    light: '#66FFA6',
    dark: '#00B248',
  },

  // Warning Colors
  warning: {
    main: '#FFC400', // Amber Neon
    light: '#FFF350',
    dark: '#C79400',
  },

  // Error Colors
  error: {
    main: '#FF1744', // Red Neon
    light: '#FF616F',
    dark: '#C4001D',
  },

  // Info Colors
  info: {
    main: '#2979FF', // Blue Neon
    light: '#75A7FF',
    dark: '#004ECB',
  },

  // Subject Colors - Neon Variants
  subjects: {
    mathematics: '#2979FF', // Electric Blue
    science: '#00E676', // Neon Green
    english: '#FF9100', // Neon Orange
    combinedScience: '#00E5FF', // Cyan
  },

  // Background Colors
  background: {
    default: '#0A0E21', // Deep Space Blue
    paper: '#1D1E33', // Dark Nebula
    dark: '#050510', // Void
    subtle: '#2D2F45', // Starlight Grey
  },

  // Text Colors
  text: {
    primary: '#FFFFFF', // White Star
    secondary: '#B0BEC5', // Stardust Grey
    disabled: '#546E7A',
    white: '#FFFFFF',
    hint: '#78909C',
  },

  // Border Colors
  border: {
    light: '#2D2F45',
    medium: '#455A64',
    dark: '#102027',
  },

  // Icon Background Colors
  iconBg: {
    mathematics: 'rgba(41, 121, 255, 0.15)',
    science: 'rgba(0, 230, 118, 0.15)',
    english: 'rgba(255, 145, 0, 0.15)',
    default: 'rgba(124, 77, 255, 0.15)',
  },

  // Gradients
  gradients: {
    primary: ['#7C4DFF', '#3F1DCB'] as [string, string], // Violet Nebula
    secondary: ['#00E5FF', '#00B2CC'] as [string, string], // Cyan Pulse
    success: ['#00E676', '#00B248'] as [string, string],
    warning: ['#FFC400', '#C79400'] as [string, string],
    error: ['#FF1744', '#C4001D'] as [string, string],
    dark: ['#1D1E33', '#0A0E21'] as [string, string], // Deep Space
    card: ['#2D2F45', '#1D1E33'] as [string, string],
  }
};

// Light Theme Colors
export const LightColors = {
  // Professional Purple Theme
  primary: {
    main: '#6200EE',
    light: '#9D46FF',
    dark: '#3700B3',
    darker: '#1A0066',
    contrastText: '#FFFFFF',
  },

  secondary: {
    main: '#03DAC6',
    light: '#66FFF9',
    dark: '#018786',
    contrastText: '#000000',
  },

  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },

  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },

  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },

  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
  },

  subjects: {
    mathematics: '#1976D2',
    science: '#388E3C',
    english: '#E65100',
    combinedScience: '#00796B',
  },

  // Light Background Colors
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
    dark: '#F5F5F5',
    subtle: '#EEEEEE',
  },

  // Text Colors for Light
  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    disabled: '#9E9E9E',
    white: '#FFFFFF',
    hint: '#9E9E9E',
  },

  // Border Colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#9E9E9E',
  },

  // Icon Background Colors
  iconBg: {
    mathematics: 'rgba(25, 118, 210, 0.1)',
    science: 'rgba(56, 142, 60, 0.1)',
    english: 'rgba(230, 81, 0, 0.1)',
    default: 'rgba(98, 0, 238, 0.1)',
  },

  // Gradients for Light
  gradients: {
    primary: ['#7C4DFF', '#6200EE'] as [string, string],
    secondary: ['#03DAC6', '#00796B'] as [string, string],
    success: ['#4CAF50', '#388E3C'] as [string, string],
    warning: ['#FF9800', '#F57C00'] as [string, string],
    error: ['#F44336', '#D32F2F'] as [string, string],
    dark: ['#E0E0E0', '#BDBDBD'] as [string, string],
    card: ['#FFFFFF', '#F5F5F5'] as [string, string],
  }
};

// Function to get colors based on theme
export const getColors = (isDarkMode: boolean) => isDarkMode ? DarkColors : LightColors;

// Default export (Dark theme for backward compatibility)
export const Colors = DarkColors;

export default Colors;
