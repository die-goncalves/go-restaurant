import clsx from 'clsx'
import { CopySimple } from 'phosphor-react'
import toast from 'react-hot-toast'
import { useMediaQuery } from 'react-responsive'
import { TOrder } from '../types'
import { formatNumber } from '../utils/formatNumber'
import { Accordion } from './Accordion'

type PaymentProps = {
  payment: Omit<TOrder, 'line_items' | 'shipping_options'> & {
    line_items: Array<{
      food_id: string
      quantity: number
      food: { name: string; price: number; restaurant: { name: string } }
    }> | null
    shipping_options: {
      shipping_amount: number
      shipping_rate: string
      shipping_address: string
      shipping_geohash: string
    } | null
  }
}
export function Payment({ payment }: PaymentProps) {
  const totalPrice = payment.line_items?.reduce(
    (acc, currentItem) =>
      (acc += currentItem.quantity * currentItem.food.price),
    0
  )

  const groupPayment = payment.line_items?.reduce(
    (acc, currentValue) => {
      if (acc[currentValue.food.restaurant.name]) {
        acc[currentValue.food.restaurant.name] = [
          ...acc[currentValue.food.restaurant.name],
          currentValue
        ]
        return acc
      }
      return {
        ...acc,
        [currentValue.food.restaurant.name]: [currentValue]
      }
    },
    {} as {
      [key: string]: {
        food_id: string
        quantity: number
        food: {
          name: string
          price: number
          restaurant: {
            name: string
          }
        }
      }[]
    }
  )

  const isAtLeast640 = useMediaQuery({ minWidth: 640 })

  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    await navigator.clipboard.writeText(payment.payment_intent_id ?? '')
    toast('Identificação do pagamento copiado')
  }

  return (
    <Accordion.Root>
      <Accordion.Item value="order">
        <Accordion.Trigger
          className={clsx(
            'flex rounded w-full h-max shadow-md',
            payment.payment_status === 'paid'
              ? 'bg-light-green-200'
              : 'bg-light-red-200 opacity-80'
          )}
        >
          <div className="flex flex-col w-full gap-2 pr-4">
            <div className="flex justify-between items-start">
              <div
                className={clsx(
                  'xl:grid xl:grid-cols-[100px_auto] xl:gap-x-2',
                  'md:flex-row md:items-center md:gap-2',
                  'flex flex-col items-start justify-center'
                )}
              >
                <p className="text-left font-medium uppercase">Pagamento</p>
                {isAtLeast640 ? (
                  <p className="text-sm">{payment.payment_intent_id}</p>
                ) : (
                  <div className="flex items-center">
                    <p
                      className={clsx(
                        'xs:max-w-none',
                        'text-sm max-w-[100px] truncate'
                      )}
                    >
                      {payment.payment_intent_id}
                    </p>
                    <button
                      onClick={copy}
                      className={clsx(
                        'xs:hidden',
                        'p-1 rounded',
                        'transition-[background-color, outline] ease-in duration-150',
                        'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
                      )}
                    >
                      <CopySimple
                        className="w-4 h-4 text-light-gray-800"
                        weight="light"
                      />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end">
                <p className="font-medium">
                  {payment.payment_status === 'paid' ? 'PAGO' : 'NÃO PAGO'}
                </p>
              </div>
            </div>

            <div className={clsx('xl:grid xl:grid-cols-2', 'flex flex-col')}>
              <div
                className={clsx(
                  'xl:grid xl:grid-cols-[100px_auto] xl:gap-x-2 xl:items-center xl:justify-start',
                  'flex w-full justify-between'
                )}
              >
                <p className="flex flex-none mr-2 text-left text-sm italic">
                  Criado em
                </p>
                {isAtLeast640 ? (
                  <p className="text-sm text-right">
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'full',
                      timeStyle: 'long'
                    }).format(new Date(payment.created_at))}
                  </p>
                ) : (
                  <p className="text-sm">
                    {new Intl.DateTimeFormat('pt-BR').format(
                      new Date(payment.created_at)
                    )}
                  </p>
                )}
              </div>

              {payment.updated_at ? (
                <div
                  className={clsx(
                    'xl:grid xl:grid-cols-[100px_auto] xl:gap-x-2 xl:items-center xl:justify-start',
                    'flex w-full justify-between'
                  )}
                >
                  <p className="flex flex-none mr-2 text-left text-sm italic">
                    Atualizado em
                  </p>
                  {isAtLeast640 ? (
                    <p className="text-sm text-right">
                      {new Intl.DateTimeFormat('pt-BR', {
                        dateStyle: 'full',
                        timeStyle: 'long'
                      }).format(new Date(payment.updated_at))}
                    </p>
                  ) : (
                    <p className="text-sm">
                      {new Intl.DateTimeFormat('pt-BR').format(
                        new Date(payment.updated_at)
                      )}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </Accordion.Trigger>
        <Accordion.Content>
          <div className="flex flex-col gap-4 p-4 bg-light-gray-200 rounded-b">
            <div className="flex w-full flex-col gap-4">
              {groupPayment &&
                Object.entries(groupPayment).map(restaurant => {
                  return (
                    <div key={restaurant[0]} className="flex flex-col gap-4">
                      <p className="text-center">
                        Comida pedida no restaurante&nbsp;
                        <span className="text-light-gray-800 font-medium">
                          {restaurant[0]}
                        </span>
                      </p>
                      <div className="w-full overflow-auto">
                        <table className="w-full [&_th]:p-[0.5rem_1rem] [&_td]:p-[0.5rem_1rem] [&_td]:whitespace-nowrap rounded border-2 border-light-gray-400 border-separate [&_tr:nth-child(even)]:bg-light-gray-300 [&>tbody_tr:hover]:bg-light-gray-300">
                          <thead className="bg-light-gray-100">
                            <tr>
                              <th className="text-left">Comida</th>
                              <th className="text-right">Preço</th>
                              <th className="text-right">Quantidade</th>
                              <th className="text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {restaurant[1].map(item => (
                              <tr key={item.food_id}>
                                <td className="text-left">{item.food.name}</td>
                                <td className="text-right">
                                  {formatNumber({
                                    options: { currency: 'BRL' },
                                    numberToBeFormatted: Number(item.food.price)
                                  })}
                                </td>
                                <td className="text-right">{item.quantity}</td>
                                <td className="text-right">
                                  {formatNumber({
                                    options: { currency: 'BRL' },
                                    numberToBeFormatted:
                                      Number(item.quantity) *
                                      Number(item.food.price)
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                })}
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-center">Sobre o envio</p>
              <div className="w-full overflow-auto">
                <table className="w-full [&_th]:p-[0.5rem_1rem] [&_td]:p-[0.5rem_1rem] [&_td]:whitespace-nowrap rounded border-2 border-light-gray-400 border-separate [&_tr:nth-child(even)]:bg-light-gray-300 [&>tbody_tr:hover]:bg-light-gray-300">
                  <thead className="bg-light-gray-100">
                    <tr>
                      <th className="text-left">Endereço</th>
                      <th className="text-right">Geohash</th>
                      <th className="text-right">Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-left">
                        {payment.shipping_options &&
                          payment.shipping_options.shipping_address}
                      </td>
                      <td className="text-right">
                        {payment.shipping_options &&
                          payment.shipping_options.shipping_geohash}
                      </td>
                      <td className="text-right">
                        {payment.shipping_options &&
                          formatNumber({
                            options: { currency: 'BRL' },
                            numberToBeFormatted: Number(
                              payment.shipping_options.shipping_amount
                            )
                          })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <table className="w-full [&_th]:p-[0.5rem_1rem] [&_td]:p-[0.5rem_1rem] rounded border-2 border-light-gray-400 border-separate [&_tr:nth-child(even)]:bg-light-gray-300 [&>tbody_tr:hover]:bg-light-gray-300">
                <thead className="bg-light-gray-100">
                  <tr>
                    <th className="text-right">Custo total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-right">
                      {payment.shipping_options &&
                        totalPrice &&
                        formatNumber({
                          options: { currency: 'BRL' },
                          numberToBeFormatted:
                            Number(payment.shipping_options.shipping_amount) +
                            totalPrice
                        })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
