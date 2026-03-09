import { useState } from 'react'
import NextImage from 'next/image'
import { Minus, Plus, ShoppingCartSimple, X } from 'phosphor-react'
import { shimmerBase64 } from '../utils/blurDataURL'
import { TFoodRating, TFoods, TRestaurant, TTag } from '../types'
import { useCart } from '../contexts/cart-context'
import { formatNumber } from '../utils/formatNumber'
import { Dialog } from './dialog'
import { css, cx } from '@/styled-system/css'

const cartButton = css.raw({
  display: 'flex',
  p: '2',
  rounded: 'sm',
  bg: 'light.gray.200',
  transition: 'background-color 150ms ease-in',
  outline: 'none',
  '&:not(:disabled):hover': { bg: 'light.gray.300' },
  _focus: {
    outlineStyle: 'solid',
    outlineWidth: '2',
    outlineOffset: '2',
    outlineColor: 'light.indigo.300'
  }
})

const ratingBgToken = (rating: number) => {
  if (rating < 1) return 'var(--colors-light-red-700)'
  if (rating < 2) return 'var(--colors-light-red-500)'
  if (rating < 3) return 'var(--colors-light-orange-500)'
  if (rating < 4) return 'var(--colors-light-green-500)'
  return 'var(--colors-light-green-700)'
}

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
    ? food.food_rating.reduce((acc, r) => acc + r.rating, 0) /
      food.food_rating.length
    : undefined

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button
          className={css({
            position: 'relative',
            display: 'flex',
            h: '32',
            boxSizing: 'border-box',
            rounded: 'sm',
            shadow: 'md',
            bg: 'light.gray.100',
            cursor: 'pointer',
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
          {hasFood && (
            <div
              className={css({
                position: 'absolute',
                top: '0',
                right: '0',
                rounded: 'full',
                p: '2',
                zIndex: '2',
                transform: 'translate(33%, -33%)',
                bg: 'light.gray.200'
              })}
            >
              <ShoppingCartSimple
                className={css({ w: '5', h: '5', color: 'light.gray.400' })}
                weight="fill"
              />
            </div>
          )}
          <div
            className={`group ${css({
              display: 'flex',
              flexShrink: '0',
              rounded: 'sm',
              position: 'relative',
              h: 'full',
              w: '2/5',
              bg: 'transparent',
              overflow: 'hidden'
            })}`}
          >
            {rating !== undefined && (
              <div
                style={{ background: ratingBgToken(rating) }}
                className={css({
                  display: 'flex',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  borderBottomRightRadius: 'sm',
                  color: 'light.gray.100',
                  zIndex: '2'
                })}
              >
                <span className={css({ fontSize: 'sm', px: '2' })}>
                  {rating.toFixed(2)}
                </span>
              </div>
            )}
            <div
              className={css({
                position: 'relative',
                w: 'full',
                h: 'full',
                _after: {
                  content: '""',
                  position: 'absolute',
                  w: 'full',
                  h: 'full',
                  inset: '0',
                  transition: 'all 150ms ease-in'
                },
                _groupHover: {
                  '&::after': {
                    transform: 'scale(1.25)',
                    backdropFilter: 'contrast(1.5)'
                  }
                }
              })}
            >
              <NextImage
                src={food.image}
                alt={food.name}
                fill
                className={css({ objectFit: 'cover' })}
                placeholder="blur"
                blurDataURL={shimmerBase64}
                sizes="(max-width: 768px) 70vw, (min-width: 769px) 30vw"
              />
            </div>
          </div>
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              position: 'absolute',
              top: '0',
              bottom: '0',
              zIndex: '1',
              bg: 'light.gray.100',
              right: '0',
              w: '4/6',
              rounded: 'sm',
              p: '2',
              justifyContent: 'space-between'
            })}
          >
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                w: 'full'
              })}
            >
              <strong
                className={css({
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: '2'
                })}
              >
                {food.name}
              </strong>
              <span
                className={css({
                  fontSize: 'sm',
                  pt: '2',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: '2'
                })}
              >
                {food.description}
              </span>
            </div>
            <span className={css({ fontWeight: 'medium' })}>
              R$ {food.price}
            </span>
          </div>
        </button>
      </Dialog.Trigger>

      <Dialog.Content
        className={cx(
          css({
            w: 'calc(100vw - 2rem)',
            sm: { w: '96' }
          })
        )}
        onCloseInteractOverlay={() => setOpen(false)}
      >
        <header
          className={css({
            display: 'flex',
            p: '4',
            alignItems: 'center',
            justifyContent: 'space-between'
          })}
        >
          <Dialog.Title asChild>
            <p className={css({ fontSize: 'xl', fontWeight: 'medium' })}>
              {food.name}
            </p>
          </Dialog.Title>

          <Dialog.Close>
            <button className={css(cartButton)}>
              <X className={css({ w: '6', h: '6' })} />
            </button>
          </Dialog.Close>
        </header>

        <main
          className={css({
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          })}
        >
          <div
            className={css({
              display: 'flex',
              w: 'full',
              h: '48',
              position: 'relative'
            })}
          >
            <NextImage
              src={food.image}
              alt={food.name}
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
              w: 'full',
              p: '4',
              textAlign: 'justify'
            })}
          >
            <span>{food.description}</span>
          </div>
        </main>

        <footer
          className={css({
            display: 'flex',
            p: '4',
            justifyContent: 'space-between'
          })}
        >
          <div className={css({ display: 'flex', gap: '4' })}>
            <button
              disabled={!hasFood}
              onClick={() => removeFood({ id: food.id })}
              className={css([
                cartButton,
                {
                  ...(!hasFood && { cursor: 'not-allowed', opacity: '0.25' })
                }
              ])}
            >
              <Minus
                className={css({ w: '6', h: '6', color: 'light.gray.800' })}
              />
            </button>
            <button
              onClick={() => addFood({ restaurant, food })}
              className={css(cartButton)}
            >
              <Plus
                className={css({ w: '6', h: '6', color: 'light.gray.800' })}
              />
            </button>
          </div>

          <div
            className={css({
              display: 'flex',
              px: '4',
              rounded: 'sm',
              alignItems: 'center',
              gap: '4',
              bg: 'light.gray.200'
            })}
          >
            <div
              className={css({
                display: 'flex',
                rounded: 'sm',
                px: '2',
                alignItems: 'center',
                justifyContent: 'center',
                bg: 'light.gray.300'
              })}
            >
              {qtyFood && <span>{qtyFood > 99 ? '+99' : qtyFood}</span>}
            </div>
            <div className={css({ display: 'flex' })}>
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
