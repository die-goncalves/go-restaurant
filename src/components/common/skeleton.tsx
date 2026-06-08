import { HTMLAttributes } from 'react'
import { css, cx } from '@/styled-system/css'

const skeletonBase = css({
  position: 'relative',
  overflow: 'hidden',
  background: 'black.alpha.300',
  _after: {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundSize: '400% 100%',
    backgroundImage:
      'linear-gradient(90deg, #00000000 24%, var(--colors-black-alpha-300) 50%, #00000000 76%)',
    animationName: 'shimmer',
    animationDuration: '2s',
    animationIterationCount: 'infinite'
  }
})

export type SkeletonProps = HTMLAttributes<HTMLDivElement>
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(skeletonBase, className)}
      {...props}
    />
  )
}
