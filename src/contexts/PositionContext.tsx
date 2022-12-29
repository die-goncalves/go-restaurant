import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useReducer
} from 'react'
import { TGeographicFeatureWithCoordinates } from '../types'

enum Actions {
  'position',
  'temp_position',
  'changed_position'
}
type TActions = {
  type: keyof typeof Actions
  payload?: any
}
type TPositions = {
  currentPosition: TGeographicFeatureWithCoordinates | undefined
  temporaryPosition: TGeographicFeatureWithCoordinates | undefined
}
function reducer(state: TPositions, action: TActions) {
  switch (action.type) {
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
        currentPosition: state.temporaryPosition,
        temporaryPosition: undefined
      }
    }
    default:
      throw Error('Ação desconhecida: ' + action.type)
  }
}
const initialState: TPositions = {
  currentPosition: undefined,
  temporaryPosition: undefined
}

type PositionContextData = {
  state: {
    currentPosition: TGeographicFeatureWithCoordinates | undefined
    temporaryPosition: TGeographicFeatureWithCoordinates | undefined
  }
  handleChangePosition: () => void
  handleAddPosition: (
    position: TGeographicFeatureWithCoordinates | undefined
  ) => void
  handleTempPosition: (
    position: TGeographicFeatureWithCoordinates | undefined
  ) => void
}
const PositionContext = createContext({} as PositionContextData)

type PositionProviderProps = {
  children: ReactNode
}
export function PositionProvider({ children }: PositionProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState)

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

  return (
    <PositionContext.Provider
      value={{
        state,
        handleAddPosition,
        handleTempPosition,
        handleChangePosition
      }}
    >
      {children}
    </PositionContext.Provider>
  )
}

export const usePosition = () => {
  const ctx = useContext(PositionContext)
  return ctx
}
