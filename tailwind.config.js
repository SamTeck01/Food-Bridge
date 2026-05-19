/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#7AD371',
          secondary: '#0F3934',
          light: '#E8F5E5',
        },
        text: {
          primary: '#0A2623',
          secondary: '#4A6361',
          muted: '#8FA3A1',
          white: '#FFFFFF',
        },
        bg: {
          DEFAULT: '#F9F9F9',
          section: '#EFF4F0',
          overlay: '#F0F4F1',
          white: '#FFFFFF',
        },
        border: {
          DEFAULT: '#D8E6D8',
        },
        state: {
          error:   '#EF4444',
          success: '#22C55E',
          warning: '#F59E0B',
          info:    '#3B82F6',
        },
      },
      fontFamily: {
        questrial: ['Questrial', '-apple-system', 'Roboto', 'Helvetica', 'sans-serif'],
      },
      borderRadius: {
        pill: '100px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(10, 38, 35, 0.06), 0 1px 2px rgba(10, 38, 35, 0.04)',
        'card-hover': '0 4px 16px rgba(10, 38, 35, 0.10), 0 2px 6px rgba(10, 38, 35, 0.06)',
        'panel': '0 8px 32px rgba(10, 38, 35, 0.12), 0 4px 12px rgba(10, 38, 35, 0.08)',
        'xl': '0 20px 60px rgba(10, 38, 35, 0.15)',
      },
      animation: {
        'slide-in': 'slide-in 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'slide-up': 'slide-up 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.25s ease-out forwards',
        'scale-in': 'scale-in 0.2s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        scroll: 'scroll 20s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          // Adjust the percentage based on how wide your single set of items is
          '100%': { transform: 'translateX(-33.33%)' }, 
        }
      },
    },
  },
  plugins: [],
}
