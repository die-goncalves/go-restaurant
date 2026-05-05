'use client'

import * as scrollArea from '@zag-js/scroll-area'
import { type PropTypes, normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'

export const useScrollArea = (
  props?: Partial<scrollArea.Props>
): scrollArea.Api<PropTypes> => {
  const machineProps: scrollArea.Props = {
    id: useId(),
    ...(props ? props : {})
  }

  const service = useMachine(scrollArea.machine, machineProps)
  return scrollArea.connect(service, normalizeProps)
}
