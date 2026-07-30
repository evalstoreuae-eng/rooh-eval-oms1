/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37',
          light: '#E8C84C',
          dark: '#B8941F',
        },
        dark: {
          DEFAULT: '#0B0B0B',
          100: '#1A1A1A',
          200: '#2A2A2A',
          300: '#3A3A3A',
          400: '#4A4A4A',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
