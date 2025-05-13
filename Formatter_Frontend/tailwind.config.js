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
        gray: "#D9D9D9",
        lightGray: "#f0f0f0",
        redError: "#ef4444",
        greenCorrect: "#22c55e",
      },
      fontFamily: {
        headerFont: ["CustomFont_Baloo2", "cursive"],
        textFont: ["BaiJamjuree", "sans-serif"],
      },
      
    },
  },
  plugins: [],
}
