'use client'

import * as slot from '@radix-ui/react-slot'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as toggleGroup from '@zag-js/toggle-group'
import { ComponentPropsWithoutRef, forwardRef, useId } from 'react'
import { cx } from '@/styled-system/css'
import { toggleGroup as toggleGroupRecipe } from '@/styled-system/recipes/toggle-group'
import {
  ToggleGroupProvider,
  useToggleGroupContext
} from './use-toggle-group-context'

type RootProps = ComponentPropsWithoutRef<'div'> & Partial<toggleGroup.Props>
export const Root = forwardRef<HTMLDivElement, RootProps>(
  (props, forwardedRef) => {
    const [toggleGroupProps, localProps] = toggleGroup.splitProps(props)

    const machineProps = {
      id: useId(),
      ...toggleGroupProps
    } as toggleGroup.Props

    const service = useMachine(toggleGroup.machine, machineProps)
    const api = toggleGroup.connect(service, normalizeProps)

    const style = toggleGroupRecipe({})
    const { className, ...mergedProps } = mergeProps(
      api.getRootProps(),
      localProps
    )
    const mergedClassName = cx(style, className)

    return (
      <ToggleGroupProvider {...api}>
        <div {...mergedProps} className={mergedClassName} ref={forwardedRef} />
      </ToggleGroupProvider>
    )
  }
)
Root.displayName = 'ToggleGroup.Root'

type ItemProps = ComponentPropsWithoutRef<'button'> &
  toggleGroup.ItemProps & {
    asChild?: boolean
  }
export const Item = forwardRef<HTMLButtonElement, ItemProps>(
  ({ asChild, ...props }, forwardedRef) => {
    const [toggleGroupItemProps, localProps] = toggleGroup.splitItemProps(props)
    const { getItemProps } = useToggleGroupContext()
    const { className, ...mergedProps } = mergeProps(
      getItemProps(toggleGroupItemProps),
      localProps
    )

    const Component = asChild ? slot.Slot : 'button'

    return (
      <Component {...mergedProps} className={className} ref={forwardedRef} />
    )
  }
)
Item.displayName = 'ToggleGroup.Item'
