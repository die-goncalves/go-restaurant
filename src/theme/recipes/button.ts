import { defineRecipe } from '@pandacss/dev'

export const buttonRecipe = defineRecipe({
  className: 'button',
  base: {
    position: 'relative',
    isolation: 'isolate',
    appearance: 'none',
    userSelect: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    width: 'fit',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    flexShrink: 0,
    _disabled: {
      cursor: 'not-allowed'
    },
    _icon: {
      flexShrink: 0
    },
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
  variants: {
    size: {
      sm: {
        height: '8',
        minWidth: '8',
        textStyle: 'sm',
        paddingInline: '3',
        gap: '1',
        _icon: {
          width: '4',
          height: '4'
        }
      },
      md: {
        height: '10',
        minWidth: '10',
        textStyle: 'md',
        paddingInline: '4',
        gap: '2',
        _icon: {
          width: '5',
          height: '5'
        }
      }
    },
    variant: {
      solid: {
        background: 'primary',
        color: 'primary.on',
        _icon: { fill: 'primary.on' },
        _disabled: {
          background: 'transparent',
          color: 'primary.surface.on/56',
          _icon: { fill: 'primary.surface.on/56' },
          _after: {
            background: 'primary.surface.on/10'
          }
        },
        _notDisabled: {
          _hover: {
            _after: {
              background: 'white/8'
            }
          },
          _focusVisible: {
            _after: {
              background: 'white/10'
            }
          }
        }
      },
      ghost: {
        color: 'primary.surface.on.variant',
        _icon: { fill: 'primary.surface.on.variant' },
        _disabled: {
          color: 'primary.surface.on/56',
          _icon: { fill: 'primary.surface.on/56' },
          _after: {
            background: 'primary.surface.on/10'
          }
        },
        _notDisabled: {
          _hover: {
            _after: {
              background: 'primary.surface.on.variant/8'
            }
          },
          _focusVisible: {
            _after: {
              background: 'primary.surface.on.variant/10'
            }
          }
        }
      }
    }
  },
  defaultVariants: {
    size: 'md',
    variant: 'ghost'
  },
  jsx: ['Button']
})
