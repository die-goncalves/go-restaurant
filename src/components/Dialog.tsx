import { css, cx } from '@/styled-system/css'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { forwardRef } from 'react'

const DialogComponentRoot = (props: DialogPrimitive.DialogProps) => (
  <DialogPrimitive.Root {...props} />
)
DialogComponentRoot.displayName = 'DialogRoot'

const DialogComponentTrigger = (props: DialogPrimitive.DialogTriggerProps) => (
  <DialogPrimitive.Trigger asChild {...props} />
)
DialogComponentTrigger.displayName = 'DialogTrigger'

const DialogComponentTitle = forwardRef<
  HTMLHeadingElement,
  DialogPrimitive.DialogTitleProps
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.DialogTitle {...props} ref={forwardedRef}>
    {children}
  </DialogPrimitive.DialogTitle>
))
DialogComponentTitle.displayName = 'DialogTitle'

const DialogComponentContent = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogContentProps & { onCloseInteractOverlay: () => void }
>(({ children, className, onCloseInteractOverlay, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      onClick={onCloseInteractOverlay}
      className={css({
        bg: 'light.gray.900',
        position: 'fixed',
        inset: '0',
        opacity: '0.75',
        animation: 'overlayShow',
        zIndex: '20'
      })}
    />
    <DialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      onPointerDownOutside={e => e.preventDefault()}
      onInteractOutside={e => e.preventDefault()}
      className={cx(
        css({
          bg: 'light.gray.100',
          rounded: 'sm',
          overflow: 'hidden',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'overlayShow',
          outline: 'none',
          shadow: 'xl',
          zIndex: '30',
          sm: { maxH: 'calc(100vh - 2.5rem)' },
          md: { maxW: '85vw', maxH: '85vh' }
        }),
        className
      )}
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
  Title: DialogComponentTitle,
  Close: DialogComponentClose
}
