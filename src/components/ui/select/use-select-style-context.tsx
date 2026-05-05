'use client'

import { createContext, useContext } from 'react'
import {
  SelectRecipe,
  SelectVariantProps,
  select
} from '@/styled-system/recipes/select'

export type SelectVariant = SelectVariantProps

type SelectStyleContextProps = ReturnType<SelectRecipe>
export const SelectStyleContext = createContext<SelectStyleContextProps | null>(
  null
)

type SelectStyleProviderProps = SelectVariant & { children: React.ReactNode }
export function SelectStyleProvider({
  children,
  ...selectStyleProps
}: SelectStyleProviderProps) {
  const style = select(selectStyleProps)

  return (
    <SelectStyleContext.Provider value={style}>
      {children}
    </SelectStyleContext.Provider>
  )
}

export const useSelectStyleContext = () => useContext(SelectStyleContext)
