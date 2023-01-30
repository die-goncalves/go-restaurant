import clsx from 'clsx'
import { SignOut, User, UserGear } from 'phosphor-react'
import NextLink from 'next/link'
import NextRouter from 'next/router'
import { Popover } from './Popover'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export function SignedUser() {
  const { session, signOut } = useAuth()

  async function handleSignOut() {
    const { error } = await signOut()
    if (error) {
      toast.error(error.message)
    } else {
      NextRouter.push('/')
    }
  }

  return (
    <div
      className={clsx(
        'xs:rounded xs:shadow-[inset_0px_-2px_0px_0px_#d6d3d1]',
        'flex items-center justify-center'
      )}
    >
      <span className={clsx('xs:inline', 'px-2 hidden')}>
        {session?.user.email}
      </span>
      <Popover.Root>
        <Popover.Trigger>
          <button
            className={clsx(
              'xs:box-border xs:border-2 xs:border-light-gray-300',
              'flex w-10 h-10 justify-center items-center rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
              'transition-[background-color] ease-in duration-150',
              'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
            )}
          >
            <User className="m-auto w-6 h-6 text-light-gray-800" />
          </button>
        </Popover.Trigger>

        <Popover.Content sideOffset={8} className="p-4 w-60 z-[2]">
          <div className="flex flex-col gap-2">
            <span
              className={clsx(
                'xs:hidden',
                'flex rounded items-center justify-center font-medium h-10 border-2 border-light-gray-200'
              )}
            >
              {session?.user.email}
            </span>
            <NextLink
              href="/dashboard"
              className={clsx(
                'py-2 px-4 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300 group',
                'transition-[background-color] ease-in duration-150',
                'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              <div className="flex items-center gap-4">
                <UserGear className="w-6 h-6 text-light-gray-800" />
                <p>Painel de controle</p>
              </div>
            </NextLink>
            <button
              onClick={handleSignOut}
              className={clsx(
                'py-2 px-4 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                'transition-[background-color] ease-in duration-150',
                'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              <div className="flex items-center gap-4">
                <SignOut className="w-6 h-6 text-light-gray-800" />
                <p>Sair</p>
              </div>
            </button>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}
