'use client'

import { type PropTypes } from '@zag-js/react'
import { type Api } from '@zag-js/toggle-group'
import { createContext, useContext } from 'react'

export const ToggleGroupContext = createContext({} as Api<PropTypes>)

type ToggleGroupProviderProps = Api<PropTypes> & { children: React.ReactNode }
export function ToggleGroupProvider({
  children,
  ...toggleGroupProps
}: ToggleGroupProviderProps) {
  return (
    <ToggleGroupContext.Provider value={toggleGroupProps}>
      {children}
    </ToggleGroupContext.Provider>
  )
}

export const useToggleGroupContext = () => useContext(ToggleGroupContext)
