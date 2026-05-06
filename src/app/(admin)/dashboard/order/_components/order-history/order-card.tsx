import NextImage from 'next/image'
import { formatNumber } from '@/src/utils/format-number'
import { css } from '@/styled-system/css'
import { Order } from '../../page'
import {
  CHECKOUT_STATUS_FILTERS,
  getOrderTotal,
  getProductTotal,
  PAYMENT_STATUS_FILTERS,
  parseShippingAddress
} from './index'

type OrderCardProps = {
  order: Order
}
export function OrderCard({ order }: OrderCardProps) {
  const date = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'long'
  }).format(new Date(order.created_at ?? ''))

  return (
    <div
      className={css({
        position: 'relative',
        isolation: 'isolate',
        appearance: 'none',
        userSelect: 'none',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'start',
        width: '100%',
        height: 'min-content',
        overflow: 'hidden',
        background: 'surface.container',
        padding: '4',
        outlineStyle: 'none',
        outlineWidth: '2px',
        outlineOffset: '2px',
        outlineColor: 'transparent',
        _focusVisible: {
          outlineStyle: 'solid',
          outlineColor: 'outline',
          _after: {
            transitionProperty: 'background',
            transitionDuration: '200ms',
            transitionTimingFunction:
              'token(easings.expressive-default-effects)'
          }
        },
        _hover: {
          _after: {
            transitionProperty: 'background',
            transitionDuration: '200ms',
            transitionTimingFunction:
              'token(easings.expressive-default-effects)'
          }
        },
        _after: {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background: 'transparent',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          transitionProperty: 'background',
          transitionDuration: '150ms',
          transitionTimingFunction: 'token(easings.expressive-fast-effects)'
        },
        _notDisabled: {
          _hover: {
            _after: {
              background: 'surface.on/8'
            }
          },
          _focusVisible: {
            _after: {
              background: 'surface.on/10'
            }
          }
        }
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) min-content',
          width: '100%',
          gap: '2'
        })}
      >
        <div
          className={css({
            display: 'inline-flex',
            flexDirection: 'column',
            gap: '0.25em'
          })}
        >
          <p
            className={css({
              maxWidth: '50%',
              textWrap: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textStyle: 'sm',
              background: 'surface.on/8',
              color: 'surface.on'
            })}
            title={order.id}
          >
            {order.id}
          </p>
          <p className={css({ textStyle: 'sm' })}>{date}</p>
        </div>

        <div
          className={css({
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.25em',
            textStyle: 'sm'
          })}
        >
          <p
            className={css(
              {
                width: 'fit-content',
                fontWeight: 500,
                textWrap: 'nowrap',
                paddingInline: '2'
              },
              CHECKOUT_STATUS_FILTERS.find(f => f.value === order.status)
                ?.className
            )}
          >
            {CHECKOUT_STATUS_FILTERS.find(f => f.value === order.status)
              ?.label ?? 'Não informado'}
          </p>
          <p
            className={css(
              {
                width: 'fit-content',
                fontWeight: 500,
                textWrap: 'nowrap',
                paddingInline: '2'
              },
              PAYMENT_STATUS_FILTERS.find(f => f.value === order.payment_status)
                ?.className
            )}
          >
            {PAYMENT_STATUS_FILTERS.find(f => f.value === order.payment_status)
              ?.label ?? 'Não informado'}
          </p>
        </div>
      </div>

      <hr
        className={css({
          width: '100%',
          borderStyle: 'none',
          marginBlockStart: '3',
          marginBlockEnd: '4',
          borderBlockStartStyle: 'dotted',
          borderBlockStartWidth: '2px',
          borderBlockStartColor: 'outline.variant'
        })}
      />

      <div
        className={css({
          display: 'inline-flex',
          flexDirection: 'column',
          gap: '2',
          width: '100%'
        })}
      >
        <div
          className={css({
            display: 'inline-flex',
            justifyContent: 'space-between',
            textStyle: 'sm'
          })}
        >
          <p>Produtos</p>
          <p>{getProductTotal(order.order_products)}</p>
        </div>

        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '4'
          })}
        >
          {order.order_products.map(p => (
            <div
              key={p.id}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '4'
              })}
            >
              <div
                className={css({
                  alignSelf: 'start',
                  position: 'relative',
                  width: '8',
                  height: '8',
                  '@media screen and (min-width: 600px) and (max-width: 768px)':
                    {
                      display: 'none'
                    }
                })}
              >
                <NextImage
                  className={css({ objectFit: 'cover' })}
                  src={p.product.image_url ?? ''}
                  alt={p.product.name}
                  fill
                />
              </div>

              <div
                className={css({
                  flex: '1',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1'
                })}
              >
                <p
                  className={css({
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  })}
                >
                  {p.product.name}
                </p>
                <p className={css({ textStyle: 'sm' })}>{p.store.name}</p>
              </div>

              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'flex-start',
                  gap: '1',
                  textStyle: 'sm'
                })}
              >
                <p
                  className={css({
                    alignSelf: 'start',
                    whiteSpace: 'nowrap',
                    lineHeight: '24px'
                  })}
                >
                  {formatNumber({
                    options: { currency: 'BRL' },
                    numberToBeFormatted: (p.price_cents * p.quantity) / 100
                  })}
                </p>
                <p
                  className={css({
                    alignSelf: 'end',
                    whiteSpace: 'nowrap'
                  })}
                >
                  ×{p.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr
        className={css({
          width: '100%',
          borderStyle: 'none',
          marginBlockStart: '3',
          marginBlockEnd: '4',
          borderBlockStartStyle: 'solid',
          borderBlockStartWidth: '2px',
          borderBlockStartColor: 'outline.variant'
        })}
      />

      <div
        className={css({
          display: 'inline-flex',
          flexDirection: 'column',
          gap: '2',
          width: '100%',
          textStyle: 'sm'
        })}
      >
        <div
          className={css({
            display: 'inline-flex',
            justifyContent: 'space-between'
          })}
        >
          <p>Subtotal</p>
          <strong className={css({ fontWeight: 'medium' })}>
            {formatNumber({
              options: { currency: 'BRL' },
              numberToBeFormatted:
                (getOrderTotal(order) - (order.shipping_amount ?? 0)) / 100
            })}
          </strong>
        </div>

        <div
          className={css({
            display: 'inline-flex',
            justifyContent: 'space-between'
          })}
        >
          <p>Taxa de envio</p>
          <strong className={css({ fontWeight: 'medium' })}>
            {formatNumber({
              options: { currency: 'BRL' },
              numberToBeFormatted: (order.shipping_amount ?? 0) / 100
            })}
          </strong>
        </div>

        <p className={css({ textWrap: 'pretty' })}>
          {parseShippingAddress(order.shipping_address)?.address}
        </p>
      </div>
    </div>
  )
}
