'use client'

import { type Api } from '@zag-js/radio-group'
import { type PropTypes } from '@zag-js/react'
import { createContext, useContext } from 'react'

export const RadioGroupContext = createContext({} as Api<PropTypes>)

type RadioGroupProviderProps = Api<PropTypes> & { children: React.ReactNode }
export function RadioGroupProvider({
  children,
  ...radioGroupProps
}: RadioGroupProviderProps) {
  return (
    <RadioGroupContext.Provider value={radioGroupProps}>
      {children}
    </RadioGroupContext.Provider>
  )
}

export const useRadioGroupContext = () => useContext(RadioGroupContext)
