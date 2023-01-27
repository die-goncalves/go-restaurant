import { useState } from 'react'
import clsx from 'clsx'
import { Dialog } from '../Dialog'
import { SignInTab } from './SignInTab'
import { SignUpTab } from './SignUpTab'
import * as TabPrimitive from '@radix-ui/react-tabs'

export function Account() {
  const [open, setOpen] = useState(false)

  function handleCloseDialog() {
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button
          className={clsx(
            'ml-auto py-2 px-4 rounded bg-light-orange-200 [&:not(:disabled):hover]:bg-light-orange-300',
            'transition-[background-color] ease-in duration-150',
            'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
          )}
        >
          Entrar/Cadastrar
        </button>
      </Dialog.Trigger>

      <Dialog.Content
        onCloseInteractOverlay={handleCloseDialog}
        className={clsx('sm:w-96', 'p-0 w-[calc(100vw-2rem)]')}
      >
        <TabPrimitive.Root
          defaultValue="signin"
          className="flex flex-col w-full shadow-lg"
        >
          <TabPrimitive.List
            aria-label="Gerenciamento de conta"
            className="flex"
          >
            <TabPrimitive.Trigger
              value="signin"
              className={clsx(
                'flex-1 justify-center p-2 aria-selected:font-medium aria-[selected=false]:bg-light-gray-200 aria-[selected=false]:shadow-[inset_-5px_-2.5px_10px_-5px_rgba(168,162,158,1)]',
                'focus:outline-none focus:ring-2 focus:ring-inset'
              )}
            >
              Entrar
            </TabPrimitive.Trigger>
            <TabPrimitive.Trigger
              value="signup"
              className={clsx(
                'flex-1 justify-center p-2 aria-selected:font-medium aria-[selected=false]:bg-light-gray-200 aria-[selected=false]:shadow-[inset_5px_-2.5px_10px_-5px_rgba(168,162,158,1)]',
                'focus:outline-none focus:ring-2 focus:ring-inset'
              )}
            >
              Cadastrar
            </TabPrimitive.Trigger>
          </TabPrimitive.List>
          <TabPrimitive.Content
            value="signin"
            className={clsx(
              'p-4',
              'focus:outline-none focus:ring-2 focus:ring-inset'
            )}
          >
            <SignInTab onCloseDialog={handleCloseDialog} />
          </TabPrimitive.Content>
          <TabPrimitive.Content
            value="signup"
            className={clsx(
              'p-4',
              'focus:outline-none focus:ring-2 focus:ring-inset'
            )}
          >
            <SignUpTab onCloseDialog={handleCloseDialog} />
          </TabPrimitive.Content>
        </TabPrimitive.Root>
      </Dialog.Content>
    </Dialog.Root>
  )
}
