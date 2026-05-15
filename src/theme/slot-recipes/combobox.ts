import { defineSlotRecipe } from '@pandacss/dev'
import { anatomy } from '@zag-js/combobox'

export const comboboxSlotRecipe = defineSlotRecipe({
  className: 'combobox',
  slots: anatomy.keys(),
  base: {
    root: { width: '100%', '--border-width': '2px' },
    positioner: {},
    control: { position: 'relative' },
    trigger: {
      position: 'absolute',
      top: '50%',
      right: 'calc(var(--sizes-5) + var(--border-width))',
      translate: 'calc(50% + var(--border-width) / 2) -50%',
      cursor: 'pointer',
      _icon: {
        width: '5',
        height: '5'
      }
    },
    input: {
      position: 'relative',
      appearance: 'none',
      width: 'full',
      minWidth: '0',
      height: '10',
      boxSizing: 'border-box',
      paddingInlineStart: '3',
      paddingInlineEnd: '10',
      background: 'transparent',
      color: 'surface.on',
      textAlign: 'start',
      borderWidth: 'var(--border-width)',
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
    itemGroup: {},
    itemGroupLabel: {},
    list: {},
    clearTrigger: {},
    content: {
      background: 'surface.container',
      boxShadow: 'lg',
      position: 'relative',
      width: 'var(--reference-width)',
      maxHeight:
        'min(var(--available-height, var(--sizes-80)), var(--sizes-80))',
      overflow: 'auto',
      overscrollBehavior: 'contain',
      zIndex: 'calc(var(--z-index-popover) + var(--layer-index, 0))',
      scrollbarColor:
        'var(--colors-black-alpha-500) var(--colors-black-alpha-100)',
      outlineStyle: 'none',
      _open: { animationStyle: 'floating-slide-fade-in' },
      _closed: { animationStyle: 'floating-slide-fade-out' }
    },
    item: {
      isolation: 'isolate',
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      '&:has([data-part="item-indicator"][data-state="checked"])': {
        gridTemplateColumns: 'repeat(1, minmax(0, 1fr)) min-content',
        gap: '4'
      },
      paddingInline: '3',
      minHeight: '10',
      minWidth: 0,
      cursor: 'pointer',
      alignItems: 'center',
      _after: {
        content: '""',
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        background: 'transparent',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        transitionProperty: 'background',
        transitionDuration: '150ms',
        transitionTimingFunction: 'token(easings.expressive-fast-effects)'
      },
      _hover: {
        _after: {
          transitionProperty: 'background',
          transitionDuration: '200ms',
          transitionTimingFunction: 'token(easings.expressive-default-effects)'
        }
      },
      _highlighted: {
        _after: {
          transitionProperty: 'background',
          transitionDuration: '200ms',
          transitionTimingFunction: 'token(easings.expressive-default-effects)'
        }
      },
      _checked: {
        background: 'secondary.container',
        color: 'secondary.container.on',
        _icon: { fill: 'secondary.container.on!' },
        _notDisabled: {
          _hover: {
            _after: {
              background: 'secondary.container.on/8'
            }
          },
          _highlighted: { _after: { background: 'secondary.container.on/10' } }
        }
      },
      _notDisabled: {
        _hover: { _after: { background: 'surface.on/8' } },
        _highlighted: { _after: { background: 'surface.on/10' } }
      },
      '&+li': { marginBlockStart: '2' }
    },
    itemText: {
      textWrap: 'wrap',
      wordBreak: 'break-word',
      minWidth: 0,
      overflow: 'hidden',
      paddingBlock: 'calc((40px - 1.5em) / 2)'
    },
    itemIndicator: {
      position: 'relative',
      alignSelf: 'start',
      display: 'flex',
      width: '10',
      height: '10',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 'auto',
      _icon: {
        width: '5',
        height: '5'
      }
    },
    label: { display: 'inline-flex', marginBottom: '2' }
  },
  jsx: [/\bCombobox\.\w+\b/]
})
