/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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