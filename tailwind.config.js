/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        fade: 'fadeIn 0.3s linear',
        'slide-left': 'slideLeft 0.3s linear'
      },
      keyframes: () => ({
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 0.85 },
        },
        slideLeft: {
          '0%': { left: '-250px' },
          '100%': { left: 0 },
        }
      }),
      gradientColorStopPositions: {
        98: '98%',
      },
      fontFamily: {
        sans: ['var(--my-font)'],
      }
    },
  },
  plugins: [],
}