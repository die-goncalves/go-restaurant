'use client'

import { FormEvent, useEffect, useState } from 'react'
import NextImage from 'next/image'
import { Minus, Plus, ShoppingCartSimple, SmileySad, X } from 'phosphor-react'
import { formatNumber } from '../utils/formatNumber'
import { shimmerBase64 } from '../utils/blurDataURL'
import { useCart } from '../contexts/cart-context'
import { Dialog } from './dialog'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { useAuth } from '../contexts/auth-context'
import { css } from '@/styled-system/css'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

let stripePromise: Promise<Stripe | null> | null = null
function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
    )
  }
  return stripePromise
}

const qtyButton = css({
  display: 'flex',
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
})

export function Cart() {
  const [open, setOpen] = useState(false)
  const {
    addFood,
    removeFood,
    qtyItemsInTheCart,
    separateFoodByRestaurant,
    totalPrice
  } = useCart()
  const { session } = useAuth()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST'
      })
      if (!response.ok) {
        throw new Error(`Error creating session: ${response.statusText}`)
      }
      const { sessionId } = await response.json()

      // Redirect to Checkout.
      const stripe = await getStripe()
      await stripe!.redirectToCheckout({ sessionId })
    } catch (err) {
      console.error(err)
    }
  }

  const qtyCart = qtyItemsInTheCart()
  const foodByRestaurant = separateFoodByRestaurant()
  const price = totalPrice()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button
          className={css({
            position: 'relative',
            display: 'flex',
            p: '2',
            boxSizing: 'border-box',
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
          <ShoppingCartSimple
            className={css({ w: '6', h: '6', color: 'light.gray.800' })}
          />
          {qtyCart ? (
            <div
              className={css({
                display: 'flex',
                position: 'absolute',
                boxSizing: 'content-box',
                borderWidth: '4',
                borderColor: 'light.gray.100',
                w: '6',
                h: '6',
                top: '0',
                right: '0',
                rounded: 'full',
                bg: 'light.orange.200',
                transform: 'translate(33%, -33%)'
              })}
            >
              <span
                className={css({
                  m: 'auto',
                  fontWeight: 'medium',
                  fontSize: 'sm'
                })}
              >
                {qtyCart > 99 ? '+99' : qtyCart}
              </span>
            </div>
          ) : null}
        </button>
      </Dialog.Trigger>

      <Dialog.Content
        className={css({
          w: 'calc(100vw - 2rem)',
          sm: { w: '30rem' }
        })}
        onCloseInteractOverlay={() => setOpen(false)}
      >
        <header
          className={css({
            display: 'flex',
            gap: '4',
            p: '4',
            justifyContent: 'space-between',
            alignItems: 'center'
          })}
        >
          <Dialog.Title asChild>
            <p className={css({ fontSize: 'xl', fontWeight: 'medium' })}>
              Carrinho
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
            maxH: 'calc(100vh - 244px)',
            overflow: qtyCart ? 'auto' : undefined,
            scrollbarGutter: qtyCart ? 'stable' : undefined,
            '2xs': { maxH: 'calc(100vh - 220px)' },
            sm: { maxH: 'calc(100vh - 236px)' },
            lg: { maxH: '96' }
          })}
        >
          {!qtyCart ? (
            <div
              className={css({
                position: 'relative',
                display: 'flex',
                w: 'full',
                h: '52'
              })}
            >
              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'absolute',
                  inset: '0',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: '1',
                  fontWeight: 'medium',
                  fontSize: 'lg'
                })}
              >
                <SmileySad
                  className={css({ w: '20', h: '20', color: 'light.gray.500' })}
                  weight="thin"
                />
                Sem comida no carrinho
              </div>
              <NextImage
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
                alt="Sem comida no carrinho"
                fill
                className={css({ objectFit: 'cover', opacity: '0.25' })}
                placeholder="blur"
                blurDataURL={shimmerBase64}
                sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
              />
            </div>
          ) : (
            <div className={css({ py: '4', xs: { px: '4' } })}>
              {Object.entries(foodByRestaurant).map(([, products]) => (
                <div
                  key={products[0].storeId}
                  className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    w: 'full',
                    gap: '2',
                    '& + &': { mt: '4' }
                  })}
                >
                  <div
                    className={css({ position: 'relative', display: 'flex' })}
                  >
                    <div
                      className={css({
                        position: 'relative',
                        display: 'flex',
                        w: 'full',
                        h: '16'
                      })}
                    >
                      <NextImage
                        src={products[0].storeImageURL}
                        alt={products[0].storeName}
                        fill
                        className={css({
                          rounded: 'sm',
                          objectFit: 'cover',
                          opacity: '0.25'
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
                      <span
                        className={css({
                          fontSize: 'lg',
                          fontWeight: 'medium'
                        })}
                      >
                        {products[0].storeName}
                      </span>
                    </div>
                  </div>

                  <div
                    className={css({
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2'
                    })}
                  >
                    {products.map(product => (
                      <div
                        key={`${product.storeId}:${product.productId}`}
                        className={css({
                          display: 'flex',
                          px: '4',
                          xs: { px: '0' }
                        })}
                      >
                        <div
                          className={css({
                            position: 'relative',
                            display: 'flex',
                            w: '16',
                            h: '16'
                          })}
                        >
                          <NextImage
                            src={product.productImageURL}
                            alt={product.productName}
                            fill
                            className={css({
                              rounded: 'sm',
                              objectFit: 'cover'
                            })}
                            placeholder="blur"
                            blurDataURL={shimmerBase64}
                            sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
                          />
                        </div>
                        <div
                          className={css({
                            display: 'flex',
                            flex: '1',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            pl: '2'
                          })}
                        >
                          <span>{product.productName}</span>
                          <div
                            className={css({
                              display: 'flex',
                              bg: 'light.gray.200',
                              gap: '2'
                            })}
                          >
                            <button
                              className={qtyButton}
                              onClick={() => {
                                removeFood({
                                  productId: product.productId,
                                  storeId: product.storeId
                                })
                              }}
                            >
                              <Minus
                                className={css({
                                  w: '6',
                                  h: '6',
                                  color: 'light.gray.800'
                                })}
                              />
                            </button>
                            <span className={css({ alignSelf: 'center' })}>
                              {product.amount}
                            </span>
                            <button
                              className={qtyButton}
                              onClick={() =>
                                addFood({
                                  store: {
                                    id: product.storeId,
                                    name: product.storeName,
                                    imageUrl: product.storeImageURL
                                  },
                                  product: {
                                    id: product.productId,
                                    name: product.productName,
                                    imageUrl: product.productImageURL,
                                    priceCents: product.priceCents
                                  }
                                })
                              }
                            >
                              <Plus
                                className={css({
                                  w: '6',
                                  h: '6',
                                  color: 'light.gray.800'
                                })}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer
          className={css({ display: 'flex', alignItems: 'center', p: '4' })}
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
              <span className={css({ fontSize: 'lg', fontWeight: 'medium' })}>
                Total
              </span>
              <span className={css({ bg: 'light.gray.200', px: '2' })}>
                {formatNumber({
                  options: { currency: 'BRL' },
                  numberToBeFormatted: price ? price / 100 : 0
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
              <button
                onClick={() => setOpen(false)}
                className={css({
                  py: '2',
                  px: '4',
                  rounded: 'sm',
                  bg: 'light.gray.100',
                  transition: 'background-color 150ms ease-in',
                  outline: 'none',
                  '&:not(:disabled):hover': { bg: 'light.gray.200' },
                  _focus: {
                    outlineStyle: 'solid',
                    outlineWidth: '2',
                    outlineOffset: '2',
                    outlineColor: 'light.indigo.300'
                  }
                })}
              >
                Cancelar
              </button>
              <button
                disabled={!session?.user || !qtyCart}
                onClick={handleSubmit}
                className={css({
                  py: '2',
                  px: '4',
                  rounded: 'sm',
                  bg: 'light.green.200',
                  transition: 'background-color 150ms ease-in',
                  outline: 'none',
                  '&:not(:disabled):hover': { bg: 'light.green.300' },
                  _focus: {
                    outlineStyle: 'solid',
                    outlineWidth: '2',
                    outlineOffset: '2',
                    outlineColor: 'light.indigo.300'
                  },
                  _disabled: { cursor: 'not-allowed', opacity: '0.8' }
                })}
              >
                {session?.user
                  ? !qtyCart
                    ? 'Adicione comidas ao carrinho'
                    : 'Confirmar'
                  : 'Você não está logado'}
              </button>
            </div>
          </div>
        </footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
