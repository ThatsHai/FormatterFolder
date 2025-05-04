/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBlue: "#23A9E1",
        darkBlue: "#0249AE",
        gray: "#595A4A",
      },
      fontFamily: {
        headerFont: ["baloo2"],
        textFont: ["bai-jamjuree"],
      },
    },
  },
  plugins: [],
}
