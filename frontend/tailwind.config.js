/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        dark: '#0e7490',
        black: colors.black,
        'white': '#ffffff',
        "theme-gray": '#f1f5f9',
        "theme-primary": "#6366f1",
        "theme-primary-dark": "#5661b3",
        'blue': '#1fb6ff',
        'purple': '#7e5bef',
        'pink': '#ff49db',
        'orange': '#ff7849',
        'green': '#13ce66',
        'yellow': '#ffc82c',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'gray-light': '#d3dce6',
      }
    },
    fontFamily: {
      'sans': 'Roboto, sans-serif',
    }
  },
  plugins: [],
}
