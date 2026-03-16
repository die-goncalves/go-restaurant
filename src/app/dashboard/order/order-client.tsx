'use client'

import { useEffect, useState } from 'react'
import { TOrder } from '@/src/types'
import { Skeleton } from '@/src/components/skeleton'
import { DashboardNavigation } from '@/src/components/dashboard-navigation'
import { Payment } from '@/src/components/payment'
import { SignedUser } from '@/src/components/signed-user'
import { Logo } from '@/src/components/logo'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/src/lib/supabase/client'
import { css } from '@/styled-system/css'
import { Json } from '@/src/types/supabase'

export type Orders =
  | {
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
    }[]
  | null

type TPayment = Omit<TOrder, 'line_items' | 'shipping_options'> & {
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

type ProfileProps = {
  user: User
}

export function OrderClient({ user }: ProfileProps) {
  const [orders, setOrders] = useState<Orders>(null)
  const [loadData, setLoadData] = useState(false)

  useEffect(() => {
    async function fetchPayments() {
      setLoadData(true)
      const supabase = createClient()

      const { data: orders } = await supabase
        .from('orders')
        .select(
          `
            id,
            status,
            payment_status,
            shipping_amount,
            shipping_address,
            created_at,
            updated_at,
            order_products (
              id,
              quantity,
              price_cents,
              product:products ( id, name, image_url, price_cents ),
              store:stores ( id, name, image_url )
            )
          `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setOrders(orders)

      setLoadData(false)
    }

    fetchPayments()
  }, [user.id])

  return (
    <div
      className={css({
        bg: 'light.gray.100',
        h: 'screen',
        overflow: 'auto',
        scrollbarGutter: 'stable'
      })}
    >
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        <header
          className={css({
            display: 'flex',
            p: '4',
            alignItems: 'center',
            justifyContent: 'space-between',
            bg: 'light.gray.100',
            sm: { px: '6' },
            lg: { px: '8' }
          })}
        >
          <Logo />

          <SignedUser />
        </header>

        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            px: '4',
            minH: 'calc(100vh - 4.5rem)',
            sm: { flexDirection: 'row', px: '6' },
            lg: { px: '8' }
          })}
        >
          <div
            className={css({
              display: 'flex',
              position: 'sticky',
              top: '-1rem',
              h: 'max',
              zIndex: '1',
              sm: { top: '0' }
            })}
          >
            <DashboardNavigation />
          </div>

          <div
            className={css({
              display: 'flex',
              flex: '1',
              flexDirection: 'column',
              gap: '4',
              py: '4'
            })}
          >
            {loadData
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className={css({
                      rounded: 'sm',
                      w: 'full',
                      h: '92px',
                      md: { h: '68px' }
                    })}
                  />
                ))
              : orders?.map(order => (
                  <Payment key={order.id} payment={order} />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}
