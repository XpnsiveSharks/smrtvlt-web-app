/**
 * Tailwind CSS v4 theme extensions
 * Maps design tokens defined in src/styles/tokens.css to Tailwind theme keys
 */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          page: 'var(--bg-page)',
          card: 'var(--bg-card)',
          card2: 'var(--bg-card-2)',
          input: 'var(--bg-input)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          light: 'var(--border-light)',
          highlight: 'var(--border-highlight)',
          input: 'var(--border-input)',
        },
        brand: {
          primary: 'var(--brand)',
          hover: 'var(--brand-hover)',
          danger: 'var(--danger)',
          dangerHover: 'var(--danger-hover)',
          warning: 'var(--warning)',
          info: 'var(--info)',
        },
      },
      borderRadius: {
        bento: 'var(--r-bento)',
        inner: 'var(--r-inner)',
        btn: 'var(--r-btn)',
        pill: 'var(--r-pill)',
      },
      boxShadow: {
        glow: 'var(--glow-primary)',
        glowDanger: 'var(--glow-danger)',
        lift: 'var(--card-lift)',
      },
      backgroundImage: {
        glow: 'var(--bg-glow)',
        'glass-gradient': 'linear-gradient(180deg, rgba(24, 24, 27, 0.7), rgba(9, 9, 11, 0.9))',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-up': 'fade-up 450ms ease both',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        brand: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
