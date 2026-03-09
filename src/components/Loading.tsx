import { css } from '@/styled-system/css'

export function Loading() {
  return (
    <div
      className={css({
        borderStyle: 'solid',
        borderWidth: '2',
        borderColor: 'light.gray.100',
        borderTopColor: 'light.gray.800',
        rounded: 'full',
        w: '4',
        h: '4',
        animation: 'spin'
      })}
    />
  )
}
