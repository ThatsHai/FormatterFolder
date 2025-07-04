/** @type {import('tailwindcss').Config} */
import typographyplugin from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lightBlue: "#23A9E1",
        darkBlue: "#0249AE",
        gray: "#D9D9D9",
        lightGray: "#f0f0f0",
        redError: "#ef4444",
        greenCorrect: "#22c55e",
        darkGray: "#383838",
      },
      fontFamily: {
        headerFont: ["CustomFont_Baloo2", "cursive"],
        textFont: ["BaiJamjuree", "sans-serif"],
      },
    },
  },
  plugins: [typographyplugin],
};
