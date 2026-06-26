'use client'

import { Portal } from '@zag-js/react'
import NextImage from 'next/image'
import { AddIcon } from '@/src/components/icons/add'
import { CloseIcon } from '@/src/components/icons/close'
import { DeleteIcon } from '@/src/components/icons/delete'
import { LocalMallIcon } from '@/src/components/icons/local-mall'
import { RemoveIcon } from '@/src/components/icons/remove'
import { SentimentDissatisfiedIcon } from '@/src/components/icons/sentiment-dissatisfied'
import { Button } from '@/src/components/ui/button'
import { Drawer } from '@/src/components/ui/drawer/index'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { useCart } from '@/src/contexts/cart-context'
import { useIsMounted } from '@/src/hooks/use-is-mounted'
import { shimmerBase64 } from '@/src/utils/blur-data-url'
import { formatNumber } from '@/src/utils/format-number'
import { css } from '@/styled-system/css'
import { SubmitButton } from './submit-button'

export function Cart() {
  const {
    addProduct,
    decrementProduct,
    getCartCount,
    getCartTotal,
    getProductsByStore,
    getProductQuantity,
    removeProduct
  } = useCart()
  const cartCount = getCartCount()
  const productsByStore = getProductsByStore()
  const cartTotal = getCartTotal()
  const isMount = useIsMounted()

  return (
    <Drawer.Root placement="right" size="md">
      <Drawer.Trigger asChild>
        <Button icon={<LocalMallIcon />} iconPlacement="left" variant="ghost">
          {isMount ? (cartCount > 99 ? '+99' : cartCount) : 0}
          &nbsp;produtos
        </Button>
      </Drawer.Trigger>

      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
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
                  <Drawer.Title
                    as="h2"
                    className={css({
                      minHeight: '10',
                      justifySelf: 'center',
                      textStyle: 'xl',
                      paddingTop: 'calc((40px - 1.4em) / 2)'
                    })}
                  >
                    Carrinho de compras
                  </Drawer.Title>

                  <Drawer.CloseTrigger asChild>
                    <Button className={css({ padding: 0 })}>
                      <CloseIcon />
                    </Button>
                  </Drawer.CloseTrigger>
                </header>

                <main
                  className={css({
                    position: 'relative',
                    overflow: 'auto'
                  })}
                >
                  <ScrollArea.Root size="md" variant="always">
                    <ScrollArea.Viewport>
                      <ScrollArea.Content
                        className={css({
                          display: 'flex',
                          flexDirection: 'column'
                        })}
                      >
                        {!cartCount ? (
                          <div
                            className={css({
                              position: 'absolute',
                              display: 'flex',
                              inset: 0
                            })}
                          >
                            <div
                              className={css({
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                margin: 'auto'
                              })}
                            >
                              <div
                                className={css({
                                  position: 'relative',
                                  boxSizing: 'content-box',
                                  display: 'flex',
                                  marginInline: 'auto',
                                  marginBlockEnd: '3'
                                })}
                              >
                                <SentimentDissatisfiedIcon
                                  className={css({
                                    boxSize: '10',
                                    fill: 'surface.on'
                                  })}
                                />
                              </div>
                              <div className={css({ textAlign: 'center' })}>
                                <p
                                  className={css({
                                    fontWeight: 'medium',
                                    marginBlockEnd: '1'
                                  })}
                                >
                                  O carrinho está vazio
                                </p>
                                <p
                                  className={css({
                                    fontSize: 'sm',
                                    color: 'surface.on.variant'
                                  })}
                                >
                                  Adicione produtos para vê-los aqui.
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={css({
                              paddingInline: { base: '4', medium: '6' },
                              '& > div + div': { marginBlockStart: '8' }
                            })}
                          >
                            {Object.entries(productsByStore).map(
                              ([, products]) => (
                                <div
                                  key={products[0].storeId}
                                  className={css({
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: 'full',
                                    gap: '4'
                                  })}
                                >
                                  <div
                                    className={css({
                                      position: 'relative',
                                      display: 'flex'
                                    })}
                                  >
                                    <div
                                      className={css({
                                        position: 'relative',
                                        display: 'flex',
                                        width: 'full',
                                        height: '16'
                                      })}
                                    >
                                      <NextImage
                                        src={products[0].storeImageURL}
                                        alt={products[0].storeName}
                                        fill
                                        className={css({
                                          objectFit: 'cover',
                                          opacity: '0.16'
                                        })}
                                        placeholder="blur"
                                        blurDataURL={shimmerBase64}
                                        sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
                                      />
                                    </div>
                                    <div
                                      className={css({
                                        position: 'absolute',
                                        display: 'flex',
                                        inset: '0',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      })}
                                    >
                                      <h3 className={css({ fontSize: 'lg' })}>
                                        {products[0].storeName}
                                      </h3>
                                    </div>
                                  </div>

                                  <ul
                                    className={css({
                                      display: 'flex',
                                      flexDirection: 'column',
                                      listStyle: 'none'
                                    })}
                                  >
                                    {products.map(product => (
                                      <li
                                        key={`${product.storeId}:${product.productId}`}
                                        className={css({
                                          '& + li': { marginBlockStart: '2' }
                                        })}
                                      >
                                        <div
                                          className={css({
                                            background: 'surface.dim',
                                            display: 'grid',
                                            gridTemplateColumns:
                                              'min-content minmax(0, 1fr)',
                                            gridTemplateRows:
                                              'repeat(1, minmax(0, 1fr))',
                                            gridColumnGap: {
                                              base: '3',
                                              medium: '4'
                                            },
                                            padding: {
                                              base: '3',
                                              medium: '4'
                                            }
                                          })}
                                        >
                                          <div
                                            className={css({
                                              position: 'relative',
                                              display: 'flex',
                                              width: '20',
                                              height: '20'
                                            })}
                                          >
                                            <NextImage
                                              src={product.productImageURL}
                                              alt={product.productName}
                                              fill
                                              className={css({
                                                objectFit: 'cover'
                                              })}
                                              placeholder="blur"
                                              blurDataURL={shimmerBase64}
                                              sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
                                            />
                                          </div>

                                          <div
                                            className={css({
                                              display: 'grid',
                                              gridTemplateColumns:
                                                'repeat(1, minmax(0, 1fr))',
                                              gridTemplateRows:
                                                'min-content minmax(0, 1fr)',
                                              gridRowGap: {
                                                base: '3',
                                                medium: '4'
                                              }
                                            })}
                                          >
                                            <div
                                              className={css({
                                                display: 'grid',
                                                gridTemplateColumns:
                                                  'minmax(0, 1fr) min-content',
                                                gridTemplateRows:
                                                  'repeat(1, minmax(0, 1fr))',
                                                gridColumnGap: '4'
                                              })}
                                            >
                                              <div
                                                className={css({
                                                  gridColumn: 'span 1 / span 1'
                                                })}
                                              >
                                                <h4
                                                  className={css({
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    textStyle: 'md'
                                                  })}
                                                >
                                                  {product.productName}
                                                </h4>
                                              </div>

                                              <div
                                                className={css({
                                                  gridColumn: 'span 1 / span 1'
                                                })}
                                              >
                                                <span>
                                                  {formatNumber({
                                                    options: {
                                                      currency: 'BRL'
                                                    },
                                                    numberToBeFormatted:
                                                      product.priceCents / 100
                                                  })}
                                                </span>
                                              </div>
                                            </div>

                                            <div
                                              className={css({
                                                gridColumn: 'span 2 / span 2',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'end'
                                              })}
                                            >
                                              <Button
                                                variant="ghost"
                                                aria-label={`Diminuir quantidade de ${product.productName}`}
                                                {...(getProductQuantity({
                                                  productId: product.productId,
                                                  storeId: product.storeId
                                                }) === 1 && {
                                                  'aria-disabled': true
                                                })}
                                                className={css({
                                                  padding: 0
                                                })}
                                                onClick={() => {
                                                  decrementProduct({
                                                    productId:
                                                      product.productId,
                                                    storeId: product.storeId
                                                  })
                                                }}
                                              >
                                                <RemoveIcon />
                                              </Button>

                                              <span
                                                aria-live="polite"
                                                aria-label={`Quantidade: ${product.amount}`}
                                                className={css({
                                                  display: 'inline-flex',
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                  boxSize: '10'
                                                })}
                                              >
                                                {product.amount}
                                              </span>

                                              <Button
                                                variant="ghost"
                                                aria-label={`Aumentar quantidade de ${product.productName}`}
                                                className={css({
                                                  padding: 0
                                                })}
                                                onClick={() =>
                                                  addProduct({
                                                    store: {
                                                      id: product.storeId,
                                                      name: product.storeName,
                                                      imageURL:
                                                        product.storeImageURL
                                                    },
                                                    product: {
                                                      id: product.productId,
                                                      name: product.productName,
                                                      imageURL:
                                                        product.productImageURL,
                                                      priceCents:
                                                        product.priceCents
                                                    }
                                                  })
                                                }
                                              >
                                                <AddIcon />
                                              </Button>

                                              <Button
                                                variant="ghost"
                                                aria-label={`Remover ${product.productName} do carrinho`}
                                                className={css({
                                                  padding: 0,
                                                  marginLeft: 'auto',
                                                  _icon: {
                                                    fill: 'error'
                                                  }
                                                })}
                                                onClick={() =>
                                                  removeProduct({
                                                    productId:
                                                      product.productId,
                                                    storeId: product.storeId
                                                  })
                                                }
                                              >
                                                <DeleteIcon />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            )}
                          </div>
                        )}
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
                    alignItems: 'center',
                    paddingBlockStart: '4',
                    paddingBlockEnd: { base: '4', medium: '6' },
                    paddingInline: { base: '4', medium: '6' }
                  })}
                >
                  <div
                    className={css({
                      display: 'flex',
                      flex: '1',
                      flexDirection: 'column',
                      gap: '4'
                    })}
                  >
                    <div
                      className={css({
                        display: 'flex',
                        justifyContent: 'space-between'
                      })}
                    >
                      <span
                        className={css({
                          fontSize: 'lg',
                          fontWeight: 'medium'
                        })}
                      >
                        Total
                      </span>
                      <span
                        className={css({
                          fontWeight: 'medium',
                          paddingInline: '4'
                        })}
                      >
                        {formatNumber({
                          options: { currency: 'BRL' },
                          numberToBeFormatted: cartTotal / 100
                        })}
                      </span>
                    </div>

                    <div
                      className={css({
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '2'
                      })}
                    >
                      <Button variant="ghost" onClick={() => setOpen(false)}>
                        Cancelar
                      </Button>

                      {!!cartCount && <SubmitButton />}
                    </div>
                  </div>
                </footer>
              </>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
