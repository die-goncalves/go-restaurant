import clsx from 'clsx'
import { forwardRef, ReactNode } from 'react'
import * as RadioGroupComponent from '@radix-ui/react-radio-group'

const RadioGroupComponentRoot = forwardRef<
  HTMLDivElement,
  RadioGroupComponent.RadioGroupProps
>(({ children, ...props }, forwardedRef) => (
  <RadioGroupComponent.Root {...props} ref={forwardedRef}>
    {children}
  </RadioGroupComponent.Root>
))
RadioGroupComponentRoot.displayName = 'RadioGroupRoot'

type RadioGroupComponentItemProps = {
  value: string
  children: ReactNode
}
const RadioGroupComponentItem = ({
  children,
  value
}: RadioGroupComponentItemProps) => (
  <label className="flex items-center gap-4 py-2 px-4 cursor-pointer">
    <RadioGroupComponent.Item
      value={value}
      className={clsx(
        'bg-light-gray-200 w-4 h-4 rounded-full',
        'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
      )}
    >
      <RadioGroupComponent.Indicator className='flex items-center justify-center w-full h-full relative after:content-[""] after:block after:w-1 after:h-1 after:rounded-full after:bg-light-gray-800' />
    </RadioGroupComponent.Item>
    {children}
  </label>
)
RadioGroupComponentItem.displayName = 'RadioGroupItem'

export const RadioGroup = {
  Root: RadioGroupComponentRoot,
  Item: RadioGroupComponentItem
}
