/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6ba77',
          400: '#f19340',
          500: '#ed7418',
          600: '#de5a0e',
          700: '#b8440e',
          800: '#933713',
          900: '#762f13',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      animation: {
        'spin-wheel': 'spin-wheel 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'pop': 'pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'spin-wheel': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(var(--final-rotation))' }
        },
        'pop': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(237, 116, 24, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(237, 116, 24, 0.8), 0 0 30px rgba(237, 116, 24, 0.6)' }
        }
      }
    },
  },
  plugins: [],
}