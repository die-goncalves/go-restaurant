export const dynamicParams = true

import { redirect } from 'next/navigation'
import { RestaurantClient } from './restaurant-client'
import { createStaticClient } from '@/src/lib/supabase/static'
import { createClient } from '@/src/lib/supabase/server'

type RestaurantPageProps = {
  params: Promise<{ id: string }>
}
export async function generateMetadata({ params }: RestaurantPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('restaurants')
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
  const { data } = await supabase.from('restaurants').select('id')

  return (data ?? []).map(restaurant => ({ id: restaurant.id }))
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('restaurants')
    .select(
      `
      *,
      foods (
        *,
        tag ( * ),
        food_rating ( * )
      ),
      operating_hours ( * )
    `
    )
    .eq('id', id)
    .single()

  if (!data) redirect('/')

  const restaurant = {
    id: data.id,
    name: data.name,
    phone_number: data.phone_number,
    coordinates: data.coordinates,
    address: data.address,
    image: data.image,
    place: data.place,
    description: data.description,
    operating_hours: data.operating_hours,
    foods: data.foods.map(food => ({
      id: food.id,
      restaurant_id: food.restaurant_id,
      name: food.name,
      price: food.price,
      image: food.image,
      description: food.description,
      tag: food.tag,
      stripe_food_id: food.stripe_food_id,
      stripe_price_id: food.stripe_price_id,
      food_rating: food.food_rating.map(fr => ({
        food_id: fr.food_id,
        customer_id: fr.customer_id,
        rating: fr.rating
      }))
    }))
  }

  return <RestaurantClient restaurant={restaurant} />
}
