'use client'

import { Portal } from '@zag-js/react'
import { useState } from 'react'
import { CloseIcon } from '@/src/components/icons/close'
import { ScheduleIcon } from '@/src/components/icons/schedule'
import { Button } from '@/src/components/ui/button'
import { Dialog } from '@/src/components/ui/dialog'
import { ScrollArea } from '@/src/components/ui/scroll-area'
import { Tables } from '@/src/types/supabase'
import { css } from '@/styled-system/css'

const WEEKDAYS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado'
]

type OperatingHour = {
  weekday: number
  end_hour: string
  start_hour: string
}

const formatHour = (time: string) => time.slice(0, 5)

function getActiveOrNextWeekday(hours: OperatingHour[]): number {
  const now = new Date()
  const currentWeekday = now.getDay()
  const currentTime = now.toTimeString().slice(0, 8)

  const todayOpen = hours.find(
    ({ weekday, start_hour, end_hour }) =>
      weekday === currentWeekday &&
      currentTime >= start_hour &&
      currentTime <= end_hour
  )
  if (todayOpen) return todayOpen.weekday

  const todayFuture = hours.find(
    ({ weekday, start_hour }) =>
      weekday === currentWeekday && currentTime < start_hour
  )
  if (todayFuture) return todayFuture.weekday

  for (let i = 1; i <= 7; i++) {
    const nextWeekday = (currentWeekday + i) % 7
    const next = hours.find(({ weekday }) => weekday === nextWeekday)
    if (next) return next.weekday
  }

  return -1
}

function isCurrentlyOpen(hours: OperatingHour[]): boolean {
  const now = new Date()
  const currentWeekday = now.getDay()
  const currentTime = now.toTimeString().slice(0, 8)

  return hours.some(
    ({ weekday, start_hour, end_hour }) =>
      weekday === currentWeekday &&
      currentTime >= start_hour &&
      currentTime <= end_hour
  )
}

function getStatusDescription(
  hours: OperatingHour[],
  activeWeekday: number,
  isOpenNow: boolean
): string {
  if (isOpenNow) {
    const today = hours.find(({ weekday }) => weekday === new Date().getDay())
    return `Aberto agora até ${formatHour(today!.end_hour)}`
  }

  const next = hours.find(({ weekday }) => weekday === activeWeekday)
  const isToday = activeWeekday === new Date().getDay()
  const dayName = isToday ? 'hoje' : WEEKDAYS[activeWeekday]
  return `Abre ${dayName} às ${formatHour(next!.start_hour)}`
}

type OperatingHours = {
  operatingHours: Tables<'store_details_view'>['operating_hours']
}
export function Opening({ operatingHours }: OperatingHours) {
  const [open, setOpen] = useState(false)
  const hours = Array.isArray(operatingHours)
    ? (operatingHours as OperatingHour[])
    : []

  const activeWeekday = getActiveOrNextWeekday(hours)
  const isOpenNow = isCurrentlyOpen(hours)

  return (
    <Dialog.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
      <Dialog.Trigger asChild>
        <Button
          variant="solid"
          icon={<ScheduleIcon />}
          iconPlacement="left"
          className={css({ paddingInlineStart: '2.5', gap: '4.5' })}
        >
          Horário de funcionamento
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {({ setOpen }) => (
              <>
                <header
                  className={css({
                    display: 'flex',
                    paddingBlockStart: { base: '4', medium: '6' },
                    paddingBlockEnd: '4',
                    paddingInline: { base: '4', medium: '6' },
                    alignItems: 'start',
                    justifyContent: 'space-between'
                  })}
                >
                  <Dialog.Title
                    as="h2"
                    className={css({
                      minHeight: '10',
                      justifySelf: 'center',
                      textStyle: 'xl',
                      paddingTop: 'calc((40px - 1.4em) / 2)'
                    })}
                  >
                    Horário de funcionamento
                  </Dialog.Title>

                  <Dialog.CloseTrigger asChild>
                    <Button className={css({ padding: 0 })}>
                      <CloseIcon />
                    </Button>
                  </Dialog.CloseTrigger>
                </header>
                <main
                  className={css({
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto'
                  })}
                >
                  <ScrollArea.Root size="md" variant="always">
                    <ScrollArea.Viewport>
                      <ScrollArea.Content
                        className={css({
                          display: 'flex',
                          flexDirection: 'column'
                        })}
                      >
                        <div
                          className={css({
                            paddingInline: { base: '4', medium: '6' }
                          })}
                        >
                          <Dialog.Description>
                            <p>
                              {getStatusDescription(
                                hours,
                                activeWeekday,
                                isOpenNow
                              )}
                            </p>
                          </Dialog.Description>

                          <table
                            className={css({
                              width: '100%',
                              borderCollapse: 'collapse'
                            })}
                          >
                            <colgroup>
                              <col className={css({ width: '50%' })} />
                              <col className={css({ width: '50%' })} />
                            </colgroup>
                            <thead>
                              <tr>
                                <th
                                  className={css({
                                    textAlign: 'left',
                                    height: '10'
                                  })}
                                >
                                  Dia
                                </th>
                                <th
                                  className={css({
                                    textAlign: 'left',
                                    height: '10'
                                  })}
                                >
                                  Horário
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {hours.map(
                                ({ weekday, start_hour, end_hour }) => (
                                  <tr
                                    key={weekday}
                                    style={{
                                      fontWeight:
                                        weekday === activeWeekday
                                          ? 'bold'
                                          : 'normal'
                                    }}
                                  >
                                    <td className={css({ height: '10' })}>
                                      {WEEKDAYS[weekday]}
                                    </td>
                                    <td className={css({ height: '10' })}>
                                      {formatHour(start_hour)} –{' '}
                                      {formatHour(end_hour)}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </ScrollArea.Content>
                    </ScrollArea.Viewport>

                    <ScrollArea.Scrollbar orientation="vertical">
                      <ScrollArea.Thumb orientation="vertical" />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Scrollbar orientation="horizontal">
                      <ScrollArea.Thumb orientation="horizontal" />
                    </ScrollArea.Scrollbar>

                    <ScrollArea.Corner />
                  </ScrollArea.Root>
                </main>
                <footer
                  className={css({
                    display: 'flex',
                    paddingBlockStart: '4',
                    paddingBlockEnd: { base: '4', medium: '6' },
                    paddingInline: { base: '4', medium: '6' },
                    flexDirection: 'column',
                    gap: '4'
                  })}
                >
                  <Button
                    variant="solid"
                    className={css({
                      marginLeft: 'auto',
                      width: { base: '100%', medium: 'fit-content' }
                    })}
                    onClick={() => setOpen(false)}
                  >
                    Fechar
                  </Button>
                </footer>
              </>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
