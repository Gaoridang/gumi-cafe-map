/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Clean light neutral palette (ElevenLabs-inspired v8 day mode) + purple accent.
      // No warm café tones. Exact match to DesignTokens.ts / UI-Spec.md neutral + accent.
      // 8pt rhythm preserved. Neutral scale overrides default for precise light theme.
      colors: {
        neutral: {
          50: '#f8f8f9',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          500: '#3f3f46',
          700: '#27272a',
          900: '#111113',
        },
        accent: '#7c3aed',
        accentLight: '#a78bfa',
        white: '#ffffff',
        border: '#e4e4e7',
        success: '#4a7c59',
      },
      spacing: {
        // 8pt rhythm for calm, consistent breathing room (inspired by HIG/Readly)
        '4.5': '1.125rem',
      }
    },
  },
  plugins: [],
}
