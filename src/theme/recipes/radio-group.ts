import { defineParts, defineRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/radio-group'

export const anatomyPart = anatomy.build()

export const parts = defineParts(anatomyPart)

export const radioGroupRecipe = defineRecipe({
  className: 'radio-group',
  base: parts({
    root: {
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      gap: '2'
    },
    label: {},
    item: {
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
    itemControl: {
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
      '& > div': {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '4.5',
        height: '4.5',
        borderRadius: '50%',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'primary.surface.on.variant',
        _after: {
          content: '""',
          width: '2',
          height: '2',
          borderRadius: '50%'
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
            borderColor: 'primary',
            _after: {
              background: 'primary'
            }
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
              borderColor: 'error',
              _after: {
                background: 'error'
              }
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
            borderColor: 'primary.surface.on',
            _after: {
              background: 'primary.surface.on'
            }
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
    itemText: {},
    indicator: {}
  }),
  jsx: [/\bRadioGroup\.\w+\b/]
})
