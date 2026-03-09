import { ReactNode } from 'react'
import { X } from 'phosphor-react'
import { css } from '@/styled-system/css'

type FilterTagProps = {
  children: ReactNode
  onClose: () => void
}

export function FilterTag({ children, onClose }: FilterTagProps) {
  return (
    <button
      onClick={onClose}
      className={css({
        display: 'flex',
        alignItems: 'center',
        pl: '3',
        rounded: 'sm',
        w: 'max',
        h: '6',
        bg: 'light.orange.200',
        transition: 'background-color 150ms ease-in',
        outline: 'none',
        '&:not(:disabled):hover': { bg: 'light.orange.300' },
        _focus: {
          outlineStyle: 'solid',
          outlineWidth: '2',
          outlineOffset: '2',
          outlineColor: 'light.indigo.300'
        }
      })}
    >
      <span className={css({ fontSize: 'sm' })}>{children}</span>
      <span className={css({ px: '2' })}>
        <X
          className={css({ w: '3', h: '3', color: 'light.gray.800' })}
          weight="bold"
        />
      </span>
    </button>
  )
}
