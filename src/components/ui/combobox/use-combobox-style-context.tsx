'use client'

import { createContext, useContext } from 'react'
import { ComboboxRecipe } from '@/styled-system/recipes/combobox'

type ComboboxStyleContextProps = ReturnType<ComboboxRecipe>
export const ComboboxStyleContext =
  createContext<ComboboxStyleContextProps | null>(null)

type ComboboxStyleProviderProps = ComboboxStyleContextProps & {
  children: React.ReactNode
}
export function ComboboxStyleProvider({
  children,
  ...comboboxStyleProps
}: ComboboxStyleProviderProps) {
  return (
    <ComboboxStyleContext.Provider value={comboboxStyleProps}>
      {children}
    </ComboboxStyleContext.Provider>
  )
}

export const useComboboxStyleContext = () => useContext(ComboboxStyleContext)
