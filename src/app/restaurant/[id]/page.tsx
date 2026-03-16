export const dynamicParams = true

import { redirect } from 'next/navigation'
import { RestaurantClient } from './restaurant-client'
import { createStaticClient } from '@/src/lib/supabase/static'
import { createClient } from '@/src/lib/supabase/server'
import { parsePoint } from '@/src/utils/parse-point'
import { Tables } from '@/src/types/supabase'

type Rating = {
  id: string
  user_id: string
  stars: number
  comment: string | null
  created_at: string
}
export type Product = {
  id: string
  name: string
  description: string
  price_cents: number
  image_url: string
  is_available: boolean
  average_rating: number
  sections: string[]
  ratings: Rating[] | null
}

export type Store = Omit<
  Tables<'store_details_view'>,
  'coordinates' | 'products'
> & {
  coordinates: { lat: null; lng: null } | { lat: number; lng: number }
  products: Product[]
}

type RestaurantPageProps = {
  params: Promise<{ id: string }>
}
export async function generateMetadata({ params }: RestaurantPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('stores')
    .select('name')
    .eq('id', id)
    .single()

  return {
    title: data
      ? `Restaurante ${data.name} | GoRestaurant`
      : 'Restaurante | GoRestaurant'
  }
}

export async function generateStaticParams() {
  const supabase = await createStaticClient()
  const { data } = await supabase.from('stores').select('id')

  return (data ?? []).map(store => ({ id: store.id }))
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('store_details_view')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) redirect('/')

  const products = data.products as Product[]
  const store: Store = {
    id: data.id,
    name: data.name,
    phone_number: data.phone_number,
    coordinates: parsePoint(data.coordinates!),
    address: data.address,
    image_url: data.image_url,
    neighborhood: data.neighborhood,
    description: data.description,
    operating_hours: data.operating_hours,
    is_open: data.is_open,
    average_rating: data.average_rating,
    total_reviews: data.total_reviews,
    products: products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      image_url: p.image_url,
      price_cents: p.price_cents,
      sections: p.sections,
      ratings: p.ratings,
      average_rating: p.average_rating,
      is_available: p.is_available
    }))
  }
  return <RestaurantClient restaurant={store} />
}
