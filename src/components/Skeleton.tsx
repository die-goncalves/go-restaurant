import { HTMLAttributes } from 'react'
import clsx from 'clsx'

export type SkeletonProps = HTMLAttributes<HTMLDivElement>
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-light-gray-200',
        "after:content-[''] after:absolute after:inset-0 after:bg-skeleton after:opacity-10 after:animate-shimmer",
        className
      )}
      {...props}
    />
  )
}
