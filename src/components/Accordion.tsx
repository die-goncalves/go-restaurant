import clsx from 'clsx'
import { forwardRef } from 'react'
import { CaretDown } from 'phosphor-react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'

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
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={clsx(
        'flex flex-1 group h-10 items-center justify-between py-2 px-4 bg-light-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-light-indigo-300',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <CaretDown className="w-6 h-6 group-data-[state=open]:rotate-180 transition-[transform] duration-150 ease-in" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionComponentTrigger.displayName = 'AccordionTrigger'

const AccordionComponentContent = forwardRef<
  HTMLDivElement,
  AccordionPrimitive.AccordionContentProps
>(({ children, ...props }, forwardedRef) => (
  <AccordionPrimitive.Content
    className="overflow-hidden data-[state=open]:animate-[slideDown_150ms_ease-in] data-[state=closed]:animate-[slideUp_150ms_ease-out]"
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
