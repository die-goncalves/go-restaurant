'use client'

import { css } from '@/styled-system/css'
import { SignedUser } from '@/src/components/signed-user'
import { RatingCard } from '@/src/components/rating/rating-card'
import { DashboardNavigation } from '@/src/components/dashboard-navigation'
import { Logo } from '@/src/components/logo'

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

type RatingClientProps = {
  products: {
    id: string
    quantity: number
    price_cents: number
    order: {
      id: string
      payment_status: 'paid' | 'unpaid' | 'no_payment_required' | null
      created_at: string | null
    }
    product: {
      id: string
      name: string
      image_url: string | null
    }
    store: {
      id: string
      name: string
      image_url: string | null
    }
    product_ratings: {
      id: string
      stars: number
      comment: string | null
      created_at: string
      updated_at: string | null
    }[]
  }[]
  profileId: string
}
export function RatingClient({ products, profileId }: RatingClientProps) {
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

          {products?.length === 0 ? (
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
              {products?.map(p => (
                <RatingCard key={p.id} product={p} profileId={profileId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
