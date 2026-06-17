import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/tour'

export const extendedAnatomy = anatomy.extendWith('trigger', 'progressBar')

export const keys = extendedAnatomy.keys()

export const tourSlotRecipe = defineSlotRecipe({
  className: 'tour',
  slots: keys,
  base: {
    spotlight: {},
    progressText: { textStyle: 'sm', opacity: 0.64 },
    progressBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '1',
      background: 'black.alpha.300',
      overflow: 'hidden',
      '& > div': {
        height: '100%',
        background: 'var(--colors-primary-container)'
      }
    },
    arrowTip: {
      borderTop: '1px solid var(--colors-primary)',
      borderLeft: '1px solid var(--colors-primary)'
    },
    arrow: {
      '--arrow-size': '10px',
      '--arrow-background': 'var(--colors-surface-container-high)'
    },
    actionTrigger: {},
    backdrop: {
      position: 'fixed',
      inset: 0,
      background: 'token(colors.black.alpha.500)',
      backdropFilter: 'blur(0px)',
      '--z-index': 'var(--z-index-modal)',
      zIndex: 'calc(var(--z-index) + var(--tour-layer, 0))',
      _open: { animationStyle: 'fade-in' },
      _closed: { animationStyle: 'fade-out' }
    },
    positioner: {
      position: 'fixed',
      '--z-index': 'var(--z-index-modal)',
      zIndex: 'calc(var(--z-index) + var(--tour-layer, 0))',
      "&[data-type='dialog']": {
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: { base: '4', medium: 'auto' }
      },
      "&[data-type='tooltip']": {
        "&[data-placement*='bottom']": {},
        "&[data-placement*='top']": {},
        "&[data-placement*='end']": {},
        "&[data-placement*='start']": {}
      }
    },
    content: {
      position: 'relative',
      display: 'grid',
      gridTemplateRows: 'min-content 1fr min-content',
      height: 'min-content',
      outlineStyle: 'none',
      textStyle: 'md',
      background: 'token(colors.surface.container.high)',
      boxShadow: '2xl',
      overflow: 'inherit',
      borderRadius: 'inherit',
      "&[data-type='dialog']": {
        maxWidth: 'md',
        _open: { animationStyle: 'fade-in' },
        _closed: { animationStyle: 'fade-out' }
      },
      "&[data-type='tooltip']": {
        width: 'min(var(--available-width), var(--sizes-sm))',
        _open: { animationStyle: 'floating-slide-fade-in' },
        _closed: { animationStyle: 'floating-slide-fade-out' }
      }
    },
    title: { textStyle: 'xl' },
    description: {},
    closeTrigger: {}
  },
  jsx: [/\bTour\.\w+\b/]
})
