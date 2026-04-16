export const getStarColor = (rating: number | null) => {
  if (!rating) return 'var(--colors-black-alpha-400)'
  if (rating < 1) return 'var(--colors-star-terrible)'
  if (rating < 2) return 'var(--colors-star-bad)'
  if (rating < 3) return 'var(--colors-star-ok)'
  if (rating < 4) return 'var(--colors-star-good)'
  return 'var(--colors-star-excellent)'
}
