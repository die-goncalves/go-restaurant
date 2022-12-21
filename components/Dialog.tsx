import * as DialogPrimitive from '@radix-ui/react-dialog'
import { forwardRef } from 'react'

const DialogComponentRoot = (props: DialogPrimitive.DialogProps) => (
  <DialogPrimitive.Root {...props} />
)
DialogComponentRoot.displayName = 'DialogRoot'

const DialogComponentTrigger = (props: DialogPrimitive.DialogTriggerProps) => (
  <DialogPrimitive.Trigger asChild {...props} />
)
DialogComponentTrigger.displayName = 'DialogTrigger'

const DialogComponentContent = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogContentProps
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="bg-light-gray-900 fixed inset-0 bg-opacity-75 animate-overlayShow" />
    <DialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      className={`${props.className} bg-light-gray-100 rounded overflow-hidden fixed top-2/4 left-2/4 w-[90vw] max-w-[400px] max-h-[85vh] animate-overlayContent focus:outline-none -translate-x-2/4 -translate-y-2/4 shadow-xl`}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogComponentContent.displayName = 'DialogContent'

export const Dialog = {
  Root: DialogComponentRoot,
  Trigger: DialogComponentTrigger,
  Content: DialogComponentContent
}
