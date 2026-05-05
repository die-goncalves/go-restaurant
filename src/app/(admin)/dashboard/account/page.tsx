import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { DangerZone } from './_components/danger-zone'
import { createClient } from '@/src/lib/supabase/server'
import { css } from '@/styled-system/css'
import { Section } from '@/src/components/common/section'
import { logger } from '@/src/lib/logger'

const log = logger.child({ module: 'server', route: '/dashboard/account' })

export const metadata: Metadata = {
  title: 'Dashboard | GoRestaurant',
  icons: {
    icon: '/favicon-32x32.png'
  }
}

export default async function AccountPage() {
  const reqLog = log.child({ id: crypto.randomUUID() })
  const supabase = await createClient()

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()
  if (authError || !user) {
    reqLog.warn({ error: authError }, 'Unauthenticated user — redirecting')
    redirect('/')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile) {
    reqLog.error({ error: profileError }, 'Profile not found')
    redirect('/')
  }

  return (
    <article
      aria-labelledby="account-heading"
      className={css({
        minHeight: 'calc(100dvh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8'
      })}
    >
      <header
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '2'
        })}
      >
        <h1 id="account-heading" className={css({ textStyle: '2xl' })}>
          Configurações da conta
        </h1>
        <p>Gerencie suas informações pessoais, segurança e preferências.</p>
      </header>

      <Section
        label="Exclusão de conta"
        description="Encerre permanentemente o acesso à sua conta."
      >
        <DangerZone />
      </Section>
    </article>
  )
}
