import { StarIcon } from '@/src/components/icons/star'
import { getStarColor } from '@/src/utils/get-star-color'
import { css } from '@/styled-system/css'

const formatReview = (review: number | null): string => {
  if (!review || review <= 0 || isNaN(review)) return 'Sem avaliações'
  if (review === 1) return 'Uma avaliação'

  const magnitude = Math.pow(10, Math.floor(Math.log10(review)))
  const rounded = Math.floor(review / magnitude) * magnitude
  return `(${rounded}+ avaliações)`
}

export function StoreRating({
  averageRating,
  totalReviews
}: {
  averageRating: number | null
  totalReviews: number | null
}) {
  return (
    <div
      className={css({
        display: 'inline-flex',
        gap: '0.25em'
      })}
    >
      <span
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0
        })}
      >
        <StarIcon
          style={{ fill: getStarColor(averageRating) }}
          className={css({
            width: '5',
            height: '5'
          })}
        />
      </span>
      {totalReviews && totalReviews > 0 && <span>{averageRating}</span>}
      <span>{formatReview(totalReviews)}</span>
    </div>
  )
}
