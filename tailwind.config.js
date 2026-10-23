/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        gaming: {
          dark: '#0A0D14',
          surface: '#131722',
          card: '#181E2F',
          cardHover: '#1F273E',
          border: '#232C42',
          borderLight: '#2E3A57',
          neon: '#00E676',
          purple: '#7C3AED',
          purpleHover: '#6D28D9',
          crimson: '#EF4444',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          muted: '#94A3B8',
        }
      },
      boxShadow: {
        'neon-green': '0 0 20px -3px rgba(0, 230, 118, 0.35)',
        'neon-purple': '0 0 20px -3px rgba(124, 58, 237, 0.35)',
        'neon-red': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
        'neon-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'glow-sm': '0 0 10px rgba(0, 230, 118, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 8px rgba(0, 230, 118, 0.6))' },
          '50%': { opacity: 0.7, filter: 'drop-shadow(0 0 2px rgba(0, 230, 118, 0.2))' },
        }
      }
    },
  },
  plugins: [],
}
