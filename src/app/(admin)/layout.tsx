import { redirect } from 'next/navigation'
import { Footer } from '@/src/components/common/footer'
import { Header } from '@/src/components/common/header'
import { SignOut } from '@/src/components/common/header-auth/sign-out'
import { createClient } from '@/src/lib/supabase/server'
import { css } from '@/styled-system/css'
import { DashboardNavigation } from './_components/dashboard-navigation'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  return (
    <>
      <Header>
        <SignOut />
      </Header>
      <div
        className={css({
          maxWidth: 'breakpoint-xlarge',
          marginInline: 'auto',
          minHeight: 'calc(100dvh - 64px)',
          background: 'surface',
          position: 'relative'
        })}
      >
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
            gridTemplateRows: {
              base: 'minmax(0, 1fr) min-content min-content',
              medium: 'minmax(0, 1fr) min-content'
            }
          })}
        >
          <div
            className={css({
              display: 'flex',
              gap: { base: '4', medium: '6', expanded: '8' },
              paddingInline: { base: '4', medium: '6', expanded: '8' }
            })}
          >
            <div
              className={css({
                position: 'relative',
                display: { base: 'none', medium: 'unset' }
              })}
            >
              <DashboardNavigation />
            </div>

            <main className={css({ flex: 1, minWidth: 0 })}>{children}</main>
          </div>

          <div
            className={css({
              gridColumn: {
                base: 'span 4 / span 4',
                medium: 'span 8 / span 8'
              },
              gridRowStart: 2
            })}
          >
            <Footer />
          </div>

          <div
            className={css({
              position: 'sticky',
              display: { medium: 'none' },
              bottom: 0,
              gridRowStart: 3,
              gridColumn: 'span 4 / span 4',
              zIndex: 1
            })}
          >
            <DashboardNavigation />
          </div>
        </div>
      </div>
    </>
  )
}
