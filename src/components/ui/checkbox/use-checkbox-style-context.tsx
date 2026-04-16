import { createContext, useContext } from 'react'
import { CheckboxRecipe, checkbox } from '@/styled-system/recipes/checkbox'

type CheckboxStyleContextProps = ReturnType<CheckboxRecipe>
export const CheckboxStyleContext =
  createContext<CheckboxStyleContextProps | null>(null)

type CheckboxStyleProviderProps = {
  children: React.ReactNode
}
export function CheckboxStyleProvider({
  children
}: CheckboxStyleProviderProps) {
  const style = checkbox({})

  return (
    <CheckboxStyleContext.Provider value={style}>
      {children}
    </CheckboxStyleContext.Provider>
  )
}

export const useCheckboxStyleContext = () => useContext(CheckboxStyleContext)
