import { defineTokens } from '@pandacss/dev'

export const fonts = defineTokens.fonts({
  serif: {
    value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
  },
  sans: {
    value:
      'var(--font-barlow-semi-condensed), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
  },
  mono: {
    value:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  }
})
