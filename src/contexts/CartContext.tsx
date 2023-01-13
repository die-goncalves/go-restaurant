import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer
} from 'react'
import { parseCookies, setCookie } from 'nookies'
import { TRestaurant, TFoods, TFoodRating } from '../types'

type Food = Omit<TFoods, 'created_at' | 'updated_at'> & {
  amount: number
  restaurant: Pick<TRestaurant, 'id' | 'name' | 'image'>
  food_rating: Array<Pick<TFoodRating, 'food_id' | 'customer_id' | 'rating'>>
}

enum Actions {
  'add',
  'remove'
}
type TActions = {
  type: keyof typeof Actions
  payload?: any
}
type TData = {
  cart: Food[]
}

function reducer(state: TData, action: TActions) {
  switch (action.type) {
    case 'add': {
      const specificFood = state.cart.find(f => f.id === action.payload.food.id)
      if (specificFood) {
        const newCart = state.cart.map(f => {
          if (f.id === action.payload.food.id) {
            return { ...f, amount: f.amount + 1 }
          }
          return f
        })
        return { ...state, cart: newCart }
      } else {
        const newFood: Food = {
          ...action.payload.food,
          restaurant: action.payload.restaurant,
          food_rating: action.payload.food_rating,
          amount: 1
        }
        return {
          ...state,
          cart: [...state.cart, newFood]
        }
      }
    }
    case 'remove': {
      const specificFood = state.cart.find(f => f.id === action.payload.food.id)
      if (specificFood) {
        if (specificFood.amount === 1) {
          const newCart = state.cart.filter(
            f => f.id !== action.payload.food.id
          )
          return { ...state, cart: newCart }
        } else {
          const newCart = state.cart.map(f => {
            if (f.id === action.payload.food.id) {
              return { ...f, amount: f.amount - 1 }
            }
            return f
          })
          return { ...state, cart: newCart }
        }
      } else {
        return state
      }
    }
    default:
      throw Error('Ação desconhecida: ' + action.type)
  }
}

type CartContextData = {
  state: TData
  addFood: ({
    restaurant,
    food
  }: {
    restaurant: Pick<TRestaurant, 'id' | 'name' | 'image'>
    food: Omit<TFoods, 'created_at' | 'updated_at'> & {
      food_rating: Array<Omit<TFoodRating, 'created_at' | 'updated_at'>>
    }
  }) => void
  removeFood: (foodId: Pick<TFoods, 'id'>) => void
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

type CartProviderProps = {
  children: ReactNode
}
export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(reducer, { cart: [] }, () => {
    const cart = parseCookies()['@gorestaurant-v0.1.0:cart']
      ? JSON.parse(parseCookies()['@gorestaurant-v0.1.0:cart'])
      : []
    return { cart }
  })

  useEffect(() => {
    setCookie(null, '@gorestaurant-v0.1.0:cart', JSON.stringify(state.cart), {
      maxAge: 60 * 60 * 24 * 365,
      path: '/'
    })
  }, [state.cart])

  const addFood = useCallback(
    ({
      restaurant,
      food
    }: {
      restaurant: Pick<TRestaurant, 'id' | 'name' | 'image'>
      food: Omit<TFoods, 'created_at' | 'updated_at'> & {
        food_rating: Array<Omit<TFoodRating, 'created_at' | 'updated_at'>>
      }
    }) => {
      const { food_rating, ...rest } = food
      dispatch({
        type: 'add',
        payload: {
          food: rest,
          restaurant,
          foodRating: food_rating
        }
      })
    },
    []
  )

  const removeFood = useCallback((foodId: Pick<TFoods, 'id'>) => {
    dispatch({
      type: 'remove',
      payload: {
        food: {
          id: foodId.id
        }
      }
    })
  }, [])

  const thereIsASpecificFoodInTheCart = useCallback(
    (foodId: string) => {
      const specificFood = state.cart.find(
        specificFood => specificFood.id === foodId
      )
      return specificFood ? true : false
    },
    [state.cart]
  )

  const numberOfSpecificFoodInTheCart = useCallback(
    (foodId: string) => {
      const specificFood = state.cart.find(
        specificFood => specificFood.id === foodId
      )
      return specificFood ? specificFood.amount : 0
    },
    [state.cart]
  )

  const priceOfSpecificFoodAccumulatedInTheCart = useCallback(
    (foodId: string) => {
      const specificFood = state.cart.find(
        specificFood => specificFood.id === foodId
      )
      return specificFood ? specificFood.amount * specificFood.price : 0
    },
    [state.cart]
  )

  const qtyItemsInTheCart = useCallback(() => {
    return state.cart.reduce((acc, currentItem) => {
      return (acc += currentItem.amount)
    }, 0)
  }, [state.cart])

  const separateFoodByRestaurant = useCallback(() => {
    return state.cart.reduce<{ [key: string]: Array<Food> }>(function (
      acc,
      obj
    ) {
      let key = obj['restaurant'].name
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc
    },
    {})
  }, [state.cart])

  const totalPrice = useCallback(() => {
    return state.cart.reduce(
      (acc, currentItem) => (acc += currentItem.amount * currentItem.price),
      0
    )
  }, [state.cart])

  return (
    <CartContext.Provider
      value={{
        state,
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
