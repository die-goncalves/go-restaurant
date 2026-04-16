export const dynamicParams = true

import { redirect } from 'next/navigation'
import { logger } from '@/src/lib/logger'
import { createClient } from '@/src/lib/supabase/server'
import { createStaticClient } from '@/src/lib/supabase/static'
import { Tables } from '@/src/types/supabase'
import { parsePoint } from '@/src/utils/parse-point'
import { StoreContent } from './_components/store-content'

const log = logger.child({
  module: 'server',
  route: '/store/[id]'
})

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

export type Categories = {
  id: string
  name: string
  slug: string
}

export type Store = Omit<
  Tables<'store_details_view'>,
  'coordinates' | 'products' | 'categories'
> & {
  categories: Categories[]
  coordinates: {
    lat: number
    lng: number
  } | null
  products: Product[]
}

type StorePageProps = {
  params: Promise<{ id: string }>
}
export async function generateMetadata({ params }: StorePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('stores')
    .select('name')
    .eq('id', id)
    .single()

  return {
    title: data ? `Loja ${data.name} | GoRestaurant` : 'Loja | GoRestaurant'
  }
}

export async function generateStaticParams() {
  const supabase = await createStaticClient()
  const { data } = await supabase.from('stores').select('id')
  return (data ?? []).map(store => ({ id: store.id }))
}

export default async function StorePage({ params }: StorePageProps) {
  const reqLog = log.child({ id: crypto.randomUUID() })
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('store_details_view')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    reqLog.error({ error }, 'Error fetching store data')
  }

  if (!data) {
    reqLog.warn({ storeId: id }, 'Store not found')
    redirect('/')
  }

  const products = data.products as Product[]
  const store: Store = {
    id: data.id,
    name: data.name,
    phone_number: data.phone_number,
    coordinates: parsePoint(data.coordinates),
    categories: data.categories as Categories[],
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

  return <StoreContent store={store} />
}
