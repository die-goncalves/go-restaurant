'use client'

import { useState } from 'react'
import { CaretLeft, Info, X } from 'phosphor-react'
import {
  Root,
  Trigger,
  Content,
  Close,
  Portal,
  DialogTitle
} from '@radix-ui/react-dialog'
import * as Switch from '@radix-ui/react-switch'
import { css } from '@/styled-system/css'

export function Help() {
  const [isCompact, setIsCompact] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <button
          className={css({
            display: 'flex',
            alignItems: 'center',
            position: 'fixed',
            bottom: '4',
            bg: 'light.orange.200',
            zIndex: '10',
            rounded: 'full',
            h: '14',
            w: '14',
            shadow: 'md',
            transition: 'all 150ms ease-in',
            outline: 'none',
            _focus: {
              outlineStyle: 'solid',
              outlineWidth: '2',
              outlineOffset: '2',
              outlineColor: 'light.indigo.300'
            },
            _hover: { shadow: 'xl' },
            '&:not(:disabled):hover': { bg: 'light.orange.300' },
            ...(isCompact
              ? { pl: '2', right: '-6' }
              : {
                  justifyContent: 'center',
                  right: '4',
                  _hover: { shadow: 'xl', transform: 'translateY(-0.5rem)' }
                })
          })}
          onClick={e => {
            if (isCompact) {
              e.preventDefault()
              setIsCompact(false)
            }
          }}
        >
          {isCompact ? (
            <CaretLeft
              className={css({ w: '6', h: '6', color: 'light.gray.800' })}
              weight="bold"
            />
          ) : (
            <span className={css({ fontSize: '3xl' })}>?</span>
          )}
        </button>
      </Trigger>

      <Portal>
        <Content
          className={css({
            display: 'flex',
            flexDirection: 'column',
            h: 'calc(100vh - 104px)',
            w: 'calc(100vw - 2rem)',
            overflow: 'auto',
            bg: 'light.gray.100',
            rounded: 'sm',
            position: 'fixed',
            bottom: '0',
            right: '0',
            outline: 'none',
            transform: 'translate(-1rem, -5.5rem)',
            shadow: 'xl',
            zIndex: '30',
            md: {
              w: '432px',
              h: '560px',
              overflow: 'hidden'
            }
          })}
        >
          <header
            className={css({
              display: 'flex',
              p: '4',
              alignItems: 'center',
              justifyContent: 'space-between'
            })}
          >
            <DialogTitle asChild>
              <p className={css({ fontSize: 'xl', fontWeight: 'medium' })}>
                Instruções de uso
              </p>
            </DialogTitle>
            <Close asChild>
              <button
                className={css({
                  p: '2',
                  rounded: 'sm',
                  bg: 'light.gray.200',
                  transition: 'all 150ms ease-in',
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
            </Close>
          </header>

          <main
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4',
              px: '4',
              md: { pr: '0', overflow: 'auto', scrollbarGutter: 'stable' }
            })}
          >
            <div>
              <p className={css({ fontSize: 'lg' })}>Login e cadastro</p>
              <ul
                className={css({
                  listStyleType: 'disc',
                  listStylePosition: 'inside'
                })}
              >
                <li>
                  <span>
                    Você pode cadastrar qualquer e-mail para testar o site, nem
                    precisa existir apenas ser válido. Se quiser pode usar este
                    cadastro:
                  </span>
                  <div
                    className={css({
                      display: 'flex',
                      flexDirection: 'column',
                      w: 'max',
                      rounded: 'sm',
                      p: '2',
                      bg: 'light.gray.200',
                      borderWidth: '2',
                      borderColor: 'light.gray.300'
                    })}
                  >
                    <span>E-mail: fulano@dominio.com</span>{' '}
                    <span>Senha: 123456</span>{' '}
                  </div>
                </li>
                <li>
                  Há opção para excluir conta, mas se você optou por usar o
                  e-mail de exemplo acima por favor não exclua.
                </li>
              </ul>
            </div>

            <div>
              <p className={css({ fontSize: 'lg' })}>Pagamentos</p>

              <ul
                className={css({
                  listStyleType: 'disc',
                  listStylePosition: 'inside'
                })}
              >
                <li>
                  Para realizar compras você deve estar logado e ter items no
                  carrinho
                </li>
                <li>
                  Ao ser redirecionado para a página de checkout do stripe você
                  pode usar os dados a seguir para <strong>simular</strong> uma
                  compra:
                  <div
                    className={css({
                      display: 'flex',
                      flexDirection: 'column',
                      rounded: 'sm',
                      p: '2',
                      bg: 'light.gray.200',
                      borderWidth: '2',
                      borderColor: 'light.gray.300'
                    })}
                  >
                    <span>Número do cartão: 4242 4242 4242 4242</span>{' '}
                    <span>
                      Data de expiração do cartão: deve ser uma data futura, por
                      exemplo 12/34
                    </span>{' '}
                    <span>CVC: quaisquer 3 dígitos</span>{' '}
                    <span>
                      Nome no cartão: qualquer nome, por exemplo apenas Fulano
                    </span>
                  </div>
                  Mais informações sobre testes usando cartões podem ser
                  encontradas em{' '}
                  <a
                    className={css({
                      fontStyle: 'italic',
                      textDecoration: 'underline',
                      rounded: 'sm',
                      transition: 'all 150ms ease-in',
                      outline: 'none',
                      _hover: { opacity: '0.8' },
                      _focus: {
                        outlineStyle: 'solid',
                        outlineWidth: '2',
                        outlineOffset: '2',
                        outlineColor: 'light.indigo.300'
                      }
                    })}
                    href="https://stripe.com/docs/testing#use-test-cards"
                    target="_blank"
                    rel="noreferrer"
                  >
                    use-test-cards
                  </a>
                </li>
              </ul>
            </div>
          </main>

          <footer
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'flex-end',
              justifyContent: 'center',
              p: '4',
              gap: '4'
            })}
          >
            <div
              className={css({
                display: 'flex',
                bg: 'light.orange.200/60',
                rounded: 'sm',
                p: '2',
                borderWidth: '2',
                borderColor: 'light.orange.300'
              })}
            >
              <Info
                className={css({
                  display: 'none',
                  flexShrink: '0',
                  w: '6',
                  h: '6',
                  color: 'light.gray.800',
                  mr: '2',
                  md: { display: 'flex' }
                })}
              />
              <span className={css({ fontSize: 'sm', textAlign: 'justify' })}>
                O projeto possui limites em relação à exibição de mapas e
                operações de geolocalização. Com os limites ultrapassados você
                não conseguirá utilizar a aplicação em perfeito funcionamento.
                Espere alguns dias e tente novamente.
              </span>
            </div>

            <label
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '4',
                ml: 'auto'
              })}
            >
              Esconder botão de ajuda
              <Switch.Root
                defaultChecked={false}
                checked={isCompact}
                onCheckedChange={setIsCompact}
                className={css({
                  w: '14',
                  h: '8',
                  bg: 'light.gray.200',
                  position: 'relative',
                  rounded: 'sm',
                  transition: 'all 150ms ease-in',
                  outline: 'none',
                  '&[data-state="checked"]': { bg: 'light.gray.300' },
                  _focus: {
                    outlineStyle: 'solid',
                    outlineWidth: '2',
                    outlineOffset: '2',
                    outlineColor: 'light.indigo.300'
                  }
                })}
              >
                <Switch.Thumb
                  className={css({
                    display: 'block',
                    w: '7',
                    h: '7',
                    bg: 'light.gray.100',
                    rounded: 'sm',
                    shadow: 'md',
                    transition: 'all 150ms ease-in',
                    '&[data-state="checked"]': {
                      transform: 'translateX(1.75rem)'
                    }
                  })}
                ></Switch.Thumb>
              </Switch.Root>
            </label>
          </footer>
        </Content>
      </Portal>
    </Root>
  )
}
