import { ReactNode } from 'react'
import { Check } from 'phosphor-react'
import { css } from '@/styled-system/css'

type CheckboxProps = {
  onChangeChecked: () => void
  checked: boolean
  children: ReactNode
  value: string
}

export function Checkbox({
  children,
  checked,
  onChangeChecked,
  value
}: CheckboxProps) {
  return (
    <label
      className={css({
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        position: 'relative',
        px: '4',
        py: '2',
        gap: '4',
        cursor: 'pointer',
        userSelect: 'none'
      })}
    >
      <input
        className={`peer ${css({
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          borderWidth: 0
        })}`}
        type="checkbox"
        checked={checked}
        onChange={onChangeChecked}
        value={value}
      />
      <span
        className={css({
          position: 'relative',
          display: 'inline-block',
          w: '4',
          h: '4',
          borderRadius: 'sm',
          bg: 'light.gray.200',
          _peerFocus: {
            outlineStyle: 'solid',
            outlineWidth: '2px',
            outlineOffset: '2px',
            outlineColor: 'light.indigo.300'
          }
        })}
      />
      <span
        className={css({
          display: 'flex',
          position: 'absolute',
          w: '4',
          h: '4',
          borderRadius: 'sm',
          bg: 'transparent',
          _peerChecked: { visibility: 'hidden' }
        })}
      >
        <Check
          className={css({
            margin: 'auto',
            w: '3',
            h: '3',
            color: 'light.gray.800'
          })}
          weight="bold"
        />
      </span>

      <div
        className={css({
          display: 'flex'
        })}
      >
        {children}
      </div>
    </label>
  )
}
