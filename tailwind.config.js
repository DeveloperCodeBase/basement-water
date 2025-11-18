/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1C7ED6',
        accent: '#15AABF',
      },
      fontFamily: {
        vazir: ['"Vazirmatn"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
