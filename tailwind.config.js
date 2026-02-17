/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#BFFF00',
        'app-bg': '#0a0a0a',
        'app-surface': '#141414',
        'app-surface-2': '#1b1b1b',
        'app-border': '#2a2a2a',
        'app-text': '#f5f5f5',
        'app-muted': '#a3a3a3',
        'app-danger': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
