import clsx from 'clsx'
import { ReactNode } from 'react'
import { Check } from 'phosphor-react'

type CheckboxProps = {
  onChangeChecked: () => void
  checked: boolean
  children: ReactNode
  value: string
  qty: number
}

export function Checkbox({
  children,
  checked,
  onChangeChecked,
  value,
  qty
}: CheckboxProps) {
  return (
    <label className="flex flex-1 items-center relative px-4 py-2 gap-4 cursor-pointer select-none">
      <input
        className={clsx('peer sr-only')}
        type="checkbox"
        checked={checked}
        onChange={onChangeChecked}
        value={value}
      />
      <span
        className={clsx(
          'relative inline-block w-4 h-4 rounded bg-light-gray-200',
          'peer-focus:outline peer-focus:outline-2 peer-focus:outline-offset-2 peer-focus:outline-light-indigo-300'
        )}
      />
      <span
        className={clsx(
          'flex absolute w-4 h-4 rounded bg-transparent',
          'peer-checked:invisible'
        )}
      >
        <Check className="m-auto w-3 h-3 text-light-gray-800" weight="bold" />
      </span>

      <div className="flex">
        {children}&nbsp;<span className="text-light-gray-500">({qty})</span>
      </div>
    </label>
  )
}
