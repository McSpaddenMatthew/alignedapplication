/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#1E90FF', // You can change this
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // You can change this
      },
    },
  },
  plugins: [],
}
