/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';
module.exports = {
  content: ["./src/**/*.{html,js,ts}"],
  theme: {
    extend: {},
  },
  important: true,
  plugins: [PrimeUI]
}

