const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "// Scans all TS/JS files\n    \"./public/index.html\"",
    "./node_modules/@heroui/theme/dist/components/navbar.js"
  ],
  theme: {
    extend: {
      colors: {
        'indie-purple': '#d300f7',
        'indie-purple-light': 'rgba(211, 0, 247, 0.8)',
        'indie-purple-dark': '#a800c8',
      },
    },
  },
  plugins: [heroui()],
}

