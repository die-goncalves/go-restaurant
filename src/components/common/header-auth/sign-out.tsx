'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuth } from '@/src/contexts/auth-context'
import { css } from '@/styled-system/css'
import { LogoutIcon } from '../../icons/logout'
import { Button } from '../../ui/button'

export function SignOut() {
  const router = useRouter()
  const { signOut } = useAuth()

  async function handleSignOut() {
    try {
      await signOut()
      router.refresh()
    } catch {
      toast.error('Erro ao sair da conta. Tente novamente.')
    }
  }

  return (
    <Button
      aria-label="Sair da conta"
      variant="ghost"
      onClick={handleSignOut}
      className={css({ padding: 0 })}
    >
      <LogoutIcon />
    </Button>
  )
}
