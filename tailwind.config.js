/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandRed: '#DC2626',
        brandGreen: '#16A34A',
        brandDark: '#1E293B',
      },
    },
  },
  plugins: [],
}