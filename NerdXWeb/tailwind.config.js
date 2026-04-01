/** @type {import('tailwindcss').Config} */
export default {
  // Scan app source so Tailwind utilities work outside the dashboard when you adopt them elsewhere.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'system-ui', 'sans-serif'],
        dm: ['DM Sans', 'system-ui', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        classroom: {
          base: '#080B0F',
          surface: '#0D1117',
          elevated: '#141B24',
          card: '#111827',
          border: '#1E2D3D',
          brand: '#10B981',
          'text-primary': '#E8F0FE',
          'text-secondary': '#7B8FA6',
          'text-muted': '#3D4F63',
          'accent-voice': '#818CF8',
          'accent-ai': '#F59E0B',
        },
      },
      boxShadow: {
        'classroom-brand': '0 0 16px rgba(16, 185, 129, 0.2)',
        'classroom-cta': '0 4px 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.15)',
        'classroom-cta-hover':
          '0 8px 30px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.2)',
      },
      keyframes: {
        'dash-fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'dash-pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        'classroom-shimmer': {
          '0%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '0.4' },
        },
        'launch-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        'dash-fade-up': 'dash-fade-up 0.45s ease-out forwards',
        'dash-pulse-dot': 'dash-pulse-dot 2s ease-in-out infinite',
        'classroom-shimmer': 'classroom-shimmer 1.5s ease-in-out infinite',
        'launch-shimmer': 'launch-shimmer 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
