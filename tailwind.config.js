/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        alphabet: {
          A: "#FF5733",
          B: "#33FF57",
          C: "#5733FF",
          D: "#FF33A1",
          E: "#33A1FF",
          F: "#A1FF33",
          G: "#FF3333",
          H: "#33FF33",
          I: "#3333FF",
          J: "#FF33FF",
          K: "#FFA133",
          L: "#33FFA1",
          M: "#A133FF",
          N: "#FF5733",
          O: "#33FF57",
          P: "#5733FF",
          Q: "#FF33A1",
          R: "#33A1FF",
          S: "#A1FF33",
          T: "#FF3333",
          U: "#33FF33",
          V: "#3333FF",
          W: "#FF33FF",
          X: "#FFA133",
          Y: "#33FFA1",
          Z: "#A133FF",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
