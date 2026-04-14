'use client'

import { type Api } from '@zag-js/dialog'
import { type PropTypes } from '@zag-js/react'
import { createContext, useContext } from 'react'

export const DialogContext = createContext({} as Api<PropTypes>)

type DialogProviderProps = Api<PropTypes> & { children: React.ReactNode }
export function DialogProvider({
  children,
  ...dialogProps
}: DialogProviderProps) {
  return (
    <DialogContext.Provider value={dialogProps}>
      {children}
    </DialogContext.Provider>
  )
}

export const useDialogContext = () => useContext(DialogContext)
