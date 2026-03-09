'use client'

import { useAuth } from '@/src/contexts/auth-context'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()
  const { signOut } = useAuth()

  async function handleSignOut() {
    const { error } = await signOut()
    if (!error) router.push('/')
  }

  return <button onClick={handleSignOut}>Sair</button>
}
