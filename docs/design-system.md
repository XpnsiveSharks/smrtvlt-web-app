# Design System (SmartVault Internal)

Source of truth:
- Tailwind tokens in `tailwind.config.js`
- Global defaults in `src/index.css`

Rules:
- Use token classes (bg-app-bg, bg-app-surface, border-app-border, text-app-text, text-brand).
- Do not hardcode hex colors in components.
- Primary button:
  - bg brand, text black, uppercase tracking, rounded, px-3 py-1
- Secondary button:
  - transparent, muted text, hover to secondary
- Cards:
  - rounded-2xl, 1px border, bg surface
- Hover:
  - table rows `hover:bg-white/5`
  - nav active `border-brand bg-brand/10`
Fonts:
- sans: Inter
- display: Space Grotesk (use for headings, metrics if needed)
