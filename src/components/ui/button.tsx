'use client'

import {
  ComponentPropsWithoutRef,
  type ForwardedRef,
  type ReactNode,
  forwardRef,
  useId
} from 'react'
import { cx } from '@/styled-system/css'
import { button, ButtonVariantProps } from '@/styled-system/recipes/button'

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  ButtonVariantProps & {
    icon?: ReactNode
    iconPlacement?: 'left' | 'right'
  }
export const Button = forwardRef(
  (
    {
      id,
      size,
      variant,
      icon,
      iconPlacement = 'left',
      children,
      className,
      ...props
    }: ButtonProps,
    forwardedRef: ForwardedRef<HTMLButtonElement>
  ) => {
    const clientId = useId()
    const buttonId = id ?? clientId

    const style = button({ size, variant })
    const mergedClassName = cx(style, className)

    return (
      <button
        {...props}
        {...(icon && { 'data-icon-placement': iconPlacement })}
        id={buttonId}
        className={mergedClassName}
        ref={forwardedRef}
      >
        {iconPlacement === 'left' && icon}
        {children}
        {iconPlacement === 'right' && icon}
      </button>
    )
  }
)
Button.displayName = 'Button'
