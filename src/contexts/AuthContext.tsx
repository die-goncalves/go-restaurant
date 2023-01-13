import { useSessionContext } from '@supabase/auth-helpers-react'
import { AuthError, AuthResponse, Session } from '@supabase/supabase-js'
import { createContext, ReactNode, useContext } from 'react'

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
  const {
    session,
    isLoading,
    supabaseClient: { auth }
  } = useSessionContext()

  async function signIn(data: { email: string; password: string }) {
    return await auth.signInWithPassword({
      email: data.email,
      password: data.password
    })
  }

  async function signUp(data: { email: string; password: string }) {
    return await auth.signUp({
      email: data.email,
      password: data.password
    })
  }

  async function signOut() {
    return await auth.signOut()
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
