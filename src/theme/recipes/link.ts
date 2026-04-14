import { defineRecipe } from '@pandacss/dev'

export const linkRecipe = defineRecipe({
  className: 'link',
  base: {
    position: 'relative',
    display: 'inline-flex',
    width: 'fit-content',
    cursor: 'pointer',
    color: 'surface.on',
    _icon: {
      fill: 'surface.on',
      width: '5',
      height: '5'
    },
    outlineStyle: 'none',
    outlineWidth: '2px',
    outlineOffset: '2px',
    outlineColor: 'transparent',
    _focus: {
      outlineStyle: 'solid',
      outlineColor: 'outline'
    }
  },
  variants: {
    italic: {
      true: {
        fontStyle: 'italic'
      }
    },
    underline: {
      true: {
        textDecoration: 'underline',
        textUnderlineOffset: '4px',
        textDecorationColor: 'fg'
      }
    }
  },
  defaultVariants: {
    italic: false,
    underline: false
  }
})
