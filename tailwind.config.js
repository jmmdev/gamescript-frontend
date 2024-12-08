/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        fade: 'fadeIn 0.2s linear',
        'slide-left': 'slideLeft 0.2s linear',
        'hide-left': 'hideLeft 0.2s linear',
      },
      keyframes: () => ({
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 0.85 },
        },
        slideLeft: {
          '0%': { left: '-250px' },
          '100%': { left: 0 },
        },
        hideLeft: {
          '0%': { left: 0 },
          '100%': { left: '-250px' },
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