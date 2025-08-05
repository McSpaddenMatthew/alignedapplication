/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}", // ← extra scan safety
  ],
  theme: {
    extend: {
      colors: {
        brand: '#1E90FF', // custom color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // custom font
      },
    },
  },
  plugins: [],
};
