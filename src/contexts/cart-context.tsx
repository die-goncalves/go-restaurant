'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer
} from 'react'
import { logger } from '@/src/lib/logger'
import { getCookie, setCookie } from '../utils/cookies'

const log = logger.child({
  module: 'client',
  provider: 'CartProvider'
})

type Action =
  | {
      type: 'addProduct'
      payload: {
        product: {
          id: string
          name: string
          imageURL: string
          priceCents: number
          amount?: number
        }
        store: { id: string; name: string; imageURL: string }
      }
    }
  | {
      type: 'decrementProduct'
      payload: { product: { id: string }; store: { id: string } }
    }
  | {
      type: 'removeProduct'
      payload: { product: { id: string }; store: { id: string } }
    }

export type Cart = {
  productId: string
  productName: string
  productImageURL: string
  storeId: string
  storeName: string
  storeImageURL: string
  priceCents: number
  amount: number
}[]

type State = {
  cart: Cart
}

function parseCart(raw: string): Cart {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Cart) : []
  } catch (error) {
    log.error({ error }, 'Failed to parse cart cookie — resetting')
    return []
  }
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'addProduct': {
      const index = state.cart.findIndex(
        item =>
          item.productId === action.payload.product.id &&
          item.storeId === action.payload.store.id
      )
      if (index !== -1) {
        const newCart = [...state.cart]
        newCart[index] = {
          ...newCart[index],
          // amount: newCart[index].amount + 1
          amount: newCart[index].amount + (action.payload.product.amount ?? 1)
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
              // amount: 1
              amount: action.payload.product.amount ?? 1
            }
          ]
        }
      }
    }
    case 'decrementProduct': {
      const index = state.cart.findIndex(
        item =>
          item.productId === action.payload.product.id &&
          item.storeId === action.payload.store.id
      )
      if (index === -1) return state

      const newCart = [...state.cart]
      const item = newCart[index]

      if (item.amount <= 1) return state

      newCart[index] = {
        ...item,
        amount: item.amount - 1
      }

      return {
        ...state,
        cart: newCart
      }
    }
    case 'removeProduct': {
      return {
        ...state,
        cart: state.cart.filter(
          item =>
            !(
              item.productId === action.payload.product.id &&
              item.storeId === action.payload.store.id
            )
        )
      }
    }
    default:
      throw Error('Ação desconhecida')
  }
}

type CartContextData = {
  state: State
  addProduct: ({
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
  decrementProduct: ({
    storeId,
    productId
  }: {
    storeId: string
    productId: string
  }) => void
  removeProduct: ({
    storeId,
    productId
  }: {
    storeId: string
    productId: string
  }) => void
  getProductQuantity: ({
    storeId,
    productId
  }: {
    storeId: string
    productId: string
  }) => number
  getProductTotal: ({
    storeId,
    productId
  }: {
    storeId: string
    productId: string
  }) => number
  getCartCount: () => number
  getProductsByStore: () => Record<string, Cart>
  getCartTotal: () => number
}
const CartContext = createContext({} as CartContextData)

type CartProviderProps = {
  children: ReactNode
}
export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(reducer, { cart: [] }, () => {
    const raw = getCookie('@gorestaurant-v0.1.0:cart')
    const cart = raw ? parseCart(raw) : []

    return { cart }
  })

  useEffect(() => {
    try {
      setCookie('@gorestaurant-v0.1.0:cart', JSON.stringify(state.cart), {
        maxAge: 60 * 60 * 24 * 365,
        path: '/'
      })
    } catch (error) {
      log.error({ error }, 'Failed to persist cart to cookie')
    }
  }, [state.cart])

  const addProduct = useCallback(
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
        type: 'addProduct',
        payload: {
          product: {
            id: product.id,
            name: product.name,
            imageURL: product.imageURL,
            priceCents: product.priceCents,
            amount: product.amount
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

  const decrementProduct = useCallback(
    ({ storeId, productId }: { storeId: string; productId: string }) => {
      dispatch({
        type: 'decrementProduct',
        payload: {
          product: { id: productId },
          store: { id: storeId }
        }
      })
    },
    []
  )

  const removeProduct = useCallback(
    ({ storeId, productId }: { storeId: string; productId: string }) => {
      dispatch({
        type: 'removeProduct',
        payload: {
          product: { id: productId },
          store: { id: storeId }
        }
      })
    },
    []
  )

  const getProductQuantity = useCallback(
    ({ storeId, productId }: { storeId: string; productId: string }) => {
      const product = state.cart.find(
        item => item.productId === productId && item.storeId === storeId
      )
      return product ? product.amount : 0
    },
    [state.cart]
  )

  const getProductTotal = useCallback(
    ({ storeId, productId }: { storeId: string; productId: string }) => {
      const product = state.cart.find(
        item => item.productId === productId && item.storeId === storeId
      )
      return product ? product.amount * product.priceCents : 0
    },
    [state.cart]
  )

  const getCartCount = useCallback(() => {
    return state.cart.reduce((acc, currentItem) => {
      return (acc += currentItem.amount)
    }, 0)
  }, [state.cart])

  const getProductsByStore = useCallback(() => {
    return state.cart.reduce<Record<string, typeof state.cart>>((acc, item) => {
      const key = item.storeId

      if (!acc[key]) {
        acc[key] = []
      }

      acc[key].push(item)

      return acc
    }, {})
  }, [state.cart])

  const getCartTotal = useCallback(() => {
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
        addProduct,
        decrementProduct,
        removeProduct,
        getProductQuantity,
        getProductTotal,
        getCartCount,
        getProductsByStore,
        getCartTotal
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
