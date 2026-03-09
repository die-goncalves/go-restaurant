import { InputHTMLAttributes, forwardRef } from 'react'
import { cva } from '@/styled-system/css'

type TypeInputSize = 'sm' | 'md' | 'lg'

const input = cva({
  base: {
    boxSizing: 'border-box',
    w: 'full',
    px: '4',
    rounded: 'sm',
    bg: 'light.gray.200',
    borderWidth: '2',
    borderColor: 'light.gray.300',
    caretColor: 'light.gray.800',
    color: 'light.gray.800',
    transition: 'border-color 150ms ease-in',
    outline: 'none',
    _placeholder: { color: 'light.gray.400' },
    _focus: {
      outlineStyle: 'solid',
      outlineWidth: '2',
      outlineOffset: '2',
      outlineColor: 'light.indigo.300'
    }
  },
  variants: {
    size: {
      sm: { h: '8' },
      md: { h: '10' },
      lg: { h: '12' }
    },
    hasError: {
      true: { borderColor: 'light.red.300' },
      false: {}
    }
  },
  defaultVariants: {
    size: 'md',
    hasError: false
  }
})

type TextInputProps = {
  hasError?: boolean
  size?: TypeInputSize
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ size = 'md', hasError, ...props }, ref) => {
    return <input ref={ref} {...props} className={input({ size, hasError })} />
  }
)
TextInput.displayName = 'TextInput'
