import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { createServerSupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import { TFoods, TRestaurant } from '../../types'
import { supabase } from '../../services/supabaseClient'
import { SignedUser } from '../../components/SignedUser'
import { Skeleton } from '../../components/Skeleton'
import { RatingCard } from '../../components/Rating/RatingCard'
import { DashboardNavigation } from '../../components/DashboardNavigation'
import { Logo } from '../../components/Logo'
import clsx from 'clsx'

type ProfileProps = {
  user: User
}
export default function Rating({ user }: ProfileProps) {
  const [foodsAvailableForRating, setFoodsAvailableForRating] = useState<
    Array<
      Pick<TFoods, 'id' | 'name' | 'image'> & {
        restaurant: Pick<TRestaurant, 'name'>
      }
    >
  >()
  const [loadingData, setLoadingData] = useState(false)

  useEffect(() => {
    async function fetchPayments() {
      setLoadingData(true)
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
        const foodPayments = ordersCustomer.reduce((acc, current) => {
          const foodWithPaymentCompleted = current.line_items.map(
            (item: { food_id: string }) => {
              if (current.payment_status === 'paid') return item.food_id
            }
          )
          if (foodWithPaymentCompleted[0] !== undefined)
            acc.push(foodWithPaymentCompleted)

          return acc
        }, [])

        const setWithoutRepeatedFood = new Set(foodPayments.flat())
        const arrayFoods = Array.from(setWithoutRepeatedFood)

        let infoFoods: (Pick<TFoods, 'id' | 'name' | 'image'> & {
          restaurant: Pick<TRestaurant, 'name'>
        })[] = []
        for (const foodId of arrayFoods) {
          const { data } = await supabase
            .from('foods')
            .select(
              `
                *, 
                restaurant: restaurants ( * )
              `
            )
            .eq('stripe_food_id', foodId)
            .single()
          if (data) {
            infoFoods = [...infoFoods, data]
          }
        }
        setFoodsAvailableForRating(infoFoods)
      }

      setLoadingData(false)
    }

    fetchPayments()
  }, [user.id])

  return (
    <div className="bg-light-gray-100 h-screen overflow-auto scrollbar-gutter-stable">
      <Head>
        <title>Avalia????es | GoRestaurant</title>
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

          {!loadingData ? (
            foodsAvailableForRating && !foodsAvailableForRating.length ? (
              <div className="flex h-[calc(100vh-4.5rem)] w-full items-center justify-center">
                <span className="text-xl font-medium">
                  Voc?? n??o pediu comida para ser capaz de avaliar
                </span>
              </div>
            ) : (
              <div
                className={clsx(
                  '2xl:grid-cols-4',
                  'xl:grid-cols-[1fr_1fr_1fr]',
                  'lg:gap-8',
                  'md:grid-cols-2',
                  'sm:grid-cols-1 sm:gap-6',
                  'h-full w-full grid grid-cols-1 gap-4 py-4'
                )}
              >
                {foodsAvailableForRating &&
                  foodsAvailableForRating.map(food => (
                    <RatingCard key={food.id} food={food} />
                  ))}
              </div>
            )
          ) : (
            <div
              className={clsx(
                '2xl:grid-cols-4',
                'xl:grid-cols-[1fr_1fr_1fr]',
                'lg:gap-8',
                'md:grid-cols-2',
                'sm:grid-cols-1 sm:gap-6',
                'h-full w-full grid grid-cols-1 gap-4 py-4'
              )}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="rounded w-full h-56" />
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
      domain: `${process.env.NEXT_PUBLIC_DOMAIN_APP}`,
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
