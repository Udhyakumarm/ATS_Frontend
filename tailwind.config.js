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
        secondary: "#6433c5",
        lightBlue: "#F5F8FA",
        lightGray: "#BEBEBE",
        darkGray: "#727272",
        gradLightBlue: "#9290FC",
        gradDarkBlue: "#6A67EA",
      },
      boxShadow: {
        normal: "0 0 10px rgba(0, 0, 0, 0.1)",
        highlight: "0 5px 10px rgba(0, 0, 0, 0.2)",
      },
      borderRadius: {
        normal: '16px',
        large: '26px'
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms")
  ],
}
