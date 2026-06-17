'use client'

import * as slot from '@radix-ui/react-slot'
import { mergeProps, PropTypes } from '@zag-js/react'
import * as tour from '@zag-js/tour'
import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  type ReactNode
} from 'react'
import { PresenceProvider, usePresence } from '@/src/hooks/use-presence-context'
import { mergeRefs } from '@/src/utils/merge-refs'
import { cx } from '@/styled-system/css'
import { TourVariantProps } from '@/styled-system/recipes/tour'
import { TourProvider, useTourContext } from './use-tour-context'
import {
  TourStyleProvider,
  useTourStyleContext
} from './use-tour-style-context'
import { useTour } from './use-tour'

type RootProviderProps = tour.Api<PropTypes> &
  TourVariantProps & {
    children: ReactNode
  }
export function RootProvider({ children, ...tourProps }: RootProviderProps) {
  return (
    <TourProvider {...tourProps}>
      <TourStyleProvider>
        <PresenceProvider present={tourProps.open} unmountOnExit>
          {children}
        </PresenceProvider>
      </TourStyleProvider>
    </TourProvider>
  )
}

type RootProps = Partial<tour.Props> &
  TourVariantProps & { children: ReactNode }
export const Root = ({ children, ...props }: RootProps) => {
  const api = useTour(props)

  return (
    <TourProvider {...api}>
      <TourStyleProvider>
        <PresenceProvider present={api.open} unmountOnExit>
          {children}
        </PresenceProvider>
      </TourStyleProvider>
    </TourProvider>
  )
}

type TriggerProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  children:
    | ReactNode
    | (({
        open,
        start
      }: {
        open: boolean
        start: (id?: string | undefined) => void
      }) => ReactNode)
  asChild?: boolean
}
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, children, asChild, onClick, ...props }, forwardedRef) => {
    const { open, start } = useTourContext()
    const style = useTourStyleContext()
    const mergedClassName = cx(style?.trigger, className)

    const Component = asChild ? slot.Slot : 'button'
    const content =
      typeof children === 'function' ? children({ open, start }) : children

    return (
      <Component
        {...props}
        onClick={event => {
          onClick?.(event)

          if (!event.defaultPrevented) {
            start()
          }
        }}
        className={mergedClassName}
        ref={forwardedRef}
      >
        {content}
      </Component>
    )
  }
)
Trigger.displayName = 'Tour.Trigger'

type BackdropProps = ComponentPropsWithoutRef<'div'>
export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  (props, forwardedRef) => {
    const { getBackdropProps } = useTourContext()
    const { getPresenceProps, setNode, shouldRender } = usePresence()
    const style = useTourStyleContext()
    const { className, ...mergedProps } = mergeProps(
      {
        ...getBackdropProps(),
        style: { ...getBackdropProps().style, position: 'fixed' }
      },
      { ...getPresenceProps() },
      props
    )
    const mergedClassName = cx(style?.backdrop, className)
    const mergedRefs = mergeRefs(setNode, forwardedRef)

    if (shouldRender) return null

    return <div {...mergedProps} className={mergedClassName} ref={mergedRefs} />
  }
)
Backdrop.displayName = 'Tour.Backdrop'

type PositionerProps = ComponentPropsWithoutRef<'div'>
export const Positioner = forwardRef<HTMLDivElement, PositionerProps>(
  (props, forwardedRef) => {
    const { getPositionerProps } = useTourContext()
    const { shouldRender } = usePresence()
    const style = useTourStyleContext()

    const { className, ...mergedProps } = mergeProps(
      {
        ...getPositionerProps(),
        style: { ...getPositionerProps().style, position: 'fixed' }
      },
      props
    )

    const mergedClassName = cx(style?.positioner, className)

    if (shouldRender) return null

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Positioner.displayName = 'Tour.Positioner'

type ContentProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  children: ReactNode
}
export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, ...props }, forwardedRef) => {
    const { getContentProps } = useTourContext()
    const { getPresenceProps, setNode, shouldRender } = usePresence()
    const style = useTourStyleContext()
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
        {children}
      </div>
    )
  }
)
Content.displayName = 'Tour.Content'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type TitleProps<T extends HeadingTag = 'h3'> = Omit<
  ComponentPropsWithoutRef<T>,
  'children'
> & { as?: T }
export const Title = forwardRef(
  <T extends HeadingTag = 'h3'>(
    { as, ...props }: TitleProps<T>,
    forwardedRef: ForwardedRef<HTMLHeadingElement>
  ) => {
    const { getTitleProps, step } = useTourContext()
    const style = useTourStyleContext()
    const { className, ...mergedProps } = mergeProps(getTitleProps(), props)
    const mergedClassName = cx(style?.title, className)

    const Component = as || 'h3'

    return (
      <Component
        {...mergedProps}
        className={mergedClassName}
        ref={forwardedRef}
      >
        {step?.title}
      </Component>
    )
  }
)
Title.displayName = 'Tour.Title'

type DescriptionProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'>
export const Description = forwardRef<HTMLDivElement, DescriptionProps>(
  (props, forwardedRef) => {
    const { getDescriptionProps, step } = useTourContext()
    const style = useTourStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getDescriptionProps(),
      props
    )
    const mergedClassName = cx(style?.description, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        {step?.description}
      </div>
    )
  }
)
Description.displayName = 'Tour.Description'

type CloseTriggerProps = ComponentPropsWithoutRef<'button'> & {
  asChild?: boolean
}
export const CloseTrigger = forwardRef<HTMLButtonElement, CloseTriggerProps>(
  ({ asChild, ...props }, forwardedRef) => {
    const { getCloseTriggerProps } = useTourContext()
    const style = useTourStyleContext()
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
CloseTrigger.displayName = 'Tour.CloseTrigger'

type SpotlightProps = ComponentPropsWithoutRef<'div'>
export const Spotlight = forwardRef<HTMLDivElement, SpotlightProps>(
  (props, forwardedRef) => {
    const { getSpotlightProps } = useTourContext()
    const style = useTourStyleContext()
    const { className, ...mergedProps } = mergeProps(getSpotlightProps(), props)
    const mergedClassName = cx(style?.spotlight, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Spotlight.displayName = 'Tour.Spotlight'

type ArrowProps = ComponentPropsWithoutRef<'div'>
export const Arrow = forwardRef<HTMLDivElement, ArrowProps>(
  (props, forwardedRef) => {
    const { getArrowProps, step } = useTourContext()
    const style = useTourStyleContext()
    const { className, ...mergedProps } = mergeProps(getArrowProps(), props)
    const mergedClassName = cx(style?.arrow, className)

    if (!step?.arrow) return null

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Arrow.displayName = 'Tour.Arrow'

type ArrowTipProps = ComponentPropsWithoutRef<'div'>
export const ArrowTip = forwardRef<HTMLDivElement, ArrowTipProps>(
  (props, forwardedRef) => {
    const { getArrowTipProps } = useTourContext()
    const style = useTourStyleContext()
    const { className, ...mergedProps } = mergeProps(getArrowTipProps(), props)
    const mergedClassName = cx(style?.arrowTip, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
ArrowTip.displayName = 'Tour.ArrowTip'

type ProgressTextProps = ComponentPropsWithoutRef<'div'>
export const ProgressText = forwardRef<HTMLDivElement, ProgressTextProps>(
  (props, forwardedRef) => {
    const { getProgressTextProps, getProgressText } = useTourContext()
    const style = useTourStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getProgressTextProps(),
      props
    )
    const mergedClassName = cx(style?.progressText, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        {mergedProps.children || getProgressText()}
      </div>
    )
  }
)
ProgressText.displayName = 'Tour.ProgressText'

type ProgressBarProps = ComponentPropsWithoutRef<'div'>
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, ...props }, forwardedRef) => {
    const { getProgressPercent } = useTourContext()
    const style = useTourStyleContext()
    const mergedClassName = cx(style?.progressBar, className)

    return (
      <div {...props} className={mergedClassName} ref={forwardedRef}>
        <div style={{ width: `${getProgressPercent()}%` }} />
      </div>
    )
  }
)
ProgressBar.displayName = 'Tour.ProgressBar'

type ActionsProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  children: ({ actions }: { actions: tour.StepAction[] }) => ReactNode
}
export const Actions = forwardRef<HTMLDivElement, ActionsProps>(
  ({ children, ...props }, forwardedRef) => {
    const { step } = useTourContext()

    return (
      <div {...props} ref={forwardedRef}>
        {children({ actions: step?.actions ?? [] })}
      </div>
    )
  }
)
Actions.displayName = 'Tour.Actions'

type ActionTriggerProps = ComponentPropsWithoutRef<'button'> &
  tour.StepActionTriggerProps & { asChild?: boolean }
export const ActionTrigger = forwardRef<HTMLButtonElement, ActionTriggerProps>(
  ({ action, asChild, ...props }, forwardedRef) => {
    const { getActionTriggerProps } = useTourContext()
    const style = useTourStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getActionTriggerProps({ action }),
      props
    )
    const mergedClassName = cx(style?.actionTrigger, className)

    const Component = asChild ? slot.Slot : 'button'

    return (
      <Component
        {...mergedProps}
        className={mergedClassName}
        ref={forwardedRef}
      >
        {mergedProps.children || action.label}
      </Component>
    )
  }
)
ActionTrigger.displayName = 'Tour.ActionTrigger'
