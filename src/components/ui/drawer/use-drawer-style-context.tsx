'use client'

import { createContext, useContext } from 'react'
import {
  DrawerRecipe,
  DrawerVariantProps,
  drawer
} from '@/styled-system/recipes/drawer'

export type DrawerVariant = DrawerVariantProps

type DrawerStyleContextProps = ReturnType<DrawerRecipe>
export const DrawerStyleContext = createContext<DrawerStyleContextProps | null>(
  null
)

type DrawerStyleProviderProps = DrawerVariant & { children: React.ReactNode }
export function DrawerStyleProvider({
  children,
  ...drawerStyleProps
}: DrawerStyleProviderProps) {
  const style = drawer({
    placement: drawerStyleProps.placement,
    size: drawerStyleProps.size
  })

  return (
    <DrawerStyleContext.Provider value={style}>
      {children}
    </DrawerStyleContext.Provider>
  )
}

export const useDrawerStyleContext = () => useContext(DrawerStyleContext)
