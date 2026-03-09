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
  const [payments, setPayments] = useState<TPayment[] | undefined>(undefined)
  const [loadData, setLoadData] = useState(false)

  useEffect(() => {
    async function fetchPayments() {
      setLoadData(true)
      const supabase = createClient()

      const { data: stripe_customer } = await supabase
        .from('stripe_customer')
        .select('stripe_customer_id')
        .eq('customer_id', user.id)
        .single()

      const { data: ordersCustomer } = await supabase
        .from('checkout_session')
        .select('*')
        .eq('customer_id', stripe_customer?.stripe_customer_id)
        .order('created_at', { ascending: false })

      if (ordersCustomer) {
        const newPayments = ordersCustomer as TPayment[]
        for (const payment of ordersCustomer) {
          if (!!payment.line_items?.length)
            for (const food of payment.line_items) {
              const { data: foods } = await supabase
                .from('foods')
                .select(`name, price, restaurant: restaurants ( name )`)
                .eq('stripe_food_id', food.food_id)
                .single()

              if (foods) food.food = foods
            }
        }

        setPayments(newPayments)
      }
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
              : payments?.map(payment => (
                  <Payment key={payment.payment_intent_id} payment={payment} />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}
