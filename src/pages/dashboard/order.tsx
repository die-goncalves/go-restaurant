import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { createServerSupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import { TOrder } from '../../types'
import { supabase } from '../../services/supabaseClient'
import { Skeleton } from '../../components/Skeleton'
import { DashboardNavigation } from '../../components/DashboardNavigation'
import { Payment } from '../../components/Payment'
import { SignedUser } from '../../components/SignedUser'
import { Logo } from '../../components/Logo'
import clsx from 'clsx'

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

export default function Order({ user }: ProfileProps) {
  const [payments, setPayments] = useState<TPayment[] | undefined>(undefined)
  const [loadData, setLoadData] = useState(false)

  useEffect(() => {
    async function fetchPayments() {
      setLoadData(true)
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
        let newPayments = ordersCustomer as TPayment[]
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
    <div className="bg-light-gray-100 h-screen overflow-auto scrollbar-gutter-stable">
      <Head>
        <title>Pedidos | GoRestaurant</title>
      </Head>
      <div className="flex flex-col">
        <header
          className={clsx(
            'lg:px-8',
            'sm:px-6',
            'flex p-4 items-center justify-between bg-light-gray-100'
          )}
        >
          <Logo />

          <SignedUser />
        </header>

        <div
          className={clsx(
            'lg:px-8',
            'sm:flex-row sm:px-6',
            'flex flex-col px-4 min-h-[calc(100vh-4.5rem)]'
          )}
        >
          <div className={clsx('sm:top-0', 'flex sticky -top-4 h-max z-[1]')}>
            <DashboardNavigation />
          </div>

          {loadData ? (
            <div className="flex flex-1 flex-col gap-4 py-4">
              {Array.from({ length: 4 }).map((item, index) => (
                <Skeleton
                  key={index}
                  className={clsx('md:h-[68px]', 'rounded w-full h-[92px]')}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-4 py-4">
              {payments &&
                payments.map(payment => (
                  <Payment key={payment.payment_intent_id} payment={payment} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx, {
    cookieOptions: {
      name: '@gorestaurant-v0.1.0:auth-token',
      domain: 'localhost',
      path: '/',
      sameSite: 'lax',
      secure: false,
      maxAge: 60 * 60 * 24 * 365
    }
  })

  // Check if we have a session
  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }

  return {
    props: {
      initialSession: session,
      user: session.user
    }
  }
}
