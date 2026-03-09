import { css } from '@/styled-system/css'
import { cx } from '@/styled-system/css/cx'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { forwardRef } from 'react'

const PopoverComponentRoot = (props: PopoverPrimitive.PopoverProps) => (
  <PopoverPrimitive.Root {...props} />
)
PopoverComponentRoot.displayName = 'PopoverRoot'

const PopoverComponentTrigger = forwardRef<
  HTMLButtonElement,
  PopoverPrimitive.PopoverTriggerProps
>(({ children, ...props }, forwardedRef) => (
  <PopoverPrimitive.Trigger asChild {...props} ref={forwardedRef}>
    {children}
  </PopoverPrimitive.Trigger>
))
PopoverComponentTrigger.displayName = 'PopoverTrigger'

const PopoverComponentContent = forwardRef<
  HTMLDivElement,
  PopoverPrimitive.PopoverContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      className={cx(
        css({
          boxSizing: 'border-box',
          bg: 'light.gray.100',
          overflow: 'hidden',
          shadow: 'xl',
          rounded: 'sm',
          borderTopWidth: '2',
          borderTopColor: 'light.gray.200',
          animation: 'fade',
          outline: 'none',
          _focus: {
            outlineStyle: 'solid',
            outlineWidth: '2',
            outlineColor: 'light.indigo.300'
          }
        }),
        className
      )}
      sideOffset={12}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <PopoverPrimitive.Arrow className={css({ fill: 'light.gray.200' })} />
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverComponentContent.displayName = 'PopoverContent'

export const Popover = {
  Root: PopoverComponentRoot,
  Trigger: PopoverComponentTrigger,
  Content: PopoverComponentContent
}
