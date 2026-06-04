'use client'

import { Portal } from '@zag-js/react'
import { useState } from 'react'
import { ChevronLeftIcon } from '@/src/components/icons/chevron-left'
import { CloseIcon } from '@/src/components/icons/close'
import { QuestionMarkIcon } from '@/src/components/icons/question-mark'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Dialog } from '@/src/components/ui/dialog'
import { Link } from '@/src/components/ui/link'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { css } from '@/styled-system/css'

export function Help() {
  const [isCompact, setIsCompact] = useState(false)

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="solid"
          aria-label="Instruções de uso"
          className={css({
            padding: 0,
            position: 'fixed',
            bottom: '4',
            right: '4',
            height: '14',
            width: '14',
            _icon: {
              width: '6',
              height: '6'
            },
            boxShadow: 'lg',
            transitionProperty: 'right',
            ...(isCompact
              ? {
                  paddingInlineEnd: '4',
                  right: '-4',
                  transitionDuration: '350ms',
                  transitionTimingFunction: 'expressive-fast-spatial'
                }
              : {
                  transitionDuration: '500ms',
                  transitionTimingFunction: 'expressive-default-spatial'
                })
          })}
          onClick={e => {
            if (isCompact) {
              e.preventDefault()
              setIsCompact(false)
            }
          }}
        >
          {isCompact ? <ChevronLeftIcon /> : <QuestionMarkIcon />}
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
                    Instruções de uso
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
                  <ScrollArea.Root size="sm" variant="always">
                    <ScrollArea.Viewport className={css({ padding: 0 })}>
                      <ScrollArea.Content
                        className={css({
                          display: 'flex',
                          flexDirection: 'column'
                        })}
                      >
                        <div
                          className={css({
                            paddingInline: { base: '4', medium: '6' }
                          })}
                        >
                          <div>
                            <h3
                              className={css({
                                fontSize: 'lg',
                                marginBlockEnd: '2'
                              })}
                            >
                              Login e cadastro
                            </h3>

                            <ul
                              className={css({
                                listStyleType: 'disc',
                                listStylePosition: 'inside'
                              })}
                            >
                              <li>
                                Para testar a plataforma, você pode cadastrar
                                qualquer e-mail (não é necessário que seja um
                                endereço real, desde que siga o formato válido).
                                Caso prefira, utilize as credenciais de teste
                                abaixo:
                                <div
                                  className={css({
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    gap: '2',
                                    padding: '2',
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                    borderColor: 'outline.variant'
                                  })}
                                >
                                  <span>
                                    E-mail:{' '}
                                    <code
                                      className={css({
                                        paddingInline: '1.5',
                                        background: 'black.alpha.300'
                                      })}
                                    >
                                      fulano@dominio.com
                                    </code>
                                  </span>
                                  <span>
                                    Senha:{' '}
                                    <code
                                      className={css({
                                        paddingInline: '1.5',
                                        background: 'black.alpha.300'
                                      })}
                                    >
                                      123456
                                    </code>
                                  </span>
                                </div>
                              </li>
                              <li>
                                Existe a opção de excluir a conta. No entanto,
                                se você optar por utilizar o e-mail de exemplo
                                acima, por favor, não o exclua, para que outros
                                usuários também possam testar.
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h3
                              className={css({
                                fontSize: 'lg',
                                marginBlock: '2'
                              })}
                            >
                              Pagamentos
                            </h3>

                            <ul
                              className={css({
                                listStyleType: 'disc',
                                listStylePosition: 'inside'
                              })}
                            >
                              <li>
                                Para realizar compras, é necessário estar logado
                                e possuir itens no carrinho. Ao ser
                                redirecionado para o checkout do Stripe, utilize
                                os seguintes dados para simular a transação:
                                <div
                                  className={css({
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    gap: '2',
                                    padding: '2',
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                    borderColor: 'outline.variant'
                                  })}
                                >
                                  <span>
                                    Número do cartão:{' '}
                                    <code
                                      className={css({
                                        paddingInline: '1.5',
                                        background: 'black.alpha.300'
                                      })}
                                    >
                                      4242 4242 4242 4242
                                    </code>
                                  </span>
                                  <span>
                                    Data de expiração do cartão: qualquer data
                                    futura (ex:{' '}
                                    <code
                                      className={css({
                                        paddingInline: '1.5',
                                        background: 'black.alpha.300'
                                      })}
                                    >
                                      12/34
                                    </code>
                                    )
                                  </span>
                                  <span>
                                    CVC: Quaisquer 3 dígitos (ex:{' '}
                                    <code
                                      className={css({
                                        paddingInline: '1.5',
                                        background: 'black.alpha.300'
                                      })}
                                    >
                                      123
                                    </code>
                                    )
                                  </span>
                                  <span>
                                    Nome no cartão: Qualquer nome (ex:{' '}
                                    <code
                                      className={css({
                                        paddingInline: '1.5',
                                        background: 'black.alpha.300'
                                      })}
                                    >
                                      Fulano
                                    </code>
                                    )
                                  </span>
                                </div>
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h3
                              className={css({
                                fontSize: 'lg',
                                marginBlock: '2'
                              })}
                            >
                              Informações Importantes
                            </h3>

                            <ul
                              className={css({
                                listStyleType: 'disc',
                                listStylePosition: 'inside'
                              })}
                            >
                              <li>
                                Para mais detalhes sobre o ambiente de testes,
                                consulte a documentação oficial em:{' '}
                                <Link
                                  href="https://docs.stripe.com/testing#use-test-cards"
                                  external
                                  underline
                                  className={css({ display: 'inline' })}
                                >
                                  Como usar cartões de teste
                                </Link>
                              </li>
                              <li>
                                O projeto utiliza APIs com limites de uso para
                                exibição de mapas e geolocalização. Caso esses
                                limites sejam atingidos, algumas funcionalidades
                                da aplicação podem apresentar instabilidade ou
                                parar de funcionar temporariamente. Se isso
                                ocorrer, por favor, aguarde alguns dias e tente
                                novamente.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </ScrollArea.Content>
                    </ScrollArea.Viewport>

                    <ScrollArea.Scrollbar orientation="vertical">
                      <ScrollArea.Thumb orientation="vertical" />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Scrollbar orientation="horizontal">
                      <ScrollArea.Thumb orientation="horizontal" />
                    </ScrollArea.Scrollbar>

                    <ScrollArea.Corner />
                  </ScrollArea.Root>
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
                  <Checkbox.Root
                    checked={isCompact}
                    onCheckedChange={({ checked }) => {
                      if (typeof checked === 'boolean') setIsCompact(checked)
                    }}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Modo compacto</Checkbox.Label>
                  </Checkbox.Root>

                  <Button
                    variant="solid"
                    className={css({
                      marginLeft: 'auto',
                      width: { base: '100%', medium: 'fit-content' }
                    })}
                    onClick={() => setOpen(false)}
                  >
                    Fechar
                  </Button>
                </footer>
              </>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
