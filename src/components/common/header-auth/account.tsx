import { Link } from '@/src/components/ui/link'
import { css } from '@/styled-system/css'
import { AccountCircleIcon } from '../../icons/account-circle'

export function Account() {
  return (
    <Link
      href="/dashboard/account"
      hideIcon
      className={css({
        position: 'relative',
        isolation: 'isolate',
        appearance: 'none',
        userSelect: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        height: '10',
        minWidth: '10',
        _icon: {
          fill: 'primary.surface.on.variant',
          flexShrink: 0,
          width: '5',
          height: '5'
        },
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',
        outlineStyle: 'none',
        outlineWidth: '2px',
        outlineOffset: '2px',
        outlineColor: 'transparent',
        _focusVisible: {
          outlineStyle: 'solid',
          outlineColor: 'outline',
          _after: {
            transitionProperty: 'background',
            transitionDuration: '200ms',
            transitionTimingFunction:
              'token(easings.expressive-default-effects)'
          }
        },
        _hover: {
          _after: {
            transitionProperty: 'background',
            transitionDuration: '200ms',
            transitionTimingFunction:
              'token(easings.expressive-default-effects)'
          }
        },
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
        _notDisabled: {
          _hover: {
            _after: {
              background: 'primary.surface.on.variant/8'
            }
          },
          _focusVisible: {
            _after: {
              background: 'primary.surface.on.variant/10'
            }
          }
        }
      })}
      aria-label="Acessar minha conta"
    >
      <AccountCircleIcon />
    </Link>
  )
}
