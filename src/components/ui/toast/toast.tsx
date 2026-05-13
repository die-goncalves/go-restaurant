'use client'

import { mergeProps, normalizeProps, Portal, useMachine } from '@zag-js/react'
import * as toast from '@zag-js/toast'
import { ComponentPropsWithoutRef, forwardRef, useId, useMemo } from 'react'
import { anatomyPart as parts } from '@/src/theme/recipes/toast'
import { css, cx } from '@/styled-system/css'
import { toast as toastRecipe } from '@/styled-system/recipes/toast'
import { CheckCircleIcon } from '../../icons/check-circle'
import { CloseIcon } from '../../icons/close'
import { ErrorIcon } from '../../icons/error'
import { InfoIcon } from '../../icons/info'
import { ProgressActivityIcon } from '../../icons/progress-activity'
import { WarningIcon } from '../../icons/warning'
import { Button } from '../button'

export const toaster = toast.createStore({
  max: 4,
  overlap: true,
  placement: 'top-end',
  pauseOnPageIdle: true
})

type ToastProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  toast: Partial<toast.Props>
}
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ toast: toastProps, ...props }, forwardedRef) => {
    const service = useMachine(toast.machine, { ...toastProps })
    const api = toast.connect(service, normalizeProps)

    const style = toastRecipe({})

    const { className, ...mergedProps } = mergeProps(api.getRootProps(), props)
    const mergedClassName = cx(style, className)

    const indicator = useMemo(() => {
      if (!api.type) return null
      return (
        <span {...parts.indicator.attrs} aria-hidden="true">
          {api.type === 'error' ? (
            <ErrorIcon />
          ) : api.type === 'info' ? (
            <InfoIcon />
          ) : api.type === 'success' ? (
            <CheckCircleIcon />
          ) : api.type === 'warning' ? (
            <WarningIcon />
          ) : (
            <ProgressActivityIcon />
          )}
        </span>
      )
    }, [api.type])

    return (
      <div {...mergedProps} className={mergedClassName} ref={forwardedRef}>
        <div {...api.getGhostBeforeProps()} />
        <div>
          {api.title && (
            <h3 {...api.getTitleProps()}>
              {indicator}
              {api.title}
            </h3>
          )}
          {api.description && (
            <p
              {...api.getDescriptionProps()}
              {...(!api.title && { 'data-no-title': '' })}
            >
              {!api.title && indicator}
              {api.description}
            </p>
          )}
        </div>
        {api.closable && (
          <Button
            {...api.getCloseTriggerProps()}
            aria-label="Fechar notificação"
            className={css({ padding: 0 })}
          >
            <CloseIcon />
          </Button>
        )}
        <div {...api.getGhostAfterProps()} />
      </div>
    )
  }
)
Toast.displayName = 'Toast'

export function Toaster() {
  const service = useMachine(toast.group.machine, {
    id: useId(),
    store: toaster
  })
  const api = toast.group.connect(service, normalizeProps)

  return (
    <Portal>
      <div {...api.getGroupProps()}>
        {api.getToasts().map((toast, index) => (
          <Toast key={toast.id} toast={{ ...toast, parent: service, index }} />
        ))}
      </div>
    </Portal>
  )
}
