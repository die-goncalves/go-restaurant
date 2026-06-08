import { ReactNode } from 'react'
import { css } from '@/styled-system/css'
import { Logo } from './logo'

type HeaderProps = {
  children?: ReactNode
}
export function Header({ children }: HeaderProps) {
  return (
    <header
      className={css({
        maxWidth: 'breakpoint-xlarge',
        marginInline: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBlock: '4',
        paddingInline: { base: '4', medium: '6', expanded: '8' }
      })}
    >
      <Logo />
      {children}
    </header>
  )
}
