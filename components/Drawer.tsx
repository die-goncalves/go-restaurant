import * as DialogPrimitive from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { forwardRef } from 'react'

const DrawerComponentRoot = (props: DialogPrimitive.DialogProps) => (
  <DialogPrimitive.Root {...props} />
)
DrawerComponentRoot.displayName = 'DrawerRoot'

const DrawerComponentTrigger = forwardRef<
  HTMLButtonElement,
  DialogPrimitive.DialogTriggerProps
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.Trigger asChild {...props} ref={forwardedRef}>
    {children}
  </DialogPrimitive.Trigger>
))
DrawerComponentTrigger.displayName = 'DrawerTrigger'

const DrawerComponentContent = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      className={clsx(
        'bg-light-gray-900 fixed inset-0 bg-opacity-75',
        'data-[state="open"]:animate-[fadeIn_250ms_ease-in] data-[state="closed"]:animate-[fadeOut_250ms_ease-in]'
      )}
    />
    <DialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      className={clsx(
        className,
        'bg-light-gray-100 overflow-hidden fixed right-0 top-0 bottom-0 h-screen shadow-xl',
        'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-indigo-300',
        'data-[state="open"]:animate-[slideLeft_250ms_ease-in] data-[state="closed"]:animate-[fadeOut_250ms_ease-in]'
      )}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DrawerComponentContent.displayName = 'DrawerContent'

export const Drawer = {
  Root: DrawerComponentRoot,
  Trigger: DrawerComponentTrigger,
  Content: DrawerComponentContent
}
