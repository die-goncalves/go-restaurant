'use client'

import { type Api } from '@zag-js/marquee'
import { type PropTypes } from '@zag-js/react'
import { createContext, useContext } from 'react'

export const MarqueeContext = createContext({} as Api<PropTypes>)

type MarqueeProviderProps = Api<PropTypes> & { children: React.ReactNode }
export function MarqueeProvider({
  children,
  ...marqueeProps
}: MarqueeProviderProps) {
  return (
    <MarqueeContext.Provider value={marqueeProps}>
      {children}
    </MarqueeContext.Provider>
  )
}

export const useMarqueeContext = () => useContext(MarqueeContext)
