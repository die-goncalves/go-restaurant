export const keyframes = {
  overlayShow: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' }
  },
  contentShow: {
    '0%': { opacity: '0', transform: 'translate(-50%, -48%) scale(.96)' },
    '100%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' }
  },
  slideLeft: {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(0)' }
  },
  slideRight: {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(100%)' }
  },
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' }
  },
  fadeOut: {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' }
  },
  enter: {
    '0%': { transform: 'translate(50%, 0)', opacity: '0' },
    '100%': { transform: 'translate(0, 0)', opacity: '1' }
  },
  leave: {
    '0%': { transform: 'translate(0, 0)', opacity: '1' },
    '100%': { transform: 'translate(100%, 0)', opacity: '0' }
  },
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' }
  },
  fade: {
    '0%': { opacity: '0', transform: 'scale(0.9)' },
    '100%': { opacity: '1', transform: 'scale(1)' }
  },
  slideDown: {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' }
  },
  slideUp: {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' }
  },
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
