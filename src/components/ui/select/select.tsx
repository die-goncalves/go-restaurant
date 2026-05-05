'use client'

import * as presence from '@zag-js/presence'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as select from '@zag-js/select'
import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  useCallback,
  useId,
  useMemo
} from 'react'
import { PresenceProvider, usePresence } from '@/src/hooks/use-presence-context'
import { mergeRefs } from '@/src/utils/merge-refs'
import { cx } from '@/styled-system/css'
import {
  SelectVariantProps,
  select as selectRecipe
} from '@/styled-system/recipes/select'
import { CheckIcon } from '../../icons/check'
import { ChevronLeftIcon } from '../../icons/chevron-left'
import { CloseIcon } from '../../icons/close'
import { Button } from '../button'
import { SelectProvider, useSelectContext } from './use-select-context'
import {
  SelectStyleProvider,
  useSelectStyleContext
} from './use-select-style-context'

const defaultScrollToIndexFn = (details: select.ScrollToIndexDetails) => {
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
  Partial<Omit<select.Props, 'collection'>> &
  SelectVariantProps &
  Partial<Pick<presence.Props, 'onExitComplete'>> & {
    items: select.CollectionOptions<T>['items']
    itemToValue: select.CollectionOptions<T>['itemToValue']
    itemToString: select.CollectionOptions<T>['itemToString']
  }
export function Root<T>({
  items,
  itemToValue,
  itemToString,
  onExitComplete,
  scrollToIndexFn: newScrollToIndexFn,
  ...props
}: RootProps<T>) {
  const [selectProps, localProps] = select.splitProps(props)

  const collection = useMemo(
    () => select.collection({ items, itemToValue, itemToString }),
    [items, itemToValue, itemToString]
  )

  const scrollToIndexFn = useCallback(
    (details: select.ScrollToIndexDetails) => {
      if (newScrollToIndexFn) {
        return newScrollToIndexFn(details)
      }
      return defaultScrollToIndexFn(details)
    },
    [newScrollToIndexFn]
  )

  const machineProps = {
    id: useId(),
    positioning: { gutter: 8 },
    collection,
    scrollToIndexFn,
    ...selectProps
  } as select.Props

  const service = useMachine(select.machine, machineProps)
  const api = select.connect(service, normalizeProps)

  const style = selectRecipe({})
  const { className, ...mergedProps } = mergeProps(
    api.getRootProps(),
    localProps
  )
  const mergedClassName = cx(style.root, className)

  return (
    <SelectProvider {...api}>
      <SelectStyleProvider>
        <PresenceProvider present={api.open} onExitComplete={onExitComplete}>
          <div {...mergedProps} className={mergedClassName} />
        </PresenceProvider>
      </SelectStyleProvider>
    </SelectProvider>
  )
}

type LabelProps = ComponentPropsWithoutRef<'label'>
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (props, forwardedRef) => {
    const { getLabelProps } = useSelectContext()
    const style = useSelectStyleContext()
    const { className, ...mergedProps } = mergeProps(getLabelProps(), props)
    const mergedClassName = cx(style?.label, className)

    return (
      <label {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Label.displayName = 'Select.Label'

type HiddenSelectProps = ComponentPropsWithoutRef<'select'>
export const HiddenSelect = forwardRef<HTMLSelectElement, HiddenSelectProps>(
  (props, forwardedRef) => {
    const { collection, getHiddenSelectProps, getItemState } =
      useSelectContext()
    const mergedProps = mergeProps(getHiddenSelectProps(), props)

    return (
      <select {...mergedProps} ref={forwardedRef}>
        {collection.items.map(item => (
          <option
            key={getItemState({ item }).value}
            value={getItemState({ item }).value}
          >
            {collection.stringifyItem(item)}
          </option>
        ))}
      </select>
    )
  }
)
HiddenSelect.displayName = 'Select.HiddenSelect'

type ControlProps = ComponentPropsWithoutRef<'div'>
export const Control = forwardRef<HTMLDivElement, ControlProps>(
  (props, forwardedRef) => {
    const { getControlProps } = useSelectContext()
    const style = useSelectStyleContext()
    const { className, ...mergedProps } = mergeProps(getControlProps(), props)
    const mergedClassName = cx(style?.control, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Control.displayName = 'Select.Control'

type TriggerProps = ComponentPropsWithoutRef<'button'>
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(
  ({ children, ...props }, forwardedRef) => {
    const { getTriggerProps, valueAsString } = useSelectContext()
    const style = useSelectStyleContext()
    const { className, ...mergedProps } = mergeProps(getTriggerProps(), props)
    const mergedClassName = cx(style?.trigger, className)

    return (
      <button {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        <span aria-label={valueAsString ? undefined : 'Selecione uma opção.'}>
          {valueAsString || (
            <span aria-hidden="true">Selecione uma opção.</span>
          )}
        </span>
        {children}
      </button>
    )
  }
)
Trigger.displayName = 'Select.Trigger'

type PositionerProps = ComponentPropsWithoutRef<'div'>
export const Positioner = forwardRef<HTMLDivElement, PositionerProps>(
  (props, forwardedRef) => {
    const { getPositionerProps } = useSelectContext()
    const { shouldRender } = usePresence()
    const style = useSelectStyleContext()
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
Positioner.displayName = 'Select.Positioner'

type ContentProps = ComponentPropsWithoutRef<'ul'>
export const Content = forwardRef<HTMLUListElement, ContentProps>(
  (props, forwardedRef) => {
    const { getContentProps } = useSelectContext()
    const { getPresenceProps, setNode, shouldRender } = usePresence()
    const style = useSelectStyleContext()
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
Content.displayName = 'Select.Content'

type ItemProps<T> = ComponentPropsWithoutRef<'li'> & select.ItemProps<T>
export const Item = forwardRef(
  <T,>(
    { item, ...props }: ItemProps<T>,
    forwardedRef: ForwardedRef<HTMLLIElement>
  ) => {
    const { getItemProps } = useSelectContext()
    const style = useSelectStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getItemProps({ item }),
      props
    )
    const mergedClassName = cx(style?.item, className)

    return (
      <li {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Item.displayName = 'Select.Item'

type ItemTextProps<T> = ComponentPropsWithoutRef<'span'> & select.ItemProps<T>
export const ItemText = forwardRef(
  <T,>(
    { item, ...props }: ItemTextProps<T>,
    forwardedRef: ForwardedRef<HTMLSpanElement>
  ) => {
    const { getItemTextProps } = useSelectContext()
    const style = useSelectStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getItemTextProps({ item }),
      props
    )
    const mergedClassName = cx(style?.itemText, className)

    return (
      <span {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
ItemText.displayName = 'Select.ItemText'

type ItemIndicatorProps<T> = ComponentPropsWithoutRef<'div'> &
  select.ItemProps<T>
export const ItemIndicator = forwardRef(
  <T,>(
    { item, ...props }: ItemIndicatorProps<T>,
    forwardedRef: ForwardedRef<HTMLDivElement>
  ) => {
    const { getItemIndicatorProps } = useSelectContext()
    const style = useSelectStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getItemIndicatorProps({ item }),
      props
    )
    const mergedClassName = cx(style?.itemIndicator, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        <CheckIcon aria-hidden="true" />
      </div>
    )
  }
)
ItemIndicator.displayName = 'Select.ItemIndicator'

type IndicatorProps = ComponentPropsWithoutRef<'div'>
export const Indicator = forwardRef<HTMLDivElement, IndicatorProps>(
  (props, forwardedRef) => {
    const { getIndicatorProps } = useSelectContext()
    const style = useSelectStyleContext()
    const { className, ...mergedProps } = mergeProps(getIndicatorProps(), props)
    const mergedClassName = cx(style?.indicator, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        <ChevronLeftIcon aria-hidden="true" />
      </div>
    )
  }
)
Indicator.displayName = 'Select.Indicator'

type ClearTriggerProps = ComponentPropsWithoutRef<'button'>
export const ClearTrigger = forwardRef<HTMLButtonElement, ClearTriggerProps>(
  (props, forwardedRef) => {
    const { clearValue, getClearTriggerProps, setOpen } = useSelectContext()
    const style = useSelectStyleContext()
    const { className, ...mergedProps } = mergeProps(
      getClearTriggerProps(),
      props
    )
    const mergedClassName = cx(style?.clearTrigger, className)

    return (
      <Button
        variant="ghost"
        {...mergedProps}
        aria-label="Limpar seleção"
        onClick={() => {
          clearValue()
          setOpen(false)
        }}
        className={mergedClassName}
        ref={forwardedRef}
      >
        <CloseIcon />
      </Button>
    )
  }
)
ClearTrigger.displayName = 'Select.ClearTrigger'
