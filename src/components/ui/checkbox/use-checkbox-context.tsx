'use client'

import { type Api } from '@zag-js/checkbox'
import { type PropTypes } from '@zag-js/react'
import { createContext, useContext } from 'react'

export const CheckboxContext = createContext({} as Api<PropTypes>)

type CheckboxProviderProps = Api<PropTypes> & { children: React.ReactNode }
export function CheckboxProvider({
  children,
  ...checkboxProps
}: CheckboxProviderProps) {
  return (
    <CheckboxContext.Provider value={checkboxProps}>
      {children}
    </CheckboxContext.Provider>
  )
}

export const useCheckboxContext = () => useContext(CheckboxContext)
