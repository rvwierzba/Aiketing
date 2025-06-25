/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0D1A2E',
        'brand-blue': '#2E67F8',
        'brand-cyan': '#33D1C4',
        'brand-light': '#F0F5FF',
        'brand-text': '#1D2D44',
      }
    },
  },
  plugins: [],
};