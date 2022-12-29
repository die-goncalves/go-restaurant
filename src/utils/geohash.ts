import { encode, decode } from 'ngeohash'

export function encodeGeohash(coord: { latitude: number; longitude: number }) {
  return encode(coord.latitude, coord.longitude, 15)
}

export function decodeGeohash(geo: string) {
  return decode(geo)
}
