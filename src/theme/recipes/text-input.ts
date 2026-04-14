import { defineParts, defineRecipe } from '@pandacss/dev'
import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('text-input').parts(
  'root',
  'label',
  'input',
  'description',
  'error'
)
export const anatomyPart = anatomy.build()

export const parts = defineParts(anatomyPart)

export const textInputRecipe = defineRecipe({
  className: 'text-input',
  base: parts({
    root: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      display: 'inline-flex',
      marginBottom: '2'
    },
    input: {
      position: 'relative',
      appearance: 'none',
      width: 'full',
      minWidth: '0',
      height: '10',
      boxSizing: 'border-box',
      paddingInline: '3',
      background: 'transparent',
      color: 'surface.on',
      textAlign: 'start',
      borderWidth: '2px',
      borderColor: 'surface.on',
      outlineStyle: 'none',
      outlineWidth: '2px',
      outlineOffset: '2px',
      outlineColor: 'transparent',
      _placeholder: { color: 'surface.on/56' },
      _focus: {
        outlineStyle: 'solid',
        outlineColor: 'outline'
      },
      _invalid: {
        borderColor: 'error'
      },
      _disabled: {
        cursor: 'not-allowed',
        opacity: 0.56
      }
    },
    description: {
      display: 'inline-flex',
      flexDirection: 'column',
      textStyle: 'sm',
      marginTop: '1'
    },
    error: {
      display: 'inline-flex',
      color: 'error',
      textStyle: 'sm',
      marginTop: '1'
    }
  }),
  jsx: [/\bTextInput\.\w+\b/]
})
