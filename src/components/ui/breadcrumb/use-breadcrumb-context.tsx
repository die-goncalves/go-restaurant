import { createContext, useContext } from 'react'

type BreadcrumbContextProps = {
  id: string
}

export const BreadcrumbContext = createContext({} as BreadcrumbContextProps)

type BreadcrumbProviderProps = {
  children: React.ReactNode
  id: string
}
export function BreadcrumbProvider({ children, id }: BreadcrumbProviderProps) {
  return (
    <BreadcrumbContext.Provider value={{ id }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export const useBreadcrumbContext = () => useContext(BreadcrumbContext)
