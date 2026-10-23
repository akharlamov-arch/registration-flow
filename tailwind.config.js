/** @type {import('tailwindcss').Config} */
// Tokens aligned with design-system/itrucking-registration/MASTER.md

// Dark theme (SITE-CHROME-01): the palettes the app uses read their shades from
// CSS variables (src/index.css), which <html data-theme="dark"> swaps for an
// inverted set — so every existing `bg-gray-50` / `text-red-700` follows the
// theme without a `dark:` variant on each class.
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const themed = (name) =>
  Object.fromEntries(SHADES.map((s) => [s, `rgb(var(--c-${name}-${s}) / <alpha-value>)`]))

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:   'rgb(var(--c-primary) / <alpha-value>)',   // #2563EB
        secondary: 'rgb(var(--c-secondary) / <alpha-value>)', // #1D4ED8
        cta:       '#F97316',
        surface:   'rgb(var(--c-surface) / <alpha-value>)',   // #F5F5F5
        // DS text token — minimalist near-black
        'ds-text': 'rgb(var(--c-ds-text) / <alpha-value>)',   // #111111
        gray:    themed('gray'),
        slate:   themed('slate'),
        red:     themed('red'),
        green:   themed('green'),
        amber:   themed('amber'),
        blue:    themed('blue'),
        emerald: themed('emerald'),
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        // Portal working area — wider than the registration wizard's 4xl
        'portal': '1200px',
      },
      spacing: {
        // DS spacing scale (MASTER.md)
        '2xl': '3rem',   // 48px — section margins
        '3xl': '4rem',   // 64px — hero padding
      },
      boxShadow: {
        // DS shadow depths (MASTER.md)
        'ds-sm': '0 1px 2px rgba(0,0,0,0.05)',
        'ds-md': '0 4px 6px rgba(0,0,0,0.10)',
        'ds-lg': '0 10px 15px rgba(0,0,0,0.10)',
        'ds-xl': '0 20px 25px rgba(0,0,0,0.15)',
      },
      transitionDuration: {
        // DS: 200-300ms
        'ds-fast':   '150ms',
        'ds-normal': '200ms',
        'ds-slow':   '300ms',
      },
      fontSize: {
        // DS: large type 32px+ for headings
        'ds-hero': ['2rem',    { lineHeight: '1.2', fontWeight: '700' }],
        'ds-h1':   ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'ds-h2':   ['1.5rem',  { lineHeight: '1.3', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
}
