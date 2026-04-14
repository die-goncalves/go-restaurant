import { defineTokens } from '@pandacss/dev'

export const colors = defineTokens.colors({
  transparent: { value: 'transparent' },
  current: { value: 'currentColor' },
  black: {
    DEFAULT: { value: 'oklch(0 0 0 / 1)' },
    alpha: {
      50: { value: 'oklch(0 0 0 / 0.04)' },
      100: { value: 'oklch(0 0 0 / 0.06)' },
      200: { value: 'oklch(0 0 0 / 0.08)' },
      300: { value: 'oklch(0 0 0 / 0.16)' },
      400: { value: 'oklch(0 0 0 / 0.24)' },
      500: { value: 'oklch(0 0 0 / 0.36)' },
      600: { value: 'oklch(0 0 0 / 0.48)' },
      700: { value: 'oklch(0 0 0 / 0.64)' },
      800: { value: 'oklch(0 0 0 / 0.80)' },
      900: { value: 'oklch(0 0 0 / 0.92)' },
      950: { value: 'oklch(0 0 0 / 0.95)' }
    }
  },
  white: {
    DEFAULT: { value: 'oklch(1 0 0 / 1)' },
    alpha: {
      50: { value: 'oklch(1 0 0 / 0.04)' },
      100: { value: 'oklch(1 0 0 / 0.06)' },
      200: { value: 'oklch(1 0 0 / 0.08)' },
      300: { value: 'oklch(1 0 0 / 0.16)' },
      400: { value: 'oklch(1 0 0 / 0.24)' },
      500: { value: 'oklch(1 0 0 / 0.36)' },
      600: { value: 'oklch(1 0 0 / 0.48)' },
      700: { value: 'oklch(1 0 0 / 0.64)' },
      800: { value: 'oklch(1 0 0 / 0.80)' },
      900: { value: 'oklch(1 0 0 / 0.92)' },
      950: { value: 'oklch(1 0 0 / 0.95)' }
    }
  }
})
