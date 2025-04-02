const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow:{
        light: '0 0 50px 12px #b3b3b3',  // Világos téma árnyéka
        dark: '0 0 42px 10px #021526',
        lite: '10px 10px 30px 2px #021526',
      }
    },
  },
  plugins: [flowbiteReact],
}