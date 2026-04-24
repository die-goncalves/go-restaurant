import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer
} from 'react'

export type SortOption = 'rating' | 'delivery_time'
export type DeliveryMode = 'delivery' | 'pickup'

export type State = {
  categories: string[]
  priceRange: number[] | undefined
  sort: SortOption | null
  deliveryMode: DeliveryMode
}

type Action =
  | { type: 'toggleCategory'; payload: { category: string } }
  | { type: 'setPriceRange'; payload: { priceRange: number[] | undefined } }
  | { type: 'setSort'; payload: { sort: SortOption | null } }
  | { type: 'setDeliveryMode'; payload: { deliveryMode: DeliveryMode } }
  | { type: 'clearFilters' }

const initialState: State = {
  categories: [],
  priceRange: undefined,
  sort: null,
  deliveryMode: 'delivery'
}
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'toggleCategory': {
      const { category } = action.payload
      const isActive = state.categories.includes(category)
      const categories = isActive
        ? state.categories.filter(c => c !== category)
        : [...state.categories, category]
      return { ...state, categories }
    }
    case 'setPriceRange': {
      const { priceRange } = action.payload
      return { ...state, priceRange }
    }
    case 'setSort': {
      const { sort } = action.payload
      return { ...state, sort }
    }
    case 'setDeliveryMode': {
      const { deliveryMode } = action.payload
      const priceRange =
        deliveryMode === 'pickup' ? undefined : state.priceRange
      return { ...state, deliveryMode, priceRange }
    }
    case 'clearFilters': {
      return initialState
    }
    default: {
      const _exhaustive: never = action
      throw new Error(`Unknown action: ${(_exhaustive as Action).type}`)
    }
  }
}

type FilterContextData = {
  state: State
  toggleCategory: (category: string) => void
  setPriceRange: (priceRange: number[] | undefined) => void
  setSort: (sort: SortOption | null) => void
  setDeliveryMode: (deliveryMode: DeliveryMode) => void
  clearFilters: () => void
  isCategoryActive: (category: string) => boolean
}
const FilterContext = createContext<FilterContextData | null>(null)

type FilterProviderProps = { children: ReactNode }
export function FilterProvider({ children }: FilterProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const toggleCategory = useCallback((category: string) => {
    dispatch({ type: 'toggleCategory', payload: { category } })
  }, [])
  const setPriceRange = useCallback((priceRange: number[] | undefined) => {
    dispatch({ type: 'setPriceRange', payload: { priceRange } })
  }, [])
  const setSort = useCallback((sort: SortOption | null) => {
    dispatch({ type: 'setSort', payload: { sort } })
  }, [])
  const setDeliveryMode = useCallback((deliveryMode: DeliveryMode) => {
    dispatch({ type: 'setDeliveryMode', payload: { deliveryMode } })
  }, [])
  const clearFilters = useCallback(() => {
    dispatch({ type: 'clearFilters' })
  }, [])
  const isCategoryActive = useCallback(
    (category: string) => state.categories.includes(category),
    [state.categories]
  )

  return (
    <FilterContext.Provider
      value={{
        state,
        toggleCategory,
        setPriceRange,
        setSort,
        setDeliveryMode,
        clearFilters,
        isCategoryActive
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter(): FilterContextData {
  const ctx = useContext(FilterContext)
  if (!ctx) {
    throw new Error('useFilter must be used inside a <FilterProvider>')
  }
  return ctx
}
