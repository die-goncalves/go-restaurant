import { useState } from 'react'
import { Dialog } from '../dialog'
import { SignInTab } from './sign-in-tab'
import { SignUpTab } from './sign-up-tab'
import * as TabPrimitive from '@radix-ui/react-tabs'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { css, cx } from '@/styled-system/css'

const tabContent = css({
  p: '4',
  outline: 'none',
  _focus: { boxShadow: 'inset 0 0 0 2px var(--colors-light-indigo-300)' }
})

export function Account() {
  const [open, setOpen] = useState(false)

  function handleCloseDialog() {
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button
          className={css({
            ml: 'auto',
            py: '2',
            px: '4',
            rounded: 'sm',
            bg: 'light.orange.200',
            transition: 'background-color 150ms ease-in',
            outline: 'none',
            '&:not(:disabled):hover': { bg: 'light.orange.300' },
            _focus: {
              outlineStyle: 'solid',
              outlineWidth: '2',
              outlineOffset: '2',
              outlineColor: 'light.indigo.300'
            }
          })}
        >
          Entrar/Cadastrar
        </button>
      </Dialog.Trigger>

      <Dialog.Content
        onCloseInteractOverlay={handleCloseDialog}
        className={cx(
          css({
            p: '0',
            w: 'calc(100vw - 2rem)',
            sm: { w: '96' }
          })
        )}
      >
        <VisuallyHidden asChild>
          <Dialog.Title>Conta</Dialog.Title>
        </VisuallyHidden>

        <TabPrimitive.Root
          defaultValue="signin"
          className={css({
            display: 'flex',
            flexDirection: 'column',
            w: 'full',
            shadow: 'lg'
          })}
        >
          <TabPrimitive.List
            aria-label="Gerenciamento de conta"
            className={css({ display: 'flex' })}
          >
            <TabPrimitive.Trigger
              value="signin"
              className={css({
                flex: '1',
                justifyContent: 'center',
                p: '2',
                outline: 'none',
                _focus: {
                  boxShadow: 'inset 0 0 0 2px var(--colors-light-indigo-300)'
                },
                '&[aria-selected="true"]': { fontWeight: 'medium' },
                '&[aria-selected="false"]': {
                  bg: 'light.gray.200',
                  shadow: '[inset_-5px_-2.5px_10px_-5px_rgba(168,162,158,1)]'
                }
              })}
            >
              Entrar
            </TabPrimitive.Trigger>
            <TabPrimitive.Trigger
              value="signup"
              className={css({
                flex: '1',
                justifyContent: 'center',
                p: '2',
                outline: 'none',
                _focus: {
                  boxShadow: 'inset 0 0 0 2px var(--colors-light-indigo-300)'
                },
                '&[aria-selected="true"]': { fontWeight: 'medium' },
                '&[aria-selected="false"]': {
                  bg: 'light.gray.200',
                  shadow: '[inset_5px_-2.5px_10px_-5px_rgba(168,162,158,1)]'
                }
              })}
            >
              Cadastrar
            </TabPrimitive.Trigger>
          </TabPrimitive.List>
          <TabPrimitive.Content value="signin" className={tabContent}>
            <SignInTab onCloseDialog={handleCloseDialog} />
          </TabPrimitive.Content>
          <TabPrimitive.Content value="signup" className={tabContent}>
            <SignUpTab onCloseDialog={handleCloseDialog} />
          </TabPrimitive.Content>
        </TabPrimitive.Root>
      </Dialog.Content>
    </Dialog.Root>
  )
}
