'use client'

import NextImage from 'next/image'
import NextLink from 'next/link'
import { shimmerBase64 } from '@/src//utils/blur-data-url'
import { DirectionsCarIcon } from '@/src/components/icons/directions-car'
import { DirectionsRunIcon } from '@/src/components/icons/directions-run'
import { StarIcon } from '@/src/components/icons/star'
import { usePosition } from '@/src/contexts/position-context'
import { Tables } from '@/src/types/supabase'
import { formatNumber } from '@/src/utils/format-number'
import { getStarColor } from '@/src/utils/get-star-color'
import { css } from '@/styled-system/css'

type StoreCardProps = {
  store: Omit<
    Tables<'stores_ratings_summary'>,
    'neighborhood' | 'description' | 'created_at'
  > & {
    rating: number | null
    reviews: number | null
    delivery_time?: number
    delivery_price?: number
  }
}

const formatTime = (seconds: number | undefined) => {
  if (seconds === undefined) return { minutes: null, hour: null }
  const second_minutes = Math.round(seconds / 60)
  const hour_minutes = second_minutes / 60

  if (hour_minutes < 1) {
    if (second_minutes < 1) return { minutes: '1', hour: null }
    return { minutes: second_minutes.toString(), hour: null }
  } else if (hour_minutes > 24) {
    return { minutes: null, hour: Math.round(hour_minutes).toString() }
  } else {
    const hour_dot_minutes = hour_minutes.toFixed(2).split('.')
    const minutes = Math.round(
      (Number(hour_dot_minutes[1]) * 60) / 100
    ).toString()
    return { minutes: minutes, hour: Number(hour_dot_minutes[0]).toString() }
  }
}

const formatReview = (review: number | null): string => {
  if (!review || review <= 0 || isNaN(review)) return '(Sem avaliações)'
  if (review === 1) return '(Uma avaliação)'

  const magnitude = Math.pow(10, Math.floor(Math.log10(review)))
  const rounded = Math.floor(review / magnitude) * magnitude
  return `(${rounded}+ avaliações)`
}

export function StoreCard({ store }: StoreCardProps) {
  const {
    average_rating: averageRating,
    categories,
    id,
    image_url: imageURL,
    name,
    total_reviews: totalReviews,
    delivery_price: deliveryPrice,
    delivery_time: deliveryTime
  } = store
  const position = usePosition()

  const time = formatTime(deliveryTime)
  const price =
    deliveryPrice !== undefined ? deliveryPrice.toFixed(2) : undefined

  return (
    <NextLink
      href={`/store/${id}?geohash=${position.state.currentPosition?.geohash}`}
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
        gridTemplateRows: 'minmax(0, 1fr) min-content',
        background: 'surface.container',
        overflow: 'hidden',
        transition: 'transform 150ms ease-in',
        padding: '1',
        outlineStyle: 'none',
        outlineWidth: '2px',
        outlineOffset: '2px',
        outlineColor: 'transparent',
        _focusVisible: {
          outlineStyle: 'solid',
          outlineColor: 'outline'
        },
        _hover: { transform: 'translateY(-0.5rem)' }
      })}
    >
      <div
        className={css({
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          width: 'full',
          height: '40',
          _after: {
            content: '""',
            position: 'absolute',
            width: 'full',
            height: 'full',
            inset: '0',
            rotate: '5deg',
            translate: '0.5rem -100%',
            background: 'transparent',
            transition: 'all 150ms ease-in'
          },
          _groupHover: {
            '&::after': {
              transform: 'scale(1.25)',
              backdropFilter: 'brightness(1.5)'
            }
          }
        })}
      >
        <NextImage
          src={imageURL!}
          alt={name!}
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
          padding: '1',
          gap: '2',
          alignItems: 'flex-start'
        })}
      >
        <h2 className={css({ fontSize: 'lg' })}>{name}</h2>

        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2'
          })}
        >
          {categories?.map(c => (
            <div key={c}>
              <p
                className={css({
                  background: 'tertiary.container',
                  color: 'tertiary.container.on',
                  textStyle: 'sm',
                  paddingInline: '2'
                })}
              >
                {c}
              </p>
            </div>
          ))}
        </div>

        <div
          className={css({
            display: 'inline-flex',
            gap: '0.25em'
          })}
        >
          <span
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0
            })}
          >
            <StarIcon
              style={{ fill: getStarColor(averageRating) }}
              className={css({
                width: '5',
                height: '5'
              })}
            />
          </span>
          {totalReviews && totalReviews > 0 && <span>{averageRating}</span>}
          <span>{formatReview(totalReviews)}</span>
        </div>

        <div className={css({ display: 'flex', gap: '1', width: '100%' })}>
          {deliveryPrice !== undefined ? (
            <DirectionsCarIcon
              className={css({ w: '6', h: '6', color: 'light.gray.800' })}
            />
          ) : (
            <DirectionsRunIcon
              className={css({ w: '6', h: '6', color: 'light.gray.800' })}
            />
          )}

          <div
            className={css({
              display: 'flex',
              alignItems: 'center'
            })}
          >
            {time && (
              <span className={css({ fontWeight: 'medium' })}>
                {time.hour === null
                  ? time.minutes === null
                    ? '-- h -- min'
                    : `${time.minutes} min`
                  : time.minutes === null
                    ? `${time.hour} h`
                    : `${time.hour} h ${time.minutes} min`}
              </span>
            )}

            {price !== undefined && (
              <div className={css({ display: 'flex', alignItems: 'center' })}>
                <span
                  className={css({
                    width: '1',
                    height: '1',
                    marginInline: '1.5',
                    background: 'tertiary'
                  })}
                />
                <span>
                  {formatNumber({
                    options: { currency: 'BRL' },
                    numberToBeFormatted: Number(price)
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </NextLink>
  )
}
