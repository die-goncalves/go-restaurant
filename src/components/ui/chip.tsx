import * as slot from '@radix-ui/react-slot'
import {
  Children,
  ComponentPropsWithoutRef,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useId
} from 'react'
import { css, cx } from '@/styled-system/css'
import { ChipVariantProps, chip } from '@/styled-system/recipes/chip'

type RootProps = ComponentPropsWithoutRef<'div'> &
  ChipVariantProps & {
    asChild?: boolean
  }
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ id, className, children, variant, asChild, ...props }, forwardedRef) => {
    const clientId = useId()
    const rootId = id ?? clientId

    const childrenArray = asChild
      ? Children.toArray(
          isValidElement(children)
            ? (children as ReactElement<{ children?: ReactNode }>).props
                .children
            : null
        )
      : Children.toArray(children)
    const firstChild = childrenArray[0]
    const lastChild = childrenArray[childrenArray.length - 1]

    const paddingOnStart =
      isValidElement(firstChild) && firstChild.type !== Label
    const paddingOnEnd = isValidElement(lastChild) && lastChild.type !== Label

    const paddingClass = css({
      paddingInlineStart: paddingOnStart ? '2' : '3',
      paddingInlineEnd: paddingOnEnd ? '2' : '3'
    })

    const style = chip({ variant })
    const mergedClassName = cx(style, paddingClass, className)

    const Component = asChild ? slot.Slot : 'div'

    return (
      <Component
        {...props}
        id={rootId}
        data-scope="chip"
        data-part="root"
        className={mergedClassName}
        ref={forwardedRef}
      >
        {children}
      </Component>
    )
  }
)
Root.displayName = 'Chip.Root'

type LabelProps = ComponentPropsWithoutRef<'span'>
const Label = forwardRef<HTMLSpanElement, LabelProps>(
  ({ id, ...props }, forwardedRef) => {
    const clientId = useId()
    const labelId = id ?? clientId

    return (
      <span
        {...props}
        data-scope="chip"
        data-part="label"
        id={labelId}
        ref={forwardedRef}
      />
    )
  }
)
Label.displayName = 'Chip.Label'

type DeleteTriggerProps = ComponentPropsWithoutRef<'button'> & {
  asChild?: boolean
}
const DeleteTrigger = forwardRef<HTMLButtonElement, DeleteTriggerProps>(
  ({ id, asChild, ...props }, forwardedRef) => {
    const clientId = useId()
    const buttonId = id ?? clientId

    const Component = asChild ? slot.Slot : 'button'

    return (
      <Component
        {...props}
        data-scope="chip"
        data-part="delete-trigger"
        id={buttonId}
        ref={forwardedRef}
      />
    )
  }
)
DeleteTrigger.displayName = 'Chip.DeleteTrigger'

export const Chip = {
  Root,
  Label,
  DeleteTrigger
}
