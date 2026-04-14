import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/dialog'

export const dialogSlotRecipe = defineSlotRecipe({
  slots: anatomy.keys(),
  className: 'dialog',
  base: {
    backdrop: {
      position: 'fixed',
      height: '100dvh',
      width: '100dvw',
      inset: 0,
      background: 'token(colors.blackAlpha.500)',
      WebkitBackdropFilter: 'blur(0px)',
      backdropFilter: 'blur(0px)',
      zIndex: 'var(--z-index-modal)',
      _open: { animationStyle: 'fade-in' },
      _closed: { animationStyle: 'fade-out' }
    },
    positioner: {
      display: 'flex',
      position: 'fixed',
      height: '100dvh',
      width: '100dvw',
      inset: 0,
      '--dialog-z-index': 'var(--z-index-modal)',
      zIndex: 'calc(var(--dialog-z-index) + var(--layer-index, 0))'
    },
    content: {
      position: 'relative',
      display: 'grid',
      gridTemplateRows: 'min-content 1fr min-content',
      height: { base: '100dvh', medium: 'min-content' },
      maxHeight: { base: '100dvh', medium: 'calc(100dvh - 8rem)' },
      width: '100%',
      outlineStyle: 'none',
      textStyle: 'md',
      background: 'token(colors.surface.container.high)',
      boxShadow: '2xl',
      overflow: 'inherit',
      borderRadius: 'inherit',
      '--dialog-z-index': 'var(--z-index-modal)',
      zIndex: 'calc(var(--dialog-z-index) + var(--layer-index, 0))'
    },
    title: {},
    description: {
      textWrap: 'pretty',
      marginBottom: '4'
    },
    closeTrigger: {}
  },
  variants: {
    size: {
      xs: { content: { maxWidth: { base: '100vw', medium: 'xs' } } },
      sm: { content: { maxWidth: { base: '100vw', medium: 'sm' } } },
      md: { content: { maxWidth: { base: '100vw', medium: 'md' } } },
      lg: { content: { maxWidth: { base: '100vw', medium: 'lg' } } },
      xl: { content: { maxWidth: { base: '100vw', medium: 'xl' } } },
      full: {
        content: { maxWidth: '100vw', maxHeight: '100dvh', height: '100%' }
      }
    },
    placement: {
      center: {
        positioner: {
          alignItems: 'center',
          justifyContent: 'center'
        },
        content: {
          _open: { animationStyle: 'scale-fade-in' },
          _closed: { animationStyle: 'scale-fade-out' }
        }
      },
      top: {
        positioner: { alignItems: 'flex-start', justifyContent: 'center' },
        content: {
          _open: { animationStyle: 'slide-from-top-fade-in' },
          _closed: { animationStyle: 'slide-to-top-fade-out' }
        }
      },
      bottom: {
        positioner: { alignItems: 'flex-end', justifyContent: 'center' },
        content: {
          _open: { animationStyle: 'slide-from-bottom-fade-in' },
          _closed: { animationStyle: 'slide-to-bottom-fade-out' }
        }
      }
    }
  },
  defaultVariants: {
    placement: 'center',
    size: 'md'
  },
  jsx: [/\bDialog\.\w+\b/]
})
