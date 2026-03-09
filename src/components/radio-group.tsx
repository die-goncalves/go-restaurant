import { forwardRef, ReactNode } from 'react'
import * as RadioGroupComponent from '@radix-ui/react-radio-group'
import { css } from '@/styled-system/css'

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
  <label
    className={css({
      display: 'flex',
      alignItems: 'center',
      gap: '4',
      py: '2',
      px: '4',
      cursor: 'pointer'
    })}
  >
    <RadioGroupComponent.Item
      value={value}
      className={css({
        bg: 'light.gray.200',
        w: '4',
        h: '4',
        borderRadius: 'full',
        _focus: {
          outlineStyle: 'solid',
          outlineWidth: '2px',
          outlineOffset: '2px',
          outlineColor: 'light.indigo.300'
        }
      })}
    >
      <RadioGroupComponent.Indicator
        className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          w: 'full',
          h: 'full',
          position: 'relative',
          _after: {
            content: '""',
            display: 'block',
            w: '1',
            h: '1',
            borderRadius: 'full',
            bg: 'light.gray.800'
          }
        })}
      />
    </RadioGroupComponent.Item>
    {children}
  </label>
)
RadioGroupComponentItem.displayName = 'RadioGroupItem'

export const RadioGroup = {
  Root: RadioGroupComponentRoot,
  Item: RadioGroupComponentItem
}
