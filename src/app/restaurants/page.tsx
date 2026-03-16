import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import { decodeGeohash } from '@/src/utils/geohash'
import { RestaurantsClient } from './restaurants-client'

type RestaurantsPageProps = {
  searchParams: Promise<{ place?: string; geohash?: string }>
}

export async function generateMetadata({ searchParams }: RestaurantsPageProps) {
  const { place } = await searchParams
  return {
    title: place
      ? `Restaurantes em ${place} | GoRestaurant`
      : 'Restaurantes | GoRestaurant'
  }
}

export default async function RestaurantsPage({
  searchParams
}: RestaurantsPageProps) {
  const { place, geohash } = await searchParams

  if (!place || !geohash) redirect('/')

  const supabase = await createClient()

  const { data } = await supabase.rpc('get_categories_by_neighborhood', {
    p_neighborhood: place
  })

  const categories = data ?? []
  const { longitude: lng, latitude: lat } = decodeGeohash(geohash)

  return (
    <RestaurantsClient
      place={place}
      geohash={geohash}
      coordinates={{ lng, lat }}
      categories={categories}
    />
  )
}
