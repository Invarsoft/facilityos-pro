/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FAF8F5',
          soft: '#F5F2EC',
          card: '#FFFFFF',
        },
        sand: {
          DEFAULT: '#F0ECE4',
          dark: '#E4DDD2',
          light: '#F7F4EE',
        },
        charcoal: {
          DEFAULT: '#1A1918',
          light: '#2B2A28',
          muted: '#3C3B38',
          deep: '#121110',
        },
        walnut: {
          DEFAULT: '#3D2E24',
          light: '#534135',
          dark: '#2A1F18',
        },
        stone: {
          DEFAULT: '#7A7570',
          dark: '#585450',
          light: '#C8C3BC',
          border: '#E3DFD8',
          bg: '#EBE7E1',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        ultra: '0.35em',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(26, 25, 24, 0.05)',
        'card': '0 10px 30px -5px rgba(26, 25, 24, 0.07)',
        'floating': '0 20px 40px -10px rgba(26, 25, 24, 0.12)',
      }
    },
  },
  plugins: [],
}
