/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0eeff',
          100: '#e4dfff',
          200: '#ccc4ff',
          300: '#a99bff',
          400: '#8468ff',
          500: '#6c3fff',
          600: '#5c20fb',
          700: '#4e10e7',
          800: '#400ec0',
          900: '#350f9b',
          950: '#1e0663',
        },
        surface: {
          50:  '#f0f0f8',
          900: '#0d0b1a',
          950: '#07050f',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-mesh': `
          radial-gradient(ellipse at 20% 20%, rgba(108,63,255,0.25) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 80%, rgba(56,189,248,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 60% 10%, rgba(236,72,153,0.14) 0%, transparent 45%),
          linear-gradient(180deg, #07050f 0%, #0d0b1a 100%)
        `,
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out both',
        'fade-in':    'fadeIn 0.4s ease-out both',
        'shimmer':    'shimmer 1.8s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
        'glow':       'glow 3s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.4s ease-out both',
        'slide-in-right': 'slideInRight 0.4s ease-out both',
        'bounce-gentle': 'bounceGentle 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108,63,255,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(108,63,255,0.6), 0 0 60px rgba(108,63,255,0.3)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-32px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(32px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
      boxShadow: {
        'glow-brand': '0 0 30px rgba(108,63,255,0.4)',
        'glow-cyan':  '0 0 30px rgba(56,189,248,0.4)',
        'glow-pink':  '0 0 30px rgba(236,72,153,0.4)',
        'card':       '0 4px 24px rgba(0,0,0,0.3)',
        'card-lg':    '0 8px 40px rgba(0,0,0,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
