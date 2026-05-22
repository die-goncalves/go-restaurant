import { defineParts, defineRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/marquee'

export const anatomyPart = anatomy.build()

export const parts = defineParts(anatomyPart)

export const marqueeRecipe = defineRecipe({
  className: 'marquee',
  base: parts({
    root: {
      position: 'relative',
      width: '100%',
      maxWidth: 'breakpoint-large',
      '--marquee-edge-color': 'var(--colors-surface)',
      '--marquee-edge-size': '20%',
      '&[data-paused]': {
        animationPlayState: 'paused !important',
        '& *': {
          animationPlayState: 'paused !important'
        }
      }
    },
    viewport: {
      overflow: 'hidden',
      display: 'flex',
      width: '100%',
      height: '100%'
    },
    content: {
      position: 'relative',
      left: 'var(--marquee-offset, 0px)',
      display: 'flex',
      minWidth: 'max-content',
      animationTimingFunction: 'linear',
      animationFillMode: 'forwards',
      animationDuration: 'var(--marquee-duration)',
      animationDelay: 'var(--marquee-delay)',
      animationIterationCount: 'var(--marquee-loop-count)',
      visibility: 'hidden',
      '&[data-ready]': {
        visibility: 'visible',
        "&[data-side='start'], &[data-side='end']": {
          animationName: 'marqueeX'
        },
        '&[data-reverse]': {
          animationDirection: 'reverse'
        },
        "&[data-orientation='horizontal']": {
          flexDirection: 'row'
        }
      }
    },
    edge: {
      position: 'absolute',
      pointerEvents: 'none',
      "&[data-side='start']": {
        width: 'var(--marquee-edge-size)',
        insetY: '0',
        insetInlineStart: '0',
        background:
          'linear-gradient(to right, var(--marquee-edge-color), transparent)',
        _rtl: {
          background:
            'linear-gradient(to left, var(--marquee-edge-color), transparent)'
        }
      },
      "&[data-side='end']": {
        width: 'var(--marquee-edge-size)',
        insetY: '0',
        insetInlineEnd: '0',
        background:
          'linear-gradient(to left, var(--marquee-edge-color), transparent)',
        _rtl: {
          background:
            'linear-gradient(to right, var(--marquee-edge-color), transparent)'
        }
      }
    },
    item: {}
  }),
  jsx: [/\bMarquee\.\w+\b/]
})
