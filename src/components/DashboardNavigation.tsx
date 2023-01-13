import clsx from 'clsx'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { ShoppingCartSimple, StarHalf, User } from 'phosphor-react'

export function DashboardNavigation() {
  const router = useRouter()
  return (
    <aside className="flex flex-col py-4 w-80 gap-8">
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
  )
}
