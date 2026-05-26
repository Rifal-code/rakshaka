/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#05070F',
          card: '#0B0F19',
          lightDark: '#121829',
          border: '#1E293B',
          green: '#00FF66',
          cyan: '#00F0FF',
          red: '#FF0055',
          gold: '#FFD700',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)', opacity: 0.1 },
          '50%': { opacity: 0.8 },
          '100%': { transform: 'translateY(100%)', opacity: 0.1 },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.8, filter: 'drop-shadow(0 0 5px rgba(0, 240, 255, 0.4))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      boxShadow: {
        'neon-green': '0 0 15px rgba(0, 255, 102, 0.25)',
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.25)',
        'neon-red': '0 0 15px rgba(255, 0, 85, 0.25)',
        'cyber-card': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      }
    },
  },
  plugins: [],
}
