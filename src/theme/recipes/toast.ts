import { defineParts, defineRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/toast'

export const anatomyPart = anatomy.extendWith('indicator').build()

export const parts = defineParts(anatomyPart)

export const toastRecipe = defineRecipe({
  className: 'toast',
  base: parts({
    root: {
      width: '100%',
      minWidth: '72',
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr)) min-content',
      position: 'relative',
      paddingBlock: '4',
      paddingInline: '4',
      background: 'surface.container.high',
      color: 'surface.on',

      translate: 'var(--x) var(--y)',
      scale: 'var(--scale)',
      zIndex: 'var(--z-index)',
      // height: 'var(--height)',
      opacity: 'var(--opacity)',

      willChange: 'translate, opacity, scale',
      transitionProperty: 'translate, scale, height, opacity',
      transitionDuration: '500ms, 500ms, 500ms, 200ms',
      transitionTimingFunction:
        'token(easings.expressive-default-spatial), token(easings.expressive-default-spatial), token(easings.expressive-default-spatial), token(easings.expressive-default-effects)',
      "&[data-state='closed']": {
        transitionProperty: 'translate, scale, opacity',
        transitionDuration: '350ms, 350ms, 150ms',
        transitionTimingFunction:
          'token(easings.expressive-fast-spatial), token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
      },
      "&[data-type='info']": {
        '--toast-accent': 'token(colors.info)'
      },
      "&[data-type='loading']": {
        '--toast-accent': 'token(colors.surface.on)'
      },
      "&[data-type='success']": {
        '--toast-accent': 'token(colors.success)'
      },
      "&[data-type='error']": {
        '--toast-accent': 'token(colors.error)'
      },
      "&[data-type='warning']": {
        '--toast-accent': 'token(colors.warning)'
      },
      outlineStyle: 'none',
      outlineWidth: '2px',
      outlineOffset: '2px',
      outlineColor: 'transparent',
      _focusVisible: {
        outlineStyle: 'solid',
        outlineColor: 'outline'
      }
    },
    title: {
      textStyle: 'lg',
      minHeight: '10',
      paddingBlock: 'calc((40px - 1.55556em) / 2)'
    },
    description: {
      textStyle: 'md',
      minHeight: '0',
      marginBlockStart: '2',
      '&[data-no-title]': {
        paddingBlock: 'calc((40px - 1.5em) / 2)',
        marginBlockStart: '0',
        minHeight: '10'
      }
    },
    group: {},
    indicator: {
      position: 'relative',
      display: 'inline-flex',
      height: '1lh',
      verticalAlign: 'bottom',
      marginInlineEnd: '4',
      flexShrink: 0,
      _icon: {
        position: 'relative',
        translate: '0% -50%',
        top: '50%',
        width: '5',
        height: '5',
        fill: 'var(--toast-accent)'
      }
    },
    actionTrigger: {},
    closeTrigger: {
      alignSelf: 'flex-start'
    }
  }),
  jsx: [/\bToast\.\w+\b/]
})
