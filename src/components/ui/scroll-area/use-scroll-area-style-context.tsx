'use client'

import { createContext, useContext, useMemo } from 'react'
import {
  ScrollAreaRecipe,
  ScrollAreaVariantProps,
  scrollArea
} from '@/styled-system/recipes/scroll-area'

export type ScrollAreaVariant = ScrollAreaVariantProps

type ScrollAreaStyleContextProps = ReturnType<ScrollAreaRecipe>
export const ScrollAreaStyleContext =
  createContext<ScrollAreaStyleContextProps | null>(null)

type ScrollAreaStyleProviderProps = ScrollAreaVariant & {
  children: React.ReactNode
}
export function ScrollAreaStyleProvider({
  children,
  ...scrollAreaStyleProps
}: ScrollAreaStyleProviderProps) {
  const style = useMemo(
    () =>
      scrollArea({
        variant: scrollAreaStyleProps.variant,
        size: scrollAreaStyleProps.size
      }),
    [scrollAreaStyleProps.variant, scrollAreaStyleProps.size]
  )

  return (
    <ScrollAreaStyleContext.Provider value={style}>
      {children}
    </ScrollAreaStyleContext.Provider>
  )
}

export const useScrollAreaStyleContext = () =>
  useContext(ScrollAreaStyleContext)
