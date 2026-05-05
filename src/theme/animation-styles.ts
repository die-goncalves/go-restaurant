import { defineAnimationStyles } from '@pandacss/dev'

export const animationStyles = defineAnimationStyles({
  'fade-in': {
    value: {
      animationName: 'fade-in',
      animationDuration: '200ms',
      animationTimingFunction: 'token(easings.expressive-default-effects)'
    }
  },
  'fade-out': {
    value: {
      animationName: 'fade-out',
      animationDuration: '150ms',
      animationTimingFunction: 'token(easings.expressive-fast-effects)'
    }
  },
  'scale-in': {
    value: {
      animationName: 'scale-in',
      animationDuration: '500ms',
      animationTimingFunction: 'token(easings.expressive-default-spatial)'
    }
  },
  'scale-out': {
    value: {
      animationName: 'scale-out',
      animationDuration: '350ms',
      animationTimingFunction: 'token(easings.expressive-fast-spatial)'
    }
  },
  'scale-fade-in': {
    value: {
      animationName: 'scale-in, fade-in',
      animationDuration: '500ms, 200ms',
      animationTimingFunction:
        'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
    }
  },
  'scale-fade-out': {
    value: {
      animationName: 'scale-out, fade-out',
      animationDuration: '350ms, 150ms',
      animationTimingFunction:
        'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
    }
  },
  'slide-from-top-fade-in': {
    value: {
      animationName: 'slide-from-top, fade-in',
      animationDuration: '500ms, 200ms',
      animationTimingFunction:
        'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
    }
  },
  'slide-to-top-fade-out': {
    value: {
      animationName: 'slide-to-top, fade-out',
      animationDuration: '350ms, 150ms',
      animationTimingFunction:
        'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
    }
  },
  'slide-from-bottom-fade-in': {
    value: {
      animationName: 'slide-from-bottom, fade-in',
      animationDuration: '500ms, 200ms',
      animationTimingFunction:
        'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
    }
  },
  'slide-to-bottom-fade-out': {
    value: {
      animationName: 'slide-to-bottom, fade-out',
      animationDuration: '350ms, 150ms',
      animationTimingFunction:
        'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
    }
  },
  'slide-from-right-full-fade-in': {
    value: {
      animationName: 'slide-from-right-full, fade-in',
      animationDuration: '500ms, 200ms',
      animationTimingFunction:
        'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
    }
  },
  'slide-to-right-full-fade-out': {
    value: {
      animationName: 'slide-to-right-full, fade-out',
      animationDuration: '350ms, 150ms',
      animationTimingFunction:
        'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
    }
  },
  'slide-from-left-full-fade-in': {
    value: {
      animationName: 'slide-from-left-full, fade-in',
      animationDuration: '500ms, 200ms',
      animationTimingFunction:
        'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
    }
  },
  'slide-to-left-full-fade-out': {
    value: {
      animationName: 'slide-to-left-full, fade-out',
      animationDuration: '350ms, 150ms',
      animationTimingFunction:
        'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
    }
  },
  'slide-from-top-full-fade-in': {
    value: {
      animationName: 'slide-from-top-full, fade-in',
      animationDuration: '500ms, 200ms',
      animationTimingFunction:
        'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
    }
  },
  'slide-to-top-full-fade-out': {
    value: {
      animationName: 'slide-to-top-full, fade-out',
      animationDuration: '350ms, 150ms',
      animationTimingFunction:
        'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
    }
  },
  'slide-from-bottom-full-fade-in': {
    value: {
      animationName: 'slide-from-bottom-full, fade-in',
      animationDuration: '500ms, 200ms',
      animationTimingFunction:
        'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
    }
  },
  'slide-to-bottom-full-fade-out': {
    value: {
      animationName: 'slide-to-bottom-full, fade-out',
      animationDuration: '350ms, 150ms',
      animationTimingFunction:
        'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
    }
  },
  'expand-height-fade-in': {
    value: {
      animationName: 'expand-height, fade-in',
      animationDuration: '500ms, 200ms',
      animationTimingFunction:
        'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
    }
  },
  'collapse-height-fade-out': {
    value: {
      animationName: 'collapse-height, fade-out',
      animationDuration: '350ms, 150ms',
      animationTimingFunction:
        'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
    }
  },
  'floating-slide-fade-in': {
    value: {
      transformOrigin: 'var(--transform-origin)',
      '&[data-placement^=top]': {
        animationName: 'slide-from-bottom, fade-in',
        animationDuration: '500ms, 200ms',
        animationTimingFunction:
          'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
      },
      '&[data-placement^=bottom]': {
        animationName: 'slide-from-top, fade-in',
        animationDuration: '500ms, 200ms',
        animationTimingFunction:
          'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
      },
      '&[data-placement^=left]': {
        animationName: 'slide-from-right, fade-in',
        animationDuration: '500ms, 200ms',
        animationTimingFunction:
          'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
      },
      '&[data-placement^=right]': {
        animationName: 'slide-from-left, fade-in',
        animationDuration: '500ms, 200ms',
        animationTimingFunction:
          'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
      }
    }
  },
  'floating-slide-fade-out': {
    value: {
      transformOrigin: 'var(--transform-origin)',
      '&[data-placement^=top]': {
        animationName: 'slide-to-bottom, fade-out',
        animationDuration: '350ms, 150ms',
        animationTimingFunction:
          'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
      },
      '&[data-placement^=bottom]': {
        animationName: 'slide-to-top, fade-out',
        animationDuration: '350ms, 150ms',
        animationTimingFunction:
          'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
      },
      '&[data-placement^=left]': {
        animationName: 'slide-to-right, fade-out',
        animationDuration: '350ms, 150ms',
        animationTimingFunction:
          'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
      },
      '&[data-placement^=right]': {
        animationName: 'slide-to-left, fade-out',
        animationDuration: '350ms, 150ms',
        animationTimingFunction:
          'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)'
      }
    }
  }
})
