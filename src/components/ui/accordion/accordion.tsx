'use client'

import * as accordion from '@zag-js/accordion'
import * as collapsible from '@zag-js/collapsible'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import {
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useId
} from 'react'
import { PresenceProvider, usePresence } from '@/src/hooks/use-presence-context'
import { anatomyPart as parts } from '@/src/theme/recipes/accordion'
import { mergeRefs } from '@/src/utils/merge-refs'
import { cx } from '@/styled-system/css'
import { accordion as accordionRecipe } from '@/styled-system/recipes/accordion'
import { ChevronLeftIcon } from '../../icons/chevron-left'
import { AccordionProvider, useAccordionContext } from './use-accordion-context'

type RootInnerProps = ComponentPropsWithoutRef<'div'>
const RootInner = forwardRef<HTMLDivElement, RootInnerProps>(
  (props, forwardedRef) => {
    const { getRootProps } = useAccordionContext()
    const style = accordionRecipe({})
    const { className, ...mergedProps } = mergeProps(getRootProps(), props)
    const mergedClassName = cx(style, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
RootInner.displayName = 'Accordion.RootInner'

type RootProps = Partial<accordion.Props> & { children: ReactNode }
export const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, id, ...props }, forwardedRef) => {
    const clientId = useId()
    const rootId = id ?? clientId

    const machineProps = {
      id: rootId,
      ...props
    } as accordion.Props

    const service = useMachine(accordion.machine, machineProps)
    const api = accordion.connect(service, normalizeProps)

    return (
      <AccordionProvider {...api}>
        <RootInner ref={forwardedRef}>{children}</RootInner>
      </AccordionProvider>
    )
  }
)
Root.displayName = 'Accordion.Root'

const ItemPropsContext = createContext({} as accordion.ItemProps)
const CollapsiblePropsContext = createContext({} as collapsible.Api)

type ItemProps = ComponentPropsWithoutRef<'div'> & accordion.ItemProps
export const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ value, disabled, ...props }, forwardedRef) => {
    const { getItemProps, getItemState, getItemContentProps } =
      useAccordionContext()
    const { id } = getItemContentProps({ value, disabled })
    const { expanded } = getItemState({ value, disabled })

    const service = useMachine(collapsible.machine, {
      ids: { content: id },
      open: expanded
    })
    const api = collapsible.connect(service, normalizeProps)

    const { className, ...mergedProps } = mergeProps(
      api.getRootProps(),
      getItemProps({ value, disabled }),
      props
    )

    return (
      <ItemPropsContext.Provider value={{ value, disabled }}>
        <CollapsiblePropsContext value={api}>
          <PresenceProvider present={expanded}>
            <div {...mergedProps} className={className} ref={forwardedRef} />
          </PresenceProvider>
        </CollapsiblePropsContext>
      </ItemPropsContext.Provider>
    )
  }
)
Item.displayName = 'Accordion.Item'

type ItemTriggerProps = ComponentPropsWithoutRef<'button'> & {
  heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
export const ItemTrigger = forwardRef<HTMLButtonElement, ItemTriggerProps>(
  ({ heading, ...props }, forwardedRef) => {
    const { getItemTriggerProps } = useAccordionContext()
    const { value, disabled } = useContext(ItemPropsContext)
    const { className, ...mergedProps } = mergeProps(
      getItemTriggerProps({ value, disabled }),
      props
    )

    const Component = heading || 'h3'

    return (
      <Component>
        <button {...mergedProps} className={className} ref={forwardedRef} />
      </Component>
    )
  }
)
ItemTrigger.displayName = 'Accordion.ItemTrigger'

type ContentProps = ComponentPropsWithoutRef<'div'>
export const ItemContent = forwardRef<HTMLDivElement, ContentProps>(
  ({ children, ...props }, forwardedRef) => {
    const { getItemContentProps } = useAccordionContext()
    const { getContentProps } = useContext(CollapsiblePropsContext)
    const { getPresenceProps, setNode } = usePresence()
    const { value, disabled } = useContext(ItemPropsContext)
    const { className, ...mergedProps } = mergeProps(
      getContentProps(),
      getItemContentProps({ value, disabled }),
      getPresenceProps(),
      props
    )
    const mergedRefs = mergeRefs(setNode, forwardedRef)

    return (
      <div {...mergedProps} className={className} ref={mergedRefs}>
        {children}
      </div>
    )
  }
)
ItemContent.displayName = 'Accordion.ItemContent'

type ItemContentInnerProps = ComponentPropsWithoutRef<'div'>
export const ItemContentInner = forwardRef<
  HTMLDivElement,
  ItemContentInnerProps
>((props, forwardedRef) => {
  return <div {...props} {...parts.itemContentInner.attrs} ref={forwardedRef} />
})
ItemContentInner.displayName = 'Accordion.ItemContentInner'

type ItemIndicatorProps = ComponentPropsWithoutRef<'div'>
export const ItemIndicator = forwardRef<HTMLDivElement, ItemIndicatorProps>(
  (props, forwardedRef) => {
    const { getItemIndicatorProps } = useAccordionContext()
    const { value, disabled } = useContext(ItemPropsContext)
    const { className, ...mergedProps } = mergeProps(
      getItemIndicatorProps({ value, disabled }),
      props
    )

    return (
      <div {...mergedProps} className={className} ref={forwardedRef}>
        <ChevronLeftIcon />
      </div>
    )
  }
)
ItemIndicator.displayName = 'Accordion.ItemIndicator'
