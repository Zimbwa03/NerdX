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
        /* Headings — Plus Jakarta Sans (confident, geometric, premium) */
        sora: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        /* Body — DM Sans (readable, friendly, precise) */
        dm: ['DM Sans', 'system-ui', 'sans-serif'],
        /* Mono — JetBrains Mono (scores, IDs, code) */
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
        /* NerdX Brand Kit animations */
        'nx-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'nx-scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'nx-glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(99,102,241,0)' },
          '50%': { boxShadow: '0 0 20px rgba(99,102,241,0.4)' },
        },
        'nx-success-pulse': {
          '0%': { boxShadow: '0 0 0 rgba(16,185,129,0)' },
          '50%': { boxShadow: '0 0 20px rgba(16,185,129,0.4)' },
          '100%': { boxShadow: '0 0 0 rgba(16,185,129,0)' },
        },
        'nx-credits-tick': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        'nx-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-4px)' },
          '30%': { transform: 'translateX(4px)' },
          '45%': { transform: 'translateX(-3px)' },
          '60%': { transform: 'translateX(3px)' },
          '75%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
        },
        'nx-counter': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'dash-fade-up': 'dash-fade-up 0.45s ease-out forwards',
        'dash-pulse-dot': 'dash-pulse-dot 2s ease-in-out infinite',
        'classroom-shimmer': 'classroom-shimmer 1.5s ease-in-out infinite',
        'launch-shimmer': 'launch-shimmer 1.2s ease-in-out infinite',
        /* NerdX Brand Kit */
        'nx-fade-in': 'nx-fade-in 0.4s cubic-bezier(0,0,0.2,1) forwards',
        'nx-scale-in': 'nx-scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'nx-glow-pulse': 'nx-glow-pulse 2s ease-in-out infinite',
        'nx-success-pulse': 'nx-success-pulse 0.5s ease-out forwards',
        'nx-credits-tick': 'nx-credits-tick 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        'nx-shake': 'nx-shake 0.35s ease-in-out',
        'nx-counter': 'nx-counter 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
