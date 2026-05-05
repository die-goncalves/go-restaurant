import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/select'

export const selectSlotRecipe = defineSlotRecipe({
  className: 'select',
  slots: anatomy.keys(),
  base: {
    root: { width: '100%' },
    positioner: {},
    control: {
      position: 'relative',
      display: 'flex',
      width: '100%'
    },
    trigger: {
      position: 'relative',
      isolation: 'isolate',
      appearance: 'none',
      userSelect: 'none',
      cursor: 'pointer',
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr)) min-content',
      gap: '14',
      width: 'inherit',
      height: '10',
      alignItems: 'center',
      textAlign: 'start',
      paddingInlineStart: '3',
      outlineStyle: 'none',
      outlineWidth: '2px',
      outlineOffset: '2px',
      outlineColor: 'transparent',
      _focus: {
        outlineStyle: 'solid',
        outlineColor: 'outline',
        _after: {
          transitionProperty: 'background',
          transitionDuration: '200ms',
          transitionTimingFunction: 'token(easings.expressive-default-effects)'
        }
      },
      _hover: {
        _after: {
          transitionProperty: 'background',
          transitionDuration: '200ms',
          transitionTimingFunction: 'token(easings.expressive-default-effects)'
        }
      },
      _after: {
        content: '""',
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        background: 'transparent',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        transitionProperty: 'background',
        transitionDuration: '150ms',
        transitionTimingFunction: 'token(easings.expressive-fast-effects)'
      },
      '& span': { textWrap: 'nowrap', textOverflow: 'ellipsis', lineClamp: 1 },
      background: 'surface.container.high',
      color: 'primary.surface.on.variant',
      _icon: { fill: 'primary.surface.on.variant' },
      _notDisabled: {
        _hover: {
          _after: {
            background: 'primary.surface.on/8'
          }
        },
        _focus: {
          _after: {
            background: 'primary.surface.on/10'
          }
        }
      }
    },
    indicator: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '10',
      minWidth: '10',
      transformOrigin: 'center',
      color: 'surface.on',
      _open: {
        _icon: {
          transitionProperty: 'rotate',
          transitionDuration: '500ms',
          transitionTimingFunction: 'token(easings.expressive-default-spatial)',
          rotate: '-270deg'
        }
      },
      _icon: {
        width: '5',
        height: '5',
        transitionProperty: 'rotate',
        transitionDuration: '350ms',
        transitionTimingFunction: 'token(easings.expressive-fast-spatial)',
        rotate: '-90deg'
      }
    },
    clearTrigger: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '10',
      height: '10',
      right: '10',
      cursor: 'pointer'
    },
    content: {
      background: 'surface.container',
      boxShadow: 'lg',
      position: 'relative',
      width: 'var(--reference-width)',
      maxHeight: 'calc(var(--available-height) + 8px - 16px)',
      overflow: 'auto',
      scrollbarColor:
        'var(--colors-black-alpha-500) var(--colors-black-alpha-100)',
      outlineStyle: 'none',
      _open: { animationStyle: 'floating-slide-fade-in' },
      _closed: { animationStyle: 'floating-slide-fade-out' }
    },
    item: {
      isolation: 'isolate',
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      '&:has([data-part="item-indicator"][data-state="checked"])': {
        gridTemplateColumns: 'repeat(1, minmax(0, 1fr)) min-content',
        gap: '4'
      },
      paddingInline: '3',
      minHeight: '10',
      minWidth: 0,
      cursor: 'pointer',
      alignItems: 'center',
      _after: {
        content: '""',
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        background: 'transparent',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        transitionProperty: 'background',
        transitionDuration: '150ms',
        transitionTimingFunction: 'token(easings.expressive-fast-effects)'
      },
      _hover: {
        _after: {
          transitionProperty: 'background',
          transitionDuration: '200ms',
          transitionTimingFunction: 'token(easings.expressive-default-effects)'
        }
      },
      _highlighted: {
        _after: {
          transitionProperty: 'background',
          transitionDuration: '200ms',
          transitionTimingFunction: 'token(easings.expressive-default-effects)'
        }
      },
      _checked: {
        background: 'secondary.container',
        color: 'secondary.container.on',
        _icon: { fill: 'secondary.container.on!' },
        _notDisabled: {
          _hover: {
            _after: {
              background: 'secondary.container.on/8'
            }
          },
          _highlighted: { _after: { background: 'secondary.container.on/10' } }
        }
      },
      _notDisabled: {
        _hover: { _after: { background: 'surface.on/8' } },
        _highlighted: { _after: { background: 'surface.on/10' } }
      },
      '&+li': { marginBlockStart: '2' }
    },
    itemText: {
      textWrap: 'wrap',
      wordBreak: 'break-word',
      minWidth: 0,
      overflow: 'hidden',
      paddingBlock: 'calc((40px - 1.5em) / 2)'
    },
    itemIndicator: {
      position: 'relative',
      alignSelf: 'start',
      display: 'flex',
      width: '10',
      height: '10',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 'auto',
      _icon: {
        width: '5',
        height: '5'
      }
    },
    label: { display: 'inline-flex', marginBottom: '2' }
  },
  jsx: [/\bSelect\.\w+\b/]
})
