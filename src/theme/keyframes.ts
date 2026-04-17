export const keyframes = {
  'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
  'fade-out': { from: { opacity: 1 }, to: { opacity: 0 } },
  'collapse-height': {
    from: { height: 'var(--height)' },
    to: { height: '0' }
  },
  'expand-height': {
    from: { height: '0' },
    to: { height: 'var(--height)' }
  },
  'slide-from-left-full': {
    from: { translate: '-100% 0' },
    to: { translate: '0 0' }
  },
  'slide-from-right-full': {
    from: { translate: '100% 0' },
    to: { translate: '0 0' }
  },
  'slide-from-top-full': {
    from: { translate: '0 -100%' },
    to: { translate: '0 0' }
  },
  'slide-from-bottom-full': {
    from: { translate: '0 100%' },
    to: { translate: '0 0' }
  },
  'slide-to-left-full': {
    from: { translate: '0 0' },
    to: { translate: '-100% 0' }
  },
  'slide-to-right-full': {
    from: { translate: '0 0' },
    to: { translate: '100% 0' }
  },
  'slide-to-top-full': {
    from: { translate: '0 0' },
    to: { translate: '0 -100%' }
  },
  'slide-to-bottom-full': {
    from: { translate: '0 0' },
    to: { translate: '0 100%' }
  },
  'slide-from-top': {
    '0%': { translate: '0 -0.5rem' },
    to: { translate: '0' }
  },
  'slide-from-bottom': {
    '0%': { translate: '0 0.5rem' },
    to: { translate: '0' }
  },
  'slide-from-left': {
    '0%': { translate: '-0.5rem 0' },
    to: { translate: '0' }
  },
  'slide-from-right': {
    '0%': { translate: '0.5rem 0' },
    to: { translate: '0' }
  },
  'slide-to-top': { '0%': { translate: '0' }, to: { translate: '0 -0.5rem' } },
  'slide-to-bottom': {
    '0%': { translate: '0' },
    to: { translate: '0 0.5rem' }
  },
  'slide-to-left': { '0%': { translate: '0' }, to: { translate: '-0.5rem 0' } },
  'slide-to-right': { '0%': { translate: '0' }, to: { translate: '0.5rem 0' } },
  'scale-in': { from: { scale: '0.95' }, to: { scale: '1' } },
  'scale-out': { from: { scale: '1' }, to: { scale: '0.95' } },
  heartbeat: {
    '0%': {
      animationTimingFunction: 'ease-out',
      transform: 'scale(1)',
      transformOrigin: 'center center'
    },
    '10%': {
      animationTimingFunction: 'ease-in',
      transform: 'scale(1.09)'
    },
    '17%': {
      animationTimingFunction: 'ease-out',
      transform: 'scale(1.02)'
    },
    '33%': {
      animationTimingFunction: 'ease-in',
      transform: 'scale(1.13)'
    },
    '45%': { animationTimingFunction: 'ease-out', transform: 'scale(1)' }
  }
}
