/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // This will scan all JS/TS files in src
    "./src/components/**/*.{js,ts,jsx,tsx}",  // Specifically scan components
    "./src/pages/**/*.{js,ts,jsx,tsx}",  // If you have a pages directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}