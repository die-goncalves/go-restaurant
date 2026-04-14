'use client'

import * as slot from '@radix-ui/react-slot'
import { ComponentPropsWithoutRef, forwardRef, useId } from 'react'
import { cx } from '@/styled-system/css'
import { breadcrumb } from '@/styled-system/recipes/breadcrumb'
import {
  BreadcrumbProvider,
  useBreadcrumbContext
} from './use-breadcrumb-context'

type RootInnerProps = ComponentPropsWithoutRef<'nav'>
const RootInner = forwardRef<HTMLElement, RootInnerProps>(
  ({ className, ...props }, forwardedRef) => {
    const style = breadcrumb()
    const mergedClassName = cx(style.root, className)

    return <nav {...props} className={mergedClassName} ref={forwardedRef} />
  }
)
RootInner.displayName = 'Breadcrumb.RootInner'

type RootProps = ComponentPropsWithoutRef<'nav'>
export const Root = forwardRef<HTMLElement, RootProps>(function Root(
  { id, children, ...props },
  forwardedRef
) {
  const clientId = useId()
  const rootId = id ?? clientId

  return (
    <BreadcrumbProvider id={rootId}>
      <RootInner {...props} id={rootId} ref={forwardedRef}>
        {children}
      </RootInner>
    </BreadcrumbProvider>
  )
})

type ListProps = ComponentPropsWithoutRef<'ol'>
export const List = forwardRef<HTMLOListElement, ListProps>(
  (props, forwardedRef) => {
    return <ol {...props} ref={forwardedRef} />
  }
)
List.displayName = 'Breadcrumb.List'

type ItemProps = ComponentPropsWithoutRef<'li'> & { isCurrent?: boolean }
export const Item = forwardRef<HTMLLIElement, ItemProps>(
  ({ id, className, isCurrent, children, ...props }, forwardedRef) => {
    const clientId = useId()
    const itemId = id ?? clientId
    const ctx = useBreadcrumbContext()
    const { item, currentItem } = breadcrumb()
    const mergedClassName = cx(isCurrent ? currentItem : item, className)

    return (
      <li
        {...props}
        id={`${ctx.id}:${itemId}`}
        className={mergedClassName}
        ref={forwardedRef}
      >
        <slot.Root {...(isCurrent && { 'aria-current': 'page' })}>
          {children}
        </slot.Root>
      </li>
    )
  }
)
Item.displayName = 'Breadcrumb.Item'

type SeparatorProps = ComponentPropsWithoutRef<'span'> & {
  asChild?: boolean
}
export const Separator = forwardRef<HTMLElement, SeparatorProps>(
  ({ children, asChild, className, ...props }, forwardedRef) => {
    const { separator } = breadcrumb()
    const mergedClassName = cx(separator, className)

    const Component = asChild ? slot.Slot : 'span'

    return (
      <Component
        {...props}
        aria-hidden={true}
        className={mergedClassName}
        ref={forwardedRef}
      >
        {children}
      </Component>
    )
  }
)
Separator.displayName = 'Breadcrumb.Separator'
