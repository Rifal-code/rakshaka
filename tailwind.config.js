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
        app: {
          bg: 'rgb(var(--primary-bg-rgb) / <alpha-value>)',
          surface: 'rgb(var(--surface-bg-rgb) / <alpha-value>)',
          surfaceMuted: 'rgb(var(--surface-muted-rgb) / <alpha-value>)',
          text: 'rgb(var(--primary-text-rgb) / <alpha-value>)',
          muted: 'rgb(var(--secondary-text-rgb) / <alpha-value>)',
          accent: 'rgb(var(--secondary-bg-rgb) / <alpha-value>)',
          success: 'rgb(var(--success-btn-rgb) / <alpha-value>)',
          danger: 'rgb(var(--danger-btn-rgb) / <alpha-value>)',
          border: 'rgb(var(--border-rgb) / <alpha-value>)',
        },
        cyber: {
          dark: 'rgb(var(--primary-bg-rgb) / <alpha-value>)',
          card: 'rgb(var(--surface-bg-rgb) / <alpha-value>)',
          lightDark: 'rgb(var(--surface-muted-rgb) / <alpha-value>)',
          border: 'rgb(var(--border-rgb) / <alpha-value>)',
          green: 'rgb(var(--success-btn-rgb) / <alpha-value>)',
          cyan: 'rgb(var(--secondary-bg-rgb) / <alpha-value>)',
          red: 'rgb(var(--danger-btn-rgb) / <alpha-value>)',
          gold: 'rgb(var(--warning-rgb) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)', opacity: 0.1 },
          '50%': { opacity: 0.8 },
          '100%': { transform: 'translateY(100%)', opacity: 0.1 },
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
        'cyber-card': '0 14px 36px -24px rgb(var(--shadow-rgb) / 0.35)',
      }
    },
  },
  plugins: [],
}
