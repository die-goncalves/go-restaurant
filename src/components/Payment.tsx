import clsx from 'clsx'
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

  return (
    <Accordion.Root>
      <Accordion.Item value="order">
        <Accordion.Trigger
          className={clsx(
            'flex justify-between rounded  w-full h-max shadow-md',
            payment.payment_status === 'paid'
              ? 'bg-light-green-200'
              : 'bg-light-red-200 opacity-80'
          )}
        >
          <div className="grid grid-rows-2 w-full gap-2 pr-4">
            <div className="grid grid-cols-2">
              <div className="grid grid-cols-[100px_auto] gap-x-2 items-center justify-start">
                <p className="text-left font-medium uppercase">Pagamento</p>
                <p className="text-sm">{payment.payment_intent_id}</p>
              </div>
              <div className="flex items-center justify-end">
                <p className="font-medium">
                  {payment.payment_status === 'paid' ? 'PAGO' : 'NÃO PAGO'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="grid grid-cols-[100px_auto] gap-x-2 items-center justify-start">
                <p className="text-left text-sm italic">Criado em</p>
                <p className="text-sm">
                  {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'full',
                    timeStyle: 'long'
                  }).format(new Date(payment.created_at))}
                </p>
              </div>

              {payment.updated_at && (
                <div className="grid grid-cols-[100px_auto] gap-x-2 items-center justify-end">
                  <p className="text-sm italic">Atualizado em</p>
                  <p className="text-sm">
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'full',
                      timeStyle: 'long'
                    }).format(new Date(payment.updated_at))}
                  </p>
                </div>
              )}
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
                      <div className="flex self-center">
                        <p>
                          Comida pedida no restaurante&nbsp;
                          <span className="text-light-gray-800 font-medium">
                            {restaurant[0]}
                          </span>
                        </p>
                      </div>
                      <table className="[&_th]:p-[0.5rem_1rem] [&_td]:p-[0.5rem_1rem] rounded border-2 border-light-gray-400 border-separate [&_tr:nth-child(even)]:bg-light-gray-300 [&>tbody_tr:hover]:bg-light-gray-300">
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
                  )
                })}
            </div>
            <div className="flex flex-col gap-4">
              <div className="self-center">Sobre o envio</div>
              <table className="[&_th]:p-[0.5rem_1rem] [&_td]:p-[0.5rem_1rem] rounded border-2 border-light-gray-400 border-separate [&_tr:nth-child(even)]:bg-light-gray-300 [&>tbody_tr:hover]:bg-light-gray-300">
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
