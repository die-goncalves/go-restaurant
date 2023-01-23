import clsx from 'clsx'
import { useEffect, useState } from 'react'
import NextImage from 'next/image'
import { shimmerBase64 } from '../../utils/blurDataURL'
import { TFoods, TRestaurant } from '../../types'
import { supabase } from '../../services/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'

type FoodRatingCardProps = {
  food: Pick<TFoods, 'id' | 'name' | 'image'> & {
    restaurant: Pick<TRestaurant, 'name'>
  }
}

export function RatingCard({ food }: FoodRatingCardProps) {
  const { session } = useAuth()
  const [clickValue, setClickValue] = useState<number>()
  const [saveStatus, setSaveStatus] = useState<{
    saved: boolean
    loading: boolean
  }>({ saved: false, loading: false })
  const [foodRated, setFoodRated] = useState<{
    created_at: string
    customer_id: string
    food_id: string
    rating: number
    updated_at: string
  } | null>(null)

  useEffect(() => {
    async function updateRating(rating: number) {
      setSaveStatus(ss => ({ ...ss, saved: false, loading: true }))
      const { data, error } = await supabase
        .from('food_rating')
        .update({
          rating,
          updated_at: new Date().toISOString().toLocaleString()
        })
        .match({ food_id: food.id, customer_id: session?.user.id })
      if (error) console.error({ error })

      setSaveStatus(ss => ({ ...ss, saved: true, loading: false }))
    }
    async function createRating(rating: number) {
      setSaveStatus(ss => ({ ...ss, saved: false, loading: true }))
      const { error } = await supabase.from('food_rating').insert([
        {
          food_id: food.id,
          customer_id: session?.user.id,
          rating
        }
      ])
      if (error) console.error({ error })

      setSaveStatus(ss => ({ ...ss, saved: true, loading: false }))
    }

    async function awaitingRating(rating: number) {
      if (foodRated) {
        updateRating(rating)
      } else {
        createRating(rating)
      }
    }

    if (!!clickValue) awaitingRating(clickValue)
  }, [clickValue, food.id, foodRated, session?.user.id])

  useEffect(() => {
    async function foodAlreadyRated() {
      const { data, error } = await supabase
        .from('food_rating')
        .select('*')
        .match({ food_id: food.id, customer_id: session?.user.id })

      if (error) {
        console.error({ error })
      }
      if (data?.length) {
        setFoodRated(data[0])
      }
    }

    foodAlreadyRated()
  }, [food.id, session?.user.id])

  const starColor = (value?: number) => {
    if (value === undefined) {
      return 'fill-light-gray-500 [&_path:last-child]:stroke-light-gray-500'
    }

    return value === 1
      ? 'fill-light-red-700 [&_path:last-child]:stroke-light-red-700'
      : value === 2
      ? 'fill-light-red-500 [&_path:last-child]:stroke-light-red-500'
      : value === 3
      ? 'fill-light-orange-500 [&_path:last-child]:stroke-light-orange-500'
      : value === 4
      ? 'fill-light-green-500 [&_path:last-child]:stroke-light-green-500'
      : 'fill-light-green-700 [&_path:last-child]:stroke-light-green-700'
  }

  return (
    <div className="flex flex-col w-full h-56 rounded overflow-hidden shadow-md group">
      <div className="relative w-full h-24 overflow-hidden">
        <NextImage
          src={food.image}
          alt={food.name}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={shimmerBase64}
          sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
        />
      </div>
      <div className="flex flex-col flex-1 py-4 px-2 items-center justify-between ">
        <div className="flex flex-col">
          <p className="text-center text-sm">{food.restaurant.name}</p>
          <span className="text-center">{food.name}</span>
        </div>

        <div className="flex w-full mt-4 justify-center">
          <div className="flex gap-2 whitespace-nowrap items-center">
            <div className="flex">
              {Array(5)
                .fill('')
                .map((_, i) => {
                  return (
                    <button
                      key={`${i}-star`}
                      className={clsx(
                        'bg-light-gray-200 first:rounded-l last:rounded-r',
                        saveStatus.loading ? 'cursor-wait' : 'cursor-pointer'
                      )}
                      disabled={saveStatus.loading}
                      onClick={() => setClickValue(i + 1)}
                    >
                      <div className="p-2 flex items-center justify-center">
                        <div className="w-6 h-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMaxYMid meet"
                            viewBox="0 0 256 256"
                            className={clsx(
                              'group',
                              clickValue
                                ? clickValue >= i + 1
                                  ? saveStatus.saved
                                    ? `${starColor(
                                        clickValue
                                      )} animate-heartbeat`
                                    : starColor(clickValue)
                                  : starColor()
                                : foodRated
                                ? foodRated.rating >= i + 1
                                  ? starColor(foodRated.rating)
                                  : starColor()
                                : starColor()
                            )}
                          >
                            <rect width="256" height="256" fill="none"></rect>
                            <path
                              d="M132.4,190.7l50.4,32c6.5,4.1,14.5-2,12.6-9.5l-14.6-57.4a8.7,8.7,0,0,1,2.9-8.8l45.2-37.7c5.9-4.9,2.9-14.8-4.8-15.3l-59-3.8a8.3,8.3,0,0,1-7.3-5.4l-22-55.4a8.3,8.3,0,0,0-15.6,0l-22,55.4a8.3,8.3,0,0,1-7.3,5.4L31.9,94c-7.7.5-10.7,10.4-4.8,15.3L72.3,147a8.7,8.7,0,0,1,2.9,8.8L61.7,209c-2.3,9,7.3,16.3,15,11.4l46.9-29.7A8.2,8.2,0,0,1,132.4,190.7Z"
                              opacity="0.5"
                            ></path>
                            <path
                              d="M132.4,190.7l50.4,32c6.5,4.1,14.5-2,12.6-9.5l-14.6-57.4a8.7,8.7,0,0,1,2.9-8.8l45.2-37.7c5.9-4.9,2.9-14.8-4.8-15.3l-59-3.8a8.3,8.3,0,0,1-7.3-5.4l-22-55.4a8.3,8.3,0,0,0-15.6,0l-22,55.4a8.3,8.3,0,0,1-7.3,5.4L31.9,94c-7.7.5-10.7,10.4-4.8,15.3L72.3,147a8.7,8.7,0,0,1,2.9,8.8L61.7,209c-2.3,9,7.3,16.3,15,11.4l46.9-29.7A8.2,8.2,0,0,1,132.4,190.7Z"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="16"
                            ></path>
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
