'use client'

import { createContext, useContext } from 'react'
import {
  ScrollAreaRecipe,
  ScrollAreaSlot
} from '@/styled-system/recipes/scroll-area'
import { Pretty } from '@/styled-system/types'

type ScrollAreaStyleContextProps = ReturnType<ScrollAreaRecipe>
export const ScrollAreaStyleContext =
  createContext<ScrollAreaStyleContextProps | null>(null)

type ScrollAreaStyleProviderProps = Pretty<Record<ScrollAreaSlot, string>> & {
  children: React.ReactNode
}
export function ScrollAreaStyleProvider({
  children,
  ...scrollAreaStyleProps
}: ScrollAreaStyleProviderProps) {
  return (
    <ScrollAreaStyleContext.Provider value={scrollAreaStyleProps}>
      {children}
    </ScrollAreaStyleContext.Provider>
  )
}

export const useScrollAreaStyleContext = () =>
  useContext(ScrollAreaStyleContext)
