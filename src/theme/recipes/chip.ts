import { defineParts, defineRecipe } from '@pandacss/dev'
import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('chip').parts(
  'root',
  'label',
  'delete-trigger'
)
export const anatomyPart = anatomy.build()

export const parts = defineParts(anatomyPart)

export const chipRecipe = defineRecipe({
  className: 'chip',
  base: parts({
    root: {
      position: 'relative',
      isolation: 'isolate',
      appearance: 'none',
      userSelect: 'none',
      display: 'inline-flex',
      gap: '2',
      alignItems: 'center',
      verticalAlign: 'top',
      width: 'fit-content',
      height: '8',
      _focusWithin: {
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
      '&:is(button)': {
        cursor: 'pointer',
        outlineStyle: 'none',
        outlineWidth: '2px',
        outlineOffset: '2px',
        outlineColor: 'transparent',
        _focusWithin: {
          outlineStyle: 'solid',
          outlineColor: 'outline'
        },
        _icon: {
          height: '4.5',
          width: '4.5'
        }
      }
    },
    label: {
      lineClamp: 1,
      textStyle: 'sm',
      fontWeight: 'medium'
    },
    'delete-trigger': {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '4.5',
      minWidth: '4.5',
      cursor: 'pointer',
      outlineStyle: 'none',
      outlineWidth: '2px',
      outlineOffset: '2px',
      outlineColor: 'transparent',
      _focusVisible: {
        outlineStyle: 'solid',
        outlineColor: 'outline'
      }
    }
  }),
  variants: {
    variant: {
      subtle: {
        background: 'tertiary.container',
        color: 'tertiary.container.on',
        _hover: {
          _after: {
            background: 'tertiary.container.on/8'
          }
        },
        _focusWithin: {
          _after: {
            background: 'tertiary.container.on/10'
          }
        }
      },
      outline: {
        color: 'tertiary.container.on',
        boxShadow: 'inset 0 0 0 2px token(colors.tertiary.container)',
        _hover: {
          _after: {
            background: 'tertiary.container.on/8'
          }
        },
        _focusWithin: {
          _after: {
            background: 'tertiary.container.on/10'
          }
        }
      }
    }
  },
  defaultVariants: { variant: 'subtle' },
  jsx: [/\bChip\.\w+\b/]
})
