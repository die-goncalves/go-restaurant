'use client'

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
type Cart = {
  productId: string
  productName: string
  productImageURL: string
  storeId: string
  storeName: string
  storeImageURL: string
  priceCents: number
  amount: number
}[]
type TData = {
  cart: Cart
}

function reducer(state: TData, action: TActions) {
  switch (action.type) {
    case 'add': {
      const index = state.cart.findIndex(
        item =>
          item.productId === action.payload.product.id &&
          item.storeId === action.payload.store.id
      )
      if (index !== -1) {
        const newCart = [...state.cart]
        newCart[index] = {
          ...newCart[index],
          amount: newCart[index].amount + 1
        }
        return {
          ...state,
          cart: newCart
        }
      } else {
        return {
          ...state,
          cart: [
            ...state.cart,
            {
              productId: action.payload.product.id,
              productName: action.payload.product.name,
              productImageURL: action.payload.product.imageURL,
              priceCents: action.payload.product.priceCents,
              storeId: action.payload.store.id,
              storeName: action.payload.store.name,
              storeImageURL: action.payload.store.imageURL,
              amount: 1
            }
          ]
        }
      }
    }
    case 'remove': {
      const index = state.cart.findIndex(
        item =>
          item.productId === action.payload.product.id &&
          item.storeId === action.payload.store.id
      )
      if (index === -1) return state

      const newCart = [...state.cart]
      const item = newCart[index]
      if (item.amount > 1) {
        newCart[index] = {
          ...item,
          amount: item.amount - 1
        }
      } else {
        newCart.splice(index, 1)
      }
      return {
        ...state,
        cart: newCart
      }
    }
    default:
      throw Error('Ação desconhecida: ' + action.type)
  }
}

type CartContextData = {
  state: TData
  addFood: ({
    store,
    product
  }: {
    store: { id: string; name: string; imageURL: string }
    product: {
      id: string
      name: string
      imageURL: string
      priceCents: number
      amount?: number
    }
  }) => void
  removeFood: ({
    storeId,
    productId
  }: {
    storeId: string
    productId: string
  }) => void
  amountProduct: (productId: string, storeId: string) => number
  accPrice: (productId: string, storeId: string) => number
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
      store,
      product
    }: {
      store: { id: string; name: string; imageURL: string }
      product: {
        id: string
        name: string
        imageURL: string
        priceCents: number
        amount?: number
      }
    }) => {
      dispatch({
        type: 'add',
        payload: {
          product: {
            id: product.id,
            name: product.name,
            imageURL: product.imageURL,
            priceCents: product.priceCents
          },
          store: {
            id: store.id,
            name: store.name,
            imageURL: store.imageURL
          }
        }
      })
    },
    []
  )

  const removeFood = useCallback(
    ({ storeId, productId }: { storeId: string; productId: string }) => {
      dispatch({
        type: 'remove',
        payload: {
          product: {
            id: productId
          },
          store: {
            id: storeId
          }
        }
      })
    },
    []
  )

  const amountProduct = useCallback(
    (productId: string, storeId: string) => {
      const product = state.cart.find(
        item => item.productId === productId && item.storeId === storeId
      )
      return product ? product.amount : 0
    },
    [state.cart]
  )

  const accPrice = useCallback(
    (productId: string, storeId: string) => {
      const product = state.cart.find(
        item => item.productId === productId && item.storeId === storeId
      )
      return product ? product.amount * product.priceCents : 0
    },
    [state.cart]
  )

  const qtyItemsInTheCart = useCallback(() => {
    return state.cart.reduce((acc, currentItem) => {
      return (acc += currentItem.amount)
    }, 0)
  }, [state.cart])

  const separateFoodByRestaurant = useCallback(() => {
    return state.cart.reduce<Record<string, typeof state.cart>>((acc, item) => {
      const key = item.storeId

      if (!acc[key]) {
        acc[key] = []
      }

      acc[key].push(item)

      return acc
    }, {})
  }, [state.cart])

  const totalPrice = useCallback(() => {
    return state.cart.reduce(
      (acc, currentItem) =>
        (acc += currentItem.amount * currentItem.priceCents),
      0
    )
  }, [state.cart])

  return (
    <CartContext.Provider
      value={{
        state,
        addFood,
        removeFood,
        amountProduct,
        accPrice,
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
