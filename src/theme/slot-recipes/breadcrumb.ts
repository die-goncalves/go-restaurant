import { defineSlotRecipe } from '@pandacss/dev'

export const breadcrumbSlotRecipe = defineSlotRecipe({
  className: 'breadcrumb',
  slots: ['root', 'item', 'currentItem', 'separator'],
  base: {
    root: {
      '& ol': {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        wordBreak: 'break-word',
        color: 'surface.on',
        listStyle: 'none',
        columnGap: '0.25em'
      }
    },
    item: {
      display: 'inline-flex'
    },
    currentItem: {
      display: 'inline-flex',
      fontWeight: '500'
    },
    separator: {
      color: 'surface.on',
      opacity: 0.56
    }
  }
})
