import { ComponentProps } from 'react'

export function ArrowOutwardIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      fill="currentColor"
      {...props}
    >
      <path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z" />
    </svg>
  )
}
