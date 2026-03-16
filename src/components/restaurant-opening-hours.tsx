'use client'

import { useCallback, useMemo, useState } from 'react'
import { X } from 'phosphor-react'
import { TOperatingHours } from '../types'
import { Dialog } from './dialog'
import { css, cx } from '@/styled-system/css'

const WEEKDAY_LABELS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
]

type HourEntry = {
  start_hour: string
  end_hour: string
  weekday: number
}

function orderHours(operating_hours: HourEntry[]) {
  const separateDaysOfTheWeek = operating_hours.reduce<
    Record<number, HourEntry[]>
  >(
    (acc, element) => {
      const idx = element.weekday
      const sorted = [...acc[idx], element].sort((a, b) =>
        a.start_hour.localeCompare(b.start_hour)
      )
      return { ...acc, [idx]: sorted }
    },
    { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
  )
  return { separateDaysOfTheWeek }
}

function getCurrentOrNext(schedule: Record<number, HourEntry[]>) {
  const now = new Date()
  const currentDay = now.getDay()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  function toMinutes(time: string) {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  const todaySlots = schedule[currentDay] || []
  for (const slot of todaySlots) {
    const start = toMinutes(slot.start_hour)
    const end = toMinutes(slot.end_hour)

    if (currentMinutes >= start && currentMinutes <= end) {
      return { type: 'current', slot }
    }
  }

  let closest = null
  let minDiff = Infinity
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const day = (currentDay + dayOffset) % 7
    const slots = schedule[day] || []

    for (const slot of slots) {
      const start = toMinutes(slot.start_hour)

      const diffDays = dayOffset
      let diffMinutes = start - currentMinutes

      if (dayOffset > 0) {
        diffMinutes = diffDays * 1440 + start - currentMinutes
      }

      if (diffMinutes > 0 && diffMinutes < minDiff) {
        minDiff = diffMinutes
        closest = slot
      }
    }
  }

  return closest ? { type: 'next', slot: closest } : null
}

type RestaurantOpeningHoursProps = {
  operatingHours: Array<Omit<TOperatingHours, 'restaurant_id'>>
  isRestaurantOpen:
    | { open: boolean; for_coming?: any; current?: any }
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
    () => Math.max(...Object.values(hours).map(day => day.length)),
    [hours]
  )
  const result = useMemo(() => getCurrentOrNext(hours), [hours])

  const getCellBg = useCallback(
    (colIndex: number, rowIndex: number) => {
      const entry = hours[colIndex][rowIndex]
      if (!entry) return ''
      if (entry.weekday === result?.slot.weekday) {
        if (
          entry.start_hour === result.slot.start_hour &&
          entry.end_hour === result.slot.end_hour
        ) {
          if (result.type === 'next') return 'light.orange.200'
          if (result.type === 'current') return 'light.green.200'
        }
      }
      return ''
    },
    [hours, result]
  )

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button
          title={
            isRestaurantOpen ? 'Restaurante aberto' : 'Restaurante fechado'
          }
          className={css({
            p: '2',
            bg: 'light.gray.100',
            alignSelf: 'flex-start',
            rounded: 'full',
            transition: 'background-color 150ms ease-in',
            outline: 'none',
            '&:not(:disabled):hover': { bg: 'light.gray.200' },
            _focus: {
              outlineStyle: 'solid',
              outlineWidth: '2',
              outlineOffset: '2',
              outlineColor: 'light.indigo.300'
            }
          })}
        >
          <span
            className={css({
              position: 'relative',
              display: 'flex',
              h: '6',
              w: '6'
            })}
          >
            {isRestaurantOpen ? (
              <span
                className={css({
                  position: 'relative',
                  m: 'auto',
                  rounded: 'full',
                  h: '3',
                  w: '3',
                  bg: 'light.green.500',
                  _after: {
                    content: '""',
                    position: 'absolute',
                    inset: '0',
                    rounded: 'full',
                    animation: 'ping',
                    opacity: '0.75',
                    bg: 'light.green.400'
                  }
                })}
              />
            ) : (
              <span
                className={css({
                  position: 'relative',
                  m: 'auto',
                  rounded: 'full',
                  h: '3',
                  w: '3',
                  bg: 'light.red.500'
                })}
              />
            )}
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Content
        onCloseInteractOverlay={() => setOpen(false)}
        className={cx(
          css({
            display: 'flex',
            flexDirection: 'column',
            w: 'calc(100vw - 2rem)',
            sm: { w: '2/3' },
            lg: { w: '1/2' },
            xl: { w: '2/5' }
          })
        )}
      >
        <header
          className={css({
            display: 'flex',
            gap: '4',
            p: '4',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            sm: { alignItems: 'center' }
          })}
        >
          <Dialog.Title>
            <p className={css({ fontSize: 'xl', fontWeight: 'medium' })}>
              Horário de funcionamento do restaurante
            </p>
          </Dialog.Title>

          <Dialog.Close>
            <button
              className={css({
                p: '2',
                rounded: 'sm',
                bg: 'light.gray.200',
                transition: 'background-color 150ms ease-in',
                outline: 'none',
                '&:not(:disabled):hover': { bg: 'light.gray.300' },
                _focus: {
                  outlineStyle: 'solid',
                  outlineWidth: '2',
                  outlineOffset: '2',
                  outlineColor: 'light.indigo.300'
                }
              })}
            >
              <X className={css({ w: '6', h: '6' })} />
            </button>
          </Dialog.Close>
        </header>

        <main
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '4',
            xs: { p: '4' }
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              bg: 'light.gray.200',
              rounded: 'sm',
              p: '2'
            })}
          >
            {[
              { color: 'light.green.200', label: 'Restaurante aberto' },
              {
                color: 'light.orange.200',
                label: 'Próximo horário de funcionamento do restaurante'
              }
            ].map(({ color, label }) => (
              <div
                key={label}
                className={css({ display: 'flex', alignItems: 'center' })}
              >
                <div
                  className={css({
                    flexShrink: '0',
                    w: '4',
                    h: '4',
                    bg: color,
                    mr: '2'
                  })}
                />
                {label}
              </div>
            ))}
          </div>

          <div
            className={css({
              display: 'flex',
              w: 'full',
              overflow: 'auto',
              pb: '4'
            })}
          >
            <table>
              <thead>
                <tr className={css({ bg: 'light.gray.200', rounded: 'sm' })}>
                  {WEEKDAY_LABELS.map(d => (
                    <th
                      key={`tr-th-${d}`}
                      className={css({
                        fontWeight: 'medium',
                        whiteSpace: 'nowrap',
                        px: '2'
                      })}
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxHours }).map((_, rowIndex) => (
                  <tr
                    key={`tbody-tr-${rowIndex}`}
                    className={css({ gap: '2' })}
                  >
                    {Array.from({ length: 7 }).map((_, colIndex) => {
                      const bg = getCellBg(colIndex, rowIndex)
                      const entry = hours[colIndex][rowIndex]
                      return (
                        <td
                          key={colIndex}
                          className={css({
                            p: '2',
                            rounded: 'sm',
                            ...(bg ? { bg } : {})
                          })}
                        >
                          {entry && (
                            <span className={css({ whiteSpace: 'nowrap' })}>
                              {entry.start_hour} – {entry.end_hour}
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </Dialog.Content>
    </Dialog.Root>
  )
}
