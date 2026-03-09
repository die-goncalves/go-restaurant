import { defineConfig } from '@pandacss/dev'
import { globalCss } from './src/theme/global-styles'
import tokens from './src/theme/tokens'
import { keyframes } from './src/theme/keyframes'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // The global styles for your project.
  globalCss,

  // Useful for theme customization
  theme: {
    extend: {
      breakpoints: {
        '3xs': '320px',
        '2xs': '360px',
        xs: '412px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1366px',
        '3xl': '1440px'
      },
      keyframes,
      tokens: {
        colors: {
          light: {
            gray: {
              100: { value: '#f5f5f4' },
              200: { value: '#e7e5e4' },
              300: { value: '#d6d3d1' },
              400: { value: '#a8a29e' },
              500: { value: '#78716c' },
              800: { value: '#292524' },
              900: { value: '#1c1917' }
            },
            green: {
              200: { value: '#a7f3d0' },
              300: { value: '#6ee7b7' },
              400: { value: '#34d399' },
              500: { value: '#10b981' },
              700: { value: '#047857' }
            },
            red: {
              200: { value: '#fecdd3' },
              300: { value: '#fda4af' },
              400: { value: '#fb7185' },
              500: { value: '#f43f5e' },
              700: { value: '#be123c' }
            },
            orange: {
              200: { value: '#fde68a' },
              300: { value: '#fcd34d' },
              400: { value: '#fbbf24' },
              500: { value: '#f59e0b' }
            },
            indigo: {
              300: { value: '#a5b4fc' }
            }
          }
        },
        fonts: tokens.fonts,
        gradients: {
          skeleton: {
            value:
              'linear-gradient(90deg, #00000000 0%, #00000033 20%, #00000099 60%, #00000000 0%)'
          }
        },
        animations: {
          overlayShow: { value: 'overlayShow 150ms ease-in' },
          contentShow: { value: 'contentShow 150ms ease-in' },
          enter: { value: 'enter 250ms ease-out' },
          leave: { value: 'leave 250ms ease-in forwards' },
          shimmer: { value: 'shimmer 1.2s infinite linear' },
          fade: { value: 'fade 150ms ease-in' },
          heartbeat: { value: 'heartbeat 2s ease-in alternate' }
        }
      }
    }
  },
  utilities: {
    extend: {
      clipPath: {
        className: 'clip-path',
        values: 'any',
        transform(value) {
          return { clipPath: value }
        }
      }
    }
  },

  // The output directory for your css system
  outdir: 'styled-system'
})
