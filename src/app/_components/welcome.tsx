'use client'

import { Portal } from '@zag-js/react'
import { CloseIcon } from '@/src/components/icons/close'
import { WavingHandIcon } from '@/src/components/icons/waving-hand'
import { Button } from '@/src/components/ui/button'
import { Dialog } from '@/src/components/ui/dialog'
import { Link } from '@/src/components/ui/link'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { css } from '@/styled-system/css'

type InspirationLink = {
  label: string
  href: string
}
const inspirations: InspirationLink[] = [
  { label: 'ifood', href: 'https://www.ifood.com.br/' },
  { label: 'doordash', href: 'https://www.doordash.com/' },
  { label: 'foodpanda', href: 'https://www.foodpanda.com/' },
  { label: 'rappi', href: 'https://www.rappi.com.br/' }
]

export function Welcome() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          aria-label="Apresentação do projeto"
          className={css({ padding: 0 })}
        >
          <WavingHandIcon />
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
                    Bem vindo!
                  </Dialog.Title>

                  <Dialog.CloseTrigger asChild>
                    <Button
                      aria-label="Fechar apresentação"
                      className={css({ padding: 0 })}
                    >
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
                          <Dialog.Description>
                            <p>
                              Sou Diego Gonçalves e este é o{' '}
                              <Link
                                href="https://github.com/die-goncalves/go-restaurant"
                                external
                                className={css({ display: 'inline' })}
                              >
                                GoRestaurant
                              </Link>{' '}
                              — um{' '}
                              <strong
                                className={css({ fontWeight: 'semibold' })}
                              >
                                projeto de portfólio
                              </strong>
                              .
                            </p>
                          </Dialog.Description>

                          <section aria-labelledby="section-description">
                            <h3
                              id="section-description"
                              className={css({
                                fontSize: 'lg',
                                marginBlock: '2'
                              })}
                            >
                              Sobre o projeto
                            </h3>

                            <p>
                              Plataforma de pedidos online que conecta clientes
                              aos estabelecimentos da sua região, com entrega ou
                              retirada no local.
                            </p>
                          </section>

                          <section aria-labelledby="section-features">
                            <h3
                              id="section-features"
                              className={css({
                                fontSize: 'lg',
                                marginBlock: '2'
                              })}
                            >
                              O que você pode fazer
                            </h3>

                            <ul
                              className={css({
                                listStyleType: 'square',
                                paddingInlineStart: '5',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1',
                                color: 'fg.muted',
                                lineHeight: 'relaxed'
                              })}
                            >
                              <li>
                                Informar seu endereço e ver os estabelecimentos
                                disponíveis na sua região;
                              </li>
                              <li>
                                Navegar pela lista de produtos, adicioná-los ao
                                carrinho e fechar o pedido;
                              </li>
                              <li>
                                Escolher entre entrega no endereço ou retirada
                                no local;
                              </li>
                              <li>
                                Acompanhar o status do pedido em tempo real;
                              </li>
                              <li>
                                Avaliar os produtos após o recebimento —
                                exclusivo para usuários cadastrados.
                              </li>
                            </ul>
                          </section>

                          <section aria-labelledby="section-repo">
                            <h3
                              id="section-repo"
                              className={css({
                                fontSize: 'lg',
                                marginBlock: '2'
                              })}
                            >
                              Repositório
                            </h3>

                            <Link
                              href="https://github.com/die-goncalves/go-restaurant"
                              external
                            >
                              <div
                                className={css({
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '10',
                                  height: '10',
                                  _icon: { width: '5', height: '5' }
                                })}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 -960 960 960"
                                  preserveAspectRatio="xMidYMid meet"
                                  aria-hidden="true"
                                  fill="currentColor"
                                >
                                  <path d="m 418.28076,-313.5934 c -103.125,-12.5 -175.7808,-86.7191 -175.7808,-182.8124 0,-39.0625 14.0625,-81.25 37.5,-109.375 -10.1567,-25.7817 -8.5942,-80.4692 3.125,-103.125 31.25,-3.9067 73.4375,12.5 98.4375,35.1558 29.6875,-9.375 60.9375,-14.0625 99.2183,-14.0625 38.2817,0 69.5317,4.6875 97.6567,13.2817 24.2183,-21.875 67.1875,-38.2817 98.4375,-34.375 10.9375,21.0933 12.5,75.7808 2.3433,102.3433 25,29.6875 38.2817,69.5317 38.2817,110.1567 0,96.0933 -72.6567,168.7499 -177.3442,182.0308 26.5625,17.1875 44.5317,54.6875 44.5317,97.6566 v 81.2517 c 0,23.4333 19.5308,36.716697 42.9683,27.3417 141.4067,-53.9084 252.3442,-195.3125 252.3442,-370.3125 C 879.99996,-699.5308 700.31246,-880 479.21826,-880 258.12496,-880 80,-699.5317 80,-478.4375 80,-305 190.1558,-161.25 338.59326,-107.3417 c 21.0942,7.808297 41.4067,-6.25 41.4067,-27.3417 v -62.5041 c -10.9375,4.6875 -25,7.8125 -37.5,7.8125 -51.5625,0 -82.0317,-28.125 -103.9067,-80.4684 C 230,-290.9375 220.625,-303.4375 202.6558,-305.7809 c -9.375,-0.7816 -12.5,-4.6875 -12.5,-9.375 0,-9.375 15.625,-16.4066 31.25,-16.4066 22.65666,0 42.18746,14.0625 62.49996,42.9691 15.625,22.6559 32.0317,32.8125 51.5625,32.8125 19.5317,0 32.0317,-7.0316 50,-25 13.2817,-13.2816 23.4375,-25 32.8125,-32.8125 z" />
                                </svg>
                              </div>

                              <span className={css({ marginBlock: 'auto' })}>
                                die-goncalves/go-restaurant
                              </span>
                            </Link>
                          </section>

                          <section aria-labelledby="section-contact">
                            <h3
                              id="section-contact"
                              className={css({
                                fontSize: 'lg',
                                marginBlock: '2'
                              })}
                            >
                              Contato
                            </h3>

                            <div
                              className={css({
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2'
                              })}
                            >
                              <Link
                                href="https://www.linkedin.com/in/diego-goncalves1990"
                                external
                              >
                                <div
                                  className={css({
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '10',
                                    height: '10',
                                    _icon: { width: '5', height: '5' }
                                  })}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    preserveAspectRatio="xMidYMid meet"
                                    aria-hidden="true"
                                    fill="currentColor"
                                  >
                                    <path d="M 733.4737,-226.51626 H 626.7928 v -167.07088 c 0,-39.83904 -0.7116,-91.12496 -55.485,-91.12496 -55.5637,0 -64.0659,43.4081 -64.0659,88.22528 v 169.95931 H 400.5637 v -343.56362 h 102.4116 v 46.95186 h 1.4344 a 112.23843,112.23839 0 0 1 101.0475,-55.49904 c 108.1265,0 128.0615,71.12246 128.0615,163.64806 z m -453.285,-390.53517 c -34.1915,0.006 -61.9143,-27.70874 -61.92,-61.90029 -0.01,-34.19155 27.706,-61.91435 61.8975,-61.91997 34.1916,-0.008 61.9144,27.70592 61.92,61.89748 a 61.911561,61.911539 0 0 1 -61.8975,61.92278 m 53.3419,390.53798 H 226.7372 v -343.57768 h 106.7906 v 343.57487 z M 786.6581,-839.94759 H 173.1309 c -28.9968,-0.32625 -52.7765,22.90217 -53.1309,51.89904 v 616.08633 c 0.3431,29.01092 24.12,52.26186 53.1281,51.9581 h 613.53 c 29.07,0.36 52.9397,-22.89092 53.3419,-51.9581 v -616.13414 c -0.4134,-29.05312 -24.286,-52.27873 -53.3419,-51.89905" />
                                  </svg>
                                </div>

                                <span className={css({ marginBlock: 'auto' })}>
                                  diego-goncalves1990
                                </span>
                              </Link>

                              <Link
                                href="mailto:die.goncalves1990@gmail.com"
                                external
                              >
                                <div
                                  className={css({
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '10',
                                    height: '10',
                                    _icon: { width: '5', height: '5' }
                                  })}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    preserveAspectRatio="xMidYMid meet"
                                    aria-hidden="true"
                                    fill="currentColor"
                                  >
                                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm330.5-288.5Q496-450 501-453l283-177q8-5 12-12.5t4-16.5q0-20-17-30t-35 1L480-520 212-688q-18-11-35-.5T160-659q0 10 4 17.5t12 11.5l283 177q5 3 10.5 4.5T480-447q5 0 10.5-1.5Z" />
                                  </svg>
                                </div>

                                <span className={css({ marginBlock: 'auto' })}>
                                  die.goncalves1990@gmail.com
                                </span>
                              </Link>
                            </div>
                          </section>

                          <section
                            aria-labelledby="section-inspiration"
                            className={css({ paddingBlockEnd: '2' })}
                          >
                            <h3
                              id="section-inspiration"
                              className={css({
                                fontSize: 'lg',
                                marginBlock: '2'
                              })}
                            >
                              Inspiração
                            </h3>

                            <ul
                              className={css({
                                listStyleType: 'none',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '2',
                                '& li': { display: 'inline' }
                              })}
                            >
                              {inspirations.map(({ label, href }) => (
                                <li key={href}>
                                  <Link href={href} external>
                                    {label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </section>
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
