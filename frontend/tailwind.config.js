/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', // Enable dark theme using class
  theme: {
    extend: {
      colors: {
        // Custom colors: deep purple + cyan gradient
        brand: {
          purple: '#4c1d95', // Deep purple
          cyan: '#06b6d4',   // Cyan
          dark: '#0f172a',   // Dark background for dark theme
        }
      },
      backgroundImage: {
        // Gradient utility class
        'brand-gradient': 'linear-gradient(to right, #4c1d95, #06b6d4)',
      }
    },
  },
  plugins: [],
}
