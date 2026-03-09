import { Star } from 'phosphor-react'
import { TFoodRating, TFoods } from '../../types'
import { overallRatingRestaurant } from '../../utils/overallRatingRestaurant'
import { css } from '@/styled-system/css'

const starColorMap = (overallRating: number | undefined) => {
  if (!overallRating) return 'var(--colors-light-gray-500)'
  if (overallRating < 1) return 'var(--colors-light-red-700)'
  if (overallRating < 2) return 'var(--colors-light-red-500)'
  if (overallRating < 3) return 'var(--colors-light-orange-500)'
  if (overallRating < 4) return 'var(--colors-light-green-500)'
  return 'var(--colors-light-green-700)'
}

const formatRatingCount = (count: number) => {
  if (count > 999) return '( 999+ avaliações )'
  if (count === 1) return `( ${count} avaliação )`
  return `( ${count} avaliações )`
}

type RatingProps = {
  foods: Array<
    Omit<
      TFoods,
      | 'restaurant_id'
      | 'stripe_food_id'
      | 'stripe_price_id'
      | 'created_at'
      | 'updated_at'
    > & {
      food_rating: Array<
        Omit<TFoodRating, 'food_id' | 'created_at' | 'updated_at'>
      >
    }
  >
}
export function Rating({ foods }: RatingProps) {
  const rating = overallRatingRestaurant([...foods])
  const activeColor = starColorMap(rating.overallRating)

  return (
    <div className={css({ display: 'flex', alignItems: 'center', gap: '1' })}>
      <div className={css({ display: 'flex', gap: '0' })}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
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
                color:
                  rating.overallRating && rating.overallRating > i
                    ? activeColor
                    : 'var(--colors-light-gray-500)'
              }}
              className={css({
                w: '4',
                h: '4',
                '& path': { opacity: '0.5' }
              })}
            />
          </div>
        ))}
      </div>
      <div
        className={css({
          display: 'flex',
          gap: '1',
          bg: 'light.gray.200',
          px: '1',
          rounded: 'sm'
        })}
      >
        <p>{rating.overallRating}</p>
        <p>{formatRatingCount(rating.numberRatings)}</p>
      </div>
    </div>
  )
}
