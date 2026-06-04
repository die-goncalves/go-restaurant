import { FeatureCollection, Point } from 'geojson'
import { Tables } from '@/src/types/supabase'
import { css } from '@/styled-system/css'
import { Map } from './map'
import { PartnerStores } from './partner-stores'
import { PartnerStoresProvider } from './partner-stores-context'

type PartnerStoresClientProps = {
  stores: Omit<Tables<'stores_ratings_summary'>, 'created_at'>[]
  geojson: FeatureCollection<Point, { id: string | null; name: string | null }>
}
export function PartnerStoresClient({
  stores,
  geojson
}: PartnerStoresClientProps) {
  return (
    <PartnerStoresProvider>
      <section
        data-scroll-container
        className={css({
          position: 'relative',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(1, minmax(0, 1fr))',
            expanded: 'repeat(2, minmax(0, 1fr))'
          },
          gridTemplateRows: {
            base: 'repeat(1, minmax(0, 1fr)) min-content',
            expanded: 'repeat(1, minmax(0, 1fr))'
          },
          gridGap: { base: '4', medium: '6', expanded: '8' }
        })}
      >
        <PartnerStores stores={stores} />

        <div
          data-map-container
          className={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(1, minmax(0, 1fr))'
          })}
        >
          <div
            className={css({
              position: { base: 'unset', expanded: 'sticky' },
              top: 0,
              height: '100dvh',
              gridColumnStart: 1,
              gridColumnEnd: 7,
              overflow: 'hidden'
            })}
          >
            <div
              className={css({
                position: 'relative',
                width: '100%',
                height: '100%'
              })}
            >
              {geojson && <Map geojson={geojson} />}
            </div>
          </div>
        </div>
      </section>
    </PartnerStoresProvider>
  )
}
