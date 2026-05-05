'use client'

import { type Api } from '@zag-js/rating-group'
import { type PropTypes } from '@zag-js/react'
import { createContext, useContext } from 'react'

export const RatingGroupContext = createContext({} as Api<PropTypes>)

type RatingGroupProviderProps = Api<PropTypes> & { children: React.ReactNode }
export function RatingGroupProvider({
  children,
  ...ratingGroupProps
}: RatingGroupProviderProps) {
  return (
    <RatingGroupContext.Provider value={ratingGroupProps}>
      {children}
    </RatingGroupContext.Provider>
  )
}

export const useRatingGroupContext = () => useContext(RatingGroupContext)
