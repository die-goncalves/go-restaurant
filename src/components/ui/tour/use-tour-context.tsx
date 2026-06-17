'use client'

import type { PropTypes } from '@zag-js/react'
import type { Api } from '@zag-js/tour'
import { createContext, useContext } from 'react'

export const TourContext = createContext({} as Api<PropTypes>)

type TourProviderProps = Api<PropTypes> & { children: React.ReactNode }
export function TourProvider({ children, ...tourProps }: TourProviderProps) {
  return (
    <TourContext.Provider value={tourProps}>{children}</TourContext.Provider>
  )
}

export const useTourContext = () => useContext(TourContext)
