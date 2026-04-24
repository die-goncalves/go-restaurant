'use client'

import { useFilter } from '@/src/contexts/filter-context'
import { usePosition } from '@/src/contexts/position-context'
import { css } from '@/styled-system/css'

const DELIVERY_MODE_LABEL = {
  delivery: 'Entregas em',
  pickup: 'Retiradas em'
} as const

export function DeliveryPositionHeader() {
  const { state: filter } = useFilter()
  const { state: position } = usePosition()

  const modeLabel =
    DELIVERY_MODE_LABEL[filter.deliveryMode] ?? DELIVERY_MODE_LABEL.delivery
  const place = position.currentPosition?.place

  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        fontSize: 'xl'
      })}
    >
      <p>{modeLabel}</p>
      &nbsp;
      <strong>{place}</strong>
    </div>
  )
}
