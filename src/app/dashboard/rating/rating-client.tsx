'use client'

import { useEffect, useState } from 'react'
import { TFoods, TRestaurant } from '@/src/types'
import { SignedUser } from '@/src/components/signed-user'
import { Skeleton } from '@/src/components/skeleton'
import { RatingCard } from '@/src/components/rating/rating-card'
import { DashboardNavigation } from '@/src/components/dashboard-navigation'
import { Logo } from '@/src/components/logo'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/src/lib/supabase/client'
import { css } from '@/styled-system/css'

const ratingGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  h: 'full',
  w: 'full',
  gap: '4',
  py: '4',
  sm: { gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '6' },
  md: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  lg: { gap: '8' },
  xl: { gridTemplateColumns: '1fr 1fr 1fr' },
  '2xl': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }
})

type ProfileProps = {
  user: User
}
export function RatingClient({ user }: ProfileProps) {
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

          {loadingData ? (
            <div className={ratingGrid}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={css({ rounded: 'sm', w: 'full', h: '56' })}
                />
              ))}
            </div>
          ) : foodsAvailableForRating && !foodsAvailableForRating.length ? (
            <div
              className={css({
                display: 'flex',
                h: 'calc(100vh - 4.5rem)',
                w: 'full',
                alignItems: 'center',
                justifyContent: 'center'
              })}
            >
              <span className={css({ fontSize: 'xl', fontWeight: 'medium' })}>
                Você não pediu comida para ser capaz de avaliar
              </span>
            </div>
          ) : (
            <div className={ratingGrid}>
              {foodsAvailableForRating?.map(food => (
                <RatingCard key={food.id} food={food} clientId={user.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
