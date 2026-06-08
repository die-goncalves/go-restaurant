'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/contexts/auth-context'
import { css } from '@/styled-system/css'
import { LogoutIcon } from '../../icons/logout'
import { Button } from '../../ui/button'
import { toaster } from '../../ui/toast/toast'

export function SignOut() {
  const router = useRouter()
  const { signOut } = useAuth()

  async function handleSignOut() {
    try {
      await signOut()
      router.refresh()
    } catch {
      toaster.error({
        description:
          'Não foi possível sair da conta. Tente novamente em alguns instantes'
      })
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
