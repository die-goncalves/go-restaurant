import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer
} from 'react'
import { TGeographicFeatureWithCoordinates } from '../types'

enum Actions {
  'categories',
  'price',
  'sort',
  'delivery',
  'position',
  'temp_position',
  'changed_position'
}
type TActions = {
  type: keyof typeof Actions
  payload?: any
}
type TFilter = {
  categories: string[]
  price: number[] | undefined
  sort: string
  delivery: string
  currentPosition: TGeographicFeatureWithCoordinates | undefined
  temporaryPosition: TGeographicFeatureWithCoordinates | undefined
}
function reducer(state: TFilter, action: TActions) {
  switch (action.type) {
    case 'categories': {
      const has = state.categories.find(t => t === action.payload.categories)
      if (has) {
        const newArray = state.categories.filter(
          t => t !== action.payload.categories
        )
        return {
          ...state,
          categories: newArray
        }
      } else {
        return {
          ...state,
          categories: [...state.categories, action.payload.categories]
        }
      }
    }
    case 'price': {
      return {
        ...state,
        price: action.payload.price
      }
    }
    case 'sort': {
      return {
        ...state,
        sort: action.payload.sort
      }
    }
    case 'delivery': {
      if (action.payload.delivery === 'pickup') {
        return {
          ...state,
          delivery: action.payload.delivery,
          price: undefined
        }
      } else {
        return {
          ...state,
          delivery: action.payload.delivery
        }
      }
    }
    case 'position': {
      return {
        ...state,
        currentPosition: action.payload.position
      }
    }
    case 'temp_position': {
      return {
        ...state,
        temporaryPosition: action.payload.position
      }
    }
    case 'changed_position': {
      return {
        ...state,
        currentPosition: state.temporaryPosition,
        temporaryPosition: undefined
      }
    }
    default:
      throw Error('Ação desconhecida: ' + action.type)
  }
}
const initialState: TFilter = {
  categories: [],
  price: undefined,
  sort: '',
  delivery: 'delivery',
  currentPosition: undefined,
  temporaryPosition: undefined
}

type FilterContextData = {
  handleTag: (tag: string) => void
  handlePrice: (price: number[] | undefined) => void
  handleSort: (sort: string) => void
  handleDelivery(delivery: string): void
  handleAddPosition: (
    position: TGeographicFeatureWithCoordinates | undefined
  ) => void
  handleChangePosition: () => void
  handleTempPosition: (
    position: TGeographicFeatureWithCoordinates | undefined
  ) => void
  isCheckedTag: (tag: string) => boolean
  state: TFilter
}
export const FilterContext = createContext({} as FilterContextData)

type FilterProviderProps = {
  children: ReactNode
}
export function FilterProvider({ children }: FilterProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleTag = useCallback((categories: string) => {
    dispatch({
      type: 'categories',
      payload: {
        categories
      }
    })
  }, [])
  const handlePrice = useCallback((price: number[] | undefined) => {
    dispatch({
      type: 'price',
      payload: {
        price
      }
    })
  }, [])
  const handleSort = useCallback((sort: string) => {
    dispatch({
      type: 'sort',
      payload: {
        sort
      }
    })
  }, [])
  const handleDelivery = useCallback((delivery: string) => {
    dispatch({
      type: 'delivery',
      payload: {
        delivery
      }
    })
  }, [])
  const handleAddPosition = useCallback(
    (position: TGeographicFeatureWithCoordinates | undefined) => {
      dispatch({
        type: 'position',
        payload: {
          position
        }
      })
    },
    []
  )
  const handleChangePosition = useCallback(() => {
    dispatch({
      type: 'changed_position'
    })
  }, [])
  const handleTempPosition = useCallback(
    (position: TGeographicFeatureWithCoordinates | undefined) => {
      dispatch({
        type: 'temp_position',
        payload: {
          position
        }
      })
    },
    []
  )
  function isCheckedTag(tag: string): boolean {
    const founded = state.categories.find(t => t === tag)
    return !founded
  }

  return (
    <FilterContext.Provider
      value={{
        handleTag,
        handlePrice,
        handleSort,
        handleDelivery,
        handleAddPosition,
        handleChangePosition,
        handleTempPosition,
        isCheckedTag,
        state
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const ctx = useContext(FilterContext)
  return ctx
}
