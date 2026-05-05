import { defineParts, defineRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/toggle-group'

export const anatomyPart = anatomy.build()

export const parts = defineParts(anatomyPart)

export const toggleGroupRecipe = defineRecipe({
  className: 'toggle-group',
  base: parts({
    root: {
      display: 'inline-flex',
      flexWrap: 'wrap',
      gap: '2'
    },
    item: {
      isolation: 'isolate',
      position: 'relative',
      display: 'inline-flex',
      height: '8',
      minWidth: '8',
      textStyle: 'sm',
      paddingInline: '3',
      gap: '1',
      _icon: {
        fill: 'currentColor',
        width: '4',
        height: '4'
      },
      alignItems: 'center',
      justifyContent: 'center',
      appearance: 'none',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
      cursor: 'pointer',
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
      },
      background: 'transparent',
      color: 'primary.surface.on.variant',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'secondary.container',
      _notDisabled: {
        _hover: {
          _after: { background: 'primary.surface.on.variant/8' }
        },
        _focusVisible: {
          _after: { background: 'primary.surface.on.variant/10' }
        }
      },
      _checked: {
        background: 'secondary.container',
        color: 'secondary.container.on',
        _notDisabled: {
          _hover: {
            _after: { background: 'secondary.container.on/8' }
          },
          _focusVisible: {
            _after: { background: 'secondary.container.on/10' }
          }
        }
      }
    }
  }),
  jsx: [/\bToggleGroup\.\w+\b/]
})
