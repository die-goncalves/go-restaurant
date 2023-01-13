import clsx from 'clsx'
import { GearSix, SignOut, UserGear } from 'phosphor-react'
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
    <div className="flex box-border h-10 items-center rounded py-2 px-4 bg-light-gray-200 gap-4 border-b-2 border-light-orange-300">
      <span>{session?.user.email}</span>
      <Popover.Root>
        <Popover.Trigger>
          <button
            className={clsx(
              'flex h-6 w-6 rounded bg-light-gray-300 [&:not(:disabled):hover]:bg-light-gray-400',
              'transition-[background-color] ease-in duration-150',
              'focus:outline focus:outline-2 focus:outline-light-indigo-300'
            )}
          >
            <GearSix className="m-auto w-4 h-4 text-light-gray-800" />
          </button>
        </Popover.Trigger>
        <Popover.Content className={clsx('p-4 w-60', '')}>
          <div className="flex flex-col gap-2">
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
