import { css } from '@/styled-system/css'
import { ReactNode } from 'react'

type TextTagProps = {
  children: ReactNode
}
export function TextTag({ children }: TextTagProps) {
  return (
    <span
      className={css({
        display: 'flex',
        alignItems: 'center',
        fontSize: 'sm',
        px: '3',
        rounded: 'sm',
        w: 'max',
        h: '6',
        bg: 'light.orange.200'
      })}
    >
      {children}
    </span>
  )
}
