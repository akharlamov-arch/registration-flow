/** @type {import('tailwindcss').Config} */
// Tokens aligned with design-system/itrucking-registration/MASTER.md
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#2563EB',
        secondary: '#3B82F6',
        cta:       '#F97316',
        surface:   '#EFF6FF',
        // DS text token
        'ds-text': '#1E40AF',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
