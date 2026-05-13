/*
 * Semantic colors based on and adapted from Chakra UI
 * Source: https://www.chakra-ui.com/docs/theming/colors#semantic-tokens
 * Builder: https://material-foundation.github.io/material-theme-builder/
 * Base colors: #ffe9d6 \ #1d1024
 * Status colors: #FF0000 \ #00FF00 \ #FFFF00 \ #0000FF
 */

import { defineSemanticTokens } from '@pandacss/dev'

export const colors = defineSemanticTokens.colors({
  surface: {
    DEFAULT: { value: 'oklch(0.9834 0.0092 52.1)' },
    on: {
      DEFAULT: { value: 'oklch(0.2241 0.0158 62.49)' },
      variant: { value: 'oklch(0.3982 0.0234 67.07)' }
    },
    dim: { value: 'oklch(0.8902 0.0225 63.18)' },
    bright: { value: 'oklch(0.9834 0.0092 52.1)' },
    container: {
      lowest: { value: 'oklch(1 0 0)' },
      low: { value: 'oklch(0.9665 0.0202 58.07)' },
      DEFAULT: { value: 'oklch(0.949 0.022 58.78)' },
      high: { value: 'oklch(0.9328 0.0222 63.2)' },
      highest: { value: 'oklch(0.9149 0.0214 60.73)' }
    },
    inverse: {
      DEFAULT: { value: 'oklch(0.3115 0.0168 63.35)' },
      on: { value: 'oklch(0.958 0.0219 58.78)' }
    }
  },
  outline: {
    DEFAULT: { value: 'oklch(0.5715 0.0261 65.17)' },
    variant: { value: 'oklch(0.8303 0.0282 63.88)' }
  },
  primary: {
    DEFAULT: { value: 'oklch(0.3436 0.093 312.35)' },
    on: { value: 'oklch(1 0 0)' },
    container: {
      DEFAULT: { value: 'oklch(0.5439 0.0928 313.44)' },
      on: { value: 'oklch(1 0 0)' }
    },
    surface: {
      on: {
        DEFAULT: { value: 'oklch(0.1803 0.0119 319.46)' },
        variant: { value: 'oklch(0.3344 0.0161 317.68)' }
      }
    },
    inverse: { value: 'oklch(0.8367 0.0958 314.7)' }
  },
  secondary: {
    DEFAULT: { value: 'oklch(0.3376 0.0348 314.32)' },
    on: { value: 'oklch(1 0 0)' },
    container: {
      DEFAULT: { value: 'oklch(0.5388 0.0369 316.32)' },
      on: { value: 'oklch(1 0 0)' }
    }
  },
  tertiary: {
    DEFAULT: { value: 'oklch(0.4787 0.0618 122.35)' },
    on: { value: 'oklch(1 0 0)' },
    container: {
      DEFAULT: { value: 'oklch(0.91 0.069 121.09)' },
      on: { value: 'oklch(0.3921 0.0607 123.56)' }
    }
  },
  error: {
    DEFAULT: { value: 'oklch(0.4945 0.0954 30.3)' },
    on: { value: 'oklch(1 0 0)' },
    container: {
      DEFAULT: { value: 'oklch(0.9177 0.0422 28.78)' },
      on: { value: 'oklch(0.4075 0.0913 30.69)' }
    }
  },
  info: {
    DEFAULT: { value: 'oklch(0.4865 0.091 279.38)' },
    on: { value: '#ffffff' },
    container: {
      DEFAULT: { value: 'oklch(0.9163 0.042 285.54)' },
      on: { value: 'oklch(0.4028 0.09 278.34)' }
    }
  },
  warning: {
    DEFAULT: { value: 'oklch(0.4781 0.0923 109.44)' },
    on: { value: 'oklch(1 0 0)' },
    container: {
      DEFAULT: { value: 'oklch(0.9094 0.11 107.84)' },
      on: { value: 'oklch(0.3924 0.0855 109.77)' }
    }
  },
  success: {
    DEFAULT: { value: 'oklch(0.4743 0.0891 139.54)' },
    on: { value: 'oklch(1 0 0)' },
    container: {
      DEFAULT: { value: 'oklch(0.9035 0.097 137.86)' },
      on: { value: 'oklch(0.3893 0.0884 140.39)' }
    }
  },
  shadow: { DEFAULT: { value: 'oklch(0 0 0)' } },
  scrim: { DEFAULT: { value: 'oklch(0 0 0)' } },
  star: {
    terrible: { value: 'oklch(0.4075 0.0913 30.69)' },
    bad: { value: 'oklch(0.4945 0.0954 30.3)' },
    ok: { value: 'oklch(0.4781 0.0923 109.44)' },
    good: { value: 'oklch(0.4743 0.0891 139.54)' },
    excellent: { value: 'oklch(0.3893 0.0884 140.39)' }
  }
})
