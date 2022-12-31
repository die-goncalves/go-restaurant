import clsx from 'clsx'
import { ReactNode } from 'react'
import { X } from 'phosphor-react'

type FilterTagProps = {
  children: ReactNode
  onClose: () => void
}
export function FilterTag({ children, onClose }: FilterTagProps) {
  return (
    <button
      className={clsx(
        'flex items-center pl-3 rounded w-max h-6 bg-light-orange-200 [&:not(:disabled):hover]:bg-light-orange-300',
        'transition-[background-color] ease-in duration-150',
        'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
      )}
      onClick={onClose}
    >
      <span className="text-sm">{children}</span>

      <span className="px-2">
        <X className="w-3 h-3 text-light-gray-800" weight="bold" />
      </span>
    </button>
  )
}
