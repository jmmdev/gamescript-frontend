/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        fade: 'fadeIn 0.3s linear',
        slide: 'slide 0.3 linear forwards'
      },
      keyframes: () => ({
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 0.85 },
        },
        slide: {
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