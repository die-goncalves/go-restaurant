import clsx from 'clsx'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { ShoppingCartSimple, StarHalf, User } from 'phosphor-react'

export function DashboardNavigation() {
  const router = useRouter()
  return (
    <>
      <nav
        className={clsx(
          'sm:hidden',
          'w-full grid grid-cols-3 rounded-b my-4 gap-4 shadow-md bg-light-gray-100/95 backdrop-grayscale'
        )}
      >
        <div className="flex flex-col gap-4">
          <NextLink
            href="/dashboard"
            className={clsx(
              'flex flex-col items-center p-2 rounded hover:bg-light-gray-200',
              'transition-[background-color, outline] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
            )}
          >
            <div
              className={clsx(
                'p-2 rounded bg-light-gray-200',
                router.asPath === '/dashboard' && 'bg-light-orange-200'
              )}
            >
              <User className="w-6 h-6 text-light-gray-800" weight="duotone" />
            </div>
            <span>Conta</span>
          </NextLink>
        </div>
        <div className="flex flex-col gap-4">
          <NextLink
            href="/dashboard/rating"
            className={clsx(
              'flex flex-col items-center p-2 rounded hover:bg-light-gray-200',
              'transition-[background-color, outline] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
            )}
          >
            <div
              className={clsx(
                'p-2 rounded bg-light-gray-200',
                router.asPath === '/dashboard/rating' && 'bg-light-orange-200'
              )}
            >
              <StarHalf
                className="w-6 h-6 text-light-gray-800"
                weight="duotone"
              />
            </div>
            <span>Avaliações</span>
          </NextLink>
        </div>
        <div className="flex flex-col gap-4">
          <NextLink
            href="/dashboard/order"
            className={clsx(
              'flex flex-col items-center p-2 rounded hover:bg-light-gray-200',
              'transition-[background-color, outline] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
            )}
          >
            <div
              className={clsx(
                'p-2 rounded bg-light-gray-200',
                router.asPath === '/dashboard/order' && 'bg-light-orange-200'
              )}
            >
              <ShoppingCartSimple
                className="w-6 h-6 text-light-gray-800"
                weight="duotone"
              />
            </div>
            <span>Pedidos</span>
          </NextLink>
        </div>
      </nav>

      <aside
        className={clsx(
          'lg:w-80',
          'sm:flex sm:flex-col sm:w-60',
          'py-4 gap-8 hidden'
        )}
      >
        <div className="flex flex-col gap-4">
          <p className="text-lg">Configurações</p>
          <div className="flex items-center gap-4">
            <div
              className={clsx(
                'p-2 rounded bg-light-gray-200',
                router.asPath === '/dashboard' && 'bg-light-orange-200'
              )}
            >
              <User className="w-6 h-6 text-light-gray-800" weight="duotone" />
            </div>
            <NextLink
              href="/dashboard"
              className={clsx(
                router.asPath === '/dashboard' && 'font-medium',
                'px-4 rounded',
                'transition-[background-color, outline] ease-in duration-150',
                'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              Conta
            </NextLink>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-lg">Ações</p>
          <div className="flex items-center gap-4">
            <div
              className={clsx(
                'p-2 rounded bg-light-gray-200',
                router.asPath === '/dashboard/rating' && 'bg-light-orange-200'
              )}
            >
              <StarHalf
                className="w-6 h-6 text-light-gray-800"
                weight="duotone"
              />
            </div>
            <NextLink
              href="/dashboard/rating"
              className={clsx(
                router.asPath === '/dashboard/rating' && 'font-medium',
                'px-4 rounded',
                'transition-[background-color, outline] ease-in duration-150',
                'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              Avaliações
            </NextLink>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-lg">Pagamentos</p>
          <div className="flex items-center gap-4">
            <div
              className={clsx(
                'p-2 rounded bg-light-gray-200',
                router.asPath === '/dashboard/order' && 'bg-light-orange-200'
              )}
            >
              <ShoppingCartSimple
                className="w-6 h-6 text-light-gray-800"
                weight="duotone"
              />
            </div>
            <NextLink
              href="/dashboard/order"
              className={clsx(
                router.asPath === '/dashboard/order' && 'font-medium',
                'px-4 rounded',
                'transition-[background-color, outline] ease-in duration-150',
                'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              Pedidos
            </NextLink>
          </div>
        </div>
      </aside>
    </>
  )
}
