import { Cart } from '@/src/components/common/cart'
import { Footer } from '@/src/components/common/footer'
import { Header } from '@/src/components/common/header'
import { HeaderAuth } from '@/src/components/common/header-auth'
import { css } from '@/styled-system/css'

export default async function StoreLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header>
        <div className={css({ display: 'flex', gap: '4' })}>
          <Cart />
          <HeaderAuth />
        </div>
      </Header>
      <main>{children}</main>
      <Footer />
    </>
  )
}
