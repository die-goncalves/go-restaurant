const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-barlow-semi-condensed)', ...fontFamily.sans]
      },
      colors: {
        light: {
          gray: {
            100: '#f5f5f4',
            200: '#e7e5e4',
            300: '#d6d3d1',
            400: '#a8a29e',
            500: '#78716c',
            800: '#292524',
            900: '#1c1917'
          },
          green: {
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981'
          },
          red: {
            200: '#fecdd3',
            300: '#fda4af',
            400: '#fb7185',
            500: '#f43f5e'
          },
          orange: {
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b'
          },
          indigo: {
            300: '#a5b4fc'
          }
        }
      },
      animation: {
        overlayShow: 'overlayShow 150ms ease-in',
        contentShow: 'contentShow 150ms ease-in',
        enter: 'enter 250ms ease-out',
        leave: 'leave 250ms ease-in forwards'
      },
      keyframes: {
        overlayShow: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        contentShow: {
          '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
          '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
        },
        enter: {
          '0%': { transform: 'translate(50%, 0)', opacity: 0 },
          '100%': { transform: 'translate(0, 0)', opacity: 1 }
        },
        leave: {
          '0%': { transform: 'translate(0, 0)', opacity: 1 },
          '100%': { transform: 'translate(100%, 0)', opacity: 0 }
        }
      }
    },
    plugins: []
  }
}
