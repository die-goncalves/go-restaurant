import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/dialog'

export const drawerSlotRecipe = defineSlotRecipe({
  slots: anatomy.keys(),
  className: 'drawer',
  base: {
    backdrop: {
      position: 'fixed',
      height: '100dvh',
      width: '100dvw',
      inset: 0,
      background: 'token(colors.black.alpha.500)',
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
      '--drawer-z-index': 'var(--z-index-modal)',
      zIndex: 'calc(var(--drawer-z-index) + var(--layer-index, 0))'
    },
    content: {
      position: 'relative',
      display: 'grid',
      gridTemplateRows: 'min-content 1fr min-content',
      maxHeight: '100dvh',
      width: '100%',
      outlineStyle: 'none',
      textStyle: 'md',
      background: 'token(colors.surface.container.high)',
      boxShadow: '2xl',
      overflow: 'inherit',
      borderRadius: 'inherit',
      '--drawer-z-index': 'var(--z-index-modal)',
      zIndex: 'calc(var(--drawer-z-index) + var(--layer-index, 0))'
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
        content: { maxWidth: '100vw', height: '100%' }
      }
    },
    placement: {
      left: {
        positioner: { justifyContent: 'flex-start' },
        content: {
          _open: { animationStyle: 'slide-from-left-full-fade-in' },
          _closed: { animationStyle: 'slide-to-left-full-fade-out' }
        }
      },
      right: {
        positioner: { justifyContent: 'flex-end' },
        content: {
          _open: { animationStyle: 'slide-from-right-full-fade-in' },
          _closed: { animationStyle: 'slide-to-right-full-fade-out' }
        }
      },
      top: {
        positioner: { alignItems: 'flex-start', justifyContent: 'center' },
        content: {
          _open: { animationStyle: 'slide-from-top-full-fade-in' },
          _closed: { animationStyle: 'slide-to-top-full-fade-out' }
        }
      },
      bottom: {
        positioner: { alignItems: 'flex-end', justifyContent: 'center' },
        content: {
          _open: { animationStyle: 'slide-from-bottom-full-fade-in' },
          _closed: { animationStyle: 'slide-to-bottom-full-fade-out' }
        }
      }
    }
  },
  compoundVariants: [
    {
      size: 'xs',
      placement: ['bottom', 'top'],
      css: { content: { maxHeight: 'xs' } }
    },
    {
      size: 'sm',
      placement: ['bottom', 'top'],
      css: { content: { maxHeight: 'sm' } }
    },
    {
      size: 'md',
      placement: ['bottom', 'top'],
      css: { content: { maxHeight: 'md' } }
    },
    {
      size: 'lg',
      placement: ['bottom', 'top'],
      css: { content: { maxHeight: 'lg' } }
    },
    {
      size: 'xl',
      placement: ['bottom', 'top'],
      css: { content: { maxHeight: 'xl' } }
    }
  ],
  defaultVariants: { size: 'xs', placement: 'bottom' },
  jsx: [/\bDrawer\.\w+\b/]
})
