'use client'

import * as slot from '@radix-ui/react-slot'
import * as dialog from '@zag-js/dialog'
import * as presence from '@zag-js/presence'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  type ReactNode,
  useId
} from 'react'
import { PresenceProvider, usePresence } from '@/src/hooks/use-presence-context'
import { mergeRefs } from '@/src/utils/merge-refs'
import { cx } from '@/styled-system/css'
import { DrawerVariantProps } from '@/styled-system/recipes/drawer'
import { DrawerProvider, useDrawerContext } from './use-drawer-context'
import {
  DrawerStyleProvider,
  useDrawerStyleContext
} from './use-drawer-style-context'

type RootProps = Partial<dialog.Props> &
  DrawerVariantProps &
  Partial<Pick<presence.Props, 'onExitComplete'>> & { children: ReactNode }
export const Root = ({
  id,
  children,
  size,
  placement,
  onExitComplete,
  closeOnEscape = true,
  closeOnInteractOutside = true,
  preventScroll = true,
  role = 'dialog',
  ...props
}: RootProps) => {
  const clientId = useId()
  const rootId = id ?? clientId

  const machineProps = {
    id: rootId,
    closeOnEscape,
    closeOnInteractOutside,
    preventScroll,
    role,
    ...props
  } as dialog.Props

  const service = useMachine(dialog.machine, machineProps)
  const api = dialog.connect(service, normalizeProps)

  return (
    <DrawerProvider {...api}>
      <DrawerStyleProvider size={size} placement={placement}>
        <PresenceProvider
          present={api.open}
          onExitComplete={onExitComplete}
          unmountOnExit
        >
          {children}
        </PresenceProvider>
      </DrawerStyleProvider>
    </DrawerProvider>
  )
}

type TriggerProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> &
  dialog.TriggerProps & {
    children: ReactNode | (({ open }: { open: boolean }) => ReactNode)
    asChild?: boolean
  }
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
  ({ value, children, asChild, ...props }, forwardedRef) => {
    const { open, getTriggerProps } = useDrawerContext()
    const style = useDrawerStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getTriggerProps({ value }),
      props
    )
    const mergedClassName = cx(style?.trigger, className)

    const Component = asChild ? slot.Slot : 'button'

    if (typeof children === 'function') {
      return (
        <Component
          {...mergedProps}
          className={mergedClassName}
          ref={forwardedRef}
        >
          {children({ open })}
        </Component>
      )
    }

    return (
      <Component
        {...mergedProps}
        className={mergedClassName}
        ref={forwardedRef}
      >
        {children}
      </Component>
    )
  }
)
Trigger.displayName = 'Drawer.Trigger'

type BackdropProps = ComponentPropsWithoutRef<'div'>
export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  (props, forwardedRef) => {
    const { getBackdropProps } = useDrawerContext()
    const { getPresenceProps, setNode, shouldRender } = usePresence()
    const style = useDrawerStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getBackdropProps(),
      getPresenceProps(),
      props
    )
    const mergedClassName = cx(style?.backdrop, className)
    const mergedRefs = mergeRefs(setNode, forwardedRef)

    if (shouldRender) return null

    return <div {...mergedProps} className={mergedClassName} ref={mergedRefs} />
  }
)
Backdrop.displayName = 'Drawer.Backdrop'

type PositionerProps = ComponentPropsWithoutRef<'div'>
export const Positioner = forwardRef<HTMLDivElement, PositionerProps>(
  (props, forwardedRef) => {
    const { getPositionerProps } = useDrawerContext()
    const { shouldRender } = usePresence()
    const style = useDrawerStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getPositionerProps(),
      props
    )
    const mergedClassName = cx(style?.positioner, className)

    if (shouldRender) return null

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Positioner.displayName = 'Drawer.Positioner'

type ContentProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  children:
    | ReactNode
    | (({ setOpen }: { setOpen: (open: boolean) => void }) => ReactNode)
}
export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, ...props }, forwardedRef) => {
    const { getContentProps, setOpen } = useDrawerContext()
    const { getPresenceProps, setNode, shouldRender } = usePresence()
    const style = useDrawerStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getContentProps(),
      getPresenceProps(),
      props
    )
    const mergedClassName = cx(style?.content, className)
    const mergedRefs = mergeRefs(setNode, forwardedRef)

    if (shouldRender) return null

    return (
      <div {...mergedProps} className={mergedClassName} ref={mergedRefs}>
        {typeof children === 'function' ? children({ setOpen }) : children}
      </div>
    )
  }
)
Content.displayName = 'Drawer.Content'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type TitleProps<T extends HeadingTag = 'h3'> = ComponentPropsWithoutRef<T> & {
  children: ReactNode
  as?: T
}
export const Title = forwardRef(
  <T extends HeadingTag = 'h3'>(
    { children, as, ...props }: TitleProps<T>,
    forwardedRef: ForwardedRef<HTMLHeadingElement>
  ) => {
    const { getTitleProps } = useDrawerContext()
    const style = useDrawerStyleContext()
    const { className, ...mergedProps } = mergeProps(getTitleProps(), props)
    const mergedClassName = cx(style?.title, className)

    const Component = as || 'h3'

    return (
      <Component
        {...mergedProps}
        className={mergedClassName}
        ref={forwardedRef}
      >
        {children}
      </Component>
    )
  }
)
Title.displayName = 'Drawer.Title'

type DescriptionProps = ComponentPropsWithoutRef<'div'>
export const Description = forwardRef<HTMLDivElement, DescriptionProps>(
  (props, forwardedRef) => {
    const { getDescriptionProps } = useDrawerContext()
    const style = useDrawerStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getDescriptionProps(),
      props
    )
    const mergedClassName = cx(style?.description, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Description.displayName = 'Drawer.Description'

type CloseTriggerProps = ComponentPropsWithoutRef<'button'> & {
  asChild?: boolean
}
export const CloseTrigger = forwardRef<HTMLButtonElement, CloseTriggerProps>(
  ({ asChild, ...props }, forwardedRef) => {
    const { getCloseTriggerProps } = useDrawerContext()
    const style = useDrawerStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getCloseTriggerProps(),
      props
    )
    const mergedClassName = cx(style?.closeTrigger, className)

    const Component = asChild ? slot.Slot : 'button'

    return (
      <Component
        {...mergedProps}
        className={mergedClassName}
        ref={forwardedRef}
      />
    )
  }
)
CloseTrigger.displayName = 'Drawer.CloseTrigger'
