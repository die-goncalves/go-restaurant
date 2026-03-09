import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import { tagListingForFiltering } from '@/src/utils/tags'
import { decodeGeohash } from '@/src/utils/geohash'
import { RestaurantsClient } from './restaurants-client'

export async function generateMetadata({ searchParams }: RestaurantsPageProps) {
  const { place } = await searchParams
  return {
    title: place
      ? `Restaurantes em ${place} | GoRestaurant`
      : 'Restaurantes | GoRestaurant'
  }
}

type RestaurantsPageProps = {
  searchParams: Promise<{ place?: string; geohash?: string }>
}
export default async function RestaurantsPage({
  searchParams
}: RestaurantsPageProps) {
  const { place, geohash } = await searchParams

  if (!place || !geohash) redirect('/')

  const supabase = await createClient()

  const { data } = await supabase
    .from('restaurants')
    .select('foods ( tag ( * ) )')
    .filter('place', 'eq', place)

  const tags = data ? tagListingForFiltering(data) : []
  const { longitude: lng, latitude: lat } = decodeGeohash(geohash)

  return (
    <RestaurantsClient
      place={place}
      geohash={geohash}
      coordinates={{ lng, lat }}
      tags={tags}
    />
  )
}
