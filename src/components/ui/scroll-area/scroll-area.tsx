'use client'

import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as scrollArea from '@zag-js/scroll-area'
import { ComponentPropsWithoutRef, forwardRef, useId } from 'react'
import { cx } from '@/styled-system/css'
import { ScrollAreaVariantProps } from '@/styled-system/recipes/scroll-area'
import {
  ScrollAreaProvider,
  useScrollAreaContext
} from './use-scroll-area-context'
import {
  ScrollAreaStyleProvider,
  useScrollAreaStyleContext
} from './use-scroll-area-style-context'

type RootInnerProps = ComponentPropsWithoutRef<'div'>
const RootInner = forwardRef<HTMLDivElement, RootInnerProps>(
  ({ children, ...props }, forwardedRef) => {
    const { getRootProps } = useScrollAreaContext()
    const style = useScrollAreaStyleContext()
    const { className, ...mergedProps } = mergeProps(getRootProps(), props)
    const mergedClassName = cx(style?.root, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        {children}
      </div>
    )
  }
)
RootInner.displayName = 'ScrollArea.RootInner'

type RootProps = ComponentPropsWithoutRef<'div'> &
  Partial<scrollArea.Props> &
  ScrollAreaVariantProps
export const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ id, ids, dir, getRootNode, size, variant, ...props }, forwardRef) => {
    const clientId = useId()
    const rootId = id ?? clientId

    const machineProps = {
      id: rootId,
      ids,
      dir,
      getRootNode
    } as scrollArea.Props

    const service = useMachine(scrollArea.machine, machineProps)
    const api = scrollArea.connect(service, normalizeProps)

    return (
      <ScrollAreaProvider {...api}>
        <ScrollAreaStyleProvider size={size} variant={variant}>
          <RootInner {...props} ref={forwardRef} />
        </ScrollAreaStyleProvider>
      </ScrollAreaProvider>
    )
  }
)
Root.displayName = 'ScrollArea.Root'

type ViewportProps = ComponentPropsWithoutRef<'div'>
export const Viewport = forwardRef<HTMLDivElement, ViewportProps>(
  ({ children, ...props }, forwardedRef) => {
    const { getViewportProps } = useScrollAreaContext()
    const style = useScrollAreaStyleContext()
    const { className, ...mergedProps } = mergeProps(getViewportProps(), props)
    const mergedClassName = cx(style?.viewport, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        {children}
      </div>
    )
  }
)
Viewport.displayName = 'ScrollArea.Viewport'

type ContentProps = ComponentPropsWithoutRef<'div'>
export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, ...props }, forwardedRef) => {
    const { getContentProps } = useScrollAreaContext()
    const style = useScrollAreaStyleContext()
    const { className, ...mergedProps } = mergeProps(getContentProps(), props)
    const mergedClassName = cx(style?.content, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        {children}
      </div>
    )
  }
)
Content.displayName = 'ScrollArea.Content'

type ScrollbarProps = scrollArea.ScrollbarProps &
  ComponentPropsWithoutRef<'div'>
export const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ orientation, children, ...props }, forwardedRef) => {
    const { getScrollbarProps, hasOverflowX, hasOverflowY } =
      useScrollAreaContext()
    const style = useScrollAreaStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getScrollbarProps({ orientation }),
      props
    )
    const mergedClassName = cx(style?.scrollbar, className)

    if (
      (orientation === 'horizontal' && !hasOverflowX) ||
      (orientation === 'vertical' && !hasOverflowY)
    )
      return null

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        {children}
      </div>
    )
  }
)
Scrollbar.displayName = 'ScrollArea.Scrollbar'

type ThumbProps = scrollArea.ThumbProps & ComponentPropsWithoutRef<'div'>
export const Thumb = forwardRef<HTMLDivElement, ThumbProps>(
  ({ orientation, ...props }, forwardedRef) => {
    const { getThumbProps } = useScrollAreaContext()
    const style = useScrollAreaStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getThumbProps({ orientation }),
      props
    )
    const mergedClassName = cx(style?.thumb, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Thumb.displayName = 'ScrollArea.Thumb'

type CornerProps = ComponentPropsWithoutRef<'div'>
export const Corner = forwardRef<HTMLDivElement, CornerProps>(
  (props, forwardedRef) => {
    const { getCornerProps } = useScrollAreaContext()
    const style = useScrollAreaStyleContext()
    const { className, ...mergedProps } = mergeProps(getCornerProps(), props)
    const mergedClassName = cx(style?.corner, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Corner.displayName = 'ScrollArea.Corner'
