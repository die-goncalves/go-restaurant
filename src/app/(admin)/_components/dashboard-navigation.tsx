'use client'

import { usePathname } from 'next/navigation'
import { ComponentProps, JSX } from 'react'
import { PaymentsIcon } from '@/src/components/icons/payments'
import { PersonIcon } from '@/src/components/icons/person'
import { StarIcon } from '@/src/components/icons/star'
import { Link } from '@/src/components/ui/link'
import { css, cx } from '@/styled-system/css'

type IconComponent = (props: ComponentProps<'svg'>) => JSX.Element

type NavItem = {
  href: string
  label: string
  Icon: IconComponent
}

const navItems: NavItem[] = [
  {
    href: '/dashboard/account',
    label: 'Conta',
    Icon: PersonIcon
  },
  {
    href: '/dashboard/rating',
    label: 'Avaliações',
    Icon: StarIcon
  },
  {
    href: '/dashboard/order',
    label: 'Pedidos',
    Icon: PaymentsIcon
  }
]

export function DashboardNavigation() {
  const pathname = usePathname()

  return (
    <>
      <nav
        className={css({
          position: 'relative',
          display: { base: 'grid', medium: 'none' },
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          width: '100%',
          background: 'surface.container'
        })}
      >
        {navItems.map(({ href, label, Icon }) => {
          const active = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={cx(
                'group',
                css({
                  position: 'relative',
                  appearance: 'none',
                  userSelect: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  width: '100%',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingBlock: '1.5',
                  gap: '1',
                  outlineOffset: '-2px'
                })
              )}
            >
              <div
                className={css({
                  position: 'relative',
                  isolation: 'isolate',
                  paddingBlock: '1.5',
                  paddingInline: '4.5',
                  background: active ? 'secondary.container' : 'transparent',
                  _groupHover: {
                    _after: {
                      background: active
                        ? 'secondary.container.on/8'
                        : 'primary.surface.on/8',
                      transitionProperty: 'background',
                      transitionDuration: '200ms',
                      transitionTimingFunction:
                        'token(easings.expressive-default-effects)'
                    }
                  },
                  _groupFocusVisible: {
                    _after: {
                      background: active
                        ? 'secondary.container.on/10'
                        : 'primary.surface.on/10',
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
                    transitionTimingFunction:
                      'token(easings.expressive-fast-effects)'
                  }
                })}
              >
                <Icon
                  style={{
                    fill: active
                      ? 'var(--colors-secondary-container-on)'
                      : 'var(--colors-primary-surface-on-variant)'
                  }}
                  className={css({
                    width: '5',
                    height: '5'
                  })}
                />
              </div>
              <span
                style={{
                  color: active
                    ? 'var(--colors-secondary)'
                    : 'var(--colors-primary-surface-on-variant)'
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      <aside
        className={css({
          display: { base: 'none', medium: 'flex' },
          flexDirection: 'column',
          gap: '4'
        })}
      >
        {navItems.map(({ href, label, Icon }) => {
          const active = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={cx(
                'group',
                css({
                  position: 'relative',
                  appearance: 'none',
                  userSelect: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  width: { base: '24', expanded: 'auto' },
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingBlock: { base: '1.5', expanded: 'unset' },
                  gap: '1',
                  outlineOffset: { base: '-2px', expanded: '2px' }
                })
              )}
            >
              <div
                className={css({
                  position: 'relative',
                  display: { base: 'none', expanded: 'inline-flex' },
                  gap: '2',
                  isolation: 'isolate',
                  minHeight: '10',
                  alignItems: 'center',
                  justifyContent: 'start',
                  paddingInline: '4',
                  width: '100%',
                  background: active ? 'secondary.container' : 'transparent',
                  _groupHover: {
                    _after: {
                      background: active
                        ? 'secondary.container.on/8'
                        : 'primary.surface.on/8',
                      transitionProperty: 'background',
                      transitionDuration: '200ms',
                      transitionTimingFunction:
                        'token(easings.expressive-default-effects)'
                    }
                  },
                  _groupFocusVisible: {
                    _after: {
                      background: active
                        ? 'secondary.container.on/10'
                        : 'primary.surface.on/10',
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
                    transitionTimingFunction:
                      'token(easings.expressive-fast-effects)'
                  }
                })}
              >
                <Icon
                  className={css({
                    width: '5',
                    height: '5',
                    fill: active
                      ? 'secondary.container.on'
                      : 'primary.surface.on.variant'
                  })}
                />
                <span
                  className={css({
                    color: active
                      ? 'secondary.container.on'
                      : 'primary.surface.on.variant'
                  })}
                >
                  {label}
                </span>
              </div>
              <div
                className={css({
                  position: 'relative',
                  display: { base: 'unset', expanded: 'none' },
                  isolation: 'isolate',
                  paddingBlock: '1.5',
                  paddingInline: '4.5',
                  background: active ? 'secondary.container' : 'transparent',
                  _groupHover: {
                    _after: {
                      background: active
                        ? 'secondary.container.on/8'
                        : 'primary.surface.on/8',
                      transitionProperty: 'background',
                      transitionDuration: '200ms',
                      transitionTimingFunction:
                        'token(easings.expressive-default-effects)'
                    }
                  },
                  _groupFocusVisible: {
                    _after: {
                      background: active
                        ? 'secondary.container.on/10'
                        : 'primary.surface.on/10',
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
                    transitionTimingFunction:
                      'token(easings.expressive-fast-effects)'
                  }
                })}
              >
                <Icon
                  className={css({
                    width: '5',
                    height: '5',
                    fill: active
                      ? 'secondary.container.on'
                      : 'primary.surface.on.variant'
                  })}
                />
              </div>
              <span
                className={css({
                  display: { base: 'unset', expanded: 'none' },
                  color: active ? 'secondary' : 'primary.surface.on.variant'
                })}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </aside>
    </>
  )
}
