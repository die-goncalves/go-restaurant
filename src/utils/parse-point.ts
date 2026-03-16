export const parsePoint = (pointStr: string) => {
  if (!pointStr) return { lat: null, lng: null }
  const [lat, lng] = pointStr.replace(/[()]/g, '').split(',')
  return {
    lat: Number(lat),
    lng: Number(lng)
  }
}
