'use client'

import * as slot from '@radix-ui/react-slot'
import * as combobox from '@zag-js/combobox'
import * as presence from '@zag-js/presence'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useId,
  useMemo
} from 'react'
import { PresenceProvider, usePresence } from '@/src/hooks/use-presence-context'
import { mergeRefs } from '@/src/utils/merge-refs'
import { cx } from '@/styled-system/css'
import {
  ComboboxVariantProps,
  combobox as comboboxRecipe
} from '@/styled-system/recipes/combobox'
import { CheckIcon } from '../../icons/check'
import { ComboboxProvider, useComboboxContext } from './use-combobox-context'
import {
  ComboboxStyleProvider,
  useComboboxStyleContext
} from './use-combobox-style-context'

const defaultScrollToIndexFn = (details: combobox.ScrollToIndexDetails) => {
  if (!details.index) return
  const el = details.getElement()
  const parent = el?.parentElement

  if (el && parent) {
    setTimeout(() => {
      const ulRect = parent.getBoundingClientRect()
      const liRect = el.getBoundingClientRect()

      const offsetElTop = liRect.top - ulRect.top + parent.scrollTop
      const offsetElBottom =
        liRect.top -
        ulRect.top +
        parent.scrollTop +
        liRect.height -
        ulRect.height

      parent.scrollTo({ top: offsetElBottom, behavior: 'smooth' })
    })
  }
}

type RootProps<T> = ComponentPropsWithoutRef<'div'> &
  Partial<Omit<combobox.Props, 'collection'>> &
  ComboboxVariantProps &
  Partial<Pick<presence.Props, 'onExitComplete'>> & {
    items: combobox.CollectionOptions<T>['items']
    itemToValue: combobox.CollectionOptions<T>['itemToValue']
    itemToString: combobox.CollectionOptions<T>['itemToString']
  }
export function Root<T>({
  items,
  itemToValue,
  itemToString,
  onExitComplete,
  scrollToIndexFn: newScrollToIndexFn,
  ...props
}: RootProps<T>) {
  const [comboboxProps, localProps] = combobox.splitProps(props)

  const collection = useMemo(
    () => combobox.collection({ items, itemToValue, itemToString }),
    [items, itemToValue, itemToString]
  )

  const scrollToIndexFn = useCallback(
    (details: combobox.ScrollToIndexDetails) => {
      if (newScrollToIndexFn) {
        return newScrollToIndexFn(details)
      }
      return defaultScrollToIndexFn(details)
    },
    [newScrollToIndexFn]
  )

  const machineProps = {
    id: useId(),
    positioning: { gutter: 8, overflowPadding: 8 },
    collection,
    scrollToIndexFn,
    ...comboboxProps
  } as combobox.Props
  const service = useMachine(combobox.machine, machineProps)
  const api = combobox.connect(service, normalizeProps)

  const style = comboboxRecipe({})
  const { className, ...mergedProps } = mergeProps(
    api.getRootProps(),
    localProps
  )
  const mergedClassName = cx(style.root, className)

  return (
    <ComboboxProvider {...api}>
      <ComboboxStyleProvider {...style}>
        <PresenceProvider present={api.open} onExitComplete={onExitComplete}>
          <div {...mergedProps} className={mergedClassName} />
        </PresenceProvider>
      </ComboboxStyleProvider>
    </ComboboxProvider>
  )
}

type LabelProps = ComponentPropsWithoutRef<'label'>
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (props, forwardedRef) => {
    const { getLabelProps } = useComboboxContext()
    const style = useComboboxStyleContext()
    const { className, ...mergedProps } = mergeProps(getLabelProps(), props)
    const mergedClassName = cx(style?.label, className)

    return (
      <label {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Label.displayName = 'Combobox.Label'

type InputProps = ComponentPropsWithoutRef<'input'>
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, forwardedRef) => {
    const { getInputProps } = useComboboxContext()
    const style = useComboboxStyleContext()
    const { className, ...mergedProps } = mergeProps(getInputProps(), props)
    const mergedClassName = cx(style?.input, className)

    return (
      <input {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Input.displayName = 'Combobox.Input'

type ControlProps = ComponentPropsWithoutRef<'div'>
export const Control = forwardRef<HTMLDivElement, ControlProps>(
  (props, forwardedRef) => {
    const { getControlProps } = useComboboxContext()
    const style = useComboboxStyleContext()
    const { className, ...mergedProps } = mergeProps(getControlProps(), props)
    const mergedClassName = cx(style?.control, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Control.displayName = 'Combobox.Control'

type TriggerProps = ComponentPropsWithoutRef<'button'> &
  combobox.TriggerProps & {
    asChild?: boolean
  }
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
  ({ asChild, focusable, ...props }, forwardedRef) => {
    const { getTriggerProps } = useComboboxContext()
    const style = useComboboxStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getTriggerProps({ focusable }),
      props
    )
    const mergedClassName = cx(style?.trigger, className)

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
Trigger.displayName = 'Combobox.Trigger'

type PositionerProps = ComponentPropsWithoutRef<'div'>
export const Positioner = forwardRef<HTMLDivElement, PositionerProps>(
  (props, forwardedRef) => {
    const { getPositionerProps } = useComboboxContext()
    const { shouldRender } = usePresence()
    const style = useComboboxStyleContext()
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
Positioner.displayName = 'Combobox.Positioner'

type ContentProps = ComponentPropsWithoutRef<'ul'>
export const Content = forwardRef<HTMLUListElement, ContentProps>(
  (props, forwardedRef) => {
    const { getContentProps } = useComboboxContext()
    const { getPresenceProps, setNode, shouldRender } = usePresence()
    const style = useComboboxStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getContentProps(),
      getPresenceProps(),
      props
    )
    const mergedClassName = cx(style?.content, className)
    const mergedRefs = mergeRefs(setNode, forwardedRef)

    if (shouldRender) return null

    return <ul {...mergedProps} className={mergedClassName} ref={mergedRefs} />
  }
)
Content.displayName = 'Combobox.Content'

type ItemProps = ComponentPropsWithoutRef<'li'> & combobox.ItemProps
export const Item = forwardRef<HTMLLIElement, ItemProps>(
  ({ item, persistFocus, ...props }, forwardedRef) => {
    const { getItemProps } = useComboboxContext()
    const style = useComboboxStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getItemProps({ item, persistFocus }),
      props
    )
    const mergedClassName = cx(style?.item, className)

    return (
      <li {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Item.displayName = 'Combobox.Item'

type ItemTextProps = ComponentPropsWithoutRef<'span'> & combobox.ItemProps
export const ItemText = forwardRef<HTMLSpanElement, ItemTextProps>(
  (props, forwardedRef) => {
    const [comboboxItemProps, localProps] = combobox.splitItemProps(props)
    const { getItemTextProps } = useComboboxContext()
    const style = useComboboxStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getItemTextProps(comboboxItemProps),
      localProps
    )
    const mergedClassName = cx(style?.itemText, className)

    return (
      <span {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
ItemText.displayName = 'Combobox.ItemText'

type ItemIndicatorProps = ComponentPropsWithoutRef<'div'> & combobox.ItemProps
export const ItemIndicator = forwardRef<HTMLDivElement, ItemIndicatorProps>(
  (props, forwardedRef) => {
    const [comboboxItemProps, localProps] = combobox.splitItemProps(props)
    const { getItemIndicatorProps } = useComboboxContext()
    const style = useComboboxStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getItemIndicatorProps(comboboxItemProps),
      localProps
    )
    const mergedClassName = cx(style?.itemIndicator, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        <CheckIcon aria-hidden="true" />
      </div>
    )
  }
)
ItemIndicator.displayName = 'Combobox.ItemIndicator'
