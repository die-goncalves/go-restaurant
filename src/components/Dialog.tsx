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
  DialogPrimitive.DialogContentProps & { onCloseInteractOverlay: () => void }
>(({ children, onCloseInteractOverlay, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      onClick={onCloseInteractOverlay}
      className="bg-light-gray-900 fixed inset-0 bg-opacity-75 animate-overlayShow z-20"
    />
    <DialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      onPointerDownOutside={e => e.preventDefault()}
      onInteractOutside={e => e.preventDefault()}
      className={`${props.className} bg-light-gray-100 rounded overflow-hidden fixed top-2/4 left-2/4 max-w-[85vw] max-h-[85vh] animate-overlayContent focus:outline-none -translate-x-2/4 -translate-y-2/4 shadow-xl z-30`}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogComponentContent.displayName = 'DialogContent'

const DialogComponentClose = forwardRef<
  HTMLButtonElement,
  DialogPrimitive.DialogCloseProps
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.Close asChild {...props} ref={forwardedRef}>
    {children}
  </DialogPrimitive.Close>
))
DialogComponentClose.displayName = 'DialogClose'

export const Dialog = {
  Root: DialogComponentRoot,
  Trigger: DialogComponentTrigger,
  Content: DialogComponentContent,
  Close: DialogComponentClose
}
