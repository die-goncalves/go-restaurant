import { CopySimple } from 'phosphor-react'
import toast from 'react-hot-toast'
import { useMediaQuery } from 'react-responsive'
import { formatNumber } from '../utils/formatNumber'
import { Accordion } from './accordion'
import { css } from '@/styled-system/css'
import { Json } from '../types/supabase'

const tableStyle = css.raw({
  w: 'full',
  rounded: 'sm',
  borderWidth: '2',
  borderColor: 'light.gray.400',
  borderCollapse: 'separate',
  '& th': { p: '2 4' },
  '& td': { p: '2 4' },
  '& tr:nth-child(even)': { bg: 'light.gray.300' },
  '& tbody tr:hover': { bg: 'light.gray.300' }
})

const tableNowrap = css([
  tableStyle,
  {
    '& td': { p: '2 4', whiteSpace: 'nowrap' }
  }
])

const dateRow = css({
  display: 'flex',
  w: 'full',
  justifyContent: 'space-between',
  xl: {
    display: 'grid',
    gridTemplateColumns: '100px auto',
    columnGap: '2',
    alignItems: 'center',
    justifyContent: 'start'
  }
})

type PaymentProps = {
  payment: {
    id: string
    status: 'open' | 'complete' | 'expired' | null
    payment_status: 'paid' | 'unpaid' | 'no_payment_required' | null
    shipping_amount: number | null
    shipping_address: Json
    created_at: string | null
    updated_at: string | null
    order_products: {
      id: string
      quantity: number
      price_cents: number
      product: {
        id: string
        name: string
        image_url: string | null
        price_cents: number
      }
      store: {
        id: string
        name: string
        image_url: string | null
      }
    }[]
  }
}
export function Payment({ payment }: PaymentProps) {
  const isPaid = payment.payment_status === 'paid'
  const isAtLeast640 = useMediaQuery({ minWidth: 640 })

  const totalPrice =
    (payment.shipping_amount ?? 0) +
    payment.order_products.reduce(
      (acc, item) => acc + item.price_cents * item.quantity,
      0
    )

  const productsByStore = payment.order_products.reduce<
    Record<
      string,
      {
        id: string
        quantity: number
        price_cents: number
        product: {
          id: string
          name: string
          image_url: string | null
          price_cents: number
        }
        store: { id: string; name: string; image_url: string | null }
      }[]
    >
  >((acc, item) => {
    const storeId = item.store.id
    acc[storeId] ??= []
    acc[storeId].push(item)
    return acc
  }, {})
  console.log(productsByStore)

  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    await navigator.clipboard.writeText(payment.id ?? '')
    toast('Identificação do pagamento copiado')
  }

  const formatDate = (date: string, full = false) =>
    new Intl.DateTimeFormat(
      'pt-BR',
      full ? { dateStyle: 'full', timeStyle: 'long' } : undefined
    ).format(new Date(date))

  return (
    <Accordion.Root>
      <Accordion.Item value="order">
        <Accordion.Trigger
          className={css({
            display: 'flex',
            rounded: 'sm',
            w: 'full',
            h: 'max',
            shadow: 'md',
            bg: isPaid ? 'light.green.200' : 'light.red.200',
            opacity: isPaid ? '1' : '0.8'
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              w: 'full',
              gap: '2',
              pr: '4'
            })}
          >
            <div
              className={css({
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              })}
            >
              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  md: { flexDirection: 'row', alignItems: 'center', gap: '2' },
                  xl: {
                    display: 'grid',
                    gridTemplateColumns: '100px auto',
                    columnGap: '2'
                  }
                })}
              >
                <p
                  className={css({
                    textAlign: 'left',
                    fontWeight: 'medium',
                    textTransform: 'uppercase'
                  })}
                >
                  Pagamento
                </p>
                {isAtLeast640 ? (
                  <p className={css({ fontSize: 'sm' })}>{payment.id}</p>
                ) : (
                  <div
                    className={css({ display: 'flex', alignItems: 'center' })}
                  >
                    <p
                      className={css({
                        fontSize: 'sm',
                        maxW: '100px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        xs: { maxW: 'none' }
                      })}
                    >
                      {payment.id}
                    </p>
                    <button
                      onClick={copy}
                      className={css({
                        p: '1',
                        rounded: 'sm',
                        transition: 'background-color 150ms ease-in',
                        outline: 'none',
                        _focus: {
                          outlineStyle: 'solid',
                          outlineWidth: '2',
                          outlineOffset: '2',
                          outlineColor: 'light.indigo.300'
                        },
                        xs: { display: 'none' }
                      })}
                    >
                      <CopySimple
                        className={css({
                          w: '4',
                          h: '4',
                          color: 'light.gray.800'
                        })}
                        weight="light"
                      />
                    </button>
                  </div>
                )}
              </div>

              <div
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                })}
              >
                <p className={css({ fontWeight: 'medium' })}>
                  {isPaid ? 'PAGO' : 'NÃO PAGO'}
                </p>
              </div>
            </div>

            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                xl: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
                }
              })}
            >
              <div className={dateRow}>
                <p
                  className={css({
                    display: 'flex',
                    flexShrink: '0',
                    mr: '2',
                    textAlign: 'left',
                    fontSize: 'sm',
                    fontStyle: 'italic'
                  })}
                >
                  Criado em
                </p>
                <p className={css({ fontSize: 'sm', textAlign: 'right' })}>
                  {formatDate(payment.created_at ?? '', isAtLeast640)}
                </p>
              </div>

              {payment.updated_at && (
                <div className={dateRow}>
                  <p
                    className={css({
                      display: 'flex',
                      flexShrink: '0',
                      mr: '2',
                      textAlign: 'left',
                      fontSize: 'sm',
                      fontStyle: 'italic'
                    })}
                  >
                    Atualizado em
                  </p>
                  <p className={css({ fontSize: 'sm', textAlign: 'right' })}>
                    {formatDate(payment.updated_at, isAtLeast640)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Accordion.Trigger>

        <Accordion.Content>
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4',
              p: '4',
              bg: 'light.gray.200',
              rounded: 'b'
            })}
          >
            <div
              className={css({
                display: 'flex',
                w: 'full',
                flexDirection: 'column',
                gap: '4'
              })}
            >
              {Object.entries(productsByStore).map(([storeId, items]) => (
                <div
                  key={storeId}
                  className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4'
                  })}
                >
                  <p className={css({ textAlign: 'center' })}>
                    Comida pedida no restaurante&nbsp;
                    <span
                      className={css({
                        color: 'light.gray.800',
                        fontWeight: 'medium'
                      })}
                    >
                      {items[0].store.name}
                    </span>
                  </p>
                  <div className={css({ w: 'full', overflow: 'auto' })}>
                    <table className={tableNowrap}>
                      <thead className={css({ bg: 'light.gray.100' })}>
                        <tr>
                          <th className={css({ textAlign: 'left' })}>
                            Produto
                          </th>
                          <th className={css({ textAlign: 'right' })}>Preço</th>
                          <th className={css({ textAlign: 'right' })}>
                            Quantidade
                          </th>
                          <th className={css({ textAlign: 'right' })}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items?.map(item => (
                          <tr key={item.id}>
                            <td className={css({ textAlign: 'left' })}>
                              {item.product.name}
                            </td>
                            <td className={css({ textAlign: 'right' })}>
                              {formatNumber({
                                options: { currency: 'BRL' },
                                numberToBeFormatted:
                                  Number(item.product.price_cents) / 100
                              })}
                            </td>
                            <td className={css({ textAlign: 'right' })}>
                              {item.quantity}
                            </td>
                            <td className={css({ textAlign: 'right' })}>
                              {formatNumber({
                                options: { currency: 'BRL' },
                                numberToBeFormatted:
                                  (Number(item.quantity) *
                                    Number(item.product.price_cents)) /
                                  100
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '4'
              })}
            >
              <p className={css({ textAlign: 'center' })}>Sobre o envio</p>
              <div className={css({ w: 'full', overflow: 'auto' })}>
                <table className={tableNowrap}>
                  <thead className={css({ bg: 'light.gray.100' })}>
                    <tr>
                      <th className={css({ textAlign: 'left' })}>Endereço</th>
                      <th className={css({ textAlign: 'right' })}>Geohash</th>
                      <th className={css({ textAlign: 'right' })}>Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={css({ textAlign: 'left' })}>
                        {
                          (payment.shipping_address as { address: string })
                            ?.address
                        }
                      </td>
                      <td className={css({ textAlign: 'right' })}>
                        {
                          (payment.shipping_address as { geohash: string })
                            ?.geohash
                        }
                      </td>
                      <td className={css({ textAlign: 'right' })}>
                        {formatNumber({
                          options: { currency: 'BRL' },
                          numberToBeFormatted: Number(payment.shipping_amount)
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <table className={css(tableStyle)}>
                <thead className={css({ bg: 'light.gray.100' })}>
                  <tr>
                    <th className={css({ textAlign: 'right' })}>Custo total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={css({ textAlign: 'right' })}>
                      {totalPrice &&
                        formatNumber({
                          options: { currency: 'BRL' },
                          numberToBeFormatted: totalPrice / 100
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
