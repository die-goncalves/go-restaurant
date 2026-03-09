import { defineGlobalStyles } from '@pandacss/dev'

export const globalCss = defineGlobalStyles({
  '*': { boxSizing: 'border-box', padding: 0, margin: 0 },
  'html, body': {
    maxWidth: '100dvw'
  },
  html: {
    overflowX: 'hidden'
  },
  body: {
    // color: "var(--colors-fg)",
    // bg: "var(--colors-bg)",
    fontFamily: 'sans',
    fontWeight: '400',
    textStyle: 'md',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale'
  },
  'h1, h2, h3, h4, h5, h6': { fontFamily: 'serif' },
  'code, samp, kbd, var, pre': { fontFamily: 'mono' }
})
