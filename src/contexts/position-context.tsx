import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer
} from 'react'
import { logger } from '@/src/lib/logger'
import {
  GeocodingFeature,
  GeocodingFeatureContext
} from '@mapbox/search-js-core'

const log = logger.child({
  module: 'client',
  provider: 'PositionProvider'
})

export type Position = {
  coordinates: GeocodingFeature['properties']['coordinates']
  fullAddress: GeocodingFeature['properties']['full_address']
  geohash: string
  place: GeocodingFeatureContext['place']['name']
}

export type State = {
  currentPosition: Position | undefined
  pendingPosition: Position | undefined
}

type Action =
  | { type: 'setPosition'; payload: { position: Position | undefined } }
  | { type: 'setPending'; payload: { position: Position | undefined } }
  | { type: 'confirmPending' }

const initialState: State = {
  currentPosition: undefined,
  pendingPosition: undefined
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setPosition': {
      const { position } = action.payload
      return { ...state, currentPosition: position }
    }
    case 'setPending': {
      const { position } = action.payload
      return { ...state, pendingPosition: position }
    }
    case 'confirmPending': {
      if (!state.pendingPosition) {
        log.warn('confirmPending dispatched but pendingPosition is undefined')
        return state
      }
      return {
        currentPosition: state.pendingPosition,
        pendingPosition: undefined
      }
    }
    default: {
      const _exhaustive: never = action
      throw new Error(`Unknown action: ${(_exhaustive as Action).type}`)
    }
  }
}

type PositionContextData = {
  state: State
  setPosition: (position: Position | undefined) => void
  setPending: (position: Position | undefined) => void
  confirmPending: () => void
}
const PositionContext = createContext<PositionContextData | null>(null)

type PositionProviderProps = { children: ReactNode }
export function PositionProvider({ children }: PositionProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setPosition = useCallback((position: Position | undefined) => {
    dispatch({ type: 'setPosition', payload: { position } })
  }, [])

  const setPending = useCallback((position: Position | undefined) => {
    dispatch({ type: 'setPending', payload: { position } })
  }, [])

  const confirmPending = useCallback(() => {
    dispatch({ type: 'confirmPending' })
  }, [])

  return (
    <PositionContext.Provider
      value={{
        state,
        setPosition,
        setPending,
        confirmPending
      }}
    >
      {children}
    </PositionContext.Provider>
  )
}

export function usePosition(): PositionContextData {
  const ctx = useContext(PositionContext)
  if (!ctx) {
    throw new Error('usePosition must be used inside a <PositionProvider>')
  }
  return ctx
}
