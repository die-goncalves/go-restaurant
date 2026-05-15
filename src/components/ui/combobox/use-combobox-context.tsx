'use client'

import { type Api } from '@zag-js/combobox'
import { type PropTypes } from '@zag-js/react'
import { createContext, useContext } from 'react'

export const ComboboxContext = createContext<Api<PropTypes> | null>(null)

type ComboboxProviderProps<T> = Api<PropTypes, T> & {
  children: React.ReactNode
}
export function ComboboxProvider<T>({
  children,
  ...comboboxProps
}: ComboboxProviderProps<T>) {
  return (
    <ComboboxContext.Provider value={comboboxProps}>
      {children}
    </ComboboxContext.Provider>
  )
}

export function useComboboxContext<T>() {
  return useContext(ComboboxContext) as Api<PropTypes, T>
}
