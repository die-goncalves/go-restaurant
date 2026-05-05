import { defineParts, defineRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/rating-group'

export const anatomyPart = anatomy.build()

export const parts = defineParts(anatomyPart)

export const ratingGroupRecipe = defineRecipe({
  className: 'rating-group',
  base: parts({
    root: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      display: 'inline-flex',
      marginBottom: '2'
    },
    control: {
      display: 'inline-flex',
      gap: '2',
      alignItems: 'center'
    },
    item: {
      position: 'relative',
      isolation: 'isolate',
      appearance: 'none',
      userSelect: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '10',
      height: '10',
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
      _icon: {
        fill: 'var(--colors-black-alpha-400)',
        width: '5',
        height: '5'
      },
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
        },
        _highlighted: {
          _icon: { fill: 'primary' },
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
        }
      }
    }
  }),
  jsx: [/\bRatingGroup\.\w+\b/]
})
