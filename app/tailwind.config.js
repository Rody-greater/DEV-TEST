/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#111111',
        bg2: '#0c0c0c',
        card: '#191919',
        card2: '#1f1f20',
        card3: '#242426',
        line: '#2c2c2e',
        ink: '#f5f5f4',
        muted: '#a4a4a2',
        faint: '#77776f',
        bronze: { DEFAULT: '#c79a63', deep: '#a97c46', soft: '#3a2f22' },
        must: '#ff6a2b',
        nice: '#f5a623',
        bonus: '#2fa66d',
        nav: '#4f9cf0',
        done: '#2fa66d'
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      },
      borderRadius: { xl2: '20px' },
      boxShadow: {
        soft: '0 4px 18px rgba(0,0,0,.35)',
        card: '0 10px 40px rgba(0,0,0,.5)'
      },
      transitionTimingFunction: { premium: 'cubic-bezier(.22,.61,.36,1)' },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'none' } },
        pop: { '0%': { transform: 'scale(.4)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } }
      },
      animation: {
        fadeUp: 'fadeUp .45s cubic-bezier(.22,.61,.36,1)',
        pop: 'pop .22s cubic-bezier(.22,.61,.36,1)'
      }
    }
  },
  plugins: []
}
