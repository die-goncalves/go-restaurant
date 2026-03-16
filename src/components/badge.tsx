import { css } from '@/styled-system/css'
import { ShoppingCartSimple } from 'phosphor-react'

export default function Badge({ presence }: { presence: boolean }) {
  return presence ? (
    <div
      className={css({
        position: 'absolute',
        top: '0',
        right: '0',
        rounded: 'full',
        p: '2',
        zIndex: '2',
        transform: 'translate(33%, -33%)',
        bg: 'light.gray.200'
      })}
    >
      <ShoppingCartSimple
        className={css({ w: '5', h: '5', color: 'light.gray.400' })}
        weight="fill"
      />
    </div>
  ) : null
}
