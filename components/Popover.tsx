import * as PopoverPrimitive from '@radix-ui/react-popover'
import clsx from 'clsx'
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
      className={clsx(
        'box-border bg-light-gray-100 overflow-hidden shadow-xl rounded border-t-2 border-light-gray-200 animate-fade',
        'focus:outline focus:outline-2 focus:outline-light-indigo-300',
        className
      )}
      sideOffset={12}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <PopoverPrimitive.Arrow className="fill-light-gray-200" />
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
PopoverComponentContent.displayName = 'PopoverContent'

export const Popover = {
  Root: PopoverComponentRoot,
  Trigger: PopoverComponentTrigger,
  Content: PopoverComponentContent
}
