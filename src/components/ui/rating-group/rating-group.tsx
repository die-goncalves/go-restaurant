'use client'

import * as ratingGroup from '@zag-js/rating-group'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import {
  ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
  useId
} from 'react'
import { cx } from '@/styled-system/css'
import { ratingGroup as ratingGroupRecipe } from '@/styled-system/recipes/rating-group'
import {
  RatingGroupProvider,
  useRatingGroupContext
} from './use-rating-group-context'

type RootProps = ComponentPropsWithoutRef<'div'> & Partial<ratingGroup.Props>
export const Root = forwardRef<HTMLDivElement, RootProps>(
  (props, forwardedRef) => {
    const [ratingGroupProps, localProps] = ratingGroup.splitProps(props)

    const machineProps = {
      id: useId(),
      ...ratingGroupProps
    } as ratingGroup.Props

    const service = useMachine(ratingGroup.machine, machineProps)
    const api = ratingGroup.connect(service, normalizeProps)

    const style = ratingGroupRecipe({})
    const { className, ...mergedProps } = mergeProps(
      api.getRootProps(),
      localProps
    )
    const mergedClassName = cx(style, className)

    return (
      <RatingGroupProvider {...api}>
        <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
      </RatingGroupProvider>
    )
  }
)
Root.displayName = 'RatingGroup.Root'

type LabelProps = ComponentPropsWithoutRef<'label'>
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (props, forwardedRef) => {
    const { getLabelProps } = useRatingGroupContext()
    const { className, ...mergedProps } = mergeProps(getLabelProps(), props)

    return <label {...mergedProps} className={className} ref={forwardedRef} />
  }
)
Label.displayName = 'RatingGroup.Label'

type ControlProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  children: ReactNode | (({ items }: { items: number[] }) => ReactNode)
}
export const Control = forwardRef<HTMLDivElement, ControlProps>(
  ({ children, ...props }, forwardedRef) => {
    const { getControlProps, items } = useRatingGroupContext()
    const { className, ...mergedProps } = mergeProps(getControlProps(), props)

    return (
      <div {...mergedProps} className={className} ref={forwardedRef}>
        {typeof children === 'function' ? children({ items }) : children}
      </div>
    )
  }
)
Control.displayName = 'RatingGroup.Control'

type ItemProps = ComponentPropsWithoutRef<'span'> & ratingGroup.ItemProps
export const Item = forwardRef<HTMLLabelElement, ItemProps>(
  ({ index, ...props }, forwardedRef) => {
    const { getItemProps } = useRatingGroupContext()
    const { className, ...mergedProps } = mergeProps(
      getItemProps({ index }),
      props
    )
    return <span {...mergedProps} className={className} ref={forwardedRef} />
  }
)
Item.displayName = 'RatingGroup.Item'

type HiddenInputProps = ComponentPropsWithoutRef<'input'>
export const HiddenInput = forwardRef<HTMLInputElement, HiddenInputProps>(
  (props, forwardedRef) => {
    const { getHiddenInputProps } = useRatingGroupContext()
    const { className, ...mergedProps } = mergeProps(
      getHiddenInputProps(),
      props
    )

    return <input {...mergedProps} className={className} ref={forwardedRef} />
  }
)
HiddenInput.displayName = 'RatingGroup.HiddenInput'
