import { TFeature } from '../types'

export function geographicInformation(feature: TFeature): {
  place_name: string | undefined
  granular: { id: string; text: string } | undefined
  place: string | undefined
} {
  const typeFeatureContext = [
    'address',
    'neighborhood',
    'locality',
    'place',
    'district',
    'postcode',
    'region',
    'country'
  ]

  const dataTypesAvailable = typeFeatureContext.map(type => {
    const separate_types = feature.context.find(ctx => ctx.id.includes(type))
    if (separate_types) {
      return { id: type, text: separate_types.text }
    } else return undefined
  })

  return {
    place_name: feature.place_name,
    granular: dataTypesAvailable.find(type => type),
    place: dataTypesAvailable[3] ? dataTypesAvailable[3].text : undefined
  }
}
