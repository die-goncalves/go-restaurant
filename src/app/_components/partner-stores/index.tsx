import { Feature, FeatureCollection, Point } from 'geojson'
import { createClient } from '@/src/lib/supabase/server'
import { parsePoint } from '@/src/utils/parse-point'
import { PartnerStoresClient } from './partner-stores-client'

export type StoreFeature = Feature<
  Point,
  { id: string | null; name: string | null }
>
export type StoreFeatureCollection = FeatureCollection<
  Point,
  { id: string | null; name: string | null }
>

export async function PartnerStores() {
  const supabase = await createClient()

  const { data: stores } = await supabase
    .from('stores_ratings_summary')
    .select(
      'id, name, description, image_url, coordinates, neighborhood, average_rating, total_reviews, categories'
    )
    .order('created_at', { ascending: true })

  const features: StoreFeature[] = []
  for (const s of stores ?? []) {
    const point = parsePoint(s.coordinates)
    if (!point) continue

    features.push({
      type: 'Feature',
      properties: {
        id: s.id,
        name: s.name
      },
      geometry: {
        type: 'Point',
        coordinates: [point.lng, point.lat]
      }
    })
  }
  const geojson: StoreFeatureCollection = {
    type: 'FeatureCollection',
    features
  }

  return <PartnerStoresClient stores={stores ?? []} geojson={geojson} />
}
