import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/server'
import { Database } from '@/src/types/supabase'
import { decodeGeohash } from '@/src/utils/geohash'
import { StoresContent } from './_components/stores-content'

export type Data = {
  place?: string
  coordinates: { lng: number; lat: number }
  categories: Database['public']['Functions']['get_categories_by_neighborhood']['Returns']
}

type StoresPageProps = {
  searchParams: Promise<{ place?: string; geohash?: string }>
}

export async function generateMetadata({ searchParams }: StoresPageProps) {
  const { place } = await searchParams
  return {
    title: place ? `Lojas em ${place} | GoRestaurant` : 'Lojas | GoRestaurant'
  }
}

export default async function StoresPage({ searchParams }: StoresPageProps) {
  const { place, geohash } = await searchParams

  if (!place || !geohash) redirect('/')

  const supabase = await createClient()

  const result = await supabase.rpc('get_categories_by_neighborhood', {
    p_neighborhood: place
  })

  const categories = result.data ?? []
  const { longitude: lng, latitude: lat } = decodeGeohash(geohash)

  const data: Data = {
    place,
    coordinates: { lng, lat },
    categories
  }
  return (
    <StoresContent
      place={data.place}
      coordinates={data.coordinates}
      categories={data.categories}
    />
  )
}
