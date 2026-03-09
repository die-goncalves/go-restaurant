import { forwardRef } from 'react'
import { CaretDown } from 'phosphor-react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { css, cx } from '@/styled-system/css'

const AccordionComponentRoot = forwardRef<
  HTMLDivElement,
  Omit<AccordionPrimitive.AccordionMultipleProps, 'type'>
>(({ children, ...props }, forwardedRef) => (
  <AccordionPrimitive.Root type="multiple" {...props} ref={forwardedRef}>
    {children}
  </AccordionPrimitive.Root>
))
AccordionComponentRoot.displayName = 'AccordionRoot'

const AccordionComponentItem = forwardRef<
  HTMLDivElement,
  AccordionPrimitive.AccordionItemProps
>(({ children, ...props }, forwardedRef) => (
  <AccordionPrimitive.Item {...props} ref={forwardedRef}>
    {children}
  </AccordionPrimitive.Item>
))
AccordionComponentItem.displayName = 'AccordionItem'

const AccordionComponentTrigger = forwardRef<
  HTMLButtonElement,
  AccordionPrimitive.AccordionTriggerProps
>(({ children, className, ...props }, forwardedRef) => (
  <AccordionPrimitive.Header className={css({ display: 'flex' })}>
    <AccordionPrimitive.Trigger
      className={cx(
        css({
          display: 'flex',
          flex: '1',
          h: '10',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: '2',
          px: '4',
          bg: 'light.gray.100',
          outline: 'none',
          _focus: {
            boxShadow: 'inset 0 0 0 2px var(--colors-light-indigo-300)'
          }
        }),
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <CaretDown
        className={css({
          w: '6',
          h: '6',
          transition: 'transform 150ms ease-in',
          '&[data-state=open]': { transform: 'rotate(180deg)' }
        })}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionComponentTrigger.displayName = 'AccordionTrigger'

const AccordionComponentContent = forwardRef<
  HTMLDivElement,
  AccordionPrimitive.AccordionContentProps
>(({ children, ...props }, forwardedRef) => (
  <AccordionPrimitive.Content
    className={css({
      overflow: 'hidden',
      '&[data-state="open"]': { animation: 'slideDown 150ms ease-in' },
      '&[data-state="closed"]': { animation: 'slideUp 150ms ease-out' }
    })}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </AccordionPrimitive.Content>
))
AccordionComponentContent.displayName = 'AccordionContent'

export const Accordion = {
  Root: AccordionComponentRoot,
  Item: AccordionComponentItem,
  Trigger: AccordionComponentTrigger,
  Content: AccordionComponentContent
}
