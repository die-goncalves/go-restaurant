import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/checkbox'

export const checkboxSlotRecipe = defineSlotRecipe({
  slots: anatomy.keys(),
  className: 'checkbox',
  base: {
    root: {
      display: 'inline-flex',
      gap: '2',
      minHeight: '10',
      alignItems: 'center',
      cursor: 'pointer',
      width: 'fit-content',
      _disabled: {
        opacity: 0.38,
        cursor: 'not-allowed'
      }
    },
    indicator: {},
    control: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      height: '10',
      minWidth: '10',
      outlineStyle: 'none',
      outlineWidth: '2px',
      outlineOffset: '2px',
      outlineColor: 'transparent',
      '& > div': {
        width: '4.5',
        height: '4.5',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'primary.surface.on.variant'
      },
      _icon: {
        flexShrink: 0
      },
      _focusVisible: {
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
      _notDisabled: {
        _hover: {
          _after: {
            background: 'primary.surface.on/8'
          }
        },
        _focusVisible: {
          _after: {
            background: 'primary.surface.on/10'
          }
        },
        _checked: {
          '& > div': {
            background: 'primary',
            borderColor: 'primary',
            _icon: { fill: 'primary.on' }
          },
          _hover: {
            _after: {
              background: 'primary/8'
            }
          },
          _focusVisible: {
            _after: {
              background: 'primary/10'
            }
          }
        },
        _invalid: {
          _hover: {
            _after: {
              background: 'error/8'
            }
          },
          _focusVisible: {
            _after: {
              background: 'error/10'
            }
          },
          '& > div': {
            borderColor: 'error'
          },
          _checked: {
            '& > div': {
              background: 'error',
              borderColor: 'error',
              _icon: { fill: 'error.on' }
            }
          }
        }
      },
      _disabled: {
        '& > div': {
          borderColor: 'primary.surface.on'
        },
        _checked: {
          '& > div': {
            background: 'primary.surface.on',
            borderColor: 'primary.surface.on',
            _icon: { fill: 'primary.on' }
          }
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
      }
    },
    label: {}
  },
  jsx: [/\bCheckbox\.\w+\b/]
})
