'use client'

import { type PropTypes } from '@zag-js/react'
import { type Api } from '@zag-js/scroll-area'
import { createContext, useContext } from 'react'

export const ScrollAreaContext = createContext({} as Api<PropTypes>)

type ScrollAreaProviderProps = Api<PropTypes> & { children: React.ReactNode }
export function ScrollAreaProvider({
  children,
  ...drawerProps
}: ScrollAreaProviderProps) {
  return (
    <ScrollAreaContext.Provider value={drawerProps}>
      {children}
    </ScrollAreaContext.Provider>
  )
}

export const useScrollAreaContext = () => useContext(ScrollAreaContext)
