'use client'

import * as radioGroup from '@zag-js/radio-group'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import {
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
  useId
} from 'react'
import { cx } from '@/styled-system/css'
import { radioGroup as radioGroupRecipe } from '@/styled-system/recipes/radio-group'
import {
  RadioGroupProvider,
  useRadioGroupContext
} from './use-radio-group-context'

type RootInnerProps = ComponentPropsWithoutRef<'div'>
const RootInner = forwardRef<HTMLFieldSetElement, RootInnerProps>(
  ({ children, ...props }, forwardedRef) => {
    const { getRootProps } = useRadioGroupContext()
    const style = radioGroupRecipe({})
    const { className, ...mergedProps } = mergeProps(getRootProps(), props)
    const mergedClassName = cx(style, className)

    return (
      <fieldset {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        {children}
      </fieldset>
    )
  }
)
RootInner.displayName = 'RadioGroup.RootInner'

type RootProps = Partial<radioGroup.Props> & { children: ReactNode }
export const Root = forwardRef<HTMLFieldSetElement, RootProps>(
  ({ children, id, ...props }, forwardedRef) => {
    const clientId = useId()
    const rootId = id ?? clientId

    const machineProps = {
      id: rootId,
      ...props
    } as radioGroup.Props

    const service = useMachine(radioGroup.machine, machineProps)
    const api = radioGroup.connect(service, normalizeProps)

    return (
      <RadioGroupProvider {...api}>
        <RootInner ref={forwardedRef}>{children}</RootInner>
      </RadioGroupProvider>
    )
  }
)
Root.displayName = 'RadioGroup.Root'

type LegendProps = ComponentPropsWithoutRef<'legend'>
export const Legend = forwardRef<HTMLLegendElement, LegendProps>(
  (props, forwardedRef) => {
    const { getLabelProps } = useRadioGroupContext()
    const { className, ...mergedProps } = mergeProps(getLabelProps(), props)

    return <legend {...mergedProps} className={className} ref={forwardedRef} />
  }
)
Legend.displayName = 'RadioGroup.Legend'

const ItemPropsContext = createContext({} as radioGroup.ItemProps)

type ItemProps = ComponentPropsWithoutRef<'label'> & radioGroup.ItemProps
export const Item = forwardRef<HTMLLabelElement, ItemProps>(
  ({ value, disabled, invalid, ...props }, forwardedRef) => {
    const { getItemProps } = useRadioGroupContext()
    const { className, ...mergedProps } = mergeProps(
      getItemProps({ value, disabled, invalid }),
      props
    )
    return (
      <ItemPropsContext.Provider value={{ value, disabled, invalid }}>
        <label {...mergedProps} className={className} ref={forwardedRef} />
      </ItemPropsContext.Provider>
    )
  }
)
Item.displayName = 'RadioGroup.Item'

type ItemTextProps = ComponentPropsWithoutRef<'span'>
export const ItemText = forwardRef<HTMLSpanElement, ItemTextProps>(
  (props, forwardedRef) => {
    const { getItemTextProps } = useRadioGroupContext()
    const { value, disabled, invalid } = useContext(ItemPropsContext)
    const { className, ...mergedProps } = mergeProps(
      getItemTextProps({ value, disabled, invalid }),
      props
    )

    return <span {...mergedProps} className={className} ref={forwardedRef} />
  }
)
ItemText.displayName = 'RadioGroup.ItemText'

type ItemControlProps = ComponentPropsWithoutRef<'div'>
export const ItemControl = forwardRef<HTMLDivElement, ItemControlProps>(
  (props, forwardedRef) => {
    const { getItemControlProps } = useRadioGroupContext()
    const { value, disabled, invalid } = useContext(ItemPropsContext)
    const { className, ...mergedProps } = mergeProps(
      getItemControlProps({ value, disabled, invalid }),
      props
    )

    return (
      <div {...mergedProps} className={className} ref={forwardedRef}>
        <div />
      </div>
    )
  }
)
ItemControl.displayName = 'RadioGroup.ItemControl'

type ItemHiddenInputProps = ComponentPropsWithoutRef<'input'>
export const ItemHiddenInput = forwardRef<
  HTMLInputElement,
  ItemHiddenInputProps
>((props, forwardedRef) => {
  const { getItemHiddenInputProps } = useRadioGroupContext()
  const { value, disabled, invalid } = useContext(ItemPropsContext)
  const { className, ...mergedProps } = mergeProps(
    getItemHiddenInputProps({ value, disabled, invalid }),
    props
  )

  return <input {...mergedProps} className={className} ref={forwardedRef} />
})
ItemHiddenInput.displayName = 'RadioGroup.ItemHiddenInput'
