'use client'

import { css, cx } from '@/styled-system/css'
import * as DialogPrimitive from '@radix-ui/react-dialog'
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

const DrawerComponentClose = forwardRef<
  HTMLButtonElement,
  DialogPrimitive.DialogCloseProps
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.Close asChild {...props} ref={forwardedRef}>
    {children}
  </DialogPrimitive.Close>
))
DrawerComponentClose.displayName = 'DrawerClose'

const DrawerComponentTitle = forwardRef<
  HTMLHeadingElement,
  DialogPrimitive.DialogTitleProps
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.DialogTitle {...props} ref={forwardedRef}>
    {children}
  </DialogPrimitive.DialogTitle>
))
DrawerComponentTitle.displayName = 'DrawerTitle'

const DrawerComponentContent = forwardRef<
  HTMLDivElement,
  DialogPrimitive.DialogContentProps
>(({ children, className, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay
      className={css({
        bg: 'light.gray.900',
        position: 'fixed',
        inset: '0',
        opacity: '0.75',
        zIndex: '20',
        '&[data-state="open"]': { animation: 'fadeIn 250ms ease-in' },
        '&[data-state="closed"]': { animation: 'fadeOut 250ms ease-in' }
      })}
    />
    <DialogPrimitive.Content
      {...props}
      ref={forwardedRef}
      className={cx(
        css({
          bg: 'light.gray.100',
          overflow: 'hidden',
          position: 'fixed',
          right: '0',
          top: '0',
          bottom: '0',
          h: 'screen',
          shadow: 'xl',
          zIndex: '30',
          outline: 'none',
          _focus: {
            boxShadow: 'inset 0 0 0 2px var(--colors-light-indigo-300)'
          },
          '&[data-state="open"]': { animation: 'slideLeft 250ms ease-in' },
          '&[data-state="closed"]': { animation: 'fadeOut 250ms ease-in' }
        }),
        className
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
  Close: DrawerComponentClose,
  Content: DrawerComponentContent,
  Title: DrawerComponentTitle
}
