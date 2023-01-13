import clsx from 'clsx'
import { FormEvent, useState } from 'react'
import NextImage from 'next/image'
import { Minus, Plus, ShoppingCartSimple, X } from 'phosphor-react'
import { formatNumber } from '../utils/formatNumber'
import { useCart } from '../contexts/CartContext'
import { Dialog } from './Dialog'
import { api } from '../services/api'
import { loadStripe } from '@stripe/stripe-js'
import { useAuth } from '../contexts/AuthContext'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
)

export default function Cart() {
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
      const response = await api.post('/api/checkout-sessions')

      const { sessionId } = response.data

      // Redirect to Checkout.
      const stripe = await stripePromise
      await stripe!.redirectToCheckout({ sessionId })
    } catch (err) {
      console.error(err)
    }
  }

  const qtyCart = qtyItemsInTheCart()
  const foodByRestaurant = separateFoodByRestaurant()
  const price = totalPrice()

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button
          className={clsx(
            'relative flex p-2 box-border rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300 group',
            'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
            'transition-[background-color, box-shadow] ease-in duration-150'
          )}
        >
          <ShoppingCartSimple className="w-6 h-6 text-light-gray-800" />
          {qtyCart ? (
            <div className="flex absolute box-content border-4 border-light-gray-100 w-6 h-6 top-0 right-0 rounded-full bg-light-orange-200 translate-x-1/3 -translate-y-1/3">
              <span className="m-auto font-medium text-sm">
                {qtyCart > 99 ? '+99' : qtyCart}
              </span>
            </div>
          ) : null}
        </button>
      </Dialog.Trigger>

      <Dialog.Content
        className="w-[30rem]"
        onCloseInteractOverlay={() => setOpen(false)}
      >
        <header className="flex p-4 items-center justify-between">
          <p className="text-xl font-medium">Carrinho</p>
          <Dialog.Close>
            <button
              className={clsx(
                'p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                'transition-[background-color, outline] ease-in duration-150',
                'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              <X className="w-6 h-6" />
            </button>
          </Dialog.Close>
        </header>

        <main className="relative flex flex-col py-4 pl-4 max-h-96 overflow-auto scrollbar-gutter-stable">
          {!qtyCart && (
            <div className="relative flex w-full h-60">
              <NextImage
                src="https://images.unsplash.com/photo-1624811533744-f85d5325d49c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Sem comida no carrinho"
                fill
                className="object-cover contrast-150"
              />
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-light-gray-100 via-transparent to-light-gray-100 opacity-100"></div>
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-light-gray-100 via-transparent to-light-gray-100 opacity-100"></div>
            </div>
          )}
          {Object.entries(foodByRestaurant).map(item => {
            return (
              <div
                key={item[1][0].id}
                className="flex flex-col w-full gap-2 [&+div]:mt-4"
              >
                <div className="relative flex">
                  <div className="relative flex w-full h-16">
                    <NextImage
                      layout="fill"
                      src={item[1][0].restaurant.image}
                      alt={item[1][0].restaurant.name}
                      fill
                      className="rounded object-cover opacity-25"
                    />
                  </div>
                  <div className="absolute flex inset-0 items-center justify-center">
                    <span className="text-lg font-medium">
                      {item[1][0].restaurant.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {item[1].map(food => {
                    return (
                      <div className="flex" key={food.id}>
                        <div className="relative flex w-16 h-16">
                          <NextImage
                            layout="fill"
                            src={food.image}
                            alt={food.name}
                            fill
                            className="rounded object-cover"
                          />
                        </div>
                        <div className="flex flex-1 items-center justify-between pl-2">
                          <span>{food.name}</span>
                          <div className="flex bg-light-gray-200 gap-2">
                            <button
                              className={clsx(
                                'flex p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                                'transition-[background-color, outline] ease-in duration-150',
                                'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                              )}
                              onClick={() => removeFood({ id: food.id })}
                            >
                              <Minus className="w-6 h-6 text-light-gray-800" />
                            </button>
                            <span className="self-center">{food.amount}</span>
                            <button
                              className={clsx(
                                'flex p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                                'transition-[background-color, outline] ease-in duration-150',
                                'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                              )}
                              onClick={() =>
                                addFood({
                                  restaurant: item[1][0].restaurant,
                                  food
                                })
                              }
                            >
                              <Plus className="w-6 h-6 text-light-gray-800" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </main>

        <footer className="flex items-center p-4">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex justify-between">
              <span className="text-lg font-medium">Total</span>
              <span className="bg-light-gray-200 px-2">
                {formatNumber({
                  options: { currency: 'BRL' },
                  numberToBeFormatted: !!price ? price : 0
                })}
              </span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className={clsx(
                  'py-2 px-4 rounded bg-light-gray-100 [&:not(:disabled):hover]:bg-light-gray-200',
                  'transition-[background-color, outline] ease-in duration-150',
                  'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                )}
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
              <button
                className={clsx(
                  'py-2 px-4 rounded bg-light-green-200 [&:not(:disabled):hover]:bg-light-green-300',
                  'transition-[background-color, outline] ease-in duration-150',
                  'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
                  'disabled:cursor-not-allowed disabled:opacity-80'
                )}
                disabled={!session?.user || !qtyCart}
                onClick={handleSubmit}
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
