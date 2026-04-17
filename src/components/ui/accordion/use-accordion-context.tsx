'use client'

import { type Api } from '@zag-js/accordion'
import { type PropTypes } from '@zag-js/react'
import { createContext, useContext } from 'react'

export const AccordionContext = createContext({} as Api<PropTypes>)

type AccordionProviderProps = Api<PropTypes> & { children: React.ReactNode }
export function AccordionProvider({
  children,
  ...accordionProps
}: AccordionProviderProps) {
  return (
    <AccordionContext.Provider value={accordionProps}>
      {children}
    </AccordionContext.Provider>
  )
}

export const useAccordionContext = () => useContext(AccordionContext)
