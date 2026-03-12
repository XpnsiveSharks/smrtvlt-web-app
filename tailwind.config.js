/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        'app-bg': 'rgb(var(--color-app-bg) / <alpha-value>)',
        'app-surface': 'rgb(var(--color-app-surface) / <alpha-value>)',
        'app-surface-2': 'rgb(var(--color-app-surface-2) / <alpha-value>)',
        'app-border': 'rgb(var(--color-app-border) / <alpha-value>)',
        'app-text': 'rgb(var(--color-app-text) / <alpha-value>)',
        'app-muted': 'rgb(var(--color-app-muted) / <alpha-value>)',
        'app-danger': 'rgb(var(--color-app-danger) / <alpha-value>)',
        'app-shadow': 'rgb(var(--shadow-color) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
