import { defineParts, defineRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/slider'

export const anatomyPart = anatomy.extendWith('inactiveRange').build()

export const parts = defineParts(anatomyPart)

export const sliderRecipe = defineRecipe({
  className: 'slider',
  base: parts({
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
      textStyle: 'sm',
      position: 'relative',
      isolation: 'isolate',
      touchAction: 'none',
      '--slider-thumb-size': 'token(sizes.3)',
      '--slider-track-size': 'token(sizes.10)',
      '--slider-marker-size': 'token(sizes.1)',
      '--slider-marker-inset': 'token(sizes.0)'
    },
    label: {},
    control: {
      display: 'inline-flex',
      alignItems: 'center',
      position: 'relative'
    },
    draggingIndicator: {},
    track: {
      overflow: 'hidden',
      width: '100%',
      height: 'var(--slider-track-size)',
      background: 'transparent'
    },
    range: {
      height: 'inherit',
      background: 'primary',
      right:
        'calc(calc(var(--slider-range-end) + calc(calc(calc(100% - var(--slider-range-end)) / 1%) * calc(var(--slider-thumb-size) / 1px) / 100 * 1px)) + 2px)!',
      borderRadius: '0px 0px 0px 0px'
    },
    inactiveRange: {
      position: 'absolute',
      background: 'var(--colors-secondary-container)',
      height: '100%',
      right: 0,
      left: 'calc(100% - calc(calc(var(--slider-range-end) + calc(calc(calc(100% - var(--slider-range-end)) / 1%) * calc(var(--slider-thumb-size) / 1px) / 100 * 1px)) - var(--slider-thumb-size) - 2px))',
      borderRadius: '0px 0px 0px 0px'
    },
    markerGroup: {
      alignSelf: 'end',
      position: 'absolute!',
      display: 'flex',
      alignItems: 'center',
      height: '10',
      inset: '0',
      zIndex: 1,
      pointerEvents: 'none',
      insetInline: 'var(--slider-marker-inset)'
    },
    marker: {
      boxSize: 'var(--slider-marker-size)',
      _underValue: {
        background: 'primary.on'
      },
      _atValue: {
        background: 'primary.on'
      },
      _overValue: {
        background: 'secondary.container.on'
      }
    },
    thumb: {
      width: 'var(--slider-thumb-size)',
      height: '100%',
      outline: 0,
      zIndex: 2,
      background: 'transparent',
      outlineStyle: 'none',
      _focusVisible: {
        _before: {
          outlineStyle: 'solid',
          outlineColor: 'outline'
        }
      },
      _before: {
        content: '""',
        position: 'absolute',
        inset: '0',
        width: '1',
        top: '50%',
        left: '50%',
        translate: '-50% -50%',
        height: '130%',
        background: 'primary',
        outlineWidth: '2px',
        outlineOffset: '2px',
        outlineColor: 'transparent'
      }
    },
    valueText: {}
  })
})
