/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",              // Root HTML file
    "./src/**/*.{js,jsx,ts,tsx}" // Sab React components / pages
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF385C",      // Airbnb style primary color
        secondary: "#222222",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
