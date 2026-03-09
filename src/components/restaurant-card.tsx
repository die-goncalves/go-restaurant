'use client'

import NextImage from 'next/image'
import NextLink from 'next/link'
import { Bag, Car, Star } from 'phosphor-react'
import { shimmerBase64 } from '../utils/blurDataURL'
import { TFoodRating, TFoods, TRestaurant, TTag } from '../types'
import { useFilter } from '../contexts/filter-context'
import { useMemo } from 'react'
import { css } from '@/styled-system/css'

type RestaurantCardProps = {
  restaurant: Pick<TRestaurant, 'id' | 'image' | 'name'> & {
    foods: Array<
      TFoods & {
        food_rating: Array<TFoodRating>
      } & {
        tag: TTag
      }
    >
    rating?: number
    reviews: number
    delivery_time?: number
    delivery_price?: number
  }
}

const deliveryTime = (seconds: number | undefined) => {
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

const ratingColor = (rating?: number) => {
  if (!rating) return 'var(--colors-light-gray-500)'
  if (rating < 1) return 'var(--colors-light-red-700)'
  if (rating < 2) return 'var(--colors-light-red-500)'
  if (rating < 3) return 'var(--colors-light-orange-500)'
  if (rating < 4) return 'var(--colors-light-green-500)'
  return 'var(--colors-light-green-700)'
}

const ratingLabel = (rating?: number) => {
  if (!rating) return 'Não avaliado'
  if (rating < 1) return 'Péssimo'
  if (rating < 2) return 'Ruim'
  if (rating < 3) return 'Regular'
  if (rating < 4) return 'Bom'
  return 'Excelente'
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { state } = useFilter()

  const tags = useMemo(() => {
    const removeDuplicateTags = restaurant.foods.reduce(
      (acc, currentValue) => {
        if (acc[currentValue.tag.id]) {
          return acc
        } else {
          return { ...acc, ...{ [currentValue.tag.id]: currentValue.tag } }
        }
      },
      {} as { [key: string]: TTag }
    )
    return Object.values(removeDuplicateTags).sort(function (a, b) {
      if (a.name > b.name) return 1
      if (a.name < b.name) return -1
      return 0
    })
  }, [restaurant.foods])

  const time = deliveryTime(restaurant.delivery_time)
  const price = restaurant.delivery_price
    ? restaurant.delivery_price.toFixed(2)
    : undefined

  return (
    <NextLink
      href={`/restaurant/${restaurant.id}?geohash=${state.currentPosition?.geohash}`}
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rounded: 'sm',
        overflow: 'hidden',
        shadow: 'md',
        transition: 'transform 150ms ease-in, box-shadow 150ms ease-in',
        outline: 'none',
        _focus: {
          outlineStyle: 'solid',
          outlineWidth: '2',
          outlineOffset: '2',
          outlineColor: 'light.indigo.300'
        },
        _hover: { transform: 'translateY(-0.5rem)', shadow: 'xl' }
      })}
    >
      <div
        className={css({
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          w: 'full',
          h: '40',
          _after: {
            content: '""',
            position: 'absolute',
            w: 'full',
            h: 'full',
            inset: '0',
            rotate: '5deg',
            translate: '0.5rem -100%',
            bg: 'transparent',
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
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className={css({ objectFit: 'cover' })}
          placeholder="blur"
          blurDataURL={shimmerBase64}
          sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
        />
      </div>
      <div
        className={css({
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          w: 'full',
          rounded: 'sm',
          p: '2',
          bg: 'light.gray.100',
          mt: '-4'
        })}
      >
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '2',
            alignItems: 'flex-start'
          })}
        >
          <h1 className={css({ fontWeight: 'bold', fontSize: 'lg' })}>
            {restaurant.name}
          </h1>
          {tags && (
            <div
              className={css({
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1',
                alignItems: 'center'
              })}
            >
              {tags.map((tag, index) => (
                <div
                  key={tag.id}
                  className={css({ display: 'flex', alignItems: 'center' })}
                >
                  <span
                    className={css({
                      w: 'max',
                      bg: 'light.gray.200',
                      fontSize: 'sm',
                      color: 'light.gray.800',
                      rounded: 'sm',
                      px: '1'
                    })}
                  >
                    {tag.name}
                  </span>
                  {index !== tags.length - 1 && (
                    <span
                      className={css({
                        w: '1',
                        h: '1',
                        bg: 'light.gray.200',
                        rounded: 'full',
                        mx: '0.5'
                      })}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div
            className={css({
              display: 'flex',
              gap: '1',
              alignItems: 'center',
              w: 'max'
            })}
          >
            <div
              className={css({
                display: 'flex',
                flex: '1',
                alignItems: 'center',
                justifyContent: 'center'
              })}
            >
              <Star
                weight="duotone"
                style={{
                  color: ratingColor(restaurant.rating)
                }}
                className={css({
                  w: '6',
                  h: '6',
                  '& path': { opacity: '0.5' }
                })}
              />
            </div>

            <div className={css({ display: 'flex', gap: '1' })}>
              <p>
                {restaurant.rating && <span>{restaurant.rating} </span>}
                <span className={css({ fontWeight: 'medium' })}>
                  {ratingLabel(restaurant.rating)}
                </span>
              </p>
              <p className={css({ color: 'light.gray.500' })}>
                {restaurant.reviews > 999
                  ? '( 999+ )'
                  : `( ${restaurant.reviews} )`}
              </p>
            </div>
          </div>

          <div className={css({ display: 'flex', gap: '1', w: 'max' })}>
            {restaurant.delivery_price ? (
              <Car
                className={css({ w: '6', h: '6', color: 'light.gray.800' })}
                weight="thin"
              />
            ) : (
              <Bag
                className={css({ w: '6', h: '6', color: 'light.gray.800' })}
                weight="thin"
              />
            )}

            <div className={css({ display: 'flex', alignItems: 'center' })}>
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

              {price && (
                <div className={css({ display: 'flex', alignItems: 'center' })}>
                  <span
                    className={css({
                      w: '1',
                      h: '1',
                      bg: 'light.gray.200',
                      rounded: 'full',
                      mx: '1.5'
                    })}
                  />
                  <span>R$ {price}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </NextLink>
  )
}
