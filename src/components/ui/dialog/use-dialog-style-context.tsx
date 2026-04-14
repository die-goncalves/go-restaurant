'use client'

import { createContext, useContext } from 'react'
import {
  DialogRecipe,
  DialogVariantProps,
  dialog
} from '@/styled-system/recipes/dialog'

export type DialogVariant = DialogVariantProps

type DialogStyleContextProps = ReturnType<DialogRecipe>
export const DialogStyleContext = createContext<DialogStyleContextProps | null>(
  null
)

type DialogStyleProviderProps = DialogVariant & { children: React.ReactNode }
export function DialogStyleProvider({
  children,
  ...dialogStyleProps
}: DialogStyleProviderProps) {
  const style = dialog({
    placement: dialogStyleProps.placement,
    size: dialogStyleProps.size
  })

  return (
    <DialogStyleContext.Provider value={style}>
      {children}
    </DialogStyleContext.Provider>
  )
}

export const useDialogStyleContext = () => useContext(DialogStyleContext)
