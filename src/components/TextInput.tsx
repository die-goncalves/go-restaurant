import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

enum InputSize {
  sm = 'h-8', // 32px
  md = 'h-10', // 40px
  lg = 'h-12' //48px
}
type TypeInputSize = keyof typeof InputSize

type TextInputProps = {
  hasError?: boolean
  size?: TypeInputSize
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ size = 'md', hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={clsx(
          'box-border w-full px-4 rounded bg-light-gray-200 border-2 border-light-gray-300 caret-light-gray-800 text-light-gray-800 placeholder:text-light-gray-400',
          'transition-[border-color] ease-in duration-150',
          'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300',
          hasError && 'border-light-red-300',
          `${InputSize[size]}`
        )}
      />
    )
  }
)
TextInput.displayName = 'TextInput'
