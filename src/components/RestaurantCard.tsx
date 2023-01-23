import clsx from 'clsx'
import NextImage from 'next/image'
import NextLink from 'next/link'
import { Bag, Car, Star } from 'phosphor-react'
import { TFoodRating, TFoods, TRestaurant, TTag } from '../types'
import { useFilter } from '../contexts/FilterContext'
import { useMemo } from 'react'

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

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { state } = useFilter()

  const tags = useMemo(() => {
    const removeDuplicateTags = restaurant.foods.reduce((acc, currentValue) => {
      if (acc[currentValue.tag.id]) {
        return acc
      } else {
        return { ...acc, ...{ [currentValue.tag.id]: currentValue.tag } }
      }
    }, {} as { [key: string]: TTag })
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
      className={clsx(
        'flex flex-col items-center rounded overflow-hidden shadow-md group',
        'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
        'transition-[transform, box-shadow] ease-in duration-150',
        'hover:-translate-y-2 hover:shadow-xl'
      )}
    >
      <div
        className={clsx(
          'relative overflow-hidden flex w-full h-40',
          "after:absolute after:content-[''] after:w-full after:h-full after:inset-0 after:rotate-[5deg] after:translate-x-2 after:-translate-y-full after:bg-transparent",
          'after:transition-all after:duration-150 after:ease-in',
          'group-hover:after:scale-125 group-hover:after:backdrop-brightness-150'
        )}
      >
        <NextImage
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="relative flex flex-col w-full rounded p-2 bg-light-gray-100 -mt-4">
        <div className="flex flex-col gap-2 items-start">
          <h1 className="font-bold text-lg">{restaurant.name}</h1>
          {tags && (
            <div className="flex flex-wrap gap-1 items-center">
              {tags.map((tag, index) => (
                <div key={tag.id} className="flex items-center">
                  <span className="w-max bg-light-gray-200 text-sm text-light-gray-800 rounded px-1">
                    {tag.name}
                  </span>
                  {index !== tags.length - 1 && (
                    <span className="w-1 h-1 bg-light-gray-200 rounded-full mx-0.5" />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-1 items-center w-max">
            <div className="flex flex-1 items-center justify-center">
              <Star
                weight="duotone"
                className={clsx(
                  'w-6 h-6 [&>path]:opacity-50',
                  restaurant.rating
                    ? restaurant.rating < 1
                      ? 'text-light-red-700'
                      : restaurant.rating < 2
                      ? 'text-light-red-500'
                      : restaurant.rating < 3
                      ? 'text-light-orange-500'
                      : restaurant.rating < 4
                      ? 'text-light-green-500'
                      : 'text-light-green-700'
                    : 'text-light-gray-500'
                )}
              />
            </div>

            <div className="flex gap-1">
              <p>
                <span>{restaurant.rating && `${restaurant.rating} `}</span>
                <span className="font-medium">
                  {restaurant.rating
                    ? restaurant.rating < 1
                      ? 'Péssimo'
                      : restaurant.rating < 2
                      ? 'Ruim'
                      : restaurant.rating < 3
                      ? 'Regular'
                      : restaurant.rating < 4
                      ? 'Bom'
                      : 'Excelente'
                    : 'Não avaliado'}
                </span>
              </p>
              <p className="text-light-gray-500">
                {restaurant.reviews > 999
                  ? '( 999+ )'
                  : `( ${restaurant.reviews} )`}
              </p>
            </div>
          </div>

          <div className="flex gap-1 w-max">
            {restaurant.delivery_price ? (
              <Car className="w-6 h-6 text-light-gray-800" weight="thin" />
            ) : (
              <Bag className="w-6 h-6 text-light-gray-800" weight="thin" />
            )}

            <div className="flex items-center">
              {time &&
                (time.hour === null ? (
                  time.minutes === null ? (
                    <span className="font-medium"> -- h -- min</span>
                  ) : (
                    <span className="font-medium">{time.minutes} min</span>
                  )
                ) : time.minutes === null ? (
                  <span className="font-medium">{time.hour} h</span>
                ) : (
                  <span className="font-medium">
                    {time.hour} h {time.minutes} min
                  </span>
                ))}

              {price && (
                <div className="flex items-center">
                  <span className="w-1 h-1 bg-light-gray-200 rounded-full mx-1.5" />
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
