import { css } from '@/styled-system/css'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon, ShoppingCartSimple, StarHalf, User } from 'phosphor-react'

const navItems: { href: string; label: string; section: string; Icon: Icon }[] =
  [
    {
      href: '/dashboard/profile',
      label: 'Conta',
      section: 'Configurações',
      Icon: User
    },
    {
      href: '/dashboard/rating',
      label: 'Avaliações',
      section: 'Ações',
      Icon: StarHalf
    },
    {
      href: '/dashboard/order',
      label: 'Pedidos',
      section: 'Pagamentos',
      Icon: ShoppingCartSimple
    }
  ]

const navLink = css.raw({
  transition: 'background-color 150ms ease-in',
  outline: 'none',
  _focus: {
    outlineStyle: 'solid',
    outlineWidth: '2',
    outlineOffset: '2',
    outlineColor: 'light.indigo.300'
  }
})

const iconStyle = css({ w: '6', h: '6', color: 'light.gray.800' })

export function DashboardNavigation() {
  const pathname = usePathname()

  return (
    <>
      <nav
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          w: 'full',
          rounded: 'b',
          my: '4',
          gap: '4',
          shadow: 'md',
          bg: 'light.gray.100/95',
          backdropFilter: 'grayscale(1)',
          sm: { display: 'none' }
        })}
      >
        {navItems.map(({ href, label, Icon }) => (
          <div
            key={href}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4'
            })}
          >
            <NextLink
              href={href}
              className={css([
                navLink,
                {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: '2',
                  rounded: 'sm',
                  _hover: { bg: 'light.gray.200' }
                }
              ])}
            >
              <div
                className={css({
                  p: '2',
                  rounded: 'sm',
                  bg: pathname === href ? 'light.orange.200' : 'light.gray.200'
                })}
              >
                <Icon className={iconStyle} weight="duotone" />
              </div>
              <span>{label}</span>
            </NextLink>
          </div>
        ))}
      </nav>

      <aside
        className={css({
          display: 'none',
          py: '4',
          gap: '8',
          sm: { display: 'flex', flexDirection: 'column', w: '60' },
          lg: { w: '80' }
        })}
      >
        {navItems.map(({ href, label, section, Icon }) => (
          <div
            key={href}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4'
            })}
          >
            <p className={css({ fontSize: 'lg' })}>{section}</p>
            <div
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '4'
              })}
            >
              <div
                className={css({
                  p: '2',
                  rounded: 'sm',
                  bg: pathname === href ? 'light.orange.200' : 'light.gray.200'
                })}
              >
                <Icon className={iconStyle} weight="duotone" />
              </div>
              <NextLink
                href={href}
                className={css([
                  navLink,
                  {
                    px: '4',
                    rounded: 'sm',
                    fontWeight: pathname === href ? 'medium' : 'normal'
                  }
                ])}
              >
                {label}
              </NextLink>
            </div>
          </div>
        ))}
      </aside>
    </>
  )
}
