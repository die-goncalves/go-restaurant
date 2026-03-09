import { HTMLAttributes } from 'react'
import { css, cx } from '@/styled-system/css'

const skeletonBase = css({
  position: 'relative',
  overflow: 'hidden',
  bg: 'light.gray.200',
  _after: {
    content: '""',
    position: 'absolute',
    inset: '0',
    backgroundImage:
      'linear-gradient(90deg, #00000000 0%, #00000033 20%, #00000099 60%, #00000000 100%)',
    opacity: '0.1',
    animation: 'shimmer'
  }
})

export type SkeletonProps = HTMLAttributes<HTMLDivElement>
export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cx(skeletonBase, className)} {...props} />
}
