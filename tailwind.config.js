/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A2B49",   // deep navy (trust)
        accent:  "#3FA9F5",   // sky blue (CTAs)
        success: "#00A878",   // emerald (success)
        soft:    "#F9FAFB",   // off-white background
        ink:     "#0B1D26"    // charcoal body text
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
}
