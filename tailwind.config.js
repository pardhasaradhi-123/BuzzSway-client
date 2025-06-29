// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        buzzOrange: "#FF8A00",
        buzzPink: "#E52E71",
        buzzViolet: "#7B2FF7",
        buzzBlue: "#00C9FF",
      },
      backgroundImage: {
        buzzGradient:
          "linear-gradient(90deg, #FF8A00, #E52E71, #7B2FF7, #00C9FF)",
      },
    },
  },
  plugins: [],
};
