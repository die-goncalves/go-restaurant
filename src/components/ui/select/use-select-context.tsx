'use client'

import { type Api } from '@zag-js/select'
import { type PropTypes } from '@zag-js/react'
import { createContext, useContext } from 'react'

export const SelectContext = createContext<Api<PropTypes> | null>(null)

type SelectProviderProps<T> = Api<PropTypes, T> & { children: React.ReactNode }
export function SelectProvider<T>({
  children,
  ...selectProps
}: SelectProviderProps<T>) {
  return (
    <SelectContext.Provider value={selectProps}>
      {children}
    </SelectContext.Provider>
  )
}

export function useSelectContext<T>() {
  return useContext(SelectContext) as Api<PropTypes, T>
}
