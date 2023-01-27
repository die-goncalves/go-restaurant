import clsx from 'clsx'
import { useState } from 'react'
import NextImage from 'next/image'
import { Minus, Plus, ShoppingCartSimple, X } from 'phosphor-react'
import { shimmerBase64 } from '../utils/blurDataURL'
import { TFoodRating, TFoods, TRestaurant, TTag } from '../types'
import { useCart } from '../contexts/CartContext'
import { formatNumber } from '../utils/formatNumber'
import { Dialog } from './Dialog'

type FoodProps = {
  restaurant: Pick<TRestaurant, 'id' | 'name' | 'image'>
  food: Omit<TFoods, 'created_at' | 'updated_at'> & {
    food_rating: Array<Omit<TFoodRating, 'created_at' | 'updated_at'>>
  } & {
    tag: Omit<TTag, 'created_at' | 'updated_at'>
  }
}

export function FoodCard({ food, restaurant }: FoodProps) {
  const [open, setOpen] = useState(false)
  const {
    addFood,
    removeFood,
    thereIsASpecificFoodInTheCart,
    numberOfSpecificFoodInTheCart,
    priceOfSpecificFoodAccumulatedInTheCart
  } = useCart()

  const hasFood = thereIsASpecificFoodInTheCart(food.id)
  const qtyFood = numberOfSpecificFoodInTheCart(food.id)
  const priceFood = priceOfSpecificFoodAccumulatedInTheCart(food.id)
  const rating = food.food_rating.length
    ? food.food_rating.reduce((acc, currentValue) => {
        return acc + currentValue.rating
      }, 0) / food.food_rating.length
    : undefined
  const colorRating =
    rating &&
    (rating < 1
      ? 'bg-light-red-700'
      : rating < 2
      ? 'bg-light-red-500'
      : rating < 3
      ? 'bg-light-orange-500'
      : rating < 4
      ? 'bg-light-green-500'
      : 'bg-light-green-700')

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button
          className={clsx(
            'relative flex h-32 box-border rounded shadow-md group bg-light-gray-100',
            'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
            'transition-[transform, box-shadow] ease-in duration-150',
            'cursor-pointer hover:-translate-y-2 hover:shadow-xl'
          )}
        >
          {hasFood && (
            <div className="absolute top-0 right-0 rounded-full p-2 z-[2] translate-x-1/3 -translate-y-1/3 bg-light-gray-200">
              <ShoppingCartSimple
                className="w-5 h-5 text-light-gray-400"
                weight="fill"
              />
            </div>
          )}
          <div className="flex flex-none rounded relative h-full w-2/5 bg-transparent overflow-hidden">
            <div
              className={clsx(
                'flex absolute top-0 left-0 rounded-br text-light-gray-100 z-[2]',
                colorRating
              )}
            >
              <span className="text-sm px-2">{rating?.toFixed(2)}</span>
            </div>
            <div
              className={clsx(
                'relative w-full h-full',
                "after:absolute after:content-[''] after:w-full after:h-full after:inset-0",
                'after:transition-all after:duration-150 after:ease-in',
                'group-hover:after:scale-125 group-hover:after:backdrop-contrast-150'
              )}
            >
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
          </div>
          <div className="flex flex-col items-end absolute top-0 bottom-0 z-[1] bg-light-gray-100 right-0 w-4/6 rounded p-2  justify-between">
            <div className="flex flex-col w-full">
              <strong className="line-clamp-2">{food.name}</strong>
              <span className="text-sm pt-2 line-clamp-2">
                {food.description}
              </span>
            </div>
            <span className="font-medium">R$ {food.price}</span>
          </div>
        </button>
      </Dialog.Trigger>

      <Dialog.Content
        className={clsx('sm:w-96', 'w-[calc(100vw-2rem)]')}
        onCloseInteractOverlay={() => setOpen(false)}
      >
        <header className="flex p-4 items-center justify-between">
          <p className="text-xl font-medium">{food.name}</p>
          <Dialog.Close>
            <button
              className={clsx(
                'p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                'transition-[background-color, outline] ease-in duration-150',
                'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              <X className="w-6 h-6" />
            </button>
          </Dialog.Close>
        </header>

        <main className="flex flex-col relative">
          <div className="flex w-full h-48 relative">
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
          <div className="flex w-full p-4 text-justify">
            <span>{food.description}</span>
          </div>
        </main>

        <footer className="flex p-4 justify-between">
          <div className="flex gap-4">
            <button
              className={clsx(
                'flex p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                'transition-[background-color, outline] ease-in duration-150',
                'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
                !hasFood && 'cursor-not-allowed opacity-25'
              )}
              disabled={!hasFood}
              onClick={() => removeFood({ id: food.id })}
            >
              <Minus className="w-6 h-6 text-light-gray-800" />
            </button>
            <button
              className={clsx(
                'flex p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                'transition-[background-color, outline] ease-in duration-150',
                'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
              onClick={() => addFood({ restaurant, food })}
            >
              <Plus className="w-6 h-6 text-light-gray-800" />
            </button>
          </div>
          <div className="flex px-4 rounded items-center gap-4 bg-light-gray-200">
            <div className="flex rounded px-2 items-center justify-center bg-light-gray-300">
              {qtyFood && <span>{qtyFood > 99 ? '+99' : qtyFood}</span>}
            </div>
            <div className="flex">
              <span>
                {formatNumber({
                  options: { currency: 'BRL' },
                  numberToBeFormatted: priceFood
                })}
              </span>
            </div>
          </div>
        </footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
