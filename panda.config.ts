import { defineConfig } from '@pandacss/dev'
import { animationStyles } from './src/theme/animation-styles'
import { breakpoints } from './src/theme/breakpoints'
import { globalCss } from './src/theme/global-styles'
import { keyframes } from './src/theme/keyframes'
import recipes from './src/theme/recipes'
import semanticTokens from './src/theme/semantic-tokens'
import slotRecipes from './src/theme/slot-recipes'
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
      animationStyles,
      breakpoints,
      keyframes,
      recipes: {
        button: recipes.buttonRecipe,
        link: recipes.linkRecipe
      },
      semanticTokens: {
        colors: semanticTokens.colors
      },
      slotRecipes: {
        dialog: slotRecipes.dialogSlotRecipe,
        drawer: slotRecipes.drawerSlotRecipe,
        scrollArea: slotRecipes.scrollAreaSlotRecipe
      },
      tokens: {
        easings: tokens.easings,
        fonts: tokens.fonts,
        gradients: {
          skeleton: {
            value:
              'linear-gradient(90deg, #00000000 0%, #00000033 20%, #00000099 60%, #00000000 0%)'
          }
        },
        zIndex: tokens.zIndexes
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
