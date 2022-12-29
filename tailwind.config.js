const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
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
      backgroundImage: {
        skeleton:
          'linear-gradient(90deg, #00000000 0%, #00000033 20%, #00000099 60%, #00000000 0%)'
      },
      animation: {
        overlayShow: 'overlayShow 150ms ease-in',
        contentShow: 'contentShow 150ms ease-in',
        enter: 'enter 250ms ease-out',
        leave: 'leave 250ms ease-in forwards',
        shimmer: 'shimmer 1.2s infinite linear',
        fade: 'fade 150ms ease-in'
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
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 }
        },
        enter: {
          '0%': { transform: 'translate(50%, 0)', opacity: 0 },
          '100%': { transform: 'translate(0, 0)', opacity: 1 }
        },
        leave: {
          '0%': { transform: 'translate(0, 0)', opacity: 1 },
          '100%': { transform: 'translate(100%, 0)', opacity: 0 }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        fade: {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' }
        },
        slideDown: {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        slideUp: {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      }
    },
    plugins: []
  }
}
