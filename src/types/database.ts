export type TRestaurant = {
  id: string
  name: string
  phone_number: string
  coordinates: { lat: number; lng: number }
  address: string
  image: string
  place: string
  description: string
  created_at: string
  updated_at: string
}

export type TFoods = {
  id: string
  restaurant_id: string
  tag_id: string
  name: string
  price: number
  image: string
  description: string
  stripe_food_id: string
  stripe_price_id: string
  created_at: string
  updated_at: string
}

export type TFoodRating = {
  food_id: string
  customer_id: string
  rating: number
  created_at: string
  updated_at: string
}

export type TOperatingHours = {
  id: string
  restaurant_id: string
  weekday: string
  start_hour: string
  end_hour: string
}

export type TOrder = {
  id: string
  customer_id: string
  payment_intent_id: string | null
  payment_status: string | null
  status: string | null
  line_items:
    | {
        food_id: string
        quantity: number
      }[]
    | null
  shipping_options: {
    shipping_amount: number
    shipping_rate: string
    shipping_address: string
    shipping_geohash: string
  } | null
  created_at: string
  expires_at: string
  updated_at: string | null
}

export type TTag = {
  id: string
  name: string
  created_at: string
  updated_at: string
}
