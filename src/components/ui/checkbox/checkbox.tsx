'use client'

import * as checkbox from '@zag-js/checkbox'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import {
  ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
  useId
} from 'react'
import { cx } from '@/styled-system/css'
import { CheckIcon } from '../../icons/check'
import { RemoveIcon } from '../../icons/remove'
import { CheckboxProvider, useCheckboxContext } from './use-checkbox-context'
import {
  CheckboxStyleProvider,
  useCheckboxStyleContext
} from './use-checkbox-style-context'

type RootInnerProps = ComponentPropsWithoutRef<'label'>
const RootInner = forwardRef<HTMLLabelElement, RootInnerProps>(
  ({ children, ...props }, forwardedRef) => {
    const { getRootProps } = useCheckboxContext()
    const style = useCheckboxStyleContext()
    const { className, ...mergedProps } = mergeProps(getRootProps(), props)
    const mergedClassName = cx(style?.root, className)

    return (
      <label {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        {children}
      </label>
    )
  }
)
RootInner.displayName = 'Checkbox.RootInner'

type RootProps = Partial<checkbox.Props> & { children: ReactNode }
export const Root = forwardRef<HTMLLabelElement, RootProps>(
  ({ children, id, ...props }, forwardedRef) => {
    const clientId = useId()
    const rootId = id ?? clientId

    const machineProps = {
      id: rootId,
      ...props
    } as checkbox.Props

    const service = useMachine(checkbox.machine, machineProps)
    const api = checkbox.connect(service, normalizeProps)

    return (
      <CheckboxProvider {...api}>
        <CheckboxStyleProvider>
          <RootInner ref={forwardedRef}>{children}</RootInner>
        </CheckboxStyleProvider>
      </CheckboxProvider>
    )
  }
)
Root.displayName = 'Checkbox.Root'

type LabelProps = ComponentPropsWithoutRef<'span'>
export const Label = forwardRef<HTMLSpanElement, LabelProps>(
  (props, forwardedRef) => {
    const { getLabelProps } = useCheckboxContext()
    const style = useCheckboxStyleContext()
    const { className, ...mergedProps } = mergeProps(getLabelProps(), props)
    const mergedClassName = cx(style?.label, className)

    return (
      <span {...mergedProps} className={mergedClassName} ref={forwardedRef} />
    )
  }
)
Label.displayName = 'Checkbox.Label'

type ControlProps = ComponentPropsWithoutRef<'div'>
export const Control = forwardRef<HTMLDivElement, ControlProps>(
  (props, forwardedRef) => {
    const { checkedState, getControlProps } = useCheckboxContext()
    const style = useCheckboxStyleContext()
    const { className, ...mergedProps } = mergeProps(getControlProps(), props)
    const mergedClassName = cx(style?.control, className)

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        <div>
          {checkedState === 'indeterminate' ? (
            <RemoveIcon aria-hidden />
          ) : checkedState === true ? (
            <CheckIcon aria-hidden />
          ) : null}
        </div>
      </div>
    )
  }
)
Control.displayName = 'Checkbox.Control'

type HiddenInputProps = ComponentPropsWithoutRef<'input'>
export const HiddenInput = forwardRef<HTMLInputElement, HiddenInputProps>(
  (props, forwardedRef) => {
    const { getHiddenInputProps } = useCheckboxContext()
    const { className, ...mergedProps } = mergeProps(
      getHiddenInputProps(),
      props
    )

    return <input {...mergedProps} className={className} ref={forwardedRef} />
  }
)
HiddenInput.displayName = 'Checkbox.HiddenInput'
