import { defineGlobalStyles } from '@pandacss/dev'

export const globalCss = defineGlobalStyles({
  '*, *::before, *::after': { boxSizing: 'border-box', padding: 0, margin: 0 },
  'html, body': {
    width: '100%',
    minHeight: '100dvh'
  },
  body: {
    color: 'surface.on',
    background: 'surface',
    fontFamily: 'sans',
    fontWeight: '400',
    textStyle: 'md',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    textRendering: 'optimizeLegibility'
  },
  'h1, h2, h3, h4, h5, h6': { fontFamily: 'serif' },
  'code, samp, kbd, var, pre': { fontFamily: 'mono' }
})
