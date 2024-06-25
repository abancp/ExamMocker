/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'loading': 'loading 1s ease-in-out infinite'
      },
      keyframes: {
        loading: {
          '0%': { 'width': '20%', 'margin-left': '0' },
          '25%': { 'width': '40%' },
          '50%': { "width": '20%', 'margin-left': '80%' },
          '75%': { 'width': '40%' },
          '100%': { 'width': '20%', 'margin-left': '0' },
        }
      }
    },
  },
  plugins: [],
};
