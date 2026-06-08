import { css } from '@/styled-system/css'

export function Loading() {
  return (
    <div
      className={css({
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: 'transparent',
        borderTopColor: 'currentColor',
        borderRadius: '50%',
        width: '5',
        height: '5',
        animation: 'spin'
      })}
    />
  )
}
