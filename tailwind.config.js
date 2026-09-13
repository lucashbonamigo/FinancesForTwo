/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./web/index.html",
    "./web/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf7',
          100: '#d7f6ec',
          200: '#b2edd9',
          300: '#7ddfc1',
          400: '#43c8a4',
          500: '#1fae8a',
          600: '#158c70',
          700: '#13705b',
          800: '#00695c',
          900: '#104b3f',
          950: '#062b25',
        },
        lucas: '#1976D2',
        stefani: '#D81B60',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
