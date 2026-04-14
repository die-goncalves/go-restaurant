import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { anatomyPart as parts } from '@/src/theme/recipes/text-input'
import { cx } from '@/styled-system/css'
import { textInput } from '@/styled-system/recipes/text-input'

type RootProps = ComponentPropsWithoutRef<'div'>
export const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ className, ...props }, forwardedRef) => {
    const mergedClassName = cx(textInput({}), className)

    return (
      <div
        {...props}
        {...parts.root.attrs}
        className={mergedClassName}
        ref={forwardedRef}
      />
    )
  }
)
Root.displayName = 'TextInput.Root'

type LabelProps = ComponentPropsWithoutRef<'label'>
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (props, forwardedRef) => {
    return <label {...props} {...parts.label.attrs} ref={forwardedRef} />
  }
)
Label.displayName = 'TextInput.Label'

type InputProps = ComponentPropsWithoutRef<'input'>
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, forwardedRef) => {
    return <input {...props} {...parts.input.attrs} ref={forwardedRef} />
  }
)
Input.displayName = 'TextInput.Input'

type DescriptionProps = ComponentPropsWithoutRef<'span'>
export const Description = forwardRef<HTMLSpanElement, DescriptionProps>(
  (props, forwardedRef) => {
    return <span {...props} {...parts.description.attrs} ref={forwardedRef} />
  }
)
Description.displayName = 'TextInput.Description'

type ErrorProps = ComponentPropsWithoutRef<'span'>
export const Error = forwardRef<HTMLSpanElement, ErrorProps>(
  (props, forwardedRef) => {
    return (
      <span
        {...props}
        {...parts.error.attrs}
        aria-live="polite"
        ref={forwardedRef}
      />
    )
  }
)
Error.displayName = 'TextInput.Error'
