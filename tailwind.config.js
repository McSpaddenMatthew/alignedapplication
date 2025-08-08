/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B1D26",
        accent: "#2979FF",
        soft: "#F4F6F8"
      }
    },
  },
  plugins: [],
};
