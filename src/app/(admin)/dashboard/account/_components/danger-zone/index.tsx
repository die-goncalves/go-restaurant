'use client'

import { Portal } from '@zag-js/react'
import { CloseIcon } from '@/src/components/icons/close'
import { DeleteIcon } from '@/src/components/icons/delete'
import { Button } from '@/src/components/ui/button'
import { Dialog } from '@/src/components/ui/dialog'
import { css } from '@/styled-system/css'
import { DeleteAccountButton } from './delete-account-button'

export function DangerZone() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="solid"
          icon={<DeleteIcon />}
          iconPlacement="left"
          className={css({
            background: 'error.container',
            color: 'error.container.on',
            _icon: { fill: 'error.container.on' },
            _notDisabled: {
              _hover: {
                _after: {
                  background: 'error.container.on/8'
                }
              },
              _focusVisible: {
                _after: {
                  background: 'error.container.on/10'
                }
              }
            }
          })}
        >
          <p
            className={css({
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom',
              backgroundSize: 'auto 1px',
              backgroundImage:
                'linear-gradient(to right, token(colors.error.container.on), token(colors.error.container))'
            })}
          >
            Excluir conta
          </p>
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {({ setOpen }) => (
              <>
                <header
                  className={css({
                    display: 'flex',
                    paddingBlockStart: { base: '4', medium: '6' },
                    paddingBlockEnd: '4',
                    paddingInline: { base: '4', medium: '6' },
                    alignItems: 'start',
                    justifyContent: 'space-between'
                  })}
                >
                  <Dialog.Title
                    as="h2"
                    className={css({
                      minHeight: '10',
                      justifySelf: 'center',
                      textStyle: 'xl',
                      paddingTop: 'calc((40px - 1.4em) / 2)'
                    })}
                  >
                    Confirmação de exclusão
                  </Dialog.Title>

                  <Dialog.CloseTrigger asChild>
                    <Button className={css({ padding: 0 })}>
                      <CloseIcon />
                    </Button>
                  </Dialog.CloseTrigger>
                </header>

                <main
                  className={css({
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto'
                  })}
                >
                  <div
                    className={css({
                      paddingInline: { base: '4', medium: '6' }
                    })}
                  >
                    <p>
                      Esta ação é irreversível. Isso excluirá permanentemente
                      sua conta e removerá seus dados de nossos sistemas.
                    </p>
                  </div>
                </main>

                <footer
                  className={css({
                    display: 'flex',
                    paddingBlockStart: '4',
                    paddingBlockEnd: { base: '4', medium: '6' },
                    paddingInline: { base: '4', medium: '6' },
                    flexDirection: { base: 'column', medium: 'row' },
                    gap: '4'
                  })}
                >
                  <Button
                    variant="ghost"
                    className={css({
                      marginLeft: 'auto',
                      width: { base: '100%', medium: 'fit-content' }
                    })}
                    onClick={() => setOpen(false)}
                  >
                    Fechar
                  </Button>
                  <DeleteAccountButton />
                </footer>
              </>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
