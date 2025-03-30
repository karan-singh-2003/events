/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'inner-glow': 'inset 0 4px 6px rgba(0, 0, 0, 0.3)',
        'text-glow': '0px 4px 10px rgba(99, 91, 255, 0.8)',
      },
    },
  },
  plugins: [],
}
