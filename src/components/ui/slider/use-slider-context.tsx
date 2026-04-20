'use client'

import { type PropTypes } from '@zag-js/react'
import { type Api } from '@zag-js/slider'
import { createContext, useContext } from 'react'

export const SliderContext = createContext({} as Api<PropTypes>)

type SliderProviderProps = Api<PropTypes> & { children: React.ReactNode }
export function SliderProvider({
  children,
  ...sliderProps
}: SliderProviderProps) {
  return (
    <SliderContext.Provider value={sliderProps}>
      {children}
    </SliderContext.Provider>
  )
}

export const useSliderContext = () => useContext(SliderContext)
