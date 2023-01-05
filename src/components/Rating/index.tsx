import clsx from 'clsx'
import { Star } from 'phosphor-react'
import { TFoodRating, TFoods } from '../../types'
import { overallRatingRestaurant } from '../../utils/overallRatingRestaurant'

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
  const starColor = rating.overallRating
    ? rating.overallRating < 1
      ? 'text-light-red-700'
      : rating.overallRating < 2
      ? 'text-light-red-500'
      : rating.overallRating < 3
      ? 'text-light-orange-500'
      : rating.overallRating < 4
      ? 'text-light-green-500'
      : 'text-light-green-700'
    : 'text-light-gray-500'

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0">
        {Array(5)
          .fill('')
          .map((_, i) => {
            return (
              <div key={i}>
                <div className="flex flex-1 items-center justify-center">
                  <Star
                    weight="duotone"
                    className={clsx(
                      'w-4 h-4 [&>path]:opacity-50',
                      rating.overallRating && rating.overallRating > i
                        ? starColor
                        : 'text-light-gray-500'
                    )}
                  />
                </div>
              </div>
            )
          })}
      </div>
      <div className="flex gap-1 bg-light-gray-200 px-1 rounded">
        <p>{rating.overallRating}</p>
        <p>
          {rating.numberRatings > 999
            ? '( 999+ avaliações )'
            : rating.numberRatings === 1
            ? `( ${rating.numberRatings} avaliação )`
            : `( ${rating.numberRatings} avaliações )`}
        </p>
      </div>
    </div>
  )
}
