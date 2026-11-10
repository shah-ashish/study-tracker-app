/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#08090D',
        card: '#11131A',
        'card-light': '#181B24',
        elevated: '#202430',
        border: '#1E222E',
        'border-light': '#2C3244',
        primary: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#38BDF8',
          light: '#7DD3FC',
        },
        phase: {
          foundations: '#10B981',
          core: '#38BDF8',
          production: '#A78BFA',
          interview: '#F472B6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
