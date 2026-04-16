import { Portal } from '@zag-js/react'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import { useState } from 'react'
import { AddIcon } from '@/src/components/icons/add'
import { CloseIcon } from '@/src/components/icons/close'
import { LocalMallIcon } from '@/src/components/icons/local-mall'
import { RemoveIcon } from '@/src/components/icons/remove'
import { StarIcon } from '@/src/components/icons/star'
import { Button } from '@/src/components/ui/button'
import { Dialog } from '@/src/components/ui/dialog'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { useCart } from '@/src/contexts/cart-context'
import { shimmerBase64 } from '@/src/utils/blur-data-url'
import { formatNumber } from '@/src/utils/format-number'
import { getStarColor } from '@/src/utils/get-star-color'
import { css } from '@/styled-system/css'
import { Product } from '../page'

const Badge = dynamic(
  () =>
    Promise.resolve(function Badge({ presence }: { presence: boolean }) {
      return presence ? (
        <div
          aria-hidden="true"
          className={css({
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'surface.container.high',
            top: 0,
            right: 0,
            height: '10',
            width: '10',
            transform: 'translate(25%, -25%)',
            _icon: {
              width: '5',
              height: '5',
              opacity: 0.64
            }
          })}
        >
          <LocalMallIcon />
        </div>
      ) : null
    }),
  { ssr: false }
)

type ProductProps = {
  store: { id: string; name: string; imageURL: string }
  product: Product
}
export function ProductCard({ product, store }: ProductProps) {
  const [count, setCount] = useState(0)
  const { addProduct, getProductQuantity } = useCart()

  const productQuantity = getProductQuantity({
    productId: product.id,
    storeId: store.id
  })

  const decrement = () => setCount(prev => Math.max(0, prev - 1))
  const increment = () => setCount(prev => prev + 1)
  const reset = () => setCount(0)

  return (
    <Dialog.Root size="md" onExitComplete={reset}>
      <Dialog.Trigger asChild>
        <button
          className={css({
            position: 'relative',
            display: 'flex',
            boxSizing: 'border-box',
            background: 'surface.container',
            cursor: 'pointer',
            shadow: 'md',
            transitionProperty: 'transform, box-shadow',
            transitionDuration: '350ms, 150ms',
            transitionTimingFunction:
              'token(easings.expressive-fast-spatial), token(easings.expressive-fast-effects)',
            _hover: {
              transform: 'translateY(-0.5rem)',
              shadow: 'lg',
              transitionProperty: 'transform, box-shadow',
              transitionDuration: '500ms, 200ms',
              transitionTimingFunction:
                'token(easings.expressive-default-spatial), token(easings.expressive-default-effects)'
            },
            outlineStyle: 'none',
            outlineWidth: '2px',
            outlineOffset: '2px',
            outlineColor: 'transparent',
            _focusVisible: {
              outlineStyle: 'solid',
              outlineColor: 'outline'
            }
          })}
        >
          <div
            className={css({
              display: 'grid',
              width: '100%',
              gridTemplateColumns: '2fr 1fr',
              gridTemplateRows: 'repeat(1, minmax(0, 1fr))'
            })}
          >
            <div
              className={css({
                display: 'grid',
                gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
                gridTemplateRows: 'min-content min-content minmax(0, 1fr)',
                gridRowGap: { base: '3', medium: '4' },
                padding: { base: '3', medium: '4' }
              })}
            >
              <div
                className={css({
                  display: 'flex',
                  textAlign: 'start',
                  width: '100%'
                })}
              >
                <h3
                  className={css({
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textStyle: 'lg'
                  })}
                >
                  {product.name}
                </h3>
              </div>

              <div
                className={css({
                  display: 'flex',
                  textAlign: 'start',
                  width: '100%'
                })}
              >
                <p
                  className={css({
                    overflow: 'hidden',
                    lineClamp: 2,
                    textStyle: 'md',
                    height: '12'
                  })}
                >
                  {product.description}
                </p>
              </div>

              <div
                className={css({
                  display: 'flex',
                  textAlign: 'start',
                  alignItems: 'end',
                  width: '100%',
                  gap: '4'
                })}
              >
                <span className={css({ fontWeight: 'medium' })}>
                  {formatNumber({
                    options: { currency: 'BRL' },
                    numberToBeFormatted: product.price_cents / 100
                  })}
                </span>
                {product.ratings?.length && (
                  <div
                    className={css({
                      display: 'inline-flex'
                    })}
                  >
                    <span
                      className={css({
                        display: 'inline-flex',
                        alignItems: 'center',
                        flexShrink: 0
                      })}
                    >
                      <StarIcon
                        style={{ fill: getStarColor(product.average_rating) }}
                        className={css({
                          width: '4',
                          height: '4'
                        })}
                      />
                    </span>
                    &nbsp;
                    <span>{product.average_rating}</span>&nbsp;
                    <span className={css({ opacity: 0.64 })}>
                      ({product.ratings?.length})
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div
              className={css({
                position: 'relative',
                display: 'flex',
                height: '100%',
                width: '100%'
              })}
            >
              <NextImage
                src={product.image_url}
                alt={product.name}
                fill
                className={css({ objectFit: 'cover' })}
                placeholder="blur"
                blurDataURL={shimmerBase64}
                sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
              />
            </div>
          </div>

          <Badge presence={!!productQuantity} />
        </button>
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
                    {product.name}
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
                  <ScrollArea.Root size="md" variant="always">
                    <ScrollArea.Viewport>
                      <ScrollArea.Content
                        className={css({
                          display: 'flex',
                          flexDirection: 'column'
                        })}
                      >
                        <Dialog.Description
                          className={css({
                            paddingInline: { base: '4', medium: '6' }
                          })}
                        >
                          <p>{product.description}</p>
                        </Dialog.Description>

                        <div
                          className={css({
                            display: 'flex',
                            width: 'full',
                            height: '48',
                            position: 'relative'
                          })}
                        >
                          <NextImage
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className={css({ objectFit: 'cover' })}
                            placeholder="blur"
                            blurDataURL={shimmerBase64}
                            sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
                          />
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
                    flexDirection: 'column',
                    gap: '4'
                  })}
                >
                  <div
                    className={css({
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    })}
                  >
                    <div className={css({ display: 'flex' })}>
                      <Button
                        variant="ghost"
                        aria-label={`Diminuir quantidade de ${product.name}`}
                        aria-disabled={count === 0}
                        className={css({
                          padding: 0
                        })}
                        onClick={decrement}
                      >
                        <RemoveIcon />
                      </Button>

                      <span
                        aria-live="polite"
                        aria-label={`Quantidade: ${count}`}
                        className={css({
                          display: 'inline-flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxSize: '10'
                        })}
                      >
                        {count}
                      </span>

                      <Button
                        variant="ghost"
                        aria-label={`Aumentar quantidade de ${product.name}`}
                        className={css({
                          padding: 0
                        })}
                        onClick={increment}
                      >
                        <AddIcon />
                      </Button>
                    </div>

                    <span className={css({ fontWeight: 'medium' })}>
                      {formatNumber({
                        options: { currency: 'BRL' },
                        numberToBeFormatted: (count * product.price_cents) / 100
                      })}
                    </span>
                  </div>

                  <Button
                    variant="solid"
                    aria-disabled={count === 0}
                    className={css({
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%'
                    })}
                    onClick={() => {
                      if (count === 0) return
                      addProduct({
                        store: {
                          id: store.id,
                          name: store.name,
                          imageURL: store.imageURL
                        },
                        product: {
                          id: product.id,
                          name: product.name,
                          imageURL: product.image_url,
                          priceCents: product.price_cents,
                          amount: count
                        }
                      })
                      setOpen(false)
                    }}
                  >
                    Adicionar ao carrinho
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
