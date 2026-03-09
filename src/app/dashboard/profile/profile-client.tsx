'use client'

import { css, cx } from '@/styled-system/css'
import { User } from '@supabase/supabase-js'
import { useState } from 'react'
import { X } from 'phosphor-react'
import { SignedUser } from '@/src/components/signed-user'
import { DashboardNavigation } from '@/src/components/dashboard-navigation'
import { Dialog } from '@/src/components/dialog'
import { Logo } from '@/src/components/logo'
import { DeleteAccountButton } from './delete-account-button'

const dialogButton = css.raw({
  py: '2',
  px: '4',
  rounded: 'sm',
  transition: 'background-color 150ms ease-in',
  outline: 'none',
  _focus: {
    outlineStyle: 'solid',
    outlineWidth: '2',
    outlineOffset: '2',
    outlineColor: 'light.indigo.300'
  }
})

type ProfileClientProps = {
  user: User
}
export function ProfileClient({ user }: ProfileClientProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={css({
        bg: 'light.gray.100',
        overflow: 'auto',
        scrollbarGutter: 'stable'
      })}
    >
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        <header
          className={css({
            display: 'flex',
            p: '4',
            alignItems: 'center',
            justifyContent: 'space-between',
            bg: 'light.gray.100',
            sm: { px: '6' },
            lg: { px: '8' }
          })}
        >
          <Logo />
          <SignedUser />
        </header>

        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            px: '4',
            h: 'calc(100vh - 4.5rem)',
            sm: { flexDirection: 'row', px: '6' },
            lg: { px: '8' }
          })}
        >
          <DashboardNavigation />

          <div className="flex flex-1 py-4">
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger>
                <button
                  className={css({
                    display: 'flex',
                    flex: '1',
                    h: 'max',
                    py: '2',
                    px: '4',
                    rounded: 'sm',
                    shadow: 'md',
                    bg: 'light.gray.200',
                    transition: 'background-color 150ms ease-in',
                    outline: 'none',
                    '&:not(:disabled):hover': { bg: 'light.gray.300' },
                    _focus: {
                      outlineStyle: 'solid',
                      outlineWidth: '2',
                      outlineOffset: '2',
                      outlineColor: 'light.indigo.300'
                    }
                  })}
                >
                  <div
                    className={css({
                      display: 'flex',
                      w: 'full',
                      flexDirection: 'column',
                      gap: '1'
                    })}
                  >
                    <p className={css({ fontSize: 'lg', textAlign: 'left' })}>
                      Excluir conta
                    </p>
                    <div className={css({ textAlign: 'left' })}>
                      <span
                        className={css({
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'bottom',
                          backgroundSize: 'auto 2px',
                          backgroundImage:
                            'linear-gradient(to right, token(colors.light.red.500), token(colors.light.red.200))'
                        })}
                      >
                        Tenha cuidado, esta ação é irreversível
                      </span>
                    </div>
                  </div>
                </button>
              </Dialog.Trigger>
              <Dialog.Content
                className={cx(
                  css({ w: 'calc(100vw - 2rem)', xs: { w: '96' } })
                )}
                onCloseInteractOverlay={() => setOpen(false)}
              >
                <header
                  className={css({
                    display: 'flex',
                    p: '4',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  })}
                >
                  <Dialog.Title asChild>
                    <p
                      className={css({ fontSize: 'xl', fontWeight: 'medium' })}
                    >
                      Confirmação de exclusão
                    </p>
                  </Dialog.Title>

                  <Dialog.Close>
                    <button
                      className={css({
                        p: '2',
                        rounded: 'sm',
                        bg: 'light.gray.200',
                        transition: 'background-color 150ms ease-in',
                        outline: 'none',
                        '&:not(:disabled):hover': { bg: 'light.gray.300' },
                        _focus: {
                          outlineStyle: 'solid',
                          outlineWidth: '2',
                          outlineOffset: '2',
                          outlineColor: 'light.indigo.300'
                        }
                      })}
                    >
                      <X className={css({ w: '6', h: '6' })} />
                    </button>
                  </Dialog.Close>
                </header>
                <main
                  className={css({
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    p: '4'
                  })}
                >
                  <p>Tem a certeza de que quer excluir a sua conta?</p>
                </main>
                <footer
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    p: '4'
                  })}
                >
                  <div
                    className={css({
                      display: 'flex',
                      ml: 'auto',
                      justifyContent: 'flex-end',
                      gap: '2'
                    })}
                  >
                    <button
                      className={css([
                        dialogButton,
                        {
                          bg: 'light.gray.100',
                          '&:not(:disabled):hover': { bg: 'light.gray.200' }
                        }
                      ])}
                      onClick={() => setOpen(false)}
                    >
                      Cancelar
                    </button>
                    <DeleteAccountButton />
                  </div>
                </footer>
              </Dialog.Content>
            </Dialog.Root>
          </div>
        </div>
      </div>
    </div>
  )
}
