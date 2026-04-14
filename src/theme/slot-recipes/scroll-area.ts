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
      '--scrollbar-margin': '2px',
      '--scrollbar-click-area':
        'calc(var(--scrollbar-size) + calc(var(--scrollbar-margin) * 2))'
    },
    viewport: {
      outlineStyle: 'none',
      outlineWidth: '2px',
      outlineOffset: '-2px',
      outlineColor: 'transparent',
      _focus: {
        outlineStyle: 'solid',
        outlineColor: 'fg'
      },

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
      colorPalette: 'gray',
      transition: 'opacity 150ms 300ms',
      position: 'relative',
      margin: 'var(--scrollbar-margin)',
      '&:not([data-overflow-x], [data-overflow-y])': {
        display: 'none'
      },
      background: 'blackAlpha.50',
      '--thumb-bg': 'var(--colors-black-alpha-500)',
      '&:is(:hover, :active)': {
        '--thumb-bg': 'var(--colors-black-alpha-700)'
      },
      _before: {
        content: '""',
        position: 'absolute'
      },
      _vertical: {
        width: 'var(--scrollbar-size)',
        flexDirection: 'column',
        '&::before': {
          width: 'var(--scrollbar-click-area)',
          height: '100%',
          insetInlineStart: 'calc(var(--scrollbar-margin) * -1)'
        }
      },
      _horizontal: {
        height: 'var(--scrollbar-size)',
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
      transitionProperty: 'background',
      transitionDuration: '200ms',
      transitionTimingFunction: 'linear',
      _vertical: {
        width: '100%'
      },
      _horizontal: {
        height: '100%'
      }
    },
    corner: {
      background: 'var(--colors-black-alpha-500)',
      margin: 'var(--scrollbar-margin)',
      transitionProperty: 'opacity',
      transitionDuration: '200ms',
      transitionTimingFunction: 'linear',
      opacity: 0,
      '&[data-hover]': {
        opacity: 1
      }
    }
  },
  variants: {
    variant: {
      hover: {
        scrollbar: {
          opacity: '0',
          '&[data-hover], &[data-scrolling]': {
            opacity: '1',
            transitionDuration: 'faster',
            transitionDelay: '0ms'
          }
        }
      },
      always: {
        scrollbar: {
          opacity: '1'
        }
      }
    },
    size: {
      xs: {
        root: {
          '--scrollbar-size': 'sizes.1'
        }
      },
      sm: {
        root: {
          '--scrollbar-size': 'sizes.1.5'
        }
      },
      md: {
        root: {
          '--scrollbar-size': 'sizes.2'
        }
      },
      lg: {
        root: {
          '--scrollbar-size': 'sizes.3'
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
