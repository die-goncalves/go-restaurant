'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { LoginIcon } from '@/src/components/icons/login'
import { Link } from '@/src/components/ui/link'
import { css } from '@/styled-system/css'

export function SignIn() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const path = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname

  return (
    <Link
      href={`/login?redirectTo=${encodeURIComponent(path)}`}
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
      aria-label="Entrar ou Cadastrar-se"
    >
      <LoginIcon />
    </Link>
  )
}
