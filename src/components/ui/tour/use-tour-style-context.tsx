'use client'

import { createContext, useContext } from 'react'
import {
  TourRecipe,
  TourVariantProps,
  tour
} from '@/styled-system/recipes/tour'

export type TourVariant = TourVariantProps

type TourStyleContextProps = ReturnType<TourRecipe>
export const TourStyleContext = createContext<TourStyleContextProps | null>(
  null
)

type TourStyleProviderProps = TourVariant & { children: React.ReactNode }
export function TourStyleProvider({
  children,
  ...tourStyleProps
}: TourStyleProviderProps) {
  const style = tour(tourStyleProps)

  return (
    <TourStyleContext.Provider value={style}>
      {children}
    </TourStyleContext.Provider>
  )
}

export const useTourStyleContext = () => useContext(TourStyleContext)
