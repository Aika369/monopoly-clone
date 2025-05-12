// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "rotate-90",
    "-rotate-90",
    "rotate-180"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
