import { defineParts, defineRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/accordion'

export const anatomyPart = anatomy.extendWith('itemContentInner').build()

export const parts = defineParts(anatomyPart)

export const accordionRecipe = defineRecipe({
  className: 'accordion',
  base: parts({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    item: {
      overflowAnchor: 'none'
    },
    itemTrigger: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '10',
      width: '100%',
      paddingInline: '4',
      outlineStyle: 'none',
      outlineWidth: '2px',
      outlineOffset: '2px',
      outlineColor: 'transparent',
      _focusVisible: {
        outlineStyle: 'solid',
        outlineColor: 'outline',
        zIndex: 1
      }
    },
    itemContent: {
      position: 'relative',
      overflow: 'hidden',
      _open: {
        animationStyle: 'expand-height-fade-in'
      },
      _closed: {
        animationStyle: 'collapse-height-fade-out'
      }
    },
    itemContentInner: {
      paddingInline: '4',
      paddingBlock: '4'
    },
    itemIndicator: {
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
    }
  }),
  jsx: [/\bAccordion\.\w+\b/]
})
