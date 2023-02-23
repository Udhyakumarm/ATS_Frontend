/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        primary: "#5500FF",
        lightBlue: "#F5F8FA"
      },
      boxShadow: {
        normal: "0 0 10px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        normal: '16px'
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms")
  ],
}
