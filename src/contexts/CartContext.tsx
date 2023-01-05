import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react'
import { parseCookies, setCookie } from 'nookies'
import toast from 'react-hot-toast'
import { TRestaurant, TFoods, TFoodRating } from '../types'
import { supabase } from '../services/supabaseClient'

type Food = Omit<TFoods, 'restaurant_id' | 'created_at' | 'updated_at'> & {
  amount: number
  restaurant: Pick<TRestaurant, 'id' | 'name' | 'image'>
  food_rating: Array<Pick<TFoodRating, 'customer_id' | 'rating'>>
}

type CartProviderProps = {
  children: ReactNode
}

type CartContextData = {
  cart: Food[]
  addFood: (foodId: string) => Promise<void>
  removeFood: (foodId: string) => void
  thereIsASpecificFoodInTheCart: (foodId: string) => boolean
  numberOfSpecificFoodInTheCart: (foodId: string) => number
  priceOfSpecificFoodAccumulatedInTheCart: (foodId: string) => number
  qtyItemsInTheCart: () => number
  separateFoodByRestaurant: () => {
    [key: string]: Food[]
  }
  totalPrice: () => number
}

const CartContext = createContext({} as CartContextData)

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Food[]>(() => {
    const storageCart = parseCookies()
    if (storageCart['@gorestaurant-v0.1.0:cart'])
      return JSON.parse(storageCart['@gorestaurant-v0.1.0:cart'])
    return []
  })

  const addFood = useCallback(
    async (foodId: string) => {
      try {
        const specificFood = cart.find(
          specificFood => specificFood.id === foodId
        )

        if (specificFood) {
          const addFoodInCart = cart.map((food: Food) => {
            if (food.id === foodId) {
              food.amount += 1
            }
            return food
          })
          setCart(addFoodInCart)
          setCookie(
            null,
            '@gorestaurant-v0.1.0:cart',
            JSON.stringify(addFoodInCart),
            {
              maxAge: 60 * 60 * 24 * 365,
              path: '/'
            }
          )
        } else {
          const { data, error } = await supabase
            .from('foods')
            .select(
              `
              *,
              food_rating ( * ),
              restaurant: restaurants ( id, name, image )
            `
            )
            .eq('id', foodId)

          if (data) {
            const foodWithAmount = { ...data[0], amount: 1 }
            const addFoodInCart = [...cart, foodWithAmount]
            setCart(addFoodInCart)
            setCookie(
              null,
              '@gorestaurant-v0.1.0:cart',
              JSON.stringify(addFoodInCart),
              {
                maxAge: 60 * 60 * 24 * 365,
                path: '/'
              }
            )
          }
        }
      } catch (error) {
        toast.error('Não conseguimos adicionar no carrinho.')
        console.error({ error })
      }
    },
    [cart]
  )

  const removeFood = useCallback(
    (foodId: string) => {
      try {
        const specificFood = cart.find(
          specificFood => specificFood.id === foodId
        )
        if (specificFood) {
          if (specificFood.amount === 1) {
            const newStackFoods = cart.filter(
              (food: Food) => food.id !== foodId
            )
            setCart(newStackFoods)
            setCookie(
              null,
              '@gorestaurant-v0.1.0:cart',
              JSON.stringify(newStackFoods),
              {
                maxAge: 60 * 60 * 24 * 365,
                path: '/'
              }
            )
          } else {
            const removeFoodInCart = cart.map((food: Food) => {
              if (food.id === foodId) {
                food.amount -= 1
              }
              return food
            })
            setCart(removeFoodInCart)
            setCookie(
              null,
              '@gorestaurant-v0.1.0:cart',
              JSON.stringify(removeFoodInCart),
              {
                maxAge: 60 * 60 * 24 * 365,
                path: '/'
              }
            )
          }
        } else {
          toast.error('O carrinho não tem essa comida')
        }
      } catch (error) {
        toast.error('Não conseguimos remover do carrinho')
        console.error({ error })
      }
    },
    [cart]
  )

  const thereIsASpecificFoodInTheCart = useCallback(
    (foodId: string) => {
      const specificFood = cart.find(specificFood => specificFood.id === foodId)
      return specificFood ? true : false
    },
    [cart]
  )

  const numberOfSpecificFoodInTheCart = useCallback(
    (foodId: string) => {
      const specificFood = cart.find(specificFood => specificFood.id === foodId)
      return specificFood ? specificFood.amount : 0
    },
    [cart]
  )

  const priceOfSpecificFoodAccumulatedInTheCart = useCallback(
    (foodId: string) => {
      const specificFood = cart.find(specificFood => specificFood.id === foodId)
      return specificFood ? specificFood.amount * specificFood.price : 0
    },
    [cart]
  )

  const qtyItemsInTheCart = useCallback(() => {
    return cart.reduce((acc, currentItem) => {
      return (acc += currentItem.amount)
    }, 0)
  }, [cart])

  const separateFoodByRestaurant = useCallback(() => {
    return cart.reduce<{ [key: string]: Array<Food> }>(function (acc, obj) {
      let key = obj['restaurant'].name
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc
    }, {})
  }, [cart])

  const totalPrice = useCallback(() => {
    return cart.reduce(
      (acc, currentItem) => (acc += currentItem.amount * currentItem.price),
      0
    )
  }, [cart])

  return (
    <CartContext.Provider
      value={{
        cart,
        addFood,
        removeFood,
        thereIsASpecificFoodInTheCart,
        numberOfSpecificFoodInTheCart,
        priceOfSpecificFoodAccumulatedInTheCart,
        qtyItemsInTheCart,
        separateFoodByRestaurant,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextData {
  const context = useContext(CartContext)

  return context
}
