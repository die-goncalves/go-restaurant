import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

type TextInputProps = {
  hasError?: boolean
} & InputHTMLAttributes<HTMLInputElement>

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={clsx(
          'box-border w-full py-2 px-4 rounded bg-light-gray-200 border-2 border-light-gray-300 caret-light-gray-800 text-light-gray-800',
          'transition-[border-color] ease-in duration-150',
          'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
          hasError && 'border-light-red-300'
        )}
      />
    )
  }
)
TextInput.displayName = 'TextInput'
