/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Calm cafe-inspired palette (warm neutrals + high contrast accents)
      colors: {
        cafe: {
          50: '#f8f5f2',
          100: '#f0e9e0',
          200: '#e2d5c4',
          300: '#d1bc9f',
          400: '#b89a72',
          500: '#a07f54',
          600: '#8a6a47',
          700: '#6f5339',
          800: '#5c4633',
          900: '#4d3c2d',
        },
        accent: '#c17f4a', // warm coffee accent for ratings/stars
      },
      spacing: {
        // 8pt rhythm for calm, consistent breathing room (inspired by HIG/Readly)
        '4.5': '1.125rem',
      }
    },
  },
  plugins: [],
}

