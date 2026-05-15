import {
  type Api,
  connect,
  Machine,
  machine,
  type Props
} from '@zag-js/async-list'
import { useMachine } from '@zag-js/react'

export function useAsyncList<T, C = string>(props: Props<T, C>): Api<T, C> {
  const service = useMachine(machine as Machine<T, C>, props)
  return connect(service)
}
