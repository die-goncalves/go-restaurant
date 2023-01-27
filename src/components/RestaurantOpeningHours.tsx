import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { X } from 'phosphor-react'
import { TOperatingHours } from '../types'
import { Dialog } from './Dialog'

const WEEKDAYS = new Map([
  ['Sunday', 0],
  ['Monday', 1],
  ['Tuesday', 2],
  ['Wednesday', 3],
  ['Thursday', 4],
  ['Friday', 5],
  ['Saturday', 6]
])

function orderHours(
  operating_hours: Array<{
    id: string
    start_hour: string
    end_hour: string
    weekday: string
  }>
) {
  const separateDaysOfTheWeek = operating_hours.reduce<
    Record<
      number,
      Array<{
        id: string
        start_hour: string
        end_hour: string
        weekday: string
      }>
    >
  >(
    (acc, element) => {
      const indexDay = WEEKDAYS.get(element.weekday) as number

      const day = acc[indexDay]
      const newElement = [...day, element]
      newElement.sort(function (a, b) {
        if (a.start_hour > b.start_hour) return 1
        if (a.start_hour < b.start_hour) return -1
        return 0
      })
      return {
        ...acc,
        [indexDay]: newElement
      }
    },
    { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
  )

  return { separateDaysOfTheWeek }
}

type RestaurantOpeningHoursProps = {
  operatingHours: Array<Omit<TOperatingHours, 'restaurant_id'>>
  isRestaurantOpen:
    | {
        open: boolean
        for_coming?: any
        current?: any
      }
    | undefined
}
export function RestaurantOpeningHours({
  operatingHours,
  isRestaurantOpen
}: RestaurantOpeningHoursProps) {
  const [open, setOpen] = useState(false)

  const { separateDaysOfTheWeek: hours } = useMemo(
    () => orderHours(operatingHours),
    [operatingHours]
  )

  const maxHours = useMemo(
    () => Math.max(...Object.entries(hours).map(day => (day ? day.length : 0))),
    [hours]
  )

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button
          className={clsx(
            'p-2 bg-light-gray-100 [&:not(:disabled):hover]:bg-light-gray-200 self-start rounded-full',
            'transition-[background-color, outline] ease-in duration-150',
            'outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
          )}
          title={
            isRestaurantOpen ? 'Restaurante aberto' : 'Restaurante fechado'
          }
        >
          <span className="relative flex h-6 w-6">
            {isRestaurantOpen?.open ? (
              <span className="relative m-auto rounded-full h-3 w-3 bg-light-green-500 after:absolute after:content-[''] after:inset-0 after:rounded-full after:animate-ping after:opacity-75 after:bg-light-green-400" />
            ) : (
              <span className="relative m-auto rounded-full h-3 w-3 bg-light-red-500" />
            )}
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Content
        className={clsx(
          'xl:w-2/5',
          'lg:w-1/2',
          'sm:w-2/3',
          'flex flex-col w-[calc(100vw-2rem)]'
        )}
        onCloseInteractOverlay={() => setOpen(false)}
      >
        <header
          className={clsx(
            'flex gap-4 p-4 justify-between',
            'sm:items-center',
            'items-start'
          )}
        >
          <p className="text-xl font-medium">
            Horário de funcionamento do restaurante
          </p>
          <Dialog.Close>
            <button
              className={clsx(
                'p-2 rounded bg-light-gray-200 [&:not(:disabled):hover]:bg-light-gray-300',
                'transition-[background-color] ease-in duration-150',
                'focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-light-indigo-300'
              )}
            >
              <X className="w-6 h-6" />
            </button>
          </Dialog.Close>
        </header>

        <main className={clsx('flex flex-col gap-4', 'xs:p-4')}>
          <div className="flex flex-col bg-light-gray-200 rounded p-2">
            <div className="flex items-center">
              <div className="flex-none w-4 h-4 bg-light-green-200 mr-2" />
              Restaurante aberto
            </div>
            <div className="flex items-center">
              <div className="flex-none w-4 h-4 bg-light-orange-200 mr-2" />
              Próximo horário de funcionamento do restaurante
            </div>
          </div>
          <div className={clsx('flex w-full overflow-auto pb-4')}>
            <table>
              <thead>
                <tr className="bg-light-gray-200 rounded">
                  {[
                    'Domingo',
                    'Segunda-feira',
                    'Terça-feira',
                    'Quarta-feira',
                    'Quinta-feira',
                    'Sexta-feira',
                    'Sábado'
                  ].map(d => {
                    return (
                      <th
                        key={`tr-th-${d}`}
                        className="font-medium whitespace-nowrap px-2"
                      >
                        {d}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxHours }).map((_, indexLength) => {
                  return (
                    <tr key={`tbody-tr-${indexLength}`} className="gap-2">
                      {Array.from({ length: 7 }).map((_, index) => {
                        return (
                          <td
                            key={index}
                            className={clsx(
                              'p-2 rounded',
                              isRestaurantOpen?.open &&
                                isRestaurantOpen.current.id ===
                                  hours[index][indexLength]?.id
                                ? 'bg-light-green-200'
                                : isRestaurantOpen?.open === false &&
                                  isRestaurantOpen.for_coming.id ===
                                    hours[index][indexLength]?.id
                                ? 'bg-light-orange-200'
                                : ''
                            )}
                          >
                            {hours[index][indexLength] && (
                              <span className="whitespace-nowrap">
                                {hours[index][indexLength].start_hour} -{' '}
                                {hours[index][indexLength].end_hour}
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </main>
      </Dialog.Content>
    </Dialog.Root>
  )
}
