'use client'

import { useAuth } from '@/src/contexts/auth-context'
import { css } from '@/styled-system/css'
import { Account } from './account'
import { SignIn } from './sign-in'
import { SignOut } from './sign-out'

export function HeaderAuth() {
  const { session } = useAuth()

  return session ? (
    <div className={css({ display: 'flex', gap: '4' })}>
      <Account />
      <SignOut />
    </div>
  ) : (
    <SignIn />
  )
}
