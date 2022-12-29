export type TGeographicFeatureWithCoordinates = {
  coordinates: {
    latitude: number
    longitude: number
  }
  geohash: string
  place_name: string | undefined
  granular: { id: string; text: string } | undefined
  place: string | undefined
}

export type TFeature = {
  place_name: string
  geometry: {
    coordinates: Array<number>
  }
  context: Array<{ id: string; text: string }>
}

export type TFeaturesCollection = {
  features: Array<TFeature>
}
