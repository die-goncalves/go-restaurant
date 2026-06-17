'use client'

import { createMachine, Scope } from '@zag-js/core'
import { getComputedStyle, isHTMLElement, raf } from '@zag-js/dom-query'
import { getPlacement, Placement } from '@zag-js/popper'
import { normalizeProps, type PropTypes, useMachine } from '@zag-js/react'
import * as tour from '@zag-js/tour'
import { useId } from 'react'

type Point = {
  x: number
  y: number
}
type Size = {
  width: number
  height: number
}
type Rect = Point & Size

function offset(r: Rect, i: Point): Rect {
  const dx = i.x || 0
  const dy = i.y || 0
  return {
    x: r.x - dx,
    y: r.y - dy,
    width: r.width + dx + dx,
    height: r.height + dy + dy
  }
}

function getContentId(ctx: Scope): string {
  return ctx.ids?.content ?? `tour-content-${ctx.id}`
}
function getContentEl(ctx: Scope): HTMLElement | null {
  return ctx.getById(getContentId(ctx))
}
function getPositionerId(ctx: Scope): string {
  return ctx.ids?.positioner ?? `tour-positioner-${ctx.id}`
}
function getPositionerEl(ctx: Scope): HTMLElement | null {
  return ctx.getById(getPositionerId(ctx))
}
function getBackdropId(ctx: Scope): string {
  return ctx.ids?.backdrop ?? `tour-backdrop-${ctx.id}`
}
function getBackdropEl(ctx: Scope): HTMLElement | null {
  return ctx.getById(getBackdropId(ctx))
}
function syncZIndex(scope: Scope) {
  return raf(() => {
    const contentEl = getContentEl(scope)
    if (!contentEl) return
    const styles = getComputedStyle(contentEl)
    const positionerEl = getPositionerEl(scope)
    const backdropEl = getBackdropEl(scope)
    if (positionerEl) {
      positionerEl.style.setProperty('--z-index', styles.zIndex)
      positionerEl.style.setProperty('z-index', 'var(--z-index)')
    }
    if (backdropEl) {
      backdropEl.style.setProperty('--z-index', styles.zIndex)
    }
  })
}

export const useTour = (props?: Partial<tour.Props>): tour.Api<PropTypes> => {
  const machineProps: tour.Props = {
    id: useId(),
    ...(props ? props : {})
  }

  const machine = createMachine({
    ...tour.machine,
    implementations: {
      ...tour.machine.implementations,
      effects: {
        ...tour.machine.implementations?.effects,
        trackPlacement({ context, computed, scope, prop }) {
          const step = computed('step')
          if (step == null) return
          context.set('currentPlacement', step.placement ?? 'bottom')
          if (step?.type === 'dialog') {
            return syncZIndex(scope)
          }
          if (!(step?.type === 'tooltip')) {
            return
          }
          const positionerEl = () => getPositionerEl(scope)
          return getPlacement(context.get('resolvedTarget'), positionerEl, {
            defer: true,
            placement: (step.placement as Placement | undefined) ?? 'bottom',
            strategy: 'fixed',
            gutter: step.gutter ?? 16,
            overflowPadding: step.overflowPadding ?? 16,
            offset: step.offset,
            restoreStyles: true,
            getAnchorRect(el) {
              if (!isHTMLElement(el)) return null
              const rect = el.getBoundingClientRect()
              return offset(rect, prop('spotlightOffset'))
            },
            onComplete(data) {
              const { rects } = data.middlewareData
              context.set('currentPlacement', data.placement)
              context.set('targetRect', rects.reference)
            }
          })
        }
      }
    }
  })
  const service = useMachine(machine, machineProps)

  return tour.connect(service, normalizeProps)
}
