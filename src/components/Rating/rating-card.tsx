import { useMemo, useState } from 'react'
import NextImage from 'next/image'
import { shimmerBase64 } from '../../utils/blurDataURL'
import { createClient } from '@/src/lib/supabase/client'
import { css } from '@/styled-system/css'
import { logger } from '@/src/lib/logger'

const log = logger.child({ module: 'client', component: 'RatingCard' })

type StarColorTokens = { fill: string; stroke: string }
const starColorTokens = (value?: number): StarColorTokens => {
  if (value === undefined)
    return { fill: 'light-gray-500', stroke: 'light-gray-500' }
  if (value === 1) return { fill: 'light-red-700', stroke: 'light-red-700' }
  if (value === 2) return { fill: 'light-red-500', stroke: 'light-red-500' }
  if (value === 3)
    return { fill: 'light-orange-500', stroke: 'light-orange-500' }
  if (value === 4) return { fill: 'light-green-500', stroke: 'light-green-500' }
  return { fill: 'light-green-700', stroke: 'light-green-700' }
}

type RatingCardProps = {
  product: {
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
  }
  profileId: string
}
export function RatingCard({ product, profileId }: RatingCardProps) {
  const supabase = useMemo(() => createClient(), [])

  const existingRating = product.product_ratings[0]
  const [stars, setStars] = useState<number | undefined>(
    existingRating?.stars ?? undefined
  )
  const [saveStatus, setSaveStatus] = useState<{
    saved: boolean
    loading: boolean
  }>({ saved: false, loading: false })

  const [currentRatingId, setCurrentRatingId] = useState<string | undefined>(
    product.product_ratings[0]?.id
  )

  const handleStarClick = async (value: number) => {
    const clickLog = log.child({
      handler: 'onStarClick',
      productId: product.product.id,
      storeId: product.store.id,
      stars: value
    })

    setStars(value)
    setSaveStatus({ saved: false, loading: false })

    const { data, error } = await supabase
      .from('product_ratings')
      .upsert({
        id: currentRatingId,
        order_product_id: product.id,
        product_id: product.product.id,
        store_id: product.store.id,
        profile_id: profileId,
        stars: value,
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (error) {
      clickLog.error({ error }, 'Error saving rating')
      setSaveStatus({ saved: false, loading: false })
      return
    }

    if (data) {
      setCurrentRatingId(data.id)
    }
    setSaveStatus({ saved: true, loading: false })
  }

  const getStarColors = (i: number): StarColorTokens => {
    if (stars) {
      return stars >= i + 1 ? starColorTokens(stars) : starColorTokens()
    }
    return starColorTokens()
  }

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        w: 'full',
        h: '56',
        rounded: 'sm',
        overflow: 'hidden',
        shadow: 'md'
      })}
    >
      <div
        className={css({
          position: 'relative',
          w: 'full',
          h: '24',
          overflow: 'hidden'
        })}
      >
        <NextImage
          src={product.product.image_url ?? ''}
          alt={product.product.name}
          fill
          className={css({ objectFit: 'cover' })}
          placeholder="blur"
          blurDataURL={shimmerBase64}
          sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
        />
      </div>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          py: '4',
          px: '2',
          alignItems: 'center',
          justifyContent: 'space-between'
        })}
      >
        <div className={css({ display: 'flex', flexDirection: 'column' })}>
          <p className={css({ textAlign: 'center', fontSize: 'sm' })}>
            {product.store.name}
          </p>
          <span className={css({ textAlign: 'center' })}>
            {product.product.name}
          </span>
        </div>

        <div
          className={css({
            display: 'flex',
            w: 'full',
            mt: '4',
            justifyContent: 'center'
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexDir: 'column',
              gap: '2',
              whiteSpace: 'nowrap',
              alignItems: 'center'
            })}
          >
            <div className={css({ display: 'flex' })}>
              {Array.from({ length: 5 }).map((_, i) => {
                const { fill, stroke } = getStarColors(i)
                const isAnimated = stars && stars >= i + 1 && saveStatus.saved

                return (
                  <button
                    key={`${i}-star`}
                    disabled={saveStatus.loading}
                    onClick={() => handleStarClick(i + 1)}
                    className={css({
                      bg: 'light.gray.200',
                      cursor: saveStatus.loading ? 'wait' : 'pointer',
                      '&:first-child': { borderRadius: 'left' },
                      '&:last-child': { borderRadius: 'right' }
                    })}
                  >
                    <div
                      className={css({
                        p: '2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      })}
                    >
                      <div className={css({ w: '6', h: '6' })}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          preserveAspectRatio="xMaxYMid meet"
                          viewBox="0 0 256 256"
                          className={css({
                            animation: isAnimated ? 'heartbeat' : 'none'
                          })}
                        >
                          <rect width="256" height="256" fill="none" />
                          <path
                            d="M132.4,190.7l50.4,32c6.5,4.1,14.5-2,12.6-9.5l-14.6-57.4a8.7,8.7,0,0,1,2.9-8.8l45.2-37.7c5.9-4.9,2.9-14.8-4.8-15.3l-59-3.8a8.3,8.3,0,0,1-7.3-5.4l-22-55.4a8.3,8.3,0,0,0-15.6,0l-22,55.4a8.3,8.3,0,0,1-7.3,5.4L31.9,94c-7.7.5-10.7,10.4-4.8,15.3L72.3,147a8.7,8.7,0,0,1,2.9,8.8L61.7,209c-2.3,9,7.3,16.3,15,11.4l46.9-29.7A8.2,8.2,0,0,1,132.4,190.7Z"
                            opacity="0.5"
                            style={{ fill: `var(--colors-${fill})` }}
                          />
                          <path
                            d="M132.4,190.7l50.4,32c6.5,4.1,14.5-2,12.6-9.5l-14.6-57.4a8.7,8.7,0,0,1,2.9-8.8l45.2-37.7c5.9-4.9,2.9-14.8-4.8-15.3l-59-3.8a8.3,8.3,0,0,1-7.3-5.4l-22-55.4a8.3,8.3,0,0,0-15.6,0l-22,55.4a8.3,8.3,0,0,1-7.3,5.4L31.9,94c-7.7.5-10.7,10.4-4.8,15.3L72.3,147a8.7,8.7,0,0,1,2.9,8.8L61.7,209c-2.3,9,7.3,16.3,15,11.4l46.9-29.7A8.2,8.2,0,0,1,132.4,190.7Z"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="16"
                            style={{ stroke: `var(--colors-${stroke})` }}
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
