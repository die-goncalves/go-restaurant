import { defineConfig } from '@pandacss/dev'
import { breakpoints } from './src/theme/breakpoints'
import { globalCss } from './src/theme/global-styles'
import { keyframes } from './src/theme/keyframes'
import semanticTokens from './src/theme/semantic-tokens'
import tokens from './src/theme/tokens'

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
      breakpoints,
      keyframes,
      semanticTokens: {
        colors: semanticTokens.colors
      },
      tokens: {
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
  outdir: 'styled-system',

  jsxFramework: 'react'
})
