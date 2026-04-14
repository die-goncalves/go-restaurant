'use client'

import { type Api } from '@zag-js/dialog'
import { type PropTypes } from '@zag-js/react'
import { createContext, useContext } from 'react'

export const DrawerContext = createContext({} as Api<PropTypes>)

type DrawerProviderProps = Api<PropTypes> & { children: React.ReactNode }
export function DrawerProvider({
  children,
  ...drawerProps
}: DrawerProviderProps) {
  return (
    <DrawerContext.Provider value={drawerProps}>
      {children}
    </DrawerContext.Provider>
  )
}

export const useDrawerContext = () => useContext(DrawerContext)
