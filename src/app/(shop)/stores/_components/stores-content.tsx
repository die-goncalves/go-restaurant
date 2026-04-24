import { css } from '@/styled-system/css'
import { Data } from '../page'
import { DeliveryPositionHeader } from './delivery-position-header'
import { FilterChips } from './filter-chips'
import { PositionSync } from './position-sync'
import { Sidebar } from './sidebar'
import { SidebarCompact } from './sidebar-compact'
import { StoreGrid } from './store-grid'

export function StoresContent({ place, coordinates, categories }: Data) {
  return (
    <>
      <PositionSync />
      <div
        className={css({
          position: 'relative',
          maxWidth: 'breakpoint-xlarge',
          marginInline: 'auto',
          minHeight: '100dvh'
        })}
      >
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: 'repeat(1, minmax(0, 1fr))',
              expanded: 'min-content repeat(1, minmax(0, 1fr))'
            },
            gridTemplateRows: 'repeat(1, minmax(0, 1fr))',
            paddingInline: { base: '4', medium: '6', expanded: '8' },
            gridColumnGap: { base: '4', medium: '6', expanded: '8' }
          })}
        >
          <div
            className={css({ display: { base: 'unset', expanded: 'none' } })}
          >
            <DeliveryPositionHeader />
            <SidebarCompact categories={categories} />
          </div>

          <div
            className={css({ display: { base: 'none', expanded: 'unset' } })}
          >
            <Sidebar categories={categories} />
          </div>

          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '4'
            })}
          >
            <div
              className={css({ display: { base: 'none', expanded: 'unset' } })}
            >
              <DeliveryPositionHeader />
            </div>

            <FilterChips />

            <div
              className={css({
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: {
                  base: 'repeat(1, minmax(0, 1fr))',
                  medium: 'repeat(2, minmax(0, 1fr))',
                  large: 'repeat(3, minmax(0, 1fr))',
                  xlarge: 'repeat(4, minmax(0, 1fr))'
                },
                gridAutoRows: 'minmax(0, 1fr)',
                alignItems: 'start',
                gridGap: '4'
              })}
            >
              <StoreGrid
                fallbackPlace={place}
                fallbackCoordinates={coordinates}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
