'use client'

import { AuthError, AuthResponse, Session } from '@supabase/supabase-js'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { createClient } from '../lib/supabase/client'

type AuthContextData = {
  session: Session | null
  isLoading: boolean
  signUp(data: { email: string; password: string }): Promise<AuthResponse>
  signIn(data: { email: string; password: string }): Promise<AuthResponse>
  signOut(): Promise<{
    error: AuthError | null
  }>
}
const AuthContext = createContext({} as AuthContextData)

type AuthProviderProps = {
  children: ReactNode
}
export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = useMemo(() => createClient(), [])
  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  async function signIn(data: { email: string; password: string }) {
    return await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })
  }

  async function signUp(data: { email: string; password: string }) {
    return await supabase.auth.signUp({
      email: data.email,
      password: data.password
    })
  }

  async function signOut() {
    return await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{ session, isLoading, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  return ctx
}
