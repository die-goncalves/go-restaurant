import { TFoodRating } from '../types'

export function overallRatingRestaurant(
  products: Array<{ food_rating: Array<Pick<TFoodRating, 'rating'>> }>,
  reviews = 0,
  sum = 0
): { overallRating: number | undefined; numberRatings: number } {
  if (products.length === 0 && reviews === 0)
    return {
      overallRating: undefined,
      numberRatings: reviews
    }
  if (products.length === 0) {
    return {
      overallRating: Number((sum / reviews).toFixed(2)),
      numberRatings: reviews
    }
  }
  let numberOfRatings = reviews
  let sumOfRatings = sum

  for (const food_rating of products[0].food_rating) {
    numberOfRatings = numberOfRatings + 1
    sumOfRatings = sumOfRatings + food_rating.rating
  }
  products.shift()
  return overallRatingRestaurant(products, numberOfRatings, sumOfRatings)
}
