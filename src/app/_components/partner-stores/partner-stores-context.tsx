'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react'
import { StoreFeature } from '.'

type PartnerStoresContextData = {
  store: StoreFeature | null
  changeStore: (sf: StoreFeature) => void
}
const PartnerStoresContext = createContext({} as PartnerStoresContextData)

type PartnerStoresProviderProps = {
  children: ReactNode
}
export function PartnerStoresProvider({
  children
}: PartnerStoresProviderProps) {
  const [selectedStore, setSelectedStore] = useState<StoreFeature | null>(null)
  const changeStore = useCallback((sf: StoreFeature) => {
    setSelectedStore(sf)
  }, [])

  return (
    <PartnerStoresContext.Provider
      value={{ store: selectedStore, changeStore }}
    >
      {children}
    </PartnerStoresContext.Provider>
  )
}

export function usePartnerStores() {
  const ctx = useContext(PartnerStoresContext)
  return ctx
}
