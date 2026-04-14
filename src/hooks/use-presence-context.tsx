'use client'

import { type Api, type Props, connect, machine } from '@zag-js/presence'
import { normalizeProps, useMachine } from '@zag-js/react'
import { createContext, useContext } from 'react'

type PresenceContextProps = Api & {
  unmountOnExit: boolean
  getPresenceProps: () => {
    'data-state': string | undefined
    hidden: boolean
  }
  shouldRender: boolean
}
export const PresenceContext = createContext({} as PresenceContextProps)

type PresenceProviderProps = Props & {
  unmountOnExit?: boolean
  children: React.ReactNode
}
export function PresenceProvider({
  children,
  unmountOnExit = false,
  ...presenceProps
}: PresenceProviderProps) {
  const service = useMachine(machine, presenceProps)
  const api = connect(service, normalizeProps)

  const getPresenceProps = () => ({
    'data-state': api.skip
      ? undefined
      : presenceProps.present
        ? 'open'
        : 'closed',
    hidden: !api.present
  })

  const shouldRender = !api.present && unmountOnExit

  return (
    <PresenceContext.Provider
      value={{ unmountOnExit, getPresenceProps, shouldRender, ...api }}
    >
      {children}
    </PresenceContext.Provider>
  )
}

export const usePresence = () => useContext(PresenceContext)
