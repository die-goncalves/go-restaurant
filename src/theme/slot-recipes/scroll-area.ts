import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/scroll-area'

export const scrollAreaSlotRecipe = defineSlotRecipe({
  slots: anatomy.keys(),
  className: 'scroll-area',
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      '--scrollbar-margin': '0px',
      '--scrollbar-click-area':
        'calc(var(--scrollbar-size) + calc(var(--scrollbar-margin) * 2))'
    },
    viewport: {
      outlineStyle: 'none',
      outlineWidth: '2px',
      outlineOffset: '-2px',
      outlineColor: 'transparent',
      _focusVisible: {
        outlineStyle: 'solid',
        outlineColor: 'outline'
      },
      position: 'relative',
      padding: '1',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      borderRadius: 'inherit',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    },
    content: {
      minWidth: '100%'
    },
    scrollbar: {
      display: 'flex',
      userSelect: 'none',
      touchAction: 'none',
      borderRadius: 'unset',
      position: 'relative',
      margin: 'var(--scrollbar-margin)',
      '&:not([data-overflow-x], [data-overflow-y])': {
        display: 'none'
      },
      background: 'var(--colors-black-alpha-100)',
      '--thumb-bg': 'var(--colors-black-alpha-500)',
      '--thumb-transition-property': 'background',
      '--thumb-transition-duration': '150ms',
      '--thumb-transition-timing-function':
        'token(easings.expressive-fast-effects)',
      '&:is(:hover, :active)': {
        '--thumb-bg': 'var(--colors-black-alpha-600)',
        '--thumb-transition-property': 'background',
        '--thumb-transition-duration': '200ms',
        '--thumb-transition-timing-function':
          'token(easings.expressive-default-effects)'
      },
      _before: {
        content: '""',
        position: 'absolute'
      },
      _vertical: {
        width: 'var(--scrollbar-size)',
        paddingInline: 'var(--scrollbar-padding)',
        flexDirection: 'column',
        '&::before': {
          width: 'var(--scrollbar-click-area)',
          height: '100%',
          insetInlineStart: 'calc(var(--scrollbar-margin) * -1)'
        }
      },
      _horizontal: {
        height: 'var(--scrollbar-size)',
        paddingBlock: 'var(--scrollbar-padding)',
        flexDirection: 'row',
        '&::before': {
          height: 'var(--scrollbar-click-area)',
          width: '100%',
          top: 'calc(var(--scrollbar-margin) * -1)'
        }
      }
    },
    thumb: {
      borderRadius: 'inherit',
      background: 'var(--thumb-bg)',
      transitionProperty: 'var(--thumb-transition-property)',
      transitionDuration: 'var(--thumb-transition-duration)',
      transitionTimingFunction: 'var(--thumb-transition-timing-function)',
      flexShrink: 0,
      _vertical: {
        width: '100%'
      },
      _horizontal: {
        height: '100%'
      }
    },
    corner: {
      background: 'var(--colors-black-alpha-100)',
      margin: 'var(--scrollbar-margin)',
      transitionProperty: 'background',
      transitionDuration: '150ms',
      transitionTimingFunction: 'token(easings.expressive-fast-effects)',
      '&[data-hover]': {
        background: 'var(--colors-black-alpha-500)',
        transitionProperty: 'background',
        transitionDuration: '200ms',
        transitionTimingFunction: 'token(easings.expressive-default-effects)'
      }
    }
  },
  variants: {
    variant: {
      hover: {
        scrollbar: {
          opacity: 0,
          transitionProperty: 'opacity',
          transitionDuration: '150ms',
          transitionTimingFunction: 'token(easings.expressive-fast-effects)',
          '&[data-hover], &[data-scrolling]': {
            opacity: 1,
            transitionProperty: 'opacity',
            transitionDuration: '200ms',
            transitionTimingFunction:
              'token(easings.expressive-default-effects)',
            transitionDelay: '0ms'
          }
        }
      },
      always: {
        scrollbar: {
          opacity: 1
        }
      }
    },
    size: {
      sm: {
        root: {
          '--scrollbar-size': 'sizes.3',
          '--scrollbar-padding': '3px'
        }
      },
      md: {
        root: {
          '--scrollbar-size': 'sizes.5',
          '--scrollbar-padding': 'sizes.1'
        }
      }
    }
  },
  defaultVariants: {
    size: 'md',
    variant: 'hover'
  },
  jsx: [/\bScrollArea\.\w+\b/]
})
